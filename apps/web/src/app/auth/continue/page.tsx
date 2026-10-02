"use client";

import { Suspense, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { safeRedirectPath } from "@/lib/auth-shared";
import { fetchMe, isProfileComplete } from "@/lib/user-store";

/**
 * The single post-sign-in router. Credentials (page + modal), registration and
 * Google OAuth all land here with an optional `?next=`, so the rules live in
 * one place:
 *
 * - Anyone who hasn't entered their first-sign-in email code goes to
 *   /auth/verify first, which comes back here once confirmed.
 * - Admins go to `next`, or /admin.
 * - Creators without a usable profile (see `isProfileComplete`) are onboarded
 *   first: /dashboard/profile?next=<where they were going>.
 * - Everyone else goes to `next`, or /dashboard.
 *
 * Profile completeness comes from /api/me; this stays a client page so it can
 * wait for the session cookie that sign-in just set.
 */
export default function AuthContinuePage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AuthContinue />
    </Suspense>
  );
}

function Spinner() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" aria-label="Signing you in" />
    </div>
  );
}

function AuthContinue() {
  const { data: session, status } = useSession();
  const next = safeRedirectPath(useSearchParams().get("next"));

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.user?.email) {
      window.location.replace(`/auth/signin${next ? `?callbackUrl=${encodeURIComponent(next)}` : ""}`);
      return;
    }

    const { role, emailConfirmed } = session.user;

    if (!emailConfirmed) {
      window.location.replace(`/auth/verify${next ? `?next=${encodeURIComponent(next)}` : ""}`);
      return;
    }

    // Full navigation so middleware and server components see the new cookie.
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      window.location.replace(next && !next.startsWith("/dashboard/profile") ? next : "/admin");
      return;
    }

    const target = next || "/dashboard";
    let cancelled = false;
    fetchMe()
      .then(({ profile }) => {
        if (cancelled) return;
        window.location.replace(
          isProfileComplete(profile) || target.startsWith("/dashboard/profile")
            ? target
            : `/dashboard/profile?next=${encodeURIComponent(target)}`
        );
      })
      // Can't tell whether the profile is complete; the pages behind `target`
      // gate on it themselves, so just go.
      .catch(() => !cancelled && window.location.replace(target));
    return () => {
      cancelled = true;
    };
  }, [status, session, next]);

  return <Spinner />;
}
