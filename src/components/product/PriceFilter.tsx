'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { DollarSign } from 'lucide-react';

const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: '₹2000+', min: 2000, max: null },
];

export default function PriceFilter() {
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const currentMin = searchParams.get('minPrice');
  const currentMax = searchParams.get('maxPrice');

  const handleQuickFilter = (min: number, max: number | null) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('minPrice', min.toString());
    if (max !== null) {
      params.set('maxPrice', max.toString());
    } else {
      params.delete('maxPrice');
    }

    window.location.href = `/shop?${params.toString()}`;
  };

  const handleApplyCustomRange = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice) {
      params.set('minPrice', minPrice);
    } else {
      params.delete('minPrice');
    }

    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    } else {
      params.delete('maxPrice');
    }

    window.location.href = `/shop?${params.toString()}`;
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minPrice');
    params.delete('maxPrice');
    setMinPrice('');
    setMaxPrice('');
    window.location.href = `/shop?${params.toString()}`;
  };

  const isRangeActive = (min: number, max: number | null) => {
    return (
      currentMin === min.toString() &&
      (max === null ? !currentMax : currentMax === max.toString())
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-ivory/75">
        <DollarSign className="h-4 w-4" />
        <span>Price Range</span>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {PRICE_RANGES.map((range) => (
          <button
            key={range.label}
            onClick={() => handleQuickFilter(range.min, range.max)}
            className={`px-3 py-1.5 text-sm border rounded-sm transition-all ${
              isRangeActive(range.min, range.max)
                ? 'bg-tertiary text-white border-tertiary'
                : 'bg-secondary text-ivory/75 border-ivory/10 hover:border-tertiary/50'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Custom Range */}
      <div className="space-y-2">
        <p className="text-xs text-ivory/45">Custom Range</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            min="0"
            className="w-20 px-2.5 py-1.5 text-sm border border-ivory/10 rounded-sm
                     focus:outline-none focus:ring-2 focus:ring-tertiary/20
                     focus:border-tertiary"
          />
          <span className="text-ivory/35">-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            min="0"
            className="w-20 px-2.5 py-1.5 text-sm border border-ivory/10 rounded-sm
                     focus:outline-none focus:ring-2 focus:ring-tertiary/20
                     focus:border-tertiary"
          />
          <button
            onClick={handleApplyCustomRange}
            className="px-3 py-1.5 text-sm bg-tertiary text-white rounded-sm
                     hover:bg-tertiary-dark transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Clear Button */}
      {(currentMin || currentMax) && (
        <button
          onClick={handleClear}
          className="text-sm text-ivory/45 hover:text-ivory/75 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
