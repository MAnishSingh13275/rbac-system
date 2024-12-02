import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");


  if (!token) {
    return NextResponse.json({ error: "Token not provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { role: string };
    return NextResponse.json({ valid: true, decoded });
  } catch (err) {
    if (err instanceof Error) {
      console.error("JWT Verification Error:", err.message);
    } else {
      console.error("JWT Verification Error:", err);
    }
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
