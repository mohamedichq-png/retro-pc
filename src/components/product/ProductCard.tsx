// RETRO Qatar — Unified Product Card Component
// Standardized equal-height product card with skeleton loading, key specs, condition badges, and quick actions

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

import { BUSINESS_INFO } from '@/lib/constants';

interface ProductCardProps {
  product: Product;
  dict: Dictionary;
  locale: Locale;
}

export function ProductCard({ product, dict, locale }: ProductCardProps) {
  const isRtl = locale === 'ar';
  const name = isRtl ? product.nameAr : product.nameEn;
  const secondaryName = isRtl ? product.nameEn : product.nameAr;
  const href = `/${locale}/product/${product.slug || product.id}`;
  
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const { addItem } = useCartStore();
  const { items: wishlistItems, toggle: toggleWishlist } = useWishlistStore();
  const { items: compareItems, toggle: toggleCompare } = useCompareStore();
  const { showToast } = useUIStore();

  const isWishlisted = wishlistItems.includes(product.id);
  const isCompared = compareItems.some(p => p.id === product.id);
  const isOutOfStock = product.stockQty <= 0;
  const isPriceOnDemand = Boolean(product.priceOnDemand || !product.sellingPrice || product.sellingPrice <= 0);

  // WhatsApp direct link for on-demand inquiry
  const whatsappUrl = React.useMemo(() => {
    const msg = isRtl
      ? `مرحباً Retro Qatar، أود الاستفسار عن سعر هذا المنتج:\nالاسم: ${product.nameAr}\nSKU: ${product.sku}`
      : `Hello RETRO Qatar, I would like to inquire about the price of:\nName: ${product.nameEn}\nSKU: ${product.sku}`;
    return `https://wa.me/${BUSINESS_INFO.salesWhatsApp}?text=${encodeURIComponent(msg)}`;
  }, [product.nameAr, product.nameEn, product.sku, isRtl]);

  // Discount percentage calculation
  const hasSale = !isPriceOnDemand && product.salePrice && product.salePrice < product.sellingPrice;
  const discountPercent = hasSale 
    ? Math.round(((product.sellingPrice - product.salePrice!) / product.sellingPrice) * 100) 
    : 0;

  // Extract 2-3 key specs cleanly
  const keySpecs = React.useMemo(() => {
    const specsList: string[] = [];

    if (product.region && product.region !== 'Not visible') {
      specsList.push(`${product.region}`);
    }
    if (product.packaging) {
      specsList.push(isRtl ? (product.packagingAr || product.packaging) : product.packaging);
    }
    if (product.storage) {
      specsList.push(isRtl ? (product.storageAr || product.storage) : product.storage);
    }

    if (specsList.length === 0 && product.specs) {
      if (product.specs.gpu || product.specs.GPU) specsList.push(String(product.specs.gpu || product.specs.GPU));
      if (product.specs.cpu || product.specs.CPU) specsList.push(String(product.specs.cpu || product.specs.CPU));
      if (product.specs.storage || product.specs.Storage) specsList.push(String(product.specs.storage || product.specs.Storage));
    }

    return specsList.slice(0, 3);
  }, [product, isRtl]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock || isPriceOnDemand) return;
    addItem(product, 1);
    showToast(isRtl ? `تمت إضافة ${name} إلى السلة!` : `Added ${name} to cart!`, 'success');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
    const isNowAdded = !isWishlisted;
    showToast(
      isNowAdded
        ? (isRtl ? `تمت إضافة ${name} للمفضلة ❤️` : `Added ${name} to wishlist ❤️`)
        : (isRtl ? `تمت إزالة ${name} من المفضلة` : `Removed ${name} from wishlist`),
      'info'
    );
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleCompare(product);
    const isNowCompared = !isCompared;
    showToast(
      isNowCompared
        ? (isRtl ? `تمت إضافة ${name} للمقارنة` : `Added ${name} to compare`)
        : (isRtl ? `تمت إزالة ${name} من المقارنة` : `Removed ${name} from compare`),
      'info'
    );
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const isSpecialOrLimited = product.edition && (
    product.edition.toLowerCase().includes('limited') || 
    product.edition.toLowerCase().includes('special') || 
    product.edition.toLowerCase().includes('collector')
  );

  return (
    <Link 
      href={href}
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-retro-border bg-retro-bg-card/85 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-retro-cyan/40 hover:shadow-[0_8px_30px_rgba(34,211,238,0.15)] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Image & Badges ── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-retro-bg-input p-2 flex items-center justify-center">
        
        {/* Skeleton shimmer before image loads */}
        {!imageLoaded && (
          <div className="absolute inset-2 skeleton rounded-xl" />
        )}

        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`h-full w-full object-contain object-center rounded-xl transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-retro-text-dim">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10 pointer-events-none">
          <div className="flex flex-col gap-1.5 pointer-events-auto">
            {hasSale && (
              <span className="inline-flex items-center rounded-lg bg-retro-pink text-white text-[10px] font-black px-2 py-0.5 shadow-md shadow-retro-pink/30">
                -{discountPercent}%
              </span>
            )}
            {isSpecialOrLimited && (
              <span className="inline-flex items-center rounded-lg bg-amber-500/90 text-retro-bg text-[9.5px] font-black px-2 py-0.5 shadow-md">
                {product.edition?.includes('Collector') ? 'Collector’s' : 'Limited Edition'}
              </span>
            )}
            <StockBadge qty={product.stockQty} />
          </div>
          
          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="rounded-full bg-retro-bg-card/90 border border-retro-border p-2 text-retro-text-muted hover:text-retro-pink backdrop-blur-md transition-all cursor-pointer pointer-events-auto hover:scale-110 shadow-md"
            title={dict.nav.wishlist}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" className={isWishlisted ? "text-retro-pink fill-retro-pink" : ""}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Hover Quick View / Compare Actions Overlay */}
        <div className={`absolute inset-0 bg-retro-bg/60 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center gap-2.5 z-20 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsQuickViewOpen(true);
            }}
            className="rounded-xl bg-retro-bg-card border border-retro-cyan/30 p-2.5 text-retro-cyan hover:bg-retro-cyan hover:text-retro-bg hover:shadow-lg hover:shadow-retro-cyan/20 transition-all transform hover:scale-105 cursor-pointer font-bold text-xs flex items-center gap-1.5"
            title={dict.product?.quickView || 'Quick View'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            <span className="text-[11px]">{dict.product?.quickView || 'Quick View'}</span>
          </button>
          
          <button
            onClick={handleToggleCompare}
            className={`rounded-xl p-2.5 transition-all transform hover:scale-105 cursor-pointer text-xs flex items-center gap-1 border ${isCompared ? 'bg-retro-cyan/20 text-retro-cyan border-retro-cyan/60' : 'bg-retro-bg-card text-retro-text-secondary hover:text-retro-cyan border-retro-border'}`}
            title={dict.nav.compare || 'Compare'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 justify-between">
        <div>
          {/* Brand & SKU / Condition */}
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-retro-cyan bg-retro-cyan/10 px-2 py-0.5 rounded-md border border-retro-cyan/20 truncate max-w-[120px]">
              {product.brand}
            </span>
            <span className="text-[10px] font-mono text-retro-text-dim">
              {product.sku}
            </span>
          </div>
          
          {/* Titles: Line 1 Arabic, Line 2 English */}
          <div className="mb-2.5 min-h-[44px]">
            <h3 className="text-xs sm:text-sm font-bold text-retro-text line-clamp-1 group-hover:text-retro-cyan transition-colors" dir="rtl">
              {product.nameAr}
            </h3>
            <p className="text-[11px] text-retro-text-muted line-clamp-1 mt-0.5 font-medium" dir="ltr">
              {product.nameEn}
            </p>
          </div>
          
          {/* Key Specs / Badges */}
          {keySpecs.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {keySpecs.map((spec, i) => (
                <span 
                  key={i} 
                  className="text-[9.5px] font-medium text-retro-text-muted bg-retro-bg-elevated border border-retro-border px-2 py-0.5 rounded-md line-clamp-1"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-retro-border flex items-center justify-between gap-2">
          <PriceTag 
            price={isPriceOnDemand ? null : (product.salePrice ?? product.sellingPrice)} 
            originalPrice={isPriceOnDemand ? null : (product.salePrice ? product.sellingPrice : undefined)} 
            isPriceOnDemand={isPriceOnDemand}
            locale={locale}
            size="sm" 
          />

          <div className="flex items-center gap-1.5 shrink-0">
            {isPriceOnDemand ? (
              <button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 px-2.5 py-1.5 text-[11px] font-bold transition-all shadow-sm cursor-pointer"
                title={isRtl ? 'استفسار واتساب' : 'WhatsApp Inquiry'}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                <span>{isRtl ? 'استفسار' : 'Inquire'}</span>
              </button>
            ) : (
              <Button 
                size="sm" 
                variant={isOutOfStock ? "ghost" : "primary"}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="shrink-0 text-[11px] px-3 py-1.5 font-black"
              >
                {isOutOfStock ? (dict.product?.outOfStock || 'نفذت') : (dict.product?.addToCart || 'أضف للسلة')}
              </Button>
            )}
          </div>
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

