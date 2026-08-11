'use client';

/**
 * CinematicScroll — sticky full-viewport section: the image slowly zooms
 * as you scroll while editorial text fades in. React port of the reference.
 */

import { useEffect, useRef } from 'react';

export default function CinematicScroll({
  imageUrl,
  label = 'The Art of Adornment',
  title = 'Grace in Every Detail',
  text = 'Observe the subtle play of light upon pure silver, tracing the intricate patterns forged by hands that understand the soul of the metal.',
}: {
  imageUrl: string;
  label?: string;
  title?: string;
  text?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const section = sectionRef.current;
        const img = imgRef.current;
        const content = contentRef.current;
        if (!section || !img || !content) return;
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        let progress = -rect.top / (rect.height - windowHeight);
        progress = Math.max(0, Math.min(1, progress));

        img.style.transform = `scale(${1 + progress * 0.25})`;

        if (progress > 0.2) {
          const contentProgress = Math.min(1, (progress - 0.2) * 2.5);
          content.style.opacity = String(contentProgress);
          content.style.transform = `translateY(${(1 - contentProgress) * 40}px)`;
        } else {
          content.style.opacity = '0';
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="cinematic-scroll-section">
      <div className="cinematic-sticky">
        <div className="cinematic-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imgRef} src={imageUrl} alt={title} className="cinematic-img" />
          <div className="cinematic-overlay" />
        </div>
        <div ref={contentRef} className="cinematic-content">
          <span className="label-caps cinematic-label">{label}</span>
          <h2 className="cinematic-title font-serif font-light">{title}</h2>
          <p className="cinematic-text">{text}</p>
        </div>
      </div>
    </section>
  );
}
