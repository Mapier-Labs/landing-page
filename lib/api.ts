// Thin fetch wrapper for the Mapier QR-claim API.
// Backend is being built in parallel — keep this in sync with the locked contract.

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

export type ApiErrorCode =
  | 'INVALID_PHONE'
  | 'RATE_LIMITED'
  | 'INVALID_OTP'
  | 'OTP_EXPIRED'
  | 'INVALID_SLUG'
  | 'INVALID_POSTER_TOKEN'
  | 'ALREADY_CLAIMED'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  // Optional `error.data` block — used by ALREADY_CLAIMED to carry the user's
  // pre-existing character so the UI can render their actual claim instead of
  // the one they just tried to scan.
  readonly data: Record<string, unknown> | null;

  constructor(
    code: ApiErrorCode,
    message: string,
    status: number,
    data: Record<string, unknown> | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;
  error: { code: string; message: string; data?: Record<string, unknown> };
}

type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

async function postJson<T>(
  path: string,
  body: unknown,
  init?: { authToken?: string },
): Promise<T> {
  if (!BACKEND_URL) {
    throw new ApiError(
      'NETWORK_ERROR',
      'NEXT_PUBLIC_BACKEND_URL is not configured.',
      0,
    );
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (init?.authToken) {
    headers.Authorization = `Bearer ${init.authToken}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new ApiError(
      'NETWORK_ERROR',
      err instanceof Error ? err.message : 'Network request failed.',
      0,
    );
  }

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await res.json()) as ApiResponse<T>;
  } catch {
    // fall through — we'll handle below
  }

  if (!res.ok || !payload || payload.success === false) {
    const failure = payload && payload.success === false ? payload.error : undefined;
    const code = failure?.code ?? 'UNKNOWN';
    const message = failure?.message ?? `Request failed with status ${res.status}.`;
    throw new ApiError(code as ApiErrorCode, message, res.status, failure?.data ?? null);
  }

  return payload.data;
}

// ---------- /auth/request-otp ----------

export interface RequestOtpResponse {
  message: string;
  expires_in: number;
}

export function requestOtp(phone: string): Promise<RequestOtpResponse> {
  return postJson<RequestOtpResponse>('/auth/request-otp', { phone });
}

// ---------- /auth/verify-otp ----------

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface AuthUser {
  id: string;
  phone: string;
  is_new_user: boolean;
  profile: Record<string, unknown> | null;
}

export interface VerifyOtpResponse {
  session: AuthSession;
  user: AuthUser;
}

export function verifyOtp(phone: string, code: string): Promise<VerifyOtpResponse> {
  return postJson<VerifyOtpResponse>('/auth/verify-otp', { phone, code });
}

// ---------- /character/claim ----------

export interface ClaimCharacterArgs {
  characterSlug: string;
  posterId: string;
  posterToken: string;
  source?: string;
  accessToken: string;
}

export interface ClaimCharacterResponse {
  id: string;
  character_slug: string;
  tier: string;
  rarity_label: string;
  claimed_at: string;
}

// Payload returned in ALREADY_CLAIMED 409 errors so the UI can render the
// user's actual prior character instead of the one they just tried to claim.
export interface ExistingClaim {
  character_slug: string;
  tier: string;
  rarity_label: string;
  claimed_at: string;
}

export function claimCharacter({
  characterSlug,
  posterId,
  posterToken,
  source,
  accessToken,
}: ClaimCharacterArgs): Promise<ClaimCharacterResponse> {
  return postJson<ClaimCharacterResponse>(
    '/character/claim',
    {
      character_slug: characterSlug,
      poster_id: posterId,
      poster_token: posterToken,
      ...(source ? { source } : {}),
    },
    { authToken: accessToken },
  );
}

export function extractExistingClaim(err: unknown): ExistingClaim | null {
  if (!(err instanceof ApiError) || err.code !== 'ALREADY_CLAIMED') return null;
  const existing = err.data?.existing_claim;
  if (!existing || typeof existing !== 'object') return null;
  const e = existing as Record<string, unknown>;
  if (
    typeof e.character_slug !== 'string' ||
    typeof e.tier !== 'string' ||
    typeof e.rarity_label !== 'string' ||
    typeof e.claimed_at !== 'string'
  ) {
    return null;
  }
  return {
    character_slug: e.character_slug,
    tier: e.tier,
    rarity_label: e.rarity_label,
    claimed_at: e.claimed_at,
  };
}
