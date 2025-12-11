import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { accessToken } = await request.json();

  if (!accessToken) {
    return NextResponse.json({ message: "Token missing" }, { status: 400 });
  }

  // 🧁 Set accessToken in HttpOnly cookie
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "accessToken",
    value: accessToken,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
