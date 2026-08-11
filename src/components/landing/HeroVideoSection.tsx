'use client';

import { useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const FRAME_COUNT = 192;
const LOOP_END = 24; // frames 0–23 loop like a GIF
const LOOP_FPS = 24; // smooth playback frame rate
const LOOP_INTERVAL = 1000 / LOOP_FPS;

export default function HeroVideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const taglineTextRef = useRef<HTMLParagraphElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const loopRafRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[index];
    if (!canvas || !ctx || !img?.complete || !img.naturalWidth) return;

    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const scaledW = img.naturalWidth * scale;
    const scaledH = img.naturalHeight * scale;
    const x = (canvas.width - scaledW) / 2;
    const y = (canvas.height - scaledH) / 2;

    ctx.drawImage(img, x, y, scaledW, scaledH);
  }, []);

  // GIF loop — ping-pong: 0→LOOP_END-1 then back to 0 (no jump)
  const startLoop = useCallback(() => {
    if (isScrollingRef.current) return;

    let loopFrame = 0;
    let direction = 1; // 1 = forward, -1 = reverse
    let lastTime = 0;

    const animate = (time: number) => {
      if (isScrollingRef.current) return;

      if (time - lastTime >= LOOP_INTERVAL) {
        lastTime = time;
        drawFrame(loopFrame);
        currentFrameRef.current = loopFrame;

        loopFrame += direction;
        if (loopFrame >= LOOP_END - 1) {
          loopFrame = LOOP_END - 1;
          direction = -1;
        } else if (loopFrame <= 0) {
          loopFrame = 0;
          direction = 1;
        }
      }

      loopRafRef.current = requestAnimationFrame(animate);
    };

    loopRafRef.current = requestAnimationFrame(animate);
  }, [drawFrame]);

  const stopLoop = useCallback(() => {
    if (loopRafRef.current !== null) {
      cancelAnimationFrame(loopRafRef.current);
      loopRafRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Force scroll to top on mount
    window.scrollTo(0, 0);

    // Preload all frames
    const images: HTMLImageElement[] = [];
    let firstFrameLoaded = false;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = document.createElement('img');
      img.src = `/videos/hero-frames/frame-${String(i + 1).padStart(4, '0')}.jpg`;
      img.onload = () => {
        // Start GIF loop once first frame is ready
        if (i === 0 && !firstFrameLoaded) {
          firstFrameLoaded = true;
          drawFrame(0);
          startLoop();
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    // Resize canvas
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrameRef.current);
      ScrollTrigger.refresh();
    };
    resize();
    window.addEventListener('resize', resize);

    // GSAP ScrollTrigger — scrubs frames from current position → 191
    const frameObj = { frame: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        onEnter: () => {
          isScrollingRef.current = true;
          stopLoop();
          // Pick up from wherever the loop was
          frameObj.frame = currentFrameRef.current;
        },
        onLeaveBack: () => {
          isScrollingRef.current = false;
          startLoop();
        },
      },
    });

    // Frame scrub: 0 → 191 (mapped across full scroll)
    tl.to(frameObj, {
      frame: FRAME_COUNT - 1,
      ease: 'none',
      duration: 1,
      onUpdate: () => {
        // Only draw if we're past the loop range or actively scrolling
        const idx = Math.round(frameObj.frame);
        if (idx !== currentFrameRef.current && isScrollingRef.current) {
          currentFrameRef.current = idx;
          drawFrame(idx);
        }
      },
    }, 0);

    // Scroll hint fade out
    if (scrollHintRef.current) {
      tl.to(scrollHintRef.current, { opacity: 0, duration: 0.05, ease: 'none' }, 0);
    }

    // Tagline container: fade in at 25% (mobile via ref, desktop via class)
    const section = sectionRef.current;
    const desktopTagline = section?.querySelector('.tagline-desktop');
    const desktopTaglineText = section?.querySelector('.tagline-text-desktop');
    const desktopCta = section?.querySelector('.cta-desktop');

    if (taglineRef.current) {
      tl.fromTo(taglineRef.current,
        { opacity: 0 },
        { opacity: 1, ease: 'power2.out', duration: 0.05 },
        0.25,
      );
    }
    if (desktopTagline) {
      tl.fromTo(desktopTagline,
        { opacity: 0 },
        { opacity: 1, ease: 'power2.out', duration: 0.05 },
        0.25,
      );
    }

    // Tagline typing effect: types out from 27% → 42%
    if (taglineTextRef.current) {
      taglineTextRef.current.textContent = '';
      tl.to(taglineTextRef.current, {
        text: { value: 'Handcrafted with love', delimiter: '' },
        ease: 'none',
        duration: 0.15,
      }, 0.27);
    }
    if (desktopTaglineText) {
      (desktopTaglineText as HTMLElement).textContent = '';
      tl.to(desktopTaglineText, {
        text: { value: 'Handcrafted with love', delimiter: '' },
        ease: 'none',
        duration: 0.15,
      }, 0.27);
    }

    // CTA: fade in at 45%
    if (ctaRef.current) {
      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.10 },
        0.45,
      );
    }
    if (desktopCta) {
      tl.fromTo(desktopCta,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.10 },
        0.45,
      );
    }

    return () => {
      window.removeEventListener('resize', resize);
      stopLoop();
      tl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [drawFrame, startLoop, stopLoop]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[250vh] md:h-[400vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* Mobile: horizontal layout — logo bottom-left, text to its right */}
        <div className="absolute bottom-6 left-4 right-4 z-10 flex items-start gap-4 md:hidden">
          {/* Logo */}
          <div ref={logoRef} className="w-40 shrink-0">
            <Image
              src="/landingpagelogo.jpg"
              alt="Aayush Handicrafts"
              width={384}
              height={424}
              className="w-full h-auto"
            />
          </div>

          {/* Text — to the right of logo, bottom-aligned */}
          <div className="flex flex-col">
            {/* Tagline — typewriter effect */}
            <div ref={taglineRef} className="opacity-0">
              <div className="w-full h-px bg-secondary/60 mb-2" />
              <p
                ref={taglineTextRef}
                className="font-sans text-sm text-white/80 tracking-widest uppercase"
                style={{ textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}
              />
            </div>

            {/* CTAs */}
            <div ref={ctaRef} className="opacity-0 mt-3 flex flex-col gap-2">
              <Link
                href="/shop"
                className="text-white/80 hover:text-white transition-colors text-sm tracking-widest uppercase"
                style={{ textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}
              >
                Shop &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop: horizontal layout — logo bottom-left, text to its right */}
        <div className="absolute hidden md:flex bottom-4 left-4 z-10 items-start gap-8">
          {/* Logo */}
          <div className="w-56 lg:w-72 shrink-0">
            <Image
              src="/landingpagelogo.jpg"
              alt="Aayush Handicrafts"
              width={384}
              height={424}
              className="w-full h-auto"
            />
          </div>

          {/* Text — to the right of logo, top-aligned */}
          <div className="flex flex-col">
            {/* Tagline — typewriter effect */}
            <div className="opacity-0 tagline-desktop">
              <div className="w-full h-px bg-secondary/60 mb-4" />
              <p
                className="font-sans text-lg lg:text-xl text-white/80 tracking-widest uppercase tagline-text-desktop"
                style={{ textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}
              />
            </div>

            {/* CTAs */}
            <div className="opacity-0 mt-6 flex flex-row gap-8 cta-desktop">
              <Link
                href="/shop"
                className="text-white/80 hover:text-white transition-colors text-lg lg:text-xl tracking-widest uppercase"
                style={{ textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}
              >
                Shop &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint — bottom-right on mobile, bottom-center on desktop */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-8 right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 text-center z-10"
        >
          <p className="text-xs text-white/60 uppercase tracking-wider mb-2 md:hidden">Swipe</p>
          <p className="text-xs text-white/60 uppercase tracking-wider mb-2 hidden md:block">Scroll</p>
          <svg className="w-5 h-5 text-white/40 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
