import type { Metadata } from "next";
import { INITIAL_BRANDS } from "@/lib/mock-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://align.schbang.com";

export const metadata: Metadata = {
  title: `${INITIAL_BRANDS.length} Open Brand Briefs for Creators`,
  description:
    "Paid Instagram and YouTube campaign briefs from Britannia, NIVEA, Swiggy, Myntra, Fevicol and Kotak811. Browse free, pitch from ₹50/month. Managed by Schbang.",
  alternates: { canonical: `${siteUrl}/brands` },
  openGraph: {
    title: `${INITIAL_BRANDS.length} open brand briefs for creators`,
    description: "Paid campaign briefs from India's biggest brands. Browse free, pitch with your real numbers.",
    url: `${siteUrl}/brands`,
  },
};

export default function BrandsLayout({ children }: { children: React.ReactNode }) {
  // ItemList lets Google show the briefs as a carousel and gives each brief
  // page a parent in the graph.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Open brand briefs on Align",
    numberOfItems: INITIAL_BRANDS.length,
    itemListElement: INITIAL_BRANDS.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}/brands/${b.slug}`,
      name: `${b.name} creator campaign brief`,
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
