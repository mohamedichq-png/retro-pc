// RETRO Qatar — QuantitySelector Component

'use client';

import React from 'react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className = '',
}: QuantitySelectorProps) {
  const isSmall = size === 'sm';

  return (
    <div
      className={`
        inline-flex items-center rounded-lg border border-retro-border bg-retro-bg-card overflow-hidden
        ${className}
      `}
    >
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`
          flex items-center justify-center text-retro-text-muted hover:text-retro-cyan
          hover:bg-retro-cyan/5 disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors cursor-pointer
          ${isSmall ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'}
        `}
      >
        −
      </button>
      <span
        className={`
          flex items-center justify-center font-bold text-retro-text
          border-x border-retro-border bg-retro-bg-input
          ${isSmall ? 'w-8 h-7 text-xs' : 'w-10 h-9 text-sm'}
        `}
      >
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`
          flex items-center justify-center text-retro-text-muted hover:text-retro-cyan
          hover:bg-retro-cyan/5 disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors cursor-pointer
          ${isSmall ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'}
        `}
      >
        +
      </button>
    </div>
  );
}
