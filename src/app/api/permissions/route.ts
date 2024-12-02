import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const permissions = await prisma.permission.findMany();
    return NextResponse.json(permissions, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  try {
    const permission = await prisma.permission.create({
      data: {
        name,
      },
    });
    return NextResponse.json(permission, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract the id from the URL path
  if (!id) {
    return NextResponse.json(
      { error: 'ID parameter is required' },
      { status: 400 }
    );
  }

  try {
    const permission = await prisma.permission.findUnique({
      where: { id: String(id) },
    });

    if (!permission) {
      return NextResponse.json({ error: 'Permission not found' }, { status: 404 });
    }

    await prisma.permission.delete({
      where: { id: String(id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}