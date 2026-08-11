'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface InfoCardData {
  label: string;
  title: string;
  description: string;
  cta?: string;
}

// Card order matches video appearance: Cat (bottom-center) → Sunflower (LEFT) → Bow (RIGHT)
// Narrative arc: Curiosity → Desire → Action
const INFO_CARDS: InfoCardData[] = [
  {
    label: 'HANDMADE',
    title: 'Someone Made This',
    description: 'Not a factory. Not a machine. A karigar\'s hands shaped this from a bar of silver.',
  },
  {
    label: 'REAL SILVER',
    title: 'Priced by Weight',
    description: 'Every piece is priced on the live Indian silver rate plus making charges. No inflated MRPs.',
  },
  {
    label: 'READY?',
    title: 'Find Your Piece',
    description: 'Silverware, pooja essentials, and coins — hallmarked, handcrafted, made to last generations.',
    cta: 'Shop the Collection →',
  },
];

// Card positions — opposite side of each hand in the video
const CARD_POSITIONS = [
  'left-8 lg:left-16 top-1/4',      // Cat: hand bottom-center → card LEFT
  'right-8 lg:right-16 top-1/3',    // Sunflower: hand LEFT → card RIGHT
  'left-8 lg:left-16 top-1/3',      // Pink Bow: hand RIGHT → card LEFT
];

const FRAME_COUNT = 192;
const START_FRAME_DESKTOP = 140; // Cat cup already visible on entry
const START_FRAME_MOBILE = 191; // Empty scene, cup appears on scroll

function InfoCard({
  data,
  position,
  desktopRef,
}: {
  data: InfoCardData;
  position: string;
  desktopRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={desktopRef as React.RefObject<HTMLDivElement>}
      className={`hidden md:block absolute ${position} max-w-xs z-10 opacity-0`}
    >
      <div className="p-8" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
        <p className="text-[12px] leading-[16px] tracking-[0.08em] uppercase font-medium text-primary mb-3">
          {data.label}
        </p>
        <h3 className="type-h3 text-white mb-4">
          {data.title}
        </h3>
        <p className="text-[15px] leading-[24px] tracking-[0.01em] text-white/80">
          {data.description}
        </p>
        {data.cta && (
          <Link
            href="/shop"
            className="inline-block mt-5 text-sm font-semibold text-primary border-b-2 border-primary hover:text-white hover:border-white transition-colors"
            style={{ textShadow: 'none' }}
          >
            {data.cta}
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ScrollVideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const introTextRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(START_FRAME_DESKTOP);
  const mobileFrameRangeRef = useRef({ start: START_FRAME_MOBILE, end: 60 });
  // Desktop card refs
  const card1DesktopRef = useRef<HTMLDivElement>(null);
  const card2DesktopRef = useRef<HTMLDivElement>(null);
  const card3DesktopRef = useRef<HTMLDivElement>(null);
  const mobileTopTextRef = useRef<HTMLDivElement>(null);
  const mobileLine1Ref = useRef<HTMLParagraphElement>(null);
  const mobileLine2Ref = useRef<HTMLParagraphElement>(null);
  const mobileLine3Ref = useRef<HTMLParagraphElement>(null);
  const mobileLine4Ref = useRef<HTMLParagraphElement>(null);
  const mobileLine5Ref = useRef<HTMLParagraphElement>(null);
  const mobileLine6Ref = useRef<HTMLParagraphElement>(null);
  const mobileBottomTextRef = useRef<HTMLDivElement>(null);

  // Draw a frame to the canvas
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[index];
    if (!canvas || !ctx || !img?.complete || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const mobile = cw < 768;

    // Clear with white (visible as letterbox on mobile zoom-out)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);

    let scale: number;
    let x: number;
    let y: number;

    if (mobile) {
      // Zoom out from cover-fit → contain-fit based on scroll progress
      const { start, end } = mobileFrameRangeRef.current;
      const progress = Math.max(0, Math.min(1, (start - index) / (start - end)));

      const coverScale = Math.max(cw / iw, ch / ih);
      const containScale = Math.min(cw / iw, ch / ih);
      scale = coverScale + (containScale - coverScale) * progress;

      const scaledW = iw * scale;
      const scaledH = ih * scale;
      x = (cw - scaledW) / 2;
      y = (ch - scaledH) / 2;

      ctx.drawImage(img, x, y, scaledW, scaledH);

      // Position bottom CTA right below the video's bottom edge
      if (mobileBottomTextRef.current) {
        const videoBottom = y + scaledH;
        mobileBottomTextRef.current.style.top = `${videoBottom + 8}px`;
      }
    } else {
      // Desktop: cover-fit, centered
      scale = Math.max(cw / iw, ch / ih);
      const scaledW = iw * scale;
      const scaledH = ih * scale;
      x = (cw - scaledW) / 2;
      y = (ch - scaledH) / 2;

      ctx.drawImage(img, x, y, scaledW, scaledH);
    }
  };

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    // Mobile: empty scene → cup appears → continues to frame 60
    // Desktop: cup visible (140) → full animation to frame 0
    const startFrame = mobile ? START_FRAME_MOBILE : START_FRAME_DESKTOP;
    const END_FRAME = mobile ? 60 : 0;
    currentFrameRef.current = startFrame;

    // Preload all frames
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/videos/frames/frame-${String(i + 1).padStart(4, '0')}.jpg`;
      img.onload = () => {
        loadedCount++;
        // Draw starting frame once loaded
        if (i === startFrame) {
          drawFrame(startFrame);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    // Resize canvas to fill viewport
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

    // GSAP ScrollTrigger — NO pin, CSS sticky handles viewport locking
    const frameObj = { frame: startFrame };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: mobile ? 0.3 : 0.5,
      },
    });

    // Animate frame index: START_FRAME → END_FRAME
    tl.to(frameObj, {
      frame: END_FRAME,
      ease: 'none',
      duration: 1,
      onUpdate: () => {
        const idx = Math.round(frameObj.frame);
        if (idx !== currentFrameRef.current) {
          currentFrameRef.current = idx;
          drawFrame(idx);
        }
      },
    }, 0);

    // Scroll hint fade out (first 5% of timeline)
    if (scrollHintRef.current) {
      tl.to(scrollHintRef.current, { opacity: 0, duration: 0.05, ease: 'none' }, 0);
    }

    // Mobile intro text fade out (first 5%, before card appears)
    if (introTextRef.current) {
      tl.to(introTextRef.current, { opacity: 0, duration: 0.05, ease: 'none' }, 0);
    }

    // Desktop: 3 cards timed to hand appearances
    if (!mobile) {
      const desktopTimings = [
        { fadeIn: 0.02, peak: 0.08, fadeOut: 0.25 },
        { fadeIn: 0.30, peak: 0.40, fadeOut: 0.55 },
        { fadeIn: 0.55, peak: 0.65, fadeOut: 0.80 },
      ];
      const desktopRefs = [card1DesktopRef, card2DesktopRef, card3DesktopRef];

      desktopTimings.forEach((timing, i) => {
        const ref = desktopRefs[i];
        if (!ref.current) return;
        tl.fromTo(ref.current,
          { opacity: 0 },
          { opacity: 1, ease: 'power2.out', duration: timing.peak - timing.fadeIn },
          timing.fadeIn,
        );
        tl.to(ref.current,
          { opacity: 0, ease: 'power2.in', duration: timing.fadeOut - timing.peak },
          timing.peak,
        );
      });
    }

    // Mobile: letterbox lines appear one by one as the white band grows
    if (mobile) {
      const lineRefs = [mobileLine1Ref, mobileLine2Ref, mobileLine3Ref, mobileLine4Ref, mobileLine5Ref, mobileLine6Ref];
      const lineTimings = [0.25, 0.32, 0.39, 0.46, 0.53, 0.60];

      lineRefs.forEach((ref, i) => {
        if (!ref.current) return;
        tl.fromTo(ref.current,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, ease: 'power2.out', duration: 0.06 },
          lineTimings[i],
        );
      });

      // Bottom CTA appears last, right below video edge
      if (mobileBottomTextRef.current) {
        tl.fromTo(mobileBottomTextRef.current,
          { opacity: 0 },
          { opacity: 1, ease: 'power2.out', duration: 0.08 },
          0.66,
        );
      }
    }

    return () => {
      window.removeEventListener('resize', resize);
      tl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    // Mobile: 300vh (shorter scroll, only bottom hand) / Desktop: 500vh (full animation)
    <section ref={sectionRef} className="relative h-[300vh] md:h-[500vh]">
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden bg-secondary">
        {/* Canvas — fills viewport */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* Mobile intro text — visible at start, fades out on scroll */}
        <div
          ref={introTextRef}
          className="md:hidden absolute top-0 left-0 right-0 z-10 px-5 py-8 flex flex-col items-center text-center"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)' }}
        >
          <p className="font-sans text-lg font-medium text-white tracking-wide">
            See what we can make — keep scrolling
          </p>
          <svg className="w-6 h-6 text-white mt-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Desktop Info Cards */}
        <InfoCard data={INFO_CARDS[0]} position={CARD_POSITIONS[0]} desktopRef={card1DesktopRef} />
        <InfoCard data={INFO_CARDS[1]} position={CARD_POSITIONS[1]} desktopRef={card2DesktopRef} />
        <InfoCard data={INFO_CARDS[2]} position={CARD_POSITIONS[2]} desktopRef={card3DesktopRef} />

        {/* Mobile letterbox text — lines appear one by one as band grows */}
        <div
          ref={mobileTopTextRef}
          className="md:hidden absolute top-0 left-0 right-0 z-10 px-5 py-4"
        >
          <p ref={mobileLine1Ref} className="font-sans text-sm text-ivory/35 tracking-widest uppercase mb-1 opacity-0">
            Aayush Handicrafts
          </p>
          <p ref={mobileLine2Ref} className="font-sans text-base font-medium text-ivory tracking-widest uppercase mb-2 opacity-0">
            Handcrafted with care
          </p>
          <p ref={mobileLine3Ref} className="font-sans text-sm text-ivory/45 leading-relaxed mb-1 opacity-0">
            Every piece tells a story.
          </p>
          <p ref={mobileLine4Ref} className="font-sans text-sm text-ivory/45 leading-relaxed mb-1 opacity-0">
            Shaped by hand, polished with intention, made for your home.
          </p>
          <p ref={mobileLine5Ref} className="font-sans text-sm text-ivory/45 leading-relaxed mb-1 opacity-0">
            No two pieces are the same.
          </p>
          <p ref={mobileLine6Ref} className="font-sans text-sm text-ivory/45 leading-relaxed opacity-0">
            Crafted to be passed down, not used up.
          </p>
        </div>
        <div
          ref={mobileBottomTextRef}
          className="md:hidden absolute left-0 right-0 z-10 px-5 opacity-0"
        >
          <Link
            href="/shop"
            className="font-sans text-lg font-medium text-primary tracking-wide hover:text-primary/80 transition-colors"
          >
            Shop the Collection →
          </Link>
        </div>

        {/* Scroll hint — desktop only */}
        <div
          ref={scrollHintRef}
          className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        >
          <svg className="w-5 h-5 text-white/40 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
