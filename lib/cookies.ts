// QR-flow client-side state.
//
// Despite the filename, the QR-claim helpers below are backed by localStorage,
// not cookies. JS-set cookies (`document.cookie`) get purged by iOS Safari's
// ITP heuristics in the QR-from-Camera handoff path, which caused the reveal
// flow to re-roll a different character on refresh. localStorage is not
// subject to those heuristics. The generic cookie helpers (`setCookie`,
// `getCookie`, `deleteCookie`) are kept for any future caller and used as a
// read-side fallback so users who already have a pre-fix cookie set don't
// lose their pending claim during rollout.

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

// ---------- localStorage envelope (TTL via wrapper) ----------

interface StoredEnvelope {
  v: string;
  /** epoch ms; absent = no expiry */
  exp?: number;
}

function lsSet(key: string, value: string, ttlSeconds?: number): void {
  if (typeof window === "undefined") return;
  try {
    const envelope: StoredEnvelope = { v: value };
    if (typeof ttlSeconds === "number") {
      envelope.exp = Date.now() + Math.max(0, ttlSeconds) * 1000;
    }
    window.localStorage.setItem(key, JSON.stringify(envelope));
  } catch {
    // localStorage can throw under quota / private mode — fail silently.
  }
}

function lsGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const envelope = JSON.parse(raw) as Partial<StoredEnvelope>;
    if (!envelope || typeof envelope.v !== "string") return null;
    if (typeof envelope.exp === "number" && Date.now() >= envelope.exp) {
      window.localStorage.removeItem(key);
      return null;
    }
    return envelope.v;
  } catch {
    return null;
  }
}

function lsDel(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// ---------- QR-flow keys + helpers ----------

// Names retained as PENDING_CLAIM_COOKIE / CLAIM_OUTCOME_COOKIE for backward
// compatibility with any imports; they double as the localStorage keys.
export const PENDING_CLAIM_COOKIE = "mapier_pending_claim";
export const CLAIM_OUTCOME_COOKIE = "mapier_claim_outcome";

const HOUR = 60 * 60;

export interface ClaimOutcome {
  character_slug: string;
  tier: string;
  rarity_label: string;
  claimed_at: string;
}

export function setPendingClaim(token: string): void {
  lsSet(PENDING_CLAIM_COOKIE, token, HOUR);
}

export function getPendingClaim(): string | null {
  // Prefer localStorage. Fall back to any legacy cookie value so users who
  // were already mid-flow before this rollout don't lose their pending claim.
  return lsGet(PENDING_CLAIM_COOKIE) ?? getCookie(PENDING_CLAIM_COOKIE);
}

export function clearPendingClaim(): void {
  lsDel(PENDING_CLAIM_COOKIE);
  // Also clear the legacy cookie if present so it doesn't shadow future state.
  deleteCookie(PENDING_CLAIM_COOKIE);
}

export function setClaimOutcome(outcome: ClaimOutcome): void {
  // No TTL — the outcome is a permanent record of the user's claim.
  lsSet(CLAIM_OUTCOME_COOKIE, JSON.stringify(outcome));
}

export function getClaimOutcome(): ClaimOutcome | null {
  const raw = lsGet(CLAIM_OUTCOME_COOKIE) ?? getCookie(CLAIM_OUTCOME_COOKIE);
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
