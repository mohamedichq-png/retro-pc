// RETRO Qatar — Skeleton Loading Component
// Premium dark-themed loading placeholders

'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle' | 'card' | 'product';
  width?: string | number;
  height?: string | number;
  count?: number;
}

function SkeletonLine({ className = '', width, height }: { className?: string; width?: string | number; height?: string | number }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width || '100%',
        height: typeof height === 'number' ? `${height}px` : height || '16px',
      }}
    />
  );
}

export function Skeleton({ className = '', variant = 'rect', width, height, count = 1 }: SkeletonProps) {
  if (variant === 'circle') {
    const size = width || height || 48;
    return (
      <div
        className={`skeleton rounded-full ${className}`}
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
        }}
      />
    );
  }

  if (variant === 'product') {
    return (
      <div className={`rounded-2xl border border-retro-border bg-retro-bg-card overflow-hidden ${className}`}>
        <div className="skeleton h-48 w-full" />
        <div className="p-4 space-y-3">
          <SkeletonLine height={10} width="40%" />
          <SkeletonLine height={14} width="80%" />
          <SkeletonLine height={12} width="60%" />
          <div className="flex items-center justify-between pt-3 border-t border-retro-border">
            <SkeletonLine height={18} width="30%" />
            <SkeletonLine height={32} width={80} className="rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`rounded-2xl border border-retro-border bg-retro-bg-card p-6 space-y-4 ${className}`}>
        <SkeletonLine height={20} width="60%" />
        <SkeletonLine height={14} width="90%" />
        <SkeletonLine height={14} width="75%" />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLine key={i} width={width} height={height} />
      ))}
    </div>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="product" />
      ))}
    </div>
  );
}
