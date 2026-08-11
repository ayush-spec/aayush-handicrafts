'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface FilterFABProps {
  onClick: () => void;
}

export default function FilterFAB({ onClick }: FilterFABProps) {
  const searchParams = useSearchParams();

  const activeFiltersCount = [
    searchParams.get('category'),
    searchParams.get('search'),
    searchParams.get('minPrice'),
    searchParams.get('maxPrice'),
    searchParams.get('sort') !== 'newest' ? searchParams.get('sort') : null
  ].filter(Boolean).length;

  return (
    <>
      {/* Mobile FAB - positioned at bottom right */}
      <button
        onClick={onClick}
        className="md:hidden fixed bottom-6 pb-safe right-6 bg-tertiary hover:bg-tertiary/90 text-white
                   w-8 h-8 rounded-sm
                   border border-tertiary-dark
                   flex items-center justify-center
                   transition-colors duration-300
                   z-[60]"
        aria-label={`Open filters${activeFiltersCount > 0 ? `, ${activeFiltersCount} active` : ''}`}
      >
        <SlidersHorizontal className="w-4 h-4" />

        {activeFiltersCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-primary text-white
                       w-4 h-4 rounded-full text-[8px] font-bold
                       flex items-center justify-center
                       border-2 border-white"
            aria-hidden="true"
          >
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Desktop FAB - positioned at bottom */}
      <button
        onClick={onClick}
        className="hidden md:flex fixed bottom-6 pb-safe right-6 bg-tertiary hover:bg-tertiary/90 text-white
                   w-14 h-14 rounded-sm
                   border border-tertiary-dark
                   items-center justify-center
                   transition-colors duration-300
                   z-[60]"
        aria-label={`Open filters${activeFiltersCount > 0 ? `, ${activeFiltersCount} active` : ''}`}
      >
        <SlidersHorizontal className="w-6 h-6" />

        {activeFiltersCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-primary text-white
                       w-6 h-6 rounded-full text-xs font-bold
                       flex items-center justify-center
                       border-2 border-white"
            aria-hidden="true"
          >
            {activeFiltersCount}
          </span>
        )}
      </button>
    </>
  );
}
