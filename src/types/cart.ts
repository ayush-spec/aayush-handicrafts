export interface CartItem {
  productId: string;      // Original product._id
  cartItemId: string;     // Unique ID: productId::variantSku (for cart uniqueness)
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  maxQuantity: number;
  selectedVariants?: {
    variantType: string;
    name: string;
    value: string;
  }[];
  variantSku?: string;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
