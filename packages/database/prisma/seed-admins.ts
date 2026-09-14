/**
 * Seeds the Schbang admin accounts.
 *
 * Replaces the old `email.endsWith("@schbang.com") -> ADMIN` rule, which let
 * anyone type a schbang.com address into the login form and receive full access
 * to every creator's PII, rate cards and the competitor intelligence tooling.
 *
 * Usage:
 *   ADMIN_EMAILS="lead@schbang.com,ops@schbang.com" \
 *   ADMIN_INITIAL_PASSWORD="<from your password manager>" \
 *   pnpm --filter @branddeals/database exec tsx prisma/seed-admins.ts
 *
 * Idempotent: re-running promotes/refreshes the listed accounts and touches
 * nothing else. It never demotes or deletes anyone.
 */
import { randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '../src/index'

const normalizeEmail = (email: string) => email.toLowerCase().trim()

async function main() {
  const emails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(normalizeEmail)
    .filter(Boolean)

  if (emails.length === 0) {
    throw new Error(
      'ADMIN_EMAILS is empty. Pass a comma-separated list of admin addresses.'
    )
  }

  // A generated password is printed once and must be moved into the team
  // password manager. Supplying ADMIN_INITIAL_PASSWORD avoids printing anything.
  const supplied = process.env.ADMIN_INITIAL_PASSWORD
  const generated = supplied ?? randomBytes(18).toString('base64url')
  const passwordHash = await bcrypt.hash(generated, 12)

  for (const email of emails) {
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: email.split('@')[0] ?? 'Schbang Admin',
        role: 'ADMIN',
        provider: 'CREDENTIALS',
        passwordHash,
        emailVerifiedAt: new Date(),
      },
      update: {
        role: 'ADMIN',
        // Only (re)set the password when one was explicitly supplied, so a
        // re-run does not silently lock an existing admin out.
        ...(supplied ? { passwordHash } : {}),
      },
      select: { email: true, role: true },
    })
    console.log(`seeded admin: ${user.email} (${user.role})`)
  }

  if (!supplied) {
    console.log(
      `\nInitial password for the accounts created just now: ${generated}\n` +
        'Store it in the password manager and change it after first sign-in.\n' +
        'Existing admins kept their current password.'
    )
  }
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
