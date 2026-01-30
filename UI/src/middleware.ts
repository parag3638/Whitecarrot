import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwtPayload(token: string) {
  const payload = token.split(".")[1];
  if (!payload) return null;
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  try {
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string) {
  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;
  if (typeof exp !== "number") return true;
  return Date.now() >= exp * 1000;
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  const isLoginRoute =
    req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/login");

  // If user is not authenticated or token expired, redirect to login.
  if ((!token || isTokenExpired(token)) && !isLoginRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Optional: you can add role-gated sections here if needed later.

  return NextResponse.next(); // Allow access if checks pass
}

// Apply middleware to protect specific routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
