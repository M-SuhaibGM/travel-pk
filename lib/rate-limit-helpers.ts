import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit, type RateLimitResult } from "./rate-limit";

/**
 * Extract client IP from request headers.
 * Works behind Vercel, Cloudflare, nginx, and locally.
 */
export function getClientIp(req: NextRequest | Request): string {
  const headers = "headers" in req ? req.headers : new Headers();

  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") || // Cloudflare
    headers.get("x-vercel-forwarded-for") || // Vercel
    "unknown"
  );
}

/**
 * Apply a rate limit and return a Response if blocked, or null if OK.
 *
 * Usage:
 *   const blocked = checkRateLimit(req, { key: "auth", limit: 5, windowMs: 60000 });
 *   if (blocked) return blocked;
 */
export function checkRateLimit(
  req: NextRequest | Request,
  options: {
    key: string;
    limit: number;
    windowMs: number;
  }
): NextResponse | null {
  const ip = getClientIp(req);
  const compositeKey = `${options.key}:${ip}`;

  const result: RateLimitResult = rateLimit({
    key: compositeKey,
    limit: options.limit,
    windowMs: options.windowMs,
  });

  if (!result.success) {
    const retryAfterSec = Math.ceil((result.reset - Date.now()) / 1000);

    return NextResponse.json(
      {
        error: "Too many requests",
        message: `Please try again in ${retryAfterSec} seconds.`,
        retryAfter: retryAfterSec,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(result.reset),
        },
      }
    );
  }

  return null;
}