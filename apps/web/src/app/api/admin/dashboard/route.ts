import { respond } from "@/server/http";
import { requireAdmin } from "@/server/session";
import { listAllBriefs } from "@/server/briefs";
import { listAllApplications } from "@/server/applications";
import { listInterests } from "@/server/likes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Everything the admin panel shows: every brief, every pitch and every like. */
export function GET() {
  return respond(async () => {
    await requireAdmin();
    const [briefs, applications, interests] = await Promise.all([
      listAllBriefs(),
      listAllApplications(),
      listInterests(),
    ]);
    return { briefs, applications, interests };
  });
}
