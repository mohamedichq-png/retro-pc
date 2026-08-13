// RETRO Qatar — Repair Content (Client Layout)

'use client';

import React from 'react';
import { RepairServiceCards } from '@/components/repair/RepairServiceCards';
import { RepairBookingForm } from '@/components/repair/RepairBookingForm';
import { RepairTracker } from '@/components/repair/RepairTracker';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface RepairContentProps {
  dict: Dictionary;
  locale: Locale;
}

export function RepairContent({ dict, locale }: RepairContentProps) {
  const isRtl = locale === 'ar';
  
  const breadcrumbs = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.repair?.title || (isRtl ? 'مركز الصيانة' : 'Repair Hub') },
  ];

  return (
    <div className="bg-retro-bg min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb items={breadcrumbs} className="mb-8" />
        
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-32 bg-retro-purple/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 rounded-full border border-retro-purple/30 bg-retro-purple/10 px-4 py-1.5 text-xs font-bold text-retro-purple backdrop-blur-md mb-6 uppercase tracking-wider">
            {isRtl ? 'صيانة احترافية بضمان' : 'Professional Warranty Repairs'}
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-retro-text tracking-tight mb-6">
            {dict.repair?.title || (isRtl ? 'مركز الصيانة المعتمد' : 'The Ultimate Repair Hub')}
          </h1>
          <p className="text-sm sm:text-base text-retro-text-secondary max-w-2xl mx-auto leading-relaxed">
            {dict.repair?.subtitle || (isRtl ? 'فريق من الخبراء جاهز لإصلاح جهازك بأسرع وقت وأعلى جودة. تتبع حالة جهازك أو احجز موعداً الآن.' : 'Our expert technicians are ready to bring your devices back to life. Book a repair or track your existing ticket below.')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-retro-text mb-8 text-center">{isRtl ? 'خدماتنا' : 'Our Services'}</h2>
          <RepairServiceCards dict={dict} locale={locale} />
        </div>

        {/* Interactive Tools: Tracker & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <RepairTracker dict={dict} locale={locale} />
            
            <div className="bg-retro-bg-card border border-retro-border rounded-2xl p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">{isRtl ? 'لماذا تختارنا؟' : 'Why Choose Us?'}</h3>
              <ul className="space-y-4">
                {[
                  { icon: '🚀', text: isRtl ? 'تشخيص سريع في نفس اليوم' : 'Same-day diagnostics' },
                  { icon: '🛡️', text: isRtl ? 'ضمان على جميع الإصلاحات' : 'Warranty on all repairs' },
                  { icon: '💎', text: isRtl ? 'قطع غيار أصلية ومعتمدة' : 'Original certified parts' },
                  { icon: '👨‍🔧', text: isRtl ? 'فنيين خبراء بخبرة +10 سنوات' : 'Expert technicians (+10 yrs)' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-retro-text-secondary">
                    <span className="text-xl">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <RepairBookingForm dict={dict} locale={locale} />
          </div>
        </div>

      </div>
    </div>
  );
}
