import { assertSameOrigin, respond } from "@/server/http";
import { requireCreator } from "@/server/session";
import { withdrawPitch } from "@/server/applications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Withdraws one of the creator's own pitches. Admins still see it, marked withdrawn. */
export function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return respond(async () => {
    assertSameOrigin(request);
    const user = await requireCreator();
    const { id } = await params;
    return { application: await withdrawPitch(user, id) };
  });
}
