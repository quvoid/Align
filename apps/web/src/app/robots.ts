import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://align.schbang.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/brands', '/brands/*', '/pricing', '/about', '/contact', '/privacy', '/terms'],
        // Gated or transactional pages: never worth a crawl budget, and
        // /creators is admin-only so it would just index a lock screen.
        disallow: ['/admin', '/dashboard', '/apply', '/join', '/creators', '/auth', '/api'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
