import { PitchInputSchema } from "@/lib/db-records";
import { enforceRateLimit, readBody, respond } from "@/server/http";
import { requireCreator } from "@/server/session";
import { createPitch } from "@/server/applications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Sends a pitch to a brief. 402 means the free pitches are used up. */
export function POST(request: Request) {
  return respond(async () => {
    const user = await requireCreator();
    enforceRateLimit(`pitch:${user.id}`, 20, 60 * 60 * 1000);
    const input = await readBody(request, PitchInputSchema);
    return { application: await createPitch(user, input) };
  }, 201);
}
