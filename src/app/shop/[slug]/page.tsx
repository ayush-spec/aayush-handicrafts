import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from '@/lib/sanity/queries';
import { getOptimizedImageUrl } from '@/lib/sanity/image';
import { getEffectiveRate, withComputedPrice, withComputedPrices } from '@/lib/pricing';
import { siteConfig } from '@/config/site.config';
import ProductImages from '@/components/product/ProductImages';
import ProductInfo from '@/components/product/ProductInfo';
import ProductDescription from '@/components/product/ProductDescription';
import RelatedProducts from '@/components/product/RelatedProducts';
import MobileProductHero from '@/components/product/MobileProductHero';

interface ProductPageProps {
  params: { slug: string };
}

// Allow dynamic paths in development (for products not pre-rendered)
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const products = await getAllProducts();
    console.log('[generateStaticParams] Found products:', products.length);
    return products.map((product) => ({
      slug: product.slug.current,
    }));
  } catch (error) {
    console.error('[generateStaticParams] Error:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: `Product Not Found | ${siteConfig.brand.name}`,
    };
  }

  const firstParagraph = product.description
    .find((block: any) => block._type === 'block')
    ?.children?.map((child: any) => child.text)
    .join('') || product.title;

  return {
    title: `${product.title} | ${siteConfig.brand.name}`,
    description: firstParagraph.substring(0, 160),
    openGraph: {
      title: product.title,
      description: firstParagraph.substring(0, 160),
      images: [
        {
          url: product.images?.[0]
            ? getOptimizedImageUrl(product.images[0], { width: 1200 })
            : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/placeholder-product.jpg`,
          width: 1200,
          height: 1200,
          alt: product.title,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [rawProduct, rate] = await Promise.all([
    getProductBySlug(params.slug),
    getEffectiveRate(),
  ]);

  if (!rawProduct) {
    notFound();
  }

  const product = withComputedPrice(rawProduct, rate);

  const relatedProducts = withComputedPrices(
    await getRelatedProducts(product.category.slug.current, product.slug.current),
    rate
  );

  return (
    <div className="container mx-auto px-4 pt-header-lg md:pt-8 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs — desktop only */}
        <nav className="hidden md:block mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-ivory/45">
            <li>
              <Link href="/" className="hover:text-tertiary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/shop" className="hover:text-tertiary">
                Shop
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/shop?category=${product.category.slug.current}`}
                className="hover:text-tertiary"
              >
                {product.category.name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-ivory">{product.title}</li>
          </ol>
        </nav>

        {/* Mobile Layout — Overlapping title hero */}
        <div className="block md:hidden mb-16">
          <MobileProductHero product={product} />
          <div className="mt-4 px-1">
            <ProductInfo product={product} hideTitleAndPrice />
          </div>
          <div className="mt-8 max-w-3xl">
            <ProductDescription content={product.description} />
          </div>
        </div>

        {/* Desktop Layout — Two-column grid */}
        <div className="hidden md:grid grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <ProductImages images={product.images} productTitle={product.title} videoUrl={product.videoUrl} />

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Description - Desktop only (mobile has it inline above) */}
        <div className="hidden md:block mb-16 max-w-3xl">
          <ProductDescription content={product.description} />
        </div>

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}
