// RETRO Qatar — Filter Sidebar Component

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  inStock: boolean;
  condition: string[];
  sockets: string[];
  vram: string[];
  refreshRates: string[];
}

interface FilterSidebarProps {
  dict: Dictionary;
  locale: Locale;
  categorySlug?: string;
  availableCategories?: { id: string; label: string; count: number }[];
  availableBrands?: { id: string; label: string; count: number }[];
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

const SOCKET_OPTIONS = ['AM5', 'LGA1700', 'AM4', 'LGA1200'];
const VRAM_OPTIONS = ['8GB', '12GB', '16GB', '24GB'];
const REFRESH_OPTIONS = ['144Hz', '165Hz', '210Hz', '240Hz', '360Hz'];

export function FilterSidebar({ 
  dict, 
  locale, 
  categorySlug = '',
  availableCategories = [], 
  availableBrands = [], 
  onFilterChange, 
  className = '' 
}: FilterSidebarProps) {
  const isRtl = locale === 'ar';
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 50000],
    inStock: false,
    condition: [],
    sockets: [],
    vram: [],
    refreshRates: [],
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleArrayItem = (key: 'categories' | 'brands' | 'condition' | 'sockets' | 'vram' | 'refreshRates', item: string) => {
    const current = filters[key];
    const updated = current.includes(item) 
      ? current.filter(i => i !== item)
      : [...current, item];
    updateFilter(key, updated);
  };

  const clearAll = () => {
    const empty: FilterState = {
      categories: [],
      brands: [],
      priceRange: [0, 50000],
      inStock: false,
      condition: [],
      sockets: [],
      vram: [],
      refreshRates: [],
    };
    setFilters(empty);
    onFilterChange(empty);
  };

  // Contextual displays
  const showSockets = categorySlug === 'pc-components' || filters.categories.includes('CPUs') || filters.categories.includes('Motherboards');
  const showVram = categorySlug === 'pc-components' || filters.categories.includes('GPUs');
  const showRefresh = categorySlug === 'monitors' || filters.categories.includes('Monitors');

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Availability */}
      <div>
        <h4 className="text-sm font-bold text-retro-text mb-4 uppercase tracking-wider">{dict.filter.availability}</h4>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.inStock ? 'bg-retro-cyan border-retro-cyan text-retro-bg' : 'border-retro-border bg-retro-bg-input group-hover:border-retro-cyan/50'}`}>
            {filters.inStock && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
          </div>
          <span className="text-sm text-retro-text-secondary group-hover:text-retro-text transition-colors">
            {dict.filter.inStockOnly}
          </span>
          <input type="checkbox" className="hidden" checked={filters.inStock} onChange={(e) => updateFilter('inStock', e.target.checked)} />
        </label>
      </div>

      {/* Categories */}
      {availableCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-retro-text mb-4 uppercase tracking-wider">{dict.product.category}</h4>
          <div className="space-y-2.5 max-h-[200px] overflow-y-auto scrollbar-thin ltr:pr-2 rtl:pl-2">
            {availableCategories.map(cat => (
              <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.categories.includes(cat.id) ? 'bg-retro-purple border-retro-purple text-retro-bg' : 'border-retro-border bg-retro-bg-input group-hover:border-retro-purple/50'}`}>
                    {filters.categories.includes(cat.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                  </div>
                  <span className="text-sm text-retro-text-secondary group-hover:text-retro-text transition-colors">{cat.label}</span>
                </div>
                <span className="text-xs text-retro-text-dim bg-retro-bg-elevated px-2 py-0.5 rounded-full">{cat.count}</span>
                <input type="checkbox" className="hidden" checked={filters.categories.includes(cat.id)} onChange={() => toggleArrayItem('categories', cat.id)} />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      {availableBrands.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-retro-text mb-4 uppercase tracking-wider">{dict.filter.brand}</h4>
          <div className="space-y-2.5 max-h-[200px] overflow-y-auto scrollbar-thin ltr:pr-2 rtl:pl-2">
            {availableBrands.map(brand => (
              <label key={brand.id} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.brands.includes(brand.id) ? 'bg-retro-cyan border-retro-cyan text-retro-bg' : 'border-retro-border bg-retro-bg-input group-hover:border-retro-cyan/50'}`}>
                    {filters.brands.includes(brand.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                  </div>
                  <span className="text-sm text-retro-text-secondary group-hover:text-retro-text transition-colors">{brand.label}</span>
                </div>
                <span className="text-xs text-retro-text-dim bg-retro-bg-elevated px-2 py-0.5 rounded-full">{brand.count}</span>
                <input type="checkbox" className="hidden" checked={filters.brands.includes(brand.id)} onChange={() => toggleArrayItem('brands', brand.id)} />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Contextual Technical Specs Filters */}
      {showSockets && (
        <div>
          <h4 className="text-sm font-bold text-retro-text mb-4 uppercase tracking-wider">
            {isRtl ? 'نوع المقبس (Socket)' : 'Socket Type'}
          </h4>
          <div className="space-y-2.5">
            {SOCKET_OPTIONS.map(socket => (
              <label key={socket} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.sockets.includes(socket) ? 'bg-retro-cyan border-retro-cyan text-retro-bg' : 'border-retro-border bg-retro-bg-input group-hover:border-retro-cyan/50'}`}>
                  {filters.sockets.includes(socket) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
                <span className="text-sm text-retro-text-secondary group-hover:text-retro-text transition-colors">{socket}</span>
                <input type="checkbox" className="hidden" checked={filters.sockets.includes(socket)} onChange={() => toggleArrayItem('sockets', socket)} />
              </label>
            ))}
          </div>
        </div>
      )}

      {showVram && (
        <div>
          <h4 className="text-sm font-bold text-retro-text mb-4 uppercase tracking-wider">
            {isRtl ? 'ذاكرة كرت الشاشة (VRAM)' : 'Graphics Memory (VRAM)'}
          </h4>
          <div className="space-y-2.5">
            {VRAM_OPTIONS.map(v => (
              <label key={v} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.vram.includes(v) ? 'bg-retro-purple border-retro-purple text-retro-bg' : 'border-retro-border bg-retro-bg-input group-hover:border-retro-purple/50'}`}>
                  {filters.vram.includes(v) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
                <span className="text-sm text-retro-text-secondary group-hover:text-retro-text transition-colors">{v}</span>
                <input type="checkbox" className="hidden" checked={filters.vram.includes(v)} onChange={() => toggleArrayItem('vram', v)} />
              </label>
            ))}
          </div>
        </div>
      )}

      {showRefresh && (
        <div>
          <h4 className="text-sm font-bold text-retro-text mb-4 uppercase tracking-wider">
            {isRtl ? 'معدل التحديث' : 'Refresh Rate'}
          </h4>
          <div className="space-y-2.5">
            {REFRESH_OPTIONS.map(rate => (
              <label key={rate} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.refreshRates.includes(rate) ? 'bg-retro-cyan border-retro-cyan text-retro-bg' : 'border-retro-border bg-retro-bg-input group-hover:border-retro-cyan/50'}`}>
                  {filters.refreshRates.includes(rate) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
                <span className="text-sm text-retro-text-secondary group-hover:text-retro-text transition-colors">{rate}</span>
                <input type="checkbox" className="hidden" checked={filters.refreshRates.includes(rate)} onChange={() => toggleArrayItem('refreshRates', rate)} />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-bold text-retro-text mb-4 uppercase tracking-wider">{dict.filter.price}</h4>
        <div className="flex items-center gap-3">
          <input 
            type="number" 
            placeholder={dict.filter.priceMin}
            value={filters.priceRange[0] || ''}
            onChange={(e) => updateFilter('priceRange', [Number(e.target.value) || 0, filters.priceRange[1]])}
            className="w-full rounded-xl bg-retro-bg-input border border-retro-border px-3 py-2 text-sm text-retro-text focus:border-retro-cyan/50 focus:outline-none"
          />
          <span className="text-retro-text-dim">-</span>
          <input 
            type="number" 
            placeholder={dict.filter.priceMax}
            value={filters.priceRange[1] || ''}
            onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value) || 0])}
            className="w-full rounded-xl bg-retro-bg-input border border-retro-border px-3 py-2 text-sm text-retro-text focus:border-retro-cyan/50 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <Button variant="secondary" onClick={() => setIsMobileOpen(!isMobileOpen)} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>}>
          {dict.filter.filters}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block w-[280px] shrink-0 border border-retro-border bg-retro-bg-card rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-retro-border">
          <h3 className="text-lg font-black text-retro-text">{dict.filter.filters}</h3>
          <button onClick={clearAll} className="text-xs font-semibold text-retro-text-dim hover:text-retro-red transition-colors">
            {dict.filter.clearAll}
          </button>
        </div>
        <FilterContent />
      </aside>

      {/* Mobile Sidebar Modal */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className={`relative w-[300px] max-w-[85vw] h-full bg-retro-bg-card border-retro-border p-6 overflow-y-auto ${isRtl ? 'border-l ml-auto' : 'border-r'}`}>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-retro-border">
              <h3 className="text-lg font-black text-retro-text">{dict.filter.filters}</h3>
              <button onClick={() => setIsMobileOpen(false)} className="p-2 text-retro-text-muted hover:text-retro-text">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <FilterContent />
            <div className="mt-8 pt-6 border-t border-retro-border">
              <Button fullWidth onClick={() => setIsMobileOpen(false)}>{dict.common.seeMore}</Button>
              <button onClick={clearAll} className="w-full mt-4 text-sm font-semibold text-retro-text-dim hover:text-retro-red transition-colors">
                {dict.filter.clearAll}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

