'use client';

interface KeepExploringSectionProps {
  productCount: number;
}

export default function KeepExploringSection({ productCount }: KeepExploringSectionProps) {
  return (
    <div className="relative py-12 md:py-16 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Main heading */}
          <h2 className="type-h3 text-ivory mb-4">
            Keep Exploring
          </h2>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-ivory/55 mb-2">
            Discover {productCount}+ more handcrafted silver pieces
          </p>

          {/* Decorative element */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="h-px w-12 bg-primary" />
            <div className="w-2 h-2 bg-primary" />
            <div className="h-px w-12 bg-primary" />
          </div>

          {/* Mobile instruction */}
          <p className="text-sm text-ivory/45 mt-6 md:hidden">
            Swipe up to browse products
          </p>
        </div>
      </div>
    </div>
  );
}
