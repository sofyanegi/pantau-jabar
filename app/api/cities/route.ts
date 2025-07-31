import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import { CityInput, CitySchema } from '@/types/city';
import { validateWithZod, handleApiError, paginate } from '@/libs/apiHandler';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '');
    const limit = parseInt(searchParams.get('limit') || '');
    const search = searchParams.get('search') || '';

    let whereClause = {};
    if (search) {
      whereClause = {
        name: {
          contains: search,
          mode: 'insensitive' as const,
        },
      };
    }

    const cities = await prisma.city.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { cctvs: true },
        },
      },
    });

    if (!page || !limit) {
      return NextResponse.json({
        data: cities,
      });
    }

    return NextResponse.json(paginate(cities, page, limit));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateWithZod(CitySchema, body);
    if (!validation.success || !validation.data) return validation.response;

    const { name } = validation.data as CityInput;

    const existingCity = await prisma.city.findUnique({
      where: { name },
    });

    if (existingCity) {
      return NextResponse.json({ message: 'Kota dengan nama tersebut sudah ada' }, { status: 409 });
    }

    const created = await prisma.city.create({
      data: { name },
      include: {
        _count: {
          select: { cctvs: true },
        },
      },
    });

    return NextResponse.json({ city: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
