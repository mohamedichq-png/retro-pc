// RETRO Qatar — Breadcrumb Component

'use client';

import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-xs ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-retro-text-dim rtl:rotate-180">
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
            {isLast || !item.href ? (
              <span className={isLast ? 'text-retro-text font-semibold' : 'text-retro-text-muted'}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-retro-text-muted hover:text-retro-cyan transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
