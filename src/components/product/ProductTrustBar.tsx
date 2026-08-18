// RETRO Qatar — Product Trust & Warranty Bar
// Displays certified local warranty, free shipping threshold, and store guarantees

'use client';

import React from 'react';
import { ShieldCheck, Truck, CheckCircle } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';

interface ProductTrustBarProps {
  isRtl?: boolean;
}

export const ProductTrustBar: React.FC<ProductTrustBarProps> = ({ isRtl = true }) => {
  return (
    <div className="mt-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 space-y-3 shadow-inner backdrop-blur-sm">
      {/* 1. Local Warranty */}
      <div className="flex items-start gap-3 text-xs text-slate-300">
        <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <strong className="block text-white font-bold mb-0.5">
            {isRtl ? '🛡️ ضمان محلي معتمد في قطر' : '🛡️ Certified Local Qatar Warranty'}
          </strong>
          <span className="text-slate-400 text-[11px] leading-relaxed">
            {isRtl
              ? 'صيانة وضمان فحص واستبدال معتمد بمقرنا في مشيرب - الدوحة.'
              : 'Certified inspection, repair, and replacement at Msheireb HQ, Doha.'}
          </span>
        </div>
      </div>

      {/* 2. Free Express Shipping */}
      <div className="flex items-start gap-3 text-xs text-slate-300">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
          <Truck className="w-4 h-4" />
        </div>
        <div>
          <strong className="block text-white font-bold mb-0.5">
            {isRtl
              ? `🚚 شحن مجاني للطلبات فوق ${FREE_SHIPPING_THRESHOLD} ر.ق`
              : `🚚 Free Shipping on Orders Over ${FREE_SHIPPING_THRESHOLD} QAR`}
          </strong>
          <span className="text-slate-400 text-[11px] leading-relaxed">
            {isRtl
              ? 'توصيل سريع بنفس اليوم داخل الدوحة واللؤلؤة ولوسيل.'
              : 'Same-day express delivery across Doha, The Pearl, and Lusail.'}
          </span>
        </div>
      </div>

      {/* 3. Original & Tested */}
      <div className="flex items-start gap-3 text-xs text-slate-300">
        <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 shrink-0 mt-0.5">
          <CheckCircle className="w-4 h-4" />
        </div>
        <div>
          <strong className="block text-white font-bold mb-0.5">
            {isRtl ? '✨ منتج أصلي ومفحوص 100%' : '✨ 100% Genuine & Tested'}
          </strong>
          <span className="text-slate-400 text-[11px] leading-relaxed">
            {isRtl
              ? 'جميع الأجهزة وقطع التجميعات وألعاب الريترو تخضع لفحص فني دقيق قبل التسليم.'
              : 'All PCs, hardware, and retro consoles undergo rigorous technical testing.'}
          </span>
        </div>
      </div>
    </div>
  );
};
