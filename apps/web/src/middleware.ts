import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Built from the edge-safe config, NOT from "@/lib/auth" — that module pulls in
// Prisma and bcrypt, which cannot be bundled for the edge runtime.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const pathname = req.nextUrl.pathname;

  const isAdminRoute = pathname.startsWith("/admin");
  const isCreatorsRoute = pathname.startsWith("/creators");

  // Anonymous visitors to /admin and /creators are redirected rather than
  // served the page shell. Previously they fell through to the client-side
  // sign-in popup, which meant the admin UI and its data were rendered into
  // the DOM behind a modal for anyone who asked.
  if (!isLoggedIn && (isAdminRoute || isCreatorsRoute)) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // Signed in but the first-sign-in email code not entered yet: confirm first.
  if (isLoggedIn && !req.auth?.user?.emailConfirmed) {
    const next = `${pathname}${req.nextUrl.search}`;
    return NextResponse.redirect(new URL(`/auth/verify?next=${encodeURIComponent(next)}`, req.nextUrl));
  }

  // Signed-in non-admins cannot access /admin → redirect to /dashboard
  if (isAdminRoute && isLoggedIn && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Creators cannot access /creators talent directory → redirect to /brands
  if (isCreatorsRoute && isLoggedIn && role === "CREATOR") {
    return NextResponse.redirect(new URL("/brands", req.nextUrl));
  }

  // /dashboard, /apply and /join keep the softer client-side sign-in popup for
  // anonymous visitors: those pages are part of the funnel, and bouncing a
  // creator out of them loses the ?brief= they arrived with.
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/creators/:path*",
    "/apply/:path*",
    "/join",
  ],
};
