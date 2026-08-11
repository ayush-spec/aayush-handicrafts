'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';

/**
 * Custom hook for cart operations with SSR-safe initialization
 */
export const useCart = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  // Wait for hydration to avoid SSR mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    items: isHydrated ? items : [],
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems: isHydrated ? getTotalItems() : 0,
    totalPrice: isHydrated ? getTotalPrice() : 0,
    isHydrated,
  };
};
