"use client";

import { use } from "react";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { hasActiveMembership, freePitchesLeft } from '@/lib/user-store';
import { FREE_PITCHES, PLANS, formatINR } from '@/lib/plans';
import { INITIAL_BRANDS } from '@/lib/mock-data';
import { getCompetitorsForBrand } from '@/lib/instagram-engine';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, ChevronRight, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function BrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const brand = INITIAL_BRANDS.find(b => b.slug === resolvedParams.slug);

  const { data: session } = useSession();
  const isAdminOrBrand = session?.user?.role === 'ADMIN' || (session?.user as any)?.role === 'BRAND';

  // Members and creators with free pitches left go straight to the pitch form;
  // once the free pitches are used up, the price is shown up front. Signed-out
  // visitors haven't used any yet, so they start with the full allowance.
  const [isMember, setIsMember] = useState(false);
  const [freeLeft, setFreeLeft] = useState(FREE_PITCHES);
  useEffect(() => {
    const email = session?.user?.email;
    setIsMember(!!email && hasActiveMembership(email));
    setFreeLeft(email ? freePitchesLeft(email) : FREE_PITCHES);
  }, [session]);

  if (!brand) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-8 pt-10 pb-12 text-center">
        <h1 className="text-2xl font-bold text-primary mb-2">Brief not found</h1>
        <p className="text-text-secondary text-sm mb-6">This brief has closed or the link is wrong.</p>
        <Link href="/brands">
          <Button variant="accent">Browse open briefs</Button>
        </Link>
      </div>
    );
  }

  const canPitchNow = isMember || freeLeft > 0;
  const applyHref = canPitchNow ? `/apply/${brand.slug}` : `/pricing?brief=${brand.slug}`;
  const applyLabel = isMember
    ? 'Pitch to this brief'
    : freeLeft > 0
      ? 'Pitch to this brief — free'
      : `Pitch to this brief — from ${formatINR(PLANS.monthly.price)}/month`;
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
      <div className="bg-surface border-b border-border pt-20 pb-3">
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
        <div className="bg-surface rounded-3xl border border-border p-6 md:p-8 shadow-xl mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-5">
            <img
              src={brand.logo}
              alt={`${brand.name} Logo`}
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-surface shadow-lg object-cover bg-surface"
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

          <div className="w-full md:w-auto md:text-right">
            <Link href={applyHref} className="block w-full md:w-auto">
              <Button variant="accent" size="lg" className="w-full md:w-auto py-6 px-8 text-sm font-bold">
                {applyLabel}
              </Button>
            </Link>
            {!isMember && (
              <p className="text-xs text-text-secondary mt-2">
                {freeLeft > 0
                  ? `${freeLeft} of ${FREE_PITCHES} free pitches left.`
                  : `Or ${formatINR(PLANS.all_access.price)} once for every brief.`}
              </p>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface p-8 rounded-3xl border border-border">
              <h2 className="text-lg font-bold text-primary mb-3">About the Campaign Brief</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{brand.description}</p>
            </div>
            
            <div className="bg-surface p-8 rounded-3xl border border-border">
              <h2 className="text-lg font-bold text-primary mb-4">Required Creative Deliverables</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {brand.campaignTypes.map(type => (
                  <div key={type} className="flex items-center gap-2.5 bg-muted px-4 py-3 rounded-xl border border-border text-xs font-semibold text-primary">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm space-y-6">
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

              <Link href={applyHref}>
                <Button variant="accent" className="w-full mt-2">
                  {canPitchNow ? 'Pitch to this brief' : 'Unlock and pitch'}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Competitor Intelligence Section (Admin / Brand Managers Only) */}
        {isAdminOrBrand && competitorConfig && (
          <div className="mt-12 p-6 rounded-3xl bg-ink text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
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
                <div key={comp.id} className="p-3 bg-surface/10 rounded-2xl flex items-center justify-between">
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
                <div className="h-36 overflow-hidden relative bg-muted">
                  <img src={item.coverImage} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold rounded-full uppercase tracking-wider">
                    {item.budgetTier}
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={item.logo} alt={item.name} className="w-10 h-10 rounded-xl border border-border object-cover bg-surface" />
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
