import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendOtp } from "@/server/email-otp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Emails the signed-in user a fresh confirmation code (at most once a minute). */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  try {
    const result = await sendOtp(session.user.id);
    if (result.status === "too_soon") {
      return NextResponse.json(
        { error: `Wait ${result.retryAfterSeconds}s before requesting another code.`, retryAfterSeconds: result.retryAfterSeconds },
        { status: 429 }
      );
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("[otp/send]", err);
    return NextResponse.json({ error: "We couldn't send the email. Try again in a minute." }, { status: 502 });
  }
}
