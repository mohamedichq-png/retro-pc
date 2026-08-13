// RETRO Qatar — Products Content (Client Component)

'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FilterSidebar } from '@/components/product/FilterSidebar';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import type { Product } from '@/types';
import type { Dictionary, Locale } from '@/i18n/dictionaries';
import { MAIN_CATEGORIES } from '@/lib/constants';

interface ProductsContentProps {
  dict: Dictionary;
  locale: Locale;
  initialProducts: Product[];
  categorySlug?: string; // Optional: if provided, we are on a category page
}

export function ProductsContent({ dict, locale, initialProducts, categorySlug }: ProductsContentProps) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [products] = useState<Product[]>(initialProducts);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    priceRange: [0, 50000] as [number, number],
    inStock: false,
    condition: [] as string[],
    sockets: [] as string[],
    vram: [] as string[],
    refreshRates: [] as string[],
  });
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Category mapping constants to group subcategories under parent routes
  const CATEGORY_MAP = useMemo<Record<string, string[]>>(() => ({
    'pc': ['CPU', 'CPUs', 'GPU', 'GPUs', 'Motherboards', 'RAM', 'Storage', 'SSD', 'PSU', 'PSUs', 'PC Cases', 'Cases', 'Cooling', 'Fans', 'Thermal Products', 'Cables', 'Networking', 'Gaming PCs'],
    'gaming': ['Consoles', 'Games', 'Controllers', 'Gaming Accessories', 'PlayStation', 'Nintendo', 'Consoles & Accessories'],
    'retro-gaming': ['PlayStation 1', 'PlayStation 2', 'PlayStation 3', 'Classic Xbox', 'Classic Nintendo', 'Nintendo 64', 'GameCube', 'Game Boy', 'PSP', 'PS Vita', 'Sega', 'Atari', 'Arcade', 'Retro Handhelds', 'Retro Controllers', 'Retro Games', 'Retro Accessories', 'Collectibles', 'Pre-Owned Retro', 'Retro Consoles & Games'],
    'monitors': ['Monitors'],
    'accessories': ['Accessories', 'Gaming Keyboards', 'Gaming Mice', 'Mousepads', 'Headsets', 'Microphones', 'Webcams', 'Streaming', 'RGB Lighting', 'Gaming Chairs', 'Gaming Desks', 'Monitor Arms', 'Cables', 'Adapters'],
    'laptops': ['Laptops', 'Gaming Laptops', 'Business Laptops', 'Student Laptops']
  }), []);

  // Derive available categories and brands for the sidebar based on the *current* dataset
  const availableCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([id, count]) => {
      const cat = MAIN_CATEGORIES.find(c => c.id === id);
      const label = cat ? (locale === 'ar' ? cat.nameAr : cat.nameEn) : id;
      return { id, label, count };
    }).sort((a, b) => b.count - a.count);
  }, [products, locale]);

  const availableBrands = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      if (p.brand) counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([id, count]) => ({ id, label: id, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // Filter and Sort logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.nameEn.toLowerCase().includes(q) || 
        p.nameAr.includes(q) || 
        p.brand?.toLowerCase().includes(q)
      );
    }

    // 2. Category Route Override (if on a specific category page)
    if (categorySlug) {
      const allowedCategories = CATEGORY_MAP[categorySlug];
      if (allowedCategories) {
        result = result.filter(p => allowedCategories.includes(p.category));
      } else {
        const categoryId = MAIN_CATEGORIES.find(c => c.slugEn === categorySlug)?.id;
        if (categoryId) {
          result = result.filter(p => p.category === categoryId);
        }
      }
    } else if (filters.categories.length > 0) {
      // 3. Sidebar Categories (only if not forced by route)
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // 3.5 SubCategory Query Param Filter (from Mega Menu clicks)
    const subCategoryParam = searchParams.get('subCategory') || '';
    if (subCategoryParam) {
      result = result.filter(p => p.subCategory?.toLowerCase() === subCategoryParam.toLowerCase());
    }

    // 3.6 Sockets Spec Filter
    if (filters.sockets.length > 0) {
      result = result.filter(p => p.specs && p.specs.socket && filters.sockets.includes(p.specs.socket));
    }

    // 3.7 VRAM Spec Filter
    if (filters.vram.length > 0) {
      result = result.filter(p => {
        if (!p.specs || !p.specs.vram) return false;
        const pVram = String(p.specs.vram).toLowerCase();
        return filters.vram.some(v => pVram.includes(v.toLowerCase()));
      });
    }

    // 3.8 Refresh Rate Spec Filter
    if (filters.refreshRates.length > 0) {
      result = result.filter(p => p.specs && p.specs.refreshRate && filters.refreshRates.includes(p.specs.refreshRate));
    }

    // 4. Brands
    if (filters.brands.length > 0) {
      result = result.filter(p => p.brand && filters.brands.includes(p.brand));
    }

    // 5. In Stock Only
    if (filters.inStock) {
      result = result.filter(p => p.stockQty > 0);
    }

    // 6. Price Range
    result = result.filter(p => {
      const price = p.salePrice ?? p.sellingPrice;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // 7. Sort
    result.sort((a, b) => {
      const priceA = a.salePrice ?? a.sellingPrice;
      const priceB = b.salePrice ?? b.sellingPrice;
      
      switch (sortBy) {
        case 'price-asc': return priceA - priceB;
        case 'price-desc': return priceB - priceA;
        case 'name-asc': return a.nameEn.localeCompare(b.nameEn);
        case 'name-desc': return b.nameEn.localeCompare(a.nameEn);
        default: return 0; // 'newest'
      }
    });

    return result;
  }, [products, filters, sortBy, searchQuery, categorySlug, searchParams, CATEGORY_MAP]);

  const breadcrumbs = [
    { label: dict.nav.home, href: `/${locale}` },
    categorySlug 
      ? { label: dict.nav.shop, href: `/${locale}/products` }
      : { label: dict.nav.shop },
    categorySlug && { 
      label: MAIN_CATEGORIES.find(c => c.slugEn === categorySlug) 
        ? (locale === 'ar' ? MAIN_CATEGORIES.find(c => c.slugEn === categorySlug)!.nameAr : MAIN_CATEGORIES.find(c => c.slugEn === categorySlug)!.nameEn) 
        : categorySlug 
    }
  ].filter(Boolean) as { label: string; href?: string }[];

  const pageTitle = categorySlug
    ? (MAIN_CATEGORIES.find(c => c.slugEn === categorySlug) 
        ? (locale === 'ar' ? MAIN_CATEGORIES.find(c => c.slugEn === categorySlug)!.nameAr : MAIN_CATEGORIES.find(c => c.slugEn === categorySlug)!.nameEn) 
        : categorySlug)
    : searchQuery 
      ? dict.search.results.replace('{count}', String(filteredAndSortedProducts.length)).replace('{query}', searchQuery)
      : dict.nav.shop;

  return (
    <div className="bg-retro-bg min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb items={breadcrumbs} className="mb-6" />
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-[280px] shrink-0">
            <FilterSidebar 
              dict={dict} 
              locale={locale} 
              categorySlug={categorySlug}
              availableCategories={categorySlug ? [] : availableCategories} // Hide categories if on a category page
              availableBrands={availableBrands}
              onFilterChange={setFilters}
              className="sticky top-24"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-retro-text">{pageTitle}</h1>
                <p className="text-sm text-retro-text-secondary mt-1">
                  {dict.filter.showing.replace('{count}', String(filteredAndSortedProducts.length))}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-retro-bg-card border border-retro-border text-sm text-retro-text rounded-xl px-4 py-2 focus:outline-none focus:border-retro-cyan/50"
                >
                  <option value="newest">{dict.filter.sortNewest}</option>
                  <option value="price-asc">{dict.filter.sortPriceLow}</option>
                  <option value="price-desc">{dict.filter.sortPriceHigh}</option>
                  <option value="name-asc">{dict.filter.sortNameAZ}</option>
                  <option value="name-desc">{dict.filter.sortNameZA}</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <ProductGrid 
              products={filteredAndSortedProducts} 
              dict={dict} 
              locale={locale} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
