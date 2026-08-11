import { groq } from 'next-sanity';
import { client } from './client';
import { Product, Category, Artist, Testimonial } from '@/types/sanity';
import { getEffectiveRate, withComputedPrices } from '@/lib/pricing';

const productProjection = groq`
  _id,
  _type,
  title,
  slug,
  images,
  "videoUrl": video.asset->url,
  description,
  "category": category->{
    _id,
    name,
    slug
  },
  stockQuantity,
  isFeatured,
  isBestseller,
  isLimitedEdition,
  averageRating,
  reviewCount,
  dimensions,
  weightGrams,
  purity,
  isHallmarked,
  makingType,
  makingValue,
  madeToOrder,
  leadTimeDays,
  materials,
  careInstructions,
  createdAt,
  variants[]{
    sku,
    variantType,
    name,
    value,
    priceModifier,
    stockQuantity,
    images,
    isDefault
  },
  variantCombinations[]{
    sku,
    variantSkus,
    price,
    stockQuantity
  }
`;

export const allProductsQuery = groq`
  *[_type == "product"] | order(createdAt desc) {
    ${productProjection}
  }
`;

export const productsByCategoryQuery = groq`
  *[_type == "product" && category->slug.current == $categorySlug] | order(createdAt desc) {
    ${productProjection}
  }
`;

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    ${productProjection}
  }
`;

export const featuredProductsQuery = groq`
  *[_type == "product" && isFeatured == true] | order(createdAt desc) [0...4] {
    ${productProjection}
  }
`;

export const bestsellersQuery = groq`
  *[_type == "product" && isBestseller == true] | order(createdAt desc) [0...6] {
    ${productProjection}
  }
`;

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(sortOrder asc) {
    _id,
    name,
    slug,
    description,
    image,
    sortOrder
  }
`;

export const artistQuery = groq`
  *[_type == "artist"][0] {
    _id,
    name,
    bio,
    photo,
    email,
    socialLinks
  }
`;

export const relatedProductsQuery = groq`
  *[_type == "product" && category->slug.current == $categorySlug && slug.current != $currentSlug] | order(createdAt desc) [0...4] {
    ${productProjection}
  }
`;

export async function getAllProducts(): Promise<Product[]> {
  return client.fetch(allProductsQuery, {}, {
    next: { revalidate: 60 }
  });
}

export async function getProductsByCategory(
  categorySlug: string,
  limit?: number
): Promise<Product[]> {
  if (limit) {
    // Must use JavaScript interpolation for ALL dynamic values
    // (mixing JS interpolation with GROQ params doesn't work)
    const query = groq`
      *[_type == "product" && category->slug.current == "${categorySlug}"] |
      order(createdAt desc) [0...${limit}] {
        ${productProjection}
      }
    `;

    return client.fetch(query, {}, {
      next: { revalidate: 60 }
    });
  }

  // Use static query with GROQ parameter when no limit
  return client.fetch(productsByCategoryQuery, { categorySlug }, {
    next: { revalidate: 60 }
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return client.fetch(productBySlugQuery, { slug }, {
    next: { revalidate: 60 }
  });
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return client.fetch(featuredProductsQuery, {}, {
    next: { revalidate: 300 }
  });
}

export async function getBestsellers(limit: number = 6): Promise<Product[]> {
  const query = groq`
    *[_type == "product" && isBestseller == true] | order(createdAt desc) [0...${limit}] {
      ${productProjection}
    }
  `;

  return client.fetch(query, {}, {
    next: { revalidate: 300 }
  });
}

export async function getAllCategories(): Promise<Category[]> {
  return client.fetch(allCategoriesQuery, {}, {
    next: { revalidate: 3600 }
  });
}

export async function getArtist(): Promise<Artist | null> {
  return client.fetch(artistQuery, {}, {
    next: { revalidate: 3600 }
  });
}

export async function getRelatedProducts(
  categorySlug: string,
  currentSlug: string
): Promise<Product[]> {
  return client.fetch(relatedProductsQuery, { categorySlug, currentSlug }, {
    next: { revalidate: 300 }
  });
}

// Get recently added products (newcomers)
export async function getNewcomers(limit: number = 12): Promise<Product[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const query = groq`
    *[_type == "product" && dateTime(createdAt) > dateTime("${thirtyDaysAgo.toISOString()}")] |
    order(createdAt desc) [0...${limit}] {
      ${productProjection}
    }
  `;

  return client.fetch(query, {}, { next: { revalidate: 300 } });
}

// Get products under specific price (computed from live silver rate)
export async function getProductsByMaxPrice(maxPrice: number, limit: number = 12): Promise<Product[]> {
  const [products, rate] = await Promise.all([getAllProducts(), getEffectiveRate()]);
  return withComputedPrices(products, rate)
    .filter((p) => (p.price ?? 0) < maxPrice)
    .slice(0, limit);
}

// Get top categories by product count
export async function getTopCategories(limit: number = 4): Promise<Category[]> {
  const query = groq`
    *[_type == "category"] {
      _id,
      name,
      slug,
      "productCount": count(*[_type == "product" && references(^._id)])
    } | order(productCount desc) [0...${limit}]
  `;

  return client.fetch(query, {}, { next: { revalidate: 3600 } });
}

// Advanced filtering and pagination
export interface ProductFilters {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  itemsPerPage?: number;
}

export async function getProductsWithFilters(
  filters: ProductFilters = {}
): Promise<{ products: Product[]; total: number }> {
  const {
    category,
    search,
    sort = 'newest',
    minPrice,
    maxPrice,
    page = 1,
    itemsPerPage = 12,
  } = filters;

  // Prices are rate-linked (computed in JS), so fetch the full matching set
  // and filter/sort/paginate in memory. Catalog is small (~50 SKUs).
  const conditions: string[] = ['_type == "product"'];

  if (category) {
    conditions.push(`category->slug.current == "${category}"`);
  }

  if (search) {
    // Escape double quotes in search to prevent query breaking
    const escapedSearch = search.replace(/"/g, '\\"');
    conditions.push(`title match "*${escapedSearch}*"`);
  }

  const filterString = conditions.join(' && ');

  const productsQuery = groq`
    *[${filterString}] | order(createdAt desc) {
      ${productProjection}
    }
  `;

  const [raw, rate] = await Promise.all([
    client.fetch<Product[]>(productsQuery, {}, { next: { revalidate: 60 } }),
    getEffectiveRate(),
  ]);

  let products = withComputedPrices(raw, rate);

  if (minPrice !== undefined) products = products.filter((p) => (p.price ?? 0) >= minPrice);
  if (maxPrice !== undefined) products = products.filter((p) => (p.price ?? 0) <= maxPrice);

  switch (sort) {
    case 'price-asc':
      products.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      break;
    case 'price-desc':
      products.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;
    case 'name-asc':
      products.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name-desc':
      products.sort((a, b) => b.title.localeCompare(a.title));
      break;
    // 'newest' — already createdAt desc from GROQ
  }

  const total = products.length;
  const offset = (page - 1) * itemsPerPage;
  products = products.slice(offset, offset + itemsPerPage);

  return { products, total };
}

// Get price range for filtering (computed from live silver rate)
export async function getPriceRange(): Promise<{ min: number; max: number }> {
  const [products, rate] = await Promise.all([getAllProducts(), getEffectiveRate()]);
  const prices = withComputedPrices(products, rate).map((p) => p.price ?? 0);
  return {
    min: prices.length ? Math.min(...prices) : 0,
    max: prices.length ? Math.max(...prices) : 0,
  };
}

// Get featured testimonials for homepage
export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const query = groq`
    *[_type == "testimonial" && featured == true] | order(createdAt desc) [0...3] {
      _id,
      _type,
      customerName,
      customerPhoto,
      testimonialText,
      rating,
      "productReference": productReference->{
        _id,
        title,
        slug
      },
      featured,
      createdAt
    }
  `;

  return client.fetch(query, {}, { next: { revalidate: 300 } });
}

// ============================================================
// Silver Rate
// ============================================================

import type { FAQ, SilverRateSettings } from '@/types/sanity';

/**
 * Fetch the silver rate settings singleton from Sanity.
 * `manualRatePerKg` (if set) always wins over `marketRatePerKg`.
 * NOTE: `getEffectiveRate()` in `@/lib/pricing` is the preferred accessor.
 */
export async function getSilverRate(): Promise<SilverRateSettings | null> {
  const query = `
    *[_type == "silverRateSettings"][0] {
      _id,
      marketRatePerKg,
      manualRatePerKg,
      source,
      updatedAt
    }
  `;

  return client.fetch(query, {}, { next: { revalidate: 300 } });
}

// ============================================================
// FAQ Queries
// ============================================================

export async function getFAQsByCategory(category: string): Promise<FAQ[]> {
  const query = `
    *[_type == "faq" && isActive == true && category == "${category}"] | order(sortOrder asc) {
      _id,
      _type,
      question,
      answer,
      category,
      sortOrder,
      isActive
    }
  `;

  return client.fetch(query, {}, { next: { revalidate: 300 } });
}

export async function getAllFAQs(): Promise<FAQ[]> {
  const query = `
    *[_type == "faq" && isActive == true] | order(category asc, sortOrder asc) {
      _id,
      _type,
      question,
      answer,
      category,
      sortOrder,
      isActive
    }
  `;

  return client.fetch(query, {}, { next: { revalidate: 300 } });
}
