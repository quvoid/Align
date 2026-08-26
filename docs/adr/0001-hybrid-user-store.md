# ADR 0001: Isolated User-Scoped Client Store with Offline-First Fallback

## Context
When creators test or use the platform on Vercel preview and client demonstration sessions without an active PostgreSQL database connection, sharing a single static mock array causes data leakage where one user's pitches and profile appear for all other concurrent users.

## Decision
We implemented a per-user, email-scoped data layer in `apps/web/src/lib/user-store.ts` using `localStorage` isolation (`align_user_{email}`):
- New users initialize with their real Google session profile (name, email, avatar) with empty applications.
- Pre-seeded test personas (`rohan@schbang.com`, `admin@schbang.com`) retain pre-populated demo campaigns.
- All actions (`addApplication`, `removeApplication`, `toggleLike`, `updateProfile`) persist strictly to the authenticated user's store key.

## Consequences
- **Positive**: Zero data leakage between accounts. Fully functional without an active database in staging and client pitches.
- **Positive**: Instant optimistic updates with 0ms network latency.
- **Trade-off**: Client-side storage is local to the device/browser session. Production DB connection (Postgres/Prisma) will act as the cloud sync layer.
