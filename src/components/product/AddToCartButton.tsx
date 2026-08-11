'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Product, ProductVariant } from '@/types/sanity';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { productToCartItem } from '@/lib/sanity/utils';

interface AddToCartButtonProps {
  product: Product;
  selectedVariants?: ProductVariant[];
  finalPrice?: number;
  finalStock?: number;
}

export default function AddToCartButton({
  product,
  selectedVariants = [],
  finalPrice,
  finalStock
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const price = finalPrice ?? product.price ?? 0;
  const maxQuantity = finalStock ?? product.stockQuantity;
  const isOutOfStock = maxQuantity === 0;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      const cartItem = productToCartItem(product, selectedVariants);
      addItem({
        ...cartItem,
        quantity,
      });

      const variantText = selectedVariants.length > 0
        ? ` (${selectedVariants.map(v => v.name).join(', ')})`
        : '';

      toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart${variantText}`);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  if (isOutOfStock) {
    return (
      <div className="space-y-[12px]">
        <div className="relative overflow-hidden bg-secondary px-[20px] py-[14px] rounded-sm text-center">
          <span className="text-[13px] sm:text-sm font-semibold uppercase tracking-wider text-ivory/35">
            Sold Out
          </span>
        </div>
        <p className="text-[12px] sm:text-[13px] text-ivory/35 text-center">
          This item is currently unavailable. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-[16px]">
      {/* Quantity Selector — pill style */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] sm:text-[13px] uppercase tracking-widest text-ivory/35 font-medium">
          Quantity
        </span>
        <div className="inline-flex items-center bg-secondary border border-ivory/10 rounded-sm h-[44px] sm:h-[48px]">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="flex items-center justify-center w-[44px] sm:w-[48px] h-full rounded-l-sm text-ivory/45 hover:text-ivory active:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-[14px] h-[14px] sm:w-4 sm:h-4" strokeWidth={2} />
          </button>
          <span className="w-[40px] sm:w-[48px] text-center text-[15px] sm:text-base font-medium text-ivory tabular-nums select-none">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= maxQuantity}
            className="flex items-center justify-center w-[44px] sm:w-[48px] h-full rounded-r-sm text-ivory/45 hover:text-ivory active:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-[14px] h-[14px] sm:w-4 sm:h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAdding}
        className="w-full flex items-center justify-center gap-[10px] bg-tertiary hover:bg-tertiary-dark active:scale-[0.98] text-white font-semibold uppercase tracking-wider text-[13px] sm:text-sm h-[50px] sm:h-[56px] rounded-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAdding ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <ShoppingCart className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" strokeWidth={2} />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  );
}
