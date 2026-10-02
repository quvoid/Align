"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Play, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PLACEHOLDER testimonials. Every name, quote, figure and clip below is dummy
 * content that shows how the section lays out. Replace with real, consented
 * creator testimonials (and their actual video files) before launch.
 */
const DUMMY_VIDEO_SRC = "/hero-bg.mp4";
const STORY_MS = 6000;

const STORIES = [
  {
    name: "Priya Nair",
    handle: "@priyacooks",
    niche: "Food",
    brief: "Britannia",
    caption: "Signed my first Britannia brief in under two weeks.",
    poster: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop",
  },
  {
    name: "Arjun Mehta",
    handle: "@arjunlifts",
    niche: "Fitness",
    brief: "Enamor",
    caption: "I pitched the brand myself and heard back in days.",
    poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
  },
  {
    name: "Sneha Rao",
    handle: "@snehastyles",
    niche: "Fashion",
    brief: "Myntra",
    caption: "My real numbers got me shortlisted over bigger pages.",
    poster: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
  },
  {
    name: "Kabir Shah",
    handle: "@kabirtech",
    niche: "Tech",
    brief: "Kotak811",
    caption: "Three brand deals in my first month on Align.",
    poster: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop",
  },
] as const;

const QUOTES = [
  {
    quote: "I used to wait weeks for an agency to forward my rate card. On Align I pitched Enamor directly and heard back in four days.",
    name: "Meera Iyer",
    detail: "Beauty creator · 42K followers",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop",
  },
  {
    quote: "Brands see my actual engagement, not a screenshot someone edited. That's how a 30K page beat 200K pages for the same brief.",
    name: "Rohit Verma",
    detail: "Travel creator · 31K followers",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop",
  },
  {
    quote: "My Swiggy payout came through escrow on schedule, with the GST invoice already done. No chasing anyone.",
    name: "Ananya Das",
    detail: "Food creator · 88K followers",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop",
  },
  {
    quote: "The note from the Schbang team told me exactly what to fix. I re-pitched the same week and got shortlisted.",
    name: "Karan Gill",
    detail: "Comedy creator · 57K followers",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=96&h=96&fit=crop",
  },
] as const;

/**
 * Success stories, picked by avatar: the active creator's clip and quote fill
 * one card, and the stories advance on their own (the active avatar's ring
 * shows the time left) unless the visitor hovers, plays a clip or prefers
 * reduced motion. Under it, shorter quotes drift past in a ribbon.
 */
export function Testimonials() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const running = inView && !paused && !playing && !reduced;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setElapsed((ms) => ms + 100), 100);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (elapsed < STORY_MS) return;
    setActive((a) => (a + 1) % STORIES.length);
    setElapsed(0);
  }, [elapsed]);

  const go = (i: number) => {
    setActive((i + STORIES.length) % STORIES.length);
    setElapsed(0);
    setPlaying(false);
  };
  const story = STORIES[active]!;
  const r = 21;
  const circ = 2 * Math.PI * r;

  return (
    <div ref={ref}>
      <div
        className="grid gap-4 rounded-5xl bg-surface p-3 sm:p-4 shadow-card md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <figure className="relative aspect-[4/5] overflow-hidden rounded-4xl bg-ink md:aspect-auto md:min-h-[460px]">
          {playing ? (
            <video src={DUMMY_VIDEO_SRC} poster={story.poster} autoPlay controls playsInline className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play video story from ${story.name}`}
              className="group absolute inset-0 h-full w-full"
            >
              <img key={story.poster} src={story.poster} alt="" className="rise-in absolute inset-0 h-full w-full object-cover" />
              <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-marigold shadow-lift transition-transform group-hover:scale-110">
                <Play className="ml-0.5 h-6 w-6 fill-ink text-ink" aria-hidden="true" />
              </span>
            </button>
          )}
        </figure>

        <div className="flex flex-col p-3 sm:p-6 md:p-8">
          <Quote className="h-8 w-8 text-marigold" aria-hidden="true" />
          <blockquote
            key={story.caption}
            className="rise-in mt-5 text-[26px] sm:text-[34px] font-semibold leading-[1.15] tracking-[-0.03em] text-primary text-balance"
          >
            &ldquo;{story.caption}&rdquo;
          </blockquote>
          <p key={story.handle} className="rise-in mt-5 text-[15px] text-text-secondary">
            <span className="font-semibold text-primary">{story.name}</span> · {story.handle}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-muted text-[13px] font-medium text-primary">{story.niche} creator</span>
            <span className="px-3 py-1 rounded-full bg-marigold-soft text-[13px] font-medium text-marigold-ink">Pitched {story.brief}</span>
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 pt-10">
            <div className="flex items-center gap-1.5 sm:gap-2" role="tablist" aria-label="Creator stories">
              {STORIES.map((s, i) => {
                const on = i === active;
                return (
                  <button
                    key={s.handle}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-label={`Story from ${s.name}`}
                    onClick={() => go(i)}
                    className={cn(
                      "relative grid h-12 w-12 place-items-center rounded-full transition-opacity",
                      on ? "opacity-100" : "opacity-55 hover:opacity-90"
                    )}
                  >
                    <img src={s.poster.replace("w=800&h=1000", "w=96&h=96")} alt="" className="h-10 w-10 rounded-full object-cover" />
                    {on && (
                      <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
                        <circle cx="24" cy="24" r={r} fill="none" stroke="#EFEBE3" strokeWidth="2.5" />
                        <circle
                          cx="24"
                          cy="24"
                          r={r}
                          fill="none"
                          stroke="#E8601C"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeDasharray={circ}
                          strokeDashoffset={reduced ? 0 : circ * (1 - elapsed / STORY_MS)}
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(active - 1)}
                className="press grid h-11 w-11 place-items-center rounded-full bg-muted text-primary hover:bg-[#E6E1D6]"
                aria-label="Previous story"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                className="press grid h-11 w-11 place-items-center rounded-full bg-ink text-white hover:bg-accent-hover"
                aria-label="Next story"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quote ribbon: two copies of the row so -50% loops seamlessly. */}
      <div className="marquee mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <ul className="marquee-track flex w-max animate-[marquee_60s_linear_infinite] motion-reduce:animate-none">
          {[...QUOTES, ...QUOTES].map((q, i) => (
            <li
              key={`${q.name}-${i}`}
              aria-hidden={i >= QUOTES.length || undefined}
              className="mr-4 flex w-[300px] shrink-0 flex-col rounded-4xl bg-surface p-6 shadow-card sm:w-[380px]"
            >
              <p className="flex-1 text-[15.5px] leading-relaxed text-primary">&ldquo;{q.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <img src={q.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                <span>
                  <span className="block text-[14.5px] font-semibold text-primary">{q.name}</span>
                  <span className="block text-[12.5px] text-text-secondary">{q.detail}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
