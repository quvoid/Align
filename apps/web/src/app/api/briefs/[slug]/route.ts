import { HttpError, respond } from "@/server/http";
import { getActiveBrief } from "@/server/briefs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** One open brief, for the client-rendered pitch form and checkout. Public. */
export function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return respond(async () => {
    const { slug } = await params;
    const brief = await getActiveBrief(slug);
    if (!brief) throw new HttpError(404, "This brief has closed or the link is wrong.");
    return { brief };
  });
}
