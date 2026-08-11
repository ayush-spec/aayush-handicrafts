'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/sanity';
import { getOptimizedImageUrl } from '@/lib/sanity/image';
import { productToCartItem } from '@/lib/sanity/utils';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { formatPrice } from '@/lib/utils/currency';

interface ProductCardVariantProps {
  product: Product;
  variant: 'compact' | 'overlap' | 'collage' | 'minimal';
}

export default function ProductCardVariant({ product, variant }: ProductCardVariantProps) {
  const { addItem } = useCart();
  const toast = useToast();
  const isOutOfStock = product.stockQuantity === 0;
  const hasVariants = product.variants && product.variants.length > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || hasVariants) return;

    const cartItem = productToCartItem(product);
    addItem({ ...cartItem, quantity: 1 });
    toast.success(`Added ${product.title} to cart`);
  };

  const imageUrl = product.images?.[0]
    ? getOptimizedImageUrl(product.images[0], { width: 600 })
    : '/placeholder-product.jpg';

  if (variant === 'minimal') {
    return (
      <Link href={`/shop/${product.slug.current}`} className="group block">
        <div className="relative aspect-square bg-secondary overflow-hidden rounded-sm">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Price overlay bottom-left */}
          <p className="absolute bottom-1 left-1.5 text-xs text-white font-bold">
            {formatPrice(product.price ?? 0, false)}
          </p>

          {/* Cart Button */}
          {!isOutOfStock && !hasVariants && (
            <button
              onClick={handleAddToCart}
              className="absolute top-2 right-2 bg-primary text-white p-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-900 z-10"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}

          {/* Sold Out Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-gray-900 text-white px-2 py-1 text-[10px] uppercase tracking-wider font-medium rounded-sm z-10">
              SOLD OUT
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-opacity duration-300" />
        </div>

        {/* Title below image */}
        <h3 className="mt-2 text-sm font-sans font-medium text-ivory truncate uppercase tracking-wider">
          {product.title}
        </h3>
      </Link>
    );
  }

  if (variant === 'collage') {
    return (
      <Link href={`/shop/${product.slug.current}`} className="group block relative h-full">
        <div className="relative h-full bg-secondary overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />

          {/* Cart Button */}
          {!isOutOfStock && !hasVariants && (
            <button
              onClick={handleAddToCart}
              className="absolute top-2 right-2 bg-primary text-white p-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-900 z-10"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}

          {/* Sold Out Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-gray-900 text-white px-2 py-1 text-[10px] uppercase tracking-wider font-medium rounded-sm z-10">
              SOLD OUT
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-opacity duration-300" />

          {/* Title + Price overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-sm font-sans font-medium text-white truncate uppercase tracking-wider drop-shadow-md">
              {product.title}
            </h3>
          </div>
          <p className="absolute bottom-1 left-1.5 text-xs text-white font-bold">
            {formatPrice(product.price ?? 0, false)}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/shop/${product.slug.current}`} className="group block">
        {/* Image Container */}
        <div className="relative aspect-square bg-secondary overflow-hidden rounded-sm">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Cart Button - Top Right */}
          {!isOutOfStock && !hasVariants && (
            <button
              onClick={handleAddToCart}
              className="absolute top-2 right-2 bg-primary text-white p-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-900 z-10"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-gray-900 text-white px-2 py-1 text-[10px] uppercase tracking-wider font-medium rounded-sm">
              SOLD OUT
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-opacity duration-300" />
        </div>

        {/* Content - Name + Price on One Line */}
        <div className="flex items-center justify-between gap-2 mt-3">
          <h3 className="product-card-compact-title truncate group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="product-card-compact-price whitespace-nowrap">
            {formatPrice(product.price ?? 0, false)}
          </p>
        </div>
      </Link>
    );
  }

  // Overlap variant
  // The title overlaps the image bottom edge by half the first line height.
  // Uses calc() with the CSS variable so it stays in sync with responsive font size.

  return (
    <Link href={`/shop/${product.slug.current}`} className="group block">
      {/* Image Container */}
      <div className="relative aspect-square bg-secondary overflow-visible rounded-sm">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="object-cover rounded-sm"
          sizes="(max-width: 768px) 85vw, 33vw"
        />

        {/* Cart Button - Top Right */}
        {!isOutOfStock && !hasVariants && (
          <button
            onClick={handleAddToCart}
            className="absolute top-2 right-2 bg-primary text-white p-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-900 z-10"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-gray-900 text-white px-2 py-1 text-[10px] uppercase tracking-wider font-medium rounded-sm z-10">
            SOLD OUT
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-opacity duration-300 rounded-sm" />

        {/* Overlapping Title - first line center aligns with image bottom edge */}
        <div
          className="absolute left-0 right-0 px-4"
          style={{ top: '100%', transform: 'translateY(calc(var(--product-card-overlap-offset) * -1))' }}
        >
          <h3 className="product-card-overlap-title line-clamp-2 mb-2">
            {product.title}
          </h3>
          <p className="product-card-overlap-price">
            {formatPrice(product.price ?? 0, false)}
          </p>
          <div className="mt-3 border-b border-ivory/10" />
        </div>
      </div>
    </Link>
  );
}
