// RETRO Qatar — Product Card Component

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge, StockBadge, ConditionBadge } from '@/components/ui/Badge';
import { PriceTag } from '@/components/ui/PriceTag';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useCompareStore } from '@/stores/useCompareStore';
import { useUIStore } from '@/stores/useUIStore';
import { QuickViewModal } from './QuickViewModal';
import type { Product } from '@/types';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface ProductCardProps {
  product: Product;
  dict: Dictionary;
  locale: Locale;
}

export function ProductCard({ product, dict, locale }: ProductCardProps) {
  const isRtl = locale === 'ar';
  const name = isRtl ? product.nameAr : product.nameEn;
  const href = `/${locale}/product/${product.slug || product.id}`;
  
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addItem } = useCartStore();
  const { items: wishlistItems, toggle: toggleWishlist } = useWishlistStore();
  const { items: compareItems, toggle: toggleCompare } = useCompareStore();
  const { showToast } = useUIStore();

  const isWishlisted = wishlistItems.includes(product.id);
  const isCompared = compareItems.some(p => p.id === product.id);
  const isOutOfStock = product.stockQty <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem(product, 1);
    showToast(dict.product.addedToCart, 'success');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
    if (!isWishlisted) {
      showToast(dict.product.addedToCart.replace('Cart', 'Wishlist'), 'info');
    }
  };

  return (
    <Link 
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-retro-border bg-retro-bg-card transition-all duration-300 hover:-translate-y-1 hover:border-retro-cyan/30 hover:shadow-[0_8px_30px_rgba(34,211,238,0.1)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Image & Badges ── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-retro-bg-input">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-retro-text-dim">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <div className="flex flex-col gap-1.5">
            {product.isFeatured && <Badge variant="purple">{dict.common.hot}</Badge>}
            <StockBadge qty={product.stockQty} />
          </div>
          
          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="rounded-full bg-retro-bg-card/80 p-2 text-retro-text-muted hover:text-retro-pink backdrop-blur-md transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={isWishlisted ? "text-retro-pink" : ""}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Hover Overlay Actions */}
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center gap-3 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsQuickViewOpen(true);
            }}
            className="rounded-full bg-retro-bg-card/90 p-3 text-retro-text hover:text-retro-cyan hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all transform hover:scale-110"
            title={dict.product.quickView || 'Quick View'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(product);
            }}
            className={`rounded-full p-3 transition-all transform hover:scale-110 ${isCompared ? 'bg-retro-cyan/20 text-retro-cyan border border-retro-cyan/50' : 'bg-retro-bg-card/90 text-retro-text hover:text-retro-cyan hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]'}`}
            title={dict.product.compare}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex items-center gap-2">
          <ConditionBadge condition={product.condition} />
          <span className="text-xs font-semibold text-retro-text-muted">{product.brand}</span>
        </div>
        
        <h3 className="mb-2 line-clamp-2 min-h-[40px] text-sm font-bold leading-tight text-retro-text group-hover:text-retro-cyan transition-colors">
          {name}
        </h3>
        
        {/* Specs snippet (if any) */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mb-4 text-xs text-retro-text-secondary line-clamp-1">
            {Object.values(product.specs).slice(0, 2).join(' • ')}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-retro-border flex items-center justify-between gap-2">
          <PriceTag 
            price={product.salePrice ?? product.sellingPrice} 
            originalPrice={product.salePrice ? product.sellingPrice : undefined} 
            size="md" 
          />
          <Button 
            size="sm" 
            variant="primary" 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="shrink-0"
          >
            {isOutOfStock ? dict.product.outOfStock : dict.product.addToCart}
          </Button>
        </div>
      </div>

      <QuickViewModal 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
        product={product}
        dict={dict}
        locale={locale}
      />
    </Link>
  );
}
