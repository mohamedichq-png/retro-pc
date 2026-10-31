// Store-specific category navigation. Other routes retain the original categories.
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { MAIN_CATEGORIES, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import type { Dictionary, Locale } from '@/i18n/dictionaries';
import { MegaMenu } from './MegaMenu';

interface CategoryNavProps {
  dict: Dictionary;
  locale: Locale;
}

const categoryNavKeys: Record<string, keyof Dictionary['nav'] | string> = {
  all: 'allCategories', playstation: 'playstation', psp: 'psp', xbox: 'xbox',
  nintendo: 'nintendo', 'retro-gaming-classics': 'retroGaming',
  computers: 'computers', pc: 'pcComponents', gaming: 'consolesGames',
  'retro-gaming': 'retroGaming', monitors: 'monitors', accessories: 'accessories',
  laptops: 'laptops', deals: 'deals', 'repair-hub': 'repairHub',
};

const categoriesWithMegaMenu = [
  'playstation', 'nintendo', 'xbox', 'retro-gaming-classics',
  'retro-gaming', 'computers', 'pc', 'gaming', 'accessories', 'laptops',
];

// These IDs come from MAIN_CATEGORIES; no database/product records are changed.
const retroCategories = new Set([
  'playstation', 'psp', 'xbox', 'nintendo', 'retro-gaming-classics',
  'retro-gaming', 'gaming',
]);
const pcCategories = new Set([
  'computers', 'pc', 'monitors', 'laptops',
]);

export function CategoryNav({ dict, locale }: CategoryNavProps) {
  const isRtl = locale === 'ar';
  const pathname = usePathname() || '';
  const storePath = `/${locale}/retro`;
  const pcPath = `/${locale}/retro-pc`;
  const isRetro = pathname === storePath || pathname.startsWith(`${storePath}/`);
  const isPc = pathname === pcPath || pathname.startsWith(`${pcPath}/`);
  const isStorePage = isRetro || isPc;
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const categories = MAIN_CATEGORIES.filter(cat =>
    !isStorePage || (isRetro ? retroCategories.has(cat.id) : pcCategories.has(cat.id))
  );
  const activeHover = categoriesWithMegaMenu.includes(hoveredCategory || '') &&
    categories.some(cat => cat.id === hoveredCategory) ? hoveredCategory : null;

  return (
    <div
      className="hidden md:block border-b border-retro-border bg-retro-bg-secondary/60 relative z-30"
      onMouseLeave={() => setHoveredCategory(null)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1">
            {isStorePage && (
              <Link href={`/${locale}`} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-bold text-retro-cyan hover:bg-retro-cyan/10">
                {isRtl ? 'اختيار المتجر' : 'Choose store'}
              </Link>
            )}
            {categories.map(cat => {
              const navKey = categoryNavKeys[cat.id];
              const label = navKey && (dict.nav as Record<string, string>)[navKey]
                ? (dict.nav as Record<string, string>)[navKey]
                : (isRtl ? cat.nameAr : cat.nameEn);
              const hasMenu = categoriesWithMegaMenu.includes(cat.id);
              return (
                <div key={cat.id} onMouseEnter={() => setHoveredCategory(hasMenu ? cat.id : null)} className="relative py-1">
                  <Link
                    href={`/${locale}${cat.href}`}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all flex items-center gap-1 ${activeHover === cat.id ? 'text-retro-cyan bg-retro-cyan/5' : 'text-retro-text-secondary hover:text-retro-cyan hover:bg-retro-cyan/5'}`}
                  >
                    {label}
                    {hasMenu && (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" className={`transition-transform duration-250 ${activeHover === cat.id ? 'rotate-180 text-retro-cyan' : 'text-retro-text-muted'}`}>
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!isRetro && (
              <Link href={`/${locale}/pc-builder`} className="flex items-center gap-1.5 rounded-lg bg-retro-cyan/10 border border-retro-cyan/20 px-3 py-1.5 text-[11px] font-bold text-retro-cyan hover:bg-retro-cyan/15 hover:border-retro-cyan/40 transition-all animate-pulse-slow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
                </svg>
                {dict.nav.pcBuilder}
              </Link>
            )}
            <Link href={`/${locale}/repair`} className="flex items-center gap-1.5 rounded-lg bg-retro-purple/10 border border-retro-purple/20 px-3 py-1.5 text-[11px] font-bold text-retro-purple hover:bg-retro-purple/15 hover:border-retro-purple/40 transition-all">
              {dict.nav.repairHub}
            </Link>
            <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-semibold text-retro-purple-muted">
              <span>{dict.nav.freeShipping.replace('{threshold}', String(FREE_SHIPPING_THRESHOLD))}</span>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {activeHover && (
          <MegaMenu activeCategory={activeHover} locale={locale} dict={dict} onClose={() => setHoveredCategory(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
