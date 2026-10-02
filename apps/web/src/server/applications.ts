import "server-only";

import {
  isMembershipRowActive,
  isProfileRowComplete,
  pitchAllowance,
  pitchSnapshot,
  toApplicationItem,
  WITHDRAWABLE_STATUSES,
  type PitchInput,
  type REVIEW_STATUSES,
} from "@/lib/db-records";
import type { ApplicationItem } from "@/lib/mock-data";
import { prisma } from "./db";
import { HttpError, isUniqueViolation } from "./http";
import type { CurrentUser } from "./session";

export const applicationInclude = {
  creator: { select: { id: true, name: true, email: true } },
  brand: { select: { id: true, name: true, slug: true, logo: true } },
} as const;

/** The creator's pitches, newest first. Withdrawn ones are hidden from them. */
export async function listMyApplications(userId: string): Promise<ApplicationItem[]> {
  const rows = await prisma.application.findMany({
    where: { creatorId: userId, status: { not: "WITHDRAWN" } },
    orderBy: { createdAt: "desc" },
    include: applicationInclude,
  });
  return rows.map(toApplicationItem);
}

/**
 * Sends a pitch. Enforced here, not just in the UI: the brief is open, the
 * profile has what a brand needs, the creator has a free pitch or a plan,
 * and there is no live pitch to the same brief (CONTEXT.md §3). Pitching
 * again after withdrawing reuses the withdrawn row.
 *
 * The checks and the write run in one transaction holding a per-creator
 * advisory lock, so two pitches sent at the same moment (two tabs, a double
 * tap) are counted one after the other and can't both slip under the free
 * allowance. The lock is transaction-scoped, which is what Supabase's
 * transaction pooler needs: it is released at COMMIT on the same connection.
 */
export async function createPitch(user: CurrentUser, input: PitchInput): Promise<ApplicationItem> {
  const brand = await prisma.brand.findUnique({ where: { slug: input.briefSlug } });
  if (!brand || !brand.isActive) throw new HttpError(404, "This brief has closed or the link is wrong.");

  try {
    const row = await prisma.$transaction(
      async (tx) => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`pitch:${user.id}`}::text, 0))`;

        const [profile, membership, activePitches, existing] = await Promise.all([
          tx.creatorProfile.findUnique({ where: { userId: user.id }, select: { igHandle: true, niche: true } }),
          tx.membership.findUnique({ where: { userId: user.id } }),
          tx.application.count({ where: { creatorId: user.id, status: { not: "WITHDRAWN" } } }),
          tx.application.findUnique({ where: { creatorId_brandId: { creatorId: user.id, brandId: brand.id } } }),
        ]);

        if (!isProfileRowComplete(profile)) {
          throw new HttpError(400, "Add your Instagram handle and niche to your profile before pitching.");
        }
        if (existing && existing.status !== "WITHDRAWN") {
          throw new HttpError(409, `You've already pitched to ${brand.name}. Track it on your dashboard.`);
        }
        if (!pitchAllowance(activePitches, isMembershipRowActive(membership)).canPitch) {
          throw new HttpError(402, "You've used your free pitches. Pick a plan to keep pitching.");
        }

        const data = {
          status: "PENDING" as const,
          proposal: input.proposal,
          expectedRate: input.expectedRate,
          deliverables: input.deliverables,
          metricsSnapshot: pitchSnapshot(input),
        };

        return existing
          ? tx.application.update({
              where: { id: existing.id },
              // A fresh pitch: clear the previous round's review and date it today.
              data: { ...data, adminNotes: null, reviewedBy: null, reviewedAt: null, createdAt: new Date() },
              include: applicationInclude,
            })
          : tx.application.create({
              data: { ...data, creatorId: user.id, brandId: brand.id },
              include: applicationInclude,
            });
      },
      { maxWait: 5_000, timeout: 10_000 }
    );
    return toApplicationItem(row);
  } catch (err) {
    // The unique (creatorId, brandId) index is the last line if anything
    // still races past the lock.
    if (isUniqueViolation(err)) throw new HttpError(409, `You've already pitched to ${brand.name}.`);
    throw err;
  }
}

export async function withdrawPitch(user: CurrentUser, id: string): Promise<ApplicationItem> {
  const existing = await prisma.application.findFirst({ where: { id, creatorId: user.id } });
  if (!existing) throw new HttpError(404, "Pitch not found.");
  if (existing.status === "WITHDRAWN") {
    return toApplicationItem(
      await prisma.application.findUniqueOrThrow({ where: { id }, include: applicationInclude })
    );
  }
  if (!WITHDRAWABLE_STATUSES.includes(existing.status)) {
    throw new HttpError(409, "This pitch has already been decided. Contact the Schbang team to change it.");
  }
  const row = await prisma.application.update({
    where: { id },
    data: { status: "WITHDRAWN" },
    include: applicationInclude,
  });
  return toApplicationItem(row);
}

/** Every pitch across every brief, newest first, for the admin review queue. */
export async function listAllApplications(): Promise<ApplicationItem[]> {
  const rows = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    take: 1000,
    include: applicationInclude,
  });
  return rows.map(toApplicationItem);
}

export async function reviewApplication(
  admin: CurrentUser,
  id: string,
  patch: { status?: (typeof REVIEW_STATUSES)[number]; adminNotes?: string | null }
): Promise<ApplicationItem> {
  const existing = await prisma.application.findUnique({ where: { id }, select: { status: true } });
  if (!existing) throw new HttpError(404, "Pitch not found.");
  if (existing.status === "WITHDRAWN") {
    throw new HttpError(409, "The creator withdrew this pitch, so it can't be reviewed.");
  }
  const row = await prisma.application.update({
    where: { id },
    data: { ...patch, reviewedBy: admin.email, reviewedAt: new Date() },
    include: applicationInclude,
  });
  return toApplicationItem(row);
}
