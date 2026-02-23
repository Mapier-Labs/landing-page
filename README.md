# Mapier Landing Page

## Prerequisites

- Node.js 22 LTS (required — v25 is incompatible with Next.js 16 Turbopack)
- [Corepack](https://nodejs.org/api/corepack.html) enabled (`corepack enable`)
- Yarn 4 (automatically managed via `packageManager` field in `package.json`)

## Local Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Lint
yarn lint
```

Visit [http://localhost:3000](http://localhost:3000) to view the page.

To preview on a mobile device, connect to the same WiFi and use the Network URL shown in the terminal output.

## Architecture

**Next.js 16 App Router** with React 19, TypeScript, and Tailwind CSS v4.

### Page Composition

The landing page (`app/page.tsx`) renders a draggable interactive hero experience:

- **LandingExperience** — main orchestrator, manages draggable stickers and waitlist modal state
- **LandingHero** — icon, title, description, and CTA buttons
- **WaitlistModal** — modal overlay triggered by "Join the Waitlist" button
- **Draggable** — generic wrapper for drag-and-drop elements (desktop only)

### Waitlist Flow

1. User clicks "Join the Waitlist" button
2. Modal opens with Name + Email form
3. Form submits to `POST /api/waitlist`
4. Success/error states displayed in modal

**API Route** (`app/api/waitlist/route.ts`):
- Validates email format and required fields
- Currently logs submissions to console
- **TODO**: Connect to a storage backend (database, Airtable, Vercel KV, etc.) — replace the `console.log` on line 28
- **TODO**: Add rate limiting for production (e.g. Vercel Edge Middleware or Upstash)

### Mobile Responsive

- Mobile breakpoint at `768px`, small screen at `390px`
- Phone sticker and two decorative stickers (Group 2619, Group 2620) hidden on mobile
- Buttons stacked vertically, content centered
- Dragging disabled on mobile, links remain tappable
- Waitlist modal shares the same design across desktop and mobile

### Key Files

| File | Purpose |
|------|---------|
| `app/globals.css` | All styles including mobile breakpoints and waitlist modal |
| `components/landing/LandingExperience.tsx` | Main component, waitlist state management |
| `components/landing/LandingHero.tsx` | Hero content and CTA buttons |
| `components/landing/WaitlistModal.tsx` | Waitlist modal component |
| `components/landing/landingConfig.ts` | Sticker positions/sizes and config constants |
| `hooks/useDraggableLanding.ts` | Desktop drag-and-drop behavior |
| `app/api/waitlist/route.ts` | Waitlist API endpoint |

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Automatic deployment complete

Or use Vercel CLI:

```bash
npm install -g vercel
vercel
```

## Contact

- GitHub: [Mapier-AI/Mapier-Landing-Page](https://github.com/Mapier-AI/Mapier-Landing-Page)
