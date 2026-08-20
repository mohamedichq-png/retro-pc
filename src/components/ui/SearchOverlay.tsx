// RETRO Qatar — Search Overlay Component

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/stores/useUIStore';
import { useSearchStore } from '@/stores/useSearchStore';
import { initialProducts } from '@/data/mockData';
import type { Product } from '@/types';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface SearchOverlayProps {
  dict: Dictionary;
  locale: Locale;
}

export function SearchOverlay({ dict, locale }: SearchOverlayProps) {
  const { searchOverlayOpen, setSearchOverlayOpen } = useUIStore();
  const { query, setQuery, recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore();
  const [results, setResults] = useState<Product[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isRtl = locale === 'ar';

  useEffect(() => {
    if (searchOverlayOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [searchOverlayOpen, setQuery]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const q = query.toLowerCase();
      const filtered = (initialProducts as unknown as Product[]).filter(p => 
        p.nameEn.toLowerCase().includes(q) || 
        p.nameAr.includes(q) || 
        p.brand?.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode?.toLowerCase().includes(q) ||
        p.platform?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      ).slice(0, 8); // top 8 results for autocomplete
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query.trim());
      setSearchOverlayOpen(false);
      router.push(`/${locale}/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleResultClick = (product: Product) => {
    addRecentSearch(query.trim() || product.nameEn);
    setSearchOverlayOpen(false);
  };

  return (
    <AnimatePresence>
      {searchOverlayOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSearchOverlayOpen(false)}
          />

          {/* Search Panel */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full bg-retro-bg-card border-b border-retro-border p-4 sm:p-6 lg:p-8"
          >
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center gap-4 mb-6">
                <form onSubmit={handleSubmit} className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={dict.search.placeholder}
                    className="w-full bg-transparent border-b-2 border-retro-border text-2xl sm:text-3xl font-bold text-retro-text pb-2 focus:outline-none focus:border-retro-cyan transition-colors placeholder-retro-text-dim"
                  />
                  {query && (
                    <button type="button" onClick={() => setQuery('')} className="absolute ltr:right-0 rtl:left-0 top-1 text-retro-text-dim hover:text-retro-text transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  )}
                </form>
                <button onClick={() => setSearchOverlayOpen(false)} className="shrink-0 p-2 text-retro-text-muted hover:text-retro-text transition-colors">
                  <span className="sr-only">Close</span>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="min-h-[200px]">
                {query.length > 1 ? (
                  results.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-retro-text-muted uppercase tracking-wider mb-4">{dict.common.newArrival}</h4>
                      {results.map(product => (
                        <Link 
                          key={product.id} 
                          href={`/${locale}/product/${product.slug || product.id}`}
                          onClick={() => handleResultClick(product)}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-lg bg-retro-bg-input flex items-center justify-center shrink-0 overflow-hidden border border-retro-border group-hover:border-retro-cyan/30">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-retro-text-dim"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-retro-text truncate group-hover:text-retro-cyan transition-colors">{isRtl ? product.nameAr : product.nameEn}</p>
                            <p className="text-xs text-retro-text-secondary">{product.category}</p>
                          </div>
                          <div className="text-sm font-bold text-retro-text">
                            {(product.salePrice ?? product.sellingPrice).toLocaleString()} {dict.common.currency}
                          </div>
                        </Link>
                      ))}
                      <div className="pt-4 mt-4 border-t border-retro-border text-center">
                        <button onClick={handleSubmit} className="text-sm font-bold text-retro-cyan hover:text-retro-cyan-muted transition-colors">
                          {dict.common.viewAll} ({dict.search.results.replace('{count}', '+').replace('{query}', query)})
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-retro-text-muted">
                      {dict.search.noResults.replace('{query}', query)}
                    </div>
                  )
                ) : (
                  recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold text-retro-text-muted uppercase tracking-wider">{dict.search.recent}</h4>
                        <button onClick={clearRecentSearches} className="text-xs font-semibold text-retro-text-dim hover:text-retro-red transition-colors">
                          {dict.filter.clearAll}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map(term => (
                          <button
                            key={term}
                            onClick={() => {
                              setQuery(term);
                            }}
                            className="px-4 py-2 rounded-xl bg-retro-bg-input border border-retro-border text-sm font-medium text-retro-text-secondary hover:text-retro-text hover:border-retro-cyan/30 transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
