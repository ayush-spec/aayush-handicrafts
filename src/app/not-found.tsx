import Link from 'next/link';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="pt-header">
      <section className="max-w-2xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
        <p className="type-h1 text-primary leading-none mb-6">404</p>
        <h1 className="type-h3 text-ivory mb-3">
          We couldn&apos;t find that page
        </h1>
        <p className="text-ivory/45 max-w-md mx-auto mb-10">
          It may have been moved, or the link might be broken. Let&apos;s get
          you back to something you can hold.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop">
            <Button variant="primary" size="lg">
              Browse the Shop
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
