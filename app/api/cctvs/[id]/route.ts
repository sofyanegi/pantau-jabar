import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import { CCTVInput, CCTVSchema } from '@/types/cctv';
import { handleApiError, validateWithZod } from '@/libs/apiHandler';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const cctv = await prisma.cctv.findUnique({ where: { id }, include: { city: true } });
  if (!cctv) {
    return NextResponse.json({ message: 'CCTV not found' }, { status: 404 });
  }
  return NextResponse.json(cctv);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  try {
    const body = await request.json();
    const validation = validateWithZod(CCTVSchema, body);
    if (!validation.success || !validation.data) return validation.response;

    const { name, streamUrl, lat, lng, cityId } = validation.data as CCTVInput;
    const updated = await prisma.cctv.update({
      where: { id },
      data: {
        name,
        streamUrl,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        cityId,
      },
      include: { city: true },
    });
    return NextResponse.json({ cctv: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  try {
    const deleted = await prisma.cctv.delete({ where: { id } });
    return NextResponse.json({ message: 'CCTV deleted', cctv: deleted });
  } catch (error) {
    return handleApiError(error);
  }
}
