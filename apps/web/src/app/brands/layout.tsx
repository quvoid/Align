import type { Metadata } from "next";
import { listActiveBriefs } from "@/server/briefs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://align.schbang.com";

export async function generateMetadata(): Promise<Metadata> {
  const briefs = await listActiveBriefs();
  const names = briefs.slice(0, 6).map((b) => b.name);
  const brandList =
    names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0] ?? "India's biggest brands";
  return {
    title: `${briefs.length} Open Brand Briefs for Creators`,
    description: `Paid Instagram and YouTube campaign briefs from ${brandList}. Browse free, pitch from ₹50/month. Managed by Schbang.`,
    alternates: { canonical: `${siteUrl}/brands` },
    openGraph: {
      title: `${briefs.length} open brand briefs for creators`,
      description: "Paid campaign briefs from India's biggest brands. Browse free, pitch with your real numbers.",
      url: `${siteUrl}/brands`,
    },
  };
}

export default async function BrandsLayout({ children }: { children: React.ReactNode }) {
  const briefs = await listActiveBriefs();
  // ItemList lets Google show the briefs as a carousel and gives each brief
  // page a parent in the graph.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Open brand briefs on Align",
    numberOfItems: briefs.length,
    itemListElement: briefs.map((b, i) => ({
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
