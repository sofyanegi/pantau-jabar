'use client';

import { useCCTVStore } from '@/stores/cctv-store';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CCTVPagination() {
  const { pagination, currentPage, setCurrentPage } = useCCTVStore();

  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-4 mt-6">
      <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
        <ChevronLeft className="mr-1" /> Prev
      </Button>
      <span className="text-sm self-center">
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <Button disabled={currentPage === pagination.totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
        Next <ChevronRight className="ml-1" />
      </Button>
    </div>
  );
}
