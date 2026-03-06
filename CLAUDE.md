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

**Next.js 16.1 App Router** landing page for Mapier (an AI-powered navigation app) with React 19 and TypeScript.

### Project Layout

- `app/` — App Router: root layout, home page, API routes
- `components/` — All React components (all are `'use client'`)
- `public/landing/` — Static assets (stickers, icons, fonts, images)

### Page Composition

The home page (`app/page.tsx`) renders a draggable interactive hero experience:
LandingExperience → LandingHero (icon, title, description, CTA buttons) + WaitlistModal + Draggable stickers

### API Routes

Single endpoint: `POST /api/waitlist` — validates email/name, currently logs to console (no database wired up yet).

### Styling

Tailwind CSS v4 via PostCSS. Global styles and CSS custom properties defined in `app/globals.css`.

**Design System** — CSS custom properties in `:root` of `globals.css`:
- **Brand**: `--color-primary`, `--color-primary-hover`, `--color-primary-accent`, `--color-primary-shadow`
- **Text**: `--color-text` (#1a1a1a), `--color-text-muted`, `--color-text-light`, `--color-text-icon`
- **Surfaces**: `--color-bg` (#fff), `--color-border`, `--color-error`
- **Buttons**: `--color-btn-primary-bg/text`, `--color-btn-secondary-bg/text` (black & white theme)
- **Glass**: `--color-overlay`, `--color-glass`, `--color-glass-hover`, `--color-glass-panel`

**Typography**:
- Display font: **Hornbill** (custom `.ttf`) — Mapier branding and titles only
- Body font: **Nunito** (Google Fonts via `next/font`) — everything else
- Global bold (`font-weight: 700`) on `html, body`

**Visual style**: Black & white UI theme. Sticker-style text with white text-stroke on titles. Responsive breakpoints at `768px` and `390px`.

### Key Libraries

- **Lucide React** — Icon library used across components

### Path Alias

`@/*` maps to the project root (configured in `tsconfig.json`).

### Deployment

Deployed to **Vercel** (Hong Kong region `hkg1`). Config in `vercel.json`.
