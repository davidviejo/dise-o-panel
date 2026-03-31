import React from 'react';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-soft text-primary border border-primary/20',
  success: 'bg-success-soft text-success border border-success/20',
  warning: 'bg-warning-soft text-warning border border-warning/20',
  danger: 'bg-danger-soft text-danger border border-danger/20',
  neutral: 'bg-surface-container text-muted border border-border',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', className = '', ...props }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};
