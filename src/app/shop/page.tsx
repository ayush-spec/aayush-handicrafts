import { Metadata } from 'next';
import {
  getProductsWithFilters,
  getAllCategories,
} from '@/lib/sanity/queries';
import Pagination from '@/components/ui/Pagination';
import ShopGrid from '@/components/product/ShopGrid';

export const metadata: Metadata = {
  title: 'Shop | Aayush Handicrafts',
  description: 'Browse our collection of handcrafted silver — silverware, pooja essentials, and coins.',
};

interface ShopPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Parse search params
  const filters = {
    category: searchParams.category,
    search: searchParams.search,
    sort: searchParams.sort,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    itemsPerPage: 12,
  };

  // Fetch products and categories in parallel
  const [
    { products, total },
    categories,
  ] = await Promise.all([
    getProductsWithFilters(filters),
    getAllCategories(),
  ]);

  // Calculate pagination
  const totalPages = Math.ceil(total / filters.itemsPerPage);
  const currentPage = filters.page;

  return (
    <div className="min-h-screen pt-header md:pt-0 relative">
      {/* Products (Mobile: Cards, Desktop: Masonry) */}
      <ShopGrid products={products} total={total} categories={categories} />

      {/* Pagination */}
      {products.length > 0 && (
        <div className="hidden md:block container mx-auto px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={total}
              itemsPerPage={filters.itemsPerPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
