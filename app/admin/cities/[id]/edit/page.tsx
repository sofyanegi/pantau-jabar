'use client';

import { CityForm } from '@/components/admin/cities/city-form';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { City } from '@/types/city';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditCityPage({ params }: Props) {
  const { id } = use(params);
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const res = await fetch(`/api/cities/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch city');
        }
        const { data } = await res.json();
        setCity(data);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Something went wrong');
        setCity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
  }, [id]);

  if (loading) return <Skeleton className="h-[100px] w-full" />;
  if (!city) return notFound();

  return (
    <div className="p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-semibold mb-4">Edit City</h1>
        </CardHeader>
        <CardContent>
          <CityForm defaultValues={{ id: city.id, name: city.name }} />
        </CardContent>
      </Card>
    </div>
  );
}
