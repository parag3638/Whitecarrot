import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  const isLoginRoute =
    req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/login");

  // If user is not authenticated, redirect to login
  if (!token && !isLoginRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Optional: you can add role-gated sections here if needed later.

  return NextResponse.next(); // Allow access if checks pass
}

// Apply middleware to protect specific routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
