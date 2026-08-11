import { Product } from '@/types/sanity';
import ProductCardVariant from './ProductCardVariant';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="type-h4 text-ivory mb-8">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {products.map((product) => (
          <div key={product._id} className="pb-10">
            <ProductCardVariant product={product} variant="minimal" />
          </div>
        ))}
      </div>
    </section>
  );
}
