import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split("/").pop(); // Extract the id from the URL path
  if (!id) {
    return NextResponse.json(
      { error: "ID parameter is required" },
      { status: 400 }
    );
  }
  const { email, name, role, permissions, status } = await req.json();
  try {
    const user = await prisma.user.update({
      where: { id: String(id) },
      data: {
        email,
        name,
        role: { connect: { id: role.id } }, // Connect the user to an existing role using the role's id
        permissions: {
          set: [], // Clear existing permissions
          connect: permissions.map((permission: { name: string }) => ({ name: permission.name })), // Connect the user to existing permissions using the permission's name
        },
        status,
      },
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split("/").pop(); // Extract the id from the URL path
  if (!id) {
    return NextResponse.json(
      { error: "ID parameter is required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: String(id) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: String(id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
