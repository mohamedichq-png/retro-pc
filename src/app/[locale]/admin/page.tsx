/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import type { Product } from '@/types';
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
import { useOffersStore, DEFAULT_RETRO_BRAND_LOGOS } from '@/stores/useOffersStore';
import { RETRO_BRANDS } from '@/lib/retro-navigation';
import { classifyAllProducts } from '@/lib/classificationEngine';
import { uploadImageToSupabase, supabase } from '@/lib/supabase';
import { mapProductToDb } from '@/lib/productsData';

export default function AdminDashboard() {
  const { 
    isRtl, 
    products, 
    updateProduct, 
    deleteProduct, 
    importProducts,
    showToast,
    loading,
    t 
  } = useApp();

  // Authentication Gate States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Cloud Sync & Image Uploading States
  const [isUploadingEditImage, setIsUploadingEditImage] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Dashboard Filters States
  const [activeTab, setActiveTab] = useState<'published' | 'draft' | 'banners' | 'taxonomy' | 'visual-categories' | 'retro-sections'>('published');
  const [searchQuery, setSearchQuery] = useState('');
  const [taxonomyFilter, setTaxonomyFilter] = useState<'all' | 'needs-review' | 'pos' | 'pc' | 'playstation' | 'nintendo' | 'xbox' | 'retro' | 'pc-parts'>('all');

  // Retro Sections View States
  const [retroSubView, setRetroSubView] = useState<'brands' | 'devices'>('brands');
  const [selectedRetroBrandForDevices, setSelectedRetroBrandForDevices] = useState<string>('playstation');
  const [retroUrlModal, setRetroUrlModal] = useState<{ id: string; name: string; currentUrl: string; type: 'brand' | 'device'; brandId?: string } | null>(null);
  const [tempRetroUrl, setTempRetroUrl] = useState('');

  // Quick Taxonomy Modal State
  const [taxonomyEditProduct, setTaxonomyEditProduct] = useState<Product | null>(null);
  const [taxMainCategory, setTaxMainCategory] = useState('');
  const [taxSubCategory, setTaxSubCategory] = useState('');
  const [taxSection, setTaxSection] = useState('');
  const [taxPlatform, setTaxPlatform] = useState('');
  const [taxBrand, setTaxBrand] = useState('');

  // Batch classification analysis
  const { classified: classifiedProducts, summary: taxonomySummary } = useMemo(() => {
    return classifyAllProducts(products);
  }, [products]);

  // Slides list & creators from offers store
  const slides = useOffersStore((s) => s.slides);
  const addSlide = useOffersStore((s) => s.addSlide);
  const removeSlide = useOffersStore((s) => s.removeSlide);
  const { 
    weeklyOffersActive, 
    weeklyOfferProductId, 
    weeklyOfferPromoPrice, 
    weeklyOfferEndDate,
    setWeeklyOfferData,
    visualCategories,
    updateVisualCategory,
    retroBrandLogos,
    updateRetroBrandLogo,
    resetRetroBrandLogo,
    retroDeviceImages,
    updateRetroDeviceImage,
    resetRetroDeviceImage
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

  // Smart suggestions on product name change
  const suggestedPrimaryCategory = useMemo(() => {
    if (!editNameEn && !editNameAr) return '';
    
    const textScan = (editNameEn + ' ' + editNameAr).toLowerCase();
    if (
      textScan.includes('rtx') || textScan.includes('geforce') || textScan.includes('radeon') ||
      textScan.includes('ryzen') || textScan.includes('core i') || textScan.includes('ddr5') ||
      textScan.includes('ddr4') || textScan.includes('nvme') || textScan.includes('ssd') ||
      textScan.includes('motherboard') || textScan.includes('psu') || textScan.includes('cooler') ||
      textScan.includes('chassis')
    ) {
      return 'PC';
    }
    if (
      textScan.includes('ps1') || textScan.includes('ps2') || textScan.includes('ps3') ||
      textScan.includes('playstation') || textScan.includes('game boy') || textScan.includes('sega') ||
      textScan.includes('atari') || textScan.includes('gamecube') || textScan.includes('n64') ||
      textScan.includes('nes') || textScan.includes('snes') || textScan.includes('dreamcast')
    ) {
      return 'Retro Gaming';
    }
    if (textScan.includes('monitor') || textScan.includes('screen')) {
      return 'Monitors';
    }
    if (textScan.includes('laptop') || textScan.includes('notebook')) {
      return 'Laptops';
    }
    if (textScan.includes('repair') || textScan.includes('service') || textScan.includes('fix')) {
      return 'Repair Hub';
    }
    return '';
  }, [editNameEn, editNameAr]);

  // Verify authentication on component mount
  useEffect(() => {
    const token = sessionStorage.getItem('retro_admin_auth');
    if (token === 'authenticated') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingEditImage(true);
    try {
      const publicUrl = await uploadImageToSupabase(file, 'products');
      if (publicUrl) {
        setEditImageUrl(publicUrl);
        if (showToast) showToast(isRtl ? 'تم رفع الصورة للسحابة بنجاح!' : 'Image uploaded to cloud!', 'success');
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setEditImageUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingEditImage(false);
    }
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(products, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `retro_catalog_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (showToast) {
      showToast(isRtl ? 'تم تصدير ملف البيانات بنجاح!' : 'Catalog exported successfully!', 'success');
    }
  };

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(products, null, 2));
      if (showToast) {
        showToast(isRtl ? 'تم نسخ جميع بيانات المنتجات إلى الحافظة!' : 'All products copied to clipboard!', 'success');
      } else {
        alert(isRtl ? 'تم نسخ البيانات!' : 'Data copied!');
      }
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          importProducts(parsed);
        } else {
          alert(isRtl ? 'صيغة الملف غير صحيحة. يجب أن يحتوي على مصفوفة منتجات.' : 'Invalid file format. Must contain an array of products.');
        }
      } catch {
        alert(isRtl ? 'حدث خطأ أثناء قراءة الملف.' : 'Error reading JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSyncAllToSupabase = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-domain')) {
      alert(isRtl ? 'مفاتيح Supabase غير مفعلة في البيئة!' : 'Supabase is not configured in this environment!');
      return;
    }

    setIsSyncingCloud(true);
    setSyncMessage(isRtl ? 'جاري المزامنة مع السحابة...' : 'Syncing with cloud...');

    try {
      const dbProducts = products.map(mapProductToDb);
      const chunkSize = 40;
      let syncedCount = 0;

      for (let i = 0; i < dbProducts.length; i += chunkSize) {
        const chunk = dbProducts.slice(i, i + chunkSize);
        const { error } = await supabase.from('products').upsert(chunk, { onConflict: 'id' });
        if (error) {
          console.error('Supabase bulk upsert chunk error:', error);
          throw error;
        }
        syncedCount += chunk.length;
        setSyncMessage(isRtl ? `تمت مزامنة ${syncedCount} من ${dbProducts.length}...` : `Synced ${syncedCount}/${dbProducts.length}...`);
      }

      if (showToast) {
        showToast(isRtl ? `تمت مزامنة جميع المنتجات (${products.length}) مع السحابة بنجاح!` : `Successfully synced all ${products.length} products to cloud!`, 'success');
      } else {
        alert(isRtl ? 'تمت المزامنة بنجاح!' : 'Cloud sync successful!');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Cloud sync failed:', err);
      alert(isRtl ? `فشلت المزامنة: ${errorMsg}` : `Sync failed: ${errorMsg}`);
    } finally {
      setIsSyncingCloud(false);
      setSyncMessage('');
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
      condition: editCondition as Product['condition'],
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

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Export JSON Button */}
            <button
              onClick={handleExportJSON}
              title={isRtl ? "تنزيل ملف البيانات كاملاً كـ JSON" : "Download complete catalog JSON"}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-sm"
            >
              <span>📥</span>
              <span>{isRtl ? "تصدير JSON" : "Export JSON"}</span>
            </button>

            {/* Copy JSON Button */}
            <button
              onClick={handleCopyJSON}
              title={isRtl ? "نسخ بيانات جميع المنتجات إلى الحافظة" : "Copy JSON to clipboard"}
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-950/40 px-3.5 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition-all cursor-pointer shadow-sm"
            >
              <span>📋</span>
              <span>{isRtl ? "نسخ البيانات" : "Copy Data"}</span>
            </button>

            {/* Import JSON File Button */}
            <label
              title={isRtl ? "استيراد ملف JSON وتحديث بيانات المتجر" : "Import JSON to update store catalog"}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-600 transition-all cursor-pointer shadow-sm"
            >
              <span>📤</span>
              <span>{isRtl ? "استيراد JSON" : "Import JSON"}</span>
              <input 
                type="file" 
                accept=".json,application/json" 
                onChange={handleImportJSON} 
                className="hidden" 
              />
            </label>

            {/* Sync All to Supabase Cloud Button */}
            <button
              onClick={handleSyncAllToSupabase}
              disabled={isSyncingCloud}
              title={isRtl ? "مزامنة جميع المنتجات محلياً مع قاعدة بيانات Supabase السحابية" : "Sync all local products to Supabase cloud"}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm ${
                isSyncingCloud 
                  ? 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300 animate-pulse cursor-not-allowed'
                  : 'border-cyan-500/40 bg-cyan-950/40 text-cyan-400 hover:bg-cyan-500/20'
              }`}
            >
              <span>⚡</span>
              <span>{isSyncingCloud ? syncMessage || (isRtl ? "جاري المزامنة..." : "Syncing...") : (isRtl ? "مزامنة السحابة" : "Sync to Cloud")}</span>
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              {isRtl ? "خروج" : "Lock"}
            </button>

            {/* Add Product Button */}
            <button
              onClick={() => setQuickAddOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all cursor-pointer"
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

            <button
              onClick={() => setActiveTab('visual-categories')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'visual-categories'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🖼️</span>
              <span>{isRtl ? "تسوق حسب القسم" : "Visual Categories"}</span>
            </button>

            <button
              onClick={() => setActiveTab('retro-sections')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'retro-sections'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🕹️</span>
              <span>{isRtl ? "صور أقسام الريترو" : "Retro Sections"}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                activeTab === 'retro-sections' ? 'bg-slate-950/25 text-slate-950' : 'bg-slate-800 text-cyan-400'
              }`}>
                {RETRO_BRANDS.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('taxonomy')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'taxonomy'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🗂️</span>
              <span>{isRtl ? "تصنيف وإدارة المنتجات" : "Taxonomy & POS Review"}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                activeTab === 'taxonomy' ? 'bg-slate-950/40 text-white' : 'bg-slate-800 text-purple-400'
              }`}>
                {taxonomySummary.needsClassification > 0 ? `⚠️ ${taxonomySummary.needsClassification}` : `✓ ${taxonomySummary.totalProducts}`}
              </span>
            </button>
          </div>

          {/* Search and Category filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-2xl">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={isRtl ? "ابحث بالاسم أو SKU أو التصنيف..." : "Search name, SKU, or category..."}
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

        {/* Loading Skeletons vs Data Table vs Banners vs Taxonomy Panel */}
        {activeTab === 'taxonomy' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* ── Taxonomy Summary Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isRtl ? "إجمالي المنتجات" : "Total Products"}</span>
                <p className="text-xl font-black text-white">{taxonomySummary.totalProducts}</p>
                <span className="text-[10px] text-cyan-400">{isRtl ? "في قاعدة البيانات" : "In Database"}</span>
              </div>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-4 space-y-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{isRtl ? "مخزون POS الكونسول" : "POS Inventory"}</span>
                <p className="text-xl font-black text-blue-300">{taxonomySummary.totalPosProducts}</p>
                <span className="text-[10px] text-blue-400/80">{isRtl ? "كونسول / ريترو / ألعاب" : "Consoles & Retro"}</span>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{isRtl ? "مخزون حواسيب PC" : "PC Database"}</span>
                <p className="text-xl font-black text-emerald-300">{taxonomySummary.totalPcProducts}</p>
                <span className="text-[10px] text-emerald-400/80">{isRtl ? "قطع وتجميعات مستقلة" : "PC Components"}</span>
              </div>
              <div className="rounded-2xl border border-purple-500/20 bg-purple-950/20 p-4 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{isRtl ? "مصنفة بنجاح" : "Categorized"}</span>
                <p className="text-xl font-black text-purple-300">{taxonomySummary.successfullyClassified}</p>
                <span className="text-[10px] text-purple-400/80">{isRtl ? "ثقة عالية > 80%" : "High Confidence"}</span>
              </div>
              <div className={`rounded-2xl border p-4 space-y-1 ${taxonomySummary.needsClassification > 0 ? 'border-amber-500/40 bg-amber-950/30' : 'border-slate-800 bg-slate-900/50'}`}>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{isRtl ? "تحتاج مراجعة" : "Needs Review"}</span>
                <p className="text-xl font-black text-amber-300">{taxonomySummary.needsClassification}</p>
                <span className="text-[10px] text-amber-400/80">{isRtl ? "مراجعة يدوية مطلوبة" : "Manual Review"}</span>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isRtl ? "تكرار SKU" : "Duplicate SKUs"}</span>
                <p className="text-xl font-black text-slate-300">{taxonomySummary.duplicatesCount}</p>
                <span className="text-[10px] text-slate-500">{isRtl ? "تم التحقق 100%" : "Verified"}</span>
              </div>
            </div>

            {/* ── Taxonomy Quick Filters ── */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-4">
              {[
                { id: 'all', labelAr: 'جميع المنتجات', labelEn: 'All Products' },
                { id: 'needs-review', labelAr: `تحتاج مراجعة (${taxonomySummary.needsClassification})`, labelEn: `Needs Review (${taxonomySummary.needsClassification})` },
                { id: 'pos', labelAr: `مخزون POS (${taxonomySummary.totalPosProducts})`, labelEn: `POS Only (${taxonomySummary.totalPosProducts})` },
                { id: 'pc', labelAr: `مخزون PC (${taxonomySummary.totalPcProducts})`, labelEn: `PC Only (${taxonomySummary.totalPcProducts})` },
                { id: 'playstation', labelAr: 'PlayStation', labelEn: 'PlayStation' },
                { id: 'nintendo', labelAr: 'Nintendo', labelEn: 'Nintendo' },
                { id: 'xbox', labelAr: 'Xbox', labelEn: 'Xbox' },
                { id: 'retro', labelAr: 'Retro Games', labelEn: 'Retro Games' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setTaxonomyFilter(tab.id as typeof taxonomyFilter)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    taxonomyFilter === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {isRtl ? tab.labelAr : tab.labelEn}
                </button>
              ))}
            </div>

            {/* ── Taxonomy Products Table ── */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/30">
              <table className="w-full text-xs text-left border-collapse border-spacing-0">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4 text-right">{isRtl ? "المنتج" : "Product"}</th>
                    <th className="p-4 text-center">SKU</th>
                    <th className="p-4 text-center">{isRtl ? "المصدر" : "Source"}</th>
                    <th className="p-4 text-center">{isRtl ? "القسم الرئيسي (L1)" : "Main Category (L1)"}</th>
                    <th className="p-4 text-center">{isRtl ? "القسم الفرعي (L2)" : "Subcategory (L2)"}</th>
                    <th className="p-4 text-center">{isRtl ? "نوع المنتج (L3)" : "Section (L3)"}</th>
                    <th className="p-4 text-center">{isRtl ? "نسبة الثقة" : "Confidence"}</th>
                    <th className="p-4 text-center">{isRtl ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {classifiedProducts
                    .filter(p => {
                      if (searchQuery) {
                        const q = searchQuery.toLowerCase();
                        const match = p.nameEn.toLowerCase().includes(q) || p.nameAr.includes(q) || p.sku?.toLowerCase().includes(q) || (p.mainCategory || '').toLowerCase().includes(q) || (p.subCategory || '').toLowerCase().includes(q);
                        if (!match) return false;
                      }
                      if (taxonomyFilter === 'needs-review') return p.needsClassification;
                      if (taxonomyFilter === 'pos') return p.source === 'POS';
                      if (taxonomyFilter === 'pc') return p.source === 'PC';
                      if (taxonomyFilter === 'playstation') return p.mainCategory === 'playstation';
                      if (taxonomyFilter === 'nintendo') return p.mainCategory === 'nintendo';
                      if (taxonomyFilter === 'xbox') return p.mainCategory === 'xbox';
                      if (taxonomyFilter === 'retro') return p.mainCategory === 'retro-games';
                      return true;
                    })
                    .map(p => {
                      const confidencePct = Math.round((p.taxonomyConfidence || 0.95) * 100);
                      const isPos = p.source === 'POS';

                      return (
                        <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={p.imageUrl} 
                                alt={p.nameEn} 
                                className="h-10 w-10 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-white line-clamp-1 max-w-[240px]">
                                  {isRtl ? p.nameAr : p.nameEn}
                                </div>
                                <div className="text-[10px] text-slate-400 line-clamp-1 max-w-[240px]">
                                  {isRtl ? p.nameEn : p.nameAr}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-center font-mono text-[11px] text-slate-300">
                            {p.sku || '-'}
                          </td>

                          <td className="p-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isPos 
                                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' 
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {p.source || (isPos ? 'POS' : 'PC')}
                            </span>
                          </td>

                          <td className="p-4 text-center">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 text-[11px] font-bold">
                              {p.mainCategory || p.category}
                            </span>
                          </td>

                          <td className="p-4 text-center font-bold text-cyan-400 text-[11px]">
                            {p.subCategory || '-'}
                          </td>

                          <td className="p-4 text-center">
                            <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase">
                              {p.section || 'General'}
                            </span>
                          </td>

                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <span className={`text-[11px] font-mono font-bold ${
                                confidencePct >= 90 ? 'text-emerald-400' : confidencePct >= 75 ? 'text-amber-400' : 'text-rose-400'
                              }`}>
                                {confidencePct}%
                              </span>
                              {p.needsClassification && (
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                                  {isRtl ? "مراجعة" : "Review"}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {p.needsClassification ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateProduct(p.id, { needsClassification: false });
                                    alert(isRtl ? 'تم اعتماد التصنيف بنجاح!' : 'Classification approved successfully!');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-black hover:bg-emerald-400 transition-colors cursor-pointer"
                                  title={isRtl ? "اعتماد التصنيف المقترح" : "Approve Suggested Taxonomy"}
                                >
                                  {isRtl ? "اعتماد" : "Approve"}
                                </button>
                              ) : (
                                <span className="text-emerald-400 text-xs font-bold">✓</span>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setTaxonomyEditProduct(p);
                                  setTaxMainCategory(p.mainCategory || 'playstation');
                                  setTaxSubCategory(p.subCategory || '');
                                  setTaxSection(p.section || 'consoles');
                                  setTaxPlatform(p.platform || '');
                                  setTaxBrand(p.brand || '');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-[10px] font-bold hover:bg-cyan-500 hover:text-slate-950 transition-colors cursor-pointer"
                              >
                                {isRtl ? "تعديل" : "Edit"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* ── Quick Taxonomy Edit Modal ── */}
            {taxonomyEditProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{isRtl ? "تعديل تصنيف المنتج" : "Modify Taxonomy Hierarchy"}</span>
                      <h3 className="text-sm font-black text-white">{isRtl ? taxonomyEditProduct.nameAr : taxonomyEditProduct.nameEn}</h3>
                      <p className="text-[10px] text-slate-400 font-mono">SKU: {taxonomyEditProduct.sku}</p>
                    </div>
                    <button
                      onClick={() => setTaxonomyEditProduct(null)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <CloseIcon size={18} />
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateProduct(taxonomyEditProduct.id, {
                        mainCategory: taxMainCategory,
                        subCategory: taxSubCategory,
                        section: (taxSection || undefined) as Product['section'],
                        platform: taxPlatform,
                        brand: taxBrand,
                        needsClassification: false,
                      });
                      setTaxonomyEditProduct(null);
                      alert(isRtl ? 'تم تحديث التصنيف بنجاح بدون المساس بالسعر أو المخزون!' : 'Taxonomy updated successfully without altering price or stock!');
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold">{isRtl ? "القسم الرئيسي (Level 1)" : "Main Category (Level 1)"}</label>
                      <select
                        value={taxMainCategory}
                        onChange={(e) => setTaxMainCategory(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 p-2.5 text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="playstation">PlayStation (بلايستيشن)</option>
                        <option value="nintendo">Nintendo (نينتندو)</option>
                        <option value="xbox">Xbox (إكس بوكس)</option>
                        <option value="retro-games">Retro Games (ألعاب وأجهزة ريترو)</option>
                        <option value="consoles-accessories">Consoles & Accessories (أجهزة وإكسسوارات)</option>
                        <option value="pc">PC / Computer (الكمبيوتر ومكوناته)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">{isRtl ? "القسم الفرعي / المنصة (Level 2)" : "Subcategory / Platform (Level 2)"}</label>
                        <input
                          type="text"
                          required
                          value={taxSubCategory}
                          onChange={(e) => setTaxSubCategory(e.target.value)}
                          placeholder="e.g. ps1, ps5, switch, cpus, gpus"
                          className="w-full rounded-xl bg-slate-950 p-2.5 text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">{isRtl ? "نوع المنتج (Level 3 Section)" : "Section (Level 3)"}</label>
                        <select
                          value={taxSection}
                          onChange={(e) => setTaxSection(e.target.value)}
                          className="w-full rounded-xl bg-slate-950 p-2.5 text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                        >
                          <option value="consoles">Consoles (أجهزة الألعاب)</option>
                          <option value="accessories">Accessories (الإكسسوارات والمحولات)</option>
                          <option value="games-cds">Games / CDs (الألعاب والأقراص)</option>
                          <option value="general">General (قطع ومكونات عامة)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">{isRtl ? "المنصة (Platform)" : "Platform"}</label>
                        <input
                          type="text"
                          value={taxPlatform}
                          onChange={(e) => setTaxPlatform(e.target.value)}
                          placeholder="e.g. PlayStation 4, Game Boy, PC"
                          className="w-full rounded-xl bg-slate-950 p-2.5 text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">{isRtl ? "العلامة التجارية (Brand)" : "Brand"}</label>
                        <input
                          type="text"
                          value={taxBrand}
                          onChange={(e) => setTaxBrand(e.target.value)}
                          placeholder="e.g. Sony, Nintendo, Microsoft, ASUS"
                          className="w-full rounded-xl bg-slate-950 p-2.5 text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-950 p-3 text-[11px] text-slate-400 border border-slate-800">
                      ℹ️ {isRtl ? "السعر (Selling Price) والمخزون ورمز الـ SKU محمية تماماً ولن تتأثر بعملية تعديل التصنيف." : "Selling Price, Stock Quantity, SKU, and Barcode are protected and will remain unchanged."}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setTaxonomyEditProduct(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                      >
                        {isRtl ? "إلغاء" : "Cancel"}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
                      >
                        {isRtl ? "حفظ التصنيف" : "Save Classification"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'visual-categories' ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Quick Switch Banner to Retro Sections */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-cyan-300">
                  {isRtl ? "هل تبحث عن صور أقسام وسكشنات الريترو؟ (SEGA, Xbox, Nintendo, PlayStation...)" : "Looking to edit Retro & Console Section Images? (SEGA, Xbox, Nintendo...)"}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {isRtl ? "تمت إضافة قسم مخصص للتحكم الكامل بشعارات الشركات وأجهزة الكونسول المعروضة في صفحة الريترو." : "A dedicated section is available to manage all retro console brands and device models."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('retro-sections')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all shrink-0 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <span>🕹️</span>
                <span>{isRtl ? "انتقل لصور أقسام الريترو" : "Go to Retro Sections"}</span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
                {isRtl ? "إدارة صور الأقسام (تسوق حسب الطلب)" : "Visual Categories Management"}
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {visualCategories.map((cat) => (
                <div key={cat.id} className="relative rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3 flex flex-col items-center">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700 group">
                    <img src={cat.image} alt={isRtl ? cat.nameAr : cat.nameEn} className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                      <UploadIcon size={24} className="text-cyan-400 mb-2" />
                      <span className="text-[10px] font-bold text-white text-center px-2">{isRtl ? "تغيير الصورة" : "Change Image"}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          if (showToast) showToast(isRtl ? 'جاري رفع الصورة...' : 'Uploading image...', 'info');
                          try {
                            const publicUrl = await uploadImageToSupabase(file, 'offers');
                            if (publicUrl) {
                              updateVisualCategory(cat.id, { image: publicUrl });
                              if (showToast) showToast(isRtl ? 'تم تحديث الصورة بنجاح' : 'Image updated successfully', 'success');
                            } else {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  updateVisualCategory(cat.id, { image: reader.result });
                                  if (showToast) showToast(isRtl ? 'تم تحديث الصورة بنجاح محلياً' : 'Image updated successfully (local)', 'success');
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          } catch {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                updateVisualCategory(cat.id, { image: reader.result });
                                if (showToast) showToast(isRtl ? 'تم تحديث الصورة بنجاح محلياً' : 'Image updated successfully (local)', 'success');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                    </label>
                  </div>
                  <span className="text-xs font-bold text-slate-300 text-center">{isRtl ? cat.nameAr : cat.nameEn}</span>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'retro-sections' ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Header & Intro */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950 shadow-xl backdrop-blur-sm">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-[11px] font-black text-cyan-400 uppercase tracking-wider">
                  <span>🕹️</span>
                  <span>{isRtl ? "أقسام وسكشنات الريترو والكونسول" : "Retro & Console Visual Sections"}</span>
                </div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  {isRtl ? "تعديل صور وشعارات السكشنات والشركات" : "Manage Retro Brand & Console Section Images"}
                </h3>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  {isRtl 
                    ? "تحكم بالصور والشعارات المعروضة في صفحة الريترو (SEGA, Xbox, Nintendo, PlayStation, Amiga, Atari, Panasonic 3DO, SNK, Philips, Arcade, PC Engine). يمكنك رفع صورة جديدة أو كتابة رابط مباشر أو استعادة الأصلية."
                    : "Customize brand logos and console photos displayed across the Retro store page. Upload new images, paste direct URLs, or restore original defaults anytime."}
                </p>
              </div>

              {/* Sub-view switcher: Brands vs Devices */}
              <div className="inline-flex rounded-2xl bg-slate-950 p-1 border border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setRetroSubView('brands')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    retroSubView === 'brands'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏢 {isRtl ? `سكشنات وماركات الشركات (${RETRO_BRANDS.length})` : `Brands & Sections (${RETRO_BRANDS.length})`}
                </button>
                <button
                  type="button"
                  onClick={() => setRetroSubView('devices')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    retroSubView === 'devices'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎮 {isRtl ? "موديلات الكونسول" : "Console Models"}
                </button>
              </div>
            </div>

            {/* View 1: Brands / Sections Grid */}
            {retroSubView === 'brands' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>{isRtl ? "انقر على 'رفع صورة' لاختيار ملف من حاسوبك، أو '🔗' لإدخال رابط مباشر." : "Click 'Upload' to pick an image from your PC or '🔗' to paste a direct URL."}</span>
                  <span className="text-cyan-400 font-bold">{RETRO_BRANDS.length} {isRtl ? "سكشن متاح" : "Sections available"}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {RETRO_BRANDS.map((b) => {
                    const currentLogo = retroBrandLogos[b.id] || DEFAULT_RETRO_BRAND_LOGOS[b.id] || `/brand-logos/${b.id}.svg`;
                    const isCustomized = Boolean(retroBrandLogos[b.id]);

                    return (
                      <div
                        key={b.id}
                        className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)] transition-all duration-300"
                      >
                        {/* Top info badge */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color || '#06b6d4' }} />
                            <h4 className="text-sm font-black text-white">{b.name}</h4>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                              {b.id}
                            </span>
                            {isCustomized ? (
                              <span className="text-[9px] font-black text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                                {isRtl ? "معدّلة" : "Custom"}
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-850">
                                {isRtl ? "أصلية" : "Default"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Logo Preview Box matching store theme */}
                        <div className="relative aspect-[16/10] w-full rounded-xl bg-black border border-slate-800/90 flex items-center justify-center p-3 overflow-hidden shadow-inner group/img">
                          <img
                            src={currentLogo}
                            alt={b.name}
                            className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-300 group-hover/img:scale-105"
                          />
                        </div>

                        {/* Actions bar */}
                        <div className="mt-4 flex items-center gap-2">
                          {/* Upload from PC */}
                          <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/25 text-xs font-bold cursor-pointer transition-all active:scale-95 text-center">
                            <UploadIcon size={14} />
                            <span>{isRtl ? "رفع صورة" : "Upload"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (showToast) showToast(isRtl ? `جاري رفع صورة ${b.name}...` : `Uploading ${b.name} image...`, 'info');
                                try {
                                  const publicUrl = await uploadImageToSupabase(file, 'sections');
                                  if (publicUrl) {
                                    updateRetroBrandLogo(b.id, publicUrl);
                                    if (showToast) showToast(isRtl ? `تم تحديث شعار ${b.name} بنجاح` : `${b.name} logo updated`, 'success');
                                  } else {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === 'string') {
                                        updateRetroBrandLogo(b.id, reader.result);
                                        if (showToast) showToast(isRtl ? `تم حفظ شعار ${b.name} بنجاح محلياً` : `${b.name} logo saved locally`, 'success');
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                } catch {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    if (typeof reader.result === 'string') {
                                      updateRetroBrandLogo(b.id, reader.result);
                                      if (showToast) showToast(isRtl ? `تم حفظ شعار ${b.name} بنجاح محلياً` : `${b.name} logo saved locally`, 'success');
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>

                          {/* Direct URL button */}
                          <button
                            type="button"
                            onClick={() => {
                              setRetroUrlModal({
                                id: b.id,
                                name: b.name,
                                currentUrl: currentLogo,
                                type: 'brand'
                              });
                              setTempRetroUrl(retroBrandLogos[b.id] || '');
                            }}
                            className="flex items-center justify-center px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                            title={isRtl ? "إدخال رابط مباشر" : "Direct URL"}
                          >
                            🔗
                          </button>

                          {/* Reset button if customized */}
                          {isCustomized && (
                            <button
                              type="button"
                              onClick={() => {
                                resetRetroBrandLogo(b.id);
                                if (showToast) showToast(isRtl ? `تمت استعادة الشعار الأصلي لـ ${b.name}` : `Restored default logo for ${b.name}`, 'info');
                              }}
                              className="flex items-center justify-center px-3 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/25 text-xs font-bold transition-all cursor-pointer"
                              title={isRtl ? "استعادة الأصلية" : "Restore default"}
                            >
                              <TrashIcon size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* View 2: Console Devices by Brand */
              <div className="space-y-6">
                {/* Brand selection pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {RETRO_BRANDS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedRetroBrandForDevices(b.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        selectedRetroBrandForDevices === b.id
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span>{b.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-black/30">
                        {b.devices.length}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Devices Grid */}
                {(() => {
                  const currentBrand = RETRO_BRANDS.find((b) => b.id === selectedRetroBrandForDevices) || RETRO_BRANDS[0];
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                        <span>
                          {isRtl ? `أجهزة وموديلات ${currentBrand.name} (${currentBrand.devices.length} أجهزة)` : `${currentBrand.name} Devices (${currentBrand.devices.length} models)`}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {currentBrand.devices.map((d) => {
                          const deviceKey = `${currentBrand.id}:${d.id}`;
                          const deviceImg = retroDeviceImages[deviceKey] || d.image;
                          const isCustomized = Boolean(retroDeviceImages[deviceKey]);

                          return (
                            <div
                              key={d.id}
                              className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-cyan-500/40 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <h4 className="text-xs font-black text-white line-clamp-1">{d.name}</h4>
                                {isCustomized ? (
                                  <span className="text-[9px] font-black text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                                    {isRtl ? "معدّل" : "Custom"}
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-850">
                                    {isRtl ? "افتراضي" : "Default"}
                                  </span>
                                )}
                              </div>

                              <div className="relative aspect-[4/3] w-full rounded-xl bg-black border border-slate-800/90 flex items-center justify-center p-3 overflow-hidden shadow-inner">
                                {deviceImg ? (
                                  <img
                                    src={deviceImg}
                                    alt={d.name}
                                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                  />
                                ) : (
                                  <span className="text-center text-xs text-slate-500">
                                    {isRtl ? "لا توجد صورة بعد" : "No photo yet"}
                                  </span>
                                )}
                              </div>

                              <div className="mt-3 flex items-center gap-2">
                                <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/25 text-xs font-bold cursor-pointer transition-all text-center active:scale-95">
                                  <UploadIcon size={14} />
                                  <span>{isRtl ? "رفع صورة" : "Upload"}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      if (showToast) showToast(isRtl ? `جاري رفع صورة ${d.name}...` : `Uploading ${d.name}...`, 'info');
                                      try {
                                        const publicUrl = await uploadImageToSupabase(file, 'devices');
                                        if (publicUrl) {
                                          updateRetroDeviceImage(currentBrand.id, d.id, publicUrl);
                                          if (showToast) showToast(isRtl ? `تم تحديث صورة ${d.name}` : `Updated ${d.name}`, 'success');
                                        } else {
                                          const reader = new FileReader();
                                          reader.onloadend = () => {
                                            if (typeof reader.result === 'string') {
                                              updateRetroDeviceImage(currentBrand.id, d.id, reader.result);
                                              if (showToast) showToast(isRtl ? `تم حفظ صورة ${d.name} محلياً` : `Saved ${d.name} locally`, 'success');
                                            }
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      } catch {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          if (typeof reader.result === 'string') {
                                            updateRetroDeviceImage(currentBrand.id, d.id, reader.result);
                                            if (showToast) showToast(isRtl ? `تم حفظ صورة ${d.name} محلياً` : `Saved ${d.name} locally`, 'success');
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setRetroUrlModal({
                                      id: d.id,
                                      name: `${currentBrand.name} - ${d.name}`,
                                      currentUrl: deviceImg || '',
                                      type: 'device',
                                      brandId: currentBrand.id
                                    });
                                    setTempRetroUrl(retroDeviceImages[deviceKey] || '');
                                  }}
                                  className="flex items-center justify-center px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                                  title={isRtl ? "رابط مباشر" : "URL"}
                                >
                                  🔗
                                </button>

                                {isCustomized && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      resetRetroDeviceImage(currentBrand.id, d.id);
                                      if (showToast) showToast(isRtl ? `تمت استعادة الصورة الافتراضية لـ ${d.name}` : `Restored default for ${d.name}`, 'info');
                                    }}
                                    className="flex items-center justify-center px-3 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/25 text-xs font-bold transition-all cursor-pointer"
                                    title={isRtl ? "استعادة الأصلية" : "Reset"}
                                  >
                                    <TrashIcon size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : activeTab === 'banners' ? (
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
                      onChange={(e) => setNewSlideColor(e.target.value as 'cyan' | 'purple' | 'pink')}
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
                        onChange={(e) => setEditProductType(e.target.value as typeof editProductType)}
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
                          <span>{isUploadingEditImage ? (isRtl ? "جاري الرفع..." : "Uploading...") : (isRtl ? "تغيير الصورة الرئيسية" : "Upload Main Card Image")}</span>
                          <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" disabled={isUploadingEditImage} />
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
                        onChange={(e) => setEditStockStatus(e.target.value as typeof editStockStatus)}
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
                        onChange={(e) => setEditCondition(e.target.value as typeof editCondition)}
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
                        onChange={(e) => setEditStatus(e.target.value as typeof editStatus)}
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

      {/* Retro Section / Device Direct URL Input Modal */}
      {retroUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-cyan-500/30 bg-slate-900 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">🔗</span>
                <h4 className="text-sm font-black text-white">
                  {isRtl ? `تحديد رابط مباشر (${retroUrlModal.name})` : `Direct Image URL (${retroUrlModal.name})`}
                </h4>
              </div>
              <button 
                type="button"
                onClick={() => setRetroUrlModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300">
                {isRtl ? "أدخل رابط الصورة (URL خارجي أو مسار محلي):" : "Enter Image URL (external link or local path):"}
              </label>
              <input 
                type="text" 
                value={tempRetroUrl}
                onChange={(e) => setTempRetroUrl(e.target.value)}
                placeholder={isRtl ? "مثال: https://... أو /brand-logos/..." : "e.g. https://... or /brand-logos/..."}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                autoFocus
              />

              {tempRetroUrl.trim() && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400">{isRtl ? "معاينة الصورة:" : "Image Preview:"}</span>
                  <div className="aspect-[16/9] w-full rounded-xl bg-black border border-slate-800 flex items-center justify-center p-3 overflow-hidden">
                    <img 
                      src={tempRetroUrl.trim()} 
                      alt="Preview" 
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.opacity = '0.3';
                      }} 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRetroUrlModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-800/60 text-xs font-bold text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!tempRetroUrl.trim()) return;
                  const finalUrl = tempRetroUrl.trim();
                  if (retroUrlModal.type === 'brand') {
                    updateRetroBrandLogo(retroUrlModal.id, finalUrl);
                  } else if (retroUrlModal.type === 'device' && retroUrlModal.brandId) {
                    updateRetroDeviceImage(retroUrlModal.brandId, retroUrlModal.id, finalUrl);
                  }
                  if (showToast) showToast(isRtl ? 'تم حفظ رابط الصورة بنجاح' : 'Image URL saved successfully', 'success');
                  setRetroUrlModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
              >
                {isRtl ? "تأكيد وحفظ" : "Confirm & Save"}
              </button>
            </div>
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
