/**
 * Input Component
 * Reusable input component with DaisyUI styling
 * Supports different variants and sizes
 */

import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'bordered';
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'bordered',
      inputSize = 'md',
      fullWidth = false,
      error = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'input';
    const variantClasses = variant !== 'bordered' ? `input-${variant}` : 'input-bordered';
    const sizeClasses = `input-${inputSize}`;
    const widthClasses = fullWidth ? 'w-full' : '';
    const errorClasses = error ? 'input-error' : '';

    const combinedClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      widthClasses,
      errorClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return <input ref={ref} className={combinedClasses} {...props} />;
  }
);

Input.displayName = 'Input';
