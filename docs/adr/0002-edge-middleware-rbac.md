# ADR 0002: Edge Middleware Role-Based Access Control (RBAC)

## Context
Creators should only have access to campaign brief exploration, their own creator dashboard, and media kit editor. They must not view agency-only portals (`/admin`) or scout other creators' private scorecards and rate cards (`/creators`, `/creators/[id]`).

## Decision
We implemented two-tier protection:
1. **Edge Middleware (`apps/web/src/middleware.ts`)**:
   - Inspects the NextAuth JWT token directly in edge runtime.
   - Non-admin requests to `/admin` are redirected to `/dashboard`.
   - Creator role requests to `/creators` are redirected to `/brands`.
   - Unauthenticated requests to protected zones are routed to `/auth/signin`.
2. **Component/Page Barrier**:
   - Branded access gate UI in `/creators` and `/creators/[id]` that displays a friendly *"Brand & Agency Access Only"* lock notice if accessed directly.

## Consequences
- **Positive**: Zero data flash on unauthorized routes.
- **Positive**: Clear separation of concern between influencer talent and agency campaign leads.
