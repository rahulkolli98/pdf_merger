/**
 * Badge Component
 * Reusable badge component with DaisyUI styling
 * Supports different variants and sizes
 */

import { HTMLAttributes, forwardRef } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'info' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  outline?: boolean;
  children: React.ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      outline = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'badge';
    const variantClasses = `badge-${variant}`;
    const sizeClasses = `badge-${size}`;
    const outlineClasses = outline ? 'badge-outline' : '';

    const combinedClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      outlineClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={combinedClasses} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
