"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Reveal } from "cube-motion/react";

export interface HowItWorksStep {
  readonly step: string;
  readonly title: string;
  readonly body: string;
  readonly image: string;
  readonly alt: string;
  readonly href: string;
  /** Grid span classes for the 2 + 1 tablet layout. */
  readonly span: string;
  readonly aspect: string;
}

/** How long a panel holds focus before the rotation advances. */
const ROTATE_MS = 4000;

/**
 * The three-step band.
 *
 * At rest each panel is a heading over a photograph. One panel at a time is
 * *active*: its wash lifts, the image eases in, and its description appears.
 *
 * How "active" is chosen depends on what the device can do, because the three
 * cases genuinely differ:
 *
 * - Pointer devices rotate on a timer, and hover takes over — pointing at a
 *   panel is a stronger signal of intent than the clock, so it wins and the
 *   timer pauses.
 * - Touch devices have no hover at all, so the rotation is the only thing that
 *   can surface the descriptions. Scroll position drives it instead of a timer:
 *   whichever panel is nearest the middle of the viewport is the active one.
 * - Reduced motion gets no rotation and no movement. Every description is
 *   simply shown, which is the accessible end state rather than a degraded one.
 */
export function HowItWorks({ steps }: { steps: readonly HowItWorksStep[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  // `null` until measured on the client: SSR must not guess at device input.
  const [mode, setMode] = useState<"pointer" | "touch" | "static" | null>(null);
  /** True only when the panels are in one column, i.e. the mobile stack. */
  const [stacked, setStacked] = useState(false);

  const listRef = useRef<HTMLOListElement>(null);

  // Scroll can only choose between panels that sit at different heights. Side
  // by side they share a vertical centre, so it would always pick the first.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const measure = () => {
      const tops = Array.from(el.children).map(
        (panel) => panel.getBoundingClientRect().top,
      );
      setStacked(new Set(tops.map(Math.round)).size === tops.length);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** Scroll drives the stacked layout; everywhere else the clock does. */
  const scrollDriven = mode === "touch" && stacked;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(hover: hover)");
    const read = () =>
      setMode(reduced.matches ? "static" : hover.matches ? "pointer" : "touch");
    read();
    reduced.addEventListener("change", read);
    hover.addEventListener("change", read);
    return () => {
      reduced.removeEventListener("change", read);
      hover.removeEventListener("change", read);
    };
  }, []);

  // Don't run the clock for a section nobody is looking at.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (mode === null || mode === "static") return;
    if (scrollDriven || !inView || paused) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % steps.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, [mode, scrollDriven, inView, paused, steps.length]);

  // Stacked: the panel closest to the middle of the viewport is the active one.
  useEffect(() => {
    const el = listRef.current;
    if (!scrollDriven || !el) return;
    const panels = Array.from(el.children);
    const pick = () => {
      const middle = window.innerHeight / 2;
      let best = 0;
      let bestDistance = Infinity;
      panels.forEach((panel, i) => {
        const rect = panel.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - middle);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      setActive(best);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [scrollDriven]);

  // Pointing at a panel beats the clock; leaving hands it back.
  const focus = useCallback(
    (index: number) => {
      if (mode !== "pointer") return;
      setActive(index);
      setPaused(true);
    },
    [mode],
  );
  const release = useCallback(() => setPaused(false), []);

  return (
    <Reveal
      as="ol"
      ref={listRef}
      targets="children"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/70 rounded-4xl overflow-hidden"
    >
      {steps.map((step, i) => {
        // Before the client has measured, every panel renders in its resting
        // state, so the markup is stable between server and first paint.
        const isActive = mode === "static" || (mode !== null && i === active);

        return (
          <li key={step.step} className={step.span}>
            <Link
              href={step.href}
              aria-current={mode === "static" ? undefined : isActive}
              onMouseEnter={() => focus(i)}
              onFocus={() => focus(i)}
              onMouseLeave={release}
              onBlur={release}
              className={`group relative block overflow-hidden bg-ink ${step.aspect}`}
            >
              <img
                src={step.image}
                alt={step.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none ${
                  isActive && mode !== "static" ? "scale-[1.05]" : "scale-100"
                }`}
              />
              {/* Even wash rather than a bottom gradient: the copy sits centred
                  over the frame, so the whole image has to carry it. The active
                  panel lifts its wash to bring the photograph forward. */}
              <div
                className={`absolute inset-0 transition-colors duration-700 ease-[cubic-bezier(0.2,0,0,1)] ${
                  isActive ? "bg-black/20" : "bg-black/45"
                }`}
              />

              {/* Number pinned to the top edge so the centred heading stands
                  alone. */}
              <span className="absolute top-7 md:top-8 inset-x-0 text-center text-[0.7rem] font-semibold tabular-nums tracking-[0.3em] text-white/65">
                {step.step}
              </span>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-8">
                <h3
                  className={`text-[1.6rem] md:text-3xl lg:text-[2rem] font-bold text-white leading-[1.15] tracking-tight text-balance max-w-[15ch] transition-transform duration-700 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none ${
                    isActive && mode !== "static" ? "-translate-y-1.5" : ""
                  }`}
                >
                  {step.title}
                </h3>
                {/* Always in the DOM and readable by crawlers; on screen it
                    follows whichever panel is active. */}
                <p
                  className={`mt-3 max-w-[30ch] text-sm text-white/85 leading-relaxed transition-all duration-700 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none ${
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1"
                  }`}
                >
                  {step.body}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </Reveal>
  );
}
