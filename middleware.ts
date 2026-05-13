/**
 * middleware.ts
 * ─────────────
 * Edge middleware — runs on every request BEFORE the page renders.
 *
 * Responsibilities
 *   1. Allow unauthenticated access to public pages & static assets.
 *   2. Redirect unauthenticated users to /login (preserving the intended URL
 *      in a `next` search param so they land back after sign-in).
 *   3. Redirect already-authenticated users away from auth pages (e.g. /login)
 *      to /dashboard so they don't see a login screen they don't need.
 *
 * Token strategy
 *   The backend issues a JWT stored as the `access_token` cookie.
 *   We do a lightweight check here (cookie presence + basic JWT structure).
 *   Full cryptographic verification is left to the API layer.
 */

import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/**
 * Pages that must be reachable without a token.
 * Add any new public routes here — keep it tight.
 */
const PUBLIC_PATHS = new Set([
  '/',
  '/login',
  '/login/forgotpassword',
  '/register',
  '/onboarding',         // initial sign-up flow
  '/onboarding/success', // post-registration confirmation
  '/onboarding/train',
]);

/**
 * Prefix patterns that are always public (static assets, API health checks, etc.).
 * Checked with startsWith so you don't have to enumerate every path.
 */
const PUBLIC_PREFIXES = [
  '/_next/',     // Next.js compiled assets
  '/fonts/',
  '/images/',
  '/icons/',
  '/favicon',
  '/manifest',
  '/sw.js',
  '/api/v1/auth/', // login / refresh / register endpoints
];

/** After login, send users here if no `next` param is present. */
const DEFAULT_PROTECTED_REDIRECT = '/dashboard';

/** Auth pages — authenticated users shouldn't see these. */
const AUTH_ONLY_PAGES = new Set(['/login', '/login/forgotpassword', '/register']);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Lightweight JWT sanity-check.
 * We only verify the token *looks* like a JWT (three Base64 segments).
 * Cryptographic verification is done server-side on every API call.
 */
function isTokenStructurallyValid(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    // Attempt to parse the payload — catches obviously corrupt tokens
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    // Reject tokens that are structurally valid but already expired
    if (payload.exp && Date.now() / 1000 > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // 1. Always allow public paths through immediately
  if (isPublicPath(pathname)) {
    const token = request.cookies.get('access_token')?.value;
    const isAuthenticated = !!token && isTokenStructurallyValid(token);

    // Bounce authenticated users away from login/register pages
    if (isAuthenticated && AUTH_ONLY_PAGES.has(pathname)) {
      const destination = request.nextUrl.searchParams.get('next') ?? DEFAULT_PROTECTED_REDIRECT;
      return NextResponse.redirect(new URL(destination, request.url));
    }

    return NextResponse.next();
  }

  // 2. For every other path, require a valid token
  const token = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!token && isTokenStructurallyValid(token);

  if (!isAuthenticated) {
    // Preserve the intended destination so we can redirect back after login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Authenticated — let the request through, optionally forwarding user info
  const response = NextResponse.next();

  // Forward a sanitised claim to server components / API routes via a header
  // (avoids re-parsing the JWT deep in the render tree)
  try {
    const parts = token!.split('.');
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.sub) {
      response.headers.set('x-user-id', String(payload.sub));
    }
    if (payload.email) {
      response.headers.set('x-user-email', String(payload.email));
    }
  } catch {
    // Non-fatal — page will still render; API calls will validate properly
  }

  return response;
}

// ---------------------------------------------------------------------------
// Matcher
// ---------------------------------------------------------------------------
/**
 * Run this middleware on every route EXCEPT:
 *   - Next.js internals  (_next/static, _next/image, etc.)
 *   - Common static file extensions
 *
 * We handle the public/private split in the function above, which gives us
 * full control (e.g. the authenticated-user-on-login-page redirect).
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf|eot|ico|css|js|map)).*)',
  ],
};