import Link from 'next/link';
import { PLANS, formatINR, JOIN_CTA } from '@/lib/plans';
import { Button } from '@/components/ui/button';
import { MOCK_BRANDS } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from "lucide-react";

export default function Home() {
  const faqList = [
    {
      q: "How does Align by Schbang work for creators?",
      a: "Align connects creators directly with active campaign briefs from marquee brands managed by Schbang (such as Britannia, NIVEA, Swiggy, Kotak811). Creators browse open briefs, submit verified social analytics and a creative pitch, and receive direct collaboration approvals without intermediaries.",
    },
    {
      q: "What follower count and metrics are required to join?",
      a: "Align supports creators across all tiers: Nano (<10k), Micro (10k–50k), Mid-Tier (50k–200k), Macro (200k–1M), and Mega (1M+). Each brand campaign specifies its own criteria regarding niche, minimum followers, and average engagement rate (ER%).",
    },
    {
      q: "How do payments and brand agreements work?",
      a: "Once an application is approved by Schbang campaign leads, creators receive a digital milestone agreement detailing deliverables and payout schedules in INR (₹). Payouts are protected via structured escrow milestones with automated TDS & GST invoicing.",
    },
    {
      q: "What does Align cost?",
      a: "Browsing briefs is free. To send a pitch you need a plan: ₹200 once for every current and future brand brief, or ₹50 a month, cancelled anytime. Align takes no commission on the fee a brand pays you.",
    },
    {
      q: "How are creator analytics and engagement rates verified?",
      a: "Creators submit verified Instagram, YouTube, and Facebook platform snapshots during application. Schbang's influencer marketing team audits engagement benchmarks, audience demographics, and on-time reliability before shortlisting.",
    },
  ];

  // Schema.org FAQPage Structured Data for Google Rich Snippets & AI GEO Search
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <div className="flex flex-col w-full">
      {/* Schema.org FAQPage Rich Snippet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-black overflow-hidden flex items-center justify-center min-h-[75vh]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/75 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/85 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h1 className="animate-fade-in-1 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-5 leading-[1.12] drop-shadow-2xl">
            Get paid by India&apos;s biggest brands, <br className="hidden sm:inline" />
            <span className="text-accent">no agency in between</span>
          </h1>

          <p className="animate-fade-in-2 text-sm sm:text-base md:text-lg text-white/80 max-w-xl mx-auto mb-8 leading-relaxed font-normal drop-shadow">
            Britannia, NIVEA, Swiggy, Myntra and more post paid campaign briefs here. Pitch your real numbers, keep 100% of your fee.
          </p>

          <div className="animate-fade-in-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/brands" className="w-full sm:w-auto">
              <Button
                variant="accent"
                size="lg"
                className="w-full sm:w-auto py-5 px-7 text-sm font-bold"
              >
                Browse open briefs
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white border-white/30 hover:border-white/60 py-5 px-7 text-sm font-semibold"
              >
                {JOIN_CTA} — all brands, forever
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-white py-10 border-y border-white/10">
        <div className="container mx-auto px-4">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 sm:divide-x divide-white/15 max-w-4xl mx-auto">
            <div className="sm:px-8 flex items-baseline gap-3">
              <dd className="text-3xl font-extrabold tracking-tight tabular-nums">300+</dd>
              <dt className="text-sm text-white/70">brand accounts</dt>
            </div>
            <div className="sm:px-8 flex items-baseline gap-3">
              <dd className="text-3xl font-extrabold tracking-tight tabular-nums">1,000+</dd>
              <dt className="text-sm text-white/70">briefs executed</dt>
            </div>
            <div className="sm:px-8 flex items-baseline gap-3">
              <dd className="text-3xl font-extrabold tracking-tight tabular-nums">₹0</dd>
              <dt className="text-sm text-white/70">commission on your fee: 0%</dt>
            </div>
          </dl>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4 text-primary">How Align Works</h2>
            <p className="text-text-secondary text-base leading-relaxed">
              Three steps from your analytics to a signed brand deal.
            </p>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 max-w-5xl mx-auto border-t border-border pt-10">
            <li className="space-y-2">
              <span className="text-sm font-semibold text-accent tabular-nums">1</span>
              <h3 className="font-bold text-lg text-primary">Find an open brief</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Filter active campaigns across Tech, Fashion, FMCG and Lifestyle by your niche and follower tier.
              </p>
            </li>
            <li className="space-y-2">
              <span className="text-sm font-semibold text-accent tabular-nums">2</span>
              <h3 className="font-bold text-lg text-primary">Pitch with your real numbers</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Unlock pitching for {formatINR(PLANS.all_access.price)} once or {formatINR(PLANS.monthly.price)} a month, then send your Instagram, YouTube and Facebook analytics with your rate.
              </p>
            </li>
            <li className="space-y-2">
              <span className="text-sm font-semibold text-accent tabular-nums">3</span>
              <h3 className="font-bold text-lg text-primary">Get shortlisted and paid</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Schbang brand managers review and approve. You get a digital agreement and track deliverables to payout.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Featured Brand Opportunities</h2>
            <p className="text-text-secondary">Active briefs looking for creators right now.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_BRANDS.slice(0,3).map((brand, idx) => (
              <Card key={brand.id} className="interactive-card overflow-hidden flex flex-col border-border/80 group">
                <div className="h-44 overflow-hidden relative bg-gray-100">
                  <img src={brand.coverImage} alt={brand.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/75 text-white text-xs font-semibold rounded-full">
                    {brand.budgetTier} tier
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3.5 mb-4">
                    <img src={brand.logo} alt={brand.name} className="w-12 h-12 rounded-2xl border border-border object-cover bg-white shadow-xs" />
                    <div>
                      <h3 className="font-bold text-lg text-primary group-hover:text-accent transition-colors">{brand.name}</h3>
                      <span className="text-xs font-medium text-text-secondary">{brand.industry}</span>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary line-clamp-3 mb-6 flex-1 leading-relaxed">{brand.description}</p>
                  <Link href={`/brands/${brand.slug}`} className="mt-auto">
                    <Button variant="outline" className="w-full group-hover:border-accent group-hover:text-accent font-semibold transition-all">
                      View brief
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/brands">
              <Button size="lg" variant="accent" className="font-bold px-8 shadow-md shadow-accent/25">
                See all {MOCK_BRANDS.length} open briefs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SEO FAQ & Generative Engine Optimization Section */}
      <section className="py-24 bg-white border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-primary">
              Frequently asked questions
            </h2>
            <p className="text-text-secondary text-base mt-3">
              Pitching, verification and payouts on Align.
            </p>
          </div>

          <dl className="divide-y divide-border border-y border-border">
            {faqList.map((faq, index) => (
              <div key={index} className="py-6 grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2 md:gap-10">
                <dt className="font-semibold text-base text-primary leading-snug">{faq.q}</dt>
                <dd className="text-sm text-text-secondary leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background text-center border-t border-border">
        <div className="container mx-auto px-4 max-w-3xl flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-primary">
            {MOCK_BRANDS.length} briefs are open right now.
          </h2>
          <p className="text-text-secondary mb-8 text-lg leading-relaxed max-w-xl mx-auto">
            {JOIN_CTA} and pitch to every one of them — plus every brand we add later.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <Link href="/join?plan=all_access" className="inline-flex justify-center">
              <Button variant="accent" size="lg" className="px-10 py-6 text-base font-bold">
                {PLANS.all_access.cta}
              </Button>
            </Link>
            <Link href="/pricing" className="text-sm font-semibold text-text-secondary hover:text-primary underline-offset-4 hover:underline">
              Or {formatINR(PLANS.monthly.price)}/month, cancel anytime
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
