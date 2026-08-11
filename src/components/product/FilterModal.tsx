'use client';

import { useSearchParams } from 'next/navigation';
import { Modal, Button } from '@/components/ui';
import ProductSearch from './ProductSearch';
import ProductSort from './ProductSort';
import CategoryFilter from './CategoryFilter';
import PriceFilter from './PriceFilter';
import { Category } from '@/types/sanity';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

export default function FilterModal({ isOpen, onClose, categories }: FilterModalProps) {
  const searchParams = useSearchParams();

  const activeFiltersCount = [
    searchParams.get('category'),
    searchParams.get('search'),
    searchParams.get('minPrice'),
    searchParams.get('maxPrice'),
    searchParams.get('sort') !== 'newest' ? searchParams.get('sort') : null
  ].filter(Boolean).length;

  const handleClearAll = () => {
    window.location.href = '/shop';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-3">
        {/* Search */}
        <div>
          <h3 className="text-xs font-sans font-medium uppercase tracking-wider text-ivory/45 mb-2">Search</h3>
          <ProductSearch />
        </div>

        {/* Sort */}
        <div>
          <h3 className="text-xs font-sans font-medium uppercase tracking-wider text-ivory/45 mb-2">Sort By</h3>
          <ProductSort />
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xs font-sans font-medium uppercase tracking-wider text-ivory/45 mb-2">Categories</h3>
          <CategoryFilter categories={categories} />
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-xs font-sans font-medium uppercase tracking-wider text-ivory/45 mb-2">Price Range</h3>
          <PriceFilter />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-ivory/10">
          <Button
            variant="outline"
            onClick={handleClearAll}
            disabled={activeFiltersCount === 0}
            className="flex-1"
          >
            Clear All ({activeFiltersCount})
          </Button>
          <Button
            variant="primary"
            onClick={onClose}
            className="flex-1"
          >
            View Results
          </Button>
        </div>
      </div>
    </Modal>
  );
}
