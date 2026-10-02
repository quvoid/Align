---
name: Align by Schbang
description: Friendly clay you can press — the creator side of Schbang's brand briefs.
colors:
  peach-ground: "#FFE8DC"
  cream-clay: "#FFF7F1"
  quiet-peach: "#FCE3D5"
  grape-ink: "#2B2146"
  dusk-violet: "#574A78"
  grape: "#6E4BF5"
  grape-deep: "#5B39E6"
  clay-peach: "#FFC7AA"
  clay-lilac: "#DCD1FF"
  clay-mint: "#BDEFD6"
  clay-butter: "#FFEFA3"
  clay-sky: "#CDE6FF"
  clay-rose: "#FFD2DD"
  clay-cloud: "#EDE7F3"
  success: "#1F7A4A"
  error: "#B42346"
typography:
  display:
    fontFamily: "Baloo 2, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Baloo 2, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Baloo 2, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.15
  body:
    fontFamily: "Baloo 2, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "-0.005em"
  label:
    fontFamily: "Baloo 2, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  field: "16px"
  button: "24px"
  card: "32px"
  slab: "40px"
  pill: "9999px"
spacing:
  gutter: "16px"
  card-padding: "24px"
  stack: "24px"
  section: "40px"
components:
  button-primary:
    backgroundColor: "{colors.grape}"
    textColor: "{colors.cream-clay}"
    rounded: "{rounded.button}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.grape-deep}"
  button-butter:
    backgroundColor: "{colors.clay-butter}"
    textColor: "{colors.grape-ink}"
    rounded: "{rounded.button}"
    padding: "12px 20px"
  button-cream:
    backgroundColor: "{colors.cream-clay}"
    textColor: "{colors.grape-ink}"
    rounded: "{rounded.button}"
    padding: "12px 20px"
  chip:
    backgroundColor: "{colors.peach-ground}"
    textColor: "{colors.grape-ink}"
    rounded: "{rounded.pill}"
    padding: "10px 16px 8px"
  chip-selected:
    backgroundColor: "{colors.grape}"
    textColor: "{colors.cream-clay}"
  card:
    backgroundColor: "{colors.cream-clay}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding}"
  input:
    backgroundColor: "{colors.cream-clay}"
    textColor: "{colors.grape-ink}"
    rounded: "{rounded.field}"
    height: "48px"
    padding: "0 16px"
---

# Design System: Align by Schbang

## Overview

**Creative North Star: "Friendly clay you can press"**

Align's creator and admin surfaces are made of soft, puffy clay: a warm peach ground, pastel slabs lit from the top-left with a soft shade at the bottom-right, and one grape colour for the action you came to take. Every control is physical — it lifts slightly when you hover and squishes when you tap — so a creator on a mid-range phone always knows what is pressable. The world was picked by the user from a six-direction demo over the incumbent pearl/plum look and the category's white-card-with-face-photo default.

Density is comfortable and phone-first for creators (one column, big tap targets, a sticky pitch bar on brief pages) and calmer, wider grids for the desktop admin. Brands are represented by type, never by logos: the brief's name set huge on its own pastel slab.

**Key Characteristics:**
- Peach ground (#FFE8DC), cream clay surfaces, pastel clay fills per brief and per status.
- Grape (#6E4BF5) is the only filled action colour and the selected state.
- Depth comes entirely from layered clay shadows; surfaces have no borders.
- Baloo 2 throughout — rounded, chunky, with a Devanagari companion for the planned Hindi UI.
- Bounce on hover, squish on tap, disabled under reduced motion.

## Colors

A warm peach field with five pastel clays for identity and status, and a single saturated grape for action.

### Primary
- **Grape** (#6E4BF5): the one filled action per view (Pitch to this brief, Send pitch, New brief, Shortlist), the selected chip or tab, completed status beads. Hover deepens to **Grape Deep** (#5B39E6).

### Secondary (clay fills)
- **Clay Mint** (#BDEFD6), **Clay Lilac** (#DCD1FF), **Clay Sky** (#CDE6FF), **Clay Butter** (#FFEFA3), **Clay Rose** (#FFD2DD): brief slabs (assigned by `clayFillFor(slug)`, so a brief keeps its colour everywhere), stat tiles, icon discs, status pills. **Clay Peach** (#FFC7AA) exists but is not used for brief cards. **Clay Cloud** (#EDE7F3) marks withdrawn or paused things.

### Neutral
- **Peach Ground** (#FFE8DC): the page.
- **Cream Clay** (#FFF7F1): cards, inputs, chips, the navbar, sheets.
- **Quiet Peach** (#FCE3D5): dividers (2px) and quiet panels.
- **Grape Ink** (#2B2146): all primary text, and the dark band behind white text on the home and pricing pages.
- **Dusk Violet** (#574A78): secondary text and placeholders (≥4.5:1 on cream and peach).

### Named Rules
**The One Grape Rule.** Grape fills one action per view plus the current selection. Everything else is a clay fill with ink text.

**The Same Words Rule.** A pitch status has one label and one colour on both sides (`lib/status.ts`): Pending = butter, In review = sky, Shortlisted = lilac, Approved = mint, Not selected = rose, Withdrawn = cloud.

## Typography

**Display Font:** Baloo 2 (with -apple-system, Segoe UI, Roboto)
**Body Font:** Baloo 2

**Character:** One rounded, heavy-bottomed face for everything; hierarchy comes from size and the jump from 400 to 800, never from a second family.

### Hierarchy
- **Display** (800, 44px phone / 60px desktop, 0.95): page titles — "Open brand briefs", "Hi, Rohan", "Admin". Brief names on the brief page go to 52–72px.
- **Headline** (800, 30px, 1.1): section titles ("Your pitches", "More open briefs").
- **Title** (800, 22–34px, 1.0–1.15): card titles; brand names on brief cards at 34px.
- **Body** (400, 15–18px, 1.6): descriptions and pitches, kept to roughly 65ch.
- **Label** (600–700, 12–14px): chips, field labels, stat labels, meta lines.

### Named Rules
**The Name Is The Logo Rule.** A brand appears as its name set big on its clay slab. No logo images until real brand marks are supplied.

## Layout

Container `mx-auto px-4` (16px gutter) with `pt-8 sm:pt-12` page tops. Creator pages are a single column on phones; the brief page becomes `minmax(0,1fr) 380px` with a sticky pitch card at `lg`, and phones get a fixed bottom pitch bar. Grids step 1 → 2 (`md`) → 3 (`lg`) columns with 24px gaps; stat tiles are 2 → 4. Section rhythm is ~40px between groups, 20–24px inside a card.

## Elevation & Depth

Depth is clay, not borders: every raised surface carries a soft violet drop below plus inner light top-left and inner shade bottom-right. Pressed-in things (inputs, fact tiles, empty states) use an inset well instead.

### Shadow Vocabulary
- **clay** (`0 18px 30px -18px rgb(84 58 200 / .45), inset -7px -9px 16px rgb(43 33 70 / .12), inset 7px 9px 16px rgb(255 255 255 / .7)`): cards, slabs, navbar, sheets.
- **clay-sm** (`0 9px 14px -9px rgb(84 58 200 / .4), inset -3px -4px 8px rgb(43 33 70 / .1), inset 3px 4px 8px rgb(255 255 255 / .9)`): chips, pills, small buttons, icon discs.
- **clay-btn** (`0 14px 22px -12px rgb(84 58 200 / .75), inset -5px -7px 12px rgb(0 0 0 / .24), inset 5px 7px 12px rgb(255 255 255 / .35)`): grape buttons; **clay-btn-press** on `:active`.
- **clay-well** (`inset 3px 4px 8px rgb(43 33 70 / .12), inset -3px -4px 8px rgb(255 255 255 / .85)`): inputs, fact tiles, empty and quiet states.

### Named Rules
**The No Border Rule.** Clay surfaces never take a border; separation comes from the shadow and the fill. Dividers inside a card are 2px Quiet Peach.

## Shapes

Everything is rounded and soft: inputs 16px, buttons 24px, cards 32px, hero slabs, sheets and auth cards 40px, chips and pills fully round, icon discs circular. No sharp corners anywhere in the clay surfaces.

## Components

### Buttons
- **Shape:** 24px (16px for `sm`).
- **Primary (grape):** Grape fill, white 15px bold text, `clay-btn` shadow; hover Grape Deep.
- **Butter / Cream:** butter or cream clay with ink text and `clay-sm`, for secondary actions.
- **Ghost:** text link with underline on hover.
- **Hover / Focus / Active:** `.clay-press` lifts 2px on hover and squishes to `translateY(1px) scale(.96)` on tap with the overshoot curve `cubic-bezier(.3,1.7,.45,1)`; focus is a 3px grape outline offset 3px; disabled at 55% opacity; all motion off under `prefers-reduced-motion`.

### Chips
- **Style:** peach or cream pill, ink 14px bold, `clay-sm`.
- **State:** selected chips turn grape with white text and `clay-btn`; filters are single-select with `aria-pressed`.

### Cards / Containers
- **Corner Style:** 32px.
- **Background:** cream clay, or a clay fill for brief cards and stat tiles.
- **Shadow Strategy:** `clay`; nested items use `clay-sm` or `clay-well`, never a second full `clay`.
- **Internal Padding:** 20–24px.

### Inputs / Fields
- **Style:** cream (or peach inside a cream panel), no border, `clay-well`, 48px tall, 16px radius, labels 14px semibold above.
- **Focus:** 3px grape ring at 45%; errors use a 3px Error ring at 45% plus a message.

### Navigation
- A floating cream pill bar inset 12px from the edges, `clay` shadow, logo "Align" 26px 800 with "by Schbang". Desktop links are 15px semibold Dusk Violet → ink on hover; the signed-in user is a butter clay pill with initials; the primary CTA is a grape pill. On phones a butter clay menu button opens a cream clay sheet.

### Status Beads (signature)
A pitch shows four beads — Sent, In review, Shortlist, Decision. Done beads are grape with `clay-btn`, the current one is a larger butter bead (rose if not selected), future beads are pressed-in wells. The admin's note sits under them as a lilac speech-bubble card.

## Do's and Don'ts

### Do:
- **Do** give each brief its colour through `clayFillFor(slug)` so it matches across listing, brief page and admin.
- **Do** keep one grape filled action per view, and put the price on the button that charges.
- **Do** use the shared status labels and colours from `lib/status.ts` on both creator and admin screens.
- **Do** keep phone tap targets at 44px or more and the pitch action reachable (sticky bar on brief pages).

### Don't:
- **Don't** put borders on clay surfaces or mix in flat, bordered cards.
- **Don't** use peach clay for brief cards — it melts into the peach ground.
- **Don't** show brand logos from stock photos, or a verified badge for anyone Schbang hasn't verified.
- **Don't** add a second accent colour for actions; status colours are clay fills, never filled buttons.
- **Don't** use dark ink bands on creator or admin screens; they remain only on the home and pricing pages.
