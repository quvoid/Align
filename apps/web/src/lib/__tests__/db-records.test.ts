import { describe, it, expect } from 'vitest';
import type { Application, Brand, CreatorProfile as ProfileRow, Membership as MembershipRow } from '@branddeals/database';
import { INITIAL_BRANDS } from '../mock-data';
import {
  ApplicationReviewSchema,
  BriefInputSchema,
  PitchInputSchema,
  ProfileInputSchema,
  briefCreateData,
  briefInputFromItem,
  industryFromLabel,
  isMembershipRowActive,
  isProfileRowComplete,
  pitchAllowance,
  pitchSnapshot,
  readBriefDetails,
  toApplicationItem,
  toBrandItem,
  toClientMembership,
  toCreatorItem,
  toCreatorProfile,
} from '../db-records';

/** Stand-in for Prisma.Decimal: the code only ever Number()s or String()s it. */
const decimal = (n: number) => ({ valueOf: () => n, toString: () => String(n) }) as unknown as ProfileRow['igEngagementRate'];

const blankProfile = {
  name: 'Priya Nair',
  location: '',
  bio: '',
  niche: '',
  igHandle: '',
  igFollowers: '',
  igER: '',
  ytChannel: '',
  ytSubscribers: '',
  ytAvgViews: '',
  fbFollowers: '',
  mediaKitUrl: '',
  phone: '',
  website: '',
};

const firstIssue = (result: { success: boolean; error?: { issues: { message: string }[] } }) =>
  result.success ? undefined : result.error?.issues[0]?.message;

describe('profile input', () => {
  it('stores the Instagram handle the way the unique constraint expects', () => {
    const parse = (igHandle: string) => ProfileInputSchema.parse({ ...blankProfile, igHandle }).igHandle;
    expect(parse('@Foodie_Priya')).toBe('foodie_priya');
    expect(parse('https://www.instagram.com/foodie_priya/?hl=en')).toBe('foodie_priya');
    expect(parse('   ')).toBeNull();
  });

  it('reads follower counts the way people type them', () => {
    const parse = (igFollowers: string) => ProfileInputSchema.parse({ ...blankProfile, igFollowers }).igFollowers;
    expect(parse('12,000')).toBe(12000);
    expect(parse('1.2k')).toBe(1200);
    expect(parse('2M')).toBe(2_000_000);
    expect(parse('')).toBeNull();
  });

  it('rejects numbers and links that would corrupt the profile', () => {
    expect(firstIssue(ProfileInputSchema.safeParse({ ...blankProfile, igFollowers: 'lots' }))).toBe(
      'Instagram followers must be a number'
    );
    expect(firstIssue(ProfileInputSchema.safeParse({ ...blankProfile, igER: '140' }))).toBe(
      'Engagement rate must be between 0 and 100'
    );
    // Media kit links are opened by admins; only http(s) is allowed.
    expect(ProfileInputSchema.safeParse({ ...blankProfile, mediaKitUrl: 'javascript:alert(1)' }).success).toBe(false);
    expect(ProfileInputSchema.safeParse({ ...blankProfile, mediaKitUrl: 'https://drive.google.com/x' }).success).toBe(true);
  });

  it('splits the niche list and round-trips back to the form shape', () => {
    const input = ProfileInputSchema.parse({ ...blankProfile, niche: 'Comedy, Food & FMCG, ', igHandle: '@rohan', igER: '6.8' });
    expect(input.niche).toEqual(['Comedy', 'Food & FMCG']);

    const row = {
      igHandle: input.igHandle,
      niche: input.niche,
      igEngagementRate: decimal(6.8),
      igFollowers: 145000,
    } as unknown as ProfileRow;
    const profile = toCreatorProfile({ name: 'Rohan Joshi', email: 'rohan@example.com', avatar: null }, row);
    expect(profile.igHandle).toBe('@rohan');
    expect(profile.handle).toBe('@rohan');
    expect(profile.niche).toBe('Comedy, Food & FMCG');
    expect(profile.igER).toBe('6.8');
    expect(profile.avatar).toContain('dicebear');
    expect(isProfileRowComplete(row)).toBe(true);
    expect(isProfileRowComplete({ igHandle: 'rohan', niche: [] })).toBe(false);
  });
});

describe('briefs', () => {
  it('keeps every built-in brief intact through the database shape', () => {
    for (const item of INITIAL_BRANDS) {
      const data = briefCreateData(briefInputFromItem(item));
      const row = { ...data, id: 'row-id', createdAt: new Date(), updatedAt: new Date(), _count: { likes: 4 } } as Brand & {
        _count: { likes: number };
      };
      expect(toBrandItem(row)).toEqual({ ...item, id: 'row-id', likesCount: 4 });
    }
  });

  it('maps free-text industries onto the Prisma enum', () => {
    expect(industryFromLabel('Food Delivery & Tech')).toBe('FOOD');
    expect(industryFromLabel('Finance & FinTech')).toBe('FINANCE');
    expect(industryFromLabel('Lifestyle & DIY')).toBe('LIFESTYLE');
    expect(industryFromLabel('Personal Care')).toBe('BEAUTY');
    expect(industryFromLabel('Pet supplies')).toBe('OTHER');
  });

  it('reads rows written without the brief details JSON', () => {
    const details = readBriefDetails({ requirements: 'Min 50k followers', industry: 'FOOD', campaignTypes: ['INSTAGRAM_REEL', 'X_POST'] });
    expect(details).toEqual({ text: 'Min 50k followers', formats: ['Instagram Reel', 'X Post'], industryLabel: 'Food' });
  });

  it('validates the admin brief form', () => {
    const ok = BriefInputSchema.parse({
      name: 'Puma India',
      industry: 'Fashion & Apparel',
      budgetTier: 'Micro',
      description: 'Sneaker drop for college creators.',
      requirements: '',
      campaignTypes: 'Instagram Reel, Story with link',
      logo: '',
      coverImage: '',
      contactEmail: '',
      website: '',
    });
    expect(ok.campaignTypes).toEqual(['Instagram Reel', 'Story with link']);
    expect(briefCreateData({ ...ok, slug: 'puma-india' }).campaignTypes).toEqual(['INSTAGRAM_REEL', 'INSTAGRAM_STORY']);
    expect(BriefInputSchema.safeParse({ ...ok, website: 'javascript:alert(1)' }).success).toBe(false);
  });
});

describe('pitches', () => {
  const validPitch = {
    briefSlug: 'britannia',
    proposal: 'A 60-second Reel where three generations fight over the last Jim Jam during a match.',
    expectedRate: '45,000',
    deliverables: ['Instagram Reel'],
    metrics: { instagramHandle: '@rohan', instagramFollowers: '145000', instagramER: '6.8%', xHandle: '' },
    applicant: { phone: '+91 98765 43210', website: '' },
  };

  it('allows free pitches, then needs a plan', () => {
    expect(pitchAllowance(0, false)).toEqual({ freePitchesLeft: 3, canPitch: true });
    expect(pitchAllowance(3, false)).toEqual({ freePitchesLeft: 0, canPitch: false });
    expect(pitchAllowance(7, true)).toEqual({ freePitchesLeft: 0, canPitch: true });
  });

  it('validates the pitch and snapshots only what was filled in', () => {
    const input = PitchInputSchema.parse(validPitch);
    expect(input.expectedRate).toBe(45000);
    expect(pitchSnapshot(input)).toEqual({
      instagramHandle: '@rohan',
      instagramFollowers: 145000,
      instagramER: '6.8%',
      applicant: { phone: '+91 98765 43210' },
    });
    expect(firstIssue(PitchInputSchema.safeParse({ ...validPitch, proposal: 'Too short' }))).toBe(
      'Write at least 50 characters about your idea'
    );
    expect(firstIssue(PitchInputSchema.safeParse({ ...validPitch, deliverables: [] }))).toBe('Pick at least one deliverable');
  });

  it('turns a stored application into what the dashboards render', () => {
    const input = PitchInputSchema.parse(validPitch);
    const row = {
      id: 'app-1',
      creatorId: 'u1',
      brandId: 'b1',
      status: 'SHORTLISTED',
      proposal: input.proposal,
      expectedRate: decimal(45000),
      deliverables: input.deliverables,
      metricsSnapshot: pitchSnapshot(input),
      adminNotes: 'Loved it — send a rough cut by Friday.',
      reviewedBy: 'admin@schbang.com',
      reviewedAt: new Date('2026-09-28T10:00:00Z'),
      createdAt: new Date('2026-09-27T09:00:00Z'),
      updatedAt: new Date('2026-09-28T10:00:00Z'),
      creator: { id: 'u1', name: 'Rohan Joshi', email: 'rohan@example.com' },
      brand: { id: 'b1', name: 'Britannia', slug: 'britannia', logo: '/b.png' },
    } as unknown as Application & {
      creator: { id: string; name: string; email: string };
      brand: { id: string; name: string; slug: string; logo: string };
    };
    const item = toApplicationItem(row);
    expect(item).toMatchObject({
      creatorName: 'Rohan Joshi',
      brandName: 'Britannia',
      brandSlug: 'britannia',
      status: 'SHORTLISTED',
      date: '2026-09-27',
      expectedRate: 45000,
      adminNotes: 'Loved it — send a rough cut by Friday.',
      applicant: { phone: '+91 98765 43210' },
    });
    expect(item.metrics).toEqual({ instagramHandle: '@rohan', instagramFollowers: 145000, instagramER: '6.8%' });
  });

  it('never lets an admin set WITHDRAWN', () => {
    expect(ApplicationReviewSchema.safeParse({ status: 'WITHDRAWN' }).success).toBe(false);
    expect(ApplicationReviewSchema.safeParse({}).success).toBe(false);
    expect(ApplicationReviewSchema.parse({ adminNotes: '' })).toEqual({ adminNotes: null });
  });
});

describe('membership', () => {
  const row = (overrides: Partial<MembershipRow>): MembershipRow => ({
    id: 'm1',
    userId: 'u1',
    plan: 'MONTHLY',
    status: 'ACTIVE',
    source: 'GRANT',
    activatedAt: new Date('2026-09-01T00:00:00Z'),
    expiresAt: new Date('2026-10-01T00:00:00Z'),
    cancelledAt: null,
    latestPaymentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  it('treats an expired or cancelled plan as inactive', () => {
    const now = new Date('2026-09-15T00:00:00Z');
    expect(isMembershipRowActive(row({}), now)).toBe(true);
    expect(isMembershipRowActive(row({}), new Date('2026-10-02T00:00:00Z'))).toBe(false);
    expect(isMembershipRowActive(row({ status: 'CANCELLED' }), now)).toBe(false);
    expect(isMembershipRowActive(row({ plan: 'ALL_ACCESS', expiresAt: null }), new Date('2030-01-01'))).toBe(true);
    expect(isMembershipRowActive(null, now)).toBe(false);
  });

  it('maps to the client Membership shape', () => {
    expect(toClientMembership(row({}))).toEqual({
      plan: 'monthly',
      status: 'active',
      activatedAt: '2026-09-01T00:00:00.000Z',
      renewsAt: '2026-10-01T00:00:00.000Z',
      orderId: 'grant_m1',
    });
  });
});

describe('admin creator directory', () => {
  it('builds a directory card from real account data', () => {
    const item = toCreatorItem({
      id: 'u1',
      name: 'Aanya Sen',
      email: 'aanya@example.com',
      avatar: null,
      creatorProfile: {
        igHandle: 'aanya.beauty',
        igFollowers: 68000,
        igEngagementRate: decimal(7.9),
        ytSubscribers: 34000,
        ytAvgViews: 28000,
        niche: ['Beauty'],
        location: 'Bangalore',
        bio: 'Skincare routines.',
        mediaKit: null,
        fbFollowers: null,
        verificationStatus: 'UNVERIFIED',
      } as unknown as ProfileRow,
      applications: [
        { status: 'APPROVED', createdAt: new Date('2026-09-01'), reviewedAt: new Date('2026-09-05'), deliverables: ['Instagram Reel'], brand: { name: 'Enamor', logo: '/e.png' } },
        { status: 'WITHDRAWN', createdAt: new Date('2026-09-02'), reviewedAt: null, deliverables: [], brand: { name: 'Myntra', logo: '/m.png' } },
        { status: 'PENDING', createdAt: new Date('2026-09-03'), reviewedAt: null, deliverables: [], brand: { name: 'Swiggy', logo: '/s.png' } },
      ],
      brandLikes: [{ brandId: 'b1' }],
    });
    expect(item.tier).toBe('Mid-Tier');
    expect(item.handle).toBe('@aanya.beauty');
    expect(item.igEngagementRate).toBe(7.9);
    expect(item.verified).toBe(false);
    expect(item.pitchCount).toBe(2);
    expect(item.brandCollaborations.map((c) => c.brandName)).toEqual(['Enamor']);
    expect(item.brandCollaborations[0]?.completedAt).toBe('2026-09-05');
    expect(item.performance).toBeUndefined();
    expect(item.likedBrandIds).toEqual(['b1']);
  });
});
