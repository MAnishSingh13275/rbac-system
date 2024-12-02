import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { email, name, role, permissions } = await req.json();
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: { connect: { id: role } }, // Connect the user to an existing role
        permissions,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error creating user:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}