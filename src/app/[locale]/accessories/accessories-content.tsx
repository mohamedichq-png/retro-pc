// RETRO Qatar — Accessories Content (Client Component)
// Renders the full localized accessories storefront with brand/generation selections and custom variations

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useCompareStore } from '@/stores/useCompareStore';
import { useUIStore } from '@/stores/useUIStore';
import type { Product, ProductVariation } from '@/types';
import { 
  ControllerIcon, 
  CartIcon, 
  SearchIcon, 
  HeartIcon, 
  CompareIcon,
  CloseIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from '@/components/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PriceTag } from '@/components/ui/PriceTag';
import { Badge } from '@/components/ui/Badge';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

// Brands & Generations Data Configuration
const BRANDS_DATA: Record<string, {
  nameAr: string;
  nameEn: string;
  badge: string;
  descriptionAr: string;
  descriptionEn: string;
  gradient: string;
  icon: string;
  generations: {
    id: string;
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    icon: string;
    keywords: string[];
  }[];
}> = {
  Sony: {
    nameAr: "سوني بلايستيشن",
    nameEn: "Sony PlayStation",
    badge: "SONY",
    descriptionAr: "ملحقات بلايستيشن الأصلية، أيادي التحكم، كروت الذاكرة ومستلزمات اللعب.",
    descriptionEn: "Official PlayStation accessories, DualSense controllers, and memory cards.",
    gradient: "from-blue-950/80 to-indigo-950/90",
    icon: "🎮",
    generations: [
      {
        id: 'ps5',
        nameAr: 'ملحقات بلايستيشن 5',
        nameEn: 'PlayStation 5 Accessories',
        descriptionAr: 'أيادي التحكم اللاسلكية DualSense والإصدارات الاحترافية',
        descriptionEn: 'DualSense wireless controllers and pro edition gamepads',
        icon: "🤍",
        keywords: ['ps5', 'playstation 5', 'dualsense']
      },
      {
        id: 'ps4',
        nameAr: 'ملحقات بلايستيشن 4',
        nameEn: 'PlayStation 4 Accessories',
        descriptionAr: 'أيادي تحكم DualShock 4 اللاسلكية الأصلية بمختلف الألوان',
        descriptionEn: 'Original DualShock 4 wireless controllers in various colors',
        icon: "💙",
        keywords: ['ps4', 'playstation 4', 'dualshock 4']
      },
      {
        id: 'ps3',
        nameAr: 'ملحقات بلايستيشن 3',
        nameEn: 'PlayStation 3 Accessories',
        descriptionAr: 'أيادي التحكم DualShock 3 اللاسلكية والملحقات الكلاسيكية',
        descriptionEn: 'DualShock 3 wireless gamepads and classic components',
        icon: "🖤",
        keywords: ['ps3', 'playstation 3', 'dualshock 3']
      },
      {
        id: 'ps2',
        nameAr: 'ملحقات بلايستيشن 2',
        nameEn: 'PlayStation 2 Accessories',
        descriptionAr: 'أيادي تحكم سلكية وكروت ذاكرة أصلية لتخزين التقدم',
        descriptionEn: 'Wired DualShock 2 controllers and memory cards',
        icon: "💿",
        keywords: ['ps2', 'playstation 2', 'dualshock 2']
      },
      {
        id: 'ps1',
        nameAr: 'ملحقات بلايستيشن 1',
        nameEn: 'PlayStation 1 Accessories',
        descriptionAr: 'أيادي تحكم كلاسيكية وكابلات شاشة وتوصيل أصلية',
        descriptionEn: 'Classic controller pads, AV cables and memory cards',
        icon: "📼",
        keywords: ['ps1', 'playstation 1', 'psone']
      },
      {
        id: 'psp-vita',
        nameAr: 'ملحقات الأجهزة المحمولة',
        nameEn: 'Handheld Gear (PSP/Vita)',
        descriptionAr: 'كروت الذاكرة المخصصة، الشواحن، وحقائب الحماية',
        descriptionEn: 'Custom storage cards, chargers and protective cases',
        icon: "📱",
        keywords: ['psp', 'vita']
      }
    ]
  },
  Microsoft: {
    nameAr: "مايكروسوفت إكس بوكس",
    nameEn: "Microsoft Xbox",
    badge: "XBOX",
    descriptionAr: "أيادي تحكم إكس بوكس اللاسلكية والملحقات المتوافقة مع الحاسوب والمنصة.",
    descriptionEn: "Xbox wireless controllers and accessories compatible with PC and consoles.",
    gradient: "from-emerald-950/80 to-slate-950/90",
    icon: "💚",
    generations: [
      {
        id: 'xbox-series',
        nameAr: 'ملحقات إكس بوكس سيريس X/S',
        nameEn: 'Xbox Series Accessories',
        descriptionAr: 'أحدث أيادي تحكم إكس بوكس اللاسلكية ومستقبلات الكمبيوتر',
        descriptionEn: 'Next-gen Xbox wireless controllers and PC wireless adapters',
        icon: "❎",
        keywords: ['series x', 'series s', 'xbox series']
      },
      {
        id: 'xbox-one',
        nameAr: 'ملحقات إكس بوكس ون',
        nameEn: 'Xbox One Accessories',
        descriptionAr: 'أيادي تحكم لاسلكية وحقائب ومستلزمات الحماية',
        descriptionEn: 'Xbox One wireless controllers and gear',
        icon: "🟢",
        keywords: ['xbox one']
      },
      {
        id: 'xbox-360',
        nameAr: 'ملحقات إكس بوكس 360',
        nameEn: 'Xbox 360 Accessories',
        descriptionAr: 'أيادي تحكم سلكية ولاسلكية، محولات طاقة، وكابلات',
        descriptionEn: 'Wired & wireless gamepads, power supplies and cables',
        icon: "💿",
        keywords: ['xbox 360']
      },
      {
        id: 'xbox-original',
        nameAr: 'ملحقات إكس بوكس الأصلي',
        nameEn: 'Xbox Classic Accessories',
        descriptionAr: 'أيادي تحكم كلاسيكية وكابلات التوصيل بالتلفاز والكهرباء',
        descriptionEn: 'Retro Duke-style controllers, AV and power adapters',
        icon: "📟",
        keywords: ['xbox original', 'xbox classic', 'xbox orig']
      }
    ]
  },
  Nintendo: {
    nameAr: "نينتندو",
    nameEn: "Nintendo Systems",
    badge: "NIN",
    descriptionAr: "أذرع الجوي كون، الأيدي الاحترافية (Pro Controllers) وملحقات الحماية.",
    descriptionEn: "Joy-Con sets, Pro Controllers, carrying cases, and retro pads.",
    gradient: "from-rose-950/80 to-slate-950/90",
    icon: "🔴",
    generations: [
      {
        id: 'switch',
        nameAr: 'ملحقات نينتندو سويتش',
        nameEn: 'Nintendo Switch Accessories',
        descriptionAr: 'أذرع Joy-Con الملونة، أيادي Pro Controller، وحقائب الحماية المخصصة',
        descriptionEn: 'Joy-Cons, Pro Controllers, memory cards and protective cases',
        icon: "🟥",
        keywords: ['switch', 'joy-con']
      },
      {
        id: 'gameboy-ds',
        nameAr: 'ملحقات الأجهزة المحمولة الكلاسيكية',
        nameEn: 'Handheld Retro Gear (GBA/DS)',
        descriptionAr: 'شواحن، كابلات توصيل جماعي، وعدسات مكبرة للقيم بوي',
        descriptionEn: 'Chargers, multiplayer link cables, and screen accessories',
        icon: "🎮",
        keywords: ['game boy', 'gameboy', 'gba', 'ds', '3ds', '2ds']
      },
      {
        id: 'retro-nintendo',
        nameAr: 'ملحقات أجهزة نينتندو المنزلية الكلاسيكية',
        nameEn: 'Home Console Accessories',
        descriptionAr: 'أيادي تحكم (GameCube, Wii Remote, N64) وكابلات توصيل كلاسيكية',
        descriptionEn: 'GameCube controllers, Wii Remotes, N64 gamepads and cables',
        icon: "📺",
        keywords: ['nintendo 64', 'n64', 'gamecube', 'wii', 'snes', 'famicom', 'super nintendo', 'super famicom']
      }
    ]
  },
  Sega: {
    nameAr: "سيجا كلاسيك",
    nameEn: "Sega Classics",
    badge: "SEGA",
    descriptionAr: "ملحقات وأيادي تحكم أجهزة سيجا ميجا درايف، ساتورن ودريم كاست.",
    descriptionEn: "Sega retro controllers, memory cards and classic AV cables.",
    gradient: "from-sky-950/80 to-slate-950/90",
    icon: "🌀",
    generations: [
      {
        id: 'sega-all',
        nameAr: 'ملحقات سيجا الكلاسيكية',
        nameEn: 'Sega Classic Accessories',
        descriptionAr: 'أيادي تحكم دريم كاست، كروت ذاكرة VMU، وأيادي ميجا درايف بـ 6 أزرار',
        descriptionEn: 'Dreamcast controllers, VMU memory cards and Mega Drive gamepads',
        icon: "👾",
        keywords: ['sega', 'mega drive', 'dreamcast', 'saturn', 'game gear']
      }
    ]
  },
  'Retro Classics': {
    nameAr: "ملحقات ريترو كلاسيكية أخرى",
    nameEn: "Other Retro Gear",
    badge: "RETRO",
    descriptionAr: "أيادي تحكم أركيد، كابلات شاشات مخصصة، وأجهزة تحويل إشارة ريترو.",
    descriptionEn: "Arcade joysticks, video converters and vintage gamepad adapters.",
    gradient: "from-purple-950/80 to-slate-950/90",
    icon: "👾",
    generations: [
      {
        id: 'vintage-others',
        nameAr: 'ملحقات ومنصات تراثية متنوعة',
        nameEn: 'Vintage Gamepads & Adapters',
        descriptionAr: 'ملحقات Neo Geo، أذرع تحكم 3DO، ومحولات تحويل الصورة HDMI',
        descriptionEn: 'Neo Geo joysticks, 3DO gamepads, and HDMI retro video adapters',
        icon: "🕹️",
        keywords: ['neogeo', 'neo geo', '3do', 'panasonic', 'snk', 'retro classics']
      }
    ]
  }
};

interface AccessoriesContentProps {
  products: Product[];
  dict: Dictionary;
  locale: Locale;
}

export function AccessoriesContent({ products, dict, locale }: AccessoriesContentProps) {
  const isRtl = locale === 'ar';

  // Zustand State hooks
  const addToCartStore = useCartStore((s) => s.addItem);
  const wishlist = useWishlistStore((s) => s.items);
  const toggleWishlistStore = useWishlistStore((s) => s.toggle);
  const compareList = useCompareStore((s) => s.items);
  const toggleCompareStore = useCompareStore((s) => s.toggle);
  const showToast = useUIStore((s) => s.showToast);

  // Selected State for navigation
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedGen, setSelectedGen] = useState<string | null>(null);
  
  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  
  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);

  // Translation Helper
  const t = (key: string) => {
    if (key === 'currency') return isRtl ? 'ر.ق' : 'QAR';
    if (key === 'outOfStock') return dict.product?.outOfStock || (isRtl ? 'نفذت الكمية' : 'Out of Stock');
    if (key === 'lowStock') return dict.product?.lowStock || (isRtl ? 'كمية محدودة!' : 'Low Stock!');
    if (key === 'addToCartBtn') return dict.product?.addToCart || (isRtl ? 'أضف إلى السلة' : 'Add to Cart');
    return key;
  };

  // Sync variations when product is viewed
  useEffect(() => {
    if (quickViewProduct?.variations && quickViewProduct.variations.length > 0) {
      setSelectedVariation(quickViewProduct.variations[0]);
    } else {
      setSelectedVariation(null);
    }
  }, [quickViewProduct]);

  // If user starts searching, automatically bypass grid navigation
  const isSearching = searchQuery.trim().length > 0;

  // Filter consoles products base list (Accessories Only)
  const accessoriesRelatedProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status === 'draft') return false;
      const isConsoleCat = 
        p.category === 'Consoles & Accessories' || 
        p.category === 'PlayStation' || 
        p.category === 'Nintendo' || 
        p.category === 'Retro Consoles & Games' ||
        p.category === 'Controllers';
      if (!isConsoleCat) return false;

      // Filter to include only accessories
      const isAccessory = 
        p.category === 'Controllers' || 
        p.id.startsWith('p-ctrl-') || 
        p.id.startsWith('p-acc-') || 
        p.nameEn.toLowerCase().includes('controller') || 
        p.nameEn.toLowerCase().includes('dualsense') || 
        p.nameEn.toLowerCase().includes('dualshock') || 
        p.nameEn.toLowerCase().includes('memory card') ||
        p.nameEn.toLowerCase().includes('cable') ||
        p.nameEn.toLowerCase().includes('charger') ||
        p.nameEn.toLowerCase().includes('adapter') ||
        p.nameEn.toLowerCase().includes('power supply');

      return isAccessory;
    });
  }, [products]);

  // Calculate count of accessories for each Brand
  const getBrandProductCount = (brandKey: string) => {
    return accessoriesRelatedProducts.filter(p => {
      if (brandKey === 'Sony') {
        return p.brand === 'Sony' || p.subCategory === 'Sony' || p.category === 'PlayStation';
      } else if (brandKey === 'Microsoft') {
        return p.brand === 'Microsoft' || p.subCategory === 'Microsoft';
      } else if (brandKey === 'Nintendo') {
        return p.brand === 'Nintendo' || p.subCategory === 'Nintendo' || p.category === 'Nintendo';
      } else if (brandKey === 'Sega') {
        return p.brand === 'Sega' || p.subCategory === 'Sega';
      } else if (brandKey === 'Retro Classics') {
        return p.brand === 'SNK' || p.brand === 'Panasonic' || p.subCategory === 'Retro Classics' || p.category === 'Retro Consoles & Games' || p.subCategory === 'Panasonic';
      }
      return false;
    }).length;
  };

  // Calculate count of accessories for each Generation
  const getGenProductCount = (brandKey: string, genId: string) => {
    const genData = BRANDS_DATA[brandKey]?.generations.find(g => g.id === genId);
    if (!genData) return 0;

    return accessoriesRelatedProducts.filter(p => {
      // Must match brand first
      let brandMatches = false;
      if (brandKey === 'Sony') {
        brandMatches = p.brand === 'Sony' || p.subCategory === 'Sony' || p.category === 'PlayStation';
      } else if (brandKey === 'Microsoft') {
        brandMatches = p.brand === 'Microsoft' || p.subCategory === 'Microsoft';
      } else if (brandKey === 'Nintendo') {
        brandMatches = p.brand === 'Nintendo' || p.subCategory === 'Nintendo' || p.category === 'Nintendo';
      } else if (brandKey === 'Sega') {
        brandMatches = p.brand === 'Sega' || p.subCategory === 'Sega';
      } else if (brandKey === 'Retro Classics') {
        brandMatches = p.brand === 'SNK' || p.brand === 'Panasonic' || p.subCategory === 'Retro Classics' || p.category === 'Retro Consoles & Games' || p.subCategory === 'Panasonic';
      }
      if (!brandMatches) return false;

      const nameLower = p.nameEn.toLowerCase();
      const idLower = p.id.toLowerCase();
      const modelLower = p.model?.toLowerCase() || '';

      return genData.keywords.some(keyword => {
        return nameLower.includes(keyword) || idLower.includes(keyword) || modelLower.includes(keyword);
      });
    }).length;
  };

  // Main Product Filtering
  const filteredProducts = useMemo(() => {
    return accessoriesRelatedProducts.filter(p => {
      // Search query filter (matches globally and bypasses brand/gen navigation)
      if (isSearching) {
        const query = searchQuery.toLowerCase();
        const matchesEn = p.nameEn.toLowerCase().includes(query);
        const matchesAr = p.nameAr.includes(query);
        const matchesModel = p.model?.toLowerCase().includes(query) || false;
        const matchesSku = p.sku.toLowerCase().includes(query);
        if (!matchesEn && !matchesAr && !matchesModel && !matchesSku) return false;
        return true;
      }

      // Brand selection filter
      if (selectedBrand) {
        let brandMatches = false;
        if (selectedBrand === 'Sony') {
          brandMatches = p.brand === 'Sony' || p.subCategory === 'Sony' || p.category === 'PlayStation';
        } else if (selectedBrand === 'Microsoft') {
          brandMatches = p.brand === 'Microsoft' || p.subCategory === 'Microsoft';
        } else if (selectedBrand === 'Nintendo') {
          brandMatches = p.brand === 'Nintendo' || p.subCategory === 'Nintendo' || p.category === 'Nintendo';
        } else if (selectedBrand === 'Sega') {
          brandMatches = p.brand === 'Sega' || p.subCategory === 'Sega';
        } else if (selectedBrand === 'Retro Classics') {
          brandMatches = p.brand === 'SNK' || p.brand === 'Panasonic' || p.subCategory === 'Retro Classics' || p.category === 'Retro Consoles & Games' || p.subCategory === 'Panasonic';
        }
        if (!brandMatches) return false;
      }

      // Generation selection filter
      if (selectedBrand && selectedGen) {
        const genData = BRANDS_DATA[selectedBrand]?.generations.find(g => g.id === selectedGen);
        if (genData) {
          const nameLower = p.nameEn.toLowerCase();
          const idLower = p.id.toLowerCase();
          const modelLower = p.model?.toLowerCase() || '';
          
          const hasKeyword = genData.keywords.some(keyword => {
            return nameLower.includes(keyword) || idLower.includes(keyword) || modelLower.includes(keyword);
          });
          
          if (!hasKeyword) return false;
        }
      }

      return true;
    });
  }, [accessoriesRelatedProducts, selectedBrand, selectedGen, searchQuery, isSearching]);

  // Sorting Products
  const sortedConsoleProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.salePrice ?? a.sellingPrice) - (b.salePrice ?? b.sellingPrice));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.salePrice ?? b.sellingPrice) - (a.salePrice ?? a.sellingPrice));
    }
    return list;
  }, [filteredProducts, sortBy]);

  // Navigate back levels
  const goBackToBrands = () => {
    setSelectedGen(null);
    setSelectedBrand(null);
  };

  const goBackToGenerations = () => {
    setSelectedGen(null);
  };

  // Toast Wrap Actions
  const handleAddToCart = (product: Product, qty: number = 1, variation?: ProductVariation) => {
    addToCartStore(product, qty, variation);
    showToast(
      isRtl
        ? `تمت إضافة ${isRtl ? product.nameAr : product.nameEn} إلى السلة!`
        : `Added ${product.nameEn} to cart!`,
      'success'
    );
  };

  const handleToggleWishlist = (productId: string, productName: string) => {
    toggleWishlistStore(productId);
    const isNowAdded = !wishlist.includes(productId);
    showToast(
      isNowAdded
        ? (isRtl ? `تمت إضافة ${productName} للمفضلة ❤️` : `Added ${productName} to wishlist ❤️`)
        : (isRtl ? `تمت إزالة ${productName} من المفضلة` : `Removed ${productName} from wishlist`),
      'info'
    );
  };

  const handleToggleCompare = (product: Product) => {
    const inCompare = compareList.some(p => p.id === product.id);
    if (!inCompare && compareList.length >= 4) {
      showToast(
        isRtl
          ? 'حد المقارنة الأقصى هو 4 منتجات!'
          : 'Compare list limit reached (Max 4 products)!',
        'error'
      );
      return;
    }
    toggleCompareStore(product);
    showToast(
      !inCompare
        ? (isRtl ? 'تمت إضافة المنتج للمقارنة ⚖️' : 'Added to compare list ⚖️')
        : (isRtl ? 'تمت إزالة المنتج من المقارنة' : 'Removed from compare list'),
      'info'
    );
  };

  // Breadcrumbs for the page
  const breadcrumbs = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.nav.accessories || (isRtl ? "الملحقات" : "Accessories"), href: selectedBrand ? `/${locale}/accessories` : undefined },
    selectedBrand && { 
      label: isRtl ? BRANDS_DATA[selectedBrand].nameAr : BRANDS_DATA[selectedBrand].nameEn,
      href: selectedGen ? '#' : undefined 
    },
    selectedGen && { 
      label: isRtl 
        ? BRANDS_DATA[selectedBrand!]?.generations.find(g => g.id === selectedGen)?.nameAr || '' 
        : BRANDS_DATA[selectedBrand!]?.generations.find(g => g.id === selectedGen)?.nameEn || '' 
    }
  ].filter(Boolean) as { label: string; href?: string }[];

  return (
    <div className="bg-retro-bg pb-20 text-retro-text">
      
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden border-b border-retro-border bg-retro-bg-secondary/40 px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute top-1/2 left-1/4 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-retro-purple/5 blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-retro-pink/5 blur-[140px] pointer-events-none"></div>
        
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className={`space-y-3 text-center ${isRtl ? 'md:text-right' : 'md:text-left'}`}>
              <div className="inline-flex items-center gap-2 rounded-full border border-retro-purple/30 bg-retro-purple/10 px-4 py-1.5 text-xs font-bold text-retro-purple backdrop-blur-md">
                <ControllerIcon size={16} className="text-retro-pink animate-pulse" />
                {isRtl ? "قسم ملحقات الألعاب والتحكم" : "RETRO Accessories Hub"}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-retro-text uppercase tracking-tight">
                {isRtl ? "متجر الملحقات والإكسسوارات" : "Gaming Accessories Store"}
              </h1>

              <p className="text-xs sm:text-sm text-retro-text-secondary max-w-xl font-medium leading-relaxed">
                {isRtl 
                  ? "تصفح واقتنِ أيدي التحكم اللاسلكية، كروت الذاكرة، الشواحن والكابلات الأصلية لمختلف الأجهزة الكلاسيكية والحديثة."
                  : "Find official wireless controllers, classic gamepads, memory cards, chargers and replacement cords for all gaming systems."}
              </p>
            </div>

            {/* Quick Stats Badge */}
            <div className="flex items-center gap-4 rounded-2xl border border-retro-border bg-retro-bg-card/60 p-4 backdrop-blur-xl">
              <div className={`text-center px-4 ${isRtl ? 'border-l' : 'border-r'} border-retro-border/40`}>
                <span className="text-2xl font-black text-retro-cyan block">{accessoriesRelatedProducts.length}</span>
                <span className="text-[10px] text-retro-text-muted uppercase font-bold">{isRtl ? "ملحق متاح" : "Accessories"}</span>
              </div>
              <div className="text-center px-4">
                <span className="text-2xl font-black text-retro-purple block">5</span>
                <span className="text-[10px] text-retro-text-muted uppercase font-bold">{isRtl ? "علامات تجارية" : "Brands"}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Global Controls Bar (Search & Breadcrumbs) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-retro-border bg-retro-bg-card/30 p-4 backdrop-blur-md">
          
          {/* Breadcrumbs */}
          <Breadcrumb items={breadcrumbs} />

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? "ابحث عن يد تحكم، كرت ذاكرة، شاحن..." : "Search controllers, storage, adapters..."}
              className="w-full rounded-xl bg-retro-bg-input py-2.5 text-xs text-retro-text border border-retro-border focus:outline-none focus:border-retro-purple/50 focus:ring-1 focus:ring-retro-purple/20 transition-all ltr:pl-9 ltr:pr-4 rtl:pr-9 rtl:pl-4"
            />
            <SearchIcon className="absolute ltr:left-3 rtl:right-3 top-3 h-4 w-4 text-retro-text-muted" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute ltr:right-3 rtl:left-3 top-3 text-retro-text-muted hover:text-retro-text cursor-pointer"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>

        </div>
      </section>

      {/* 3. Main Navigation & Listings Area */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <AnimatePresence mode="wait">
          
          {/* LEVEL 1: Brands Grid */}
          {!selectedBrand && !isSearching && (
            <motion.div
              key="brands-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-extrabold text-retro-text border-r-4 border-retro-purple pr-3 pl-3">
                {isRtl ? "اختر علامة تجارية للألعاب" : "Choose Gaming Brand"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(BRANDS_DATA).map(([key, brand]) => {
                  const itemsCount = getBrandProductCount(key);
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedBrand(key)}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-retro-border bg-retro-bg-card/40 p-6 backdrop-blur-md hover:border-retro-purple/40 hover:shadow-[0_0_35px_rgba(168,85,247,0.15)] transition-all duration-300 cursor-pointer"
                    >
                      {/* Brand Glow Ambient */}
                      <div className="absolute -top-10 -left-10 h-28 w-28 rounded-full bg-retro-purple/5 blur-2xl group-hover:bg-retro-purple/15 transition-all"></div>

                      <div className="flex items-center justify-between w-full mb-6">
                        <span className="text-3xl filter drop-shadow-[0_2px_10px_rgba(168,85,247,0.4)]">
                          {brand.icon}
                        </span>
                        <span className="text-[10px] font-black tracking-widest text-retro-purple bg-retro-purple/10 border border-retro-purple/30 rounded-md px-2 py-0.5">
                          {brand.badge}
                        </span>
                      </div>

                      <div className={`space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
                        <h3 className="text-xl font-black text-retro-text group-hover:text-retro-purple transition-colors">
                          {isRtl ? brand.nameAr : brand.nameEn}
                        </h3>
                        <p className="text-xs text-retro-text-secondary font-medium leading-relaxed line-clamp-2">
                          {isRtl ? brand.descriptionAr : brand.descriptionEn}
                        </p>
                      </div>

                      <div className={`mt-6 pt-4 border-t border-retro-border flex items-center justify-between w-full text-xs font-bold ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                        <span className="text-retro-text-muted">
                          {itemsCount} {isRtl ? "ملحق متاح" : "Accessories Available"}
                        </span>
                        <span className="text-retro-purple flex items-center gap-1 group-hover:text-retro-pink transition-colors">
                          {isRtl ? "تصفح الفئات" : "Explore"} 
                          {isRtl ? <ChevronLeftIcon size={14} className="mt-0.5" /> : <ChevronRightIcon size={14} className="mt-0.5" />}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* LEVEL 2: Generations Grid */}
          {selectedBrand && !selectedGen && !isSearching && (
            <motion.div
              key="gen-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-retro-text border-r-4 border-retro-purple pr-3 pl-3">
                  {isRtl ? `ملحقات أجهزة ${BRANDS_DATA[selectedBrand].nameAr}` : `${BRANDS_DATA[selectedBrand].nameEn} Accessories`}
                </h2>
                <button
                  onClick={goBackToBrands}
                  className="text-xs font-bold text-retro-purple hover:text-retro-pink transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {isRtl ? <ChevronRightIcon size={14} /> : <ChevronLeftIcon size={14} />}
                  <span>{isRtl ? "العودة للشركات" : "Back to Brands"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {BRANDS_DATA[selectedBrand].generations.map((gen) => {
                  const genCount = getGenProductCount(selectedBrand, gen.id);
                  return (
                    <button
                      key={gen.id}
                      onClick={() => setSelectedGen(gen.id)}
                      className="group relative flex items-start gap-4 rounded-2xl border border-retro-border bg-retro-bg-card/40 p-5 backdrop-blur-md hover:border-retro-purple/30 hover:shadow-[0_0_25px_rgba(236,72,153,0.1)] transition-all duration-300 cursor-pointer"
                    >
                      <div className="rounded-xl bg-retro-purple/10 border border-retro-purple/20 p-3 text-2xl shrink-0">
                        {gen.icon}
                      </div>

                      <div className={`space-y-1 flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                        <h3 className="text-base font-bold text-retro-text group-hover:text-retro-purple transition-colors">
                          {isRtl ? gen.nameAr : gen.nameEn}
                        </h3>
                        <p className="text-xs text-retro-text-secondary leading-normal line-clamp-2">
                          {isRtl ? gen.descriptionAr : gen.descriptionEn}
                        </p>
                        
                        <div className="pt-2 flex items-center gap-2 text-[10px] text-retro-text-muted font-extrabold uppercase">
                          <span>{genCount} {isRtl ? "ملحق" : "items"}</span>
                          <span>•</span>
                          <span className="text-retro-purple group-hover:text-retro-pink transition-colors">
                            {isRtl ? "عرض الكل" : "View items"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* LEVEL 3: Product Listings Grid */}
          {((selectedBrand && selectedGen) || isSearching) && (
            <motion.div
              key="products-listing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              
              {/* Product Listing Top Filters */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-retro-border pb-5">
                
                {/* 1. Page Title */}
                <div>
                  <h2 className="text-xl font-black text-retro-text flex items-center gap-2">
                    {isSearching ? (
                      <span>{isRtl ? "نتائج البحث عن:" : "Search Results for:"} "{searchQuery}"</span>
                    ) : (
                      <span>
                        {isRtl 
                          ? BRANDS_DATA[selectedBrand!]?.generations.find(g => g.id === selectedGen)?.nameAr 
                          : BRANDS_DATA[selectedBrand!]?.generations.find(g => g.id === selectedGen)?.nameEn}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-retro-text-secondary bg-retro-bg-card rounded-md px-2 py-0.5 border border-retro-border">
                      {sortedConsoleProducts.length}
                    </span>
                  </h2>
                </div>

                {/* 2. Sorting & Back Button */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="rounded-xl bg-retro-bg-input px-3 py-2 text-xs text-retro-text border border-retro-border focus:outline-none focus:border-retro-purple/50"
                  >
                    <option value="featured">{isRtl ? "المقترحة" : "Featured"}</option>
                    <option value="price-asc">{isRtl ? "السعر: الأقل أولاً" : "Price: Low to High"}</option>
                    <option value="price-desc">{isRtl ? "السعر: الأعلى أولاً" : "Price: High to Low"}</option>
                  </select>

                  {!isSearching && (
                    <button
                      onClick={goBackToGenerations}
                      className="rounded-xl bg-retro-bg-card border border-retro-border px-3 py-2 text-xs font-bold text-retro-text-secondary hover:text-retro-text hover:border-retro-border-hover transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {isRtl ? <ChevronRightIcon size={14} /> : <ChevronLeftIcon size={14} />}
                      <span>{isRtl ? "الرجوع" : "Back"}</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Grid Layout */}
              {sortedConsoleProducts.length === 0 ? (
                <div className="text-center py-16 space-y-4 rounded-3xl border border-retro-border bg-retro-bg-card/10">
                  <ControllerIcon size={48} className="mx-auto text-retro-text-muted animate-bounce" />
                  <h3 className="text-base font-bold text-retro-text-secondary">
                    {isRtl ? "لا توجد ملحقات مطابقة للبحث" : "No Accessories Found"}
                  </h3>
                  <p className="text-xs text-retro-text-muted max-w-md mx-auto">
                    {isRtl ? "حاول كتابة كلمة بحث مختلفة أو التصفح من خلال الشركات المصنعة الأخرى." : "Try sorting differently or searching with a different term."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedConsoleProducts.map((product) => {
                    const price = product.salePrice ?? product.sellingPrice;
                    const hasDiscount = !!product.salePrice;
                    const isLowStock = product.stockQty > 0 && product.stockQty <= product.lowStockThreshold;
                    const isWishlisted = wishlist.includes(product.id);
                    const inCompare = compareList.some(p => p.id === product.id);

                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-retro-border bg-retro-bg-card/45 p-4 hover:border-retro-purple/35 transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]"
                      >
                        {/* Status Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                          <span className="rounded bg-retro-bg-card/80 border border-retro-border px-2 py-0.5 text-[9px] font-black text-retro-text-secondary uppercase">
                            {isRtl ? (product.condition === 'New' ? 'جديد' : product.condition === 'Used' ? 'مستعمل' : 'مجدد') : product.condition}
                          </span>
                          {product.stockQty === 0 ? (
                            <span className="rounded bg-retro-red px-2 py-0.5 text-[9px] font-bold text-white">
                              {t('outOfStock')}
                            </span>
                          ) : isLowStock ? (
                            <span className="rounded bg-retro-amber px-2 py-0.5 text-[9px] font-bold text-retro-bg animate-pulse">
                              {t('lowStock')}
                            </span>
                          ) : (
                            <span className="rounded bg-retro-green/90 px-2 py-0.5 text-[9px] font-bold text-retro-bg">
                              {isRtl ? "متوفر" : "In Stock"}
                            </span>
                          )}
                        </div>

                        {/* Top action buttons */}
                        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
                          <button 
                            onClick={() => handleToggleWishlist(product.id, isRtl ? product.nameAr : product.nameEn)}
                            className={`rounded-full p-2 backdrop-blur-sm border transition-all cursor-pointer ${
                              isWishlisted 
                                ? 'bg-retro-pink/20 border-retro-pink/40 text-retro-pink' 
                                : 'bg-retro-bg-card/85 border-retro-border text-retro-text-muted hover:text-retro-pink'
                            }`}
                          >
                            <HeartIcon size={12} className={isWishlisted ? "fill-retro-pink text-retro-pink" : ""} />
                          </button>
                          <button 
                            onClick={() => handleToggleCompare(product)}
                            className={`rounded-full p-2 backdrop-blur-sm border transition-all cursor-pointer ${
                              inCompare 
                                ? 'bg-retro-purple/20 border-retro-purple/40 text-retro-purple' 
                                : 'bg-retro-bg-card/85 border-retro-border text-retro-text-muted hover:text-retro-purple'
                            }`}
                          >
                            <CompareIcon size={12} />
                          </button>
                        </div>

                        {/* Image wrapper */}
                        <div 
                          onClick={() => setQuickViewProduct(product)}
                          className="relative h-40 bg-retro-bg-input rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center p-3 mt-4 group-hover:scale-[1.01] transition-transform duration-300 border border-retro-border"
                        >
                          <img 
                            src={product.imageUrl} 
                            alt={product.nameEn}
                            className="h-full w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Product details */}
                        <div className="pt-3 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] font-black text-retro-purple uppercase tracking-wider">
                                {product.brand}
                              </span>
                              <span className="text-[9px] font-semibold text-retro-text-muted">
                                {product.subCategory || 'Consoles'}
                              </span>
                            </div>
                            
                            <h3 
                              onClick={() => setQuickViewProduct(product)}
                              className="text-xs font-bold text-retro-text line-clamp-1 hover:text-retro-purple cursor-pointer"
                            >
                              {isRtl ? product.nameAr : product.nameEn}
                            </h3>

                            <p className="text-[10px] text-retro-text-secondary mt-1 line-clamp-2 leading-relaxed font-medium">
                              {isRtl ? product.descriptionAr : product.descriptionEn}
                            </p>
                          </div>

                          {/* Footer pricing & checkout */}
                          <div className="pt-2 border-t border-retro-border flex items-center justify-between gap-2">
                            <div className="flex flex-col">
                              {hasDiscount && (
                                <span className="text-[9px] text-retro-text-muted line-through">
                                  {product.sellingPrice} {t('currency')}
                                </span>
                              )}
                              <span className="text-sm font-black text-retro-cyan">
                                {price} {t('currency')}
                              </span>
                            </div>

                            <button
                              disabled={product.stockQty === 0}
                              onClick={() => handleAddToCart(product, 1)}
                              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-retro-purple-muted to-retro-pink hover:from-retro-purple hover:to-retro-pink/90 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 text-[10px] font-bold text-white shadow-md shadow-retro-purple-muted/20 transition-all duration-300 cursor-pointer"
                            >
                              <CartIcon size={12} />
                              <span>{isRtl ? "شراء" : "Buy"}</span>
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </section>

      {/* 4. Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="relative w-full max-w-2xl rounded-3xl border border-retro-border bg-retro-bg-card p-6 md:p-8 shadow-2xl">
            <button 
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-retro-text-secondary hover:text-retro-text cursor-pointer"
            >
              <CloseIcon size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-56 bg-retro-bg-input rounded-2xl overflow-hidden flex items-center justify-center p-3 border border-retro-border">
                <img 
                  src={selectedVariation?.imageUrl || quickViewProduct.imageUrl} 
                  alt={quickViewProduct.nameEn} 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold bg-retro-purple/20 text-retro-purple rounded-md px-2 py-0.5 uppercase">
                      {selectedVariation ? selectedVariation.condition : quickViewProduct.condition}
                    </span>
                    <span className="text-[10px] font-bold bg-retro-bg-secondary text-retro-text-secondary rounded-md px-2 py-0.5">
                      SKU: {selectedVariation ? selectedVariation.sku : quickViewProduct.sku}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-retro-text">
                    {isRtl ? quickViewProduct.nameAr : quickViewProduct.nameEn} {selectedVariation && `- ${selectedVariation.edition}`}
                  </h2>

                  <p className="text-xs text-retro-text-secondary leading-relaxed font-medium">
                    {isRtl ? quickViewProduct.descriptionAr : quickViewProduct.descriptionEn}
                  </p>
                </div>

                {/* Variations Selector */}
                {quickViewProduct.variations && quickViewProduct.variations.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs text-retro-text-muted font-bold">{isRtl ? "اختر النسخة والحالة:" : "Select Edition & Condition:"}</label>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.variations.map((v) => (
                        <button
                          key={v.sku}
                          onClick={() => setSelectedVariation(v)}
                          className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                            selectedVariation?.sku === v.sku
                              ? 'bg-retro-purple/20 border-retro-purple text-retro-purple'
                              : 'bg-retro-bg-secondary border-retro-border text-retro-text-secondary hover:border-retro-purple/50 hover:text-retro-text'
                          }`}
                        >
                          {v.edition} - {v.condition}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-between items-center border-t border-retro-border">
                  <span className="text-xl font-black text-retro-cyan">
                    {selectedVariation ? (selectedVariation.salePrice ?? selectedVariation.sellingPrice) : (quickViewProduct.salePrice ?? quickViewProduct.sellingPrice)} {t('currency')}
                  </span>
                  
                  {/* Stock Indicator */}
                  {(selectedVariation ? selectedVariation.stockQty : quickViewProduct.stockQty) === 0 ? (
                    <span className="text-xs font-bold text-retro-red">{t('outOfStock')}</span>
                  ) : (selectedVariation ? selectedVariation.stockQty : quickViewProduct.stockQty) < 3 ? (
                    <span className="text-xs font-bold text-retro-amber">Only {(selectedVariation ? selectedVariation.stockQty : quickViewProduct.stockQty)} left!</span>
                  ) : (
                    <span className="text-xs font-bold text-retro-green">In Stock</span>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    disabled={(selectedVariation ? selectedVariation.stockQty : quickViewProduct.stockQty) === 0}
                    onClick={() => {
                      handleAddToCart(quickViewProduct, 1, selectedVariation || undefined);
                      setQuickViewProduct(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-retro-purple-muted to-retro-pink py-2.5 text-xs font-bold text-white shadow-lg shadow-retro-purple-muted/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CartIcon size={14} />
                    <span>{isRtl ? "أضف إلى السلة" : "Add to Cart"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
