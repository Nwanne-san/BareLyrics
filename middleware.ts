import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""

  // Check if it's admin subdomain
  if (hostname.startsWith("admin.")) {
    // Rewrite to admin routes
    if (request.nextUrl.pathname === "/") {
      return NextResponse.rewrite(new URL("/admin", request.url))
    }

    if (!request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.rewrite(new URL(`/admin${request.nextUrl.pathname}`, request.url))
    }
  } else {
    // Regular domain - block admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
