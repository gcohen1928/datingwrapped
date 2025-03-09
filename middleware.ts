import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Skip middleware completely - we'll handle auth in the client components
export async function middleware(request: NextRequest) {
  // Skip middleware for callback route to avoid redirect loops
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return NextResponse.next();
  }

  // Check if we're on an auth route
  const isAuthRoute = 
    request.nextUrl.pathname.startsWith('/auth/login') ||
    request.nextUrl.pathname.startsWith('/auth/signup');

  // Get the auth cookie directly - don't try to validate it server-side
  const hasAuthCookies = 
    request.cookies.has('sb-access-token') && 
    request.cookies.has('sb-refresh-token');

  // If we have auth cookies and we're on an auth page, redirect to your-dates
  if (hasAuthCookies && isAuthRoute) {
    return NextResponse.redirect(new URL('/your-dates', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth/login',
    '/auth/signup',
    '/auth/callback',
  ],
}; 