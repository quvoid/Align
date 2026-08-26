import { describe, it, expect, beforeEach } from 'vitest';
import {
  getUserData,
  createBlankProfile,
  addApplication,
  removeApplication,
  toggleLike,
  updateProfile,
} from '../user-store';
import { ApplicationItem } from '../mock-data';

describe('User Store Layer (Domain & State Isolation)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize a blank profile for new users with clean defaults', () => {
    const profile = createBlankProfile('Omkar Rakshe', 'omkar@gmail.com', null);
    expect(profile.name).toBe('Omkar Rakshe');
    expect(profile.email).toBe('omkar@gmail.com');
    expect(profile.handle).toBe('@omkar_rakshe');
    expect(profile.bio).toBe('');
    expect(profile.igFollowers).toBe('');
  });

  it('should isolate data between different user accounts', () => {
    const userA = getUserData('creatorA@gmail.com', 'Creator A');
    const userB = getUserData('creatorB@gmail.com', 'Creator B');

    expect(userA.applications).toHaveLength(0);
    expect(userB.applications).toHaveLength(0);

    const appForA: ApplicationItem = {
      id: 'app_a1',
      creatorName: 'Creator A',
      creatorEmail: 'creatorA@gmail.com',
      brandId: '1',
      brandName: 'Britannia',
      status: 'PENDING',
      date: '2026-02-26',
      proposal: 'Creative food review reel',
      expectedRate: 50000,
      deliverables: ['1x Reel'],
      metrics: { instagramFollowers: 100000 },
    };

    addApplication('creatorA@gmail.com', appForA);

    const updatedA = getUserData('creatorA@gmail.com');
    const updatedB = getUserData('creatorB@gmail.com');

    expect(updatedA.applications).toHaveLength(1);
    expect(updatedA.applications[0]?.brandName).toBe('Britannia');
    expect(updatedB.applications).toHaveLength(0); // Isolated!
  });

  it('should prevent duplicate applications to the same brand brief', () => {
    const app: ApplicationItem = {
      id: 'app_1',
      creatorName: 'Omkar',
      creatorEmail: 'omkar@gmail.com',
      brandId: '2',
      brandName: 'Fevicol',
      status: 'PENDING',
      date: '2026-02-26',
      proposal: 'Quirky sketch',
      expectedRate: 40000,
      deliverables: ['1x Reel'],
      metrics: {},
    };

    addApplication('omkar@gmail.com', app);
    addApplication('omkar@gmail.com', { ...app, id: 'app_2' }); // Duplicate brandId

    const data = getUserData('omkar@gmail.com');
    expect(data.applications).toHaveLength(1);
  });

  it('should toggle brand likes correctly', () => {
    const email = 'user@test.com';
    const isLikedFirst = toggleLike(email, 'brand_123');
    expect(isLikedFirst).toBe(true);
    expect(getUserData(email).likedBrandIds).toContain('brand_123');

    const isLikedSecond = toggleLike(email, 'brand_123');
    expect(isLikedSecond).toBe(false);
    expect(getUserData(email).likedBrandIds).not.toContain('brand_123');
  });

  it('should remove applications when withdrawn by creator', () => {
    const email = 'test@creator.com';
    const app: ApplicationItem = {
      id: 'app_del',
      creatorName: 'Test Creator',
      creatorEmail: email,
      brandId: '5',
      brandName: 'Kotak811',
      status: 'PENDING',
      date: '2026-02-26',
      proposal: 'Fintech breakdown',
      expectedRate: 60000,
      deliverables: ['1x Video'],
      metrics: {},
    };

    addApplication(email, app);
    expect(getUserData(email).applications).toHaveLength(1);

    removeApplication(email, 'app_del');
    expect(getUserData(email).applications).toHaveLength(0);
  });

  it('should persist profile updates across reads', () => {
    const email = 'profile@test.com';
    const initial = getUserData(email, 'John Doe');
    const updatedProfile = {
      ...initial.profile,
      bio: 'Award-winning storyteller & food vlogger',
      igHandle: '@johndoe_food',
      igFollowers: '250000',
    };

    updateProfile(email, updatedProfile);
    const readBack = getUserData(email);
    expect(readBack.profile.bio).toBe('Award-winning storyteller & food vlogger');
    expect(readBack.profile.igFollowers).toBe('250000');
  });
});
