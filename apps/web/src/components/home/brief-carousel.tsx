"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import type { BrandItem } from "@/lib/mock-data";
import { tintFor } from "@/lib/tints";
import { cn } from "@/lib/utils";

/**
 * Every open brief as a photo card in one swipeable row — the brief's cover
 * photo says what the campaign is about before a word is read. Replaces the
 * hero tiles and the separate "Open right now" grid, which showed the same
 * briefs twice. Cover photos are category imagery, not the brands' marks.
 */
export function BriefCarousel({ briefs }: { briefs: BrandItem[] }) {
  const track = useRef<HTMLUListElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 16), behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-[-0.03em] text-primary">Open right now</h2>
        <div className="flex items-center gap-2">
          <Link
            href="/brands"
            className="inline-flex items-center gap-1.5 min-h-10 px-4 rounded-full bg-surface text-[14px] font-semibold text-primary shadow-card hover:shadow-lift transition-shadow"
          >
            See all {briefs.length}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="press hidden sm:grid w-10 h-10 place-items-center rounded-full bg-surface text-primary shadow-card hover:shadow-lift"
            aria-label="Previous briefs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="press hidden sm:grid w-10 h-10 place-items-center rounded-full bg-surface text-primary shadow-card hover:shadow-lift"
            aria-label="Next briefs"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        className="mt-5 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {briefs.map((brand) => (
          <li key={brand.id} className="w-[80%] shrink-0 snap-start sm:w-[320px] lg:w-[calc((100%-48px)/4)]">
            <Link
              href={`/brands/${brand.slug}`}
              className="press group flex h-full flex-col overflow-hidden rounded-4xl bg-surface shadow-card transition-shadow hover:shadow-lift"
            >
              <span className={cn("relative block aspect-[4/3] overflow-hidden", tintFor(brand.slug))}>
                {brand.coverImage ? (
                  <img
                    src={brand.coverImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <span className="grid h-full place-items-center text-[64px] font-semibold text-primary/70">{brand.name[0]}</span>
                )}
                <span className="absolute left-3 top-3 px-2.5 py-1 rounded-full bg-surface/95 text-[12.5px] font-semibold text-primary">
                  {brand.budgetTier} creators
                </span>
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface/95 text-[12.5px] font-medium text-primary">
                  <Heart className="w-3.5 h-3.5" aria-hidden="true" />
                  {brand.likesCount}
                </span>
              </span>
              <span className="flex flex-1 flex-col p-4 sm:p-5">
                <span className="flex items-center gap-3">
                  <span
                    className={cn("w-10 h-10 shrink-0 rounded-xl grid place-items-center font-semibold text-primary", tintFor(brand.slug))}
                    aria-hidden="true"
                  >
                    {brand.name[0]}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[17px] font-semibold leading-tight text-primary">{brand.name}</span>
                    <span className="block truncate text-[13px] text-text-secondary">{brand.industry}</span>
                  </span>
                </span>
                <span className="mt-4 flex items-center justify-between gap-3">
                  <span className="truncate text-[13px] text-text-secondary">
                    {brand.campaignTypes.slice(0, 2).join(" · ")}
                    {brand.campaignTypes.length > 2 ? ` +${brand.campaignTypes.length - 2}` : ""}
                  </span>
                  <span className="w-9 h-9 shrink-0 rounded-full bg-ink text-white grid place-items-center transition-colors group-hover:bg-marigold group-hover:text-ink">
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
