'use client';

import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getColumns } from './columns';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

async function getUsers(): Promise<User[]> {
  const res = await fetch('/api/users', { cache: 'no-store' });
  const { data } = await res.json();
  return data;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const route = useRouter();

  async function fetchUsers() {
    const data = await getUsers();
    setUsers(data);
  }

  function handleEdit(user: User) {
    route.push(`/admin/users/${user.id}/edit`);
  }

  async function handleDelete(id: string) {
    toast.warning('Cannot delete user');
  }

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manajemen Pengguna</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={getColumns({
            onEdit: handleEdit,
            onDelete: handleDelete,
          })}
          data={users}
        />
      </CardContent>
    </Card>
  );
}
