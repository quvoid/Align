# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Creators (primary).** Indian nano and micro creators (1K–100K followers),
  largely in tier-2/3 cities, mostly on mid-range Android phones. Their job:
  find a live brand brief that fits their niche, pitch an idea with their real
  numbers, and follow it to a decision and a deal. Creator screens are built
  phone-first.
- **Schbang admins / brand managers.** Work on desktop. Publish and pause
  briefs, review the pitch queue, shortlist/approve/reject, leave notes the
  creator sees, and scout the creator roster.
- **Anonymous visitors.** Arrive from paid ads and search on a specific brief
  page or `/brands`; nothing is gated until they pitch.

## Product Purpose

Align by Schbang connects creators with live, Schbang-managed brand briefs.
Creators pitch; Schbang's team reviews and shortlists on behalf of client
brands. Success is creators sending pitches that the team can act on, and both
sides seeing the same status as it moves.

## Positioning

Agency-embedded, not a rented discovery database: the briefs are real Schbang
client work from day one (Britannia, Fevicol, Enamor, Swiggy, Kotak811,
Myntra), and every pitch is read by the Schbang team rather than matched by an
algorithm.

## Operating Context

- Creator funnel: brief page → `/pricing?brief=` → `/join` → `/apply/<slug>`
  (6-step pitch form) → `/dashboard`. The `?brief=` slug must survive the
  whole path.
- Pitch lifecycle: Pending → Under review → Shortlisted → Approved / Rejected
  (set by admins); Withdrawn (creator only, before a decision). Admin notes
  appear on the creator's dashboard.
- Client demos run through the one-click demo logins (Schbang Admin Lead,
  Creator: Rohan Joshi).
- CTA copy follows `docs/LAUNCH-DAY.md` §3: verb + object, the price on the
  button that charges, "brief" as the noun.

## Capabilities and Constraints

- **Pricing (confirmed: current app model).** 3 free pitches, then ₹200 once
  (all-access, every current and future brief) or ₹50/month. Checkout is
  simulated. Never say "no commission" or "keep 100%".
- All product data is in Postgres, served by `apps/web` route handlers.
- Public brief pages are indexable and statically rendered; everything behind
  sign-in is excluded from search.
- **Not built yet:** Schbang verification flow (schema fields exist), deal
  agreements / deliverable tracking / payouts after approval, WhatsApp/phone
  sign-in, Instagram/YouTube connect, video pitches, Hindi/regional UI.
- **Undecided:** the pitch-deck model (free pitching forever, ₹200 one-time
  Verified badge, first 1,000 creators free) versus the current model.

## Brand Commitments

The name **Align** and the **"by Schbang"** endorsement are fixed. Everything
visual — wordmark treatment, palette, type, components — is open.

## Evidence on Hand

- Real: six live briefs (copy in `apps/web/src/lib/mock-data.ts` and the
  `Brand` table). Their "logos" are Unsplash stock photos, not the brands'
  real marks.
- Photography: `apps/web/public/steps/*.webp`, `apps/web/public/hero-creator-collage.webp`.
- **Absent — do not fabricate:** real testimonials, creator earnings, deal
  counts, "300+ brands", "₹1M+ earned" (the home page figures and testimonials
  are marked PLACEHOLDER in code). No creator is Schbang-verified yet, so no
  surface may show a verified badge or "verified analytics" for real
  creators. Follower numbers are self-reported.

## Product Principles

1. **The brief is the unit.** Every creator screen leads to a brief or a pitch.
2. **Honest trust.** Never show verification, results or social proof that
   isn't real; label self-reported numbers as such.
3. **Phone first for creators, desk speed for admins.**
4. **One status, both sides.** What an admin decides is what the creator sees,
   in the same words.
5. **No price surprises.** The price is on the button that charges.

## Accessibility & Inclusion

- Creators are on mid-range Android phones with variable connectivity (from
  the pitch deck): keep pages light and tap targets large.
- Hindi and regional-language UI is planned (pitch deck): layouts must
  tolerate longer strings and Devanagari script.
