import { ReactNode } from 'react';
import Button from './Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="flex justify-center mb-6">
          {icon}
        </div>
      )}
      <h3 className="type-h4 text-ivory mb-2">
        {title}
      </h3>
      <p className="text-ivory/55 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {actionLabel && (actionHref || onAction) && (
        <Button
          href={actionHref}
          onClick={onAction}
          size="lg"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// Predefined empty states for common scenarios
export function EmptyCart() {
  return (
    <EmptyState
      icon={
        <svg
          className="w-24 h-24 text-ivory/35"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      }
      title="Your cart is empty"
      description="Looks like you haven't added any pieces yet. Browse our collection to find something special."
      actionLabel="Browse Collection"
      actionHref="/shop"
    />
  );
}

export function EmptySearch() {
  return (
    <EmptyState
      icon={
        <svg
          className="w-24 h-24 text-ivory/35"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title="No results found"
      description="We couldn't find any products matching your search. Try adjusting your filters or search terms."
    />
  );
}

export function EmptyProducts() {
  return (
    <EmptyState
      icon={
        <svg
          className="w-24 h-24 text-ivory/35"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      }
      title="No products yet"
      description="We're currently adding our silver collection. Check back soon or contact us to inquire about custom pieces."
      actionLabel="Contact Us"
      actionHref="/contact"
    />
  );
}

export function EmptyFavorites() {
  return (
    <EmptyState
      icon={
        <svg
          className="w-24 h-24 text-ivory/35"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      }
      title="No favorites yet"
      description="Start adding pieces to your favorites to keep track of the ones you love."
      actionLabel="Browse Collection"
      actionHref="/shop"
    />
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-24 h-24 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
      title="Something went wrong"
      description={message || "We encountered an error. Please try again."}
      actionLabel={onRetry ? "Try Again" : undefined}
      onAction={onRetry}
    />
  );
}
