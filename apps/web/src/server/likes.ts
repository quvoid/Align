import "server-only";

import { toInterestItem, type InterestItem } from "@/lib/db-records";
import { prisma } from "./db";
import { HttpError, isUniqueViolation } from "./http";
import type { CurrentUser } from "./session";

/** Likes or unlikes a brief. Returns the new state and the brief's like count. */
export async function toggleLike(
  user: CurrentUser,
  brandId: string
): Promise<{ liked: boolean; likesCount: number }> {
  const where = { userId_brandId: { userId: user.id, brandId } };
  const existing = await prisma.brandLike.findUnique({ where });

  let liked: boolean;
  if (existing) {
    await prisma.brandLike.deleteMany({ where: { userId: user.id, brandId } });
    liked = false;
  } else {
    const brand = await prisma.brand.findUnique({ where: { id: brandId }, select: { isActive: true } });
    if (!brand?.isActive) throw new HttpError(404, "This brief has closed.");
    try {
      await prisma.brandLike.create({ data: { userId: user.id, brandId } });
    } catch (err) {
      // Double-click: the first request already created it.
      if (!isUniqueViolation(err)) throw err;
    }
    liked = true;
  }

  const likesCount = await prisma.brandLike.count({ where: { brandId } });
  return { liked, likesCount };
}

/** Creators who liked a brief, newest first, for the admin interest queue. */
export async function listInterests(): Promise<InterestItem[]> {
  const rows = await prisma.brandLike.findMany({
    orderBy: { createdAt: "desc" },
    take: 1000,
    select: {
      id: true,
      createdAt: true,
      brand: { select: { id: true, name: true, slug: true, logo: true, budgetTier: true } },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          creatorProfile: {
            select: { igHandle: true, location: true, igFollowers: true, igEngagementRate: true },
          },
        },
      },
    },
  });
  return rows.map(toInterestItem);
}
