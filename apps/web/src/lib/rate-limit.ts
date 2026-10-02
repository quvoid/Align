/**
 * Sliding-window rate limiting, kept free of server-only imports so it can be
 * unit tested. `server/http.ts` wraps it into `enforceRateLimit`.
 *
 * The store is in-memory, so each serverless instance counts on its own: it
 * stops a burst hammering one warm instance (the common brute-force shape),
 * not a distributed attack. For a hard global limit, back `RateLimitStore`
 * with Redis (e.g. Upstash) and keep the call sites as they are.
 */
export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the oldest hit in the window expires (0 when ok). */
  retryAfterSeconds: number;
  remaining: number;
}

export type RateLimitStore = Map<string, number[]>;

const MAX_KEYS = 10_000;

export function hitRateLimit(
  store: RateLimitStore,
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now()
): RateLimitResult {
  const since = now - windowMs;
  const hits = (store.get(key) ?? []).filter((t) => t > since);

  if (hits.length >= limit) {
    store.set(key, hits);
    const oldest = hits[0] ?? now;
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)), remaining: 0 };
  }

  hits.push(now);
  store.set(key, hits);
  if (store.size > MAX_KEYS) prune(store, since);
  return { ok: true, retryAfterSeconds: 0, remaining: limit - hits.length };
}

/** Drops keys with no hits left in the window, so the map can't grow forever. */
function prune(store: RateLimitStore, since: number) {
  store.forEach((hits, key) => {
    if (!hits.some((t) => t > since)) store.delete(key);
  });
}

/**
 * The client's IP as the platform reports it. On Vercel the first entry of
 * x-forwarded-for is the client; elsewhere fall back to x-real-ip.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Whether a state-changing request came from this site. Browsers attach
 * Origin to cross-site POST/PUT/PATCH/DELETE; when it's present it must name
 * the host the request was sent to. A missing Origin (server-to-server calls,
 * curl) is allowed: those carry no victim's cookies. SameSite=Lax session
 * cookies are the first line against CSRF; this is the second.
 */
export function isSameOrigin(origin: string | null, host: string | null): boolean {
  if (!origin || !host) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
