"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { tintFor } from "@/lib/tints";
import { cn } from "@/lib/utils";

/*
 * PLACEHOLDER earnings. Every figure, earner, payout and chart point below is
 * illustrative, to show how the section lays out. Replace with verified payout
 * data before launch.
 */
const STATS = [
  { to: 1, decimals: 0, prefix: "₹", suffix: "M+", label: "earned by a single creator on Align" },
  { to: 1.2, decimals: 1, prefix: "₹", suffix: "L", label: "largest single brand deal paid out" },
  { to: 11, decimals: 0, prefix: "", suffix: " days", label: "average from pitch to signed deal" },
];
const WALLET_TOTAL = 1040000;
const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const CURVE = [1.2, 2.6, 3.9, 5.8, 7.9, 10.4]; // lakh, cumulative
const PAYOUTS = [
  { brand: "Britannia", slug: "britannia", work: "Instagram Reel", amount: "₹45,000", paid: true },
  { brand: "Swiggy", slug: "swiggy", work: "Food Hunt Reel", amount: "₹60,000", paid: true },
  { brand: "Enamor", slug: "enamor", work: "Try-On Haul", amount: "₹35,000", paid: false },
];
const EARNERS = [
  { name: "Riya Kapoor", niche: "Beauty", earned: "₹10.4L", share: 1, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop" },
  { name: "Dev Malhotra", niche: "Tech", earned: "₹6.8L", share: 0.65, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop" },
  { name: "Tara Sen", niche: "Food", earned: "₹3.1L", share: 0.3, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop" },
];

const easeOut = (x: number) => 1 - Math.pow(1 - x, 4);

/**
 * Plays once when the section scrolls into view: the stats and the wallet
 * total count up, the earnings line draws itself, payouts slide in one after
 * another and the leaderboard bars fill. Reduced motion shows the end state.
 */
function useReveal(duration = 1800) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      return;
    }
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const x = Math.min(1, (now - start) / duration);
          setP(x);
          if (x < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [duration]);
  return { ref, p, e: easeOut(p) };
}

export function EarningsShowcase() {
  const { ref, p, e } = useReveal();

  const w = 320;
  const h = 120;
  const max = CURVE[CURVE.length - 1]!;
  const pts = CURVE.map((v, i) => [(i / (CURVE.length - 1)) * w, h - 8 - (v / max) * (h - 24)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const last = pts[pts.length - 1]!;

  return (
    <div ref={ref} className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
      <div>
        <h2
          id="earnings"
          className="text-[34px] sm:text-5xl font-semibold tracking-[-0.04em] leading-[1.05] text-primary text-balance"
        >
          Creators have earned <span className="text-marigold">₹1M+</span> using Align
        </h2>
        <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-text-secondary">
          Brand deals add up fast when you pitch brands directly. No waiting on a manager to forward your rate card, no
          getting lost in an agency inbox.
        </p>
        <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8">
          {STATS.map((s) => (
            <div key={s.label}>
              <dd className="text-[28px] sm:text-[40px] font-semibold tracking-[-0.03em] leading-none tabular-nums text-primary">
                {s.prefix}
                {(s.to * e).toFixed(s.decimals)}
                {s.suffix}
              </dd>
              <dt className="mt-2 text-[13.5px] leading-snug text-text-secondary">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative rounded-5xl bg-muted p-3 sm:p-6 lg:p-8">
        <div className="grid gap-3 sm:gap-4 md:grid-cols-[minmax(0,1fr)_230px] md:items-start">
          {/* The wallet */}
          <div className="rounded-4xl bg-surface p-5 sm:p-6 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2.5">
                <img src={EARNERS[0]!.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                <span className="text-[13.5px] text-text-secondary">Riya&apos;s earnings on Align</span>
              </span>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 whitespace-nowrap px-2.5 py-1 rounded-full bg-marigold-soft text-[12.5px] font-semibold text-marigold-ink transition-opacity duration-500",
                  p > 0.6 ? "opacity-100" : "opacity-0"
                )}
              >
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                ₹1.2L this month
              </span>
            </div>
            <p className="mt-3 text-[36px] sm:text-[44px] font-semibold tracking-[-0.04em] leading-none tabular-nums text-primary">
              ₹{Math.round(WALLET_TOTAL * e).toLocaleString("en-IN")}
            </p>

            <svg viewBox={`0 0 ${w} ${h}`} className="mt-5 h-28 w-full overflow-visible" role="img" aria-label="Earnings rising from ₹1.2 lakh in April to ₹10.4 lakh in September">
              {[0.25, 0.5, 0.75].map((g) => (
                <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="#EFEBE3" strokeWidth="1" />
              ))}
              <path d={area} fill="#E8601C" opacity={0.08 * e} />
              <path
                d={line}
                fill="none"
                stroke="#E8601C"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - e}
              />
              {p >= 1 && (
                <>
                  <circle cx={last[0]} cy={last[1]} r="9" fill="#E8601C" opacity="0.18" />
                  <circle cx={last[0]} cy={last[1]} r="4.5" fill="#E8601C" />
                </>
              )}
            </svg>
            <div className="mt-2 flex justify-between text-[11.5px] text-text-secondary">
              {MONTHS.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>

            <ul className="mt-5 space-y-2">
              {PAYOUTS.map((pay, i) => {
                const shown = p > 0.35 + i * 0.15;
                return (
                  <li
                    key={pay.brand}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl bg-background px-3 py-2.5 transition-all duration-500 ease-out",
                      shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                    )}
                  >
                    <span className={cn("w-8 h-8 shrink-0 rounded-lg grid place-items-center text-[13px] font-semibold text-primary", tintFor(pay.slug))} aria-hidden="true">
                      {pay.brand[0]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold text-primary">{pay.brand}</span>
                      <span className="block truncate text-[12.5px] text-text-secondary">{pay.work}</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-[14px] font-semibold tabular-nums text-primary">{pay.amount}</span>
                      <span className={cn("inline-flex items-center gap-1 text-[12px] font-medium", pay.paid ? "text-success" : "text-warning")}>
                        {pay.paid && <Check className="w-3 h-3" aria-hidden="true" />}
                        {pay.paid ? "Paid" : "In progress"}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* The leaderboard */}
          <div className="rounded-4xl bg-ink p-5 text-white md:mt-16">
            <p className="text-[13.5px] font-semibold">Top earners</p>
            <ol className="mt-4 space-y-4">
              {EARNERS.map((c, i) => (
                <li key={c.name}>
                  <div className="flex items-center gap-2.5">
                    <img src={c.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold leading-tight">{c.name}</span>
                      <span className="block text-[12px] text-white/60">{c.niche}</span>
                    </span>
                    <span className="text-[14px] font-semibold tabular-nums">{c.earned}</span>
                  </div>
                  <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white/10">
                    <span
                      className={cn("block h-full rounded-full", i === 0 ? "bg-marigold" : "bg-white/60")}
                      style={{ width: `${c.share * e * 100}%` }}
                    />
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
