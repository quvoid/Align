import { MembershipInputSchema } from "@/lib/db-records";
import { assertSameOrigin, readBody, respond } from "@/server/http";
import { requireCreator } from "@/server/session";
import { activateMembership, cancelMembership } from "@/server/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Simulated checkout — see the note on activateMembership in server/membership.ts. */
export function POST(request: Request) {
  return respond(async () => {
    const user = await requireCreator();
    const { plan } = await readBody(request, MembershipInputSchema);
    return { membership: await activateMembership(user, plan) };
  });
}

export function DELETE(request: Request) {
  return respond(async () => {
    assertSameOrigin(request);
    return { membership: await cancelMembership(await requireCreator()) };
  });
}
