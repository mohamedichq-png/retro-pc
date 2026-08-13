// RETRO Qatar — Mobile Navigation
// Bottom tab bar + full-screen mobile drawer

'use client';

import React from 'react';
import Link from 'next/link';
import { useUIStore } from '@/stores/useUIStore';
import { MAIN_CATEGORIES } from '@/lib/constants';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { AnimatePresence, motion } from 'framer-motion';

interface MobileNavProps {
  dict: Dictionary;
  locale: Locale;
}

export function MobileNav({ dict, locale }: MobileNavProps) {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const isRtl = locale === 'ar';

  return (
    <>
      {/* ── Mobile Drawer Overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 z-50 w-[280px] bg-retro-bg border-retro-border lg:hidden ltr:left-0 ltr:border-r rtl:right-0 rtl:border-l overflow-y-auto scrollbar-thin"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-retro-border">
                <img
                  src={locale === 'ar' ? '/logo-ar.png' : '/logo-en.png'}
                  alt="RETRO"
                  className="h-10 w-auto object-contain"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-retro-text-muted hover:text-retro-text cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Main Navigation */}
              <div className="p-4 space-y-1">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-retro-text-muted">
                  {isRtl ? 'الصفحات الرئيسية' : 'Main Pages'}
                </p>
                <MobileNavLink href={`/${locale}`} onClick={() => setMobileMenuOpen(false)}>
                  {dict.nav.home}
                </MobileNavLink>
                <MobileNavLink href={`/${locale}/products`} onClick={() => setMobileMenuOpen(false)}>
                  {dict.nav.shop}
                </MobileNavLink>
              </div>

              {/* Categories */}
              <div className="px-4 pb-4 space-y-1">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-retro-text-muted">
                  {dict.nav.allCategories}
                </p>
                {MAIN_CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                  <MobileNavLink
                    key={cat.id}
                    href={`/${locale}/category/${cat.slugEn}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {isRtl ? cat.nameAr : cat.nameEn}
                  </MobileNavLink>
                ))}
              </div>

              {/* Highlighted Actions */}
              <div className="px-4 pb-6 space-y-3">
                <Link
                  href={`/${locale}/pc-builder`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-retro-cyan/10 border border-retro-cyan/20 py-3 text-xs font-bold text-retro-cyan hover:bg-retro-cyan/15 transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                  </svg>
                  {dict.nav.pcBuilder}
                </Link>
                <Link
                  href={`/${locale}/repair`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-retro-purple/10 border border-retro-purple/20 py-3 text-xs font-bold text-retro-purple hover:bg-retro-purple/15 transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  {dict.nav.repairHub}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Fixed Bottom Tab Bar ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-retro-border bg-retro-bg/95 backdrop-blur-lg">
        <div className="flex items-center justify-around py-2 px-2">
          <BottomTabLink href={`/${locale}`} label={dict.nav.home}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </BottomTabLink>

          <BottomTabLink href={`/${locale}/products`} label={dict.nav.shop}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </BottomTabLink>

          <BottomTabLink href={`/${locale}/pc-builder`} label={dict.nav.pcBuilder} highlight>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
            </svg>
          </BottomTabLink>

          <BottomTabLink href={`/${locale}/repair`} label={dict.nav.repairHub}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </BottomTabLink>

          <BottomTabLink href={`/${locale}/account`} label={dict.nav.account}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </BottomTabLink>
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
      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-retro-text-secondary hover:text-retro-text hover:bg-white/5 transition-colors"
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
      <Link href={href} className="flex flex-col items-center gap-0.5 -mt-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-retro-cyan-muted to-retro-cyan text-retro-bg shadow-lg shadow-retro-cyan/30 border-2 border-retro-bg">
          {children}
        </span>
        <span className="text-[9px] font-bold text-retro-cyan">{label}</span>
      </Link>
    );
  }

  return (
    <Link href={href} className="flex flex-col items-center gap-0.5 text-retro-text-muted hover:text-retro-cyan transition-colors">
      {children}
      <span className="text-[9px] font-semibold">{label}</span>
    </Link>
  );
}
