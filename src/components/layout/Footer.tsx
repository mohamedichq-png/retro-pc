// RETRO Qatar — Footer Component
// Comprehensive 4-column e-commerce footer with business info, links, payment method badges, hours, and store location

'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { BUSINESS_INFO, SOCIAL_LINKS } from '@/lib/constants';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';

interface FooterProps {
  dict: Dictionary;
  locale: Locale;
}

export function Footer({ dict, locale }: FooterProps) {
  const isRtl = locale === 'ar';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-retro-border bg-retro-bg-secondary/70 lg:pb-0 pb-20">
      {/* Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1: About Retro Qatar */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="inline-block">
              <Logo />
            </Link>
            <p className="text-xs text-retro-text-secondary leading-relaxed font-medium">
              {dict.footer?.aboutText || (isRtl 
                ? 'Retro Qatar متجر قطري رائد متخصص في أجهزة وتجميعات Gaming PC، مكونات الحاسوب، أجهزة وألعاب الكونسول الحديثة، أجهزة وألعاب Retro الكلاسيكية النادرة، وخدمات الصيانة المعتمدة.' 
                : 'Retro Qatar is a premier Qatari retailer specializing in custom Gaming PCs, PC hardware, modern gaming consoles, authentic retro games, and certified technical repair services.')}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <SocialIcon href={SOCIAL_LINKS.instagram} label="Instagram">
                <path d="M16 8a6 6 0 0 1 6 6v7a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6v-7a6 6 0 0 1 6-6z" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17.5" cy="8.5" r="1" fill="currentColor" />
              </SocialIcon>
              <SocialIcon href={SOCIAL_LINKS.tiktok} label="TikTok">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </SocialIcon>
              <SocialIcon href={SOCIAL_LINKS.twitter} label="X / Twitter">
                <path d="M4 4l11.7 16h4.3m-16 0L15.7 4H20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </SocialIcon>
            </div>
          </div>

          {/* Column 2: Shopping Departments */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-retro-text">
              {dict.footer?.quickLinks || (isRtl ? 'أقسام التسوق' : 'Shopping Departments')}
            </h3>
            <div className="flex flex-col gap-2.5">
              <FooterLink href={`/${locale}/products`}>{dict.nav?.shop || 'Shop All'}</FooterLink>
              <FooterLink href={`/${locale}/pc-builder`}>{dict.nav?.pcBuilder || 'Build Your PC'}</FooterLink>
              <FooterLink href={`/${locale}/category/pc`}>{dict.nav?.pcComponents || 'PC Components'}</FooterLink>
              <FooterLink href={`/${locale}/category/gaming`}>{dict.nav?.consolesGames || 'Consoles & Games'}</FooterLink>
              <FooterLink href={`/${locale}/category/retro-gaming`}>{dict.nav?.retroGaming || 'Retro Gaming'}</FooterLink>
              <FooterLink href={`/${locale}/products?sale=true`}>{dict.nav?.deals || 'Special Deals'}</FooterLink>
            </div>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-retro-text">
              {dict.footer?.customerService || (isRtl ? 'خدمة العملاء والسياسات' : 'Customer Care')}
            </h3>
            <div className="flex flex-col gap-2.5">
              <FooterLink href={`/${locale}/repair`}>{dict.nav?.repairHub || 'Repair Hub'}</FooterLink>
              <FooterLink href={`/${locale}/account`}>{dict.account?.myAccount || 'My Account'}</FooterLink>
              <FooterLink href={`/${locale}/account/orders`}>{dict.account?.orders || 'My Orders'}</FooterLink>
              <FooterLink href={`/${locale}/account/wishlist`}>{dict.account?.wishlist || 'Wishlist'}</FooterLink>
              <FooterLink href={`/${locale}/compare`}>{dict.nav?.compare || 'Compare Products'}</FooterLink>
              <FooterLink href="#">{dict.footer?.returnPolicy || 'Return & Warranty Policy'}</FooterLink>
            </div>
          </div>

          {/* Column 4: Contact & Msheireb Location */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-retro-text">
              {dict.footer?.contactUs || (isRtl ? 'التواصل وموقع المحل' : 'Contact & Store Location')}
            </h3>

            {/* Direct Phone & WhatsApp */}
            <div className="space-y-2 text-xs">
              <a href={`tel:${BUSINESS_INFO.phone}`} className="flex items-center gap-2 text-retro-text-secondary hover:text-retro-cyan font-bold transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="font-mono">{BUSINESS_INFO.phone}</span>
              </a>

              <a href={`https://wa.me/${BUSINESS_INFO.salesWhatsApp}`} className="flex items-center gap-2 text-retro-text-secondary hover:text-retro-green font-bold transition-colors" target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                <span>{isRtl ? 'واتساب: 66223445' : 'WhatsApp: +974 6622 3445'}</span>
              </a>
            </div>

            {/* Operating Hours */}
            <div className="space-y-1 pt-2 border-t border-retro-border/60 text-xs">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-retro-text-muted">{dict.footer?.operatingHours || 'Operating Hours'}</h4>
              <p className="text-retro-text-secondary">
                {dict.footer?.satThur || 'Sat - Thu'}: 9AM - 1PM | 4PM - 10PM
              </p>
              <p className="text-retro-pink font-bold">
                {dict.footer?.friday || 'Friday'}: {dict.footer?.off || 'OFF'}
              </p>
            </div>

            {/* Location Link */}
            <div className="pt-2">
              <a
                href={BUSINESS_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-retro-cyan hover:underline font-bold transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{isRtl ? 'مشيرب، الدوحة (خرائط Google)' : 'Msheireb HQ, Doha (Maps)'}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Payment Methods Bar */}
        <div className="mt-12 pt-8 border-t border-retro-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-retro-text-muted">
            <span className="font-bold text-retro-text">{isRtl ? 'وسائل الدفع المقبولة في قطر:' : 'Accepted Payments:'}</span>
            <span className="bg-retro-bg-card border border-retro-border px-2 py-1 rounded-md text-[10px] font-black text-retro-text">QPay</span>
            <span className="bg-retro-bg-card border border-retro-border px-2 py-1 rounded-md text-[10px] font-black text-retro-text">Apple Pay</span>
            <span className="bg-retro-bg-card border border-retro-border px-2 py-1 rounded-md text-[10px] font-black text-retro-text">Visa</span>
            <span className="bg-retro-bg-card border border-retro-border px-2 py-1 rounded-md text-[10px] font-black text-retro-text">Mastercard</span>
            <span className="bg-retro-bg-card border border-retro-border px-2 py-1 rounded-md text-[10px] font-black text-retro-text">Cash on Delivery</span>
          </div>
          
          <div className="text-[11px] text-retro-text-dim">
            {isRtl ? 'بوابة دفع قطرية آمنة 100%' : '100% Secure Qatar Payment Gateway'}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-retro-border bg-retro-bg/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-retro-text-dim text-center sm:text-start">
              {dict.footer?.copyright ? dict.footer.copyright.replace('{year}', String(currentYear)) : `© ${currentYear} Retro Qatar. All Rights Reserved.`}
            </p>
            <p className="text-[11px] text-retro-text-dim">
              {dict.footer?.builtFor || "Built for Qatar's Gaming Community"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Sub-components ──

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-xs text-retro-text-secondary hover:text-retro-cyan font-medium transition-colors">
      {children}
    </Link>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-retro-border bg-retro-bg-card text-retro-text-muted hover:text-retro-cyan hover:border-retro-cyan/40 transition-all shadow-sm"
      aria-label={label}
    >
      <svg width="16" height="16" viewBox="0 0 24 24">{children}</svg>
    </a>
  );
}
