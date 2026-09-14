import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

// Prisma's query engine is a native binary — it cannot run on the edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Liveness probe for the database wiring.
 *
 * This exists to independently verify the four separate things that have to be
 * right before any feature code can touch Postgres: the workspace dependency
 * resolves, `transpilePackages` compiles the raw-TS package, the generated
 * client is present in the deployed bundle, and `DATABASE_URL` actually reaches
 * the running function (Turbo's strict env mode will happily build without it).
 */
export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { ok: false, error: "DATABASE_URL is not set in this environment" },
      { status: 503 }
    );
  }

  try {
    const [brands, users] = await Promise.all([
      prisma.brand.count(),
      prisma.user.count(),
    ]);
    return NextResponse.json({ ok: true, brands, users });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown database error",
      },
      { status: 503 }
    );
  }
}
