import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  // Helper: redirect
  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  // 1️⃣ If accessing login page and already authenticated → go dashboard
  if (pathname.startsWith("/loginpageui")) {
    if (accessToken || refreshToken) {
      return redirectTo("/dashboardpageui");
    }
    return NextResponse.next();
  }

  // 2️⃣ Protect dashboard route
  if (pathname.startsWith("/dashboardpageui")) {
    // ✔ If access token exists → allow
    if (accessToken) {
      return NextResponse.next();
    }

    // ❌ No access token but ✔ has refresh token → try refresh
    if (!accessToken && refreshToken) {
      try {
        const refreshResponse = await fetch(
          `${request.nextUrl.origin}/api/auth/refresh`,
          {
            method: "POST",
            headers: {
              Cookie: `refreshToken=${refreshToken}`,
            },
          }
        );

        // If refresh failed → back to login
        if (!refreshResponse.ok) {
          return redirectTo("/loginpageui");
        }

        // Backend sets new access token via Set-Cookie
        const response = NextResponse.next();

        // Forward the Set-Cookie header to browser
        const setCookie = refreshResponse.headers.get("set-cookie");
        if (setCookie) {
          response.headers.set("set-cookie", setCookie);
        }

        return response;
      } catch (err) {
        // Server refresh error → login
        return redirectTo("/loginpageui");
      }
    }

    // ❌ No access token and ❌ no refresh token → login
    return redirectTo("/loginpageui");
  }

  // 3️⃣ Otherwise allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/loginpageui", "/dashboardpageui/:path*"],
};
