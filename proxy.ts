import { auth } from "@/lib/auth"

// Next.js 16 explicitly looks for a function named 'proxy' or 'default'
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

  if (isAuthPage) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", req.nextUrl));
    }
    return null;
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL("/auth", req.nextUrl));
  }
});
// proxy.ts or middleware.ts

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (Auth.js)
     * - api/uploadthing (UploadThing callback) <--- ADD THIS
     * - _next/static, _next/image, etc.
     */
    '/((?!api/auth|api/uploadthing|_next/static|_next/image|background.jpg|google.png|favicon.ico).*)',
  ],
};