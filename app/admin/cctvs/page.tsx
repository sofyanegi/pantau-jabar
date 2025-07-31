'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { CCTV } from '@/types/cctv';
import { getColumns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

async function getCCTVS(): Promise<CCTV[]> {
  const res = await fetch('/api/cctvs', { cache: 'no-store' });
  const { data } = await res.json();
  return data;
}

export default function CCTVsPage() {
  const [cctvs, setCCTVS] = useState<CCTV[]>([]);
  const route = useRouter();

  async function fetchCCTVs() {
    const data = await getCCTVS();
    setCCTVS(data);
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/cctvs/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete CCTV');
      }
      toast.success('CCTV deleted successfully');
      fetchCCTVs();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  }

  function handleEdit(cctv: CCTV) {
    route.push(`/admin/cctvs/${cctv.id}/edit`);
  }

  useEffect(() => {
    fetchCCTVs();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manajemen CCTV</CardTitle>
        <Link href="/admin/cctvs/create">
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Tambah CCTV
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={getColumns({
            onEdit: handleEdit,
            onDelete: handleDelete,
          })}
          data={cctvs}
          searchable
        />
      </CardContent>
    </Card>
  );
}
