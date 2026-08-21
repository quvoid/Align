# Align — The Schbang Creator & Brand Collaboration Platform

> Where Creative Reach Meets Brand Purpose.

Align is an enterprise-grade brand collaboration marketplace engineered for **Schbang**. It connects digital creators, influencers, and talent managers with marquee brand briefs across FMCG, Fashion, FinTech, Tech, Beauty, and Lifestyle.

---

## 🌟 Key Features

- **Brand Brief Catalogue**: Public discovery directory with instant filters for industry (*Food, Fashion, Tech, FinTech, Beauty, Lifestyle*) and budget tiers (*Nano to Mega*).
- **Slide-Over Brief Drawer**: Seamless flyout drawer displaying full campaign deliverables, creator eligibility criteria, and agency contact details.
- **6-Step Application Workflow**: Guided creator proposal submission capturing verified analytics across Instagram, YouTube, and Facebook.
- **Creator Dashboard**: Real-time status tracking (*Pending, Under Review, Shortlisted, Approved*) and creator profile metrics management.
- **Admin Command Center**: Agency portal for Schbang brand managers to publish new briefs, review incoming creator pitches, inspect social metrics, and approve deals.
- **Cinematic Motion Hero**: Motion design background video integrated with fluid typography and micro-animations.

---

## 🏗️ Tech Stack

- **Monorepo**: Turborepo 2.x + pnpm workspaces
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Plus Jakarta Sans typography
- **Backend API**: NestJS 11, Helmet, Throttler, Class-Validator, Compression
- **Database & ORM**: PostgreSQL 16, Prisma 6 ORM with multi-tier composite indexing
- **Authentication**: NextAuth v5 + JWT token rotation

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone git@github.com:quvoid/Align.git
cd Align
pnpm install
```

### 2. Start PostgreSQL & Redis
```bash
docker compose up -d
```

### 3. Generate Database & Seed Data
```bash
pnpm db:push
pnpm db:seed
```

### 4. Run Development Servers
```bash
pnpm dev
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001/api/v1`

---

## 📄 License
Private repository — © 2026 Schbang Digital Solutions. All rights reserved.
