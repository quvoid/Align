import { z } from "zod";
import { analyzeCompetitorPair } from "@/lib/instagram-engine";
import { HttpError, readBody, respond } from "@/server/http";
import { requireAdmin } from "@/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Instagram handles: letters, digits, dots and underscores, up to 30 chars.
const handle = z
  .string()
  .trim()
  .transform((h) => h.replace(/^@/, ""))
  .pipe(z.string().regex(/^[A-Za-z0-9._]{1,30}$/, "Enter an Instagram handle"));

const PairSchema = z.object({ brandHandle: handle, competitorHandle: handle });

/** Competitor benchmark for the admin Competitor Intel pages. Admins only. */
export function POST(request: Request) {
  return respond(async () => {
    await requireAdmin();
    const { brandHandle, competitorHandle } = await readBody(request, PairSchema);
    return { success: true, data: analyzeCompetitorPair(brandHandle, competitorHandle), analyzedAt: new Date().toISOString() };
  });
}

export function GET(request: Request) {
  return respond(async () => {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const parsed = PairSchema.safeParse({
      brandHandle: searchParams.get("brand") ?? "britannia",
      competitorHandle: searchParams.get("competitor") ?? "parle",
    });
    if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Invalid handles");
    const { brandHandle, competitorHandle } = parsed.data;
    return { success: true, data: analyzeCompetitorPair(brandHandle, competitorHandle), analyzedAt: new Date().toISOString() };
  });
}
