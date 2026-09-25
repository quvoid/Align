# Launch day: creator flow, CTAs, SEO, and the 2,000-login plan

This is the operating document for the public launch. It records decisions that
are not obvious from the code, so anyone touching the creator flow can see why
things are named and ordered the way they are.

## 1. The one path every creator takes

```
Home ─► Open briefs (free, indexed) ─► Brief page ─► "Pitch to this brief"
                                                          │
                       ┌──────────────────────────────────┘
                       ▼
                  /pricing?brief=<slug>  ─► pick plan ─► /join (sign in popup → pay)
                       │
                       ▼
                  /apply/<slug>  (form)  ─► /dashboard (status + checklist)
```

Design rules that fall out of this:

- **Nothing is gated until the pitch.** Home, `/brands`, `/brands/<slug>`,
  `/pricing` are public and indexable. That is what Google and paid traffic
  land on; a login wall there kills conversion and crawl.
- **The brief travels with the creator.** `?brief=<slug>` is carried from
  brief → pricing → join → apply so a creator who arrived from an Instagram
  ad for the Enamor brief ends up on the Enamor form, not a generic dashboard.
- **Sign-in is a popup, not a page.** `SignInModalProvider` opens over the
  page on `/join`, `/apply`, `/dashboard`. Google is the fastest path; the
  demo passkeys stay for internal use.
- **Dashboard opens with a 3-step checklist** (plan → media kit → first
  pitch) and disappears once all three are done. New creators always know
  the next click.

## 2. Pricing

Defined once in `apps/web/src/lib/plans.ts`. Everything else reads from it.

| Plan | Price | Period | Positioning |
|---|---|---|---|
| All-access (recommended) | ₹200 | one-time, never renews | "Every brand, now and in future. Launch price locked for life." |
| Monthly | ₹50 | per month, cancel anytime | Low-commitment entry; the pricing page shows ₹200 = 4 months |

- **Free until the free pitches run out** (the LinkedIn InMail / Tinder
  swipes model): every creator gets `FREE_PITCHES` (3) pitches before a plan
  is needed. `canPitch()` in `user-store.ts` gates `/apply` and the brief
  page's pitch CTA; it counts the creator's applications.
- **Do not claim "no commission" / "keep 100%"** anywhere. Align will be
  charging, so that copy was removed site-wide on 2026-09-25.
- `activateMembership()` in `user-store.ts` is the only seam for a payment
  gateway. `/join` currently simulates a successful order. When Razorpay (or
  Cashfree) lands: create the order server-side, open the checkout, and call
  `activateMembership(email, plan, gatewayOrderId)` from the verified
  webhook — not from the client.

## 3. CTA naming rules (SEO + media-buyer lens)

A CTA is a promise about the next screen. The label has to say **what
happens** and, where money is involved, **how much**. Rules used across the
app:

1. **Verb + object, no metaphors.** "Browse open briefs", not "Explore
   opportunities". "Pitch to this brief", not "Apply for this campaign".
2. **Put the price on the button that charges.** "Get all-access for ₹200",
   "Start for ₹50/month", "Pay ₹200". Nobody should discover a price on the
   next screen.
3. **Use the keyword the visitor searched.** Our head terms are *brand
   collaboration*, *paid campaigns for creators*, *brand briefs*, *Instagram
   sponsorship India*. "Brief" is the noun in every primary CTA and H1 so the
   on-page text matches ad copy and search intent (Quality Score + CTR).
4. **One primary CTA per viewport.** Secondary actions are text links
   ("Or ₹50/month, cancel anytime").
5. **Confirmation copy is a receipt, not a celebration.** "Invite sent to
   Neha Sharma", not "Dispatched! ⚡".

Current primary CTAs:

| Surface | Label | Goes to |
|---|---|---|
| Navbar (anonymous) | Join for ₹200 | /pricing |
| Home hero | Browse open briefs · Join for ₹200 — all brands, forever | /brands · /pricing |
| Home pricing (last section) | Browse open briefs · Get all-access for ₹200 · Start for ₹50/month | /brands · /join?plan=… |
| Brief page (free pitches left) | Pitch to this brief — free | /apply/slug |
| Brief page (free pitches used) | Pitch to this brief — from ₹50/month | /pricing?brief=slug |
| Brief page (member) | Pitch to this brief | /apply/slug |
| Pricing cards | Get all-access for ₹200 / Start for ₹50/month | /join?plan=… |
| Checkout | Pay ₹200 / Pay ₹50 for the first month | activates plan → apply or profile |
| Dashboard | Find a brief to pitch · Edit media kit | /brands · /dashboard/profile |

For ad landing: send paid traffic to `/brands/<slug>?utm_…` for a specific
brand, or `/pricing` for generic "get paid by brands" campaigns. Both are
public, both carry a priced CTA above the fold.

## 4. SEO surface

- `sitemap.xml`: home, /brands, /pricing, each brief, about/contact/legal.
  Gated routes are excluded on purpose.
- `robots.txt`: disallows /admin, /dashboard, /apply, /join, /creators
  (admin-only), /auth, /api.
- Structured data:
  - Root layout: `Organization`, `WebSite` (+ SearchAction).
  - Home: `FAQPage` (now includes the pricing question).
  - `/brands`: `ItemList` of every brief.
  - `/brands/<slug>`: `BreadcrumbList` + `Product`/`Offer`, plus per-brief
    `<title>`, description, canonical, OG image via
    `brands/[slug]/layout.tsx`.
  - `/pricing`: `Product` with two `Offer`s (monthly has a
    `UnitPriceSpecification`), `FAQPage`, `BreadcrumbList`.
- Titles follow *{Brand} Creator Campaign Brief — {tier}, {industry}* so
  every brief page can rank for "{brand} influencer campaign".

Validate after deploy with Google's Rich Results Test on `/`, `/pricing`, and
one brief URL.

## 5. Handling 2,000 sign-ins on day one

What is already in place:

- Public pages are static/client-rendered with no per-request server work;
  they can sit behind a CDN cache. This is where the bulk of traffic lands.
- `SessionProvider` has `refetchOnWindowFocus={false}` and no polling, so
  2,000 open tabs do not hammer `/api/auth/session`.
- Sign-in is Google OAuth (JWT sessions, no session table) — no DB write per
  login.
- Membership, profile and pitches are stored client-side (`user-store.ts`)
  for the demo, so the app itself has no write bottleneck.

Load test (2026-09-25, `next start` on one 16-core machine, autocannon,
2,000 concurrent connections × 20s per route, gzip on):

| Route | req/s | p99 | errors |
|---|---|---|---|
| `/` | 800 | 3.2s | 0 |
| `/brands`, `/pricing`, `/brands/<slug>` | ~1,300 | ~1.9s | 0 |
| `/api/auth/session` | 1,200 | 2.6s | 0 |
| Credential login (100 at once, 50 parallel) | 14.5 logins/s | p95 4.9s | 0 |

That is one Node process with every connection re-requesting instantly —
far harsher than 2,000 people reading pages. On Vercel the static routes are
served from the CDN and never reach Node. Fixes that came out of it:

- `/brands/[slug]` was rendered per request (69 req/s, 3.7k timeouts); now
  prerendered via `generateStaticParams` in its layout.
- Password hashing moved from `bcryptjs` to `@node-rs/bcrypt`. bcryptjs ran on
  the JS thread: a login burst managed 3.9 logins/s and stalled *unrelated*
  requests for up to 11s. Now 14.5 logins/s, other requests unaffected.
- Remaining login ceiling is the DB (`connection_limit=1` per instance, by
  design for the Supabase transaction pooler) — scale is horizontal.

What has to be true before real money and real users:

1. **Payments.** Wire the gateway behind `activateMembership()` and move
   membership + pitches to the database (`packages/database` already has the
   Prisma schema). Verify by webhook, never trust the client.
2. **Google OAuth.** Publish the OAuth consent screen (unverified apps cap at
   100 users) and add the production domain to authorised redirect URIs.
3. **Hosting.** Deploy `apps/web` to Vercel or equivalent with the CDN in
   front; set `NEXT_PUBLIC_SITE_URL`, `AUTH_SECRET`, `GOOGLE_CLIENT_*`,
   `RESEND_API_KEY` and `EMAIL_FROM` (first-sign-in OTP emails; the sender
   domain must be verified in Resend, and without a key production sign-ups
   cannot finish — `/api/auth/otp/send` returns 502).
4. **Rate limits.** Put a limit on `/api/auth/callback/credentials` and the
   future order-create endpoint (10/min/IP is plenty).
5. **Watch these on the day:** OAuth error rate, checkout drop-off between
   `/pricing` and `/join`, and `/apply` submissions per hour. Those three
   numbers tell you whether the funnel is healthy.
6. **A queue is not needed** at 2,000/day. It becomes a conversation at
   ~2,000/minute.

## 6. Demo accounts

| Passkey | Email | Role | Membership |
|---|---|---|---|
| Schbang Admin Lead | admin@schbang.com | ADMIN | n/a |
| Creator: Rohan Joshi | rohan.creates@gmail.com | CREATOR | All-access (seeded) |
| Aanya Sen | aanya.beauty@gmail.com | CREATOR | All-access (seeded) |

Any other email signs in as a creator with **no** plan, which is the state a
real day-one visitor is in — use one of those to walk the paid flow end to
end.
