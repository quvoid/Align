"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { postAuthUrl, safeRedirectPath } from "@/lib/auth-shared";

/**
 * First-sign-in email confirmation. A 6-digit code is emailed as soon as the
 * page opens; entering it sets User.emailVerifiedAt, then the session token is
 * refreshed from the database and the user continues to wherever they were
 * headed (via /auth/continue, which also handles profile onboarding).
 */
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <VerifyEmail />
    </Suspense>
  );
}

function FullPageSpinner() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" aria-label="Loading" />
    </div>
  );
}

function VerifyEmail() {
  const { data: session, status, update } = useSession();
  const next = safeRedirectPath(useSearchParams().get("next"));

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const sentOnce = useRef(false);

  const finish = useCallback(async () => {
    // Re-issues the JWT; the server re-reads emailVerifiedAt from the DB. The
    // argument matters: update() with none does a plain GET, which never fires
    // the jwt callback's "update" trigger. Its contents are ignored server-side.
    const fresh = await update({ refresh: "emailConfirmed" });
    if (!fresh?.user?.emailConfirmed) {
      // Don't bounce to /auth/continue, which would send us straight back here.
      setError("Your email is confirmed, but we couldn't refresh your session. Reload the page.");
      return;
    }
    window.location.replace(postAuthUrl(next));
  }, [update, next]);

  const sendCode = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/auth/otp/send", { method: "POST" });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.status === "already_verified") return finish();
    if (res.ok) {
      setNotice(`We sent a 6-digit code to ${session?.user?.email}.`);
      setCooldown(60);
    } else if (res.status === 429) {
      setNotice(`We sent a code to ${session?.user?.email} a moment ago.`);
      setCooldown(body.retryAfterSeconds ?? 60);
    } else {
      setError(body.error ?? "We couldn't send the email. Try again in a minute.");
    }
  }, [finish, session?.user?.email]);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.replace(`/auth/signin${next ? `?callbackUrl=${encodeURIComponent(next)}` : ""}`);
      return;
    }
    if (status !== "authenticated") return;
    if (session.user.emailConfirmed) {
      window.location.replace(postAuthUrl(next));
      return;
    }
    if (!sentOnce.current) {
      sentOnce.current = true;
      void sendCode();
    }
  }, [status, session, next, sendCode]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Enter the 6-digit code from the email.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "That code didn't work.");
        setCode("");
        return;
      }
      await finish();
    } finally {
      setSubmitting(false);
    }
  };

  if (status !== "authenticated" || session.user.emailConfirmed) return <FullPageSpinner />;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-4xl bg-white/70 backdrop-blur-xl ring-1 ring-inset ring-white/70 shadow-[0_24px_60px_-28px_rgba(33,25,34,0.45)] p-8 sm:p-10">
        <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-white">
          <MailCheck className="w-6 h-6" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-black tracking-tight text-primary mt-6">Confirm your email</h1>
        <p className="text-sm text-text-secondary mt-2 leading-relaxed" aria-live="polite">
          {notice ?? `Sending a code to ${session.user.email}…`} Enter it below to finish signing in.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label htmlFor="otp" className="sr-only">
            6-digit code
          </label>
          <input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            aria-invalid={!!error}
            aria-describedby={error ? "otp-error" : undefined}
            className="w-full h-16 rounded-2xl border border-border bg-white text-center text-3xl font-extrabold tracking-[0.5em] tabular-nums text-primary placeholder:text-primary/15 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && (
            <p id="otp-error" role="alert" className="text-sm font-medium text-error">
              {error}
            </p>
          )}
          <Button type="submit" variant="accent" size="lg" className="w-full" disabled={submitting || code.length !== 6}>
            {submitting ? "Checking…" : "Confirm email"}
          </Button>
        </form>

        <div className="flex items-center justify-between mt-6 text-sm">
          <button
            type="button"
            onClick={() => void sendCode()}
            disabled={cooldown > 0}
            className="font-semibold text-primary hover:underline disabled:text-text-secondary disabled:no-underline disabled:cursor-not-allowed"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </button>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="font-semibold text-text-secondary hover:text-primary"
          >
            Use a different account
          </button>
        </div>

        <p className="text-xs text-text-secondary mt-8">
          Can&apos;t find it? Check spam, or{" "}
          <Link href="/contact" className="font-semibold text-primary hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
