'use client';

import { useState } from 'react';
import { Product, Category } from '@/types/sanity';
import ProductCard from './ProductCard';
import FilterModal from './FilterModal';
import MobileCardStack from './MobileCardStack';
import DesktopMasonryGrid from './DesktopMasonryGrid';
import DesktopFilterBar from './DesktopFilterBar';
import { EmptyState } from '@/components/ui';

interface ShopGridProps {
  products: Product[];
  total: number;
  categories: Category[];
}

export default function ShopGrid({ products, total, categories }: ShopGridProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  return (
    <>
      {/* Desktop: Horizontal Filter Bar - hidden on mobile */}
      <DesktopFilterBar categories={categories} />

      {/* Filter Modal (mobile only) */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        categories={categories}
      />

      {/* Product Grid / Card Stack */}
      {products.length > 0 ? (
        <>
          {/* Mobile: Stacked card scroll experience - hidden on desktop */}
          <div className="block md:hidden">
            <MobileCardStack
              products={products}
              categories={categories}
            />
          </div>

          {/* Desktop: Viewport grid - hidden on mobile */}
          <div className="hidden md:block pt-[160px]">
            <DesktopMasonryGrid products={products} />
          </div>
        </>
      ) : (
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <EmptyState
              title="No Products Found"
              description="Try adjusting your filters or search terms."
              actionLabel="View All Products"
              actionHref="/shop"
            />
          </div>
        </div>
      )}
    </>
  );
}
