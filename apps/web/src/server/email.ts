import "server-only";

/**
 * Transactional email. Resend's HTTP API via fetch — no SDK dependency, and
 * swapping providers means changing only this function.
 *
 * Env: RESEND_API_KEY, EMAIL_FROM (e.g. "Align <no-reply@align.schbang.com>";
 * the domain must be verified in Resend).
 *
 * Without a key outside production the message is printed to the server
 * console instead, so local sign-up works with zero setup.
 */
export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set; cannot send email in production.");
    }
    console.info(`\n[email:dev] to=${to}\nsubject: ${subject}\n${text}\n`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Align <onboarding@resend.dev>",
      to,
      subject,
      text,
      html,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`Email send failed: ${res.status} ${await res.text().catch(() => "")}`);
  }
}
