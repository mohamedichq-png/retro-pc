// RETRO Qatar — Top Header Announcement & Info Bar

'use client';

import React from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import { BUSINESS_INFO, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';

interface AnnouncementBarProps {
  dict: Dictionary;
  locale: string;
}

export function AnnouncementBar({ dict, locale }: AnnouncementBarProps) {
  const isRtl = locale === 'ar';

  return (
    <div className="relative z-50 overflow-hidden bg-retro-bg-secondary/90 border-b border-retro-border text-[11px] text-retro-text-secondary py-1.5 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
        
        {/* Left: Free Shipping & Trust Highlight */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-retro-cyan animate-pulse" />
          <span className="font-bold text-retro-cyan">
            {dict.nav.freeShipping ? dict.nav.freeShipping.replace('{threshold}', String(FREE_SHIPPING_THRESHOLD)) : `شحن مجاني للطلبات فوق ${FREE_SHIPPING_THRESHOLD} ر.ق`}
          </span>
          <span className="hidden sm:inline text-retro-text-dim">|</span>
          <span className="hidden sm:inline text-retro-text-muted">
            {isRtl ? 'تسليم سريع خلال 24 - 48 ساعة' : 'Fast 24-48h Delivery'}
          </span>
        </div>

        {/* Center / Right: Location, Working Hours & Phone / WhatsApp */}
        <div className="flex items-center gap-4 text-[10.5px] font-medium">
          {/* Location */}
          <a
            href={BUSINESS_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 hover:text-retro-cyan transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{isRtl ? 'مشيرب، الدوحة' : 'Msheireb, Doha'}</span>
          </a>

          {/* Operating Hours */}
          <span className="hidden lg:inline text-retro-text-dim">|</span>
          <span className="hidden lg:inline text-retro-text-muted">
            {isRtl ? 'السبت - الخميس: 9ص - 1ظ | 4ع - 10م' : 'Sat-Thu: 9AM-1PM | 4PM-10PM'}
          </span>

          {/* Direct Phone */}
          <span className="hidden sm:inline text-retro-text-dim">|</span>
          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className="flex items-center gap-1 hover:text-retro-cyan font-bold transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="font-mono">{BUSINESS_INFO.phone}</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={`https://wa.me/${BUSINESS_INFO.salesWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-retro-green hover:underline font-bold transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            <span>{isRtl ? 'واتساب' : 'WhatsApp'}</span>
          </a>
        </div>

      </div>
    </div>
  );
}

