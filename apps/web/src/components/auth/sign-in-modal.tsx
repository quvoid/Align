"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

const GOOGLE_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

// Routes that need a signed-in user. Anything else is browsable anonymously.
const PROTECTED_PREFIXES = ["/dashboard", "/admin", "/apply", "/creators", "/join"];

export const isProtectedPath = (pathname: string) =>
  PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

interface SignInModalContextValue {
  openSignIn: (opts?: { reason?: string; callbackUrl?: string }) => void;
  closeSignIn: () => void;
}

const SignInModalContext = createContext<SignInModalContextValue>({
  openSignIn: () => {},
  closeSignIn: () => {},
});

export const useSignInModal = () => useContext(SignInModalContext);

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

/**
 * Provides a single, app-wide sign-in popup.
 *
 * - Opens automatically when an anonymous user lands on a protected route,
 *   instead of a hard redirect to /auth/signin. The page stays visible
 *   (blurred) behind it.
 * - Can be opened on demand via `useSignInModal().openSignIn()` (navbar,
 *   apply flow, etc.).
 * - Never nags on public pages.
 */
export function SignInModalProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<string | undefined>();
  const [callbackUrl, setCallbackUrl] = useState<string | undefined>();
  // `gated` = the modal was opened because the route requires auth
  const [gated, setGated] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const openSignIn = useCallback((opts?: { reason?: string; callbackUrl?: string }) => {
    setReason(opts?.reason);
    setCallbackUrl(opts?.callbackUrl);
    setGated(false);
    setIsOpen(true);
  }, []);

  const closeSignIn = useCallback(() => {
    setIsOpen(false);
    setReason(undefined);
  }, []);

  // Auto-open on protected routes for anonymous visitors.
  useEffect(() => {
    if (status !== "unauthenticated") return;
    if (pathname.startsWith("/auth/")) return;

    if (isProtectedPath(pathname)) {
      setReason(
        pathname.startsWith("/admin")
          ? "The admin area is for Schbang brand managers."
          : pathname.startsWith("/creators")
          ? "The creator directory is for Schbang brand managers."
          : pathname.startsWith("/apply")
          ? "Sign in so we can attach this pitch to your creator profile."
          : pathname.startsWith("/join")
          ? "Sign in to activate your plan. Takes ten seconds with Google."
          : "Sign in to see your campaigns, pitches and payouts."
      );
      const qs = searchParams.toString();
      setCallbackUrl(qs ? `${pathname}?${qs}` : pathname);
      setGated(true);
      setIsOpen(true);
    } else if (gated) {
      // Moved from a protected page to a public one → drop the gate.
      setGated(false);
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pathname]);

  // Close automatically once the user is signed in.
  useEffect(() => {
    if (status === "authenticated" && isOpen) {
      setIsOpen(false);
      setGated(false);
    }
  }, [status, isOpen]);

  const handleClose = () => {
    if (gated) {
      // Declined to sign in on a protected page → send them somewhere useful.
      setGated(false);
      setIsOpen(false);
      router.push("/brands");
      return;
    }
    closeSignIn();
  };

  const loginWithEmail = async (demoEmail: string, demoPassword: string, fallbackUrl: string) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: demoEmail,
        password: demoPassword,
        redirect: false,
      });
      if (res?.error) {
        toast({ title: "Login failed", description: res.error, type: "error" });
        return;
      }
      toast({ title: "Welcome back", description: "Signed in successfully." });
      // Full reload so middleware + server session are in sync with the new role.
      window.location.href = callbackUrl || fallbackUrl;
    } catch {
      toast({ title: "Error", description: "Something went wrong", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing details", description: "Enter your email and password.", type: "error" });
      return;
    }
    await loginWithEmail(email, password, email.includes("admin") ? "/admin" : "/dashboard");
  };

  const ctx = useMemo(() => ({ openSignIn, closeSignIn }), [openSignIn, closeSignIn]);

  return (
    <SignInModalContext.Provider value={ctx}>
      {children}

      <Modal isOpen={isOpen} onClose={handleClose} size="md" className="rounded-3xl">
        <div className="space-y-5">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-primary">Sign in to Align</h2>
            <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
              {reason || (GOOGLE_ENABLED ? "Pick a demo profile to jump straight in, or use Google." : "Pick a demo profile to jump straight in.")}
            </p>
          </div>

          {/* One-click demo profiles — the primary path for the demo */}
          <div className="bg-gray-50 rounded-2xl p-3 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary px-1">Demo profiles</p>
            <Button
              variant="outline"
              className="w-full justify-start rounded-xl text-left bg-white border-border h-auto py-2.5"
              onClick={() => loginWithEmail("admin@schbang.com", "admin123", "/admin")}
              disabled={isLoading}
            >
              <ShieldCheck className="mr-3 h-4 w-4 text-accent shrink-0" />
              <div>
                <div className="font-semibold text-primary text-sm">Schbang Admin Lead</div>
                <div className="text-[11px] text-text-secondary font-normal">Brand portfolio, reviews &amp; competitor intel</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start rounded-xl text-left bg-white border-border h-auto py-2.5"
              onClick={() => loginWithEmail("rohan.creates@gmail.com", "creator123", "/dashboard")}
              disabled={isLoading}
            >
              <Sparkles className="mr-3 h-4 w-4 text-accent shrink-0" />
              <div>
                <div className="font-semibold text-primary text-sm">Creator: Rohan Joshi</div>
                <div className="text-[11px] text-text-secondary font-normal">Browse briefs, pitch &amp; track campaigns</div>
              </div>
            </Button>
          </div>

          {GOOGLE_ENABLED ? (
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl text-primary font-medium"
              onClick={() => signIn("google", { callbackUrl: callbackUrl || "/dashboard" })}
              disabled={isLoading}
            >
              <GoogleIcon />
              Continue with Google
            </Button>
          ) : (
            <p className="text-xs text-text-secondary text-center rounded-xl border border-dashed border-border py-3 px-4">
              Google sign-in is off in this environment — use a demo profile or email.
            </p>
          )}

          {showEmailForm ? (
            <form onSubmit={handleSubmit} className="space-y-3 animate-in fade-in duration-200">
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-border bg-white"
                autoFocus
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-border bg-white"
                required
              />
              <Button type="submit" className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-white" disabled={isLoading}>
                {isLoading ? "Signing in…" : (<>Sign in with email <ArrowRight className="ml-2 h-4 w-4" /></>)}
              </Button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowEmailForm(true)}
              className="w-full text-center text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
            >
              Use email &amp; password instead
            </button>
          )}

          <p className="text-center text-[11px] text-text-secondary">
            New here?{" "}
            <Link href="/auth/register" onClick={closeSignIn} className="font-semibold text-accent hover:underline">
              Create a creator account
            </Link>
            {gated && (
              <>
                {" · "}
                <button type="button" onClick={handleClose} className="font-semibold hover:text-primary hover:underline">
                  Just browse brands
                </button>
              </>
            )}
          </p>
        </div>
      </Modal>
    </SignInModalContext.Provider>
  );
}
