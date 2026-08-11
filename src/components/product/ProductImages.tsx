'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { SanityImage } from '@/types/sanity';
import { getOptimizedImageUrl } from '@/lib/sanity/image';

interface ProductImagesProps {
  images: SanityImage[];
  productTitle: string;
  videoUrl?: string;
}

export default function ProductImages({ images, productTitle, videoUrl }: ProductImagesProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(!!videoUrl);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Handle empty images array
  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center text-ivory/35">
          <p className="text-sm">No image available</p>
        </div>
      </div>
    );
  }

  const lightboxSlides = images.map((img) => ({
    src: getOptimizedImageUrl(img, { width: 1200, quality: 90 }),
  }));

  return (
    <div className="space-y-4">
      {/* Main display — video or image */}
      <div
        className="relative aspect-square bg-secondary rounded-lg overflow-hidden cursor-zoom-in"
        onClick={() => { if (!showVideo) setLightboxOpen(true); }}
      >
        {showVideo && videoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={images[0] ? getOptimizedImageUrl(images[0], { width: 800 }) : undefined}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={getOptimizedImageUrl(images[selectedIndex], { width: 800 })}
            alt={`${productTitle} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}
      </div>

      {/* Thumbnails */}
      {(images.length > 1 || videoUrl) && (
        <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
          {/* Video thumbnail */}
          {videoUrl && (
            <button
              onClick={() => { setShowVideo(true); }}
              className={`relative aspect-square rounded-lg overflow-hidden ${
                showVideo
                  ? 'ring-2 ring-tertiary'
                  : 'ring-1 ring-ivory/10 hover:ring-ivory/20'
              }`}
            >
              {images[0] && (
                <Image
                  src={getOptimizedImageUrl(images[0], { width: 150 })}
                  alt={`${productTitle} video`}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
              )}
              {/* Play icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <svg className="w-6 h-6 text-white drop-shadow" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
          {/* Image thumbnails */}
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => { setShowVideo(false); setSelectedIndex(idx); }}
              className={`relative aspect-square rounded-lg overflow-hidden ${
                !showVideo && selectedIndex === idx
                  ? 'ring-2 ring-tertiary'
                  : 'ring-1 ring-ivory/10 hover:ring-ivory/20'
              }`}
            >
              <Image
                src={getOptimizedImageUrl(img, { width: 150 })}
                alt={`${productTitle} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={selectedIndex}
      />
    </div>
  );
}
