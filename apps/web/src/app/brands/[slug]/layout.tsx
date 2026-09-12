import type { Metadata } from "next";
import { INITIAL_BRANDS } from "@/lib/mock-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://align.schbang.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = INITIAL_BRANDS.find((b) => b.slug === slug);
  if (!brand) return { title: "Brief not found", robots: { index: false } };

  const tier = /tier/i.test(brand.budgetTier) ? brand.budgetTier : `${brand.budgetTier} tier`;
  const title = `${brand.name} Creator Campaign Brief — ${tier}, ${brand.industry}`;
  const description = `${brand.description} Pitch your Instagram or YouTube numbers to ${brand.name} on Align by Schbang.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/brands/${brand.slug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/brands/${brand.slug}`,
      images: brand.coverImage ? [{ url: brand.coverImage, alt: `${brand.name} campaign` }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return children;
}
