// app/api/pulluserdata/route.ts
import { NextResponse } from "next/server";

type User = {
  fullName: string;
  idno: string;
  email: string;
  address: string;
  phoneno: string;
  gender: string;
};

// In-memory demo users. In a real app, use a database.
let USERS: User[] = [
  {
    fullName: "John Doe",
    idno: "19992704121050000323",
    email: "john@gmail.com",
    address: "Buza",
    phoneno: "0719553340",
    gender: "Male",
  },
  {
    fullName: "Alex Grant",
    idno: "20010808121050000323",
    email: "alexgrant@gmail.com",
    address: "Kagera",
    phoneno: "0722001122",
    gender: "Female",
  },
    {
    fullName: "Jane Smith",
    idno: "19981234567890000001",
    email: "jane@example.com",
    address: "Kagera",
    phoneno: "0722001122",
    gender: "Female",
  },
  
  // Add more demo users here if you want
];

export async function GET() {
  // Return all users
  return NextResponse.json(USERS);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { idno } = body;
    if (!idno) {
      return NextResponse.json({ error: "idno required" }, { status: 400 });
    }

    const idx = USERS.findIndex((u) => u.idno === idno);
    if (idx === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Merge update fields into the existing user
    USERS[idx] = { ...USERS[idx], ...body };

    return NextResponse.json({ success: true, user: USERS[idx] });
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { idno } = body;
    if (!idno) {
      return NextResponse.json({ error: "idno required" }, { status: 400 });
    }

    const idx = USERS.findIndex((u) => u.idno === idno);
    if (idx === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // remove the user
    USERS.splice(idx, 1);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
