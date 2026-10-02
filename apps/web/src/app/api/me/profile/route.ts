import { ProfileInputSchema } from "@/lib/db-records";
import { enforceRateLimit, readBody, respond } from "@/server/http";
import { requireCreator } from "@/server/session";
import { saveProfile } from "@/server/creators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Saves the creator's media kit. Replaces every field, so send the whole profile. */
export function PUT(request: Request) {
  return respond(async () => {
    const user = await requireCreator();
    enforceRateLimit(`profile:${user.id}`, 30, 10 * 60 * 1000);
    const input = await readBody(request, ProfileInputSchema);
    return { profile: await saveProfile(user, input) };
  });
}
