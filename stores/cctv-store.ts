import { create } from 'zustand';
import { CCTV } from '@/types/cctv';
import { City } from '@/types/city';
import { Pagination } from '@/types/pagination';

type CCTVState = {
  cctvs: CCTV[];
  cities: City[];
  favorites: string[];
  favoriteCCTVs: CCTV[];
  pagination: Pagination;
  selectedCityId: string | null;
  searchKeyword: string;
  currentPage: number;
  loading: boolean;

  setCCTVs: (data: CCTV[], pagination: Pagination) => void;
  setCities: (data: City[]) => void;
  setFavorites: (ids: string[]) => void;
  setFavoriteCCTVs: (data: CCTV[]) => void;
  toggleFavorite: (id: string) => void;
  setSelectedCity: (cityId: string | null) => void;
  setSearchKeyword: (keyword: string) => void;
  setCurrentPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
};

export const useCCTVStore = create<CCTVState>((set, get) => ({
  cctvs: [],
  cities: [],
  favorites: [],
  favoriteCCTVs: [],
  pagination: { total: 0, page: 1, limit: 6, totalPages: 1 },
  selectedCityId: null,
  searchKeyword: '',
  currentPage: 1,
  loading: false,

  setCCTVs: (data, pagination) => set({ cctvs: data, pagination }),
  setCities: (data) => set({ cities: data }),
  setFavorites: (ids) => set({ favorites: ids }),
  setFavoriteCCTVs: (data) => set({ favoriteCCTVs: data }),
  toggleFavorite: (id) => {
    const current = get().favorites;
    set({
      favorites: current.includes(id) ? current.filter((f) => f !== id) : [...current, id],
    });
  },
  setSelectedCity: (cityId) => set({ selectedCityId: cityId, currentPage: 1 }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setLoading: (loading) => set({ loading }),
}));
