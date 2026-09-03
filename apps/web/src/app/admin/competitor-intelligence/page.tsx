"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  BRAND_COMPETITOR_REGISTRY,
  analyzeCompetitorPair,
  type HeadToHeadBenchmark,
  type BrandCompetitorConfig,
} from "@/lib/instagram-engine";
import {
  Zap,
  ArrowRight,
  Search,
  Lock,
  Building2,
  Users,
  Eye,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

export default function CompetitorIntelligenceHubPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [customBrandUrl, setCustomBrandUrl] = useState("");
  const [customCompetitorUrl, setCustomCompetitorUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [adHocResult, setAdHocResult] = useState<HeadToHeadBenchmark | null>(null);

  // Creator lockout
  if (session && session.user.role === "CREATOR") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-background text-center">
        <div className="w-16 h-16 rounded-3xl bg-accent/10 text-accent flex items-center justify-center mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">Agency &amp; Brand Portal Only</h1>
        <p className="text-sm text-text-secondary max-w-md mb-6">
          Competitor Instagram Scraping and Paid Collaboration Intelligence is reserved for verified Schbang Brand Managers.
        </p>
        <Link href="/brands">
          <Button variant="accent">Explore Open Brand Briefs</Button>
        </Link>
      </div>
    );
  }

  const allBrands = Object.values(BRAND_COMPETITOR_REGISTRY);

  const handleRunCustomAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBrandUrl || !customCompetitorUrl) {
      toast({ title: "Missing Handles", description: "Provide both Brand and Competitor Instagram URLs or handles.", type: "error" });
      return;
    }
    setIsScraping(true);
    setTimeout(() => {
      const result = analyzeCompetitorPair(customBrandUrl, customCompetitorUrl);
      setAdHocResult(result);
      setIsScraping(false);
      toast({ title: "Audit Complete!", description: `Analyzed ${result.brandName} vs ${result.competitorName}.`, type: "success" });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Header */}
      <div className="bg-primary text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent uppercase tracking-wider mb-2">
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                Instagram Scraping &amp; Paid Collabs Intelligence
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Competitor Intelligence Hub
              </h1>
              <p className="text-white/70 max-w-2xl text-sm leading-relaxed mt-1">
                Track up to 4 competitors per brand. View last 12 months of creator collaborations, boost detection, and 4-tier partnership analysis.
              </p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="text-xs font-bold border-white/20 text-white hover:bg-white/10">
                &larr; Admin Command Center
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Custom Audit Bar */}
        <Card className="rounded-3xl border-border bg-white shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <form onSubmit={handleRunCustomAudit} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-accent" />
                  Quick Ad-Hoc Competitor Audit
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5">
                  <Input placeholder="Brand (e.g. instagram.com/britannia_goodday)" value={customBrandUrl} onChange={(e) => setCustomBrandUrl(e.target.value)} className="text-xs" />
                </div>
                <div className="md:col-span-2 text-center text-xs font-black text-accent uppercase">VS</div>
                <div className="md:col-span-5">
                  <Input placeholder="Competitor (e.g. instagram.com/parleg_official)" value={customCompetitorUrl} onChange={(e) => setCustomCompetitorUrl(e.target.value)} className="text-xs" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="accent" size="sm" isLoading={isScraping} className="font-bold text-xs shadow-md shadow-accent/25">
                  <Zap className="w-3.5 h-3.5 mr-1.5" /> Run Quick Audit
                </Button>
              </div>
            </form>

            {adHocResult && (
              <div className="mt-6 p-5 rounded-2xl bg-gray-50 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-primary text-sm">{adHocResult.brandName} vs {adHocResult.competitorName}</h3>
                  <Badge variant="approved" className="text-[10px]">Analysis Complete</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-white rounded-xl border border-border">
                    <span className="text-[10px] font-bold uppercase text-text-secondary block">Brand SOV</span>
                    <span className="text-lg font-black text-accent">{adHocResult.shareOfVoicePct.brand}%</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-border">
                    <span className="text-[10px] font-bold uppercase text-text-secondary block">Competitor SOV</span>
                    <span className="text-lg font-black text-red-600">{adHocResult.shareOfVoicePct.competitor}%</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-border">
                    <span className="text-[10px] font-bold uppercase text-text-secondary block">Brand ER%</span>
                    <span className="text-lg font-black text-green-600">{adHocResult.brand.avgEngagementRate}%</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-border">
                    <span className="text-[10px] font-bold uppercase text-text-secondary block">Comp Boost Rate</span>
                    <span className="text-lg font-black text-red-600">{adHocResult.competitor.paidAdSpendRatioPct}%</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Brand-First Grid */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-1">Your Brand Portfolio</h2>
          <p className="text-xs text-text-secondary mb-6">Click any brand to view and manage its tracked competitors, creator rosters, and head-to-head analysis.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBrands.map((config) => {
              const totalCompetitorCreators = config.competitors.reduce((sum, c) => sum + c.stats.topCreators.length, 0);
              const avgBoostRate = config.competitors.length > 0
                ? (config.competitors.reduce((sum, c) => sum + c.stats.paidAdSpendRatioPct, 0) / config.competitors.length).toFixed(1)
                : '0';

              return (
                <Link key={config.brandSlug} href={`/admin/brands/${config.brandSlug}/competitors`}>
                  <Card className="rounded-3xl border-border bg-white shadow-xs hover:shadow-md hover:border-accent/30 transition-all cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={config.brandStats.avatar}
                            alt={config.brandName}
                            className="w-12 h-12 rounded-2xl border border-border object-cover"
                          />
                          <div>
                            <h3 className="font-bold text-primary text-base group-hover:text-accent transition-colors">
                              {config.brandName}
                            </h3>
                            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                              {config.brandIndustry}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-accent transition-colors" />
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border text-center">
                        <div className="p-2 bg-gray-50 rounded-xl">
                          <ShieldCheck className="w-3.5 h-3.5 text-accent mx-auto mb-0.5" />
                          <span className="text-[10px] font-bold text-text-secondary block">Tracked</span>
                          <span className="text-sm font-black text-primary">{config.competitors.length}/4</span>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-xl">
                          <Users className="w-3.5 h-3.5 text-accent mx-auto mb-0.5" />
                          <span className="text-[10px] font-bold text-text-secondary block">Creators</span>
                          <span className="text-sm font-black text-primary">{totalCompetitorCreators}</span>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-xl">
                          <TrendingUp className="w-3.5 h-3.5 text-red-500 mx-auto mb-0.5" />
                          <span className="text-[10px] font-bold text-text-secondary block">Avg Boost</span>
                          <span className="text-sm font-black text-red-600">{avgBoostRate}%</span>
                        </div>
                      </div>

                      {/* Competitor preview chips */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {config.competitors.map((comp) => (
                          <span
                            key={comp.id}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/5 text-[10px] font-semibold text-primary border border-border"
                          >
                            <img src={comp.avatar} alt={comp.name} className="w-4 h-4 rounded-md object-cover" />
                            {comp.name}
                          </span>
                        ))}
                        {config.competitors.length < 4 && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/10 text-[10px] font-bold text-accent border border-accent/20">
                            + Add More
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
