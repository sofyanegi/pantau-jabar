import { z } from 'zod';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export const userFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Email tidak valid'),
  role: z.enum(['ADMIN', 'USER'], 'Role Wajib diisi'),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
