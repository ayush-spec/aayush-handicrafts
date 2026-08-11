'use client';

import { useSwipeBack } from '@/hooks/useSwipeBack';

export default function SwipeBackIndicator() {
  const { swipeProgress } = useSwipeBack();

  if (swipeProgress === 0) return null;

  const opacity = Math.min(swipeProgress * 2, 0.8); // Fade in quickly
  const translateX = -20 + (swipeProgress * 20); // Arrow slides in from left

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ opacity }}
    >
      {/* Dim overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Back arrow indicator */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4"
        style={{ transform: `translateY(-50%) translateX(${translateX}px)` }}
      >
        <div className="bg-secondary rounded-full p-3 shadow-lg">
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
        {swipeProgress > 0.5 && (
          <span className="text-sm font-medium text-ivory bg-secondary px-3 py-1 rounded-full shadow-lg">
            Release to go back
          </span>
        )}
      </div>

      {/* Sliding page effect - subtle overlay that moves with swipe */}
      <div
        className="absolute inset-0 bg-secondary border-r-2 border-ivory/10 shadow-2xl"
        style={{
          transform: `translateX(${-100 + (swipeProgress * 100)}%)`,
          transition: swipeProgress === 1 ? 'transform 150ms ease-out' : 'none',
        }}
      />
    </div>
  );
}
