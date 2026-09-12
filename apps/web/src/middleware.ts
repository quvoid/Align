import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const pathname = req.nextUrl.pathname;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isCreatorsRoute = pathname.startsWith("/creators");

  // Anonymous visitors are NOT redirected here: the client-side
  // SignInModalProvider shows a sign-in popup over the page instead,
  // which is a softer onboarding than bouncing to /auth/signin.

  // Signed-in non-admins cannot access /admin → redirect to /dashboard
  if (isAdminRoute && isLoggedIn && role !== "ADMIN") {
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
