"use client";

import { useState } from "react";
import { Reveal } from "cube-motion/react";
import { Play, Quote } from "lucide-react";

/**
 * PLACEHOLDER testimonials. Every name, quote, figure and clip below is dummy
 * content that shows how the section lays out. Replace with real, consented
 * creator testimonials (and their actual video files) before launch.
 */
const DUMMY_VIDEO_SRC = "/hero-bg.mp4";

const VIDEO_TESTIMONIALS = [
  {
    name: "Priya Nair",
    handle: "@priyacooks",
    niche: "Food",
    caption: "Signed my first Britannia brief in under two weeks.",
    poster: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=1000&fit=crop",
  },
  {
    name: "Arjun Mehta",
    handle: "@arjunlifts",
    niche: "Fitness",
    caption: "I pitched the brand myself and heard back in days.",
    poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=1000&fit=crop",
  },
  {
    name: "Sneha Rao",
    handle: "@snehastyles",
    niche: "Fashion",
    caption: "My real numbers got me shortlisted over bigger pages.",
    poster: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=1000&fit=crop",
  },
  {
    name: "Kabir Shah",
    handle: "@kabirtech",
    niche: "Tech",
    caption: "Three brand deals in my first month on Align.",
    poster: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=1000&fit=crop",
  },
] as const;

const QUOTES = [
  {
    quote:
      "I used to wait weeks for an agency to forward my rate card. On Align I pitched Enamor directly and heard back in four days.",
    name: "Meera Iyer",
    detail: "Beauty creator · 42K followers",
  },
  {
    quote:
      "Brands see my actual engagement, not a screenshot someone edited. That's how a 30K page beat 200K pages for the same brief.",
    name: "Rohit Verma",
    detail: "Travel creator · 31K followers",
  },
  {
    quote:
      "My Swiggy payout came through escrow on schedule, with the GST invoice already done. No chasing anyone.",
    name: "Ananya Das",
    detail: "Food creator · 88K followers",
  },
] as const;

function VideoCard({ t }: { t: (typeof VIDEO_TESTIMONIALS)[number] }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="relative shrink-0 w-[70vw] sm:w-auto snap-start aspect-[9/16] overflow-hidden rounded-3xl bg-ink">
      {playing ? (
        <video
          src={DUMMY_VIDEO_SRC}
          poster={t.poster}
          autoPlay
          controls
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video testimonial from ${t.name}`}
          className="group absolute inset-0 w-full h-full text-left"
        >
          <img
            src={t.poster}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-surface/90 text-[11px] font-semibold text-primary">
            {t.niche}
          </span>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-surface/90 shadow-lg transition-transform group-hover:scale-110">
            <Play className="w-5 h-5 ml-0.5 fill-primary text-primary" aria-hidden="true" />
          </span>
          <figcaption className="absolute bottom-0 inset-x-0 p-5 text-white">
            <p className="text-sm font-semibold leading-snug">&ldquo;{t.caption}&rdquo;</p>
            <p className="text-xs text-white/75 mt-2">
              {t.name} · {t.handle}
            </p>
          </figcaption>
        </button>
      )}
    </figure>
  );
}

export function Testimonials() {
  return (
    <div>
      <Reveal
        targets="children"
        className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0"
      >
        {VIDEO_TESTIMONIALS.map((t) => (
          <VideoCard key={t.handle} t={t} />
        ))}
      </Reveal>

      <Reveal targets="children" className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {QUOTES.map((q) => (
          <figure key={q.name} className="rounded-3xl border border-border bg-surface p-7 flex flex-col">
            <Quote className="w-6 h-6 text-lavender" aria-hidden="true" />
            <blockquote className="mt-4 text-sm text-primary leading-relaxed flex-1">{q.quote}</blockquote>
            <figcaption className="mt-6">
              <p className="text-sm font-bold text-primary">{q.name}</p>
              <p className="text-xs text-text-secondary mt-0.5">{q.detail}</p>
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </div>
  );
}
