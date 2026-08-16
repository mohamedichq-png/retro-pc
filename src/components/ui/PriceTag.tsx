// RETRO Qatar — PriceTag Component

'use client';

import React from 'react';

interface PriceTagProps {
  price?: number | null;
  originalPrice?: number | null;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isPriceOnDemand?: boolean;
  locale?: string;
}

export function PriceTag({ 
  price, 
  originalPrice, 
  currency = 'QAR', 
  size = 'md', 
  className = '', 
  isPriceOnDemand = false,
  locale = 'ar'
}: PriceTagProps) {
  const isRtl = locale === 'ar';
  
  if (isPriceOnDemand || price === null || price === undefined || price <= 0) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <span className="text-xs sm:text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
          {isRtl ? 'تواصل معنا لمعرفة السعر' : 'Contact us for price'}
        </span>
      </div>
    );
  }

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const sizeClasses = {
    sm: { price: 'text-sm', original: 'text-[10px]', badge: 'text-[9px] px-1.5 py-0.5' },
    md: { price: 'text-base', original: 'text-xs', badge: 'text-[10px] px-2 py-0.5' },
    lg: { price: 'text-xl', original: 'text-sm', badge: 'text-xs px-2.5 py-1' },
    xl: { price: 'text-2xl sm:text-3xl', original: 'text-base', badge: 'text-xs px-3 py-1' },
  };

  const s = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className={`${s.price} font-extrabold text-retro-cyan`}>
        {price.toLocaleString('en-US')} {currency}
      </span>
      {hasDiscount && (
        <>
          <span className={`${s.original} text-retro-text-dim line-through`}>
            {originalPrice.toLocaleString('en-US')}
          </span>
          <span className={`${s.badge} rounded-md bg-retro-red/15 text-retro-red font-bold`}>
            -{discountPercent}%
          </span>
        </>
      )}
    </div>
  );
}
