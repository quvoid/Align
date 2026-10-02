/** An API error with the server's user-facing message and HTTP status. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}

/**
 * fetch() for this app's own `/api` routes: JSON in, JSON out, never cached,
 * and a non-2xx response becomes an ApiError carrying the route's `error`
 * message, which is written to be shown to the user as-is.
 */
export async function fetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      cache: "no-store",
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch {
    throw new ApiError(0, "Can't reach Align. Check your connection and try again.");
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, body?.error || "Something went wrong. Try again.");
  }
  return body as T;
}

export const errorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : "Something went wrong. Try again.";
