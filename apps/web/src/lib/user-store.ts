"use client";

import { INITIAL_APPLICATIONS, type ApplicationItem } from "./mock-data";

// ─────────────────────────────────────────────────────────
// Per-user data store using localStorage
// Keyed by user email so each user has their own isolated state
// ─────────────────────────────────────────────────────────

export interface CreatorProfile {
  name: string;
  handle: string;
  email: string;
  avatar: string;
  location: string;
  bio: string;
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

export interface UserData {
  profile: CreatorProfile;
  applications: ApplicationItem[];
  likedBrandIds: string[];
  initialized: boolean;
}

const STORE_PREFIX = "align_user_";

function getStorageKey(email: string): string {
  return `${STORE_PREFIX}${email.toLowerCase().trim()}`;
}

/**
 * Creates a blank profile initialized from session data.
 * New users get empty fields — no hardcoded demo data.
 */
export function createBlankProfile(
  name: string,
  email: string,
  image?: string | null
): CreatorProfile {
  const handle = name
    ? `@${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`
    : "@yourhandle";

  return {
    name: name || "",
    handle,
    email: email || "",
    avatar:
      image ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || "user"}`,
    location: "",
    bio: "",
    niche: "",
    igHandle: "",
    igFollowers: "",
    igER: "",
    ytChannel: "",
    ytSubscribers: "",
    ytAvgViews: "",
    fbFollowers: "",
    mediaKitUrl: "",
    phone: "",
    website: "",
  };
}

/**
 * Check if this email is a known demo account and return seeded data.
 * Demo accounts get pre-populated applications so the admin panel has data to show.
 */
function isDemoAccount(email: string): boolean {
  const demoEmails = [
    "rohan@schbang.com",
    "rohan.creates@gmail.com",
    "aanya@schbang.com",
    "aanya.beauty@gmail.com",
    "sid.verma@techmail.com",
  ];
  return demoEmails.includes(email.toLowerCase().trim());
}

function getDemoApplications(email: string): ApplicationItem[] {
  const normalized = email.toLowerCase().trim();
  return INITIAL_APPLICATIONS.filter((app) => {
    if (
      normalized === "rohan@schbang.com" ||
      normalized === "rohan.creates@gmail.com"
    ) {
      return app.creatorEmail === "rohan.creates@gmail.com";
    }
    if (
      normalized === "aanya@schbang.com" ||
      normalized === "aanya.beauty@gmail.com"
    ) {
      return app.creatorEmail === "aanya.beauty@gmail.com";
    }
    if (normalized === "sid.verma@techmail.com") {
      return app.creatorEmail === "sid.verma@techmail.com";
    }
    return false;
  });
}

function getDemoProfile(email: string): Partial<CreatorProfile> {
  const normalized = email.toLowerCase().trim();
  if (
    normalized === "rohan@schbang.com" ||
    normalized === "rohan.creates@gmail.com"
  ) {
    return {
      name: "Rohan Joshi",
      handle: "@rohan_joshicomics",
      email: "rohan.creates@gmail.com",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
      location: "Mumbai, India",
      bio: "Stand-up comedian & storyteller creating relatable humorous sketches around everyday Indian family moments.",
      niche: "Comedy, Food & FMCG, Lifestyle",
      igHandle: "@rohan_joshicomics",
      igFollowers: "145000",
      igER: "6.8",
      ytChannel: "Rohan Joshi Official",
      ytSubscribers: "85000",
      ytAvgViews: "42k",
      fbFollowers: "12000",
      mediaKitUrl: "https://drive.google.com/your-media-kit",
    };
  }
  if (
    normalized === "aanya@schbang.com" ||
    normalized === "aanya.beauty@gmail.com"
  ) {
    return {
      name: "Aanya Sen",
      handle: "@aanya.beauty",
      email: "aanya.beauty@gmail.com",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      location: "Bangalore, India",
      bio: "Dermatologist-approved skincare enthusiast & clean makeup content creator sharing science-backed morning routines.",
      niche: "Beauty & Skincare, Lifestyle, Fashion",
      igHandle: "@aanya.beauty",
      igFollowers: "68000",
      igER: "7.9",
      ytChannel: "Aanya Beauty",
      ytSubscribers: "34000",
      ytAvgViews: "28k",
    };
  }
  return {};
}

function getDemoLikes(email: string): string[] {
  const normalized = email.toLowerCase().trim();
  if (
    normalized === "rohan@schbang.com" ||
    normalized === "rohan.creates@gmail.com"
  ) {
    return ["1", "2", "4"];
  }
  if (
    normalized === "aanya@schbang.com" ||
    normalized === "aanya.beauty@gmail.com"
  ) {
    return ["3", "6"];
  }
  return [];
}

// ─────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────

/**
 * Get or initialize user data for a given email.
 * Returns user-scoped profile, applications, and liked brands.
 */
export function getUserData(
  email: string,
  sessionName?: string,
  sessionImage?: string | null
): UserData {
  if (typeof window === "undefined" || !email) {
    return {
      profile: createBlankProfile(sessionName || "", email, sessionImage),
      applications: [],
      likedBrandIds: [],
      initialized: false,
    };
  }

  const key = getStorageKey(email);
  const stored = localStorage.getItem(key);

  if (stored) {
    try {
      return JSON.parse(stored) as UserData;
    } catch {
      // Corrupted data, re-initialize
    }
  }

  // First time — initialize with blank or demo data
  const isDemo = isDemoAccount(email);
  const blankProfile = createBlankProfile(
    sessionName || "",
    email,
    sessionImage
  );
  const demoOverrides = isDemo ? getDemoProfile(email) : {};

  const userData: UserData = {
    profile: { ...blankProfile, ...demoOverrides },
    applications: isDemo ? getDemoApplications(email) : [],
    likedBrandIds: isDemo ? getDemoLikes(email) : [],
    initialized: true,
  };

  localStorage.setItem(key, JSON.stringify(userData));
  return userData;
}

/**
 * Save full user data back to localStorage.
 */
export function saveUserData(email: string, data: UserData): void {
  if (typeof window === "undefined" || !email) return;
  localStorage.setItem(getStorageKey(email), JSON.stringify(data));
}

/**
 * Update only the user's profile.
 */
export function updateProfile(
  email: string,
  profile: CreatorProfile
): void {
  const data = getUserData(email);
  data.profile = profile;
  saveUserData(email, data);
}

/**
 * Add a new application to the user's list.
 */
export function addApplication(
  email: string,
  application: ApplicationItem
): void {
  const data = getUserData(email);
  // Prevent duplicate applications to the same brand
  const existing = data.applications.find(
    (a) => a.brandId === application.brandId
  );
  if (!existing) {
    data.applications = [application, ...data.applications];
    saveUserData(email, data);
  }
}

/**
 * Remove an application by ID.
 */
export function removeApplication(email: string, applicationId: string): void {
  const data = getUserData(email);
  data.applications = data.applications.filter((a) => a.id !== applicationId);
  saveUserData(email, data);
}

/**
 * Toggle a brand like. Returns the new liked state.
 */
export function toggleLike(email: string, brandId: string): boolean {
  const data = getUserData(email);
  const idx = data.likedBrandIds.indexOf(brandId);
  if (idx >= 0) {
    data.likedBrandIds.splice(idx, 1);
    saveUserData(email, data);
    return false;
  } else {
    data.likedBrandIds.push(brandId);
    saveUserData(email, data);
    return true;
  }
}

/**
 * Get just the liked brand IDs for a user.
 */
export function getLikedBrandIds(email: string): string[] {
  const data = getUserData(email);
  return data.likedBrandIds;
}
