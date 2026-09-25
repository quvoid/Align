import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { verifyOtp } from "@/server/email-otp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({ code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code") });

/**
 * Checks a code against the signed-in user's live OTP. On success the client
 * calls `useSession().update()`, which re-reads `emailVerifiedAt` from the
 * database in the jwt callback — the client never asserts verification itself.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Enter the 6-digit code" }, { status: 400 });
  }

  const result = await verifyOtp(session.user.id, parsed.data.code);
  switch (result.status) {
    case "verified":
      return NextResponse.json({ status: "verified" });
    case "invalid":
      return NextResponse.json(
        { error: `That code is wrong. ${result.attemptsLeft} ${result.attemptsLeft === 1 ? "try" : "tries"} left.` },
        { status: 400 }
      );
    case "locked":
      return NextResponse.json({ error: "Too many wrong codes. Request a new one." }, { status: 429 });
    case "expired":
      return NextResponse.json({ error: "That code has expired. Request a new one." }, { status: 400 });
  }
}
