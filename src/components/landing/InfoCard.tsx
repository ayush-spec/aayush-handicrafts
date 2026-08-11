'use client';

import { ReactNode } from 'react';
import { ShoppingBag } from 'lucide-react';

export interface InfoCardProps {
  variant?: 'standard' | 'quote' | 'cta';
  category?: string;
  title?: string;
  content: string;
  attribution?: string;
  ctaButton?: {
    text: string;
    href: string;
  };
}

export function InfoCard({
  variant = 'standard',
  category,
  title,
  content,
  attribution,
  ctaButton,
}: InfoCardProps) {
  // Different styling based on variant
  const getCardStyles = () => {
    if (variant === 'quote') {
      return {
        container: 'bg-secondary border-t-4 border-accent-green',
        textColor: 'text-ivory/75',
        border: '',
      };
    }

    // Standard or CTA variant
    return {
      container: 'bg-secondary',
      textColor: 'text-ivory',
      border: 'border border-ivory/10',
    };
  };

  const styles = getCardStyles();

  return (
    <article
      className={`${styles.container} ${styles.border} rounded-sm p-8 md:p-10 lg:p-12 max-w-3xl mx-auto transition-colors duration-300`}
    >
      {/* Quote variant */}
      {variant === 'quote' && (
        <blockquote className="relative">
          {/* Decorative opening quote */}
          <span
            className="absolute -top-4 -left-2 text-6xl md:text-7xl font-serif leading-none select-none pointer-events-none text-secondary/30"
            aria-hidden="true"
          >
            &ldquo;
          </span>

          {/* Quote text */}
          <p className={`text-base md:text-lg leading-relaxed font-sans relative z-10 italic ${styles.textColor}`}>
            {content}
          </p>

          {/* Attribution */}
          {attribution && (
            <footer className="mt-6">
              <cite className="text-sm md:text-base font-medium tracking-wide not-italic text-tertiary">
                {attribution}
              </cite>
            </footer>
          )}
        </blockquote>
      )}

      {/* CTA variant */}
      {variant === 'cta' && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="w-8 h-8 text-primary" />
          </div>
          <h3 className="type-h4 mb-3 text-primary">{title}</h3>
          <p className={`text-base md:text-lg leading-relaxed mb-6 ${styles.textColor}`}>{content}</p>
          {ctaButton && (
            <a
              href={ctaButton.href}
              className="inline-block bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2.5 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {ctaButton.text}
            </a>
          )}
        </>
      )}

      {/* Standard variant */}
      {variant === 'standard' && (
        <>
          {category && (
            <span className="inline-block text-xs md:text-sm font-medium uppercase tracking-wider mb-3 px-3 py-1 rounded-sm text-primary bg-primary/10 border border-primary/20">
              {category}
            </span>
          )}
          {title && (
            <h3 className="type-h4 text-ivory mb-4 leading-tight">
              {title}
            </h3>
          )}
          <p className={`text-sm md:text-base lg:text-lg leading-relaxed font-sans ${styles.textColor}`}>
            {content}
          </p>
        </>
      )}
    </article>
  );
}
