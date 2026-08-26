# Align by Schbang — Domain Context & Architecture (`CONTEXT.md`)

> **Repository:** `quvoid/Align`  
> **Ecosystem:** Schbang Digital Agency  
> **Purpose:** Premium Creator Marketplace connecting verified influencers with India's top brand briefs (Britannia, NIVEA, Swiggy, Kotak811, Fevicol, Myntra).

---

## 1. Ubiquitous Language & Core Entities

| Domain Term | Description | Source of Truth |
|---|---|---|
| **CreatorProfile** | Represents an influencer's public persona, bio, Instagram/YouTube follower stats, average engagement rate (ER%), and external media kit URL. | `CreatorProfile` in `@/lib/user-store` & Prisma model |
| **BrandBrief** | An active campaign brief published by a brand (e.g. #FevicolKaJod) detailing deliverable formats, budget tiers, and creator requirements. | `BrandItem` in `@/lib/mock-data` & Prisma `Brand` |
| **ApplicationProposal** | A structured pitch submitted by a creator for a specific brand brief, detailing their creative hook, expected fee (₹), and deliverable checklist. | `ApplicationItem` in `@/lib/mock-data` & Prisma `Application` |
| **BudgetTier** | Categorization of influencer size: `Nano` (<10k), `Micro` (10k-50k), `Mid-Tier` (50k-200k), `Macro` (200k-1M), `Mega` (1M+). | `BudgetTier` Enum |
| **DealStatus** | Lifecycle state of a pitch: `PENDING` &rarr; `UNDER_REVIEW` &rarr; `SHORTLISTED` &rarr; `APPROVED` &rarr; `REJECTED` &rarr; `WITHDRAWN`. | `ApplicationStatus` Enum |

---

## 2. Role-Based Access Control (RBAC) Matrix

| Persona | Domain Claim | Accessible Routes | Blocked Routes |
|---|---|---|---|
| **Creator** | All public emails / Google accounts | `/`, `/brands`, `/brands/[slug]`, `/apply/[slug]`, `/dashboard`, `/dashboard/profile`, `/about`, `/contact` | `/admin`, `/admin/*`, `/creators`, `/creators/*` |
| **Brand Manager / Admin** | `@schbang.com` or `admin@schbang.com` | All routes + `/admin`, `/admin/brands`, `/admin/applications`, `/creators`, `/creators/[id]` | None |
| **Guest / Anonymous** | Unauthenticated | `/`, `/brands`, `/brands/[slug]`, `/about`, `/contact`, `/auth/*` | `/dashboard`, `/dashboard/*`, `/admin`, `/admin/*` |

---

## 3. Architecture Invariants

1. **State Isolation**: Creators must never receive or view other creators' submitted applications, private rate quotes, or draft pitches.
2. **Deduplication**: A creator cannot submit duplicate applications for the same brand campaign brief while one is already active.
3. **Edge Gating**: Middleware enforces access control at the HTTP layer, preventing client-side route flash on forbidden portals.
4. **Resilient Dual-Mode Data Layer**: The platform is built to operate seamlessly offline/in client-demo mode via `user-store.ts` while maintaining a 1:1 schema match with the NestJS/Prisma database package.
