/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import {
  RETRO_PC_CATEGORIES,
  findRetroPcNodeByPath,
  flattenRetroPcTree,
  productMatchesRetroPcNode,
  type RetroPcCategoryNode,
} from '@/lib/retro-pc-navigation';
import { useOffersStore } from '@/stores/useOffersStore';
import { useApp } from '@/context/AppContext';
import type { Product } from '@/types';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

function CategoryCardImage({
  src,
  name,
  ar,
}: {
  src?: string;
  name: string;
  ar: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-slate-500 select-none px-3">
        <span className="text-4xl opacity-60 transition duration-200 group-hover:scale-110 group-hover:opacity-90">
          🖥️
        </span>
        <span className="text-center text-xs text-slate-400 font-semibold line-clamp-2">
          {name}
        </span>
        <span className="text-center text-[11px] text-slate-600">
          {ar ? 'صورة القسم قريباً' : 'Image coming soon'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-contain transition duration-200 group-hover:scale-105"
    />
  );
}

interface RetroPcClientProps {
  locale: Locale;
  serverProducts: Product[];
  serverCategories?: RetroPcCategoryNode[];
  dict: Dictionary;
}

export default function RetroPcClient({
  locale,
  serverProducts,
  serverCategories,
  dict,
}: RetroPcClientProps) {
  const ar = locale === 'ar';
  const router = useRouter();
  const searchParams = useSearchParams();

  const retroPcCategories = useOffersStore((s) => s.retroPcCategories);
  const { products: clientProducts } = useApp();

  useEffect(() => {
    useOffersStore.getState().initializeFromCloud();
  }, []);

  const treeRoots = useMemo(() => {
    const base =
      retroPcCategories && retroPcCategories.length > 0
        ? retroPcCategories
        : serverCategories && serverCategories.length > 0
        ? serverCategories
        : RETRO_PC_CATEGORIES;
    return base.filter((c) => !c.hidden);
  }, [retroPcCategories, serverCategories]);

  const allPcNodeIds = useMemo(() => {
    const flat = flattenRetroPcTree(
      retroPcCategories && retroPcCategories.length > 0
        ? retroPcCategories
        : serverCategories && serverCategories.length > 0
        ? serverCategories
        : RETRO_PC_CATEGORIES,
      ar ? 'ar' : 'en'
    );
    return new Set(flat.map((item) => item.node.id.toLowerCase()));
  }, [retroPcCategories, serverCategories, ar]);

  // Parse current path from ?path=processors/intel/core-i7
  const pathParam = searchParams.get('path') || '';
  const pathSegments = useMemo(
    () =>
      pathParam
        .split('/')
        .map((s) => s.trim())
        .filter(Boolean),
    [pathParam]
  );

  const { current: currentNode, breadcrumbs } = useMemo(
    () => findRetroPcNodeByPath(treeRoots, pathSegments),
    [treeRoots, pathSegments]
  );

  const activeChildren = useMemo(() => {
    if (!currentNode) return treeRoots;
    return (currentNode.children || []).filter((child) => !child.hidden);
  }, [currentNode, treeRoots]);

  // Merge server & real-time client products from Supabase (deduplicated by SKU/ID)
  const mergedProducts = useMemo(() => {
    const map = new Map<string, Product>();
    for (const sp of serverProducts) {
      const key = (sp.sku || sp.id).trim().toUpperCase();
      map.set(key, sp);
    }
    if (clientProducts && clientProducts.length > 0) {
      for (const cp of clientProducts) {
        const key = (cp.sku || cp.id).trim().toUpperCase();
        map.set(key, cp as unknown as Product);
      }
    }
    return Array.from(map.values());
  }, [serverProducts, clientProducts]);

  // Products matching the current node & breadcrumb trail
  const matchingProducts = useMemo(() => {
    if (!currentNode || breadcrumbs.length === 0) return [];
    return mergedProducts.filter(
      (p) =>
        p.status !== 'draft' &&
        productMatchesRetroPcNode(p, breadcrumbs, allPcNodeIds)
    );
  }, [mergedProducts, currentNode, breadcrumbs, allPcNodeIds]);

  // Products directly assigned to this non-leaf category that don't match any child subcategory
  const directParentProducts = useMemo(() => {
    if (!currentNode || activeChildren.length === 0) return [];
    return matchingProducts.filter(
      (p) =>
        !activeChildren.some((child) =>
          productMatchesRetroPcNode(p, [...breadcrumbs, child], allPcNodeIds)
        )
    );
  }, [currentNode, activeChildren, matchingProducts, breadcrumbs, allPcNodeIds]);

  const navigateToPath = (segments: string[]) => {
    if (segments.length === 0) {
      router.push(`/${locale}/retro-pc`);
    } else {
      const encoded = segments.map((s) => encodeURIComponent(s)).join('/');
      router.push(`/${locale}/retro-pc?path=${encoded}`);
    }
  };

  const handleBack = () => {
    if (breadcrumbs.length <= 1) {
      router.push(`/${locale}/retro-pc`);
    } else {
      const parentSegments = breadcrumbs.slice(0, -1).map((b) => b.id);
      navigateToPath(parentSegments);
    }
  };

  const handleSelectNode = (node: RetroPcCategoryNode) => {
    const nextSegments = [...breadcrumbs.map((b) => b.id), node.id];
    navigateToPath(nextSegments);
  };

  const getDisplayName = (node: RetroPcCategoryNode) =>
    ar && node.nameAr ? node.nameAr : node.name;

  const currentTitle = currentNode
    ? getDisplayName(currentNode)
    : ar
    ? 'اختر القسم الرئيسي'
    : 'Choose a PC Category';

  const currentSubtitle = !currentNode
    ? ar
      ? 'اختر القسم الرئيسي ثم الشركة والموديل لتصفح القطع والتجميعات'
      : 'Select a hardware category, then choose brand and series'
    : activeChildren.length > 0
    ? ar
      ? currentNode.descriptionAr || 'اختر الشركة أو الفئة الفرعية للمتابعة'
      : currentNode.descriptionEn || 'Select a brand or series to continue'
    : ar
    ? `المنتجات المتوفرة في قسم ${getDisplayName(currentNode)}`
    : `Available products in ${getDisplayName(currentNode)}`;

  return (
    <main
      dir={ar ? 'rtl' : 'ltr'}
      className="mx-auto max-w-7xl px-4 py-12 sm:px-7 sm:py-16 min-h-[75vh]"
    >
      {/* Top Bar: Back Button & Store/PC Builder Links */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={handleBack}
          className={`text-sm font-semibold text-cyan-300 hover:underline cursor-pointer ${
            currentNode ? 'visible' : 'invisible'
          }`}
          disabled={!currentNode}
        >
          {ar ? '← رجوع' : '← Back'}
        </button>

        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/pc-builder`}
            className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-3.5 py-1.5 text-xs font-extrabold text-cyan-300 transition hover:bg-cyan-400 hover:text-slate-950"
          >
            {ar ? '🛠️ صمّم تجميعتك (PC Builder)' : '🛠️ PC Builder'}
          </Link>
          <Link
            href={`/${locale}`}
            className="text-sm text-cyan-300 hover:underline"
          >
            {ar ? 'اختيار المتجر' : 'Choose store'}
          </Link>
        </div>
      </div>

      {/* Interactive Breadcrumb Trail */}
      {breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm text-slate-400"
        >
          <button
            type="button"
            onClick={() => navigateToPath([])}
            className="hover:text-cyan-300 transition cursor-pointer font-semibold"
          >
            Retro PC
          </button>
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            const segs = breadcrumbs.slice(0, idx + 1).map((b) => b.id);
            return (
              <span key={crumb.id} className="inline-flex items-center gap-1.5">
                <span className="text-slate-600">/</span>
                {isLast ? (
                  <span className="font-bold text-cyan-300">
                    {getDisplayName(crumb)}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigateToPath(segs)}
                    className="hover:text-cyan-300 transition cursor-pointer"
                  >
                    {getDisplayName(crumb)}
                  </button>
                )}
              </span>
            );
          })}
        </nav>
      )}

      {/* Section Title Header (Matching Retro Section) */}
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[.3em] font-bold text-cyan-400">
          RETRO PC QATAR
        </p>
        <h1 className="mt-4 text-3xl md:text-5xl font-black text-white">
          {currentTitle}
        </h1>
        <p className="mt-3 text-slate-400">{currentSubtitle}</p>
      </div>

      {/* Subcategories / Main Categories Square Image Cards Grid */}
      {activeChildren.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {activeChildren.map((child) => {
            const cName = getDisplayName(child);
            const secondaryLabel =
              ar && child.nameAr && child.name !== child.nameAr
                ? child.name
                : '';
            return (
              <button
                key={child.id}
                type="button"
                onClick={() => handleSelectNode(child)}
                aria-label={cName}
                className="group flex flex-col rounded-2xl border border-white/10 bg-slate-900/70 overflow-hidden transition duration-200 hover:border-cyan-400 hover:-translate-y-1 hover:shadow-[0_10px_36px_rgba(0,205,240,.12)] focus-visible:outline-2 focus-visible:outline-cyan-400 cursor-pointer"
              >
                <div className="aspect-square w-full flex items-center justify-center bg-black p-5 border-b border-white/10">
                  <CategoryCardImage
                    key={child.image || child.id}
                    src={child.image}
                    name={cName}
                    ar={ar}
                  />
                </div>
                <div className="py-4 px-3 text-center flex-1 flex flex-col items-center justify-center">
                  <div className="text-white font-bold text-sm sm:text-base group-hover:text-cyan-300 transition">
                    {cName}
                  </div>
                  {secondaryLabel && (
                    <div className="mt-0.5 text-[11px] text-slate-400 line-clamp-1">
                      {secondaryLabel}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Leaf Category Products View (or Direct Products on Parent Node) */}
      {currentNode && activeChildren.length === 0 && (
        <div className="mt-4">
          {matchingProducts.length > 0 ? (
            <ProductGrid
              products={matchingProducts}
              dict={dict}
              locale={locale}
            />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-10 text-center text-slate-300">
              <p className="text-base font-bold text-white mb-2">
                {ar
                  ? 'لا توجد منتجات مصنفة في هذا القسم حالياً.'
                  : 'No products are classified in this category yet.'}
              </p>
              <p className="text-xs text-slate-400">
                {ar
                  ? 'يمكنك إضافة أو ربط المنتجات بهذا القسم مباشرة من لوحة التحكم.'
                  : 'You can assign or add products to this category directly from the Admin Dashboard.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* If a non-leaf category also has products directly assigned to it */}
      {currentNode &&
        activeChildren.length > 0 &&
        directParentProducts.length > 0 && (
          <div className="mt-14 pt-10 border-t border-white/10">
            <h2 className="mb-6 text-xl font-black text-white">
              {ar
                ? `منتجات أخرى في ${getDisplayName(currentNode)}`
                : `Other Products in ${getDisplayName(currentNode)}`}
            </h2>
            <ProductGrid
              products={directParentProducts}
              dict={dict}
              locale={locale}
            />
          </div>
        )}
    </main>
  );
}

