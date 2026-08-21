import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://align.schbang.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/brands', '/brands/*', '/about', '/contact', '/privacy', '/terms'],
        disallow: ['/admin', '/admin/*', '/dashboard', '/dashboard/*', '/api/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
