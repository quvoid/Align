/**
 * Creator membership plans.
 *
 * Single source of truth for prices, copy and the CTA labels that reference
 * them. Change a number here and the pricing page, checkout, navbar CTA,
 * brief gate and schema markup all follow.
 */

/**
 * Pitches every creator gets before a plan is needed — the LinkedIn/Tinder
 * model: free until the free allowance runs out, then pay to keep going.
 * Counted from the creator's applications in `user-store.ts`.
 */
export const FREE_PITCHES = 3;

export type PlanId = "monthly" | "all_access";

export interface Plan {
  id: PlanId;
  name: string;
  /** Price in INR. */
  price: number;
  /** Billing period. `once` = one-time payment, no renewal. */
  period: "month" | "once";
  /** Short line under the price. */
  tagline: string;
  /** What the creator gets, in the order a media buyer scans it. */
  includes: string[];
  /** Label for the primary button that selects this plan. */
  cta: string;
  /** Mark the plan we want most people to pick. */
  recommended?: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  monthly: {
    id: "monthly",
    name: "Monthly",
    price: 50,
    period: "month",
    tagline: "Pay as you go. Cancel anytime.",
    includes: [
      "Unlimited pitches to every open brief",
      "Verified media kit on your profile",
      "Pitch status tracking",
      "Renews every month at ₹50",
    ],
    cta: "Start for ₹50/month",
  },
  all_access: {
    id: "all_access",
    name: "All-access",
    price: 200,
    period: "once",
    tagline: "One payment. Every brand, now and in future.",
    includes: [
      "Everything in Monthly",
      "Every future brand brief, no renewals",
      "Priority listing on brand shortlists",
      "Launch price — locked for life",
    ],
    cta: "Get all-access for ₹200",
    recommended: true,
  },
};

export const PLAN_LIST: Plan[] = [PLANS.all_access, PLANS.monthly];

export const formatINR = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

export const formatPrice = (plan: Plan) =>
  plan.period === "month" ? `${formatINR(plan.price)}/month` : `${formatINR(plan.price)} once`;

/** The CTA we put in front of anonymous visitors everywhere. */
export const JOIN_CTA = "Join Now";

export interface Membership {
  plan: PlanId;
  status: "active" | "cancelled";
  activatedAt: string;
  /** Only set for recurring plans. */
  renewsAt?: string;
  /** Simulated order reference; replaced by gateway order id later. */
  orderId: string;
}

export const isMembershipActive = (m?: Membership | null): boolean => {
  if (!m || m.status !== "active") return false;
  if (m.renewsAt && new Date(m.renewsAt).getTime() < Date.now()) return false;
  return true;
};
