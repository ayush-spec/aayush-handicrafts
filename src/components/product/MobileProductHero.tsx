'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types/sanity';
import { getOptimizedImageUrl } from '@/lib/sanity/image';
import { formatPrice } from '@/lib/utils/currency';

interface MobileProductHeroProps {
  product: Product;
}

export default function MobileProductHero({ product }: MobileProductHeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSpecs, setShowSpecs] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const hasMultipleImages = product.images && product.images.length > 1;

  // Auto-hide tap hint after animation completes
  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => setShowHint(false), 2600);
      return () => clearTimeout(timer);
    }
  }, [showHint]);

  const handleImageTap = () => {
    setShowSpecs((prev) => !prev);
    setShowHint(false);
  };

  const imageUrl = product.images?.[currentImageIndex]
    ? getOptimizedImageUrl(product.images[currentImageIndex], { width: 800 })
    : '/placeholder-product.jpg';

  return (
    <div>
      {/* Image area — aspect-square gives height for absolute children */}
      <div className="relative aspect-square bg-secondary rounded-sm">
        {/* Clipped area for image + overlay */}
        <div
          className="absolute inset-0 overflow-hidden rounded-sm cursor-pointer"
          onClick={handleImageTap}
        >
          {/* Product media — video or image, blurs when specs are shown */}
          {product.videoUrl ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={imageUrl}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out ${
                showSpecs ? 'blur-[8px] scale-105' : 'blur-0 scale-100'
              }`}
            >
              <source src={product.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className={`object-cover transition-all duration-500 ease-out ${
                showSpecs ? 'blur-[8px] scale-105' : 'blur-0 scale-100'
              }`}
              sizes="100vw"
              priority
            />
          )}

          {/* Dark scrim when blurred */}
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ease-out ${
              showSpecs ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Specs content — fades in over blurred image */}
          <div
            className={`absolute inset-0 flex items-center justify-center px-[24px] transition-all duration-500 ease-out ${
              showSpecs
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-[10px] pointer-events-none'
            }`}
          >
            <div className="w-full max-w-[300px] space-y-[16px]">
              {/* Material + Category tags */}
              <div className="flex flex-wrap gap-[8px] justify-center">
                {product.materials && product.materials.map((mat, i) => (
                  <span
                    key={`mat-${i}`}
                    className="text-[10px] sm:text-[11px] uppercase tracking-widest text-white/90 font-medium border border-white/30 px-[10px] py-[4px] rounded-sm"
                  >
                    {mat}
                  </span>
                ))}
                {product.category && (
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-white/90 font-medium border border-white/30 px-[10px] py-[4px] rounded-sm">
                    {product.category.name}
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-white/20 mx-auto w-[40px]" />

              {/* Specs */}
              <div className="space-y-[12px] text-center">
                {product.dimensions && (
                  <div>
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-white/50 font-medium">
                      Dimensions
                    </p>
                    <p className="text-[13px] sm:text-[14px] text-white mt-[2px]">
                      {product.dimensions.height && `H: ${product.dimensions.height}″`}
                      {product.dimensions.width && ` × W: ${product.dimensions.width}″`}
                      {product.dimensions.depth && ` × D: ${product.dimensions.depth}″`}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-white/50 font-medium">
                    Silver
                  </p>
                  <p className="text-[13px] sm:text-[14px] text-white mt-[2px]">
                    {product.weightGrams}g · {product.purity}
                    {product.isHallmarked && ' · BIS'}
                  </p>
                </div>

                {product.careInstructions && (
                  <div>
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-white/50 font-medium">
                      Care
                    </p>
                    <p className="text-[13px] sm:text-[14px] text-white mt-[2px]">
                      {product.careInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tap hint animation */}
          {showHint && !showSpecs && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="animate-tap-hint flex flex-col items-center gap-[6px]">
                <svg
                  className="w-[28px] h-[28px] text-white drop-shadow-lg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
                  />
                </svg>
                <span className="text-[10px] uppercase tracking-widest text-white font-medium drop-shadow-lg">
                  Tap for details
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Gallery dots - Top Center */}
        {hasMultipleImages && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-primary' : 'bg-secondary/50'
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Title + Price below image */}
      <div className="mt-3 px-1">
        <h1 className="font-sans font-medium text-base uppercase tracking-wider text-ivory line-clamp-2 mb-1">
          {product.title}
        </h1>
        <p className="font-sans font-bold text-sm text-primary">
          {formatPrice(product.price ?? 0, false)}
        </p>
      </div>
    </div>
  );
}
