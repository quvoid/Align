/**
 * Seeds the two demo personas the sign-in UI hardcodes.
 *
 * `apps/web/src/app/auth/signin/page.tsx` and
 * `apps/web/src/components/auth/sign-in-modal.tsx` call
 *   loginWithEmail("admin@schbang.com", "admin123", "/admin")
 *   loginWithEmail("rohan.creates@gmail.com", "creator123", "/dashboard")
 * and the Credentials provider now resolves those against real User rows
 * (bcrypt + Prisma), so the rows have to exist with matching hashes. The
 * passwords below must stay in sync with those two files.
 *
 * Usage (DATABASE_URL should point at the session pooler / direct URL):
 *   DATABASE_URL="$DIRECT_URL" pnpm --filter @branddeals/database seed:demo
 *
 * Idempotent: re-running resets both accounts to this exact state (role,
 * password, profile). It touches nothing else.
 *
 * NOTE: this deliberately gives an ADMIN account a well-known password. It is
 * meant for the demo, and NEXT_PUBLIC_DEMO_MODE stays off in production so the
 * one-click buttons are hidden — but the email/password form is public, so
 * rotate the admin password with seed-admins.ts (ADMIN_INITIAL_PASSWORD)
 * before real creator data lands in this database.
 */
import bcrypt from 'bcryptjs'
import { prisma } from '../src/index'

const ADMIN_EMAIL = 'admin@schbang.com'
const ADMIN_PASSWORD = 'admin123'

const ROHAN_EMAIL = 'rohan.creates@gmail.com'
const ROHAN_PASSWORD = 'creator123'

// Mirrors INITIAL_CREATORS[0] in apps/web/src/lib/mock-data.ts — the client
// store and this schema are meant to stay 1:1 (CLAUDE.md, ADR 0001).
const ROHAN_PROFILE = {
  igHandle: 'rohan_joshicomics', // stored lowercased, no '@' (see normalizeHandle)
  igFollowers: 145000,
  igEngagementRate: 6.8,
  ytSubscribers: 85000,
  ytAvgViews: 42000,
  fbFollowers: 12000,
  niche: ['Comedy', 'Food & FMCG', 'Lifestyle'],
  location: 'Mumbai, India',
  bio: 'Stand-up comedian & storyteller creating relatable humorous sketches around everyday Indian family moments.',
}

async function main() {
  const [adminHash, rohanHash] = await Promise.all([
    bcrypt.hash(ADMIN_PASSWORD, 12),
    bcrypt.hash(ROHAN_PASSWORD, 12),
  ])

  // Role must be exactly ADMIN: middleware.ts sends anything else (including
  // SUPER_ADMIN) away from /admin, which is where the demo button lands.
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    create: {
      email: ADMIN_EMAIL,
      name: 'Schbang Admin Lead',
      role: 'ADMIN',
      provider: 'CREDENTIALS',
      passwordHash: adminHash,
      emailVerifiedAt: new Date(),
    },
    update: {
      name: 'Schbang Admin Lead',
      role: 'ADMIN',
      passwordHash: adminHash,
      emailVerifiedAt: new Date(),
    },
    select: { email: true, role: true },
  })
  console.log(`seeded demo admin:   ${admin.email} (${admin.role})`)

  const rohan = await prisma.user.upsert({
    where: { email: ROHAN_EMAIL },
    create: {
      email: ROHAN_EMAIL,
      name: 'Rohan Joshi',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      role: 'CREATOR',
      provider: 'CREDENTIALS',
      passwordHash: rohanHash,
      emailVerifiedAt: new Date(),
      creatorProfile: { create: ROHAN_PROFILE },
    },
    update: {
      name: 'Rohan Joshi',
      role: 'CREATOR',
      passwordHash: rohanHash,
      emailVerifiedAt: new Date(),
      creatorProfile: {
        upsert: { create: ROHAN_PROFILE, update: ROHAN_PROFILE },
      },
    },
    select: { email: true, role: true },
  })
  console.log(`seeded demo creator: ${rohan.email} (${rohan.role})`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
