import { CityForm } from '@/components/admin/cities/city-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function CreateCityPage() {
  return (
    <div className="p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-semibold mb-4">Create City</h1>
        </CardHeader>
        <CardContent>
          <CityForm />
        </CardContent>
      </Card>
    </div>
  );
}
