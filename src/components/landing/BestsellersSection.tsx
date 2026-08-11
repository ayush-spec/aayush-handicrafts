import Link from 'next/link';
import { Product } from '@/types/sanity';
import ProductCardVariant from '@/components/product/ProductCardVariant';

interface BestsellersProps {
  products: Product[];
}

export function BestsellersSection({ products }: BestsellersProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-4 md:py-6 lg:py-8 bg-secondary">
      {/* Header — right-aligned */}
      <div className="px-4 md:px-6 lg:px-12 mb-4 md:mb-6 text-right">
        <h2 className="type-h3 mb-2 text-ivory">
          Bestsellers <span className="inline-block ml-1">&rarr;</span>
        </h2>
        <p className="text-ivory/55 text-base md:text-lg">
          Our customers&apos; favorite picks
        </p>
      </div>

      {/* Collage grid */}
      <div className="px-4 md:px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-2 gap-x-[9px] md:gap-y-3 md:gap-x-[13px] lg:gap-y-4 lg:gap-x-[18px]">
          {products.slice(0, 10).map((product, index) => (
            <div
              key={product._id}
              className={index % 5 === 4 ? 'col-span-2' : ''}
            >
              <ProductCardVariant product={product} variant="minimal" />
            </div>
          ))}

          {/* Browse Shop end card */}
          <div>
            <Link href="/shop" className="flex items-center justify-center aspect-square bg-secondary rounded-sm">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Browse Shop &rarr;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
