# AGENTS.md

## Cursor Cloud specific instructions

Single-service Next.js 16.1 landing page. See `CLAUDE.md` and `README.md` for standard commands (`yarn dev`, `yarn build`, `yarn lint`).

### Environment variables

`lib/supabase.ts` throws at import time if `SUPABASE_URL` or `SUPABASE_ANON_KEY` are missing. Create `.env.local` with placeholder values if real credentials are unavailable:

```
SUPABASE_URL=https://placeholder.supabase.co
SUPABASE_ANON_KEY=placeholder-anon-key
```

The landing page UI works fully without real Supabase credentials. Only `POST /api/waitlist` and `/share/*` routes require a live Supabase instance.

### Dev server

`yarn dev` starts on port 3000 with Turbopack. Cold start compiles are ~2s; subsequent page loads are fast.

### Build

`yarn build` runs `prettier --check` and `eslint` before `next build`. Expect 3 existing lint warnings (unused vars in share routes) — these are non-blocking.

### Corepack

Yarn 4.12.0 is managed via Corepack. Run `corepack enable` before `yarn install` if Yarn is not available.
