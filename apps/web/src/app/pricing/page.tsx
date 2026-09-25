import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { FREE_PITCHES, PLAN_LIST, PLANS, formatINR } from "@/lib/plans";
import { MOCK_BRANDS } from "@/lib/mock-data";
import { PlanButton } from "./plan-button";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://align.schbang.com";

export const metadata: Metadata = {
  title: "Creator Pricing — ₹200 all-access or ₹50/month",
  description:
    "Apply to paid brand campaigns from Britannia, Enamor, Swiggy, Myntra and more. One ₹200 payment for every current and future brief, or ₹50 a month. Cancel anytime.",
  alternates: { canonical: `${siteUrl}/pricing` },
  openGraph: {
    title: "Align creator pricing — ₹200 all-access or ₹50/month",
    description: "One payment for every brand brief on Align, or pay monthly. Built for Indian creators.",
    url: `${siteUrl}/pricing`,
  },
};

const pricingFaq = [
  {
    q: "What does the ₹200 all-access plan include?",
    a: "Every brand brief on Align today and every brief we add in future. You pay once; there are no renewals. It is a launch price and stays locked for the life of your account.",
  },
  {
    q: "How does the ₹50 monthly plan work?",
    a: "You get the same access to open briefs for as long as the plan is active. It renews every month at ₹50 and you can cancel from your dashboard at any time.",
  },
  {
    q: "Can I start for free?",
    a: `Yes. Every open brief is public, and your first ${FREE_PITCHES} pitches are free. You only need a plan once your free pitches are used up.`,
  },
  {
    q: "Which payment methods are accepted?",
    a: "UPI, debit and credit cards, and net banking. All amounts are in INR and include GST.",
  },
];

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${siteUrl}/pricing#membership`,
        name: "Align creator membership",
        description:
          "Membership that lets Indian creators pitch verified analytics to paid brand campaign briefs managed by Schbang.",
        brand: { "@type": "Brand", name: "Align by Schbang" },
        offers: PLAN_LIST.map((plan) => ({
          "@type": "Offer",
          name: `${plan.name} plan`,
          price: plan.price,
          priceCurrency: "INR",
          url: `${siteUrl}/join?plan=${plan.id}`,
          availability: "https://schema.org/InStock",
          category: plan.period === "month" ? "Subscription" : "One-time",
          ...(plan.period === "month"
            ? {
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: plan.price,
                  priceCurrency: "INR",
                  billingDuration: 1,
                  unitCode: "MON",
                },
              }
            : {}),
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: pricingFaq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Pricing", item: `${siteUrl}/pricing` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen pt-12 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primary text-balance">
            One price. Every brand brief.
          </h1>
          <p className="text-lg text-text-secondary mt-4 leading-relaxed">
            Browse {MOCK_BRANDS.length} open briefs and send your first {FREE_PITCHES} pitches free. When
            they&apos;re used up, pay once to pitch to every brief — and every brand we add after.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLAN_LIST.map((plan) => (
            <section
              key={plan.id}
              aria-labelledby={`plan-${plan.id}`}
              className={`rounded-3xl border bg-white p-8 flex flex-col ${
                plan.recommended ? "border-primary shadow-[0_12px_40px_-16px_rgba(0,0,0,0.25)]" : "border-border"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h2 id={`plan-${plan.id}`} className="text-lg font-bold text-primary">
                  {plan.name}
                </h2>
                {plan.recommended && (
                  <span className="text-xs font-semibold text-accent">Most creators pick this</span>
                )}
              </div>

              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="text-5xl font-black tracking-tight text-primary tabular-nums">
                  {formatINR(plan.price)}
                </span>
                <span className="text-sm text-text-secondary">
                  {plan.period === "month" ? "per month" : "one time"}
                </span>
              </p>
              <p className="text-sm text-text-secondary mt-1">{plan.tagline}</p>

              <ul className="mt-8 space-y-3 text-sm text-text-primary flex-1">
                {plan.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Suspense fallback={<div className="h-12 rounded-xl bg-gray-100" />}>
                  <PlanButton plan={plan} />
                </Suspense>
                <p className="text-xs text-text-secondary text-center mt-3">
                  {plan.period === "month"
                    ? "Cancel anytime from your dashboard."
                    : `Same as ${Math.round(plan.price / PLANS.monthly.price)} months of Monthly, paid once.`}
                </p>
              </div>
            </section>
          ))}
        </div>

        <p className="text-sm text-text-secondary mt-8">
          Prices include GST. Brands pay your campaign fee separately through Schbang escrow.
        </p>

        <section className="mt-20 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-primary mb-8">Pricing questions</h2>
          <dl className="divide-y divide-border border-y border-border">
            {pricingFaq.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-semibold text-primary">{f.q}</dt>
                <dd className="text-sm text-text-secondary leading-relaxed mt-1.5">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-text-secondary mt-8">
            Not ready yet?{" "}
            <Link href="/brands" className="font-semibold text-accent hover:underline">
              Browse the open briefs first
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
