import { z } from "zod";
import { enforceRateLimit, readBody, respond } from "@/server/http";
import { requireCreator } from "@/server/session";
import { toggleLike } from "@/server/likes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LikeSchema = z.object({ brandId: z.string().trim().min(1).max(64) });

/** Likes a brief, or unlikes it if already liked. Admins see likes as creator interest. */
export function POST(request: Request) {
  return respond(async () => {
    const user = await requireCreator();
    enforceRateLimit(`like:${user.id}`, 60, 60 * 1000);
    const { brandId } = await readBody(request, LikeSchema);
    return toggleLike(user, brandId);
  });
}
