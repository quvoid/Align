"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A looping clock for the home page demos: counts ticks (100ms by default)
 * from 0 to `total - 1` and wraps, but only while the demo is on screen and
 * the visitor hasn't asked for reduced motion. With reduced motion the clock
 * never runs and `reduced` is true, so the demo can show its finished state.
 */
export function useDemoClock<T extends Element>(total: number, ms = 100) {
  const ref = useRef<T>(null);
  const [tick, setTick] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), {
      threshold: 0.35,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const running = inView && !reduced;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setTick((t) => (t + 1) % total), ms);
    return () => window.clearInterval(id);
  }, [running, total, ms]);

  return { ref, tick, setTick, reduced, running };
}

/** Types `text` out between ticks `from` and `to` (inclusive). */
export function typed(text: string, local: number, from: number, to: number) {
  if (local < from) return "";
  if (local >= to) return text;
  return text.slice(0, Math.ceil(((local - from + 1) / (to - from + 1)) * text.length));
}
