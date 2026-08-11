'use client';

/**
 * HoverMaskReveal — cursor-tracking circular spotlight that reveals the
 * full-color product photo through a desaturated silhouette.
 * Desktop: mask follows the mouse. Mobile (hover: none): IntersectionObserver
 * triggers a wipe reveal when the card scrolls into view.
 */

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export interface HoverMaskRevealProps {
  title: string;
  image: string;
  href: string;
  /** e.g. "92.5% Silver" */
  specLine1?: string;
  /** e.g. "132 grams" or a price */
  specLine2?: string;
}

export default function HoverMaskReveal({
  title,
  image,
  href,
  specLine1,
  specLine2,
}: HoverMaskRevealProps) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const colorRef = useRef<HTMLImageElement>(null);

  // Cursor-tracking mask (desktop only; harmless elsewhere)
  useEffect(() => {
    const container = containerRef.current;
    const color = colorRef.current;
    if (!container || !color) return;
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      color.style.setProperty('--mouseX', `${e.clientX - rect.left}px`);
      color.style.setProperty('--mouseY', `${e.clientY - rect.top}px`);
    };
    container.addEventListener('mousemove', onMove);
    return () => container.removeEventListener('mousemove', onMove);
  }, []);

  // Scroll-into-view reveal for touch devices
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) container.classList.add('is-visible');
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <Link ref={containerRef} href={href} className="hover-reveal-container">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hover-reveal-base" src={image} alt={title} loading="lazy" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={colorRef} className="hover-reveal-color" src={image} alt="" loading="lazy" />
      <div className="hover-reveal-overlay">
        <div className="product-title">{title}</div>
        {(specLine1 || specLine2) && (
          <div className="product-specs">
            {specLine1 && <span>{specLine1}</span>}
            {specLine2 && <span>{specLine2}</span>}
          </div>
        )}
      </div>
    </Link>
  );
}
