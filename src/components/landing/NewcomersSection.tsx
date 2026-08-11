'use client';

import { Product } from '@/types/sanity';
import { ProductCarousel } from './ProductCarousel';

interface NewcomersSectionProps {
  products: Product[];
}

export function NewcomersSection({ products }: NewcomersSectionProps) {
  if (products.length === 0) return null;

  return (
    <ProductCarousel
      products={products}
      title="New Arrivals"
      subtitle="Fresh from the kiln - just added to our collection"
      backgroundColor="bg-secondary border-t-4 border-tertiary"
      textColor="text-ivory"
    />
  );
}
