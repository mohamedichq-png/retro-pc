"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { 
  ControllerIcon, 
  CartIcon, 
  UserIcon, 
  MenuIcon, 
  CloseIcon, 
  SearchIcon,
  PlusIcon,
  SparklesIcon,
  GamingPcIcon,
  CpuIcon,
  MonitorIcon,
  RepairIcon
} from './Icons';
import QuickAddProductModal from './QuickAddProductModal';

export default function Navbar() {
  const { language, setLanguage, t, isRtl, cart, activeCashier } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  React.useEffect(() => {
    const token = sessionStorage.getItem('retro_admin_auth');
    setIsAdmin(token === 'authenticated');
  }, [pathname]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const categoriesList = [
    { id: 'All', nameAr: 'جميع الأقسام', nameEn: 'All Categories', href: '/?cat=All#store-catalog' },
    { id: 'Gaming PCs', nameAr: 'حواسيب قيمنق', nameEn: 'Gaming PCs', href: '/?cat=Gaming%20PCs#store-catalog' },
    { id: 'PC Components', nameAr: 'قطع الغيار والتجميع', nameEn: 'PC Components', href: '/?cat=PC%20Components#store-catalog' },
    { id: 'Monitors', nameAr: 'الشاشات', nameEn: 'Monitors', href: '/?cat=Monitors#store-catalog' },
    { id: 'Retro Consoles', nameAr: 'أجهزة الكونسول والألعاب', nameEn: 'Consoles & Games Store', href: '/consoles' },
    { id: 'Accessories', nameAr: 'الملحقات والأصوات', nameEn: 'Accessories', href: '/accessories' },
  ];

  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname !== '/') {
      router.push(`/?search=${encodeURIComponent(headerSearch)}#store-catalog`);
    } else {
      const catalogEl = document.getElementById('store-catalog');
      catalogEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-purple-500/20 bg-slate-950/90 backdrop-blur-xl">
        
        {/* Main Header Bar */}
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            {language === 'ar' ? (
              <img 
                src="/logo-ar.png" 
                alt="رترو بي سي للكمبيوتر" 
                className="h-14 w-auto max-w-[180px] object-contain transition-all duration-300 group-hover:scale-105" 
              />
            ) : (
              <img 
                src="/logo-en.png" 
                alt="Retro For Toys Trading and Repair" 
                className="h-14 w-auto max-w-[180px] object-contain transition-all duration-300 group-hover:scale-105" 
              />
            )}
          </Link>

          {/* Wide Centered Smart Search Bar (Abbasma.com Style UX) */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-xl relative"
          >
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder={isRtl ? "ابحث عن حاسوب، كرت شاشة RTX، أجهزة كونسول، قطع..." : "Search Gaming PCs, RTX GPUs, Consoles, Parts..."}
              className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 py-2.5 pl-11 pr-4 text-xs font-medium text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
            />
            <SearchIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            {headerSearch && (
              <button
                type="button"
                onClick={() => setHeaderSearch('')}
                className="absolute right-3 top-3 text-slate-500 hover:text-white"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </form>

          {/* Header Action Controls */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Manage Products Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:scale-105 hover:shadow-purple-500/40 transition-all duration-300 cursor-pointer"
                title={isRtl ? "لوحة إدارة المنتجات والمخزون" : "Manage Products"}
              >
                <PlusIcon size={16} />
                <span>{isRtl ? "إدارة المنتجات" : "Manage Products"}</span>
              </Link>
            )}

            {/* Active Cashier Status */}
            {activeCashier && (
              <div className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-950/40 px-3 py-2 text-xs font-semibold text-purple-300">
                <UserIcon size={14} className="text-purple-400" />
                <span>{isRtl ? activeCashier.nameAr : activeCashier.nameEn}</span>
              </div>
            )}

            {/* Navigation Shortcuts */}
            <Link
              href="/pc-builder"
              className="text-xs font-bold text-slate-300 hover:text-cyan-400 transition-colors px-2 py-1"
            >
              {t('pcBuilder')}
            </Link>
            <Link
              href="/repair"
              className="text-xs font-bold text-slate-300 hover:text-purple-400 transition-colors px-2 py-1"
            >
              {t('repairCenter')}
            </Link>


            {/* Cart Icon Link */}
            <a
              href="/#store-catalog"
              className="relative rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/40 transition-all cursor-pointer"
            >
              <CartIcon size={18} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-md shadow-pink-500/30 animate-bounce">
                  {cartItemsCount}
                </span>
              )}
            </a>

            {/* Language Switch */}
            <button 
              onClick={toggleLanguage}
              className="rounded-xl border border-cyan-500/30 bg-slate-900/60 px-3 py-2 text-xs font-bold text-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer"
            >
              {t('languageLabel')}
            </button>
          </div>

          {/* Mobile Actions Header */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Manage Products Link on Mobile Header */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-lg bg-cyan-500 text-slate-950 px-2.5 py-1.5 text-xs font-bold shadow-md shadow-cyan-500/20"
              >
                <PlusIcon size={14} />
                <span>{isRtl ? "الإدارة" : "Admin"}</span>
              </Link>
            )}

            <button 
              onClick={toggleLanguage}
              className="rounded-lg border border-cyan-500/30 bg-slate-900/40 px-2 py-1 text-xs font-bold text-cyan-400"
            >
              {t('languageLabel')}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-cyan-400 p-1"
            >
              {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>

        </div>

        {/* Sub Navigation / Mega Menu Bar (Categories) */}
        <div className="hidden md:block border-t border-slate-900 bg-slate-950/60 py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-6 text-xs font-bold">
              {categoriesList.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className="whitespace-nowrap text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                  <span>{isRtl ? cat.nameAr : cat.nameEn}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-purple-400">
              <span className="inline-flex items-center gap-1">
                <SparklesIcon size={14} className="animate-pulse" />
                {isRtl ? "شحن مجاني للطلبات أكثر من 500 ر.ق" : "Free Qatar Shipping over 500 QAR"}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-purple-500/20 bg-slate-950 px-4 py-6 space-y-4 animate-in slide-in-from-top-4">
            
            {/* Search input in mobile drawer */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder={isRtl ? "ابحث عن منتج..." : "Search product..."}
                className="w-full rounded-xl bg-slate-900 py-2.5 pl-10 pr-4 text-xs text-slate-100 border border-slate-800"
              />
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            </form>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 px-1">
                {isRtl ? "الصفحات الرئيسية" : "Main Navigation"}
              </span>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold py-2 px-2 text-slate-200 border-b border-slate-900"
              >
                {t('home')}
              </Link>
              <Link
                href="/pc-builder"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold py-2 px-2 text-slate-200 border-b border-slate-900"
              >
                {t('pcBuilder')}
              </Link>
              <Link
                href="/repair"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold py-2 px-2 text-slate-200 border-b border-slate-900"
              >
                {t('repairCenter')}
              </Link>


            </div>

            {isAdmin && (
              <div className="pt-2">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 text-xs font-bold text-white shadow-lg text-center"
                >
                  <PlusIcon size={16} />
                  <span>{isRtl ? "لوحة إدارة المنتجات" : "Product Management Desk"}</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Sticky Bottom Navigation Bar for Mobile (UX Ergonomics) */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-purple-500/20 bg-slate-950/95 backdrop-blur-lg px-4 py-2 flex items-center justify-around">
        <Link href="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400">
          <ControllerIcon size={20} />
          <span className="text-[10px] font-semibold">{t('home')}</span>
        </Link>

        <a href="/#store-catalog" className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400">
          <SearchIcon size={20} />
          <span className="text-[10px] font-semibold">{t('shop')}</span>
        </a>

        {/* Floating Center Admin Dashboard Link */}
        {isAdmin && (
          <Link
            href="/admin"
            className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/40 border-2 border-slate-950 animate-pulse cursor-pointer"
            title={isRtl ? "إدارة المنتجات" : "Manage Products"}
          >
            <PlusIcon size={24} />
          </Link>
        )}

        <Link href="/repair" className="flex flex-col items-center gap-1 text-slate-400 hover:text-purple-400">
          <RepairIcon size={20} />
          <span className="text-[10px] font-semibold">{t('repairCenter')}</span>
        </Link>


      </div>

      {/* Admin Quick Add Product Modal */}
      <QuickAddProductModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
      />
    </>
  );
}
