/**
 * Button Component
 * Reusable button component with DaisyUI styling and variants
 * Supports primary, secondary, accent, and ghost variants
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn';
    const variantClasses = `btn-${variant}`;
    const sizeClasses = `btn-${size}`;
    const widthClasses = fullWidth ? 'btn-block' : '';
    const loadingClasses = loading ? 'loading' : '';

    const combinedClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      widthClasses,
      loadingClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
