'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SwipeBackOptions {
  enabled?: boolean;
  edgeThreshold?: number; // Distance from left edge to trigger
  swipeThreshold?: number; // Minimum swipe distance
}

export function useSwipeBack({
  enabled = true,
  edgeThreshold = 50,
  swipeThreshold = 100,
}: SwipeBackOptions = {}) {
  const router = useRouter();
  const [swipeProgress, setSwipeProgress] = useState(0); // 0-1 for visual feedback
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchCurrentX = useRef(0);
  const isSwipeBack = useRef(false);
  const canGoBack = useRef(true);

  useEffect(() => {
    // Check if we can go back
    canGoBack.current = window.history.length > 1;
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      touchCurrentX.current = touch.clientX;

      // Only activate if starting from left edge
      if (touch.clientX <= edgeThreshold && canGoBack.current) {
        isSwipeBack.current = true;
      } else {
        isSwipeBack.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwipeBack.current) return;

      const touch = e.touches[0];
      touchCurrentX.current = touch.clientX;
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      // If vertical scroll is more prominent, cancel swipe back
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        isSwipeBack.current = false;
        setSwipeProgress(0);
        return;
      }

      // Only proceed if swiping right
      if (deltaX > 0) {
        // Prevent default to stop page scroll
        if (deltaX > 20) {
          e.preventDefault();
        }

        // Calculate progress (0-1) with diminishing returns after threshold
        const progress = Math.min(deltaX / swipeThreshold, 1);
        setSwipeProgress(progress);
      } else {
        isSwipeBack.current = false;
        setSwipeProgress(0);
      }
    };

    const handleTouchEnd = () => {
      if (!isSwipeBack.current) {
        setSwipeProgress(0);
        return;
      }

      const deltaX = touchCurrentX.current - touchStartX.current;

      // If swiped past threshold, trigger back navigation
      if (deltaX >= swipeThreshold) {
        // Animate to full width before going back
        setSwipeProgress(1);
        setTimeout(() => {
          router.back();
          setSwipeProgress(0);
        }, 150);
      } else {
        // Animate back to start
        setSwipeProgress(0);
      }

      isSwipeBack.current = false;
      touchStartX.current = 0;
      touchStartY.current = 0;
      touchCurrentX.current = 0;
    };

    const handleTouchCancel = () => {
      isSwipeBack.current = false;
      setSwipeProgress(0);
      touchStartX.current = 0;
      touchStartY.current = 0;
      touchCurrentX.current = 0;
    };

    // Add listeners with passive: false for preventDefault
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchCancel);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [enabled, edgeThreshold, swipeThreshold, router]);

  return { swipeProgress };
}
