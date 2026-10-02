import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import type { BrandItem } from "@/lib/mock-data";
import { clayFillFor } from "@/lib/clay";
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
 * Brief card used on the home page and /brands: a pastel clay slab, one fill
 * per brief so it keeps its colour everywhere. The brand name is set big
 * instead of a logo image — the stock photos it used to show were never the
 * brands' real marks.
 */
export function BriefCard({ brand, href, onSelect, action }: BriefCardProps) {
  const body = (
    <>
      <div className="pr-20">
        <h3 className="font-extrabold text-[34px] leading-[0.95] tracking-tight text-primary">{brand.name}</h3>
        <p className="mt-1.5 text-sm font-semibold text-text-secondary">
          {brand.industry} · {brand.budgetTier} creators
        </p>
      </div>

      <p className="mt-3 text-[15px] leading-relaxed text-primary/85 line-clamp-3">{brand.description}</p>

      <ul className="flex flex-wrap gap-1.5 mt-auto pt-5">
        {brand.campaignTypes.slice(0, 3).map((type) => (
          <li
            key={type}
            className="px-3 py-1 rounded-full bg-white/60 shadow-clay-well text-[13px] font-semibold text-primary"
          >
            {type}
          </li>
        ))}
      </ul>

      <span className="mt-5 flex items-center justify-between rounded-3xl bg-surface/80 px-4 py-3 text-[15px] font-bold text-primary shadow-clay-sm">
        View brief
        <span className="w-8 h-8 rounded-full bg-accent text-white grid place-items-center shadow-clay-btn transition-transform duration-300 ease-squish group-hover:translate-x-1">
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </span>
      </span>
    </>
  );

  const label = `View ${brand.name} brief`;
  const shell = cn(
    "group relative flex flex-col h-full rounded-4xl p-5 sm:p-6 text-left shadow-clay clay-press",
    clayFillFor(brand.slug)
  );

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
      {action && <div className="absolute top-5 right-5">{action}</div>}
    </div>
  );
}
