'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowRight } from 'lucide-react';
import { Product } from '@/types/sanity';
import { urlFor } from '@/lib/sanity/image';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { productToCartItem } from '@/lib/sanity/utils';
import Button from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import ProductCardVariant from '@/components/product/ProductCardVariant';

interface ProductCarouselProps {
  products: Product[];
  title: string;
  subtitle?: string;
  backgroundColor: string;  // Tailwind classes for gradient
  textColor?: string;       // Default: white for dark backgrounds
  cardVariant?: 'compact' | 'overlap';
}

export function ProductCarousel({
  products,
  title,
  subtitle,
  backgroundColor,
  textColor = 'text-white',
  cardVariant,
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const { addItem } = useCart();
  const toast = useToast();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      if (product.stockQuantity === 0) {
        toast.error('This product is out of stock');
        return;
      }

      setAddingProductId(product._id);

      try {
        const cartItem = productToCartItem(product, []);
        addItem({
          ...cartItem,
          quantity: 1,
        });

        toast.success(`Added ${product.title} to cart`);
      } catch (error) {
        toast.error('Failed to add to cart');
      } finally {
        setAddingProductId(null);
      }
    },
    [addItem, toast]
  );

  const onInit = useCallback(() => {
    if (emblaApi) {
      setScrollSnaps(emblaApi.scrollSnapList());
    }
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (emblaApi) {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onInit();
    onSelect();
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('reInit', onInit);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={`w-full ${backgroundColor} py-16 md:py-20 lg:py-24 px-4 md:px-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className={`type-h2 mb-4 ${textColor}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`${textColor} text-lg md:text-xl max-w-2xl mx-auto`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Embla viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className={`flex-[0_0_85%] iphone-max:flex-[0_0_90%] md:flex-[0_0_45%] lg:flex-[0_0_33.333%] min-w-0 ${cardVariant === 'overlap' ? 'pb-20' : ''}`}
                >
                  {cardVariant ? (
                    <ProductCardVariant product={product} variant={cardVariant} />
                  ) : (
                  <div className="bg-secondary rounded-sm overflow-hidden transition-colors duration-300 border border-ivory/10 hover:border-primary/20 group">
                    {/* Product image */}
                    <div className="relative aspect-[3/3.7] bg-secondary">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={urlFor(product.images[0]).width(600).url()}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-ivory/35">
                          No image
                        </div>
                      )}

                      {/* Urgency badges - Top right, stacked */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                        {/* Out of stock badge */}
                        {product.stockQuantity === 0 && (
                          <div className="bg-gray-400 text-white text-sm md:text-xs font-semibold px-3 py-1.5 md:py-1 rounded-sm">
                            Out of Stock
                          </div>
                        )}

                        {/* Low stock warning */}
                        {product.stockQuantity > 0 && product.stockQuantity < 5 && (
                          <div className="bg-red-500 text-white text-sm md:text-xs font-semibold px-3 py-1.5 md:py-1 rounded-sm">
                            Only {product.stockQuantity} left!
                          </div>
                        )}

                        {/* New arrival badge */}
                        {(() => {
                          const thirtyDaysAgo = new Date();
                          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                          const productDate = new Date(product.createdAt);
                          return productDate > thirtyDaysAgo;
                        })() && (
                          <div className="bg-primary text-white text-sm md:text-xs font-semibold px-3 py-1.5 md:py-1 rounded-sm">
                            New
                          </div>
                        )}

                        {/* Limited edition badge */}
                        {product.isLimitedEdition && (
                          <div className="bg-accent-purple text-white text-sm md:text-xs font-semibold px-3 py-1.5 md:py-1 rounded-sm">
                            Limited Edition
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product info */}
                    <div className="p-5">
                      {/* Category */}
                      {product.category && (
                        <span className="inline-block text-sm md:text-xs font-semibold uppercase tracking-wider mb-2 text-primary bg-primary/5 px-2.5 py-1 md:py-0.5 rounded-sm">
                          {product.category.name}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="type-h5 mb-2 text-ivory line-clamp-2">
                        {product.title}
                      </h3>

                      {/* Rating */}
                      {product.reviewCount > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                          <StarRating rating={product.averageRating} size="sm" />
                          <span className="text-sm text-ivory/55">
                            ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <p className="text-xl md:text-2xl font-bold text-primary mb-4">
                        ₹{(product.price ?? 0).toLocaleString('en-IN')}
                      </p>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-4 md:gap-3">
                        {/* Add to Cart button */}
                        <Button
                          variant="tertiary"
                          size="lg"
                          onClick={() => handleAddToCart(product)}
                          isLoading={addingProductId === product._id}
                          disabled={product.stockQuantity === 0}
                          fullWidth
                          className="flex items-center justify-center gap-2 transition-all duration-300 md:hover:backdrop-blur-md"
                        >
                          {!(addingProductId === product._id) && <ShoppingCart className="w-5 h-5" />}
                          {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>

                        {/* View Product button */}
                        <Button
                          variant="outline"
                          size="lg"
                          href={`/shop/${product.slug.current}`}
                          fullWidth
                          className="flex items-center justify-center gap-2 transition-all duration-300 md:hover:bg-primary/10 md:hover:backdrop-blur-sm"
                        >
                          View Details
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          {products.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-secondary backdrop-blur-sm p-3.5 md:p-3 rounded-sm border border-ivory/10 transition-colors duration-300 md:hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Previous product"
              >
                <ChevronLeft className="w-7 h-7 md:w-6 md:h-6 text-ivory" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-secondary backdrop-blur-sm p-3.5 md:p-3 rounded-sm border border-ivory/10 transition-colors duration-300 md:hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Next product"
              >
                <ChevronRight className="w-7 h-7 md:w-6 md:h-6 text-ivory" />
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {products.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-4 md:h-3 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? `${textColor === 'text-ivory' ? 'bg-gray-900' : 'bg-secondary'} w-10 md:w-8`
                    : `${textColor === 'text-ivory' ? 'bg-gray-900/40 md:hover:bg-gray-900/60' : 'bg-secondary/40 md:hover:bg-secondary/60'} w-4 md:w-3`
                }`}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
