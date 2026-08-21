"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { INITIAL_CREATORS, INITIAL_BRANDS } from "@/lib/mock-data";
import {
  ArrowLeft,
  CheckCircle2,
  Instagram,
  Youtube,
  Star,
  TrendingUp,
  Briefcase,
  Send,
  Building2,
  MapPin,
  Clock,
  Eye,
  Percent,
  Award,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function CreatorProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { toast } = useToast();
  const creator = INITIAL_CREATORS.find((c) => c.id === resolvedParams.id);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState("britannia");
  const [offeredFee, setOfferedFee] = useState("45000");
  const [customMessage, setCustomMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!creator) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold text-primary mb-2">Creator Not Found</h1>
        <p className="text-text-secondary text-sm mb-6">This creator profile does not exist or has been made private.</p>
        <Link href="/creators">
          <Button variant="accent">Explore Verified Creators</Button>
        </Link>
      </div>
    );
  }

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setIsInviteModalOpen(false);
      toast({
        title: `🚀 Campaign Offer Sent to ${creator.name}!`,
        description: `Your campaign invitation of ₹${Number(offeredFee).toLocaleString()} has been dispatched to ${creator.email}.`,
        type: "success",
      });
    }, 700);
  };

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-border py-3">
        <div className="container mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-text-secondary">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/creators" className="hover:text-accent transition-colors">Creator Roster</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-primary">{creator.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-primary text-white py-12 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-24 h-24 rounded-3xl object-cover border-2 border-white shadow-xl bg-white"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center border-2 border-primary shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black">{creator.name}</h1>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-accent/20 text-accent border border-accent/30">
                    {creator.tier} Creator
                  </span>
                </div>
                <p className="text-accent font-semibold text-sm mt-0.5">{creator.handle}</p>
                <div className="flex items-center gap-3 text-xs text-white/70 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {creator.location}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                    Schbang Authenticated
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                variant="accent"
                size="lg"
                onClick={() => setIsInviteModalOpen(true)}
                className="w-full md:w-auto shadow-xl shadow-accent/25 py-6 px-8 text-sm font-bold"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Fast-Track Campaign Offer
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Performance Scorecard KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs">
            <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
              <span className="font-bold uppercase tracking-wider text-[10px]">Lifetime Reach</span>
              <Eye className="w-4 h-4 text-accent" />
            </div>
            <div className="text-3xl font-black text-primary">
              {creator.performance.totalReach}
            </div>
            <p className="text-[11px] text-text-secondary mt-1">Across all Schbang campaigns</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs">
            <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
              <span className="font-bold uppercase tracking-wider text-[10px]">Average ER Delivered</span>
              <Percent className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-3xl font-black text-green-600">
              {creator.performance.avgEngagementRate}
            </div>
            <p className="text-[11px] text-text-secondary mt-1">Verified audience interaction</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs">
            <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
              <span className="font-bold uppercase tracking-wider text-[10px]">Total Brand Collabs</span>
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-primary">
              {creator.performance.totalCampaigns}
            </div>
            <p className="text-[11px] text-text-secondary mt-1">Marquee brand briefs completed</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs">
            <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
              <span className="font-bold uppercase tracking-wider text-[10px]">Reliability &amp; Delivery</span>
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-600">
              {creator.performance.reliabilityScore} <span className="text-sm font-semibold text-text-secondary">/ 5.0</span>
            </div>
            <p className="text-[11px] text-text-secondary mt-1">{creator.performance.onTimeDelivery} on-time release record</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Brand Collaboration History Timeline */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent" />
                    Verified Brand Collaboration Track Record
                  </h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Historical campaign performance executed through Schbang brand accounts.
                  </p>
                </div>
              </div>

              {/* Collaboration Timeline List */}
              <div className="space-y-4">
                {creator.brandCollaborations.map((collab, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-border bg-gray-50/70 hover:bg-white hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={collab.brandLogo}
                          alt={collab.brandName}
                          className="w-12 h-12 rounded-xl object-cover border border-border bg-white"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-primary text-base">
                              {collab.brandName}
                            </h3>
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold">
                              {collab.deliverableType}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary font-medium mt-0.5">
                            {collab.campaignTitle}
                          </p>
                        </div>
                      </div>

                      {/* Performance KPIs for this specific campaign */}
                      <div className="flex items-center gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                        <div className="text-right sm:text-center">
                          <div className="text-xs text-text-secondary font-medium">Views Pulled</div>
                          <div className="font-black text-sm text-primary">{collab.viewsDelivered}</div>
                        </div>

                        <div className="text-right sm:text-center">
                          <div className="text-xs text-text-secondary font-medium">Delivered ER</div>
                          <div className="font-black text-sm text-green-600">{collab.engagementRate}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-text-secondary font-medium">Completed</div>
                          <div className="font-semibold text-xs text-text-primary">{collab.completedAt}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio & Content Style */}
            <div className="bg-white p-8 rounded-3xl border border-border">
              <h2 className="text-lg font-bold text-primary mb-3">About Creator &amp; Creative Style</h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                {creator.bio}
              </p>

              <div className="border-t border-border pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
                  Core Creator Niches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {creator.niche.map((n, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-gray-100 text-xs font-semibold text-primary"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Audience Demographics & Platforms */}
          <div className="space-y-6">
            {/* Social Platform Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-border shadow-xs">
              <h3 className="font-bold text-primary text-sm mb-4">Platform Reach</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-border">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <span>Instagram</span>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-sm text-primary">
                      {(creator.igFollowers / 1000).toFixed(0)}k Followers
                    </div>
                    <div className="text-[10px] font-bold text-green-600">
                      {creator.igEngagementRate}% Engagement
                    </div>
                  </div>
                </div>

                {creator.ytSubscribers && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-border">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary">
                      <Youtube className="w-4 h-4 text-red-600" />
                      <span>YouTube</span>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-sm text-primary">
                        {(creator.ytSubscribers / 1000).toFixed(0)}k Subscribers
                      </div>
                      <div className="text-[10px] text-text-secondary">
                        {creator.ytAvgViews} avg views
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Audience Demographics */}
            <div className="bg-white p-6 rounded-3xl border border-border shadow-xs">
              <h3 className="font-bold text-primary text-sm mb-4">Audience Demographics</h3>
              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-text-secondary font-medium block mb-1">Top Audience Geography:</span>
                  <div className="font-bold text-primary p-2.5 rounded-xl bg-gray-50 border border-border">
                    {creator.audienceDemographics.topCity}
                  </div>
                </div>

                <div>
                  <span className="text-text-secondary font-medium block mb-1">Age Distribution:</span>
                  <div className="font-bold text-primary p-2.5 rounded-xl bg-gray-50 border border-border">
                    {creator.audienceDemographics.topAgeBracket}
                  </div>
                </div>

                <div>
                  <span className="text-text-secondary font-medium block mb-1">Gender Split:</span>
                  <div className="font-bold text-primary p-2.5 rounded-xl bg-gray-50 border border-border">
                    {creator.audienceDemographics.genderRatio}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-gradient-to-br from-primary to-slate-900 text-white p-6 rounded-3xl shadow-lg">
              <h3 className="font-bold text-base mb-1">Ready to feature {creator.name}?</h3>
              <p className="text-xs text-white/70 mb-4 leading-relaxed">
                Send an official campaign brief invite directly to this creator with pre-approved budget terms.
              </p>
              <Button
                variant="accent"
                className="w-full font-bold shadow-lg shadow-accent/25"
                onClick={() => setIsInviteModalOpen(true)}
              >
                Send Fast-Track Offer &rarr;
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CAMPAIGN INVITATION MODAL                                */}
      {/* ======================================================== */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsInviteModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl z-10 border border-border animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-primary mb-1">
              Send Campaign Offer
            </h2>
            <p className="text-xs text-text-secondary mb-6">
              Invite <strong className="text-primary">{creator.name}</strong> ({creator.handle}) directly to collaborate with a Schbang brand brief.
            </p>

            <form onSubmit={handleSendOffer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                  Select Brand Campaign
                </label>
                <select
                  value={selectedBrandSlug}
                  onChange={(e) => setSelectedBrandSlug(e.target.value)}
                  className="w-full bg-gray-50 border border-border rounded-xl p-3 text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {INITIAL_BRANDS.map((brand) => (
                    <option key={brand.id} value={brand.slug}>
                      {brand.name} ({brand.industry} • {brand.budgetTier} Tier)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                  Proposed Creator Fee (₹)
                </label>
                <input
                  type="number"
                  value={offeredFee}
                  onChange={(e) => setOfferedFee(e.target.value)}
                  className="w-full bg-gray-50 border border-border rounded-xl p-3 text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                  Custom Pitch Message / Deliverables
                </label>
                <textarea
                  rows={3}
                  placeholder={`Hey ${creator.name}, we loved your past work with ${creator.brandCollaborations[0]?.brandName || "Schbang"} and want to feature you in our upcoming campaign...`}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-border rounded-xl p-3 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="accent"
                  type="submit"
                  isLoading={isSending}
                  className="shadow-lg shadow-accent/25 font-bold"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Dispatch Offer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
