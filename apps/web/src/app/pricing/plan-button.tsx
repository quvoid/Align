"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchMe } from "@/lib/user-store";
import { isMembershipActive, type Plan } from "@/lib/plans";

/**
 * Primary CTA on a pricing card. Carries the brief the creator came from
 * (`?brief=slug`) through checkout so they land back on the apply form.
 */
export function PlanButton({ plan }: { plan: Plan }) {
  const { data: session } = useSession();
  const params = useSearchParams();
  const brief = params.get("brief");
  const [active, setActive] = useState(false);

  const email = session?.user?.email;
  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    fetchMe()
      .then((me) => !cancelled && setActive(isMembershipActive(me.membership)))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [email]);

  if (active) {
    return (
      <Link href={brief ? `/apply/${brief}` : "/brands"} className="block">
        <Button variant="outline" className="w-full h-12 rounded-xl font-semibold">
          {brief ? "Continue to your pitch" : "You're a member — browse briefs"}
        </Button>
      </Link>
    );
  }

  const href = `/join?plan=${plan.id}${brief ? `&brief=${encodeURIComponent(brief)}` : ""}`;

  return (
    <Link href={href} className="block">
      <Button variant={plan.recommended ? "accent" : "primary"} className="w-full h-12 rounded-xl font-semibold">
        {plan.cta}
      </Button>
    </Link>
  );
}
