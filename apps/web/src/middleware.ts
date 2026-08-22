import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  
  if (!isLoggedIn && (isDashboardRoute || isAdminRoute)) {
    const signInUrl = new URL('/auth/signin', req.nextUrl);
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }
  
  // If creator tries to access admin, redirect to signin with callback so they can switch to admin
  if (isAdminRoute && role !== 'ADMIN') {
    const signInUrl = new URL('/auth/signin', req.nextUrl);
    signInUrl.searchParams.set('callbackUrl', '/admin');
    return NextResponse.redirect(signInUrl);
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
