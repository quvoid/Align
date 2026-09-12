"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { hasActiveMembership } from "@/lib/user-store";
import type { Plan } from "@/lib/plans";

/**
 * Primary CTA on a pricing card. Carries the brief the creator came from
 * (`?brief=slug`) through checkout so they land back on the apply form.
 */
export function PlanButton({ plan }: { plan: Plan }) {
  const { data: session } = useSession();
  const params = useSearchParams();
  const brief = params.get("brief");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (session?.user?.email) setActive(hasActiveMembership(session.user.email));
  }, [session]);

  if (active) {
    return (
      <Link href={brief ? `/apply/${brief}` : "/brands"} className="block">
        <Button variant="outline" className="w-full h-12 rounded-xl font-bold">
          {brief ? "Continue to your pitch" : "You're a member — browse briefs"}
        </Button>
      </Link>
    );
  }

  const href = `/join?plan=${plan.id}${brief ? `&brief=${encodeURIComponent(brief)}` : ""}`;

  return (
    <Link href={href} className="block">
      <Button variant={plan.recommended ? "accent" : "primary"} className="w-full h-12 rounded-xl font-bold">
        {plan.cta}
      </Button>
    </Link>
  );
}
