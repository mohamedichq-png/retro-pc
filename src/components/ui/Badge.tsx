// RETRO Qatar — Badge Component

'use client';

import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'cyan' | 'purple' | 'green' | 'amber' | 'red' | 'pink';
  size?: 'sm' | 'md';
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<string, string> = {
  default: 'bg-retro-bg-elevated border-retro-border text-retro-text-secondary',
  cyan: 'bg-retro-cyan/10 border-retro-cyan/30 text-retro-cyan',
  purple: 'bg-retro-purple/10 border-retro-purple/30 text-retro-purple',
  green: 'bg-retro-green/10 border-retro-green/30 text-retro-green',
  amber: 'bg-retro-amber/10 border-retro-amber/30 text-retro-amber',
  red: 'bg-retro-red/10 border-retro-red/30 text-retro-red',
  pink: 'bg-retro-pink/10 border-retro-pink/30 text-retro-pink',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({ variant = 'default', size = 'sm', pulse = false, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-md border font-bold uppercase tracking-wider
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
}

// Stock-specific badges
export function StockBadge({ qty, threshold = 5 }: { qty: number; threshold?: number }) {
  if (qty === 0) {
    return <Badge variant="red">Out of Stock</Badge>;
  }
  if (qty <= threshold) {
    return <Badge variant="amber" pulse>Low Stock</Badge>;
  }
  return <Badge variant="green">In Stock</Badge>;
}

export function ConditionBadge({ condition }: { condition: 'NEW' | 'USED' | 'REFURBISHED' | 'OPEN BOX' | 'PRE-OWNED' | 'New' | 'Used' | 'Refurbished' }) {
  const cond = condition ? condition.toUpperCase() : 'NEW';
  let variant: 'cyan' | 'purple' | 'default' | 'green' | 'pink' | 'amber' | 'red' = 'default';
  let label = condition;
  
  if (cond === 'NEW') {
    variant = 'cyan';
    label = 'NEW';
  } else if (cond === 'REFURBISHED') {
    variant = 'purple';
    label = 'REFURBISHED';
  } else if (cond === 'OPEN BOX') {
    variant = 'amber';
    label = 'OPEN BOX';
  } else if (cond === 'PRE-OWNED' || cond === 'USED') {
    variant = 'pink';
    label = cond === 'PRE-OWNED' ? 'PRE-OWNED' : 'USED';
  }
  
  return <Badge variant={variant}>{label}</Badge>;
}
