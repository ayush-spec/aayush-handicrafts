'use client';

import Image from 'next/image';
import { Sparkles, Heart, Package } from 'lucide-react';
import Link from 'next/link';

export function InfoSection() {
  return (
    <div className="flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] rounded-sm overflow-hidden mb-6">
        <Image
          src="/images/workshop/cta.jpg"
          alt="Aayush Handicrafts silver collection"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Text Content */}
      <p className="type-label text-primary mb-2">Collection</p>
      <h2 className="type-h4 mb-3 text-ivory">
        Shop Collection
      </h2>
      <p className="type-body text-ivory/55 mb-6">
        Discover your perfect piece of handcrafted silver
      </p>

      {/* Value Props */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-1" />
          <p className="text-xs font-medium text-ivory/75">Handmade</p>
        </div>
        <div className="text-center">
          <Heart className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-1" />
          <p className="text-xs font-medium text-ivory/75">Made with Love</p>
        </div>
        <div className="text-center">
          <Package className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-1" />
          <p className="text-xs font-medium text-ivory/75">Unique Pieces</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-auto">
        <Link
          href="/shop"
          className="text-primary hover:text-ivory transition-colors text-sm md:text-base tracking-widest uppercase"
        >
          Browse Collection &rarr;
        </Link>
        <Link
          href="/about"
          className="text-primary hover:text-ivory transition-colors text-sm md:text-base tracking-widest uppercase"
        >
          Our Story &rarr;
        </Link>
      </div>
    </div>
  );
}
