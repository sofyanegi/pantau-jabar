import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import { handleApiError } from '@/libs/apiHandler';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    return NextResponse.json({ data: users });
  } catch (error) {
    return handleApiError(error);
  }
}
