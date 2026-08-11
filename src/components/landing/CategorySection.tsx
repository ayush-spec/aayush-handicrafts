'use client';

import { Product } from '@/types/sanity';
import { ProductCarousel } from './ProductCarousel';

interface CategorySectionProps {
  products: Product[];
  categoryName: string;
  backgroundColorClass: string;  // Rotates through palette
}

export function CategorySection({
  products,
  categoryName,
  backgroundColorClass
}: CategorySectionProps) {
  if (products.length === 0) return null;

  return (
    <ProductCarousel
      products={products}
      title={`${categoryName} Collection`}
      subtitle={`Explore our handcrafted ${categoryName.toLowerCase()}`}
      backgroundColor={backgroundColorClass}
      textColor="text-white"
    />
  );
}
