import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MOCK_BRANDS } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ShieldCheck, Zap, Users, HelpCircle, CheckCircle2 } from 'lucide-react';

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
      <section className="relative py-20 md:py-28 bg-black overflow-hidden flex items-center justify-center min-h-[75vh]">
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
            Where Creative Reach Meets <br className="hidden sm:inline" />
            <span className="animate-shimmer text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-300 via-orange-400 to-accent">
              Brand Purpose
            </span>
          </h1>

          <p className="animate-fade-in-2 text-sm sm:text-base md:text-lg text-white/80 max-w-xl mx-auto mb-8 leading-relaxed font-normal drop-shadow">
            Welcome to <strong className="text-white font-bold">Align</strong>. Pitch your verified social analytics directly to India&apos;s marquee brand briefs managed by Schbang.
          </p>

          <div className="animate-fade-in-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/brands" className="w-full sm:w-auto">
              <Button
                variant="accent"
                size="lg"
                className="w-full sm:w-auto shadow-2xl shadow-accent/40 py-5 px-7 text-sm font-bold hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
              >
                Explore Active Briefs
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/25 backdrop-blur-md py-5 px-7 text-sm font-semibold hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
              >
                Join Creator Roster
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-white py-12 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/15">
            <div className="py-2">
              <div className="text-4xl font-black text-accent mb-1">300+</div>
              <div className="text-xs uppercase tracking-widest text-white/70 font-semibold">Marquee Brand Accounts</div>
            </div>
            <div className="py-2">
              <div className="text-4xl font-black text-accent mb-1">1,000+</div>
              <div className="text-xs uppercase tracking-widest text-white/70 font-semibold">Campaign Briefs Executed</div>
            </div>
            <div className="py-2">
              <div className="text-4xl font-black text-accent mb-1">50K+</div>
              <div className="text-xs uppercase tracking-widest text-white/70 font-semibold">Creators in Network</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4 text-primary">How Align Works</h2>
            <p className="text-text-secondary text-base leading-relaxed">
              A streamlined, three-step bridge between creator performance and brand budgets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-3xl border border-border bg-background/60 flex flex-col items-center text-center hover:shadow-xl hover:border-accent/40 transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5 shadow-sm">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-primary">Discover Open Briefs</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Filter through active campaigns across industries like Tech, Fashion, FMCG, and Lifestyle based on your niche and follower tier.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-border bg-background/60 flex flex-col items-center text-center hover:shadow-xl hover:border-accent/40 transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-primary">Submit Verified Metrics</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Fill our 6-step application with your Instagram, YouTube, and Facebook analytics along with your proposal pitch and expected rate.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-border bg-background/60 flex flex-col items-center text-center hover:shadow-xl hover:border-accent/40 transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center mb-5 shadow-sm">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-primary">Align &amp; Execute</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Schbang brand managers review, shortlist, and approve submissions. Get digital agreements and track campaign deliverables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Featured Brand Opportunities</h2>
            <p className="text-text-secondary">Discover active collaboration briefs looking for creators like you.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_BRANDS.slice(0,3).map(brand => (
              <Card key={brand.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border-border/80 group">
                <div className="h-44 overflow-hidden relative bg-gray-100">
                  <img src={brand.coverImage} alt={brand.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                    {brand.budgetTier} Tier
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3.5 mb-4">
                    <img src={brand.logo} alt={brand.name} className="w-12 h-12 rounded-xl border border-border object-cover bg-white shadow-sm" />
                    <div>
                      <h3 className="font-bold text-lg text-primary">{brand.name}</h3>
                      <span className="text-xs font-medium text-text-secondary">{brand.industry}</span>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary line-clamp-3 mb-6 flex-1 leading-relaxed">{brand.description}</p>
                  <Link href={`/brands/${brand.slug}`} className="mt-auto">
                    <Button variant="outline" className="w-full group-hover:border-accent group-hover:text-accent transition-colors">
                      View Campaign Brief &rarr;
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/brands">
              <Button variant="ghost" className="font-semibold text-accent hover:text-accent-hover hover:bg-accent/10">
                Explore all {MOCK_BRANDS.length} brand briefs &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SEO FAQ & Generative Engine Optimization Section */}
      <section className="py-24 bg-white border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Creator FAQ &amp; Knowledge Base</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-primary">
              Frequently Asked Questions
            </h2>
            <p className="text-text-secondary text-sm mt-2">
              Everything you need to know about pitching, campaign verification, and payouts on Align.
            </p>
          </div>

          <div className="space-y-4">
            {faqList.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-border bg-gray-50/70 hover:border-accent/30 transition-colors"
              >
                <h3 className="font-bold text-base text-primary mb-2 flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background text-center border-t border-border">
        <div className="container mx-auto px-4 max-w-3xl flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-primary">
            Ready to align with India&apos;s premier brands?
          </h2>
          <p className="text-text-secondary mb-8 text-lg leading-relaxed max-w-xl mx-auto">
            Create your verified creator profile on Align today and get direct access to campaigns managed by Schbang.
          </p>
          <div className="flex justify-center w-full">
            <Link href="/auth/register" className="inline-flex justify-center">
              <Button variant="accent" size="lg" className="shadow-lg shadow-accent/25 px-10 py-6 text-base font-bold">
                Create Your Creator Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
