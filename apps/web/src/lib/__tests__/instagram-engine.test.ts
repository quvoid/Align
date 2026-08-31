import { describe, it, expect } from 'vitest';
import {
  detectBoost,
  classifyPartnershipTier,
  getCreatorAudienceTier,
  classifyCreativeGenre,
  analyzeCompetitorPair,
  COMPETITIVE_BENCHMARKS,
} from '../instagram-engine';

describe('Instagram Intelligence & Paid Collabs Algorithms', () => {
  describe('Paid Boost Detection Engine', () => {
    it('should flag high views with sub-0.35% like rate as heavily boosted', () => {
      // 1.85M views with 4,810 likes (0.26% like rate) -> Boosted!
      const result = detectBoost(1850000, 4810, 210, 420000);
      expect(result.isBoosted).toBe(true);
      expect(result.likeToViewPct).toBe(0.26);
      expect(result.status).toContain('Heavily Boosted');
    });

    it('should flag high view multiplier (>=5x) with sub-0.70% like rate as boosted', () => {
      // 740k views on 95k followers (7.8x multiplier) with 0.55% like rate
      const result = detectBoost(740000, 4070, 95, 95000);
      expect(result.isBoosted).toBe(true);
      expect(result.viewMultiplier).toBeGreaterThanOrEqual(5.0);
      expect(result.status).toContain('Boosted');
    });

    it('should classify high organic engagement (ER >= 4% & like-to-view >= 2%) as viral organic', () => {
      // 820k views with 60,680 likes (7.4% like rate) on 145k followers
      const result = detectBoost(820000, 60680, 840, 145000);
      expect(result.isBoosted).toBe(false);
      expect(result.likeToViewPct).toBeGreaterThanOrEqual(2.0);
      expect(result.status).toContain('Viral Organic');
    });
  });

  describe('4-Tier Partnership Hierarchy Classifier', () => {
    it('should correctly assign Tier 1 for paid toggle ON + boosted', () => {
      expect(classifyPartnershipTier(true, true)).toBe('TIER_1');
    });

    it('should correctly assign Tier 2 for paid toggle ON + organic', () => {
      expect(classifyPartnershipTier(true, false)).toBe('TIER_2');
    });

    it('should correctly assign Tier 3 for paid toggle OFF + boosted', () => {
      expect(classifyPartnershipTier(false, true)).toBe('TIER_3');
    });

    it('should correctly assign Tier 4 for standard organic collab', () => {
      expect(classifyPartnershipTier(false, false)).toBe('TIER_4');
    });
  });

  describe('Creator Audience Sizing', () => {
    it('should accurately categorize audience tiers by reach', () => {
      expect(getCreatorAudienceTier(3500000)).toContain('Mega');
      expect(getCreatorAudienceTier(450000)).toContain('Macro');
      expect(getCreatorAudienceTier(75000)).toContain('Mid-Tier');
      expect(getCreatorAudienceTier(25000)).toContain('Micro');
      expect(getCreatorAudienceTier(4500)).toContain('Nano');
    });
  });

  describe('NLP Creative Content Genre Taxonomy', () => {
    it('should detect Celebrity Ambassador genre', () => {
      expect(classifyCreativeGenre('Brand ambassador announcement with Kareena')).toBe('Celebrity Ambassador');
    });

    it('should detect Styling & OOTD genre', () => {
      expect(classifyCreativeGenre('My morning GRWM lookbook styling tips')).toBe('Styling & OOTD');
    });

    it('should detect Unboxing & Review genre', () => {
      expect(classifyCreativeGenre('Huge fashion try on haul and unboxing')).toBe('Unboxing & Review');
    });

    it('should detect Craft Lore & Recipe genre', () => {
      expect(classifyCreativeGenre('Secret baking recipe with 100% whole wheat ingredients')).toBe('Craft Lore & Material Storytelling');
    });

    it('should detect Gifting & Festive Drops genre', () => {
      expect(classifyCreativeGenre('Perfect Diwali festive gifting hamper for family')).toBe('Gifting & Festive Drops');
    });
  });

  describe('Head-to-Head Benchmarking Analyzer', () => {
    it('should retrieve pre-configured Britannia vs Parle comparison correctly', () => {
      const benchmark = analyzeCompetitorPair('britannia', 'parle');
      expect(benchmark.brandName).toBe('Britannia');
      expect(benchmark.competitorName).toBe('Parle');
      expect(benchmark.shareOfVoicePct.brand).toBe(58);
      expect(benchmark.competitor.paidAdSpendRatioPct).toBe(62.5);
      expect(benchmark.competitor.topCreators.length).toBeGreaterThan(0);
    });

    it('should dynamically generate analysis for arbitrary custom handles and URLs', () => {
      const benchmark = analyzeCompetitorPair(
        'https://instagram.com/mybrand',
        'https://instagram.com/otherbrand'
      );
      expect(benchmark.brandSlug).toBe('mybrand');
      expect(benchmark.competitorSlug).toBe('otherbrand');
      expect(benchmark.brand.followers).toBeGreaterThan(0);
      expect(benchmark.competitor.topCreators.length).toBeGreaterThan(0);
    });
  });
});
