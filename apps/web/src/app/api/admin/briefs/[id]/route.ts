import { z } from "zod";
import { readBody, respond } from "@/server/http";
import { requireAdmin } from "@/server/session";
import { revalidateBriefPages, setBriefActive } from "@/server/briefs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const StatusSchema = z.object({ isActive: z.boolean() });

/** Pauses or re-opens a brief. Paused briefs disappear from the public site. */
export function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return respond(async () => {
    await requireAdmin();
    const { isActive } = await readBody(request, StatusSchema);
    const { id } = await params;
    const brief = await setBriefActive(id, isActive);
    revalidateBriefPages();
    return { brief };
  });
}
