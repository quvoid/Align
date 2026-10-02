import "server-only";

import { revalidatePath } from "next/cache";
import { INITIAL_BRANDS, type BrandItem } from "@/lib/mock-data";
import { briefCreateData, slugify, toBrandItem, type BriefInput } from "@/lib/db-records";
import { prisma } from "./db";
import { HttpError, isRecordNotFound, isUniqueViolation } from "./http";

const withLikeCount = { _count: { select: { likes: true } } } as const;

/**
 * Public brief pages must still render when the database can't be reached —
 * CI builds run without DATABASE_URL — so reads for them fall back to the
 * built-in catalogue in mock-data.ts (the same list seed-briefs.ts loads into
 * the database). Admin reads and every write go to the database or fail.
 */
async function withFallback<T>(query: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await query();
  } catch (err) {
    const reason = err instanceof Error ? err.message.split("\n").find(Boolean) : String(err);
    console.warn(`[briefs] database unavailable, serving built-in briefs: ${reason}`);
    return fallback();
  }
}

/** Open briefs, in the order they were published. */
export function listActiveBriefs(): Promise<BrandItem[]> {
  return withFallback(
    async () => {
      const rows = await prisma.brand.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
        include: withLikeCount,
      });
      return rows.map(toBrandItem);
    },
    () => INITIAL_BRANDS.filter((b) => b.isActive)
  );
}

/** An open brief by slug; paused or unknown briefs are null. */
export function getActiveBrief(slug: string): Promise<BrandItem | null> {
  return withFallback(
    async () => {
      const row = await prisma.brand.findFirst({ where: { slug, isActive: true }, include: withLikeCount });
      return row ? toBrandItem(row) : null;
    },
    () => INITIAL_BRANDS.find((b) => b.slug === slug && b.isActive) ?? null
  );
}

/** Every brief including paused ones, newest first, for the admin panel. */
export async function listAllBriefs(): Promise<BrandItem[]> {
  const rows = await prisma.brand.findMany({ orderBy: { createdAt: "desc" }, include: withLikeCount });
  return rows.map(toBrandItem);
}

export async function createBrief(input: BriefInput): Promise<BrandItem> {
  // A second "Puma" brief becomes puma-2, and so on.
  const base = slugify(input.name);
  const taken = new Set(
    (await prisma.brand.findMany({ where: { slug: { startsWith: base } }, select: { slug: true } })).map((b) => b.slug)
  );
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;

  try {
    const row = await prisma.brand.create({ data: briefCreateData({ ...input, slug }), include: withLikeCount });
    return toBrandItem(row);
  } catch (err) {
    if (isUniqueViolation(err)) throw new HttpError(409, "A brief with this name was just published. Try again.");
    throw err;
  }
}

export async function setBriefActive(id: string, isActive: boolean): Promise<BrandItem> {
  try {
    const row = await prisma.brand.update({ where: { id }, data: { isActive }, include: withLikeCount });
    return toBrandItem(row);
  } catch (err) {
    if (isRecordNotFound(err)) throw new HttpError(404, "That brief no longer exists.");
    throw err;
  }
}

/**
 * Home, /brands, each brief page, /pricing and the sitemap are statically
 * rendered with a 60s revalidate. After an admin publishes or pauses a brief,
 * refresh them now rather than a minute later.
 */
export function revalidateBriefPages(): void {
  revalidatePath("/", "layout");
}
