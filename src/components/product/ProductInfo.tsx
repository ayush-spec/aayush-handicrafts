'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product, ProductVariant } from '@/types/sanity';
import AddToCartButton from './AddToCartButton';
import VariantSelector from './VariantSelector';
import { formatPrice } from '@/lib/utils/currency';

interface ProductInfoProps {
  product: Product;
  hideTitleAndPrice?: boolean;
}

export default function ProductInfo({ product, hideTitleAndPrice }: ProductInfoProps) {
  const [selectedVariants, setSelectedVariants] = useState<{
    color?: ProductVariant;
    size?: ProductVariant;
    material?: ProductVariant;
  }>({});

  // Calculate final price and stock based on selected variants
  const { finalPrice, finalStock } = useMemo(() => {
    const selectedList = Object.values(selectedVariants).filter(Boolean) as ProductVariant[];

    if (selectedList.length === 0) {
      return { finalPrice: product.price ?? 0, finalStock: product.stockQuantity };
    }

    // Check for combination match
    const selectedSkus = selectedList.map(v => v.sku).sort();
    const combination = product.variantCombinations?.find(combo =>
      combo.variantSkus.sort().join(',') === selectedSkus.join(',')
    );

    if (combination) {
      return { finalPrice: combination.price, finalStock: combination.stockQuantity };
    }

    // Sum modifiers
    let price = product.price ?? 0;
    let stock = product.stockQuantity;

    selectedList.forEach(variant => {
      price += variant.priceModifier;
      stock = Math.min(stock, variant.stockQuantity);
    });

    return { finalPrice: price, finalStock: stock };
  }, [product, selectedVariants]);

  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <div className="space-y-6">
      {!hideTitleAndPrice && (
        <>
          {/* Badges */}
          <div className="flex gap-2">
            {product.isFeatured && (
              <span className="inline-block bg-accent-purple px-3 py-1 rounded-full text-sm font-semibold text-white">
                Featured
              </span>
            )}
            {product.isBestseller && (
              <span className="inline-block bg-accent-green px-3 py-1 rounded-full text-sm font-semibold text-white">
                Bestseller
              </span>
            )}
          </div>

          {/* Category */}
          <Link
            href={`/shop?category=${product.category.slug.current}`}
            className="text-sm text-ivory/45 hover:text-tertiary transition-colors"
          >
            {product.category.name}
          </Link>

          {/* Title */}
          <h1 className="type-h3 font-serif normal-case tracking-normal text-ivory">
            {product.title}
          </h1>

          {/* Price */}
          <div className="text-3xl font-bold text-tertiary">
            {formatPrice(finalPrice)}
            {finalPrice !== product.price && (
              <span className="text-lg text-ivory/35 line-through ml-3">
                {formatPrice(product.price ?? 0)}
              </span>
            )}
          </div>
        </>
      )}

      {/* Variant Selectors */}
      {hasVariants && (
        <div className="space-y-6 py-6 border-y border-ivory/10">
          {['color', 'size', 'material'].map(type => (
            <VariantSelector
              key={type}
              variants={product.variants!}
              variantType={type as 'color' | 'size' | 'material'}
              selectedVariant={selectedVariants[type as keyof typeof selectedVariants]}
              onSelect={(v) => setSelectedVariants(prev => ({ ...prev, [type]: v }))}
            />
          ))}
        </div>
      )}

      {/* Stock Warning + Add to Cart */}
      <div className="space-y-[12px]">
        {finalStock > 0 && finalStock <= 5 && (
          <div className="flex items-center gap-[8px]">
            <span className="relative flex h-[8px] w-[8px]">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-[8px] w-[8px] rounded-full bg-primary" />
            </span>
            <span className="text-[12px] sm:text-[13px] uppercase tracking-widest text-primary font-medium">
              Only {finalStock} left in stock
            </span>
          </div>
        )}
        <AddToCartButton
        product={product}
        selectedVariants={Object.values(selectedVariants).filter(Boolean) as ProductVariant[]}
        finalPrice={finalPrice}
        finalStock={finalStock}
      />
      </div>

      {/* Specifications — hidden on mobile (shown in image overlay) */}
      {!hideTitleAndPrice && (
        <div className="border-t border-ivory/10 pt-6 space-y-4">
          <h2 className="type-h6 text-ivory">Specifications</h2>

          {product.dimensions && (
            <div>
              <h3 className="text-sm font-medium text-ivory/75 mb-1">Dimensions</h3>
              <p className="text-sm text-ivory/55">
                {product.dimensions.height && `H: ${product.dimensions.height}"`}
                {product.dimensions.width && ` × W: ${product.dimensions.width}"`}
                {product.dimensions.depth && ` × D: ${product.dimensions.depth}"`}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-ivory/75 mb-1">Silver</h3>
            <p className="text-sm text-ivory/55">
              {product.weightGrams}g · {product.purity} silver
              {product.isHallmarked && ' · BIS Hallmarked'}
            </p>
          </div>

          {product.madeToOrder && product.leadTimeDays && (
            <div>
              <h3 className="text-sm font-medium text-ivory/75 mb-1">Made to Order</h3>
              <p className="text-sm text-ivory/55">
                Ships in {product.leadTimeDays} days
              </p>
            </div>
          )}

          {product.materials && product.materials.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-ivory/75 mb-1">Materials</h3>
              <p className="text-sm text-ivory/55">{product.materials.join(', ')}</p>
            </div>
          )}

          {product.careInstructions && (
            <div>
              <h3 className="text-sm font-medium text-ivory/75 mb-1">Care Instructions</h3>
              <p className="text-sm text-ivory/55">{product.careInstructions}</p>
            </div>
          )}
        </div>
      )}

      {/* Additional Info — hidden on mobile (shown in image overlay) */}
      {!hideTitleAndPrice && (
        <div className="border-t border-ivory/10 pt-6 text-sm text-ivory/55 space-y-2">
          <p>✓ Handcrafted with care</p>
          <p>✓ Each piece is unique</p>
          <p>✓ Made by skilled artisans</p>
        </div>
      )}
    </div>
  );
}
