// RETRO Qatar — Repair Service Cards & Estimated Price Guide

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
    icon: '🎮',
    color: 'retro-purple',
    bg: 'bg-retro-purple/10',
    border: 'border-retro-purple/20',
    titleEn: 'Console Hardware Repair',
    titleAr: 'صيانة منصات الكونسول',
    descEn: 'PS5 Pro, Xbox Series X, Nintendo Switch logic board repair, HDMI port replacement, power issues, and optical drives.',
    descAr: 'صيانة بلايستيشن، إكسبوكس، نينتندو سويتش، استبدال منافذ HDMI، والدوائر الكهربائية.',
  },
  {
    id: 'pc-maintenance',
    icon: '🖥️',
    color: 'retro-cyan',
    bg: 'bg-retro-cyan/10',
    border: 'border-retro-cyan/20',
    titleEn: 'Gaming PC & Laptop Care',
    titleAr: 'صيانة الحواسيب واللابتوبات',
    descEn: 'Thermal paste replacement (Kryonaut / Liquid Metal), water cooling loops, fan replacements, and hardware diagnostics.',
    descAr: 'تغيير المعجون الحراري والمعادن السائلة، صيانة التبريد المائي، وفحص كروت الشاشة والمعالجات.',
  },
  {
    id: 'retro-restoration',
    icon: '🕹️',
    color: 'emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    titleEn: 'Retro Restoration & Mods',
    titleAr: 'تجديد وتعديل أجهزة ريترو',
    descEn: 'Capacitor recapping, IPS screen upgrades for Game Boy, HDMI mod installations, and ultrasonic cleaning.',
    descAr: 'تبديل مكثفات أجهزة الريترو، ترقية شاشات IPS للقيم بوي، تركيب منافذ HDMI وتنظيف البوردات.',
  },
  {
    id: 'upgrades',
    icon: '⚡',
    color: 'retro-pink',
    bg: 'bg-retro-pink/10',
    border: 'border-retro-pink/20',
    titleEn: 'Hardware & OS Upgrades',
    titleAr: 'الترقيات وتثبيت النظام',
    descEn: 'RAM expansion, NVMe SSD installation with data migration, Windows 11 optimization, and BIOS flashing.',
    descAr: 'ترقية الرام والتخزين مع نقل البيانات، تثبيت وتحسين ويندوز، وتحديث وتصفير البيوس.',
  },
];

const PRICE_GUIDE = [
  {
    serviceAr: 'استبدال منفذ HDMI (PS5 / Xbox Series X)',
    serviceEn: 'HDMI Port Replacement (PS5 / Xbox Series X)',
    estPrice: '250 - 350 QAR',
    durationAr: 'نفس اليوم / 24 ساعة',
    durationEn: 'Same Day / 24h',
  },
  {
    serviceAr: 'تنظيف عميق وتبديل المعجون الحراري الاحترافي',
    serviceEn: 'Deep Cleaning & High-End Thermal Repaste',
    estPrice: '150 - 250 QAR',
    durationAr: '1 - 2 ساعة',
    durationEn: '1 - 2 Hours',
  },
  {
    serviceAr: 'فحص وتشخيص أعطال Gaming PC والقطع',
    serviceEn: 'Gaming PC Hardware Diagnostics & Testing',
    estPrice: '100 QAR (مجاني مع الإصلاح)',
    durationAr: 'خلال 24 ساعة',
    durationEn: 'Within 24h',
  },
  {
    serviceAr: 'ترقية شاشة IPS لجهاز Game Boy أو تعديل Retro',
    serviceEn: 'Game Boy IPS Screen Mod & Recapping',
    estPrice: '180 - 300 QAR',
    durationAr: '24 - 48 ساعة',
    durationEn: '24 - 48 Hours',
  },
  {
    serviceAr: 'إصلاح دريفت عصا التحكم (Hall Effect Sticks)',
    serviceEn: 'Controller Stick Drift Fix (Hall Effect Upgrade)',
    estPrice: '80 - 150 QAR',
    durationAr: 'نفس اليوم',
    durationEn: 'Same Day',
  },
];

export function RepairServiceCards({ dict, locale }: RepairServiceCardsProps) {
  const isRtl = locale === 'ar';

  return (
    <div className="space-y-12">
      {/* 4 Main Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((service) => (
          <div 
            key={service.id}
            className={`group flex flex-col p-6 rounded-3xl border bg-retro-bg-card transition-all duration-300 hover:-translate-y-1 ${service.border} hover:shadow-xl shadow-md`}
          >
            <span className="text-3xl mb-4 block">{service.icon}</span>
            <h3 className="text-base font-black text-retro-text mb-2">
              {isRtl ? service.titleAr : service.titleEn}
            </h3>
            <p className="text-xs text-retro-text-secondary leading-relaxed">
              {isRtl ? service.descAr : service.descEn}
            </p>
          </div>
        ))}
      </div>

      {/* Estimated Pricing Guide Table */}
      <div className="bg-retro-bg-card border border-retro-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-retro-border pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-retro-text">
              {dict.repair?.servicesPriceGuide || (isRtl ? 'قائمة الأسعار التقديرية لخدمات الصيانة الشائعة' : 'Estimated Pricing Guide for Common Repairs')}
            </h3>
            <p className="text-xs text-retro-text-muted mt-0.5">
              {dict.repair?.costDisclaimer || (isRtl ? 'الأسعار تقريبية ويتم اعتماد السعر النهائي بعد الفحص الفيزيائي للجهاز في المركز.' : 'Estimates subject to physical inspection at our service center.')}
            </p>
          </div>
          <span className="text-[10px] font-black text-retro-cyan uppercase tracking-wider bg-retro-cyan/10 px-2.5 py-1 rounded-lg border border-retro-cyan/20 self-start sm:self-auto">
            Qatar Standard Rates
          </span>
        </div>

        <div className="divide-y divide-retro-border/60 overflow-x-auto">
          {PRICE_GUIDE.map((row, i) => (
            <div key={i} className="py-3 flex items-center justify-between gap-4 text-xs">
              <span className="font-bold text-retro-text">
                {isRtl ? row.serviceAr : row.serviceEn}
              </span>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-retro-text-dim text-[11px] hidden sm:inline">
                  ⏱️ {isRtl ? row.durationAr : row.durationEn}
                </span>
                <span className="font-black text-retro-cyan bg-retro-bg-input px-2.5 py-1 rounded-lg border border-retro-border font-mono">
                  {row.estPrice}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
