'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

const LOGOS = [
  '/logos/monkeylogo.png',
  '/logos/doglogo.png',
  '/logos/catlogo.png',
  '/logos/potterygreen.png',
  '/logos/potterypink.png',
  '/logos/potteryorange.png',
  '/logos/naturepink.png',
  '/logos/natureorange.png',
  '/logos/naturegreen.png',
];

interface LogoItem {
  src: string;
  gridX: number; // grid column
  gridY: number; // grid row
  offsetX: number; // random offset within cell (-0.3 to 0.3)
  offsetY: number;
  baseScale: number;
  rotation: number;
  opacity: number;
  phase: number; // unique phase offset for scroll animation
}

// Seeded random for consistent layout across renders
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateGrid(cols: number, rows: number, seed: number): LogoItem[] {
  const rand = seededRandom(seed);
  const items: LogoItem[] = [];
  let logoIdx = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Skip ~15% of cells for organic feel
      if (rand() < 0.15) continue;

      items.push({
        src: LOGOS[logoIdx % LOGOS.length],
        gridX: col,
        gridY: row,
        offsetX: (rand() - 0.5) * 0.6, // -0.3 to 0.3 cell widths
        offsetY: (rand() - 0.5) * 0.6,
        baseScale: rand() * 0.3 + 0.5, // 0.5-0.8 — start small
        rotation: rand() * 30 - 15, // -15 to 15 degrees
        opacity: rand() * 0.3 + 0.4, // 0.40-0.70
        phase: rand() * Math.PI * 2,
      });
      logoIdx++;
    }
  }

  return items;
}

interface LogoPatternBackgroundProps {
  className?: string;
}

export function LogoPatternBackground({ className = '' }: LogoPatternBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  // Dense grid: mobile 8x12=96 cells, desktop 12x14=168 cells
  const cols = isMobile ? 8 : 12;
  const rows = isMobile ? 12 : 14;
  const itemsRef = useRef<LogoItem[]>(generateGrid(12, 14, 42));
  // Regenerate if grid size changes
  const prevGridKey = useRef('12x14');
  const gridKey = `${cols}x${rows}`;
  if (gridKey !== prevGridKey.current) {
    itemsRef.current = generateGrid(cols, rows, 42);
    prevGridKey.current = gridKey;
  }
  const items = itemsRef.current;

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const animate = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const viewportH = window.innerHeight;
    // Progress: 0 when top enters viewport bottom, 1 when bottom exits viewport top
    const progress = Math.max(0, Math.min(1, (viewportH - rect.top) / (viewportH + rect.height)));

    const logoEls = containerRef.current.querySelectorAll<HTMLDivElement>('[data-logo]');
    logoEls.forEach((el, i) => {
      if (i >= items.length) return;
      const item = items[i];
      // Each logo pulses between small and large as you scroll, offset by phase
      // Scale range: baseScale * 0.4 to baseScale * 2.2
      const scrollFactor = Math.sin(progress * Math.PI * 3 + item.phase);
      const scale = item.baseScale * (1 + scrollFactor * 0.8);
      el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)}) rotate(${item.rotation}deg)`;
    });
  }, [items]);

  useEffect(() => {
    const onScroll = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          animate();
          rafRef.current = 0;
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    animate(); // initial

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  const cellW = 100 / cols;
  const cellH = 100 / rows;
  const logoSize = isMobile ? 40 : 56;

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {items.map((item, i) => {
        const left = (item.gridX + 0.5 + item.offsetX) * cellW;
        const top = (item.gridY + 0.5 + item.offsetY) * cellH;
        return (
          <div
            key={i}
            data-logo
            className="absolute will-change-transform"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              transform: `translate(-50%, -50%) scale(${item.baseScale}) rotate(${item.rotation}deg)`,
              opacity: item.opacity,
              width: logoSize,
              height: logoSize,
            }}
          >
            <Image
              src={item.src}
              alt=""
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          </div>
        );
      })}
    </div>
  );
}
