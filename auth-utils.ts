/**
 * auth-utils.ts
 * ─────────────
 * Shared auth utilities for client components, server actions, and middleware.
 * Edge-runtime safe — no Node.js-only imports.
 *
 * ROOT CAUSE OF THE REDIRECT BUG
 * ───────────────────────────────
 * FastAPI sets the JWT as an HttpOnly cookie (correct — XSS-safe).
 * HttpOnly cookies are INVISIBLE to JavaScript, so:
 *
 *   1. The old `deleteCookie('access_token')` silently did nothing on logout
 *      — the token cookie survived, so the user was still "authenticated".
 *
 *   2. The Next.js middleware couldn't read the HttpOnly cookie either,
 *      so the auth guard never fired and protected pages stayed accessible.
 *
 * THE FIX (two parts)
 * ───────────────────
 *   A. Logout MUST call the backend /api/v1/auth/logout endpoint, which
 *      responds with `Set-Cookie: access_token=; Max-Age=0` — the ONLY
 *      way to delete an HttpOnly cookie from the client side.
 *
 *   B. The backend also sets a lightweight non-HttpOnly sentinel cookie
 *      (`session_active=1`) alongside the HttpOnly JWT. The middleware
 *      reads THIS sentinel as its auth signal (it's readable because it's
 *      not HttpOnly). When logout clears the JWT, it also clears the sentinel.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}

// ---------------------------------------------------------------------------
// JWT helpers (Edge-safe — no Node.js crypto)
// ---------------------------------------------------------------------------

/**
 * Decode a JWT payload WITHOUT verifying the signature.
 * Use only for non-security reads (e.g. displaying the user's name).
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/** Structural + expiry check. Does NOT verify signature. */
export function isTokenValid(token: string | undefined | null): boolean {
  if (!token) return false;
  if (token.split('.').length !== 3) return false;
  const payload = decodeJwtPayload(token);
  if (!payload) return false;
  if (payload.exp && Date.now() / 1000 > payload.exp) return false;
  return true;
}

export function secondsUntilExpiry(token: string): number {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return 0;
  return Math.max(0, Math.floor(payload.exp - Date.now() / 1000));
}

// ---------------------------------------------------------------------------
// Cookie helpers — non-HttpOnly cookies only
// ---------------------------------------------------------------------------

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

/**
 * Delete a non-HttpOnly cookie client-side.
 * This CANNOT delete HttpOnly cookies — use the logout endpoint for that.
 */
export function deleteCookie(name: string, path = '/'): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Max-Age=0; path=${path}; SameSite=Lax`;
}

// ---------------------------------------------------------------------------
// Auth flow
// ---------------------------------------------------------------------------

/** Non-HttpOnly cookie the middleware reads as the auth signal. */
export const SENTINEL_COOKIE = 'session_active';

const REFRESH_ENDPOINT = '/api/v1/auth/refresh';
const LOGOUT_ENDPOINT  = '/api/v1/auth/logout';

/**
 * Silent token refresh.
 * The backend must respond with a fresh Set-Cookie for access_token.
 */
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(REFRESH_ENDPOINT, {
      method: 'POST',
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Log the user out — the ONLY correct client-side logout flow.
 *
 * 1. POST /api/v1/auth/logout  →  backend responds with:
 *      Set-Cookie: access_token=;  Max-Age=0; HttpOnly; ...
 *      Set-Cookie: refresh_token=; Max-Age=0; HttpOnly; ...
 *      Set-Cookie: session_active=; Max-Age=0; ...
 *    This is the ONLY way to clear HttpOnly cookies from the browser.
 *
 * 2. Delete the non-HttpOnly sentinel client-side (belt-and-suspenders).
 *
 * 3. Hard navigate to /login — wipes all React/query cache state.
 */
export async function logout(redirectTo: string | unknown = '/login'): Promise<void> {
  // Prevent [object MouseEvent] redirect
  const destination = typeof redirectTo === 'string' ? redirectTo : '/login';

  try {
    await fetch(LOGOUT_ENDPOINT, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Network failure — still clear client state and redirect
  }

  deleteCookie(SENTINEL_COOKIE);
  window.location.href = destination;
}

/** Alias for components that import `handleLogout`. */
export { logout as handleLogout };

/**
 * Drop-in replacement for fetch() that:
 *   1. Always sends cookies (credentials: 'include').
 *   2. On 401 → attempts one silent token refresh → retries.
 *   3. If refresh fails → calls logout().
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const opts: RequestInit = { ...init, credentials: 'include' };
  let response = await fetch(input, opts);

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      response = await fetch(input, opts);
    } else {
      await logout();
    }
  }

  return response;
}