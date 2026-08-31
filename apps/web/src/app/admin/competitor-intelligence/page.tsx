"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import {
  COMPETITIVE_BENCHMARKS,
  analyzeCompetitorPair,
  PARTNERSHIP_TIERS,
  type HeadToHeadBenchmark,
  type CompetitorPostCollab,
  type PartnershipTier,
} from "@/lib/instagram-engine";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Flame,
  BarChart3,
  Award,
  Lock,
  ArrowUpRight,
  PieChart,
  Eye,
  CheckCircle2,
  DollarSign,
} from "lucide-react";

export default function CompetitorIntelligencePage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [selectedPairKey, setSelectedPairKey] = useState<string>("britannia_vs_parle");
  const [customBrandUrl, setCustomBrandUrl] = useState("");
  const [customCompetitorUrl, setCustomCompetitorUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "tiers" | "creators" | "genres" | "ai_strategy">("overview");
  const [selectedCreator, setSelectedCreator] = useState<CompetitorPostCollab | null>(null);
  const [scoutingNote, setScoutingNote] = useState("");

  const [benchmark, setBenchmark] = useState<HeadToHeadBenchmark>(
    COMPETITIVE_BENCHMARKS["britannia_vs_parle"]!
  );

  // If user is creator, show role lock screen
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

  const handleSelectPreset = (key: string) => {
    setSelectedPairKey(key);
    if (COMPETITIVE_BENCHMARKS[key]) {
      setBenchmark(COMPETITIVE_BENCHMARKS[key]!);
      toast({
        title: "Preset Loaded",
        description: `Loaded competitive audit for ${COMPETITIVE_BENCHMARKS[key]!.brandName} vs ${COMPETITIVE_BENCHMARKS[key]!.competitorName}.`,
        type: "info",
      });
    }
  };

  const handleRunCustomAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBrandUrl || !customCompetitorUrl) {
      toast({
        title: "Missing Handles",
        description: "Please provide both Brand and Competitor Instagram URLs or handles.",
        type: "error",
      });
      return;
    }

    setIsScraping(true);
    setTimeout(() => {
      const result = analyzeCompetitorPair(customBrandUrl, customCompetitorUrl);
      setBenchmark(result);
      setSelectedPairKey("custom");
      setIsScraping(false);
      toast({
        title: "Instagram Intelligence Extracted!",
        description: `Analyzed 4-tier collabs & boost ratios for ${result.brandName} vs ${result.competitorName}.`,
        type: "success",
      });
    }, 900);
  };

  const handleSendScoutOffer = () => {
    if (!selectedCreator) return;
    toast({
      title: "Scouting Invitation Dispatched! ⚡",
      description: `Invited ${selectedCreator.creatorHandle} to join ${benchmark.brandName}'s campaign on Align with pre-approved budget.`,
      type: "success",
    });
    setSelectedCreator(null);
    setScoutingNote("");
  };

  const brand = benchmark.brand;
  const competitor = benchmark.competitor;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Header */}
      <div className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent uppercase tracking-wider mb-2">
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                Instagram Scraping &amp; Paid Collabs Intelligence
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Brand vs. Competitor Benchmarking
              </h1>
              <p className="text-white/70 max-w-2xl text-sm leading-relaxed mt-1">
                Deep-inspect competitor Instagram creator rosters, 4-tier paid partnership distributions, and mathematical ad spend boost ratios.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/admin">
                <Button variant="outline" className="text-xs font-bold border-white/20 text-white hover:bg-white/10">
                  &larr; Admin Command Center
                </Button>
              </Link>
            </div>
          </div>

          {/* Preset Rivalries */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-white/60 mr-2">Featured Rivalries:</span>
            <button
              onClick={() => handleSelectPreset("britannia_vs_parle")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedPairKey === "britannia_vs_parle"
                  ? "bg-accent text-white shadow-md shadow-accent/30"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              🍪 Britannia vs. Parle
            </button>
            <button
              onClick={() => handleSelectPreset("swiggy_vs_zomato")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedPairKey === "swiggy_vs_zomato"
                  ? "bg-accent text-white shadow-md shadow-accent/30"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              🛵 Swiggy vs. Zomato
            </button>
            <button
              onClick={() => handleSelectPreset("nivea_vs_mamaearth")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedPairKey === "nivea_vs_mamaearth"
                  ? "bg-accent text-white shadow-md shadow-accent/30"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              💧 NIVEA vs. Mamaearth
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Custom Scraper Input Bar */}
        <Card className="rounded-3xl border-border bg-white shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <form onSubmit={handleRunCustomAudit} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-accent" />
                  Live Instagram Scraping Audit
                </span>
                <span className="text-[11px] text-text-secondary">
                  TLS-fingerprinted Chrome 120 impersonation engine
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5">
                  <Input
                    placeholder="Your Brand (e.g. instagram.com/britannia_goodday)"
                    value={customBrandUrl}
                    onChange={(e) => setCustomBrandUrl(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div className="md:col-span-2 text-center text-xs font-black text-accent uppercase">
                  VS
                </div>
                <div className="md:col-span-5">
                  <Input
                    placeholder="Competitor (e.g. instagram.com/parleg_official)"
                    value={customCompetitorUrl}
                    onChange={(e) => setCustomCompetitorUrl(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="accent"
                  size="sm"
                  isLoading={isScraping}
                  className="font-bold text-xs shadow-md shadow-accent/25"
                >
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  Run Competitor Intelligence Audit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Head-to-Head Scorecard Hero */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Brand Card */}
          <Card className="md:col-span-5 rounded-3xl border-2 border-accent/30 bg-white shadow-md">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={brand.avatar}
                    alt={brand.name}
                    className="w-14 h-14 rounded-2xl border-2 border-accent/20 object-cover shadow-sm bg-white"
                  />
                  <div>
                    <Badge variant="approved" className="text-[10px] uppercase font-bold mb-1">
                      Our Brand Client
                    </Badge>
                    <h2 className="text-xl font-black text-primary">{brand.name}</h2>
                    <span className="text-xs font-semibold text-text-secondary">{brand.handle}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border text-center">
                <div className="p-3 bg-gray-50 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
                    Follower Base
                  </span>
                  <span className="text-xl font-black text-primary">
                    {(brand.followers / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
                    Total Collab Views
                  </span>
                  <span className="text-xl font-black text-primary">
                    {(brand.totalViewsDelivered / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
                    Avg Engagement
                  </span>
                  <span className="text-xl font-black text-green-600">
                    {brand.avgEngagementRate}%
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
                    Paid Boost Rate
                  </span>
                  <span className="text-xl font-black text-primary">
                    {brand.paidAdSpendRatioPct}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* VS Gauge Bar */}
          <div className="md:col-span-2 flex flex-col items-center justify-center p-4 bg-primary text-white rounded-3xl text-center space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
              Share of Voice
            </span>
            <div className="text-3xl font-black">
              {benchmark.shareOfVoicePct.brand}% <span className="text-xs text-white/50">vs</span> {benchmark.shareOfVoicePct.competitor}%
            </div>
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${benchmark.shareOfVoicePct.brand}%` }}
                className="bg-accent h-full"
              />
              <div
                style={{ width: `${benchmark.shareOfVoicePct.competitor}%` }}
                className="bg-red-500 h-full"
              />
            </div>
            <span className="text-[10px] text-white/70">
              Based on {brand.collabsAnalyzed + competitor.collabsAnalyzed} verified creator reels
            </span>
          </div>

          {/* Competitor Card */}
          <Card className="md:col-span-5 rounded-3xl border border-red-200 bg-white shadow-md">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={competitor.avatar}
                    alt={competitor.name}
                    className="w-14 h-14 rounded-2xl border-2 border-red-200 object-cover shadow-sm bg-white"
                  />
                  <div>
                    <Badge variant="rejected" className="text-[10px] uppercase font-bold mb-1">
                      Direct Competitor
                    </Badge>
                    <h2 className="text-xl font-black text-primary">{competitor.name}</h2>
                    <span className="text-xs font-semibold text-text-secondary">{competitor.handle}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border text-center">
                <div className="p-3 bg-red-50/50 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
                    Follower Base
                  </span>
                  <span className="text-xl font-black text-primary">
                    {(competitor.followers / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="p-3 bg-red-50/50 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
                    Total Collab Views
                  </span>
                  <span className="text-xl font-black text-primary">
                    {(competitor.totalViewsDelivered / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="p-3 bg-red-50/50 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
                    Avg Engagement
                  </span>
                  <span className="text-xl font-black text-primary">
                    {competitor.avgEngagementRate}%
                  </span>
                </div>
                <div className="p-3 bg-red-50/50 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
                    Paid Boost Rate
                  </span>
                  <span className="text-xl font-black text-red-600 font-extrabold">
                    {competitor.paidAdSpendRatioPct}% 🚀
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border space-x-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === "overview"
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-primary"
            }`}
          >
            📊 Executive Overview
          </button>
          <button
            onClick={() => setActiveTab("tiers")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === "tiers"
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-primary"
            }`}
          >
            📐 4-Tier Partnership Hierarchy
          </button>
          <button
            onClick={() => setActiveTab("creators")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === "creators"
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-primary"
            }`}
          >
            🎯 Competitor Creator Roster ({competitor.topCreators.length})
          </button>
          <button
            onClick={() => setActiveTab("genres")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === "genres"
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-primary"
            }`}
          >
            🎨 Creative Genre Radar
          </button>
          <button
            onClick={() => setActiveTab("ai_strategy")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === "ai_strategy"
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-primary"
            }`}
          >
            ⚡ AI Strategy &amp; Counter-Plays
          </button>
        </div>

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-3xl border-border bg-white shadow-xs p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase mb-2">
                  <Flame className="w-4 h-4 text-red-500" />
                  Paid Ad Spend Aggressiveness
                </div>
                <div className="text-2xl font-black text-primary mt-1">
                  {competitor.paidAdSpendRatioPct > brand.paidAdSpendRatioPct ? (
                    <span className="text-red-600">
                      {competitor.name} (+{(competitor.paidAdSpendRatioPct - brand.paidAdSpendRatioPct).toFixed(1)}% higher)
                    </span>
                  ) : (
                    <span className="text-green-600">{brand.name} leads</span>
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                  {competitor.name} boosts {competitor.paidAdSpendRatioPct}% of their creator collabs with sub-0.35% like-to-view ratios.
                </p>
              </Card>

              <Card className="rounded-3xl border-border bg-white shadow-xs p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase mb-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  Organic Engagement Winner
                </div>
                <div className="text-2xl font-black text-green-600 mt-1">
                  {brand.name} ({brand.avgEngagementRate}% ER)
                </div>
                <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                  {brand.name}&apos;s creators command a higher organic comment and share velocity per 10k impressions.
                </p>
              </Card>

              <Card className="rounded-3xl border-border bg-white shadow-xs p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  Dominant Creator Sizing
                </div>
                <div className="text-2xl font-black text-primary mt-1">
                  Macro Tier (100k–1M)
                </div>
                <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                  Both brands concentrate 60%+ of campaign inventory on verified macro comedy and lifestyle creators.
                </p>
              </Card>
            </div>

            {/* Strategic Summary Box */}
            <div className="p-8 rounded-3xl bg-primary text-white space-y-4">
              <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Executive Summary for Schbang Media Leads
              </div>
              <h3 className="text-xl font-bold">
                Competitive Overview: {brand.name} vs. {competitor.name}
              </h3>
              <ul className="space-y-2 text-xs text-white/80 leading-relaxed">
                {benchmark.aiStrategicInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-accent font-bold">&bull;</span>
                    <span dangerouslySetInnerHTML={{ __html: insight }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: 4-TIER HIERARCHY */}
        {activeTab === "tiers" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(Object.keys(PARTNERSHIP_TIERS) as PartnershipTier[]).map((tierKey) => {
                const info = PARTNERSHIP_TIERS[tierKey];
                const brandCount = brand.tierDistribution[tierKey] || 0;
                const compCount = competitor.tierDistribution[tierKey] || 0;

                return (
                  <Card
                    key={tierKey}
                    style={{ borderColor: info.borderColor, backgroundColor: info.bgLight }}
                    className="rounded-3xl border p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black" style={{ color: info.color }}>
                        {info.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-relaxed">
                      {info.description}
                    </p>

                    <div className="pt-3 border-t border-black/5 flex justify-between items-center text-xs font-bold">
                      <div>
                        <span className="text-text-secondary text-[10px] block font-semibold">{brand.name}</span>
                        <span className="text-base text-primary">{brandCount} posts</span>
                      </div>
                      <div className="text-right">
                        <span className="text-text-secondary text-[10px] block font-semibold">{competitor.name}</span>
                        <span className="text-base text-red-600 font-extrabold">{compCount} posts</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: COMPETITOR CREATOR ROSTER */}
        {activeTab === "creators" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-primary">
                  Creators Partnering with {competitor.name}
                </h3>
                <p className="text-xs text-text-secondary">
                  Extracted from live coauthor_producers tags. Scout high-performing creators directly to Align.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text-secondary uppercase tracking-wider bg-gray-50/80 border-b border-border">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-bold">Creator</th>
                      <th scope="col" className="px-6 py-4 font-bold">Audience Tier</th>
                      <th scope="col" className="px-6 py-4 font-bold">Collab Performance</th>
                      <th scope="col" className="px-6 py-4 font-bold">Boost Status</th>
                      <th scope="col" className="px-6 py-4 font-bold">Creative Genre</th>
                      <th scope="col" className="px-6 py-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {competitor.topCreators.map((collab) => (
                      <tr key={collab.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={collab.creatorAvatar}
                              alt={collab.creatorName}
                              className="w-10 h-10 rounded-xl object-cover border border-border"
                            />
                            <div>
                              <div className="font-bold text-primary text-xs">{collab.creatorName}</div>
                              <span className="text-[11px] text-accent font-semibold">{collab.creatorHandle}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold text-text-secondary">
                            {collab.creatorTier}
                          </span>
                          <div className="text-[10px] text-text-secondary">
                            {(collab.creatorFollowers / 1000).toFixed(0)}k followers
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-primary text-xs">
                            {(collab.views / 1000).toFixed(0)}k views
                          </div>
                          <span className="text-[10px] text-text-secondary">
                            {collab.likes.toLocaleString()} likes ({collab.likeToViewPct}% rate)
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={collab.isBoosted ? "rejected" : "approved"}
                            className="text-[10px] font-bold"
                          >
                            {collab.tier.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-primary">
                          {collab.genre}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="accent"
                            size="sm"
                            onClick={() => setSelectedCreator(collab)}
                            className="text-xs font-bold shadow-xs"
                          >
                            ⚡ Scout to Align
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GENRES */}
        {activeTab === "genres" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-3xl border-border bg-white shadow-xs p-6">
                <h3 className="font-bold text-base text-primary mb-4 flex items-center gap-2">
                  <Badge variant="approved">{brand.name}</Badge> Creative Genre Distribution
                </h3>
                <div className="space-y-3">
                  {Object.entries(brand.genreDistribution).map(([genre, count]) => (
                    <div key={genre} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-primary">{genre}</span>
                        <span className="text-text-secondary">{count} campaigns</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(count / Math.max(brand.collabsAnalyzed, 1)) * 100}%` }}
                          className="bg-accent h-full rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="rounded-3xl border-border bg-white shadow-xs p-6">
                <h3 className="font-bold text-base text-primary mb-4 flex items-center gap-2">
                  <Badge variant="rejected">{competitor.name}</Badge> Creative Genre Distribution
                </h3>
                <div className="space-y-3">
                  {Object.entries(competitor.genreDistribution).map(([genre, count]) => (
                    <div key={genre} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-primary">{genre}</span>
                        <span className="text-text-secondary">{count} campaigns</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(count / Math.max(competitor.collabsAnalyzed, 1)) * 100}%` }}
                          className="bg-red-500 h-full rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 5: AI STRATEGY */}
        {activeTab === "ai_strategy" && (
          <div className="space-y-6">
            <Card className="rounded-3xl border-border bg-white shadow-xs p-8 space-y-6">
              <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Recommended Schbang Counter-Offensive Strategy
              </div>

              <div className="space-y-4">
                {benchmark.recommendedCounterPlays.map((play, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-gray-50 border border-border text-xs leading-relaxed text-primary font-medium"
                    dangerouslySetInnerHTML={{ __html: play }}
                  />
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Scout Creator Modal */}
      {selectedCreator && (
        <Modal
          isOpen={!!selectedCreator}
          onClose={() => setSelectedCreator(null)}
          title={`Scout ${selectedCreator.creatorName} (${selectedCreator.creatorHandle})`}
          description={`Currently partnering with ${competitor.name} (${selectedCreator.genre})`}
          size="md"
        >
          <div className="space-y-5 mt-4 text-xs">
            <div className="p-4 rounded-2xl bg-gray-50 border border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
                  Audience Reach
                </span>
                <span className="font-extrabold text-sm text-primary">
                  {(selectedCreator.creatorFollowers / 1000).toFixed(0)}k Followers
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
                  Avg Collab Views
                </span>
                <span className="font-extrabold text-sm text-accent">
                  {(selectedCreator.views / 1000).toFixed(0)}k
                </span>
              </div>
            </div>

            <div>
              <label className="font-bold text-primary block mb-1.5">
                Exclusive Deal Pitch &amp; Brief Offer:
              </label>
              <textarea
                rows={3}
                value={scoutingNote}
                onChange={(e) => setScoutingNote(e.target.value)}
                placeholder={`Hi ${selectedCreator.creatorName}, we love your recent creative work! Schbang invites you to collaborate with ${brand.name} on an exclusive high-budget brief with milestone escrow payouts.`}
                className="w-full p-3 rounded-xl border border-border bg-white text-xs focus:outline-hidden focus:border-accent"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" onClick={() => setSelectedCreator(null)}>
                Cancel
              </Button>
              <Button variant="accent" size="sm" onClick={handleSendScoutOffer} className="font-bold">
                ⚡ Dispatch Deal Offer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
