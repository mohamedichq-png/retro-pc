// RETRO Qatar — Mega Menu Component
// Displays dynamic 3-level taxonomy multi-column grids (Main Category -> Subcategory -> Section)

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface MegaMenuProps {
  activeCategory: string;
  locale: Locale;
  dict: Dictionary;
  onClose: () => void;
}

interface SubCategoryItem {
  nameEn: string;
  nameAr: string;
  category: string;
  subCategory?: string;
  section?: string;
}

interface MegaColumn {
  titleEn: string;
  titleAr: string;
  items: SubCategoryItem[];
}

// Full 3-Level Mega Menu Configuration
const MEGA_MENU_DATA: Record<string, { 
  columns: MegaColumn[]; 
  promo?: { 
    titleEn: string; 
    titleAr: string; 
    descEn: string; 
    descAr: string; 
    ctaEn: string; 
    ctaAr: string; 
    href: string; 
    image: string 
  } 
}> = {
  // ── PLAYSTATION ──
  'playstation': {
    columns: [
      {
        titleEn: 'PlayStation Generations',
        titleAr: 'أجيال بلايستيشن',
        items: [
          { nameEn: 'PlayStation 1 (PS1)', nameAr: 'بلايستيشن 1 (PS1)', category: 'playstation', subCategory: 'ps1' },
          { nameEn: 'PlayStation 2 (PS2)', nameAr: 'بلايستيشن 2 (PS2)', category: 'playstation', subCategory: 'ps2' },
          { nameEn: 'PlayStation 3 (PS3)', nameAr: 'بلايستيشن 3 (PS3)', category: 'playstation', subCategory: 'ps3' },
          { nameEn: 'PlayStation 4 (PS4)', nameAr: 'بلايستيشن 4 (PS4)', category: 'playstation', subCategory: 'ps4' },
          { nameEn: 'PlayStation 5 (PS5)', nameAr: 'بلايستيشن 5 (PS5)', category: 'playstation', subCategory: 'ps5' },
          { nameEn: 'PSP / Handhelds', nameAr: 'بي إس بي / الأجهزة المحمولة', category: 'playstation', subCategory: 'psp' },
        ],
      },
      {
        titleEn: 'Shop by Type (Sections)',
        titleAr: 'تسوق حسب النوع (الأقسام)',
        items: [
          { nameEn: 'PlayStation Consoles', nameAr: 'أجهزة بلايستيشن', category: 'playstation', section: 'consoles' },
          { nameEn: 'Controllers & Accessories', nameAr: 'أذرع التحكم والإكسسوارات', category: 'playstation', section: 'accessories' },
          { nameEn: 'Games, Discs & CDs', nameAr: 'الألعاب والأقراص الأصلية', category: 'playstation', section: 'games-cds' },
          { nameEn: 'Memory Cards & Adapters', nameAr: 'كروت الذاكرة والمحولات', category: 'playstation', section: 'accessories' },
          { nameEn: 'Special & Limited Editions', nameAr: 'الإصدارات الخاصة والمحدودة', category: 'playstation', section: 'consoles' },
        ],
      },
      {
        titleEn: 'Popular PS Categories',
        titleAr: 'أقسام بلايستيشن المميزة',
        items: [
          { nameEn: 'PS4 Pro Limited Editions', nameAr: 'إصدارات PS4 Pro المحدودة', category: 'playstation', subCategory: 'ps4' },
          { nameEn: 'PS3 Fat & Slim Systems', nameAr: 'أجهزة PS3 الأصلية وسليم', category: 'playstation', subCategory: 'ps3', section: 'consoles' },
          { nameEn: 'PS2 Classic Black & Slim', nameAr: 'أجهزة PS2 الكلاسيكية', category: 'playstation', subCategory: 'ps2', section: 'consoles' },
          { nameEn: 'PlayStation Classic Mini', nameAr: 'بلايستيشن كلاسيك ميني', category: 'playstation', subCategory: 'ps1', section: 'consoles' },
          { nameEn: 'PSP 3000 Series', nameAr: 'سلسلة PSP 3000', category: 'playstation', subCategory: 'psp' },
        ],
      },
    ],
    promo: {
      titleEn: 'Sony PlayStation Vault',
      titleAr: 'خزينة سوني بلايستيشن',
      descEn: 'Tested original consoles, boxed collector editions, and retro discs certified by RETRO Qatar.',
      descAr: 'أجهزة كونسول أصلية مفحوصة 100% وإصدارات خاصة معتمدة من ريترو قطر.',
      ctaEn: 'View PlayStation',
      ctaAr: 'تصفح بلايستيشن',
      href: '/playstation',
      image: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/25 via-retro-bg-card to-retro-bg-card',
    },
  },

  // ── NINTENDO ──
  'nintendo': {
    columns: [
      {
        titleEn: 'Nintendo Platforms',
        titleAr: 'منصات نينتندو',
        items: [
          { nameEn: 'NES / SNES / Famicom', nameAr: 'إن إي إس / سوبر نينتندو / فاميلي', category: 'nintendo', subCategory: 'nes-snes' },
          { nameEn: 'Game Boy (GBA / GBC)', nameAr: 'جيم بوي (GBA / GBC)', category: 'nintendo', subCategory: 'game-boy' },
          { nameEn: 'Nintendo DS / 3DS', nameAr: 'نينتندو دي إس / 3DS', category: 'nintendo', subCategory: 'ds-3ds' },
          { nameEn: 'Wii / Wii U / GameCube', nameAr: 'وي / وي يو / جيم كيوب', category: 'nintendo', subCategory: 'wii-wiiu-gamecube' },
          { nameEn: 'Nintendo Switch', nameAr: 'نينتندو سويتش', category: 'nintendo', subCategory: 'switch' },
        ],
      },
      {
        titleEn: 'Shop by Type (Sections)',
        titleAr: 'تسوق حسب النوع (الأقسام)',
        items: [
          { nameEn: 'Nintendo Consoles', nameAr: 'أجهزة نينتندو', category: 'nintendo', section: 'consoles' },
          { nameEn: 'Controllers & Accessories', nameAr: 'أذرع التحكم والإكسسوارات', category: 'nintendo', section: 'accessories' },
          { nameEn: 'Games, Cartridges & CDs', nameAr: 'الأشرطة والألعاب الأصلية', category: 'nintendo', section: 'games-cds' },
          { nameEn: 'Collector Packs & VHS', nameAr: 'إصدارات المقتنين والأشرطة', category: 'nintendo', section: 'accessories' },
        ],
      },
      {
        titleEn: 'Legendary Franchises',
        titleAr: 'سلاسل نينتندو الأسطورية',
        items: [
          { nameEn: 'The Legend of Zelda', nameAr: 'ذا ليجند أوف زيلدا', category: 'nintendo', subCategory: 'switch' },
          { nameEn: 'Pokémon Collections', nameAr: 'مقتنيات بوكيمون', category: 'nintendo', subCategory: 'game-boy' },
          { nameEn: 'Super Mario Bros', nameAr: 'سوبر ماريو بروس', category: 'nintendo', subCategory: 'nes-snes' },
          { nameEn: 'Nintendo 64 Classic', nameAr: 'نينتندو 64 كلاسيك', category: 'nintendo', subCategory: 'wii-wiiu-gamecube' },
        ],
      },
    ],
    promo: {
      titleEn: 'Nintendo Heritage Hub',
      titleAr: 'تراث نينتندو الكلاسيكي',
      descEn: 'From Famicom and Game Boy to OLED Switch Limited Editions.',
      descAr: 'من الفاميلي كمبيوتر والجيم بوي حتى إصدارات سويتش زيلدا المحدودة.',
      ctaEn: 'Explore Nintendo',
      ctaAr: 'تصفح نينتندو',
      href: '/nintendo',
      image: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600/25 via-retro-bg-card to-retro-bg-card',
    },
  },

  // ── XBOX ──
  'xbox': {
    columns: [
      {
        titleEn: 'Xbox Generations',
        titleAr: 'أجيال إكس بوكس',
        items: [
          { nameEn: 'Original Xbox (Classic)', nameAr: 'إكس بوكس الأصلي', category: 'xbox', subCategory: 'xbox-original' },
          { nameEn: 'Xbox 360', nameAr: 'إكس بوكس 360', category: 'xbox', subCategory: 'xbox-360' },
          { nameEn: 'Xbox One', nameAr: 'إكس بوكس ون', category: 'xbox', subCategory: 'xbox-one' },
          { nameEn: 'Xbox Series X / Series S', nameAr: 'إكس بوكس سيريس X / S', category: 'xbox', subCategory: 'xbox-series' },
          { nameEn: 'Xbox Accessories & Other', nameAr: 'إكسسوارات وملحقات إكس بوكس', category: 'xbox', subCategory: 'xbox-other' },
        ],
      },
      {
        titleEn: 'Shop by Type (Sections)',
        titleAr: 'تسوق حسب النوع (الأقسام)',
        items: [
          { nameEn: 'Xbox Consoles', nameAr: 'أجهزة إكس بوكس', category: 'xbox', section: 'consoles' },
          { nameEn: 'Controllers & Accessories', nameAr: 'أذرع التحكم والمحولات', category: 'xbox', section: 'accessories' },
          { nameEn: 'Xbox Games & Discs', nameAr: 'ألعاب وأقراص إكس بوكس', category: 'xbox', section: 'games-cds' },
          { nameEn: 'Limited & Special Packs', nameAr: 'حزم وإصدارات خاصة', category: 'xbox', section: 'consoles' },
        ],
      },
      {
        titleEn: 'Featured Xbox Packs',
        titleAr: 'حزم إكس بوكس الخاصة',
        items: [
          { nameEn: 'Xbox 360 Gears of War Red', nameAr: 'إكس بوكس 360 جيرز أوف وور', category: 'xbox', subCategory: 'xbox-360' },
          { nameEn: 'Xbox 360 MW2 Limited', nameAr: 'إكس بوكس 360 مودرن وورفير 2', category: 'xbox', subCategory: 'xbox-360' },
          { nameEn: 'Original Xbox Custom R2-D2', nameAr: 'إكس بوكس الأصلي R2-D2', category: 'xbox', subCategory: 'xbox-original' },
          { nameEn: 'Xbox One Sunset Overdrive', nameAr: 'إكس بوكس ون سانسيت أوفر درايف', category: 'xbox', subCategory: 'xbox-one' },
        ],
      },
    ],
    promo: {
      titleEn: 'Microsoft Xbox Zone',
      titleAr: 'قسم مايكروسوفت إكس بوكس',
      descEn: 'Original Xbox systems, Xbox 360 limited editions, and Series S hardware.',
      descAr: 'أجهزة إكس بوكس الأصلية والإصدارات الخاصة المحدودة النادرة.',
      ctaEn: 'Explore Xbox',
      ctaAr: 'تصفح إكس بوكس',
      href: '/xbox',
      image: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/25 via-retro-bg-card to-retro-bg-card',
    },
  },

  // ── RETRO GAMES ──
  'retro-gaming': {
    columns: [
      {
        titleEn: 'Retro Platforms',
        titleAr: 'منصات الريترو الكلاسيكية',
        items: [
          { nameEn: 'Atari (2600 / 7800 / Flashback)', nameAr: 'أتاري (2600 / 7800 / فلاش باك)', category: 'retro-games', subCategory: 'atari' },
          { nameEn: 'Sega (Mega Drive / Master System)', nameAr: 'سيجا (ميجا درايف / ماستر سيستم)', category: 'retro-games', subCategory: 'sega' },
          { nameEn: 'Sega Saturn & Dreamcast', nameAr: 'سيجا ساتورن ودريم كاست', category: 'retro-games', subCategory: 'dreamcast-saturn' },
          { nameEn: 'Amiga & Commodore C64', nameAr: 'أميغا وكومودور C64', category: 'retro-games', subCategory: 'amiga-commodore' },
          { nameEn: 'PC Engine / Famicom / Arcade', nameAr: 'بي سي إنجن / فاميلي كمبيوتر / أركيد', category: 'retro-games', subCategory: 'other-retro' },
        ],
      },
      {
        titleEn: 'Shop by Type (Sections)',
        titleAr: 'تسوق حسب النوع (الأقسام)',
        items: [
          { nameEn: 'Retro Consoles & Systems', nameAr: 'أجهزة الكونسول الكلاسيكية', category: 'retro-games', section: 'consoles' },
          { nameEn: 'Joysticks, Wheels & Cables', nameAr: 'أذرع تحكم الأركيد والكابلات', category: 'retro-games', section: 'accessories' },
          { nameEn: 'Retro Cartridges, CDs & Tapes', nameAr: 'أشرطة وكارتريدج وأقراص ريترو', category: 'retro-games', section: 'games-cds' },
          { nameEn: 'Clone & Compatible Systems', nameAr: 'أجهزة متوافقة ومعدلة', category: 'retro-games', section: 'consoles' },
        ],
      },
      {
        titleEn: 'Retro Showcase',
        titleAr: 'أجهزة كلاسيكية مميزة',
        items: [
          { nameEn: 'The C64 Mini 64 Games', nameAr: 'كومودور 64 ميني مع 64 لعبة', category: 'retro-games', subCategory: 'amiga-commodore' },
          { nameEn: 'Amiga CD32 Critical Zone', nameAr: 'أميغا CD32 حزمة كريتيكال زون', category: 'retro-games', subCategory: 'amiga-commodore' },
          { nameEn: 'PC Engine Japanese Edition', nameAr: 'بي سي إنجن النسخة اليابانية', category: 'retro-games', subCategory: 'other-retro' },
          { nameEn: 'Speedlink Competition Pro', nameAr: 'يد تحكم سبيدلينك برو USB', category: 'retro-games', section: 'accessories' },
        ],
      },
    ],
    promo: {
      titleEn: 'Certified Retro Inspection',
      titleAr: 'فحص وضمان ريترو قطر',
      descEn: 'Ultrasonically cleaned motherboards, recapped circuits, and 100% operational guarantee.',
      descAr: 'فحص تقني شامل وتنظيف بالموجات فوق الصوتية وضمان تشغيلي معتمد.',
      ctaEn: 'View Classics',
      ctaAr: 'تصفح الريترو',
      href: '/retro-gaming-classics',
      image: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-600/25 via-retro-bg-card to-retro-bg-card',
    },
  },

  // ── PC / COMPUTER (Independent PC Store) ──
  'pc': {
    columns: [
      {
        titleEn: 'PC Core Components',
        titleAr: 'مكونات الكمبيوتر الأساسية',
        items: [
          { nameEn: 'CPUs (Intel & AMD Ryzen)', nameAr: 'المعالجات (Intel و AMD)', category: 'pc', subCategory: 'cpus' },
          { nameEn: 'GPUs (RTX & Radeon)', nameAr: 'كروت الشاشة (NVIDIA و AMD)', category: 'pc', subCategory: 'gpus' },
          { nameEn: 'Motherboards (AM4/AM5/Intel)', nameAr: 'اللوحات الأم (Motherboards)', category: 'pc', subCategory: 'motherboards' },
          { nameEn: 'RAM Memory (DDR4 / DDR5)', nameAr: 'الذاكرة العشوائية (RAM)', category: 'pc', subCategory: 'ram' },
          { nameEn: 'Storage (NVMe SSD / HDD)', nameAr: 'وحدات التخزين (SSD / HDD)', category: 'pc', subCategory: 'storage' },
          { nameEn: 'Power Supplies (PSUs)', nameAr: 'مزودات الطاقة (PSUs)', category: 'pc', subCategory: 'psus' },
        ],
      },
      {
        titleEn: 'Chassis & Thermal',
        titleAr: 'الكيسات وأنظمة التبريد',
        items: [
          { nameEn: 'PC Cases & Towers', nameAr: 'صناديق الكمبيوتر (Cases)', category: 'pc', subCategory: 'pc-cases' },
          { nameEn: 'AIO Liquid Cooling', nameAr: 'تبريد مائي مغلق AIO', category: 'pc', subCategory: 'cooling' },
          { nameEn: 'Air Coolers & ARGB Fans', nameAr: 'مبردات هوائية ومراوح ARGB', category: 'pc', subCategory: 'cooling' },
          { nameEn: 'Thermal Pastes & Mounts', nameAr: 'معجون تبريد وقطع تثبيت', category: 'pc', subCategory: 'cooling' },
        ],
      },
      {
        titleEn: 'Gaming Systems & Software',
        titleAr: 'أنظمة الألعاب وألعاب PC',
        items: [
          { nameEn: 'Custom & Pre-built Gaming PCs', nameAr: 'تجميعات ألعاب احترافية جاهزة', category: 'pc', subCategory: 'gaming-pcs' },
          { nameEn: 'High-Refresh Gaming Monitors', nameAr: 'شاشات ألعاب عالية التردد', category: 'pc', subCategory: 'monitors' },
          { nameEn: 'PC Gaming Laptops', nameAr: 'أجهزة لابتوب للألعاب والعمل', category: 'pc', subCategory: 'laptops' },
          { nameEn: 'PC Gaming Accessories', nameAr: 'ملحقات الحاسوب (كيبورد / ماوس)', category: 'pc', subCategory: 'pc-accessories' },
          { nameEn: 'PC Games & Discs (Crysis, etc.)', nameAr: 'ألعاب وأقراص الكمبيوتر الأصلية', category: 'pc', subCategory: 'pc-games', section: 'games-cds' },
        ],
      },
    ],
    promo: {
      titleEn: 'Custom PC Simulator',
      titleAr: 'محاكي تجميعات الكمبيوتر',
      descEn: 'Build your dream rig with real-time bottleneck and wattage checks.',
      descAr: 'قم بتركيب تجميعتك المثالية مع فحص التوافق واستهلاك الطاقة فورياً.',
      ctaEn: 'Open Builder',
      ctaAr: 'ابدأ التجميع',
      href: '/pc-builder',
      image: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-retro-cyan/25 via-retro-bg-card to-retro-bg-card',
    },
  },

  // ── ACCESSORIES ──
  'accessories': {
    columns: [
      {
        titleEn: 'Keyboards & Mice',
        titleAr: 'لوحات المفاتيح والماوسات',
        items: [
          { nameEn: 'Mechanical Keyboards', nameAr: 'لوحات مفاتيح ميكانيكية', category: 'accessories', subCategory: 'gaming-keyboards' },
          { nameEn: 'Precision Gaming Mice', nameAr: 'ماوسات ألعاب عالية الدقة', category: 'accessories', subCategory: 'gaming-mice' },
          { nameEn: 'Speed & Control Mousepads', nameAr: 'أسطح ماوس باد احترافية', category: 'accessories', subCategory: 'mousepads' },
        ],
      },
      {
        titleEn: 'Audio & Streaming',
        titleAr: 'الصوتيات وصناعة المحتوى',
        items: [
          { nameEn: 'Surround Sound Headsets', nameAr: 'سماعات رأس محيطية', category: 'accessories', subCategory: 'headsets' },
          { nameEn: 'Broadcast Microphones', nameAr: 'ميكروفونات تسجيل وبث', category: 'accessories', subCategory: 'microphones' },
          { nameEn: 'Webcams & RGB Ambience', nameAr: 'كاميرات وإضاءة ديكور', category: 'accessories', subCategory: 'webcams' },
        ],
      },
      {
        titleEn: 'Setup Furniture & Arms',
        titleAr: 'أثاث وتجهيز بيئة اللعب',
        items: [
          { nameEn: 'Ergonomic Gaming Chairs', nameAr: 'كراسي ألعاب طبية', category: 'accessories', subCategory: 'gaming-chairs' },
          { nameEn: 'Electric Standing Desks', nameAr: 'طاولات ألعاب كهربائية', category: 'accessories', subCategory: 'gaming-desks' },
          { nameEn: 'Heavy Duty Monitor Arms', nameAr: 'حوامل شاشات هيدروليكية', category: 'accessories', subCategory: 'monitor-arms' },
        ],
      },
    ],
  },
};

export function MegaMenu({ activeCategory, locale, dict, onClose }: MegaMenuProps) {
  const isRtl = locale === 'ar';
  
  // Normalise category slug for lookup
  const lookupKey = activeCategory === 'pc-components' || activeCategory === 'computers' 
    ? 'pc' 
    : activeCategory === 'retro-gaming-classics' || activeCategory === 'retro-games'
    ? 'retro-gaming'
    : activeCategory;

  const categoryData = MEGA_MENU_DATA[lookupKey] || MEGA_MENU_DATA['gaming'];

  if (!categoryData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute top-full left-0 right-0 w-full z-50 bg-retro-bg-secondary/95 backdrop-blur-2xl border-b border-retro-border shadow-2xl overflow-hidden"
      onMouseLeave={onClose}
    >
      {/* Glowing border top accent */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-retro-cyan/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* ── Subcategories & Sections Columns ── */}
          <div
            className={`grid gap-8 ${
              categoryData.promo ? 'col-span-8 grid-cols-3' : 'col-span-12 grid-cols-3'
            }`}
          >
            {categoryData.columns.map((col, idx) => (
              <div key={idx} className="space-y-3.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-retro-cyan border-b border-retro-border/80 pb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-retro-cyan shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  <span>{isRtl ? col.titleAr : col.titleEn}</span>
                </h3>
                <ul className="space-y-2">
                  {col.items.map((item, itemIdx) => {
                    const queryParams = new URLSearchParams();
                    if (item.category) queryParams.set('category', item.category);
                    if (item.subCategory) queryParams.set('subCategory', item.subCategory);
                    if (item.section) queryParams.set('section', item.section);

                    const targetHref = `/${locale}/products?${queryParams.toString()}`;

                    return (
                      <li key={itemIdx}>
                        <Link
                          href={targetHref}
                          onClick={onClose}
                          className="text-xs text-retro-text-secondary hover:text-retro-cyan hover:translate-x-1.5 transition-all inline-flex items-center gap-1.5 rtl:hover:-translate-x-1.5 py-0.5"
                        >
                          <span className="text-[10px] text-retro-text-dim">›</span>
                          <span className="font-medium">{isRtl ? item.nameAr : item.nameEn}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Promotional Banner Card ── */}
          {categoryData.promo && (
            <div className="col-span-4 h-full">
              <Link href={`/${locale}${categoryData.promo.href}`} onClick={onClose} className="block h-full group">
                <div
                  className={`h-full rounded-2xl border border-retro-border hover:border-retro-cyan/40 p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${categoryData.promo.image} shadow-lg hover:shadow-retro-cyan/10`}
                >
                  {/* Glowing blur orb */}
                  <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-retro-cyan/15 blur-2xl group-hover:scale-125 transition-transform duration-500" />
                  
                  <div>
                    <span className="inline-block rounded-full bg-retro-cyan/10 border border-retro-cyan/30 text-retro-cyan text-[10px] font-black uppercase px-2.5 py-0.5 mb-3.5">
                      {isRtl ? 'RETRO QATAR' : 'OFFICIAL'}
                    </span>
                    <h4 className="text-base font-black text-retro-text leading-tight group-hover:text-retro-cyan transition-colors">
                      {isRtl ? categoryData.promo.titleAr : categoryData.promo.titleEn}
                    </h4>
                    <p className="text-xs text-retro-text-secondary mt-2.5 leading-relaxed">
                      {isRtl ? categoryData.promo.descAr : categoryData.promo.descEn}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 mt-6 text-xs font-bold text-retro-cyan group-hover:translate-x-1.5 transition-transform rtl:group-hover:-translate-x-1.5">
                    <span>{isRtl ? categoryData.promo.ctaAr : categoryData.promo.ctaEn}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="rtl:rotate-180"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
