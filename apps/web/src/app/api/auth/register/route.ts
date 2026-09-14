import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db";
import { normalizeEmail, isSeededAdminEmail } from "@/lib/auth-shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters").max(200),
});

/**
 * Creates a real account.
 *
 * Previously the "Create account" button called signIn() directly and no row was
 * ever written — any email became a session, and the name the creator typed was
 * discarded in favour of the email's local-part.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid details" },
      { status: 400 }
    );
  }

  const email = normalizeEmail(parsed.data.email);
  const { name, password } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  if (existing) {
    // Distinguish the two cases so the creator knows which button to press,
    // without confirming anything an attacker could not already discover by
    // attempting a signup.
    return NextResponse.json(
      {
        error: existing.passwordHash
          ? "An account with this email already exists. Sign in instead."
          : "This email signs in with Google. Use the Google button.",
      },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        provider: "CREDENTIALS",
        role: isSeededAdminEmail(email) ? "ADMIN" : "CREATOR",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        // Empty profile so the media-kit form and the verification queue always
        // have a row to write against.
        creatorProfile: { create: {} },
      },
    });
  } catch {
    // Unique violation from a concurrent signup on the same email.
    return NextResponse.json(
      { error: "An account with this email already exists. Sign in instead." },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
