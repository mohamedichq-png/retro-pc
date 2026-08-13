// RETRO Qatar — Product Grid Component

'use client';

import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import type { Product } from '@/types';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface ProductGridProps {
  products: Product[];
  dict: Dictionary;
  locale: Locale;
  loading?: boolean;
}

export function ProductGrid({ products, dict, locale, loading = false }: ProductGridProps) {
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-retro-border bg-retro-bg-card">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-retro-text-muted mb-4">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3 className="text-lg font-bold text-retro-text mb-2">{dict.filter.noProducts}</h3>
        <p className="text-sm text-retro-text-secondary max-w-md">
          {locale === 'ar' 
            ? 'حاول تغيير معايير البحث أو إزالة بعض الفلاتر للعثور على ما تبحث عنه.' 
            : 'Try changing your search criteria or removing some filters to find what you are looking for.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          dict={dict} 
          locale={locale} 
        />
      ))}
    </div>
  );
}
