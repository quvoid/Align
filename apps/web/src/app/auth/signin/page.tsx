"use client";

import React, { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { isDemoModeEnabled, postAuthUrl, safeRedirectPath } from "@/lib/auth-shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ShieldCheck, Sparkles, ArrowRight, Lock } from "lucide-react";

const GOOGLE_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
// Seeded admin + creator passkeys; on unless NEXT_PUBLIC_DEMO_MODE=false.
// See isDemoModeEnabled in auth-shared.ts before leaving them on.
const DEMO_MODE = isDemoModeEnabled();

// useSearchParams() needs a Suspense boundary for static prerendering.
export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInPageInner />
    </Suspense>
  );
}

function SignInPageInner() {
  const { status } = useSession();
  // Set by middleware, NextAuth's own error redirects and the continue page.
  const callbackUrl = safeRedirectPath(useSearchParams().get("callbackUrl"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (status === "authenticated") {
      window.location.replace(postAuthUrl(callbackUrl));
    }
  }, [status, callbackUrl]);

  const loginWithEmail = async (
    loginEmail: string,
    loginPassword: string,
    redirectUrl?: string
  ) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });
      if (res?.error) {
        toast({
          title: "Login failed",
          description: "That email and password do not match an account.",
          type: "error",
        });
        return;
      }

      // /auth/continue routes on the role the server assigned and onboards
      // creators whose profile is still empty.
      toast({ title: "Welcome back", description: "Signed in successfully" });
      window.location.href = postAuthUrl(redirectUrl || callbackUrl);
    } catch {
      toast({ title: "Error", description: "Something went wrong", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Error", description: "Please enter email and password", type: "error" });
      return;
    }
    await loginWithEmail(email, password);
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-text-secondary font-semibold" role="status">
        Signing you in…
      </div>
    );
  }

  const googleIcon = (
    <svg className="mr-2.5 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  return (
    <div className="min-h-[80vh] flex items-start sm:items-center justify-center px-4 pt-8 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-[44px] type-display leading-none text-primary">Sign in</h1>
          <p className="mt-2 text-base text-text-secondary">Pitch live briefs from brands Schbang manages.</p>
        </div>

        <div className="rounded-5xl bg-surface p-5 sm:p-7 brut space-y-6">
          {DEMO_MODE && (
            <section aria-labelledby="demo-title">
              <h2 id="demo-title" className="text-lg font-extrabold text-primary mb-3">Try a demo account</h2>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  className="brut-press flex items-center gap-4 w-full rounded-4xl bg-fill-butter p-4 text-left brut disabled:opacity-55"
                  onClick={() => loginWithEmail("rohan.creates@gmail.com", "creator123", "/dashboard")}
                  disabled={isLoading}
                >
                  <span className="shrink-0 w-12 h-12 rounded-full bg-surface grid place-items-center brut-sm">
                    <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-lg font-extrabold text-primary leading-tight">Creator · Rohan Joshi</span>
                    <span className="block text-sm text-text-secondary">Browse briefs, pitch and track status</span>
                  </span>
                  <ArrowRight className="ml-auto h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="brut-press flex items-center gap-4 w-full rounded-4xl bg-fill-lilac p-4 text-left brut disabled:opacity-55"
                  onClick={() => loginWithEmail("admin@schbang.com", "admin123", "/admin")}
                  disabled={isLoading}
                >
                  <span className="shrink-0 w-12 h-12 rounded-full bg-surface grid place-items-center brut-sm">
                    <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-lg font-extrabold text-primary leading-tight">Admin · Schbang team</span>
                    <span className="block text-sm text-text-secondary">Review pitches and publish briefs</span>
                  </span>
                  <ArrowRight className="ml-auto h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {DEMO_MODE && (
            <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary" aria-hidden="true">
              <span className="h-0.5 flex-1 rounded-full bg-muted" /> or use your account <span className="h-0.5 flex-1 rounded-full bg-muted" />
            </div>
          )}

          {GOOGLE_ENABLED ? (
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => signIn("google", { callbackUrl: postAuthUrl(callbackUrl) })}
              disabled={isLoading}
            >
              {googleIcon}
              Continue with Google
            </Button>
          ) : (
            <p className="text-sm text-text-secondary text-center rounded-3xl bg-background px-4 py-3 brut-well">
              Google sign-in is off in this environment — use a demo account or email.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="name@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="accent" size="lg" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? "Signing in…" : (
                <>
                  Sign in with email
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-[15px] text-text-secondary">
          New to Align?{" "}
          <Link href="/auth/register" className="font-bold text-accent hover:underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
