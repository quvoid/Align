import { cn } from "@/lib/utils";

/**
 * "Align" in Tanker, taxi yellow on an ink block, with the Schbang endorsement
 * beside it. `inverted` is for the ink footer, where the block turns yellow.
 */
export function Wordmark({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "type-display inline-block -rotate-2 rounded-md px-2 pt-1.5 pb-0.5 text-[28px] leading-none",
          inverted ? "bg-action text-ink" : "bg-ink text-action"
        )}
      >
        Align
      </span>
      <span className={cn("text-[13px] font-extrabold", inverted ? "text-white" : "text-primary")}>by Schbang</span>
    </span>
  );
}
