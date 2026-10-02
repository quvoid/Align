import { respond } from "@/server/http";
import { requireAdmin } from "@/server/session";
import { listCreators } from "@/server/creators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Every creator account with its media kit, for the talent directory. */
export function GET() {
  return respond(async () => {
    await requireAdmin();
    return { creators: await listCreators() };
  });
}
