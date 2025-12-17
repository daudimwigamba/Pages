import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  // If visiting login page and already logged in → go dashboard
  if (pathname.startsWith("/loginpageui")) {
    if (accessToken) return redirectTo("/dashboardpageui");
    return NextResponse.next();
  }

  // Protect dashboard
  if (pathname.startsWith("/dashboardpageui")) {
    if (!accessToken) {
      return redirectTo("/loginpageui");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/loginpageui", "/dashboardpageui/:path*"],
};