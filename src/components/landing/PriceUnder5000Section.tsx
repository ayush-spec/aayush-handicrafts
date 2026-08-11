'use client';

import { Product } from '@/types/sanity';
import { ProductCarousel } from './ProductCarousel';

interface PriceUnder5000Props {
  products: Product[];
}

export function PriceUnder5000Section({ products }: PriceUnder5000Props) {
  if (products.length === 0) return null;

  return (
    <ProductCarousel
      products={products}
      title="Premium Selection"
      subtitle="Exquisite pieces under ₹5000"
      backgroundColor="bg-secondary border-t-4 border-secondary"
      textColor="text-ivory"
    />
  );
}
