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
import { fillFor } from "@/lib/fills";
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
          <h1 className="text-[44px] sm:text-6xl type-display leading-[0.95] text-primary">
            Open brand briefs
          </h1>
          <p className="mt-3 text-base sm:text-lg leading-relaxed text-text-secondary">
            Live campaigns from brands Schbang manages. Pitch the ones that fit you, or like a brief so the
            Schbang team can see you&apos;re interested.
          </p>
        </div>

        <div className="mt-7 rounded-lg bg-surface p-3 sm:p-4 brut">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_240px] gap-3">
            <label className="relative block">
              <span className="sr-only">Search briefs</span>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search a brand, niche or keyword"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-md bg-surface text-[16px] font-semibold text-primary brut-well placeholder:text-text-secondary focus:outline-none focus-visible:outline-none focus-visible:bg-[#FFFCEB] focus-visible:shadow-[3px_3px_0_0_#111]"
              />
            </label>
            <label className="block">
              <span className="sr-only">Industry</span>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full h-12 px-4 rounded-md bg-surface text-[15px] font-bold text-primary brut-well cursor-pointer focus:outline-none focus-visible:outline-none focus-visible:bg-[#FFFCEB] focus-visible:shadow-[3px_3px_0_0_#111]"
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
                  className={`brut-press shrink-0 min-h-11 px-4 rounded-full text-sm font-extrabold ${
                    active ? "bg-ink text-white brut-sm" : "bg-surface text-primary brut-sm"
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
          <p className="text-base font-bold text-text-secondary">
            <strong className="font-mono text-primary text-lg font-bold">{filteredBrands.length}</strong>{" "}
            {filteredBrands.length === 1 ? "brief" : "briefs"} open
          </p>
          {filtersActive && (
            <button onClick={resetFilters} className="text-sm font-extrabold text-primary underline decoration-2 underline-offset-4 hover:decoration-action">
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
                    className={`brut-press flex items-center gap-1.5 min-h-10 px-3 rounded-md text-sm font-extrabold brut-sm cursor-pointer ${isLiked ? "bg-ink text-white" : "bg-surface text-primary"}`}
                    title={isLiked ? "Remove interest" : "Show interest in this brief"}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-fill-rose text-fill-rose" : ""}`} aria-hidden="true" />
                    <span className="font-mono text-[13px]">{brand.likesCount}</span>
                    <span className="sr-only">{isLiked ? "Liked" : "Like"} {brand.name}</span>
                  </button>
                }
              />
            );
          })}
        </Reveal>

        {filteredBrands.length === 0 && (
          <div className="text-center py-14 px-8 max-w-md mx-auto rounded-lg bg-surface brut">
            <span className="w-14 h-14 mx-auto mb-4 rounded-md bg-fill-lilac border-2 border-ink grid place-items-center">
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
            <div className="w-full sm:w-[34rem] max-h-[92dvh] sm:max-h-none rounded-t-5xl sm:rounded-5xl overflow-hidden bg-surface brut flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-right duration-300">
              <div className={`p-5 border-b-2 border-ink ${fillFor(selectedBrand.slug)}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 id="brief-sheet-title" className="text-[52px] type-display leading-[0.9] text-primary">
                      {selectedBrand.name}
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-text-secondary">
                      {selectedBrand.industry} · {selectedBrand.budgetTier} creators · managed by Schbang
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className="brut-press shrink-0 w-10 h-10 grid place-items-center rounded-md bg-surface text-primary brut-sm"
                    aria-label="Close brief"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => handleToggleLike(selectedBrand.id, selectedBrand.name)}
                  aria-pressed={!!likedBrandIds[selectedBrand.id]}
                  className={`brut-press mt-4 inline-flex items-center gap-2 min-h-10 px-3.5 rounded-md text-sm font-extrabold brut-sm ${likedBrandIds[selectedBrand.id] ? "bg-ink text-white" : "bg-surface text-primary"}`}
                >
                  <Heart className={`w-4 h-4 ${likedBrandIds[selectedBrand.id] ? "fill-fill-rose text-fill-rose" : ""}`} aria-hidden="true" />
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
                    <p className="text-[15px] text-primary/85 leading-relaxed rounded-3xl bg-background px-4 py-3 brut-well">
                      {selectedBrand.requirements}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-extrabold text-primary mb-2.5">Deliverables</h3>
                  <ul className="flex flex-wrap gap-2">
                    {selectedBrand.campaignTypes.map((item) => (
                      <li key={item} className="px-3.5 py-1.25 rounded-full bg-fill-butter text-sm font-bold text-primary brut-sm">
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
