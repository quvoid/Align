import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Target, Users, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Align | The Schbang Creator Network',
  description: 'Align is the dedicated brand collaboration marketplace built by Schbang to connect top Indian creators directly with marquee enterprise brand briefs.',
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-4">
            The Schbang Ecosystem
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight mb-4">
            Where Creator Reach Meets Brand Purpose
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Align was engineered by Schbang to eliminate intermediary friction in creator brand partnerships. We turn verified social analytics into enterprise campaign deals.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="p-8 rounded-3xl bg-white border border-border">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">Direct Brand Access</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              No generic casting calls. Creators apply directly to campaign briefs vetted and funded by India&apos;s leading consumer brands.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-border">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">Data-Driven Verification</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Engagement rates, follower demographics, and past performance metrics are verified to ensure maximum ROI for brand clients.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-border">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">Rapid Deal Turnaround</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              From proposal submission to shortlisting, contract release, and campaign production tracking in one cohesive agency portal.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-border">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">All Creator Tiers</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              From hyper-targeted Nano and Micro creators to national Mega influencers across Instagram, YouTube, and multi-channel campaigns.
            </p>
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-primary text-white rounded-3xl p-10 text-center relative overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
            Ready to collaborate with marquee brands?
          </h2>
          <p className="text-white/70 text-sm max-w-lg mx-auto mb-8">
            Explore our live campaign briefs or register your creator profile to get matched with upcoming briefs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/brands">
              <Button variant="accent" size="lg" className="w-full sm:w-auto shadow-xl shadow-accent/25">
                Explore Active Briefs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/20 bg-white/10 hover:bg-white/20 text-white">
                Join Creator Roster
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
