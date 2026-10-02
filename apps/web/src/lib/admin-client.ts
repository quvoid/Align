"use client";

import type { ApplicationItem, BrandItem, CreatorItem } from "./mock-data";
import type { InterestItem } from "./db-records";
import { fetchJson } from "./fetch-json";

/** Admin panel data. Every route re-checks the ADMIN role in the database. */

export const fetchAdminDashboard = () =>
  fetchJson<{ briefs: BrandItem[]; applications: ApplicationItem[]; interests: InterestItem[] }>(
    "/api/admin/dashboard"
  );

export async function reviewApplication(
  id: string,
  patch: { status?: Exclude<ApplicationItem["status"], "WITHDRAWN">; adminNotes?: string }
): Promise<ApplicationItem> {
  const res = await fetchJson<{ application: ApplicationItem }>(
    `/api/admin/applications/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify(patch) }
  );
  return res.application;
}

export interface NewBrief {
  name: string;
  industry: string;
  budgetTier: BrandItem["budgetTier"];
  description: string;
  requirements: string;
  campaignTypes: string;
  logo: string;
  coverImage: string;
  contactEmail: string;
  website: string;
}

export async function createBrief(brief: NewBrief): Promise<BrandItem> {
  const res = await fetchJson<{ brief: BrandItem }>("/api/admin/briefs", {
    method: "POST",
    body: JSON.stringify(brief),
  });
  return res.brief;
}

export async function setBriefActive(id: string, isActive: boolean): Promise<BrandItem> {
  const res = await fetchJson<{ brief: BrandItem }>(`/api/admin/briefs/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
  return res.brief;
}

export const fetchCreators = async () =>
  (await fetchJson<{ creators: CreatorItem[] }>("/api/admin/creators")).creators;

export const fetchCreator = async (id: string) =>
  (await fetchJson<{ creator: CreatorItem }>(`/api/admin/creators/${encodeURIComponent(id)}`)).creator;
