import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'promo' | 'attention' | 'success' | 'critical' | 'neutral';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'promo',
  children,
  className = '',
  ...props
}) => {
  // Pill rounded-full, 4px 10px padding per DESIGN-meta.md
  const baseClasses = 'inline-flex items-center gap-1 font-bold text-xs rounded-full px-2.5 py-1 tracking-tight select-none';

  const variantClasses = {
    promo: 'bg-warning text-ink-deep',
    attention: 'bg-attention text-canvas',
    success: 'bg-success text-canvas',
    critical: 'bg-critical text-canvas',
    neutral: 'bg-surface-soft text-steel border border-hairline-soft',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
