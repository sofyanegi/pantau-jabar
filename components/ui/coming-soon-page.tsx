'use client';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

export default function ComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-3xl font-semibold mb-2">Fitur Sedang Dalam Pengembangan</h1>
      <p className="text-muted-foreground mb-6">Kami sedang menyiapkan fitur ini. Mohon ditunggu ya!</p>
      <Button onClick={() => window.history.back()} variant="outline">
        Kembali
      </Button>
    </div>
  );
}
