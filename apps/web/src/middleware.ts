import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const pathname = req.nextUrl.pathname;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isCreatorsRoute = pathname.startsWith("/creators");

  // If unauthenticated, redirect to signin for protected routes
  if (!isLoggedIn && (isDashboardRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
  }

  // Non-admin users cannot access /admin → redirect to /dashboard
  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Creators cannot access /creators talent directory → redirect to /brands
  if (isCreatorsRoute && isLoggedIn && role === "CREATOR") {
    return NextResponse.redirect(new URL("/brands", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/creators/:path*"],
};
