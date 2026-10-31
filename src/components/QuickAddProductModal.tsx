/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, react-hooks/purity */
"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../data/mockData';
import { CloseIcon, UploadIcon, SparklesIcon, CheckIcon, PlusIcon } from './Icons';
import { uploadImageToSupabase } from '@/lib/supabase';
import { useOffersStore } from '@/stores/useOffersStore';
import { RETRO_BRANDS, RETRO_KINDS } from '@/lib/retro-navigation';

interface QuickAddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRetroBrandId?: string;
  defaultRetroDeviceId?: string;
  defaultRetroKindId?: 'consoles' | 'games' | 'accessories';
}

const SAMPLE_IMAGES = [
  { label: 'Gaming PC Tower', url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80' },
  { label: 'RTX GPU', url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80' },
  { label: 'Curved Gaming Monitor', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80' },
  { label: 'Pro Gaming Headset', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80' },
  { label: 'RGB Gaming Keyboard', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80' },
  { label: 'Game Console Controller', url: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80' },
];

export default function QuickAddProductModal({
  isOpen,
  onClose,
  defaultRetroBrandId,
  defaultRetroDeviceId,
  defaultRetroKindId,
}: QuickAddProductModalProps) {
  const { addProduct, isRtl } = useApp();
  const retroBrands = useOffersStore((s) => s.retroBrands);
  const allRetroBrands = retroBrands && retroBrands.length > 0 ? retroBrands : RETRO_BRANDS;

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('Gaming');
  const [retroBrandId, setRetroBrandId] = useState<string>('');
  const [retroDeviceId, setRetroDeviceId] = useState<string>('');
  const [retroKindId, setRetroKindId] = useState<'consoles' | 'games' | 'accessories'>('consoles');
  const [brand, setBrand] = useState('Sony');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [stockQty, setStockQty] = useState<number | ''>(10);
  const [lowStockThreshold] = useState<number>(3);
  const [condition, setCondition] = useState<'NEW' | 'USED' | 'REFURBISHED' | 'OPEN BOX' | 'PRE-OWNED'>('NEW');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0].url);
  const [isUploading, setIsUploading] = useState(false);
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [productType] = useState<'PHYSICAL PRODUCT' | 'DIGITAL PRODUCT' | 'SERVICE' | 'CUSTOM PC' | 'PRE-BUILT PC' | 'USED / PRE-OWNED' | 'RETRO PRODUCT'>('PHYSICAL PRODUCT');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && defaultRetroBrandId) {
      const targetBrand = allRetroBrands.find((b) => b.id === defaultRetroBrandId);
      setCategory('Retro Gaming');
      setRetroBrandId(defaultRetroBrandId);
      if (targetBrand) {
        setBrand(targetBrand.name);
        const targetDeviceId =
          defaultRetroDeviceId || (targetBrand.devices[0] ? targetBrand.devices[0].id : '');
        setRetroDeviceId(targetDeviceId);
      }
      if (defaultRetroKindId) {
        setRetroKindId(defaultRetroKindId);
      }
    }
  }, [isOpen, defaultRetroBrandId, defaultRetroDeviceId, defaultRetroKindId, allRetroBrands]);

  if (!isOpen) return null;

  const selectedRetroBrand = allRetroBrands.find((b) => b.id === retroBrandId) || null;
  const selectedRetroDevice =
    selectedRetroBrand?.devices.find((d) => d.id === retroDeviceId) || null;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadImageToSupabase(file, 'products');
      if (publicUrl) {
        setImageUrl(publicUrl);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImageUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !sellingPrice) return;

    const finalCategory = selectedRetroBrand ? selectedRetroBrand.id : category;
    const mappedSection =
      retroKindId === 'games'
        ? 'games-cds'
        : retroKindId === 'accessories'
        ? 'accessories'
        : 'consoles';
    const mappedSecondary =
      retroKindId === 'games'
        ? 'Games'
        : retroKindId === 'accessories'
        ? 'Accessories'
        : 'Consoles';

    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      sku: `RET-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: `690${Math.floor(100000000 + Math.random() * 900000000)}`,
      model: selectedRetroDevice ? selectedRetroDevice.name : nameEn.trim() || nameAr.trim(),
      nameEn: nameEn.trim() || nameAr.trim(),
      nameAr: nameAr.trim(),
      category: finalCategory,
      mainCategory: selectedRetroBrand ? selectedRetroBrand.id : finalCategory.toLowerCase(),
      subCategory: selectedRetroDevice ? selectedRetroDevice.id : mappedSection,
      section: selectedRetroBrand ? mappedSection : undefined,
      platform: selectedRetroDevice ? selectedRetroDevice.name : selectedRetroBrand?.name,
      generation: selectedRetroDevice ? selectedRetroDevice.id : undefined,
      brand: brand.trim() || selectedRetroBrand?.name || 'RETRO',
      sellingPrice: Number(sellingPrice),
      salePrice: salePrice ? Number(salePrice) : undefined,
      costPrice: Math.round(Number(sellingPrice) * 0.7),
      stockQty: Number(stockQty) || 1,
      lowStockThreshold,
      condition,
      imageUrl: imageUrl || SAMPLE_IMAGES[0].url,
      descriptionAr: descriptionAr.trim() || 'منتج احترافي عالي الجودة متوفر لدى متجر ريترو.',
      descriptionEn: descriptionEn.trim() || 'High performance professional gaming hardware by RETRO.',
      status,
      specs: {
        Warranty: '2 Years Official',
        Condition: condition,
        Origin: 'Original Sealed',
        ...(selectedRetroDevice ? { platform: selectedRetroDevice.name, generation: selectedRetroDevice.id } : {}),
      },
      productType: selectedRetroBrand || finalCategory === 'Retro Gaming' ? 'RETRO PRODUCT' : productType,
      primaryCategory: selectedRetroBrand ? 'Retro Gaming' : finalCategory,
      secondaryCategory: selectedRetroBrand ? mappedSecondary : undefined,
      categories: [
        finalCategory,
        ...(selectedRetroBrand ? [selectedRetroBrand.name] : []),
        ...(selectedRetroDevice ? [selectedRetroDevice.name] : []),
      ],
      tags: [
        brand,
        finalCategory,
        ...(selectedRetroDevice ? [selectedRetroDevice.id, selectedRetroDevice.name] : []),
      ],
      stockStatus: (Number(stockQty) || 1) > 0 ? 'IN STOCK' : 'OUT OF STOCK',
    };

    addProduct(newProduct);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setNameAr('');
      setNameEn('');
      setSellingPrice('');
      setSalePrice('');
      setDescriptionAr('');
      setDescriptionEn('');
      setStatus('published');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950 p-6 md:p-8 shadow-2xl shadow-cyan-500/10 max-h-[90vh] overflow-y-auto scrollbar-thin">
        
        {/* Neon Ambient Background */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-purple-600/10 blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 rounded-full bg-slate-900/80 p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <CloseIcon size={20} />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-bounce">
              <CheckIcon size={36} />
            </div>
            <h3 className="text-2xl font-black text-white tracking-wide">
              {isRtl ? "تم نشر المنتج بنجاح!" : "Product Published Successfully!"}
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              {isRtl 
                ? "تم إضافة المنتج فوراً للواجهة ونقطة البيع (POS)."
                : "Product added instantly to Storefront & POS system."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header Title */}
            <div className="border-b border-slate-800/80 pb-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-[11px] font-bold text-purple-300 uppercase">
                <SparklesIcon size={12} className="text-purple-400" />
                {isRtl ? "لوحة الإدخال السريع - للمديرين" : "Admin Quick Product Publisher"}
              </div>
              <h2 className="text-2xl font-black text-white tracking-wide mt-2">
                {isRtl ? "إضافة منتج جديد للمتجر" : "Add New Store Product"}
              </h2>
            </div>

            {/* Image Selector / Dropzone */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                {isRtl ? "صورة المنتج (رفع أو اختيار)" : "Product Image (Upload or Pick)"}
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {/* Image Preview */}
                <div className="relative h-32 rounded-2xl border border-cyan-500/30 bg-slate-900 overflow-hidden flex items-center justify-center group">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <UploadIcon size={24} className="mx-auto text-slate-500 mb-1" />
                      <span className="text-[10px] text-slate-500">{isRtl ? "لا توجد صورة" : "No Image"}</span>
                    </div>
                  )}
                </div>

                {/* File Dropzone & Presets */}
                <div className="sm:col-span-2 space-y-3">
                  <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/5 px-4 py-3 text-xs font-bold text-cyan-300 hover:bg-cyan-500/10 transition-all cursor-pointer">
                    <UploadIcon size={16} />
                    <span>
                      {isUploading
                        ? isRtl
                          ? "جاري الرفع..."
                          : "Uploading..."
                        : isRtl
                        ? "اختر صورة من جهازك (سحب وإفلات)"
                        : "Upload File / Drag & Drop"}
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" disabled={isUploading} />
                  </label>

                  {/* Sample presets */}
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1.5">
                      {isRtl ? "أو اختر عينة جاهزة:" : "Or select sample image:"}
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {SAMPLE_IMAGES.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(img.url)}
                          className={`h-10 w-10 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                            imageUrl === img.url ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/30' : 'border-slate-800 opacity-60 hover:opacity-100'
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

            {/* Retro Section & Console Model Assignment (includes newly created sections & subsections!) */}
            <div className="rounded-2xl border border-cyan-500/25 bg-slate-900/50 p-4 space-y-3">
              <div className="text-xs font-bold text-cyan-300">
                🕹️ {isRtl ? "ربط بقسم الريترو وجهاز الكونسول (يدعم الأقسام الحالية والجديدة)" : "Assign to Retro Section & Console Model (Existing & Newly Created)"}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    {isRtl ? "الشركة / السكشن" : "Retro Brand / Section"}
                  </label>
                  <select
                    value={retroBrandId}
                    onChange={(e) => {
                      const nextBrandId = e.target.value;
                      setRetroBrandId(nextBrandId);
                      const bObj = allRetroBrands.find((b) => b.id === nextBrandId);
                      if (bObj) {
                        setBrand(bObj.name);
                        setCategory('Retro Gaming');
                        setRetroDeviceId(bObj.devices[0]?.id || '');
                      } else {
                        setRetroDeviceId('');
                      }
                    }}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="">{isRtl ? "-- منتج عام (غير مرتبط بقسم ريترو) --" : "-- General Store Product --"}</option>
                    {allRetroBrands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {isRtl && b.nameAr ? `${b.nameAr} (${b.name})` : b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    {isRtl ? "موديل الجهاز (القسم الفرعي)" : "Console Model (Subsection)"}
                  </label>
                  <select
                    value={retroDeviceId}
                    disabled={!selectedRetroBrand}
                    onChange={(e) => setRetroDeviceId(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none disabled:opacity-40"
                  >
                    {!selectedRetroBrand ? (
                      <option value="">{isRtl ? "اختر الشركة أولاً" : "Select brand first"}</option>
                    ) : selectedRetroBrand.devices.length === 0 ? (
                      <option value="">{isRtl ? "لا توجد أجهزة مضافة" : "No console models yet"}</option>
                    ) : (
                      selectedRetroBrand.devices.map((d) => (
                        <option key={d.id} value={d.id}>
                          {isRtl && d.nameAr ? `${d.nameAr} (${d.name})` : d.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    {isRtl ? "قسم نوع المنتج" : "Product-Type Section"}
                  </label>
                  <select
                    value={retroKindId}
                    disabled={!selectedRetroBrand}
                    onChange={(e) => setRetroKindId(e.target.value as 'consoles' | 'games' | 'accessories')}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none disabled:opacity-40"
                  >
                    {RETRO_KINDS.map((k) => (
                      <option key={k.id} value={k.id}>
                        {isRtl ? `${k.ar} (${k.en})` : k.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Product Name Arabic */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {isRtl ? "اسم المنتج بالعربية *" : "Arabic Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: جهاز بلايستيشن 2 أو شاشة ألعاب"
                  className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Product Name English */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {isRtl ? "اسم المنتج بالإنجليزية" : "English Name"}
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. PlayStation 2 Slim Console"
                  className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {isRtl ? "الفئة الرئيسية (Category)" : "Primary Category"}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Gaming">Gaming (الألعاب والمنصات)</option>
                  <option value="Retro Gaming">Retro Gaming (ألعاب ريترو الكلاسيكية)</option>
                  <option value="PC">PC Hardware (أجهزة الكمبيوتر والقطع)</option>
                  <option value="Monitors">Monitors (الشاشات)</option>
                  <option value="Accessories">Accessories (الملحقات والأكسسوارات)</option>
                  <option value="Laptops">Laptops (اللابتوبات)</option>
                  <option value="Repair Hub">Repair Hub (خدمات الصيانة)</option>
                  {allRetroBrands.map((b) => (
                    <option key={`cat-${b.id}`} value={b.id}>
                      {b.name} ({b.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {isRtl ? "الماركة / المورد" : "Brand / Vendor"}
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="RETRO, ASUS, MSI, Sony..."
                  className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Selling Price */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {isRtl ? "السعر (ر.ق) *" : "Price (QAR) *"}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 1499"
                  className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Sale Price */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {isRtl ? "سعر العرض / الخصم (اختر إن وجد)" : "Sale Price (Optional)"}
                </label>
                <input
                  type="number"
                  min="1"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 1299"
                  className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Stock Quantity */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {isRtl ? "الكمية بالمخزون" : "Stock Quantity"}
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value ? Number(e.target.value) : '')}
                  className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Condition */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {isRtl ? "حالة المنتج" : "Condition"}
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="NEW">{isRtl ? "جديد (NEW)" : "NEW"}</option>
                  <option value="USED">{isRtl ? "مستعمل (USED)" : "USED"}</option>
                  <option value="REFURBISHED">{isRtl ? "مجدد (REFURBISHED)" : "REFURBISHED"}</option>
                  <option value="OPEN BOX">{isRtl ? "صندوق مفتوح (OPEN BOX)" : "OPEN BOX"}</option>
                  <option value="PRE-OWNED">{isRtl ? "مقتنى سابقاً (PRE-OWNED)" : "PRE-OWNED"}</option>
                </select>
              </div>

              {/* Publish Status */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {isRtl ? "حالة النشر" : "Publish Status"}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="published">{isRtl ? "منزل على الموقع (Published)" : "Live / Published"}</option>
                  <option value="draft">{isRtl ? "مسودة / قيد التنزيل (Draft)" : "Draft / Planned"}</option>
                </select>
              </div>

            </div>

            {/* Brief Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                {isRtl ? "وصف مختصر للمنتج" : "Product Brief Description"}
              </label>
              <textarea
                rows={2}
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                placeholder={isRtl ? "تفاصيل تهم المشتري، المواصفات الرئيسية والضمان..." : "Key highlights, specs & warranty info..."}
                className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] hover:shadow-cyan-500/40 transition-all cursor-pointer"
              >
                <PlusIcon size={16} />
                <span>{isRtl ? "نشر المنتج فوراً" : "Publish Product Now"}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
