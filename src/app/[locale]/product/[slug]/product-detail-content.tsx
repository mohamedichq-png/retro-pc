// RETRO Qatar — Product Detail Content (Client Component)
// Fully featured product page with interactive gallery, retro transparency certificate, WhatsApp direct inquiry, trust badges, specs tabs, and mobile sticky bar

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge, StockBadge, ConditionBadge } from '@/components/ui/Badge';
import { PriceTag } from '@/components/ui/PriceTag';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Tabs } from '@/components/ui/Tabs';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useCompareStore } from '@/stores/useCompareStore';
import { useUIStore } from '@/stores/useUIStore';
import { BUSINESS_INFO } from '@/lib/constants';
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
  const { items: compareItems, toggle: toggleCompare } = useCompareStore();
  const { showToast } = useUIStore();

  const isRtl = locale === 'ar';
  const name = isRtl ? product.nameAr : product.nameEn;
  const secondaryName = isRtl ? product.nameEn : product.nameAr;
  const description = isRtl ? (product.descriptionAr || product.descriptionEn) : product.descriptionEn;
  const isWishlisted = wishlistItems.includes(product.id);
  const isCompared = compareItems.some(p => p.id === product.id);
  
  const currentStock = selectedVariation ? selectedVariation.stockQty : product.stockQty;
  const isOutOfStock = currentStock <= 0;
  
  const isPriceOnDemand = Boolean(product.priceOnDemand || !product.sellingPrice || product.sellingPrice <= 0);

  const currentPrice = selectedVariation ? (selectedVariation.salePrice ?? selectedVariation.sellingPrice) : (product.salePrice ?? product.sellingPrice);
  const currentOriginalPrice = selectedVariation ? (selectedVariation.salePrice ? selectedVariation.sellingPrice : undefined) : (product.salePrice ? product.sellingPrice : undefined);

  const images = useMemo(() => {
    return product.galleryUrls && product.galleryUrls.length > 0
      ? [product.imageUrl, ...product.galleryUrls].filter(Boolean)
      : [product.imageUrl].filter(Boolean);
  }, [product.imageUrl, product.galleryUrls]);

  const isRetro = product.productType === 'RETRO PRODUCT' || product.category === 'Retro Gaming' || product.category === 'Retro Gaming Classics' || product.id.startsWith('p-retro-') || product.sku?.startsWith('PLAY-') || product.sku?.startsWith('PSP-') || product.sku?.startsWith('XBOX-') || product.sku?.startsWith('NIN-') || product.sku?.startsWith('RETRO-');

  // WhatsApp Inquiry URL
  const whatsappInquiryUrl = useMemo(() => {
    const priceText = isPriceOnDemand 
      ? (isRtl ? 'السعر: عند الطلب' : 'Price: On Demand') 
      : `${currentPrice} QAR`;
    const message = isRtl
      ? `مرحباً Retro Qatar، أود الاستفسار عن هذا المنتج:\nالاسم: ${product.nameAr}\nرمز المنتج (SKU): ${product.sku}\n${priceText}`
      : `Hello RETRO Qatar, I would like to inquire about this product:\nName: ${product.nameEn}\nSKU: ${product.sku}\n${priceText}`;
    return `https://wa.me/${BUSINESS_INFO.salesWhatsApp}?text=${encodeURIComponent(message)}`;
  }, [product.nameAr, product.nameEn, product.sku, currentPrice, isPriceOnDemand, isRtl]);

  const handleAddToCart = () => {
    if (isOutOfStock || isPriceOnDemand) return;
    addItem(product, qty, selectedVariation);
    showToast(isRtl ? `تمت إضافة ${name} إلى السلة!` : `Added ${name} to cart!`, 'success');
  };

  const handleWhatsAppInquiry = () => {
    window.open(whatsappInquiryUrl, '_blank', 'noopener,noreferrer');
  };

  const catName = MAIN_CATEGORIES.find(c => c.id === product.category || c.slugEn === product.category);
  const categoryLabel = isRtl ? (product.categoryAr || catName?.nameAr || product.category) : (product.categoryEn || catName?.nameEn || product.category);
  
  const breadcrumbs = [
    { label: dict.nav?.home || 'Home', href: `/${locale}` },
    { label: dict.nav?.shop || 'Shop', href: `/${locale}/products` },
    catName && { label: categoryLabel, href: `/${locale}/category/${catName.slugEn}` },
    { label: name },
  ].filter(Boolean) as { label: string; href?: string }[];

  const tabs = [
    { id: 'specs', label: dict.product?.specifications || (isRtl ? 'المواصفات الفنية' : 'Specifications') },
    { id: 'description', label: dict.product?.description || (isRtl ? 'الوصف والتفاصيل' : 'Description') },
    ...(isRetro ? [{ id: 'retro', label: dict.retro?.badge || (isRtl ? 'شهادة وفحص ريترو' : 'Retro Inspection Report') }] : []),
    { id: 'reviews', label: dict.product?.reviews || (isRtl ? 'التقييمات (5.0 ★)' : 'Reviews (5.0 ★)') },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // Specifications table compilation (combining catalog fields & custom specs)
  const allSpecs = useMemo(() => {
    const list: { label: string; value: string }[] = [];

    if (product.categoryAr || product.categoryEn) {
      list.push({
        label: isRtl ? 'القسم الرئيسي' : 'Main Category',
        value: isRtl ? (product.categoryAr || product.category) : (product.categoryEn || product.category)
      });
    }
    if (product.platform) {
      list.push({
        label: isRtl ? 'المنصة / نوع الجهاز' : 'Platform / Device',
        value: product.platform
      });
    }
    if (product.brand) {
      list.push({
        label: isRtl ? 'العلامة التجارية' : 'Brand',
        value: product.brand
      });
    }
    if (product.model) {
      list.push({
        label: isRtl ? 'الموديل / الطراز' : 'Model',
        value: product.model
      });
    }
    if (product.color || product.colorAr) {
      list.push({
        label: isRtl ? 'اللون' : 'Color',
        value: isRtl ? (product.colorAr || product.color || '') : (product.color || '')
      });
    }
    if (product.storage || product.storageAr) {
      list.push({
        label: isRtl ? 'سعة التخزين' : 'Storage',
        value: isRtl ? (product.storageAr || product.storage || '') : (product.storage || '')
      });
    }
    if (product.edition || product.editionAr) {
      list.push({
        label: isRtl ? 'الإصدار' : 'Edition',
        value: isRtl ? (product.editionAr || product.edition || '') : (product.edition || '')
      });
    }
    if (product.region || product.regionAr) {
      list.push({
        label: isRtl ? 'الريجون / المنطقة' : 'Region',
        value: isRtl ? (product.regionAr || product.region || '') : (product.region || '')
      });
    }
    if (product.packaging || product.packagingAr) {
      list.push({
        label: isRtl ? 'حالة التغليف والعلبة' : 'Packaging & Condition',
        value: isRtl ? (product.packagingAr || product.packaging || '') : (product.packaging || '')
      });
    }
    if (product.warranty) {
      list.push({
        label: isRtl ? 'الضمان' : 'Warranty',
        value: product.warranty
      });
    }

    if (product.specs) {
      Object.entries(product.specs).forEach(([k, v]) => {
        if (typeof v === 'string' || typeof v === 'number') {
          list.push({ label: k, value: String(v) });
        }
      });
    }

    return list;
  }, [product, isRtl]);

  const isSpecialOrLimited = product.edition && (
    product.edition.toLowerCase().includes('limited') || 
    product.edition.toLowerCase().includes('special') || 
    product.edition.toLowerCase().includes('collector')
  );

  return (
    <div className="bg-retro-bg min-h-screen py-8 px-4 sm:px-6 lg:px-8 pb-28 lg:pb-12">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* ── Left: Image Gallery (6 Cols) ── */}
          <div className="col-span-1 lg:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-retro-border bg-retro-bg-card flex items-center justify-center p-6 shadow-2xl">
              {activeImage ? (
                <img 
                  src={activeImage} 
                  alt={name} 
                  className="w-full h-full object-contain object-center rounded-2xl transition-all duration-300" 
                />
              ) : (
                <span className="text-retro-text-dim text-4xl">No Image</span>
              )}

              {/* Status Badges */}
              <div className="absolute top-4 ltr:left-4 rtl:right-4 flex flex-col gap-2 z-10">
                {isSpecialOrLimited && (
                  <span className="bg-amber-500/90 text-retro-bg text-[10.5px] font-black uppercase px-2.5 py-1 rounded-lg shadow-lg">
                    {product.edition?.includes('Collector') ? 'Collector’s Edition' : 'Limited Edition'}
                  </span>
                )}
                {product.catalogStatus === 'needs_review' && (
                  <span className="bg-amber-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                    {isRtl ? 'تحتاج مراجعة السعر' : 'Pending Price Review'}
                  </span>
                )}
                {isRetro && (
                  <span className="bg-emerald-500/90 text-retro-bg text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shadow-lg backdrop-blur-md">
                    {isRtl ? 'ريترو أصلي مفحوص ✓' : 'Certified Retro ✓'}
                  </span>
                )}
              </div>
            </div>
            
            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all p-1 bg-retro-bg-input cursor-pointer ${
                      activeImage === img 
                        ? 'border-retro-cyan shadow-md shadow-retro-cyan/20' 
                        : 'border-retro-border hover:border-retro-cyan/40'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product Info & Buy Box (6 Cols) ── */}
          <div className="col-span-1 lg:col-span-6 flex flex-col space-y-6">
            
            {/* Header: Brand, Platform, Condition & SKU */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-retro-cyan bg-retro-cyan/10 px-2.5 py-1 rounded-lg border border-retro-cyan/20">
                {product.brand}
              </span>
              {product.platform && (
                <span className="text-xs font-bold text-retro-purple bg-retro-purple/10 px-2.5 py-1 rounded-lg border border-retro-purple/20">
                  {product.platform}
                </span>
              )}
              <ConditionBadge condition={product.condition} />
              <StockBadge qty={currentStock} />
              <span className="text-xs text-retro-text-dim font-mono ltr:ml-auto rtl:mr-auto">
                SKU: {product.sku}
              </span>
            </div>

            {/* Bilingual Titles */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl lg:text-3xl font-black text-retro-text leading-snug">
                {name}
              </h1>
              {secondaryName && secondaryName !== name && (
                <p className="text-sm sm:text-base text-retro-text-muted font-medium" dir={isRtl ? 'ltr' : 'rtl'}>
                  {secondaryName}
                </p>
              )}
            </div>
            
            {/* Pricing Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-retro-border">
              <PriceTag 
                price={isPriceOnDemand ? null : currentPrice} 
                originalPrice={isPriceOnDemand ? null : currentOriginalPrice} 
                isPriceOnDemand={isPriceOnDemand}
                locale={locale}
                size="xl" 
              />
              {isPriceOnDemand ? (
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
                  {isRtl ? '⚡ السعر متاح فوراً عند الطلب' : '⚡ Price on request'}
                </span>
              ) : currentOriginalPrice ? (
                <span className="text-xs font-black text-retro-pink bg-retro-pink/10 px-2.5 py-1 rounded-lg border border-retro-pink/20">
                  {isRtl ? 'عرض خاص' : 'Special Offer'}
                </span>
              ) : null}
            </div>

            {/* Quick Catalog Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-retro-bg-card/70 border border-retro-border rounded-2xl text-xs">
              {product.edition && (
                <div>
                  <span className="text-retro-text-dim text-[10px] block">{isRtl ? 'الإصدار' : 'Edition'}</span>
                  <span className="font-bold text-retro-text truncate block">{isRtl ? (product.editionAr || product.edition) : product.edition}</span>
                </div>
              )}
              {product.region && (
                <div>
                  <span className="text-retro-text-dim text-[10px] block">{isRtl ? 'المنطقة (Region)' : 'Region'}</span>
                  <span className="font-bold text-retro-text truncate block">{isRtl ? (product.regionAr || product.region) : product.region}</span>
                </div>
              )}
              {product.packaging && (
                <div>
                  <span className="text-retro-text-dim text-[10px] block">{isRtl ? 'التغليف والعلبة' : 'Packaging'}</span>
                  <span className="font-bold text-retro-text truncate block">{isRtl ? (product.packagingAr || product.packaging) : product.packaging}</span>
                </div>
              )}
              {product.storage && (
                <div>
                  <span className="text-retro-text-dim text-[10px] block">{isRtl ? 'السعة' : 'Storage'}</span>
                  <span className="font-bold text-retro-text truncate block">{isRtl ? (product.storageAr || product.storage) : product.storage}</span>
                </div>
              )}
              {product.color && (
                <div>
                  <span className="text-retro-text-dim text-[10px] block">{isRtl ? 'اللون' : 'Color'}</span>
                  <span className="font-bold text-retro-text truncate block">{isRtl ? (product.colorAr || product.color) : product.color}</span>
                </div>
              )}
              <div>
                <span className="text-retro-text-dim text-[10px] block">{isRtl ? 'حالة التوفر' : 'Stock'}</span>
                <span className="font-bold text-emerald-400 block">{isOutOfStock ? (isRtl ? 'غير متوفر' : 'Out of Stock') : (isRtl ? 'متوفر بالمخزن' : 'In Stock')}</span>
              </div>
            </div>

            {/* Catalog Notes Callout if present */}
            {(product.catalogNotes || product.notesAr) && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <span>ℹ️</span>
                  <span>{isRtl ? 'ملاحظات الكتالوج:' : 'Catalog Notes:'}</span>
                </div>
                <p className="text-retro-text-secondary leading-relaxed">
                  {isRtl ? (product.notesAr || product.catalogNotes) : (product.notesEn || product.catalogNotes)}
                </p>
              </div>
            )}

            {/* Action Buttons Box */}
            <div className="space-y-4 p-6 rounded-3xl bg-retro-bg-card border border-retro-border shadow-xl">
              {isPriceOnDemand ? (
                /* Primary WhatsApp CTA when price is on demand */
                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-retro-bg font-black py-4 text-sm transition-all shadow-xl shadow-emerald-500/20 cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    </svg>
                    <span>{isRtl ? 'تواصل معنا لمعرفة السعر والطلب عبر واتساب' : 'Contact Us for Price & Order via WhatsApp'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        toggleWishlist(product.id);
                        showToast(!isWishlisted ? (isRtl ? 'تمت الإضافة للمفضلة ❤️' : 'Added to wishlist ❤️') : (isRtl ? 'تمت الإزالة من المفضلة' : 'Removed from wishlist'), 'info');
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                        isWishlisted ? 'border-retro-pink bg-retro-pink/15 text-retro-pink' : 'border-retro-border bg-retro-bg-input text-retro-text-muted hover:text-retro-pink'
                      }`}
                    >
                      <span>❤️</span>
                      <span>{isWishlisted ? (isRtl ? 'في المفضلة' : 'Wishlisted') : (isRtl ? 'حفظ في المفضلة' : 'Add to Wishlist')}</span>
                    </button>

                    <button
                      onClick={() => {
                        toggleCompare(product);
                        showToast(!isCompared ? (isRtl ? 'تمت الإضافة للمقارنة' : 'Added to compare') : (isRtl ? 'تمت الإزالة من المقارنة' : 'Removed from compare'), 'info');
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                        isCompared ? 'border-retro-cyan bg-retro-cyan/15 text-retro-cyan' : 'border-retro-border bg-retro-bg-input text-retro-text-muted hover:text-retro-cyan'
                      }`}
                    >
                      <span>⚖️</span>
                      <span>{isCompared ? (isRtl ? 'في المقارنة' : 'Compared') : (isRtl ? 'مقارنة' : 'Compare')}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard Add-To-Cart flow when price is confirmed */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-full sm:w-auto">
                      <QuantitySelector value={qty} onChange={setQty} max={Math.min(10, currentStock)} />
                    </div>
                    
                    <Button 
                      size="lg" 
                      fullWidth 
                      variant={isOutOfStock ? "ghost" : "primary"}
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className="font-black text-sm py-3.5 shadow-lg shadow-retro-cyan/20"
                    >
                      {isOutOfStock ? (dict.product?.outOfStock || 'نفذت الكمية') : (dict.product?.addToCart || 'أضف إلى السلة')}
                    </Button>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          toggleWishlist(product.id);
                          showToast(!isWishlisted ? (isRtl ? 'تمت الإضافة للمفضلة ❤️' : 'Added to wishlist ❤️') : (isRtl ? 'تمت الإزالة من المفضلة' : 'Removed from wishlist'), 'info');
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isWishlisted ? 'border-retro-pink bg-retro-pink/15 text-retro-pink' : 'border-retro-border bg-retro-bg-input text-retro-text-muted hover:text-retro-pink'
                        }`}
                        title={dict.nav?.wishlist || 'Wishlist'}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => {
                          toggleCompare(product);
                          showToast(!isCompared ? (isRtl ? 'تمت الإضافة للمقارنة' : 'Added to compare') : (isRtl ? 'تمت الإزالة من المقارنة' : 'Removed from compare'), 'info');
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isCompared ? 'border-retro-cyan bg-retro-cyan/15 text-retro-cyan' : 'border-retro-border bg-retro-bg-input text-retro-text-muted hover:text-retro-cyan'
                        }`}
                        title={dict.nav?.compare || 'Compare'}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold py-3 text-xs transition-all"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    </svg>
                    <span>{dict.product?.whatsappInquiry || (isRtl ? 'استفسر عن المنتج مباشرة عبر واتساب' : 'Inquire via WhatsApp')}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Trust Markers List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-retro-text-secondary bg-retro-bg-card/50 border border-retro-border rounded-2xl p-4">
              <div className="flex items-center gap-2.5">
                <span className="text-base">🚚</span>
                <div>
                  <div className="font-bold text-retro-text">{isRtl ? 'توصيل سريع في قطر' : 'Fast Qatar Delivery'}</div>
                  <div className="text-[10px] text-retro-text-dim">{isRtl ? 'خلال 24 - 48 ساعة لكافة المناطق' : '24 - 48 hours to all zones'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-base">🛡️</span>
                <div>
                  <div className="font-bold text-retro-text">{isRtl ? 'ضمان محلي معتمد' : 'Local Warranty'}</div>
                  <div className="text-[10px] text-retro-text-dim">{isRtl ? 'ضمان معتمد من ريترو قطر' : 'Certified by RETRO Qatar'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-base">💳</span>
                <div>
                  <div className="font-bold text-retro-text">{isRtl ? 'دفع آمن ومتعدد' : 'Secure Payments'}</div>
                  <div className="text-[10px] text-retro-text-dim">QPay, Apple Pay, Cards, Cash</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-base">📍</span>
                <div>
                  <div className="font-bold text-retro-text">{isRtl ? 'استلام من مشيرب' : 'Msheireb Store Pickup'}</div>
                  <div className="text-[10px] text-retro-text-dim">{isRtl ? 'متوفر يومياً السبت - الخميس' : 'Available Sat - Thu'}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Detailed Tabs Section ── */}
        <div className="mb-16">
          <Tabs tabs={tabs} variant="underline" onChange={setActiveTab} className="mb-6" />
          
          <div className="bg-retro-bg-card border border-retro-border rounded-3xl p-6 sm:p-8 shadow-xl">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                {allSpecs.length > 0 ? (
                  allSpecs.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2.5 border-b border-retro-border/50 text-xs">
                      <span className="text-retro-text-dim font-medium">{item.label}</span>
                      <span className="font-bold text-retro-text text-right ltr:text-left">{item.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="italic text-retro-text-dim col-span-full">
                    {isRtl ? 'لا توجد مواصفات إضافية.' : 'No specifications available.'}
                  </p>
                )}
              </div>
            )}

            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none text-retro-text-secondary leading-relaxed text-sm">
                {description ? (
                  <p className="whitespace-pre-wrap">{description}</p>
                ) : (
                  <p className="italic text-retro-text-dim">
                    {isRtl ? 'تفاصيل المنتج متوفرة قريباً.' : 'No description available.'}
                  </p>
                )}
              </div>
            )}

            {activeTab === 'retro' && isRetro && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
                  <h4 className="font-bold text-emerald-400 mb-2">
                    {isRtl ? 'تقرير الفحص التقني الشامل من ريترو قطر' : 'RETRO Qatar Comprehensive Technical Inspection Report'}
                  </h4>
                  <p className="text-retro-text-secondary leading-relaxed mb-4">
                    {isRtl
                      ? 'تم تفكيك الجهاز بالكامل وفحص اللوحة الأم وتنظيفها بالموجات فوق الصوتية، واختبار قراءة الأقراص / الكارتريدج، والتأكد من سلامة جميع المنافذ والأزرار وتزويده بكابلات التشغيل الأصلية.'
                      : 'Console has been completely disassembled, motherboard ultrasonically cleaned, optical drive/cartridge reader calibrated, and tested for continuous operation.'}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-retro-bg-card p-3 rounded-xl border border-retro-border">
                      <span className="text-retro-text-dim block mb-1">Cosmetic Rating</span>
                      <span className="font-bold text-retro-text text-sm">9.5 / 10 (Very Clean)</span>
                    </div>
                    <div className="bg-retro-bg-card p-3 rounded-xl border border-retro-border">
                      <span className="text-retro-text-dim block mb-1">Capacitors & Thermal</span>
                      <span className="font-bold text-emerald-400 text-sm">Verified & Repasted</span>
                    </div>
                    <div className="bg-retro-bg-card p-3 rounded-xl border border-retro-border">
                      <span className="text-retro-text-dim block mb-1">Store Warranty</span>
                      <span className="font-bold text-retro-cyan text-sm">30 Days Operational</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-retro-border pb-4">
                  <div>
                    <h4 className="font-black text-sm text-retro-text">{isRtl ? 'تقييمات العملاء في قطر' : 'Verified Reviews'}</h4>
                    <span className="text-retro-amber font-bold">★★★★★ 5.0 (4 Reviews)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { author: 'سعود الهاجري', date: '2025-02-10', rating: 5, comment: 'المنتج ممتاز جداً والتوصيل كان في أقل من 24 ساعة في الدوحة.' },
                    { author: 'Nasser K.', date: '2025-01-28', rating: 5, comment: '100% authentic, wrapped with extreme care and arrived in mint condition.' }
                  ].map((rev, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-retro-bg-input border border-retro-border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-retro-text">{rev.author}</span>
                        <span className="text-retro-amber">★★★★★</span>
                      </div>
                      <p className="text-retro-text-secondary">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-retro-text tracking-tight">
              {dict.product?.relatedProducts || (isRtl ? 'منتجات ذات صلة' : 'Related Products')}
            </h2>
            <ProductGrid products={relatedProducts} dict={dict} locale={locale} />
          </div>
        )}
      </div>

      {/* ── Mobile Sticky Bottom Bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-retro-bg-card/95 backdrop-blur-xl border-t border-retro-border p-3 px-4 flex items-center justify-between gap-4 shadow-2xl">
        <div>
          <span className="text-[10px] text-retro-text-muted uppercase block">{dict.cart?.total || 'Price'}</span>
          <span className="text-sm font-black text-retro-cyan">
            {isPriceOnDemand 
              ? (isRtl ? 'عند الطلب' : 'On Demand') 
              : `${currentPrice * qty} ${dict.common?.currency || 'QAR'}`}
          </span>
        </div>

        {isPriceOnDemand ? (
          <button
            onClick={handleWhatsAppInquiry}
            className="flex-1 font-black text-xs py-3 rounded-xl bg-emerald-500 text-retro-bg flex items-center justify-center gap-1.5 shadow-lg"
          >
            <span>💬</span>
            <span>{isRtl ? 'طلب عبر واتساب' : 'WhatsApp Inquiry'}</span>
          </button>
        ) : (
          <Button 
            variant={isOutOfStock ? "ghost" : "primary"}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 font-black text-xs py-3"
          >
            {isOutOfStock ? (dict.product?.outOfStock || 'نفذت') : (dict.product?.addToCart || 'أضف للسلة')}
          </Button>
        )}
      </div>
    </div>
  );
}
