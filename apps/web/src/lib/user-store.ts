"use client";

import type { ApplicationItem, BrandItem } from "./mock-data";
import type { Membership, PlanId } from "./plans";
import type { CreatorProfile, UserData } from "./db-records";
import { ApiError, fetchJson } from "./fetch-json";

// ─────────────────────────────────────────────────────────
// The signed-in creator's data, from Postgres via /api/me/*.
//
// This used to be a localStorage store keyed by email, so nothing a creator
// did ever left their browser and admins never saw it. It is now a thin
// client over the API routes; the server enforces every rule the old store
// did (duplicate pitches, free-pitch allowance, profile completeness).
// See docs/adr/0003-postgres-creator-data.md.
// ─────────────────────────────────────────────────────────

export type { CreatorProfile, UserData };

/**
 * Whether a creator has filled in enough of their profile to be useful to a
 * brand. Gates: applying to a brief, and whether a freshly-signed-in user
 * gets sent to /dashboard/profile before /dashboard. The server applies the
 * same rule when a pitch is submitted.
 */
export function isProfileComplete(profile: CreatorProfile): boolean {
  return Boolean(profile.igHandle && profile.niche.trim());
}

/** Profile, pitches, likes, plan and free-pitch allowance in one call. */
export const fetchMe = () => fetchJson<UserData>("/api/me");

export async function saveProfile(profile: CreatorProfile): Promise<CreatorProfile> {
  const res = await fetchJson<{ profile: CreatorProfile }>("/api/me/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
  return res.profile;
}

export interface PitchSubmission {
  briefSlug: string;
  proposal: string;
  expectedRate: string;
  deliverables: string[];
  metrics: Record<string, string | undefined>;
  applicant: Record<string, string | undefined>;
}

/** Throws ApiError 402 when the free pitches are used up and there's no plan. */
export async function submitPitch(pitch: PitchSubmission): Promise<ApplicationItem> {
  const res = await fetchJson<{ application: ApplicationItem }>("/api/me/applications", {
    method: "POST",
    body: JSON.stringify(pitch),
  });
  return res.application;
}

export async function withdrawPitch(applicationId: string): Promise<void> {
  await fetchJson(`/api/me/applications/${encodeURIComponent(applicationId)}`, { method: "DELETE" });
}

/** Likes or unlikes a brief. Returns the new state and the brief's like count. */
export const toggleLike = (brandId: string) =>
  fetchJson<{ liked: boolean; likesCount: number }>("/api/me/likes", {
    method: "POST",
    body: JSON.stringify({ brandId }),
  });

/**
 * Activate a plan for the creator. Checkout is still simulated; when a real
 * gateway lands, this call is replaced by order-create + the gateway's
 * checkout, and the plan is activated by its verified webhook server-side.
 */
export async function activateMembership(plan: PlanId): Promise<Membership> {
  const res = await fetchJson<{ membership: Membership }>("/api/me/membership", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });
  return res.membership;
}

export async function cancelMembership(): Promise<Membership> {
  const res = await fetchJson<{ membership: Membership }>("/api/me/membership", { method: "DELETE" });
  return res.membership;
}

/** Every open brief. */
export const fetchBriefs = async () => (await fetchJson<{ briefs: BrandItem[] }>("/api/briefs")).briefs;

/** An open brief by slug, or null if it's paused or doesn't exist. */
export async function fetchBrief(slug: string): Promise<BrandItem | null> {
  try {
    return (await fetchJson<{ brief: BrandItem }>(`/api/briefs/${encodeURIComponent(slug)}`)).brief;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}
