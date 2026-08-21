export const INDUSTRIES = [
  'FASHION',
  'BEAUTY',
  'FOOD',
  'TECH',
  'LIFESTYLE',
  'GAMING',
  'FINANCE',
  'HEALTH',
  'EDUCATION',
  'ENTERTAINMENT',
  'TRAVEL',
  'AUTOMOTIVE',
  'OTHER'
] as const;

export const CAMPAIGN_TYPES = [
  'INSTAGRAM_REEL',
  'INSTAGRAM_STORY',
  'INSTAGRAM_POST',
  'YOUTUBE_VIDEO',
  'YOUTUBE_SHORT',
  'FACEBOOK_POST',
  'FACEBOOK_REEL',
  'X_POST',
  'BLOG_POST',
  'PODCAST',
  'EVENT',
  'MULTI_PLATFORM'
] as const;

export const BUDGET_TIERS = [
  'NANO',
  'MICRO',
  'MID_TIER',
  'MACRO',
  'MEGA'
] as const;

export const APPLICATION_STATUSES = [
  'PENDING',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'APPROVED',
  'REJECTED',
  'WITHDRAWN'
] as const;

export const RATE_LIMITS = {
  PUBLIC: { windowMs: 15 * 60 * 1000, max: 100 },
  AUTH: { windowMs: 15 * 60 * 1000, max: 20 },
  API: { windowMs: 15 * 60 * 1000, max: 300 }
};

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 50
};
