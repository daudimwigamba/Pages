import { baseUrl } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // 1️⃣ Call backend login
  const backendRes = await fetch(`${baseUrl}/staffs/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",  
  });

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data.error || "Invalid username or password" },
      { status: backendRes.status }
    );
  }

  // 2️⃣ Save tokens in cookies
  const response = NextResponse.json({ success: true });

  response.cookies.set("accessToken", data.accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15, // 15 minutes
    sameSite: "lax",
  });

  response.cookies.set("refreshToken", data.refreshToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  });

  return response;
}
