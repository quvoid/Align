import { MOCK_BRANDS, MOCK_APPLICATIONS } from './mock-data';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  // Try real API first
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('API call failed, falling back to mock data', e);
  }

  // Fallback to mock data logic
  if (endpoint.includes('/brands/')) {
    const slug = endpoint.split('/brands/')[1];
    return MOCK_BRANDS.find(b => b.slug === slug) as any;
  }
  if (endpoint.includes('/brands')) {
    return MOCK_BRANDS as any;
  }
  if (endpoint.includes('/applications')) {
    return MOCK_APPLICATIONS as any;
  }

  throw new Error('API route not mocked or failed');
}

export const api = {
  getBrands: () => fetchApi<any>('/brands'),
  getBrandBySlug: (slug: string) => fetchApi<any>(`/brands/${slug}`),
  submitApplication: (data: any) => fetchApi<any>('/applications', { method: 'POST', body: JSON.stringify(data) }),
  getMyApplications: () => fetchApi<any>('/applications/me'),
  updateProfile: (data: any) => fetchApi<any>('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
};
