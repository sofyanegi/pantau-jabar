'use client';

import { useCCTVStore } from '@/stores/cctv-store';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function CCTVFilterSearch() {
  const { cities, selectedCityId, searchKeyword, setSearchKeyword, setSelectedCity } = useCCTVStore();

  return (
    <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-4">
      <Input className="w-full md:w-1/2" placeholder="Search CCTV..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
      <Select
        value={selectedCityId || ''}
        onValueChange={(value) => {
          value === 'all' ? setSelectedCity(null) : setSelectedCity(value);
        }}
      >
        <SelectTrigger className="w-full md:w-1/3">
          <SelectValue placeholder="Filter by City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city.id} value={city.id}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
