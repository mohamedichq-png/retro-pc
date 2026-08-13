// RETRO Qatar — Product Detail Content (Client Component)

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge, StockBadge, ConditionBadge } from '@/components/ui/Badge';
import { PriceTag } from '@/components/ui/PriceTag';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Tabs } from '@/components/ui/Tabs';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useUIStore } from '@/stores/useUIStore';
import type { Product } from '@/types';
import type { Dictionary, Locale } from '@/i18n/dictionaries';
import { MAIN_CATEGORIES } from '@/lib/constants';

interface ProductDetailContentProps {
  dict: Dictionary;
  locale: Locale;
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailContent({ dict, locale, product, relatedProducts }: ProductDetailContentProps) {
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(product.imageUrl || '');
  const [selectedVariation, setSelectedVariation] = useState(product.variations?.[0]);

  const { addItem } = useCartStore();
  const { items: wishlistItems, toggle: toggleWishlist } = useWishlistStore();
  const { showToast } = useUIStore();

  const isRtl = locale === 'ar';
  const name = isRtl ? product.nameAr : product.nameEn;
  const description = isRtl ? (product.descriptionAr || product.descriptionEn) : product.descriptionEn;
  const isWishlisted = wishlistItems.includes(product.id);
  
  const currentStock = selectedVariation ? selectedVariation.stockQty : product.stockQty;
  const isOutOfStock = currentStock <= 0;
  
  const currentPrice = selectedVariation ? (selectedVariation.salePrice ?? selectedVariation.sellingPrice) : (product.salePrice ?? product.sellingPrice);
  const currentOriginalPrice = selectedVariation ? (selectedVariation.salePrice ? selectedVariation.sellingPrice : undefined) : (product.salePrice ? product.sellingPrice : undefined);

  const images = product.galleryUrls ? [product.imageUrl, ...product.galleryUrls].filter(Boolean) : [product.imageUrl].filter(Boolean);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, qty, selectedVariation);
    showToast(dict.product.addedToCart, 'success');
  };

  const catName = MAIN_CATEGORIES.find(c => c.id === product.category);
  const breadcrumbs = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.nav.shop, href: `/${locale}/products` },
    catName && { label: isRtl ? catName.nameAr : catName.nameEn, href: `/${locale}/category/${catName.slugEn}` },
    { label: name },
  ].filter(Boolean) as { label: string; href?: string }[];

  const tabs = [
    { id: 'description', label: dict.product.description },
    { id: 'specs', label: dict.product.specifications },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="bg-retro-bg min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb items={breadcrumbs} className="mb-8" />

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-16">
          {/* ── Image Gallery ── */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-retro-border bg-retro-bg-card flex items-center justify-center">
              {activeImage ? (
                <img src={activeImage} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-retro-text-dim text-4xl">No Image</span>
              )}
              {product.isFeatured && (
                <div className="absolute top-4 ltr:left-4 rtl:right-4 z-10">
                  <Badge variant="purple" size="md">{dict.common.hot}</Badge>
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-retro-cyan' : 'border-retro-border hover:border-retro-cyan/50'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <ConditionBadge condition={product.condition} />
              <StockBadge qty={currentStock} />
              <span className="text-sm font-bold text-retro-text-muted">{product.brand}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-retro-text mb-4 leading-tight">{name}</h1>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-retro-border">
              <PriceTag price={currentPrice} originalPrice={currentOriginalPrice} size="lg" />
            </div>

            {/* Variations */}
            {product.variations && product.variations.length > 0 && (
              <div className="mb-8 space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-retro-text">Options</h4>
                <div className="flex flex-wrap gap-2">
                  {product.variations.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariation(v)}
                      className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                        selectedVariation?.id === v.id 
                          ? 'border-retro-cyan bg-retro-cyan/10 text-retro-cyan' 
                          : 'border-retro-border text-retro-text-secondary hover:border-retro-cyan/50'
                      }`}
                    >
                      {v.edition}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Special Retro parameters info box */}
            {product.productType === 'RETRO PRODUCT' && (
              <div className="mb-6 p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 text-xs text-purple-200 grid grid-cols-2 gap-4">
                {product.specs?.region && (
                  <div>
                    <span className="text-retro-text-dim block mb-0.5">Region Format</span>
                    <span className="font-bold text-white uppercase text-sm">{product.specs.region}</span>
                  </div>
                )}
                {product.specs?.tested && (
                  <div>
                    <span className="text-retro-text-dim block mb-0.5">Tested & Cleaned</span>
                    <span className="font-bold text-emerald-400 text-sm">✓ {product.specs.tested === 'Yes' ? 'Passed' : product.specs.tested}</span>
                  </div>
                )}
                {product.specs?.included && Array.isArray(product.specs.included) && (
                  <div className="col-span-2 border-t border-purple-500/10 pt-3">
                    <span className="text-retro-text-dim block mb-1">Cables & Accessories Included</span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.specs.included.map((item: string) => (
                        <span key={item} className="bg-purple-950/80 border border-purple-800 text-[10px] font-bold px-2 py-0.5 rounded text-purple-300">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mb-8 space-y-4 p-6 rounded-2xl bg-retro-bg-card border border-retro-border">
              <div className="flex items-center gap-4">
                <QuantitySelector value={qty} onChange={setQty} max={Math.min(10, currentStock)} />
                <Button 
                  size="lg" 
                  fullWidth 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
                >
                  {isOutOfStock ? dict.product.outOfStock : dict.product.addToCart}
                </Button>
                <Button
                  size="lg"
                  variant={isWishlisted ? 'secondary' : 'ghost'}
                  onClick={() => {
                    toggleWishlist(product.id);
                    if (!isWishlisted) showToast(dict.product.addedToCart.replace('Cart', 'Wishlist'), 'info');
                  }}
                  className="px-4"
                  title={dict.nav.wishlist}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={isWishlisted ? "text-retro-cyan" : ""}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-retro-text-muted justify-center pt-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                {dict.product.estimatedDelivery}
              </div>
            </div>

            {/* Meta */}
            <div className="space-y-2 text-sm text-retro-text-secondary bg-white/5 rounded-xl p-4">
              <div className="flex justify-between"><span className="text-retro-text-dim">{dict.product.sku}</span><span className="font-mono">{product.sku}</span></div>
              <div className="flex justify-between"><span className="text-retro-text-dim">{dict.product.brand}</span><span className="font-semibold">{product.brand}</span></div>
            </div>
          </div>
        </div>

        {/* ── Tabs (Description & Specs) ── */}
        <div className="mb-16">
          <Tabs tabs={tabs} variant="underline" onChange={setActiveTab} className="mb-6" />
          
          <div className="bg-retro-bg-card border border-retro-border rounded-2xl p-6 sm:p-8">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none text-retro-text-secondary leading-relaxed">
                {description ? (
                  <p className="whitespace-pre-wrap">{description}</p>
                ) : (
                  <p className="italic text-retro-text-dim">No description available.</p>
                )}
              </div>
            )}
            
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                {product.specs && Object.keys(product.specs).length > 0 ? (
                  Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-retro-border/50">
                      <span className="text-retro-text-dim capitalize">{key}</span>
                      <span className="font-medium text-retro-text text-right">{val}</span>
                    </div>
                  ))
                ) : (
                  <p className="italic text-retro-text-dim col-span-full">No specifications available.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-retro-text mb-6 uppercase tracking-wider">{dict.product.relatedProducts}</h2>
            <ProductGrid products={relatedProducts} dict={dict} locale={locale} />
          </div>
        )}
      </div>
    </div>
  );
}
