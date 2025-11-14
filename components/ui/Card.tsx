/**
 * Card Component
 * Reusable card component with DaisyUI styling
 * Supports hover effects and custom styling
 */

import { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  bordered?: boolean;
  compact?: boolean;
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { 
      hover = false, 
      bordered = false, 
      compact = false, 
      className = '', 
      children, 
      ...props 
    },
    ref
  ) => {
    const baseClasses = 'card bg-base-100 shadow-lg';
    const hoverClasses = hover ? 'hover:shadow-2xl transition-all duration-300' : '';
    const borderedClasses = bordered ? 'border border-base-300' : '';

    const combinedClasses = [
      baseClasses,
      hoverClasses,
      borderedClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        <div className={`card-body ${compact ? 'p-4' : ''}`}>{children}</div>
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <h3 ref={ref} className={`card-title ${className}`} {...props}>
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';
