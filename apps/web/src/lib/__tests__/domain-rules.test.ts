import { describe, it, expect } from 'vitest';
import { INITIAL_BRANDS, INITIAL_CREATORS, INITIAL_APPLICATIONS } from '../mock-data';

describe('Domain Consistency & Business Rules', () => {
  it('every brand brief must have unique slugs and valid budget tiers', () => {
    const slugs = new Set<string>();
    const validTiers = ['Nano', 'Micro', 'Mid-Tier', 'Macro', 'Mega'];

    for (const brand of INITIAL_BRANDS) {
      expect(slugs.has(brand.slug)).toBe(false);
      slugs.add(brand.slug);
      expect(validTiers).toContain(brand.budgetTier);
      expect(brand.campaignTypes.length).toBeGreaterThan(0);
    }
  });

  it('creator profiles must have non-negative follower counts and valid ER', () => {
    for (const creator of INITIAL_CREATORS) {
      expect(creator.igFollowers).toBeGreaterThanOrEqual(0);
      expect(creator.igEngagementRate).toBeGreaterThan(0);
      expect(creator.performance.reliabilityScore).toBeLessThanOrEqual(5.0);
      expect(creator.performance.reliabilityScore).toBeGreaterThanOrEqual(1.0);
    }
  });

  it('all initial applications must reference valid brands and have status', () => {
    const brandIds = new Set(INITIAL_BRANDS.map((b) => b.id));
    const validStatuses = ['PENDING', 'UNDER_REVIEW', 'SHORTLISTED', 'APPROVED', 'REJECTED'];

    for (const app of INITIAL_APPLICATIONS) {
      expect(brandIds.has(app.brandId)).toBe(true);
      expect(validStatuses).toContain(app.status);
      expect(app.expectedRate).toBeGreaterThan(0);
      expect(app.deliverables.length).toBeGreaterThan(0);
    }
  });
});
