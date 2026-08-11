'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Truck } from 'lucide-react';

export function PromotionalBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner has been dismissed
    const isDismissed = localStorage.getItem('promoBannerDismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Store dismissal in localStorage (expires after session)
    localStorage.setItem('promoBannerDismissed', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-primary text-white py-2 md:py-3 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <Truck className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
        <p className="text-xs md:text-sm font-medium text-center">
          <span className="hidden sm:inline">Free Shipping on Orders Over ₹999 · </span>
          <Link href="/shop" className="underline hover:no-underline">
            Shop Now
          </Link>
        </p>
        <button
          onClick={handleDismiss}
          className="absolute right-2 md:right-4 p-1 hover:bg-secondary/20 rounded-sm transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
