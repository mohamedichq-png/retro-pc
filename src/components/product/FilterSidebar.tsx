// RETRO Qatar — Filter Sidebar Component
// Comprehensive catalog filter with categories, brands, price presets, conditions, platforms, and PC hardware specs

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
  platforms: string[];
  sections: string[];
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
const REFRESH_OPTIONS = ['144Hz', '165Hz', '240Hz', '360Hz'];

const SECTION_OPTIONS = [
  { id: 'consoles', labelEn: 'Consoles / Systems', labelAr: 'أجهزة الألعاب' },
  { id: 'accessories', labelEn: 'Accessories & Controllers', labelAr: 'الإكسسوارات والملحقات' },
  { id: 'games-cds', labelEn: 'Games / CDs / Discs', labelAr: 'الألعاب والأقراص' },
];

const PLATFORM_OPTIONS = [
  { id: 'PlayStation', labelEn: 'PlayStation (PS1-PS5 / PSP)', labelAr: 'بلايستيشن (PS1-PS5 / PSP)' },
  { id: 'Nintendo', labelEn: 'Nintendo (Switch / GB / DS)', labelAr: 'نينتندو (سويتش / جيم بوي)' },
  { id: 'Xbox', labelEn: 'Xbox (Original / 360 / One / Series)', labelAr: 'إكس بوكس (الأصلي / 360 / ون)' },
  { id: 'Retro', labelEn: 'Retro (Sega / Atari / Amiga)', labelAr: 'ريترو كلاسيك (سيجا / أتاري)' },
  { id: 'PC', labelEn: 'PC Hardware & Components', labelAr: 'مكونات وحواسيب PC' },
];

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
    platforms: [],
    sections: [],
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

  const toggleArrayItem = (key: keyof FilterState, item: string) => {
    const current = (filters[key] as string[]) || [];
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
      platforms: [],
      sections: [],
      sockets: [],
      vram: [],
      refreshRates: [],
    };
    setFilters(empty);
    onFilterChange(empty);
  };

  // Contextual spec filters
  const showSockets = categorySlug === 'pc' || categorySlug === 'pc-components' || filters.categories.includes('CPUs') || filters.categories.includes('Motherboards');
  const showVram = categorySlug === 'pc' || categorySlug === 'pc-components' || filters.categories.includes('GPUs');
  const showRefresh = categorySlug === 'monitors' || filters.categories.includes('Monitors');

  const FilterContent = () => (
    <div className="space-y-6 text-xs">
      
      {/* Availability / In Stock */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-retro-text uppercase tracking-wider">
          {dict.filter?.availability || (isRtl ? 'التوفر' : 'Availability')}
        </h4>
        <label className="flex items-center gap-3 cursor-pointer group select-none">
          <div className={`w-4.5 h-4.5 rounded-lg border flex items-center justify-center transition-all ${filters.inStock ? 'bg-retro-cyan border-retro-cyan text-retro-bg' : 'border-retro-border bg-retro-bg-input group-hover:border-retro-cyan/50'}`}>
            {filters.inStock && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
          </div>
          <span className="font-semibold text-retro-text-secondary group-hover:text-retro-text transition-colors">
            {dict.filter?.inStockOnly || (isRtl ? 'المتوفر في المخزن فقط' : 'In Stock Only')}
          </span>
          <input type="checkbox" className="hidden" checked={filters.inStock} onChange={(e) => updateFilter('inStock', e.target.checked)} />
        </label>
      </div>

      {/* Condition (New / Used / Refurbished) */}
      <div className="space-y-3 pt-4 border-t border-retro-border">
        <h4 className="text-xs font-black text-retro-text uppercase tracking-wider">
          {dict.filter?.condition || (isRtl ? 'الحالة' : 'Condition')}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'New', labelAr: 'جديد', labelEn: 'New' },
            { id: 'Refurbished', labelAr: 'مجدد ومفحوص', labelEn: 'Refurbished' },
            { id: 'Used', labelAr: 'مستعمل', labelEn: 'Used' },
          ].map((cond) => {
            const isSelected = filters.condition.includes(cond.id);
            return (
              <button
                key={cond.id}
                type="button"
                onClick={() => toggleArrayItem('condition', cond.id)}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-retro-cyan text-retro-bg border-retro-cyan shadow-sm'
                    : 'bg-retro-bg-input text-retro-text-secondary border-retro-border hover:border-retro-cyan/40'
                }`}
              >
                {isRtl ? cond.labelAr : cond.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-Level Section / Product Type Filter */}
      <div className="space-y-3 pt-4 border-t border-retro-border">
        <h4 className="text-xs font-black text-retro-text uppercase tracking-wider">
          {isRtl ? 'نوع المنتج / القسم (Section)' : 'Product Type (Section)'}
        </h4>
        <div className="space-y-2">
          {SECTION_OPTIONS.map((sec) => {
            const isSelected = filters.sections.includes(sec.id);
            return (
              <label key={sec.id} className="flex items-center justify-between cursor-pointer group select-none">
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-retro-cyan border-retro-cyan text-retro-bg' : 'border-retro-border bg-retro-bg-input group-hover:border-retro-cyan/50'}`}>
                    {isSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                  </div>
                  <span className="font-semibold text-retro-text-secondary group-hover:text-retro-text transition-colors">
                    {isRtl ? sec.labelAr : sec.labelEn}
                  </span>
                </div>
                <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleArrayItem('sections', sec.id)} />
              </label>
            );
          })}
        </div>
      </div>

      {/* Platform Filter */}
      <div className="space-y-3 pt-4 border-t border-retro-border">
        <h4 className="text-xs font-black text-retro-text uppercase tracking-wider">
          {dict.filter?.platform || (isRtl ? 'المنصة (Platform)' : 'Platform')}
        </h4>
        <div className="space-y-2">
          {PLATFORM_OPTIONS.map((plat) => {
            const isSelected = filters.platforms.includes(plat.id);
            return (
              <label key={plat.id} className="flex items-center justify-between cursor-pointer group select-none">
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-retro-purple border-retro-purple text-retro-bg' : 'border-retro-border bg-retro-bg-input group-hover:border-retro-purple/50'}`}>
                    {isSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                  </div>
                  <span className="font-semibold text-retro-text-secondary group-hover:text-retro-text transition-colors">
                    {isRtl ? plat.labelAr : plat.labelEn}
                  </span>
                </div>
                <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleArrayItem('platforms', plat.id)} />
              </label>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      {availableCategories.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-retro-border">
          <h4 className="text-xs font-black text-retro-text uppercase tracking-wider">
            {dict.filter?.category || (isRtl ? 'الأقسام' : 'Categories')}
          </h4>
          <div className="space-y-2 max-h-[180px] overflow-y-auto scrollbar-thin ltr:pr-2 rtl:pl-2">
            {availableCategories.map(cat => (
              <label key={cat.id} className="flex items-center justify-between cursor-pointer group select-none">
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${filters.categories.includes(cat.id) ? 'bg-retro-cyan border-retro-cyan text-retro-bg' : 'border-retro-border bg-retro-bg-input group-hover:border-retro-cyan/50'}`}>
                    {filters.categories.includes(cat.id) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                  </div>
                  <span className="font-semibold text-retro-text-secondary group-hover:text-retro-text transition-colors">{cat.label}</span>
                </div>
                <span className="text-[10px] text-retro-text-dim bg-retro-bg-elevated px-2 py-0.5 rounded-md border border-retro-border">{cat.count}</span>
                <input type="checkbox" className="hidden" checked={filters.categories.includes(cat.id)} onChange={() => toggleArrayItem('categories', cat.id)} />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      {availableBrands.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-retro-border">
          <h4 className="text-xs font-black text-retro-text uppercase tracking-wider">
            {dict.filter?.brand || (isRtl ? 'العلامة التجارية' : 'Brand')}
          </h4>
          <div className="space-y-2 max-h-[180px] overflow-y-auto scrollbar-thin ltr:pr-2 rtl:pl-2">
            {availableBrands.map(brand => (
              <label key={brand.id} className="flex items-center justify-between cursor-pointer group select-none">
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${filters.brands.includes(brand.id) ? 'bg-retro-purple border-retro-purple text-retro-bg' : 'border-retro-border bg-retro-bg-input group-hover:border-retro-purple/50'}`}>
                    {filters.brands.includes(brand.id) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                  </div>
                  <span className="font-semibold text-retro-text-secondary group-hover:text-retro-text transition-colors">{brand.label}</span>
                </div>
                <span className="text-[10px] text-retro-text-dim bg-retro-bg-elevated px-2 py-0.5 rounded-md border border-retro-border">{brand.count}</span>
                <input type="checkbox" className="hidden" checked={filters.brands.includes(brand.id)} onChange={() => toggleArrayItem('brands', brand.id)} />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Contextual Technical Specs Filters */}
      {showSockets && (
        <div className="space-y-3 pt-4 border-t border-retro-border">
          <h4 className="text-xs font-black text-retro-text uppercase tracking-wider">
            {isRtl ? 'نوع المقبس (Socket)' : 'Socket Type'}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {SOCKET_OPTIONS.map(socket => {
              const isSelected = filters.sockets.includes(socket);
              return (
                <button
                  key={socket}
                  type="button"
                  onClick={() => toggleArrayItem('sockets', socket)}
                  className={`px-2.5 py-1 rounded-lg border text-[10.5px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-retro-cyan text-retro-bg border-retro-cyan'
                      : 'bg-retro-bg-input text-retro-text-secondary border-retro-border hover:border-retro-cyan/30'
                  }`}
                >
                  {socket}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showVram && (
        <div className="space-y-3 pt-4 border-t border-retro-border">
          <h4 className="text-xs font-black text-retro-text uppercase tracking-wider">
            {isRtl ? 'ذاكرة كرت الشاشة (VRAM)' : 'Graphics Memory'}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {VRAM_OPTIONS.map(v => {
              const isSelected = filters.vram.includes(v);
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => toggleArrayItem('vram', v)}
                  className={`px-2.5 py-1 rounded-lg border text-[10.5px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-retro-purple text-retro-bg border-retro-purple'
                      : 'bg-retro-bg-input text-retro-text-secondary border-retro-border hover:border-retro-purple/30'
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showRefresh && (
        <div className="space-y-3 pt-4 border-t border-retro-border">
          <h4 className="text-xs font-black text-retro-text uppercase tracking-wider">
            {isRtl ? 'معدل التحديث' : 'Refresh Rate'}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {REFRESH_OPTIONS.map(rate => {
              const isSelected = filters.refreshRates.includes(rate);
              return (
                <button
                  key={rate}
                  type="button"
                  onClick={() => toggleArrayItem('refreshRates', rate)}
                  className={`px-2.5 py-1 rounded-lg border text-[10.5px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-retro-cyan text-retro-bg border-retro-cyan'
                      : 'bg-retro-bg-input text-retro-text-secondary border-retro-border hover:border-retro-cyan/30'
                  }`}
                >
                  {rate}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-3 pt-4 border-t border-retro-border">
        <h4 className="text-xs font-black text-retro-text uppercase tracking-wider">
          {dict.filter?.price || (isRtl ? 'نطاق السعر (ر.ق)' : 'Price Range (QAR)')}
        </h4>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder={dict.filter?.priceMin || '0'}
            value={filters.priceRange[0] || ''}
            onChange={(e) => updateFilter('priceRange', [Number(e.target.value) || 0, filters.priceRange[1]])}
            className="w-full rounded-xl bg-retro-bg-input border border-retro-border px-3 py-2 text-xs text-retro-text focus:border-retro-cyan/50 focus:outline-none"
          />
          <span className="text-retro-text-dim">-</span>
          <input 
            type="number" 
            placeholder={dict.filter?.priceMax || '50,000'}
            value={filters.priceRange[1] === 50000 ? '' : filters.priceRange[1]}
            onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value) || 50000])}
            className="w-full rounded-xl bg-retro-bg-input border border-retro-border px-3 py-2 text-xs text-retro-text focus:border-retro-cyan/50 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Trigger */}
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <Button 
          variant="secondary" 
          onClick={() => setIsMobileOpen(true)}
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>}
          className="text-xs font-bold"
        >
          {dict.filter?.filters || 'Filters'}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block w-[280px] shrink-0 border border-retro-border bg-retro-bg-card rounded-3xl p-6 shadow-xl ${className}`}>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-retro-border">
          <h3 className="text-sm font-black text-retro-text">{dict.filter?.filters || 'Filters'}</h3>
          <button onClick={clearAll} className="text-[11px] font-bold text-retro-cyan hover:underline transition-colors cursor-pointer">
            {dict.filter?.clearAll || 'Clear All'}
          </button>
        </div>
        <FilterContent />
      </aside>

      {/* Mobile Bottom Sheet / Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className={`relative w-[320px] max-w-[85vw] h-full bg-retro-bg-card border-retro-border p-6 overflow-y-auto shadow-2xl flex flex-col justify-between ${isRtl ? 'border-l ml-auto' : 'border-r'}`}>
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-retro-border">
                <h3 className="text-sm font-black text-retro-text">{dict.filter?.filters || 'Filters'}</h3>
                <button onClick={() => setIsMobileOpen(false)} className="p-2 text-retro-text-muted hover:text-retro-text">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <FilterContent />
            </div>

            <div className="mt-8 pt-6 border-t border-retro-border space-y-2">
              <Button fullWidth onClick={() => setIsMobileOpen(false)} className="font-black text-xs">
                {isRtl ? 'تطبيق الفلاتر' : 'Apply Filters'}
              </Button>
              <button onClick={clearAll} className="w-full text-center py-2 text-xs font-bold text-retro-text-dim hover:text-retro-pink transition-colors">
                {dict.filter?.clearAll || 'Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
