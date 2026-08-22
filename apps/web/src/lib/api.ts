import {
  INITIAL_BRANDS,
  INITIAL_APPLICATIONS,
  INITIAL_CREATORS,
  type BrandItem,
  type ApplicationItem,
  type CreatorItem,
} from './mock-data';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetchApi<T>(endpoint: string, fallbackData?: T, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  // Try real API with a quick 1.2s timeout so the UI never hangs
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    
    if (res.ok) {
      return (await res.json()) as T;
    }
  } catch {
    // Graceful fallback to mock data
  }

  if (fallbackData !== undefined) {
    return fallbackData;
  }

  throw new Error(`API route ${endpoint} not available`);
}

export const api = {
  getBrands: (): Promise<BrandItem[]> =>
    fetchApi<BrandItem[]>('/brands', INITIAL_BRANDS),

  getBrandBySlug: (slug: string): Promise<BrandItem | undefined> =>
    fetchApi<BrandItem | undefined>(
      `/brands/${slug}`,
      INITIAL_BRANDS.find((b) => b.slug === slug)
    ),

  getCreators: (): Promise<CreatorItem[]> =>
    fetchApi<CreatorItem[]>('/creators', INITIAL_CREATORS),

  getCreatorById: (id: string): Promise<CreatorItem | undefined> =>
    fetchApi<CreatorItem | undefined>(
      `/creators/${id}`,
      INITIAL_CREATORS.find((c) => c.id === id)
    ),

  submitApplication: (data: Record<string, unknown>): Promise<{ success: boolean }> =>
    fetchApi<{ success: boolean }>(
      '/applications',
      { success: true },
      { method: 'POST', body: JSON.stringify(data) }
    ),

  getMyApplications: (): Promise<ApplicationItem[]> =>
    fetchApi<ApplicationItem[]>('/applications/me', INITIAL_APPLICATIONS),

  updateProfile: (data: Record<string, unknown>): Promise<{ success: boolean }> =>
    fetchApi<{ success: boolean }>(
      '/users/profile',
      { success: true },
      { method: 'PUT', body: JSON.stringify(data) }
    ),
};
