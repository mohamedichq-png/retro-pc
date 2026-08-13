// RETRO Qatar — Quick View Modal

'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { PriceTag } from '@/components/ui/PriceTag';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { StockBadge, ConditionBadge } from '@/components/ui/Badge';
import { useCartStore } from '@/stores/useCartStore';
import { useUIStore } from '@/stores/useUIStore';
import type { Product } from '@/types';
import type { Dictionary, Locale } from '@/i18n/dictionaries';
import Link from 'next/link';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  dict: Dictionary;
  locale: Locale;
}

export function QuickViewModal({ product, isOpen, onClose, dict, locale }: QuickViewModalProps) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCartStore();
  const { showToast } = useUIStore();

  if (!product) return null;

  const isRtl = locale === 'ar';
  const name = isRtl ? product.nameAr : product.nameEn;
  const description = isRtl ? (product.descriptionAr || product.descriptionEn) : product.descriptionEn;
  const isOutOfStock = product.stockQty <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, qty);
    showToast(dict.product.addedToCart, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" className="overflow-hidden">
      <div className="flex flex-col md:flex-row gap-6 p-2">
        {/* Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-retro-bg-input rounded-xl border border-retro-border aspect-square overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-retro-text-dim text-2xl">No Image</span>
          )}
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 flex flex-col pt-2">
          <div className="mb-2 flex items-center gap-2">
            <ConditionBadge condition={product.condition} />
            <StockBadge qty={product.stockQty} />
          </div>

          <h3 className="text-xl font-black text-retro-text mb-3 leading-tight">
            {name}
          </h3>

          <div className="mb-4">
            <PriceTag 
              price={product.salePrice ?? product.sellingPrice} 
              originalPrice={product.salePrice ? product.sellingPrice : undefined} 
              size="lg" 
            />
          </div>

          <p className="text-sm text-retro-text-secondary line-clamp-3 mb-6">
            {description}
          </p>

          <div className="mt-auto space-y-4">
            <div className="flex items-center gap-4">
              <QuantitySelector value={qty} onChange={setQty} max={Math.min(10, product.stockQty)} />
              <Button 
                fullWidth 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? dict.product.outOfStock : dict.product.addToCart}
              </Button>
            </div>
            <Link href={`/${locale}/product/${product.slug || product.id}`} onClick={onClose} className="block text-center text-sm font-bold text-retro-cyan hover:text-retro-cyan-muted transition-colors">
              {dict.common.seeMore}
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
