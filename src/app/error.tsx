'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console for now; swap for Sentry / similar when monitoring
    // is wired up.
    console.error('App error boundary caught:', error);
  }, [error]);

  return (
    <div className="pt-header">
      <section className="max-w-2xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
        <p className="text-[10px] tracking-widest uppercase text-ivory/35 mb-3">
          Something went wrong
        </p>
        <h1 className="type-h3 text-ivory mb-3">
          We hit an unexpected error
        </h1>
        <p className="text-ivory/45 max-w-md mx-auto mb-2">
          It&apos;s on us, not on you. Try again, and if it keeps happening
          drop us a line.
        </p>
        {error.digest && (
          <p className="text-[11px] text-gray-300 mb-10 font-mono">
            ref: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" size="lg" onClick={() => reset()}>
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
        <p className="mt-10 text-xs text-ivory/35">
          Stuck?{' '}
          <Link
            href="/contact"
            className="text-primary hover:text-primary/80 underline-offset-4 hover:underline"
          >
            Contact us
          </Link>
        </p>
      </section>
    </div>
  );
}
