// app/api/login/route.ts
import { NextResponse } from "next/server";

const SPRING_AUTH_URL = process.env.SPRING_AUTH_URL || "https://api.example.com/auth/login";

export async function POST(request: Request) {
  try {
    const body = await request.json(); // { domainEmail, domainPassword } from client

    // Forward credentials to Spring Boot auth endpoint
    const backendRes = await fetch(SPRING_AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // If backend returns non-OK, forward the message
    if (!backendRes.ok) {
      const errorBody = await backendRes.text();
      return NextResponse.json({ success: false, error: errorBody }, { status: backendRes.status });
    }

    // parse token response (assumes backend returns JSON like { token: "...", expiresIn: 3600, user: {...} })
    const json = await backendRes.json();
    const token = json.token ?? json.accessToken ?? null;
    if (!token) {
      // no token in response — return whatever the backend gave
      return NextResponse.json({ success: false, error: "No token in auth response", raw: json }, { status: 500 });
    }

    // Create response and set cookie (httpOnly)
    const res = NextResponse.json({ success: true, message: "Login successful", user: json.user ?? null });

    // set cookie options
    // maxAge in seconds (e.g., 1 hour = 3600). If backend included expiry use it.
    const maxAge = json.expiresIn ? Number(json.expiresIn) : 60 * 60;

    // store the token in an httpOnly cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",     // adjust as needed (lax is good default)
      path: "/",
      maxAge, // seconds
    });

    return res;
  } catch (err) {
    console.error("Login proxy error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
