"use client";

import { useState, useEffect, useCallback } from "react";
import { Reveal } from "cube-motion/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { BriefCard } from "@/components/brands/brief-card";
import { useToast } from "@/components/ui/toast";
import { INITIAL_BRANDS, BrandItem } from "@/lib/mock-data";
import { getUserData, toggleLike as toggleLikeStore } from "@/lib/user-store";
import {
  Search,
  X,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Layers,
  Award,
  Heart,
  Users,
} from "lucide-react";

export default function BrandsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [brands, setBrands] = useState<BrandItem[]>(INITIAL_BRANDS);
  const [likedBrandIds, setLikedBrandIds] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("ALL");
  const [budgetFilter, setBudgetFilter] = useState("ALL");
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      const data = getUserData(session.user.email);
      const likesRecord: Record<string, boolean> = {};
      data.likedBrandIds.forEach(id => {
        likesRecord[id] = true;
      });
      setLikedBrandIds(likesRecord);
    } else {
      setLikedBrandIds({});
    }
  }, [session]);

  const handleToggleLike = useCallback((brandId: string, brandName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!session?.user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to express interest in brands.",
        type: "error",
      });
      return;
    }

    const email = session.user.email;
    const isLiked = toggleLikeStore(email, brandId);

    setLikedBrandIds((prev) => ({ ...prev, [brandId]: isLiked }));

    setBrands((prevBrands) =>
      prevBrands.map((b) =>
        b.id === brandId
          ? { ...b, likesCount: b.likesCount + (isLiked ? 1 : -1) }
          : b
      )
    );

    if (selectedBrand && selectedBrand.id === brandId) {
      setSelectedBrand((prev) =>
        prev
          ? { ...prev, likesCount: prev.likesCount + (isLiked ? 1 : -1) }
          : null
      );
    }

    if (isLiked) {
      toast({
        title: `Interest sent to ${brandName}`,
        description: "The Schbang brand team can now see your profile for direct outreach.",
        type: "success",
      });
    } else {
      toast({
        title: `Removed Interest in ${brandName}`,
        description: "You have unbookmarked this brand brief.",
        type: "info",
      });
    }
  }, [session, selectedBrand, toast]);

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

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedBrand]);

  const filteredBrands = brands.filter((brand) => {
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
    <div className="min-h-screen pb-20">
      <div className="bg-ink text-white pt-8 pb-12 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              Open brand briefs
            </h1>
            <p className="text-white/70 text-base leading-relaxed">
              Browse partnership briefs from marquee brands managed by Schbang. Like/Express interest to appear on the brand manager&apos;s direct outreach list, or click to apply.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-3 bg-surface/5 p-3 rounded-2xl border border-white/15 backdrop-blur-md">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search by brand name, keywords, or niche..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface/10 text-white placeholder:text-white/40 pl-10 pr-4 py-2.5 rounded-xl text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>

            <div>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full bg-surface/10 text-white py-2.5 px-3.5 rounded-xl text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
              >
                <option value="ALL" className="bg-ink text-white">All Industries</option>
                <option value="Food" className="bg-ink text-white">Food & FMCG</option>
                <option value="Lifestyle" className="bg-ink text-white">Lifestyle & DIY</option>
                <option value="Beauty" className="bg-ink text-white">Beauty & Skincare</option>
                <option value="Finance" className="bg-ink text-white">Finance & FinTech</option>
                <option value="Fashion" className="bg-ink text-white">Fashion & E-Commerce</option>
              </select>
            </div>

            <div>
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="w-full bg-surface/10 text-white py-2.5 px-3.5 rounded-xl text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
              >
                <option value="ALL" className="bg-ink text-white">All Budget Tiers</option>
                <option value="Nano" className="bg-ink text-white">Nano Tier (&lt;10k)</option>
                <option value="Micro" className="bg-ink text-white">Micro Tier (10k-100k)</option>
                <option value="Mid-Tier" className="bg-ink text-white">Mid-Tier (100k-500k)</option>
                <option value="Macro" className="bg-ink text-white">Macro Tier (500k-1M)</option>
                <option value="Mega" className="bg-ink text-white">Mega Tier (1M+)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-text-secondary">
              Showing <strong className="text-primary">{filteredBrands.length}</strong> available brand briefs
            </p>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-semibold flex items-center gap-1">
              <Users className="w-3 h-3" />
              Creator Express Interest Active
            </span>
          </div>

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

        <Reveal
          key={filteredBrands.map((b) => b.id).join(",")}
          targets="children"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredBrands.map((brand) => {
            const isLiked = !!likedBrandIds[brand.id];

            return (
              <BriefCard
                key={brand.id}
                brand={brand}
                onSelect={() => setSelectedBrand(brand)}
                action={
                  <button
                    type="button"
                    onClick={(e) => handleToggleLike(brand.id, brand.name, e)}
                    aria-pressed={isLiked}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur transition-all duration-200 active:scale-90 cursor-pointer ${
                      isLiked ? "bg-accent text-white" : "bg-surface/85 text-primary hover:bg-surface"
                    }`}
                    title={isLiked ? "Remove interest" : "Express interest in this brief"}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-white" : ""}`} aria-hidden="true" />
                    <span>{brand.likesCount}</span>
                    <span className="sr-only">{isLiked ? "Liked" : "Like"} {brand.name}</span>
                  </button>
                }
              />
            );
          })}
        </Reveal>

        {filteredBrands.length === 0 && (
          <div className="text-center py-20 bg-surface rounded-3xl border border-border p-8 max-w-lg mx-auto">
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

      {selectedBrand && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setSelectedBrand(null)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-surface shadow-2xl border-l border-border flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-5 border-b border-border flex items-center justify-between bg-muted/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    Campaign Brief
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                    {selectedBrand.industry}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleLike(selectedBrand.id, selectedBrand.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      likedBrandIds[selectedBrand.id]
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-surface text-text-secondary border-border hover:border-red-400 hover:text-red-500"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedBrandIds[selectedBrand.id] ? "fill-white" : ""}`} />
                    <span>{selectedBrand.likesCount} Expressed Interest</span>
                  </button>

                  <button
                    onClick={() => setSelectedBrand(null)}
                    className="p-1.5 rounded-xl text-text-secondary hover:text-primary hover:bg-border transition-colors"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="relative rounded-2xl overflow-hidden border border-border">
                  <div className="h-36 bg-muted">
                    <img
                      src={selectedBrand.coverImage}
                      alt={selectedBrand.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 bg-surface flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedBrand.logo}
                        alt={selectedBrand.name}
                        className="w-14 h-14 rounded-2xl border-2 border-surface shadow-md object-cover -mt-8 bg-surface"
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

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-accent" />
                    Campaign Overview
                  </h3>
                  <p className="text-sm text-text-primary leading-relaxed bg-muted p-4 rounded-xl border border-border">
                    {selectedBrand.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Creator Requirements &amp; Eligibility
                  </h3>
                  <div className="bg-emerald-50/50 border border-emerald-200/60 p-4 rounded-xl text-xs text-emerald-950 leading-relaxed font-medium space-y-1.5">
                    <p>{selectedBrand.requirements}</p>
                    <p className="text-[11px] text-emerald-700">
                      Open to verified Instagram, YouTube and Facebook profiles.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2.5">
                    Deliverables Requested
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedBrand.campaignTypes.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-border bg-muted flex items-center gap-2 text-xs font-semibold text-primary"
                      >
                        <span className="w-2 h-2 rounded-full bg-accent" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

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

              <div className="p-5 border-t border-border bg-muted flex items-center justify-between gap-4">
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
