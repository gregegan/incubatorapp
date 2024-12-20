import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "./lib/env";

const AUTH_ROUTES = ["/", "/login", "/signup"];

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME!)?.value;

  const isAuthPage = Boolean(AUTH_ROUTES.includes(request.nextUrl.pathname));

  if (isAuthPage) {
    if (cookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return null;
  }

  if (!cookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
