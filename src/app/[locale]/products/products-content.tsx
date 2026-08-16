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
    platforms: [] as string[],
    sockets: [] as string[],
    vram: [] as string[],
    refreshRates: [] as string[],
  });
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Category mapping constants to group subcategories under parent routes
  const CATEGORY_MAP = useMemo<Record<string, string[]>>(() => ({
    // 5 Main Catalog Sections
    'playstation': ['playstation', 'PlayStation', 'PS1', 'PS2', 'PS3', 'PS4', 'PS5', 'PlayStation 1', 'PlayStation 2', 'PlayStation 3'],
    'psp': ['psp', 'PSP', 'PlayStation Portable', 'PS Vita'],
    'xbox': ['xbox', 'Xbox', 'Classic Xbox', 'Xbox 360', 'Xbox One', 'Xbox Series'],
    'nintendo': ['nintendo', 'Nintendo', 'Classic Nintendo', 'Nintendo 64', 'GameCube', 'Game Boy', 'Game Boy Advance', 'Nintendo DS', 'Nintendo 3DS', 'Wii', 'Wii U', 'Nintendo Switch'],
    'retro-gaming-classics': ['retro-gaming-classics', 'Retro Gaming Classics', 'Retro Gaming', 'Sega', 'Atari', 'SNK', 'Neo Geo', 'Arcade', 'Retro Consoles & Games'],

    // Header & CategoryNav routes
    'retro-gaming': ['retro-gaming', 'retro-gaming-classics', 'Retro Gaming', 'Retro Gaming Classics', 'playstation', 'psp', 'xbox', 'nintendo', 'PlayStation 1', 'PlayStation 2', 'PlayStation 3', 'Classic Xbox', 'Classic Nintendo', 'Nintendo 64', 'GameCube', 'Game Boy', 'PS Vita', 'Sega', 'Atari', 'Arcade', 'Retro Handhelds', 'Retro Controllers', 'Retro Games', 'Retro Accessories', 'Collectibles', 'Pre-Owned Retro', 'Retro Consoles & Games'],
    'gaming': ['gaming', 'Consoles', 'Games', 'Controllers', 'Gaming Accessories', 'PlayStation', 'Nintendo', 'Consoles & Accessories', 'playstation', 'psp', 'xbox', 'nintendo', 'retro-gaming-classics'],
    'consoles-games': ['gaming', 'Consoles', 'Games', 'Controllers', 'Gaming Accessories', 'PlayStation', 'Nintendo', 'Consoles & Accessories', 'playstation', 'psp', 'xbox', 'nintendo', 'retro-gaming-classics'],
    'computers': ['computers', 'gaming-pcs', 'Gaming PCs', 'PC Cases', 'Cases', 'Cooling', 'Pre-Built PC', 'Custom PC'],
    'gaming-pcs': ['computers', 'gaming-pcs', 'Gaming PCs', 'PC Cases', 'Cases', 'Cooling', 'Pre-Built PC', 'Custom PC'],
    'pc': ['pc', 'pc-components', 'CPU', 'CPUs', 'GPU', 'GPUs', 'Motherboards', 'Motherboard', 'RAM', 'Storage', 'SSD', 'PSU', 'PSUs', 'PC Cases', 'Cases', 'Cooling', 'Fans', 'Thermal Products', 'Cables', 'Networking', 'Gaming PCs'],
    'pc-components': ['pc', 'pc-components', 'CPU', 'CPUs', 'GPU', 'GPUs', 'Motherboards', 'Motherboard', 'RAM', 'Storage', 'SSD', 'PSU', 'PSUs', 'PC Cases', 'Cases', 'Cooling', 'Fans', 'Thermal Products', 'Cables', 'Networking', 'Gaming PCs'],
    'monitors': ['monitors', 'Monitors', 'Monitor'],
    'accessories': ['accessories', 'Accessories', 'Controllers', 'Gaming Accessories', 'Consoles & Accessories', 'Gaming Keyboards', 'Gaming Mice', 'Mousepads', 'Headsets', 'Microphones', 'Webcams', 'Streaming', 'RGB Lighting', 'Gaming Chairs', 'Gaming Desks', 'Monitor Arms', 'Cables', 'Adapters'],
    'laptops': ['laptops', 'Laptops', 'Gaming Laptops', 'Business Laptops', 'Student Laptops', 'Laptop'],
  }), []);

  // Derive available categories and brands for the sidebar based on the *current* dataset
  const availableCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([id, count]) => {
      const cat = MAIN_CATEGORIES.find(c => c.id === id || c.slugEn === id);
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
        p.brand?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.model?.toLowerCase().includes(q)
      );
    }

    // 2. Category Route or Query Param Filter
    const activeCategoryParam = categorySlug || searchParams.get('category') || '';
    if (activeCategoryParam && activeCategoryParam !== 'all' && activeCategoryParam !== 'all-categories') {
      const allowedCategories = CATEGORY_MAP[activeCategoryParam] || CATEGORY_MAP[activeCategoryParam.toLowerCase()];
      if (allowedCategories) {
        result = result.filter(p => {
          const pCat = (p.category || '').toLowerCase();
          const pCatEn = (p.categoryEn || '').toLowerCase();
          const pPlat = (p.platform || '').toLowerCase();
          const pType = (p.productType || '').toLowerCase();
          const pSku = (p.sku || '').toLowerCase();
          const pId = (p.id || '').toLowerCase();

          // 1. Direct allowed category / platform match
          if (allowedCategories.some(c => c.toLowerCase() === pCat || c.toLowerCase() === pCatEn || c.toLowerCase() === pPlat)) {
            return true;
          }

          // 2. Specific Section SKU mappings
          if (activeCategoryParam === 'playstation') return pSku.startsWith('play-') || pPlat.includes('playstation') || pCat.includes('playstation');
          if (activeCategoryParam === 'psp') return pSku.startsWith('psp-') || pPlat.includes('psp') || pCat.includes('psp');
          if (activeCategoryParam === 'xbox') return pSku.startsWith('xbox-') || pPlat.includes('xbox') || pCat.includes('xbox');
          if (activeCategoryParam === 'nintendo') return pSku.startsWith('nin-') || pPlat.includes('nintendo') || pCat.includes('nintendo');
          if (activeCategoryParam === 'retro-gaming-classics') return pSku.startsWith('retro-') || pId.startsWith('p-retro-') || pPlat.includes('retro') || pCat.includes('retro');
          
          if (activeCategoryParam === 'retro-gaming') {
            return pSku.startsWith('play-') || pSku.startsWith('psp-') || pSku.startsWith('xbox-') || pSku.startsWith('nin-') || pSku.startsWith('retro-') || pId.startsWith('p-retro-') || pType.includes('retro') || pCat.includes('retro');
          }
          if (activeCategoryParam === 'gaming' || activeCategoryParam === 'consoles-games') {
            return pSku.startsWith('play-') || pSku.startsWith('psp-') || pSku.startsWith('xbox-') || pSku.startsWith('nin-') || pSku.startsWith('retro-') || pId.startsWith('p-retro-') || ['playstation', 'nintendo', 'xbox', 'consoles', 'controllers', 'consoles & accessories'].includes(pCat);
          }
          if (activeCategoryParam === 'pc-components' || activeCategoryParam === 'pc') {
            return ['cpus', 'gpus', 'motherboards', 'ram', 'ssd', 'psus', 'cooling', 'cases'].includes(pCat);
          }
          if (activeCategoryParam === 'gaming-pcs' || activeCategoryParam === 'computers') {
            return pType.includes('pc') || ['cases', 'cooling', 'gaming pcs'].includes(pCat);
          }
          if (activeCategoryParam === 'monitors') {
            return pCat.includes('monitor');
          }
          if (activeCategoryParam === 'accessories') {
            return ['accessories', 'controllers', 'consoles & accessories'].includes(pCat);
          }
          if (activeCategoryParam === 'laptops') {
            return pCat.includes('laptop');
          }

          return false;
        });
      } else {
        const catObj = MAIN_CATEGORIES.find(c => c.slugEn === activeCategoryParam || c.id === activeCategoryParam);
        const targetId = catObj ? catObj.id.toLowerCase() : activeCategoryParam.toLowerCase();
        result = result.filter(p => 
          (p.category || '').toLowerCase() === targetId || 
          (p.categoryEn || '').toLowerCase() === targetId
        );
      }
    } else if (filters.categories.length > 0) {
      // 3. Sidebar Categories (only if not forced by route)
      result = result.filter(p => filters.categories.includes(p.category) || filters.categories.includes(p.categoryEn || ''));
    }

    // 3.5 SubCategory Query Param Filter (from Mega Menu clicks)
    const subCategoryParam = searchParams.get('subCategory') || '';
    if (subCategoryParam) {
      const subNorm = subCategoryParam.toLowerCase().replace(/-/g, ' ');
      result = result.filter(p => {
        const pSub = (p.subCategory || '').toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        const pPlat = (p.platform || '').toLowerCase();
        const pName = `${p.nameEn} ${p.nameAr}`.toLowerCase();
        const pSku = (p.sku || '').toLowerCase();

        if (pSub === subCategoryParam.toLowerCase() || pSub.includes(subNorm)) return true;
        if (pCat === subCategoryParam.toLowerCase() || pCat.includes(subNorm)) return true;
        if (pPlat.includes(subNorm) || pName.includes(subNorm)) return true;

        if (subCategoryParam.includes('playstation') || subCategoryParam.includes('ps1') || subCategoryParam.includes('ps2') || subCategoryParam.includes('ps3') || subCategoryParam.includes('ps4') || subCategoryParam.includes('ps5')) {
          return pSku.startsWith('play-') || pPlat.includes('playstation') || pName.includes('playstation') || pName.includes('ps');
        }
        if (subCategoryParam.includes('psp') || subCategoryParam.includes('vita')) {
          return pSku.startsWith('psp-') || pPlat.includes('psp') || pName.includes('psp');
        }
        if (subCategoryParam.includes('xbox')) {
          return pSku.startsWith('xbox-') || pPlat.includes('xbox') || pName.includes('xbox');
        }
        if (subCategoryParam.includes('nintendo') || subCategoryParam.includes('switch') || subCategoryParam.includes('3ds') || subCategoryParam.includes('gamecube') || subCategoryParam.includes('wii') || subCategoryParam.includes('pokemon') || subCategoryParam.includes('zelda')) {
          return pSku.startsWith('nin-') || pPlat.includes('nintendo') || pName.includes('nintendo') || pName.includes('switch') || pName.includes('pokemon');
        }
        if (subCategoryParam.includes('retro') || subCategoryParam.includes('sega') || subCategoryParam.includes('atari') || subCategoryParam.includes('arcade')) {
          return pSku.startsWith('retro-') || pPlat.includes('sega') || pPlat.includes('atari') || pPlat.includes('commodore') || pPlat.includes('amiga') || pName.includes('saturn') || pName.includes('c64');
        }
        if (subCategoryParam.includes('gpu') || subCategoryParam.includes('gpus')) {
          return pCat === 'gpus' || pCat === 'gpu' || pName.includes('rtx') || pName.includes('radeon') || pName.includes('geforce');
        }
        if (subCategoryParam.includes('cpu') || subCategoryParam.includes('cpus')) {
          return pCat === 'cpus' || pCat === 'cpu' || pName.includes('intel') || pName.includes('ryzen') || pName.includes('core i');
        }
        if (subCategoryParam.includes('ram')) return pCat === 'ram' || pName.includes('ram') || pName.includes('ddr');
        if (subCategoryParam.includes('ssd') || subCategoryParam.includes('storage')) return pCat === 'ssd' || pCat === 'storage' || pName.includes('ssd') || pName.includes('nvme');
        if (subCategoryParam.includes('motherboard')) return pCat === 'motherboards' || pName.includes('motherboard') || pName.includes('z790') || pName.includes('b650');
        if (subCategoryParam.includes('cooling') || subCategoryParam.includes('fan')) return pCat === 'cooling' || pName.includes('cooler') || pName.includes('aio');
        if (subCategoryParam.includes('case') || subCategoryParam.includes('chassis')) return pCat === 'cases' || pName.includes('case');
        if (subCategoryParam.includes('psu') || subCategoryParam.includes('power')) return pCat === 'psus' || pName.includes('power supply') || pName.includes('psu');
        if (subCategoryParam.includes('monitor')) return pCat === 'monitors' || pName.includes('monitor') || pName.includes('oled') || pName.includes('hz');
        if (subCategoryParam.includes('controller')) return pCat === 'controllers' || pName.includes('controller') || pName.includes('dualshock') || pName.includes('dualsense') || pName.includes('gamepad');

        return false;
      });
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

    // 3.8 Condition Filter
    if (filters.condition.length > 0) {
      result = result.filter(p => filters.condition.includes(p.condition));
    }

    // 3.9 Platform Filter
    if (filters.platforms.length > 0) {
      result = result.filter(p => {
        const text = `${p.category} ${p.nameEn} ${p.brand} ${p.platform || ''}`.toLowerCase();
        return filters.platforms.some(plat => {
          if (plat === 'PC') return text.includes('pc') || text.includes('gpu') || text.includes('cpu') || text.includes('ram');
          if (plat === 'PlayStation') return text.includes('playstation') || text.includes('ps5') || text.includes('ps4') || text.includes('ps3') || text.includes('ps2') || text.includes('ps1') || p.sku?.startsWith('PLAY-') || p.sku?.startsWith('PSP-');
          if (plat === 'Xbox') return text.includes('xbox') || p.sku?.startsWith('XBOX-');
          if (plat === 'Nintendo') return text.includes('nintendo') || text.includes('switch') || p.sku?.startsWith('NIN-');
          if (plat === 'Retro') return text.includes('retro') || p.id.startsWith('p-retro-') || p.sku?.startsWith('RETRO-');
          return false;
        });
      });
    }

    // 3.10 Sale Query Param Filter
    const saleParam = searchParams.get('sale');
    if (saleParam === 'true') {
      result = result.filter(p => p.salePrice && p.salePrice < p.sellingPrice);
    }

    // 3.11 Condition Query Param Filter
    const conditionParam = searchParams.get('condition');
    if (conditionParam) {
      result = result.filter(p => p.condition?.toLowerCase() === conditionParam.toLowerCase());
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
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) {
      result = result.filter(p => {
        const price = p.salePrice ?? p.sellingPrice;
        if (!price || price <= 0 || p.priceOnDemand) return false;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

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
