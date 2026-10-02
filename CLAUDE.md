# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Align (`@branddeals/*` package scope) is Schbang's creator/brand collaboration
marketplace — a Turborepo + pnpm monorepo:

- `apps/web` — Next.js 15 (App Router, React 19), the actual product surface.
- `apps/api` — NestJS 11 + Prisma, a REST backend (`/api/v1`).
- `packages/database` — Prisma schema/client, shared by `apps/api` and seed scripts.
- `packages/shared` — cross-app Zod types/validators/constants.

Read `CONTEXT.md` for the domain glossary and RBAC matrix, and
`docs/adr/*.md` for the reasoning behind the two architectural decisions
described below. `docs/LAUNCH-DAY.md` documents product/growth decisions
(CTA copy rules, pricing, SEO surface) that aren't visible from code alone.

## Commands

Run from the repo root unless noted; Turborepo fans out `dev`/`build`/`lint`/`test`/`type-check` to whichever workspace(s) define them.

```bash
pnpm install                 # install all workspaces
docker compose up -d         # postgres:5432 + redis:6379 (needed for apps/api)

pnpm dev                     # turbo dev — web on :3000, api on :3001/api/v1
pnpm build                   # turbo build
pnpm lint                    # turbo lint
pnpm type-check              # turbo type-check

pnpm --filter @branddeals/web test              # vitest run (only web has tests)
pnpm --filter @branddeals/web test -- <pattern>  # run a subset / single file
pnpm --filter @branddeals/web dev               # web only, :3000
pnpm --filter @branddeals/api dev               # api only, :3001

pnpm db:generate / db:push / db:seed / db:studio  # proxies into packages/database (prisma)
```

CI (`.github/workflows/ci.yml`) only runs `type-check`, `test`, and `build`
for `@branddeals/web` — it does not lint/build/type-check `apps/api` or
`packages/database`. Keep that asymmetry in mind: breaking the API package
will not fail CI.

## Architecture: data lives in Postgres, read/written by `apps/web` itself

The most important non-obvious fact about this codebase: **`apps/web` does
not depend on `apps/api` being correct or even running.** The NestJS app is
not in the request path at all (see `docs/adr/0003-postgres-creator-data.md`).

- Every piece of product data — users, creator profiles, pitches
  (`Application`), briefs (`Brand`), likes, membership — is in Postgres and
  read/written by `apps/web` directly through Prisma from Node-runtime route
  handlers (`app/api/me/*`, `app/api/admin/*`, `app/api/briefs/*`) and server
  components. `server/db.ts` re-exports the `@branddeals/database` client;
  domain logic lives in `src/server/*.ts` (briefs, applications, creators,
  likes, membership, session). Anything under `src/server/` is `server-only`.
- `lib/db-records.ts` is the one place Prisma rows are converted to the UI
  shapes (`BrandItem`/`ApplicationItem`/`CreatorItem` in `mock-data.ts`,
  `CreatorProfile`/`UserData`, `Membership` in `plans.ts`) and where API input
  is validated (zod). It has no Prisma client and relative imports only,
  because `packages/database/prisma/seed-briefs.ts` imports it.
- Client pages talk to those routes through `lib/user-store.ts` (the signed-in
  creator: `fetchMe`, `saveProfile`, `submitPitch`, …) and `lib/admin-client.ts`.
  It used to be a localStorage store; the name stayed. Route handlers re-check
  the role in the DB (`requireCreator`/`requireAdmin` in `server/session.ts`)
  and enforce the domain rules (one live pitch per brief, free-pitch
  allowance, complete profile) — the UI checks are only for UX.
- Public brief pages (`/`, `/brands`, `/brands/[slug]`, `/pricing`, sitemap)
  are static with `revalidate = 60`, refreshed immediately when an admin
  publishes/pauses a brief (`revalidateBriefPages()`). If the database is
  unreachable (e.g. CI builds without `DATABASE_URL`) they fall back to the
  built-in catalogue `INITIAL_BRANDS` in `mock-data.ts`. That list is also what
  `pnpm --filter @branddeals/database seed:briefs` loads into a fresh database —
  an empty `Brand` table means an empty `/brands`.
- The rest of `mock-data.ts` (`INITIAL_CREATORS`, `INITIAL_APPLICATIONS`) is
  fixtures for tests only. `lib/api.ts` (NestJS client with a silent mock
  fallback) is unused legacy.
- **No schema change was needed for this**: brief display labels that don't fit
  the Prisma enums live in the `Brand.requirements` JSON (`BriefDetails` in
  `db-records.ts`); the creator's handle is derived from `igHandle`. When
  changing a domain shape, update `schema.prisma`, `db-records.ts` and the
  types in `mock-data.ts` together. Production has no `_prisma_migrations`
  table (schema was applied with `db push`), so `migrate deploy` won't work
  there without baselining.
- Payments/membership: `plans.ts` is the single source of pricing; creators
  get `FREE_PITCHES` (3) before a plan is needed (`pitchAllowance()` in
  `db-records.ts`, enforced in `server/applications.ts`). Never add
  "no commission" / "keep 100%" copy. Checkout is still simulated:
  `activateMembership()` in `server/membership.ts` is the one seam for a real
  payment gateway webhook, and records simulated plans as `source: GRANT` —
  see `docs/LAUNCH-DAY.md` §2 before wiring one.

## Backend safeguards

- **Domain writes that check-then-insert hold a lock.** `createPitch` runs its
  checks and the insert in one interactive transaction behind a per-creator
  `pg_advisory_xact_lock`, so concurrent pitches can't both pass the free
  allowance. Transaction-scoped locks are what Supabase's transaction pooler
  supports; don't switch to session locks. Do the same for any new
  "count, then write" rule.
- **Every mutating route is same-origin checked** (`assertSameOrigin` in
  `server/http.ts`; `readBody` calls it, DELETE routes call it directly), on
  top of NextAuth's SameSite=Lax cookies.
- **Rate limits** (`enforceRateLimit`, `lib/rate-limit.ts`) cover login (per
  email and per IP, inside `authorize`), signup, pitches, likes and profile
  saves. The store is in-memory, so limits are per serverless instance; move
  it to Redis (Upstash) for a hard global limit without touching call sites.
- **Public endpoints say little**: `/api/health/db` returns only up/latency;
  errors are logged server-side and never echoed. `/api/competitor/analyze` is
  admin-only.
- **Integration tests** in `src/server/__tests__/*.int.test.ts` run against a
  real Postgres when `TEST_DATABASE_URL` is set (CI starts one); otherwise they
  skip. Add one whenever a rule depends on the database.

## Auth & RBAC

Two roles: `CREATOR` and `ADMIN` (schema also allows `SUPER_ADMIN`).

- NextAuth v5, JWT sessions, split in two: `lib/auth.config.ts` is the
  **edge-safe** half (no Prisma, no bcrypt) used by `middleware.ts`;
  `lib/auth.ts` adds the providers and DB-backed callbacks for Node. Never
  import `@/lib/auth` from middleware or anything edge-bundled. Edge-safe
  helpers (`normalizeEmail`, `isSeededAdminEmail`, `safeRedirectPath`,
  `postAuthUrl`) live in `lib/auth-shared.ts`.
- Google OAuth registers **only if** `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`
  are set. `Credentials` is a real email + password login against
  `User.passwordHash` (`@node-rs/bcrypt`, not `bcryptjs`); accounts are created
  by `POST /api/auth/register`.
- **Role is never derived from the email domain.** New users are `CREATOR`
  unless their email is in the `ADMIN_EMAILS` env allowlist; after that the
  DB row is authoritative and re-login never changes it. `role` is stamped
  into the JWT at sign-in and not refreshed, so a promotion needs a
  sign-out/in, and admin route handlers must re-check the role in the DB.
- **First sign-in can require an emailed 6-digit OTP** (credentials and
  Google alike) — **off unless `REQUIRE_EMAIL_OTP=true`** (`isEmailOtpRequired()`
  in `auth-shared.ts`), because email delivery isn't set up in production and
  nobody could get past `/auth/verify`. When off, the session callback in
  `auth.config.ts` reports every session as confirmed and `requireUser()`
  skips the check. `server/email-otp.ts` stores only an HMAC of the code (10-min TTL,
  5 attempts, 60s resend cooldown); `server/email.ts` sends via Resend
  (`RESEND_API_KEY`, `EMAIL_FROM`) and just logs the email to the server
  console in dev when no key is set. On success the client calls
  `useSession().update()` and the jwt callback re-reads `emailVerifiedAt`
  from the DB. Every sign-in path lands on `/auth/continue` via `postAuthUrl()`.
- Demo passkeys (seeded admin + creator, see `docs/LAUNCH-DAY.md` §6) are
  **shown by default, production included**, for the client demo; set
  `NEXT_PUBLIC_DEMO_MODE=false` (and redeploy) to hide them. While shown,
  anyone can enter the admin panel as `admin@schbang.com` — turn them off
  before real creators sign up.
- Access control is enforced at two layers (`docs/adr/0002-edge-middleware-rbac.md`):
  edge `middleware.ts` (redirects anonymous users away from `/admin` and
  `/creators`, sends unconfirmed users to `/auth/verify`, and redirects by JWT
  role) plus a component-level access-gate UI for `/creators`. `/dashboard`,
  `/apply` and `/join` are matched but use the client-side sign-in popup for
  anonymous visitors so `?brief=` survives. The matcher list is the
  authoritative list of protected route prefixes — update it when adding new
  gated sections. Middleware is a UX guard, not the security boundary.
- `robots.txt`/`sitemap.ts` intentionally exclude everything behind auth
  (`/admin`, `/dashboard`, `/apply`, `/join`, `/creators`, `/auth`, `/api`) —
  see `docs/LAUNCH-DAY.md` §4 for the full SEO surface and why routes stay
  public vs. gated.

## Conventions to preserve

- CTA copy follows explicit rules in `docs/LAUNCH-DAY.md` §3 (verb + object,
  price on the charging button, no metaphors) — apply them to any new
  button/CTA rather than freehanding copy.
- The `?brief=<slug>` query param is threaded through
  brief → `/pricing` → `/join` → `/apply` so a creator's origin brief
  survives the funnel; don't drop it when touching those pages.
- Prisma enums (`Role`, `AuthProvider`, `ApplicationStatus`, `Industry`,
  `BudgetTier`, `CampaignType`) are the canonical vocabulary — the
  `CreatorProfile`/`BrandItem`/`ApplicationItem` types in `mock-data.ts` and
  `db-records.ts` are expected to mirror them, and `db-records.ts` is where
  free text is mapped onto them (see `CONTEXT.md` §1 for the domain term ↔
  source-of-truth mapping).
