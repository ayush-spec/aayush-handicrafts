'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/sanity';
import { getOptimizedImageUrl } from '@/lib/sanity/image';
import { productToCartItem } from '@/lib/sanity/utils';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui';
import { formatPrice } from '@/lib/utils/currency';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const toast = useToast();
  const isOutOfStock = product.stockQuantity === 0;
  const hasVariants = product.variants && product.variants.length > 0;
  const colorVariants = product.variants?.filter(v => v.variantType === 'color') || [];
  const hasMultipleImages = product.images && product.images.length > 1;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock || hasVariants) return;

    const cartItem = productToCartItem(product);
    addItem({
      ...cartItem,
      quantity: 1,
    });

    toast.success(`Added ${product.title} to cart`);
  };

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.images) {
      setCurrentImageIndex((prev) =>
        prev < product.images.length - 1 ? prev + 1 : prev
      );
    }
  };

  return (
    <Link href={`/shop/${product.slug.current}`} className="group block rounded-sm">
      <div className="bg-secondary rounded-sm overflow-hidden transition-colors duration-300 ease-out border border-ivory/5 hover:border-primary/20">
        {/* Image Container - 3:3.7 aspect ratio */}
        <div
          className="relative aspect-[3/3.7] bg-secondary/20 overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Image
            src={
              product.images?.[currentImageIndex]
                ? getOptimizedImageUrl(product.images[currentImageIndex], { width: 800 })
                : '/placeholder-product.jpg'
            }
            alt={`${product.title} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover lux-img"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
          />

          {/* Badges - smaller, cleaner */}
          {product.isFeatured && (
            <div className="absolute top-3 left-3 bg-accent-purple px-2 py-1 rounded-sm text-xs font-semibold text-white">
              Featured
            </div>
          )}

          {product.isBestseller && !product.isFeatured && (
            <div className="absolute top-3 left-3 bg-accent-green px-2 py-1 rounded-sm text-xs font-semibold text-white">
              Bestseller
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute top-3 right-3 bg-gray-900 px-2 py-1 rounded-sm text-xs font-semibold text-white">
              Out of Stock
            </div>
          )}

          {/* Image Navigation Arrows - show on hover if multiple images */}
          {hasMultipleImages && isHovering && (
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-secondary/90 hover:bg-secondary p-2 rounded-sm transition-colors duration-200 z-10 border border-ivory/10"
                  aria-label="Previous image"
                >
                  <svg className="w-4 h-4 text-ivory" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {currentImageIndex < product.images!.length - 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary/90 hover:bg-secondary p-2 rounded-sm transition-colors duration-200 z-10 border border-ivory/10"
                  aria-label="Next image"
                >
                  <svg className="w-4 h-4 text-ivory" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </>
          )}

          {/* Image Carousel Bubble Indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 backdrop-blur-sm px-2 py-1.5 rounded-sm">
              {product.images!.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'bg-secondary w-4'
                      : 'bg-secondary/50 hover:bg-secondary/75'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content - minimal padding, clean typography */}
        <div className="pt-3 px-3 pb-3">
          <p className="text-xs text-ivory/45 uppercase tracking-wide mb-1">
            {product.category.name}
          </p>
          <h3 className="font-serif font-light text-lg text-ivory mb-2">
            {product.title}
          </h3>
          <p className="font-serif text-lg text-primary mb-3">
            {formatPrice(product.price ?? 0)}
            {hasVariants && <span className="text-xs text-ivory/45 ml-1">+</span>}
          </p>

          {/* Variant Indicator */}
          {hasVariants && (
            <div className="mb-3">
              {colorVariants.length > 0 ? (
                <div className="flex items-center gap-1">
                  {colorVariants.slice(0, 4).map((variant) => (
                    <div
                      key={variant.sku}
                      className="w-5 h-5 rounded-sm border border-ivory/15"
                      style={{ backgroundColor: variant.value }}
                      title={variant.name}
                      aria-label={variant.name}
                    />
                  ))}
                  {colorVariants.length > 4 && (
                    <span className="text-xs text-ivory/45 ml-1">
                      +{colorVariants.length - 4} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-ivory/45">
                  {product.variants!.length} variant{product.variants!.length > 1 ? 's' : ''} available
                </p>
              )}
            </div>
          )}

          {/* Add to Cart - ONLY for products WITHOUT variants */}
          {hasVariants ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              View Options
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full transition-colors"
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          )}

          {/* Stock warning - only for products without variants */}
          {!hasVariants && !isOutOfStock && product.stockQuantity <= 5 && (
            <p className="text-xs text-ivory/45 mt-2 text-center">
              Only {product.stockQuantity} left
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
