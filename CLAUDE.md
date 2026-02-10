# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
yarn install        # Install dependencies
yarn dev            # Start dev server (http://localhost:3000)
yarn build          # Production build
yarn start          # Start production server
yarn lint           # Run ESLint
```

Package manager is **Yarn 4** (managed via Corepack). Run `corepack enable` if Yarn isn't available.

## Architecture

**Next.js 16 App Router** landing page for Mapier (an AI-powered navigation app) with React 19 and TypeScript.

### Project Layout

- `app/` — App Router: root layout, home page, API routes
- `components/` — All React components (all are `'use client'`)
- `public/landing/` — Static assets (stickers, icons, fonts, images)

### Page Composition

The home page (`app/page.tsx`) renders components in this order:
Header → HeroSection → BusinessDescription → FeaturesSection → ProductDetails → DataVisualization → StatusSection → TeamSection → WaitlistForm → Footer

### API Routes

Single endpoint: `POST /api/waitlist` — validates email/name, currently logs to console (no database wired up yet).

### Styling

Tailwind CSS v4 via PostCSS. Global styles and CSS custom properties defined in `app/globals.css`. Color palette centers on blue/purple gradients. Responsive breakpoints use standard Tailwind `sm:`/`md:`/`lg:` prefixes.

### Key Libraries

- **Recharts** — Data visualization charts in `DataVisualization.tsx`
- **Lucide React** — Icon library used across all components

### Path Alias

`@/*` maps to the project root (configured in `tsconfig.json`).

### Deployment

Deployed to **Vercel** (Hong Kong region `hkg1`). Config in `vercel.json`.
