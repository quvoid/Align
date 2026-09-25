/**
 * Small helpers shared between the auth layer, the register route and the
 * admin seed. No Prisma and no bcrypt here, so this stays importable from
 * anywhere including edge bundles.
 */

export const normalizeEmail = (email?: string | null): string =>
  (email ?? "").toLowerCase().trim();

/**
 * The seeded-admin allowlist.
 *
 * This replaces the previous rule that granted ADMIN to *any* address ending in
 * `@schbang.com`. A domain suffix is not authorization — it is a string an
 * attacker types into a login form. Admins are now an explicit, operator-
 * controlled list, and the database row is the real source of truth; this list
 * only decides who gets seeded/upserted as one.
 */
export const getAdminEmails = (): string[] =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => normalizeEmail(e))
    .filter(Boolean);

export const isSeededAdminEmail = (email?: string | null): boolean => {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  return getAdminEmails().includes(normalized);
};

/**
 * One-click demo passkeys are a convenience for local walkthroughs and a hole in
 * production, where anyone who finds the button becomes a seeded persona.
 */
export const isDemoModeEnabled = (): boolean =>
  process.env.NEXT_PUBLIC_DEMO_MODE === "true";

/**
 * Social handles are stored lowercased and without a leading '@' so that the
 * unique constraint actually catches "@Foodie_Priya" vs "foodie_priya".
 */
export const normalizeHandle = (handle?: string | null): string | null => {
  const trimmed = (handle ?? "").trim().toLowerCase().replace(/^@+/, "");
  return trimmed.length > 0 ? trimmed : null;
};

/**
 * A post-sign-in destination taken from the URL (`?callbackUrl=`, `?next=`).
 * Only same-origin relative paths pass; anything else (absolute URLs,
 * protocol-relative `//evil.com`, backslash tricks) falls back, so these
 * params can't be used as an open redirect.
 */
export const safeRedirectPath = (path?: string | null, fallback = ""): string => {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return fallback;
  return path;
};

/** Every sign-in path ends here; `/auth/continue` decides where to go next. */
export const postAuthUrl = (next?: string | null): string => {
  const safe = safeRedirectPath(next);
  return safe ? `/auth/continue?next=${encodeURIComponent(safe)}` : "/auth/continue";
};
