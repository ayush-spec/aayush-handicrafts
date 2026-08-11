import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartState, CartItem } from '@/types/cart';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.cartItemId === item.cartItemId);

          if (existingItem) {
            // Update quantity if item already exists
            const newQuantity = existingItem.quantity + (item.quantity || 1);

            // Don't exceed max quantity
            if (newQuantity > item.maxQuantity) {
              console.warn(`Cannot add more than ${item.maxQuantity} of this item`);
              return state;
            }

            return {
              items: state.items.map((i) =>
                i.cartItemId === item.cartItemId
                  ? { ...i, quantity: newQuantity }
                  : i
              ),
            };
          }

          // Add new item
          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: item.quantity || 1,
              },
            ],
          };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(cartItemId);
          return;
        }

        set((state) => {
          const item = state.items.find((i) => i.cartItemId === cartItemId);

          if (!item) return state;

          // Don't exceed max quantity
          if (quantity > item.maxQuantity) {
            console.warn(`Cannot add more than ${item.maxQuantity} of this item`);
            return state;
          }

          return {
            items: state.items.map((i) =>
              i.cartItemId === cartItemId ? { ...i, quantity } : i
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'aayush-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
