"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useSignInModal } from "@/components/auth/sign-in-modal";
import { PLANS, formatINR, type PlanId } from "@/lib/plans";
import { activateMembership, hasActiveMembership } from "@/lib/user-store";
import { MOCK_BRANDS } from "@/lib/mock-data";

type PayMethod = "upi" | "card" | "netbanking";

function JoinCheckout() {
  const params = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { openSignIn } = useSignInModal();
  const { toast } = useToast();

  const planParam = params.get("plan") as PlanId | null;
  const plan = planParam && PLANS[planParam] ? PLANS[planParam] : PLANS.all_access;
  const brief = params.get("brief");
  const briefName = brief ? MOCK_BRANDS.find((b) => b.slug === brief)?.name : undefined;

  const [method, setMethod] = useState<PayMethod>("upi");
  const [paying, setPaying] = useState(false);

  // Where the creator goes once they are a member.
  const afterPay = brief ? `/apply/${brief}` : "/dashboard/profile?welcome=1";

  // Already a member → nothing to buy.
  useEffect(() => {
    if (session?.user?.email && hasActiveMembership(session.user.email)) {
      router.replace(afterPay);
    }
  }, [session, router, afterPay]);

  const handlePay = async () => {
    if (!session?.user?.email) {
      openSignIn({ callbackUrl: `/join?${params.toString()}` });
      return;
    }
    setPaying(true);
    // Payment gateway goes here. Until it is wired, we simulate a successful
    // order so the rest of the flow (membership, gating, dashboard) is real.
    await new Promise((r) => setTimeout(r, 900));
    activateMembership(session.user.email, plan.id);
    toast({
      title: `${plan.name} activated`,
      description: brief ? `You can pitch to ${briefName} now.` : "You can pitch to every open brief.",
      type: "success",
    });
    router.replace(afterPay);
  };

  const signedOut = status === "unauthenticated";

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-primary">Activate your membership</h1>
            <p className="text-text-secondary mt-2">
              {briefName
                ? `You'll be sent straight to your ${briefName} pitch after payment.`
                : "You'll set up your media kit right after payment."}
            </p>

            <fieldset className="mt-8">
              <legend className="text-sm font-semibold text-primary mb-3">Pay with</legend>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ["upi", "UPI"],
                    ["card", "Card"],
                    ["netbanking", "Net banking"],
                  ] as [PayMethod, string][]
                ).map(([id, label]) => (
                  <label
                    key={id}
                    className={`cursor-pointer rounded-xl border px-3 py-3 text-sm font-semibold text-center transition-colors ${
                      method === id
                        ? "border-highlight bg-highlight text-primary"
                        : "border-border bg-surface text-primary hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={id}
                      checked={method === id}
                      onChange={() => setMethod(id)}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface p-5 text-sm text-text-secondary">
              {method === "upi" && "You'll approve a request in your UPI app (GPay, PhonePe, Paytm, BHIM)."}
              {method === "card" && "Visa, Mastercard, RuPay and Amex. 3-D Secure OTP on your bank's page."}
              {method === "netbanking" && "All major Indian banks. You'll be redirected to your bank to confirm."}
            </div>

            <Button
              variant="accent"
              className="w-full h-12 rounded-xl font-bold mt-6"
              onClick={handlePay}
              isLoading={paying}
              disabled={paying || status === "loading"}
            >
              {signedOut ? "Sign in to pay" : `Pay ${formatINR(plan.price)}${plan.period === "month" ? " for the first month" : ""}`}
            </Button>
            <p className="text-xs text-text-secondary text-center mt-3">
              Secured by Schbang. Includes GST.{" "}
              <Link href="/terms" className="underline hover:text-primary">
                Terms
              </Link>
            </p>
          </div>

          <aside className="rounded-3xl border border-border bg-surface p-6 h-fit">
            <h2 className="text-sm font-semibold text-text-secondary">Order summary</h2>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-bold text-primary">{plan.name} plan</span>
              <span className="font-bold text-primary tabular-nums">{formatINR(plan.price)}</span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {plan.period === "month" ? "Renews monthly. Cancel anytime." : "One-time payment. Never renews."}
            </p>
            <ul className="mt-5 space-y-2 text-sm text-text-primary border-t border-border pt-5">
              {plan.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="mt-5 border-t border-border pt-4 flex items-baseline justify-between">
              <span className="text-sm font-semibold text-primary">Total due now</span>
              <span className="text-xl font-black text-primary tabular-nums">{formatINR(plan.price)}</span>
            </div>
            <Link
              href={`/pricing${brief ? `?brief=${encodeURIComponent(brief)}` : ""}`}
              className="block text-xs text-text-secondary hover:text-primary underline mt-4"
            >
              Change plan
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-12" />}>
      <JoinCheckout />
    </Suspense>
  );
}
