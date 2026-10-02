import { BriefInputSchema } from "@/lib/db-records";
import { readBody, respond } from "@/server/http";
import { requireAdmin } from "@/server/session";
import { createBrief, revalidateBriefPages } from "@/server/briefs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Publishes a new brief. It goes live on /brands immediately. */
export function POST(request: Request) {
  return respond(async () => {
    await requireAdmin();
    const input = await readBody(request, BriefInputSchema);
    const brief = await createBrief(input);
    revalidateBriefPages();
    return { brief };
  }, 201);
}
