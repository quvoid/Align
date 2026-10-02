"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { postAuthUrl } from "@/lib/auth-shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { FREE_PITCHES } from "@/lib/plans";
import { useToast } from "@/components/ui/toast";

const GOOGLE_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Same destination as handleSubmit's post-signup redirect, so the session
    // hook resolving mid-submit never races it somewhere else. An existing
    // user landing here is routed like any other sign-in.
    if (status === "authenticated") {
      window.location.replace(postAuthUrl());
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({ title: "Error", description: "All fields are required", type: "error" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters", type: "error" });
      return;
    }
    setIsLoading(true);
    try {
      // Actually create the account first. Signing in without this wrote no row
      // anywhere and silently discarded the creator's name.
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!registerRes.ok) {
        const { error } = await registerRes.json().catch(() => ({ error: null }));
        toast({
          title: "Could not create account",
          description: error || "Please try again.",
          type: "error",
        });
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        toast({
          title: "Account created — please sign in",
          description: "Your account exists but we could not sign you in automatically.",
          type: "error",
        });
        window.location.href = "/auth/signin";
      } else {
        toast({ title: "Welcome to Align", description: "Account created successfully" });
        // New account → empty profile → /auth/continue sends them to onboarding.
        window.location.href = postAuthUrl();
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-text-secondary font-semibold" role="status">
        Signing you in…
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-start sm:items-center justify-center px-4 pt-8 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-[44px] type-display leading-none text-primary">Join Align</h1>
          <p className="mt-2 text-base text-text-secondary">Create a creator account. Your first {FREE_PITCHES} pitches are free.</p>
        </div>

        <div className="rounded-5xl bg-surface p-5 sm:p-7 brut space-y-6">
          {GOOGLE_ENABLED ? (
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => signIn("google", { callbackUrl: postAuthUrl() })}
              disabled={isLoading}
            >
              <svg className="mr-2.5 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign up with Google
            </Button>
          ) : (
            <p className="text-sm text-text-secondary text-center rounded-3xl bg-background px-4 py-3 brut-well">
              Google sign-in is off in this environment — sign up with email.
            </p>
          )}

          <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary" aria-hidden="true">
            <span className="h-0.5 flex-1 rounded-full bg-muted" /> or with email <span className="h-0.5 flex-1 rounded-full bg-muted" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              id="name"
              type="text"
              label="Full name"
              placeholder="As brands should see it"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="accent" size="lg" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? "Creating your account…" : (
                <>
                  Create creator account
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-[15px] text-text-secondary">
          Already on Align?{" "}
          <Link href="/auth/signin" className="font-bold text-accent hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
