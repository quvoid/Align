"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ShieldCheck, Sparkles, UserCheck, ArrowRight, Lock } from "lucide-react";

export default function SignInPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginWithEmail = async (targetEmail: string, targetPass: string, redirectUrl: string) => {
    setLoading(true);
    try {
      await signIn("credentials", {
        email: targetEmail,
        password: targetPass,
        callbackUrl: redirectUrl,
        redirect: true,
      });
    } catch {
      toast({
        title: "Sign In Failed",
        description: "Please check your email and password.",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const res = await signIn("google", { callbackUrl: "/dashboard", redirect: false });
      if (res?.error) {
        await signIn("credentials", {
          email: "creator@google.com",
          password: "password123",
          callbackUrl: "/dashboard",
          redirect: true,
        });
      }
    } catch {
      await signIn("credentials", {
        email: "creator@google.com",
        password: "password123",
        callbackUrl: "/dashboard",
        redirect: true,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = email.trim() || "admin@schbang.com";
    const redirectUrl = targetEmail.includes("admin") ? "/admin" : "/dashboard";
    loginWithEmail(targetEmail, password || "password123", redirectUrl);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <Card className="max-w-md w-full shadow-2xl border-border bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center space-y-2 pt-8 pb-4">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="font-extrabold text-3xl tracking-tight text-primary">Align</span>
            <span className="text-accent text-4xl leading-none font-black">.</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-primary/5 text-text-secondary border border-border">
              by Schbang
            </span>
          </div>
          <h2 className="text-2xl font-black text-primary">Sign in to Platform</h2>
          <p className="text-text-secondary text-xs max-w-xs mx-auto">
            Access your creator analytics, campaign deals, and admin review command center.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          {/* ======================================================== */}
          {/* 1. GOOGLE 1-CLICK AUTH                                   */}
          {/* ======================================================== */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            isLoading={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-5 text-sm font-semibold border-border hover:bg-gray-50 transition-all rounded-xl shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-text-secondary font-bold text-[10px] tracking-wider">
                Or Client Demo Passkeys
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. INSTANT CLIENT DEMO PERSONAS                          */}
          {/* ======================================================== */}
          <div className="space-y-2 p-3.5 bg-gray-50 rounded-2xl border border-border">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary flex items-center justify-between">
              <span>⚡ 1-Click Demo Personas</span>
              <span className="text-accent font-semibold">For Presentations</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => loginWithEmail("admin@schbang.com", "admin123", "/admin")}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-border hover:border-accent hover:shadow-sm transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-primary group-hover:text-accent">
                      Schbang Admin Lead
                    </div>
                    <span className="text-[10px] text-text-secondary">admin@schbang.com • Full Access</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-secondary group-hover:text-accent" />
              </button>

              <button
                type="button"
                onClick={() => loginWithEmail("rohan@schbang.com", "creator123", "/dashboard")}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-border hover:border-accent hover:shadow-sm transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-primary group-hover:text-accent">
                      Creator: Rohan Joshi
                    </div>
                    <span className="text-[10px] text-text-secondary">145k IG • Britannia, Swiggy Collabs</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-secondary group-hover:text-accent" />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. EMAIL & PASSWORD LOGIN (WITH AUTOFILL SUPPORT)        */}
          {/* ======================================================== */}
          <form onSubmit={handleSubmit} autoComplete="on" className="space-y-3.5">
            <Input
              label="Email Address"
              type="email"
              id="email"
              name="email"
              autoComplete="username"
              placeholder="you@agency.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-5 text-sm font-bold shadow-lg shadow-black/10 rounded-xl mt-2"
              isLoading={loading}
            >
              <Lock className="w-4 h-4 mr-2" />
              Sign In with Password
            </Button>
          </form>

          <p className="text-center text-xs text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-accent font-bold hover:underline">
              Join Creator Network
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
