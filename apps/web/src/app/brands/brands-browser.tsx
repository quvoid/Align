"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { BriefRow } from "@/components/brands/brief-row";
import { Listbox } from "@/components/ui/listbox";
import { FREE_PITCHES, PLANS, formatINR } from "@/lib/plans";
import { useToast } from "@/components/ui/toast";
import type { BrandItem } from "@/lib/mock-data";
import { fetchMe, toggleLike } from "@/lib/user-store";
import { errorMessage } from "@/lib/fetch-json";
import {
  Search,
  X,
  ArrowRight,
  ExternalLink,
  Layers,
  Heart,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

const TIER_OPTIONS = ["Nano", "Micro", "Mid-Tier", "Macro", "Mega"];
/** Shortcut chips under the search: each one ticks every industry containing the word. */
const QUICK_INDUSTRIES = ["Food", "Fashion", "Finance", "Lifestyle"];

/** The interactive half of /brands; page.tsx loads the open briefs. */
export function BrandsBrowser({ initialBrands }: { initialBrands: BrandItem[] }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [brands, setBrands] = useState<BrandItem[]>(initialBrands);
  const [likedBrandIds, setLikedBrandIds] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);
  const [tiers, setTiers] = useState<string[]>([]);
  const [sort, setSort] = useState<"interest" | "az">("interest");
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null);

  // The home page hero searches straight into this list (?search=, ?industry=).
  // Read on mount rather than with useSearchParams, so the page stays static.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const term = params.get("search");
    const industry = params.get("industry");
    if (term) setSearch(term);
    if (industry) setIndustries(initialBrands.map((b) => b.industry).filter((i, n, all) => i.includes(industry) && all.indexOf(i) === n));
  }, [initialBrands]);

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

  const industryOptions = Array.from(new Set(brands.map((b) => b.industry))).sort();
  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const q = search.trim().toLowerCase();
  const filteredBrands = brands
    .filter((brand) => {
      const matchesSearch =
        !q ||
        [brand.name, brand.description, brand.industry, ...brand.campaignTypes].some((t) => t.toLowerCase().includes(q));
      const matchesIndustry = industries.length === 0 || industries.includes(brand.industry);
      const matchesTier = tiers.length === 0 || tiers.includes(brand.budgetTier);
      return matchesSearch && matchesIndustry && matchesTier;
    })
    .sort((a, b) => (sort === "az" ? a.name.localeCompare(b.name) : b.likesCount - a.likesCount));

  const activeFilterCount = industries.length + tiers.length;
  const filtersActive = !!q || activeFilterCount > 0;
  const resetFilters = () => {
    setSearch("");
    setIndustries([]);
    setTiers([]);
  };

  // Rendered twice (phone <details>, desktop sidebar); labels wrap their
  // inputs so the two copies never share an id.
  const filterPanel = (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-[13px] font-medium text-text-secondary">Industry</legend>
        <ul className="space-y-1">
          {industryOptions.map((industry) => {
            const count = brands.filter((b) => b.industry === industry).length;
            return (
              <li key={industry}>
                <label className="flex items-center gap-3 min-h-9 cursor-pointer text-[15px] text-primary">
                  <input
                    type="checkbox"
                    checked={industries.includes(industry)}
                    onChange={() => setIndustries((prev) => toggle(prev, industry))}
                    className="w-4 h-4 accent-[#17150F] cursor-pointer"
                  />
                  <span className="flex-1">{industry}</span>
                  <span className="text-[13px] tabular-nums text-text-secondary">{count}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-[13px] font-medium text-text-secondary">Creator tier</legend>
        <ul className="space-y-1">
          {TIER_OPTIONS.map((tier) => {
            const count = brands.filter((b) => b.budgetTier === tier).length;
            return (
              <li key={tier}>
                <label className={`flex items-center gap-3 min-h-9 text-[15px] ${count ? "cursor-pointer text-primary" : "text-text-secondary"}`}>
                  <input
                    type="checkbox"
                    checked={tiers.includes(tier)}
                    disabled={count === 0}
                    onChange={() => setTiers((prev) => toggle(prev, tier))}
                    className="w-4 h-4 accent-[#17150F] cursor-pointer disabled:cursor-not-allowed"
                  />
                  <span className="flex-1">{tier}</span>
                  <span className="text-[13px] tabular-nums text-text-secondary">{count}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      <section className="container mx-auto px-4 pt-6 sm:pt-8">
        <div className="grid gap-10 rounded-5xl bg-surface px-5 py-8 sm:px-10 sm:py-12 shadow-card lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
          <div>
          <h1 className="text-[40px] sm:text-[56px] font-semibold tracking-[-0.04em] leading-[1.02] text-primary">
            Open brand briefs
          </h1>
          <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-text-secondary">
            Live campaigns from brands Schbang manages. Pitch the ones that fit you, or tap the heart so the
            team knows you&apos;re interested.
          </p>

          <label className="mt-7 flex max-w-2xl items-center gap-3 h-14 rounded-full bg-muted pl-5 pr-2 transition-[box-shadow,background-color] duration-200 focus-within:bg-surface focus-within:shadow-[0_0_0_1px_var(--color-border),0_12px_28px_-18px_rgb(23_21_15/0.35)]">
            <Search className="w-5 h-5 shrink-0 text-text-secondary" aria-hidden="true" />
            <span className="sr-only">Search briefs</span>
            <input
              type="search"
              placeholder="Search a brand, niche or format"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-[16px] text-primary outline-none placeholder:text-text-secondary [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="w-10 h-10 shrink-0 grid place-items-center rounded-full text-text-secondary hover:bg-surface hover:text-primary"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </label>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[14px]">
            <span className="text-text-secondary">Popular:</span>
            {QUICK_INDUSTRIES.map((word) => {
              const matching = industryOptions.filter((i) => i.includes(word));
              const on = matching.length > 0 && matching.every((i) => industries.includes(i));
              return (
                <button
                  key={word}
                  type="button"
                  aria-pressed={on}
                  disabled={matching.length === 0}
                  onClick={() =>
                    setIndustries((prev) =>
                      on ? prev.filter((i) => !matching.includes(i)) : Array.from(new Set([...prev, ...matching]))
                    )
                  }
                  className={`press min-h-9 px-3.5 rounded-full font-medium disabled:opacity-40 ${
                    on ? "bg-ink text-white" : "bg-muted text-primary hover:bg-[#E6E1D6]"
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
          </div>

          <ol className="hidden lg:block rounded-4xl bg-muted p-6" aria-label="How pitching works">
            {[
              ["Pick a brief", "Read what the brand wants and who it's for."],
              ["Send your pitch", "Your idea, formats, numbers and rate."],
              ["Follow the decision", "A person at Schbang replies on your dashboard."],
            ].map(([title, body], i) => (
              <li key={title} className="flex gap-3.5 py-3 first:pt-0 last:pb-0">
                <span className="w-7 h-7 shrink-0 rounded-full bg-surface grid place-items-center text-[13px] font-semibold text-marigold-ink">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-[15px] font-semibold text-primary">{title}</span>
                  <span className="block text-[13.5px] leading-snug text-text-secondary">{body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container mx-auto px-4 pt-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] items-start">
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[15px] text-text-secondary" aria-live="polite">
                Showing <strong className="font-semibold text-primary">{filteredBrands.length}</strong> of {brands.length}{" "}
                {brands.length === 1 ? "brief" : "briefs"}
                {filtersActive && (
                  <button onClick={resetFilters} className="ml-3 font-medium text-primary underline underline-offset-4 decoration-border hover:decoration-primary">
                    Clear filters
                  </button>
                )}
              </p>
              <Listbox
                label="Sort"
                value={sort}
                onChange={setSort}
                options={[
                  { value: "interest", label: "Most interest" },
                  { value: "az", label: "Brand A–Z" },
                ]}
              />
            </div>

            <details className="lg:hidden mb-4 rounded-4xl bg-surface shadow-card [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between min-h-14 px-5 cursor-pointer text-[15px] font-semibold text-primary">
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="min-w-5 h-5 px-1.5 grid place-items-center rounded-full bg-marigold text-ink text-[12px] font-semibold">
                      {activeFilterCount}
                    </span>
                  )}
                </span>
                <ChevronDown className="w-4 h-4 text-text-secondary" aria-hidden="true" />
              </summary>
              <div className="px-5 pb-5">{filterPanel}</div>
            </details>

            {filteredBrands.length > 0 ? (
              <ul className="grid gap-4">
                {filteredBrands.map((brand) => (
                  <BriefRow
                    key={brand.id}
                    brand={brand}
                    liked={!!likedBrandIds[brand.id]}
                    onLike={(e) => handleToggleLike(brand.id, brand.name, e)}
                    onSelect={() => setSelectedBrand(brand)}
                  />
                ))}
              </ul>
            ) : (
              <div className="rounded-4xl bg-surface px-8 py-14 text-center shadow-card">
                <span className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-muted grid place-items-center">
                  <Layers className="w-5 h-5 text-text-secondary" aria-hidden="true" />
                </span>
                <h2 className="text-lg font-semibold text-primary">No briefs match that</h2>
                <p className="mt-1 mb-6 text-[15px] text-text-secondary">Try another word, or clear the filters.</p>
                <Button variant="outline" size="md" onClick={resetFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>

          <aside className="hidden lg:block lg:sticky lg:top-24 space-y-4" aria-label="Filters">
            <div className="rounded-4xl bg-surface p-6 shadow-card">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[17px] font-semibold text-primary">Filters</h2>
                {activeFilterCount > 0 && (
                  <button onClick={() => { setIndustries([]); setTiers([]); }} className="text-[14px] font-medium text-text-secondary hover:text-primary">
                    Reset
                  </button>
                )}
              </div>
              {filterPanel}
            </div>
            <div className="rounded-4xl bg-ink p-6 text-white">
              <p className="text-[17px] font-semibold">{FREE_PITCHES} free pitches</p>
              <p className="mt-1 text-[14px] leading-relaxed text-white/70">
                Then {formatINR(PLANS.all_access.price)} once for every brief, or {formatINR(PLANS.monthly.price)} a month.
              </p>
              <Link
                href="/pricing"
                className="press mt-5 inline-flex items-center gap-1.5 min-h-10 px-4 rounded-full bg-marigold text-ink text-[14px] font-semibold"
              >
                See plans
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {selectedBrand && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="brief-sheet-title">
          <div
            className="fixed inset-0 bg-ink/45 animate-in fade-in duration-300"
            onClick={() => setSelectedBrand(null)}
            aria-hidden="true"
          />

          <div className="fixed inset-x-0 bottom-0 sm:inset-y-3 sm:right-3 sm:left-auto flex sm:pl-10">
            <div className="w-full sm:w-[34rem] max-h-[92dvh] sm:max-h-none rounded-t-5xl sm:rounded-5xl bg-surface shadow-card flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-right duration-300">
              <div className="p-6 border-b border-border">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 id="brief-sheet-title" className="text-[28px] font-semibold tracking-tight leading-tight text-primary">
                      {selectedBrand.name}
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-text-secondary">
                      {selectedBrand.industry} · {selectedBrand.budgetTier} creators · managed by Schbang
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className="press shrink-0 w-10 h-10 grid place-items-center rounded-full bg-muted text-primary"
                    aria-label="Close brief"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => handleToggleLike(selectedBrand.id, selectedBrand.name)}
                  aria-pressed={!!likedBrandIds[selectedBrand.id]}
                  className={`press mt-4 inline-flex items-center gap-2 min-h-10 px-4 rounded-full text-sm font-medium ${likedBrandIds[selectedBrand.id] ? "bg-marigold-soft text-marigold-ink" : "bg-muted text-primary"}`}
                >
                  <Heart className={`w-4 h-4 ${likedBrandIds[selectedBrand.id] ? "fill-current" : ""}`} aria-hidden="true" />
                  {likedBrandIds[selectedBrand.id] ? "You're interested" : "I'm interested"} · {selectedBrand.likesCount}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1.5">What the brand wants</h3>
                  <p className="text-[15px] text-primary/85 leading-relaxed">{selectedBrand.description}</p>
                </div>

                {selectedBrand.requirements && (
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-1.5">Who can pitch</h3>
                    <p className="text-[15px] text-primary/85 leading-relaxed rounded-3xl bg-background px-4 py-3 shadow-field">
                      {selectedBrand.requirements}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2.5">Deliverables</h3>
                  <ul className="flex flex-wrap gap-2">
                    {selectedBrand.campaignTypes.map((item) => (
                      <li key={item} className="px-3 py-1 rounded-full bg-muted text-[13px] font-medium text-primary">
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
