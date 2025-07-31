import { CCTVForm } from '@/components/admin/cctvs/cctv-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AddCCTVPage() {
  return (
    <div className="p-6">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold mb-4">Create CCTV</h1>
        </CardHeader>
        <CardContent>
          <CCTVForm />
        </CardContent>
      </Card>
    </div>
  );
}
