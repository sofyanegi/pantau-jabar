'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CitySchema } from '@/types/city';

type CityFormProps = {
  defaultValues?: {
    id?: string;
    name: string;
  };
};

export function CityForm({ defaultValues }: CityFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof CitySchema>>({
    resolver: zodResolver(CitySchema),
    defaultValues: defaultValues || { name: '' },
  });

  const onSubmit = async (values: z.infer<typeof CitySchema>) => {
    try {
      const res = await fetch(`/api/cities${defaultValues?.id ? `/${defaultValues.id}` : ''}`, {
        method: defaultValues?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to save city');
      }

      toast.success(`City ${defaultValues?.id ? 'updated' : 'created'} successfully`);
      router.push('/admin/cities');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Bandung" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (defaultValues?.id ? 'Updating...' : 'Creating...') : defaultValues?.id ? 'Update City' : 'Create City'}
        </Button>
      </form>
    </Form>
  );
}
