import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import { CCTVInput, CCTVSchema } from '@/types/cctv';
import { validateWithZod, handleApiError } from '@/libs/apiHandler';
import { Prisma } from '@/app/generated/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const rawPage = searchParams.get('page');
  const rawLimit = searchParams.get('limit');
  const cityId = searchParams.get('cityId');
  const query = searchParams.get('q')?.toLowerCase();

  const isPagination = rawPage !== null && rawLimit !== null;

  const page = parseInt(rawPage || '1', 10);
  const limit = parseInt(rawLimit || '10', 10);
  const skip = (page - 1) * limit;

  const where: Prisma.CctvWhereInput = {
    ...(cityId && { cityId }),
    ...(query && {
      OR: [{ id: { contains: query, mode: 'insensitive' } }, { name: { contains: query, mode: 'insensitive' } }],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.cctv.findMany({
      where,
      include: { city: true },
      ...(isPagination && { skip }),
      ...(isPagination && { take: limit }),
      orderBy: { name: 'asc' },
    }),
    prisma.cctv.count({ where }),
  ]);

  return NextResponse.json({
    data,
    pagination: isPagination
      ? {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        }
      : null,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateWithZod(CCTVSchema, body);
    if (!validation.success || !validation.data) return validation.response;

    const { name, streamUrl, lat, lng, cityId } = validation.data as CCTVInput;
    const created = await prisma.cctv.create({
      data: {
        name,
        streamUrl,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        cityId,
      },
      include: { city: true },
    });
    return NextResponse.json({ cctv: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
