'use client';

import { useCCTVStore } from '@/stores/cctv-store';
import CCTVCard from './cctv-card';
import { Skeleton } from '@/components/ui/skeleton';
import { CCTV } from '@/types/cctv';
import { VideoOff } from 'lucide-react';

interface CCTVListProps {
  data?: CCTV[];
  loading?: boolean;
}

export function CCTVList({ data, loading }: CCTVListProps) {
  const store = useCCTVStore();
  const cctvs = data ?? store.cctvs;
  const isLoading = loading ?? store.loading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full" />
        ))}
      </div>
    );
  }

  if (!isLoading && cctvs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground text-center space-y-4">
        <VideoOff className="w-12 h-12 opacity-50" />
        <p className="text-lg font-medium">No CCTV data found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cctvs.map((cctv) => (
        <CCTVCard key={cctv.id} cctv={cctv} />
      ))}
    </div>
  );
}
