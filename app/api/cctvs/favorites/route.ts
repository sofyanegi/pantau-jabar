import prisma from '@/libs/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/authOptions';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session?.user.id },
      include: {
        cctv: {
          include: {
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const favoriteCctvs = favorites.map((fav: any) => fav.cctv);

    return NextResponse.json(favoriteCctvs);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  try {
    const { cctvId } = await request.json();

    if (!cctvId) {
      return NextResponse.json({ message: 'cctvId is required' }, { status: 400 });
    }

    const userId = session?.user.id;

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_cctvId: { userId, cctvId },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({ where: { userId_cctvId: { userId, cctvId } } });
      return NextResponse.json({ success: true, status: 'removed favorites' }, { status: 200 });
    } else {
      await prisma.favorite.create({ data: { userId, cctvId } });
      return NextResponse.json({ success: true, status: 'added favorites' }, { status: 201 });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
