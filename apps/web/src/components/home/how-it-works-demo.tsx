"use client";

import { Check, Search } from "lucide-react";
import { tintFor } from "@/lib/tints";
import { cn } from "@/lib/utils";
import { typed, useDemoClock } from "./use-demo-clock";

export interface DemoBrief {
  name: string;
  slug: string;
  industry: string;
}

const STEP_TICKS = 60; // 6s a step at 100ms a tick
const STEPS = [
  { title: "Find a brief", caption: "Search and filter" },
  { title: "Send your pitch", caption: "Idea, numbers, rate" },
  { title: "Follow the decision", caption: "Live on your dashboard" },
] as const;

/**
 * "How it works" as one box that plays itself: a search gets typed and
 * filtered, a pitch gets filled in and sent, then the status bar fills and the
 * Schbang team's note pops in. Steps advance on their own while the box is on
 * screen; the tabs jump between them. With reduced motion nothing plays and
 * each step shows its finished state.
 */
export function HowItWorksDemo({ briefs }: { briefs: DemoBrief[] }) {
  const { ref, tick, setTick, reduced } = useDemoClock<HTMLDivElement>(STEP_TICKS * STEPS.length);
  const step = Math.floor(tick / STEP_TICKS);
  const local = reduced ? STEP_TICKS - 1 : tick % STEP_TICKS;

  const food = briefs.filter((b) => b.industry.startsWith("Food"));
  const rows = [...food.slice(0, 2), ...briefs.filter((b) => !b.industry.startsWith("Food")).slice(0, 2)];
  const target = food[food.length - 1] ?? briefs[0];

  return (
    <div ref={ref} className="grid gap-6 rounded-5xl bg-surface p-4 sm:p-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10 lg:p-10 shadow-card">
      <ol className="grid grid-cols-3 gap-2 lg:grid-cols-1 lg:content-center lg:gap-3" aria-label="Steps">
        {STEPS.map((s, i) => {
          const active = i === step;
          return (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => setTick(i * STEP_TICKS)}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "w-full rounded-3xl p-3 sm:p-4 text-left transition-colors",
                  active ? "bg-muted" : "hover:bg-muted/60"
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "w-8 h-8 shrink-0 rounded-full grid place-items-center text-[13px] font-semibold transition-colors",
                      active ? "bg-ink text-white" : i < step ? "bg-marigold-soft text-marigold-ink" : "bg-muted text-text-secondary"
                    )}
                  >
                    {i < step ? <Check className="w-4 h-4" aria-hidden="true" /> : i + 1}
                  </span>
                  <span className="hidden sm:block min-w-0">
                    <span className={cn("block text-[15px] font-semibold", active ? "text-primary" : "text-text-secondary")}>
                      {s.title}
                    </span>
                    <span className="block text-[13px] text-text-secondary">{s.caption}</span>
                  </span>
                </span>
                <span className="sm:hidden mt-2 block text-[13px] font-semibold text-primary">{s.title}</span>
                <span className="mt-3 block h-1 overflow-hidden rounded-full bg-[#E3DED4]" aria-hidden="true">
                  <span
                    className="block h-full rounded-full bg-marigold transition-[width] duration-100 ease-linear"
                    style={{ width: active ? `${((local + 1) / STEP_TICKS) * 100}%` : i < step ? "100%" : "0%" }}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="relative flex min-h-[480px] items-center overflow-hidden rounded-4xl bg-muted p-4 sm:min-h-[460px] sm:p-8" aria-live="off">
        <div className="mx-auto w-full max-w-md">
          {step === 0 && <FindScene key={`find-${reduced}`} local={local} rows={rows} target={target} />}
          {step === 1 && <PitchScene key="pitch" local={local} target={target} />}
          {step === 2 && <StatusScene key="status" local={local} target={target} />}
        </div>
      </div>
    </div>
  );
}

function Avatar({ brief, small = false }: { brief: DemoBrief; small?: boolean }) {
  return (
    <span
      className={cn(
        "shrink-0 grid place-items-center font-semibold text-primary",
        small ? "w-8 h-8 rounded-lg text-[13px]" : "w-10 h-10 rounded-xl",
        tintFor(brief.slug)
      )}
      aria-hidden="true"
    >
      {brief.name[0]}
    </span>
  );
}

function FindScene({ local, rows, target }: { local: number; rows: DemoBrief[]; target?: DemoBrief }) {
  const query = typed("food vlog", local, 4, 13);
  const filtered = local >= 18;
  const picked = local >= 32;
  const pressed = local >= 42 && local < 46;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 h-12 rounded-full bg-surface px-5 text-[15px]">
        <Search className="w-4 h-4 text-text-secondary" aria-hidden="true" />
        <span className="text-primary">{query}</span>
        {local < 16 && <span className="caret -ml-1.5 h-5 w-px bg-ink" aria-hidden="true" />}
        {!query && <span className="text-text-secondary">Search a brand or niche</span>}
      </div>
      <div className="flex gap-2">
        {["Food", "Fashion", "Finance"].map((chip) => (
          <span
            key={chip}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-300",
              chip === "Food" && filtered ? "bg-ink text-white" : "bg-surface text-primary"
            )}
          >
            {chip}
          </span>
        ))}
      </div>
      <ul className="space-y-2 pt-1">
        {rows.map((b) => {
          const hidden = filtered && !b.industry.startsWith("Food");
          const isTarget = b.slug === target?.slug;
          return (
            <li
              key={b.slug}
              className={cn(
                "overflow-hidden transition-all duration-500 ease-out",
                hidden ? "max-h-0 opacity-0 -translate-y-1" : "max-h-20 opacity-100"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-3 rounded-2xl bg-surface p-3 transition-all duration-300",
                  isTarget && picked && "shadow-[0_0_0_2px_var(--color-marigold)]",
                  isTarget && pressed && "scale-[0.98]"
                )}
              >
                <Avatar brief={b} small />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold text-primary">{b.name}</span>
                  <span className="block text-[12.5px] text-text-secondary">{b.industry}</span>
                </span>
                <span
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition-colors duration-300",
                    isTarget && picked ? "bg-ink text-white" : "bg-muted text-text-secondary"
                  )}
                >
                  View brief
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PitchScene({ local, target }: { local: number; target?: DemoBrief }) {
  const idea = typed("Late-night food hunt on an IPL match day.", local, 3, 18);
  const fields = [
    { label: "Followers", value: typed("1.45L", local, 21, 24) },
    { label: "Engagement", value: typed("6.8%", local, 25, 28) },
    { label: "Your rate", value: typed("₹25,000", local, 29, 34) },
  ];
  const formats = [
    { name: "Food Hunt Reel", on: local >= 37 },
    { name: "Story", on: local >= 40 },
    { name: "Snack Review", on: false },
  ];
  const pressed = local >= 46 && local < 49;
  const sent = local >= 49;

  return (
    <div className="rounded-4xl bg-surface p-5 sm:p-6">
      <div className="flex items-center gap-3">
        {target && <Avatar brief={target} small />}
        <p className="text-[15px] font-semibold text-primary">Pitch to {target?.name ?? "the brand"}</p>
      </div>
      <div className="mt-4 min-h-[48px] rounded-2xl bg-muted px-4 py-3 text-[14px] text-primary">
        {idea || <span className="text-text-secondary">Your idea</span>}
        {local >= 3 && local < 19 && <span className="caret ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-ink" aria-hidden="true" />}
      </div>
      <dl className="mt-2 grid grid-cols-3 gap-2">
        {fields.map((f) => (
          <div key={f.label} className="rounded-2xl bg-muted px-3 py-2.5">
            <dt className="text-[11.5px] text-text-secondary">{f.label}</dt>
            <dd className="mt-0.5 h-5 text-[14px] font-semibold tabular-nums text-primary">{f.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {formats.map((f) => (
          <span
            key={f.name}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12.5px] font-medium transition-colors duration-300",
              f.on ? "bg-ink text-white" : "bg-muted text-text-secondary"
            )}
          >
            {f.on && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
            {f.name}
          </span>
        ))}
      </div>
      <div
        className={cn(
          "mt-5 flex h-12 items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition-all duration-300",
          sent ? "bg-tint-mint text-success" : "bg-ink text-white",
          pressed && "scale-[0.97]"
        )}
      >
        {sent ? (
          <>
            <Check className="w-4 h-4" aria-hidden="true" /> Pitch sent
          </>
        ) : (
          "Send pitch"
        )}
      </div>
    </div>
  );
}

function StatusScene({ local, target }: { local: number; target?: DemoBrief }) {
  const stage = local >= 26 ? 2 : local >= 12 ? 1 : 0;
  const pill = [
    { label: "Pending", cls: "bg-tint-butter" },
    { label: "In review", cls: "bg-tint-sky" },
    { label: "Shortlisted", cls: "bg-tint-lilac" },
  ][stage]!;
  const events = [
    { at: 2, text: "Pitch sent" },
    { at: 12, text: "Read by the Schbang team" },
    { at: 26, text: "Shortlisted" },
  ];

  return (
    <div className="rounded-4xl bg-surface p-5 sm:p-6">
      <div className="flex items-center gap-3">
        {target && <Avatar brief={target} small />}
        <p className="min-w-0 flex-1 text-[15px] font-semibold text-primary">Your pitch to {target?.name ?? "the brand"}</p>
        <span key={pill.label} className={cn("rise-in px-3 py-1 rounded-full text-[12.5px] font-semibold text-primary", pill.cls)}>
          {pill.label}
        </span>
      </div>
      <ol className="mt-5 grid grid-cols-4 gap-1.5 text-[11.5px] text-text-secondary">
        {["Sent", "In review", "Shortlist", "Decision"].map((s, i) => {
          const done = i < stage || (i === 0 && local >= 2);
          const current = i === stage && local >= 2;
          return (
            <li key={s} className={cn(current && "font-semibold text-primary")}>
              <span className="mb-2 block h-1.5 overflow-hidden rounded-full bg-muted">
                <span
                  className={cn("block h-full rounded-full transition-[width] duration-700 ease-out", current ? "bg-marigold" : "bg-ink")}
                  style={{ width: done || current ? "100%" : "0%" }}
                />
              </span>
              {s}
            </li>
          );
        })}
      </ol>
      <ul className="mt-5 space-y-2">
        {events
          .filter((e) => local >= e.at)
          .map((e) => (
            <li key={e.text} className="rise-in flex items-center gap-2.5 text-[13.5px] text-primary">
              <span className="w-5 h-5 shrink-0 rounded-full bg-marigold-soft text-marigold-ink grid place-items-center">
                <Check className="w-3 h-3" aria-hidden="true" />
              </span>
              {e.text}
            </li>
          ))}
      </ul>
      {local >= 36 && (
        <div className="rise-in mt-5 flex gap-2.5">
          <span className="w-8 h-8 shrink-0 rounded-full bg-ink text-white grid place-items-center text-[12px] font-semibold" aria-hidden="true">
            S
          </span>
          <p className="rounded-2xl rounded-tl-md bg-muted px-3.5 py-2.5 text-[13.5px] leading-snug text-primary">
            <span className="block text-[12px] font-medium text-text-secondary">Schbang team</span>
            Love the idea. Send a rough script by Friday.
          </p>
        </div>
      )}
    </div>
  );
}
