'use client';

import { useEffect } from 'react';
import { useCCTVStore } from '@/stores/cctv-store';
import { CCTVFilterSearch } from '@/components/cctv/cctv-filter-search';
import { CCTVList } from '@/components/cctv/cctv-list';
import { CCTVPagination } from '@/components/cctv/cctv-pagination';
import { useDebounce } from 'use-debounce';
import { useSession } from 'next-auth/react';
import { CCTV } from '@/types/cctv';

export default function CCTVSection() {
  const { selectedCityId, searchKeyword, currentPage, setCCTVs, setCities, setLoading, pagination, setFavorites, setFavoriteCCTVs } = useCCTVStore();
  const { data: session } = useSession();

  const [debouncedKeyword] = useDebounce(searchKeyword, 500);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const query = new URLSearchParams();
        query.set('limit', pagination.limit.toString());
        query.set('page', currentPage.toString());

        if (selectedCityId) query.set('cityId', selectedCityId);

        if (debouncedKeyword) query.set('q', debouncedKeyword);

        const [cctvRes, cityRes] = await Promise.all([fetch(`/api/cctvs?${query}`).then((r) => r.json()), fetch('/api/cities').then((r) => r.json())]);

        setCCTVs(cctvRes.data, cctvRes.pagination);
        setCities(cityRes.data);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [selectedCityId, debouncedKeyword, currentPage]);

  useEffect(() => {
    if (!session?.user) return;

    async function fetchFavorites() {
      const res = await fetch('/api/cctvs/favorites');
      const data = await res.json();
      setFavoriteCCTVs(data);
      setFavorites(data.map((cctv: CCTV) => cctv.id));
    }

    fetchFavorites();
  }, [session]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <CCTVFilterSearch />
      <CCTVList />
      <CCTVPagination />
    </main>
  );
}
