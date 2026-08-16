// RETRO Qatar — Mobile Navigation
// Bottom tab bar + full-screen mobile drawer + floating WhatsApp shortcut

'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { useUIStore } from '@/stores/useUIStore';
import { useCartStore } from '@/stores/useCartStore';
import { MAIN_CATEGORIES, BUSINESS_INFO } from '@/lib/constants';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { AnimatePresence, motion } from 'framer-motion';

interface MobileNavProps {
  dict: Dictionary;
  locale: Locale;
}

export function MobileNav({ dict, locale }: MobileNavProps) {
  const { mobileMenuOpen, setMobileMenuOpen, setCartDrawerOpen } = useUIStore();
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const isRtl = locale === 'ar';

  return (
    <>
      {/* ── Floating WhatsApp Button (Mobile & Desktop) ── */}
      <aside 
        aria-label="Customer Support"
        className="fixed bottom-20 ltr:right-4 rtl:left-4 z-40 lg:bottom-6 lg:ltr:right-6 lg:rtl:left-6"
      >
        <a
          href={`https://wa.me/${BUSINESS_INFO.salesWhatsApp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-emerald-400"
          aria-label="Direct WhatsApp Chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          </svg>
        </a>
      </aside>

      {/* ── Mobile Drawer Overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 z-50 w-[300px] max-w-[85vw] bg-retro-bg border-retro-border lg:hidden ltr:left-0 ltr:border-r rtl:right-0 rtl:border-l overflow-y-auto scrollbar-thin shadow-2xl flex flex-col justify-between"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-5 border-b border-retro-border">
                  <Logo />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl p-2 text-retro-text-muted hover:text-retro-text hover:bg-white/5 cursor-pointer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Main Navigation */}
                <div className="p-4 space-y-1">
                  <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-retro-cyan">
                    {isRtl ? 'الصفحات الرئيسية' : 'Main Pages'}
                  </p>
                  <MobileNavLink href={`/${locale}`} onClick={() => setMobileMenuOpen(false)}>
                    {dict.nav?.home || 'Home'}
                  </MobileNavLink>
                  <MobileNavLink href={`/${locale}/products`} onClick={() => setMobileMenuOpen(false)}>
                    {dict.nav?.shop || 'Shop'}
                  </MobileNavLink>
                  <MobileNavLink href={`/${locale}/pc-builder`} onClick={() => setMobileMenuOpen(false)}>
                    {dict.nav?.pcBuilder || 'Build Your PC'}
                  </MobileNavLink>
                  <MobileNavLink href={`/${locale}/repair`} onClick={() => setMobileMenuOpen(false)}>
                    {dict.nav?.repairHub || 'Repair Hub'}
                  </MobileNavLink>
                </div>

                {/* Categories */}
                <div className="px-4 pb-4 space-y-1 border-t border-retro-border/60 pt-4">
                  <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-retro-purple">
                    {dict.nav?.allCategories || 'Categories'}
                  </p>
                  {MAIN_CATEGORIES.filter(c => c.id !== 'all' && c.id !== 'repair-hub').map((cat) => (
                    <MobileNavLink
                      key={cat.id}
                      href={`/${locale}/category/${cat.slugEn}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {isRtl ? cat.nameAr : cat.nameEn}
                    </MobileNavLink>
                  ))}
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-4 border-t border-retro-border bg-retro-bg-card space-y-2">
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-retro-bg-input border border-retro-border py-2.5 text-xs font-bold text-retro-text"
                >
                  <span>📞 {BUSINESS_INFO.phone}</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Fixed Bottom Tab Bar ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-retro-border bg-retro-bg/95 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-around py-2 px-2">
          
          {/* Home */}
          <BottomTabLink href={`/${locale}`} label={dict.nav?.home || 'Home'}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </BottomTabLink>

          {/* Shop */}
          <BottomTabLink href={`/${locale}/products`} label={dict.nav?.shop || 'Shop'}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </BottomTabLink>

          {/* PC Builder (Highlighted Center CTA) */}
          <BottomTabLink href={`/${locale}/pc-builder`} label={dict.nav?.pcBuilder || 'Builder'} highlight>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
            </svg>
          </BottomTabLink>

          {/* Repair */}
          <BottomTabLink href={`/${locale}/repair`} label={dict.nav?.repairHub || 'Repair'}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </BottomTabLink>

          {/* Cart Drawer Trigger */}
          <button 
            onClick={() => setCartDrawerOpen(true)}
            className="flex flex-col items-center gap-0.5 text-retro-text-muted hover:text-retro-cyan transition-colors relative cursor-pointer"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" x2="21" y1="6" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-retro-cyan text-[9px] font-black text-retro-bg">
                {cartItemCount}
              </span>
            )}
            <span className="text-[9.5px] font-bold">{dict.nav?.cart || 'Cart'}</span>
          </button>

        </div>
      </div>
    </>
  );
}

// ── Internal Sub-Components ──

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-3 py-2 text-xs font-semibold text-retro-text-secondary hover:text-retro-cyan hover:bg-retro-cyan/5 transition-colors"
    >
      {children}
    </Link>
  );
}

function BottomTabLink({
  href,
  label,
  highlight,
  children,
}: {
  href: string;
  label: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  if (highlight) {
    return (
      <Link href={href} className="flex flex-col items-center gap-0.5 -mt-5">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-retro-cyan to-blue-600 text-retro-bg shadow-lg shadow-retro-cyan/30 border-2 border-retro-bg">
          {children}
        </span>
        <span className="text-[9.5px] font-black text-retro-cyan">{label}</span>
      </Link>
    );
  }

  return (
    <Link href={href} className="flex flex-col items-center gap-0.5 text-retro-text-muted hover:text-retro-cyan transition-colors">
      {children}
      <span className="text-[9.5px] font-semibold">{label}</span>
    </Link>
  );
}
