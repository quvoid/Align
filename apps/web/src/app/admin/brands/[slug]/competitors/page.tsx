"use client";

import React, { use, useEffect, useState, useMemo } from 'react';
import {
  getCompetitorsForBrand,
  addCompetitorToBrand,
  removeCompetitorFromBrand,
  getCompetitorCreatorsLastYear,
  getBrandVsCompetitor,
  PARTNERSHIP_TIERS,
  type TrackedCompetitor,
  type BrandCompetitorConfig,
  type CompetitorPostCollab,
  type HeadToHeadBenchmark,
  type PartnershipTier,
} from '@/lib/instagram-engine';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Zap,
  BarChart2,
  Eye,
  Heart,
  Calendar,
  Users,
  TrendingUp,
  Award,
  Video,
  ChevronDown,
  ChevronUp,
  Lock,
  Sparkles,
  Flame,
  ShieldCheck,
} from 'lucide-react';

type SortColumn = 'date' | 'views' | 'followers';
type SortDirection = 'asc' | 'desc';

export default function CompetitorsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { data: session } = useSession();
  const { toast } = useToast();

  const [config, setConfig] = useState<BrandCompetitorConfig | null>(null);
  const [creators, setCreators] = useState<(CompetitorPostCollab & { competitorName: string })[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Competitor State
  const [newHandle, setNewHandle] = useState('');
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Detail View State
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | null>(null);
  const [benchmarkData, setBenchmarkData] = useState<HeadToHeadBenchmark | null>(null);
  const [loadingBenchmark, setLoadingBenchmark] = useState(false);

  // Scout Modal State
  const [scoutModalOpen, setScoutModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<(CompetitorPostCollab & { competitorName: string }) | null>(null);
  const [scoutPitchNote, setScoutPitchNote] = useState('');

  // Sort State
  const [sortCol, setSortCol] = useState<SortColumn>('date');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  // RBAC check: creators cannot access
  if (session && session.user.role === 'CREATOR') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-background text-center">
        <div className="w-16 h-16 rounded-3xl bg-accent/10 text-accent flex items-center justify-center mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">Agency &amp; Brand Portal Only</h1>
        <p className="text-sm text-text-secondary max-w-md mb-6">
          Competitor Instagram Tracking is reserved for verified Schbang Brand Managers and Agency Leads.
        </p>
        <Link href="/brands">
          <Button variant="accent">Explore Open Brand Briefs</Button>
        </Link>
      </div>
    );
  }

  const loadData = () => {
    setLoading(true);
    try {
      const brandConfig = getCompetitorsForBrand(slug);
      const collabData = getCompetitorCreatorsLastYear(slug);

      setConfig(brandConfig ? { ...brandConfig, competitors: [...brandConfig.competitors] } : null);
      setCreators(collabData);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to load competitor data.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle) {
      toast({ title: 'Error', description: 'Instagram handle/URL is required.', type: 'error' });
      return;
    }

    if (config && config.competitors.length >= 4) {
      toast({ title: 'Limit Reached', description: 'Maximum of 4 competitors allowed per brand.', type: 'error' });
      return;
    }

    setIsAdding(true);
    try {
      const added = addCompetitorToBrand(slug, newHandle, newName || undefined);

      if (added) {
        toast({ title: 'Competitor Added! ⚡', description: `${added.name} added to ${config?.brandName || slug}'s watchlist.`, type: 'success' });
        setNewHandle('');
        setNewName('');
        loadData();
      } else {
        toast({ title: 'Duplicate Competitor', description: 'This handle is already being tracked for this brand.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'An error occurred while adding competitor.', type: 'error' });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveCompetitor = (competitorId: string) => {
    try {
      const removed = removeCompetitorFromBrand(slug, competitorId);
      if (removed) {
        toast({ title: 'Removed', description: 'Competitor removed from watchlist.', type: 'info' });
        loadData();
        if (selectedCompetitorId === competitorId) {
          closeBenchmark();
        }
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to remove competitor.', type: 'error' });
    }
  };

  const loadBenchmark = (competitorId: string) => {
    setSelectedCompetitorId(competitorId);
    setLoadingBenchmark(true);
    try {
      const data = getBrandVsCompetitor(slug, competitorId);
      setBenchmarkData(data);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to load head-to-head analysis.', type: 'error' });
      setSelectedCompetitorId(null);
    } finally {
      setLoadingBenchmark(false);
    }
  };

  const closeBenchmark = () => {
    setSelectedCompetitorId(null);
    setBenchmarkData(null);
  };

  const handleScoutClick = (creator: CompetitorPostCollab & { competitorName: string }) => {
    setSelectedCreator(creator);
    setScoutPitchNote(`Hi ${creator.creatorName}, we loved your recent creative reels! Align by Schbang invites you to join an exclusive high-budget collaboration with ${config?.brandName || 'our brand client'} with milestone escrow payouts.`);
    setScoutModalOpen(true);
  };

  const handleDispatchScoutOffer = () => {
    if (!selectedCreator) return;
    toast({
      title: 'Scouting Invitation Dispatched! ⚡',
      description: `Invited ${selectedCreator.creatorName} (${selectedCreator.creatorHandle}) to collaborate with ${config?.brandName || 'the brand'}.`,
      type: 'success',
    });
    setScoutModalOpen(false);
    setSelectedCreator(null);
  };

  const toggleSort = (col: SortColumn) => {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('desc');
    }
  };

  const sortedCreators = useMemo(() => {
    return [...creators].sort((a, b) => {
      let valA: number, valB: number;

      if (sortCol === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      } else if (sortCol === 'views') {
        valA = a.views;
        valB = b.views;
      } else if (sortCol === 'followers') {
        valA = a.creatorFollowers;
        valB = b.creatorFollowers;
      } else {
        valA = 0;
        valB = 0;
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [creators, sortCol, sortDir]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-primary">Brand Not Found</h2>
        <p className="text-text-secondary">No competitor profile exists for &quot;{slug}&quot;.</p>
        <Link href="/admin/competitor-intelligence">
          <Button variant="accent">Back to Competitor Hub</Button>
        </Link>
      </div>
    );
  }

  // HEAD-TO-HEAD DEEP DIVE VIEW
  if (selectedCompetitorId && benchmarkData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={closeBenchmark} className="text-text-secondary hover:text-primary font-bold">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to {config.brandName} Watchlist
          </Button>
          <Badge variant="approved" className="text-xs uppercase font-bold">
            Head-to-Head Deep Dive
          </Badge>
        </div>

        {/* Comparison Hero Scorecards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Brand Card */}
          <Card className="md:col-span-5 rounded-3xl border-2 border-accent/30 bg-white shadow-md">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={benchmarkData.brand.avatar}
                  alt={benchmarkData.brand.name}
                  className="w-12 h-12 rounded-2xl border object-cover shadow-xs"
                />
                <div>
                  <Badge variant="approved" className="text-[10px] uppercase font-bold mb-0.5">Your Brand</Badge>
                  <h2 className="text-lg font-black text-primary">{benchmarkData.brand.name}</h2>
                  <span className="text-xs font-semibold text-text-secondary">{benchmarkData.brand.handle}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border text-center">
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <span className="text-[10px] font-bold text-text-secondary block">Views Delivered</span>
                  <span className="text-base font-black text-primary">{formatNumber(benchmarkData.brand.totalViewsDelivered)}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <span className="text-[10px] font-bold text-text-secondary block">Avg ER</span>
                  <span className="text-base font-black text-green-600">{benchmarkData.brand.avgEngagementRate}%</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <span className="text-[10px] font-bold text-text-secondary block">Paid Boost</span>
                  <span className="text-base font-black text-primary">{benchmarkData.brand.paidAdSpendRatioPct}%</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <span className="text-[10px] font-bold text-text-secondary block">Collabs</span>
                  <span className="text-base font-black text-primary">{benchmarkData.brand.collabsAnalyzed}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SOV Gauge */}
          <div className="md:col-span-2 flex flex-col items-center justify-center p-4 bg-primary text-white rounded-3xl text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Share of Voice</span>
            <div className="text-2xl font-black">
              {benchmarkData.shareOfVoicePct.brand}% <span className="text-xs text-white/50">vs</span> {benchmarkData.shareOfVoicePct.competitor}%
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden flex">
              <div style={{ width: `${benchmarkData.shareOfVoicePct.brand}%` }} className="bg-accent h-full" />
              <div style={{ width: `${benchmarkData.shareOfVoicePct.competitor}%` }} className="bg-red-500 h-full" />
            </div>
          </div>

          {/* Competitor Card */}
          <Card className="md:col-span-5 rounded-3xl border border-red-200 bg-white shadow-md">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={benchmarkData.competitor.avatar}
                  alt={benchmarkData.competitor.name}
                  className="w-12 h-12 rounded-2xl border border-red-200 object-cover shadow-xs"
                />
                <div>
                  <Badge variant="rejected" className="text-[10px] uppercase font-bold mb-0.5">Tracked Competitor</Badge>
                  <h2 className="text-lg font-black text-primary">{benchmarkData.competitor.name}</h2>
                  <span className="text-xs font-semibold text-text-secondary">{benchmarkData.competitor.handle}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border text-center">
                <div className="p-2.5 bg-red-50/50 rounded-xl">
                  <span className="text-[10px] font-bold text-text-secondary block">Views Delivered</span>
                  <span className="text-base font-black text-primary">{formatNumber(benchmarkData.competitor.totalViewsDelivered)}</span>
                </div>
                <div className="p-2.5 bg-red-50/50 rounded-xl">
                  <span className="text-[10px] font-bold text-text-secondary block">Avg ER</span>
                  <span className="text-base font-black text-primary">{benchmarkData.competitor.avgEngagementRate}%</span>
                </div>
                <div className="p-2.5 bg-red-50/50 rounded-xl">
                  <span className="text-[10px] font-bold text-text-secondary block">Paid Boost</span>
                  <span className="text-base font-black text-red-600 font-extrabold">{benchmarkData.competitor.paidAdSpendRatioPct}% 🚀</span>
                </div>
                <div className="p-2.5 bg-red-50/50 rounded-xl">
                  <span className="text-[10px] font-bold text-text-secondary block">Collabs</span>
                  <span className="text-base font-black text-primary">{benchmarkData.competitor.collabsAnalyzed}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4-Tier Partnership Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-primary">4-Tier Partnership Distribution</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.keys(PARTNERSHIP_TIERS) as PartnershipTier[]).map((tierKey) => {
              const info = PARTNERSHIP_TIERS[tierKey];
              const brandCount = benchmarkData.brand.tierDistribution[tierKey] || 0;
              const compCount = benchmarkData.competitor.tierDistribution[tierKey] || 0;

              return (
                <div
                  key={tierKey}
                  style={{ borderColor: info.borderColor, backgroundColor: info.bgLight }}
                  className="rounded-2xl border p-4 space-y-2"
                >
                  <span className="text-xs font-black" style={{ color: info.color }}>{info.badge}</span>
                  <div className="pt-2 border-t border-black/5 flex justify-between text-xs font-bold">
                    <span>{benchmarkData.brandName}: {brandCount}</span>
                    <span className="text-red-600">{benchmarkData.competitorName}: {compCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Strategy Insights */}
        <Card className="rounded-3xl border-border bg-white shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            AI Strategic Counter-Plays for {config.brandName}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benchmarkData.recommendedCounterPlays.map((play, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gray-50 border border-border text-xs leading-relaxed text-primary font-medium"
                dangerouslySetInnerHTML={{ __html: play }}
              />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // MAIN WATCHLIST DASHBOARD VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/admin/competitor-intelligence" className="text-text-secondary hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <img
              src={config.brandStats.avatar}
              alt={config.brandName}
              className="w-10 h-10 rounded-2xl border object-cover"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight flex items-center gap-2">
                {config.brandName}
                <Badge variant="approved" className="text-[10px] uppercase font-bold">{config.brandIndustry}</Badge>
              </h1>
            </div>
          </div>
          <p className="text-xs text-text-secondary">
            Tracking {config.competitors.length} of 4 maximum competitors with 12-month historical creator pulls.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-text-secondary bg-white px-4 py-2 rounded-full border border-border shadow-xs">
          <BarChart2 className="w-4 h-4 text-accent" />
          <span>{config.competitors.length} / 4 Competitors Monitored</span>
        </div>
      </div>

      {/* Competitor Watchlist Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            Tracked Competitors Watchlist ({config.competitors.length}/4)
          </h2>
        </div>

        {config.competitors.length === 0 ? (
          <Card className="rounded-3xl border-dashed border-2 border-border bg-transparent text-center p-10">
            <p className="text-sm text-text-secondary mb-2">No competitors tracked for {config.brandName} yet.</p>
            <p className="text-xs text-text-secondary">Use the form below to add up to 4 competitor Instagram profiles.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.competitors.map((comp) => (
              <Card key={comp.id} className="rounded-3xl border-border bg-white shadow-xs hover:shadow-md transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <img src={comp.avatar} alt={comp.name} className="w-11 h-11 rounded-2xl object-cover border border-border" />
                      <div>
                        <h3 className="font-bold text-primary text-sm truncate max-w-[150px]" title={comp.name}>{comp.name}</h3>
                        <span className="text-xs font-semibold text-accent">{comp.igHandle}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCompetitor(comp.id)}
                      className="text-text-secondary hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                      title="Remove competitor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
                    <div className="p-2 bg-gray-50 rounded-xl">
                      <span className="text-[9px] font-bold text-text-secondary uppercase block">Followers</span>
                      <span className="text-xs font-black text-primary">{formatNumber(comp.stats.followers)}</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-xl">
                      <span className="text-[9px] font-bold text-text-secondary uppercase block">Avg ER</span>
                      <span className="text-xs font-black text-green-600">{comp.stats.avgEngagementRate}%</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-xl">
                      <span className="text-[9px] font-bold text-text-secondary uppercase block">Paid Boost</span>
                      <span className="text-xs font-black text-red-600 font-extrabold">{comp.stats.paidAdSpendRatioPct}%</span>
                    </div>
                  </div>

                  <Button
                    variant="accent"
                    size="sm"
                    className="w-full text-xs font-bold shadow-xs"
                    onClick={() => loadBenchmark(comp.id)}
                    disabled={loadingBenchmark}
                  >
                    <Zap className="w-3 h-3 mr-1" /> View Full Head-to-Head
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Add Competitor Form */}
      {config.competitors.length < 4 && (
        <Card className="rounded-3xl border-border bg-white shadow-xs p-6">
          <form onSubmit={handleAddCompetitor} className="space-y-3">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Plus className="w-4 h-4 text-accent" />
                Add Competitor to {config.brandName}&apos;s Watchlist ({4 - config.competitors.length} slots remaining)
              </span>
              <p className="text-[11px] text-text-secondary">
                Enter an Instagram handle or profile URL to pull collaboration intelligence, boost detection, and creator history.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-6 space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Instagram Handle or URL *</label>
                <Input
                  placeholder="e.g. @parleg_official or instagram.com/parleg_official"
                  value={newHandle}
                  onChange={(e) => setNewHandle(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>
              <div className="md:col-span-4 space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Display Name (Optional)</label>
                <Input
                  placeholder="e.g. Parle Products"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="md:col-span-2">
                <Button
                  type="submit"
                  variant="accent"
                  size="sm"
                  isLoading={isAdding}
                  className="w-full text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* Unified Competitor Creators Roster (Last 12 Months) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              Competitor Creators Roster (Last 12 Months)
            </h2>
            <p className="text-xs text-text-secondary">
              Extracted from all tracked competitor campaigns in the last 365 days. Scout high-performing creators directly.
            </p>
          </div>
          <Badge className="bg-primary text-white text-xs font-bold">{creators.length} Total Collabs</Badge>
        </div>

        <Card className="rounded-3xl border-border bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-secondary uppercase tracking-wider bg-gray-50 border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold">Creator</th>
                  <th scope="col" className="px-6 py-4 font-bold">Competitor</th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold cursor-pointer hover:text-primary transition-colors select-none"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortCol === 'date' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold cursor-pointer hover:text-primary transition-colors select-none"
                    onClick={() => toggleSort('views')}
                  >
                    <div className="flex items-center gap-1">
                      Views
                      {sortCol === 'views' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold">Boost Status</th>
                  <th scope="col" className="px-6 py-4 font-bold">Creative Genre</th>
                  <th scope="col" className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedCreators.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-text-secondary text-xs">
                      No collaboration data found for tracked competitors.
                    </td>
                  </tr>
                ) : (
                  sortedCreators.map((collab) => (
                    <tr key={collab.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={collab.creatorAvatar} alt={collab.creatorName} className="w-9 h-9 rounded-xl object-cover border border-border" />
                          <div>
                            <div className="font-bold text-primary text-xs">{collab.creatorName}</div>
                            <span className="text-[11px] text-accent font-semibold">{collab.creatorHandle}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="pending" className="text-[10px] font-bold">
                          {collab.competitorName}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-text-secondary">
                        {new Date(collab.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-primary text-xs">{formatNumber(collab.views)}</div>
                        <span className="text-[10px] text-text-secondary">
                          {collab.likes.toLocaleString()} likes ({collab.likeToViewPct}% rate)
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={collab.isBoosted ? 'rejected' : 'approved'}
                          className="text-[10px] font-bold"
                        >
                          {collab.tier.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-primary">
                        {collab.genre}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="accent"
                          size="sm"
                          className="text-xs font-bold shadow-xs"
                          onClick={() => handleScoutClick(collab)}
                        >
                          <Zap className="w-3 h-3 mr-1" /> Scout
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Scout Modal */}
      {selectedCreator && (
        <Modal
          isOpen={scoutModalOpen}
          onClose={() => setScoutModalOpen(false)}
          title={`Scout ${selectedCreator.creatorName}`}
          description={`Currently collaborating with ${selectedCreator.competitorName} (${selectedCreator.genre})`}
          size="md"
        >
          <div className="space-y-4 mt-4 text-xs">
            <div className="p-4 rounded-2xl bg-gray-50 border border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-text-secondary block">Audience Reach</span>
                <span className="font-extrabold text-sm text-primary">{formatNumber(selectedCreator.creatorFollowers)} Followers</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-text-secondary block">Last Collab Views</span>
                <span className="font-extrabold text-sm text-accent">{formatNumber(selectedCreator.views)}</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-primary block mb-1.5">Personalized Pitch for {config.brandName}:</label>
              <textarea
                rows={3}
                value={scoutPitchNote}
                onChange={(e) => setScoutPitchNote(e.target.value)}
                className="w-full p-3 rounded-xl border border-border bg-white text-xs focus:outline-hidden focus:border-accent"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" onClick={() => setScoutModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="accent" size="sm" onClick={handleDispatchScoutOffer} className="font-bold">
                ⚡ Dispatch Deal Invitation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
