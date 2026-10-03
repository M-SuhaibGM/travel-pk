import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "./lib/rate-limit-helpers";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Global rate limit for API routes
  if (pathname.startsWith("/api/")) {
    const blocked = checkRateLimit(req, {
      key: `api:${pathname.split("/")[2] ?? "root"}`,
      limit: 100,
      windowMs: 60_000,
    });
    if (blocked) return blocked;
  }
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  const res = NextResponse.next();
  // Track tour detail page views
  const tourMatch = pathname.match(/^\/tours\/([^/]+)$/);
  if (tourMatch) {
    const slug = tourMatch[1];

    // Note: slug, not ID. Homepage getRecommendedTours resolves by slug.
    const existing = req.cookies.get("recentlyViewedSlugs")?.value;
    let slugs: string[] = [];
    if (existing) {
      try {
        slugs = JSON.parse(decodeURIComponent(existing));
        if (!Array.isArray(slugs)) slugs = [];
      } catch {
        slugs = [];
      }
    }

    slugs = [slug, ...slugs.filter((s) => s !== slug)].slice(0, 10);

    res.cookies.set("recentlyViewedSlugs", encodeURIComponent(JSON.stringify(slugs)), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }

  // ==========================================
  // ADMIN ROUTES — require ADMIN role
  // ==========================================
  if (pathname.startsWith("/admin")) {
    // Not logged in → redirect to login
    if (!isLoggedIn) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // Logged in but not admin → redirect home
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ Admin — allow through
    return NextResponse.next();
  }

  // ==========================================
  // ACCOUNT ROUTES — require any auth
  // ==========================================
  if (pathname.startsWith("/account")) {
    if (!isLoggedIn) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ==========================================
  // BOOK ROUTES — require any auth
  // ==========================================
  if (pathname.startsWith("/book")) {
    if (!isLoggedIn) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ==========================================
  // PUBLIC AUTH PAGES — redirect if already logged in
  // ==========================================
  if (pathname === "/login") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ==========================================
  // ALL OTHER ROUTES — public
  // ==========================================
  return NextResponse.next();
});

export const config = {
  //  matcher: ["/tours/:slug"],
  matcher: [
    "/tours/:slug",
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml
     * - public files (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf)$).*)",
  ],
};



