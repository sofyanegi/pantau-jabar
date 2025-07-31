'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userFormSchema, UserFormValues } from '@/types/user';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EditUserForm({ defaultValues }: { defaultValues: UserFormValues }) {
  const router = useRouter();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const onSubmit = async (data: UserFormValues) => {
    try {
      const res = await fetch(`/api/users/${defaultValues.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/admin/users');
      } else {
        console.error('Gagal mengupdate user');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nama</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} disabled />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select defaultValue={defaultValues.role} onValueChange={(value) => setValue('role', value as 'ADMIN' | 'USER')}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="USER">User</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
      </div>

      <Button type="submit">Simpan Perubahan</Button>
    </form>
  );
}
