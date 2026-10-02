# ADR 0003: Creator data in Postgres, served by apps/web route handlers

Supersedes [ADR 0001](0001-hybrid-user-store.md).

## Context

ADR 0001 kept profiles, pitches, likes and membership in each creator's
`localStorage`. That isolated users from each other, but it also meant nothing
a creator did ever left their browser: the admin panel rendered hard-coded
sample pitches, briefs an admin published vanished on refresh, and a creator's
pitches were lost on a new device. Schbang could not review real pitches — the
core loop of the product did not work.

Identity had already moved to Postgres (users, password hashes, OTP), read and
written by `apps/web` through Prisma. The NestJS `apps/api` is not deployed,
uses its own JWT scheme rather than the NextAuth session, and is not covered
by CI.

## Decision

- All product data is read and written by `apps/web` itself, through Prisma,
  from Node-runtime route handlers: `/api/me/*` for the signed-in creator,
  `/api/admin/*` for admins, `/api/briefs/*` for public brief data. Domain
  rules live in `src/server/*.ts`; conversions and input validation in
  `src/lib/db-records.ts`.
- Every route re-reads the user from the database (`server/session.ts`) —
  the JWT role is only a hint — and enforces the rules the UI used to:
  one live pitch per brief, the free-pitch allowance, a complete profile,
  admin-only review.
- Briefs are database rows. Public brief pages are static with a 60-second
  revalidate plus on-demand revalidation when an admin changes a brief, and
  fall back to the built-in catalogue in `mock-data.ts` only if the database
  is unreachable, so CI builds without `DATABASE_URL` still succeed.
- No schema change: the existing Prisma models already fit. Brief copy that the
  enums can't express (industry label, free-text deliverable formats) is kept
  in the `Brand.requirements` JSON column.
- Withdrawing a pitch sets `WITHDRAWN` instead of deleting it, so admins see
  it; pitching the same brief again reuses that row (the table is unique on
  creator + brief).

## Consequences

- **Positive**: Admins see every pitch, profile edit and like as it happens;
  creators see status changes and admin notes on any device.
- **Positive**: One deployable (Vercel) and one auth mechanism; no second
  service to host.
- **Trade-off**: Creator pages now wait on a network round trip instead of
  reading localStorage synchronously; they show a loading state.
- **Trade-off**: Data created under ADR 0001 stays in each browser's
  `localStorage` and is not migrated. Creators re-enter their media kit once.
- **Follow-up**: Checkout is still simulated. `activateMembership()` records
  plans with `source: GRANT`; a payment gateway must activate plans from its
  verified webhook instead, and `POST /api/me/membership` must then stop
  being callable from the browser.
- **Follow-up**: `apps/api` duplicates this logic and is now further out of
  date; decide whether to delete it or make it the backend deliberately.
