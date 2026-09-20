"use client";

import { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";
import { NEAT_CONFIG } from "./neat-config";

/**
 * PROTOTYPE — a WebGL animated gradient behind the whole page, to see the
 * direction before deciding on it. Mounted from the root layout.
 *
 * While it's mounted the page's static CSS wash is switched off by the
 * `data-neat` attribute on <html> (see globals.css), so the two never stack.
 * Unmounting restores the wash, which is also what reduced-motion users get.
 *
 * To remove: delete this file and neat-config.ts, drop the <NeatBackground />
 * line from layout.tsx, and `pnpm remove @firecms/neat`.
 */
export function NeatBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gradient = new NeatGradient({ ref: canvas, ...NEAT_CONFIG });
    document.documentElement.dataset.neat = "";

    // Scroll feeds the shader so the field drifts with the page.
    const onScroll = () => {
      gradient.yOffset = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      delete document.documentElement.dataset.neat;
      gradient.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
