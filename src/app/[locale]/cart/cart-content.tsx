// RETRO Qatar — Cart Page Content (Client)

'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/useCartStore';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { Button } from '@/components/ui/Button';
import { PriceTag } from '@/components/ui/PriceTag';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface CartContentProps {
  dict: Dictionary;
  locale: Locale;
}

export function CartContent({ dict, locale }: CartContentProps) {
  const { items, updateQty, removeItem, getTotal, clearCart } = useCartStore();
  const isRtl = locale === 'ar';
  const totalPrice = getTotal();

  const breadcrumbs = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.cart?.myCart || 'Cart' },
  ];

  if (items.length === 0) {
    return (
      <div className="bg-retro-bg min-h-[60vh] py-12 px-4 flex flex-col items-center justify-center text-center">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-retro-text-muted mb-6 animate-bounce">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h2 className="text-2xl font-black text-retro-text mb-4">
          {dict.cart?.empty || 'Your cart is empty'}
        </h2>
        <p className="text-retro-text-secondary mb-8 max-w-md">
          {isRtl ? 'لم تقم بإضافة أي منتجات للسلة بعد. ابدأ بالتسوق الآن واستكشف خياراتنا الرائعة!' : 'You haven\'t added any items to your cart yet. Explore our gaming gear and hardware!'}
        </p>
        <Link href={`/${locale}/products`}>
          <Button size="lg">{dict.cart?.continueShopping || 'Continue Shopping'}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-retro-bg min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-retro-border">
          <h1 className="text-3xl font-black text-retro-text">{dict.cart?.myCart || 'Your Cart'}</h1>
          <button 
            onClick={clearCart} 
            className="text-sm font-semibold text-retro-text-dim hover:text-retro-red transition-colors"
          >
            {isRtl ? 'تفريغ السلة' : 'Clear Cart'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Item List (Left) */}
          <div className="flex-1 w-full space-y-4">
            {items.map((item) => {
              const product = item.product;
              const variation = item.variation;
              const name = isRtl ? product.nameAr : product.nameEn;
              const price = variation ? (variation.salePrice ?? variation.sellingPrice) : (product.salePrice ?? product.sellingPrice);

              return (
                <div 
                  key={`${product.id}-${variation?.id || ''}`} 
                  className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-retro-border bg-retro-bg-card hover:border-retro-cyan/20 transition-all"
                >
                  <div className="w-24 h-24 bg-retro-bg-input rounded-xl border border-retro-border overflow-hidden shrink-0 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-retro-text-dim">No Image</span>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <h3 className="text-base font-bold text-retro-text hover:text-retro-cyan transition-colors">
                          <Link href={`/${locale}/product/${product.slug || product.id}`}>
                            {name}
                          </Link>
                        </h3>
                        <button 
                          onClick={() => removeItem(product.id, variation?.sku)}
                          className="text-retro-text-dim hover:text-retro-red p-1 transition-colors"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-xs text-retro-text-secondary mb-2">
                        <span>{product.brand}</span>
                        {variation && (
                          <span className="text-retro-cyan font-bold">
                            Option: {variation.edition}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 sm:mt-0">
                      <QuantitySelector 
                        value={item.qty} 
                        onChange={(q) => updateQty(product.id, q, variation?.sku)}
                        max={Math.min(10, variation?.stockQty ?? product.stockQty)} 
                      />
                      <div className="text-right">
                        <PriceTag price={price * item.qty} size="md" />
                        <span className="text-[10px] text-retro-text-dim block mt-0.5">
                          ({price.toLocaleString()} {dict.common.currency} each)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Panel (Right) */}
          <div className="w-full lg:w-[380px] shrink-0 bg-retro-bg-card border border-retro-border rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-black text-retro-text mb-6 pb-4 border-b border-retro-border">
              {dict.checkout?.orderSummary || 'Order Summary'}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm text-retro-text-secondary">
                <span>{dict.cart?.subtotal || 'Subtotal'}</span>
                <span>{totalPrice.toLocaleString()} {dict.common.currency}</span>
              </div>
              <div className="flex justify-between text-sm text-retro-text-secondary">
                <span>{isRtl ? 'الشحن' : 'Shipping'}</span>
                <span className="text-green-500 font-bold">
                  {totalPrice >= 500 ? (isRtl ? 'مجاني' : 'Free') : `30 ${dict.common.currency}`}
                </span>
              </div>
              <div className="pt-4 border-t border-retro-border flex justify-between text-xl font-black text-retro-text">
                <span>{dict.cart?.total || 'Total'}</span>
                <span>
                  {(totalPrice >= 500 ? totalPrice : totalPrice + 30).toLocaleString()} {dict.common.currency}
                </span>
              </div>
            </div>

            <Link href={`/${locale}/checkout`}>
              <Button fullWidth size="lg">
                {dict.cart?.checkout || 'Proceed to Checkout'}
              </Button>
            </Link>

            <p className="text-[10px] text-retro-text-dim text-center mt-4">
              {isRtl 
                ? 'شحن مجاني للطلبات بقيمة 500 ر.ق أو أكثر في جميع أنحاء قطر.' 
                : 'Free shipping on orders of 500 QAR or more across Qatar.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
