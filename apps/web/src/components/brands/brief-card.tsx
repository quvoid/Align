import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import type { BrandItem } from "@/lib/mock-data";

interface BriefCardProps {
  brand: BrandItem;
  /** Navigate on click (home page). */
  href?: string;
  /** Or handle the click in place (the /brands quick-view panel). */
  onSelect?: () => void;
  /**
   * Control pinned to the image's top-right corner, e.g. the like button.
   * Rendered outside the card's own link/button so interactive elements are
   * never nested; it must stop propagation itself.
   */
  action?: ReactNode;
}

const SHELL =
  "group relative flex flex-col h-full rounded-4xl bg-surface/55 backdrop-blur-xl ring-1 ring-inset ring-white/70 shadow-[0_24px_60px_-28px_rgba(33,25,34,0.45)] p-2 text-left transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:-translate-y-1 hover:bg-surface/70 hover:shadow-[0_32px_70px_-28px_rgba(33,25,34,0.55)]";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary rounded-4xl";

/**
 * Brief card used on the home page and /brands.
 *
 * Frosted rather than solid white so it sits *on* the rose/periwinkle wash
 * instead of punching a hole in it: translucent fill + backdrop blur, a light
 * inner ring for the glass edge, and a soft plum shadow. The whole card is the
 * target — no second outline button competing with the page's one red CTA.
 */
export function BriefCard({ brand, href, onSelect, action }: BriefCardProps) {
  const body = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-linen">
        <img
          src={brand.coverImage}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-primary/0 to-primary/0" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface/85 backdrop-blur text-[11px] font-semibold text-primary">
          {brand.budgetTier} creators
        </span>
        <img
          src={brand.logo}
          alt=""
          className="absolute bottom-3 left-3 w-11 h-11 rounded-2xl object-cover bg-surface ring-2 ring-white"
        />
      </div>

      <div className="flex flex-col flex-1 px-4 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-primary leading-tight truncate">{brand.name}</h3>
            <p className="text-xs font-medium text-primary/60 mt-1">{brand.industry}</p>
          </div>
          <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-ink text-white transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </span>
        </div>

        <p className="text-sm text-primary/75 leading-relaxed line-clamp-2 mt-3">{brand.description}</p>

        <ul className="flex flex-wrap gap-1.5 mt-auto pt-5">
          {brand.campaignTypes.slice(0, 3).map((type) => (
            <li
              key={type}
              className="px-2.5 py-1 rounded-full bg-surface/70 ring-1 ring-inset ring-primary/10 text-[11px] font-medium text-primary/80"
            >
              {type}
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  const label = `View ${brand.name} brief`;

  return (
    <div className={SHELL}>
      {href ? (
        <Link href={href} aria-label={label} className={`flex flex-col flex-1 ${FOCUS}`}>
          {body}
        </Link>
      ) : (
        <button type="button" onClick={onSelect} aria-label={label} className={`flex flex-col flex-1 text-left cursor-pointer ${FOCUS}`}>
          {body}
        </button>
      )}
      {action && <div className="absolute top-5 right-5">{action}</div>}
    </div>
  );
}
