'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Hook to track scroll progress (0-1) with RAF throttling for 60fps performance
 * Extracted pattern from MugExperience component
 */
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = Math.max(0, Math.min(1, scrolled / maxScroll));
          setScrollProgress(progress);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollProgress;
}
