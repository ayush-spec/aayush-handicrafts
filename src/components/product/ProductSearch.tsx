'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }

      router.push(`/shop?${params.toString()}`);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, router, searchParams]);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-ivory/35" strokeWidth={1.5} />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="SEARCH"
        className="w-full pl-10 pr-9 py-2 font-sans text-xs font-medium tracking-wide uppercase border border-ivory/10 rounded-sm
                   focus:outline-none focus:ring-2 focus:ring-tertiary/20
                   focus:border-tertiary transition-colors placeholder:text-ivory/35 placeholder:font-medium placeholder:uppercase placeholder:tracking-wide"
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/35 hover:text-ivory/55 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
