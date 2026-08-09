"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { Product } from '../data/mockData';
import { 
  SearchIcon, 
  CartIcon, 
  HeartIcon, 
  CompareIcon, 
  SparklesIcon, 
  CheckIcon, 
  TrashIcon, 
  CloseIcon,
  ControllerIcon,
  GamingPcIcon,
  CpuIcon,
  RepairIcon,
  FlameIcon,
  TagIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  PlusIcon
} from '../components/Icons';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_BANNERS = [
  {
    id: 1,
    titleAr: "عروض ريترو الكبرى - خصم يصل إلى 30%",
    titleEn: "RETRO Mega Sale - Up to 30% OFF",
    subtitleAr: "أقوى حواسيب قيمنق مزودة بكروت شاشة RTX 4090 مع ضمان عامين",
    subtitleEn: "Ultra High-End RTX 4090 Gaming Rigs with 2 Years Local Warranty",
    tagAr: "عرض لفترة محدودة",
    tagEn: "Limited Time Offer",
    ctaAr: "تسوق العروض الآن",
    ctaEn: "Shop Deals Now",
    ctaLink: "#store-catalog",
    gradient: "from-cyan-900/60 via-purple-950/80 to-slate-950",
    glowColor: "cyan"
  },
  {
    id: 2,
    titleAr: "ابْنِ حاسوب أحلامك بمواصفات خارقة",
    titleEn: "Assemble Your Dream Gaming Rig",
    subtitleAr: "باني الحواسيب التفاعلي - اختبر التوافق فوراً مع دعم فني متخصص",
    subtitleEn: "Interactive PC Builder - Real-time compatibility check & expert support",
    tagAr: "تجمعيات مخصصة",
    tagEn: "Custom PC Builds",
    ctaAr: "ابدأ التجميع الآن",
    ctaEn: "Start Building",
    ctaLink: "/pc-builder",
    gradient: "from-purple-900/60 via-indigo-950/80 to-slate-950",
    glowColor: "purple"
  },
  {
    id: 3,
    titleAr: "مركز صيانة ريترو المعتمد في الدوحة",
    titleEn: "Certified RETRO Repair Hub Doha",
    subtitleAr: "فحص مجاني، صيانة فورية لأجهزة الكونسول، الحواسيب، والملحقات",
    subtitleEn: "Free diagnostics & rapid repairs for Consoles, Gaming PCs & Gear",
    tagAr: "خدمة صيانة فورية",
    tagEn: "Rapid Repair Service",
    ctaAr: "احجز موعد صيانة",
    ctaEn: "Book Repair",
    ctaLink: "/repair",
    gradient: "from-pink-950/60 via-purple-950/80 to-slate-950",
    glowColor: "pink"
  }
];

function StorefrontContent() {
  const { 
    language, 
    t, 
    isRtl, 
    products, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    compareList, 
    toggleCompare
  } = useApp();

  // Banner Carousel Index
  const [currentBanner, setCurrentBanner] = useState(0);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Listen to search params to filter categories dynamically from other pages/navbar
  const searchParams = useSearchParams();
  const catParam = searchParams ? searchParams.get('cat') : null;

  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);

  // Auto rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % HERO_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Extract Categories & Add PC Components grouping
  const pcCategories = ['RAM', 'CPUs', 'Motherboards', 'GPUs', 'SSD', 'Cooling', 'Monitors', 'PSUs', 'Cases'];
  
  const rawCategories = Array.from(new Set(products.map(p => p.category)));
  const hasPcComponents = rawCategories.some(cat => pcCategories.includes(cat));

  const categories = ['All'];
  if (hasPcComponents) {
    categories.push('PC Components');
  }
  rawCategories.forEach(cat => {
    if (!categories.includes(cat)) {
      categories.push(cat);
    }
  });

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (p.status === 'draft') return false;
    const matchesSearch = 
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameAr.includes(searchQuery) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
    let matchesCategory = false;
    if (selectedCategory === 'All') {
      matchesCategory = true;
    } else if (selectedCategory === 'PC Components') {
      matchesCategory = pcCategories.includes(p.category);
    } else {
      matchesCategory = p.category === selectedCategory;
    }
    return matchesSearch && matchesCategory;
  });

  // Featured lists
  const newArrivals = products.filter(p => p.status !== 'draft').slice(0, 4);
  const bestSellers = products.filter(p => p.status !== 'draft' && (p.salePrice || p.stockQty < 5)).slice(0, 4);
  const customPcBuilds = products.filter(p => p.status !== 'draft' && p.category === 'Gaming PCs');



  return (
    <div className="flex-1 bg-slate-950 pb-20">
      
      {/* 1. Hero Banner Carousel Section (Abbasma.com Style Banner Slider) */}
      <section className="relative overflow-hidden border-b border-purple-500/10 bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-900 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? 50 : -50 }}
                transition={{ duration: 0.5 }}
                className={`relative p-8 sm:p-12 lg:p-16 bg-gradient-to-r ${HERO_BANNERS[currentBanner].gradient} flex flex-col justify-between min-h-[300px] sm:min-h-[360px]`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

                <div className="relative max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-4 py-1 text-xs font-bold text-cyan-300 backdrop-blur-md">
                    <SparklesIcon size={14} className="animate-pulse text-cyan-400" />
                    <span>{isRtl ? HERO_BANNERS[currentBanner].tagAr : HERO_BANNERS[currentBanner].tagEn}</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight uppercase tracking-tight">
                    {isRtl ? HERO_BANNERS[currentBanner].titleAr : HERO_BANNERS[currentBanner].titleEn}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                    {isRtl ? HERO_BANNERS[currentBanner].subtitleAr : HERO_BANNERS[currentBanner].subtitleEn}
                  </p>

                  <div className="pt-4">
                    <a
                      href={HERO_BANNERS[currentBanner].ctaLink}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 px-7 py-3.5 text-xs font-black text-white shadow-lg shadow-cyan-500/30 hover:scale-105 hover:shadow-purple-600/40 transition-all cursor-pointer"
                    >
                      <span>{isRtl ? HERO_BANNERS[currentBanner].ctaAr : HERO_BANNERS[currentBanner].ctaEn}</span>
                      {isRtl ? <ChevronLeftIcon size={18} /> : <ChevronRightIcon size={18} />}
                    </a>
                  </div>
                </div>

                {/* Banner Controls & Dots */}
                <div className="relative pt-6 flex items-center justify-between">
                  <div className="flex gap-2">
                    {HERO_BANNERS.map((banner, index) => (
                      <button
                        key={banner.id}
                        onClick={() => setCurrentBanner(index)}
                        className={`h-2 rounded-full transition-all ${
                          currentBanner === index ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentBanner((currentBanner - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)}
                      className="rounded-full bg-slate-950/60 p-2 text-slate-400 hover:text-white border border-slate-800"
                    >
                      <ChevronRightIcon size={18} />
                    </button>
                    <button
                      onClick={() => setCurrentBanner((currentBanner + 1) % HERO_BANNERS.length)}
                      className="rounded-full bg-slate-950/60 p-2 text-slate-400 hover:text-white border border-slate-800"
                    >
                      <ChevronLeftIcon size={18} />
                    </button>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 2. Hero Section - Two Interactive Main Cards (قسم الحواسيب & قسم الألعاب) */}
      <section className="relative overflow-hidden border-b border-purple-500/10 bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl">
          
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-4 py-1 text-xs font-bold text-cyan-400 tracking-wider uppercase">
              <SparklesIcon size={14} className="animate-pulse text-cyan-300" />
              {isRtl ? "اقسام متجر ريترو الرئيسية" : "RETRO Main Departments"}
            </div>
            <h2 className="text-2xl font-black text-white sm:text-4xl uppercase tracking-tight">
              {isRtl ? "اختر وجهتك الاحترافية" : "Choose Your Gaming Realm"}
            </h2>
          </div>

          {/* Grid of Two Interactive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* CARD 1: قسم الحواسيب */}
            <motion.div
              initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl hover:border-cyan-400/60 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]"
            >
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl group-hover:bg-cyan-500/30 transition-all pointer-events-none"></div>

              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 shadow-inner group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-400 transition-all duration-300">
                      <GamingPcIcon size={32} className="drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 block">
                        {isRtl ? "تجميع وصيانة الحواسيب" : "Rig Customization & Repair"}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                        {isRtl ? "قسم الحواسيب" : "PC Department"}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {isRtl 
                    ? "تجميع أجهزة الألعاب والتصميم بمواصفات خارقة، حلول الصيانة الاحترافية، وقطع الغيار الأصلية مع ضمان شامل."
                    : "Custom gaming PC builds, high-end workstations, diagnostic testing, upgrades, and genuine computer parts."}
                </p>
              </div>

              {/* Sub-Buttons inside Card 1 */}
              <div className="relative mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  href="/pc-builder"
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-3 text-center text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all group/btn"
                >
                  <CpuIcon size={18} className="text-cyan-400 group-hover/btn:scale-110 transition-transform" />
                  <span>{isRtl ? "ابْنِ جهازك" : "Build Your PC"}</span>
                </Link>

                <Link
                  href="/repair"
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-3 text-center text-xs font-bold text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all group/btn"
                >
                  <RepairIcon size={18} className="text-purple-400 group-hover/btn:scale-110 transition-transform" />
                  <span>{isRtl ? "صيانة" : "PC Repair"}</span>
                </Link>

                <button
                  onClick={() => {
                    setSelectedCategory('PC Components');
                    const element = document.getElementById('store-catalog');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-3 text-center text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 hover:scale-[1.02] transition-all group/btn cursor-pointer"
                >
                  <CartIcon size={18} className="group-hover/btn:scale-110 transition-transform" />
                  <span>{isRtl ? "تسوق الآن" : "Shop Parts"}</span>
                </button>
              </div>
            </motion.div>

            {/* CARD 2: قسم الألعاب */}
            <motion.div
              initial={{ opacity: 0, x: isRtl ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-purple-500/20 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl hover:border-purple-400/60 transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]"
            >
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl group-hover:bg-purple-600/30 transition-all pointer-events-none"></div>

              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/40 bg-purple-500/10 text-purple-400 shadow-inner group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:border-purple-400 transition-all duration-300">
                      <ControllerIcon size={32} className="drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-purple-400 block">
                        {isRtl ? "أجهزة الألعاب والملحقات" : "Consoles & Accessories"}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                        {isRtl ? "قسم الألعاب" : "Gaming Hub"}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {isRtl 
                    ? "أحدث منصات الألعاب (PlayStation, Xbox, Switch)، الألعاب الكلاسيكية، ملحقات تحكم احترافية وخدمات صيانة الأجهزة."
                    : "Next-gen consoles, retro gaming systems, pro controllers, collectibles, and hardware repairs."}
                </p>
              </div>

              {/* Sub-Buttons inside Card 2 */}
              <div className="relative mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/repair"
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/10 px-3 py-3 text-center text-xs font-bold text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all group/btn"
                >
                  <RepairIcon size={18} className="text-purple-400 group-hover/btn:scale-110 transition-transform" />
                  <span>{isRtl ? "صيانة الأجهزة" : "Console Repair"}</span>
                </Link>

                <Link
                  href="/consoles"
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-3 text-center text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:from-purple-500 hover:to-pink-500 hover:scale-[1.02] transition-all group/btn cursor-pointer"
                >
                  <CartIcon size={18} className="group-hover/btn:scale-110 transition-transform" />
                  <span>{isRtl ? "تسوق الآن (Shop Games)" : "Shop Games"}</span>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Featured Section: "وصلنا حديثاً" (New Arrivals Slider/Grid) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/30 p-2 text-cyan-400">
              <SparklesIcon size={20} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-wide">
                {isRtl ? "وصلنا حديثاً" : "New Arrivals"}
              </h2>
              <span className="text-xs text-slate-400">
                {isRtl ? "أحدث قطع الغيار وأجهزة الألعاب المضافة حديثاً" : "Latest hardware & gaming arrivals"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => {
            const price = product.salePrice ?? product.sellingPrice;
            return (
              <div 
                key={product.id}
                className="group relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300"
              >
                <div className="absolute top-3 left-3 z-10">
                  <span className="rounded-md bg-cyan-500 px-2 py-0.5 text-[10px] font-bold text-slate-950 uppercase shadow-md shadow-cyan-500/20">
                    NEW
                  </span>
                </div>

                <div 
                  onClick={() => setQuickViewProduct(product)}
                  className="h-40 rounded-xl bg-slate-950 overflow-hidden cursor-pointer relative"
                >
                  <img 
                    src={product.imageUrl || '/media/image1.jpeg'} 
                    alt={product.nameEn} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/media/image1.jpeg';
                    }}
                  />
                </div>

                <div className="flex-1 pt-4 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                      {product.brand}
                    </span>
                    <h3 
                      onClick={() => setQuickViewProduct(product)}
                      className="text-xs font-bold text-white line-clamp-1 mt-1 hover:text-cyan-400 cursor-pointer"
                    >
                      {isRtl ? product.nameAr : product.nameEn}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
                    <span className="text-sm font-extrabold text-cyan-400">
                      {price} {t('currency')}
                    </span>
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 text-xs font-bold flex items-center gap-1 shadow-sm shadow-cyan-500/10 cursor-pointer"
                    >
                      <CartIcon size={14} />
                      <span>{isRtl ? "إضافة" : "Add"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Main Store Catalog Area (#store-catalog) */}
      <section id="store-catalog" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Filter & Search Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
              {isRtl ? "البحث في المتجر" : "Search Shop"}
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder={isRtl ? "ابحث بالاسم أو SKU..." : "Search name or SKU..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-slate-100 border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              <SearchIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
              {t('category')}
            </h3>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs text-right flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer font-medium transition-all ${
                    selectedCategory === cat 
                      ? 'bg-cyan-500/10 text-cyan-400 border-r-4 border-cyan-400' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <span>
                    {cat === 'All' 
                      ? (isRtl ? 'الكل' : 'All') 
                      : cat === 'PC Components' 
                        ? (isRtl ? 'قطع الغيار والتجميع' : 'PC Components') 
                        : cat
                    }
                  </span>
                  {selectedCategory === cat && <CheckIcon size={14} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Products Catalog Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-lg font-extrabold text-white tracking-wide">
              {selectedCategory === 'All' 
                ? (isRtl ? 'جميع المنتجات المتوفرة' : 'All Products') 
                : selectedCategory === 'PC Components'
                  ? (isRtl ? 'قطع الغيار والتجميع' : 'PC Components')
                  : selectedCategory
              } ({filteredProducts.length})
            </h2>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product) => {
              const price = product.salePrice ?? product.sellingPrice;
              const hasDiscount = !!product.salePrice;
              const isLowStock = product.stockQty > 0 && product.stockQty <= product.lowStockThreshold;
              const isWishlisted = wishlist.includes(product.id);
              const inCompare = !!compareList.find(p => p.id === product.id);

              return (
                <motion.div 
                  key={product.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]"
                >
                  {/* Category & Condition labels */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                    <span className="rounded-md bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-slate-300 backdrop-blur-sm uppercase">
                      {product.condition}
                    </span>
                    {product.stockQty === 0 ? (
                      <span className="rounded-md bg-pink-600/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                        {t('outOfStock')}
                      </span>
                    ) : isLowStock ? (
                      <span className="rounded-md bg-yellow-600/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm animate-pulse">
                        {t('lowStock')}
                      </span>
                    ) : null}
                  </div>

                  {/* Wishlist & Compare Buttons */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className={`rounded-full p-2 backdrop-blur-sm border transition-all cursor-pointer ${
                        isWishlisted 
                          ? 'bg-pink-500/20 border-pink-500/40 text-pink-500' 
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-pink-500'
                      }`}
                    >
                      <HeartIcon size={14} className={isWishlisted ? "fill-pink-500" : ""} />
                    </button>
                    <button 
                      onClick={() => toggleCompare(product)}
                      className={`rounded-full p-2 backdrop-blur-sm border transition-all cursor-pointer ${
                        inCompare 
                          ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' 
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-cyan-400'
                      }`}
                    >
                      <CompareIcon size={14} />
                    </button>
                  </div>

                  {/* Product Image */}
                  <div 
                    onClick={() => setQuickViewProduct(product)}
                    className="relative h-44 bg-slate-950 overflow-hidden cursor-pointer"
                  >
                    <img 
                      src={product.imageUrl || '/media/image1.jpeg'} 
                      alt={product.nameEn}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/media/image1.jpeg';
                      }}
                    />
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                        {product.brand}
                      </span>
                      <h3 
                        onClick={() => setQuickViewProduct(product)}
                        className="text-xs font-bold text-white line-clamp-2 mt-1 hover:text-cyan-400 cursor-pointer"
                      >
                        {isRtl ? product.nameAr : product.nameEn}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {isRtl ? product.descriptionAr : product.descriptionEn}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      <div className="flex flex-col">
                        {hasDiscount && (
                          <span className="text-[10px] text-slate-500 line-through">
                            {product.sellingPrice} {t('currency')}
                          </span>
                        )}
                        <span className="text-sm font-extrabold text-cyan-400">
                          {price} {t('currency')}
                        </span>
                      </div>
                      
                      <button
                        disabled={product.stockQty === 0}
                        onClick={() => addToCart(product, 1)}
                        className="rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 px-3 py-2 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer shadow-md shadow-cyan-500/10"
                      >
                        <CartIcon size={14} />
                        {t('addToCartBtn')}
                      </button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </section>



      {/* Quick View Modal Dialog */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-purple-500/20 bg-slate-950 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
            <button 
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <CloseIcon size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-56 bg-slate-900 rounded-xl overflow-hidden">
                <img 
                  src={quickViewProduct.imageUrl || '/media/image1.jpeg'} 
                  alt={quickViewProduct.nameEn} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/media/image1.jpeg';
                  }}
                />
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold bg-purple-500/20 text-purple-400 rounded-md px-2 py-0.5 uppercase">
                    {quickViewProduct.condition}
                  </span>
                  <span className="text-[10px] font-bold bg-slate-900 text-slate-400 rounded-md px-2 py-0.5">
                    SKU: {quickViewProduct.sku}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white">
                  {isRtl ? quickViewProduct.nameAr : quickViewProduct.nameEn}
                </h2>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {isRtl ? quickViewProduct.descriptionAr : quickViewProduct.descriptionEn}
                </p>

                <div className="pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">{isRtl ? "السعر:" : "Price:"}</span>
                    <span className="text-xl font-black text-cyan-400">
                      {quickViewProduct.salePrice ?? quickViewProduct.sellingPrice} {t('currency')}
                    </span>
                  </div>

                  <button
                    disabled={quickViewProduct.stockQty === 0}
                    onClick={() => {
                      addToCart(quickViewProduct, 1);
                      setQuickViewProduct(null);
                    }}
                    className="rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-600 px-6 py-2.5 text-xs font-bold text-slate-950 cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-500/10"
                  >
                    <CartIcon size={14} />
                    {t('addToCartBtn')}
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

export default function Storefront() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400"></div>
      </div>
    }>
      <StorefrontContent />
    </Suspense>
  );
}
