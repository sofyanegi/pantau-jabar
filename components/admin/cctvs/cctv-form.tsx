'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import L from 'leaflet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import 'leaflet/dist/leaflet.css';
import { CCTVSchema } from '@/types/cctv';
import { City } from '@/types/city';

type CCTVFormProps = {
  defaultValues?: z.infer<typeof CCTVSchema> & { id?: string };
};

function LocationPicker({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const cctvIcon = L.icon({
  iconUrl: '/cctv.svg',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export function CCTVForm({ defaultValues }: CCTVFormProps) {
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  const form = useForm<z.infer<typeof CCTVSchema>>({
    resolver: zodResolver(CCTVSchema),
    defaultValues: defaultValues || {
      name: '',
      streamUrl: '',
      lat: -6.9,
      lng: 107.6,
      cityId: '',
    },
  });

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch('/api/cities');
        const data = await res.json();
        setCities(data.data);
        if (defaultValues?.cityId) {
          form.setValue('cityId', defaultValues.cityId);
        }
      } catch (err) {
        toast.error('Failed to load cities');
      } finally {
        setLoadingCities(false);
      }
    }
    fetchCities();
  }, [defaultValues?.cityId, form]);

  const onSubmit = async (values: z.infer<typeof CCTVSchema>) => {
    try {
      const res = await fetch(`/api/cctvs${defaultValues?.id ? `/${defaultValues.id}` : ''}`, {
        method: defaultValues?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to save CCTV');
      }

      toast.success(`CCTV ${defaultValues?.id ? 'updated' : 'created'} successfully`);
      router.push('/admin/cctvs');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    form.setValue('lat', lat);
    form.setValue('lng', lng);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CCTV Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Simpang Dago" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="streamUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stream URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="lat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input type="number" step="0.000001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lng"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input type="number" step="0.000001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="h-[300px] z-0 rounded overflow-hidden relative">
          <MapContainer center={[form.watch('lat'), form.watch('lng')]} zoom={15} className="h-full w-full z-0">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[form.watch('lat'), form.watch('lng')]} icon={cctvIcon} />
            <LocationPicker onChange={handleMapClick} />
          </MapContainer>
        </div>
        <FormField
          control={form.control}
          name="cityId"
          render={({ field }) => (
            <FormItem className="z-[999]">
              <FormLabel>City</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={loadingCities}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingCities ? 'Loading cities...' : 'Select a city'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (defaultValues?.id ? 'Updating...' : 'Creating...') : defaultValues?.id ? 'Update CCTV' : 'Create CCTV'}
        </Button>
      </form>
    </Form>
  );
}
