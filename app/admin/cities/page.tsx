'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { City } from '@/types/city';
import { getColumns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

async function getCities(): Promise<City[]> {
  const res = await fetch('/api/cities', { cache: 'no-store' });
  const { data } = await res.json();
  return data;
}

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const route = useRouter();

  async function fetchCities() {
    const data = await getCities();
    setCities(data);
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/cities/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete city');
      }
      toast.success('City deleted successfully');
      fetchCities();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    }
  }

  function handleEdit(city: City) {
    route.push(`/admin/cities/${city.id}/edit`);
  }

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manajemen Kota</CardTitle>
          <Link href="/admin/cities/create">
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Tambah Kota
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={getColumns({
              onEdit: handleEdit,
              onDelete: handleDelete,
            })}
            data={cities}
            searchable
          />
        </CardContent>
      </Card>
    </>
  );
}
