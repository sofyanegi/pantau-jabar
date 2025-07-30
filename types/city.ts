import { z } from 'zod';

export const CitySchema = z.object({
  name: z.string().min(1, 'Nama kota harus diisi').max(100, 'Nama kota terlalu panjang'),
});

export type CityInput = z.infer<typeof CitySchema>;

export interface City {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
