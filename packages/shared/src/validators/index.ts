import { z } from 'zod';
import { INDUSTRIES, CAMPAIGN_TYPES, BUDGET_TIERS } from '../constants';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export const applicationSubmitSchema = z.object({
  brandId: z.string().cuid('Invalid brand ID'),
  proposal: z.string().min(50, 'Proposal must be at least 50 characters'),
  expectedRate: z.number().positive('Expected rate must be a positive number').optional(),
  deliverables: z.record(z.any()).refine(val => Object.keys(val).length > 0, 'At least one deliverable is required'),
  metricsSnapshot: z.record(z.any()),
});

export const creatorProfileSchema = z.object({
  igHandle: z.string().optional(),
  igFollowers: z.number().nonnegative().optional(),
  igEngagementRate: z.number().min(0).max(100).optional(),
  igAvgLikes: z.number().nonnegative().optional(),
  igAvgComments: z.number().nonnegative().optional(),
  ytChannel: z.string().optional(),
  ytSubscribers: z.number().nonnegative().optional(),
  ytAvgViews: z.number().nonnegative().optional(),
  ytEngagementRate: z.number().min(0).max(100).optional(),
  fbPage: z.string().optional(),
  fbFollowers: z.number().nonnegative().optional(),
  fbEngagementRate: z.number().min(0).max(100).optional(),
  xHandle: z.string().optional(),
  xFollowers: z.number().nonnegative().optional(),
  xEngagementRate: z.number().min(0).max(100).optional(),
  niche: z.array(z.string()).optional(),
  location: z.string().optional(),
  languages: z.array(z.string()).optional(),
  mediaKit: z.string().url('Invalid URL format').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: z.string().url('Invalid URL format').optional(),
  phone: z.string().optional(),
});

export const brandCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  logo: z.string(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  industry: z.enum(INDUSTRIES as [string, ...string[]]),
  campaignTypes: z.array(z.enum(CAMPAIGN_TYPES as [string, ...string[]])).min(1, 'At least one campaign type is required'),
  budgetTier: z.enum(BUDGET_TIERS as [string, ...string[]]),
  requirements: z.record(z.any()),
  contactEmail: z.string().email('Invalid email format').optional(),
  website: z.string().url('Invalid URL format').optional(),
});

export const brandUpdateSchema = brandCreateSchema.partial();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
