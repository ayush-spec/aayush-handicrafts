import type { Product, Category, SanityImage } from '@/types/sanity';

// --- Sanity Image Mocks ---
const mockImage = (ref: string): SanityImage => ({
  _type: 'image',
  asset: {
    _ref: ref,
    _type: 'reference',
  },
});

// --- Category Mocks ---
export const mockCategoryMugs: Category = {
  _id: 'cat-mugs',
  _type: 'category',
  name: 'Mugs',
  slug: { current: 'mugs' },
  description: 'Handcrafted ceramic mugs',
  sortOrder: 1,
  productCount: 12,
};

export const mockCategoryVases: Category = {
  _id: 'cat-vases',
  _type: 'category',
  name: 'Vases',
  slug: { current: 'vases' },
  description: 'Artisan pottery vases',
  sortOrder: 2,
  productCount: 8,
};

export const mockCategoryBowls: Category = {
  _id: 'cat-bowls',
  _type: 'category',
  name: 'Bowls',
  slug: { current: 'bowls' },
  description: 'Handmade ceramic bowls',
  sortOrder: 3,
  productCount: 6,
};

export const mockCategories: Category[] = [
  mockCategoryMugs,
  mockCategoryVases,
  mockCategoryBowls,
];

// --- Product Mocks ---
export const mockProduct: Product = {
  _id: 'prod-1',
  _type: 'product',
  title: 'Handcrafted Ceramic Mug',
  slug: { current: 'handcrafted-ceramic-mug' },
  images: [
    mockImage('image-abc123-400x400-jpg'),
    mockImage('image-def456-400x400-jpg'),
    mockImage('image-ghi789-400x400-jpg'),
  ],
  description: [
    {
      _type: 'block',
      _key: 'block1',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 'span1',
          text: 'A beautifully handcrafted ceramic mug, perfect for your morning coffee.',
          marks: [],
        },
      ],
    },
  ],
  price: 1299,
  weightGrams: 100,
  purity: '925',
  isHallmarked: true,
  makingType: 'flat',
  makingValue: 500,
  madeToOrder: false,
  category: mockCategoryMugs,
  stockQuantity: 10,
  isFeatured: false,
  isBestseller: false,
  isLimitedEdition: false,
  createdAt: '2026-01-15T00:00:00Z',
  averageRating: 4.5,
  reviewCount: 12,
};

export const mockProductFeatured: Product = {
  ...mockProduct,
  _id: 'prod-2',
  title: 'Terracotta Vase',
  slug: { current: 'terracotta-vase' },
  price: 2499,
  weightGrams: 100,
  purity: '925',
  isHallmarked: true,
  makingType: 'flat',
  makingValue: 500,
  madeToOrder: false,
  category: mockCategoryVases,
  isFeatured: true,
  stockQuantity: 5,
  averageRating: 4.8,
  reviewCount: 24,
};

export const mockProductBestseller: Product = {
  ...mockProduct,
  _id: 'prod-3',
  title: 'Artisan Bowl Set',
  slug: { current: 'artisan-bowl-set' },
  price: 3499,
  weightGrams: 100,
  purity: '925',
  isHallmarked: true,
  makingType: 'flat',
  makingValue: 500,
  madeToOrder: false,
  category: mockCategoryBowls,
  isBestseller: true,
  stockQuantity: 3,
  averageRating: 4.9,
  reviewCount: 48,
};

export const mockProductOutOfStock: Product = {
  ...mockProduct,
  _id: 'prod-4',
  title: 'Limited Edition Planter',
  slug: { current: 'limited-edition-planter' },
  price: 4599,
  weightGrams: 100,
  purity: '925',
  isHallmarked: true,
  makingType: 'flat',
  makingValue: 500,
  madeToOrder: false,
  category: mockCategoryVases,
  stockQuantity: 0,
  isLimitedEdition: true,
};

export const mockProductLowStock: Product = {
  ...mockProduct,
  _id: 'prod-5',
  title: 'Glazed Tea Cup',
  slug: { current: 'glazed-tea-cup' },
  price: 899,
  weightGrams: 100,
  purity: '925',
  isHallmarked: true,
  makingType: 'flat',
  makingValue: 500,
  madeToOrder: false,
  stockQuantity: 2,
};

export const mockProductWithVariants: Product = {
  ...mockProduct,
  _id: 'prod-6',
  title: 'Speckled Coffee Mug',
  slug: { current: 'speckled-coffee-mug' },
  price: 1499,
  weightGrams: 100,
  purity: '925',
  isHallmarked: true,
  makingType: 'flat',
  makingValue: 500,
  madeToOrder: false,
  variants: [
    {
      sku: 'mug-white',
      variantType: 'color',
      name: 'White',
      value: '#FFFFFF',
      priceModifier: 0,
      stockQuantity: 5,
      isDefault: true,
    },
    {
      sku: 'mug-terracotta',
      variantType: 'color',
      name: 'Terracotta',
      value: '#F27149',
      priceModifier: 100,
      stockQuantity: 3,
    },
    {
      sku: 'mug-sage',
      variantType: 'color',
      name: 'Sage',
      value: '#448470',
      priceModifier: 100,
      stockQuantity: 8,
    },
  ],
};

export const mockProductLongTitle: Product = {
  ...mockProduct,
  _id: 'prod-7',
  title: 'Handcrafted Artisan Ceramic Coffee Mug with Terracotta Glaze and Gold Leaf Accents',
  slug: { current: 'handcrafted-artisan-ceramic-mug-terracotta-glaze-gold' },
};

// --- Product Arrays ---
export const mockProducts3 = [mockProduct, mockProductFeatured, mockProductBestseller];
export const mockProducts6 = [
  mockProduct,
  mockProductFeatured,
  mockProductBestseller,
  mockProductOutOfStock,
  mockProductLowStock,
  mockProductWithVariants,
];
