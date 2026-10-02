import { ApplicationReviewSchema } from "@/lib/db-records";
import { readBody, respond } from "@/server/http";
import { requireAdmin } from "@/server/session";
import { reviewApplication } from "@/server/applications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Sets a pitch's status and/or the note the creator sees on their dashboard. */
export function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return respond(async () => {
    const admin = await requireAdmin();
    const patch = await readBody(request, ApplicationReviewSchema);
    const { id } = await params;
    return { application: await reviewApplication(admin, id, patch) };
  });
}
