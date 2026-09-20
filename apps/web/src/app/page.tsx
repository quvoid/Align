import Link from 'next/link';
import { Rise, Reveal } from 'cube-motion/react';
import { HowItWorks } from '@/components/home/how-it-works';
import { HeroParallax } from '@/components/home/hero-parallax';
import { BrandMarquee } from '@/components/home/brand-marquee';
import { PAGE_SHELL } from '@/lib/layout';
import { PLANS, formatINR, JOIN_CTA } from '@/lib/plans';
import { Button } from '@/components/ui/button';
import { MOCK_BRANDS } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ChevronDown } from "lucide-react";

// Brands shown in the hero's tilted image stack, front-to-back.

/**
 * The three-step story, each with its own photograph. Panel 3 spans both
 * columns at the 2-up tablet breakpoint, so the layout lands as 2 + 1 rather
 * than leaving a hole; its aspect goes landscape there to suit the wider box.
 */
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Find an open brief',
    body: 'Filter live campaigns by your niche, audience and follower tier.',
    image: '/steps/01-find-a-brief.webp',
    alt: 'A creator browsing open brand campaign briefs on a laptop at her desk',
    href: '/brands',
    span: '',
    aspect: 'aspect-[4/5] lg:aspect-[2/3]',
  },
  {
    step: '02',
    title: 'Pitch with your real numbers',
    body: 'Send your actual Instagram and YouTube analytics with your own rate.',
    image: '/steps/02-pitch-your-numbers.webp',
    alt: 'A creator reviewing her social analytics on a phone beside a laptop',
    href: '/pricing',
    span: '',
    aspect: 'aspect-[4/5] lg:aspect-[2/3]',
  },
  {
    step: '03',
    title: 'Get shortlisted and paid',
    body: 'Schbang reviews, you sign, and you track deliverables through to payout.',
    image: '/steps/03-shortlisted-and-paid.webp',
    alt: 'A creator celebrating an approved collaboration next to a brand package',
    href: '/dashboard',
    span: 'sm:col-span-2 lg:col-span-1',
    aspect: 'aspect-[4/5] sm:aspect-[2/1] lg:aspect-[2/3]',
  },
] as const;

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

      {/* Hero Section — DESIGN.md: white canvas, two-column asymmetric composition, no video/gradients */}
      <section className="relative overflow-hidden pt-14 pb-16 md:pt-20 md:pb-24">
        <HeroParallax
          copy={
          <Rise targets="children" className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <h1 className="text-[2.75rem] sm:text-5xl md:text-6xl font-black tracking-tight text-primary mb-6 leading-[1.05]">
              Get paid by India&apos;s biggest brands,{' '}
              <span className="italic text-lavender">no agency in between</span>
            </h1>

            <p className="text-base md:text-lg text-primary/75 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Britannia, NIVEA, Swiggy, Myntra and more post paid campaign briefs here. Pitch your real numbers, keep 100% of your fee.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3.5">
              <Link href="/brands" className="w-full sm:w-auto">
                <Button variant="accent" size="lg" className="w-full sm:w-auto whitespace-nowrap">
                  Browse open briefs
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto whitespace-nowrap">
                  {JOIN_CTA}
                </Button>
              </Link>
            </div>
          </Rise>
          }
          art={
          <>
          {/* Hero collage — one pre-composed artwork (transparent PNG flattened
              to WebP, 1.8MB -> 238KB) replacing the old three-card MOCK_BRANDS
              stack. The alpha edges sit directly on the page gradient. */}
          <Rise delay={210} className="relative hidden lg:block lg:-mr-6">
            <img
              src="/hero-creator-collage.webp"
              alt="Creators filming, editing and unboxing brand collaboration packages"
              width={1655}
              height={910}
              fetchPriority="high"
              className="w-full h-auto object-contain"
            />
          </Rise>
          </>
          }
        />
      </section>

      {/* Stats Bar — pulled up over the hero's lower edge so the receding hero
          passes under it. Full-bleed and square: a radius here would curve away
          from the viewport edge with nothing behind it. */}
      <section className="relative z-10 -mt-6 md:-mt-10 bg-primary text-white py-10 md:py-12 border-b border-white/10">
        <div className={PAGE_SHELL}>
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

          <div className="mt-10 pt-10 border-t border-white/10">
            <BrandMarquee />
          </div>
        </div>
      </section>

      {/* How it Works — editorial three-panel composition. Each photograph is
          its own panel; the shared rounded frame and hairline seams keep them
          reading as one image rather than three cards. */}
      <section className="py-24 md:py-28">
        <div className={PAGE_SHELL}>
          <div className="max-w-2xl mb-10 md:mb-14">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-primary leading-[1.05]">
              How Align Works
            </h2>
            <p className="text-primary/75 text-base md:text-lg leading-relaxed mt-4">
              Three steps from your analytics to a signed brand deal.
            </p>
          </div>

          <HowItWorks steps={HOW_IT_WORKS} />
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-20 border-t border-border">
        <div className={PAGE_SHELL}>
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Featured Brand Opportunities</h2>
            <p className="text-primary/75">Active briefs looking for creators right now.</p>
          </div>
          
          <Reveal targets="children" className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    <img src={brand.logo} alt={brand.name} className="w-12 h-12 rounded-2xl border border-border object-cover bg-white" />
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
          </Reveal>
          
          <div className="flex justify-center mt-12">
            <Link href="/brands">
              <Button size="lg" variant="accent" className="font-bold px-8">
                See all {MOCK_BRANDS.length} open briefs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ — one white surface over the wash, so the copy never competes
          with whatever the background is doing. Native <details> keeps every
          answer in the DOM for crawlers and the FAQPage schema above. */}
      <section className="py-24">
        <div className="mx-auto w-full max-w-5xl px-4 lg:px-10">
          <Reveal className="rounded-4xl border border-border bg-surface p-7 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-10 lg:gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-primary leading-[1.05]">
                Frequently asked questions
              </h2>
              <p className="text-text-secondary text-base mt-4 leading-relaxed">
                Pitching, verification and payouts on Align.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 mt-8 text-sm font-semibold text-primary hover:text-accent transition-colors"
              >
                Ask something else
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="divide-y divide-border">
              {faqList.map((faq, index) => (
                <details key={index} open={index === 0} className="group">
                  <summary className="flex items-start justify-between gap-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span className="font-semibold text-base text-primary leading-snug">{faq.q}</span>
                    <ChevronDown className="w-5 h-5 mt-0.5 shrink-0 text-text-secondary transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-open:rotate-180" />
                  </summary>
                  <p className="pb-6 pr-11 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center border-t border-border">
        <div className="mx-auto w-full max-w-3xl px-4 lg:px-10 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-primary">
            {MOCK_BRANDS.length} briefs are open right now.
          </h2>
          <p className="text-primary/75 mb-8 text-lg leading-relaxed max-w-xl mx-auto">
            {JOIN_CTA} and pitch to every one of them — plus every brand we add later.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <Link href="/join?plan=all_access" className="inline-flex justify-center">
              <Button variant="accent" size="lg" className="px-10 py-6 text-base font-bold">
                {PLANS.all_access.cta}
              </Button>
            </Link>
            <Link href="/pricing" className="text-sm font-semibold text-primary/75 hover:text-primary underline-offset-4 hover:underline">
              Or {formatINR(PLANS.monthly.price)}/month, cancel anytime
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
