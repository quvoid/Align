import { respond } from "@/server/http";
import { requireUser } from "@/server/session";
import { getMe } from "@/server/creators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The signed-in creator's profile, pitches, likes and plan. */
export function GET() {
  return respond(async () => getMe(await requireUser()));
}
