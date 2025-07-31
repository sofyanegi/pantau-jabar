'use client';

import { CCTVForm } from '@/components/admin/cctvs/cctv-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CCTV } from '@/types/cctv';

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditCCTVPage({ params }: Props) {
  const { id } = use(params);
  const [cctv, setCctv] = useState<CCTV | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCctv = async () => {
      try {
        const res = await fetch(`/api/cctvs/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch cctv');
        }
        const { data } = await res.json();
        setCctv(data);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Something went wrong');
        setCctv(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCctv();
  }, [id]);

  if (loading) return <Skeleton className="h-[100px] w-full" />;
  if (!cctv) return notFound();

  return (
    <div className="p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-semibold mb-4">Edit CCTV</h1>
        </CardHeader>
        <CardContent>
          <CCTVForm defaultValues={cctv} />
        </CardContent>
      </Card>
    </div>
  );
}
