"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Product } from '@/data/mockData';
import { 
  SearchIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckIcon, 
  CloseIcon, 
  EditIcon, 
  EyeIcon, 
  EyeOffIcon,
  UploadIcon,
  SparklesIcon,
  ShieldAlertIcon
} from '@/components/Icons';
import QuickAddProductModal from '@/components/QuickAddProductModal';
import { useOffersStore } from '@/stores/useOffersStore';


const SAMPLE_IMAGES = [
  { label: 'Gaming PC Tower', url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80' },
  { label: 'RTX GPU', url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80' },
  { label: 'Curved Gaming Monitor', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80' },
  { label: 'Pro Gaming Headset', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80' },
  { label: 'RGB Gaming Keyboard', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80' },
  { label: 'Game Console Controller', url: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80' },
];

export default function AdminDashboard() {
  const { 
    language, 
    isRtl, 
    products, 
    updateProduct, 
    deleteProduct, 
    addProduct, 
    loading,
    t 
  } = useApp();

  // Authentication Gate States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard Filters States
  const [activeTab, setActiveTab] = useState<'published' | 'draft' | 'banners'>('published');
  const [searchQuery, setSearchQuery] = useState('');

  // Slides list & creators from offers store
  const slides = useOffersStore((s) => s.slides);
  const addSlide = useOffersStore((s) => s.addSlide);
  const removeSlide = useOffersStore((s) => s.removeSlide);
  const { 
    weeklyOffersActive, 
    weeklyOfferProductId, 
    weeklyOfferPromoPrice, 
    weeklyOfferEndDate,
    setWeeklyOfferData 
  } = useOffersStore();

  // Local form states for Weekly Offer
  const [promoActive, setPromoActive] = useState(weeklyOffersActive);
  const [promoProductId, setPromoProductId] = useState(weeklyOfferProductId);
  const [promoPrice, setPromoPrice] = useState<number | ''>(weeklyOfferPromoPrice);
  const [promoEndDate, setPromoEndDate] = useState(() => {
    if (!weeklyOfferEndDate) return '';
    try {
      const date = new Date(weeklyOfferEndDate);
      const tzOffset = date.getTimezoneOffset() * 60000;
      return (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
    } catch {
      return '';
    }
  });

  const handleWeeklyOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoProductId || !promoPrice) return;

    setWeeklyOfferData({
      active: promoActive,
      productId: promoProductId,
      promoPrice: Number(promoPrice),
      endDate: new Date(promoEndDate).toISOString(),
    });

    alert(isRtl ? 'تم تحديث عروض الأسبوع بنجاح!' : 'Weekly offer settings updated successfully!');
  };

  // New slide form states
  const [newSlideTagEn, setNewSlideTagEn] = useState('');
  const [newSlideTagAr, setNewSlideTagAr] = useState('');
  const [newSlideTitleEn, setNewSlideTitleEn] = useState('');
  const [newSlideTitleAr, setNewSlideTitleAr] = useState('');
  const [newSlideSubtitleEn, setNewSlideSubtitleEn] = useState('');
  const [newSlideSubtitleAr, setNewSlideSubtitleAr] = useState('');
  const [newSlideCtaEn, setNewSlideCtaEn] = useState('');
  const [newSlideCtaAr, setNewSlideCtaAr] = useState('');
  const [newSlideCtaLink, setNewSlideCtaLink] = useState('/products');
  const [newSlideColor, setNewSlideColor] = useState<'cyan' | 'purple' | 'pink'>('cyan');

  const handleAddSlideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlideTitleEn || !newSlideTitleAr) return;

    const gradients = {
      cyan: 'from-retro-cyan-dim/50 via-retro-bg-secondary to-retro-bg',
      purple: 'from-retro-purple-dim/50 via-retro-bg-secondary to-retro-bg',
      pink: 'from-retro-pink/10 via-retro-bg-secondary to-retro-bg',
    };

    const newSlide = {
      key: `slide-${Date.now()}`,
      tagEn: newSlideTagEn || 'PROMO',
      tagAr: newSlideTagAr || 'عرض مميز',
      titleEn: newSlideTitleEn,
      titleAr: newSlideTitleAr,
      subtitleEn: newSlideSubtitleEn,
      subtitleAr: newSlideSubtitleAr,
      ctaEn: newSlideCtaEn || 'Shop Now',
      ctaAr: newSlideCtaAr || 'تسوق الآن',
      ctaLink: newSlideCtaLink,
      gradient: gradients[newSlideColor],
      glowColor: newSlideColor,
    };

    addSlide(newSlide);
    setNewSlideTagEn('');
    setNewSlideTagAr('');
    setNewSlideTitleEn('');
    setNewSlideTitleAr('');
    setNewSlideSubtitleEn('');
    setNewSlideSubtitleAr('');
    setNewSlideCtaEn('');
    setNewSlideCtaAr('');
    setNewSlideCtaLink('/products');
    setNewSlideColor('cyan');
    
    alert(isRtl ? 'تمت إضافة العرض بنجاح للواجهة الرئيسية!' : 'Offer banner successfully added to the homepage!');
  };
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modals / Editors state
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Edit form states
  const [editNameAr, setEditNameAr] = useState('');
  const [editNameEn, setEditNameEn] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editSellingPrice, setEditSellingPrice] = useState<number | ''>('');
  const [editSalePrice, setEditSalePrice] = useState<number | ''>('');
  const [editStockQty, setEditStockQty] = useState<number | ''>('');
  const [editLowStockThreshold, setEditLowStockThreshold] = useState<number>(3);
  const [editCondition, setEditCondition] = useState<'NEW' | 'USED' | 'REFURBISHED' | 'OPEN BOX' | 'PRE-OWNED' | 'New' | 'Refurbished' | 'Used'>('NEW');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editDescriptionAr, setEditDescriptionAr] = useState('');
  const [editDescriptionEn, setEditDescriptionEn] = useState('');
  const [editStatus, setEditStatus] = useState<'published' | 'draft'>('published');

  // Upgraded Fields States
  const [editProductType, setEditProductType] = useState<'PHYSICAL PRODUCT' | 'DIGITAL PRODUCT' | 'SERVICE' | 'CUSTOM PC' | 'PRE-BUILT PC' | 'USED / PRE-OWNED' | 'RETRO PRODUCT'>('PHYSICAL PRODUCT');
  const [editPrimaryCategory, setEditPrimaryCategory] = useState('Gaming');
  const [editSecondaryCategory, setEditSecondaryCategory] = useState('');
  const [editPlatform, setEditPlatform] = useState('');
  const [editGeneration, setEditGeneration] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editCollections, setEditCollections] = useState('');
  const [editWarranty, setEditWarranty] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editDimensions, setEditDimensions] = useState('');
  const [editStockStatus, setEditStockStatus] = useState<'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK' | 'PRE-ORDER'>('IN STOCK');
  const [editGalleryUrls, setEditGalleryUrls] = useState<string[]>([]);
  const [editSpecs, setEditSpecs] = useState<Record<string, any>>({});
  
  // UI Tabs inside Editor Modal
  const [editModalTab, setEditModalTab] = useState<'general' | 'category' | 'pricing' | 'specs'>('general');
  const [suggestedPrimaryCategory, setSuggestedPrimaryCategory] = useState('');

  // Smart suggestions on product name change
  useEffect(() => {
    if (!editNameEn && !editNameAr) {
      setSuggestedPrimaryCategory('');
      return;
    }
    const textScan = (editNameEn + ' ' + editNameAr).toLowerCase();
    if (
      textScan.includes('rtx') || textScan.includes('geforce') || textScan.includes('radeon') ||
      textScan.includes('ryzen') || textScan.includes('core i') || textScan.includes('ddr5') ||
      textScan.includes('ddr4') || textScan.includes('nvme') || textScan.includes('ssd') ||
      textScan.includes('motherboard') || textScan.includes('psu') || textScan.includes('cooler') ||
      textScan.includes('chassis')
    ) {
      setSuggestedPrimaryCategory('PC');
    } else if (
      textScan.includes('ps1') || textScan.includes('ps2') || textScan.includes('ps3') ||
      textScan.includes('playstation') || textScan.includes('game boy') || textScan.includes('sega') ||
      textScan.includes('atari') || textScan.includes('gamecube') || textScan.includes('n64') ||
      textScan.includes('nes') || textScan.includes('snes') || textScan.includes('dreamcast')
    ) {
      setSuggestedPrimaryCategory('Retro Gaming');
    } else if (textScan.includes('monitor') || textScan.includes('screen')) {
      setSuggestedPrimaryCategory('Monitors');
    } else if (textScan.includes('laptop') || textScan.includes('notebook')) {
      setSuggestedPrimaryCategory('Laptops');
    } else if (textScan.includes('repair') || textScan.includes('service') || textScan.includes('fix')) {
      setSuggestedPrimaryCategory('Repair Hub');
    } else {
      setSuggestedPrimaryCategory('');
    }
  }, [editNameEn, editNameAr]);

  // Verify authentication on component mount
  useEffect(() => {
    const token = sessionStorage.getItem('retro_admin_auth');
    if (token === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Retro2026!') {
      setIsAuthenticated(true);
      sessionStorage.setItem('retro_admin_auth', 'authenticated');
      setAuthError('');
    } else {
      setAuthError(isRtl ? 'كلمة المرور غير صحيحة!' : 'Incorrect password!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('retro_admin_auth');
    setPasswordInput('');
  };

  // Categories list
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products by tab, search query, and category
  const filteredProducts = products.filter(p => {
    const status = p.status || 'published';
    if (status !== activeTab) return false;

    const matchesSearch = 
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameAr.includes(searchQuery) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setEditNameAr(product.nameAr);
    setEditNameEn(product.nameEn);
    setEditCategory(product.category);
    setEditBrand(product.brand);
    setEditSellingPrice(product.sellingPrice);
    setEditSalePrice(product.salePrice ?? '');
    setEditStockQty(product.stockQty);
    setEditLowStockThreshold(product.lowStockThreshold);
    setEditCondition(product.condition);
    setEditImageUrl(product.imageUrl);
    setEditDescriptionAr(product.descriptionAr ?? '');
    setEditDescriptionEn(product.descriptionEn ?? '');
    setEditStatus(product.status || 'published');
    
    // Set upgraded values
    setEditProductType(product.productType || 'PHYSICAL PRODUCT');
    setEditPrimaryCategory(product.primaryCategory || product.category || 'Gaming');
    setEditSecondaryCategory(product.secondaryCategory || '');
    setEditPlatform(product.platform || product.specs?.platform || '');
    setEditGeneration(product.generation || product.specs?.generation || '');
    setEditTags(product.tags ? product.tags.join(', ') : '');
    setEditCollections(product.collections ? product.collections.join(', ') : '');
    setEditWarranty(product.warranty || product.specs?.warranty || '');
    setEditWeight(product.weight || '');
    setEditDimensions(product.dimensions || '');
    setEditStockStatus(product.stockStatus || (product.stockQty > 0 ? 'IN STOCK' : 'OUT OF STOCK'));
    setEditGalleryUrls(product.galleryUrls || []);
    setEditSpecs(product.specs || {});
    setEditModalTab('general');
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updates: Partial<Product> = {
      nameAr: editNameAr,
      nameEn: editNameEn,
      model: editNameEn || editNameAr,
      category: editCategory,
      brand: editBrand,
      sellingPrice: Number(editSellingPrice),
      salePrice: editSalePrice ? Number(editSalePrice) : undefined,
      stockQty: Number(editStockQty),
      lowStockThreshold: editLowStockThreshold,
      condition: editCondition as any,
      imageUrl: editImageUrl,
      descriptionAr: editDescriptionAr,
      descriptionEn: editDescriptionEn,
      status: editStatus,
      
      // Upgraded Catalog Metadata
      productType: editProductType,
      primaryCategory: editPrimaryCategory,
      secondaryCategory: editSecondaryCategory,
      categories: [editPrimaryCategory, ...(editSecondaryCategory ? [editSecondaryCategory] : [])],
      platform: editPlatform || undefined,
      generation: editGeneration || undefined,
      tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
      collections: editCollections.split(',').map(c => c.trim()).filter(Boolean),
      warranty: editWarranty || undefined,
      weight: editWeight || undefined,
      dimensions: editDimensions || undefined,
      stockStatus: editStockStatus,
      galleryUrls: editGalleryUrls,
      specs: {
        ...editSpecs,
        'Condition': editCondition,
        platform: editPlatform || undefined,
        generation: editGeneration || undefined,
        warranty: editWarranty || undefined,
      }
    };

    updateProduct(editingProduct.id, updates);
    setEditingProduct(null);
  };

  const handleToggleStatus = (product: Product) => {
    const currentStatus = product.status || 'published';
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    updateProduct(product.id, { status: nextStatus });
  };

  const handleDelete = (productId: string) => {
    const confirmMsg = isRtl 
      ? 'هل أنت متأكد من حذف هذا المنتج نهائياً من النظام؟'
      : 'Are you sure you want to delete this product permanently?';
    if (window.confirm(confirmMsg)) {
      deleteProduct(productId);
    }
  };

  // 1. Password Login Gate UI
  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-slate-950 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-600/10 blur-3xl"></div>

          <div className="text-center space-y-4 relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 shadow-inner">
              <ShieldAlertIcon size={32} className="animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-white tracking-wide">
                {isRtl ? "قسم الإدارة والتحكم" : "Admin Security Gate"}
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {isRtl 
                  ? "يرجى إدخال كلمة مرور المدير للوصول إلى لوحة تعديل المنتجات والمخزون."
                  : "Please enter the admin password to access product editor dashboard."}
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <input
                  type="password"
                  required
                  placeholder={isRtl ? "كلمة المرور" : "Password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 px-4 py-3 text-xs text-slate-100 border border-slate-800 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-center tracking-widest font-mono"
                />
              </div>

              {authError && (
                <p className="text-[10px] text-pink-500 font-bold animate-shake">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 text-xs font-bold text-white shadow-lg cursor-pointer hover:shadow-cyan-500/20 active:scale-[0.98] transition-all"
              >
                {isRtl ? "تأكيد الدخول" : "Unlock Console"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 2. Main Admin Dashboard Panel UI
  return (
    <div className="flex-1 bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-300">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-900 pb-6 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-4 py-1 text-xs font-bold text-cyan-400 uppercase">
              <SparklesIcon size={14} className="animate-pulse" />
              <span>{isRtl ? "لوحة الإدارة والمخزون" : "System Control Desk"}</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              {isRtl ? "إدارة منتجات الموقع" : "Product Management Board"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              {isRtl 
                ? "تعديل، نشر، أو أرشفة المنتجات الحالية والمسودات ومزامنتها مع السحابة." 
                : "Manage, publish, draft or archive items, sync changes to cloud database."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              {isRtl ? "خروج" : "Lock Session"}
            </button>

            <button
              onClick={() => setQuickAddOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <PlusIcon size={16} />
              <span>{isRtl ? "إضافة منتج" : "Add Product"}</span>
            </button>
          </div>
        </div>

        {/* Filters & Tabs Section */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          {/* Tabs switcher: Live vs Drafts */}
          <div className="flex rounded-xl bg-slate-900/60 p-1 border border-slate-800 shrink-0 overflow-x-auto max-w-full scrollbar-none">
            <button
              onClick={() => setActiveTab('published')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'published'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <EyeIcon size={16} />
              <span>{isRtl ? "المنتجات المنزلة (Live)" : "Published Products"}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                activeTab === 'published' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {products.filter(p => (p.status || 'published') === 'published').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('draft')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'draft'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <EyeOffIcon size={16} />
              <span>{isRtl ? "المنتجات قيد التنزيل (Drafts)" : "Drafts / Planned"}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                activeTab === 'draft' ? 'bg-slate-950/30 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {products.filter(p => p.status === 'draft').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'banners'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📢</span>
              <span>{isRtl ? "إدارة العروض والبنرات" : "Offers & Banners"}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                activeTab === 'banners' ? 'bg-slate-950/25 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {slides.length}
              </span>
            </button>
          </div>

          {/* Search and Category filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-2xl">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={isRtl ? "ابحث بالاسم أو SKU..." : "Search name or SKU..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-slate-900 py-2.5 pl-10 pr-4 text-xs text-slate-100 border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              <SearchIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none focus:border-cyan-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? (isRtl ? 'كل الفئات' : 'All Categories') : cat}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Loading Skeletons vs Data Table vs Banners Panel */}
        {activeTab === 'banners' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Slide List */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                {isRtl ? "البنرات التفاعلية النشطة حالياً" : "Active Hero Banner Offers"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slides.map((s) => (
                  <div key={s.key} className="relative rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
                    <button
                      onClick={() => removeSlide(s.key)}
                      className="absolute top-4 right-4 text-pink-500 hover:text-pink-400 border border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10 rounded-lg p-1.5 cursor-pointer text-xs font-bold"
                    >
                      {isRtl ? "حذف" : "Remove"}
                    </button>
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-950 text-[9px] font-bold text-cyan-400 uppercase border border-slate-850">
                        {isRtl ? s.tagAr : s.tagEn}
                      </span>
                      <h4 className="font-extrabold text-white text-sm mt-1">{isRtl ? s.titleAr : s.titleEn}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{isRtl ? s.subtitleAr : s.subtitleEn}</p>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      CTA Link: <span className="text-slate-300">{s.ctaLink}</span> | Theme: <span className="text-slate-300 uppercase">{s.glowColor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Slide Form */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6 md:p-8 space-y-6">
              <div className="border-b border-slate-800/80 pb-4">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Owner Portal</span>
                <h3 className="text-lg font-black text-white">{isRtl ? "إضافة عرض / بنر ترويجي جديد" : "Add New Homepage Promo Banner"}</h3>
              </div>

              <form onSubmit={handleAddSlideSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tag En / Ar */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Badge Label (EN)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MEGA DEAL"
                      value={newSlideTagEn}
                      onChange={(e) => setNewSlideTagEn(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">ملصق العرض (AR)</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: عرض محدود"
                      value={newSlideTagAr}
                      onChange={(e) => setNewSlideTagAr(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Title En / Ar */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Banner Title (EN)</label>
                    <input
                      type="text"
                      required
                      placeholder="Title of the promotion"
                      value={newSlideTitleEn}
                      onChange={(e) => setNewSlideTitleEn(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">عنوان البنر (AR)</label>
                    <input
                      type="text"
                      required
                      placeholder="عنوان العرض الترويجي"
                      value={newSlideTitleAr}
                      onChange={(e) => setNewSlideTitleAr(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Subtitle En / Ar */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Description (EN)</label>
                    <input
                      type="text"
                      required
                      placeholder="Brief details about the deal"
                      value={newSlideSubtitleEn}
                      onChange={(e) => setNewSlideSubtitleEn(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">وصف العرض (AR)</label>
                    <input
                      type="text"
                      required
                      placeholder="تفاصيل العرض الترويجي باختصار"
                      value={newSlideSubtitleAr}
                      onChange={(e) => setNewSlideSubtitleAr(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* CTA Text En / Ar */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Button CTA Text (EN)</label>
                    <input
                      type="text"
                      placeholder="e.g. Shop Now"
                      value={newSlideCtaEn}
                      onChange={(e) => setNewSlideCtaEn(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">نص زر الانتقال (AR)</label>
                    <input
                      type="text"
                      placeholder="مثال: تسوق الآن"
                      value={newSlideCtaAr}
                      onChange={(e) => setNewSlideCtaAr(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* CTA Link & Color Theme */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">CTA Link Path</label>
                    <input
                      type="text"
                      required
                      value={newSlideCtaLink}
                      onChange={(e) => setNewSlideCtaLink(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Theme Color</label>
                    <select
                      value={newSlideColor}
                      onChange={(e) => setNewSlideColor(e.target.value as any)}
                      className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="cyan">Cyan / Blue</option>
                      <option value="purple">Purple / Violet</option>
                      <option value="pink">Pink / Magenta</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-2.5 text-xs font-bold text-slate-950 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <PlusIcon size={16} />
                    <span>{isRtl ? "إضافة البنر للموقع" : "Add Banner to Homepage"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Weekly Offer Configuration */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6 md:p-8 space-y-6">
              <div className="border-b border-slate-800/80 pb-4">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">CMS System</span>
                <h3 className="text-lg font-black text-white">{isRtl ? "إدارة قسم عروض الأسبوع (عروض الأسبوع)" : "Weekly Promotion Settings"}</h3>
              </div>

              <form onSubmit={handleWeeklyOfferSubmit} className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={promoActive} 
                      onChange={(e) => setPromoActive(e.target.checked)} 
                    />
                    <div className="w-11 h-6 bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-slate-950"></div>
                    <span className="ltr:ml-3 rtl:mr-3 text-xs font-bold text-slate-300">
                      {isRtl ? "تفعيل قسم العروض على الرئيسية" : "Enable Weekly Promotion Section"}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Select Product */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? "اختر منتجاً" : "Feature Product"}</label>
                    <select
                      value={promoProductId}
                      onChange={(e) => setPromoProductId(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none font-sans"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {isRtl ? p.nameAr : p.nameEn} ({p.sellingPrice} QAR)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Promo Price */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? "سعر العرض الترويجي" : "Promo Price (QAR)"}</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 2500"
                      value={promoPrice}
                      onChange={(e) => setPromoPrice(Number(e.target.value) || '')}
                      className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? "تاريخ ووقت انتهاء العرض" : "Offer Expiration Date"}</label>
                    <input
                      type="datetime-local"
                      required
                      value={promoEndDate}
                      onChange={(e) => setPromoEndDate(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>💾</span>
                    <span>{isRtl ? "حفظ التعديلات" : "Apply Promotion Settings"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            <div className="h-10 bg-slate-900/60 rounded-xl animate-pulse"></div>
            {[1, 2, 3, 4, 5].map(idx => (
              <div key={idx} className="h-16 bg-slate-900/40 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-slate-900 bg-slate-900/20">
            <EyeOffIcon size={48} className="mx-auto text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-400">
              {isRtl ? "لا توجد منتجات مطابقة لهذا التبويب أو الفرز" : "No products found for this section"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-900 bg-slate-900/10">
              <table className="w-full text-xs text-left border-collapse border-spacing-0">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-950 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4 text-right">{isRtl ? "المنتج" : "Product"}</th>
                    <th className="p-4 text-center">SKU</th>
                    <th className="p-4 text-center">{isRtl ? "القسم" : "Category"}</th>
                    <th className="p-4 text-center">{isRtl ? "السعر" : "Price"}</th>
                    <th className="p-4 text-center">{isRtl ? "المخزون" : "Stock"}</th>
                    <th className="p-4 text-center">{isRtl ? "الحالة" : "Condition"}</th>
                    <th className="p-4 text-center">{isRtl ? "العمليات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60">
                  {filteredProducts.map((product) => {
                    const hasDiscount = !!product.salePrice;
                    const price = product.salePrice ?? product.sellingPrice;
                    const isLowStock = product.stockQty > 0 && product.stockQty <= product.lowStockThreshold;

                    return (
                      <tr key={product.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.imageUrl} 
                              alt={product.nameEn} 
                              className="h-10 w-10 rounded-lg object-cover bg-slate-950 border border-slate-800"
                            />
                            <div>
                              <div className="font-bold text-white line-clamp-1">
                                {isRtl ? product.nameAr : product.nameEn}
                              </div>
                              <div className="text-[10px] text-slate-400 font-medium">
                                {product.brand}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-center font-mono text-slate-400">
                          {product.sku}
                        </td>

                        <td className="p-4 text-center text-slate-300">
                          {product.category}
                        </td>

                        <td className="p-4 text-center font-bold">
                          {hasDiscount ? (
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-slate-500 line-through">
                                {product.sellingPrice} {t('currency')}
                              </span>
                              <span className="text-cyan-400">
                                {product.salePrice} {t('currency')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-200">
                              {product.sellingPrice} {t('currency')}
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`font-bold ${
                              product.stockQty === 0 
                                ? 'text-pink-500' 
                                : isLowStock 
                                  ? 'text-yellow-500' 
                                  : 'text-slate-300'
                            }`}>
                              {product.stockQty}
                            </span>
                            {product.stockQty === 0 ? (
                              <span className="text-[8px] bg-pink-500/10 text-pink-400 px-1.5 py-0.5 rounded font-bold uppercase">
                                {isRtl ? "نفذ" : "Out"}
                              </span>
                            ) : isLowStock ? (
                              <span className="text-[8px] bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">
                                {isRtl ? "منخفض" : "Low"}
                              </span>
                            ) : (
                              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase">
                                {isRtl ? "متوفر" : "In"}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            product.condition === 'New' 
                              ? 'bg-cyan-500/10 text-cyan-400' 
                              : product.condition === 'Used' 
                                ? 'bg-purple-500/10 text-purple-400' 
                                : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {product.condition}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleToggleStatus(product)}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                activeTab === 'published'
                                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500 hover:text-white'
                                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950'
                              }`}
                              title={activeTab === 'published' ? (isRtl ? "إلغاء النشر (مسودة)" : "Draft product") : (isRtl ? "نشر مباشر" : "Publish product")}
                            >
                              {activeTab === 'published' ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                            </button>

                            <button
                              onClick={() => handleOpenEdit(product)}
                              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 transition-all cursor-pointer"
                            >
                              <EditIcon size={14} />
                            </button>

                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-1.5 rounded-lg border border-pink-500/20 bg-pink-500/5 text-pink-500 hover:bg-pink-500 hover:text-white transition-all cursor-pointer"
                            >
                              <TrashIcon size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Grid View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredProducts.map((product) => {
                const hasDiscount = !!product.salePrice;
                const price = product.salePrice ?? product.sellingPrice;
                const isLowStock = product.stockQty > 0 && product.stockQty <= product.lowStockThreshold;

                return (
                  <div key={product.id} className="relative rounded-2xl border border-slate-900 bg-slate-900/40 p-4 space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-800/60 pb-3">
                      <img 
                        src={product.imageUrl} 
                        alt={product.nameEn} 
                        className="h-12 w-12 rounded-xl object-cover bg-slate-950 border border-slate-800"
                      />
                      <div className="flex-1">
                        <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block">
                          {product.brand}
                        </span>
                        <h4 className="font-bold text-white text-xs line-clamp-1">
                          {isRtl ? product.nameAr : product.nameEn}
                        </h4>
                        <span className="font-mono text-[9px] text-slate-500">
                          SKU: {product.sku}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 border-b border-slate-800/60 pb-3">
                      <div>
                        <span className="block text-slate-500 font-semibold">{isRtl ? 'الفئة' : 'Category'}</span>
                        <span className="text-slate-300 font-bold">{product.category}</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 font-semibold">{isRtl ? 'الحالة' : 'Condition'}</span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-bold mt-0.5 ${
                          product.condition === 'New' 
                            ? 'bg-cyan-500/10 text-cyan-400' 
                            : product.condition === 'Used' 
                              ? 'bg-purple-500/10 text-purple-400' 
                              : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {product.condition}
                        </span>
                      </div>
                      <div>
                        <span className="block text-slate-500 font-semibold">{isRtl ? 'السعر' : 'Price'}</span>
                        <span className="text-white font-extrabold text-xs">
                          {price} {t('currency')}
                        </span>
                      </div>
                      <div>
                        <span className="block text-slate-500 font-semibold">{isRtl ? 'المخزون' : 'Stock'}</span>
                        <span className={`font-black text-xs ${
                          product.stockQty === 0 
                            ? 'text-pink-500' 
                            : isLowStock 
                              ? 'text-yellow-500' 
                              : 'text-emerald-400'
                        }`}>
                          {product.stockQty} {isRtl ? 'قطع' : 'pcs'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 gap-2">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-[10px] font-bold transition-all ${
                          activeTab === 'published'
                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                            : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                        }`}
                      >
                        {activeTab === 'published' ? <EyeOffIcon size={12} /> : <EyeIcon size={12} />}
                        <span>{activeTab === 'published' ? (isRtl ? 'إلغاء النشر' : 'Unpublish') : (isRtl ? 'نشر المنتج' : 'Publish')}</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 text-[10px] font-bold"
                      >
                        <EditIcon size={12} />
                        <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2.5 rounded-xl border border-pink-500/20 bg-pink-500/5 text-pink-500 cursor-pointer"
                      >
                        <TrashIcon size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>

      {/* Editing product modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950 p-6 md:p-8 shadow-2xl shadow-cyan-500/10 max-h-[90vh] overflow-y-auto scrollbar-thin animate-in zoom-in-95 duration-200">
            
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-purple-600/10 blur-3xl pointer-events-none"></div>

            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-5 right-5 z-10 rounded-full bg-slate-900/80 p-2 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <CloseIcon size={20} />
            </button>

            <form onSubmit={handleSaveEdit} className="space-y-6">
              
              <div className="border-b border-slate-800/80 pb-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-[11px] font-bold text-cyan-300 uppercase">
                  <SparklesIcon size={12} className="text-cyan-400" />
                  {isRtl ? "تعديل تفاصيل المخزون والمنتج" : "System Product Editor"}
                </div>
                <h2 className="text-2xl font-black text-white tracking-wide mt-2">
                  {isRtl ? "تعديل منتج في النظام" : "Modify Store Product"}
                </h2>
              </div>

              {/* Form Navigation Tabs */}
              <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setEditModalTab('general')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all border-b-2 ${
                    editModalTab === 'general' ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5' : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {isRtl ? "البيانات الأساسية والصور" : "Identity & Media"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditModalTab('category')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all border-b-2 ${
                    editModalTab === 'category' ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5' : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {isRtl ? "التصنيف والتوجيه" : "Categories & Slugs"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditModalTab('pricing')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all border-b-2 ${
                    editModalTab === 'pricing' ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5' : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {isRtl ? "الأسعار والمخزون" : "Pricing & Stock"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditModalTab('specs')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all border-b-2 ${
                    editModalTab === 'specs' ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5' : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {isRtl ? "المواصفات الفنية" : "Technical Specs"}
                </button>
              </div>

              {/* ───────────────── TAB 1: GENERAL INFO & MEDIA ───────────────── */}
              {editModalTab === 'general' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Smart auto-category match alert */}
                  {suggestedPrimaryCategory && suggestedPrimaryCategory !== editPrimaryCategory && (
                    <div className="p-3.5 rounded-xl border border-yellow-500/30 bg-yellow-500/5 text-yellow-300 text-xs font-semibold flex items-center gap-3">
                      <span>💡</span>
                      <div>
                        <span className="font-bold">{isRtl ? "اقتراح تصنيف ذكي: " : "Smart Suggestion: "}</span>
                        {isRtl 
                          ? `كشفنا كلمات تدل على فئة "${suggestedPrimaryCategory}". هل تود تغيير الفئة الرئيسية للمنتج؟`
                          : `Keywords detect this item belongs under "${suggestedPrimaryCategory}". Consider matching categories.`}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditPrimaryCategory(suggestedPrimaryCategory);
                          setEditCategory(suggestedPrimaryCategory);
                        }}
                        className="ml-auto px-2.5 py-1 rounded bg-yellow-500 text-slate-950 font-black hover:bg-yellow-400 transition-all text-[10px]"
                      >
                        {isRtl ? "تطبيق الاقتراح" : "Apply Suggestion"}
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Arabic Title */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "اسم المنتج بالعربية *" : "Arabic Product Title *"}</label>
                      <input
                        type="text"
                        required
                        value={editNameAr}
                        onChange={(e) => setEditNameAr(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    {/* English Title */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "اسم المنتج بالإنجليزية *" : "English Product Title *"}</label>
                      <input
                        type="text"
                        required
                        value={editNameEn}
                        onChange={(e) => setEditNameEn(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    {/* Brand selector with helper quick buttons */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "الماركة" : "Brand / Creator"}</label>
                      <input
                        type="text"
                        required
                        value={editBrand}
                        onChange={(e) => setEditBrand(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none mb-1.5"
                      />
                      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {['Sony', 'Nintendo', 'Microsoft', 'ASUS', 'MSI', 'Corsair', 'Intel', 'AMD', 'NVIDIA', 'RETRO'].map(b => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setEditBrand(b)}
                            className={`px-2 py-1 rounded bg-slate-900 text-[10px] font-bold border transition-all ${
                              editBrand === b ? 'border-cyan-500 text-cyan-400' : 'border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Product Type dropdown */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "نوع المنتج" : "Product Type Classification"}</label>
                      <select
                        value={editProductType}
                        onChange={(e) => setEditProductType(e.target.value as any)}
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="PHYSICAL PRODUCT">PHYSICAL PRODUCT</option>
                        <option value="DIGITAL PRODUCT">DIGITAL PRODUCT (أكواد رقمية)</option>
                        <option value="SERVICE">SERVICE (خدمة و صيانة)</option>
                        <option value="CUSTOM PC">CUSTOM PC (تجميعات مخصصة)</option>
                        <option value="PRE-BUILT PC">PRE-BUILT PC (أجهزة جاهزة)</option>
                        <option value="USED / PRE-OWNED">USED / PRE-OWNED (مستعمل)</option>
                        <option value="RETRO PRODUCT">RETRO PRODUCT (ريترو كلاسيك)</option>
                      </select>
                    </div>
                  </div>

                  {/* Multi-Image Gallery Manager */}
                  <div className="space-y-3 pt-4 border-t border-slate-800/80">
                    <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                      {isRtl ? "مدير صور المعرض (بحد أقصى 10 صور)" : "Multi-Image Gallery Manager (Max 10 Images)"}
                    </label>

                    {/* Primary Image Preview Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                      <div className="relative h-32 rounded-2xl border border-cyan-500/30 bg-slate-900 overflow-hidden flex items-center justify-center">
                        {editImageUrl ? (
                          <img src={editImageUrl} alt="Primary preview" className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[10px] text-slate-500">No Main Image</span>
                        )}
                        <span className="absolute bottom-2 left-2 bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 text-[9px] font-bold px-2 py-0.5 rounded">
                          {isRtl ? "الصورة الأساسية" : "Primary Card"}
                        </span>
                      </div>

                      <div className="sm:col-span-3 space-y-2">
                        <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/5 px-4 py-3 text-xs font-bold text-cyan-300 hover:bg-cyan-500/10 transition-all cursor-pointer">
                          <UploadIcon size={16} />
                          <span>{isRtl ? "تغيير الصورة الرئيسية" : "Upload Main Card Image"}</span>
                          <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Or paste external main image URL..."
                            value={editImageUrl}
                            onChange={(e) => setEditImageUrl(e.target.value)}
                            className="flex-1 rounded-xl bg-slate-900 px-3.5 py-2.5 text-[11px] text-slate-100 border border-slate-800 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Multi-Image Gallery List */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 block">
                        {isRtl ? "صور المعرض الإضافية:" : "Gallery Images list:"}
                      </span>
                      
                      {editGalleryUrls.length === 0 ? (
                        <div className="py-4 text-center text-xs text-slate-500 rounded-2xl bg-slate-900/40 border border-slate-850">
                          {isRtl ? "لا توجد صور إضافية في المعرض حالياً" : "No supplementary gallery images configured."}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {editGalleryUrls.map((url, idx) => (
                            <div key={idx} className="relative group border border-slate-800 rounded-xl bg-slate-900 p-2 space-y-1.5">
                              <div className="h-20 w-full overflow-hidden rounded bg-slate-950 flex items-center justify-center relative">
                                <img src={url} alt={`Gallery ${idx}`} className="h-full object-contain" />
                                <span className="absolute top-1 left-1 bg-slate-900/80 text-[8px] font-bold px-1.5 py-0.5 rounded text-slate-400">
                                  #{idx + 1}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const oldMain = editImageUrl;
                                    setEditImageUrl(url);
                                    const nextGallery = [...editGalleryUrls];
                                    nextGallery[idx] = oldMain;
                                    setEditGalleryUrls(nextGallery.filter(Boolean));
                                  }}
                                  className="text-[9px] px-1.5 py-0.5 bg-cyan-950/80 text-cyan-400 hover:bg-cyan-900 border border-cyan-800 rounded flex-1 text-center font-bold"
                                >
                                  {isRtl ? "أساسي" : "Set Main"}
                                </button>
                                <div className="flex gap-0.5">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => {
                                      const nextList = [...editGalleryUrls];
                                      const temp = nextList[idx];
                                      nextList[idx] = nextList[idx - 1];
                                      nextList[idx - 1] = temp;
                                      setEditGalleryUrls(nextList);
                                    }}
                                    className="px-1 bg-slate-800 text-slate-300 disabled:opacity-40 rounded hover:bg-slate-700"
                                  >
                                    ←
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === editGalleryUrls.length - 1}
                                    onClick={() => {
                                      const nextList = [...editGalleryUrls];
                                      const temp = nextList[idx];
                                      nextList[idx] = nextList[idx + 1];
                                      nextList[idx + 1] = temp;
                                      setEditGalleryUrls(nextList);
                                    }}
                                    className="px-1 bg-slate-800 text-slate-300 disabled:opacity-40 rounded hover:bg-slate-700"
                                  >
                                    →
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditGalleryUrls(editGalleryUrls.filter((_, i) => i !== idx));
                                    }}
                                    className="px-1.5 bg-red-950/80 text-red-400 border border-red-900/50 rounded hover:bg-red-900"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Gallery Image URL Input */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          id="newGalleryUrlInput"
                          placeholder="Paste image URL to append to gallery..."
                          className="flex-1 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const inp = document.getElementById('newGalleryUrlInput') as HTMLInputElement;
                            if (inp && inp.value.trim() && editGalleryUrls.length < 10) {
                              setEditGalleryUrls([...editGalleryUrls, inp.value.trim()]);
                              inp.value = '';
                            }
                          }}
                          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-slate-950"
                        >
                          {isRtl ? "إضافة للمعرض" : "Append Image"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────── TAB 2: CATEGORY & STRUCTURE ───────────────── */}
              {editModalTab === 'category' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Category Selector */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "الفئة الرئيسية" : "Primary Category"}</label>
                      <select
                        value={editPrimaryCategory}
                        onChange={(e) => {
                          setEditPrimaryCategory(e.target.value);
                          setEditCategory(e.target.value); // Sync catalog query
                        }}
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="Gaming">Gaming (الألعاب والمنصات)</option>
                        <option value="Retro Gaming">Retro Gaming (ألعاب ريترو الكلاسيكية)</option>
                        <option value="PC">PC Hardware (أجهزة الكمبيوتر والقطع)</option>
                        <option value="Monitors">Monitors (الشاشات)</option>
                        <option value="Accessories">Accessories (الملحقات والأكسسوارات)</option>
                        <option value="Laptops">Laptops (اللابتوبات)</option>
                        <option value="Repair Hub">Repair Hub (خدمات الصيانة)</option>
                      </select>
                    </div>

                    {/* Secondary Category */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "الفئة الفرعية الثانوية" : "Secondary Category (Optional)"}</label>
                      <select
                        value={editSecondaryCategory}
                        onChange={(e) => setEditSecondaryCategory(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="">None</option>
                        <option value="Consoles">Consoles (أجهزة الألعاب)</option>
                        <option value="Games">Games (أشرطة وألعاب)</option>
                        <option value="Controllers">Controllers (أذرع تحكم)</option>
                        <option value="PC Components">PC Components (قطع كمبيوتر)</option>
                        <option value="Gaming PCs">Gaming PCs (تجميعات كمبيوتر)</option>
                        <option value="Retro Gaming">Retro Gaming (ألعاب ومنصات قديمة)</option>
                        <option value="PlayStation 2">PlayStation 2</option>
                        <option value="Classic Nintendo">Classic Nintendo</option>
                      </select>
                    </div>

                    {/* Platform Tag */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "منصة التشغيل" : "Target Platform (e.g. PlayStation)"}</label>
                      <input
                        type="text"
                        value={editPlatform}
                        onChange={(e) => setEditPlatform(e.target.value)}
                        placeholder="e.g. PlayStation, Xbox, Switch, AMD..."
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    {/* Platform Generation */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "جيل المنصة" : "Platform Generation (e.g. PS2)"}</label>
                      <input
                        type="text"
                        value={editGeneration}
                        onChange={(e) => setEditGeneration(e.target.value)}
                        placeholder="e.g. PS1, PS2, AM5, LGA1700..."
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    {/* Tag list */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "الوسوم (مفصولة بفواصل)" : "Tags (Comma-separated)"}</label>
                      <input
                        type="text"
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        placeholder="e.g. Retro, GPU, AMD, PS2, Used"
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    {/* Collections */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "مجموعات العرض (مفصولة بفواصل)" : "Collections (Comma-separated)"}</label>
                      <input
                        type="text"
                        value={editCollections}
                        onChange={(e) => setEditCollections(e.target.value)}
                        placeholder="e.g. WEEKLY OFFERS, PRE-OWNED, RETRO PICKS"
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────── TAB 3: PRICING & STOCK ───────────────── */}
              {editModalTab === 'pricing' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Selling price */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "سعر البيع الأساسي (ر.ق) *" : "Retail Selling Price (QAR) *"}</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={editSellingPrice}
                        onChange={(e) => setEditSellingPrice(e.target.value ? Number(e.target.value) : '')}
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    {/* Sale Price */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "سعر العرض / التنزيل (ر.ق)" : "Sale Price (Promo Override)"}</label>
                      <input
                        type="number"
                        min="1"
                        value={editSalePrice}
                        onChange={(e) => setEditSalePrice(e.target.value ? Number(e.target.value) : '')}
                        placeholder="e.g. 399 (Optional)"
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    {/* Total Stock */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "الكمية الكلية بالمخزون *" : "Total Stock Qty *"}</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={editStockQty}
                        onChange={(e) => setEditStockQty(e.target.value ? Number(e.target.value) : '')}
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    {/* Threshold */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "عتبة التنبيه للمخزون المنخفض" : "Low Stock Alert Threshold"}</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={editLowStockThreshold}
                        onChange={(e) => setEditLowStockThreshold(Number(e.target.value))}
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    {/* Inventory status dropdown */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "حالة توفر المخزون" : "Inventory Stock Status"}</label>
                      <select
                        value={editStockStatus}
                        onChange={(e) => setEditStockStatus(e.target.value as any)}
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="IN STOCK">{isRtl ? "متوفر (IN STOCK)" : "IN STOCK"}</option>
                        <option value="LOW STOCK">{isRtl ? "مخزون منخفض (LOW STOCK)" : "LOW STOCK"}</option>
                        <option value="OUT OF STOCK">{isRtl ? "نفذ (OUT OF STOCK)" : "OUT OF STOCK"}</option>
                        <option value="PRE-ORDER">{isRtl ? "حجز مسبق (PRE-ORDER)" : "PRE-ORDER"}</option>
                      </select>
                    </div>

                    {/* Condition */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "الحالة التجارية للمنتج" : "Commercial Condition"}</label>
                      <select
                        value={editCondition}
                        onChange={(e) => setEditCondition(e.target.value as any)}
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="NEW">{isRtl ? "جديد بالكامل (NEW)" : "NEW"}</option>
                        <option value="USED">{isRtl ? "مستعمل (USED)" : "USED"}</option>
                        <option value="REFURBISHED">{isRtl ? "مجدد مع ضمان (REFURBISHED)" : "REFURBISHED"}</option>
                        <option value="OPEN BOX">{isRtl ? "صندوق مفتوح (OPEN BOX)" : "OPEN BOX"}</option>
                        <option value="PRE-OWNED">{isRtl ? "مقتنى سابقاً (PRE-OWNED)" : "PRE-OWNED"}</option>
                      </select>
                    </div>

                    {/* Publish Status */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "حالة عرض المنتج على الموقع" : "Product Storefront Status"}</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="published">{isRtl ? "نشط و معروض للبيع (ACTIVE / LIVE)" : "ACTIVE / Live Storefront"}</option>
                        <option value="draft">{isRtl ? "مسودة / مخفي عن الزوار (HIDDEN / DRAFT)" : "HIDDEN / Draft Status"}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────── TAB 4: SPECIFICATIONS ───────────────── */}
              {editModalTab === 'specs' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* General Specs */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "فترة الضمان" : "Warranty Duration"}</label>
                      <input
                        type="text"
                        value={editWarranty}
                        onChange={(e) => setEditWarranty(e.target.value)}
                        placeholder="e.g. 1 Year Official, 6 Months Store..."
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "الأبعاد (الطول × العرض × الارتفاع)" : "Dimensions (L x W x H)"}</label>
                      <input
                        type="text"
                        value={editDimensions}
                        onChange={(e) => setEditDimensions(e.target.value)}
                        placeholder="e.g. 300 x 140 x 50 mm"
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "الوزن" : "Weight"}</label>
                      <input
                        type="text"
                        value={editWeight}
                        onChange={(e) => setEditWeight(e.target.value)}
                        placeholder="e.g. 1.2 kg"
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* ── Category-specific Dynamic forms ── */}

                  {/* Retro Gaming dynamic inputs */}
                  {(editPrimaryCategory === 'Retro Gaming' || editSecondaryCategory === 'Retro Gaming') && (
                    <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block">
                        🕹️ {isRtl ? "تفاصيل منصات ريترو الكلاسيكية" : "Classic Retro Console Parameters"}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-300">{isRtl ? "المنطقة الإقليمية للأجهزة القديمة" : "Retro Region Standard"}</label>
                          <select
                            value={editSpecs.region || 'PAL'}
                            onChange={(e) => setEditSpecs({ ...editSpecs, region: e.target.value })}
                            className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
                          >
                            <option value="PAL">PAL (Europe & Middle East)</option>
                            <option value="NTSC-U">NTSC-U (USA / North America)</option>
                            <option value="NTSC-J">NTSC-J (Japan / NTSC-Asia)</option>
                            <option value="Region Free">Region Free (جميع الأنظمة)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-300">{isRtl ? "حالة الفحص والتشغيل" : "Console Testing Status"}</label>
                          <select
                            value={editSpecs.tested || 'Yes'}
                            onChange={(e) => setEditSpecs({ ...editSpecs, tested: e.target.value })}
                            className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
                          >
                            <option value="Yes">Yes (تم الفحص وتعمل 100%)</option>
                            <option value="No">No (غير مفحوصة)</option>
                            <option value="Partially">Partially (تعمل مع بعض الملاحظات)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PC Components socket & power inputs */}
                  {editPrimaryCategory === 'PC' && (
                    <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 block">
                        ⚙️ {isRtl ? "المواصفات الهندسية لقطع الكمبيوتر" : "PC Hardware Engineering Metadata"}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-300">{isRtl ? "سوكيت المعالج / المقبس المدعوم" : "Socket Compatibility (CPU/MB)"}</label>
                          <input
                            type="text"
                            value={editSpecs.socket || ''}
                            onChange={(e) => setEditSpecs({ ...editSpecs, socket: e.target.value })}
                            placeholder="e.g. LGA1700, AM5, AM4"
                            className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-300">{isRtl ? "استهلاك الطاقة الأقصى (واط)" : "Peak Power Draw (Watts)"}</label>
                          <input
                            type="number"
                            value={editSpecs.powerDraw || ''}
                            onChange={(e) => setEditSpecs({ ...editSpecs, powerDraw: Number(e.target.value) })}
                            placeholder="e.g. 250, 750"
                            className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-300">{isRtl ? "حجم الكروت واللوحات الأم" : "Form Factor (e.g. ATX, Mini-ITX)"}</label>
                          <input
                            type="text"
                            value={editSpecs.formFactor || ''}
                            onChange={(e) => setEditSpecs({ ...editSpecs, formFactor: e.target.value })}
                            placeholder="e.g. ATX, Micro-ATX, Mini-ITX"
                            className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Descriptions block */}
                  <div className="space-y-4 pt-4 border-t border-slate-800/80">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "الوصف المختصر بالعربية" : "Arabic Brief Description"}</label>
                      <textarea
                        rows={2}
                        value={editDescriptionAr}
                        onChange={(e) => setEditDescriptionAr(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">{isRtl ? "الوصف المختصر بالإنجليزية" : "English Brief Description"}</label>
                      <textarea
                        rows={2}
                        value={editDescriptionEn}
                        onChange={(e) => setEditDescriptionEn(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  {isRtl ? "إلغاء" : "Cancel"}
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all cursor-pointer font-black"
                >
                  <CheckIcon size={16} />
                  <span>{isRtl ? "حفظ التغييرات" : "Save Changes"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Floating Add Product Modal Connector */}
      <QuickAddProductModal 
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
      />

    </div>
  );
}
