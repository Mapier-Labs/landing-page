// Thin fetch wrapper for the Mapier QR-claim API.
// Backend is being built in parallel — keep this in sync with the locked contract.

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

export type ApiErrorCode =
  | 'INVALID_PHONE'
  | 'RATE_LIMITED'
  | 'INVALID_OTP'
  | 'OTP_EXPIRED'
  | 'INVALID_SLUG'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(code: ApiErrorCode, message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;
  error: { code: string; message: string };
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
    const code = (payload && payload.success === false ? payload.error.code : undefined) ?? 'UNKNOWN';
    const message =
      (payload && payload.success === false ? payload.error.message : undefined) ??
      `Request failed with status ${res.status}.`;
    throw new ApiError(code as ApiErrorCode, message, res.status);
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
  posterId?: string;
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

export function claimCharacter({
  characterSlug,
  posterId,
  source,
  accessToken,
}: ClaimCharacterArgs): Promise<ClaimCharacterResponse> {
  return postJson<ClaimCharacterResponse>(
    '/character/claim',
    {
      character_slug: characterSlug,
      ...(posterId ? { poster_id: posterId } : {}),
      ...(source ? { source } : {}),
    },
    { authToken: accessToken },
  );
}
