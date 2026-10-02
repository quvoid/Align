import "server-only";

import { planToDb, toClientMembership } from "@/lib/db-records";
import { PLANS, type Membership, type PlanId } from "@/lib/plans";
import { prisma } from "./db";
import { HttpError } from "./http";
import type { CurrentUser } from "./session";

/**
 * Turns a plan on for the creator.
 *
 * Checkout is still simulated (docs/LAUNCH-DAY.md §2): /join calls this
 * straight after its fake "Pay" button, exactly as it used to flip the plan
 * on in localStorage. The row is recorded with source GRANT, not PAYMENT,
 * because nothing was paid. When Razorpay lands, the verified webhook should
 * create the Payment and call this with source PAYMENT instead, and this
 * route should stop being callable from the browser.
 */
export async function activateMembership(user: CurrentUser, plan: PlanId): Promise<Membership> {
  const now = new Date();
  let expiresAt: Date | null = null;
  if (PLANS[plan].period === "month") {
    expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  }

  const data = {
    plan: planToDb(plan),
    status: "ACTIVE" as const,
    source: "GRANT" as const,
    activatedAt: now,
    expiresAt,
    cancelledAt: null,
  };
  const row = await prisma.membership.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...data },
    update: data,
  });
  return toClientMembership(row);
}

export async function cancelMembership(user: CurrentUser): Promise<Membership> {
  const existing = await prisma.membership.findUnique({ where: { userId: user.id } });
  if (!existing) throw new HttpError(404, "You don't have a plan to cancel.");
  const row = await prisma.membership.update({
    where: { userId: user.id },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });
  return toClientMembership(row);
}
