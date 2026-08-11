import { HTMLAttributes } from 'react';

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'tertiary' | 'white' | 'gray';
}

export default function LoadingSpinner({
  size = 'md',
  color = 'tertiary',
  className = '',
  ...props
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colors = {
    primary: 'border-primary',
    tertiary: 'border-tertiary',
    white: 'border-white',
    gray: 'border-gray-400',
  };

  return (
    <div
      className={`inline-block ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <div
        className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full animate-spin`}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Full-page loading overlay
export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-secondary/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-ivory/55 text-lg">{message}</p>
      </div>
    </div>
  );
}

// Inline loading state
export function LoadingInline({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="lg" />
      <p className="ml-4 text-ivory/55">{message}</p>
    </div>
  );
}
