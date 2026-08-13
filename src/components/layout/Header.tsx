// RETRO Qatar — Main Header Component
// Professional e-commerce header with search, account, wishlist, cart, and language toggle

'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useUIStore } from '@/stores/useUIStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Logo } from './Logo';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { initialProducts } from '@/data/mockData';
import { MAIN_CATEGORIES } from '@/lib/constants';
import type { Product } from '@/types';

interface HeaderProps {
  dict: Dictionary;
  locale: Locale;
}

export function Header({ dict, locale }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRtl = locale === 'ar';

  const cartItemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { setCartDrawerOpen, setSearchOverlayOpen, toggleMobileMenu, activeDepartment, setActiveDepartment } = useUIStore();
  const user = useAuthStore((s) => s.user);

  const oppositeLocale = locale === 'en' ? 'ar' : 'en';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/${locale}/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const switchLocale = () => {
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(en|ar)/, '');
    router.push(`/${oppositeLocale}${pathWithoutLocale || '/'}`);
  };

  const handleHomeClick = () => {
    // Reset branding to general when returning to home
    setActiveDepartment('general');
  };

  // Autocomplete Suggestions Selector
  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return { products: [], brands: [], categories: [] };

    // 1. Matched Products (nameEn, nameAr, brand, SKU, model)
    const matchedProducts = (initialProducts as unknown as Product[])
      .filter((p) => 
        p.nameEn.toLowerCase().includes(query) ||
        p.nameAr.includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.model.toLowerCase().includes(query)
      )
      .slice(0, 5);

    // 2. Matched Brands
    const uniqueBrands = Array.from(new Set(
      (initialProducts as unknown as Product[])
        .map((p) => p.brand)
        .filter(Boolean)
    ));
    const matchedBrands = uniqueBrands
      .filter((brand) => brand.toLowerCase().includes(query))
      .slice(0, 3);

    // 3. Matched Categories
    const matchedCategories = MAIN_CATEGORIES
      .filter((cat) => 
        cat.id !== 'all' && 
        (cat.nameEn.toLowerCase().includes(query) || 
         cat.nameAr.includes(query) || 
         cat.slugEn.toLowerCase().includes(query))
      )
      .slice(0, 3);

    return {
      products: matchedProducts,
      brands: matchedBrands,
      categories: matchedCategories,
    };
  }, [searchQuery]);

  const hasSuggestions = 
    suggestions.products.length > 0 || 
    suggestions.brands.length > 0 || 
    suggestions.categories.length > 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-retro-border bg-retro-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">

        {/* ── Logo ── */}
        <Link 
          href={`/${locale}`} 
          onClick={handleHomeClick}
          className="flex items-center gap-3 group shrink-0"
        >
          <Logo />
        </Link>

        {/* ── Search Bar (Desktop with Autocomplete) ── */}
        <div ref={containerRef} className="hidden md:block flex-1 max-w-xl relative">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={dict.search.placeholder}
              className="w-full rounded-xl bg-retro-bg-input border border-retro-border py-2.5 text-sm text-retro-text placeholder-retro-text-dim focus:border-retro-cyan/40 focus:outline-none focus:ring-1 focus:ring-retro-cyan/20 transition-all ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4"
            />
            {/* Search Icon */}
            <div className="absolute top-1/2 -translate-y-1/2 ltr:left-3.5 rtl:right-3.5 text-retro-text-muted">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                }}
                className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-retro-text-dim hover:text-retro-text cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown List */}
          {showSuggestions && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-retro-bg-card/95 backdrop-blur-2xl border border-retro-border rounded-xl shadow-2xl z-50 overflow-hidden glow-cyan-sm">
              {hasSuggestions ? (
                <div className="p-4 space-y-4 text-left rtl:text-right">
                  {/* Category Matches */}
                  {suggestions.categories.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-retro-cyan uppercase tracking-wider mb-2">
                        {isRtl ? 'الأقسام المقترحة' : 'Suggested Categories'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/${locale}/category/${cat.slugEn}`}
                            onClick={() => setShowSuggestions(false)}
                            className="text-xs bg-retro-bg-elevated hover:bg-retro-cyan/15 text-retro-text hover:text-retro-cyan px-2.5 py-1.5 rounded-lg border border-retro-border hover:border-retro-cyan/30 transition-all font-semibold"
                          >
                            {isRtl ? cat.nameAr : cat.nameEn}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brand Matches */}
                  {suggestions.brands.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-retro-purple uppercase tracking-wider mb-2">
                        {isRtl ? 'العلامات المقترحة' : 'Suggested Brands'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.brands.map((brand) => (
                          <Link
                            key={brand}
                            href={`/${locale}/products?search=${encodeURIComponent(brand)}`}
                            onClick={() => setShowSuggestions(false)}
                            className="text-xs bg-retro-bg-elevated hover:bg-retro-purple/15 text-retro-text-secondary hover:text-retro-purple px-2.5 py-1.5 rounded-lg border border-retro-border hover:border-retro-purple/30 transition-all font-semibold"
                          >
                            {brand}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Matches */}
                  {suggestions.products.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-retro-text-muted uppercase tracking-wider">
                        {isRtl ? 'المنتجات المطابقة' : 'Matched Products'}
                      </h4>
                      <div className="divide-y divide-retro-border">
                        {suggestions.products.map((p) => {
                          const name = isRtl ? p.nameAr : p.nameEn;
                          const price = p.salePrice ?? p.sellingPrice;
                          const hasSale = p.salePrice !== undefined;
                          
                          return (
                            <Link
                              key={p.id}
                              href={`/${locale}/product/${p.slug || p.id}`}
                              onClick={() => setShowSuggestions(false)}
                              className="flex items-center gap-3 py-2.5 hover:bg-white/5 transition-all group first:pt-0 last:pb-0"
                            >
                              <div className="w-10 h-10 rounded-lg bg-retro-bg border border-retro-border overflow-hidden shrink-0 flex items-center justify-center relative">
                                {p.imageUrl ? (
                                  <img
                                    src={p.imageUrl}
                                    alt={name}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                                  />
                                ) : (
                                  <div className="w-4 h-4 border border-retro-cyan/30 rounded" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-bold text-retro-text truncate group-hover:text-retro-cyan transition-colors">
                                  {name}
                                </h5>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[9px] font-black text-retro-text-muted uppercase tracking-wider bg-retro-bg-elevated px-1.5 py-0.5 rounded border border-retro-border">
                                    {p.brand}
                                  </span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    p.condition === 'New' 
                                      ? 'text-retro-green bg-retro-green/10' 
                                      : p.condition === 'Refurbished'
                                      ? 'text-retro-cyan bg-retro-cyan/10'
                                      : 'text-retro-amber bg-retro-amber/10'
                                  }`}>
                                    {p.condition}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right rtl:text-left shrink-0">
                                {hasSale && (
                                  <div className="text-[10px] text-retro-text-muted line-through">
                                    {p.sellingPrice} {dict.common.currency || 'QAR'}
                                  </div>
                                )}
                                <div className="text-xs font-black text-retro-cyan">
                                  {price} {dict.common.currency || 'QAR'}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-retro-text-dim">
                  {isRtl ? 'لا توجد نتائج مطابقة' : 'No suggestions found'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right Actions (Desktop) ── */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Account */}
          <Link
            href={user ? `/${locale}/account` : `/${locale}/auth/login`}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-retro-text-secondary hover:text-retro-text hover:bg-white/5 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-xs font-semibold">
              {user ? user.name : dict.nav.account}
            </span>
          </Link>

          {/* Wishlist */}
          <Link
            href={`/${locale}/account/wishlist`}
            className="relative rounded-xl p-2.5 text-retro-text-secondary hover:text-retro-pink hover:bg-retro-pink/5 transition-all"
            title={dict.nav.wishlist}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-retro-pink text-[9px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative rounded-xl p-2.5 text-retro-text-secondary hover:text-retro-cyan hover:bg-retro-cyan/5 transition-all cursor-pointer"
            title={dict.nav.cart}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" x2="21" y1="6" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-retro-cyan text-[10px] font-bold text-retro-bg shadow-md shadow-retro-cyan/30">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={switchLocale}
            className="rounded-xl border border-retro-cyan/20 bg-retro-cyan/5 px-3 py-2 text-xs font-bold text-retro-cyan hover:bg-retro-cyan/10 hover:border-retro-cyan/40 transition-all cursor-pointer"
          >
            {dict.nav.language}
          </button>
        </div>

        {/* ── Mobile Actions ── */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Search */}
          <button
            onClick={() => setSearchOverlayOpen(true)}
            className="rounded-lg p-2 text-retro-text-secondary hover:text-retro-cyan cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          {/* Mobile Cart */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative rounded-lg p-2 text-retro-text-secondary hover:text-retro-cyan cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" x2="21" y1="6" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-retro-cyan text-[9px] font-bold text-retro-bg">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Language Toggle Mobile */}
          <button
            onClick={switchLocale}
            className="rounded-lg border border-retro-cyan/20 bg-retro-cyan/5 px-2 py-1.5 text-[10px] font-bold text-retro-cyan cursor-pointer"
          >
            {dict.nav.language}
          </button>

          {/* Hamburger Menu */}
          <button
            onClick={toggleMobileMenu}
            className="rounded-lg p-2 text-retro-text-secondary hover:text-retro-text cursor-pointer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
}
