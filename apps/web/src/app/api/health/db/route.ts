import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

// Prisma's query engine is a native binary — it cannot run on the edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Liveness probe for the database wiring: the workspace package resolves, the
 * generated client is in the bundle, DATABASE_URL reaches the function, and
 * Postgres answers. It is public, so it says only whether the database is up
 * and how long a round trip took — no row counts, no driver error text (that
 * goes to the server log).
 */
export async function GET() {
  if (!process.env.DATABASE_URL) {
    console.error("[health/db] DATABASE_URL is not set in this environment");
    return NextResponse.json({ ok: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  const started = performance.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { ok: true, latencyMs: Math.round(performance.now() - started) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[health/db]", error);
    return NextResponse.json({ ok: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
