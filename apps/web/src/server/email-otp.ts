import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { prisma } from "@/server/db";
import { sendEmail } from "@/server/email";

/**
 * One-time email codes that confirm a creator owns their address on first
 * sign-in. The code itself is never stored — only an HMAC keyed with
 * AUTH_SECRET — and each code allows a handful of guesses before a new one
 * must be requested.
 */

export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_RESEND_AFTER_MS = 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;

const secret = () => process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-only-otp-secret";

const hashCode = (userId: string, code: string) =>
  createHmac("sha256", secret()).update(`${userId}:${code}`).digest("hex");

export type SendResult =
  | { status: "sent" }
  | { status: "already_verified" }
  | { status: "too_soon"; retryAfterSeconds: number };

export async function sendOtp(userId: string): Promise<SendResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, emailVerifiedAt: true, emailOtp: { select: { sentAt: true } } },
  });
  if (!user) throw new Error("User not found");
  if (user.emailVerifiedAt) return { status: "already_verified" };

  const sinceLast = user.emailOtp ? Date.now() - user.emailOtp.sentAt.getTime() : Infinity;
  if (sinceLast < OTP_RESEND_AFTER_MS) {
    return { status: "too_soon", retryAfterSeconds: Math.ceil((OTP_RESEND_AFTER_MS - sinceLast) / 1000) };
  }

  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const row = { codeHash: hashCode(userId, code), expiresAt: new Date(Date.now() + OTP_TTL_MS), attempts: 0, sentAt: new Date() };
  await prisma.emailOtp.upsert({ where: { userId }, create: { userId, ...row }, update: row });

  const firstName = user.name.split(" ")[0] || "there";
  await sendEmail({
    to: user.email,
    subject: `${code} is your Align confirmation code`,
    text: `Hi ${firstName},\n\nYour Align confirmation code is ${code}. It expires in 10 minutes.\n\nIf you didn't try to sign in to Align, ignore this email.`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:420px;margin:0 auto;padding:24px;color:#211922">
  <p style="font-size:20px;font-weight:800;margin:0 0 24px">Align<span style="color:#e60023">.</span></p>
  <p style="margin:0 0 16px">Hi ${escapeHtml(firstName)}, here's your confirmation code:</p>
  <p style="font-size:32px;font-weight:800;letter-spacing:8px;margin:0 0 16px">${code}</p>
  <p style="color:#666;font-size:14px;margin:0">It expires in 10 minutes. If you didn't try to sign in to Align, ignore this email.</p>
</div>`,
  });

  return { status: "sent" };
}

export type VerifyResult =
  | { status: "verified" }
  | { status: "invalid"; attemptsLeft: number }
  | { status: "expired" }
  | { status: "locked" };

export async function verifyOtp(userId: string, code: string): Promise<VerifyResult> {
  const otp = await prisma.emailOtp.findUnique({ where: { userId } });
  if (!otp || otp.expiresAt.getTime() < Date.now()) return { status: "expired" };
  if (otp.attempts >= OTP_MAX_ATTEMPTS) return { status: "locked" };

  const expected = Buffer.from(otp.codeHash, "hex");
  const actual = Buffer.from(hashCode(userId, code), "hex");
  if (!timingSafeEqual(expected, actual)) {
    // Count the attempt atomically so parallel guesses can't share one slot.
    const { attempts } = await prisma.emailOtp.update({
      where: { userId },
      data: { attempts: { increment: 1 } },
      select: { attempts: true },
    });
    return attempts >= OTP_MAX_ATTEMPTS ? { status: "locked" } : { status: "invalid", attemptsLeft: OTP_MAX_ATTEMPTS - attempts };
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { emailVerifiedAt: new Date() } }),
    prisma.emailOtp.delete({ where: { userId } }),
  ]);
  return { status: "verified" };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
