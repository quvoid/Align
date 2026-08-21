"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { INITIAL_BRANDS, BrandItem } from "@/lib/mock-data";
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Share2,
} from "lucide-react";

export default function BrandsPage() {
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("ALL");
  const [budgetFilter, setBudgetFilter] = useState("ALL");
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedBrand(null);
    };
    if (selectedBrand) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBrand]);

  const filteredBrands = INITIAL_BRANDS.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(search.toLowerCase()) ||
      brand.description.toLowerCase().includes(search.toLowerCase()) ||
      brand.industry.toLowerCase().includes(search.toLowerCase());

    const matchesIndustry =
      industryFilter === "ALL" || brand.industry.includes(industryFilter);

    const matchesBudget =
      budgetFilter === "ALL" || brand.budgetTier === budgetFilter;

    return matchesSearch && matchesIndustry && matchesBudget;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Banner */}
      <div className="bg-primary text-white py-12 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Active Brand Opportunities</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              Explore Brand Briefs
            </h1>
            <p className="text-white/70 text-base leading-relaxed">
              Browse partnership briefs from marquee brands managed by Schbang. Click any card to preview campaign requirements and apply.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-3 bg-white/5 p-3 rounded-2xl border border-white/15 backdrop-blur-md">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search by brand name, keywords, or niche..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 text-white placeholder:text-white/40 pl-10 pr-4 py-2.5 rounded-xl text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>

            <div>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full bg-white/10 text-white py-2.5 px-3.5 rounded-xl text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white">All Industries</option>
                <option value="Food" className="bg-slate-900 text-white">Food & FMCG</option>
                <option value="Lifestyle" className="bg-slate-900 text-white">Lifestyle & DIY</option>
                <option value="Beauty" className="bg-slate-900 text-white">Beauty & Skincare</option>
                <option value="Finance" className="bg-slate-900 text-white">Finance & FinTech</option>
                <option value="Fashion" className="bg-slate-900 text-white">Fashion & Apparel</option>
              </select>
            </div>

            <div>
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="w-full bg-white/10 text-white py-2.5 px-3.5 rounded-xl text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white">All Budget Tiers</option>
                <option value="Nano" className="bg-slate-900 text-white">Nano Tier (&lt;10k)</option>
                <option value="Micro" className="bg-slate-900 text-white">Micro Tier (10k-100k)</option>
                <option value="Mid-Tier" className="bg-slate-900 text-white">Mid-Tier (100k-500k)</option>
                <option value="Macro" className="bg-slate-900 text-white">Macro Tier (500k-1M)</option>
                <option value="Mega" className="bg-slate-900 text-white">Mega Tier (1M+)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-text-secondary">
            Showing <strong className="text-primary">{filteredBrands.length}</strong> available brand briefs
          </p>
          {(search || industryFilter !== "ALL" || budgetFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setIndustryFilter("ALL");
                setBudgetFilter("ALL");
              }}
              className="text-xs font-semibold text-accent hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => setSelectedBrand(brand)}
              className="group cursor-pointer bg-white rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:border-accent/40 transform hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative"
            >
              {/* Cover Banner with Badge */}
              <div className="h-44 relative bg-gray-100 overflow-hidden">
                <img
                  src={brand.coverImage}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Budget Pill */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider border border-white/20">
                  {brand.budgetTier} Tier
                </div>

                {/* Industry Tag */}
                <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span>{brand.industry}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-12 h-12 rounded-xl border border-border object-cover bg-white shadow-sm"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-primary group-hover:text-accent transition-colors">
                        {brand.name}
                      </h3>
                      <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                        Schbang Account
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {brand.description}
                  </p>
                </div>

                {/* Deliverables Tags */}
                <div className="pt-3 border-t border-border/80">
                  <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">
                    Open Deliverables
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {brand.campaignTypes.slice(0, 2).map((type, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md bg-gray-100 text-[11px] font-medium text-text-secondary"
                      >
                        {type}
                      </span>
                    ))}
                    {brand.campaignTypes.length > 2 && (
                      <span className="px-2 py-0.5 rounded-md bg-accent/10 text-[11px] font-bold text-accent">
                        +{brand.campaignTypes.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-accent group-hover:translate-x-1 transition-transform">
                  <span>Quick View Brief</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBrands.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-border p-8 max-w-lg mx-auto">
            <Layers className="w-12 h-12 text-text-secondary mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-bold text-primary mb-1">No Brand Briefs Found</h3>
            <p className="text-xs text-text-secondary mb-6">
              Try adjusting your keyword search or clear your industry/budget filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setIndustryFilter("ALL");
                setBudgetFilter("ALL");
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SLIDE-OVER BRIEF DRAWER                                  */}
      {/* ======================================================== */}
      {selectedBrand && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setSelectedBrand(null)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-border flex flex-col animate-in slide-in-from-right duration-300">
              {/* Drawer Top Bar */}
              <div className="p-5 border-b border-border flex items-center justify-between bg-gray-50/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    Campaign Brief
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                    {selectedBrand.industry}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedBrand(null)}
                  className="p-1.5 rounded-xl text-text-secondary hover:text-primary hover:bg-gray-200 transition-colors"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Hero Header */}
                <div className="relative rounded-2xl overflow-hidden border border-border">
                  <div className="h-36 bg-gray-100">
                    <img
                      src={selectedBrand.coverImage}
                      alt={selectedBrand.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 bg-white flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedBrand.logo}
                        alt={selectedBrand.name}
                        className="w-14 h-14 rounded-2xl border-2 border-white shadow-md object-cover -mt-8 bg-white"
                      />
                      <div>
                        <h2 className="text-xl font-extrabold text-primary">
                          {selectedBrand.name}
                        </h2>
                        <p className="text-xs text-text-secondary font-medium">
                          Managed by Schbang Influencer Wing
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
                      {selectedBrand.budgetTier} Tier
                    </span>
                  </div>
                </div>

                {/* About the Campaign */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-accent" />
                    Campaign Overview
                  </h3>
                  <p className="text-sm text-text-primary leading-relaxed bg-gray-50 p-4 rounded-xl border border-border">
                    {selectedBrand.description}
                  </p>
                </div>

                {/* Creator Requirements */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Creator Requirements &amp; Eligibility
                  </h3>
                  <div className="bg-emerald-50/50 border border-emerald-200/60 p-4 rounded-xl text-xs text-emerald-950 leading-relaxed font-medium space-y-1.5">
                    <p>{selectedBrand.requirements}</p>
                    <p className="text-[11px] text-emerald-700">
                      ✓ Open to Instagram, YouTube, and Facebook verified profiles.
                    </p>
                  </div>
                </div>

                {/* Open Deliverables */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2.5">
                    Deliverables Requested
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedBrand.campaignTypes.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-border bg-gray-50 flex items-center gap-2 text-xs font-semibold text-primary"
                      >
                        <span className="w-2 h-2 rounded-full bg-accent" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brand Contact & Official Site */}
                <div className="text-xs text-text-secondary border-t border-border pt-4 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Agency Coordination:</span>
                    <span className="font-semibold text-primary">
                      {selectedBrand.contactEmail || "briefs@schbang.com"}
                    </span>
                  </div>
                  {selectedBrand.website && (
                    <div className="flex justify-between">
                      <span>Official Website:</span>
                      <a
                        href={selectedBrand.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent hover:underline flex items-center gap-1 font-semibold"
                      >
                        {selectedBrand.website.replace("https://", "")}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Sticky Footer CTA */}
              <div className="p-5 border-t border-border bg-gray-50 flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedBrand(null)}
                >
                  Close
                </Button>

                <Link
                  href={`/apply/${selectedBrand.slug}`}
                  className="flex-1"
                >
                  <Button
                    variant="accent"
                    className="w-full shadow-lg shadow-accent/25 py-5 text-sm font-bold"
                  >
                    Apply for this Campaign
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
