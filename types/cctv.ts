import { z } from 'zod';
import { City } from './city';

export interface CCTV {
  id: string;
  name: string;
  streamUrl: string;
  lat: number;
  lng: number;
  cityId: string;
  createdAt: string;
  updatedAt: string;
  city: City;
}

export const CCTVSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  cityId: z.string().min(1, 'City id is required'),
  streamUrl: z.string().min(1, 'Stream URL is required').url('Invalid URL format'),
  lat: z.number(),
  lng: z.number(),
});

export type CCTVInput = z.infer<typeof CCTVSchema>;
