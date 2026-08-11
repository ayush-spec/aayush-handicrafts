import { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      hover = false,
      padding = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'bg-secondary rounded-sm border border-ivory/10';

    const hoverStyles = hover
      ? 'transition-colors duration-200 hover:border-primary/20'
      : '';

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const classes = `
      ${baseStyles}
      ${hoverStyles}
      ${paddings[padding]}
      ${className}
    `.trim();

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components for better composition
export const CardHeader = ({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={`type-h6 text-ivory ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-ivory/55 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mt-4 pt-4 border-t border-ivory/10 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
