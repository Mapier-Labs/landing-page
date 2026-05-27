# Dazzi OG card — design hand-off

You're tuning the OG card for shared Dazzi events. This doc covers what to
edit, how to preview, what's wired up, and the constraints you'll run into.

When you're happy with the UI, ping Mark and we plug it back into the mobile
app — no native work needed on your side. The app already builds the right
share URL; the URL serves your card.

---

## TL;DR

| You want to…         | Open                                     |
| -------------------- | ---------------------------------------- |
| Preview the card     | `http://localhost:3000/og-preview/dazzi` |
| Edit the design      | `lib/og/dazzi/DazziTicketCard.tsx`       |
| Change mock data     | `lib/og/dazzi/mockDazziOgPreview.ts`     |
| Swap the frame asset | `public/og/dazzi-ticket-frame.png`       |

Don't touch anything outside `lib/og/dazzi/` and `public/og/` unless you know
why. The fetch, share-HTML, and deeplink plumbing is done.

---

## Pipeline (end-to-end)

```
user taps Share in app
  ↓
RNShare.open(url: https://www.mapier.ai/share/dazzi/<eventId>)
  ↓
iMessage / WhatsApp / etc. unfurls the URL → GET /share/dazzi/<eventId>
  ↓
returns HTML with <meta property="og:image" content=".../api/og/dazzi/<eventId>">
  ↓
unfurler GETs /api/og/dazzi/<eventId> → renders DazziTicketCard.tsx → PNG
  ↓
iMessage shows the PNG. Tap → deeplink mapier://dazzi/<eventId> opens the app.
```

Three URLs, one source of truth (`DazziTicketCard.tsx`):

- **`/api/og/dazzi/<id>`** — raw PNG. This is what unfurlers fetch.
- **`/share/dazzi/<id>`** — HTML wrapper with OG meta + JS deeplink redirect.
- **`/og-preview/dazzi`** — local-only review page with both preview variants.

iOS Universal Links: `apple-app-site-association` includes `/share/dazzi/*`,
so the URL opens the app directly when installed (no Safari hop).

---

## Files

```
lib/og/dazzi/
├── DazziTicketCard.tsx       ← THE design. React → PNG via next/og.
├── types.ts                  ← DazziOgData shape (what the card consumes)
├── fetchDazziShareData.ts    ← Supabase fetch. Don't touch.
├── formatDazziOgDateTime.ts  ← Date/time formatter
├── mockDazziOgPreview.ts     ← Preview fixtures. Edit to test edge cases.
└── README.md                 ← This file

app/
├── api/og/dazzi/[id]/route.tsx   ← Picks fixture vs Supabase, calls renderer
├── share/dazzi/[id]/route.ts     ← Share HTML + OG meta + deeplink
└── og-preview/dazzi/page.tsx     ← Browser-side preview page

public/og/
└── dazzi-ticket-frame.png    ← Ticket chrome (scallops, border, perforation)
```

---

## Iterating on the design

1. `yarn dev` from `landing-page/` root.
2. Open `http://localhost:3000/og-preview/dazzi`. Both variants render
   side-by-side (12 RSVPs + 3 avatars; zero RSVPs / CTA-only).
3. Edit `DazziTicketCard.tsx`. Save. Hard-refresh the preview page
   (`Cmd+Shift+R`) — Next won't auto-reload an image URL because the browser
   caches it.
4. To see raw PNG with no page chrome, click "Open raw →" on the preview page,
   or hit `/api/og/dazzi/preview` directly.

To test layout against edge cases (very long title, no POI, no avatars, etc.),
add a new fixture in `mockDazziOgPreview.ts` and register it in
`/app/og-preview/dazzi/page.tsx` `PREVIEWS` array. Also wire the same fixture
ID into `/api/og/dazzi/[id]/route.tsx` and `/share/dazzi/[id]/route.ts`.

### The `LAYOUT` constant

`DazziTicketCard.tsx` opens with measured constants derived from the frame
asset. If you swap the frame PNG, re-measure (script below) and update these:

```ts
const LAYOUT = {
  stubWidth: 296, // px in 1200-wide canvas
  mainPad: { top: 86, right: 32, bottom: 89, left: 80 },
  stubPad: { top: 86, right: 81, bottom: 89, left: 29 },
};
```

These keep content inside the blue inner borders of the frame. Wrong values
= text bleeds onto the scalloped edges or under the perforation.

Re-measure with a one-shot Python:

```bash
python3 - <<'PY'
from PIL import Image
img = Image.open("public/og/dazzi-ticket-frame.png").convert("RGB")
w, h = img.size
def is_blue(p):
    r, g, b = p
    return b > r and b > g and b > 50 and r < 180 and g < 180
# Columns with continuous blue = vertical inner borders
counts = {x: sum(1 for y in range(40, h-40) if is_blue(img.getpixel((x, y)))) for x in range(60, w-50)}
hits = [(x, c) for x, c in counts.items() if c > 80]
print("native:", w, "x", h)
print("vertical blue cols:", hits)
PY
```

The high-count columns are your inner borders. Convert native → canvas with
`canvas_x = native_x * (1200 / native_width)`.

---

## Satori gotchas

`next/og` renders React via Satori. It's strict and quiet about it. Common
mistakes:

- **Every `<div>` with children needs `display: "flex"`.** No exceptions.
  Satori throws otherwise.
- **No `whiteSpace: "nowrap"` without an explicit `width`** on the flex
  parent, or text overflows silently.
- **Rotated text keeps its unrotated width** in flow layout. A 200px-wide
  title transformed `rotate(-90deg)` still occupies a 200px-wide flex slot.
  The stub uses `position: absolute` to dodge this.
- **No external fonts via `fetch()` to `localhost`** — the route runs under
  `runtime = "nodejs"` and reads fonts directly from `public/fonts/` via
  `fs/promises`. Don't switch to `runtime = "edge"`.
- **`zIndex` must be unitless number**, `borderRadius` must have `px`.
- **Images need absolute URLs.** The card passes the origin in via `frameUrl`.
- **No CSS variables, no `gap` shorthand bugs around `1px`, no `box-shadow`
  blur > ~20.** Test, don't trust.

If the API returns 500, check the Next dev terminal — Satori errors are
verbose and tell you exactly which div is missing `display: flex`.

---

## Fonts

Bundled local TTFs only — `public/fonts/`:

- `HornbillTrial-Regular.ttf` / `HornbillTrial-Bold.ttf` (display)
- `Nunito-Regular.ttf` / `Nunito-Bold.ttf` (labels/body)

`lib/og/fonts.ts` loads them via `fs/promises` and registers with the
`ImageResponse` constructor. To add a weight or family, drop the TTF in
`public/fonts/`, add a `loadPublicFont(...)` call, push another `OgFont`
entry into the returned array. Keep the count small — every font is in
every render.

---

## Mock vs real data

```
GET /api/og/dazzi/preview         → mockDazziOgPreview()        (12 RSVPs)
GET /api/og/dazzi/preview-empty   → mockDazziOgPreviewEmpty()   (0 RSVPs)
GET /api/og/dazzi/<real uuid>     → fetchDazziShareData()       (Supabase)
```

`fetchDazziShareData()` uses the service-role Supabase client. For local
dev, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` are
optional — you can iterate on the design entirely with the two preview
fixtures and never need a live event.

When mock data isn't enough (host avatar at production CDN, real POI name
that wraps awkwardly), add a fixture instead of pointing the preview at a
real Supabase row.

---

## Deeplink chain

```
URL                                            → opens
─────────────────────────────────────────────────────────────────────
https://www.mapier.ai/share/dazzi/<eventId>    → mapier://dazzi/<eventId>
```

- iOS: `.well-known/apple-app-site-association` lists `/share/dazzi/*`.
  Tap in iMessage → app opens directly (no Safari).
- Android: not yet — see "Open work" below.
- Fallback: if the app isn't installed, `<script>window.location.href =
'mapier://…'</script>` fires; iOS shows "Open in App Store" if AASA
  resolution fails. App Store ID is plumbed via `APP_STORE_ID` env var.

Mobile-Frontend side (don't worry about this — it's done):

- `src/services/shareService.ts` → `shareDazzi(eventId, title)` builds the
  HTTPS share URL and calls `RNShare.open(...)`.
- `src/navigation/linking.ts` maps `mapier://dazzi/<eventId>` →
  `DazziDetailScreen`. Also strips a `/share/` prefix on cold-start so
  Universal Links work too.

---

## Status (today)

Done:

- [x] Card pixel-aligned to current frame mock (measured, not eyeballed)
- [x] `/api/og/dazzi/<id>` PNG renderer, Node runtime, font-cached
- [x] `/share/dazzi/<id>` HTML + OG meta + JS deeplink redirect
- [x] AASA includes `/share/dazzi/*`
- [x] Mobile app uses `shareDazzi(...)` from create-success sheet + detail screen
- [x] `linking.ts` routes `mapier://dazzi/:eventId` and the `/share/` variant
- [x] `/og-preview/dazzi` review page with `preview` + `preview-empty` fixtures

Open work (not your problem):

- [ ] Deploy `landing-page` to `www.mapier.ai`; verify iMessage unfurl in prod
- [ ] Android `assetlinks.json` parity for App Links
- [ ] OG cards for `post`, `profile`, `place`, `group` — same pattern
- [ ] Group needs a Stream metadata endpoint to fetch channel name/avatar

---

## When you're done

Hand back: list of files changed in `lib/og/dazzi/` + `public/og/`, plus a
screenshot of `/og-preview/dazzi` showing the final version. Mark plugs it
in — no app-side work needed unless the share URL shape changed (it
shouldn't).
