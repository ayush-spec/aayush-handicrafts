'use client';

import ProductSearch from './ProductSearch';
import ProductSort from './ProductSort';
import GridToggle, { GridDensity } from './GridToggle';

interface FilterBarProps {
  onDensityChange: (density: GridDensity) => void;
}

export default function FilterBar({ onDensityChange }: FilterBarProps) {
  return (
    <div className="bg-secondary border-b border-ivory/10 mb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
        {/* Single Row with all controls */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Left: Search */}
          <div className="flex-1 max-w-md">
            <ProductSearch />
          </div>

          {/* Right: Sort and Grid Toggle */}
          <div className="flex items-center gap-3">
            <ProductSort />
            <GridToggle onDensityChange={onDensityChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
