import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/app/generated/prisma';
import prisma from '@/libs/prisma';
import hashPassword from '@/libs/hash';

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

    // Exclude password before returning user object
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
      }
    }

    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
