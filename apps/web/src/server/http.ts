import "server-only";

import { NextResponse } from "next/server";
import type { ZodType, ZodTypeDef } from "zod";
import { hitRateLimit, isSameOrigin, type RateLimitStore } from "@/lib/rate-limit";

/** An error whose message is safe to show the user, with the status to send. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}

/**
 * Runs a route handler body and serialises the result. HttpErrors become
 * `{ error }` with their status; anything else is logged and becomes a
 * generic 500 so internals never reach the browser.
 */
export async function respond<T>(fn: () => Promise<T>, status = 200): Promise<NextResponse> {
  try {
    return NextResponse.json(await fn(), { status });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[api]", err);
    return NextResponse.json(
      { error: "Something went wrong on our side. Try again in a minute." },
      { status: 500 }
    );
  }
}

/**
 * Refuses state-changing requests sent from another site (see isSameOrigin).
 * readBody calls it, so every route that takes a body is covered; routes
 * that change state without a body (DELETE) call it themselves.
 */
export function assertSameOrigin(request: Request): void {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!isSameOrigin(request.headers.get("origin"), host)) {
    throw new HttpError(403, "This request didn't come from Align.");
  }
}

const rateLimits: RateLimitStore = new Map();

/**
 * Counts one hit against `key` and fails with 429 once `limit` hits land
 * inside `windowMs`. Keys are namespaced by the caller, e.g. `pitch:<userId>`.
 */
export function enforceRateLimit(key: string, limit: number, windowMs: number): void {
  const result = hitRateLimit(rateLimits, key, limit, windowMs);
  if (!result.ok) {
    throw new HttpError(429, `Too many attempts. Try again in ${result.retryAfterSeconds}s.`);
  }
}

/** Parses a JSON body against a schema, failing with the first issue's message. */
export async function readBody<T>(request: Request, schema: ZodType<T, ZodTypeDef, unknown>): Promise<T> {
  assertSameOrigin(request);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new HttpError(400, "Invalid request body");
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Invalid details");
  }
  return parsed.data;
}

/**
 * Prisma known-request errors, matched by code rather than `instanceof` so
 * this module doesn't import the Prisma runtime (and survives pnpm resolving
 * two copies of @prisma/client).
 */
type PrismaKnownError = { code: string; meta?: Record<string, unknown> };

const hasPrismaCode = (err: unknown, code: string): err is PrismaKnownError =>
  typeof err === "object" && err !== null && (err as { code?: unknown }).code === code;

export const isUniqueViolation = (err: unknown): err is PrismaKnownError => hasPrismaCode(err, "P2002");

/** `update`/`delete` on a row that doesn't exist. */
export const isRecordNotFound = (err: unknown): boolean => hasPrismaCode(err, "P2025");
