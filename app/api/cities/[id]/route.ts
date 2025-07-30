import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import { CityInput, CitySchema } from '@/types/city';
import { validateWithZod, handleApiError } from '@/libs/apiHandler';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        cctvs: {
          orderBy: { name: 'asc' },
        },
        _count: {
          select: { cctvs: true },
        },
      },
    });

    if (!city) {
      return NextResponse.json({ message: 'Kota tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ city });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const validation = validateWithZod(CitySchema, body);
    if (!validation.success || !validation.data) return validation.response;

    const { name } = validation.data as CityInput;

    // Check if city exists
    const existingCity = await prisma.city.findUnique({
      where: { id },
    });

    if (!existingCity) {
      return NextResponse.json({ message: 'Kota tidak ditemukan' }, { status: 404 });
    }

    // Check if name already exists for another city
    const cityWithSameName = await prisma.city.findFirst({
      where: {
        name,
        id: { not: id },
      },
    });

    if (cityWithSameName) {
      return NextResponse.json({ message: 'Kota dengan nama tersebut sudah ada' }, { status: 409 });
    }

    const updated = await prisma.city.update({
      where: { id },
      data: { name },
      include: {
        _count: {
          select: { cctvs: true },
        },
      },
    });

    return NextResponse.json({ city: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    // Check if city exists
    const existingCity = await prisma.city.findUnique({
      where: { id },
      include: {
        _count: {
          select: { cctvs: true },
        },
      },
    });

    if (!existingCity) {
      return NextResponse.json({ message: 'Kota tidak ditemukan' }, { status: 404 });
    }

    // Check if city has associated CCTVs
    if (existingCity._count.cctvs > 0) {
      return NextResponse.json(
        {
          message: 'Tidak dapat menghapus kota yang memiliki CCTV',
          cctvCount: existingCity._count.cctvs,
        },
        { status: 400 }
      );
    }

    await prisma.city.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Kota berhasil dihapus' }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
