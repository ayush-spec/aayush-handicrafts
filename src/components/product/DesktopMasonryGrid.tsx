'use client';

import { useMemo } from 'react';
import { Product } from '@/types/sanity';
import ProductCardVariant from './ProductCardVariant';

interface DesktopMasonryGridProps {
  products: Product[];
}

// Repeating row pattern for visual rhythm
const ROW_PATTERN = [4, 3, 5, 3, 4, 5];

function chunkProducts(products: Product[]): Product[][] {
  const rows: Product[][] = [];
  let index = 0;
  let patternIndex = 0;

  while (index < products.length) {
    const count = ROW_PATTERN[patternIndex % ROW_PATTERN.length];
    const remaining = products.length - index;
    // Take the lesser of pattern count or remaining products
    const rowSize = Math.min(count, remaining);
    rows.push(products.slice(index, index + rowSize));
    index += rowSize;
    patternIndex++;
  }

  return rows;
}

export default function DesktopMasonryGrid({ products }: DesktopMasonryGridProps) {
  const rows = useMemo(() => chunkProducts(products), [products]);

  return (
    <div className="flex flex-col gap-1">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((product) => (
            <div
              key={product._id}
              className="flex-1 min-w-0"
            >
              <ProductCardVariant product={product} variant="minimal" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
