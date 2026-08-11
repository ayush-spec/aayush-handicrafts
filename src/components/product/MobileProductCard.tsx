'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/sanity';
import { getOptimizedImageUrl } from '@/lib/sanity/image';
import { formatPrice } from '@/lib/utils/currency';

interface MobileProductCardProps {
  product: Product;
}

export default function MobileProductCard({ product }: MobileProductCardProps) {
  const isOutOfStock = product.stockQuantity === 0;
  const hasVariants = product.variants && product.variants.length > 0;
  const isLowStock = !isOutOfStock && product.stockQuantity <= 5;
  const hasMultipleImages = product.images && product.images.length > 1;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Handle touch swipe for image carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultipleImages) return;
    e.stopPropagation(); // Prevent card swipe
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!hasMultipleImages) return;
    e.stopPropagation(); // Prevent card swipe
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!hasMultipleImages) return;
    e.stopPropagation(); // Prevent card swipe

    const deltaX = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50; // Minimum swipe distance

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        // Swipe left - next image
        setCurrentImageIndex((prev) =>
          prev < product.images!.length - 1 ? prev + 1 : prev
        );
      } else {
        // Swipe right - previous image
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <Link href={`/shop/${product.slug.current}`} className="block h-full rounded-sm">
      <div className="bg-secondary rounded-sm overflow-hidden border border-ivory/10 h-full flex flex-col shadow-sm">
        {/* Image Container - Takes most of the space */}
        <div
          ref={imageContainerRef}
          className="relative flex-1 bg-secondary/20 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={
              product.images?.[currentImageIndex]
                ? getOptimizedImageUrl(product.images[currentImageIndex], { width: 800 })
                : '/placeholder-product.jpg'
            }
            alt={`${product.title} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={currentImageIndex === 0}
          />

          {/* Badges */}
          {product.isFeatured && (
            <div className="absolute top-3 left-3 bg-accent-purple px-2 py-1 rounded-sm">
              <span className="text-[10px] font-bold text-white uppercase tracking-wide">Featured</span>
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute top-3 right-3 bg-gray-900 px-2 py-1 rounded-sm">
              <span className="text-[10px] font-bold text-white uppercase tracking-wide">Sold Out</span>
            </div>
          )}

          {/* Image Carousel Bubble Indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 bg-black/30 backdrop-blur-sm px-1.5 py-1 rounded-sm">
              {product.images!.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-1 h-1 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'bg-secondary w-3'
                      : 'bg-secondary/50 hover:bg-secondary/75'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content - Compact at bottom */}
        <div className="p-2.5 bg-secondary">
          {/* Category */}
          <p className="text-[10px] font-sans text-ivory/45 uppercase tracking-wider mb-1">
            {product.category.name}
          </p>

          {/* Title */}
          <h3 className="text-base font-sans font-medium uppercase tracking-wider text-ivory mb-2 line-clamp-2">
            {product.title}
          </h3>

          {/* Price and Stock Row */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-sans font-medium text-primary">
                {formatPrice(product.price ?? 0)}
              </p>
              {hasVariants && (
                <p className="text-[10px] font-sans text-ivory/45 mt-0.5">
                  Multiple options
                </p>
              )}
            </div>

            {/* Stock Indicator */}
            {!hasVariants && (
              <div className="flex-shrink-0">
                {isOutOfStock ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-sans font-semibold bg-secondary text-ivory">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-sans font-semibold bg-tertiary/20 text-primary">
                    Only {product.stockQuantity} left
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-sans font-semibold bg-accent-green/20 text-accent-green">
                    In Stock
                  </span>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
}
