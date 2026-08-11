'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Category, Product } from '@/types/sanity';
import ProductCardVariant from '@/components/product/ProductCardVariant';

interface ShopByCategoryProps {
  categories: Category[];
  productsMap: Record<string, Product[]>;
}

export function ShopByCategorySection({
  categories,
  productsMap
}: ShopByCategoryProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>(
    categories?.[0]?.slug.current || ''
  );

  if (!categories || categories.length === 0) {
    return null;
  }

  const displayProducts = productsMap[selectedSlug] ||
                          productsMap[categories[0]?.slug.current] ||
                          [];

  const bubbleColors = [
    'border-primary text-primary',
    'border-accent-purple text-accent-purple',
    'border-tertiary text-tertiary',
    'border-accent-green text-accent-green',
  ];

  return (
    <section className="w-full bg-secondary py-2 md:py-6 lg:py-8" aria-label="Shop by Category">
      {/* Header — right-aligned */}
      <div className="px-4 md:px-6 lg:px-12 mb-2 md:mb-6 text-right">
        <h2 className="type-h3 mb-2 text-ivory">
          Catalogue <span className="inline-block ml-1">&rarr;</span>
        </h2>
        <p className="text-ivory/55 text-base md:text-lg mb-4">
          Browse our curated collections
        </p>

        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category, index) => {
            const isSelected = selectedSlug === category.slug.current;
            return (
              <button
                key={category._id}
                onClick={() => setSelectedSlug(category.slug.current)}
                aria-pressed={isSelected}
                aria-label={`Shop ${category.name} category`}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-sm text-sm font-semibold uppercase tracking-wider
                  transition-colors duration-300 cursor-pointer min-h-[44px]
                  ${isSelected
                    ? `bg-secondary border-2 ${bubbleColors[index % 4]}`
                    : 'bg-secondary border-2 border-ivory/15 text-ivory/75 hover:border-gray-400'
                  }
                `}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Collage grid */}
      {displayProducts.length === 0 ? (
        <div className="px-4 md:px-6 lg:px-12 py-12 text-center">
          <p className="text-ivory/45 text-lg">No products in this category yet</p>
        </div>
      ) : (
        <div className="px-4 md:px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-2 gap-x-[9px] md:gap-y-3 md:gap-x-[13px] lg:gap-y-4 lg:gap-x-[18px]">
            {displayProducts.slice(0, 10).map((product, index) => (
              <div
                key={product._id}
                className={index % 5 === 4 ? 'col-span-2' : ''}
              >
                <ProductCardVariant product={product} variant="minimal" />
              </div>
            ))}

            {/* Browse Shop end card */}
            <div>
              <Link href="/shop" className="flex items-center justify-center aspect-square bg-secondary rounded-sm">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Browse Shop &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
