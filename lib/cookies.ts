// Tiny browser-cookie helper. We avoid pulling in `js-cookie` since this is
// the only place we touch document.cookie and the surface is small.
//
// Both QR-flow cookies are intentionally NOT HttpOnly: the pending token is
// echoed back into the /character/claim request body, and the outcome cookie
// is read by the client to short-circuit the reveal flow on return visits.
// SameSite=Lax keeps them out of cross-site requests while still letting the
// /c page read them on a fresh load from a scanned QR link.

export interface CookieOptions {
  /** Lifetime in seconds. Falls back to a session cookie if omitted. */
  maxAgeSeconds?: number;
  /** Defaults to "/" so the cookie is visible on every route. */
  path?: string;
  /** Defaults to "Lax" — sufficient for the QR flow. */
  sameSite?: "Lax" | "Strict" | "None";
  /** Defaults to true on https origins. */
  secure?: boolean;
}

export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === "undefined") return;

  const path = options.path ?? "/";
  const sameSite = options.sameSite ?? "Lax";
  const secure =
    options.secure ?? (typeof window !== "undefined" && window.location.protocol === "https:");

  const parts: string[] = [`${name}=${encodeURIComponent(value)}`, `Path=${path}`];

  if (typeof options.maxAgeSeconds === "number") {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAgeSeconds))}`);
  }
  parts.push(`SameSite=${sameSite}`);
  if (secure) parts.push("Secure");

  document.cookie = parts.join("; ");
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const target = `${name}=`;
  // Cookies are separated by "; " — split and look for the first match.
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const c of cookies) {
    if (c.startsWith(target)) {
      try {
        return decodeURIComponent(c.slice(target.length));
      } catch {
        return c.slice(target.length);
      }
    }
  }
  return null;
}

export function deleteCookie(name: string, path: string = "/"): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=${path}; Max-Age=0; SameSite=Lax`;
}

// ---------- QR-flow cookie names + helpers ----------

export const PENDING_CLAIM_COOKIE = "mapier_pending_claim";
export const CLAIM_OUTCOME_COOKIE = "mapier_claim_outcome";

const HOUR = 60 * 60;
const YEAR = 365 * 24 * HOUR;

export interface ClaimOutcome {
  character_slug: string;
  tier: string;
  rarity_label: string;
  claimed_at: string;
}

export function setPendingClaim(token: string): void {
  setCookie(PENDING_CLAIM_COOKIE, token, { maxAgeSeconds: HOUR });
}

export function getPendingClaim(): string | null {
  return getCookie(PENDING_CLAIM_COOKIE);
}

export function clearPendingClaim(): void {
  deleteCookie(PENDING_CLAIM_COOKIE);
}

export function setClaimOutcome(outcome: ClaimOutcome): void {
  setCookie(CLAIM_OUTCOME_COOKIE, JSON.stringify(outcome), { maxAgeSeconds: YEAR });
}

export function getClaimOutcome(): ClaimOutcome | null {
  const raw = getCookie(CLAIM_OUTCOME_COOKIE);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ClaimOutcome>;
    if (
      typeof parsed.character_slug === "string" &&
      typeof parsed.tier === "string" &&
      typeof parsed.rarity_label === "string" &&
      typeof parsed.claimed_at === "string"
    ) {
      return parsed as ClaimOutcome;
    }
    return null;
  } catch {
    return null;
  }
}
