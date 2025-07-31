'use client';

import { Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <Ghost className="w-20 h-20 text-muted-foreground mb-4" />
      <h1 className="text-4xl font-bold mb-2">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-muted-foreground mb-6">Maaf, halaman yang kamu cari tidak tersedia atau telah dipindahkan.</p>
      <Button asChild>
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  );
}
