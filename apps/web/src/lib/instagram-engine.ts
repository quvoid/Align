/**
 * Instagram Intelligence & Paid Collaborations Engine
 * Implements the algorithms from the Instagram Scraping & API Architecture Guide:
 * - Paid Boost Detection Algorithm (Like-to-View ratio & View Multiplier)
 * - 4-Tier Partnership Hierarchy Classification
 * - NLP Creative Content Genre Taxonomy
 * - Creator Audience Sizing
 * - Per-Brand Competitor Tracking Registry (max 4 competitors per brand)
 * - Multi-Brand Head-to-Head Benchmarking Data & Analyzer
 */

export type PartnershipTier = 'TIER_1' | 'TIER_2' | 'TIER_3' | 'TIER_4';

export interface TierInfo {
  tier: PartnershipTier;
  code: string;
  name: string;
  badge: string;
  description: string;
  color: string;
  bgLight: string;
  borderColor: string;
}

export const PARTNERSHIP_TIERS: Record<PartnershipTier, TierInfo> = {
  TIER_1: {
    tier: 'TIER_1',
    code: 'Tier 1',
    name: 'Formal Paid Partnership + Paid Boost',
    badge: '🟢 Tier 1 (Paid + Ad Spend)',
    description: 'Formal paid partnership toggle ON (#ad / is_paid) backed by targeted video ad spend push.',
    color: '#16a34a',
    bgLight: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  TIER_2: {
    tier: 'TIER_2',
    code: 'Tier 2',
    name: 'Formal Paid Partnership (Organic Only)',
    badge: '🟢 Tier 2 (Paid Organic)',
    description: 'Formal paid partnership toggle ON, performing through natural creator reach without ad boost.',
    color: '#059669',
    bgLight: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  TIER_3: {
    tier: 'TIER_3',
    code: 'Tier 3',
    name: 'Standard Collab + Paid Boost (Dark Ads / Push)',
    badge: '🚀 Tier 3 (Collab + Ad Spend)',
    description: 'Standard co-author collab (toggle OFF) amplified with paid ad spend to drive views.',
    color: '#ea580c',
    bgLight: '#fff7ed',
    borderColor: '#fed7aa',
  },
  TIER_4: {
    tier: 'TIER_4',
    code: 'Tier 4',
    name: 'Standard Organic Collab',
    badge: '⚪ Tier 4 (Organic Collab)',
    description: 'Standard organic collaboration / tagged co-author with baseline community engagement.',
    color: '#6b7280',
    bgLight: '#f9fafb',
    borderColor: '#e5e7eb',
  },
};

export type CreativeGenre =
  | 'Celebrity Ambassador'
  | 'Styling & OOTD'
  | 'Unboxing & Review'
  | 'Craft Lore & Material Storytelling'
  | 'Gifting & Festive Drops'
  | 'Store Walkthrough'
  | 'Comedy & Relatable Skits';

export interface BoostAnalysis {
  isBoosted: boolean;
  status: string;
  reason: string;
  likeToViewPct: number;
  viewMultiplier: number;
  engagementRate: number;
}

export interface CompetitorPostCollab {
  id: string;
  shortcode: string;
  url: string;
  date: string;
  creatorHandle: string;
  creatorName: string;
  creatorAvatar: string;
  creatorFollowers: number;
  creatorTier: string;
  views: number;
  likes: number;
  comments: number;
  likeToViewPct: number;
  isPaidToggle: boolean;
  isBoosted: boolean;
  tier: PartnershipTier;
  genre: CreativeGenre;
  caption: string;
  boostReason: string;
}

export interface BrandProfileStats {
  handle: string;
  name: string;
  avatar: string;
  followers: number;
  following: number;
  totalPosts: number;
  collabsAnalyzed: number;
  totalViewsDelivered: number;
  avgEngagementRate: number;
  avgLikesPerPost: number;
  tierDistribution: Record<PartnershipTier, number>;
  genreDistribution: Record<CreativeGenre, number>;
  audienceTierDistribution: Record<string, number>;
  paidAdSpendRatioPct: number; // (Tier 1 + Tier 3) / Total
  topCreators: CompetitorPostCollab[];
}

export interface HeadToHeadBenchmark {
  id: string;
  brandSlug: string;
  brandName: string;
  competitorSlug: string;
  competitorName: string;
  industry: string;
  brand: BrandProfileStats;
  competitor: BrandProfileStats;
  shareOfVoicePct: { brand: number; competitor: number };
  aiStrategicInsights: string[];
  recommendedCounterPlays: string[];
}

// ─────────────────────────────────────────────────────────
// Per-Brand Competitor Tracking Types
// ─────────────────────────────────────────────────────────

export interface TrackedCompetitor {
  id: string;
  igHandle: string;
  name: string;
  avatar: string;
  addedAt: string;
  stats: BrandProfileStats;
}

export interface BrandCompetitorConfig {
  brandSlug: string;
  brandName: string;
  brandIndustry: string;
  brandStats: BrandProfileStats;
  competitors: TrackedCompetitor[];
}

// ─────────────────────────────────────────────────────────
// Mathematical Algorithms from Architecture Guide
// ─────────────────────────────────────────────────────────

/**
 * Mathematical Boost Detection Engine (Section 5.2 of Guide)
 * Evaluates like-to-view percentage and follower multipliers.
 */
export function detectBoost(
  views: number,
  likes: number,
  comments: number,
  creatorFollowers: number = 100000
): BoostAnalysis {
  const safeFollowers = Math.max(creatorFollowers, 1000);
  const likeToViewPct = views > 0 ? Number(((likes / views) * 100).toFixed(2)) : 0;
  const viewMultiplier = Number((views / safeFollowers).toFixed(1));
  const engagementRate = Number((((likes + comments) / safeFollowers) * 100).toFixed(2));

  if (views >= 500000 && likeToViewPct < 0.35) {
    return {
      isBoosted: true,
      status: '🚀 Heavily Boosted (Paid Ad Spend)',
      reason: `High view count (${views.toLocaleString()}) with sub-0.35% like rate (${likeToViewPct}%) indicates paid video ads.`,
      likeToViewPct,
      viewMultiplier,
      engagementRate,
    };
  }

  if (viewMultiplier >= 5.0 && likeToViewPct < 0.70) {
    return {
      isBoosted: true,
      status: '🚀 Boosted (Paid Ad Spend)',
      reason: `High view multiplier (${viewMultiplier}x followers) with low like rate (${likeToViewPct}%).`,
      likeToViewPct,
      viewMultiplier,
      engagementRate,
    };
  }

  if (viewMultiplier >= 3.0 && likeToViewPct < 1.00 && views >= 80000) {
    return {
      isBoosted: true,
      status: '🔍 Likely Boosted (Targeted Ad)',
      reason: `Disproportionate views (${views.toLocaleString()}) relative to organic likes (${likes.toLocaleString()}).`,
      likeToViewPct,
      viewMultiplier,
      engagementRate,
    };
  }

  if (engagementRate >= 4.0 && likeToViewPct >= 2.00) {
    return {
      isBoosted: false,
      status: '📈 Viral Organic Reach',
      reason: `High organic views with strong organic community engagement (${likeToViewPct}%).`,
      likeToViewPct,
      viewMultiplier,
      engagementRate,
    };
  }

  return {
    isBoosted: false,
    status: '⚪ Standard Organic',
    reason: 'Baseline organic collaboration reach.',
    likeToViewPct,
    viewMultiplier,
    engagementRate,
  };
}

/**
 * 4-Tier Partnership Hierarchy Classifier (Section 5.1 of Guide)
 */
export function classifyPartnershipTier(
  isPaidToggle: boolean,
  isBoosted: boolean
): PartnershipTier {
  if (isPaidToggle && isBoosted) return 'TIER_1';
  if (isPaidToggle && !isBoosted) return 'TIER_2';
  if (!isPaidToggle && isBoosted) return 'TIER_3';
  return 'TIER_4';
}

/**
 * Creator Audience Sizing (Section 6.1 of Guide)
 */
export function getCreatorAudienceTier(followers: number): string {
  if (followers >= 1000000) return '🌟 Mega (1M+)';
  if (followers >= 100000) return '🚀 Macro (100K - 1M)';
  if (followers >= 50000) return '✨ Mid-Tier (50K - 100K)';
  if (followers >= 10000) return '🎯 Micro (10K - 50K)';
  return '🌱 Nano (<10K)';
}

/**
 * NLP Video Content Genre Taxonomy Classifier (Section 6.2 of Guide)
 */
export function classifyCreativeGenre(
  caption: string,
  coauthors: string[] = []
): CreativeGenre {
  const text = (caption + ' ' + coauthors.join(' ')).toLowerCase();

  if (
    text.includes('ambassador') ||
    text.includes('face of') ||
    text.includes('co-founder') ||
    text.includes('kareena') ||
    text.includes('ranveer') ||
    text.includes('deepika') ||
    text.includes('virat') ||
    text.includes('celebrity')
  ) {
    return 'Celebrity Ambassador';
  }

  if (
    text.includes('styling') ||
    text.includes('how to style') ||
    text.includes('outfit') ||
    text.includes('ootd') ||
    text.includes('grwm') ||
    text.includes('lookbook') ||
    text.includes('fit check') ||
    text.includes('drip')
  ) {
    return 'Styling & OOTD';
  }

  if (
    text.includes('unboxing') ||
    text.includes('unbox') ||
    text.includes('try on') ||
    text.includes('haul') ||
    text.includes('first look') ||
    text.includes('review') ||
    text.includes('got this')
  ) {
    return 'Unboxing & Review';
  }

  if (
    text.includes('demi-fine') ||
    text.includes('anti-tarnish') ||
    text.includes('waterproof') ||
    text.includes('18k gold') ||
    text.includes('silver') ||
    text.includes('handmade') ||
    text.includes('craftsmanship') ||
    text.includes('recipe') ||
    text.includes('ingredients') ||
    text.includes('baking')
  ) {
    return 'Craft Lore & Material Storytelling';
  }

  if (
    text.includes('gift') ||
    text.includes('gifting') ||
    text.includes('valentine') ||
    text.includes('rakhi') ||
    text.includes('diwali') ||
    text.includes('festive') ||
    text.includes('anniversary') ||
    text.includes('birthday') ||
    text.includes('celebration')
  ) {
    return 'Gifting & Festive Drops';
  }

  if (
    text.includes('store') ||
    text.includes('visit') ||
    text.includes('shopping') ||
    text.includes('walkthrough') ||
    text.includes('pop-up') ||
    text.includes('outlet') ||
    text.includes('flagship') ||
    text.includes('cafe')
  ) {
    return 'Store Walkthrough';
  }

  return 'Comedy & Relatable Skits';
}

// ─────────────────────────────────────────────────────────
// Shared Creator Avatar Pool
// ─────────────────────────────────────────────────────────
const AVATARS = {
  rohan: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
  kabir: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  tanmay: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  priya: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  kusha: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
  riki: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
  ankit: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  aman: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  neha: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
  arjun: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
  divya: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop',
  vikram: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop',
  meera: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop',
  siddharth: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
  aanya: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
  rahul: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
};

// ─────────────────────────────────────────────────────────
// Per-Brand Competitor Registry (Last 1 Year: Sep 2025 – Aug 2026)
// ─────────────────────────────────────────────────────────

function makeCompetitorStats(
  handle: string,
  name: string,
  avatar: string,
  followers: number,
  collabs: number,
  views: number,
  er: number,
  boostPct: number,
  tiers: Record<PartnershipTier, number>,
  genres: Record<CreativeGenre, number>,
  creators: CompetitorPostCollab[]
): BrandProfileStats {
  return {
    handle,
    name,
    avatar,
    followers,
    following: Math.floor(followers * 0.0003),
    totalPosts: Math.floor(followers * 0.003),
    collabsAnalyzed: collabs,
    totalViewsDelivered: views,
    avgEngagementRate: er,
    avgLikesPerPost: Math.floor(views / collabs * er / 100),
    paidAdSpendRatioPct: boostPct,
    tierDistribution: tiers,
    genreDistribution: genres,
    audienceTierDistribution: {
      '🌟 Mega (1M+)': Math.floor(collabs * 0.1),
      '🚀 Macro (100K - 1M)': Math.floor(collabs * 0.45),
      '✨ Mid-Tier (50K - 100K)': Math.floor(collabs * 0.25),
      '🎯 Micro (10K - 50K)': Math.floor(collabs * 0.15),
      '🌱 Nano (<10K)': Math.floor(collabs * 0.05),
    },
    topCreators: creators,
  };
}

const DEFAULT_GENRES: Record<CreativeGenre, number> = {
  'Comedy & Relatable Skits': 0,
  'Styling & OOTD': 0,
  'Unboxing & Review': 0,
  'Craft Lore & Material Storytelling': 0,
  'Gifting & Festive Drops': 0,
  'Celebrity Ambassador': 0,
  'Store Walkthrough': 0,
};

export const BRAND_COMPETITOR_REGISTRY: Record<string, BrandCompetitorConfig> = {
  // ──── BRITANNIA ────
  britannia: {
    brandSlug: 'britannia',
    brandName: 'Britannia',
    brandIndustry: 'Food & FMCG',
    brandStats: makeCompetitorStats(
      '@britannia_goodday', 'Britannia Industries',
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=150&h=150&fit=crop',
      480000, 28, 14800000, 6.4, 42.8,
      { TIER_1: 8, TIER_2: 12, TIER_3: 4, TIER_4: 4 },
      { ...DEFAULT_GENRES, 'Comedy & Relatable Skits': 12, 'Craft Lore & Material Storytelling': 8, 'Gifting & Festive Drops': 5, 'Celebrity Ambassador': 2, 'Unboxing & Review': 1 },
      [
        { id: 'b_c1', shortcode: 'C3xA9k1m', url: 'https://instagram.com/p/C3xA9k1m/', date: '2026-02-18', creatorHandle: '@rohan_joshicomics', creatorName: 'Rohan Joshi', creatorAvatar: AVATARS.rohan, creatorFollowers: 145000, creatorTier: '🚀 Macro (100K - 1M)', views: 820000, likes: 60680, comments: 840, likeToViewPct: 7.4, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Comedy & Relatable Skits', caption: 'When 3 generations fight for the last Jim Jam biscuit during Sunday match! #GoodDay #ad', boostReason: 'High organic engagement with strong community comments.' },
        { id: 'b_c2', shortcode: 'C2yB8p3x', url: 'https://instagram.com/p/C2yB8p3x/', date: '2026-06-10', creatorHandle: '@kabir_explores', creatorName: 'Kabir Seth', creatorAvatar: AVATARS.kabir, creatorFollowers: 285000, creatorTier: '🚀 Macro (100K - 1M)', views: 1100000, likes: 92400, comments: 1120, likeToViewPct: 8.4, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Craft Lore & Material Storytelling', caption: 'Morning cutting chai meets Britannia toast across Old Delhi tea stalls. #GoodDayEveryDay #ad', boostReason: 'Viral organic foodie reach with high watch time.' },
        { id: 'b_c3', shortcode: 'CaB3x1z', url: 'https://instagram.com/p/CaB3x1z/', date: '2025-11-08', creatorHandle: '@neha_cooks', creatorName: 'Neha Sharma', creatorAvatar: AVATARS.neha, creatorFollowers: 78000, creatorTier: '✨ Mid-Tier (50K - 100K)', views: 340000, likes: 18200, comments: 320, likeToViewPct: 5.35, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Craft Lore & Material Storytelling', caption: 'Baking Good Day cookies into a cheesecake base! Recipe in bio #BakeWithBritannia #ad', boostReason: 'Strong mid-tier recipe community engagement.' },
        { id: 'b_c4', shortcode: 'CkR9m2p', url: 'https://instagram.com/p/CkR9m2p/', date: '2026-04-22', creatorHandle: '@arjun_bites', creatorName: 'Arjun Mehta', creatorAvatar: AVATARS.arjun, creatorFollowers: 210000, creatorTier: '🚀 Macro (100K - 1M)', views: 680000, likes: 45900, comments: 540, likeToViewPct: 6.75, isPaidToggle: false, isBoosted: false, tier: 'TIER_4', genre: 'Comedy & Relatable Skits', caption: 'The 2 AM biscuit raid nobody talks about 😂 #MidnightSnack', boostReason: 'Organic collab with authentic audience interaction.' },
      ]
    ),
    competitors: [
      {
        id: 'tc_parle', igHandle: '@parleg_official', name: 'Parle Products',
        avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&h=150&fit=crop',
        addedAt: '2025-09-01',
        stats: makeCompetitorStats(
          '@parleg_official', 'Parle Products',
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&h=150&fit=crop',
          390000, 24, 11200000, 4.8, 62.5,
          { TIER_1: 12, TIER_2: 5, TIER_3: 3, TIER_4: 4 },
          { ...DEFAULT_GENRES, 'Comedy & Relatable Skits': 14, 'Gifting & Festive Drops': 6, 'Craft Lore & Material Storytelling': 2, 'Celebrity Ambassador': 2 },
          [
            { id: 'p_c1', shortcode: 'C3zP1q9a', url: 'https://instagram.com/p/C3zP1q9a/', date: '2026-02-14', creatorHandle: '@tanmay_creates', creatorName: 'Tanmay Sharma', creatorAvatar: AVATARS.tanmay, creatorFollowers: 420000, creatorTier: '🚀 Macro (100K - 1M)', views: 1850000, likes: 4810, comments: 210, likeToViewPct: 0.26, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Comedy & Relatable Skits', caption: 'Parle-G dipping timing is an olympic sport! #GMaaneGenius #ParleG #PaidPartnership', boostReason: 'High view volume (1.85M) with 0.26% like rate indicates heavy Meta paid video ad amplification.' },
            { id: 'p_c2', shortcode: 'C2wX7m4l', url: 'https://instagram.com/p/C2wX7m4l/', date: '2026-05-04', creatorHandle: '@priya_diaries', creatorName: 'Priya Verma', creatorAvatar: AVATARS.priya, creatorFollowers: 95000, creatorTier: '✨ Mid-Tier (50K - 100K)', views: 740000, likes: 4070, comments: 95, likeToViewPct: 0.55, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Gifting & Festive Drops', caption: 'Tea time is incomplete without Hide & Seek cookies. #ChaiPartner #Parle #ad', boostReason: '7.8x follower view multiplier with 0.55% like rate indicates paid ad spend.' },
            { id: 'p_c3', shortcode: 'C1aB5k9t', url: 'https://instagram.com/p/C1aB5k9t/', date: '2026-01-22', creatorHandle: '@ankit_vines', creatorName: 'Ankit Gupta', creatorAvatar: AVATARS.ankit, creatorFollowers: 650000, creatorTier: '🚀 Macro (100K - 1M)', views: 920000, likes: 47840, comments: 680, likeToViewPct: 5.2, isPaidToggle: false, isBoosted: false, tier: 'TIER_4', genre: 'Comedy & Relatable Skits', caption: 'School lunchbox nostalgia with Parle Monaco. Tag that one friend!', boostReason: 'Organic co-author sketch with healthy organic community interaction.' },
            { id: 'p_c4', shortcode: 'DpQ3r1s9', url: 'https://instagram.com/p/DpQ3r1s9/', date: '2025-10-12', creatorHandle: '@divya_lifestyle', creatorName: 'Divya Kapoor', creatorAvatar: AVATARS.divya, creatorFollowers: 180000, creatorTier: '🚀 Macro (100K - 1M)', views: 560000, likes: 32100, comments: 420, likeToViewPct: 5.73, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Gifting & Festive Drops', caption: 'Diwali sweet boxes featuring Parle 20-20 Cookies! #FestiveSeason #ad', boostReason: 'Organic festive content with high comment velocity.' },
            { id: 'p_c5', shortcode: 'EmX8t3u2', url: 'https://instagram.com/p/EmX8t3u2/', date: '2026-07-18', creatorHandle: '@rahul_comedy', creatorName: 'Rahul Verma', creatorAvatar: AVATARS.rahul, creatorFollowers: 520000, creatorTier: '🚀 Macro (100K - 1M)', views: 1100000, likes: 3200, comments: 150, likeToViewPct: 0.29, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Comedy & Relatable Skits', caption: 'Boss meeting chai break starter pack ft Parle-G #OfficeLife #ad', boostReason: '0.29% like rate on 1.1M views indicates heavy paid ad boost.' },
          ]
        ),
      },
      {
        id: 'tc_itc', igHandle: '@sunfeast_india', name: 'ITC Sunfeast',
        avatar: 'https://images.unsplash.com/photo-1486427944544-d2c246c4df4c?w=150&h=150&fit=crop',
        addedAt: '2025-09-15',
        stats: makeCompetitorStats(
          '@sunfeast_india', 'ITC Sunfeast',
          'https://images.unsplash.com/photo-1486427944544-d2c246c4df4c?w=150&h=150&fit=crop',
          280000, 18, 7200000, 5.2, 55.5,
          { TIER_1: 8, TIER_2: 4, TIER_3: 2, TIER_4: 4 },
          { ...DEFAULT_GENRES, 'Celebrity Ambassador': 6, 'Craft Lore & Material Storytelling': 5, 'Comedy & Relatable Skits': 4, 'Unboxing & Review': 3 },
          [
            { id: 'itc_c1', shortcode: 'FnL2p8q', url: 'https://instagram.com/p/FnL2p8q/', date: '2026-03-10', creatorHandle: '@vikram_eats', creatorName: 'Vikram Rao', creatorAvatar: AVATARS.vikram, creatorFollowers: 310000, creatorTier: '🚀 Macro (100K - 1M)', views: 890000, likes: 2670, comments: 130, likeToViewPct: 0.3, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Celebrity Ambassador', caption: 'Virat Kohli x Sunfeast Dark Fantasy — the legend approves! #ad', boostReason: '0.30% like rate on 890K views = heavy paid ad spend.' },
            { id: 'itc_c2', shortcode: 'GoM3q9r', url: 'https://instagram.com/p/GoM3q9r/', date: '2026-06-22', creatorHandle: '@meera_bakes', creatorName: 'Meera Iyer', creatorAvatar: AVATARS.meera, creatorFollowers: 62000, creatorTier: '✨ Mid-Tier (50K - 100K)', views: 420000, likes: 24800, comments: 380, likeToViewPct: 5.9, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Craft Lore & Material Storytelling', caption: 'Dark Fantasy cookie crumble cake in 15 mins! Full recipe below #BakeWithSunfeast #ad', boostReason: 'Strong organic baking community engagement.' },
            { id: 'itc_c3', shortcode: 'HpN4r0s', url: 'https://instagram.com/p/HpN4r0s/', date: '2025-12-05', creatorHandle: '@siddharth_laughs', creatorName: 'Siddharth Menon', creatorAvatar: AVATARS.siddharth, creatorFollowers: 180000, creatorTier: '🚀 Macro (100K - 1M)', views: 670000, likes: 38500, comments: 480, likeToViewPct: 5.74, isPaidToggle: false, isBoosted: false, tier: 'TIER_4', genre: 'Comedy & Relatable Skits', caption: 'When mom catches you dipping Dark Fantasy in dal. Tag someone! 😂', boostReason: 'Organic comedy collab.' },
          ]
        ),
      },
      {
        id: 'tc_mondelez', igHandle: '@cadbury_oreo_in', name: 'Mondelez (Oreo India)',
        avatar: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=150&h=150&fit=crop',
        addedAt: '2025-10-01',
        stats: makeCompetitorStats(
          '@cadbury_oreo_in', 'Mondelez (Oreo India)',
          'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=150&h=150&fit=crop',
          620000, 32, 18500000, 7.1, 46.8,
          { TIER_1: 10, TIER_2: 14, TIER_3: 5, TIER_4: 3 },
          { ...DEFAULT_GENRES, 'Comedy & Relatable Skits': 16, 'Celebrity Ambassador': 8, 'Gifting & Festive Drops': 4, 'Craft Lore & Material Storytelling': 4 },
          [
            { id: 'mon_c1', shortcode: 'IqO5s1t', url: 'https://instagram.com/p/IqO5s1t/', date: '2026-01-14', creatorHandle: '@rohan_joshicomics', creatorName: 'Rohan Joshi', creatorAvatar: AVATARS.rohan, creatorFollowers: 145000, creatorTier: '🚀 Macro (100K - 1M)', views: 940000, likes: 68400, comments: 920, likeToViewPct: 7.27, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Comedy & Relatable Skits', caption: 'Twist, lick, dunk — but when you run out of milk 🥲 #Oreo #ad', boostReason: 'High organic engagement.' },
            { id: 'mon_c2', shortcode: 'JrP6t2u', url: 'https://instagram.com/p/JrP6t2u/', date: '2026-04-08', creatorHandle: '@aanya_beauty', creatorName: 'Aanya Sen', creatorAvatar: AVATARS.aanya, creatorFollowers: 290000, creatorTier: '🚀 Macro (100K - 1M)', views: 1600000, likes: 4320, comments: 180, likeToViewPct: 0.27, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Celebrity Ambassador', caption: 'Cadbury Dairy Milk Oreo launch event! 💜 #CadburyXOreo #PaidPartnership', boostReason: '0.27% like rate on 1.6M views = heavy paid ad spend.' },
            { id: 'mon_c3', shortcode: 'KsQ7u3v', url: 'https://instagram.com/p/KsQ7u3v/', date: '2026-08-02', creatorHandle: '@neha_cooks', creatorName: 'Neha Sharma', creatorAvatar: AVATARS.neha, creatorFollowers: 78000, creatorTier: '✨ Mid-Tier (50K - 100K)', views: 310000, likes: 19200, comments: 280, likeToViewPct: 6.19, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Craft Lore & Material Storytelling', caption: 'Oreo milkshake 3 ways for every mood 🍫🥛 #OreoRecipes #ad', boostReason: 'Organic recipe community.' },
          ]
        ),
      },
    ],
  },

  // ──── SWIGGY ────
  swiggy: {
    brandSlug: 'swiggy',
    brandName: 'Swiggy',
    brandIndustry: 'Food Delivery & Tech',
    brandStats: makeCompetitorStats(
      '@swiggy_india', 'Swiggy India',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&h=150&fit=crop',
      890000, 36, 28400000, 7.2, 38.8,
      { TIER_1: 10, TIER_2: 18, TIER_3: 4, TIER_4: 4 },
      { ...DEFAULT_GENRES, 'Comedy & Relatable Skits': 18, 'Gifting & Festive Drops': 8, 'Store Walkthrough': 6, 'Celebrity Ambassador': 4 },
      []
    ),
    competitors: [
      {
        id: 'tc_zomato', igHandle: '@zomato', name: 'Zomato',
        avatar: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150&h=150&fit=crop',
        addedAt: '2025-09-01',
        stats: makeCompetitorStats(
          '@zomato', 'Zomato',
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150&h=150&fit=crop',
          1100000, 42, 34200000, 8.4, 54.7,
          { TIER_1: 18, TIER_2: 12, TIER_3: 5, TIER_4: 7 },
          { ...DEFAULT_GENRES, 'Comedy & Relatable Skits': 26, 'Celebrity Ambassador': 8, 'Gifting & Festive Drops': 5, 'Store Walkthrough': 3 },
          [
            { id: 'z_c1', shortcode: 'Cz8P9k2x', url: 'https://instagram.com/p/Cz8P9k2x/', date: '2026-02-15', creatorHandle: '@kusha_kapila', creatorName: 'Kusha Kapila', creatorAvatar: AVATARS.kusha, creatorFollowers: 3400000, creatorTier: '🌟 Mega (1M+)', views: 4200000, likes: 312000, comments: 2400, likeToViewPct: 7.4, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Comedy & Relatable Skits', caption: 'When midnight biryani arrives before your existential crisis. #ZomatoDelivery #ad', boostReason: 'Boosted national reach with high celebrity engagement multiplier.' },
            { id: 'z_c2', shortcode: 'Cz1L4m9p', url: 'https://instagram.com/p/Cz1L4m9p/', date: '2026-05-08', creatorHandle: '@foodie_delhi6', creatorName: 'Aman Chawla', creatorAvatar: AVATARS.aman, creatorFollowers: 180000, creatorTier: '🚀 Macro (100K - 1M)', views: 940000, likes: 4880, comments: 110, likeToViewPct: 0.51, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Store Walkthrough', caption: 'Late night butter chicken hunt in Chandni Chowk. Order on Zomato now! #ZomatoEats #ad', boostReason: '5.2x view multiplier with 0.51% like rate indicates paid ad spend.' },
            { id: 'z_c3', shortcode: 'DaR7n0q', url: 'https://instagram.com/p/DaR7n0q/', date: '2025-11-20', creatorHandle: '@arjun_bites', creatorName: 'Arjun Mehta', creatorAvatar: AVATARS.arjun, creatorFollowers: 210000, creatorTier: '🚀 Macro (100K - 1M)', views: 520000, likes: 34100, comments: 460, likeToViewPct: 6.55, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Comedy & Relatable Skits', caption: 'POV: You ordered for 1 but Zomato gave you portions for 4 😂 #ad', boostReason: 'Organic viral comedic content.' },
            { id: 'z_c4', shortcode: 'EbS8o1r', url: 'https://instagram.com/p/EbS8o1r/', date: '2026-07-30', creatorHandle: '@divya_lifestyle', creatorName: 'Divya Kapoor', creatorAvatar: AVATARS.divya, creatorFollowers: 180000, creatorTier: '🚀 Macro (100K - 1M)', views: 780000, likes: 2340, comments: 95, likeToViewPct: 0.3, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Celebrity Ambassador', caption: 'Zomato x Ranveer Singh monsoon special menu launch! 🌧️🍛 #ad', boostReason: 'Sub-0.30% like rate with celebrity = heavy ad spend.' },
          ]
        ),
      },
      {
        id: 'tc_blinkit', igHandle: '@letsblinkit', name: 'Blinkit',
        avatar: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=150&fit=crop',
        addedAt: '2025-10-15',
        stats: makeCompetitorStats(
          '@letsblinkit', 'Blinkit',
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=150&fit=crop',
          420000, 16, 8400000, 5.6, 68.7,
          { TIER_1: 8, TIER_2: 3, TIER_3: 3, TIER_4: 2 },
          { ...DEFAULT_GENRES, 'Comedy & Relatable Skits': 10, 'Unboxing & Review': 4, 'Store Walkthrough': 2 },
          [
            { id: 'bl_c1', shortcode: 'FcT9p2s', url: 'https://instagram.com/p/FcT9p2s/', date: '2026-03-18', creatorHandle: '@tanmay_creates', creatorName: 'Tanmay Sharma', creatorAvatar: AVATARS.tanmay, creatorFollowers: 420000, creatorTier: '🚀 Macro (100K - 1M)', views: 1200000, likes: 3600, comments: 140, likeToViewPct: 0.3, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Comedy & Relatable Skits', caption: '10 minute delivery challenge at 3 AM! Does Blinkit actually deliver? #ad', boostReason: '0.30% like rate on 1.2M views = paid ad amplification.' },
            { id: 'bl_c2', shortcode: 'GdU0q3t', url: 'https://instagram.com/p/GdU0q3t/', date: '2026-06-12', creatorHandle: '@siddharth_laughs', creatorName: 'Siddharth Menon', creatorAvatar: AVATARS.siddharth, creatorFollowers: 180000, creatorTier: '🚀 Macro (100K - 1M)', views: 540000, likes: 1620, comments: 80, likeToViewPct: 0.3, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Unboxing & Review', caption: 'Blinkit party pack unboxing for the weekend! Review of snacks delivered in 8 mins #ad', boostReason: '0.30% like rate on 540K views indicates paid ad spend.' },
          ]
        ),
      },
      {
        id: 'tc_eatsure', igHandle: '@eatsure_official', name: 'EatSure',
        avatar: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop',
        addedAt: '2025-11-01',
        stats: makeCompetitorStats(
          '@eatsure_official', 'EatSure',
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop',
          180000, 12, 3800000, 4.2, 50.0,
          { TIER_1: 4, TIER_2: 3, TIER_3: 2, TIER_4: 3 },
          { ...DEFAULT_GENRES, 'Unboxing & Review': 6, 'Comedy & Relatable Skits': 4, 'Store Walkthrough': 2 },
          [
            { id: 'es_c1', shortcode: 'HeV1r4u', url: 'https://instagram.com/p/HeV1r4u/', date: '2026-04-05', creatorHandle: '@vikram_eats', creatorName: 'Vikram Rao', creatorAvatar: AVATARS.vikram, creatorFollowers: 310000, creatorTier: '🚀 Macro (100K - 1M)', views: 480000, likes: 28800, comments: 340, likeToViewPct: 6.0, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Unboxing & Review', caption: 'Ordering from 5 restaurants in 1 EatSure order — does it work? Review! #ad', boostReason: 'Organic review engagement.' },
          ]
        ),
      },
    ],
  },

  // ──── NIVEA ────
  nivea: {
    brandSlug: 'nivea',
    brandName: 'NIVEA India',
    brandIndustry: 'Beauty & Skincare',
    brandStats: makeCompetitorStats(
      '@niveaindia', 'NIVEA India',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=150&h=150&fit=crop',
      520000, 22, 9600000, 6.8, 36.3,
      { TIER_1: 6, TIER_2: 12, TIER_3: 2, TIER_4: 2 },
      { ...DEFAULT_GENRES, 'Styling & OOTD': 10, 'Unboxing & Review': 6, 'Craft Lore & Material Storytelling': 4, 'Celebrity Ambassador': 2 },
      []
    ),
    competitors: [
      {
        id: 'tc_mamaearth', igHandle: '@mamaearth.in', name: 'Mamaearth',
        avatar: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop',
        addedAt: '2025-09-01',
        stats: makeCompetitorStats(
          '@mamaearth.in', 'Mamaearth',
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop',
          1200000, 48, 22800000, 5.1, 70.8,
          { TIER_1: 28, TIER_2: 8, TIER_3: 6, TIER_4: 6 },
          { ...DEFAULT_GENRES, 'Unboxing & Review': 24, 'Craft Lore & Material Storytelling': 14, 'Styling & OOTD': 6, 'Celebrity Ambassador': 4 },
          [
            { id: 'm_c1', shortcode: 'Cm9L2k4a', url: 'https://instagram.com/p/Cm9L2k4a/', date: '2026-02-12', creatorHandle: '@skincare_with_riki', creatorName: 'Riki Dsouza', creatorAvatar: AVATARS.riki, creatorFollowers: 120000, creatorTier: '🚀 Macro (100K - 1M)', views: 1400000, likes: 4200, comments: 80, likeToViewPct: 0.3, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Unboxing & Review', caption: 'Toxin-free Vitamin C face wash routine. Use code RIKI20! #GoodnessInside #Mamaearth #ad', boostReason: 'Sub-0.30% like rate with 1.4M views indicates direct conversion ad spend.' },
            { id: 'm_c2', shortcode: 'IfW2s5v', url: 'https://instagram.com/p/IfW2s5v/', date: '2026-06-18', creatorHandle: '@aanya_beauty', creatorName: 'Aanya Sen', creatorAvatar: AVATARS.aanya, creatorFollowers: 290000, creatorTier: '🚀 Macro (100K - 1M)', views: 980000, likes: 2940, comments: 110, likeToViewPct: 0.3, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Unboxing & Review', caption: 'Mamaearth rice water shampoo — 30 day challenge results! Use code AANYA15 #ad', boostReason: '0.30% like rate on 980K views = D2C conversion ad spend.' },
            { id: 'm_c3', shortcode: 'JgX3t6w', url: 'https://instagram.com/p/JgX3t6w/', date: '2025-10-25', creatorHandle: '@priya_diaries', creatorName: 'Priya Verma', creatorAvatar: AVATARS.priya, creatorFollowers: 95000, creatorTier: '✨ Mid-Tier (50K - 100K)', views: 380000, likes: 22800, comments: 310, likeToViewPct: 6.0, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Styling & OOTD', caption: 'Winter night skincare GRWM with Mamaearth aloe vera gel 🌿 #NightRoutine #ad', boostReason: 'Organic mid-tier GRWM engagement.' },
            { id: 'm_c4', shortcode: 'KhY4u7x', url: 'https://instagram.com/p/KhY4u7x/', date: '2026-08-10', creatorHandle: '@neha_cooks', creatorName: 'Neha Sharma', creatorAvatar: AVATARS.neha, creatorFollowers: 78000, creatorTier: '✨ Mid-Tier (50K - 100K)', views: 260000, likes: 15600, comments: 240, likeToViewPct: 6.0, isPaidToggle: false, isBoosted: false, tier: 'TIER_4', genre: 'Craft Lore & Material Storytelling', caption: 'DIY face mask using Mamaearth ubtan + kitchen honey 🍯', boostReason: 'Organic recipe craft content.' },
          ]
        ),
      },
      {
        id: 'tc_cetaphil', igHandle: '@cetaphil_in', name: 'Cetaphil India',
        avatar: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&h=150&fit=crop',
        addedAt: '2025-10-15',
        stats: makeCompetitorStats(
          '@cetaphil_in', 'Cetaphil India',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&h=150&fit=crop',
          340000, 14, 5200000, 5.8, 42.8,
          { TIER_1: 4, TIER_2: 6, TIER_3: 2, TIER_4: 2 },
          { ...DEFAULT_GENRES, 'Unboxing & Review': 8, 'Styling & OOTD': 4, 'Celebrity Ambassador': 2 },
          [
            { id: 'ce_c1', shortcode: 'LiZ5v8y', url: 'https://instagram.com/p/LiZ5v8y/', date: '2026-01-28', creatorHandle: '@meera_bakes', creatorName: 'Meera Iyer', creatorAvatar: AVATARS.meera, creatorFollowers: 62000, creatorTier: '✨ Mid-Tier (50K - 100K)', views: 290000, likes: 17400, comments: 260, likeToViewPct: 6.0, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Unboxing & Review', caption: 'Dermatologist recommended gentle cleanser review — Cetaphil vs drugstore! #ad', boostReason: 'Organic derma-review engagement.' },
          ]
        ),
      },
      {
        id: 'tc_ponds', igHandle: '@ponds_india', name: "Pond's India",
        avatar: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=150&h=150&fit=crop',
        addedAt: '2025-11-01',
        stats: makeCompetitorStats(
          '@ponds_india', "Pond's India",
          'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=150&h=150&fit=crop',
          580000, 20, 11000000, 5.4, 60.0,
          { TIER_1: 10, TIER_2: 4, TIER_3: 2, TIER_4: 4 },
          { ...DEFAULT_GENRES, 'Celebrity Ambassador': 8, 'Styling & OOTD': 6, 'Unboxing & Review': 4, 'Gifting & Festive Drops': 2 },
          [
            { id: 'po_c1', shortcode: 'MjA6w9z', url: 'https://instagram.com/p/MjA6w9z/', date: '2026-04-20', creatorHandle: '@divya_lifestyle', creatorName: 'Divya Kapoor', creatorAvatar: AVATARS.divya, creatorFollowers: 180000, creatorTier: '🚀 Macro (100K - 1M)', views: 1100000, likes: 3300, comments: 120, likeToViewPct: 0.3, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Celebrity Ambassador', caption: "Pond's x Deepika Padukone bright beauty launch! ✨ #PondsBrightBeauty #ad", boostReason: '0.30% like rate on 1.1M views = heavy celebrity ad spend.' },
            { id: 'po_c2', shortcode: 'NkB7x0a', url: 'https://instagram.com/p/NkB7x0a/', date: '2026-07-15', creatorHandle: '@aanya_beauty', creatorName: 'Aanya Sen', creatorAvatar: AVATARS.aanya, creatorFollowers: 290000, creatorTier: '🚀 Macro (100K - 1M)', views: 680000, likes: 40800, comments: 520, likeToViewPct: 6.0, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Styling & OOTD', caption: "Summer GRWM ft Pond's Super Light Gel sunscreen 🌞 #ad", boostReason: 'Organic GRWM with strong comment engagement.' },
          ]
        ),
      },
    ],
  },

  // ──── MYNTRA ────
  myntra: {
    brandSlug: 'myntra',
    brandName: 'Myntra',
    brandIndustry: 'Fashion & E-Commerce',
    brandStats: makeCompetitorStats(
      '@myntra', 'Myntra',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&h=150&fit=crop',
      1400000, 40, 32000000, 6.9, 40.0,
      { TIER_1: 12, TIER_2: 18, TIER_3: 4, TIER_4: 6 },
      { ...DEFAULT_GENRES, 'Styling & OOTD': 20, 'Unboxing & Review': 10, 'Celebrity Ambassador': 6, 'Gifting & Festive Drops': 4 },
      []
    ),
    competitors: [
      {
        id: 'tc_ajio', igHandle: '@ajaborig', name: 'AJIO',
        avatar: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150&h=150&fit=crop',
        addedAt: '2025-09-15',
        stats: makeCompetitorStats(
          '@ajaborig', 'AJIO',
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150&h=150&fit=crop',
          980000, 28, 18400000, 5.4, 53.5,
          { TIER_1: 12, TIER_2: 8, TIER_3: 3, TIER_4: 5 },
          { ...DEFAULT_GENRES, 'Styling & OOTD': 14, 'Celebrity Ambassador': 6, 'Unboxing & Review': 5, 'Gifting & Festive Drops': 3 },
          [
            { id: 'aj_c1', shortcode: 'OlC8y1b', url: 'https://instagram.com/p/OlC8y1b/', date: '2026-03-22', creatorHandle: '@priya_diaries', creatorName: 'Priya Verma', creatorAvatar: AVATARS.priya, creatorFollowers: 95000, creatorTier: '✨ Mid-Tier (50K - 100K)', views: 620000, likes: 1860, comments: 80, likeToViewPct: 0.3, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Styling & OOTD', caption: 'AJIO Big Bold Sale haul — 10 looks under ₹5000! #AJIOSale #ad', boostReason: '0.30% like rate on 620K views = paid ad spend.' },
            { id: 'aj_c2', shortcode: 'PmD9z2c', url: 'https://instagram.com/p/PmD9z2c/', date: '2026-06-08', creatorHandle: '@arjun_bites', creatorName: 'Arjun Mehta', creatorAvatar: AVATARS.arjun, creatorFollowers: 210000, creatorTier: '🚀 Macro (100K - 1M)', views: 480000, likes: 28800, comments: 380, likeToViewPct: 6.0, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Styling & OOTD', caption: 'Street style monsoon lookbook from AJIO 🌧️ #OOTD #ad', boostReason: 'Organic styling engagement.' },
          ]
        ),
      },
      {
        id: 'tc_nykaa', igHandle: '@nykaafashion', name: 'Nykaa Fashion',
        avatar: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=150&h=150&fit=crop',
        addedAt: '2025-10-01',
        stats: makeCompetitorStats(
          '@nykaafashion', 'Nykaa Fashion',
          'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=150&h=150&fit=crop',
          680000, 22, 12000000, 6.2, 45.4,
          { TIER_1: 8, TIER_2: 8, TIER_3: 2, TIER_4: 4 },
          { ...DEFAULT_GENRES, 'Styling & OOTD': 12, 'Unboxing & Review': 6, 'Celebrity Ambassador': 2, 'Gifting & Festive Drops': 2 },
          [
            { id: 'nk_c1', shortcode: 'QnE0a3d', url: 'https://instagram.com/p/QnE0a3d/', date: '2026-05-14', creatorHandle: '@aanya_beauty', creatorName: 'Aanya Sen', creatorAvatar: AVATARS.aanya, creatorFollowers: 290000, creatorTier: '🚀 Macro (100K - 1M)', views: 840000, likes: 50400, comments: 620, likeToViewPct: 6.0, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Styling & OOTD', caption: 'Nykaa Fashion EORS picks — wedding guest outfit guide 💃 #NykaaFashion #ad', boostReason: 'Organic high-intent fashion community engagement.' },
          ]
        ),
      },
      {
        id: 'tc_tatacliq', igHandle: '@taborig_luxury', name: 'Tata CLiQ',
        avatar: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=150&h=150&fit=crop',
        addedAt: '2025-11-15',
        stats: makeCompetitorStats(
          '@taborig_luxury', 'Tata CLiQ',
          'https://images.unsplash.com/photo-1445205170230-053b83016050?w=150&h=150&fit=crop',
          320000, 10, 4800000, 5.0, 40.0,
          { TIER_1: 3, TIER_2: 4, TIER_3: 1, TIER_4: 2 },
          { ...DEFAULT_GENRES, 'Styling & OOTD': 5, 'Celebrity Ambassador': 3, 'Unboxing & Review': 2 },
          [
            { id: 'tc_c1', shortcode: 'RoF1b4e', url: 'https://instagram.com/p/RoF1b4e/', date: '2026-02-28', creatorHandle: '@siddharth_laughs', creatorName: 'Siddharth Menon', creatorAvatar: AVATARS.siddharth, creatorFollowers: 180000, creatorTier: '🚀 Macro (100K - 1M)', views: 380000, likes: 22800, comments: 290, likeToViewPct: 6.0, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Styling & OOTD', caption: 'Tata CLiQ Luxury winter jacket edit — premium picks under ₹10K #ad', boostReason: 'Organic premium fashion audience.' },
          ]
        ),
      },
    ],
  },

  // ──── KOTAK811 ────
  kotak811: {
    brandSlug: 'kotak811',
    brandName: 'Kotak811',
    brandIndustry: 'Finance & FinTech',
    brandStats: makeCompetitorStats(
      '@kotak811', 'Kotak811',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&h=150&fit=crop',
      380000, 18, 8200000, 5.4, 44.4,
      { TIER_1: 6, TIER_2: 8, TIER_3: 2, TIER_4: 2 },
      { ...DEFAULT_GENRES, 'Comedy & Relatable Skits': 8, 'Unboxing & Review': 5, 'Celebrity Ambassador': 3, 'Styling & OOTD': 2 },
      []
    ),
    competitors: [
      {
        id: 'tc_fi', igHandle: '@fi.money', name: 'Fi Money',
        avatar: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&h=150&fit=crop',
        addedAt: '2025-09-01',
        stats: makeCompetitorStats(
          '@fi.money', 'Fi Money',
          'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&h=150&fit=crop',
          220000, 14, 5800000, 4.8, 64.2,
          { TIER_1: 7, TIER_2: 3, TIER_3: 2, TIER_4: 2 },
          { ...DEFAULT_GENRES, 'Comedy & Relatable Skits': 8, 'Unboxing & Review': 4, 'Celebrity Ambassador': 2 },
          [
            { id: 'fi_c1', shortcode: 'SpG2c5f', url: 'https://instagram.com/p/SpG2c5f/', date: '2026-04-12', creatorHandle: '@tanmay_creates', creatorName: 'Tanmay Sharma', creatorAvatar: AVATARS.tanmay, creatorFollowers: 420000, creatorTier: '🚀 Macro (100K - 1M)', views: 890000, likes: 2670, comments: 110, likeToViewPct: 0.3, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Comedy & Relatable Skits', caption: 'When Fi.Money shows your UPI spending and you go 😱 #FinanceHumor #ad', boostReason: '0.30% like rate on 890K views = heavy performance ad spend.' },
            { id: 'fi_c2', shortcode: 'TqH3d6g', url: 'https://instagram.com/p/TqH3d6g/', date: '2026-07-25', creatorHandle: '@rahul_comedy', creatorName: 'Rahul Verma', creatorAvatar: AVATARS.rahul, creatorFollowers: 520000, creatorTier: '🚀 Macro (100K - 1M)', views: 640000, likes: 38400, comments: 480, likeToViewPct: 6.0, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Comedy & Relatable Skits', caption: 'Salary day vs 10th of the month savings reality check 💸 #FiMoney #ad', boostReason: 'Organic comedy finance content.' },
          ]
        ),
      },
      {
        id: 'tc_jupiter', igHandle: '@jupiter_money', name: 'Jupiter',
        avatar: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=150&fit=crop',
        addedAt: '2025-10-15',
        stats: makeCompetitorStats(
          '@jupiter_money', 'Jupiter',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=150&fit=crop',
          160000, 10, 3200000, 4.2, 50.0,
          { TIER_1: 4, TIER_2: 3, TIER_3: 1, TIER_4: 2 },
          { ...DEFAULT_GENRES, 'Comedy & Relatable Skits': 5, 'Unboxing & Review': 3, 'Celebrity Ambassador': 2 },
          [
            { id: 'ju_c1', shortcode: 'UrI4e7h', url: 'https://instagram.com/p/UrI4e7h/', date: '2026-01-18', creatorHandle: '@vikram_eats', creatorName: 'Vikram Rao', creatorAvatar: AVATARS.vikram, creatorFollowers: 310000, creatorTier: '🚀 Macro (100K - 1M)', views: 420000, likes: 1260, comments: 60, likeToViewPct: 0.3, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Unboxing & Review', caption: 'Jupiter UPI autopay review — is it worth switching? #FinTech #ad', boostReason: '0.30% like rate on 420K views = conversion-optimized ad spend.' },
          ]
        ),
      },
      {
        id: 'tc_niyo', igHandle: '@niyo_solutions', name: 'Niyo',
        avatar: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=150&h=150&fit=crop',
        addedAt: '2025-11-01',
        stats: makeCompetitorStats(
          '@niyo_solutions', 'Niyo',
          'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=150&h=150&fit=crop',
          95000, 8, 1800000, 3.8, 37.5,
          { TIER_1: 2, TIER_2: 3, TIER_3: 1, TIER_4: 2 },
          { ...DEFAULT_GENRES, 'Unboxing & Review': 4, 'Comedy & Relatable Skits': 3, 'Store Walkthrough': 1 },
          [
            { id: 'ni_c1', shortcode: 'VsJ5f8i', url: 'https://instagram.com/p/VsJ5f8i/', date: '2026-05-22', creatorHandle: '@arjun_bites', creatorName: 'Arjun Mehta', creatorAvatar: AVATARS.arjun, creatorFollowers: 210000, creatorTier: '🚀 Macro (100K - 1M)', views: 280000, likes: 16800, comments: 210, likeToViewPct: 6.0, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Unboxing & Review', caption: 'Niyo global card for international trips — zero forex markup review #ad', boostReason: 'Organic travel finance review engagement.' },
          ]
        ),
      },
    ],
  },

  // ──── FEVICOL ────
  fevicol: {
    brandSlug: 'fevicol',
    brandName: 'Fevicol',
    brandIndustry: 'Lifestyle & DIY',
    brandStats: makeCompetitorStats(
      '@fevicolindia', 'Fevicol (Pidilite)',
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=150&h=150&fit=crop',
      340000, 16, 9200000, 8.2, 31.2,
      { TIER_1: 3, TIER_2: 10, TIER_3: 2, TIER_4: 1 },
      { ...DEFAULT_GENRES, 'Comedy & Relatable Skits': 10, 'Craft Lore & Material Storytelling': 4, 'Celebrity Ambassador': 2 },
      []
    ),
    competitors: [
      {
        id: 'tc_araldite', igHandle: '@araldite_india', name: 'Araldite',
        avatar: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=150&h=150&fit=crop',
        addedAt: '2025-09-15',
        stats: makeCompetitorStats(
          '@araldite_india', 'Araldite',
          'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=150&h=150&fit=crop',
          45000, 6, 1200000, 3.4, 50.0,
          { TIER_1: 2, TIER_2: 2, TIER_3: 1, TIER_4: 1 },
          { ...DEFAULT_GENRES, 'Craft Lore & Material Storytelling': 3, 'Unboxing & Review': 2, 'Comedy & Relatable Skits': 1 },
          [
            { id: 'ar_c1', shortcode: 'WtK6g9j', url: 'https://instagram.com/p/WtK6g9j/', date: '2026-03-08', creatorHandle: '@vikram_eats', creatorName: 'Vikram Rao', creatorAvatar: AVATARS.vikram, creatorFollowers: 310000, creatorTier: '🚀 Macro (100K - 1M)', views: 320000, likes: 960, comments: 45, likeToViewPct: 0.3, isPaidToggle: true, isBoosted: true, tier: 'TIER_1', genre: 'Craft Lore & Material Storytelling', caption: 'Industrial strength test: Araldite vs furniture weight challenge! #StrongerBond #ad', boostReason: '0.30% like rate on 320K views = niche ad amplification.' },
          ]
        ),
      },
      {
        id: 'tc_drfixit', igHandle: '@drfixit_india', name: 'Dr. Fixit',
        avatar: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&h=150&fit=crop',
        addedAt: '2025-10-01',
        stats: makeCompetitorStats(
          '@drfixit_india', 'Dr. Fixit',
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&h=150&fit=crop',
          120000, 8, 2400000, 4.0, 37.5,
          { TIER_1: 2, TIER_2: 3, TIER_3: 1, TIER_4: 2 },
          { ...DEFAULT_GENRES, 'Craft Lore & Material Storytelling': 4, 'Comedy & Relatable Skits': 3, 'Unboxing & Review': 1 },
          [
            { id: 'df_c1', shortcode: 'XuL7h0k', url: 'https://instagram.com/p/XuL7h0k/', date: '2026-06-28', creatorHandle: '@siddharth_laughs', creatorName: 'Siddharth Menon', creatorAvatar: AVATARS.siddharth, creatorFollowers: 180000, creatorTier: '🚀 Macro (100K - 1M)', views: 420000, likes: 25200, comments: 320, likeToViewPct: 6.0, isPaidToggle: true, isBoosted: false, tier: 'TIER_2', genre: 'Comedy & Relatable Skits', caption: 'Dad vs leaking roof — Dr. Fixit to the rescue 😂 #MonsoonReady #ad', boostReason: 'Organic comedy engagement with practical appeal.' },
          ]
        ),
      },
      {
        id: 'tc_mseal', igHandle: '@mseal_official', name: 'M-Seal',
        avatar: 'https://images.unsplash.com/photo-1530124566582-a45a7e3d0c09?w=150&h=150&fit=crop',
        addedAt: '2025-11-15',
        stats: makeCompetitorStats(
          '@mseal_official', 'M-Seal',
          'https://images.unsplash.com/photo-1530124566582-a45a7e3d0c09?w=150&h=150&fit=crop',
          28000, 4, 600000, 3.0, 25.0,
          { TIER_1: 1, TIER_2: 1, TIER_3: 0, TIER_4: 2 },
          { ...DEFAULT_GENRES, 'Craft Lore & Material Storytelling': 2, 'Comedy & Relatable Skits': 1, 'Unboxing & Review': 1 },
          [
            { id: 'ms_c1', shortcode: 'YvM8i1l', url: 'https://instagram.com/p/YvM8i1l/', date: '2026-02-05', creatorHandle: '@rahul_comedy', creatorName: 'Rahul Verma', creatorAvatar: AVATARS.rahul, creatorFollowers: 520000, creatorTier: '🚀 Macro (100K - 1M)', views: 180000, likes: 10800, comments: 140, likeToViewPct: 6.0, isPaidToggle: false, isBoosted: false, tier: 'TIER_4', genre: 'Comedy & Relatable Skits', caption: 'When jugaad meets M-Seal — fixing everything in the hostel 😂', boostReason: 'Organic jugaad comedy collab.' },
          ]
        ),
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────
// Per-Brand Competitor Registry Functions
// ─────────────────────────────────────────────────────────

const MAX_COMPETITORS_PER_BRAND = 4;

/**
 * Get the full competitor config for a brand (or null if brand not tracked).
 */
export function getCompetitorsForBrand(brandSlug: string): BrandCompetitorConfig | null {
  return BRAND_COMPETITOR_REGISTRY[brandSlug] || null;
}

/**
 * Add a new competitor to a brand's watchlist (max 4).
 * Returns the new TrackedCompetitor or null if max reached.
 */
export function addCompetitorToBrand(
  brandSlug: string,
  igHandle: string,
  name?: string
): TrackedCompetitor | null {
  const config = BRAND_COMPETITOR_REGISTRY[brandSlug];
  if (!config) {
    // Brand doesn't exist in registry yet — create a new entry
    const cleanHandle = igHandle.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '');
    const displayName = name || cleanHandle.charAt(0).toUpperCase() + cleanHandle.slice(1);
    const newCompetitor: TrackedCompetitor = {
      id: `tc_${cleanHandle}_${Date.now()}`,
      igHandle: `@${cleanHandle}`,
      name: displayName,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanHandle}`,
      addedAt: new Date().toISOString().split('T')[0] || '2026-08-31',
      stats: generateDynamicCompetitorStats(cleanHandle, displayName),
    };
    BRAND_COMPETITOR_REGISTRY[brandSlug] = {
      brandSlug,
      brandName: brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1),
      brandIndustry: 'Consumer Brand',
      brandStats: generateDynamicCompetitorStats(brandSlug, brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1)),
      competitors: [newCompetitor],
    };
    return newCompetitor;
  }

  if (config.competitors.length >= MAX_COMPETITORS_PER_BRAND) {
    return null; // Max competitors reached
  }

  const cleanHandle = igHandle.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '');
  const displayName = name || cleanHandle.charAt(0).toUpperCase() + cleanHandle.slice(1);

  // Check for duplicates
  if (config.competitors.some((c) => c.igHandle === `@${cleanHandle}`)) {
    return null;
  }

  const newCompetitor: TrackedCompetitor = {
    id: `tc_${cleanHandle}_${Date.now()}`,
    igHandle: `@${cleanHandle}`,
    name: displayName,
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanHandle}`,
    addedAt: new Date().toISOString().split('T')[0] || '2026-08-31',
    stats: generateDynamicCompetitorStats(cleanHandle, displayName),
  };

  config.competitors.push(newCompetitor);
  return newCompetitor;
}

/**
 * Remove a competitor from a brand's watchlist.
 */
export function removeCompetitorFromBrand(brandSlug: string, competitorId: string): boolean {
  const config = BRAND_COMPETITOR_REGISTRY[brandSlug];
  if (!config) return false;
  const beforeLen = config.competitors.length;
  config.competitors = config.competitors.filter((c) => c.id !== competitorId);
  return config.competitors.length < beforeLen;
}

/**
 * Get ALL creators from ALL competitors of a brand that were active in the last 12 months.
 */
export function getCompetitorCreatorsLastYear(brandSlug: string): (CompetitorPostCollab & { competitorName: string })[] {
  const config = BRAND_COMPETITOR_REGISTRY[brandSlug];
  if (!config) return [];

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const allCreators: (CompetitorPostCollab & { competitorName: string })[] = [];

  for (const comp of config.competitors) {
    for (const creator of comp.stats.topCreators) {
      const collabDate = new Date(creator.date);
      if (collabDate >= oneYearAgo) {
        allCreators.push({ ...creator, competitorName: comp.name });
      }
    }
  }

  // Sort by date descending (most recent first)
  allCreators.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return allCreators;
}

/**
 * Head-to-head comparison between a brand and one of its tracked competitors.
 */
export function getBrandVsCompetitor(brandSlug: string, competitorId: string): HeadToHeadBenchmark | null {
  const config = BRAND_COMPETITOR_REGISTRY[brandSlug];
  if (!config) return null;

  const comp = config.competitors.find((c) => c.id === competitorId);
  if (!comp) return null;

  const brand = config.brandStats;
  const competitor = comp.stats;

  const totalViews = brand.totalViewsDelivered + competitor.totalViewsDelivered;
  const brandSOV = totalViews > 0 ? Math.round((brand.totalViewsDelivered / totalViews) * 100) : 50;

  return {
    id: `h2h_${brandSlug}_vs_${comp.id}`,
    brandSlug: config.brandSlug,
    brandName: config.brandName,
    competitorSlug: comp.igHandle.replace('@', ''),
    competitorName: comp.name,
    industry: config.brandIndustry,
    brand,
    competitor,
    shareOfVoicePct: { brand: brandSOV, competitor: 100 - brandSOV },
    aiStrategicInsights: generateInsights(config.brandName, comp.name, brand, competitor),
    recommendedCounterPlays: generateCounterPlays(config.brandName, comp.name, brand, competitor),
  };
}

function generateInsights(brandName: string, compName: string, brand: BrandProfileStats, comp: BrandProfileStats): string[] {
  const insights: string[] = [];
  if (comp.paidAdSpendRatioPct > brand.paidAdSpendRatioPct) {
    insights.push(`⚡ **Paid Boost Aggression**: ${compName} boosts ${comp.paidAdSpendRatioPct}% of creator collabs via Meta video ads, while ${brandName} relies on more organic reach (${brand.paidAdSpendRatioPct}% boost rate).`);
  } else {
    insights.push(`📈 **Organic Edge**: ${brandName} maintains a stronger organic strategy (${brand.paidAdSpendRatioPct}% boost rate) compared to ${compName}'s heavier paid approach (${comp.paidAdSpendRatioPct}%).`);
  }
  if (brand.avgEngagementRate > comp.avgEngagementRate) {
    insights.push(`🔥 **Engagement Leadership**: ${brandName} commands ${brand.avgEngagementRate}% avg ER compared to ${compName}'s ${comp.avgEngagementRate}%, indicating stronger audience resonance.`);
  }
  insights.push(`🎯 **Creator Volume**: ${compName} has analyzed ${comp.collabsAnalyzed} collabs (${comp.totalViewsDelivered / 1000000}M views) vs ${brandName}'s ${brand.collabsAnalyzed} collabs (${brand.totalViewsDelivered / 1000000}M views).`);
  return insights;
}

function generateCounterPlays(brandName: string, compName: string, brand: BrandProfileStats, comp: BrandProfileStats): string[] {
  const plays: string[] = [];
  plays.push(`🛡️ **Scout Competitor Talent**: Connect with ${compName}'s top-performing creators and offer exclusive Align milestone escrow contracts with ${brandName}.`);
  if (comp.paidAdSpendRatioPct > 50) {
    plays.push(`🚀 **Counter-Boost Top Viral Formats**: Put strategic ad spend behind ${brandName}'s highest-converting organic reels to reclaim share of voice from ${compName}'s paid reach.`);
  }
  plays.push(`🎨 **Differentiate Creative Strategy**: Exploit genre gaps where ${compName} has zero presence and ${brandName} can dominate with authentic content.`);
  return plays;
}

/**
 * Generate dynamic stats for a custom/unknown competitor handle.
 */
function generateDynamicCompetitorStats(handle: string, name: string): BrandProfileStats {
  const seed = handle.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const followers = 100000 + (seed % 400000);
  const collabs = 8 + (seed % 20);
  const views = followers * (15 + (seed % 25));
  const er = 3.5 + (seed % 50) / 10;

  return {
    handle: `@${handle}`,
    name,
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${handle}`,
    followers,
    following: Math.floor(followers * 0.0003),
    totalPosts: Math.floor(followers * 0.003),
    collabsAnalyzed: collabs,
    totalViewsDelivered: views,
    avgEngagementRate: Number(er.toFixed(1)),
    avgLikesPerPost: Math.floor(views / collabs * er / 100),
    paidAdSpendRatioPct: 30 + (seed % 40),
    tierDistribution: {
      TIER_1: Math.floor(collabs * 0.3),
      TIER_2: Math.floor(collabs * 0.35),
      TIER_3: Math.floor(collabs * 0.15),
      TIER_4: Math.floor(collabs * 0.2),
    },
    genreDistribution: {
      'Comedy & Relatable Skits': Math.floor(collabs * 0.35),
      'Styling & OOTD': Math.floor(collabs * 0.2),
      'Unboxing & Review': Math.floor(collabs * 0.15),
      'Craft Lore & Material Storytelling': Math.floor(collabs * 0.1),
      'Gifting & Festive Drops': Math.floor(collabs * 0.1),
      'Celebrity Ambassador': Math.floor(collabs * 0.05),
      'Store Walkthrough': Math.floor(collabs * 0.05),
    },
    audienceTierDistribution: {
      '🌟 Mega (1M+)': Math.floor(collabs * 0.1),
      '🚀 Macro (100K - 1M)': Math.floor(collabs * 0.4),
      '✨ Mid-Tier (50K - 100K)': Math.floor(collabs * 0.25),
      '🎯 Micro (10K - 50K)': Math.floor(collabs * 0.15),
      '🌱 Nano (<10K)': Math.floor(collabs * 0.1),
    },
    topCreators: [
      {
        id: `dyn_${handle}_c1`,
        shortcode: `Dyn${handle.slice(0, 4)}1`,
        url: `https://instagram.com/p/Dyn${handle.slice(0, 4)}1/`,
        date: '2026-04-15',
        creatorHandle: '@rohan_joshicomics',
        creatorName: 'Rohan Joshi',
        creatorAvatar: AVATARS.rohan,
        creatorFollowers: 145000,
        creatorTier: '🚀 Macro (100K - 1M)',
        views: 580000,
        likes: 42000,
        comments: 620,
        likeToViewPct: 7.24,
        isPaidToggle: true,
        isBoosted: false,
        tier: 'TIER_2',
        genre: 'Comedy & Relatable Skits',
        caption: `Creative collaboration with @${handle}! #collab #ad`,
        boostReason: 'High organic engagement rate.',
      },
    ],
  };
}

// ─────────────────────────────────────────────────────────
// Legacy Support: COMPETITIVE_BENCHMARKS & analyzeCompetitorPair
// These are still used by the existing pages and tests
// ─────────────────────────────────────────────────────────

export const COMPETITIVE_BENCHMARKS: Record<string, HeadToHeadBenchmark> = {};

// Auto-populate from registry
for (const [brandSlug, config] of Object.entries(BRAND_COMPETITOR_REGISTRY)) {
  for (const comp of config.competitors) {
    const key = `${brandSlug}_vs_${comp.igHandle.replace('@', '').replace('.', '')}`;
    const h2h = getBrandVsCompetitor(brandSlug, comp.id);
    if (h2h) {
      COMPETITIVE_BENCHMARKS[key] = h2h;
    }
  }
}

// Add backward-compatible aliases for the 3 original keys
if (!COMPETITIVE_BENCHMARKS['britannia_vs_parle']) {
  const h2h = getBrandVsCompetitor('britannia', 'tc_parle');
  if (h2h) COMPETITIVE_BENCHMARKS['britannia_vs_parle'] = h2h;
}
if (!COMPETITIVE_BENCHMARKS['swiggy_vs_zomato']) {
  const h2h = getBrandVsCompetitor('swiggy', 'tc_zomato');
  if (h2h) COMPETITIVE_BENCHMARKS['swiggy_vs_zomato'] = h2h;
}
if (!COMPETITIVE_BENCHMARKS['nivea_vs_mamaearth']) {
  const h2h = getBrandVsCompetitor('nivea', 'tc_mamaearth');
  if (h2h) COMPETITIVE_BENCHMARKS['nivea_vs_mamaearth'] = h2h;
}

/**
 * Analyze a competitor pair — looks up registry first, then falls back to dynamic generation.
 */
export function analyzeCompetitorPair(
  brandHandleOrUrl: string,
  competitorHandleOrUrl: string
): HeadToHeadBenchmark {
  const cleanBrand = brandHandleOrUrl
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
    .replace(/[^a-zA-Z0-9_.]/g, '')
    .toLowerCase();

  const cleanCompetitor = competitorHandleOrUrl
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
    .replace(/[^a-zA-Z0-9_.]/g, '')
    .toLowerCase();

  // Check pre-configured benchmarks
  const lookupKey = `${cleanBrand}_vs_${cleanCompetitor}`;
  if (COMPETITIVE_BENCHMARKS[lookupKey]) {
    return COMPETITIVE_BENCHMARKS[lookupKey]!;
  }

  // Partial match fallbacks
  for (const [key, benchmark] of Object.entries(COMPETITIVE_BENCHMARKS)) {
    if (key.includes(cleanBrand) || key.includes(cleanCompetitor)) {
      return benchmark;
    }
  }

  // Dynamic fallback for completely unknown handles
  const brandName = cleanBrand.charAt(0).toUpperCase() + cleanBrand.slice(1);
  const competitorName = cleanCompetitor.charAt(0).toUpperCase() + cleanCompetitor.slice(1);
  const brandStats = generateDynamicCompetitorStats(cleanBrand, brandName);
  const competitorStats = generateDynamicCompetitorStats(cleanCompetitor, competitorName);

  return {
    id: `dyn_${cleanBrand}_vs_${cleanCompetitor}`,
    brandSlug: cleanBrand,
    brandName,
    competitorSlug: cleanCompetitor,
    competitorName,
    industry: 'Consumer Brand & Retail',
    brand: brandStats,
    competitor: competitorStats,
    shareOfVoicePct: { brand: 52, competitor: 48 },
    aiStrategicInsights: generateInsights(brandName, competitorName, brandStats, competitorStats),
    recommendedCounterPlays: generateCounterPlays(brandName, competitorName, brandStats, competitorStats),
  };
}
