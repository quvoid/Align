"use client";

import { useState, useEffect, useCallback } from "react";
import { Reveal } from "cube-motion/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { BriefCard } from "@/components/brands/brief-card";
import { useToast } from "@/components/ui/toast";
import type { BrandItem } from "@/lib/mock-data";
import { fetchMe, toggleLike } from "@/lib/user-store";
import { errorMessage } from "@/lib/fetch-json";
import { clayFillFor } from "@/lib/clay";
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

/** The interactive half of /brands; page.tsx loads the open briefs. */
export function BrandsBrowser({ initialBrands }: { initialBrands: BrandItem[] }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [brands, setBrands] = useState<BrandItem[]>(initialBrands);
  const [likedBrandIds, setLikedBrandIds] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("ALL");
  const [budgetFilter, setBudgetFilter] = useState("ALL");
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null);

  const email = session?.user?.email;
  const isCreator = session?.user?.role === "CREATOR";
  useEffect(() => {
    if (!email || !isCreator) {
      setLikedBrandIds({});
      return;
    }
    let cancelled = false;
    fetchMe()
      .then((me) => {
        if (!cancelled) setLikedBrandIds(Object.fromEntries(me.likedBrandIds.map((id) => [id, true])));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [email, isCreator]);

  const handleToggleLike = useCallback(async (brandId: string, brandName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!email) {
      toast({
        title: "Sign in to save briefs",
        description: "Liked briefs show the Schbang team you're interested.",
        type: "error",
      });
      return;
    }

    let result: { liked: boolean; likesCount: number };
    try {
      result = await toggleLike(brandId);
    } catch (err) {
      toast({ title: "Couldn't update your like", description: errorMessage(err), type: "error" });
      return;
    }
    const { liked: isLiked, likesCount } = result;

    setLikedBrandIds((prev) => ({ ...prev, [brandId]: isLiked }));
    setBrands((prevBrands) => prevBrands.map((b) => (b.id === brandId ? { ...b, likesCount } : b)));
    setSelectedBrand((prev) => (prev && prev.id === brandId ? { ...prev, likesCount } : prev));

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
  }, [email, toast]);

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

  const filtersActive = search || industryFilter !== "ALL" || budgetFilter !== "ALL";
  const resetFilters = () => {
    setSearch("");
    setIndustryFilter("ALL");
    setBudgetFilter("ALL");
  };

  return (
    <div className="min-h-screen pb-20">
      <section className="container mx-auto px-4 pt-8 sm:pt-12">
        <div className="max-w-2xl">
          <h1 className="text-[44px] sm:text-6xl font-extrabold tracking-tight leading-[0.95] text-primary">
            Open brand briefs
          </h1>
          <p className="mt-3 text-base sm:text-lg leading-relaxed text-text-secondary">
            Live campaigns from brands Schbang manages. Pitch the ones that fit you, or like a brief so the
            Schbang team can see you&apos;re interested.
          </p>
        </div>

        <div className="mt-7 rounded-4xl bg-surface p-3 sm:p-4 shadow-clay">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_240px] gap-3">
            <label className="relative block">
              <span className="sr-only">Search briefs</span>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search a brand, niche or keyword"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-12 pr-4 pt-1 rounded-2xl bg-background text-[15px] text-primary shadow-clay-well placeholder:text-text-secondary focus:outline-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/45"
              />
            </label>
            <label className="block">
              <span className="sr-only">Industry</span>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-background text-[15px] font-semibold text-primary shadow-clay-sm cursor-pointer focus:outline-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/45"
              >
                <option value="ALL">All industries</option>
                <option value="Food">Food &amp; FMCG</option>
                <option value="Lifestyle">Lifestyle &amp; DIY</option>
                <option value="Beauty">Beauty &amp; Skincare</option>
                <option value="Finance">Finance &amp; FinTech</option>
                <option value="Fashion">Fashion &amp; E-Commerce</option>
              </select>
            </label>
          </div>

          <div className="mt-3 -mx-1 px-1 py-1 flex gap-2.5 overflow-x-auto [scrollbar-width:none]" role="group" aria-label="Filter by creator tier">
            {["ALL", "Nano", "Micro", "Mid-Tier", "Macro", "Mega"].map((tier) => {
              const active = budgetFilter === tier;
              return (
                <button
                  key={tier}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setBudgetFilter(tier)}
                  className={`clay-press shrink-0 px-4 pt-2.5 pb-2 rounded-full text-sm font-bold ${
                    active ? "bg-accent text-white shadow-clay-btn" : "bg-background text-primary shadow-clay-sm"
                  }`}
                >
                  {tier === "ALL" ? "All tiers" : tier}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pt-10">
        <div className="flex items-baseline justify-between gap-4 mb-5">
          <p className="text-base font-semibold text-text-secondary">
            <strong className="text-primary text-xl font-extrabold">{filteredBrands.length}</strong>{" "}
            {filteredBrands.length === 1 ? "brief" : "briefs"} open
          </p>
          {filtersActive && (
            <button onClick={resetFilters} className="text-sm font-bold text-accent hover:underline underline-offset-4">
              Clear filters
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
                    className="clay-press flex items-center gap-1.5 px-3.5 pt-2 pb-1.5 rounded-full bg-surface text-sm font-extrabold text-primary shadow-clay-sm cursor-pointer"
                    title={isLiked ? "Remove interest" : "Show interest in this brief"}
                  >
                    <Heart className={`w-4 h-4 -mt-0.5 ${isLiked ? "fill-[#E8457A] text-[#E8457A]" : ""}`} aria-hidden="true" />
                    <span>{brand.likesCount}</span>
                    <span className="sr-only">{isLiked ? "Liked" : "Like"} {brand.name}</span>
                  </button>
                }
              />
            );
          })}
        </Reveal>

        {filteredBrands.length === 0 && (
          <div className="text-center py-14 px-8 max-w-md mx-auto rounded-4xl bg-surface shadow-clay">
            <span className="w-14 h-14 mx-auto mb-4 rounded-full bg-clay-lilac shadow-clay-sm grid place-items-center">
              <Layers className="w-6 h-6 text-primary" aria-hidden="true" />
            </span>
            <h3 className="text-xl font-extrabold text-primary mb-1">No briefs match that</h3>
            <p className="text-[15px] text-text-secondary mb-6">Try another keyword, or clear the industry and tier filters.</p>
            <Button variant="outline" size="md" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </section>

      {selectedBrand && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="brief-sheet-title">
          <div
            className="fixed inset-0 bg-ink/45 animate-in fade-in duration-300"
            onClick={() => setSelectedBrand(null)}
            aria-hidden="true"
          />

          <div className="fixed inset-x-0 bottom-0 sm:inset-y-3 sm:right-3 sm:left-auto flex sm:pl-10">
            <div className="w-full sm:w-[34rem] max-h-[92dvh] sm:max-h-none rounded-t-5xl sm:rounded-5xl bg-surface shadow-clay flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-right duration-300">
              <div className={`m-3 rounded-4xl p-5 shadow-clay ${clayFillFor(selectedBrand.slug)}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 id="brief-sheet-title" className="text-4xl font-extrabold tracking-tight leading-none text-primary">
                      {selectedBrand.name}
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-text-secondary">
                      {selectedBrand.industry} · {selectedBrand.budgetTier} creators · managed by Schbang
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className="clay-press shrink-0 w-10 h-10 grid place-items-center rounded-full bg-surface text-primary shadow-clay-sm"
                    aria-label="Close brief"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => handleToggleLike(selectedBrand.id, selectedBrand.name)}
                  aria-pressed={!!likedBrandIds[selectedBrand.id]}
                  className="clay-press mt-4 inline-flex items-center gap-2 px-4 pt-2 pb-1.5 rounded-full bg-surface text-sm font-bold text-primary shadow-clay-sm"
                >
                  <Heart className={`w-4 h-4 -mt-0.5 ${likedBrandIds[selectedBrand.id] ? "fill-[#E8457A] text-[#E8457A]" : ""}`} aria-hidden="true" />
                  {likedBrandIds[selectedBrand.id] ? "You're interested" : "I'm interested"} · {selectedBrand.likesCount}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-primary mb-1.5">What the brand wants</h3>
                  <p className="text-[15px] text-primary/85 leading-relaxed">{selectedBrand.description}</p>
                </div>

                {selectedBrand.requirements && (
                  <div>
                    <h3 className="text-lg font-extrabold text-primary mb-1.5">Who can pitch</h3>
                    <p className="text-[15px] text-primary/85 leading-relaxed rounded-3xl bg-background px-4 py-3 shadow-clay-well">
                      {selectedBrand.requirements}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-extrabold text-primary mb-2.5">Deliverables</h3>
                  <ul className="flex flex-wrap gap-2">
                    {selectedBrand.campaignTypes.map((item) => (
                      <li key={item} className="px-3.5 pt-1.5 pb-1 rounded-full bg-clay-butter text-sm font-bold text-primary shadow-clay-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-sm text-text-secondary space-y-1.5">
                  <div className="flex justify-between gap-4">
                    <span>Schbang contact</span>
                    <span className="font-semibold text-primary">{selectedBrand.contactEmail || "briefs@schbang.com"}</span>
                  </div>
                  {selectedBrand.website && (
                    <div className="flex justify-between gap-4">
                      <span>Brand website</span>
                      <a
                        href={selectedBrand.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent hover:underline flex items-center gap-1 font-semibold"
                      >
                        {selectedBrand.website.replace("https://", "")}
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-5 flex items-center gap-3">
                <Link href={`/brands/${selectedBrand.slug}`} className="shrink-0">
                  <Button variant="outline" size="lg">Full brief</Button>
                </Link>
                <Link href={`/apply/${selectedBrand.slug}`} className="flex-1">
                  <Button variant="accent" size="lg" className="w-full justify-between">
                    Pitch to this brief
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
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
