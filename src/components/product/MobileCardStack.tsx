'use client';

import { useState, useMemo } from 'react';
import { Product, Category } from '@/types/sanity';
import MobileProductCard from './MobileProductCard';
import ThankYouSection from './ThankYouSection';
interface MobileCardStackProps {
  products: Product[];
  categories: Category[];
}

const SCROLL_PER_CARD = 80;

const bubbleColors = [
  'border-primary text-primary',
  'border-accent-purple text-accent-purple',
  'border-tertiary text-tertiary',
  'border-accent-green text-accent-green',
];

export default function MobileCardStack({ products, categories }: MobileCardStackProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter(p => p.category?.slug?.current === selectedCategory);
  }, [products, selectedCategory]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const CategoryPills = () => (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full px-4 py-2">
      <button
        onClick={() => handleCategoryChange('all')}
        className={`flex-shrink-0 px-2 py-1 rounded-sm text-[10px] font-semibold uppercase tracking-wider
          transition-colors duration-300 min-h-[28px]
          ${selectedCategory === 'all'
            ? 'bg-secondary border-2 border-primary text-primary'
            : 'bg-secondary border-2 border-ivory/15 text-ivory/75'
          }`}
      >All</button>
      {categories.map((cat, i) => (
        <button
          key={cat._id}
          onClick={() => handleCategoryChange(cat.slug.current)}
          className={`flex-shrink-0 px-2 py-1 rounded-sm text-[10px] font-semibold uppercase tracking-wider
            transition-colors duration-300 min-h-[28px]
            ${selectedCategory === cat.slug.current
              ? `bg-secondary border-2 ${bubbleColors[i % bubbleColors.length]}`
              : 'bg-secondary border-2 border-ivory/15 text-ivory/75'
            }`}
        >{cat.name}</button>
      ))}
    </div>
  );

  // Equal gap between header→pills and pills→cards
  // Header height from --header-height (globals.css). Pills height = 40px. Gap = 12px.
  const GAP = 12;
  const PILLS_HEIGHT = 40;
  const cssVars = {
    '--pills-top': `calc(var(--header-height) + ${GAP}px)`,
    '--card-top': `calc(var(--header-height) + ${GAP}px + ${PILLS_HEIGHT}px + ${GAP}px)`,
  } as React.CSSProperties;

  // "Coming Soon" empty state
  if (filteredProducts.length === 0) {
    return (
      <div className="relative w-full" style={cssVars}>
        <div className="sticky" style={{ top: 'var(--pills-top)' }}>
          <CategoryPills />
        </div>
        <div className="flex items-center justify-center px-4 mt-4">
          <div
            className="w-full max-w-sm iphone:max-w-[390px] iphone-max:max-w-[420px] flex items-center justify-center bg-secondary rounded-sm"
            style={{ height: '640px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
          >
            <p className="text-lg font-sans font-medium uppercase tracking-wider text-ivory/35">
              Coming Soon
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalCards = filteredProducts.length;

  return (
    <div className="relative w-full" style={cssVars}>
      {/* Sticky scope — pills and cards unstick when this container scrolls out */}
      <div className="relative">
        {/* Sticky category pills */}
        <div className="sticky" style={{ top: 'var(--pills-top)' }}>
          <CategoryPills />
        </div>

        {/* Cards as siblings — sticky stacking via shared containing block */}
        {filteredProducts.map((product, index) => {
          const isLast = index === totalCards - 1;
          return (
            <div
              key={product._id}
              className="sticky mx-3"
              style={{
                top: 'var(--card-top)',
                zIndex: index + 10,
                height: '640px',
                marginBottom: isLast ? '200px' : `${SCROLL_PER_CARD}px`,
              }}
            >
              <MobileProductCard product={product} />
            </div>
          );
        })}
      </div>

      {/* Thank You Section — outside sticky scope */}
      <div className="block md:hidden relative z-[56]">
        <ThankYouSection />
      </div>
    </div>
  );
}
