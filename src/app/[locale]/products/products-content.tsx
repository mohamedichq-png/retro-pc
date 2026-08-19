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

const CATEGORY_NAMES_MAP: Record<string, { ar: string; en: string }> = {
  'all': { ar: 'جميع الأقسام', en: 'All Categories' },
  'computers': { ar: 'أجهزة الكمبيوتر', en: 'Computers' },
  'gaming-pcs': { ar: 'تجميعات Gaming PC', en: 'Gaming PCs' },
  'pc': { ar: 'قطع الكمبيوتر', en: 'PC Components' },
  'pc-components': { ar: 'قطع الكمبيوتر', en: 'PC Components' },
  'cpus': { ar: 'المعالجات', en: 'Processors' },
  'cpu': { ar: 'المعالجات', en: 'Processors' },
  'gpus': { ar: 'كروت الشاشة', en: 'Graphics Cards' },
  'gpu': { ar: 'كروت الشاشة', en: 'Graphics Cards' },
  'motherboards': { ar: 'اللوحات الرئيسية', en: 'Motherboards' },
  'motherboard': { ar: 'اللوحات الرئيسية', en: 'Motherboards' },
  'ram': { ar: 'الذاكرة RAM', en: 'RAM Memory' },
  'storage': { ar: 'وحدات التخزين SSD', en: 'SSD Storage' },
  'ssd': { ar: 'وحدات التخزين SSD', en: 'SSD Storage' },
  'monitors': { ar: 'الشاشات', en: 'Monitors' },
  'monitor': { ar: 'الشاشات', en: 'Monitors' },
  'cooling': { ar: 'التبريد والمراوح', en: 'Cooling & Fans' },
  'cases': { ar: 'صناديق الكمبيوتر', en: 'PC Cases' },
  'pc-cases': { ar: 'صناديق الكمبيوتر', en: 'PC Cases' },
  'psus': { ar: 'مزودات الطاقة', en: 'Power Supplies' },
  'psu': { ar: 'مزودات الطاقة', en: 'Power Supplies' },
  'playstation': { ar: 'PlayStation', en: 'PlayStation' },
  'ps1': { ar: 'بلايستيشن 1', en: 'PlayStation 1' },
  'ps2': { ar: 'بلايستيشن 2', en: 'PlayStation 2' },
  'ps3': { ar: 'بلايستيشن 3', en: 'PlayStation 3' },
  'ps4': { ar: 'بلايستيشن 4', en: 'PlayStation 4' },
  'ps5': { ar: 'بلايستيشن 5', en: 'PlayStation 5' },
  'psp': { ar: 'بي إس بي / المحمول', en: 'PSP / Handhelds' },
  'xbox': { ar: 'Xbox', en: 'Xbox' },
  'xbox-original': { ar: 'إكس بوكس الأصلي', en: 'Original Xbox' },
  'xbox-360': { ar: 'إكس بوكس 360', en: 'Xbox 360' },
  'xbox-one': { ar: 'إكس بوكس ون', en: 'Xbox One' },
  'xbox-series': { ar: 'إكس بوكس سيريس', en: 'Xbox Series X/S' },
  'nintendo': { ar: 'Nintendo', en: 'Nintendo' },
  'switch': { ar: 'نينتندو سويتش', en: 'Nintendo Switch' },
  'game-boy': { ar: 'جيم بوي', en: 'Game Boy' },
  'ds-3ds': { ar: 'نينتندو دي إس / 3DS', en: 'Nintendo DS / 3DS' },
  'nes-snes': { ar: 'إن إي إس / سوبر نينتندو', en: 'NES / SNES' },
  'wii-wiiu-gamecube': { ar: 'وي / جيم كيوب', en: 'Wii / GameCube' },
  'retro-games': { ar: 'Retro Gaming', en: 'Retro Gaming' },
  'retro-gaming': { ar: 'Retro Gaming', en: 'Retro Gaming' },
  'retro-gaming-classics': { ar: 'Retro Gaming', en: 'Retro Gaming Classics' },
  'atari': { ar: 'أتاري', en: 'Atari' },
  'sega': { ar: 'سيجا', en: 'Sega' },
  'amiga-commodore': { ar: 'أميغا وكومودور', en: 'Amiga & Commodore' },
  'dreamcast-saturn': { ar: 'سيجا ساتورن ودريم كاست', en: 'Sega Saturn & Dreamcast' },
  'consoles-accessories': { ar: 'ملحقات Gaming وأجهزة الألعاب', en: 'Gaming Consoles & Accessories' },
  'gaming': { ar: 'أجهزة وألعاب الكونسول', en: 'Gaming Consoles & Games' },
  'consoles': { ar: 'أجهزة الألعاب', en: 'Gaming Consoles' },
  'accessories': { ar: 'ملحقات Gaming', en: 'Gaming Accessories' },
  'pc-accessories': { ar: 'ملحقات الكمبيوتر', en: 'PC Accessories' },
  'laptops': { ar: 'أجهزة اللابتوب', en: 'Laptops' },
  'laptop': { ar: 'أجهزة اللابتوب', en: 'Laptops' },
};

export function ProductsContent({ dict, locale, initialProducts, categorySlug }: ProductsContentProps) {
  const isRtl = locale === 'ar';
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
    sections: [] as string[],
    sockets: [] as string[],
    vram: [] as string[],
    refreshRates: [] as string[],
  });
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Category mapping constants to group subcategories under parent routes
  const CATEGORY_MAP = useMemo<Record<string, string[]>>(() => ({
    // 1. PlayStation
    'playstation': ['playstation', 'PlayStation', 'ps1', 'ps2', 'ps3', 'ps4', 'ps5', 'psp', 'ps-vita', 'PlayStation 1', 'PlayStation 2', 'PlayStation 3', 'PlayStation 4', 'PlayStation 5', 'PlayStation Portable'],
    'psp': ['psp', 'PSP', 'PlayStation Portable', 'PS Vita', 'ps-vita'],
    'ps1': ['ps1', 'PS1', 'PlayStation 1'],
    'ps2': ['ps2', 'PS2', 'PlayStation 2'],
    'ps3': ['ps3', 'PS3', 'PlayStation 3'],
    'ps4': ['ps4', 'PS4', 'PlayStation 4'],
    'ps5': ['ps5', 'PS5', 'PlayStation 5'],

    // 2. Xbox
    'xbox': ['xbox', 'Xbox', 'Classic Xbox', 'Xbox 360', 'Xbox One', 'Xbox Series', 'xbox-original', 'xbox-360', 'xbox-one', 'xbox-series', 'xbox-other'],
    'xbox-original': ['xbox-original', 'Classic Xbox', 'Original Xbox'],
    'xbox-360': ['xbox-360', 'Xbox 360'],
    'xbox-one': ['xbox-one', 'Xbox One'],
    'xbox-series': ['xbox-series', 'Xbox Series', 'Xbox Series X/S', 'Series X', 'Series S'],

    // 3. Nintendo
    'nintendo': ['nintendo', 'Nintendo', 'Classic Nintendo', 'Nintendo 64', 'GameCube', 'Game Boy', 'Game Boy Advance', 'Nintendo DS', 'Nintendo 3DS', 'Wii', 'Wii U', 'Nintendo Switch', 'nes-snes', 'game-boy', 'ds-3ds', 'wii-wiiu-gamecube', 'switch'],
    'switch': ['switch', 'Nintendo Switch'],
    'game-boy': ['game-boy', 'Game Boy', 'GBA', 'GBC'],
    'ds-3ds': ['ds-3ds', 'Nintendo DS', 'Nintendo 3DS', 'DS', '3DS'],
    'nes-snes': ['nes-snes', 'NES', 'SNES', 'Classic Nintendo'],
    'wii-wiiu-gamecube': ['wii-wiiu-gamecube', 'Wii', 'Wii U', 'GameCube', 'N64', 'Nintendo 64'],

    // 4. Retro Gaming
    'retro-gaming-classics': ['retro-gaming-classics', 'Retro Gaming Classics', 'Retro Gaming', 'retro-games', 'retro-gaming', 'retro', 'Sega', 'Atari', 'SNK', 'Neo Geo', 'Arcade', 'Retro Consoles & Games', 'amiga-commodore', 'dreamcast-saturn', 'other-retro'],
    'retro-games': ['retro-games', 'retro-gaming', 'retro-gaming-classics', 'Retro Gaming', 'Retro Gaming Classics', 'retro', 'playstation', 'psp', 'xbox', 'nintendo', 'PlayStation 1', 'PlayStation 2', 'PlayStation 3', 'Classic Xbox', 'Classic Nintendo', 'Nintendo 64', 'GameCube', 'Game Boy', 'PS Vita', 'Sega', 'Atari', 'Arcade', 'Retro Handhelds', 'Retro Controllers', 'Retro Games', 'Retro Accessories', 'Collectibles', 'Pre-Owned Retro', 'Retro Consoles & Games', 'amiga-commodore', 'dreamcast-saturn', 'other-retro'],
    'retro-gaming': ['retro-gaming', 'retro-games', 'retro-gaming-classics', 'Retro Gaming', 'Retro Gaming Classics', 'retro', 'playstation', 'psp', 'xbox', 'nintendo', 'PlayStation 1', 'PlayStation 2', 'PlayStation 3', 'Classic Xbox', 'Classic Nintendo', 'Nintendo 64', 'GameCube', 'Game Boy', 'PS Vita', 'Sega', 'Atari', 'Arcade', 'Retro Handhelds', 'Retro Controllers', 'Retro Games', 'Retro Accessories', 'Collectibles', 'Pre-Owned Retro', 'Retro Consoles & Games', 'amiga-commodore', 'dreamcast-saturn', 'other-retro'],
    'atari': ['atari', 'Atari'],
    'sega': ['sega', 'Sega', 'Mega Drive', 'Master System', 'Dreamcast', 'Saturn'],
    'amiga-commodore': ['amiga-commodore', 'Amiga', 'Commodore', 'C64'],
    'dreamcast-saturn': ['dreamcast-saturn', 'Dreamcast', 'Saturn'],

    // 5. Consoles & Accessories
    'gaming': ['gaming', 'Consoles', 'Games', 'Controllers', 'Gaming Accessories', 'PlayStation', 'Nintendo', 'Consoles & Accessories', 'playstation', 'psp', 'xbox', 'nintendo', 'retro-gaming-classics', 'consoles-accessories'],
    'consoles': ['consoles', 'gaming', 'Consoles', 'Games', 'Controllers', 'Gaming Accessories', 'PlayStation', 'Nintendo', 'Consoles & Accessories', 'playstation', 'psp', 'xbox', 'nintendo', 'retro-gaming-classics', 'consoles-accessories'],
    'consoles-games': ['gaming', 'Consoles', 'Games', 'Controllers', 'Gaming Accessories', 'PlayStation', 'Nintendo', 'Consoles & Accessories', 'playstation', 'psp', 'xbox', 'nintendo', 'retro-gaming-classics', 'consoles-accessories'],
    'consoles-accessories': ['consoles-accessories', 'Consoles & Accessories', 'accessories', 'Accessories', 'gaming', 'Consoles', 'Games', 'Controllers', 'Gaming Accessories', 'PlayStation', 'Nintendo', 'playstation', 'psp', 'xbox', 'nintendo', 'retro-gaming-classics', 'playstation-hardware', 'xbox-hardware', 'nintendo-hardware', 'retro-hardware'],

    // 6. PC Hardware & Systems
    'computers': ['computers', 'gaming-pcs', 'Gaming PCs', 'Pre-Built PC', 'Custom PC', 'PRE-BUILT PC', 'CUSTOM PC'],
    'gaming-pcs': ['gaming-pcs', 'Gaming PCs', 'Pre-Built PC', 'Custom PC', 'PRE-BUILT PC', 'CUSTOM PC', 'computers'],
    'pc': ['pc', 'pc-components', 'computers', 'gaming-pcs', 'CPU', 'CPUs', 'cpus', 'GPU', 'GPUs', 'gpus', 'Motherboards', 'Motherboard', 'motherboards', 'RAM', 'ram', 'Storage', 'storage', 'SSD', 'ssd', 'PSU', 'PSUs', 'psus', 'PC Cases', 'Cases', 'cases', 'Cooling', 'cooling', 'Fans', 'Thermal Products', 'Cables', 'Networking', 'Gaming PCs', 'monitors', 'Monitors', 'laptops', 'Laptops', 'pc-accessories', 'pc-games'],
    'pc-components': ['pc', 'pc-components', 'CPU', 'CPUs', 'cpus', 'GPU', 'GPUs', 'gpus', 'Motherboards', 'Motherboard', 'motherboards', 'RAM', 'ram', 'Storage', 'storage', 'SSD', 'ssd', 'PSU', 'PSUs', 'psus', 'PC Cases', 'Cases', 'cases', 'Cooling', 'cooling', 'Fans', 'Thermal Products', 'Cables', 'Networking', 'Gaming PCs', 'monitors', 'Monitors'],
    'cpus': ['cpus', 'cpu', 'CPU', 'CPUs', 'Processors', 'Processor'],
    'gpus': ['gpus', 'gpu', 'GPU', 'GPUs', 'Graphics Cards', 'Graphics Card'],
    'motherboards': ['motherboards', 'motherboard', 'Motherboards', 'Motherboard'],
    'ram': ['ram', 'RAM', 'RAM Memory', 'Memory'],
    'storage': ['storage', 'SSD', 'ssd', 'Storage', 'SSD Storage', 'HDD', 'NVMe', 'nvme'],
    'ssd': ['storage', 'SSD', 'ssd', 'Storage', 'SSD Storage', 'NVMe', 'nvme'],
    'monitors': ['monitors', 'Monitors', 'Monitor', 'monitor'],
    'cooling': ['cooling', 'Cooling', 'Fans', 'AIO', 'Cooler', 'cooler'],
    'cases': ['cases', 'Cases', 'PC Cases', 'pc-cases', 'case'],
    'pc-cases': ['cases', 'Cases', 'PC Cases', 'pc-cases', 'case'],
    'psus': ['psus', 'PSU', 'PSUs', 'Power Supply', 'power-supply', 'psu'],
    'accessories': ['accessories', 'Accessories', 'Controllers', 'Gaming Accessories', 'Consoles & Accessories', 'Gaming Keyboards', 'Gaming Mice', 'Mousepads', 'Headsets', 'Microphones', 'Webcams', 'Streaming', 'RGB Lighting', 'Gaming Chairs', 'Gaming Desks', 'Monitor Arms', 'Cables', 'Adapters', 'pc-accessories', 'consoles-accessories'],
    'pc-accessories': ['pc-accessories', 'accessories', 'Accessories', 'Gaming Keyboards', 'Gaming Mice', 'Mousepads', 'Headsets'],
    'laptops': ['laptops', 'Laptops', 'Gaming Laptops', 'Business Laptops', 'Student Laptops', 'Laptop', 'laptop'],
  }), []);

  // Derive available categories and brands for the sidebar based on the *current* dataset
  const availableCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      const catKey = p.category || 'General';
      counts[catKey] = (counts[catKey] || 0) + 1;
    });
    return Object.entries(counts).map(([id, count]) => {
      const nameObj = CATEGORY_NAMES_MAP[id.toLowerCase()];
      const cat = MAIN_CATEGORIES.find(c => c.id === id || c.slugEn === id);
      const label = nameObj ? (isRtl ? nameObj.ar : nameObj.en) : (cat ? (isRtl ? cat.nameAr : cat.nameEn) : id);
      return { id, label, count };
    }).sort((a, b) => b.count - a.count);
  }, [products, isRtl]);

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
        p.model?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.subCategory?.toLowerCase().includes(q)
      );
    }

    // 2. Category Route or Query Param Filter
    const activeCategoryParam = categorySlug || searchParams.get('category') || '';
    if (activeCategoryParam && activeCategoryParam !== 'all' && activeCategoryParam !== 'all-categories') {
      const catKey = activeCategoryParam.toLowerCase();
      const allowedCategories = CATEGORY_MAP[catKey] || CATEGORY_MAP[activeCategoryParam] || [catKey];

      result = result.filter(p => {
        const pCat = (p.category || '').toLowerCase();
        const pMainCat = (p.mainCategory || '').toLowerCase();
        const pSubCat = (p.subCategory || '').toLowerCase();
        const pPrimaryCat = (p.primaryCategory || '').toLowerCase();
        const pCatEn = (p.categoryEn || '').toLowerCase();
        const pPlat = (p.platform || '').toLowerCase();
        const pType = (p.productType || '').toLowerCase();
        const pSku = (p.sku || '').toLowerCase();
        const pId = (p.id || '').toLowerCase();
        const pSource = (p.source || '').toLowerCase();
        const pName = `${p.nameEn} ${p.nameAr}`.toLowerCase();

        // 1. Direct allowed category / mainCategory / subCategory / platform match
        if (allowedCategories.some(c => {
          const lower = c.toLowerCase();
          return lower === pCat || 
                 lower === pMainCat || 
                 lower === pSubCat || 
                 lower === pPrimaryCat || 
                 lower === pCatEn || 
                 lower === pPlat;
        })) {
          return true;
        }

        // 2. Specific Section SKU and semantic mappings
        if (catKey === 'playstation' || catKey === 'psp' || catKey === 'ps1' || catKey === 'ps2' || catKey === 'ps3' || catKey === 'ps4' || catKey === 'ps5') {
          return pSku.startsWith('play-') || pSku.startsWith('psp-') || pMainCat === 'playstation' || pPlat.includes('playstation') || pPlat.includes('ps') || pCat.includes('playstation') || pName.includes('playstation') || pName.includes('ps one') || pName.includes('ps1') || pName.includes('ps2') || pName.includes('ps3') || pName.includes('ps4') || pName.includes('ps5');
        }

        if (catKey === 'xbox' || catKey.startsWith('xbox-')) {
          return pSku.startsWith('xbox-') || pMainCat === 'xbox' || pPlat.includes('xbox') || pCat.includes('xbox') || pName.includes('xbox');
        }

        if (catKey === 'nintendo' || catKey === 'switch' || catKey === 'game-boy' || catKey === 'ds-3ds' || catKey === 'nes-snes' || catKey === 'wii-wiiu-gamecube') {
          return pSku.startsWith('nin-') || pMainCat === 'nintendo' || pPlat.includes('nintendo') || pPlat.includes('switch') || pPlat.includes('game boy') || pCat.includes('nintendo') || pName.includes('nintendo') || pName.includes('switch') || pName.includes('game boy') || pName.includes('gamecube') || pName.includes('zelda') || pName.includes('mario') || pName.includes('pokemon');
        }

        if (catKey === 'retro-gaming-classics' || catKey === 'retro-games' || catKey === 'retro-gaming' || catKey === 'retro' || catKey === 'atari' || catKey === 'sega' || catKey === 'amiga-commodore' || catKey === 'dreamcast-saturn') {
          return pSku.startsWith('retro-') || pId.startsWith('p-retro-') || pMainCat === 'retro-games' || pCat === 'retro-gaming-classics' || pCat === 'retro-games' || pPlat.includes('retro') || pPlat.includes('sega') || pPlat.includes('atari') || pPlat.includes('commodore') || pPlat.includes('amiga') || pPlat.includes('arcade') || pType.includes('retro') || pCat.includes('retro') || pSku.startsWith('play-') || pSku.startsWith('psp-') || pSku.startsWith('xbox-') || pSku.startsWith('nin-');
        }

        if (catKey === 'gaming' || catKey === 'consoles-games' || catKey === 'consoles-accessories' || catKey === 'consoles') {
          return pSku.startsWith('play-') || pSku.startsWith('psp-') || pSku.startsWith('xbox-') || pSku.startsWith('nin-') || pSku.startsWith('retro-') || pId.startsWith('p-retro-') || ['playstation', 'nintendo', 'xbox', 'consoles', 'controllers', 'consoles & accessories', 'consoles-accessories', 'accessories', 'retro-gaming-classics', 'retro-games'].includes(pCat) || ['playstation', 'nintendo', 'xbox', 'retro-games', 'consoles-accessories'].includes(pMainCat);
        }

        if (catKey === 'pc' || catKey === 'pc-components') {
          return pSource === 'pc' || pMainCat === 'pc' || pType.includes('pc') || ['cpus', 'cpu', 'gpus', 'gpu', 'motherboards', 'motherboard', 'ram', 'storage', 'ssd', 'psus', 'psu', 'cooling', 'cases', 'pc-cases', 'monitors', 'monitor', 'gaming-pcs', 'laptops', 'pc-accessories', 'pc-games'].includes(pCat) || ['cpus', 'gpus', 'motherboards', 'ram', 'storage', 'ssd', 'psus', 'cooling', 'pc-cases', 'cases', 'monitors', 'gaming-pcs', 'laptops', 'pc-accessories'].includes(pSubCat);
        }

        if (catKey === 'gaming-pcs' || catKey === 'computers') {
          return pCat === 'gaming-pcs' || pSubCat === 'gaming-pcs' || pType.includes('pc') || pName.includes('gaming pc') || pName.includes('تجميعة') || pName.includes('تجميعات');
        }

        if (catKey === 'cpus' || catKey === 'cpu') {
          return pCat === 'cpus' || pCat === 'cpu' || pSubCat === 'cpus' || pName.includes('intel') || pName.includes('ryzen') || pName.includes('core i') || pName.includes('معالج');
        }

        if (catKey === 'gpus' || catKey === 'gpu') {
          return pCat === 'gpus' || pCat === 'gpu' || pSubCat === 'gpus' || pName.includes('rtx') || pName.includes('radeon') || pName.includes('geforce') || pName.includes('gtx') || pName.includes('كرت شاشة');
        }

        if (catKey === 'motherboards' || catKey === 'motherboard') {
          return pCat === 'motherboards' || pCat === 'motherboard' || pSubCat === 'motherboards' || pName.includes('motherboard') || pName.includes('z790') || pName.includes('b650') || pName.includes('لوحة');
        }

        if (catKey === 'ram') {
          return pCat === 'ram' || pSubCat === 'ram' || pName.includes('ram') || pName.includes('ddr') || pName.includes('ذاكرة');
        }

        if (catKey === 'storage' || catKey === 'ssd') {
          return pCat === 'storage' || pCat === 'ssd' || pSubCat === 'storage' || pSubCat === 'ssd' || pName.includes('ssd') || pName.includes('nvme') || pName.includes('تخزين');
        }

        if (catKey === 'monitors' || catKey === 'monitor') {
          return pCat === 'monitors' || pCat === 'monitor' || pSubCat === 'monitors' || pName.includes('monitor') || pName.includes('شاشة');
        }

        if (catKey === 'cooling') {
          return pCat === 'cooling' || pSubCat === 'cooling' || pName.includes('cooler') || pName.includes('aio') || pName.includes('fan') || pName.includes('تبريد');
        }

        if (catKey === 'cases' || catKey === 'pc-cases') {
          return pCat === 'cases' || pCat === 'pc-cases' || pSubCat === 'cases' || pSubCat === 'pc-cases' || pName.includes('case') || pName.includes('كيس');
        }

        if (catKey === 'psus' || catKey === 'psu') {
          return pCat === 'psus' || pCat === 'psu' || pSubCat === 'psus' || pName.includes('power supply') || pName.includes('psu') || pName.includes('مزود');
        }

        if (catKey === 'accessories' || catKey === 'pc-accessories') {
          return pCat.includes('accessories') || pCat === 'controllers' || pSubCat.includes('accessories') || pName.includes('controller') || pName.includes('headset') || pName.includes('keyboard') || pName.includes('mouse') || pName.includes('cable') || pName.includes('adapter') || pName.includes('ملحقات') || pName.includes('سماعة') || pName.includes('يد');
        }

        if (catKey === 'laptops' || catKey === 'laptop') {
          return pCat.includes('laptop') || pName.includes('laptop') || pName.includes('لابتوب');
        }

        return pCat === catKey || pSubCat === catKey || pMainCat === catKey;
      });
    } else if (filters.categories.length > 0) {
      // 3. Sidebar Categories (only if not forced by route)
      result = result.filter(p => filters.categories.includes(p.category) || filters.categories.includes(p.categoryEn || ''));
    }

    // 3.5 SubCategory Query Param Filter (from Mega Menu clicks or direct subcategory links)
    const subCategoryParam = searchParams.get('subCategory') || searchParams.get('subcategory') || '';
    if (subCategoryParam) {
      const subNorm = subCategoryParam.toLowerCase().replace(/-/g, ' ');
      const subKey = subCategoryParam.toLowerCase();
      result = result.filter(p => {
        const pSub = (p.subCategory || '').toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        const pMainCat = (p.mainCategory || '').toLowerCase();
        const pPlat = (p.platform || '').toLowerCase();
        const pName = `${p.nameEn} ${p.nameAr}`.toLowerCase();
        const pSku = (p.sku || '').toLowerCase();
        const pType = (p.productType || '').toLowerCase();

        // Exact or partial string matching on subCategory / category / platform
        if (pSub === subKey || pSub.replace(/-/g, ' ') === subNorm || pSub.includes(subNorm) || (subNorm.length > 2 && subNorm.includes(pSub) && pSub.length > 2)) return true;
        if (pCat === subKey || pCat.replace(/-/g, ' ') === subNorm || pCat.includes(subNorm)) return true;

        if (subKey === 'gaming-pcs' || subKey.includes('gaming-pc') || subKey.includes('prebuilt') || subKey.includes('custom-pc')) {
          return pCat === 'gaming-pcs' || pSub === 'gaming-pcs' || pType.includes('pc') || pName.includes('gaming pc') || pName.includes('تجميعة') || pName.includes('تجميعات');
        }
        if (subKey.includes('playstation') || subKey.includes('ps1') || subKey.includes('ps2') || subKey.includes('ps3') || subKey.includes('ps4') || subKey.includes('ps5')) {
          return pSku.startsWith('play-') || pPlat.includes('playstation') || pName.includes('playstation') || pName.includes('ps one') || pName.includes('ps1') || pName.includes('ps2') || pName.includes('ps3') || pName.includes('ps4') || pName.includes('ps5');
        }
        if (subKey.includes('psp') || subKey.includes('vita')) {
          return pSku.startsWith('psp-') || pPlat.includes('psp') || pName.includes('psp');
        }
        if (subKey.includes('xbox')) {
          return pSku.startsWith('xbox-') || pPlat.includes('xbox') || pName.includes('xbox') || pSub.includes('xbox');
        }
        if (subKey.includes('nintendo') || subKey.includes('switch') || subKey.includes('3ds') || subKey.includes('gamecube') || subKey.includes('wii') || subKey.includes('pokemon') || subKey.includes('zelda') || subKey.includes('game-boy') || subKey.includes('nes')) {
          return pSku.startsWith('nin-') || pPlat.includes('nintendo') || pName.includes('nintendo') || pName.includes('switch') || pName.includes('pokemon') || pSub.includes('nin') || pSub.includes('game-boy') || pSub.includes('ds') || pSub.includes('wii');
        }
        if (subKey.includes('retro') || subKey.includes('sega') || subKey.includes('atari') || subKey.includes('arcade') || subKey.includes('amiga') || subKey.includes('saturn') || subKey.includes('dreamcast') || subKey.includes('commodore')) {
          return pSku.startsWith('retro-') || pPlat.includes('sega') || pPlat.includes('atari') || pPlat.includes('commodore') || pPlat.includes('amiga') || pName.includes('saturn') || pName.includes('c64') || pName.includes('sega') || pName.includes('atari') || pSub.includes('sega') || pSub.includes('atari');
        }
        if (subKey.includes('gpu') || subKey.includes('gpus')) {
          return pCat === 'gpus' || pCat === 'gpu' || pSub === 'gpus' || pName.includes('rtx') || pName.includes('radeon') || pName.includes('geforce') || pName.includes('gtx') || pName.includes('graphics card') || pName.includes('كرت شاشة') || pName.includes('كروت الشاشة');
        }
        if (subKey.includes('cpu') || subKey.includes('cpus') || subKey.includes('processor')) {
          return pCat === 'cpus' || pCat === 'cpu' || pSub === 'cpus' || pName.includes('intel') || pName.includes('ryzen') || pName.includes('core i') || pName.includes('معالج') || pName.includes('المعالجات');
        }
        if (subKey.includes('ram') || subKey.includes('memory')) {
          return pCat === 'ram' || pSub === 'ram' || pName.includes('ram') || pName.includes('ddr') || pName.includes('ذاكرة');
        }
        if (subKey.includes('ssd') || subKey.includes('storage') || subKey.includes('nvme') || subKey.includes('hdd')) {
          return pCat === 'ssd' || pCat === 'storage' || pSub === 'storage' || pSub === 'ssd' || pName.includes('ssd') || pName.includes('nvme') || pName.includes('تخزين') || pName.includes('قرص');
        }
        if (subKey.includes('motherboard')) {
          return pCat === 'motherboards' || pCat === 'motherboard' || pSub === 'motherboards' || pName.includes('motherboard') || pName.includes('z790') || pName.includes('b650') || pName.includes('am5') || pName.includes('lga') || pName.includes('لوحة') || pName.includes('اللوحات');
        }
        if (subKey.includes('cooling') || subKey.includes('fan')) {
          return pCat === 'cooling' || pSub === 'cooling' || pName.includes('cooler') || pName.includes('aio') || pName.includes('fan') || pName.includes('تبريد') || pName.includes('مروحة');
        }
        if (subKey.includes('case') || subKey.includes('chassis')) {
          return pCat === 'cases' || pCat === 'pc-cases' || pSub === 'cases' || pSub === 'pc-cases' || pName.includes('case') || pName.includes('كيس');
        }
        if (subKey.includes('psu') || subKey.includes('power')) {
          return pCat === 'psus' || pSub === 'psus' || pName.includes('power supply') || pName.includes('psu') || pName.includes('مزود');
        }
        if (subKey.includes('monitor')) {
          return pCat === 'monitors' || pSub === 'monitors' || pName.includes('monitor') || pName.includes('oled') || pName.includes('hz') || pName.includes('شاشة') || pName.includes('شاشات');
        }
        if (subKey.includes('controller') || subKey.includes('accessories') || subKey.includes('hardware')) {
          return pCat === 'controllers' || pCat === 'accessories' || pCat === 'consoles-accessories' || pSub.includes('accessories') || pName.includes('controller') || pName.includes('dualshock') || pName.includes('dualsense') || pName.includes('gamepad') || pName.includes('headset') || pName.includes('keyboard') || pName.includes('mouse') || pName.includes('يد تحكم') || pName.includes('ملحقات') || pName.includes('سماعة');
        }

        return false;
      });
    }

    // 3.55 Section Query Param Filter (Level 3 - Consoles vs Accessories vs Games/CDs)
    const sectionParam = searchParams.get('section') || '';
    const activeSections = filters.sections.length > 0 ? filters.sections : (sectionParam ? [sectionParam] : []);
    
    if (activeSections.length > 0) {
      result = result.filter(p => {
        const pSec = (p.section || '').toLowerCase();
        const pName = `${p.nameEn} ${p.nameAr}`.toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        const pSku = (p.sku || '').toLowerCase();

        return activeSections.some(sec => {
          const s = sec.toLowerCase();
          if (pSec === s) return true;

          if (s === 'consoles') {
            return (
              pSec === 'consoles' ||
              pName.includes('console') ||
              pName.includes('system') ||
              pName.includes('جهاز') ||
              pName.includes('منصة') ||
              pSku.startsWith('play-') ||
              pSku.startsWith('psp-') ||
              pSku.startsWith('xbox-') ||
              pSku.startsWith('nin-') ||
              pSku.startsWith('retro-')
            ) && !pName.includes('controller') && !pName.includes('cable') && !pName.includes('adapter') && !pName.includes('game') && !pName.includes('cd');
          }

          if (s === 'accessories') {
            return (
              pSec === 'accessories' ||
              pCat.includes('accessories') ||
              pCat.includes('controller') ||
              pName.includes('controller') ||
              pName.includes('gamepad') ||
              pName.includes('cable') ||
              pName.includes('adapter') ||
              pName.includes('dock') ||
              pName.includes('stand') ||
              pName.includes('memory card') ||
              pName.includes('يد') ||
              pName.includes('كابل') ||
              pName.includes('محول') ||
              pName.includes('شاحن')
            );
          }

          if (s === 'games-cds' || s === 'games') {
            return (
              pSec === 'games-cds' ||
              pCat.includes('game') ||
              pCat.includes('cd') ||
              pCat.includes('disc') ||
              pName.includes('game') ||
              pName.includes('cd') ||
              pName.includes('disc') ||
              pName.includes('cartridge') ||
              pName.includes('vhs') ||
              pName.includes('لعبة') ||
              pName.includes('قرص') ||
              pName.includes('assassin') ||
              pName.includes('mario') ||
              pName.includes('zelda') ||
              pName.includes('crysis')
            );
          }

          return false;
        });
      });
    }

    // 3.6 Sockets Spec Filter
    if (filters.sockets.length > 0) {
      result = result.filter(p => p.specs && p.specs.socket && filters.sockets.includes(String(p.specs.socket)));
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
        if (p.priceOnDemand) return true; // Keep priceOnDemand items visible unless strict range filter applied
        if (!price || price <= 0) return true;
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

  // Determine Title and Breadcrumb dynamically
  const activeCategoryParam = categorySlug || searchParams.get('category') || '';
  const subCategoryParam = searchParams.get('subCategory') || searchParams.get('subcategory') || '';

  const activeCategoryName = useMemo(() => {
    if (subCategoryParam) {
      const subObj = CATEGORY_NAMES_MAP[subCategoryParam.toLowerCase()];
      if (subObj) return isRtl ? subObj.ar : subObj.en;
    }
    if (activeCategoryParam && activeCategoryParam !== 'all') {
      const catObj = CATEGORY_NAMES_MAP[activeCategoryParam.toLowerCase()];
      if (catObj) return isRtl ? catObj.ar : catObj.en;
      const mainCat = MAIN_CATEGORIES.find(c => c.slugEn === activeCategoryParam || c.id === activeCategoryParam);
      if (mainCat) return isRtl ? mainCat.nameAr : mainCat.nameEn;
      return activeCategoryParam;
    }
    return '';
  }, [activeCategoryParam, subCategoryParam, isRtl]);

  const breadcrumbs = useMemo(() => {
    const items: { label: string; href?: string }[] = [
      { label: dict.nav.home, href: `/${locale}` },
      { label: dict.nav.shop, href: `/${locale}/products` },
    ];

    if (activeCategoryParam && activeCategoryParam !== 'all') {
      const catObj = CATEGORY_NAMES_MAP[activeCategoryParam.toLowerCase()];
      const catLabel = catObj ? (isRtl ? catObj.ar : catObj.en) : activeCategoryParam;
      
      if (subCategoryParam) {
        items.push({ label: catLabel, href: `/${locale}/products?category=${activeCategoryParam}` });
        const subObj = CATEGORY_NAMES_MAP[subCategoryParam.toLowerCase()];
        const subLabel = subObj ? (isRtl ? subObj.ar : subObj.en) : subCategoryParam;
        items.push({ label: subLabel });
      } else {
        items.push({ label: catLabel });
      }
    } else if (subCategoryParam) {
      const subObj = CATEGORY_NAMES_MAP[subCategoryParam.toLowerCase()];
      const subLabel = subObj ? (isRtl ? subObj.ar : subObj.en) : subCategoryParam;
      items.push({ label: subLabel });
    }

    return items;
  }, [activeCategoryParam, subCategoryParam, dict.nav.home, dict.nav.shop, locale, isRtl]);

  const pageTitle = activeCategoryName
    ? activeCategoryName
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
              categorySlug={categorySlug || activeCategoryParam}
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
