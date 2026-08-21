import { INITIAL_BRANDS, INITIAL_APPLICATIONS } from './mock-data';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
      return await res.json();
    }
  } catch {
    // Graceful fallback to mock data without blocking render
  }

  // Instant fallback to mock data
  if (endpoint.includes('/brands/')) {
    const slug = endpoint.split('/brands/')[1];
    return INITIAL_BRANDS.find(b => b.slug === slug) as any;
  }
  if (endpoint.includes('/brands')) {
    return INITIAL_BRANDS as any;
  }
  if (endpoint.includes('/applications')) {
    return INITIAL_APPLICATIONS as any;
  }

  throw new Error('API route not available');
}

export const api = {
  getBrands: () => fetchApi<any>('/brands'),
  getBrandBySlug: (slug: string) => fetchApi<any>(`/brands/${slug}`),
  submitApplication: (data: any) => fetchApi<any>('/applications', { method: 'POST', body: JSON.stringify(data) }),
  getMyApplications: () => fetchApi<any>('/applications/me'),
  updateProfile: (data: any) => fetchApi<any>('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
};
