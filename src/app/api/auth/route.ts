import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const USERS = [
  {
    id: 1,
    email: "admin@example.com",
    password: bcrypt.hashSync("password123", 10), // Hashed password
    role: "admin",
  },
  {
    id: 2,
    email: "user@example.com",
    password: bcrypt.hashSync("userpass123", 10),
    role: "user",
  },
];

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: Request) {
    const { email, password } = await req.json();
    const user = USERS.find((u) => u.email === email);
  
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Include `id` and `role`
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return NextResponse.json({ token, role: user.role });
  }
  
