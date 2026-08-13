// RETRO Qatar — Mega Menu Component
// Displays dynamic multi-column grids for subcategories with premium hover animations and RTL support

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

interface SubCategory {
  nameEn: string;
  nameAr: string;
  slug: string;
}

interface MegaColumn {
  titleEn: string;
  titleAr: string;
  items: SubCategory[];
}

// Subcategories mapping matching products structure
const MEGA_MENU_DATA: Record<string, { columns: MegaColumn[]; promo?: { titleEn: string; titleAr: string; descEn: string; descAr: string; ctaEn: string; ctaAr: string; href: string; image: string } }> = {
  'gaming': {
    columns: [
      {
        titleEn: 'Consoles',
        titleAr: 'أجهزة الكونسول',
        items: [
          { nameEn: 'PlayStation', nameAr: 'بلايستيشن', slug: 'playstation' },
          { nameEn: 'Xbox', nameAr: 'إكس بوكس', slug: 'xbox' },
          { nameEn: 'Nintendo', nameAr: 'نينتندو', slug: 'nintendo' },
          { nameEn: 'Handheld Consoles', nameAr: 'أجهزة محمولة', slug: 'handheld-consoles' },
          { nameEn: 'Other Consoles', nameAr: 'منصات أخرى', slug: 'other-consoles' },
        ],
      },
      {
        titleEn: 'Games',
        titleAr: 'الألعاب',
        items: [
          { nameEn: 'PlayStation Games', nameAr: 'ألعاب بلايستيشن', slug: 'playstation-games' },
          { nameEn: 'Xbox Games', nameAr: 'ألعاب إكس بوكس', slug: 'xbox-games' },
          { nameEn: 'Nintendo Games', nameAr: 'ألعاب نينتندو', slug: 'nintendo-games' },
          { nameEn: 'PC Games', nameAr: 'ألعاب كمبيوتر', slug: 'pc-games' },
          { nameEn: 'Retro Games', nameAr: 'ألعاب كلاسيكية ريترو', slug: 'retro-games' },
        ],
      },
      {
        titleEn: 'Controllers',
        titleAr: 'أذرع التحكم',
        items: [
          { nameEn: 'PlayStation Controllers', nameAr: 'أذرع بلايستيشن', slug: 'playstation-controllers' },
          { nameEn: 'Xbox Controllers', nameAr: 'أذرع إكس بوكس', slug: 'xbox-controllers' },
          { nameEn: 'Nintendo Controllers', nameAr: 'أذرع نينتندو', slug: 'nintendo-controllers' },
          { nameEn: 'Retro Controllers', nameAr: 'أذرع ريترو', slug: 'retro-controllers' },
          { nameEn: 'Other Controllers', nameAr: 'أذرع تحكم أخرى', slug: 'other-controllers' },
        ],
      },
      {
        titleEn: 'Gaming Accessories',
        titleAr: 'إكسسوارات الألعاب',
        items: [
          { nameEn: 'Charging Stations', nameAr: 'قواعد شحن', slug: 'charging-stations' },
          { nameEn: 'Cables & Adapters', nameAr: 'كابلات ومحولات', slug: 'cables-adapters' },
          { nameEn: 'Storage Expand', nameAr: 'توسعة التخزين', slug: 'storage' },
          { nameEn: 'Console Accessories', nameAr: 'ملحقات أجهزة الألعاب', slug: 'console-accessories' },
        ],
      },
    ],
    promo: {
      titleEn: 'Next-Gen VR & Pro Gear',
      titleAr: 'أجهزة الواقع الافتراضي',
      descEn: 'Step into the future. Discover PS VR2 and custom esports controllers.',
      descAr: 'ادخل المستقبل. تصفح أجهزة نظارات PS VR2 والتحكم الاحترافية.',
      ctaEn: 'Explore Gear',
      ctaAr: 'تصفح العتاد',
      href: '/products?category=gaming&subCategory=console-accessories',
      image: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-retro-cyan/20 via-retro-bg-card to-retro-bg-card',
    },
  },
  'retro-gaming': {
    columns: [
      {
        titleEn: 'Sony & Xbox Retro',
        titleAr: 'ريترو سوني وإكس بوكس',
        items: [
          { nameEn: 'PlayStation 1', nameAr: 'بلايستيشن 1', slug: 'playstation-1' },
          { nameEn: 'PlayStation 2', nameAr: 'بلايستيشن 2', slug: 'playstation-2' },
          { nameEn: 'PlayStation 3', nameAr: 'بلايستيشن 3', slug: 'playstation-3' },
          { nameEn: 'Classic Xbox', nameAr: 'إكس بوكس كلاسيك', slug: 'classic-xbox' },
        ],
      },
      {
        titleEn: 'Nintendo Retro',
        titleAr: 'ريترو نينتندو',
        items: [
          { nameEn: 'Classic Nintendo', nameAr: 'نينتندو كلاسيك', slug: 'classic-nintendo' },
          { nameEn: 'Nintendo 64', nameAr: 'نينتندو 64', slug: 'nintendo-64' },
          { nameEn: 'GameCube', nameAr: 'جيم كيوب', slug: 'gamecube' },
          { nameEn: 'Game Boy Series', nameAr: 'عائلة قيم بوي', slug: 'game-boy' },
        ],
      },
      {
        titleEn: 'Sega & Handhelds',
        titleAr: 'سيجا والأجهزة المحمولة',
        items: [
          { nameEn: 'Sega Classics', nameAr: 'أجهزة سيجا الكلاسيكية', slug: 'sega' },
          { nameEn: 'Atari Systems', nameAr: 'أجهزة أتاري القديمة', slug: 'atari' },
          { nameEn: 'Arcade Machines', nameAr: 'ألعاب آركيد', slug: 'arcade' },
          { nameEn: 'PSP & Vita', nameAr: 'بي إس بي وفيتا', slug: 'psp' },
        ],
      },
      {
        titleEn: 'Retro Peripherals',
        titleAr: 'ملحقات ريترو',
        items: [
          { nameEn: 'Retro Controllers', nameAr: 'أذرع تحكم ريترو', slug: 'retro-controllers' },
          { nameEn: 'Retro Games CD/Cart', nameAr: 'أشرطة كلاسيكية', slug: 'retro-games' },
          { nameEn: 'Retro Accessories', nameAr: 'إكسسوارات ريترو', slug: 'retro-accessories' },
          { nameEn: 'Collectibles & Mods', nameAr: 'مجسمات وتعديلات', slug: 'collectibles' },
        ],
      },
    ],
    promo: {
      titleEn: 'Restore Old Consoles',
      titleAr: 'صيانة وتجديد الأجهزة القديمة',
      descEn: 'Certified repair hub for Sega, Atari, and classic handheld chip recap.',
      descAr: 'مركز صيانة معتمد لإعادة إحياء أجهزة سيغا وأتاري والقطع القديمة.',
      ctaEn: 'Book Mod',
      ctaAr: 'احجز صيانة',
      href: '/repair',
      image: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-retro-pink/20 via-retro-bg-card to-retro-bg-card',
    },
  },
  'pc': {
    columns: [
      {
        titleEn: 'Gaming PCs',
        titleAr: 'حواسيب قيمنق مجمعة',
        items: [
          { nameEn: 'Entry Level', nameAr: 'مستوى مبتدئ', slug: 'entry-level' },
          { nameEn: 'Mid Range', nameAr: 'مستوى متوسط', slug: 'mid-range' },
          { nameEn: 'High End', nameAr: 'مستوى عالي', slug: 'high-end' },
          { nameEn: 'Extreme Rigs', nameAr: 'مستوى خارق', slug: 'extreme' },
        ],
      },
      {
        titleEn: 'Core Components',
        titleAr: 'القطع الأساسية',
        items: [
          { nameEn: 'CPUs (Intel/AMD)', nameAr: 'المعالجات', slug: 'cpu' },
          { nameEn: 'GPUs (NVIDIA/AMD)', nameAr: 'كروت الشاشة', slug: 'gpu' },
          { nameEn: 'Motherboards', nameAr: 'اللوحات الأم', slug: 'motherboards' },
          { nameEn: 'RAM Memory', nameAr: 'الذاكرة العشوائية', slug: 'ram' },
          { nameEn: 'Storage (NVMe/SSD)', nameAr: 'وحدات التخزين', slug: 'storage' },
        ],
      },
      {
        titleEn: 'Chassis & Power',
        titleAr: 'الكيس ومزودات الطاقة',
        items: [
          { nameEn: 'Power Supplies (PSU)', nameAr: 'مزودات الطاقة', slug: 'psu' },
          { nameEn: 'PC Cases', nameAr: 'كيسات الكمبيوتر', slug: 'pc-cases' },
          { nameEn: 'Cables & Adapters', nameAr: 'توصيلات داخلية كابلات', slug: 'cables' },
          { nameEn: 'Networking Cards', nameAr: 'كروت الشبكة والواي فاي', slug: 'networking' },
        ],
      },
      {
        titleEn: 'Cooling Products',
        titleAr: 'أنظمة التبريد',
        items: [
          { nameEn: 'CPU Air Cooling', nameAr: 'مبرد هوائي للمعالج', slug: 'cpu-cooling' },
          { nameEn: 'Liquid AIO Coolers', nameAr: 'مبردات مائية مغلقة AIO', slug: 'aio-cooling' },
          { nameEn: 'Case Fans', nameAr: 'مراوح تبريد الكيس', slug: 'case-fans' },
          { nameEn: 'Thermal Pastes', nameAr: 'معجون تبريد موصل', slug: 'thermal-products' },
        ],
      },
    ],
    promo: {
      titleEn: 'Custom PC Simulator',
      titleAr: 'محاكي تجميعات الكمبيوتر',
      descEn: 'Select compatible components with dynamic power checks.',
      descAr: 'اختر قطع كمبيوتر متوافقة بالكامل مع فحص القدرة الكهربائية.',
      ctaEn: 'Configure Rig',
      ctaAr: 'ابدأ التجميع',
      href: '/pc-builder',
      image: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-retro-purple/20 via-retro-bg-card to-retro-bg-card',
    },
  },
  'accessories': {
    columns: [
      {
        titleEn: 'Keyboards & Mice',
        titleAr: 'الكيبورد والماوس',
        items: [
          { nameEn: 'Gaming Keyboards', nameAr: 'لوحات مفاتيح ألعاب', slug: 'gaming-keyboards' },
          { nameEn: 'Gaming Mice', nameAr: 'ماوسات ألعاب دقيقة', slug: 'gaming-mice' },
          { nameEn: 'Mousepads', nameAr: 'أسطح ماوس باد', slug: 'mousepads' },
        ],
      },
      {
        titleEn: 'Audio & Streaming',
        titleAr: 'الصوتيات والبث المباشر',
        items: [
          { nameEn: 'Pro Headsets', nameAr: 'سماعات رأس محيطية', slug: 'headsets' },
          { nameEn: 'Studio Microphones', nameAr: 'ميكروفونات تسجيل وبث', slug: 'microphones' },
          { nameEn: 'Webcams & Capture', nameAr: 'كاميرات وبطاقات التقاط', slug: 'webcams' },
          { nameEn: 'Streaming Gear', nameAr: 'معدات صناع المحتوى', slug: 'streaming' },
          { nameEn: 'RGB Ambient Lights', nameAr: 'إضاءة ذكية وديكور', slug: 'rgb-lighting' },
        ],
      },
      {
        titleEn: 'Setup Furniture',
        titleAr: 'أثاث وتجهيز الغرفة',
        items: [
          { nameEn: 'Gaming Chairs', nameAr: 'كراسي قيمنق طبية', slug: 'gaming-chairs' },
          { nameEn: 'Gaming Desks', nameAr: 'طاولات ألعاب كهربائية', slug: 'gaming-desks' },
          { nameEn: 'Monitor Arms', nameAr: 'حوامل شاشات متحركة', slug: 'monitor-arms' },
        ],
      },
    ],
  },
  'laptops': {
    columns: [
      {
        titleEn: 'Notebook Categories',
        titleAr: 'فئات اللابتوبات',
        items: [
          { nameEn: 'Gaming Laptops', nameAr: 'لابتوبات قيمنق قوية', slug: 'gaming-laptops' },
          { nameEn: 'Business Laptops', nameAr: 'لابتوبات أعمال خفيفة', slug: 'business-laptops' },
          { nameEn: 'Student Laptops', nameAr: 'لابتوبات دراسة واقتصادية', slug: 'student-laptops' },
          { nameEn: 'Laptop Accessories', nameAr: 'شواحن وحقائب ومستلزمات', slug: 'accessories' },
        ],
      },
    ],
  },
};

export function MegaMenu({ activeCategory, locale, dict, onClose }: MegaMenuProps) {
  const isRtl = locale === 'ar';
  const categoryData = MEGA_MENU_DATA[activeCategory];

  if (!categoryData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="absolute top-full left-0 right-0 w-full z-50 bg-retro-bg-secondary/95 backdrop-blur-2xl border-b border-retro-border shadow-2xl overflow-hidden"
      onMouseLeave={onClose}
    >
      {/* Dynamic Glowing border effect */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-retro-cyan/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-12 gap-8">
          {/* ── Subcategories Columns ── */}
          <div
            className={`grid gap-8 ${
              categoryData.promo ? 'col-span-8 grid-cols-4' : 'col-span-12 grid-cols-4'
            }`}
          >
            {categoryData.columns.map((col, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-[12px] font-black uppercase tracking-wider text-retro-text border-b border-retro-border pb-2">
                  {isRtl ? col.titleAr : col.titleEn}
                </h3>
                <ul className="space-y-2.5">
                  {col.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <Link
                        href={`/${locale}/products?category=${activeCategory}&subCategory=${item.slug}`}
                        onClick={onClose}
                        className="text-xs text-retro-text-secondary hover:text-retro-cyan hover:translate-x-1.5 transition-all inline-block rtl:hover:-translate-x-1.5"
                      >
                        {isRtl ? item.nameAr : item.nameEn}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Optional Promotional Banner (Side Card) ── */}
          {categoryData.promo && (
            <div className="col-span-4 h-full">
              <Link href={`/${locale}${categoryData.promo.href}`} onClick={onClose} className="block h-full group">
                <div
                  className={`h-full rounded-2xl border border-retro-border hover:border-retro-cyan/35 p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${categoryData.promo.image}`}
                >
                  {/* Subtle Background Glow circles */}
                  <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-retro-cyan/15 blur-2xl group-hover:scale-125 transition-transform duration-500" />
                  
                  <div>
                    <span className="inline-block rounded-full bg-retro-cyan/10 border border-retro-cyan/30 text-retro-cyan text-[10px] font-black uppercase px-2.5 py-0.5 mb-4">
                      {isRtl ? 'عروض متميزة' : 'PROMO'}
                    </span>
                    <h4 className="text-base font-black text-retro-text leading-tight group-hover:text-retro-cyan transition-colors">
                      {isRtl ? categoryData.promo.titleAr : categoryData.promo.titleEn}
                    </h4>
                    <p className="text-xs text-retro-text-secondary mt-2.5 max-w-[280px]">
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
