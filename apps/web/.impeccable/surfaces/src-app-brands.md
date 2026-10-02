---
version: 1
slug: "src-app-brands"
primary_target: "src/app/brands"
related_targets: ["src/app/dashboard","src/app/apply","src/app/admin","src/app/auth","src/app/creators"]
---

## Scope

Creator surfaces (phone-first): /brands, /brands/[slug], /dashboard, /dashboard/profile, /apply/[slug], sign-in popup and /auth/*. Admin surfaces (desktop): /admin, /creators, /creators/[id]. Mode: Persuade for the brief pages, Operate for dashboard, pitch form, admin and sign-in. Home and pricing inherit tokens only.

Audience and job: tier-2/3 creators on mid-range Android find a brief, pitch it, follow its status; Schbang admins review the queue. Constraints: PRODUCT.md (no fake verification or stats, price on the charging button, ?brief= threading).

Chosen direction: Claymorphism, user-pinned from the six-direction demo (apps/web/.impeccable/mocks/align-directions.html, clay column = critique reference). Memorable moment: every control bounces on hover and squishes on tap.

## Direction contract

THESIS: Align feels like friendly clay you can press — soft, puffy, pastel — refusing the white-card influencer marketplace with face photos and lime accents.
OWN-WORLD: Peach ground; clay surfaces in peach, lilac, mint, butter, sky, rose with inner top-left light and bottom-right shade; grape #6E4BF5 is the only filled action; Baloo 2 throughout; 24–32px radii; status as coloured clay pills.
STORY: Creators see live briefs as clay cards, pitch one in a few taps, and watch its status beads fill; admins work one calm clay queue.
FIRST VIEWPORT: Phone /brands: clay header pill, tier chips, "Open briefs" with free-pitches-left, first brief card with brand name at 40px and a full-width grape "Pitch to this brief — free".
FORM: User-pinned claymorphism (outside the dealt list); seed a8e1762c.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
