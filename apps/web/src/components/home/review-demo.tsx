"use client";

import { Check, Eye, IndianRupee, MessageCircle, Repeat, UserCheck } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useDemoClock } from "./use-demo-clock";

const TOTAL = 96; // 9.6s loop at 100ms a tick

/** Each beat of the loop lights up the reason it proves. */
const REASONS = [
  { icon: IndianRupee, title: "Your numbers, your rate", body: "You send your own audience numbers and the fee you want.", from: 0 },
  { icon: UserCheck, title: "No algorithm in the way", body: "A person on the Schbang team reads the whole pitch.", from: 18 },
  { icon: Repeat, title: "One status, both sides", body: "Their decision is what you see, in the same words.", from: 52 },
  { icon: MessageCircle, title: "Notes, not silence", body: "The team can leave you a note on your dashboard.", from: 74 },
] as const;

const PITCH_LINES = ["A 60-second family Reel idea", "Why it fits the brand", "1 Reel + 2 Stories · ₹25,000"];

/**
 * The whole review, played out: the creator sends a pitch, it travels to the
 * Schbang team's queue, someone reads it line by line and shortlists it, the
 * status travels back, and a note lands on the creator's dashboard. With
 * reduced motion it shows the finished state and every reason at once.
 */
export function ReviewDemo({ brandName }: { brandName: string }) {
  const { ref, tick, reduced } = useDemoClock<HTMLDivElement>(TOTAL);
  const t = reduced ? TOTAL - 1 : tick;

  const sent = t >= 8;
  const arrived = t >= 18;
  const readingLine = t >= 22 && t < 46 ? Math.floor((t - 22) / 8) : t >= 46 ? 3 : -1;
  const decided = t >= 54;
  const synced = t >= 66;
  const noted = t >= 74;

  // Where the dot on the connector is: out to the team, then back.
  const going = t >= 8 && t < 18 ? (t - 8) / 10 : null;
  const returning = t >= 56 && t < 66 ? 1 - (t - 56) / 10 : null;
  const dot = going ?? returning;

  const activeReason = [...REASONS].reverse().find((r) => t >= r.from) ?? REASONS[0];

  return (
    <div ref={ref}>
      <div className="grid gap-4 rounded-4xl bg-muted p-4 sm:p-8 md:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] md:items-center md:gap-0">
        {/* Creator side */}
        <div className="rounded-4xl bg-surface p-5">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-tint-sky grid place-items-center text-[12px] font-semibold text-primary" aria-hidden="true">
              RJ
            </span>
            <span className="text-[13px] text-text-secondary">Your dashboard</span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-[15px] font-semibold text-primary">Pitch to {brandName}</p>
            <StatusPill state={!sent ? "draft" : synced ? "shortlisted" : "pending"} pulse={synced && t < 72} />
          </div>
          <div
            className={cn(
              "mt-4 flex h-11 items-center justify-center gap-2 rounded-full text-[14px] font-semibold transition-all duration-300",
              sent ? "bg-muted text-text-secondary" : "bg-ink text-white",
              t >= 5 && t < 8 && "scale-[0.97]"
            )}
          >
            {sent ? (
              <>
                <Check className="w-4 h-4" aria-hidden="true" /> Sent to the Schbang team
              </>
            ) : (
              "Send pitch"
            )}
          </div>
          <div className={cn("grid transition-[grid-template-rows] duration-500 ease-out", noted ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
            <div className="overflow-hidden">
              <div className="mt-4 flex gap-2.5">
                <span className="w-7 h-7 shrink-0 rounded-full bg-ink text-white grid place-items-center text-[11px] font-semibold" aria-hidden="true">
                  S
                </span>
                <p className="rounded-2xl rounded-tl-md bg-muted px-3 py-2 text-[13px] leading-snug text-primary">
                  Love the idea. Send a rough script by Friday.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Connector: the pitch goes out, the status comes back. */}
        <div className="relative mx-auto h-10 w-px md:h-px md:w-full" aria-hidden="true">
          <span className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,#CFC8BA_0_4px,transparent_4px_8px)] md:bg-[repeating-linear-gradient(to_right,#CFC8BA_0_4px,transparent_4px_8px)]" />
          {dot !== null && (
            <span
              className="absolute left-1/2 top-[var(--p)] md:top-1/2 md:left-[var(--p)] -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-marigold shadow-[0_0_0_4px_var(--color-marigold-soft)] transition-[top,left] duration-100 ease-linear"
              style={{ "--p": `${dot * 100}%` } as CSSProperties}
            />
          )}
        </div>

        {/* Schbang side */}
        <div className="rounded-4xl bg-surface p-5">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-ink text-white grid place-items-center text-[12px] font-semibold" aria-hidden="true">
              S
            </span>
            <span className="text-[13px] text-text-secondary">Schbang review queue</span>
          </div>
          {arrived ? (
            <div className="rise-in mt-4 min-h-[194px]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[15px] font-semibold text-primary">Rohan Joshi</p>
                {decided ? (
                  <StatusPill state="shortlisted" />
                ) : readingLine >= 0 && readingLine < 3 ? (
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-marigold-ink">
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" /> Reading
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-marigold-soft text-[12px] font-semibold text-marigold-ink">New</span>
                )}
              </div>
              <ul className="mt-3 space-y-1.5">
                {PITCH_LINES.map((line, i) => (
                  <li
                    key={line}
                    className={cn(
                      "rounded-lg px-2.5 py-1.5 text-[13px] transition-colors duration-300",
                      i === readingLine ? "bg-marigold-soft text-primary" : i < readingLine ? "text-primary" : "text-text-secondary"
                    )}
                  >
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex gap-2">
                <span
                  className={cn(
                    "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full text-[13.5px] font-semibold transition-all duration-300",
                    decided ? "bg-tint-lilac text-primary" : t >= 46 ? "bg-ink text-white" : "bg-muted text-text-secondary",
                    t >= 51 && t < 54 && "scale-[0.96]"
                  )}
                >
                  {decided && <Check className="w-4 h-4" aria-hidden="true" />}
                  {decided ? "Shortlisted" : "Shortlist"}
                </span>
                <span className="flex h-10 items-center rounded-full bg-muted px-4 text-[13.5px] font-medium text-text-secondary">Not selected</span>
              </div>
            </div>
          ) : (
            <p className="mt-4 grid h-[194px] place-items-center rounded-2xl border border-dashed border-[#CFC8BA] text-[13px] text-text-secondary">
              Waiting for pitches
            </p>
          )}
        </div>
      </div>

      <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map(({ icon: Icon, title, body }) => {
          const on = reduced || title === activeReason.title;
          return (
            <li
              key={title}
              className={cn("rounded-3xl p-4 transition-colors duration-500", on ? "bg-marigold-soft" : "bg-transparent")}
            >
              <span className="flex items-center gap-2.5">
                <Icon className={cn("w-4 h-4 shrink-0", on ? "text-marigold-ink" : "text-text-secondary")} aria-hidden="true" />
                <span className={cn("text-[15px] font-semibold", on ? "text-primary" : "text-text-secondary")}>{title}</span>
              </span>
              <span className={cn("mt-1.5 block text-[13.5px] leading-snug transition-opacity duration-500", on ? "text-primary/80 opacity-100" : "opacity-0 max-sm:hidden")}>
                {body}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StatusPill({ state, pulse = false }: { state: "draft" | "pending" | "shortlisted"; pulse?: boolean }) {
  const map = {
    draft: { label: "Draft", cls: "bg-muted text-text-secondary" },
    pending: { label: "Pending", cls: "bg-tint-butter text-primary" },
    shortlisted: { label: "Shortlisted", cls: "bg-tint-lilac text-primary" },
  }[state];
  return (
    <span key={state} className={cn("rise-in px-2.5 py-1 rounded-full text-[12px] font-semibold", map.cls, pulse && "ping-soft")}>
      {map.label}
    </span>
  );
}
