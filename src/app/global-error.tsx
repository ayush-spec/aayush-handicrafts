'use client';

import { useEffect } from 'react';

/**
 * Catches errors thrown in the root layout itself. Must render its own
 * <html> + <body> because the parent layout is what crashed — none of
 * the providers (fonts, smooth scroll, toast, header, footer) are
 * available here. Keep this minimal and self-contained.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: '#F4F6F8',
          color: '#1f2937',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '480px' }}>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#9ca3af',
              marginBottom: '8px',
            }}
          >
            Aayush Handicrafts
          </p>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 600,
              marginTop: 0,
              marginBottom: '12px',
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              color: '#6b7280',
              fontSize: '15px',
              lineHeight: 1.5,
              marginBottom: error.digest ? '8px' : '32px',
            }}
          >
            We&apos;ve been notified. Please try again in a moment.
          </p>
          {error.digest && (
            <p
              style={{
                color: '#d1d5db',
                fontSize: '11px',
                fontFamily: 'monospace',
                marginBottom: '32px',
              }}
            >
              ref: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              backgroundColor: '#1F3A5F',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              fontSize: '12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 600,
              cursor: 'pointer',
              borderRadius: '2px',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
