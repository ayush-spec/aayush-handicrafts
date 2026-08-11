'use client';

import { useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export default function ProductSort() {
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get('sort') as SortOption) || 'newest';

  const handleSortChange = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'newest') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }

    window.location.href = `/shop?${params.toString()}`;
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-ivory/45" />
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value as SortOption)}
        className="px-3 py-2 font-sans text-xs font-medium tracking-wide uppercase text-ivory/35 border border-ivory/10 rounded-sm bg-secondary
                   focus:outline-none focus:ring-2 focus:ring-tertiary/20
                   focus:border-tertiary transition-colors cursor-pointer
                   appearance-none pr-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
        }}
      >
        <option value="newest">NEWEST FIRST</option>
        <option value="price-asc">PRICE: LOW TO HIGH</option>
        <option value="price-desc">PRICE: HIGH TO LOW</option>
        <option value="name-asc">NAME: A-Z</option>
        <option value="name-desc">NAME: Z-A</option>
      </select>
    </div>
  );
}
