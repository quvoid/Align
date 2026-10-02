/**
 * Loads the built-in brief catalogue (INITIAL_BRANDS in
 * apps/web/src/lib/mock-data.ts) into the Brand table.
 *
 * Public pages read briefs from the database now, and a pitch or a like needs
 * a real Brand row to point at, so an empty Brand table means an empty
 * /brands page. Run this once per database before (or right after) deploying
 * the Postgres-backed web app. DATABASE_URL lives in apps/web/.env.local and is
 * not exported to your shell, so load the file explicitly (from
 * packages/database):
 *
 *   npx tsx --env-file=../../apps/web/.env.local prisma/seed-briefs.ts
 *
 * or, with DATABASE_URL already exported: pnpm seed:briefs
 *
 * Idempotent and additive: upserts by slug, so re-running refreshes the copy
 * of those six briefs and touches nothing else — briefs created from the
 * admin panel, pitches and likes are left alone. It does not change a brief's
 * active/paused state once the row exists.
 */
import { prisma } from '../src/index'
import { INITIAL_BRANDS } from '../../../apps/web/src/lib/mock-data'
import { briefCreateData, briefInputFromItem } from '../../../apps/web/src/lib/db-records'

async function main() {
  for (const item of INITIAL_BRANDS) {
    const data = briefCreateData(briefInputFromItem(item))
    const { isActive: _keepAdminChoice, ...update } = data
    const brand = await prisma.brand.upsert({
      where: { slug: item.slug },
      create: data,
      update,
      select: { slug: true, isActive: true },
    })
    console.log(`brief ${brand.slug.padEnd(12)} ${brand.isActive ? 'open' : 'paused'}`)
  }
  console.log(`seeded ${INITIAL_BRANDS.length} briefs`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
