// Contact-invite landing helpers. Used by `app/i/[code]/page.tsx` to fetch the
// inviter blob server-side so the landing page is SSR'd with real OG tags +
// inviter avatar/name. Mirrors the locked backend contract:
//
//   GET  /contacts/invite/:code        → { inviter: { username, display_name, avatar_url } }
//   POST /contacts/invite/:code/click  → { ok: true }  (idempotent, public)
//
// The POST is fired from the client component (mount effect) for accurate
// per-device attribution + so prefetches/crawlers don't count as clicks. This
// module only handles the server-side GET.

// Fallback matches the dev backend URL the rest of the team uses. Vercel envs
// override this in prod/preview.
//
// IMPORTANT: `NEXT_PUBLIC_BACKEND_URL` MUST be set on every Vercel deployment
// (prod + preview). When unset, requests fall through to the dev backend —
// which is fine for `next dev` on a laptop, but in prod it silently routes
// real users' invite lookups at dev's database. Verify the Vercel env before
// shipping.
const BACKEND_URL_FALLBACK = "https://dev.api.mapier.ai";

export function getBackendBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BACKEND_URL;
  const base = fromEnv && fromEnv.length > 0 ? fromEnv : BACKEND_URL_FALLBACK;
  // Strip trailing slash so `${base}/contacts/invite/...` never becomes `//contacts/...`.
  return base.replace(/\/+$/, "");
}

export interface Inviter {
  username: string;
  display_name: string;
  avatar_url: string | null;
}

export interface InviteResponse {
  inviter: Inviter;
}

/**
 * Fetch the invite blob for `code`. Returns `null` when:
 *   - backend returns 404 (unknown / revoked code), or
 *   - backend is unreachable / errors (so we surface a clean 404 to users
 *     instead of a 500 page when the backend has a hiccup — invite landings
 *     should fail safe).
 *
 * The result is cached for 60s at the edge so a viral SMS blast doesn't fan
 * out into one backend call per click.
 */
export async function getInvite(code: string): Promise<Inviter | null> {
  // Guard obviously bogus codes (empty / unreasonably long / illegal chars)
  // before burning a backend round-trip. Codes are alphanumeric in practice.
  if (!code || code.length > 64 || !/^[A-Za-z0-9_-]+$/.test(code)) {
    return null;
  }

  const url = `${getBackendBaseUrl()}/contacts/invite/${encodeURIComponent(code)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
  } catch {
    return null;
  }

  if (res.status === 404) return null;
  if (!res.ok) return null;

  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    return null;
  }

  // Backend wraps every response in the standard envelope
  //   { success: true, data: { inviter: { username, display_name, avatar_url } } }
  // so we have to unwrap `data` before reaching for `inviter`. Validate each
  // hop and each field shape before trusting the payload.
  if (!payload || typeof payload !== "object") return null;
  const data = (payload as { data?: unknown }).data;
  if (!data || typeof data !== "object" || !("inviter" in data)) return null;
  const inviter = (data as { inviter: unknown }).inviter;
  if (!inviter || typeof inviter !== "object") return null;
  const obj = inviter as Record<string, unknown>;
  if (typeof obj.username !== "string" || typeof obj.display_name !== "string") {
    return null;
  }
  const avatar =
    typeof obj.avatar_url === "string" && obj.avatar_url.length > 0 ? obj.avatar_url : null;

  return {
    username: obj.username,
    display_name: obj.display_name,
    avatar_url: avatar,
  };
}
