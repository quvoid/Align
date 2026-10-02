import "server-only";

import { auth } from "@/lib/auth";
import { isEmailOtpRequired } from "@/lib/auth-shared";
import { prisma } from "./db";
import { HttpError } from "./http";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: "CREATOR" | "ADMIN" | "SUPER_ADMIN";
}

/**
 * The signed-in user as the database has them right now. The JWT's role is
 * stamped at sign-in and never refreshed (see lib/auth.config.ts), so it is
 * only a hint — this re-read is the check that counts. Also enforces the
 * first-sign-in email code when REQUIRE_EMAIL_OTP is on, which middleware
 * only enforces for pages.
 */
export async function requireUser(): Promise<CurrentUser> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) throw new HttpError(401, "Sign in to continue.");

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, avatar: true, role: true, emailVerifiedAt: true },
  });
  if (!user) throw new HttpError(401, "Your session has expired. Sign in again.");
  if (isEmailOtpRequired() && !user.emailVerifiedAt) {
    throw new HttpError(403, "Confirm your email address first.");
  }

  return { id: user.id, email: user.email, name: user.name, avatar: user.avatar, role: user.role };
}

/** Pitches, likes and plans belong to creator accounts only. */
export async function requireCreator(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== "CREATOR") {
    throw new HttpError(403, "Admin accounts can't pitch or buy plans. Sign in with a creator account.");
  }
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    throw new HttpError(403, "Only Schbang admins can do this.");
  }
  return user;
}
