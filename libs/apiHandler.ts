import { NextResponse } from 'next/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodSchema } from 'zod';

export function paginate<T>(items: T[], page: number, limit: number) {
  const totalRecords = items.length;
  const totalPages = Math.ceil(totalRecords / limit);
  const offset = (page - 1) * limit;
  const paginatedData = items.slice(offset, offset + limit);
  return {
    data: paginatedData,
    pagination: {
      total_records: totalRecords,
      current_page: page,
      total_pages: totalPages,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
    },
  };
}

export function handleApiError(error: unknown) {
  if (error instanceof PrismaClientKnownRequestError) {
    return NextResponse.json(
      {
        message: 'Prisma error',
        code: error.code,
        meta: error.meta,
      },
      { status: 400 }
    );
  }
  return NextResponse.json(
    {
      message: 'Internal server error',
      error: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
}

export function validateWithZod<T>(schema: ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json({ errors: result.error.flatten() }, { status: 400 }),
    };
  }
  return { success: true, data: result.data };
}
