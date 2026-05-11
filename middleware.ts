import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value; // Prefer cookies for middleware
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const publicPaths = [
    '/', // Registration page
    '/login',
    '/login/forgotpassword',
  ];

  // Static assets and auth pages are public
  const isStaticAsset = pathname.startsWith('/_next') || pathname.startsWith('/fonts') || pathname.startsWith('/images') || pathname === '/favicon.ico' || pathname === '/logoa.png';
  const isAuthPage = publicPaths.includes(pathname);
  
  // Onboarding should be protected (users must be registered/logged in to onboard)
  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding');

  // If the path is protected and no token is found, redirect to login
  if (!token && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}