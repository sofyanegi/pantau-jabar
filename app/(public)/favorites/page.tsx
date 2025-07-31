'use client';
import { CCTVList } from '@/components/cctv/cctv-list';
import { useCCTVStore } from '@/stores/cctv-store';
import { CCTV } from '@/types/cctv';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Page() {
  const { favoriteCCTVs, loading, setFavorites, setFavoriteCCTVs, setLoading } = useCCTVStore();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/cctvs/favorites');
        if (!res.ok) throw new Error('Failed to fetch favorites');

        const data = await res.json();
        setFavoriteCCTVs(data);
        setFavorites(data.map((cctv: CCTV) => cctv.id));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [session]);

  return <CCTVList data={favoriteCCTVs} loading={loading} />;
}
