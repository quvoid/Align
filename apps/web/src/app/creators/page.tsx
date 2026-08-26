"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { INITIAL_CREATORS, CreatorItem } from "@/lib/mock-data";
import { useSession } from "next-auth/react";
import {
  Search,
  Users,
  Instagram,
  Youtube,
  Star,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  ArrowRight,
  Filter,
  Sparkles,
  Send,
  Building2,
  MapPin,
  ShieldCheck,
  Lock,
} from "lucide-react";

export default function CreatorDiscoveryPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [creators] = useState<CreatorItem[]>(INITIAL_CREATORS);
  const [search, setSearch] = useState("");
  const [nicheFilter, setNicheFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [brandFilter, setBrandFilter] = useState("ALL");
  const [invitedCreatorId, setInvitedCreatorId] = useState<string | null>(null);

  // If user is logged in as a normal CREATOR, block talent directory access
  if (session?.user?.role === "CREATOR") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-background">
        <div className="max-w-md w-full text-center space-y-5 p-8 bg-white rounded-3xl border border-border shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto border border-accent/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-primary">Brand &amp; Agency Portal</h2>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              The Creator Talent Discovery Directory is reserved for verified Schbang Brand Managers and Agency Leads scouting creators.
            </p>
            <p className="text-xs text-text-secondary mt-1">
              As a creator, you can browse open briefs, view requirements, and submit pitches under <strong>Explore Brands</strong>.
            </p>
          </div>
          <div className="space-y-2 pt-3">
            <Link href="/brands">
              <Button variant="accent" className="w-full font-bold shadow-lg shadow-accent/25">
                Browse Open Brand Briefs <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full text-xs font-semibold">
                Go to My Creator Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter creators
  const filteredCreators = creators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(search.toLowerCase()) ||
      creator.handle.toLowerCase().includes(search.toLowerCase()) ||
      creator.bio.toLowerCase().includes(search.toLowerCase()) ||
      creator.niche.some((n) => n.toLowerCase().includes(search.toLowerCase()));

    const matchesNiche =
      nicheFilter === "ALL" ||
      creator.niche.some((n) => n.toLowerCase().includes(nicheFilter.toLowerCase()));

    const matchesTier = tierFilter === "ALL" || creator.tier === tierFilter;

    const matchesBrand =
      brandFilter === "ALL" ||
      creator.brandCollaborations.some((c) =>
        c.brandName.toLowerCase().includes(brandFilter.toLowerCase())
      );

    return matchesSearch && matchesNiche && matchesTier && matchesBrand;
  });

  const handleQuickInvite = (creator: CreatorItem) => {
    setInvitedCreatorId(creator.id);
    toast({
      title: `⚡ Fast-Track Invite Sent to ${creator.name}!`,
      description: `We notified ${creator.handle} regarding an upcoming Schbang brand campaign brief.`,
      type: "success",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Brand Header Banner */}
      <div className="bg-primary text-white py-12 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>Brand &amp; Agency Talent Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              Discover Verified Creators
            </h1>
            <p className="text-white/70 text-base leading-relaxed">
              Explore creator performance scorecards, lifetime brand collaboration track records, and verified engagement metrics. Shortlist or invite talent directly to active campaign briefs.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-3 bg-white/5 p-3 rounded-2xl border border-white/15 backdrop-blur-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search name, handle, or niche..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 text-white placeholder:text-white/40 pl-10 pr-4 py-2.5 rounded-xl text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>

            <div>
              <select
                value={nicheFilter}
                onChange={(e) => setNicheFilter(e.target.value)}
                className="w-full bg-white/10 text-white py-2.5 px-3.5 rounded-xl text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white">All Niches</option>
                <option value="Food" className="bg-slate-900 text-white">Food &amp; FMCG</option>
                <option value="Comedy" className="bg-slate-900 text-white">Comedy &amp; Sketches</option>
                <option value="Beauty" className="bg-slate-900 text-white">Beauty &amp; Skincare</option>
                <option value="Tech" className="bg-slate-900 text-white">Tech &amp; Gadgets</option>
                <option value="Fashion" className="bg-slate-900 text-white">Fashion &amp; Apparel</option>
                <option value="Finance" className="bg-slate-900 text-white">Finance &amp; FinTech</option>
              </select>
            </div>

            <div>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="w-full bg-white/10 text-white py-2.5 px-3.5 rounded-xl text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white">All Follower Tiers</option>
                <option value="Nano" className="bg-slate-900 text-white">Nano (&lt;10k)</option>
                <option value="Micro" className="bg-slate-900 text-white">Micro (10k-100k)</option>
                <option value="Mid-Tier" className="bg-slate-900 text-white">Mid-Tier (100k-500k)</option>
                <option value="Macro" className="bg-slate-900 text-white">Macro (500k+)</option>
              </select>
            </div>

            <div>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full bg-white/10 text-white py-2.5 px-3.5 rounded-xl text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white">Past Brand Collabs</option>
                <option value="Britannia" className="bg-slate-900 text-white">Worked with Britannia</option>
                <option value="NIVEA" className="bg-slate-900 text-white">Worked with NIVEA</option>
                <option value="Swiggy" className="bg-slate-900 text-white">Worked with Swiggy</option>
                <option value="Fevicol" className="bg-slate-900 text-white">Worked with Fevicol</option>
                <option value="Kotak811" className="bg-slate-900 text-white">Worked with Kotak811</option>
                <option value="Myntra" className="bg-slate-900 text-white">Worked with Myntra</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Creators Grid */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-primary">
              Verified Creator Roster ({filteredCreators.length})
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Profiles with verified engagement analytics &amp; authenticated brand track records.
            </p>
          </div>

          {(search || nicheFilter !== "ALL" || tierFilter !== "ALL" || brandFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setNicheFilter("ALL");
                setTierFilter("ALL");
                setBrandFilter("ALL");
              }}
              className="text-xs font-semibold text-accent hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <div
              key={creator.id}
              className="bg-white rounded-3xl border border-border overflow-hidden hover:shadow-xl hover:border-accent/40 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Creator Profile Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-border shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-primary">
                        {creator.name}
                      </h3>
                      <p className="text-xs font-semibold text-accent">
                        {creator.handle}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-text-secondary mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{creator.location}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/5 text-primary border border-border">
                    {creator.tier}
                  </span>
                </div>

                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-4">
                  {creator.bio}
                </p>

                {/* Niches */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {creator.niche.map((n, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-gray-100 text-[10px] font-semibold text-text-secondary"
                    >
                      {n}
                    </span>
                  ))}
                </div>

                {/* Platform Metrics Strip */}
                <div className="grid grid-cols-2 gap-2 bg-gray-50/80 p-3 rounded-2xl border border-border/80 text-center mb-4">
                  <div className="border-r border-border/60 pr-2">
                    <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-text-secondary mb-0.5">
                      <Instagram className="w-3 h-3 text-pink-600" />
                      <span>Instagram</span>
                    </div>
                    <div className="font-black text-sm text-primary">
                      {(creator.igFollowers / 1000).toFixed(0)}k
                    </div>
                    <span className="text-[10px] font-bold text-green-600">
                      {creator.igEngagementRate}% ER
                    </span>
                  </div>

                  <div className="pl-2">
                    <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-text-secondary mb-0.5">
                      <Youtube className="w-3 h-3 text-red-600" />
                      <span>YouTube</span>
                    </div>
                    <div className="font-black text-sm text-primary">
                      {creator.ytSubscribers
                        ? `${(creator.ytSubscribers / 1000).toFixed(0)}k`
                        : "—"}
                    </div>
                    <span className="text-[10px] font-semibold text-text-secondary">
                      {creator.ytAvgViews ? `${creator.ytAvgViews} avg` : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Lifetime Track Record & Past Brands */}
                <div className="space-y-2.5 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-text-secondary uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-accent" />
                      Schbang Brand Collabs
                    </span>
                    <span className="font-black text-primary text-xs">
                      {creator.performance.totalCampaigns} Campaigns
                    </span>
                  </div>

                  {/* Brand Collaboration Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {creator.brandCollaborations.map((collab, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-border text-[11px] font-bold text-primary shadow-2xs"
                        title={`${collab.brandName} (${collab.campaignTitle}) - Delivered ${collab.viewsDelivered} views`}
                      >
                        <img
                          src={collab.brandLogo}
                          alt={collab.brandName}
                          className="w-3.5 h-3.5 rounded-full object-cover"
                        />
                        <span>{collab.brandName}</span>
                      </div>
                    ))}
                  </div>

                  {/* Lifetime Impact Stats */}
                  <div className="flex items-center justify-between text-[11px] text-text-secondary pt-1 font-medium">
                    <span>Lifetime Reach: <strong className="text-primary">{creator.performance.totalReach}</strong></span>
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {creator.performance.reliabilityScore} / 5.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 border-t border-border flex items-center gap-2">
                <Link
                  href={`/creators/${creator.id}`}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-bold"
                  >
                    View Scorecard
                  </Button>
                </Link>

                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => handleQuickInvite(creator)}
                  disabled={invitedCreatorId === creator.id}
                  className="flex-1 text-xs font-bold shadow-md shadow-accent/20"
                >
                  {invitedCreatorId === creator.id ? (
                    "✓ Invited"
                  ) : (
                    <>
                      <Send className="w-3 h-3 mr-1.5" />
                      Invite
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredCreators.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-border p-8 max-w-lg mx-auto">
            <Users className="w-12 h-12 text-text-secondary mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-bold text-primary mb-1">No Creators Found</h3>
            <p className="text-xs text-text-secondary mb-6">
              Try resetting your filters or search keywords.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setNicheFilter("ALL");
                setTierFilter("ALL");
                setBrandFilter("ALL");
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
