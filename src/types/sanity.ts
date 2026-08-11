import { PortableTextBlock } from '@portabletext/types';

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface SanityFile {
  _type: 'file';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface Category {
  _id: string;
  _type: 'category';
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  image?: SanityImage;
  sortOrder?: number;
  productCount?: number;  // For top categories query
}

export interface ProductVariant {
  sku: string;
  variantType: 'color' | 'size' | 'material';
  name: string;
  value: string;
  priceModifier: number;
  stockQuantity: number;
  images?: SanityImage[];
  isDefault?: boolean;
}

export interface VariantCombination {
  sku: string;
  variantSkus: string[];
  price: number;
  stockQuantity: number;
}

export interface Product {
  _id: string;
  _type: 'product';
  title: string;
  slug: {
    current: string;
  };
  images: SanityImage[];
  videoUrl?: string;
  description: PortableTextBlock[];
  /**
   * Computed display price (tax-inclusive ₹), attached server-side by
   * `withComputedPrices()` — NOT stored in Sanity (rate-linked pricing).
   */
  price?: number;
  category: Category;
  stockQuantity: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isLimitedEdition: boolean;
  dimensions?: {
    height?: number;
    width?: number;
    depth?: number;
  };
  /** Silver weight in grams — drives rate-linked pricing. */
  weightGrams: number;
  /** Silver purity. */
  purity: '925' | '999';
  /** BIS hallmarked. */
  isHallmarked: boolean;
  /** How the making charge is computed. */
  makingType: 'flat' | 'per_gram' | 'percentage';
  /** Making charge value (₹ flat, ₹/gram, or % of metal value). */
  makingValue: number;
  /** Made-to-order items don't decrement stock; they show a lead time. */
  madeToOrder: boolean;
  /** Production lead time in days (made-to-order items). */
  leadTimeDays?: number;
  materials?: string[];
  careInstructions?: string;
  createdAt: string;
  averageRating: number;
  reviewCount: number;
  variants?: ProductVariant[];
  variantCombinations?: VariantCombination[];
}

export interface Artist {
  _id: string;
  _type: 'artist';
  name: string;
  bio: PortableTextBlock[];
  photo?: SanityImage;
  email?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    etsy?: string;
  };
}

export interface Testimonial {
  _id: string;
  _type: 'testimonial';
  customerName: string;
  customerPhoto?: SanityImage;
  testimonialText: string;
  rating: number;
  productReference?: Product;
  featured: boolean;
  createdAt: string;
}

export interface SilverRateSettings {
  _id: string;
  /** Fetched Indian market rate, ₹ per kg (999 purity). */
  marketRatePerKg?: number;
  /** Manual override, ₹ per kg. Always wins when set. */
  manualRatePerKg?: number;
  source?: string;
  updatedAt?: string;
}

export interface FAQ {
  _id: string;
  _type: 'faq';
  question: string;
  answer: string;
  category: 'shop' | 'general';
  sortOrder: number;
  isActive: boolean;
}
