import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
        permissions: true,
      },
    });
    console.log(users);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { email, name, role, permissions } = await req.json();
  try {
    // Check if the role exists
    const roleExists = await prisma.role.findUnique({
      where: { id: role },
    });

    if (!roleExists) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Check if all permissions exist
    const permissionsExist = await prisma.permission.findMany({
      where: { name: { in: permissions } },
    });

    if (permissionsExist.length !== permissions.length) {
      return NextResponse.json({ error: 'One or more permissions not found' }, { status: 404 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: { connect: { id: role } }, // Connect the user to an existing role
        permissions: {
          connect: permissions.map((permission: string) => ({ name: permission })), // Connect the user to existing permissions
        },
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error creating user:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}