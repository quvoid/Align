import { describe, expect, it } from "vitest";
import { clientIp, hitRateLimit, isSameOrigin, type RateLimitStore } from "../rate-limit";

describe("hitRateLimit", () => {
  it("allows up to the limit inside the window, then refuses", () => {
    const store: RateLimitStore = new Map();
    const t0 = 1_000_000;
    for (let i = 0; i < 3; i++) expect(hitRateLimit(store, "k", 3, 60_000, t0 + i).ok).toBe(true);
    const blocked = hitRateLimit(store, "k", 3, 60_000, t0 + 10);
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
    // The oldest hit (t0) leaves the window at t0 + 60s: ~60s to wait.
    expect(blocked.retryAfterSeconds).toBe(60);
  });

  it("frees a slot once the oldest hit slides out of the window", () => {
    const store: RateLimitStore = new Map();
    const t0 = 5_000_000;
    hitRateLimit(store, "k", 2, 1_000, t0);
    hitRateLimit(store, "k", 2, 1_000, t0 + 500);
    expect(hitRateLimit(store, "k", 2, 1_000, t0 + 900).ok).toBe(false);
    expect(hitRateLimit(store, "k", 2, 1_000, t0 + 1_001).ok).toBe(true);
  });

  it("counts keys separately", () => {
    const store: RateLimitStore = new Map();
    expect(hitRateLimit(store, "a", 1, 60_000, 1).ok).toBe(true);
    expect(hitRateLimit(store, "b", 1, 60_000, 1).ok).toBe(true);
    expect(hitRateLimit(store, "a", 1, 60_000, 2).ok).toBe(false);
  });

  it("refused attempts don't extend the lockout", () => {
    const store: RateLimitStore = new Map();
    hitRateLimit(store, "k", 1, 1_000, 0);
    for (let t = 100; t < 1_000; t += 100) hitRateLimit(store, "k", 1, 1_000, t);
    expect(hitRateLimit(store, "k", 1, 1_000, 1_001).ok).toBe(true);
  });
});

describe("isSameOrigin", () => {
  it("accepts a matching origin and host", () => {
    expect(isSameOrigin("https://align.schbang.com", "align.schbang.com")).toBe(true);
    expect(isSameOrigin("http://localhost:3000", "localhost:3000")).toBe(true);
  });

  it("refuses another site, or a different port", () => {
    expect(isSameOrigin("https://evil.example", "align.schbang.com")).toBe(false);
    expect(isSameOrigin("http://localhost:4000", "localhost:3000")).toBe(false);
  });

  it("allows requests without an Origin (no browser, no victim cookies)", () => {
    expect(isSameOrigin(null, "align.schbang.com")).toBe(true);
  });

  it("refuses a malformed Origin", () => {
    expect(isSameOrigin("not a url", "align.schbang.com")).toBe(false);
  });
});

describe("clientIp", () => {
  it("takes the first x-forwarded-for entry", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }))).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip, then 'unknown'", () => {
    expect(clientIp(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
