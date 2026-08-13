// RETRO Qatar — Homepage Content (Client Component)
// Renders the full structured technology retail storefront landing page

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { PriceTag } from '@/components/ui/PriceTag';
import { Badge, StockBadge, ConditionBadge } from '@/components/ui/Badge';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useUIStore } from '@/stores/useUIStore';
import { useOffersStore } from '@/stores/useOffersStore';
import type { Product } from '@/types';
import type { Dictionary, Locale } from '@/i18n/dictionaries';
import { 
  ControllerIcon, 
  CartIcon, 
  HeartIcon, 
  SparklesIcon, 
  CheckIcon, 
  CloseIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  FlameIcon,
  TagIcon
} from '@/components/Icons';

interface HomepageContentProps {
  products: Product[];
  dict: Dictionary;
  locale: Locale;
}

// Store974-style horizontal PC Category navigation definitions
const STORE974_CATEGORIES = [
  {
    id: 'pre-builds',
    nameEn: 'Pre Builds',
    nameAr: 'تجميعات جاهزة',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&auto=format&fit=crop&q=80',
    link: '/category/gaming-pcs',
  },
  {
    id: 'gpus',
    nameEn: 'Graphics Cards',
    nameAr: 'كروت الشاشة',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300&auto=format&fit=crop&q=80',
    link: '/products?category=PC Components&sub=GPUs',
  },
  {
    id: 'motherboards',
    nameEn: 'Motherboards',
    nameAr: 'لوحات رئيسية',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop&q=80',
    link: '/products?category=PC Components&sub=Motherboards',
  },
  {
    id: 'processors',
    nameEn: 'Processors',
    nameAr: 'المعالجات',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop&q=80',
    link: '/products?category=PC Components&sub=CPUs',
  },
  {
    id: 'memories',
    nameEn: 'Memories',
    nameAr: 'ذاكرة عشوائية (RAM)',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=300&auto=format&fit=crop&q=80',
    link: '/products?category=PC Components&sub=RAM',
  },
  {
    id: 'storages',
    nameEn: 'Storages',
    nameAr: 'وحدات تخزين SSD',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80',
    link: '/products?category=PC Components&sub=SSD',
  },
  {
    id: 'monitors',
    nameEn: 'Monitors',
    nameAr: 'الشاشات',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80',
    link: '/category/monitors',
  },
  {
    id: 'accessories',
    nameEn: 'Accessories',
    nameAr: 'ملحقات قيمنق',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&auto=format&fit=crop&q=80',
    link: '/accessories',
  },
] as const;

interface WeeklyOffersSectionProps {
  products: Product[];
  locale: Locale;
  dict: Dictionary;
}

function WeeklyOffersSection({ products, locale, dict }: WeeklyOffersSectionProps) {
  const isRtl = locale === 'ar';
  const { weeklyOffersActive, weeklyOfferProductId, weeklyOfferPromoPrice, weeklyOfferEndDate } = useOffersStore();

  const featuredProduct = products.find(p => p.id === weeklyOfferProductId);
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!weeklyOffersActive || !weeklyOfferEndDate) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(weeklyOfferEndDate) - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [weeklyOffersActive, weeklyOfferEndDate]);

  if (!weeklyOffersActive || !featuredProduct) return null;

  const originalPrice = featuredProduct.sellingPrice;
  const saveAmount = originalPrice - weeklyOfferPromoPrice;
  const productName = isRtl ? featuredProduct.nameAr : featuredProduct.nameEn;
  const description = isRtl ? featuredProduct.descriptionAr : featuredProduct.descriptionEn;

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 border-t border-retro-border bg-gradient-to-b from-retro-purple-dim/10 to-transparent">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-retro-purple/10 border border-retro-purple/20 px-3 py-1 text-[10px] font-bold text-retro-purple uppercase tracking-wider">
              {isRtl ? 'عروض حصرية' : 'Exclusive Promotions'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-retro-text tracking-tight">
              {isRtl ? 'عروض الأسبوع' : 'Weekly Offers'}
            </h2>
          </div>
        </div>

        {/* Dynamic Card Container */}
        <div className="relative overflow-hidden rounded-3xl border border-retro-border bg-retro-bg-card/45 p-6 sm:p-10 hover:border-retro-cyan/35 transition-all duration-300">
          {/* Decorative background grid and glow */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(34,211,238,0.04)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-retro-cyan/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-retro-purple/5 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Product Info */}
            <div className="col-span-1 lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-retro-cyan/10 border border-retro-cyan/35 text-retro-cyan text-[9px] font-black uppercase px-2 py-0.5 rounded">
                  {isRtl ? 'تخفيض كبير' : 'BIG SAVINGS'}
                </span>
                {saveAmount > 0 && (
                  <span className="bg-retro-pink/15 border border-retro-pink/35 text-retro-pink text-[9px] font-black px-2 py-0.5 rounded">
                    {isRtl ? `وفر ${saveAmount} ر.ق` : `SAVE ${saveAmount} QAR`}
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-retro-text leading-tight hover:text-retro-cyan transition-colors">
                {productName}
              </h3>
              <p className="text-xs sm:text-sm text-retro-text-secondary leading-relaxed max-w-2xl">
                {description}
              </p>

              {/* Countdown timer UI */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-retro-text-muted">
                  {isRtl ? 'ينتهي العرض في:' : 'PROMOTION ENDS IN:'}
                </h4>
                <div className="flex items-center gap-3">
                  {[
                    { label: isRtl ? 'يوم' : 'DAYS', value: timeLeft.days },
                    { label: isRtl ? 'ساعة' : 'HOURS', value: timeLeft.hours },
                    { label: isRtl ? 'دقيقة' : 'MINS', value: timeLeft.minutes },
                    { label: isRtl ? 'ثانية' : 'SECS', value: timeLeft.seconds },
                  ].map((unit, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-retro-bg border border-retro-border text-lg sm:text-2xl font-black text-retro-cyan shadow-lg shadow-retro-cyan/5">
                          {String(unit.value).padStart(2, '0')}
                        </div>
                        <span className="text-[9px] font-extrabold text-retro-text-muted mt-1.5 uppercase">
                          {unit.label}
                        </span>
                      </div>
                      {index < 3 && (
                        <span className="text-lg sm:text-2xl font-black text-retro-border mx-1.5 sm:mx-2 self-start pt-2">
                          :
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Display Card & Action */}
            <div className="col-span-1 lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl border border-retro-border bg-retro-bg p-6 space-y-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="h-48 w-full rounded-xl overflow-hidden bg-retro-bg-input border border-retro-border p-3 flex items-center justify-center relative">
                  <img
                    src={featuredProduct.imageUrl}
                    alt={productName}
                    className="h-full w-full object-cover rounded-lg group-hover:scale-102 transition-transform duration-500"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-black text-retro-text-dim uppercase tracking-wider block">
                      {featuredProduct.brand}
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xl font-black text-retro-cyan">
                        {weeklyOfferPromoPrice} {dict.common.currency}
                      </span>
                      <span className="text-xs text-retro-text-dim line-through">
                        {originalPrice} {dict.common.currency}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      useCartStore.getState().addItem({
                        ...featuredProduct,
                        sellingPrice: weeklyOfferPromoPrice,
                        salePrice: undefined
                      });
                      const toastMsg = isRtl ? `${productName} تمت إضافته للسلة!` : `${productName} added to cart!`;
                      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: toastMsg, type: 'success' } }));
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-retro-cyan-muted to-retro-cyan hover:shadow-lg hover:shadow-retro-cyan/15 text-retro-bg px-5 py-3 text-xs font-black transition-all cursor-pointer hover:-translate-y-0.5"
                  >
                    <CartIcon size={14} />
                    <span>{dict.product.addToCart}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomepageContent({ products, dict, locale }: HomepageContentProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isRtl = locale === 'ar';

  // Zustand State hooks
  const addToCartStore = useCartStore((s) => s.addItem);
  const wishlist = useWishlistStore((s) => s.items);
  const toggleWishlistStore = useWishlistStore((s) => s.toggle);
  const { showToast, activeDepartment, setActiveDepartment } = useUIStore();

  // Load custom banners dynamically from offers store
  const slides = useOffersStore((s) => s.slides);

  // Active PC Tier Tab State
  const [activePcTab, setActivePcTab] = useState<'entry' | 'mid' | 'high' | 'extreme'>('mid');

  // Newsletter Email Input State
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Reset logo to General Department on homepage mount (hiding RETRO PC on load)
  useEffect(() => {
    setActiveDepartment('general');
  }, [setActiveDepartment]);

  // Auto-rotate hero slides
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide] || null;

  // Helper Translation Method
  const t = (key: string) => {
    if (key === 'currency') return isRtl ? 'ر.ق' : 'QAR';
    if (key === 'addToCartBtn') return dict.product?.addToCart || (isRtl ? 'أضف إلى السلة' : 'Add to Cart');
    return key;
  };

  // 1. Featured Gaming PCs filtering
  const gamingPcs = useMemo(() => {
    return products.filter(p => {
      if (p.status === 'draft') return false;
      return p.category === 'Gaming PCs' || p.id.startsWith('p-pc-') || p.nameEn.toLowerCase().includes('gaming pc');
    });
  }, [products]);

  const categorizedGamingPcs = useMemo(() => {
    const categoriesList = { entry: [] as Product[], mid: [] as Product[], high: [] as Product[], extreme: [] as Product[] };
    gamingPcs.forEach(p => {
      const price = p.salePrice ?? p.sellingPrice;
      if (price < 4000) {
        categoriesList.entry.push(p);
      } else if (price < 7000) {
        categoriesList.mid.push(p);
      } else if (price < 12000) {
        categoriesList.high.push(p);
      } else {
        categoriesList.extreme.push(p);
      }
    });
    return categoriesList;
  }, [gamingPcs]);

  // 2. PC Components Showcase filtering
  const componentProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status === 'draft') return false;
      return p.category === 'PC Components' || p.category === 'CPUs' || p.category === 'GPUs' || p.id.startsWith('p-comp-');
    }).slice(0, 8);
  }, [products]);

  // 3. Best Deals filtering
  const dealsProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status === 'draft') return false;
      return p.salePrice && p.salePrice < p.sellingPrice;
    }).slice(0, 4);
  }, [products]);

  // 4. Gaming Accessories filtering
  const accessoryProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status === 'draft') return false;
      return p.category === 'Controllers' || p.category === 'Accessories' || p.id.startsWith('p-ctrl-') || p.id.startsWith('p-acc-');
    }).slice(0, 4);
  }, [products]);

  // 5. Monitors filtering
  const monitorProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status === 'draft') return false;
      return p.category === 'Monitors' || p.id.startsWith('p-mon-');
    }).slice(0, 4);
  }, [products]);

  // 6. Retro Gaming filtering
  const retroProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status === 'draft') return false;
      return (p.category === 'Retro Gaming' || p.category === 'Retro Consoles & Games' || p.category === 'Consoles & Accessories' || p.id.startsWith('p-console-') || p.id.startsWith('p-retro-')) && !p.id.startsWith('p-ctrl-');
    }).slice(0, 4);
  }, [products]);

  // Cart & Wishlist Actions
  const handleAddToCart = (product: Product) => {
    addToCartStore(product, 1);
    showToast(
      isRtl
        ? `تمت إضافة ${product.nameAr} إلى السلة!`
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      showToast(
        isRtl
          ? 'تم الاشتراك بنجاح في النشرة البريدية! 🎉'
          : 'Successfully subscribed to newsletter! 🎉',
        'success'
      );
      setNewsletterEmail('');
    }
  };

  // PC Category Click Handler -> Switches logo branding to PC Department
  const handlePCDeptClick = (categoryName: string) => {
    setActiveDepartment('pc');
    showToast(
      isRtl 
        ? `تم التحويل إلى قسم الكمبيوتر: تصفح ${categoryName}` 
        : `Switched to PC Department: Browsing ${categoryName}`,
      'info'
    );
  };

  return (
    <div className="flex-1 bg-retro-bg">

      {/* ═══════════════════════════════════════
          1. HERO SLIDER
         ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-2xl border border-retro-border bg-retro-bg-card shadow-2xl">
            {slide ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: isRtl ? -40 : 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRtl ? 40 : -40 }}
                  transition={{ duration: 0.5 }}
                  className={`relative p-8 sm:p-12 lg:p-16 bg-gradient-to-r ${slide.gradient} flex flex-col justify-between min-h-[300px] sm:min-h-[380px]`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(34,211,238,0.08)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

                  <div className="relative max-w-2xl space-y-5">
                    {/* Tag */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-retro-cyan/30 bg-retro-cyan/10 px-4 py-1.5 text-xs font-bold text-retro-cyan backdrop-blur-md">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="animate-pulse">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                      {isRtl ? slide.tagAr : slide.tagEn}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-retro-text leading-tight tracking-tight">
                      {isRtl ? slide.titleAr : slide.titleEn}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base text-retro-text-secondary font-medium leading-relaxed max-w-lg">
                      {isRtl ? slide.subtitleAr : slide.subtitleEn}
                    </p>

                    {/* CTA */}
                    <div className="pt-2">
                      <Link href={`/${locale}${slide.ctaLink}`} onClick={() => {
                        if (slide.ctaLink.includes('pc-builder') || slide.ctaLink.includes('pc-components') || slide.ctaLink.includes('monitors')) {
                          setActiveDepartment('pc');
                        }
                      }}>
                        <Button size="lg" icon={
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={isRtl ? 'rotate-180' : ''}>
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        } iconPosition="right">
                          {isRtl ? slide.ctaAr : slide.ctaEn}
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Slide Controls */}
                  <div className="relative pt-8 flex items-center justify-between">
                    <div className="flex gap-2">
                      {slides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            currentSlide === index ? 'w-8 bg-retro-cyan' : 'w-2 bg-retro-text-dim/30 hover:bg-retro-text-dim/50'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
                        className="rounded-full bg-retro-bg/60 p-2 text-retro-text-muted hover:text-retro-text border border-retro-border hover:border-retro-border-hover transition-all cursor-pointer"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={isRtl ? '' : 'rotate-180'}>
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
                        className="rounded-full bg-retro-bg/60 p-2 text-retro-text-muted hover:text-retro-text border border-retro-border hover:border-retro-border-hover transition-all cursor-pointer"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={isRtl ? 'rotate-180' : ''}>
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="h-64 flex items-center justify-center text-retro-text-muted">No Offers Active</div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. SHOP BY CATEGORY (STORE974 STYLE)
         ═══════════════════════════════════════ */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-retro-text tracking-tight uppercase flex items-center gap-2">
                <span>🖥️</span>
                <span>{isRtl ? 'قسم أجهزة ومكونات الكمبيوتر' : 'PC DEPARTMENT & COMPONENTS'}</span>
              </h2>
              <p className="text-[11px] text-retro-text-secondary font-medium">
                {isRtl ? 'انقر على الفئات لتفعيل الشعار المخصص وقفل حاسوب القيمنق.' : 'Click categories to unlock specialized RETRO PC branding.'}
              </p>
            </div>

            {/* Department Active Indicator */}
            {activeDepartment === 'pc' && (
              <button 
                onClick={() => {
                  setActiveDepartment('general');
                  showToast(isRtl ? 'تمت العودة للعلامة الرئيسية' : 'Returned to Main Brand', 'info');
                }}
                className="text-[10px] font-black border border-retro-cyan/35 text-retro-cyan bg-retro-cyan/10 rounded-lg px-3 py-1.5 uppercase tracking-wider animate-pulse hover:bg-retro-cyan hover:text-retro-bg transition-colors"
              >
                {isRtl ? 'مسح تصفية الكمبيوتر ✕' : 'Clear PC Mode ✕'}
              </button>
            )}
          </div>

          {/* Horizontal Scrollable Categories Container */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-retro-border-hover/50">
            {STORE974_CATEGORIES.map((cat) => {
              const name = isRtl ? cat.nameAr : cat.nameEn;
              return (
                <Link
                  key={cat.id}
                  href={`/${locale}${cat.link}`}
                  onClick={() => handlePCDeptClick(name)}
                  className="group flex flex-col items-center gap-3 shrink-0 select-none cursor-pointer focus:outline-none"
                >
                  {/* Styled Orange/Yellow Bubble */}
                  <div className="relative h-24 w-32 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-1.5 shadow-lg group-hover:scale-105 group-hover:rotate-1 transition-all duration-300 flex items-center justify-center overflow-hidden border border-amber-300/40">
                    {/* Glowing effect inside bubble */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25)_0%,transparent_70%)]" />
                    
                    {/* Transparent Product Image overlapping/fitting inside */}
                    <img 
                      src={cat.image} 
                      alt={cat.nameEn} 
                      className="h-16 w-auto max-w-[85%] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Text Label Below */}
                  <span className="text-[11px] font-extrabold text-retro-text-secondary group-hover:text-retro-cyan transition-colors text-center max-w-[110px] line-clamp-1">
                    {name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2.5 WEEKLY OFFERS SECTION (CMS DYNAMIC)
         ═══════════════════════════════════════ */}
      <WeeklyOffersSection products={products} locale={locale} dict={dict} />

      {/* ═══════════════════════════════════════
          3. FEATURED GAMING PCs
         ═══════════════════════════════════════ */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-t border-retro-border">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className={`space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="inline-flex items-center gap-2 rounded-full bg-retro-cyan/10 border border-retro-cyan/20 px-3 py-1 text-[10px] font-bold text-retro-cyan uppercase tracking-wider">
                {isRtl ? 'أجهزة ألعاب جاهزة' : 'Prebuilt Battle Stations'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-retro-text tracking-tight">
                {isRtl ? 'حواسيب الألعاب الاحترافية' : 'Featured Gaming PCs'}
              </h2>
              <p className="text-sm text-retro-text-secondary max-w-md">
                {isRtl ? 'حواسيب مجمعة باحترافية لتناسب ميزانيتك وقوة الألعاب التي تفضلها.' : 'Expertly crafted prebuilt systems categorized by tier to match your power requirements.'}
              </p>
            </div>

            {/* PC Tiers tabs */}
            <div className="flex rounded-xl bg-retro-bg-card p-1 border border-retro-border shrink-0 self-start md:self-auto overflow-x-auto max-w-full scrollbar-none">
              {(['entry', 'mid', 'high', 'extreme'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setActivePcTab(tier)}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activePcTab === tier
                      ? 'bg-retro-cyan text-retro-bg font-extrabold shadow-lg shadow-retro-cyan/10'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categorizedGamingPcs[activePcTab].length === 0 ? (
              <div className="col-span-full text-center py-12 rounded-3xl border border-retro-border bg-retro-bg-card/30">
                <span className="text-3xl block mb-2">🖥️</span>
                <h4 className="text-sm font-bold text-retro-text-secondary">
                  {isRtl ? 'لا توجد أجهزة متوفرة في هذه الفئة حالياً' : 'No prebuilt PCs in this tier right now'}
                </h4>
              </div>
            ) : (
              categorizedGamingPcs[activePcTab].map((pc) => {
                const cpu = pc.specs.cpu || pc.specs.CPU || 'Intel Core i5 / AMD Ryzen 5';
                const gpu = pc.specs.gpu || pc.specs.GPU || 'NVIDIA RTX';
                const ram = pc.specs.ram || pc.specs.RAM || '16GB DDR5';
                const storage = pc.specs.storage || pc.specs.Storage || '1TB SSD';
                const isWishlisted = wishlist.includes(pc.id);

                return (
                  <div
                    key={pc.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-retro-border bg-retro-bg-card/40 p-5 hover:border-retro-cyan/35 transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.12)]"
                  >
                    <button
                      onClick={() => handleToggleWishlist(pc.id, isRtl ? pc.nameAr : pc.nameEn)}
                      className={`absolute top-4 right-4 z-10 rounded-full p-2 backdrop-blur-sm border transition-all cursor-pointer ${
                        isWishlisted 
                          ? 'bg-retro-pink/20 border-retro-pink/40 text-retro-pink' 
                          : 'bg-retro-bg-card/80 border-retro-border text-retro-text-muted hover:text-retro-pink'
                      }`}
                    >
                      <HeartIcon size={14} className={isWishlisted ? "fill-retro-pink text-retro-pink" : ""} />
                    </button>

                    <div>
                      {/* Image */}
                      <div className="relative h-44 bg-retro-bg-input rounded-2xl overflow-hidden flex items-center justify-center p-3 border border-retro-border">
                        <img 
                          src={pc.imageUrl} 
                          alt={pc.nameEn} 
                          className="h-full w-full object-cover rounded-xl"
                        />
                      </div>

                      {/* Info & Specs */}
                      <div className="pt-4 space-y-3">
                        <div className="flex justify-between items-center text-[10px] text-retro-text-muted font-bold uppercase tracking-wider">
                          <span>{pc.brand}</span>
                          <ConditionBadge condition={pc.condition} />
                        </div>

                        <h3 className="text-xs sm:text-sm font-extrabold text-retro-text line-clamp-1 hover:text-retro-cyan transition-colors">
                          {isRtl ? pc.nameAr : pc.nameEn}
                        </h3>

                        {/* Specs Grid */}
                        <div className="bg-retro-bg-secondary/40 rounded-xl p-3 border border-retro-border/40 text-[10px] space-y-2 text-retro-text-secondary">
                          <div className="flex items-center gap-1.5">
                            <span>⚙️</span>
                            <span className="line-clamp-1">{cpu}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span>🎮</span>
                            <span className="line-clamp-1">{gpu}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span>💾</span>
                            <span className="line-clamp-1">{ram} | {storage}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Action */}
                    <div className="pt-4 mt-4 border-t border-retro-border flex items-center justify-between gap-2">
                      <PriceTag price={pc.salePrice ?? pc.sellingPrice} originalPrice={pc.salePrice ? pc.sellingPrice : undefined} size="sm" />
                      <button
                        onClick={() => handleAddToCart(pc)}
                        className="flex items-center gap-1.5 rounded-xl bg-retro-cyan text-retro-bg hover:bg-retro-cyan/95 px-3.5 py-2 text-[10px] font-black shadow-md shadow-retro-cyan/10 transition-all cursor-pointer"
                      >
                        <CartIcon size={12} />
                        <span>{isRtl ? "شراء" : "Buy"}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. BEST DEALS (ON SALE PRODUCTS)
         ═══════════════════════════════════════ */}
      {dealsProducts.length > 0 && (
        <section className="px-4 py-12 sm:px-6 lg:px-8 border-t border-retro-border">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className={`space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="inline-flex items-center gap-2 rounded-full bg-retro-pink/10 border border-retro-pink/20 px-3 py-1 text-[10px] font-bold text-retro-pink uppercase tracking-wider">
                <FlameIcon size={12} className="animate-pulse text-retro-pink" />
                {isRtl ? 'تخفيضات وعروض حصرية' : 'Hot Promotions'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-retro-text tracking-tight">
                {isRtl ? 'أفضل العروض الحالية' : 'Best Deals & Discounts'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dealsProducts.map((product) => {
                const isWishlisted = wishlist.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-retro-border bg-retro-bg-card/40 p-4 hover:border-retro-pink/35 transition-all duration-300 hover:shadow-[0_0_25px_rgba(236,72,153,0.12)]"
                  >
                    <button
                      onClick={() => handleToggleWishlist(product.id, isRtl ? product.nameAr : product.nameEn)}
                      className={`absolute top-3.5 right-3.5 z-10 rounded-full p-2 backdrop-blur-sm border transition-all cursor-pointer ${
                        isWishlisted 
                          ? 'bg-retro-pink/20 border-retro-pink/40 text-retro-pink' 
                          : 'bg-retro-bg-card/85 border-retro-border text-retro-text-muted hover:text-retro-pink'
                      }`}
                    >
                      <HeartIcon size={12} className={isWishlisted ? "fill-retro-pink text-retro-pink" : ""} />
                    </button>

                    <div>
                      {/* Image */}
                      <div className="relative h-40 bg-retro-bg-input rounded-2xl overflow-hidden flex items-center justify-center p-3 border border-retro-border">
                        <img 
                          src={product.imageUrl} 
                          alt={product.nameEn} 
                          className="h-full w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Info */}
                      <div className="pt-3 space-y-1">
                        <span className="text-[9px] font-bold text-retro-pink uppercase">{product.brand}</span>
                        <h3 className="text-xs font-bold text-retro-text line-clamp-1 hover:text-retro-pink cursor-pointer">
                          {isRtl ? product.nameAr : product.nameEn}
                        </h3>
                        <p className="text-[10px] text-retro-text-secondary line-clamp-2 leading-relaxed">
                          {isRtl ? product.descriptionAr : product.descriptionEn}
                        </p>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="pt-3 mt-3 border-t border-retro-border flex items-center justify-between">
                      <PriceTag price={product.salePrice!} originalPrice={product.sellingPrice} size="sm" />
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-retro-purple-muted to-retro-pink hover:from-retro-purple hover:to-retro-pink/90 px-3 py-1.5 text-[9px] font-black text-white transition-all cursor-pointer"
                      >
                        <CartIcon size={12} />
                        <span>{isRtl ? "شراء" : "Buy"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          5. BUILD YOUR PC — CTA
         ═══════════════════════════════════════ */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-2xl border border-retro-cyan/15 bg-gradient-to-r from-retro-cyan-dim/30 via-retro-bg-card to-retro-purple-dim/30 p-8 sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(34,211,238,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center md:text-start">
                <div className="inline-flex items-center gap-2 rounded-full bg-retro-cyan/10 border border-retro-cyan/20 px-3 py-1 text-[10px] font-bold text-retro-cyan uppercase tracking-wider">
                  {isRtl ? 'أداة تفاعلية' : 'Interactive Tool'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-retro-text tracking-tight">
                  {dict.pcBuilder.title}
                </h2>
                <p className="text-sm text-retro-text-secondary max-w-md leading-relaxed">
                  {dict.pcBuilder.subtitle}
                </p>
              </div>
              <Link href={`/${locale}/pc-builder`} onClick={() => setActiveDepartment('pc')}>
                <Button size="lg" icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                  </svg>
                }>
                  {dict.pcBuilder.title}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. PC COMPONENTS GRID
         ═══════════════════════════════════════ */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-t border-retro-border">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className={`space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 rounded-full bg-retro-purple/10 border border-retro-purple/20 px-3 py-1 text-[10px] font-bold text-retro-purple uppercase tracking-wider">
              {isRtl ? 'منظومة عتاد كاملة' : 'Complete Hardware Stack'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-retro-text tracking-tight">
              {isRtl ? 'مكونات وقطع غيار الكمبيوتر' : 'PC Components'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {componentProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-retro-border bg-retro-bg-card/40 p-4 hover:border-retro-purple/35 transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.12)]"
                >
                  <button
                    onClick={() => handleToggleWishlist(product.id, isRtl ? product.nameAr : product.nameEn)}
                    className={`absolute top-3.5 right-3.5 z-10 rounded-full p-2 backdrop-blur-sm border transition-all cursor-pointer ${
                      isWishlisted 
                        ? 'bg-retro-pink/20 border-retro-pink/40 text-retro-pink' 
                        : 'bg-retro-bg-card/85 border-retro-border text-retro-text-muted hover:text-retro-pink'
                    }`}
                  >
                    <HeartIcon size={12} className={isWishlisted ? "fill-retro-pink text-retro-pink" : ""} />
                  </button>

                  <div>
                    {/* Image */}
                    <div className="relative h-40 bg-retro-bg-input rounded-2xl overflow-hidden flex items-center justify-center p-3 border border-retro-border">
                      <img 
                        src={product.imageUrl} 
                        alt={product.nameEn} 
                        className="h-full w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Info */}
                    <div className="pt-3 space-y-1">
                      <span className="text-[9px] font-bold text-retro-purple uppercase">{product.brand}</span>
                      <h3 className="text-xs font-bold text-retro-text line-clamp-1 hover:text-retro-purple cursor-pointer">
                        {isRtl ? product.nameAr : product.nameEn}
                      </h3>
                      <p className="text-[10px] text-retro-text-secondary line-clamp-2 leading-relaxed">
                        {isRtl ? product.descriptionAr : product.descriptionEn}
                      </p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="pt-3 mt-3 border-t border-retro-border flex items-center justify-between">
                    <PriceTag price={product.salePrice ?? product.sellingPrice} originalPrice={product.salePrice ? product.sellingPrice : undefined} size="sm" />
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-1 rounded-xl bg-retro-purple text-white hover:bg-retro-purple/95 px-3 py-1.5 text-[9px] font-black transition-all cursor-pointer"
                    >
                      <CartIcon size={12} />
                      <span>{isRtl ? "شراء" : "Buy"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          7. GAMING ACCESSORIES SHOWCASE
         ═══════════════════════════════════════ */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-t border-retro-border">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div className={`space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
              <h2 className="text-2xl sm:text-3xl font-black text-retro-text tracking-tight">
                {isRtl ? 'ملحقات وأجهزة تحكم' : 'Gaming Accessories'}
              </h2>
            </div>
            <Link href={`/${locale}/accessories`} className="text-xs font-bold text-retro-cyan hover:underline shrink-0">
              {isRtl ? 'تصفح كل الملحقات ←' : 'Browse all accessories →'}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {accessoryProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-retro-border bg-retro-bg-card/40 p-4 hover:border-retro-cyan/35 transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.12)]"
                >
                  <button
                    onClick={() => handleToggleWishlist(product.id, isRtl ? product.nameAr : product.nameEn)}
                    className={`absolute top-3.5 right-3.5 z-10 rounded-full p-2 backdrop-blur-sm border transition-all cursor-pointer ${
                      isWishlisted 
                        ? 'bg-retro-pink/20 border-retro-pink/40 text-retro-pink' 
                        : 'bg-retro-bg-card/85 border-retro-border text-retro-text-muted hover:text-retro-pink'
                    }`}
                  >
                    <HeartIcon size={12} className={isWishlisted ? "fill-retro-pink text-retro-pink" : ""} />
                  </button>

                  <div>
                    {/* Image */}
                    <div className="relative h-40 bg-retro-bg-input rounded-2xl overflow-hidden flex items-center justify-center p-3 border border-retro-border">
                      <img 
                        src={product.imageUrl} 
                        alt={product.nameEn} 
                        className="h-full w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Info */}
                    <div className="pt-3 space-y-1">
                      <span className="text-[9px] font-bold text-retro-cyan uppercase">{product.brand}</span>
                      <h3 className="text-xs font-bold text-retro-text line-clamp-1 hover:text-retro-cyan cursor-pointer">
                        {isRtl ? product.nameAr : product.nameEn}
                      </h3>
                      <p className="text-[10px] text-retro-text-secondary line-clamp-2 leading-relaxed">
                        {isRtl ? product.descriptionAr : product.descriptionEn}
                      </p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="pt-3 mt-3 border-t border-retro-border flex items-center justify-between">
                    <PriceTag price={product.salePrice ?? product.sellingPrice} originalPrice={product.salePrice ? product.sellingPrice : undefined} size="sm" />
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-1 rounded-xl bg-retro-cyan text-retro-bg hover:bg-retro-cyan/95 px-3 py-1.5 text-[9px] font-black transition-all cursor-pointer"
                    >
                      <CartIcon size={12} />
                      <span>{isRtl ? "شراء" : "Buy"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          8. MONITORS & RETRO GAMING SHOWCASES
         ═══════════════════════════════════════ */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-t border-retro-border">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column A: Monitors */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-retro-border pb-3">
              <h2 className="text-xl font-black text-retro-text">{isRtl ? 'شاشات القيمنق والاحترافية' : 'Gaming Monitors'}</h2>
              <Link href={`/${locale}/category/monitors`} className="text-xs font-semibold text-retro-cyan hover:underline">
                {isRtl ? 'عرض الكل ←' : 'View all →'}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {monitorProducts.map(product => (
                <div key={product.id} className="bg-retro-bg-card/30 border border-retro-border rounded-2xl p-4 flex flex-col justify-between hover:border-retro-cyan/30 transition-all">
                  <div className="space-y-3">
                    <div className="h-32 bg-retro-bg-input rounded-xl overflow-hidden flex items-center justify-center p-2">
                      <img src={product.imageUrl} alt={product.nameEn} className="h-full object-cover rounded-lg" />
                    </div>
                    <div>
                      <span className="text-[8px] font-bold text-retro-cyan uppercase">{product.brand}</span>
                      <h4 className="text-[11px] font-bold text-retro-text line-clamp-1">{isRtl ? product.nameAr : product.nameEn}</h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-retro-border/60 mt-3">
                    <span className="text-xs font-black text-retro-cyan">{product.salePrice ?? product.sellingPrice} {t('currency')}</span>
                    <button onClick={() => handleAddToCart(product)} className="bg-retro-cyan/10 hover:bg-retro-cyan/20 border border-retro-cyan/20 rounded-lg p-1.5 text-retro-cyan cursor-pointer">
                      <CartIcon size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column B: Retro Gaming */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-retro-border pb-3">
              <h2 className="text-xl font-black text-retro-text">{isRtl ? 'أجهزة ريترو وألعاب كلاسيكية' : 'Retro Gaming Classics'}</h2>
              <Link href={`/${locale}/category/retro-gaming`} className="text-xs font-semibold text-retro-purple hover:underline">
                {isRtl ? 'عرض الكل ←' : 'View all →'}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {retroProducts.map(product => (
                <div key={product.id} className="bg-retro-bg-card/30 border border-retro-border rounded-2xl p-4 flex flex-col justify-between hover:border-retro-purple/30 transition-all">
                  <div className="space-y-3">
                    <div className="h-32 bg-retro-bg-input rounded-xl overflow-hidden flex items-center justify-center p-2">
                      <img src={product.imageUrl} alt={product.nameEn} className="h-full object-cover rounded-lg" />
                    </div>
                    <div>
                      <span className="text-[8px] font-bold text-retro-purple uppercase">{product.brand}</span>
                      <h4 className="text-[11px] font-bold text-retro-text line-clamp-1">{isRtl ? product.nameAr : product.nameEn}</h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-retro-border/60 mt-3">
                    <span className="text-xs font-black text-retro-purple">{product.salePrice ?? product.sellingPrice} {t('currency')}</span>
                    <button onClick={() => handleAddToCart(product)} className="bg-retro-purple/10 hover:bg-retro-purple/20 border border-retro-purple/20 rounded-lg p-1.5 text-retro-purple cursor-pointer">
                      <CartIcon size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          9. REPAIR HUB — CTA
         ═══════════════════════════════════════ */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-2xl border border-retro-purple/15 bg-gradient-to-r from-retro-purple-dim/30 via-retro-bg-card to-retro-pink/5 p-8 sm:p-12">
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center md:text-start">
                <div className="inline-flex items-center gap-2 rounded-full bg-retro-purple/10 border border-retro-purple/20 px-3 py-1 text-[10px] font-bold text-retro-purple uppercase tracking-wider">
                  {isRtl ? 'خدمة احترافية' : 'Professional Service'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-retro-text tracking-tight">
                  {dict.repair.title}
                </h2>
                <p className="text-sm text-retro-text-secondary max-w-md leading-relaxed">
                  {dict.repair.subtitle}
                </p>
              </div>
              <Link href={`/${locale}/repair`}>
                <Button variant="accent" size="lg" icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                }>
                  {dict.repair.bookRepair}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          10. WHY RETRO
         ═══════════════════════════════════════ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-t border-retro-border">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-retro-text tracking-tight">
              {dict.whyRetro.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(['reason1', 'reason2', 'reason3', 'reason4'] as const).map((key, i) => {
              const reason = dict.whyRetro[key] as { title: string; desc: string };
              const icons = ['🛠️', '🛡️', '🚚', '🔧'];
              const colors = ['cyan', 'purple', 'cyan', 'purple'];
              const isCyan = colors[i] === 'cyan';
              return (
                <div
                  key={key}
                  className={`
                    rounded-2xl border p-6 space-y-3 transition-all duration-300 hover:-translate-y-1
                    ${isCyan
                      ? 'border-retro-cyan/10 bg-retro-bg-card hover:border-retro-cyan/25'
                      : 'border-retro-purple/10 bg-retro-bg-card hover:border-retro-purple/25'
                    }
                  `}
                >
                  <span className="text-2xl">{icons[i]}</span>
                  <h3 className="text-sm font-bold text-retro-text">{reason.title}</h3>
                  <p className="text-xs text-retro-text-secondary leading-relaxed font-medium">{reason.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          11. CUSTOMER REVIEWS (TESTIMONIALS)
         ═══════════════════════════════════════ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-t border-retro-border bg-retro-bg-secondary/15">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-retro-text tracking-tight">
              {isRtl ? 'ماذا يقول عملائنا في قطر' : 'What Our Customers Say'}
            </h2>
            <p className="text-sm text-retro-text-secondary font-medium">
              {isRtl ? 'تقييمات حقيقية من عشاق الألعاب وصيانة الأجهزة في الدوحة.' : 'Real testimonials from gaming enthusiasts and tech repair customers in Doha.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: isRtl ? 'حمد المري' : 'Hamad Al-Marri',
                role: isRtl ? 'عميل صيانة وتحديث' : 'PC Upgrade Customer',
                rating: 5,
                text: isRtl 
                  ? 'أفضل مركز صيانة في الدوحة بلا منازع! قمت بتنظيف اللابتوب الخاص بي وتغيير المعجون الحراري، والجهاز عاد يعمل كأنه جديد تماماً.' 
                  : 'Undoubtedly the best repair center in Doha! They serviced my gaming laptop, replaced the thermal paste, and it runs like brand new.',
                date: '2026-07-28'
              },
              {
                name: isRtl ? 'فيصل الأنصاري' : 'Faisal Al-Ansari',
                role: isRtl ? 'تجميع جهاز قيمنق مخصص' : 'Custom PC Buyer',
                rating: 5,
                text: isRtl 
                  ? 'تجربة تجميع الكمبيوتر عبر الموقع كانت ممتازة وسهلة. القطع متوافقة والدعم الفني ساعدني في اختيار التبريد المائي المناسب.' 
                  : 'Building my PC using their tool was very smooth. The parts check out perfectly and technical support helped configure the CPU cooler.',
                date: '2026-08-01'
              },
              {
                name: isRtl ? 'سارة الكواري' : 'Sarah Al-Kuwari',
                role: isRtl ? 'مقتني أجهزة كلاسيكية' : 'Retro Games Collector',
                rating: 5,
                text: isRtl 
                  ? 'سعيدة جداً بحصولي على جهاز قيم بوي كولور مجدد بالكامل بحالة ممتازة! الملحقات أصلية والتوصيل كان سريعاً في نفس اليوم.' 
                  : 'Thrilled to get a fully restored Game Boy Color in mint condition! Accessories are original and delivery was super fast, same day.',
                date: '2026-08-05'
              }
            ].map((review, i) => (
              <div key={i} className="rounded-2xl border border-retro-border bg-retro-bg-card p-6 space-y-4 shadow-xl hover:border-retro-cyan/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-retro-text">{review.name}</h4>
                    <span className="text-[10px] text-retro-text-muted">{review.role}</span>
                  </div>
                  <div className="flex gap-0.5 text-retro-amber text-xs">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <span key={idx}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-retro-text-secondary leading-relaxed font-medium">"{review.text}"</p>
                <div className="text-[9px] text-retro-text-dim text-right font-mono">{review.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          12. NEWSLETTER & SOCIAL FEED
         ═══════════════════════════════════════ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-t border-retro-border bg-gradient-to-b from-retro-bg to-retro-bg-secondary">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Newsletter signup */}
          <div className="space-y-6">
            <div className="space-y-3 text-center lg:text-left">
              <span className="text-[9px] font-black text-retro-cyan uppercase bg-retro-cyan/10 border border-retro-cyan/20 rounded-md px-2.5 py-1">
                {isRtl ? 'اشترك معنا' : 'STAY UPDATED'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-retro-text tracking-tight pt-2">
                {isRtl ? 'اشترك في نشرتنا الإخبارية' : 'Join the RETRO Newsletter'}
              </h2>
              <p className="text-sm text-retro-text-secondary leading-relaxed max-w-md font-medium">
                {isRtl 
                  ? 'كن أول من يعرف عن وصول الأجهزة الكلاسيكية النادرة، عروض تجميعات البي سي الأسبوعية، وخصومات الصيانة.' 
                  : 'Subscribe to get early notifications on rare retro consoles restocks, weekly gaming rigs offers, and repair deals.'}
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={isRtl ? 'أدخل بريدك الإلكتروني...' : 'Enter your email address...'}
                className="flex-1 rounded-xl bg-retro-bg-input px-4 py-3 text-xs text-retro-text border border-retro-border focus:outline-none focus:border-retro-cyan focus:ring-1 focus:ring-retro-cyan/25 transition-all"
              />
              <Button type="submit" variant="primary" size="md">
                {isRtl ? 'اشترك' : 'Subscribe'}
              </Button>
            </form>
          </div>

          {/* Social Showcase */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-retro-border pb-3">
              <h3 className="text-sm font-bold text-retro-text">
                {isRtl ? 'تابعنا على إنستغرام @retroqatar' : 'Follow Us @retroqatar'}
              </h3>
              <span className="text-[10px] text-retro-text-muted font-bold uppercase">Instagram Feed</span>
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
                <div key={i} className="group relative aspect-square rounded-xl overflow-hidden bg-retro-bg-input border border-retro-border cursor-pointer">
                  <img 
                    src={url} 
                    alt="Social feed" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-retro-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-lg">❤️</span>
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
