'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/cart';
import { formatPrice } from '@/lib/utils/currency';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.cartItemId, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < item.maxQuantity) {
      onUpdateQuantity(item.cartItemId, item.quantity + 1);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.cartItemId), 300);
  };

  const subtotal = item.price * item.quantity;

  return (
    <div
      className={`transition-all duration-300 ${
        isRemoving ? 'opacity-0 -translate-x-[20px] max-h-0 overflow-hidden' : 'opacity-100 max-h-[300px]'
      }`}
    >
      {/* Mobile layout */}
      <div className="md:hidden py-[14px]">
        <div className="flex gap-[14px]">
          {/* Image */}
          <Link href={`/shop/${item.slug}`} className="flex-shrink-0">
            <div className="relative w-[90px] h-[90px] rounded-sm overflow-hidden bg-secondary">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          </Link>

          {/* Info */}
          <div className="flex-grow min-w-0 flex flex-col justify-between">
            <div>
              <Link
                href={`/shop/${item.slug}`}
                className="text-[14px] font-medium text-ivory hover:text-primary transition-colors line-clamp-1 block"
              >
                {item.title}
              </Link>
              <p className="text-[12px] uppercase tracking-widest text-ivory/35 mt-[2px]">
                {formatPrice(item.price)} each
              </p>
            </div>

            <div className="flex items-center justify-between">
              {/* Quantity */}
              <div className="inline-flex items-center bg-secondary border border-ivory/10 rounded-sm h-[32px]">
                <button
                  onClick={handleDecrease}
                  disabled={item.quantity <= 1}
                  className="flex items-center justify-center w-[32px] h-full text-ivory/45 hover:text-ivory active:bg-secondary disabled:opacity-30 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-[12px] h-[12px]" strokeWidth={2} />
                </button>
                <span className="w-[28px] text-center text-[13px] font-medium text-ivory tabular-nums select-none">
                  {item.quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  disabled={item.quantity >= item.maxQuantity}
                  className="flex items-center justify-center w-[32px] h-full text-ivory/45 hover:text-ivory active:bg-secondary disabled:opacity-30 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-[12px] h-[12px]" strokeWidth={2} />
                </button>
              </div>

              {/* Subtotal + Remove */}
              <div className="flex items-center gap-[12px]">
                <span className="text-[14px] font-semibold text-ivory">
                  {formatPrice(subtotal)}
                </span>
                <button
                  onClick={handleRemove}
                  className="flex items-center justify-center w-[28px] h-[28px] text-gray-300 hover:text-red-500 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-[14px] h-[14px]" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex gap-4 py-6">
        {/* Image */}
        <Link href={`/shop/${item.slug}`} className="flex-shrink-0">
          <div className="relative w-24 h-24 rounded-sm overflow-hidden bg-secondary">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
        </Link>

        {/* Details */}
        <div className="flex-grow min-w-0">
          <div className="flex justify-between">
            <div>
              <Link
                href={`/shop/${item.slug}`}
                className="text-lg font-medium text-ivory hover:text-primary transition-colors"
              >
                {item.title}
              </Link>
              <p className="text-sm text-ivory/45 mt-1">
                {formatPrice(item.price)} each
              </p>
            </div>
            <p className="text-lg font-semibold text-ivory">
              {formatPrice(subtotal)}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="inline-flex items-center bg-secondary border border-ivory/10 rounded-sm h-[40px]">
              <button
                onClick={handleDecrease}
                disabled={item.quantity <= 1}
                className="flex items-center justify-center w-[40px] h-full text-ivory/45 hover:text-ivory active:bg-secondary disabled:opacity-30 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-[14px] h-[14px]" strokeWidth={2} />
              </button>
              <span className="w-[36px] text-center text-[15px] font-medium text-ivory tabular-nums select-none">
                {item.quantity}
              </span>
              <button
                onClick={handleIncrease}
                disabled={item.quantity >= item.maxQuantity}
                className="flex items-center justify-center w-[40px] h-full text-ivory/45 hover:text-ivory active:bg-secondary disabled:opacity-30 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-[14px] h-[14px]" strokeWidth={2} />
              </button>
            </div>

            <button
              onClick={handleRemove}
              className="text-sm text-ivory/35 hover:text-red-500 transition-colors flex items-center gap-[6px]"
            >
              <Trash2 className="w-[14px] h-[14px]" strokeWidth={1.5} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
