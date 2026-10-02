import type { ApplicationStatus } from "./mock-data";

/**
 * One vocabulary for a pitch's status, used on the creator dashboard and in
 * the admin queue alike (PRODUCT.md: "One status, both sides").
 */
export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  UNDER_REVIEW: "In review",
  SHORTLISTED: "Shortlisted",
  APPROVED: "Approved",
  REJECTED: "Not selected",
  WITHDRAWN: "Withdrawn",
};

/** Badge variant (clay fill) per status. */
export const STATUS_BADGE = {
  PENDING: "pending",
  UNDER_REVIEW: "under_review",
  SHORTLISTED: "shortlisted",
  APPROVED: "approved",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
} as const satisfies Record<ApplicationStatus, string>;

/** The four beads a creator watches fill: Sent → In review → Shortlist → Decision. */
export const STATUS_STEPS = ["Sent", "In review", "Shortlist", "Decision"] as const;

/** How many beads are filled for a status (a decision either way fills all four). */
export const STATUS_STEP: Record<ApplicationStatus, number> = {
  PENDING: 1,
  UNDER_REVIEW: 2,
  SHORTLISTED: 3,
  APPROVED: 4,
  REJECTED: 4,
  WITHDRAWN: 0,
};
