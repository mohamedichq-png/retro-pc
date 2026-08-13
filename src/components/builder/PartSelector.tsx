// RETRO Qatar — Part Selector Component

'use client';

import React, { useMemo } from 'react';
import { usePCBuilderStore } from '@/stores/usePCBuilderStore';
import { BUILDER_STEPS } from './BuilderWizard';
import { checkCompatibility } from '@/lib/compatibility';
import { PriceTag } from '@/components/ui/PriceTag';
import { StockBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface PartSelectorProps {
  products: Product[];
  dict: Dictionary;
  locale: Locale;
}

export function PartSelector({ products, dict, locale }: PartSelectorProps) {
  const { currentStep, nextStep, selectedParts, selectPart, setCompatibility } = usePCBuilderStore();
  const step = BUILDER_STEPS[currentStep];
  const isRtl = locale === 'ar';

  // Filter products by current step's category
  const availableProducts = useMemo(() => {
    // Map builder steps to actual category values in mockData database
    const categoryMapping: Record<string, string[]> = {
      cpu: ['CPUs'],
      motherboard: ['Motherboards'],
      ram: ['RAM'],
      gpu: ['GPUs'],
      storage: ['SSD'],
      psu: ['PSUs'],
      case: ['Cases'],
      cooling: ['Cooling'],
    };
    
    const validCats = categoryMapping[step.id] || [step.id];
    return products.filter(p => validCats.includes(p.category));
  }, [products, step.id]);

  const handleSelect = (product: Product) => {
    selectPart(step.id, product);
    
    // Run compatibility check
    const newSelectedParts = { ...selectedParts, [step.id]: product };
    const result = checkCompatibility(newSelectedParts);
    setCompatibility(result);

    // Auto advance if compatible
    if (result.status !== 'incompatible') {
      setTimeout(() => {
        nextStep();
      }, 300);
    }
  };

  if (availableProducts.length === 0) {
    return (
      <div className="text-center py-12 text-retro-text-dim bg-retro-bg-card rounded-2xl border border-retro-border">
        No components available for {step.labelEn}.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-retro-text flex items-center gap-3">
          <span className="text-retro-cyan">{step.icon}</span>
          {isRtl ? `اختر ${step.labelAr}` : `Select ${step.labelEn}`}
        </h2>
        <span className="text-sm font-bold text-retro-text-dim">
          Step {currentStep + 1} of {BUILDER_STEPS.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {availableProducts.map((product) => {
          const isSelected = selectedParts[step.id]?.id === product.id;
          const isOutOfStock = product.stockQty <= 0;

          return (
            <div 
              key={product.id}
              className={`
                group flex flex-col rounded-2xl border p-4 transition-all duration-300
                ${isSelected 
                  ? 'border-retro-cyan bg-retro-cyan/10 shadow-[0_0_20px_rgba(34,211,238,0.15)]' 
                  : 'border-retro-border bg-retro-bg-card hover:border-retro-cyan/50 hover:-translate-y-1'
                }
              `}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 shrink-0 rounded-xl bg-retro-bg-input border border-retro-border overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-retro-text-dim text-xs">No Image</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-retro-text-muted mb-1">{product.brand}</div>
                  <h3 className="text-sm font-bold text-retro-text leading-tight line-clamp-2 mb-2 group-hover:text-retro-cyan transition-colors">
                    {isRtl ? product.nameAr : product.nameEn}
                  </h3>
                  <StockBadge qty={product.stockQty} />
                </div>
              </div>

              {/* Specs Snippet */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-retro-text-secondary bg-retro-bg-input p-2 rounded-lg">
                  {Object.entries(product.specs).slice(0, 4).map(([k, v]) => (
                    <div key={k} className="truncate">
                      <span className="text-retro-text-dim mr-1 capitalize">{k}:</span>
                      {v}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-retro-border/50">
                <PriceTag 
                  price={product.salePrice ?? product.sellingPrice} 
                  originalPrice={product.salePrice ? product.sellingPrice : undefined} 
                  size="md" 
                />
                <Button 
                  size="sm" 
                  variant={isSelected ? 'secondary' : 'primary'}
                  disabled={isOutOfStock}
                  onClick={() => handleSelect(product)}
                >
                  {isSelected 
                    ? (isRtl ? 'تم الاختيار' : 'Selected') 
                    : (isOutOfStock ? dict.product.outOfStock : (isRtl ? 'اختيار' : 'Select'))
                  }
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
