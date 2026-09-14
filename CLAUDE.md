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

## Architecture: two parallel data layers — read this before touching data flow

The most important non-obvious fact about this codebase: **`apps/web` does
not depend on `apps/api` being correct or even running.**

- `apps/web/src/lib/api.ts` calls the NestJS API with a **1.2s timeout**,
  and on any failure/timeout falls back to static fixtures in
  `apps/web/src/lib/mock-data.ts`. There is no loading/error state for this —
  the fallback is silent by design so local dev works with zero backend setup.
- All writes a user makes (profile edits, applications/pitches, likes,
  membership) persist client-side via `apps/web/src/lib/user-store.ts`,
  keyed per-user in `localStorage` as `align_user_{email}` (see
  `docs/adr/0001-hybrid-user-store.md`). This is the actual source of truth
  for the deployed demo today, *not* Postgres.
- `packages/database`'s Prisma schema is the target schema this store is
  designed to mirror 1:1, for when `apps/api` becomes authoritative. When
  changing a domain shape, update both `mock-data.ts`/`user-store.ts` *and*
  `packages/database/prisma/schema.prisma` — they're expected to stay in sync
  even though only one is live.
- Payments/membership: `plans.ts` is the single source of pricing;
  `activateMembership()` in `user-store.ts` is the one seam meant for a real
  payment gateway webhook to call — see `docs/LAUNCH-DAY.md` §2 before wiring one.

## Auth & RBAC

Two roles: `CREATOR` and `ADMIN` (schema also allows `SUPER_ADMIN`).

- NextAuth v5 (`apps/web/src/lib/auth.ts`) registers Google OAuth **only if**
  `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are set — otherwise only the
  `Credentials` provider is available.
- The `Credentials` provider is also the **demo login**: it auto-assigns a
  role from the email — `admin@schbang.com` and any `@schbang.com` address
  → `ADMIN`; specific seeded demo creators (`rohan@schbang.com`,
  `aanya@schbang.com`, and their Gmail aliases) map to fixed creator
  personas; any other email → a fresh `CREATOR`. Same domain rule applies to
  real Google sign-in. See `docs/LAUNCH-DAY.md` §6 for the demo account table.
- Access control is enforced at two layers (`docs/adr/0002-edge-middleware-rbac.md`):
  edge `middleware.ts` (redirects `/admin`, `/creators`, `/dashboard` by JWT
  role before render) plus a component-level access-gate UI for `/creators`.
  `middleware.ts`'s matcher list is the authoritative list of protected
  route prefixes — update it when adding new gated sections.
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
  `user-store.ts` are expected to mirror them (see `CONTEXT.md` §1 for the
  domain term ↔ source-of-truth mapping).
