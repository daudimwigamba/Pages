import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1️⃣ Get token from cookies (optional for testing)
    const cookieHeader = request.headers.get("cookie");
    const token = cookieHeader?.match(/token=([^;]+)/)?.[1];

    if (!token) {
      console.warn("No token provided; proceeding for testing purposes");
    }

    // 2️⃣ Get form data
    const body = await request.json();
    console.log("Received body:", body);

    // 3️⃣ Forward data to backend
    const backendRes = await fetch(
      "http://192.168.12.28:8080/api/v1/customers/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      }
    );

    console.log();

    console.log("Raw response", request)
    const backendData = await backendRes.json();
    console.log("Parsed JSON from backend",backendData)

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: backendData.error || "Failed to submit details" }, // changed message to error
        { status: backendRes.status }
      );
   console.log(body);
    }


    return NextResponse.json(
      {
        message: backendData.message,
        data: backendData,
      },
      { status: 200 } 
    );

  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { message: "Server error, please try again later" },
      { status: 500 }
    );
  }
}
