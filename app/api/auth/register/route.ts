import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import hashPassword from '@/libs/hash';
import { handleApiError } from '@/libs/apiHandler';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password } = body;

  const errors: string[] = [];

  if (!name || !email || !password) {
    errors.push('name, email, and password are required');
  }

  if (password && password.length < 6) {
    errors.push('Password length should be more than 6 characters');
  }

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
