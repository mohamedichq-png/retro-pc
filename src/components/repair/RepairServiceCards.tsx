// RETRO Qatar — Repair Service Cards

'use client';

import React from 'react';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface RepairServiceCardsProps {
  dict: Dictionary;
  locale: Locale;
}

const SERVICES = [
  {
    id: 'console-repair',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4"/><path d="M8 10v4"/><circle cx="15" cy="13" r="1"/><circle cx="18" cy="11" r="1"/></svg>,
    color: 'retro-purple',
    bg: 'bg-retro-purple/10',
    border: 'border-retro-purple/20',
    titleEn: 'Console Repair',
    titleAr: 'صيانة الكونسول',
    descEn: 'PS5, Xbox, Nintendo Switch logic board repair, HDMI port replacement, and deep cleaning.',
    descAr: 'صيانة بلايستيشن 5، إكس بوكس، نينتندو، تغيير منافذ HDMI والتنظيف العميق.',
  },
  {
    id: 'pc-maintenance',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M12 6v.01"/><path d="M12 18v.01"/></svg>,
    color: 'retro-cyan',
    bg: 'bg-retro-cyan/10',
    border: 'border-retro-cyan/20',
    titleEn: 'PC Maintenance',
    titleAr: 'صيانة الحواسيب',
    descEn: 'Hardware diagnostics, thermal paste replacement, custom water cooling loops maintenance.',
    descAr: 'فحص الأعطال، تغيير المعجون الحراري، وصيانة أنظمة التبريد المائي المخصصة.',
  },
  {
    id: 'upgrades',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m18 15-6-6-6 6"/></svg>,
    color: 'retro-purple',
    bg: 'bg-retro-purple/10',
    border: 'border-retro-purple/20',
    titleEn: 'Hardware Upgrades',
    titleAr: 'ترقية القطع',
    descEn: 'RAM expansion, SSD installation, GPU upgrades with full compatibility checks.',
    descAr: 'زيادة مساحة الرام والتخزين، ترقية كرت الشاشة مع فحص التوافقية الكامل.',
  },
  {
    id: 'software',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m8 10 4-4 4 4"/><path d="M12 6v12"/></svg>,
    color: 'retro-cyan',
    bg: 'bg-retro-cyan/10',
    border: 'border-retro-cyan/20',
    titleEn: 'Software & OS',
    titleAr: 'البرمجيات والنظام',
    descEn: 'Windows installation, driver updates, virus removal, and system optimization.',
    descAr: 'تثبيت الويندوز، تحديث التعريفات، إزالة الفيروسات، وتحسين أداء النظام.',
  },
];

export function RepairServiceCards({ dict, locale }: RepairServiceCardsProps) {
  const isRtl = locale === 'ar';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {SERVICES.map((service) => (
        <div 
          key={service.id}
          className={`group flex flex-col p-6 rounded-2xl border bg-retro-bg-card transition-all duration-300 hover:-translate-y-1 ${service.border} hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]`}
        >
          <div className={`w-14 h-14 rounded-xl ${service.bg} flex items-center justify-center mb-6 text-${service.color} transition-transform group-hover:scale-110`}>
            {service.icon}
          </div>
          <h3 className="text-lg font-bold text-retro-text mb-2">
            {isRtl ? service.titleAr : service.titleEn}
          </h3>
          <p className="text-sm text-retro-text-secondary leading-relaxed">
            {isRtl ? service.descAr : service.descEn}
          </p>
        </div>
      ))}
    </div>
  );
}
