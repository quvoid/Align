import { MetadataRoute } from 'next';
import { INITIAL_BRANDS } from '@/lib/mock-data';

/**
 * Public, indexable URLs only. Anything behind sign-in (dashboard, admin,
 * apply, join) or role-gated (creators directory is admin-only) stays out.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://align.schbang.com';
  const now = new Date();

  const brandUrls = INITIAL_BRANDS.map((brand) => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/brands`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  return [...staticUrls, ...brandUrls];
}
