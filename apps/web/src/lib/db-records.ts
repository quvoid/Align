/**
 * Pure conversions between Prisma rows and the shapes the UI already renders
 * (`BrandItem` / `ApplicationItem` / `CreatorItem` from mock-data.ts,
 * `Membership` from plans.ts, `CreatorProfile` below), plus the input schemas
 * the API routes validate against.
 *
 * No Prisma client and no `server-only` here: route handlers, unit tests and
 * the brief seed script (packages/database/prisma/seed-briefs.ts) all import
 * this module. Imports stay relative for the same reason — the seed script
 * runs outside Next's `@/` alias. Prisma types are type-only imports.
 */
import { z } from "zod";
import type {
  Application,
  Brand,
  BudgetTier,
  CampaignType,
  CreatorProfile as ProfileRow,
  Industry,
  Membership as MembershipRow,
  User,
} from "@branddeals/database";
import type { ApplicationItem, BrandItem, CreatorItem } from "./mock-data";
import { FREE_PITCHES, type Membership, type PlanId } from "./plans";
import { normalizeHandle } from "./auth-shared";

// ─────────────────────────────────────────────────────────
// Client-facing shapes
// ─────────────────────────────────────────────────────────

/** The creator's own profile as the media-kit form edits it. Every field is a string. */
export interface CreatorProfile {
  name: string;
  /** Derived from the Instagram handle; not separately editable. */
  handle: string;
  email: string;
  avatar: string;
  location: string;
  bio: string;
  /** Comma-separated, e.g. "Comedy, Food & FMCG". Stored as String[]. */
  niche: string;
  igHandle: string;
  igFollowers: string;
  igER: string;
  ytChannel: string;
  ytSubscribers: string;
  ytAvgViews: string;
  fbFollowers: string;
  mediaKitUrl: string;
  phone: string;
  website: string;
}

/** Everything the signed-in creator's pages need, from `GET /api/me`. */
export interface UserData {
  profile: CreatorProfile;
  /** The creator's pitches, withdrawn ones excluded, newest first. */
  applications: ApplicationItem[];
  likedBrandIds: string[];
  membership: Membership | null;
  freePitchesLeft: number;
  canPitch: boolean;
}

/** A creator who liked a brief, for the admin "Creator interest" tab. */
export interface InterestItem {
  id: string;
  likedAt: string;
  brand: { id: string; name: string; slug: string; logo: string; budgetTier: BrandItem["budgetTier"] };
  creator: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    handle: string;
    location: string;
    igFollowers: number | null;
    igEngagementRate: number | null;
  };
}

// ─────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const stringList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

const str = (v: unknown): string => (v === null || v === undefined ? "" : String(v));

/** Drops null/undefined values so JSON columns only hold what was given. */
function compact<T extends Record<string, unknown>>(obj: T): { [K in keyof T]?: NonNullable<T[K]> } {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined)
  ) as { [K in keyof T]?: NonNullable<T[K]> };
}

export const defaultAvatar = (name: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || "creator")}`;

const handleFromName = (name: string) =>
  name ? `@${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}` : "@creator";

const withAt = (handle: string | null | undefined) => (handle ? `@${handle}` : "");

export const slugify = (name: string): string =>
  name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "brief";

// ─────────────────────────────────────────────────────────
// Input parsing primitives
// ─────────────────────────────────────────────────────────

const blankToNull = (v: unknown) =>
  v === undefined || v === null || (typeof v === "string" && v.trim() === "") ? null : v;

const optText = (max: number, label: string) =>
  z.preprocess(blankToNull, z.string().trim().max(max, `${label} is too long`).nullable());

/** Whole numbers, forgiving about how people type them: "12,000", "12k", "1.2M". */
const optCount = (label: string, max = 2_000_000_000) =>
  z.preprocess(
    (v) => {
      v = blankToNull(v);
      if (v === null) return null;
      if (typeof v === "number") return Math.round(v);
      const m = String(v).trim().toLowerCase().replace(/[,\s₹]/g, "").match(/^(\d+(?:\.\d+)?)(k|m)?$/);
      if (!m) return NaN;
      const scale = m[2] === "k" ? 1_000 : m[2] === "m" ? 1_000_000 : 1;
      return Math.round(parseFloat(m[1] ?? "") * scale);
    },
    z
      .number({ invalid_type_error: `${label} must be a number` })
      .min(0, `${label} can't be negative`)
      .max(max, `${label} looks too large`)
      .nullable()
  );

const optPercent = (label: string) =>
  z.preprocess(
    (v) => {
      v = blankToNull(v);
      if (v === null) return null;
      const n = typeof v === "number" ? v : parseFloat(String(v).replace("%", "").trim());
      return Number.isFinite(n) ? Math.round(n * 100) / 100 : NaN;
    },
    z
      .number({ invalid_type_error: `${label} must be a number` })
      .min(0, `${label} must be between 0 and 100`)
      .max(100, `${label} must be between 0 and 100`)
      .nullable()
  );

/** http(s) only — these end up in hrefs an admin clicks. */
const optUrl = (label: string) =>
  z.preprocess(
    blankToNull,
    z
      .string()
      .trim()
      .max(500, `${label} is too long`)
      .regex(/^https?:\/\/\S+$/i, `${label} must be a full link starting with https://`)
      .nullable()
  );

const instagramHandle = z.preprocess(
  (v) => {
    v = blankToNull(v);
    if (v === null) return null;
    const bare = String(v)
      .trim()
      .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, "")
      .replace(/[/?#].*$/, "");
    return normalizeHandle(bare);
  },
  z
    .string()
    .regex(/^[a-z0-9._]{1,30}$/, "Enter your Instagram username, e.g. @yourhandle")
    .nullable()
);

const nicheList = z.preprocess(
  (v) => {
    const list = Array.isArray(v) ? v : typeof v === "string" ? v.split(",") : [];
    return list.map((s) => String(s).trim()).filter(Boolean);
  },
  z
    .array(z.string().max(40, "Keep each niche under 40 characters"))
    .max(10, "List up to 10 niches")
);

// ─────────────────────────────────────────────────────────
// Briefs (Prisma `Brand`)
// ─────────────────────────────────────────────────────────

/**
 * What lives in the `Brand.requirements` Json column. The enum columns
 * (`industry`, `campaignTypes`) carry the canonical vocabulary for filtering;
 * this keeps the words the brief was written with, which is what creators
 * read ("Family Challenge", not MULTI_PLATFORM). A type alias, not an
 * interface, so it is assignable to Prisma's JSON input type.
 */
export type BriefDetails = {
  text: string;
  formats: string[];
  industryLabel: string;
};

const TIER_TO_DB: Record<BrandItem["budgetTier"], BudgetTier> = {
  Nano: "NANO",
  Micro: "MICRO",
  "Mid-Tier": "MID_TIER",
  Macro: "MACRO",
  Mega: "MEGA",
};

const TIER_FROM_DB: Record<BudgetTier, BrandItem["budgetTier"]> = {
  NANO: "Nano",
  MICRO: "Micro",
  MID_TIER: "Mid-Tier",
  MACRO: "Macro",
  MEGA: "Mega",
};

export const BUDGET_TIERS = Object.keys(TIER_TO_DB) as BrandItem["budgetTier"][];

/** First match wins, so "Food Delivery & Tech" is FOOD. */
const INDUSTRY_RULES: [RegExp, Industry][] = [
  [/food|fmcg|beverage|snack|restaurant|dairy/i, "FOOD"],
  [/beauty|skin|cosmetic|makeup|personal care/i, "BEAUTY"],
  [/fashion|apparel|clothing|activewear|footwear/i, "FASHION"],
  [/financ|fintech|bank|insur|invest/i, "FINANCE"],
  [/gaming|esports/i, "GAMING"],
  [/health|fitness|wellness|pharma/i, "HEALTH"],
  [/educat|edtech|learning/i, "EDUCATION"],
  [/entertain|media|music|film|\bott\b/i, "ENTERTAINMENT"],
  [/travel|hospitality|hotel/i, "TRAVEL"],
  [/\b(auto|automotive|motors?|cars?|bikes?)\b/i, "AUTOMOTIVE"],
  [/tech|gadget|electronic|software|\bapps?\b/i, "TECH"],
  [/lifestyle|diy|home|decor/i, "LIFESTYLE"],
];

export function industryFromLabel(label: string): Industry {
  return INDUSTRY_RULES.find(([re]) => re.test(label))?.[1] ?? "OTHER";
}

const CAMPAIGN_RULES: [RegExp, CampaignType][] = [
  [/youtube.*short|\bshorts?\b/i, "YOUTUBE_SHORT"],
  [/youtube|\bvideo\b|vlog/i, "YOUTUBE_VIDEO"],
  [/facebook.*reel/i, "FACEBOOK_REEL"],
  [/facebook/i, "FACEBOOK_POST"],
  [/\bx\b|twitter|tweet/i, "X_POST"],
  [/\bstor(y|ies)\b/i, "INSTAGRAM_STORY"],
  [/\breels?\b/i, "INSTAGRAM_REEL"],
  [/\bblog\b|article/i, "BLOG_POST"],
  [/podcast/i, "PODCAST"],
  [/\bevents?\b|meet.?up/i, "EVENT"],
  [/\bposts?\b|carousel|lookbook|haul|review/i, "INSTAGRAM_POST"],
];

export function campaignTypesFromLabels(labels: string[]): CampaignType[] {
  const types = new Set<CampaignType>();
  for (const label of labels) {
    types.add(CAMPAIGN_RULES.find(([re]) => re.test(label))?.[1] ?? "MULTI_PLATFORM");
  }
  return Array.from(types);
}

/** "INSTAGRAM_REEL" → "Instagram Reel". For rows written without BriefDetails. */
const enumLabel = (v: string) =>
  v
    .toLowerCase()
    .split("_")
    .map((w) => (w === "x" ? "X" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

export function readBriefDetails(row: Pick<Brand, "requirements" | "industry" | "campaignTypes">): BriefDetails {
  const raw = row.requirements;
  const obj = isRecord(raw) ? raw : {};
  const formats = stringList(obj.formats);
  return {
    text: typeof raw === "string" ? raw : typeof obj.text === "string" ? obj.text : "",
    formats: formats.length > 0 ? formats : row.campaignTypes.map(enumLabel),
    industryLabel:
      typeof obj.industryLabel === "string" && obj.industryLabel ? obj.industryLabel : enumLabel(row.industry),
  };
}

export type BrandRow = Brand & { _count?: { likes?: number } };

export function toBrandItem(row: BrandRow): BrandItem {
  const details = readBriefDetails(row);
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    industry: details.industryLabel,
    budgetTier: TIER_FROM_DB[row.budgetTier],
    description: row.description,
    logo: row.logo,
    coverImage: row.coverImage ?? "",
    campaignTypes: details.formats,
    requirements: details.text,
    isActive: row.isActive,
    contactEmail: row.contactEmail ?? undefined,
    website: row.website ?? undefined,
    likesCount: row._count?.likes ?? 0,
  };
}

const DEFAULT_LOGO = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&h=120&fit=crop";
const DEFAULT_COVER = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=300&fit=crop";

export const BriefInputSchema = z.object({
  name: z.string().trim().min(2, "Enter the brand name").max(80, "Brand name is too long"),
  industry: z.string().trim().min(2, "Pick an industry").max(60),
  budgetTier: z.enum(["Nano", "Micro", "Mid-Tier", "Macro", "Mega"], {
    errorMap: () => ({ message: "Pick a budget tier" }),
  }),
  description: z
    .string()
    .trim()
    .min(10, "Describe the brief in a sentence or two")
    .max(2000, "Keep the description under 2,000 characters"),
  requirements: optText(1000, "Creator requirements"),
  campaignTypes: z.preprocess(
    (v) => (typeof v === "string" ? v.split(",") : v),
    z.array(z.string().trim().max(60, "Keep each deliverable under 60 characters")).max(12)
  ),
  logo: optUrl("Logo URL"),
  coverImage: optUrl("Cover image URL"),
  contactEmail: z.preprocess(
    blankToNull,
    z.string().trim().email("Enter a valid contact email").max(120).nullable()
  ),
  website: optUrl("Website"),
});

export type BriefInput = z.infer<typeof BriefInputSchema>;

/** Prisma `Brand` create data for a validated brief. */
export function briefCreateData(input: BriefInput & { slug: string; isActive?: boolean }) {
  const formats = input.campaignTypes.filter(Boolean);
  const requirements: BriefDetails = {
    text: input.requirements ?? "",
    formats,
    industryLabel: input.industry,
  };
  return {
    name: input.name,
    slug: input.slug,
    logo: input.logo || DEFAULT_LOGO,
    coverImage: input.coverImage || DEFAULT_COVER,
    description: input.description,
    industry: industryFromLabel(input.industry),
    budgetTier: TIER_TO_DB[input.budgetTier],
    campaignTypes: campaignTypesFromLabels(formats),
    requirements,
    isActive: input.isActive ?? true,
    contactEmail: input.contactEmail ?? null,
    website: input.website ?? null,
  };
}

/** A built-in (mock-data) brief as seed input, keeping its slug. */
export function briefInputFromItem(item: BrandItem): BriefInput & { slug: string; isActive: boolean } {
  return {
    name: item.name,
    slug: item.slug,
    industry: item.industry,
    budgetTier: item.budgetTier,
    description: item.description,
    requirements: item.requirements || null,
    campaignTypes: item.campaignTypes,
    logo: item.logo || null,
    coverImage: item.coverImage || null,
    contactEmail: item.contactEmail || null,
    website: item.website || null,
    isActive: item.isActive,
  };
}

// ─────────────────────────────────────────────────────────
// Creator profile (Prisma `User` + `CreatorProfile`)
// ─────────────────────────────────────────────────────────

export const ProfileInputSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80, "Name is too long"),
  location: optText(80, "Location"),
  bio: optText(1000, "Bio"),
  niche: nicheList,
  igHandle: instagramHandle,
  igFollowers: optCount("Instagram followers"),
  igER: optPercent("Engagement rate"),
  ytChannel: optText(120, "YouTube channel"),
  ytSubscribers: optCount("YouTube subscribers"),
  ytAvgViews: optCount("YouTube average views"),
  fbFollowers: optCount("Facebook followers"),
  mediaKitUrl: optUrl("Media kit link"),
  phone: optText(30, "Phone"),
  website: optUrl("Website"),
});

export type ProfileInput = z.infer<typeof ProfileInputSchema>;

/** Splits validated profile input into the `User` name and `CreatorProfile` columns. */
export function profileUpdateData(input: ProfileInput) {
  return {
    name: input.name,
    profile: {
      location: input.location,
      bio: input.bio,
      niche: input.niche,
      igHandle: input.igHandle,
      igFollowers: input.igFollowers,
      igEngagementRate: input.igER,
      ytChannel: input.ytChannel,
      ytSubscribers: input.ytSubscribers,
      ytAvgViews: input.ytAvgViews,
      fbFollowers: input.fbFollowers,
      mediaKit: input.mediaKitUrl,
      phone: input.phone,
      website: input.website,
    },
  };
}

export function toCreatorProfile(
  user: Pick<User, "name" | "email" | "avatar">,
  row: ProfileRow | null
): CreatorProfile {
  return {
    name: user.name,
    handle: row?.igHandle ? withAt(row.igHandle) : handleFromName(user.name),
    email: user.email,
    avatar: user.avatar || defaultAvatar(user.name),
    location: str(row?.location),
    bio: str(row?.bio),
    niche: row?.niche.join(", ") ?? "",
    igHandle: withAt(row?.igHandle),
    igFollowers: str(row?.igFollowers),
    igER: str(row?.igEngagementRate),
    ytChannel: str(row?.ytChannel),
    ytSubscribers: str(row?.ytSubscribers),
    ytAvgViews: str(row?.ytAvgViews),
    fbFollowers: str(row?.fbFollowers),
    mediaKitUrl: str(row?.mediaKit),
    phone: str(row?.phone),
    website: str(row?.website),
  };
}

/** Same rule as `isProfileComplete` on the client: what a brand needs to review a pitch. */
export const isProfileRowComplete = (row: Pick<ProfileRow, "igHandle" | "niche"> | null): boolean =>
  Boolean(row?.igHandle && row.niche.length > 0);

// ─────────────────────────────────────────────────────────
// Pitches (Prisma `Application`)
// ─────────────────────────────────────────────────────────

export const PitchInputSchema = z.object({
  briefSlug: z.string().trim().min(1, "Pick a brief").max(120),
  proposal: z
    .string()
    .trim()
    .min(50, "Write at least 50 characters about your idea")
    .max(5000, "Keep the pitch under 5,000 characters"),
  // Application.expectedRate is Decimal(10, 2).
  expectedRate: optCount("Expected rate", 99_999_999),
  deliverables: z
    .array(z.string().trim().min(1).max(60))
    .min(1, "Pick at least one deliverable")
    .max(12),
  metrics: z
    .object({
      instagramHandle: optText(60, "Instagram handle"),
      instagramFollowers: optCount("Instagram followers"),
      instagramER: optText(12, "Instagram engagement rate"),
      instagramAvgLikes: optCount("Average likes"),
      instagramAvgComments: optCount("Average comments"),
      youtubeChannel: optText(120, "YouTube channel"),
      youtubeSubscribers: optCount("YouTube subscribers"),
      youtubeAvgViews: optCount("YouTube average views"),
      youtubeER: optText(12, "YouTube engagement rate"),
      facebookPage: optText(120, "Facebook page"),
      facebookFollowers: optCount("Facebook followers"),
      facebookER: optText(12, "Facebook engagement rate"),
      xHandle: optText(60, "X handle"),
      xFollowers: optCount("X followers"),
      xER: optText(12, "X engagement rate"),
    })
    .partial()
    .default({}),
  applicant: z
    .object({
      phone: optText(30, "Phone"),
      location: optText(80, "Location"),
      niche: optText(200, "Niche"),
      website: optText(300, "Website"),
    })
    .partial()
    .default({}),
});

export type PitchInput = z.infer<typeof PitchInputSchema>;

/** The `Application.metricsSnapshot` JSON: the numbers as the creator submitted them. */
export function pitchSnapshot(input: PitchInput) {
  return { ...compact(input.metrics), applicant: compact(input.applicant) };
}

export type ApplicationRow = Application & {
  creator: Pick<User, "id" | "name" | "email">;
  brand: Pick<Brand, "id" | "name" | "slug" | "logo">;
};

export function toApplicationItem(row: ApplicationRow): ApplicationItem {
  const snapshot: Record<string, unknown> = isRecord(row.metricsSnapshot) ? row.metricsSnapshot : {};
  const { applicant, ...metrics } = snapshot;
  return {
    id: row.id,
    creatorId: row.creator.id,
    creatorName: row.creator.name,
    creatorEmail: row.creator.email,
    brandName: row.brand.name,
    brandId: row.brand.id,
    brandSlug: row.brand.slug,
    brandLogo: row.brand.logo,
    status: row.status,
    date: row.createdAt.toISOString().slice(0, 10),
    proposal: row.proposal,
    expectedRate: row.expectedRate ? Number(row.expectedRate) : 0,
    deliverables: stringList(row.deliverables),
    metrics: metrics as ApplicationItem["metrics"],
    applicant: isRecord(applicant) ? (applicant as ApplicationItem["applicant"]) : undefined,
    adminNotes: row.adminNotes ?? undefined,
    reviewedAt: row.reviewedAt?.toISOString(),
  };
}

/** Statuses an admin can set. WITHDRAWN is the creator's alone. */
export const REVIEW_STATUSES = ["PENDING", "UNDER_REVIEW", "SHORTLISTED", "APPROVED", "REJECTED"] as const;

export const ApplicationReviewSchema = z
  .object({
    status: z.enum(REVIEW_STATUSES).optional(),
    adminNotes: optText(2000, "Note").optional(),
  })
  .refine((v) => v.status !== undefined || v.adminNotes !== undefined, "Nothing to update");

/** Creators withdraw only what is still being decided. */
export const WITHDRAWABLE_STATUSES: readonly ApplicationItem["status"][] = ["PENDING", "UNDER_REVIEW", "SHORTLISTED"];

/**
 * Free until the free pitches run out, then a plan (plans.ts). Withdrawn
 * pitches don't count, the same as when withdrawing deleted them.
 */
export function pitchAllowance(activePitches: number, isMember: boolean) {
  const freePitchesLeft = Math.max(0, FREE_PITCHES - activePitches);
  return { freePitchesLeft, canPitch: isMember || freePitchesLeft > 0 };
}

// ─────────────────────────────────────────────────────────
// Membership
// ─────────────────────────────────────────────────────────

export const MembershipInputSchema = z.object({
  plan: z.enum(["monthly", "all_access"], { errorMap: () => ({ message: "Pick a plan" }) }),
});

export const planToDb = (plan: PlanId): MembershipRow["plan"] =>
  plan === "monthly" ? "MONTHLY" : "ALL_ACCESS";

export const isMembershipRowActive = (
  row: Pick<MembershipRow, "status" | "expiresAt"> | null,
  now = new Date()
): boolean => Boolean(row && row.status === "ACTIVE" && (!row.expiresAt || row.expiresAt > now));

export function toClientMembership(row: MembershipRow): Membership {
  return {
    plan: row.plan === "MONTHLY" ? "monthly" : "all_access",
    status: row.status === "ACTIVE" ? "active" : "cancelled",
    activatedAt: row.activatedAt.toISOString(),
    renewsAt: row.expiresAt?.toISOString(),
    orderId: row.latestPaymentId ?? `grant_${row.id}`,
  };
}

// ─────────────────────────────────────────────────────────
// Admin creator directory & interest queue
// ─────────────────────────────────────────────────────────

/** CONTEXT.md §1 tier bands. */
export function tierForFollowers(n: number): CreatorItem["tier"] {
  if (n >= 1_000_000) return "Mega";
  if (n >= 200_000) return "Macro";
  if (n >= 50_000) return "Mid-Tier";
  if (n >= 10_000) return "Micro";
  return "Nano";
}

export type CreatorRow = Pick<User, "id" | "name" | "email" | "avatar"> & {
  creatorProfile: ProfileRow | null;
  applications: (Pick<Application, "status" | "createdAt" | "reviewedAt" | "deliverables"> & {
    brand: Pick<Brand, "name" | "logo">;
  })[];
  brandLikes: { brandId: string }[];
};

export function toCreatorItem(row: CreatorRow): CreatorItem {
  const p = row.creatorProfile;
  const active = row.applications.filter((a) => a.status !== "WITHDRAWN");
  const igFollowers = p?.igFollowers ?? 0;
  return {
    id: row.id,
    name: row.name,
    handle: p?.igHandle ? withAt(p.igHandle) : handleFromName(row.name),
    email: row.email,
    avatar: row.avatar || defaultAvatar(row.name),
    niche: p?.niche ?? [],
    location: p?.location ?? "",
    bio: p?.bio ?? "",
    tier: tierForFollowers(Math.max(igFollowers, p?.ytSubscribers ?? 0)),
    igFollowers,
    igEngagementRate: p?.igEngagementRate ? Number(p.igEngagementRate) : 0,
    igHandle: withAt(p?.igHandle),
    ytSubscribers: p?.ytSubscribers ?? undefined,
    ytAvgViews: p?.ytAvgViews != null ? p.ytAvgViews.toLocaleString("en-IN") : undefined,
    fbFollowers: p?.fbFollowers ?? undefined,
    mediaKitUrl: p?.mediaKit ?? undefined,
    verified: p?.verificationStatus === "VERIFIED",
    pitchCount: active.length,
    brandCollaborations: active
      .filter((a) => a.status === "APPROVED")
      .map((a) => ({
        brandName: a.brand.name,
        brandLogo: a.brand.logo,
        campaignTitle: `${a.brand.name} brief on Align`,
        viewsDelivered: "—",
        engagementRate: "—",
        completedAt: (a.reviewedAt ?? a.createdAt).toISOString().slice(0, 10),
        deliverableType: stringList(a.deliverables)[0] ?? "Brand collab",
      })),
    likedBrandIds: row.brandLikes.map((l) => l.brandId),
  };
}

export type LikeRow = {
  id: string;
  createdAt: Date;
  brand: Pick<Brand, "id" | "name" | "slug" | "logo" | "budgetTier">;
  user: Pick<User, "id" | "name" | "email" | "avatar"> & {
    creatorProfile: Pick<ProfileRow, "igHandle" | "location" | "igFollowers" | "igEngagementRate"> | null;
  };
};

export function toInterestItem(row: LikeRow): InterestItem {
  const p = row.user.creatorProfile;
  return {
    id: row.id,
    likedAt: row.createdAt.toISOString(),
    brand: {
      id: row.brand.id,
      name: row.brand.name,
      slug: row.brand.slug,
      logo: row.brand.logo,
      budgetTier: TIER_FROM_DB[row.brand.budgetTier],
    },
    creator: {
      id: row.user.id,
      name: row.user.name,
      email: row.user.email,
      avatar: row.user.avatar || defaultAvatar(row.user.name),
      handle: p?.igHandle ? withAt(p.igHandle) : handleFromName(row.user.name),
      location: p?.location ?? "",
      igFollowers: p?.igFollowers ?? null,
      igEngagementRate: p?.igEngagementRate ? Number(p.igEngagementRate) : null,
    },
  };
}
