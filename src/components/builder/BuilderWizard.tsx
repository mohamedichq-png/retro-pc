// RETRO Qatar — Builder Wizard Component

'use client';

import React from 'react';
import { usePCBuilderStore, BuilderStep } from '@/stores/usePCBuilderStore';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface BuilderWizardProps {
  dict: Dictionary;
  locale: Locale;
}

export const BUILDER_STEPS: { id: BuilderStep; labelEn: string; labelAr: string; icon: React.ReactNode }[] = [
  { id: 'cpu', labelEn: 'CPU', labelAr: 'المعالج', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg> },
  { id: 'motherboard', labelEn: 'Motherboard', labelAr: 'اللوحة الأم', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M8 7v4"/><path d="M12 7v4"/><path d="M16 7v4"/><path d="M7 16h10"/></svg> },
  { id: 'ram', labelEn: 'Memory (RAM)', labelAr: 'الذاكرة (RAM)', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 7v10"/><path d="M10 7v10"/><path d="M14 7v10"/><path d="M18 7v10"/></svg> },
  { id: 'gpu', labelEn: 'Graphics Card', labelAr: 'كرت الشاشة', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 15v-6"/><path d="M10 15v-6"/><path d="M14 15v-6"/><circle cx="18" cy="12" r="2"/></svg> },
  { id: 'storage', labelEn: 'Storage', labelAr: 'التخزين', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M4 10h16"/><path d="M4 14h16"/></svg> },
  { id: 'psu', labelEn: 'Power Supply', labelAr: 'مزود الطاقة', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> },
  { id: 'case', labelEn: 'Case', labelAr: 'الكيس', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M12 6v.01"/><path d="M12 18v.01"/></svg> },
  { id: 'cooling', labelEn: 'Cooling', labelAr: 'التبريد', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/><path d="m19 5-14 14"/><path d="m5 5 14 14"/></svg> },
];

export function BuilderWizard({ locale }: BuilderWizardProps) {
  const { currentStep, setStep, selectedParts } = usePCBuilderStore();
  const isRtl = locale === 'ar';

  return (
    <div className="flex flex-wrap gap-2 lg:gap-3 justify-center mb-8 bg-retro-bg-card p-4 rounded-2xl border border-retro-border">
      {BUILDER_STEPS.map((step, index) => {
        const isSelected = selectedParts[step.id] !== undefined;
        const isActive = currentStep === index;
        const isPast = currentStep > index;

        return (
          <button
            key={step.id}
            onClick={() => setStep(index)}
            className={`
              relative flex flex-col items-center justify-center p-3 rounded-xl transition-all min-w-[80px]
              ${isActive ? 'bg-retro-cyan text-retro-bg shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-retro-bg-input hover:bg-retro-bg-elevated'}
              ${isSelected && !isActive ? 'border-b-2 border-retro-cyan text-retro-cyan' : 'text-retro-text-secondary border-b-2 border-transparent'}
              ${isPast && !isSelected ? 'border-b-2 border-retro-red' : ''}
            `}
          >
            <div className={`mb-2 ${isActive ? 'text-retro-bg' : (isSelected ? 'text-retro-cyan' : 'text-retro-text-dim')}`}>
              {step.icon}
            </div>
            <span className={`text-[10px] sm:text-xs font-bold text-center ${isActive ? 'text-retro-bg' : 'text-retro-text'}`}>
              {isRtl ? step.labelAr : step.labelEn}
            </span>

            {isSelected && !isActive && (
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-retro-cyan shadow-[0_0_5px_rgba(34,211,238,1)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
