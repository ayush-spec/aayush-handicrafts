'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface ScrollSnapOptions {
  totalCards: number;
  scrollPerCard?: number;
  snapThreshold?: number;
  velocityThreshold?: number;
  snapDuration?: number;
  scrollOffset?: number; // Offset from top of page to start of card stack
}

interface ScrollSnapState {
  progress: number;
  currentCardIndex: number;
  localProgress: number;
  isSnapping: boolean;
  velocity: number;
}

export function useScrollProgressWithSnap({
  totalCards,
  scrollPerCard = 400,
  snapThreshold = 0.35, // Lowered default for more responsive feel
  velocityThreshold = 0.6,
  snapDuration = 350, // Faster snap for snappier swipe feel
  scrollOffset = 0 // Default to 0 for backward compatibility
}: ScrollSnapOptions): ScrollSnapState {
  const [state, setState] = useState<ScrollSnapState>({
    progress: 0,
    currentCardIndex: 0,
    localProgress: 0,
    isSnapping: false,
    velocity: 0
  });

  const ticking = useRef(false);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const velocityRef = useRef(0);

  const totalScrollDistance = useMemo(() =>
    Math.max((totalCards - 1) * scrollPerCard, scrollPerCard),
    [totalCards, scrollPerCard]
  );

  const smoothScrollTo = useCallback((targetCardIndex: number) => {
    setState(prev => ({ ...prev, isSnapping: true }));

    const targetScrollY = targetCardIndex * scrollPerCard + scrollOffset;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });

    setTimeout(() => {
      setState(prev => ({ ...prev, isSnapping: false }));
    }, snapDuration);
  }, [scrollPerCard, snapDuration, scrollOffset]);

  const handleScrollEnd = useCallback(() => {
    const { currentCardIndex, localProgress, isSnapping } = state;
    if (isSnapping) return;

    const velocity = velocityRef.current;
    const absVelocity = Math.abs(velocity);

    // Velocity-adjusted threshold
    let adjustedThreshold = snapThreshold;
    if (absVelocity > velocityThreshold) {
      adjustedThreshold = 0.15; // Fast swipe: 15% threshold
    } else if (absVelocity > velocityThreshold * 0.5) {
      adjustedThreshold = 0.35; // Medium swipe: 35% threshold
    }

    // Determine snap direction
    let targetIndex = currentCardIndex;

    if (velocity < 0) {
      // Scrolling up (swiping up to dismiss)
      if (localProgress >= adjustedThreshold) {
        targetIndex = Math.min(currentCardIndex + 1, totalCards - 1);
      }
    } else if (velocity > 0) {
      // Scrolling down (going back)
      if (localProgress > (1 - adjustedThreshold)) {
        targetIndex = currentCardIndex;
      } else {
        targetIndex = Math.max(currentCardIndex - 1, 0);
      }
    } else {
      // No velocity - use position threshold
      if (localProgress >= snapThreshold) {
        targetIndex = Math.min(currentCardIndex + 1, totalCards - 1);
      }
    }

    // Only snap if we're between cards
    if (localProgress > 0.02 && localProgress < 0.98) {
      smoothScrollTo(targetIndex);
    }
  }, [state, snapThreshold, velocityThreshold, totalCards, smoothScrollTo]);

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      const currentScrollY = window.scrollY;

      // Adjust scroll position by offset
      const adjustedScrollY = Math.max(0, currentScrollY - scrollOffset);

      // Calculate velocity (px/ms) - using adjusted scroll
      const timeDelta = Math.max(now - lastScrollTime.current, 1);
      const adjustedLastScrollY = Math.max(0, lastScrollY.current - scrollOffset);
      velocityRef.current = (adjustedScrollY - adjustedLastScrollY) / timeDelta;

      lastScrollY.current = currentScrollY;
      lastScrollTime.current = now;

      // Scroll end detection - trigger after 150ms of no scrolling
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(handleScrollEnd, 150);

      if (!ticking.current) {
        requestAnimationFrame(() => {
          const progress = Math.max(0, Math.min(1, adjustedScrollY / totalScrollDistance));
          const cardFloat = progress * (totalCards - 1);
          const currentCardIndex = Math.floor(cardFloat);
          const localProgress = cardFloat - currentCardIndex;

          setState(prev => ({
            ...prev,
            progress,
            currentCardIndex: Math.min(currentCardIndex, totalCards - 1),
            localProgress,
            velocity: velocityRef.current
          }));

          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [totalCards, totalScrollDistance, handleScrollEnd, scrollOffset]);

  return state;
}
