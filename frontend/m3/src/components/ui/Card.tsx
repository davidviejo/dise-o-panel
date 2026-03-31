import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card: React.FC<CardProps> = ({ className = '', ...props }) => (
  <div
    className={`rounded-brand-lg border border-border bg-surface-container-lowest p-6 shadow-card ${className}`}
    {...props}
  />
);
