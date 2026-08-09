"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../data/mockData';
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
} from '../../components/Icons';
import QuickAddProductModal from '../../components/QuickAddProductModal';

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
  const [activeTab, setActiveTab] = useState<'published' | 'draft'>('published');
  const [searchQuery, setSearchQuery] = useState('');
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
  const [editCondition, setEditCondition] = useState<'New' | 'Refurbished' | 'Used'>('New');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editDescriptionAr, setEditDescriptionAr] = useState('');
  const [editDescriptionEn, setEditDescriptionEn] = useState('');
  const [editStatus, setEditStatus] = useState<'published' | 'draft'>('published');

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
      condition: editCondition,
      imageUrl: editImageUrl,
      descriptionAr: editDescriptionAr,
      descriptionEn: editDescriptionEn,
      status: editStatus,
      specs: {
        ...editingProduct.specs,
        'Condition': editCondition,
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
          <div className="flex rounded-xl bg-slate-900/60 p-1 border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('published')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
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
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
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

        {/* Loading Skeletons vs Data Table */}
        {loading ? (
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
            {/* Desktop Table View (Visible on medium screens and up, hidden on mobile) */}
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

            {/* Mobile Card Grid View (Visible on mobile, hidden on desktop) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredProducts.map((product) => {
                const hasDiscount = !!product.salePrice;
                const price = product.salePrice ?? product.sellingPrice;
                const isLowStock = product.stockQty > 0 && product.stockQty <= product.lowStockThreshold;

                return (
                  <div key={product.id} className="relative rounded-2xl border border-slate-900 bg-slate-900/40 p-4 space-y-4">
                    {/* Header Info */}
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

                    {/* Core Details Grid */}
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

                    {/* Mobile Action Buttons */}
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

      {/* Editing product modal form drawer */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950 p-6 md:p-8 shadow-2xl shadow-cyan-500/10 max-h-[90vh] overflow-y-auto scrollbar-thin animate-in zoom-in-95 duration-200">
            
            {/* Background design */}
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

              {/* Image upload section */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                  {isRtl ? "تعديل صورة المنتج" : "Change Product Image"}
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="relative h-32 rounded-2xl border border-cyan-500/30 bg-slate-900 overflow-hidden flex items-center justify-center">
                    {editImageUrl ? (
                      <img src={editImageUrl} alt="Edit preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <UploadIcon size={24} className="mx-auto text-slate-500 mb-1" />
                        <span className="text-[10px] text-slate-500">{isRtl ? "لا توجد صورة" : "No Image"}</span>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2 space-y-3">
                    <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/5 px-4 py-3 text-xs font-bold text-cyan-300 hover:bg-cyan-500/10 transition-all cursor-pointer">
                      <UploadIcon size={16} />
                      <span>{isRtl ? "رفع ملف صورة جديد" : "Upload New Image"}</span>
                      <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                    </label>

                    {/* Presets */}
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block mb-1.5">
                        {isRtl ? "أو اختر عينة جاهزة:" : "Or choose preset:"}
                      </span>
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {SAMPLE_IMAGES.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditImageUrl(img.url)}
                            className={`h-10 w-10 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                              editImageUrl === img.url ? 'border-cyan-400 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name Arabic */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {isRtl ? "اسم المنتج بالعربية" : "Arabic Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={editNameAr}
                    onChange={(e) => setEditNameAr(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Name English */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {isRtl ? "اسم المنتج بالإنجليزية" : "English Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={editNameEn}
                    onChange={(e) => setEditNameEn(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {isRtl ? "القسم" : "Category"}
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="PC Components">PC Components</option>
                    <option value="Gaming PCs">Gaming PCs</option>
                    <option value="Monitors">Monitors</option>
                    <option value="Retro Consoles">Retro Consoles</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Handhelds">Handhelds</option>
                  </select>
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {isRtl ? "الماركة" : "Brand"}
                  </label>
                  <input
                    type="text"
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Selling Price */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {isRtl ? "السعر الأصلي (ر.ق)" : "Retail Price (QAR)"}
                  </label>
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
                  <label className="text-xs font-semibold text-slate-300">
                    {isRtl ? "سعر الخصم / التنزيل (ر.ق)" : "Discounted Price (Optional)"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editSalePrice}
                    onChange={(e) => setEditSalePrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Stock Quantity */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {isRtl ? "الكمية بالمخزن" : "Stock Quantity"}
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editStockQty}
                    onChange={(e) => setEditStockQty(e.target.value ? Number(e.target.value) : '')}
                    className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Low stock threshold */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {isRtl ? "عتبة التنبيه بانخفاض المخزن" : "Low Stock Warning Threshold"}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editLowStockThreshold}
                    onChange={(e) => setEditLowStockThreshold(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Condition */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {isRtl ? "حالة المنتج" : "Condition"}
                  </label>
                  <select
                    value={editCondition}
                    onChange={(e) => setEditCondition(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Used">Used</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {isRtl ? "حالة النشر" : "Publish Status"}
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="published">{isRtl ? "منزل مباشر على الموقع (Published)" : "Live / Published"}</option>
                    <option value="draft">{isRtl ? "مسودة قيد التنزيل (Draft)" : "Draft / Planned"}</option>
                  </select>
                </div>

              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {isRtl ? "الوصف المختصر بالعربية" : "Arabic Brief Description"}
                  </label>
                  <textarea
                    rows={2}
                    value={editDescriptionAr}
                    onChange={(e) => setEditDescriptionAr(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {isRtl ? "الوصف المختصر بالإنجليزية" : "English Brief Description"}
                  </label>
                  <textarea
                    rows={2}
                    value={editDescriptionEn}
                    onChange={(e) => setEditDescriptionEn(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

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
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all cursor-pointer"
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
