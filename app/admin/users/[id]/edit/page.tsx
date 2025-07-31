'use client';

import EditUserForm from '@/components/admin/users/user-form';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@/types/user';
import { notFound } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditUserPage({ params }: Props) {
  const { id } = use(params);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch user');
        }
        const { data } = await res.json();
        setUser(data);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Something went wrong');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <Skeleton className="h-[100px] w-full" />;
  if (!user) return notFound();

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-semibold mb-4">Edit Pengguna</h1>
        </CardHeader>
        <CardContent>
          <EditUserForm defaultValues={user} />
        </CardContent>
      </Card>
    </div>
  );
}
