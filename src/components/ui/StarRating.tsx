import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  className = '',
}: StarRatingProps) {
  // Ensure rating is within bounds
  const normalizedRating = Math.max(0, Math.min(rating, maxRating));

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    const fillPercentage = Math.max(0, Math.min(1, normalizedRating - (i - 1)));

    stars.push(
      <div key={i} className="relative inline-block">
        {/* Empty star (background) */}
        <Star
          className={`${sizeClasses[size]} text-gray-300`}
          fill="currentColor"
          strokeWidth={0}
        />
        {/* Filled star (foreground) */}
        {fillPercentage > 0 && (
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${fillPercentage * 100}%` }}
          >
            <Star
              className={`${sizeClasses[size]} text-tertiary`}
              fill="currentColor"
              strokeWidth={0}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`} role="img" aria-label={`${rating} out of ${maxRating} stars`}>
      <div className="flex gap-0.5">
        {stars}
      </div>
      {showNumber && (
        <span className={`${textSizeClasses[size]} text-ivory/55 font-medium ml-1`}>
          {normalizedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
