import Link from 'next/link';
import { Rise, Reveal } from 'cube-motion/react';
import { HowItWorks } from '@/components/home/how-it-works';
import { HeroParallax } from '@/components/home/hero-parallax';
import { BrandMarquee } from '@/components/home/brand-marquee';
import { Testimonials } from '@/components/home/testimonials';
import { BriefCard } from '@/components/brands/brief-card';
import { PAGE_SHELL } from '@/lib/layout';
import { PLAN_LIST, FREE_PITCHES, formatINR, JOIN_CTA } from '@/lib/plans';
import { Button } from '@/components/ui/button';
import { MOCK_BRANDS } from '@/lib/mock-data';
import { ArrowRight, Check, ChevronDown } from "lucide-react";

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

/**
 * PLACEHOLDER earnings figures. Illustrative numbers to show the section's
 * shape; replace with verified payout data before launch.
 */
const EARNINGS_STATS = [
  { value: '₹1M+', label: 'earned by a single creator on Align' },
  { value: '₹1.2L', label: 'largest single brand deal paid out' },
  { value: '11 days', label: 'average from pitch to signed deal' },
] as const;

const TOP_EARNERS = [
  {
    name: 'Riya Kapoor',
    niche: 'Beauty · 180K followers',
    earned: '₹10.4L',
    deals: 14,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  },
  {
    name: 'Dev Malhotra',
    niche: 'Tech · 95K followers',
    earned: '₹6.8L',
    deals: 11,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
  {
    name: 'Tara Sen',
    niche: 'Food · 42K followers',
    earned: '₹3.1L',
    deals: 9,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
  },
] as const;

/** The free tier shown beside the paid plans in the closing pricing section. */
const FREE_TIER_INCLUDES = [
  'Browse every open brief',
  `${FREE_PITCHES} free pitches to any brand`,
  'Verified media kit on your profile',
  'Pitch status tracking',
];

export default function Home() {
  const faqList = [
    {
      q: "How does Align by Schbang work for creators?",
      a: "Align connects creators directly with active campaign briefs from marquee brands managed by Schbang (such as Britannia, Enamor, Swiggy, Kotak811). Creators browse open briefs, submit verified social analytics and a creative pitch, and receive direct collaboration approvals without intermediaries.",
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
      a: `Align is free to start: browse every brief and send your first ${FREE_PITCHES} pitches at no cost. Once your free pitches are used up, pick a plan to keep pitching: ₹200 once for every current and future brand brief, or ₹50 a month, cancelled anytime.`,
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
              Pitch India&apos;s biggest brands.{' '}
              <span className="italic text-wine">Directly.</span>
            </h1>

            <p className="text-base md:text-lg text-primary/75 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Britannia, Enamor, Swiggy, Myntra and 300+ brands post paid briefs on Align. Pitch with your real numbers, close deals faster and stand out from the crowd.
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
            <p className="text-sm text-primary/70 mt-4">
              Your first {FREE_PITCHES} pitches are free.
            </p>
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
              <dd className="text-3xl font-extrabold tracking-tight tabular-nums">{FREE_PITCHES}</dd>
              <dt className="text-sm text-white/70">free pitches to get started</dt>
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

      {/* Earnings — dark band so the numbers read as the page's proof point. */}
      <section className="bg-primary text-white py-24 md:py-28">
        <div className={PAGE_SHELL}>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-12 lg:gap-16 items-center">
            <Reveal>
              <p className="text-sm font-semibold text-halo">Earning potential</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mt-3">
                Creators have earned <span className="text-halo">₹1M+</span> using Align
              </h2>
              <p className="text-white/70 text-base md:text-lg leading-relaxed mt-5 max-w-lg">
                Brand deals add up fast when you pitch brands directly. No waiting on a manager to
                forward your rate card, no getting lost in an agency inbox.
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/15">
                {EARNINGS_STATS.map((stat) => (
                  <div key={stat.label}>
                    <dd className="text-3xl font-extrabold tracking-tight tabular-nums">{stat.value}</dd>
                    <dt className="text-sm text-white/65 mt-1 leading-snug">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal targets="children" className="flex flex-col gap-3">
              {TOP_EARNERS.map((c, idx) => (
                <div
                  key={c.name}
                  className="flex items-center gap-4 rounded-3xl bg-white/[0.06] border border-white/10 p-5"
                >
                  <span className="text-sm font-bold text-white/40 tabular-nums w-5">{idx + 1}</span>
                  <img src={c.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{c.name}</p>
                    <p className="text-xs text-white/60 truncate">{c.niche}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-extrabold tabular-nums">{c.earned}</p>
                    <p className="text-xs text-white/60">{c.deals} brand deals</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-20 border-t border-border">
        <div className={PAGE_SHELL}>
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Featured Brand Opportunities</h2>
            <p className="text-primary/75">Active briefs looking for creators right now.</p>
          </div>
          
          <Reveal targets="children" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_BRANDS.slice(0, 3).map((brand) => (
              <BriefCard key={brand.id} brand={brand} href={`/brands/${brand.slug}`} />
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

      {/* Testimonials — video row first, text quotes under it. */}
      <section className="py-24 border-t border-border">
        <div className={PAGE_SHELL}>
          <div className="max-w-2xl mb-10 md:mb-14">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-primary leading-[1.05]">
              Creators closing deals on Align
            </h2>
            <p className="text-primary/75 text-base md:text-lg leading-relaxed mt-4">
              Hear it from the creators who pitched brands directly.
            </p>
          </div>

          <Testimonials />
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

      {/* Pricing — last on the page. Free until the free pitches run out,
          then a plan (the LinkedIn InMail / Tinder swipes model). Prices come
          from plans.ts. */}
      <section id="pricing" className="py-24 border-t border-border">
        <div className={PAGE_SHELL}>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-primary leading-[1.05]">
              Start free. Pay only when you want more pitches.
            </h2>
            <p className="text-primary/75 text-base md:text-lg leading-relaxed mt-4">
              Every creator gets {FREE_PITCHES} free pitches. When they&apos;re used up, pick a plan to keep
              pitching. {MOCK_BRANDS.length} briefs are open right now.
            </p>
          </div>

          <Reveal targets="children" className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-border bg-surface p-7 flex flex-col">
              <h3 className="text-lg font-bold text-primary">Free</h3>
              <p className="mt-5 flex items-baseline gap-1.5">
                <span className="text-4xl font-black tracking-tight text-primary tabular-nums">₹0</span>
                <span className="text-sm text-text-secondary">to start</span>
              </p>
              <p className="text-sm text-text-secondary mt-1">No card needed.</p>
              <ul className="mt-7 space-y-3 text-sm text-text-primary flex-1">
                {FREE_TIER_INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/brands" className="mt-8">
                <Button variant="outline" size="lg" className="w-full">
                  Browse open briefs
                </Button>
              </Link>
            </div>

            {PLAN_LIST.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-3xl border bg-surface p-7 flex flex-col ${
                  plan.recommended ? 'border-primary shadow-[0_12px_40px_-16px_rgba(0,0,0,0.25)]' : 'border-border'
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-bold text-primary">{plan.name}</h3>
                  {plan.recommended && (
                    <span className="text-xs font-semibold text-accent">Most creators pick this</span>
                  )}
                </div>
                <p className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-4xl font-black tracking-tight text-primary tabular-nums">
                    {formatINR(plan.price)}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {plan.period === 'month' ? 'per month' : 'one time'}
                  </span>
                </p>
                <p className="text-sm text-text-secondary mt-1">{plan.tagline}</p>
                <ul className="mt-7 space-y-3 text-sm text-text-primary flex-1">
                  {plan.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/join?plan=${plan.id}`} className="mt-8">
                  <Button variant={plan.recommended ? 'accent' : 'outline'} size="lg" className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </Reveal>

          <p className="text-sm text-text-secondary text-center mt-8">
            Prices include GST. Cancel the monthly plan anytime from your dashboard.
          </p>
        </div>
      </section>
    </div>
  );
}
