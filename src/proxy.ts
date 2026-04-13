import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get tokens and markers from cookies
  const token = request.cookies.get('accessToken')?.value;
  const role = request.cookies.get('userRole')?.value;
  const authActive = request.cookies.get('auth_active')?.value;

  console.log(`Middleware running for ${pathname}. Token: ${!!token}, AuthActive: ${!!authActive}, Role: ${role}`);

  // 1. Redirect logged-in users away from /login or /register
  // If we have a token OR an active session marker, we should be on the dashboard
  if ((token || authActive) && (pathname === '/login' || pathname === '/register')) {
    const target = role === 'admin' ? '/admin/dashboard' : '/dashboard';
    return NextResponse.redirect(new URL(target, request.url), 303);
  }

  // 2. Protect Admin Routes
  if (pathname.startsWith('/admin')) {
    // Admins MUST have both marker and correct role
    if (!token && !authActive) {
      return NextResponse.redirect(new URL('/login', request.url), 303);
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url), 303);
    }
  }

  // 3. Protect Member Routes
  const memberRoutes = ['/dashboard', '/plans', '/measurements'];
  const isMemberRoute = memberRoutes.some(route => pathname.startsWith(route));

  if (isMemberRoute) {
    // If we have neither a token nor an auth marker, then we are definitely a guest
    if (!token && !authActive) {
      return NextResponse.redirect(new URL('/login', request.url), 303);
    }
    
    // Admin redirection to their specific dashboard
    if (role === 'admin' && pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url), 303);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/plans/:path*',
    '/measurements/:path*',
    '/login',
    '/register'
  ],
};
