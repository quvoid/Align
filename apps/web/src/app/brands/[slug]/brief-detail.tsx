"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { fetchMe } from '@/lib/user-store';
import { FREE_PITCHES, PLANS, formatINR, isMembershipActive } from '@/lib/plans';
import type { BrandItem } from '@/lib/mock-data';
import { getCompetitorsForBrand } from '@/lib/instagram-engine';
import { Button } from '@/components/ui/button';
import { BriefCard } from '@/components/brands/brief-card';
import { clayFillFor } from '@/lib/clay';
import { ArrowLeft, CheckCircle2, ChevronRight, ArrowRight, ShieldCheck, Zap } from "lucide-react";

/** The interactive half of /brands/[slug]; page.tsx loads the brief. */
export function BriefDetail({ brand, related: relatedBrands }: { brand: BrandItem; related: BrandItem[] }) {
  const { data: session } = useSession();
  const isAdminOrBrand = session?.user?.role === 'ADMIN' || (session?.user as any)?.role === 'BRAND';

  // Members and creators with free pitches left go straight to the pitch form;
  // once the free pitches are used up, the price is shown up front. Signed-out
  // visitors haven't used any yet, so they start with the full allowance.
  const [isMember, setIsMember] = useState(false);
  const [freeLeft, setFreeLeft] = useState(FREE_PITCHES);
  const email = session?.user?.email;
  useEffect(() => {
    if (!email) {
      setIsMember(false);
      setFreeLeft(FREE_PITCHES);
      return;
    }
    let cancelled = false;
    fetchMe()
      .then((me) => {
        if (cancelled) return;
        setIsMember(isMembershipActive(me.membership));
        setFreeLeft(me.freePitchesLeft);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [email]);

  const canPitchNow = isMember || freeLeft > 0;
  const applyHref = canPitchNow ? `/apply/${brand.slug}` : `/pricing?brief=${brand.slug}`;
  const applyLabel = isMember
    ? 'Pitch to this brief'
    : freeLeft > 0
      ? 'Pitch to this brief — free'
      : `Pitch to this brief — from ${formatINR(PLANS.monthly.price)}/month`;
  const competitorConfig = getCompetitorsForBrand(brand.slug);

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

  const priceNote = isMember
    ? 'Your plan covers every brief.'
    : freeLeft > 0
      ? `${freeLeft} of ${FREE_PITCHES} free pitches left.`
      : `Or ${formatINR(PLANS.all_access.price)} once for every brief.`;
  const fill = clayFillFor(brand.slug);

  return (
    <div className="min-h-screen pb-28 md:pb-20">
      {/* Inject Schema.org JSON-LD for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 pt-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary">
          <Link href="/brands" className="clay-press inline-flex items-center gap-1.5 pl-2.5 pr-3.5 pt-1.5 pb-1 rounded-full bg-surface shadow-clay-sm hover:text-primary">
            <ArrowLeft className="w-4 h-4 -mt-0.5" aria-hidden="true" /> Briefs
          </Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-primary">{brand.name}</span>
        </nav>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-8 items-start">
          <div className="space-y-6">
            <section className={`rounded-5xl p-6 sm:p-9 shadow-clay ${fill}`}>
              <h1 className="text-[52px] sm:text-7xl font-extrabold tracking-tight leading-[0.9] text-primary">{brand.name}</h1>
              <p className="mt-3 text-base font-semibold text-text-secondary">
                {brand.industry} · {brand.budgetTier} creators · managed by Schbang
              </p>
              <p className="mt-5 text-lg leading-relaxed text-primary/90 max-w-2xl">{brand.description}</p>

              <dl className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-3 max-w-xl">
                {[
                  { label: 'Tier', value: brand.budgetTier },
                  { label: 'Deliverables', value: String(brand.campaignTypes.length) },
                  { label: 'Interested', value: String(brand.likesCount) },
                ].map((f) => (
                  <div key={f.label} className="rounded-3xl bg-white/60 px-3.5 pt-3 pb-2.5 shadow-clay-well">
                    <dt className="text-xs font-semibold text-text-secondary">{f.label}</dt>
                    <dd className="text-xl font-extrabold text-primary tabular-nums">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-4xl bg-surface p-6 sm:p-8 shadow-clay">
              <h2 className="text-2xl font-extrabold text-primary">Deliverables</h2>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {brand.campaignTypes.map((type) => (
                  <li key={type} className="inline-flex items-center gap-2 pl-2 pr-4 pt-2 pb-1.5 rounded-full bg-clay-butter text-[15px] font-bold text-primary shadow-clay-sm">
                    <span className="w-6 h-6 -mt-0.5 rounded-full bg-surface grid place-items-center shadow-clay-sm">
                      <CheckCircle2 className="w-4 h-4 text-success" aria-hidden="true" />
                    </span>
                    {type}
                  </li>
                ))}
              </ul>

              {brand.requirements && (
                <>
                  <h2 className="mt-8 text-2xl font-extrabold text-primary">Who can pitch</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-primary/85 rounded-3xl bg-background px-5 py-4 shadow-clay-well">
                    {brand.requirements}
                  </p>
                </>
              )}
            </section>
          </div>

          <aside className="lg:sticky lg:top-28 rounded-4xl bg-surface p-6 shadow-clay">
            <h2 className="text-2xl font-extrabold text-primary leading-tight">Pitch {brand.name}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
              Send your idea with your real numbers. The Schbang team reads every pitch and you&apos;ll see its status on your dashboard.
            </p>
            <Link href={applyHref} className="block mt-5">
              <Button variant="accent" size="lg" className="w-full justify-between text-[17px] py-4">
                {applyLabel}
                <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
              </Button>
            </Link>
            <p className="mt-3 text-sm font-semibold text-text-secondary text-center">{priceNote}</p>

            <dl className="mt-6 pt-5 border-t-2 border-muted space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-text-secondary">Managed by</dt>
                <dd className="font-bold text-primary">Schbang</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-secondary">Questions</dt>
                <dd className="font-bold text-primary">{brand.contactEmail || "briefs@schbang.com"}</dd>
              </div>
            </dl>
          </aside>
        </div>

        {/* Competitor Intelligence Section (Admin / Brand Managers Only) */}
        {isAdminOrBrand && competitorConfig && (
          <section className="mt-10 p-6 rounded-4xl bg-clay-lilac shadow-clay space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-primary">
                  Tracking {competitorConfig.competitors.length} competitors for {brand.name}
                </h3>
                <p className="text-sm text-text-secondary">
                  Competitor creator collabs, paid-boost ratios and 12-month performance. Admin only.
                </p>
              </div>
              <Link href={`/admin/brands/${brand.slug}/competitors`}>
                <Button variant="accent" size="sm">
                  <Zap className="w-4 h-4 mr-1" aria-hidden="true" /> Open competitor hub
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {competitorConfig.competitors.map((comp) => (
                <div key={comp.id} className="p-3 rounded-3xl bg-surface shadow-clay-sm flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={comp.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                    <div className="min-w-0">
                      <span className="font-bold text-sm block text-primary truncate">{comp.name}</span>
                      <span className="text-xs text-text-secondary">{comp.igHandle}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-bold px-2.5 py-1 bg-clay-rose text-primary rounded-full">
                    {comp.stats.paidAdSpendRatioPct}% boosted
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related briefs for internal SEO linking */}
        {relatedBrands.length > 0 && (
          <section className="mt-14">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h2 className="text-3xl font-extrabold tracking-tight text-primary">More open briefs</h2>
              <Link href="/brands" className="text-sm font-bold text-accent hover:underline underline-offset-4 flex items-center gap-1">
                All briefs <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBrands.map((item) => (
                <BriefCard key={item.id} brand={item} href={`/brands/${item.slug}`} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Phones: the pitch action stays under the thumb. */}
      <div className="md:hidden fixed inset-x-3 bottom-3 z-40 rounded-4xl bg-surface p-2.5 shadow-clay">
        <Link href={applyHref} className="block">
          <Button variant="accent" size="lg" className="w-full justify-between">
            <span className="truncate">{applyLabel}</span>
            <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
