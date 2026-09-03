import { Providers } from './providers';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { AnalyticsProvider } from '@/components/analytics/analytics-provider';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://align.schbang.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Align by Schbang | Where Creators Meet India\'s Top Brands',
    template: '%s | Align by Schbang',
  },
  description:
    'Align is India\'s premier brand collaboration platform powered by Schbang. Submit verified creator metrics and collaborate on high-budget briefs with top FMCG, Fashion, and Tech brands.',
  keywords: [
    'Schbang',
    'Creator Marketplace',
    'Brand Collaboration India',
    'Influencer Marketing Platform',
    'Instagram Creator Deals',
    'YouTube Brand Sponsorships',
    'Creator Monetization',
    'Align Schbang',
  ],
  authors: [{ name: 'Schbang Digital Solutions', url: 'https://schbang.com' }],
  creator: 'Schbang',
  publisher: 'Schbang Digital Solutions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    title: 'Align by Schbang | Where Creators Meet India\'s Top Brands',
    description:
      'Pitch verified social analytics directly to India\'s marquee brand campaign briefs managed by Schbang.',
    siteName: 'Align by Schbang',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Align by Schbang | Where Creators Meet India\'s Top Brands',
    description:
      'Pitch verified social analytics directly to India\'s marquee brand campaign briefs managed by Schbang.',
    creator: '@schbang',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Align by Schbang',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      parentOrganization: {
        '@type': 'Organization',
        name: 'Schbang Digital Solutions',
        url: 'https://schbang.com',
      },
      sameAs: [
        'https://www.instagram.com/schbang',
        'https://www.linkedin.com/company/schbang',
        'https://twitter.com/schbang',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Align by Schbang',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/brands?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`min-h-screen flex flex-col font-sans antialiased text-text-primary bg-background selection:bg-accent selection:text-white`}>
        <AnalyticsProvider />
        <Providers>
          <Navbar />
          <main className="flex-1 pt-20 sm:pt-22">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
