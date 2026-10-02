import { respond } from "@/server/http";
import { listActiveBriefs } from "@/server/briefs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Every open brief. Public, same data as /brands. */
export function GET() {
  return respond(async () => ({ briefs: await listActiveBriefs() }));
}
