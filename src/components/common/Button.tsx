import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'marketing' | 'buy' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'marketing',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fb-blue disabled:opacity-50 disabled:cursor-not-allowed select-none';

  // Sizing tokens
  const sizeClasses = {
    sm: 'text-xs px-5 py-2.5 gap-1.5',
    md: 'text-sm px-[30px] py-[14px] gap-2',
    lg: 'text-base px-9 py-4 gap-2.5',
  };

  // Variants according to DESIGN-meta.md
  const variantClasses = {
    marketing: 'bg-ink-button text-on-ink-button hover:bg-charcoal active:bg-charcoal disabled:bg-disabled-text',
    buy: 'bg-primary text-on-primary hover:bg-primary-deep active:bg-primary-deep disabled:bg-disabled-text',
    secondary: 'bg-transparent text-ink-deep border-2 border-ink-deep hover:bg-surface-soft active:bg-hairline-soft',
    ghost: 'bg-transparent text-ink-deep border-2 border-ink-deep/12 hover:border-ink-deep/25 active:bg-surface-soft',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
