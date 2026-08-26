import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  
  // If unauthenticated, redirect cleanly to signin
  if (!isLoggedIn && (isDashboardRoute || isAdminRoute)) {
    const signInUrl = new URL('/auth/signin', req.nextUrl);
    return NextResponse.redirect(signInUrl);
  }
  
  // If non-admin logged-in user tries to access /admin, redirect to /dashboard (prevents infinite sign-in loop)
  if (isAdminRoute && role !== 'ADMIN') {
    const dashboardUrl = new URL('/dashboard', req.nextUrl);
    return NextResponse.redirect(dashboardUrl);
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
