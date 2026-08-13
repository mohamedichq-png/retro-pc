// RETRO Qatar — Compare Content (Client Component)

'use client';

import React from 'react';
import Link from 'next/link';
import { useCompareStore } from '@/stores/useCompareStore';
import { useCartStore } from '@/stores/useCartStore';
import { useUIStore } from '@/stores/useUIStore';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { StockBadge, ConditionBadge } from '@/components/ui/Badge';
import { PriceTag } from '@/components/ui/PriceTag';
import type { Dictionary, Locale } from '@/i18n/dictionaries';
import { MAIN_CATEGORIES } from '@/lib/constants';

interface CompareContentProps {
  dict: Dictionary;
  locale: Locale;
}

export function CompareContent({ dict, locale }: CompareContentProps) {
  const { items, toggle, clear } = useCompareStore();
  const { addItem } = useCartStore();
  const { showToast } = useUIStore();
  const isRtl = locale === 'ar';

  const breadcrumbs = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.product.compare },
  ];

  if (items.length === 0) {
    return (
      <div className="bg-retro-bg min-h-[70vh] py-12 px-4 flex flex-col items-center justify-center text-center">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-retro-text-muted mb-6">
          <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
        </svg>
        <h2 className="text-2xl font-black text-retro-text mb-4">
          {isRtl ? 'قائمة المقارنة فارغة' : 'Your comparison list is empty'}
        </h2>
        <p className="text-retro-text-secondary mb-8 max-w-md">
          {isRtl ? 'أضف منتجات للمقارنة لمعرفة الفروقات بينها واتخاذ القرار الأفضل.' : 'Add products to compare their features and specs side-by-side to make the best choice.'}
        </p>
        <Link href={`/${locale}/products`}>
          <Button>{dict.cart.continueShopping}</Button>
        </Link>
      </div>
    );
  }

  // Extract all unique spec keys across all items
  const allSpecKeys = Array.from(new Set(
    items.flatMap(item => item.specs ? Object.keys(item.specs) : [])
  )).sort();

  return (
    <div className="bg-retro-bg min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <Breadcrumb items={breadcrumbs} className="mb-2" />
            <h1 className="text-3xl font-black text-retro-text">{dict.product.compare}</h1>
          </div>
          <button 
            onClick={clear}
            className="text-sm font-semibold text-retro-text-dim hover:text-retro-red transition-colors"
          >
            {dict.filter.clearAll}
          </button>
        </div>

        <div className="overflow-x-auto pb-8 scrollbar-thin">
          <table className="w-full min-w-[800px] border-collapse table-fixed">
            <thead>
              <tr>
                <th className="w-48 p-4 text-start border-b border-retro-border bg-retro-bg sticky left-0 z-10" />
                {items.map(item => (
                  <th key={item.id} className="w-72 p-4 text-center border-b border-l border-retro-border relative group">
                    <button 
                      onClick={() => toggle(item)}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-retro-bg-card border border-retro-border text-retro-text-dim hover:text-retro-red hover:border-retro-red/30 transition-colors opacity-0 group-hover:opacity-100"
                      title={dict.common.delete}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                    <Link href={`/${locale}/product/${item.slug || item.id}`} className="block">
                      <div className="aspect-square w-full rounded-xl bg-retro-bg-input mb-4 overflow-hidden flex items-center justify-center border border-retro-border group-hover:border-retro-cyan/30 transition-colors">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-retro-text-dim text-xs">No Image</span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-retro-text group-hover:text-retro-cyan transition-colors line-clamp-2">
                        {isRtl ? item.nameAr : item.nameEn}
                      </h3>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price & Action */}
              <tr>
                <td className="p-4 font-bold text-retro-text-secondary text-sm sticky left-0 bg-retro-bg z-10 border-b border-retro-border">
                  {dict.filter.price}
                </td>
                {items.map(item => (
                  <td key={item.id} className="p-4 text-center border-b border-l border-retro-border">
                    <div className="flex flex-col items-center gap-3">
                      <PriceTag 
                        price={item.salePrice ?? item.sellingPrice} 
                        originalPrice={item.salePrice ? item.sellingPrice : undefined} 
                        size="md" 
                        className="justify-center"
                      />
                      <Button 
                        size="sm" 
                        fullWidth 
                        disabled={item.stockQty <= 0}
                        onClick={() => {
                          if (item.stockQty > 0) {
                            addItem(item, 1);
                            showToast(dict.product.addedToCart, 'success');
                          }
                        }}
                      >
                        {item.stockQty <= 0 ? dict.product.outOfStock : dict.product.addToCart}
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Basic Info */}
              <tr className="bg-retro-bg-card/30">
                <td className="p-4 font-bold text-retro-text-secondary text-sm sticky left-0 bg-retro-bg border-b border-retro-border">
                  {dict.product.brand}
                </td>
                {items.map(item => (
                  <td key={item.id} className="p-4 text-center border-b border-l border-retro-border font-semibold text-retro-text">
                    {item.brand}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-retro-text-secondary text-sm sticky left-0 bg-retro-bg border-b border-retro-border">
                  {dict.product.category}
                </td>
                {items.map(item => {
                  const cat = MAIN_CATEGORIES.find(c => c.id === item.category);
                  const catName = cat ? (isRtl ? cat.nameAr : cat.nameEn) : item.category;
                  return (
                    <td key={item.id} className="p-4 text-center border-b border-l border-retro-border text-sm text-retro-text-secondary">
                      {catName}
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-retro-bg-card/30">
                <td className="p-4 font-bold text-retro-text-secondary text-sm sticky left-0 bg-retro-bg border-b border-retro-border">
                  {dict.filter.condition}
                </td>
                {items.map(item => (
                  <td key={item.id} className="p-4 text-center border-b border-l border-retro-border">
                    <ConditionBadge condition={item.condition} />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-retro-text-secondary text-sm sticky left-0 bg-retro-bg border-b border-retro-border">
                  {dict.filter.availability}
                </td>
                {items.map(item => (
                  <td key={item.id} className="p-4 text-center border-b border-l border-retro-border">
                    <StockBadge qty={item.stockQty} />
                  </td>
                ))}
              </tr>

              {/* Dynamic Specs */}
              {allSpecKeys.length > 0 && (
                <>
                  <tr>
                    <td colSpan={items.length + 1} className="p-4 font-black text-retro-cyan uppercase tracking-wider text-sm sticky left-0 bg-retro-bg border-b border-retro-border">
                      {dict.product.specifications}
                    </td>
                  </tr>
                  {allSpecKeys.map((specKey, index) => (
                    <tr key={specKey} className={index % 2 === 0 ? 'bg-retro-bg-card/30' : ''}>
                      <td className="p-4 font-bold text-retro-text-secondary text-sm sticky left-0 bg-retro-bg border-b border-retro-border capitalize">
                        {specKey}
                      </td>
                      {items.map(item => (
                        <td key={item.id} className="p-4 text-center border-b border-l border-retro-border text-sm text-retro-text-secondary">
                          {item.specs?.[specKey] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
