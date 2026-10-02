import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import type { BrandItem } from "@/lib/mock-data";
import { fillFor } from "@/lib/fills";
import { cn } from "@/lib/utils";

interface BriefCardProps {
  brand: BrandItem;
  /** Navigate on click (home page). */
  href?: string;
  /** Or handle the click in place (the /brands quick-view panel). */
  onSelect?: () => void;
  /**
   * Control pinned to the card's top-right corner, e.g. the like button.
   * Rendered outside the card's own link/button so interactive elements are
   * never nested; it must stop propagation itself.
   */
  action?: ReactNode;
}

/**
 * Brief card used on the home page and /brands: a white block whose header
 * band carries the brief's own fill (so it keeps its colour everywhere) and
 * the brand name in Tanker. The name is the logo — the stock photos it used
 * to show were never the brands' real marks.
 */
export function BriefCard({ brand, href, onSelect, action }: BriefCardProps) {
  const body = (
    <>
      <div className={cn("px-5 pt-4 pb-5 border-b-2 border-ink", action && "pr-24", fillFor(brand.slug))}>
        <p className="text-[13px] font-extrabold text-primary">{brand.industry}</p>
        <h3 className="type-display mt-3 text-[44px] leading-[0.88] text-primary">{brand.name}</h3>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[15px] leading-relaxed text-primary line-clamp-3">{brand.description}</p>

        <ul className="flex flex-wrap gap-1.5 pt-4" aria-label="Formats">
          {brand.campaignTypes.slice(0, 3).map((type) => (
            <li
              key={type}
              className="px-2.5 py-1 rounded bg-muted border-2 border-ink text-[13px] font-bold text-primary"
            >
              {type}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5 flex items-center justify-between gap-3">
          <span className="text-[13px] font-extrabold text-text-secondary">{brand.budgetTier} creators</span>
          <span className="inline-flex items-center gap-2 text-[15px] font-extrabold text-primary">
            View brief
            <span className="w-9 h-9 rounded-md bg-ink text-white grid place-items-center transition-colors group-hover:bg-action group-hover:text-ink">
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </span>
        </div>
      </div>
    </>
  );

  const label = `View ${brand.name} brief`;
  const shell = "group relative flex flex-col h-full overflow-hidden rounded-lg bg-surface text-left brut brut-press";

  return (
    <div className="relative h-full">
      {href ? (
        <Link href={href} aria-label={label} className={shell}>
          {body}
        </Link>
      ) : (
        <button type="button" onClick={onSelect} aria-label={label} className={cn(shell, "w-full cursor-pointer")}>
          {body}
        </button>
      )}
      {action && <div className="absolute top-4 right-4">{action}</div>}
    </div>
  );
}
