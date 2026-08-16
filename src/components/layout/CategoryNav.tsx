// RETRO Qatar — Category Navigation Bar
// Second navigation row with department links, PC Builder/Repair Hub highlights, and free shipping notice

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { MAIN_CATEGORIES, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { MegaMenu } from './MegaMenu';

interface CategoryNavProps {
  dict: Dictionary;
  locale: Locale;
}

// Map category IDs to their nav dictionary keys
const categoryNavKeys: Record<string, keyof Dictionary['nav']> = {
  'all': 'allCategories',
  'computers': 'computers',
  'pc': 'pcComponents',
  'gaming': 'consolesGames',
  'retro-gaming': 'retroGaming',
  'monitors': 'monitors',
  'accessories': 'accessories',
  'laptops': 'laptops',
  'deals': 'deals',
  'repair-hub': 'repairHub',
};

const categoriesWithMegaMenu = [
  'computers',
  'pc',
  'gaming',
  'retro-gaming',
  'accessories',
  'laptops',
];

export function CategoryNav({ dict, locale }: CategoryNavProps) {
  const isRtl = locale === 'ar';
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleMouseEnter = (categoryId: string) => {
    if (categoriesWithMegaMenu.includes(categoryId)) {
      setHoveredCategory(categoryId);
    } else {
      setHoveredCategory(null);
    }
  };

  return (
    <div 
      className="hidden md:block border-b border-retro-border bg-retro-bg-secondary/60 relative z-30"
      onMouseLeave={() => setHoveredCategory(null)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 overflow-x-auto scrollbar-none">

          {/* ── Category Links ── */}
          <div className="flex items-center gap-1">
            {MAIN_CATEGORIES.map((cat) => {
              const navKey = categoryNavKeys[cat.id];
              const label = navKey ? (dict.nav[navKey] as string) : (isRtl ? cat.nameAr : cat.nameEn);
              const hasMenu = categoriesWithMegaMenu.includes(cat.id);

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                  className="relative py-1"
                >
                  <Link
                    href={cat.id === 'all' ? `/${locale}/products` : `/${locale}/category/${cat.slugEn}`}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all flex items-center gap-1 ${
                      hoveredCategory === cat.id
                        ? 'text-retro-cyan bg-retro-cyan/5'
                        : 'text-retro-text-secondary hover:text-retro-cyan hover:bg-retro-cyan/5'
                    }`}
                  >
                    {label}
                    {hasMenu && (
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className={`transition-transform duration-250 ${hoveredCategory === cat.id ? 'rotate-180 text-retro-cyan' : 'text-retro-text-muted'}`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* ── Highlighted Links + Shipping ── */}
          <div className="flex items-center gap-3 shrink-0">
            {/* PC Builder - Highlighted */}
            <Link
              href={`/${locale}/pc-builder`}
              className="flex items-center gap-1.5 rounded-lg bg-retro-cyan/10 border border-retro-cyan/20 px-3 py-1.5 text-[11px] font-bold text-retro-cyan hover:bg-retro-cyan/15 hover:border-retro-cyan/40 transition-all animate-pulse-slow"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <line x1="9" y1="1" x2="9" y2="4" />
                <line x1="15" y1="1" x2="15" y2="4" />
                <line x1="9" y1="20" x2="9" y2="23" />
                <line x1="15" y1="20" x2="15" y2="23" />
                <line x1="20" y1="9" x2="23" y2="9" />
                <line x1="20" y1="14" x2="23" y2="14" />
                <line x1="1" y1="9" x2="4" y2="9" />
                <line x1="1" y1="14" x2="4" y2="14" />
              </svg>
              {dict.nav.pcBuilder}
            </Link>

            {/* Repair Hub - Highlighted */}
            <Link
              href={`/${locale}/repair`}
              className="flex items-center gap-1.5 rounded-lg bg-retro-purple/10 border border-retro-purple/20 px-3 py-1.5 text-[11px] font-bold text-retro-purple hover:bg-retro-purple/15 hover:border-retro-purple/40 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              {dict.nav.repairHub}
            </Link>

            {/* Free Shipping Notice */}
            <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-semibold text-retro-purple-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-retro-purple/60">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <span>
                {dict.nav.freeShipping.replace('{threshold}', String(FREE_SHIPPING_THRESHOLD))}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Hovered Mega Menu Overlay ── */}
      <AnimatePresence>
        {hoveredCategory && (
          <MegaMenu
            activeCategory={hoveredCategory}
            locale={locale}
            dict={dict}
            onClose={() => setHoveredCategory(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

