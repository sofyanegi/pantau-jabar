import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import { CCTVInput, CCTVSchema } from '@/types/cctv';
import { validateWithZod, handleApiError, paginate } from '@/libs/apiHandler';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '');
  const limit = parseInt(searchParams.get('limit') || '');

  const cctvs = await prisma.cctv.findMany({ include: { city: true } });

  if (!page || !limit) {
    return NextResponse.json(cctvs);
  }

  return NextResponse.json(paginate(cctvs, page, limit));
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
