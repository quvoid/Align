import { ArrowRight, Heart, Video } from "lucide-react";
import type { BrandItem } from "@/lib/mock-data";
import { tintFor } from "@/lib/tints";
import { cn } from "@/lib/utils";

interface BriefRowProps {
  brand: BrandItem;
  liked: boolean;
  onLike: (e: React.MouseEvent) => void;
  onSelect: () => void;
}

/**
 * One brief in the /brands list, laid out like a job-board listing: avatar and
 * name, the brief, its formats, and a footer with interest and the action.
 * The whole card opens the quick view (the name is the real button, stretched
 * over the card); the like button sits above it.
 */
export function BriefRow({ brand, liked, onLike, onSelect }: BriefRowProps) {
  return (
    <li>
      <article className="group relative rounded-4xl bg-surface p-5 sm:p-6 shadow-card transition-shadow duration-300 hover:shadow-lift has-[:focus-visible]:shadow-[0_0_0_2px_var(--color-marigold)]">
        <div className="flex items-start gap-4 pr-24">
          <span
            className={cn("w-12 h-12 shrink-0 rounded-2xl grid place-items-center text-lg font-semibold text-primary", tintFor(brand.slug))}
            aria-hidden="true"
          >
            {brand.name[0]}
          </span>
          <div className="min-w-0">
            <h2 className="text-[19px] font-semibold tracking-[-0.02em] leading-tight text-primary">
              <button
                type="button"
                onClick={onSelect}
                className="text-left cursor-pointer outline-none after:absolute after:inset-0 after:rounded-4xl"
              >
                {brand.name}
              </button>
            </h2>
            <p className="mt-1 text-[13.5px] text-text-secondary">
              {brand.industry} · {brand.budgetTier} creators<span className="hidden sm:inline"> · Managed by Schbang</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLike}
          aria-pressed={liked}
          title={liked ? "Remove interest" : "Show interest in this brief"}
          className={cn(
            "press absolute top-5 right-5 sm:top-6 sm:right-6 z-10 flex items-center gap-1.5 min-h-9 px-3 rounded-full text-[13px] font-medium cursor-pointer",
            liked ? "bg-marigold-soft text-marigold-ink" : "bg-muted text-text-secondary hover:text-primary"
          )}
        >
          <Heart className={cn("w-3.5 h-3.5", liked && "fill-current")} aria-hidden="true" />
          {brand.likesCount}
          <span className="sr-only">{liked ? "Liked" : "Like"} {brand.name}</span>
        </button>

        <p className="mt-4 text-[15px] leading-relaxed text-text-secondary line-clamp-2">{brand.description}</p>

        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Formats">
          {brand.campaignTypes.map((type) => (
            <li key={type} className="px-3 py-1 rounded-full bg-muted text-[13px] font-medium text-primary">
              {type}
            </li>
          ))}
        </ul>

        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-3">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] text-text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" aria-hidden="true" />
              {brand.likesCount} interested
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" aria-hidden="true" />
              {brand.campaignTypes.length} formats
            </span>
          </p>
          <span
            aria-hidden="true"
            className="shrink-0 inline-flex items-center gap-1.5 min-h-10 px-4 rounded-full bg-ink text-white text-sm font-semibold transition-colors group-hover:bg-accent-hover"
          >
            View brief
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </article>
    </li>
  );
}
