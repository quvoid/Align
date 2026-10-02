import Link from 'next/link';
import { BriefCarousel } from '@/components/home/brief-carousel';
import { EarningsShowcase } from '@/components/home/earnings-showcase';
import { BrandMarquee } from '@/components/home/brand-marquee';
import { HowItWorksDemo } from '@/components/home/how-it-works-demo';
import { ReviewDemo } from '@/components/home/review-demo';
import { Testimonials } from '@/components/home/testimonials';
import { PLANS, FREE_PITCHES, formatINR } from '@/lib/plans';
import { listActiveBriefs } from '@/server/briefs';
import { ArrowRight, Check, ChevronDown, Search } from 'lucide-react';

const SHELL = 'container mx-auto px-4';

/** Shortcut chips under the hero search; each opens /brands filtered to that industry. */
const POPULAR = ['Food', 'Fashion', 'Finance', 'Lifestyle'];

const FREE_TIER_INCLUDES = [
  'Browse every open brief',
  `${FREE_PITCHES} pitches to any brand`,
  'Your media kit, saved for every pitch',
  'Pitch status on your dashboard',
];

const FAQ = [
  {
    q: 'How does Align work?',
    a: 'Schbang posts live briefs from the brands it manages. You pick a brief, send your idea with your Instagram or YouTube numbers and your rate, and a person on the Schbang team reviews it. You follow the status (pending, in review, shortlisted, approved) on your dashboard.',
  },
  {
    q: 'Who can pitch?',
    a: 'Creators of every size, from nano to mega. Each brief says who it is for: the niche, the audience and, for some, a minimum follower count or engagement rate.',
  },
  {
    q: 'What does Align cost?',
    a: `Browsing is free and your first ${FREE_PITCHES} pitches are free. After that, pick a plan to keep pitching: ${formatINR(PLANS.all_access.price)} once for every current and future brief, or ${formatINR(PLANS.monthly.price)} a month, cancelled anytime.`,
  },
  {
    q: 'What happens when my pitch is approved?',
    a: 'The Schbang team contacts you directly to agree the deliverables, the timeline and the payment for that campaign.',
  },
  {
    q: 'How are my numbers checked?',
    a: 'You enter your follower counts and engagement yourself, and they are shown as self-reported. The Schbang team checks them before anyone is shortlisted.',
  },
];

const H2 = 'text-[34px] sm:text-5xl font-semibold tracking-[-0.04em] leading-[1.05] text-primary text-balance';

// Static; the briefs refresh every minute and immediately when an admin
// publishes or pauses one.
export const revalidate = 60;

export default async function Home() {
  const briefs = await listActiveBriefs();
  const briefWord = briefs.length === 1 ? 'brief' : 'briefs';

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <div className="flex flex-col w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero: one line, one search, the product underneath. */}
      <section className={`${SHELL} pt-14 sm:pt-20`}>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-[42px] sm:text-6xl lg:text-[72px] font-semibold tracking-[-0.045em] leading-[1.02] text-primary text-balance">
            Pitch live briefs from brands <span className="text-marigold">you grew up with.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[17px] sm:text-lg leading-relaxed text-text-secondary">
            {briefs.length} open {briefWord} from Schbang clients right now. Send your idea with your real numbers; a person
            on the Schbang team reads every pitch.
          </p>

          <form
            action="/brands"
            method="get"
            role="search"
            className="mx-auto mt-9 flex max-w-xl items-center gap-2 h-16 rounded-full bg-surface pl-6 pr-2 shadow-lift transition-shadow focus-within:shadow-[0_0_0_1px_var(--color-border),0_20px_40px_-20px_rgb(23_21_15/0.45)]"
          >
            <Search className="w-5 h-5 shrink-0 text-text-secondary" aria-hidden="true" />
            <label htmlFor="hero-search" className="sr-only">Search briefs</label>
            <input
              id="hero-search"
              name="search"
              type="search"
              placeholder="Search a brand or niche"
              className="flex-1 min-w-0 bg-transparent text-[16px] text-primary outline-none placeholder:text-text-secondary [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              type="submit"
              aria-label="Search briefs"
              className="press shrink-0 inline-flex items-center gap-2 h-12 rounded-full bg-marigold px-5 text-[15px] font-semibold text-ink hover:bg-[#F06D2B]"
            >
              <span className="hidden sm:inline">Search briefs</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[14px]">
            <span className="text-text-secondary">Popular:</span>
            {POPULAR.map((word) => (
              <Link
                key={word}
                href={`/brands?industry=${word}`}
                className="press min-h-9 inline-flex items-center px-3.5 rounded-full bg-muted font-medium text-primary hover:bg-[#E6E1D6]"
              >
                {word}
              </Link>
            ))}
          </div>
        </div>

        {briefs.length > 0 && (
          <div className="mt-14 sm:mt-20">
            <BriefCarousel briefs={briefs} />
          </div>
        )}
      </section>

      {/* Brands Schbang has run briefs for, rolling past. */}
      <section className="pt-16 sm:pt-24">
        <BrandMarquee />
      </section>

      {/* How it works: three steps, each with a sliver of the real screen. */}
      <section className={`${SHELL} pt-24 sm:pt-32`} aria-labelledby="how">
        <div className="max-w-2xl">
          <h2 id="how" className={H2}>From brief to decision in three steps.</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-text-secondary">Watch it play, or tap a step.</p>
        </div>

        <div className="mt-12">
          <HowItWorksDemo briefs={briefs.map(({ name, slug, industry }) => ({ name, slug, industry }))} />
        </div>
      </section>

      {/* Why Align: the review, played out. */}
      <section className={`${SHELL} pt-24 sm:pt-32`} aria-labelledby="why">
        <div className="rounded-5xl bg-surface p-4 sm:p-10 lg:p-12 shadow-card">
          <div className="mx-auto max-w-2xl px-2 pt-4 text-center sm:px-0 sm:pt-0">
            <h2 id="why" className={H2}>
              A person reads <span className="text-marigold">every</span> pitch.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-text-secondary">Here&apos;s what happens after you hit send.</p>
          </div>
          <div className="mt-10">
            <ReviewDemo brandName={briefs[0]?.name ?? 'Britannia'} />
          </div>
        </div>
      </section>

      {/* Earning potential — PLACEHOLDER figures (see components/home/earnings-showcase.tsx). */}
      <section className={`${SHELL} pt-24 sm:pt-32`} aria-labelledby="earnings">
        <EarningsShowcase />
      </section>

      {/* Testimonials — PLACEHOLDER content (see components/home/testimonials.tsx). */}
      <section className={`${SHELL} pt-24 sm:pt-32`} aria-labelledby="voices">
        <div className="mb-10 max-w-2xl md:mb-12">
          <h2 id="voices" className={H2}>Creators closing deals on Align</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-text-secondary">Hear it from the creators who pitched brands directly.</p>
        </div>
        <Testimonials />
      </section>

      {/* Pricing */}
      <section id="pricing" className={`${SHELL} pt-24 sm:pt-32`} aria-labelledby="pricing-title">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="pricing-title" className={H2}>Start free. Pay once if you love it.</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-text-secondary">
            Your first {FREE_PITCHES} pitches cost nothing. After that, one small payment covers every brief.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <PlanCard
            name="Free"
            price={formatINR(0)}
            period="to start"
            tagline="Everything you need to try it."
            includes={FREE_TIER_INCLUDES}
            cta={{ href: '/brands', label: 'Browse open briefs' }}
          />
          <PlanCard
            name={PLANS.all_access.name}
            price={formatINR(PLANS.all_access.price)}
            period="one time"
            tagline={PLANS.all_access.tagline}
            includes={PLANS.all_access.includes}
            cta={{ href: `/join?plan=${PLANS.all_access.id}`, label: PLANS.all_access.cta }}
            featured
          />
          <PlanCard
            name={PLANS.monthly.name}
            price={formatINR(PLANS.monthly.price)}
            period="per month"
            tagline={PLANS.monthly.tagline}
            includes={PLANS.monthly.includes}
            cta={{ href: `/join?plan=${PLANS.monthly.id}`, label: PLANS.monthly.cta }}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className={`${SHELL} pt-24 sm:pt-32`} aria-labelledby="faq">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 id="faq" className={H2}>Questions creators ask.</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-text-secondary">
              Something else?{' '}
              <Link href="/contact" className="font-semibold text-primary underline underline-offset-4 decoration-border hover:decoration-primary">
                Write to the Schbang team
              </Link>
              .
            </p>
          </div>
          <div className="border-t border-border">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-border [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-[17px] font-semibold text-primary">
                  {f.q}
                  <span className="w-9 h-9 shrink-0 rounded-full bg-surface grid place-items-center transition-transform duration-300 group-open:rotate-180">
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  </span>
                </summary>
                <p className="-mt-2 pb-6 pr-14 text-[15.5px] leading-relaxed text-text-secondary">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing call */}
      <section className={`${SHELL} pt-24 sm:pt-32`}>
        <div className="rounded-5xl bg-ink px-7 py-14 sm:px-14 sm:py-20 text-center">
          <h2 className="mx-auto max-w-2xl text-[34px] sm:text-5xl font-semibold tracking-[-0.04em] leading-[1.05] text-white text-balance">
            {briefs.length} {briefWord} {briefs.length === 1 ? 'is' : 'are'} open.{' '}
            <span className="text-marigold">Yours could be next.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-white/70">
            Browse for free and send your first {FREE_PITCHES} pitches on us.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/brands"
              className="press inline-flex items-center gap-2 min-h-13 px-7 rounded-full bg-marigold text-[16px] font-semibold text-ink hover:bg-[#F06D2B]"
            >
              Browse open briefs
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/pricing"
              className="press inline-flex items-center min-h-13 px-7 rounded-full bg-white/10 text-[16px] font-semibold text-white hover:bg-white/15"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PlanCard({
  name,
  price,
  period,
  tagline,
  includes,
  cta,
  featured = false,
}: {
  name: string;
  price: string;
  period: string;
  tagline: string;
  includes: string[];
  cta: { href: string; label: string };
  featured?: boolean;
}) {
  const quiet = featured ? 'text-white/70' : 'text-text-secondary';
  return (
    <div className={`flex flex-col rounded-5xl p-7 sm:p-8 ${featured ? 'bg-ink text-white' : 'bg-surface text-primary shadow-card'}`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[17px] font-semibold">{name}</h3>
        {featured && <span className="px-3 py-1 rounded-full bg-marigold text-[12.5px] font-semibold text-ink">Most popular</span>}
      </div>
      <p className="mt-6 flex items-baseline gap-2">
        <span className="text-[52px] font-semibold tracking-[-0.04em] leading-none">{price}</span>
        <span className={`text-[15px] ${quiet}`}>{period}</span>
      </p>
      <p className={`mt-3 text-[15px] ${quiet}`}>{tagline}</p>
      <ul className={`mt-7 mb-8 space-y-3 border-t pt-7 text-[15px] ${featured ? 'border-white/15' : 'border-border'}`}>
        {includes.map((item) => (
          <li key={item} className="flex gap-3">
            <Check className={`mt-0.5 w-4 h-4 shrink-0 ${featured ? 'text-marigold' : 'text-primary'}`} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      <Link
        href={cta.href}
        className={`press mt-auto inline-flex items-center justify-center min-h-12 rounded-full px-6 text-[15px] font-semibold ${
          featured ? 'bg-marigold text-ink hover:bg-[#F06D2B]' : 'bg-muted text-primary hover:bg-[#E6E1D6]'
        }`}
      >
        {cta.label}
      </Link>
    </div>
  );
}
