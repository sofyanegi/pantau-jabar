'use client';

import { CCTV } from '@/types/cctv';
import { useCCTVStore } from '@/stores/cctv-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, HeartOff } from 'lucide-react';
import { CCTVVideo } from './cctv-video';
import { getProxiedUrl } from '@/libs/getProxiedUrl';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

export default function CCTVCard({ cctv }: { cctv: CCTV }) {
  const { data: session } = useSession();

  const { favorites, toggleFavorite } = useCCTVStore();
  const isFav = favorites.includes(cctv.id);

  const streamURL = getProxiedUrl(cctv.streamUrl);

  async function onClickFavorite(cctvId: string) {
    if (!session?.user) {
      return toast.error('Anda harus login untuk mengubah status favorit');
    }
    try {
      const res = await fetch('/api/cctvs/favorites', {
        method: 'POST',
        body: JSON.stringify({ cctvId }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to toggle favorite');

      toggleFavorite(cctvId);

      toast.success(res.status === 201 ? 'CCTV ditambahkan ke favorit' : 'CCTV dihapus dari favorit');
    } catch (err) {
      toast.error('Gagal mengubah status favorit');
      console.error(err);
    }
  }

  return (
    <Card className="overflow-hidden py-0">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <CCTVVideo hlsSrc={streamURL} />
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        <CardTitle className="text-base">{cctv.name}</CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{cctv.city.name}</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onClickFavorite(cctv.id);
            }}
          >
            {isFav ? <Heart className="text-red-500 fill-red-500" /> : <HeartOff />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
