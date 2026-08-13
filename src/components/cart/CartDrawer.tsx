// RETRO Qatar — Cart Drawer Component (Slide-out Panel)

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useCartStore } from '@/stores/useCartStore';
import { useUIStore } from '@/stores/useUIStore';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { Button } from '@/components/ui/Button';
import { PriceTag } from '@/components/ui/PriceTag';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface CartDrawerProps {
  dict: Dictionary;
  locale: Locale;
}

export function CartDrawer({ dict, locale }: CartDrawerProps) {
  const { cartDrawerOpen, setCartDrawerOpen } = useUIStore();
  const { items, updateQty, removeItem, getTotal } = useCartStore();
  
  const isRtl = locale === 'ar';
  const totalPrice = getTotal();

  useEffect(() => {
    if (cartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [cartDrawerOpen]);

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCartDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: isRtl ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-full bg-retro-bg-card border-retro-border flex flex-col shadow-2xl ltr:border-l rtl:border-r"
          >
            {/* Header */}
            <div className="p-6 border-b border-retro-border flex items-center justify-between">
              <h2 className="text-xl font-black text-retro-text flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                {dict.cart?.myCart || 'Your Cart'}
              </h2>
              <button 
                onClick={() => setCartDrawerOpen(false)}
                className="p-2 text-retro-text-muted hover:text-retro-text transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-retro-text-dim">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  <p className="text-sm font-semibold">{dict.cart?.empty || 'Your cart is empty'}</p>
                </div>
              ) : (
                items.map((item) => {
                  const product = item.product;
                  const variation = item.variation;
                  const name = isRtl ? product.nameAr : product.nameEn;
                  const price = variation ? (variation.salePrice ?? variation.sellingPrice) : (product.salePrice ?? product.sellingPrice);

                  return (
                    <div key={`${product.id}-${variation?.id || ''}`} className="flex gap-4 pb-6 border-b border-retro-border/50">
                      <div className="w-20 h-20 bg-retro-bg-input rounded-xl border border-retro-border overflow-hidden shrink-0 flex items-center justify-center">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-retro-text-dim">No Image</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className="text-sm font-bold text-retro-text truncate hover:text-retro-cyan transition-colors">
                            <Link href={`/${locale}/product/${product.slug || product.id}`} onClick={() => setCartDrawerOpen(false)}>
                              {name}
                            </Link>
                          </h3>
                          <button 
                            onClick={() => removeItem(product.id, variation?.sku)}
                            className="text-retro-text-dim hover:text-retro-red p-1 transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                        {variation && (
                          <span className="text-[10px] font-bold text-retro-cyan mb-2">
                            Option: {variation.edition}
                          </span>
                        )}
                        <div className="mt-auto flex items-center justify-between">
                          <QuantitySelector 
                            value={item.qty} 
                            onChange={(q) => updateQty(product.id, q, variation?.sku)}
                            max={Math.min(10, variation?.stockQty ?? product.stockQty)} 
                          />
                          <PriceTag price={price * item.qty} size="sm" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-retro-border bg-retro-bg-input">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-bold text-retro-text-secondary">{dict.cart?.subtotal || 'Subtotal'}</span>
                  <span className="text-xl font-black text-retro-text">
                    {totalPrice.toLocaleString()} {dict.common.currency}
                  </span>
                </div>
                <div className="space-y-3">
                  <Link href={`/${locale}/cart`} onClick={() => setCartDrawerOpen(false)}>
                    <Button fullWidth variant="secondary">
                      {dict.cart?.myCart || 'View Cart'}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/checkout`} onClick={() => setCartDrawerOpen(false)}>
                    <Button fullWidth>
                      {dict.cart?.checkout || 'Proceed to Checkout'}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
