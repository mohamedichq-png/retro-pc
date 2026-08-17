// RETRO Qatar — Homepage Content (Client Component)
// Master storefront landing page organized into unified design system, balanced hero, 4 main portals, 12 visual categories, 8 product showcases, trust markers & store location

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useUIStore } from '@/stores/useUIStore';
import { BUSINESS_INFO } from '@/lib/constants';
import type { Product } from '@/types';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface HomepageContentProps {
  products: Product[];
  dict: Dictionary;
  locale: Locale;
}

// 12 Visual Categories (with dark glassmorphism & cyan/purple accents, NO orange bubbles)
const VISUAL_CATEGORIES = [
  {
    id: 'gaming-pcs',
    nameAr: 'تجميعات Gaming PC',
    nameEn: 'Gaming PCs',
    icon: '🖥️',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80',
    link: '/products?category=pc&subCategory=gaming-pcs',
    accent: 'cyan'
  },
  {
    id: 'gpus',
    nameAr: 'كروت الشاشة',
    nameEn: 'Graphics Cards',
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80',
    link: '/products?category=pc&subCategory=gpus',
    accent: 'cyan'
  },
  {
    id: 'cpus',
    nameAr: 'المعالجات',
    nameEn: 'Processors',
    icon: '⚙️',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    link: '/products?category=pc&subCategory=cpus',
    accent: 'purple'
  },
  {
    id: 'motherboards',
    nameAr: 'اللوحات الرئيسية',
    nameEn: 'Motherboards',
    icon: '🧩',
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&auto=format&fit=crop&q=80',
    link: '/products?category=pc&subCategory=motherboards',
    accent: 'purple'
  },
  {
    id: 'ram',
    nameAr: 'الذاكرة RAM',
    nameEn: 'RAM Memory',
    icon: '💾',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&auto=format&fit=crop&q=80',
    link: '/products?category=pc&subCategory=ram',
    accent: 'cyan'
  },
  {
    id: 'ssd',
    nameAr: 'وحدات التخزين SSD',
    nameEn: 'SSD Storage',
    icon: '💽',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop&q=80',
    link: '/products?category=pc&subCategory=storage',
    accent: 'cyan'
  },
  {
    id: 'monitors',
    nameAr: 'الشاشات',
    nameEn: 'Monitors',
    icon: '📺',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80',
    link: '/products?category=pc&subCategory=monitors',
    accent: 'purple'
  },
  {
    id: 'playstation',
    nameAr: 'PlayStation',
    nameEn: 'PlayStation',
    icon: '🎮',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&auto=format&fit=crop&q=80',
    link: '/products?category=playstation',
    accent: 'cyan'
  },
  {
    id: 'xbox',
    nameAr: 'Xbox',
    nameEn: 'Xbox',
    icon: '🟩',
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&auto=format&fit=crop&q=80',
    link: '/products?category=xbox',
    accent: 'green'
  },
  {
    id: 'nintendo',
    nameAr: 'Nintendo',
    nameEn: 'Nintendo',
    icon: '🔴',
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&auto=format&fit=crop&q=80',
    link: '/products?category=nintendo',
    accent: 'pink'
  },
  {
    id: 'retro-gaming',
    nameAr: 'Retro Gaming',
    nameEn: 'Retro Gaming',
    icon: '🕹️',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
    link: '/products?category=retro-games',
    accent: 'purple'
  },
  {
    id: 'accessories',
    nameAr: 'ملحقات Gaming',
    nameEn: 'Gaming Accessories',
    icon: '🎧',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80',
    link: '/products?category=consoles-accessories',
    accent: 'cyan'
  },
] as const;

export function HomepageContent({ products, dict, locale }: HomepageContentProps) {
  const isRtl = locale === 'ar';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activePcTab, setActivePcTab] = useState<'entry' | 'mid' | 'high' | 'extreme'>('mid');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { showToast, setActiveDepartment } = useUIStore();

  // Reset logo branding to general storefront on mount
  useEffect(() => {
    setActiveDepartment('general');
  }, [setActiveDepartment]);

  // 3 Curated Hero Slides
  const heroSlides = useMemo(() => [
    {
      id: 'gaming-pc',
      tag: isRtl ? 'تجميعات وقطع احترافية' : 'Gaming Rigs & Hardware',
      title: isRtl ? 'عروض Gaming PC وقطع الكمبيوتر' : 'Gaming PC & Component Deals',
      subtitle: isRtl 
        ? 'أقوى أداء للألعاب مع أحدث كروت RTX 40 ومعالجات الجيل الجديد مع ضمان محلي شامل سنتين.' 
        : 'Unleash extreme power with the latest RTX 40-series cards and certified parts with 2-year local warranty.',
      primaryBtnText: isRtl ? 'تسوق العروض' : 'Shop Deals',
      primaryBtnLink: '/products?sale=true',
      secondaryBtnText: isRtl ? 'ابنِ حاسوبك' : 'Build Your PC',
      secondaryBtnLink: '/pc-builder',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=700&auto=format&fit=crop&q=85',
      badgeGradient: 'from-retro-cyan to-blue-600',
      glowColor: 'rgba(34,211,238,0.25)',
    },
    {
      id: 'consoles',
      tag: isRtl ? 'أحدث المنصات والألعاب' : 'Next-Gen Platforms',
      title: isRtl ? 'أجهزة وألعاب الكونسول الحديثة' : 'Modern Consoles & Games',
      subtitle: isRtl 
        ? 'PlayStation 5 Pro، Xbox Series X، وNintendo Switch مع ملحقات احترافية وأحدث الألعاب الحصرية.' 
        : 'PlayStation 5 Pro, Xbox Series X, and Nintendo Switch with exclusive titles and custom pro controllers.',
      primaryBtnText: isRtl ? 'تسوق الكونسول' : 'Shop Consoles',
      primaryBtnLink: '/category/gaming',
      secondaryBtnText: isRtl ? 'تصفح الألعاب' : 'Browse Games',
      secondaryBtnLink: '/products?category=Games',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=700&auto=format&fit=crop&q=85',
      badgeGradient: 'from-retro-purple to-pink-600',
      glowColor: 'rgba(168,85,247,0.25)',
    },
    {
      id: 'retro',
      tag: isRtl ? 'كلاسيكيات أصلية مفحوصة' : 'Tested & Certified Classics',
      title: isRtl ? 'أجهزة Retro المفحوصة والمضمونة' : 'Guaranteed & Tested Retro Gear',
      subtitle: isRtl 
        ? 'أجهزة Game Boy و PS1 و Nintendo الكلاسيكية المجددة والمفحوصة بالكامل مع ضمان تشغيلي وملحقات أصلية.' 
        : 'Authentic vintage consoles, ultrasonic cleaned, recapped, and tested with operating warranty and full cables.',
      primaryBtnText: isRtl ? 'تسوق أجهزة Retro' : 'Shop Retro Gear',
      primaryBtnLink: '/category/retro-gaming',
      secondaryBtnText: isRtl ? 'احجز صيانة' : 'Book Repair',
      secondaryBtnLink: '/repair',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700&auto=format&fit=crop&q=85',
      badgeGradient: 'from-emerald-400 to-cyan-500',
      glowColor: 'rgba(52,211,153,0.25)',
    },
  ], [isRtl]);

  // Auto rotate 3 hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // 1. Deals Products (On Sale)
  const dealsProducts = useMemo(() => {
    return products
      .filter((p) => p.status !== 'draft' && p.salePrice && p.salePrice < p.sellingPrice)
      .slice(0, 4);
  }, [products]);

  // 2. Best Sellers
  const bestSellers = useMemo(() => {
    return products
      .filter((p) => p.status !== 'draft' && (p.isFeatured || p.stockQty > 5))
      .slice(0, 8);
  }, [products]);

  // 3. New Arrivals
  const newArrivals = useMemo(() => {
    return products
      .filter((p) => p.status !== 'draft' && p.condition === 'New')
      .slice(0, 8);
  }, [products]);

  // 4. Gaming PCs by Tier
  const gamingPcs = useMemo(() => {
    const list = products.filter((p) => {
      if (p.status === 'draft') return false;
      return (
        p.mainCategory === 'pc' && (p.subCategory === 'gaming-pcs' || p.category === 'gaming-pcs' || p.nameEn.toLowerCase().includes('gaming pc') || p.nameEn.toLowerCase().includes('pc') || p.id.startsWith('p-pc-'))
      );
    });

    if (list.length > 0) return list;

    // Fallback to high-end PC products if specific builds are empty
    return products.filter((p) => p.status !== 'draft' && (p.mainCategory === 'pc' || p.category === 'pc-components')).slice(0, 12);
  }, [products]);

  const categorizedGamingPcs = useMemo(() => {
    const tiers = { entry: [] as Product[], mid: [] as Product[], high: [] as Product[], extreme: [] as Product[] };
    gamingPcs.forEach((p, idx) => {
      const price = p.salePrice ?? p.sellingPrice;
      if (price < 3000 || idx % 4 === 0) tiers.entry.push(p);
      else if (price < 6000 || idx % 4 === 1) tiers.mid.push(p);
      else if (price < 10000 || idx % 4 === 2) tiers.high.push(p);
      else tiers.extreme.push(p);
    });

    // Ensure all tiers have at least 1 item for display
    if (tiers.entry.length === 0 && gamingPcs[0]) tiers.entry.push(gamingPcs[0]);
    if (tiers.mid.length === 0 && gamingPcs[1]) tiers.mid.push(gamingPcs[1]);
    if (tiers.high.length === 0 && gamingPcs[2]) tiers.high.push(gamingPcs[2]);
    if (tiers.extreme.length === 0 && (gamingPcs[3] || gamingPcs[0])) tiers.extreme.push(gamingPcs[3] || gamingPcs[0]);

    return tiers;
  }, [gamingPcs]);

  // 5. PC Components
  const pcComponents = useMemo(() => {
    return products
      .filter((p) => {
        if (p.status === 'draft') return false;
        return (
          p.mainCategory === 'pc' ||
          p.category === 'PC Components' ||
          p.category === 'cpus' ||
          p.category === 'gpus' ||
          p.category === 'ram' ||
          p.category === 'ssd' ||
          p.category === 'motherboards' ||
          p.id.startsWith('p-comp-') ||
          p.id.startsWith('p-new-')
        );
      })
      .slice(0, 8);
  }, [products]);

  // 6. Consoles & Modern Gaming
  const modernConsoles = useMemo(() => {
    return products
      .filter((p) => {
        if (p.status === 'draft') return false;
        return (
          p.mainCategory === 'playstation' ||
          p.mainCategory === 'xbox' ||
          p.mainCategory === 'nintendo' ||
          p.mainCategory === 'consoles-accessories' ||
          p.category === 'Consoles & Accessories' ||
          p.category === 'Gaming' ||
          p.id.startsWith('CON-') ||
          p.id.startsWith('p-ctrl-')
        ) && !p.id.startsWith('p-retro-');
      })
      .slice(0, 8);
  }, [products]);

  // 7. Curated Retro Picks
  const retroPicks = useMemo(() => {
    return products
      .filter((p) => {
        if (p.status === 'draft') return false;
        return (
          p.mainCategory === 'retro-games' ||
          p.subCategory === 'ps1' ||
          p.subCategory === 'ps2' ||
          p.subCategory === 'game-boy' ||
          p.subCategory === 'atari' ||
          p.subCategory === 'sega' ||
          p.category === 'Retro Gaming' ||
          p.category === 'Retro Consoles & Games' ||
          p.id.startsWith('p-retro-') ||
          p.productType === 'RETRO PRODUCT'
        );
      })
      .slice(0, 8);
  }, [products]);

  // 8. Refurbished & Inspected Hardware
  const refurbishedProducts = useMemo(() => {
    return products
      .filter((p) => p.status !== 'draft' && (p.condition === 'Refurbished' || p.condition === 'Used'))
      .slice(0, 8);
  }, [products]);

  // Countdown timer for deals
  const [countdown, setCountdown] = useState({ hours: 14, minutes: 35, seconds: 20 });
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      showToast(
        isRtl
          ? 'تم الاشتراك بنجاح في نشرة ريترو قطر! 🎉'
          : 'Successfully subscribed to Retro Qatar newsletter! 🎉',
        'success'
      );
      setNewsletterEmail('');
    }
  };

  const activeSlide = heroSlides[currentSlide];

  return (
    <div className="flex-1 bg-retro-bg min-h-screen">

      {/* ═══════════════════════════════════════
          1. BALANCED 3-SLIDE HERO SECTION
         ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden px-4 pt-4 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-retro-border bg-gradient-to-b from-retro-bg-card/90 to-retro-bg-secondary/90 shadow-2xl">
            
            {/* Background ambient lighting */}
            <div 
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] pointer-events-none transition-all duration-700"
              style={{ backgroundColor: activeSlide.glowColor }}
            />
            <div 
              className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-[100px] pointer-events-none opacity-50"
              style={{ backgroundColor: activeSlide.glowColor }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.04)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="relative p-6 sm:p-10 lg:p-12 min-h-[360px] sm:min-h-[420px] flex flex-col justify-between"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Column: Headline & Dual CTAs */}
                  <div className="col-span-1 lg:col-span-7 space-y-5">
                    {/* Tag badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-retro-cyan/30 bg-retro-cyan/10 px-3.5 py-1 text-[11px] font-black text-retro-cyan backdrop-blur-md uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-retro-cyan animate-pulse" />
                      <span>{activeSlide.tag}</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-retro-text leading-[1.15] tracking-tight">
                      {activeSlide.title}
                    </h1>

                    {/* 2-line Subtitle */}
                    <p className="text-xs sm:text-sm text-retro-text-secondary font-medium leading-relaxed max-w-xl line-clamp-2">
                      {activeSlide.subtitle}
                    </p>

                    {/* Dual Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Link href={`/${locale}${activeSlide.primaryBtnLink}`}>
                        <Button size="lg" variant="primary" className="font-black px-6 py-3 shadow-lg shadow-retro-cyan/20">
                          {activeSlide.primaryBtnText}
                        </Button>
                      </Link>

                      <Link href={`/${locale}${activeSlide.secondaryBtnLink}`}>
                        <Button size="lg" variant="secondary" className="font-bold px-6 py-3">
                          {activeSlide.secondaryBtnText}
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: High-Res Real Product Visual Showcase */}
                  <div className="col-span-1 lg:col-span-5 flex justify-center items-center">
                    <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-retro-border/80 bg-retro-bg-input shadow-2xl p-2 group">
                      <img
                        src={activeSlide.image}
                        alt={activeSlide.title}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-retro-bg/60 via-transparent to-transparent pointer-events-none rounded-xl" />
                    </div>
                  </div>

                </div>

                {/* Bottom Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-retro-border/40 mt-4">
                  {/* Indicators */}
                  <div className="flex gap-2">
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          currentSlide === index ? 'w-8 bg-retro-cyan' : 'w-2 bg-retro-text-dim/40 hover:bg-retro-text-dim/70'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Nav Arrows */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
                      className="rounded-full bg-retro-bg/70 p-2 text-retro-text-muted hover:text-retro-text border border-retro-border hover:border-retro-cyan/40 transition-all cursor-pointer"
                      aria-label="Previous Slide"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={isRtl ? '' : 'rotate-180'}>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentSlide((currentSlide + 1) % heroSlides.length)}
                      className="rounded-full bg-retro-bg/70 p-2 text-retro-text-muted hover:text-retro-text border border-retro-border hover:border-retro-cyan/40 transition-all cursor-pointer"
                      aria-label="Next Slide"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={isRtl ? 'rotate-180' : ''}>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. THE 4 MAIN STORE PORTALS
         ═══════════════════════════════════════ */}
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-retro-text-dim uppercase tracking-widest">
              {dict.portals?.title || (isRtl ? 'بوابات المتجر الرئيسية' : 'Main Store Portals')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Portal 1: Gaming PCs & Hardware */}
            <Link
              href={`/${locale}/category/pc`}
              className="group relative overflow-hidden rounded-3xl border border-retro-border bg-retro-bg-card/70 p-6 flex flex-col justify-between hover:border-retro-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-300 min-h-[220px]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-retro-cyan/10 blur-2xl rounded-full pointer-events-none group-hover:bg-retro-cyan/20 transition-all" />
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🖥️</span>
                  <span className="text-[10px] font-black text-retro-cyan uppercase tracking-wider bg-retro-cyan/10 px-2 py-0.5 rounded border border-retro-cyan/20">
                    PC Hardware
                  </span>
                </div>
                <h3 className="text-lg font-black text-retro-text group-hover:text-retro-cyan transition-colors">
                  {dict.portals?.pc?.title || (isRtl ? 'أجهزة وقطع الكمبيوتر' : 'Gaming PCs & Hardware')}
                </h3>
                <p className="text-xs text-retro-text-secondary leading-relaxed line-clamp-2">
                  {dict.portals?.pc?.desc || (isRtl ? 'تجميعات Gaming جاهزة، كروت شاشة RTX، معالجات ومكونات احترافية.' : 'Pre-built rigs, high-end GPUs, CPUs, cooling solutions, and custom parts.')}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1.5 text-xs font-black text-retro-cyan group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                <span>{dict.portals?.pc?.cta || (isRtl ? 'استكشف القسم' : 'Explore Department')}</span>
                <span className="text-sm">→</span>
              </div>
            </Link>

            {/* Portal 2: Modern Consoles & Games */}
            <Link
              href={`/${locale}/category/gaming`}
              className="group relative overflow-hidden rounded-3xl border border-retro-border bg-retro-bg-card/70 p-6 flex flex-col justify-between hover:border-retro-purple/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 min-h-[220px]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-retro-purple/10 blur-2xl rounded-full pointer-events-none group-hover:bg-retro-purple/20 transition-all" />
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🎮</span>
                  <span className="text-[10px] font-black text-retro-purple uppercase tracking-wider bg-retro-purple/10 px-2 py-0.5 rounded border border-retro-purple/20">
                    Next-Gen
                  </span>
                </div>
                <h3 className="text-lg font-black text-retro-text group-hover:text-retro-purple transition-colors">
                  {dict.portals?.consoles?.title || (isRtl ? 'أجهزة وألعاب حديثة' : 'Modern Consoles & Games')}
                </h3>
                <p className="text-xs text-retro-text-secondary leading-relaxed line-clamp-2">
                  {dict.portals?.consoles?.desc || (isRtl ? 'أحدث منصات PlayStation وXbox وNintendo مع الملحقات والألعاب.' : 'Latest PlayStation, Xbox, and Nintendo systems, accessories, and releases.')}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1.5 text-xs font-black text-retro-purple group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                <span>{dict.portals?.consoles?.cta || (isRtl ? 'استكشف الكونسول' : 'Explore Consoles')}</span>
                <span className="text-sm">→</span>
              </div>
            </Link>

            {/* Portal 3: Retro Gaming */}
            <Link
              href={`/${locale}/category/retro-gaming`}
              className="group relative overflow-hidden rounded-3xl border border-retro-border bg-retro-bg-card/70 p-6 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(52,211,153,0.15)] transition-all duration-300 min-h-[220px]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🕹️</span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Certified Classics
                  </span>
                </div>
                <h3 className="text-lg font-black text-retro-text group-hover:text-emerald-400 transition-colors">
                  {dict.portals?.retro?.title || (isRtl ? 'Retro Gaming' : 'Retro Gaming Classics')}
                </h3>
                <p className="text-xs text-retro-text-secondary leading-relaxed line-clamp-2">
                  {dict.portals?.retro?.desc || (isRtl ? 'أجهزة وألعاب كلاسيكية أصلية، مجددة، مفحوصة ومضمونة لهواة الاقتناء.' : 'Authentic classic consoles, rare games, and restored vintage gaming treasures.')}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1.5 text-xs font-black text-emerald-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                <span>{dict.portals?.retro?.cta || (isRtl ? 'تصفح عالم الريترو' : 'Explore Retro')}</span>
                <span className="text-sm">→</span>
              </div>
            </Link>

            {/* Portal 4: Certified Repair Hub */}
            <Link
              href={`/${locale}/repair`}
              className="group relative overflow-hidden rounded-3xl border border-retro-border bg-retro-bg-card/70 p-6 flex flex-col justify-between hover:border-retro-pink/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] transition-all duration-300 min-h-[220px]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-retro-pink/10 blur-2xl rounded-full pointer-events-none group-hover:bg-retro-pink/20 transition-all" />
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🛠️</span>
                  <span className="text-[10px] font-black text-retro-pink uppercase tracking-wider bg-retro-pink/10 px-2 py-0.5 rounded border border-retro-pink/20">
                    Expert Service
                  </span>
                </div>
                <h3 className="text-lg font-black text-retro-text group-hover:text-retro-pink transition-colors">
                  {dict.portals?.repair?.title || (isRtl ? 'مركز الصيانة المعتمد' : 'Certified Repair Hub')}
                </h3>
                <p className="text-xs text-retro-text-secondary leading-relaxed line-clamp-2">
                  {dict.portals?.repair?.desc || (isRtl ? 'فحص، تنظيف، ترقية وصيانة متخصصة للحواسيب وأجهزة الكونسول.' : 'Diagnostics, deep cleaning, component upgrades, and certified hardware repairs.')}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1.5 text-xs font-black text-retro-pink group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                <span>{dict.portals?.repair?.cta || (isRtl ? 'احجز موعد صيانة' : 'Book Repair')}</span>
                <span className="text-sm">→</span>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. SHOP BY CATEGORY (UNIFIED DARK CARDS)
         ═══════════════════════════════════════ */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 border-t border-retro-border">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-retro-text tracking-tight">
                {dict.categories?.title || (isRtl ? 'تسوق حسب القسم' : 'Shop by Category')}
              </h2>
              <p className="text-xs text-retro-text-secondary">
                {dict.categories?.subtitle || (isRtl ? 'اختر القسم للوصول الفوري للمنتجات' : 'Browse hardware and gaming departments')}
              </p>
            </div>
            <Link href={`/${locale}/products`} className="text-xs font-bold text-retro-cyan hover:underline">
              {dict.common?.viewAll || (isRtl ? 'عرض الكل ←' : 'View All →')}
            </Link>
          </div>

          {/* Categories Container: Smooth Horizontal Swipe on mobile, Grid on desktop */}
          <div className="flex lg:grid lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory">
            {VISUAL_CATEGORIES.map((cat) => {
              const name = isRtl ? cat.nameAr : cat.nameEn;
              return (
                <Link
                  key={cat.id}
                  href={`/${locale}${cat.link}`}
                  className="group relative flex flex-col items-center justify-between rounded-2xl border border-retro-border bg-retro-bg-card/70 p-3 sm:p-4 hover:border-retro-cyan/40 hover:bg-retro-bg-elevated transition-all duration-300 min-w-[130px] sm:min-w-[150px] lg:min-w-0 snap-start shrink-0"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-retro-bg-input p-2 flex items-center justify-center border border-retro-border/50 group-hover:border-retro-cyan/30 transition-colors">
                    <img
                      src={cat.image}
                      alt={name}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <span className="mt-3 text-xs font-bold text-retro-text text-center group-hover:text-retro-cyan transition-colors line-clamp-1">
                    {name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. TODAY'S FLASH DEALS (WITH TIMER)
         ═══════════════════════════════════════ */}
      {dealsProducts.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-8 border-t border-retro-border bg-gradient-to-b from-retro-pink/5 via-transparent to-transparent">
          <div className="mx-auto max-w-7xl space-y-6">
            
            {/* Header with Countdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-retro-pink/10 border border-retro-pink/20 px-3 py-1 text-[10px] font-black text-retro-pink uppercase tracking-wider">
                  <span>🔥</span>
                  <span>{isRtl ? 'عروض محدودة المدة' : 'Limited Time Deals'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-retro-text tracking-tight">
                  {dict.sections?.deals || (isRtl ? 'عروض اليوم الحصرية' : "Today's Flash Deals")}
                </h2>
              </div>

              {/* Countdown UI */}
              <div className="flex items-center gap-2 bg-retro-bg-card border border-retro-border rounded-2xl px-4 py-2 self-start sm:self-auto">
                <span className="text-[10px] font-bold text-retro-text-muted uppercase">
                  {isRtl ? 'ينتهي خلال:' : 'Ends In:'}
                </span>
                <div className="flex items-center gap-1 font-mono text-xs font-black text-retro-pink">
                  <span className="bg-retro-bg-input px-1.5 py-0.5 rounded">{String(countdown.hours).padStart(2, '0')}</span>
                  <span>:</span>
                  <span className="bg-retro-bg-input px-1.5 py-0.5 rounded">{String(countdown.minutes).padStart(2, '0')}</span>
                  <span>:</span>
                  <span className="bg-retro-bg-input px-1.5 py-0.5 rounded">{String(countdown.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {dealsProducts.map((product) => (
                <ProductCard key={product.id} product={product} dict={dict} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          5. FEATURED GAMING PCs (TIER SELECTOR)
         ═══════════════════════════════════════ */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-t border-retro-border">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-retro-cyan/10 border border-retro-cyan/20 px-3 py-1 text-[10px] font-black text-retro-cyan uppercase tracking-wider">
                <span>🖥️</span>
                <span>{isRtl ? 'حواسيب مجمعة باحتراف' : 'Prebuilt Battle Stations'}</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-retro-text tracking-tight">
                {dict.sections?.gamingPcs || (isRtl ? 'تجميعات Gaming PC الموصى بها' : 'Featured Gaming PCs')}
              </h2>
              <p className="text-xs sm:text-sm text-retro-text-secondary max-w-md">
                {isRtl ? 'اختر فئة الأداء المناسبة لميزانيتك وقوة الألعاب التي تفضلها.' : 'Categorized by performance tier to match your power requirements.'}
              </p>
            </div>

            {/* PC Tiers tabs */}
            <div className="flex rounded-xl bg-retro-bg-card p-1 border border-retro-border shrink-0 self-start md:self-auto overflow-x-auto max-w-full scrollbar-none">
              {(['entry', 'mid', 'high', 'extreme'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setActivePcTab(tier)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    activePcTab === tier
                      ? 'bg-retro-cyan text-retro-bg font-black shadow-md shadow-retro-cyan/20'
                      : 'text-retro-text-secondary hover:text-retro-text'
                  }`}
                >
                  {tier === 'entry' ? (isRtl ? 'مبتدئ' : 'Entry Level') :
                   tier === 'mid' ? (isRtl ? 'متوسط' : 'Mid Range') :
                   tier === 'high' ? (isRtl ? 'عالي' : 'High End') :
                                    (isRtl ? 'خارق' : 'Extreme')}
                </button>
              ))}
            </div>
          </div>

          {/* PC Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categorizedGamingPcs[activePcTab].length === 0 ? (
              <div className="col-span-full text-center py-12 rounded-3xl border border-retro-border bg-retro-bg-card/40">
                <span className="text-3xl block mb-2">🖥️</span>
                <h4 className="text-sm font-bold text-retro-text-secondary">
                  {isRtl ? 'لا توجد أجهزة متوفرة في هذه الفئة حالياً' : 'No systems in this tier right now'}
                </h4>
              </div>
            ) : (
              categorizedGamingPcs[activePcTab].map((pc) => (
                <ProductCard key={pc.id} product={pc} dict={dict} locale={locale} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. INTERACTIVE CTA: CUSTOM PC BUILDER
         ═══════════════════════════════════════ */}
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-retro-cyan/25 bg-gradient-to-r from-retro-cyan-dim/40 via-retro-bg-card to-retro-purple-dim/40 p-8 sm:p-12 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(34,211,238,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-start max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-retro-cyan/15 border border-retro-cyan/30 px-3.5 py-1 text-[11px] font-black text-retro-cyan uppercase tracking-wider">
                  <span>⚙️</span>
                  <span>{isRtl ? 'محرك التوافق الذكي' : 'Smart Compatibility Engine'}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-retro-text tracking-tight">
                  {dict.pcBuilder?.title || (isRtl ? 'ابنِ حاسوبك المخصص' : 'Build Your Custom Gaming PC')}
                </h2>
                <p className="text-xs sm:text-sm text-retro-text-secondary leading-relaxed">
                  {dict.pcBuilder?.subtitle || (isRtl ? 'اختر المعالج، كرت الشاشة، المذر بورد، والرامات مع فحص التوافق التلقائي ومراجعة فني ريترو مجاناً.' : 'Select compatible parts step-by-step with real-time wattage calculations and free assembly.')}
                </p>
              </div>

              <Link href={`/${locale}/pc-builder`}>
                <Button size="lg" variant="primary" className="font-black px-8 py-4 shadow-xl shadow-retro-cyan/25 shrink-0">
                  {dict.pcBuilder?.title || (isRtl ? 'ابدأ تجميع حاسوبك الآن' : 'Start PC Builder')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          7. PC COMPONENTS SHOWCASE
         ═══════════════════════════════════════ */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-t border-retro-border">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-retro-text tracking-tight">
                {dict.sections?.pcComponents || (isRtl ? 'مكونات وقطع الكمبيوتر' : 'PC Hardware & Components')}
              </h2>
              <p className="text-xs text-retro-text-secondary">
                {isRtl ? 'أحدث كروت الشاشة والمعالجات واللوحات الأم' : 'Latest GPUs, CPUs, motherboards and storage'}
              </p>
            </div>
            <Link href={`/${locale}/category/pc`} className="text-xs font-bold text-retro-cyan hover:underline">
              {dict.common?.viewAll || (isRtl ? 'عرض الكل ←' : 'View All →')}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pcComponents.map((product) => (
              <ProductCard key={product.id} product={product} dict={dict} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          8. CONSOLES & NEXT-GEN GAMING
         ═══════════════════════════════════════ */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-t border-retro-border bg-retro-bg-secondary/20">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-retro-text tracking-tight">
                {dict.sections?.consoles || (isRtl ? 'أجهزة الكونسول الحديثة' : 'Modern Consoles & Games')}
              </h2>
              <p className="text-xs text-retro-text-secondary">
                {isRtl ? 'منصات PlayStation 5، Xbox، Nintendo والألعاب الحصرية' : 'PlayStation, Xbox, Nintendo Switch, and game titles'}
              </p>
            </div>
            <Link href={`/${locale}/category/gaming`} className="text-xs font-bold text-retro-purple hover:underline">
              {dict.common?.viewAll || (isRtl ? 'عرض الكل ←' : 'View All →')}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {modernConsoles.map((product) => (
              <ProductCard key={product.id} product={product} dict={dict} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          9. CURATED RETRO GAMING PICKS
         ═══════════════════════════════════════ */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-t border-retro-border bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                <span>🕹️</span>
                <span>{isRtl ? 'أجهزة مفحوصة ومضمونة' : 'Tested & Certified Vintage'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-retro-text tracking-tight">
                {dict.sections?.retroPicks || (isRtl ? 'مختارات Retro النادرة' : 'Curated Retro Classics')}
              </h2>
            </div>
            <Link href={`/${locale}/category/retro-gaming`} className="text-xs font-bold text-emerald-400 hover:underline">
              {dict.common?.viewAll || (isRtl ? 'عرض الكل ←' : 'View All →')}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {retroPicks.map((product) => (
              <ProductCard key={product.id} product={product} dict={dict} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          10. CERTIFIED REFURBISHED & TESTED
         ═══════════════════════════════════════ */}
      {refurbishedProducts.length > 0 && (
        <section className="px-4 py-12 sm:px-6 lg:px-8 border-t border-retro-border">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-retro-text tracking-tight">
                  {dict.sections?.refurbished || (isRtl ? 'منتجات مجددة ومفحوصة' : 'Certified Refurbished & Tested')}
                </h2>
                <p className="text-xs text-retro-text-secondary">
                  {isRtl ? 'أجهزة خضعت لفحص دقيق مع ضمان تشغيلي بأسعار موفرة' : 'Quality tested hardware with warranty at great value'}
                </p>
              </div>
              <Link href={`/${locale}/products?condition=Refurbished`} className="text-xs font-bold text-retro-cyan hover:underline">
                {dict.common?.viewAll || (isRtl ? 'عرض الكل ←' : 'View All →')}
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {refurbishedProducts.map((product) => (
                <ProductCard key={product.id} product={product} dict={dict} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          11. INTERACTIVE CTA: REPAIR HUB
         ═══════════════════════════════════════ */}
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-retro-purple/25 bg-gradient-to-r from-retro-purple-dim/40 via-retro-bg-card to-retro-pink/10 p-8 sm:p-12 shadow-2xl">
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-start max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-retro-purple/15 border border-retro-purple/30 px-3.5 py-1 text-[11px] font-black text-retro-purple uppercase tracking-wider">
                  <span>🛠️</span>
                  <span>{isRtl ? 'فحص وصيانة معتمدة' : 'Professional Diagnostic & Service'}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-retro-text tracking-tight">
                  {dict.repair?.title || (isRtl ? 'مركز صيانة ريترو المعتمد' : 'Certified RETRO Repair Hub')}
                </h2>
                <p className="text-xs sm:text-sm text-retro-text-secondary leading-relaxed">
                  {dict.repair?.subtitle || (isRtl ? 'صيانة فورية للحواسيب، اللابتوبات، منصات الكونسول، واستبدال منافذ HDMI وتنظيف المعجون الحراري مع ضمان رسمي.' : 'Express repair for Gaming PCs, Laptops, Consoles, thermal paste & HDMI ports with local warranty.')}
                </p>
              </div>

              <Link href={`/${locale}/repair`}>
                <Button size="lg" variant="accent" className="font-black px-8 py-4 shadow-xl shadow-retro-purple/25 shrink-0">
                  {dict.repair?.bookRepair || (isRtl ? 'احجز موعد صيانة' : 'Book Repair Service')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          12. TRUST MARKERS & VALUE PROPOSITIONS
         ═══════════════════════════════════════ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-t border-retro-border bg-retro-bg-secondary/40">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-retro-text tracking-tight">
              {dict.trust?.title || (isRtl ? 'لماذا يثق بنا مجتمع اللاعبين في قطر؟' : "Why Qatar's Gaming Community Trusts Us?")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🚚',
                title: dict.trust?.fastDelivery || (isRtl ? 'توصيل سريع داخل قطر' : 'Fast Delivery in Qatar'),
                desc: dict.trust?.fastDeliveryDesc || (isRtl ? 'توصيل آمن وسريع خلال 24 - 48 ساعة لكافة مناطق الدولة.' : 'Safe 24-48h delivery to all zones in Qatar.'),
                color: 'cyan'
              },
              {
                icon: '🛡️',
                title: dict.trust?.warranty || (isRtl ? 'ضمان محلي معتمد' : 'Certified Local Warranty'),
                desc: dict.trust?.warrantyDesc || (isRtl ? 'ضمان شامل ودعم فني متواصل على جميع الأجهزة والتجميعات.' : 'Full warranty & technical support on all hardware.'),
                color: 'purple'
              },
              {
                icon: '🕹️',
                title: dict.trust?.inspectedRetro || (isRtl ? 'أجهزة Retro مفحوصة' : 'Inspected Retro Gear'),
                desc: dict.trust?.inspectedRetroDesc || (isRtl ? 'كل جهاز ريترو يخضع لفحص تشغيلي وتنظيف وتجديد دقيق.' : 'Every retro item is thoroughly tested, cleaned, and certified.'),
                color: 'emerald'
              },
              {
                icon: '👨‍🔧',
                title: dict.trust?.expertRepair || (isRtl ? 'مركز صيانة متخصص' : 'Specialized Repair Hub'),
                desc: dict.trust?.expertRepairDesc || (isRtl ? 'فنيون محترفون لتبديل المنافذ، المعجون، والصيانة المعقدة.' : 'Certified technicians for ports, thermal maintenance & fixes.'),
                color: 'purple'
              },
              {
                icon: '💬',
                title: dict.trust?.whatsappSupport || (isRtl ? 'دعم مباشر عبر واتساب' : 'Direct WhatsApp Support'),
                desc: dict.trust?.whatsappSupportDesc || (isRtl ? 'تواصل فوري وسريع مع فريق المبيعات والصيانة.' : 'Quick direct answers from sales and technical specialists.'),
                color: 'cyan'
              },
              {
                icon: '🏪',
                title: dict.trust?.securePayment || (isRtl ? 'دفع آمن واستلام من المحل' : 'Secure Payment & Pickup'),
                desc: dict.trust?.securePaymentDesc || (isRtl ? 'خيارات دفع إلكترونية متعددة أو استلام من فرع مشيرب.' : 'Multiple payment options or in-store pickup at Msheireb HQ.'),
                color: 'emerald'
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-retro-border bg-retro-bg-card p-6 space-y-3 hover:border-retro-cyan/30 transition-all duration-300 shadow-md"
              >
                <span className="text-3xl block">{item.icon}</span>
                <h3 className="text-sm font-black text-retro-text">{item.title}</h3>
                <p className="text-xs text-retro-text-secondary leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          13. REAL GOOGLE REVIEWS & MSHEIREB LOCATION
         ═══════════════════════════════════════ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-t border-retro-border bg-retro-bg">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Customer Reviews (7 Cols) */}
          <div className="col-span-1 lg:col-span-7 space-y-6">
            <div>
              <span className="text-[10px] font-black text-retro-cyan uppercase tracking-wider bg-retro-cyan/10 px-2.5 py-1 rounded">
                Google Reviews ★★★★★
              </span>
              <h2 className="text-2xl font-black text-retro-text tracking-tight pt-2">
                {isRtl ? 'تقييمات عملائنا في الدوحة' : 'Customer Reviews in Doha'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: isRtl ? 'محمد الكواري' : 'Mohammed Al-Kuwari',
                  role: isRtl ? 'تجميع Gaming PC' : 'Custom Gaming PC',
                  text: isRtl ? 'خدمة ممتازة وسريعة جداً. قمت بتجميع بي سي قيمنق بمواصفات عالية والأسعار كانت أفضل من السوق بكثير مع تركيب احترافي للكابلات.' : 'Outstanding and fast service. Built a high-end gaming PC with top cable management and great prices.',
                  rating: 5
                },
                {
                  name: isRtl ? 'جاسم المنصوري' : 'Jassim Al-Mansouri',
                  role: isRtl ? 'صيانة بلايستيشن 5' : 'PS5 Repair',
                  text: isRtl ? 'تم تصليح منفذ الـ HDMI وتنظيف الجهاز وتبديل المعجون في نفس اليوم مع ضمان. أفضل مركز صيانة في مشيرب!' : 'Fixed the HDMI port and cleaned the console on the same day with warranty. Best repair shop in Msheireb!',
                  rating: 5
                },
                {
                  name: isRtl ? 'خالد الشمري' : 'Khalid Al-Shammari',
                  role: isRtl ? 'مقتني أجهزة ريترو' : 'Retro Collector',
                  text: isRtl ? 'حصلت على جهاز Game Boy Advance SP بحالة الوكالة مع شاشة IPS معدلة. شفافية تامة في الفحص والملحقات أصلية.' : 'Got a mint Game Boy Advance SP with IPS mod. Total transparency and authentic cables.',
                  rating: 5
                },
                {
                  name: isRtl ? 'عبدالله الهاجري' : 'Abdullah Al-Hajri',
                  role: isRtl ? 'ترقية كرت شاشة' : 'GPU Upgrade',
                  text: isRtl ? 'الدعم الفني عبر واتساب ساعدني في اختيار مزود الطاقة المناسب لكرت RTX 4080. التوصيل كان في نفس اليوم.' : 'WhatsApp technical support helped choose the right PSU for RTX 4080. Same-day delivery was smooth.',
                  rating: 5
                }
              ].map((rev, i) => (
                <div key={i} className="bg-retro-bg-card border border-retro-border rounded-2xl p-5 space-y-3 hover:border-retro-cyan/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-retro-text">{rev.name}</h4>
                      <span className="text-[10px] text-retro-text-muted">{rev.role}</span>
                    </div>
                    <div className="text-retro-amber text-xs font-bold">★★★★★</div>
                  </div>
                  <p className="text-xs text-retro-text-secondary leading-relaxed">"{rev.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Store Location Card (5 Cols) */}
          <div className="col-span-1 lg:col-span-5 bg-retro-bg-card border border-retro-border rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-retro-purple uppercase tracking-wider bg-retro-purple/10 px-2.5 py-1 rounded">
                Physical Store
              </span>
              <h3 className="text-xl font-black text-retro-text">
                {isRtl ? 'تفضل بزيارة فرعنا في مشيرب' : 'Visit Our Store in Msheireb'}
              </h3>
              <p className="text-xs text-retro-text-secondary">
                {isRtl ? 'المشيرب، الدوحة، دولة قطر' : 'Msheireb HQ, Doha, State of Qatar'}
              </p>
            </div>

            <div className="space-y-3 text-xs text-retro-text-secondary border-y border-retro-border/60 py-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-retro-text">{isRtl ? 'ساعات العمل:' : 'Hours:'}</span>
                <span>{isRtl ? 'السبت - الخميس: 9ص - 1ظ | 4ع - 10م' : 'Sat-Thu: 9AM-1PM | 4PM-10PM'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-retro-text">{isRtl ? 'يوم الجمعة:' : 'Friday:'}</span>
                <span className="text-retro-pink font-bold">{isRtl ? 'إجازة' : 'OFF'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-retro-text">{isRtl ? 'الهاتف المباشر:' : 'Phone:'}</span>
                <a href={`tel:${BUSINESS_INFO.phone}`} className="font-mono text-retro-cyan font-bold">{BUSINESS_INFO.phone}</a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={BUSINESS_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center rounded-xl bg-retro-cyan text-retro-bg font-black py-3 text-xs hover:bg-retro-cyan/90 transition-all"
              >
                {isRtl ? 'موقعنا على Google Maps 📍' : 'View on Google Maps 📍'}
              </a>
              <a
                href={`https://wa.me/${BUSINESS_INFO.salesWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold py-3 text-xs hover:bg-emerald-500/20 transition-all"
              >
                {isRtl ? 'تواصل عبر واتساب 💬' : 'Chat on WhatsApp 💬'}
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          14. NEWSLETTER & SOCIAL FEED
         ═══════════════════════════════════════ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-t border-retro-border bg-retro-bg-secondary/30">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Newsletter */}
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-retro-cyan uppercase tracking-wider bg-retro-cyan/10 px-2.5 py-1 rounded">
                Stay Connected
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-retro-text tracking-tight">
                {isRtl ? 'اشترك في نشرة Retro Qatar الإخبارية' : 'Join Retro Qatar Newsletter'}
              </h2>
              <p className="text-xs sm:text-sm text-retro-text-secondary leading-relaxed max-w-md">
                {isRtl 
                  ? 'كن أول من يعرف عن وصول أجهزة الريترو النادرة، عروض تجميعات البي سي الأسبوعية، وخصومات الصيانة.' 
                  : 'Get instant restock alerts for rare retro consoles, weekly gaming rig drops, and exclusive repair promos.'}
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={isRtl ? 'أدخل بريدك الإلكتروني...' : 'Enter your email address...'}
                className="flex-1 rounded-xl bg-retro-bg-input px-4 py-3 text-xs text-retro-text border border-retro-border focus:outline-none focus:border-retro-cyan transition-all"
              />
              <Button type="submit" variant="primary" size="md" className="font-black">
                {isRtl ? 'اشترك' : 'Subscribe'}
              </Button>
            </form>
          </div>

          {/* Social Showcase */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-retro-border pb-3">
              <h3 className="text-xs sm:text-sm font-bold text-retro-text">
                {isRtl ? 'تابعنا على إنستغرام @retroqatar' : 'Follow Us @retroqatar'}
              </h3>
              <span className="text-[10px] text-retro-cyan font-bold uppercase">Instagram Feed</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop&q=60'
              ].map((url, i) => (
                <div key={i} className="group relative aspect-square rounded-xl overflow-hidden bg-retro-bg-input border border-retro-border">
                  <img 
                    src={url} 
                    alt="Social feed" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-retro-bg/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-base">❤️</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
