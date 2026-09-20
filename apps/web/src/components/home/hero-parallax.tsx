"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { PAGE_SHELL } from "@/lib/layout";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/** How far each layer travels, in px, across the hero's full exit. */
const COPY_TRAVEL = -72;
const ART_TRAVEL = -168;
/** Peak blur on the copy as it leaves. Kept low; blur is the expensive one. */
const COPY_BLUR = 6;

/**
 * The hero recedes rather than scrolling away.
 *
 * Copy and artwork leave at different rates, so the hero comes apart into
 * layers instead of sliding off as one slab, and the copy blurs and fades as
 * it goes — by the time the next section covers it, it reads as background
 * rather than as content you scrolled past.
 *
 * Both opt-outs matter. Under `prefers-reduced-motion` nothing is subscribed
 * to scroll at all: the layers render as plain elements. Below `lg` the blur
 * is dropped, because animating a filter over a full-width hero is the one
 * thing here that can cost frames on a mid-range phone; the travel stays.
 */
export function HeroParallax({ copy, art }: { copy: ReactNode; art: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const read = () => setWide(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  // Progress runs 0 -> 1 between the hero sitting at the top of the viewport
  // and its bottom edge reaching that same line.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const copyY = useTransform(scrollYProgress, [0, 1], [0, COPY_TRAVEL]);
  const artY = useTransform(scrollYProgress, [0, 1], [0, ART_TRAVEL]);
  const blurPx = useTransform(scrollYProgress, [0, 1], [0, COPY_BLUR]);
  const copyFilter = useMotionTemplate`blur(${blurPx}px)`;

  // The fade is written straight to the node. Passing `opacity` as a motion
  // value in `style` alongside `y`/`filter` is silently dropped here — the
  // transform and filter update while opacity stays pinned at 1 — so this is
  // the one property driven by hand. Gone before the section is, so it never
  // competes with the incoming one for attention.
  const copyRef = useRef<HTMLDivElement>(null);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const node = copyRef.current;
    if (!node) return;
    node.style.opacity = String(Math.max(0, 1 - progress / 0.72));
  });

  const grid = `${PAGE_SHELL} grid grid-cols-1 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-8 items-center`;

  if (reduced) {
    return (
      <div ref={ref} className={grid}>
        {copy}
        {art}
      </div>
    );
  }

  return (
    <div ref={ref} className={grid}>
      <motion.div
        ref={copyRef}
        style={{
          y: copyY,
          ...(wide ? { filter: copyFilter } : null),
        }}
        className="will-change-[transform,opacity]"
      >
        {copy}
      </motion.div>
      <motion.div style={{ y: artY }} className="will-change-transform">
        {art}
      </motion.div>
    </div>
  );
}
