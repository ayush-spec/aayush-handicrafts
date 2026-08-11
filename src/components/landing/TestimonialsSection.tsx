'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Testimonial } from '@/types/sanity';
import { StarRating } from '@/components/ui/StarRating';

function ScrollingText({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;
    setNeedsScroll(textEl.scrollHeight > container.clientHeight);
  }, [text]);

  return (
    <div
      ref={containerRef}
      className="mt-1 max-h-[3.6em] overflow-hidden relative"
    >
      <p
        ref={textRef}
        className={`text-[13px] text-ivory/55 leading-snug ${
          needsScroll ? 'animate-[scroll-up_6s_ease-in-out_infinite_alternate]' : ''
        }`}
        style={needsScroll ? { animationDelay: '2s' } : undefined}
      >
        &ldquo;{text}&rdquo;
      </p>
    </div>
  );
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-secondary py-3 md:py-4">
      <div className="px-4 md:px-6 lg:px-12">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide md:grid md:grid-cols-3 md:gap-4 md:overflow-visible">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="flex-shrink-0 w-[260px] md:w-auto border-l-2 border-primary/20 pl-3 py-1"
            >
              <StarRating rating={testimonial.rating} size="sm" />
              <ScrollingText text={testimonial.testimonialText} />
              <div className="flex items-center gap-1 mt-2">
                <span className="text-[11px] font-medium text-ivory">
                  {testimonial.customerName}
                </span>
                {testimonial.productReference && (
                  <>
                    <span className="text-gray-300">&middot;</span>
                    <Link
                      href={`/shop/${testimonial.productReference.slug.current}`}
                      className="text-[10px] text-primary/50 hover:text-primary transition-colors"
                    >
                      {testimonial.productReference.title}
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
