'use client';

import { ProductVariant } from '@/types/sanity';
import { Check } from 'lucide-react';

interface VariantSelectorProps {
  variants: ProductVariant[];
  variantType: 'color' | 'size' | 'material';
  selectedVariant?: ProductVariant;
  onSelect: (variant: ProductVariant) => void;
}

export default function VariantSelector({
  variants,
  variantType,
  selectedVariant,
  onSelect
}: VariantSelectorProps) {
  const typeVariants = variants.filter(v => v.variantType === variantType);

  if (typeVariants.length === 0) return null;

  const typeLabel = {
    color: 'Color',
    size: 'Size',
    material: 'Material/Glaze'
  }[variantType];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-ivory/75">{typeLabel}</label>
        {selectedVariant && (
          <span className="text-sm text-ivory/45">{selectedVariant.name}</span>
        )}
      </div>

      {variantType === 'color' ? (
        // Color swatches
        <div className="flex flex-wrap gap-3">
          {typeVariants.map((variant) => {
            const isSelected = selectedVariant?.sku === variant.sku;
            const isOutOfStock = variant.stockQuantity === 0;

            return (
              <button
                key={variant.sku}
                onClick={() => !isOutOfStock && onSelect(variant)}
                disabled={isOutOfStock}
                className={`relative w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center
                  ${isSelected ? 'border-tertiary ring-2 ring-tertiary/30' : 'border-ivory/15'}
                  ${isOutOfStock ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'}
                `}
                style={{ backgroundColor: variant.value }}
                title={`${variant.name}${isOutOfStock ? ' (Out of stock)' : ''}`}
                aria-label={`${variant.name}${isOutOfStock ? ' (Out of stock)' : ''}`}
              >
                {isSelected && (
                  <Check className="w-6 h-6 text-white drop-shadow-md" />
                )}
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-gray-400 rotate-45" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        // Size/Material buttons
        <div className="flex flex-wrap gap-2">
          {typeVariants.map((variant) => {
            const isSelected = selectedVariant?.sku === variant.sku;
            const isOutOfStock = variant.stockQuantity === 0;

            return (
              <button
                key={variant.sku}
                onClick={() => !isOutOfStock && onSelect(variant)}
                disabled={isOutOfStock}
                className={`px-4 py-2 border-2 rounded-lg font-medium transition-all
                  ${isSelected
                    ? 'border-tertiary bg-tertiary text-white'
                    : 'border-ivory/15 text-ivory/75 hover:border-tertiary/50'
                  }
                  ${isOutOfStock ? 'opacity-30 cursor-not-allowed line-through' : ''}
                `}
              >
                {variant.name}
                {variant.priceModifier > 0 && ` +$${variant.priceModifier.toFixed(2)}`}
                {variant.priceModifier < 0 && ` -$${Math.abs(variant.priceModifier).toFixed(2)}`}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
