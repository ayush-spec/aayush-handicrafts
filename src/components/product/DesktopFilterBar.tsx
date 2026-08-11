'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '@/types/sanity';
import ProductSearch from './ProductSearch';
import ProductSort from './ProductSort';

interface DesktopFilterBarProps {
  categories: Category[];
}

export default function DesktopFilterBar({ categories }: DesktopFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const bubbleColors = [
    'border-primary text-primary',
    'border-accent-purple text-accent-purple',
    'border-tertiary text-tertiary',
    'border-accent-green text-accent-green',
  ];

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    // Drag to scroll
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let hasDragged = false;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      hasDragged = false;
      startX = e.pageX;
      scrollStart = el.scrollLeft;
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 3) hasDragged = true;
      el.scrollLeft = scrollStart - dx;
    };
    const onMouseUp = () => {
      isDown = false;
      el.style.cursor = 'grab';
      el.style.userSelect = '';
    };
    // Prevent clicks after drag
    const onClick = (e: MouseEvent) => {
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
        hasDragged = false;
      }
    };

    el.style.cursor = 'grab';
    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('click', onClick, true);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('click', onClick, true);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [checkScroll, categories]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 200;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const handleCategoryClick = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.delete('page');
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div id="desktop-filter-bar" className="hidden md:block fixed top-header left-0 right-0 z-50 bg-secondary shadow-sm border-b border-ivory/10/30">
      <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-shrink-0 w-64">
              <ProductSearch />
            </div>

            {/* Sort */}
            <div className="flex-shrink-0">
              <ProductSort />
            </div>

            {/* Categories with arrow navigation */}
            <div className="flex-1 flex items-center gap-1 min-w-0">
              {/* Left arrow */}
              <button
                onClick={() => scroll('left')}
                className={`flex-shrink-0 p-1 transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                aria-label="Scroll categories left"
              >
                <ChevronLeft className="w-4 h-4 text-ivory/35" />
              </button>

              {/* Category buttons — hidden overflow, no scrollbar */}
              <div
                ref={scrollRef}
                className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide min-w-0"
              >
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`
                    flex-shrink-0 px-4 py-2 rounded-sm text-xs font-sans font-medium tracking-wide uppercase
                    transition-colors duration-300 whitespace-nowrap
                    ${!activeCategory
                      ? 'bg-secondary border border-gray-900 text-ivory'
                      : 'bg-secondary border border-ivory/10 text-ivory/45 hover:border-gray-400 hover:text-ivory/75'}
                  `}
                >
                  All
                </button>

                {categories.map((category, index) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryClick(category.slug.current)}
                    className={`
                      flex-shrink-0 px-4 py-2 rounded-sm text-xs font-sans font-medium tracking-wide uppercase
                      transition-colors duration-300 whitespace-nowrap
                      ${activeCategory === category.slug.current
                        ? `bg-secondary border ${bubbleColors[index % bubbleColors.length]}`
                        : 'bg-secondary border border-ivory/10 text-ivory/45 hover:border-gray-400 hover:text-ivory/75'}
                    `}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Right arrow */}
              <button
                onClick={() => scroll('right')}
                className={`flex-shrink-0 p-1 transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                aria-label="Scroll categories right"
              >
                <ChevronRight className="w-4 h-4 text-ivory/35" />
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
