import "server-only";

import {
  isMembershipRowActive,
  pitchAllowance,
  profileUpdateData,
  toClientMembership,
  toCreatorItem,
  toCreatorProfile,
  type CreatorProfile,
  type ProfileInput,
  type UserData,
} from "@/lib/db-records";
import type { CreatorItem } from "@/lib/mock-data";
import { listMyApplications } from "./applications";
import { prisma } from "./db";
import { HttpError, isUniqueViolation } from "./http";
import type { CurrentUser } from "./session";

/** Profile, pitches, likes and plan for the signed-in creator's pages. */
export async function getMe(user: CurrentUser): Promise<UserData> {
  const [profile, applications, likes, membership] = await Promise.all([
    prisma.creatorProfile.findUnique({ where: { userId: user.id } }),
    listMyApplications(user.id),
    prisma.brandLike.findMany({ where: { userId: user.id }, select: { brandId: true } }),
    prisma.membership.findUnique({ where: { userId: user.id } }),
  ]);
  const { freePitchesLeft, canPitch } = pitchAllowance(applications.length, isMembershipRowActive(membership));

  return {
    profile: toCreatorProfile(user, profile),
    applications,
    likedBrandIds: likes.map((l) => l.brandId),
    membership: membership ? toClientMembership(membership) : null,
    freePitchesLeft,
    canPitch,
  };
}

export async function saveProfile(user: CurrentUser, input: ProfileInput): Promise<CreatorProfile> {
  const { name, profile } = profileUpdateData(input);
  try {
    const [updatedUser, row] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { name },
        select: { name: true, email: true, avatar: true },
      }),
      prisma.creatorProfile.upsert({
        where: { userId: user.id },
        create: { userId: user.id, ...profile },
        update: profile,
      }),
    ]);
    return toCreatorProfile(updatedUser, row);
  } catch (err) {
    // CreatorProfile has unique igHandle / ytChannel: first claim wins, which
    // is the cheap half of the impersonation defence in schema.prisma.
    if (isUniqueViolation(err)) {
      const onYouTube = String(err.meta?.target ?? "").includes("ytChannel");
      throw new HttpError(
        409,
        onYouTube
          ? "This YouTube channel is already linked to another Align account. If it's yours, contact Schbang."
          : "This Instagram handle is already linked to another Align account. If it's yours, contact Schbang."
      );
    }
    throw err;
  }
}

const directoryInclude = {
  creatorProfile: true,
  applications: {
    select: {
      status: true,
      createdAt: true,
      reviewedAt: true,
      deliverables: true,
      brand: { select: { name: true, logo: true } },
    },
  },
  brandLikes: { select: { brandId: true } },
} as const;

/** Every creator account, newest first, for the admin talent directory. */
export async function listCreators(): Promise<CreatorItem[]> {
  const rows = await prisma.user.findMany({
    where: { role: "CREATOR" },
    orderBy: { createdAt: "desc" },
    take: 1000,
    include: directoryInclude,
  });
  return rows.map(toCreatorItem);
}

export async function getCreator(id: string): Promise<CreatorItem> {
  const row = await prisma.user.findFirst({ where: { id, role: "CREATOR" }, include: directoryInclude });
  if (!row) throw new HttpError(404, "Creator not found.");
  return toCreatorItem(row);
}
