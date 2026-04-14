import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rebuild trigger
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get tokens from cookies
  const adminToken = request.cookies.get('adminAccessToken')?.value;
  const customerToken = request.cookies.get('accessToken')?.value;

  // 1. Protection for Admin Routes
  if (pathname.startsWith('/admin')) {
    // Skip protection for the admin login page itself
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Require admin token for all other /admin routes
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url), 307);
    }
  }

  // 2. Protection for Member Routes
  const memberRoutes = ['/dashboard', '/plans', '/measurements', '/attendance'];
  const isMemberRoute = memberRoutes.some(route => pathname.startsWith(route));

  if (isMemberRoute) {
    if (!customerToken) {
      return NextResponse.redirect(new URL('/login', request.url), 307);
    }
  }

  // 3. Redirection for Logged-in Members (Away from Auth Pages)
  if (customerToken && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url), 307);
  }

  // 4. Special Case: Logged-in Admins on /admin/login
  if (adminToken && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url), 307);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/plans/:path*',
    '/measurements/:path*',
    '/attendance/:path*',
    '/login',
    '/register'
  ],
};
