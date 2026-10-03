/**
 * Simple in-memory sliding-window rate limiter.
 * Works for single-instance deployments (dev, small VPS, single serverless region).
 *
 * For multi-instance production, swap `store` to Redis/Upstash.
 */

type Entry = {
  count: number;
  resetAt: number;
};

// Global store — shared across requests in the same Node process
const store = new Map<string, Entry>();

// Cleanup old entries every 5 minutes to prevent memory leak
if (typeof globalThis !== "undefined" && !(globalThis as any).__rateLimitCleanup) {
  (globalThis as any).__rateLimitCleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix ms when the window resets
};

export type RateLimitOptions = {
  /** Unique key — usually `${ip}:${route}` */
  key: string;
  /** Max requests allowed in the window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
};

export function rateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  // New window or expired
  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetAt,
    };
  }

  // Within existing window
  if (entry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetAt,
    };
  }

  entry.count++;
  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetAt,
  };
}

/** Reset a specific key (useful after successful login) */
export function resetRateLimit(key: string) {
  store.delete(key);
}

/** Get current stats (for debugging) */
export function getRateLimitStats() {
  return {
    keys: store.size,
    entries: Array.from(store.entries()),
  };
}