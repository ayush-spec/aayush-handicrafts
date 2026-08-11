'use client';

/**
 * VortexGallery — cinematic 3D rotating product ring (React port of the
 * reference site's signature hero). Desktop: auto-rotating ring with
 * momentum drag + depth blur. Mobile: horizontal scroll-snap strip.
 * Click navigates to the product page.
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/config/site.config';

export interface VortexItem {
  id: string;
  title: string;
  image: string;
  href: string;
}

export default function VortexGallery({ items }: { items: VortexItem[] }) {
  const router = useRouter();
  const ringRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const state = useRef({
    rotationY: 0,
    velocity: 0,
    isDragging: false,
    isHovered: false,
    lastX: 0,
    raf: 0,
  });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (isMobile || items.length === 0) return;

    const s = state.current;
    const numItems = items.length;
    const AUTO_SPEED = 0.06;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateTransforms = () => {
      const radius = Math.max(window.innerWidth * 0.65, 800);
      const ring = ringRef.current;
      if (!ring) return;
      ring.style.transform = `translateZ(${-radius}px) rotateY(${s.rotationY}deg)`;

      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        const angle = (index / numItems) * 360;
        el.style.transform = `rotateY(${angle}deg) translateZ(${radius}px) rotateY(${-s.rotationY - angle}deg)`;
        let current = (angle + s.rotationY) % 360;
        if (current < 0) current += 360;
        const isBack = current > 90 && current < 270;
        el.classList.toggle('is-back', isBack);
        el.classList.toggle('is-front', !isBack);
      });
    };

    const animate = () => {
      if (!reduced && !s.isDragging) {
        if (Math.abs(s.velocity) > 0.01) {
          s.rotationY += s.velocity;
          s.velocity *= 0.95;
        } else if (!s.isHovered) {
          s.rotationY -= AUTO_SPEED;
        }
      }
      updateTransforms();
      s.raf = requestAnimationFrame(animate);
    };

    const onStart = (x: number) => {
      s.isDragging = true;
      s.lastX = x;
      s.velocity = 0;
    };
    const onMove = (x: number) => {
      if (!s.isDragging) return;
      const dx = x - s.lastX;
      s.rotationY += dx * 0.3;
      s.velocity = dx * 0.3;
      s.lastX = x;
    };
    const onEnd = () => {
      s.isDragging = false;
    };

    const container = ringRef.current?.parentElement;
    container?.addEventListener('mousedown', (e) => onStart(e.clientX));
    const mm = (e: MouseEvent) => onMove(e.clientX);
    const tm = (e: TouchEvent) => onMove(e.touches[0].clientX);
    const ts = (e: TouchEvent) => onStart(e.touches[0].clientX);
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', onEnd);
    container?.addEventListener('touchstart', ts, { passive: true });
    window.addEventListener('touchmove', tm, { passive: true });
    window.addEventListener('touchend', onEnd);
    container?.addEventListener('mouseenter', () => (s.isHovered = true));
    container?.addEventListener('mouseleave', () => (s.isHovered = false));

    animate();
    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', tm);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isMobile, items.length]);

  const handleClick = (href: string) => {
    if (Math.abs(state.current.velocity) > 0.3) return; // was a drag
    router.push(href);
  };

  if (items.length === 0) return null;

  return (
    <section className="vortex-container">
      {/* Brand title over the ring */}
      <div className="vortex-title">
        <span className="label-caps" style={{ display: 'block', marginBottom: '0.75rem' }}>
          Jaipur · Pure Silver
        </span>
        <h1 className="font-serif font-light text-ivory" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
          {siteConfig.brand.name}
        </h1>
      </div>

      {isMobile ? (
        <div className="vortex-mobile-strip">
          {items.map((item) => (
            <a key={item.id} href={item.href} aria-label={item.title}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} loading="lazy" />
            </a>
          ))}
        </div>
      ) : (
        <div ref={ringRef} className="vortex-ring">
          {items.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="vortex-item"
              onClick={() => handleClick(item.href)}
              role="link"
              aria-label={item.title}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} loading={i < 3 ? 'eager' : 'lazy'} />
            </div>
          ))}
        </div>
      )}

      <div className="vortex-hint label-caps">
        {isMobile ? 'Swipe to explore · Tap to view' : 'Drag to explore · Click to contemplate'}
      </div>
    </section>
  );
}
