import { Product, ProductVariant } from '@/types/sanity';
import { CartItem } from '@/types/cart';
import { getOptimizedImageUrl } from './image';

/**
 * Helper to generate unique cart item ID
 * Format: productId::variantSku (or just productId if no variant)
 */
export function generateCartItemId(productId: string, variantSku?: string): string {
  return variantSku ? `${productId}::${variantSku}` : productId;
}

/**
 * Convert a product (with optional selected variants) to a cart item
 */
export function productToCartItem(
  product: Product,
  selectedVariants: ProductVariant[] = []
): Omit<CartItem, 'quantity'> {
  let finalPrice = product.price ?? 0;
  let finalStock = product.stockQuantity;
  let finalImage = product.images?.[0];
  let variantSku: string | undefined;

  if (selectedVariants.length > 0) {
    // Check for specific combination match
    const selectedSkus = selectedVariants.map(v => v.sku).sort();
    const combination = product.variantCombinations?.find(combo => {
      const comboSkus = combo.variantSkus.sort();
      return comboSkus.length === selectedSkus.length &&
             comboSkus.every((sku, index) => sku === selectedSkus[index]);
    });

    if (combination) {
      // Use combination price and stock
      finalPrice = combination.price;
      finalStock = combination.stockQuantity;
      variantSku = combination.sku;
    } else {
      // Sum price modifiers from individual variants
      selectedVariants.forEach(v => {
        finalPrice += v.priceModifier;
      });

      // Use minimum stock across all selected variants
      finalStock = Math.min(
        finalStock,
        ...selectedVariants.map(v => v.stockQuantity)
      );

      // Generate variant SKU from individual SKUs
      variantSku = selectedSkus.join('-');

      // Use variant image if available (prefer first variant with image)
      const variantWithImage = selectedVariants.find(v => v.images?.[0]);
      if (variantWithImage?.images?.[0]) {
        finalImage = variantWithImage.images[0];
      }
    }
  }

  const cartItemId = generateCartItemId(product._id, variantSku);

  return {
    productId: product._id,
    cartItemId,
    slug: product.slug.current,
    title: product.title,
    price: finalPrice,
    image: finalImage
      ? getOptimizedImageUrl(finalImage, { width: 200, quality: 90 })
      : '/placeholder-product.jpg',
    maxQuantity: finalStock,
    selectedVariants: selectedVariants.map(v => ({
      variantType: v.variantType,
      name: v.name,
      value: v.value
    })),
    variantSku
  };
}
