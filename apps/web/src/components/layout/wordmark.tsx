import { cn } from "@/lib/utils";

/** "align." with the blue full stop, and the Schbang endorsement beside it. */
export function Wordmark({ suffix = "by Schbang", className }: { suffix?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span className="text-[24px] font-semibold leading-none tracking-[-0.04em] text-primary">
        align<span className="text-marigold">.</span>
      </span>
      <span className="text-[12.5px] font-medium text-text-secondary">{suffix}</span>
    </span>
  );
}
