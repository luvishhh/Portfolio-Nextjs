// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SESSION_COOKIE_NAME = 'musefolio-admin-session';
const ADMIN_LOGIN_URL = '/admin/login';
const ADMIN_ROOT_URL = '/admin';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE_NAME);

  // Allow requests to the login page itself
  if (pathname.startsWith(ADMIN_LOGIN_URL)) {
    // If user is already logged in and tries to access login page, redirect to admin dashboard
    if (sessionCookie?.value === "true") {
        return NextResponse.redirect(new URL(ADMIN_ROOT_URL, request.url));
    }
    return NextResponse.next();
  }

  // Protect all other /admin routes
  if (pathname.startsWith(ADMIN_ROOT_URL)) {
    if (!sessionCookie || sessionCookie.value !== "true") {
      // If no valid session, redirect to login page
      // Preserve search params if any, e.g., for a 'from' redirect
      const loginUrl = new URL(ADMIN_LOGIN_URL, request.url);
      if (pathname !== ADMIN_ROOT_URL) { // Avoid adding 'from' if already at admin root trying to access it
        loginUrl.searchParams.set('from', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
