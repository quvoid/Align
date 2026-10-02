import Link from "next/link";
import type { ReactNode } from "react";
import { Users, Video, Heart } from "lucide-react";
import type { BrandItem } from "@/lib/mock-data";
import { tintFor } from "@/lib/tints";
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
 * Brief card used on the home page and /brands: a white card with the brand's
 * letter avatar (one tint per brief, so it keeps its colour everywhere), the
 * brief, its formats and three facts. No logo images — the stock photos it
 * used to show were never the brands' real marks.
 */
export function BriefCard({ brand, href, onSelect, action }: BriefCardProps) {
  const facts = [
    { icon: Users, value: brand.budgetTier, label: "creators" },
    { icon: Video, value: brand.campaignTypes.length, label: "formats" },
    { icon: Heart, value: brand.likesCount, label: "interested" },
  ];
  const body = (
    <>
      <div className={cn("flex items-center gap-3", action && "pr-20")}>
        <span
          className={cn("w-11 h-11 shrink-0 rounded-2xl grid place-items-center text-[17px] font-semibold text-primary", tintFor(brand.slug))}
          aria-hidden="true"
        >
          {brand.name[0]}
        </span>
        <span className="min-w-0">
          <h3 className="text-[17px] font-semibold leading-tight text-primary">{brand.name}</h3>
          <span className="block text-[13px] text-text-secondary">{brand.industry}</span>
        </span>
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-text-secondary line-clamp-3">{brand.description}</p>
      <p className="mt-3 text-[13px] font-medium text-primary">{brand.campaignTypes.slice(0, 3).join(" · ")}</p>

      <dl className="mt-auto pt-5">
        <div className="grid grid-cols-3 rounded-2xl bg-muted py-2.5">
          {facts.map(({ icon: Icon, value, label }, i) => (
            <div key={label} className={cn("grid justify-items-center gap-0.5 text-center", i > 0 && "border-l border-border")}>
              <dd className="flex items-center gap-1.5 text-[13.5px] font-semibold text-primary">
                <Icon className="w-3.5 h-3.5 text-text-secondary" aria-hidden="true" />
                {value}
              </dd>
              <dt className="text-[12px] text-text-secondary">{label}</dt>
            </div>
          ))}
        </div>
      </dl>
    </>
  );

  const label = `View ${brand.name} brief`;
  const shell = "group relative flex flex-col h-full rounded-4xl bg-surface p-5 text-left shadow-card press hover:shadow-lift";

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
