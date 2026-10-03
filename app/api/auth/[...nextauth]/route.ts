import { handlers } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit-helpers";
// import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const GET = handlers.GET;

export async function POST(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rate-limit the sensitive auth endpoints
  if (
    pathname.includes("/callback/") || // OAuth callback
    pathname.includes("/signin/") ||   // Credentials/oauth signin
    pathname.includes("/signout")      // Sign-out
  ) {
    const blocked = checkRateLimit(req, {
      key: "auth",
      limit: 10,        // 10 requests
      windowMs: 60_000, // per 1 minute per IP
    });
    if (blocked) return blocked;
  }

  return handlers.POST(req);
}