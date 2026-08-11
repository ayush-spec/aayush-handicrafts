'use client';

import { useEffect, useState } from 'react';
import { LayoutGrid, Grid2x2 } from 'lucide-react';

export type GridDensity = 2 | 3;

interface GridToggleProps {
  onDensityChange: (density: GridDensity) => void;
}

export default function GridToggle({ onDensityChange }: GridToggleProps) {
  const [density, setDensity] = useState<GridDensity>(2);

  // Load density from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gridDensity');
    if (saved === '2' || saved === '3') {
      setDensity(parseInt(saved) as GridDensity);
      onDensityChange(parseInt(saved) as GridDensity);
    }
  }, [onDensityChange]);

  const handleDensityChange = (newDensity: GridDensity) => {
    setDensity(newDensity);
    localStorage.setItem('gridDensity', newDensity.toString());
    onDensityChange(newDensity);
  };

  return (
    <div className="flex items-center gap-1 border border-ivory/10 rounded-lg p-1">
      <button
        onClick={() => handleDensityChange(2)}
        className={`p-2 rounded transition-colors ${
          density === 2
            ? 'bg-tertiary text-white'
            : 'text-ivory/45 hover:text-ivory/75 hover:bg-secondary'
        }`}
        aria-label="2 column grid"
        title="2 column grid (spacious)"
      >
        <Grid2x2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleDensityChange(3)}
        className={`p-2 rounded transition-colors ${
          density === 3
            ? 'bg-tertiary text-white'
            : 'text-ivory/45 hover:text-ivory/75 hover:bg-secondary'
        }`}
        aria-label="3 column grid"
        title="3 column grid (compact)"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
    </div>
  );
}
