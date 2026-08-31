"use client";

import { use } from "react";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { INITIAL_BRANDS } from '@/lib/mock-data';
import { getCompetitorsForBrand } from '@/lib/instagram-engine';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, ChevronRight, ArrowRight, ShieldCheck, Sparkles, Building2, Zap } from 'lucide-react';

export default function BrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const brand = INITIAL_BRANDS.find(b => b.slug === resolvedParams.slug);

  if (!brand) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold text-primary mb-2">Campaign Brief Not Found</h1>
        <p className="text-text-secondary text-sm mb-6">The brand brief you requested is either expired or invalid.</p>
        <Link href="/brands">
          <Button variant="accent">Explore All Brand Briefs</Button>
        </Link>
      </div>
    );
  }

  const { data: session } = useSession();
  const isAdminOrBrand = session?.user?.role === 'ADMIN' || (session?.user as any)?.role === 'BRAND';
  const competitorConfig = getCompetitorsForBrand(brand.slug);

  // Related briefs for internal SEO linking
  const relatedBrands = INITIAL_BRANDS.filter(b => b.slug !== brand.slug).slice(0, 3);

  // Schema.org Structured Data for Google Rich Snippets & AI GEO Search
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://align.schbang.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Brand Briefs",
            "item": "https://align.schbang.com/brands"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${brand.name} Creator Campaign`,
            "item": `https://align.schbang.com/brands/${brand.slug}`
          }
        ]
      },
      {
        "@type": "Product",
        "name": `${brand.name} Influencer Campaign Brief`,
        "description": brand.description,
        "image": brand.logo,
        "brand": {
          "@type": "Brand",
          "name": brand.name
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Schbang Digital Solutions",
            "url": "https://schbang.com"
          }
        }
      }
    ]
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Inject Schema.org JSON-LD for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation for SEO */}
      <div className="bg-white border-b border-border py-3">
        <div className="container mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-text-secondary">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/brands" className="hover:text-accent transition-colors">Brand Briefs</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-primary">{brand.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="h-64 md:h-80 w-full relative bg-black">
        <img src={brand.coverImage} alt={`${brand.name} Brand Campaign`} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="container mx-auto px-4 relative h-full flex items-end pb-8">
          <Link href="/brands" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-semibold mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to All Briefs
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        {/* Brand Card Header */}
        <div className="bg-white rounded-3xl border border-border p-6 md:p-8 shadow-xl mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-5">
            <img
              src={brand.logo}
              alt={`${brand.name} Logo`}
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-white shadow-lg object-cover bg-white"
            />
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h1 className="text-2xl md:text-3xl font-black text-primary">{brand.name}</h1>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="default">{brand.industry}</Badge>
                <Badge variant={brand.budgetTier === 'Mega' || brand.budgetTier === 'Macro' ? 'approved' : brand.budgetTier === 'Mid-Tier' ? 'under_review' : 'default'}>
                  {brand.budgetTier} Tier
                </Badge>
                <span className="text-xs text-text-secondary font-medium ml-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  Managed by Schbang
                </span>
              </div>
            </div>
          </div>

          <Link href={`/apply/${brand.slug}`} className="w-full md:w-auto">
            <Button variant="accent" size="lg" className="w-full md:w-auto shadow-xl shadow-accent/25 py-6 px-8 text-sm font-bold">
              <Sparkles className="w-4 h-4 mr-2" />
              Apply for this Campaign
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-border">
              <h2 className="text-lg font-bold text-primary mb-3">About the Campaign Brief</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{brand.description}</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-border">
              <h2 className="text-lg font-bold text-primary mb-4">Required Creative Deliverables</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {brand.campaignTypes.map(type => (
                  <div key={type} className="flex items-center gap-2.5 bg-gray-50 px-4 py-3 rounded-xl border border-border text-xs font-semibold text-primary">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-3xl p-6 border border-border shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-primary text-sm mb-3">Creator Eligibility Criteria</h3>
                <div className="bg-emerald-50/60 border border-emerald-200/70 p-4 rounded-2xl text-xs text-emerald-950 leading-relaxed font-medium">
                  {brand.requirements}
                </div>
              </div>

              <div className="border-t border-border pt-4 text-xs text-text-secondary space-y-2">
                <div className="flex justify-between">
                  <span>Agency Management:</span>
                  <span className="font-semibold text-primary">Schbang Influencer Wing</span>
                </div>
                <div className="flex justify-between">
                  <span>Support Email:</span>
                  <span className="font-semibold text-primary">{brand.contactEmail || "briefs@schbang.com"}</span>
                </div>
              </div>

              <Link href={`/apply/${brand.slug}`}>
                <Button variant="accent" className="w-full mt-2">
                  Submit Proposal
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Competitor Intelligence Section (Admin / Brand Managers Only) */}
        {isAdminOrBrand && competitorConfig && (
          <div className="mt-12 p-6 rounded-3xl bg-primary text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent uppercase tracking-wider mb-1">
                  <Zap className="mr-1.5 h-3.5 w-3.5" />
                  Competitor Intelligence Watchlist
                </div>
                <h3 className="text-xl font-bold">
                  Tracking {competitorConfig.competitors.length} Competitors for {brand.name}
                </h3>
                <p className="text-xs text-white/70">
                  Analyze competitor creator collabs, paid boost ratios, and 12-month historical performance.
                </p>
              </div>

              <Link href={`/admin/brands/${brand.slug}/competitors`}>
                <Button variant="accent" size="sm" className="font-bold text-xs shadow-md shadow-accent/30">
                  <Zap className="w-3.5 h-3.5 mr-1" /> Open Competitor Hub &rarr;
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {competitorConfig.competitors.map((comp) => (
                <div key={comp.id} className="p-3 bg-white/10 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={comp.avatar} alt={comp.name} className="w-8 h-8 rounded-xl object-cover border border-white/20" />
                    <div>
                      <span className="font-bold text-xs block text-white">{comp.name}</span>
                      <span className="text-[10px] text-accent font-semibold">{comp.igHandle}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-red-500/20 text-red-300 rounded-md border border-red-500/30">
                    {comp.stats.paidAdSpendRatioPct}% Boosted
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Campaigns for Strong Internal SEO Linking */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary">Related Brand Opportunities</h2>
              <p className="text-xs text-text-secondary mt-1">Explore other active briefs currently accepting creator pitches.</p>
            </div>
            <Link href="/brands" className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBrands.map(item => (
              <Card key={item.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col border-border group">
                <div className="h-36 overflow-hidden relative bg-gray-100">
                  <img src={item.coverImage} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold rounded-full uppercase tracking-wider">
                    {item.budgetTier}
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={item.logo} alt={item.name} className="w-10 h-10 rounded-xl border border-border object-cover bg-white" />
                    <div>
                      <h3 className="font-bold text-sm text-primary">{item.name}</h3>
                      <span className="text-[11px] text-text-secondary">{item.industry}</span>
                    </div>
                  </div>
                  <Link href={`/brands/${item.slug}`} className="mt-2">
                    <Button variant="outline" size="sm" className="w-full group-hover:border-accent group-hover:text-accent transition-colors text-xs">
                      View Brief &rarr;
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
