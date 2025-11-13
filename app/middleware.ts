import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1️⃣ If visiting login page and already have a token → go to dashboard
  if (pathname.startsWith("/loginpageui") && token) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboardpageui";
    return NextResponse.redirect(dashboardUrl);
  }

  // 2️⃣ If visiting dashboard and no token → go back to login
  if (pathname.startsWith("/dashboardpageui") && !token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/loginpageui";
    return NextResponse.redirect(loginUrl);
  }

  // 3️⃣ Otherwise, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: ["/loginpageui", "/dashboardpageui/:path*"],
};
