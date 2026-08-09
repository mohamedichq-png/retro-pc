"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Product, ProductVariation } from '../../data/mockData';
import { 
  ControllerIcon, 
  CartIcon, 
  SearchIcon, 
  SparklesIcon, 
  CheckIcon, 
  HeartIcon, 
  CompareIcon,
  CloseIcon,
  FlameIcon,
  TagIcon
} from '../../components/Icons';
import { motion } from 'framer-motion';

const SUB_CATEGORIES = [
  { id: 'All', nameAr: 'جميع الأجهزة', nameEn: 'All Consoles', badge: 'ALL' },
  { id: 'Sony', nameAr: 'فئة سوني (Sony)', nameEn: 'Sony PlayStation', badge: 'SONY' },
  { id: 'Microsoft', nameAr: 'فئة مايكروسوفت (Microsoft)', nameEn: 'Microsoft Xbox', badge: 'XBOX' },
  { id: 'Nintendo', nameAr: 'فئة نينتندو (Nintendo)', nameEn: 'Nintendo Systems', badge: 'NIN' },
  { id: 'Sega', nameAr: 'فئة سيجا (Sega)', nameEn: 'Sega Classics', badge: 'SEGA' },
  { id: 'Retro Classics', nameAr: 'فئة الكلاسيكيات (Retro)', nameEn: 'Retro Arcade Classics', badge: 'RETRO' },
];

export default function ConsolesStorefront() {
  const { 
    isRtl, 
    t, 
    products, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    compareList, 
    toggleCompare 
  } = useApp();

  const [activeSubCat, setActiveSubCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);

  React.useEffect(() => {
    if (quickViewProduct?.variations && quickViewProduct.variations.length > 0) {
      setSelectedVariation(quickViewProduct.variations[0]);
    } else {
      setSelectedVariation(null);
    }
  }, [quickViewProduct]);

  // Filter consoles products
  const consoleProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status === 'draft') return false;
      const isConsoleCat = 
        p.category === 'Consoles & Accessories' || 
        p.category === 'PlayStation' || 
        p.category === 'Nintendo' || 
        p.category === 'Retro Consoles & Games';

      if (!isConsoleCat) return false;

      // Filter sub-category
      if (activeSubCat !== 'All') {
        if (activeSubCat === 'Sony') {
          if (p.brand !== 'Sony' && p.subCategory !== 'Sony') return false;
        } else if (activeSubCat === 'Microsoft') {
          if (p.brand !== 'Microsoft' && p.subCategory !== 'Microsoft') return false;
        } else if (activeSubCat === 'Nintendo') {
          if (p.brand !== 'Nintendo' && p.subCategory !== 'Nintendo') return false;
        } else if (activeSubCat === 'Sega') {
          if (p.brand !== 'Sega' && p.subCategory !== 'Sega') return false;
        } else if (activeSubCat === 'Retro Classics') {
          if (p.subCategory !== 'Retro Classics' && p.subCategory !== 'Panasonic' && p.brand !== 'SNK') return false;
        }
      }

      // Filter search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesEn = p.nameEn.toLowerCase().includes(query);
        const matchesAr = p.nameAr.includes(query);
        const matchesModel = p.model.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        if (!matchesEn && !matchesAr && !matchesModel && !matchesSku) return false;
      }

      return true;
    });
  }, [products, activeSubCat, searchQuery]);

  // Sorted console products
  const sortedConsoleProducts = useMemo(() => {
    const list = [...consoleProducts];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.salePrice ?? a.sellingPrice) - (b.salePrice ?? b.sellingPrice));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.salePrice ?? b.sellingPrice) - (a.salePrice ?? a.sellingPrice));
    }
    return list;
  }, [consoleProducts, sortBy]);

  return (
    <div className="min-h-screen flex-1 bg-slate-950 pb-20 text-slate-100">
      
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-purple-500/20 bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute top-1/2 left-1/4 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-purple-600/15 blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-pink-500/15 blur-[140px] pointer-events-none"></div>
        
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="space-y-3 text-center md:text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/40 px-4 py-1 text-xs font-bold text-purple-300 uppercase tracking-wider">
                <ControllerIcon size={16} className="text-pink-400 animate-pulse" />
                {isRtl ? "متجر ريترو لأجهزة الألعاب" : "RETRO Gaming Consoles Hub"}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                {isRtl ? "قسم أجهزة وملحقات الألعاب" : "Gaming Consoles & Gear"}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
                {isRtl 
                  ? "تصفح واقتنِ أحدث وأندر أجهزة الألعاب المحمولة والمنزلية من Sony, Microsoft, Nintendo, Sega والكلاسيكيات مع الضمان الكامل."
                  : "Explore official gaming consoles, handheld systems, pro controllers & retro classics from Sony, Microsoft, Nintendo & Sega."}
              </p>
            </div>

            {/* Quick Stats Badge */}
            <div className="flex items-center gap-4 rounded-2xl border border-purple-500/30 bg-slate-900/60 p-4 backdrop-blur-xl">
              <div className="text-center px-3 border-r border-slate-800">
                <span className="text-2xl font-black text-purple-400 block">{sortedConsoleProducts.length}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">{isRtl ? "جهاز متوفر" : "Available"}</span>
              </div>
              <div className="text-center px-3">
                <span className="text-2xl font-black text-pink-400 block">5</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">{isRtl ? "فئات عالمية" : "Sub-Categories"}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Sub-category Filters Panel */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Search Box */}
          <div className="rounded-2xl border border-purple-500/20 bg-slate-900/40 p-5 backdrop-blur-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
              {isRtl ? "ابحث عن جهاز أو يد تحكم" : "Search Console / Controller"}
            </h3>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRtl ? "ابحث باسم الجهاز (PS5, Switch...)" : "Search console name..."}
                className="w-full rounded-xl bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-slate-100 border border-slate-800 focus:outline-none focus:border-purple-400"
              />
              <SearchIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            </div>
          </div>

          {/* Sub Categories Navigation Sidebar */}
          <div className="rounded-2xl border border-purple-500/20 bg-slate-900/40 p-5 backdrop-blur-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
              {isRtl ? "الفئات والمصنعين (Sub-Categories)" : "Filter by Sub-Category"}
            </h3>
            <div className="flex flex-col gap-1.5">
              {SUB_CATEGORIES.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubCat(sub.id)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    activeSubCat === sub.id
                      ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white border-r-4 border-pink-500 shadow-md shadow-purple-600/20'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] rounded bg-purple-500/20 text-purple-300 font-extrabold px-1.5 py-0.5">
                      {sub.badge}
                    </span>
                    <span>{isRtl ? sub.nameAr : sub.nameEn}</span>
                  </div>
                  {activeSubCat === sub.id && <CheckIcon size={14} className="text-pink-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="rounded-2xl border border-purple-500/20 bg-slate-900/40 p-5 backdrop-blur-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
              {isRtl ? "ترتيب حسب" : "Sort By"}
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-xl bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none focus:border-purple-400"
            >
              <option value="featured">{isRtl ? "الأكثر تميزاً" : "Featured"}</option>
              <option value="price-asc">{isRtl ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
              <option value="price-desc">{isRtl ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
            </select>
          </div>

        </div>

        {/* Right Side: Responsive Console Products Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-extrabold text-white tracking-wide">
              {activeSubCat === 'All' 
                ? (isRtl ? 'جميع أجهزة الكونسول والملحقات' : 'All Consoles & Accessories') 
                : (isRtl ? `منتجات ${activeSubCat}` : `${activeSubCat} Products`)} ({sortedConsoleProducts.length})
            </h2>
          </div>

          {sortedConsoleProducts.length === 0 ? (
            <div className="text-center py-16 space-y-4 rounded-3xl border border-slate-800 bg-slate-900/30">
              <ControllerIcon size={48} className="mx-auto text-slate-600" />
              <h3 className="text-base font-bold text-slate-300">
                {isRtl ? "لم يتم العثور على أجهزة مطابقة للفلتر" : "No Consoles Found"}
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedConsoleProducts.map((product) => {
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
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-purple-500/20 bg-slate-900/60 p-5 backdrop-blur-xl hover:border-purple-400/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                  >
                    {/* Top Glow Accent */}
                    <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-purple-600/10 blur-2xl group-hover:bg-purple-600/25 transition-all pointer-events-none"></div>

                    {/* Condition & Stock Badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                      <span className="rounded-md bg-purple-950/80 border border-purple-500/30 px-2.5 py-1 text-[10px] font-bold text-purple-300 backdrop-blur-sm uppercase">
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
                      ) : (
                        <span className="rounded-md bg-emerald-600/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                          {isRtl ? "متوفر" : "In Stock"}
                        </span>
                      )}
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
                            ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' 
                            : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-purple-400'
                        }`}
                      >
                        <CompareIcon size={14} />
                      </button>
                    </div>

                    {/* Transparent Styling Floating Product Image */}
                    <div 
                      onClick={() => setQuickViewProduct(product)}
                      className="relative h-44 bg-slate-950/80 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center p-3 mt-6 group-hover:scale-[1.02] transition-transform duration-300 border border-slate-800/80"
                    >
                      <img 
                        src={product.imageUrl} 
                        alt={product.nameEn}
                        className="h-full w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                      />
                    </div>

                    {/* Card Content & Details */}
                    <div className="pt-4 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                            {product.brand}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {product.subCategory || 'Consoles'}
                          </span>
                        </div>
                        
                        <h3 
                          onClick={() => setQuickViewProduct(product)}
                          className="text-sm font-extrabold text-white line-clamp-1 hover:text-purple-300 cursor-pointer"
                        >
                          {product.nameEn}
                        </h3>

                        <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {isRtl ? product.descriptionAr : product.descriptionEn}
                        </p>
                      </div>

                      {/* Card Footer: Price & Add to Cart Button */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          {hasDiscount && (
                            <span className="text-[10px] text-slate-500 line-through">
                              {product.sellingPrice} {t('currency')}
                            </span>
                          )}
                          <span className="text-base font-black text-purple-300">
                            {price} {t('currency')}
                          </span>
                        </div>

                        {/* Add to Cart button matching Shop Games gradient */}
                        <button
                          disabled={product.stockQty === 0}
                          onClick={() => addToCart(product, 1)}
                          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:bg-slate-800 disabled:text-slate-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/30 transition-all duration-300 cursor-pointer"
                        >
                          <CartIcon size={14} />
                          <span>Add to Cart</span>
                        </button>
                      </div>

                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-purple-500/30 bg-slate-950 p-6 md:p-8 shadow-2xl">
            <button 
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <CloseIcon size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-56 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center p-3 border border-slate-800">
                <img 
                  src={selectedVariation?.imageUrl || quickViewProduct.imageUrl} 
                  alt={quickViewProduct.nameEn} 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 rounded-md px-2.5 py-0.5 uppercase">
                    {selectedVariation ? selectedVariation.condition : quickViewProduct.condition}
                  </span>
                  <span className="text-[10px] font-bold bg-slate-900 text-slate-400 rounded-md px-2.5 py-0.5">
                    SKU: {selectedVariation ? selectedVariation.sku : quickViewProduct.sku}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white">
                  {quickViewProduct.nameEn} {selectedVariation && `- ${selectedVariation.edition}`}
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {isRtl ? quickViewProduct.descriptionAr : quickViewProduct.descriptionEn}
                </p>

                {/* Variations Selector */}
                {quickViewProduct.variations && quickViewProduct.variations.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-bold">{isRtl ? "اختر النسخة والحالة:" : "Select Edition & Condition:"}</label>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.variations.map((v) => (
                        <button
                          key={v.sku}
                          onClick={() => setSelectedVariation(v)}
                          className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                            selectedVariation?.sku === v.sku
                              ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-purple-500/50 hover:text-slate-200'
                          }`}
                        >
                          {v.edition} - {v.condition}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-2xl font-black text-purple-300">
                    {selectedVariation ? (selectedVariation.salePrice ?? selectedVariation.sellingPrice) : (quickViewProduct.salePrice ?? quickViewProduct.sellingPrice)} {t('currency')}
                  </span>
                  
                  {/* Stock Indicator */}
                  {(selectedVariation ? selectedVariation.stockQty : quickViewProduct.stockQty) === 0 ? (
                    <span className="text-xs font-bold text-pink-500">{t('outOfStock')}</span>
                  ) : (selectedVariation ? selectedVariation.stockQty : quickViewProduct.stockQty) < 3 ? (
                    <span className="text-xs font-bold text-yellow-500">Only {(selectedVariation ? selectedVariation.stockQty : quickViewProduct.stockQty)} left!</span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-400">In Stock</span>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    disabled={(selectedVariation ? selectedVariation.stockQty : quickViewProduct.stockQty) === 0}
                    onClick={() => {
                      addToCart(quickViewProduct, 1, selectedVariation || undefined);
                      setQuickViewProduct(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CartIcon size={16} />
                    <span>Add to Cart</span>
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
