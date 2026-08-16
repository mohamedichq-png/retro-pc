// RETRO Qatar — Build Summary Component

'use client';

import React from 'react';
import { usePCBuilderStore } from '@/stores/usePCBuilderStore';
import { BUILDER_STEPS } from './BuilderWizard';
import { PerformanceEstimate } from './PerformanceEstimate';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/useCartStore';
import { useUIStore } from '@/stores/useUIStore';
import { BUSINESS_INFO } from '@/lib/constants';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface BuildSummaryProps {
  dict: Dictionary;
  locale: Locale;
}

export function BuildSummary({ dict, locale }: BuildSummaryProps) {
  const { selectedParts, getTotalPrice, getEstimatedWattage, compatibility, removePart } = usePCBuilderStore();
  const { addItem } = useCartStore();
  const { showToast } = useUIStore();
  
  const totalPrice = getTotalPrice();
  const wattage = getEstimatedWattage();
  const isRtl = locale === 'ar';

  const hasAnyPart = Object.keys(selectedParts).length > 0;

  const handleAddAllToCart = () => {
    Object.values(selectedParts).forEach((part) => {
      if (part) addItem(part, 1);
    });
    showToast(isRtl ? 'تمت إضافة التجميعة للسلة' : 'Build added to cart successfully', 'success');
  };

  return (
    <div className="sticky top-24">
      <div className="bg-retro-bg-card border border-retro-border rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-black text-retro-text mb-6 pb-4 border-b border-retro-border">
          {dict.pcBuilder?.buildSummary || 'Build Summary'}
        </h2>

        {/* Parts List */}
        <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
          {BUILDER_STEPS.map((step) => {
            const part = selectedParts[step.id];
            return (
              <div key={step.id} className="flex gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-retro-bg-input flex items-center justify-center shrink-0 text-retro-text-dim">
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-retro-text-muted uppercase tracking-wider">
                    {isRtl ? step.labelAr : step.labelEn}
                  </div>
                  {part ? (
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-retro-text font-medium truncate group relative">
                        {isRtl ? part.nameAr : part.nameEn}
                        {/* Remove button */}
                        <button 
                          onClick={() => removePart(step.id)}
                          className="absolute -right-6 top-0 text-retro-red opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                      </p>
                      <span className="font-bold text-retro-cyan shrink-0">
                        {part.salePrice ?? part.sellingPrice} {dict.common.currency}
                      </span>
                    </div>
                  ) : (
                    <span className="text-retro-text-dim italic text-xs">
                      {isRtl ? 'لم يتم الاختيار' : 'Not selected'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Compatibility Alert */}
        {hasAnyPart && (
          <div className={`p-4 rounded-xl mb-6 text-sm ${
            compatibility.status === 'incompatible' ? 'bg-retro-red/10 border border-retro-red/30 text-retro-red' :
            compatibility.status === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-500' :
            'bg-green-500/10 border border-green-500/30 text-green-500'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              {compatibility.status === 'incompatible' ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> :
               compatibility.status === 'warning' ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg> :
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
              }
              {compatibility.status === 'incompatible' ? 'Compatibility Issues Found' :
               compatibility.status === 'warning' ? 'Potential Issues' :
               'All selected parts are compatible'}
            </div>
            {compatibility.messages.length > 0 && (
              <ul className="list-disc ltr:pl-5 rtl:pr-5 mt-2 text-xs space-y-1 opacity-90">
                {compatibility.messages.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
            )}
          </div>
        )}

        {/* Totals */}
        <div className="pt-4 border-t border-retro-border space-y-2 mb-6 text-xs">
          <div className="flex justify-between text-retro-text-secondary">
            <span>{dict.pcBuilder?.estimatedPower || (isRtl ? 'استهلاك الطاقة التقديري:' : 'Estimated Power Draw:')}</span>
            <span className="font-mono font-bold text-retro-cyan">{wattage}W</span>
          </div>
          <div className="flex justify-between text-retro-text-secondary">
            <span>{dict.pcBuilder?.recommendedPSU || (isRtl ? 'مزود الطاقة المقترح:' : 'Recommended PSU:')}</span>
            <span className="font-mono font-bold text-retro-purple">{wattage > 0 ? `${Math.ceil((wattage + 150) / 50) * 50}W` : '-'}</span>
          </div>
          <div className="flex justify-between text-lg font-black text-retro-text pt-2 border-t border-retro-border/50">
            <span>{dict.cart?.total || (isRtl ? 'المجموع الكلي:' : 'Total Price:')}</span>
            <span className="text-retro-cyan">{totalPrice.toLocaleString()} {dict.common?.currency || 'QAR'}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            fullWidth 
            size="lg" 
            variant="primary"
            onClick={handleAddAllToCart}
            disabled={!hasAnyPart || compatibility.status === 'incompatible'}
            className="font-black text-xs py-3.5 shadow-lg shadow-retro-cyan/20"
          >
            {dict.pcBuilder?.addAllToCart || (isRtl ? 'إضافة التجميعة كاملة للسلة' : 'Add Entire Build to Cart')}
          </Button>

          {/* WhatsApp Direct Build Submission */}
          {hasAnyPart && (
            <a
              href={`https://wa.me/${BUSINESS_INFO.salesWhatsApp}?text=${encodeURIComponent(
                (isRtl ? `مرحباً Retro Qatar، أرغب بمراجعة هذه التجميعة وتجميعها مجاناً:\n` : `Hello RETRO Qatar, I would like to review this custom build for free assembly:\n`) +
                Object.entries(selectedParts)
                  .map(([step, p]) => p ? `• ${step.toUpperCase()}: ${isRtl ? p.nameAr : p.nameEn} (${p.sellingPrice} QAR)` : '')
                  .filter(Boolean)
                  .join('\n') +
                `\n\n` +
                (isRtl ? `الإجمالي: ${totalPrice} ر.ق\nاستهلاك الطاقة: ${wattage}W` : `Total: ${totalPrice} QAR\nEstimated Power: ${wattage}W`)
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold py-3 text-xs transition-all text-center leading-tight"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
              <span>{dict.pcBuilder?.sendToWhatsApp || (isRtl ? 'إرسال التجميعة للواتساب للتجميع والمراجعة' : 'Send Build to WhatsApp for Free Assembly')}</span>
            </a>
          )}
        </div>
      </div>

      <PerformanceEstimate dict={dict} locale={locale} />
    </div>
  );
}
