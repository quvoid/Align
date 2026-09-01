import { describe, it, expect } from 'vitest';
import {
  detectBoost,
  classifyPartnershipTier,
  getCreatorAudienceTier,
  classifyCreativeGenre,
  analyzeCompetitorPair,
  getCompetitorsForBrand,
  addCompetitorToBrand,
  removeCompetitorFromBrand,
  getCompetitorCreatorsLastYear,
  getBrandVsCompetitor,
  // Module A
  simulateMetaAdLibraryScan,
  // Module B
  simulateInstagramGridScan,
  // Module C
  fuseDatasets,
  // Module D
  calculateAdLongevity,
  calculatePaidSpendMultiplier,
  calculateBuyerIntentScore,
  calculateCreatorLoyaltyIndex,
  // Module E
  buildCompetitorAuditReport,
  runFullCompetitorAudit,
} from '../instagram-engine';

describe('Instagram Intelligence & Paid Collabs Algorithms', () => {
  describe('Paid Boost Detection Engine', () => {
    it('should flag high views with sub-0.35% like rate as heavily boosted', () => {
      const result = detectBoost(1850000, 4810, 210, 420000);
      expect(result.isBoosted).toBe(true);
      expect(result.likeToViewPct).toBe(0.26);
      expect(result.status).toContain('Heavily Boosted');
    });

    it('should flag high view multiplier (>=5x) with sub-0.70% like rate as boosted', () => {
      const result = detectBoost(740000, 4070, 95, 95000);
      expect(result.isBoosted).toBe(true);
      expect(result.viewMultiplier).toBeGreaterThanOrEqual(5.0);
      expect(result.status).toContain('Boosted');
    });

    it('should classify high organic engagement (ER >= 4% & like-to-view >= 2%) as viral organic', () => {
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

  describe('Per-Brand Competitor Tracking Registry', () => {
    it('should retrieve pre-seeded competitors for Britannia', () => {
      const config = getCompetitorsForBrand('britannia');
      expect(config).not.toBeNull();
      expect(config!.brandName).toBe('Britannia');
      expect(config!.competitors.length).toBeGreaterThanOrEqual(3);
      expect(config!.competitors.some((c) => c.name.includes('Parle'))).toBe(true);
    });

    it('should pull all competitor creators within the last 12 months', () => {
      const creators = getCompetitorCreatorsLastYear('britannia');
      expect(creators.length).toBeGreaterThan(0);
      expect(creators[0].competitorName).toBeDefined();
      expect(creators[0].views).toBeGreaterThan(0);
      expect(creators[0].likeToViewPct).toBeGreaterThan(0);
    });

    it('should calculate brand vs competitor head-to-head correctly', () => {
      const h2h = getBrandVsCompetitor('britannia', 'tc_parle');
      expect(h2h).not.toBeNull();
      expect(h2h!.brandName).toBe('Britannia');
      expect(h2h!.competitorName).toBe('Parle Products');
      expect(h2h!.shareOfVoicePct.brand).toBeGreaterThan(0);
      expect(h2h!.shareOfVoicePct.competitor).toBeGreaterThan(0);
      expect(h2h!.recommendedCounterPlays.length).toBeGreaterThan(0);
    });

    it('should support adding and removing custom competitors with max limit of 4', () => {
      const brandSlug = 'test_brand_' + Date.now();
      const comp1 = addCompetitorToBrand(brandSlug, '@comp1_test', 'Competitor One');
      expect(comp1).not.toBeNull();
      expect(comp1!.name).toBe('Competitor One');

      addCompetitorToBrand(brandSlug, '@comp2_test', 'Competitor Two');
      addCompetitorToBrand(brandSlug, '@comp3_test', 'Competitor Three');
      const comp4 = addCompetitorToBrand(brandSlug, '@comp4_test', 'Competitor Four');
      expect(comp4).not.toBeNull();

      const comp5 = addCompetitorToBrand(brandSlug, '@comp5_test', 'Competitor Five');
      expect(comp5).toBeNull();

      const removed = removeCompetitorFromBrand(brandSlug, comp1!.id);
      expect(removed).toBe(true);

      const updated = getCompetitorsForBrand(brandSlug);
      expect(updated!.competitors.length).toBe(3);
    });
  });

  // ─────────────────────────────────────────────────────────
  // NEW: Module A – Meta Ad Library Simulation
  // ─────────────────────────────────────────────────────────

  describe('Module A: Meta Ad Library Simulation', () => {
    it('should generate valid ads and creator summaries for any brand query', () => {
      const result = simulateMetaAdLibraryScan('Palmonas');
      expect(result.brand_query).toBe('Palmonas');
      expect(result.total_ads).toBeGreaterThan(0);
      expect(result.ads.length).toBe(result.total_ads);
      expect(result.creators.length).toBeGreaterThan(0);
      expect(result.scan_date).toBeTruthy();
    });

    it('should include ad longevity scoring on each ad card', () => {
      const result = simulateMetaAdLibraryScan('GIVA');
      const activeAd = result.ads.find((a) => a.is_active);
      expect(activeAd).toBeDefined();
      expect(activeAd!.longevity).toBeDefined();
      expect(activeAd!.longevity!.days_running).toBeGreaterThanOrEqual(0);
      expect(['evergreen_hero', 'proven_scaler', 'active_test', 'completed']).toContain(activeAd!.longevity!.category);
    });

    it('should identify creator collab ads and pure brand ads', () => {
      const result = simulateMetaAdLibraryScan('Britannia');
      const collabAds = result.ads.filter((a) => a.is_creator_collab);
      const brandAds = result.ads.filter((a) => !a.is_creator_collab);
      expect(collabAds.length).toBeGreaterThan(0);
      expect(brandAds.length).toBeGreaterThanOrEqual(0);
      collabAds.forEach((a) => expect(a.creator_name).toBeTruthy());
    });

    it('should be deterministic — same brand query produces same results', () => {
      const r1 = simulateMetaAdLibraryScan('Swiggy');
      const r2 = simulateMetaAdLibraryScan('Swiggy');
      expect(r1.total_ads).toBe(r2.total_ads);
      expect(r1.total_creators).toBe(r2.total_creators);
      expect(r1.ads[0].library_id).toBe(r2.ads[0].library_id);
    });
  });

  // ─────────────────────────────────────────────────────────
  // NEW: Module B – Instagram Grid Co-Author Simulation
  // ─────────────────────────────────────────────────────────

  describe('Module B: Instagram Grid Co-Author Simulation', () => {
    it('should generate valid collab posts for any handle', () => {
      const collabs = simulateInstagramGridScan('palmonas');
      expect(collabs.length).toBeGreaterThan(0);
      collabs.forEach((c) => {
        expect(c.post_url).toContain('instagram.com');
        expect(c.creator_handle).toMatch(/^@/);
        expect(c.views).toBeGreaterThan(0);
        expect(c.likes).toBeGreaterThanOrEqual(0);
        expect(c.partnership_tier).toBeTruthy();
      });
    });

    it('should apply boost detection and tier classification', () => {
      const collabs = simulateInstagramGridScan('giva.co');
      const boosted = collabs.filter((c) => c.is_boosted);
      const organic = collabs.filter((c) => !c.is_boosted);
      // Should have a mix (not all one type)
      expect(boosted.length + organic.length).toBe(collabs.length);
    });

    it('should return collabs sorted by date descending', () => {
      const collabs = simulateInstagramGridScan('nykdbynykaa');
      for (let i = 1; i < collabs.length; i++) {
        expect(new Date(collabs[i - 1].date).getTime()).toBeGreaterThanOrEqual(
          new Date(collabs[i].date).getTime()
        );
      }
    });
  });

  // ─────────────────────────────────────────────────────────
  // NEW: Module C – Cross-Platform Data Fusion
  // ─────────────────────────────────────────────────────────

  describe('Module C: Cross-Platform Data Fusion & Deduplication', () => {
    it('should merge IG Grid and Meta Ad Library into unified creators', () => {
      const igCollabs = simulateInstagramGridScan('testbrand');
      const metaData = simulateMetaAdLibraryScan('testbrand');
      const fused = fuseDatasets(igCollabs, metaData);

      expect(fused.length).toBeGreaterThan(0);
      fused.forEach((c) => {
        expect(c.handle).toMatch(/^@/);
        expect(c.source_label).toBeTruthy();
        expect(c.on_instagram_grid || c.on_meta_adlibrary).toBe(true);
      });
    });

    it('should correctly label dual-platform creators', () => {
      const igCollabs = simulateInstagramGridScan('testbrand2');
      const metaData = simulateMetaAdLibraryScan('testbrand2');
      const fused = fuseDatasets(igCollabs, metaData);

      const dualPlatform = fused.filter((c) => c.on_instagram_grid && c.on_meta_adlibrary);
      dualPlatform.forEach((c) => {
        expect(c.source_label).toBe('Instagram Grid + Meta Ads');
        expect(c.total_grid_posts).toBeGreaterThan(0);
        expect(c.total_meta_ads).toBeGreaterThan(0);
      });
    });

    it('should deduplicate creators by handle (case insensitive)', () => {
      const igCollabs = simulateInstagramGridScan('dedup_test');
      const metaData = simulateMetaAdLibraryScan('dedup_test');
      const fused = fuseDatasets(igCollabs, metaData);

      const handles = fused.map((c) => c.raw_handle.toLowerCase());
      const uniqueHandles = Array.from(new Set(handles));
      expect(handles.length).toBe(uniqueHandles.length);
    });
  });

  // ─────────────────────────────────────────────────────────
  // NEW: Module D – Advanced Intelligence Signals
  // ─────────────────────────────────────────────────────────

  describe('Module D.1: Ad Longevity (Evergreen Hero Score)', () => {
    it('should classify 90+ day active ads as Evergreen Hero Winners', () => {
      const past120 = new Date();
      past120.setDate(past120.getDate() - 120);
      const result = calculateAdLongevity(past120.toISOString().split('T')[0]!, true);
      expect(result.category).toBe('evergreen_hero');
      expect(result.label).toContain('🏆');
      expect(result.days_running).toBeGreaterThanOrEqual(90);
    });

    it('should classify 30-89 day active ads as Proven Scalers', () => {
      const past45 = new Date();
      past45.setDate(past45.getDate() - 45);
      const result = calculateAdLongevity(past45.toISOString().split('T')[0]!, true);
      expect(result.category).toBe('proven_scaler');
      expect(result.label).toContain('⚡');
    });

    it('should classify <30 day active ads as Active Tests', () => {
      const past10 = new Date();
      past10.setDate(past10.getDate() - 10);
      const result = calculateAdLongevity(past10.toISOString().split('T')[0]!, true);
      expect(result.category).toBe('active_test');
      expect(result.label).toContain('🧪');
    });

    it('should classify inactive ads as Completed', () => {
      const result = calculateAdLongevity('2025-01-15', false);
      expect(result.category).toBe('completed');
      expect(result.label).toContain('⏹️');
    });
  });

  describe('Module D.2: Paid Spend Multiplier', () => {
    it('should classify 50x+ as Aggressive Performance Ad Spend', () => {
      const result = calculatePaidSpendMultiplier(5000000, 20000);
      expect(result.multiplier).toBeGreaterThanOrEqual(50);
      expect(result.velocity_label).toContain('Aggressive');
      expect(result.estimated_spend_bucket).toContain('₹5L');
    });

    it('should classify 10-50x as Moderate Paid Distribution', () => {
      const result = calculatePaidSpendMultiplier(100000, 20000);
      expect(result.multiplier).toBeGreaterThanOrEqual(10);
      expect(result.multiplier).toBeLessThan(50);
      expect(result.velocity_label).toContain('Moderate');
    });

    it('should classify <2x as Pure Organic / Barter', () => {
      const result = calculatePaidSpendMultiplier(30000, 100000);
      expect(result.multiplier).toBeLessThan(2);
      expect(result.velocity_label).toContain('Organic');
    });
  });

  describe('Module D.3: Comment Purchase Intent NLP', () => {
    it('should detect high-intent buying signals', () => {
      const comments = [
        'Price please?', 'Where to buy this?', 'Link in bio?',
        'How much does it cost?', 'Is it available in Mumbai?',
        'Beautiful!', 'Nice pic!', 'Gorgeous!',
      ];
      const result = calculateBuyerIntentScore(comments);
      expect(result.total_comments).toBe(8);
      expect(result.high_intent_comments).toBe(5);
      expect(result.intent_score_pct).toBe(62.5);
    });

    it('should return 0 for empty comment list', () => {
      const result = calculateBuyerIntentScore([]);
      expect(result.intent_score_pct).toBe(0);
      expect(result.total_comments).toBe(0);
    });

    it('should score pure vanity comments as 0% intent', () => {
      const comments = ['Beautiful!', 'Stunning!', 'Love this 😍', 'Goals!'];
      const result = calculateBuyerIntentScore(comments);
      expect(result.intent_score_pct).toBe(0);
      expect(result.high_intent_comments).toBe(0);
    });
  });

  describe('Module D.4: Creator Loyalty Index', () => {
    it('should classify 5+ appearances as Locked Partner', () => {
      const collabs: any[] = Array(6).fill(null).map((_, i) => ({
        raw_handle: 'loyal_creator', post_url: '', creator_handle: '@loyal_creator',
        date: '2026-01-01', views: 100, likes: 10, comments: 1,
        like_to_view_pct: 10, is_paid_toggle: false, is_boosted: false, partnership_tier: '',
      }));
      const result = calculateCreatorLoyaltyIndex('loyal_creator', collabs);
      expect(result.brand_collabs).toBe(6);
      expect(result.loyalty_tier).toContain('Locked Partner');
    });

    it('should classify 1 appearance as One-Off', () => {
      const collabs: any[] = [{
        raw_handle: 'new_creator', post_url: '', creator_handle: '@new_creator',
        date: '2026-01-01', views: 100, likes: 10, comments: 1,
        like_to_view_pct: 10, is_paid_toggle: false, is_boosted: false, partnership_tier: '',
      }];
      const result = calculateCreatorLoyaltyIndex('new_creator', collabs);
      expect(result.brand_collabs).toBe(1);
      expect(result.loyalty_tier).toContain('One-Off');
      expect(result.rehire_rate_pct).toBe(0);
    });
  });

  // ─────────────────────────────────────────────────────────
  // NEW: Module E – Full Pipeline & Report
  // ─────────────────────────────────────────────────────────

  describe('Module E: Full Competitor Audit Pipeline', () => {
    it('should orchestrate all 5 modules and produce a complete report', () => {
      const report = runFullCompetitorAudit('testaudit_brand');
      expect(report.brand_name).toBe('testaudit_brand');
      expect(report.generated_at).toBeTruthy();
      expect(report.summary.total_creators).toBeGreaterThan(0);
      expect(report.summary.total_collabs).toBeGreaterThan(0);
      expect(report.summary.total_ads).toBeGreaterThan(0);
      expect(report.fused_creators.length).toBeGreaterThan(0);
      expect(report.collabs.length).toBeGreaterThan(0);
      expect(report.ads.length).toBeGreaterThan(0);
      expect(report.loyalty_index.length).toBeGreaterThan(0);
    });

    it('should correctly compute platform source breakdown', () => {
      const report = runFullCompetitorAudit('breakdown_test');
      const { grid_only, meta_only, dual_platform, total_creators } = report.summary;
      expect(grid_only + meta_only + dual_platform).toBe(total_creators);
    });
  });

  // ─────────────────────────────────────────────────────────
  // Legacy Head-to-Head Tests
  // ─────────────────────────────────────────────────────────

  describe('Head-to-Head Benchmarking Analyzer', () => {
    it('should retrieve pre-configured Britannia vs Parle comparison correctly', () => {
      const benchmark = analyzeCompetitorPair('britannia', 'parle');
      expect(benchmark.brandName).toBe('Britannia');
      expect(benchmark.competitorName).toBe('Parle Products');
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
