export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password?: string;
  role?: 'CREATOR' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface BrandListResponse {
  id: string;
  name: string;
  slug: string;
  logo: string;
  industry: string;
  budgetTier: string;
  campaignTypes: string[];
}

export interface BrandDetailResponse extends BrandListResponse {
  description: string;
  coverImage?: string;
  requirements: Record<string, any>;
  contactEmail?: string;
  website?: string;
}

export interface ApplicationSubmitRequest {
  brandId: string;
  proposal: string;
  expectedRate?: number;
  deliverables: Record<string, any>;
  metricsSnapshot: Record<string, any>;
}

export interface ApplicationListResponse {
  id: string;
  status: string;
  brand: BrandListResponse;
  createdAt: string;
}

export interface CreatorProfileUpdateRequest {
  igHandle?: string;
  igFollowers?: number;
  igEngagementRate?: number;
  igAvgLikes?: number;
  igAvgComments?: number;
  ytChannel?: string;
  ytSubscribers?: number;
  ytAvgViews?: number;
  ytEngagementRate?: number;
  fbPage?: string;
  fbFollowers?: number;
  fbEngagementRate?: number;
  xHandle?: string;
  xFollowers?: number;
  xEngagementRate?: number;
  niche?: string[];
  location?: string;
  languages?: string[];
  mediaKit?: string;
  bio?: string;
  website?: string;
  phone?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}
