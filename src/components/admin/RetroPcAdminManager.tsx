/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useMemo, useState } from 'react';
import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  EyeIcon,
  EyeOffIcon,
  UploadIcon,
  CloseIcon,
  SearchIcon,
  CheckIcon,
} from '@/components/Icons';
import { useOffersStore } from '@/stores/useOffersStore';
import {
  RETRO_PC_CATEGORIES,
  findRetroPcNodeByPath,
  findRetroPcNodeWithTrailById,
  flattenRetroPcTree,
  collectSubtreeIds,
  productMatchesRetroPcNode,
  type RetroPcCategoryNode,
} from '@/lib/retro-pc-navigation';
import { uploadImageToSupabase, sanitizeImageUrl } from '@/lib/supabase';
import type { Product } from '@/types';

interface RetroPcAdminManagerProps {
  isRtl: boolean;
  products: Product[];
  updateProduct: (id: string, updates: Partial<Product>) => void;
  onOpenQuickAddProduct: (retroPcCategoryId: string) => void;
  onEditProduct?: (product: Product) => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function RetroPcAdminManager({
  isRtl,
  products,
  updateProduct,
  onOpenQuickAddProduct,
  onEditProduct,
  showToast,
}: RetroPcAdminManagerProps) {
  const {
    retroPcCategories,
    addRetroPcCategory,
    updateRetroPcCategory,
    deleteRetroPcCategory,
    toggleHideRetroPcCategory,
    reorderRetroPcCategory,
    moveRetroPcCategory,
    updateRetroPcCategoryImage,
    resetRetroPcCategoryImage,
  } = useOffersStore();

  const treeRoots = useMemo(
    () =>
      retroPcCategories && retroPcCategories.length > 0
        ? retroPcCategories
        : RETRO_PC_CATEGORIES,
    [retroPcCategories]
  );

  const flatAllNodes = useMemo(
    () => flattenRetroPcTree(treeRoots, isRtl ? 'ar' : 'en'),
    [treeRoots, isRtl]
  );

  const allPcNodeIds = useMemo(
    () => new Set(flatAllNodes.map((item) => item.node.id.toLowerCase())),
    [flatAllNodes]
  );

  // Current drill-down path of category IDs (empty = Main Categories root)
  const [adminPath, setAdminPath] = useState<string[]>([]);

  const { current: currentNode, breadcrumbs } = useMemo(
    () => findRetroPcNodeByPath(treeRoots, adminPath),
    [treeRoots, adminPath]
  );

  const currentLevelNodes = useMemo(() => {
    if (!currentNode) return treeRoots;
    return currentNode.children || [];
  }, [currentNode, treeRoots]);

  // Modal State: Add / Edit Category or Subcategory at any depth
  const [catFormModal, setCatFormModal] = useState<{
    mode: 'add' | 'edit';
    parentId: string | null;
    id: string;
    name: string;
    nameAr: string;
    descriptionEn: string;
    descriptionAr: string;
    tokensText: string;
    image: string;
  } | null>(null);

  // Modal State: Direct Image URL input
  const [urlModal, setUrlModal] = useState<{
    nodeId: string;
    nodeName: string;
    currentUrl: string;
  } | null>(null);
  const [tempUrl, setTempUrl] = useState('');

  // Modal State: Move Category to another parent (or root)
  const [moveModal, setMoveModal] = useState<{
    nodeId: string;
    nodeName: string;
    currentParentId: string | null;
    targetParentId: string;
  } | null>(null);

  // Modal State: Assign / Unassign Store Products to a Category Node
  const [assignModalNodeId, setAssignModalNodeId] = useState<string | null>(null);
  const [assignSearch, setAssignSearch] = useState('');

  const handleBack = () => {
    if (breadcrumbs.length <= 1) {
      setAdminPath([]);
    } else {
      setAdminPath(breadcrumbs.slice(0, -1).map((b) => b.id));
    }
  };

  const countProductsForTrail = (trail: RetroPcCategoryNode[]) => {
    return products.filter(
      (p) =>
        p.status !== 'draft' &&
        productMatchesRetroPcNode(p, trail, allPcNodeIds)
    ).length;
  };

  const currentMatchingProducts = useMemo(() => {
    if (!currentNode || breadcrumbs.length === 0) return [];
    return products.filter((p) =>
      productMatchesRetroPcNode(p, breadcrumbs, allPcNodeIds)
    );
  }, [products, currentNode, breadcrumbs, allPcNodeIds]);

  const assignTargetTrail = useMemo(() => {
    if (!assignModalNodeId) return null;
    return findRetroPcNodeWithTrailById(treeRoots, assignModalNodeId);
  }, [treeRoots, assignModalNodeId]);

  const handleToggleProductAssignment = (
    product: Product,
    targetTrail: { current: RetroPcCategoryNode; breadcrumbs: RetroPcCategoryNode[] }
  ) => {
    const targetId = targetTrail.current.id;
    const rootId = targetTrail.breadcrumbs[0]?.id || 'pc';
    const isCurrentlyMatched = productMatchesRetroPcNode(
      product,
      targetTrail.breadcrumbs,
      allPcNodeIds
    );

    if (isCurrentlyMatched) {
      // Unassign from this node
      const nextCategories = (product.categories || []).filter(
        (c) => c.toLowerCase() !== targetId.toLowerCase()
      );
      updateProduct(product.id, {
        subCategory:
          product.subCategory?.toLowerCase() === targetId.toLowerCase()
            ? 'unassigned-pc'
            : product.subCategory,
        secondaryCategory:
          product.secondaryCategory?.toLowerCase() === targetId.toLowerCase()
            ? ''
            : product.secondaryCategory,
        categories: nextCategories,
      });
      if (showToast) {
        showToast(
          isRtl
            ? `تم إلغاء ربط "${product.nameAr || product.nameEn}" من القسم`
            : `Unassigned "${product.nameEn}" from category`,
          'info'
        );
      }
    } else {
      // Assign to this node (using stable node IDs so renaming/moving never breaks assignment)
      const trailIds = targetTrail.breadcrumbs.map((b) => b.id);
      const nextCategories = Array.from(
        new Set([...(product.categories || []), 'PC', ...trailIds])
      );
      updateProduct(product.id, {
        category: rootId,
        mainCategory: rootId,
        subCategory: targetId,
        primaryCategory: 'PC',
        secondaryCategory: targetId,
        source: 'PC',
        categories: nextCategories,
      });
      if (showToast) {
        showToast(
          isRtl
            ? `تم ربط "${product.nameAr || product.nameEn}" بقسم "${targetTrail.current.nameAr || targetTrail.current.name}"`
            : `Assigned "${product.nameEn}" to "${targetTrail.current.name}"`,
          'success'
        );
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/25 to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-black text-cyan-300 uppercase">
              <span>🖥️</span>
              <span>
                {isRtl
                  ? 'نظام إدارة أقسام وفئات Retro PC الديناميكي'
                  : 'Retro PC Dynamic Category & Subcategory System'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {!currentNode
                ? isRtl
                  ? 'الأقسام الرئيسية لـ Retro PC'
                  : 'Main Retro PC Categories'
                : isRtl
                ? `${currentNode.nameAr || currentNode.name} (${currentNode.name})`
                : `${currentNode.name} ${currentNode.nameAr ? `(${currentNode.nameAr})` : ''}`}
            </h3>
            <p className="text-xs text-slate-400 max-w-3xl">
              {isRtl
                ? 'تحكم كامل بجميع المستويات (القسم الرئيسي ← الشركة ← السلسلة / الموديل ← المنتجات). يمكنك إضافة أقسام فرعية بلا حدود، رفع الصور، تعديل الأسماء بالعربية والإنجليزية، إعادة الترتيب، النقل، وربط المنتجات.'
                : 'Manage all hierarchy levels (Main Category → Brand → Series / Model → Products). Create unlimited nested subcategories, upload images, rename in EN/AR, reorder, move, hide/enable, and assign products.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={
                breadcrumbs.length > 0
                  ? `/${isRtl ? 'ar' : 'en'}/retro-pc?path=${breadcrumbs
                      .map((b) => encodeURIComponent(b.id))
                      .join('/')}`
                  : `/${isRtl ? 'ar' : 'en'}/retro-pc`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all"
            >
              <span>👁️</span>
              <span>{isRtl ? 'معاينة في المتجر' : 'Preview in Store'}</span>
            </a>

            <button
              type="button"
              onClick={() =>
                setCatFormModal({
                  mode: 'add',
                  parentId: currentNode ? currentNode.id : null,
                  id: '',
                  name: '',
                  nameAr: '',
                  descriptionEn: '',
                  descriptionAr: '',
                  tokensText: '',
                  image: '',
                })
              }
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
            >
              <PlusIcon size={15} />
              <span>
                {!currentNode
                  ? isRtl
                    ? '+ إضافة قسم رئيسي جديد'
                    : '+ Add Main Category'
                  : isRtl
                  ? `+ إضافة قسم فرعي داخل "${currentNode.nameAr || currentNode.name}"`
                  : `+ Add Subcategory in "${currentNode.name}"`}
              </span>
            </button>

            {currentNode && (
              <>
                <button
                  type="button"
                  onClick={() => setAssignModalNodeId(currentNode.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/15 hover:bg-purple-500/25 px-3.5 py-2 text-xs font-bold text-purple-300 transition-all cursor-pointer"
                >
                  <span>🔗</span>
                  <span>
                    {isRtl
                      ? `ربط منتجات حالية (${currentMatchingProducts.length})`
                      : `Assign Products (${currentMatchingProducts.length})`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenQuickAddProduct(currentNode.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 px-3.5 py-2 text-xs font-bold text-emerald-300 transition-all cursor-pointer"
                >
                  <PlusIcon size={14} />
                  <span>{isRtl ? 'إضافة منتج جديد هنا' : 'Add Product Here'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation Bar: Back Button + Interactive Breadcrumb Trail */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {currentNode && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-1.5 text-xs font-black text-cyan-300 transition-all cursor-pointer"
              >
                <span>{isRtl ? '← رجوع للمستوى السابق' : '← Back'}</span>
              </button>
            )}

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setAdminPath([])}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  !currentNode
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300'
                }`}
              >
                🖥️ {isRtl ? 'الرئيسية (Retro PC)' : 'Retro PC Root'}
              </button>

              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                const segs = breadcrumbs.slice(0, idx + 1).map((b) => b.id);
                return (
                  <React.Fragment key={crumb.id}>
                    <span className="text-slate-600 font-bold">/</span>
                    <button
                      type="button"
                      onClick={() => setAdminPath(segs)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        isLast
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300'
                      }`}
                    >
                      {isRtl && crumb.nameAr ? crumb.nameAr : crumb.name}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            {isRtl
              ? `المستوى الحالي: ${breadcrumbs.length === 0 ? 'الأقسام الرئيسية (1)' : `المستوى الفرعي (${breadcrumbs.length + 1})`} • عدد الأقسام هنا: ${currentLevelNodes.length}`
              : `Current Depth: Level ${breadcrumbs.length + 1} • Categories at this level: ${currentLevelNodes.length}`}
          </div>
        </div>
      </div>

      {/* Category / Subcategory Cards Grid at Current Level */}
      {currentLevelNodes.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center space-y-4">
          <div className="text-3xl">📂</div>
          <div className="space-y-1">
            <h4 className="text-base font-black text-white">
              {isRtl
                ? `لا توجد أقسام فرعية داخل "${currentNode?.nameAr || currentNode?.name || 'Retro PC'}" حالياً`
                : `No subcategories inside "${currentNode?.name || 'Retro PC'}" yet`}
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {isRtl
                ? 'هذا القسم يعمل الآن كقسم نهائي يعرض المنتجات مباشرة للعميل. يمكنك إضافة أقسام فرعية جديدة داخله (مثل الشركات أو الموديلات) أو ربط المنتجات به مباشرة.'
                : 'This category currently acts as a leaf category displaying products directly. You can add nested subcategories (brands/models) or assign products directly.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                setCatFormModal({
                  mode: 'add',
                  parentId: currentNode ? currentNode.id : null,
                  id: '',
                  name: '',
                  nameAr: '',
                  descriptionEn: '',
                  descriptionAr: '',
                  tokensText: '',
                  image: '',
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-black text-slate-950 hover:bg-cyan-400 transition-all cursor-pointer"
            >
              <PlusIcon size={15} />
              <span>
                {isRtl ? '+ إضافة قسم فرعي هنا' : '+ Add Subcategory Here'}
              </span>
            </button>

            {currentNode && (
              <button
                type="button"
                onClick={() => onOpenQuickAddProduct(currentNode.id)}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-5 py-2.5 text-xs font-black text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer"
              >
                <PlusIcon size={15} />
                <span>
                  {isRtl ? '+ إضافة منتج جديد لهذا القسم' : '+ Add Product Here'}
                </span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {currentLevelNodes.map((node, idx) => {
            const nodeTrail = [...breadcrumbs, node];
            const nodeProductCount = countProductsForTrail(nodeTrail);
            const childCount = (node.children || []).length;
            const defaultMatch = findRetroPcNodeWithTrailById(
              RETRO_PC_CATEGORIES,
              node.id
            );
            const cleanImg = sanitizeImageUrl(
              node.image,
              defaultMatch?.current.image || ''
            );

            return (
              <div
                key={node.id}
                className={`group flex flex-col justify-between rounded-2xl border p-4 transition-all duration-300 ${
                  node.hidden
                    ? 'border-amber-500/30 bg-slate-950/70 opacity-65'
                    : 'border-slate-800 bg-slate-900/60 hover:border-cyan-500/40'
                }`}
              >
                <div>
                  {/* Top Control Strip: Reorder, ID, Hide, Move, Edit, Delete */}
                  <div className="flex items-center justify-between gap-1 mb-2.5 pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => reorderRetroPcCategory(node.id, 'up')}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold disabled:opacity-30 cursor-pointer"
                        title={isRtl ? 'تحريك للأمام' : 'Move up'}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={idx === currentLevelNodes.length - 1}
                        onClick={() => reorderRetroPcCategory(node.id, 'down')}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold disabled:opacity-30 cursor-pointer"
                        title={isRtl ? 'تحريك للخلف' : 'Move down'}
                      >
                        ↓
                      </button>
                      <span
                        className="text-[10px] font-mono text-slate-500 px-1 truncate max-w-[90px]"
                        title={node.id}
                      >
                        {node.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleHideRetroPcCategory(node.id)}
                        className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                          node.hidden
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-cyan-400'
                        }`}
                        title={
                          node.hidden
                            ? isRtl
                              ? 'إظهار القسم'
                              : 'Enable category'
                            : isRtl
                            ? 'إخفاء القسم'
                            : 'Hide category'
                        }
                      >
                        {node.hidden ? (
                          <EyeOffIcon size={13} />
                        ) : (
                          <EyeIcon size={13} />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setMoveModal({
                            nodeId: node.id,
                            nodeName: isRtl && node.nameAr ? node.nameAr : node.name,
                            currentParentId: currentNode ? currentNode.id : null,
                            targetParentId: currentNode ? currentNode.id : '',
                          })
                        }
                        className="px-1.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-purple-300 text-[10px] font-bold transition-all cursor-pointer"
                        title={
                          isRtl
                            ? 'نقل القسم إلى قسم رئيسي أو فرعي آخر'
                            : 'Move category to another parent'
                        }
                      >
                        ⇄
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setCatFormModal({
                            mode: 'edit',
                            parentId: currentNode ? currentNode.id : null,
                            id: node.id,
                            name: node.name,
                            nameAr: node.nameAr || '',
                            descriptionEn: node.descriptionEn || '',
                            descriptionAr: node.descriptionAr || '',
                            tokensText: (node.tokens || []).join(', '),
                            image: cleanImg,
                          })
                        }
                        className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-400 transition-all cursor-pointer"
                        title={isRtl ? 'تعديل الاسم والبيانات' : 'Edit category'}
                      >
                        <EditIcon size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const msg = isRtl
                            ? `هل أنت متأكد من حذف قسم "${node.nameAr || node.name}"؟`
                            : `Are you sure you want to delete "${node.name}"?`;
                          if (window.confirm(msg)) {
                            deleteRetroPcCategory(node.id);
                            if (showToast) {
                              showToast(
                                isRtl
                                  ? `تم حذف قسم "${node.nameAr || node.name}"`
                                  : `Deleted "${node.name}"`,
                                'info'
                              );
                            }
                          }
                        }}
                        className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/25 text-pink-400 hover:bg-pink-500/20 transition-all cursor-pointer"
                        title={isRtl ? 'حذف القسم' : 'Delete category'}
                      >
                        <TrashIcon size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Category Bilingual Names & Counters */}
                  <div className="mb-3 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-black text-white line-clamp-1">
                        {isRtl ? node.nameAr || node.name : node.name}
                      </h4>
                      {node.hidden && (
                        <span className="text-[9px] font-black text-amber-300 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded-full shrink-0">
                          {isRtl ? 'مخفي' : 'Hidden'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {isRtl ? node.name : node.nameAr}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/25 px-2 py-0.5 rounded-md">
                        📂 {childCount}{' '}
                        {isRtl ? 'أقسام فرعية' : 'subcategories'}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/25 px-2 py-0.5 rounded-md">
                        📦 {nodeProductCount} {isRtl ? 'منتج' : 'products'}
                      </span>
                    </div>
                  </div>

                  {/* Square Image Preview (clicking drills down into subcategories) */}
                  <div
                    onClick={() =>
                      setAdminPath([...breadcrumbs.map((b) => b.id), node.id])
                    }
                    className="relative aspect-square w-full rounded-xl bg-black border border-slate-800/90 flex items-center justify-center p-4 overflow-hidden shadow-inner cursor-pointer"
                    title={
                      isRtl
                        ? 'اضغط للدخول إلى الأقسام الفرعية والمنتجات داخل هذا القسم'
                        : 'Click to open subcategories and products inside this category'
                    }
                  >
                    {cleanImg ? (
                      <img
                        src={cleanImg}
                        alt={node.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src =
                            defaultMatch?.current.image || '/media/image61.jpeg';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-slate-500">
                        <span className="text-3xl">🖥️</span>
                        <span className="text-[11px]">
                          {isRtl ? 'بدون صورة حالياً' : 'No image set'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Image Upload / URL / Reset Controls */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/25 text-xs font-bold cursor-pointer transition-all text-center active:scale-95">
                      <UploadIcon size={14} />
                      <span>{isRtl ? 'رفع صورة' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (showToast) {
                            showToast(
                              isRtl
                                ? `جاري رفع صورة ${node.nameAr || node.name}...`
                                : `Uploading image for ${node.name}...`,
                              'info'
                            );
                          }
                          try {
                            const publicUrl = await uploadImageToSupabase(
                              file,
                              'sections'
                            );
                            if (publicUrl) {
                              updateRetroPcCategoryImage(node.id, publicUrl);
                              if (showToast) {
                                showToast(
                                  isRtl
                                    ? `تم تحديث صورة ${node.nameAr || node.name}`
                                    : `Updated image for ${node.name}`,
                                  'success'
                                );
                              }
                            } else {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  updateRetroPcCategoryImage(
                                    node.id,
                                    reader.result
                                  );
                                  if (showToast) {
                                    showToast(
                                      isRtl
                                        ? `تم حفظ صورة ${node.nameAr || node.name}`
                                        : `Saved image for ${node.name}`,
                                      'success'
                                    );
                                  }
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          } catch {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                updateRetroPcCategoryImage(
                                  node.id,
                                  reader.result
                                );
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
                        setUrlModal({
                          nodeId: node.id,
                          nodeName: isRtl && node.nameAr ? node.nameAr : node.name,
                          currentUrl: cleanImg,
                        });
                        setTempUrl(cleanImg);
                      }}
                      className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                      title={isRtl ? 'رابط صورة مباشر' : 'Image URL'}
                    >
                      🔗
                    </button>

                    {cleanImg && (
                      <button
                        type="button"
                        onClick={() => {
                          resetRetroPcCategoryImage(node.id);
                          if (showToast) {
                            showToast(
                              isRtl
                                ? `تم استعادة الصورة الافتراضية لـ ${node.nameAr || node.name}`
                                : `Reset image for ${node.name}`,
                              'info'
                            );
                          }
                        }}
                        className="px-2.5 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/25 text-xs font-bold transition-all cursor-pointer"
                        title={isRtl ? 'استعادة الصورة الأصلية' : 'Reset image'}
                      >
                        ↺
                      </button>
                    )}
                  </div>
                </div>

                {/* Drill-Down & Product Management Footer */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                  <button
                    type="button"
                    onClick={() =>
                      setAdminPath([...breadcrumbs.map((b) => b.id), node.id])
                    }
                    className="w-full py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>📂</span>
                    <span>
                      {isRtl
                        ? `فتح وإدارة الأقسام الفرعية (${childCount})`
                        : `Manage Subcategories (${childCount})`}
                    </span>
                  </button>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCatFormModal({
                          mode: 'add',
                          parentId: node.id,
                          id: '',
                          name: '',
                          nameAr: '',
                          descriptionEn: '',
                          descriptionAr: '',
                          tokensText: '',
                          image: '',
                        })
                      }
                      className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      + {isRtl ? 'قسم فرعي' : 'Subcategory'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssignModalNodeId(node.id)}
                      className="py-1.5 px-2 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      🔗 {isRtl ? `المنتجات (${nodeProductCount})` : `Products (${nodeProductCount})`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Products in Current Category Preview Table (when inside any category) */}
      {currentNode && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-black text-white">
                {isRtl
                  ? `المنتجات المصنفة تحت "${currentNode.nameAr || currentNode.name}" (${currentMatchingProducts.length})`
                  : `Products Assigned to "${currentNode.name}" (${currentMatchingProducts.length})`}
              </h4>
              <p className="text-xs text-slate-400">
                {isRtl
                  ? 'تظهر هذه المنتجات تلقائياً في المتجر عند تصفح هذا القسم. لا تختفي المنتجات عند تغيير اسم القسم أو نقله.'
                  : 'These products automatically appear under this category on the storefront and persist across category renames or reorganizations.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAssignModalNodeId(currentNode.id)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 px-3.5 py-2 text-xs font-bold text-purple-300 transition-all cursor-pointer"
              >
                <span>🔗</span>
                <span>
                  {isRtl ? 'تعيين أو إزالة منتجات' : 'Assign / Unassign Products'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onOpenQuickAddProduct(currentNode.id)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 px-3.5 py-2 text-xs font-bold text-emerald-300 transition-all cursor-pointer"
              >
                <PlusIcon size={14} />
                <span>{isRtl ? 'إضافة منتج جديد' : 'Add New Product'}</span>
              </button>
            </div>
          </div>

          {currentMatchingProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-400">
              {isRtl
                ? 'لا توجد منتجات مرتبطة بهذا القسم بعد. اضغط على "تعيين أو إزالة منتجات" أو "إضافة منتج جديد".'
                : 'No products assigned to this category yet. Click "Assign / Unassign Products" or "Add New Product".'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentMatchingProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-black border border-slate-800 p-1 flex items-center justify-center overflow-hidden">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl}
                          alt={prod.nameEn}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-lg">📦</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {isRtl ? prod.nameAr || prod.nameEn : prod.nameEn}
                      </div>
                      <div className="text-[11px] text-cyan-400 font-bold">
                        {prod.sellingPrice} QAR •{' '}
                        <span className="text-slate-400">
                          {isRtl ? `المخزون: ${prod.stockQty}` : `Stock: ${prod.stockQty}`}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        {prod.sku}
                      </div>
                    </div>
                  </div>

                  {onEditProduct && (
                    <button
                      type="button"
                      onClick={() => onEditProduct(prod)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 shrink-0 cursor-pointer"
                      title={isRtl ? 'تعديل المنتج' : 'Edit Product'}
                    >
                      <EditIcon size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MODAL 1: Add / Edit Retro PC Category / Subcategory ── */}
      {catFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-500/30 bg-slate-900 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-black text-white">
                  {catFormModal.mode === 'add'
                    ? !catFormModal.parentId
                      ? isRtl
                        ? 'إضافة قسم رئيسي جديد في Retro PC'
                        : 'Add New Main Category (Retro PC)'
                      : isRtl
                      ? 'إضافة قسم فرعي / شركة / سلسلة موديلات'
                      : 'Add Nested Subcategory / Brand / Series'
                    : isRtl
                    ? 'تعديل بيانات القسم'
                    : 'Edit Category Details'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {isRtl
                    ? 'تغيير اسم القسم لن يؤدي إلى اختفاء المنتجات المرتبطة به.'
                    : 'Renaming a category preserves its ID so assigned products never disappear.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCatFormModal(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const cleanEn =
                  catFormModal.name.trim() || catFormModal.nameAr.trim();
                const cleanAr = catFormModal.nameAr.trim() || cleanEn;
                if (!cleanEn) return;

                const cleanId =
                  catFormModal.mode === 'edit'
                    ? catFormModal.id
                    : (catFormModal.id.trim() || cleanEn)
                        .toLowerCase()
                        .replace(/[^a-z0-9_-]+/g, '-')
                        .replace(/^-+|-+$/g, '') || `pc-cat-${Date.now()}`;

                const parsedTokens = catFormModal.tokensText
                  .split(',')
                  .map((t) => t.trim().toLowerCase())
                  .filter(Boolean);
                const finalTokens = Array.from(
                  new Set([
                    ...parsedTokens,
                    cleanId.toLowerCase(),
                    cleanEn.toLowerCase(),
                  ])
                );

                if (catFormModal.mode === 'add') {
                  addRetroPcCategory(catFormModal.parentId, {
                    id: cleanId,
                    name: cleanEn,
                    nameAr: cleanAr,
                    descriptionEn: catFormModal.descriptionEn.trim() || undefined,
                    descriptionAr: catFormModal.descriptionAr.trim() || undefined,
                    image: catFormModal.image.trim(),
                    tokens: finalTokens,
                    children: [],
                  });
                  if (showToast) {
                    showToast(
                      isRtl
                        ? `تمت إضافة قسم "${cleanAr}" بنجاح!`
                        : `Added category "${cleanEn}" successfully!`,
                      'success'
                    );
                  }
                } else {
                  updateRetroPcCategory(cleanId, {
                    name: cleanEn,
                    nameAr: cleanAr,
                    descriptionEn: catFormModal.descriptionEn.trim() || undefined,
                    descriptionAr: catFormModal.descriptionAr.trim() || undefined,
                    image: catFormModal.image.trim(),
                    tokens: finalTokens,
                  });
                  if (showToast) {
                    showToast(
                      isRtl
                        ? `تم تحديث قسم "${cleanAr}" بنجاح!`
                        : `Updated category "${cleanEn}" successfully!`,
                      'success'
                    );
                  }
                }
                setCatFormModal(null);
              }}
              className="space-y-4 text-xs"
            >
              {catFormModal.mode === 'add' && (
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    {isRtl ? 'القسم الأب (المستوى الأعلى)' : 'Parent Category'}
                  </label>
                  <select
                    value={catFormModal.parentId || ''}
                    onChange={(e) =>
                      setCatFormModal({
                        ...catFormModal,
                        parentId: e.target.value || null,
                      })
                    }
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="">
                      {isRtl
                        ? '🏠 قسم رئيسي في المستوى الأول (Root Main Category)'
                        : '🏠 Root Main Category (Level 1)'}
                    </option>
                    {flatAllNodes.map((opt) => (
                      <option key={opt.node.id} value={opt.node.id}>
                        {'\u00A0'.repeat(opt.depth * 3)}
                        {opt.depth > 0 ? '↳ ' : '▣ '}
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    {isRtl ? 'الاسم بالإنجليزية (EN) *' : 'English Name (EN) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={catFormModal.name}
                    onChange={(e) =>
                      setCatFormModal({
                        ...catFormModal,
                        name: e.target.value,
                        id:
                          catFormModal.mode === 'add'
                            ? e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9_-]+/g, '-')
                                .replace(/^-+|-+$/g, '')
                            : catFormModal.id,
                      })
                    }
                    placeholder="e.g. Processors (CPU) or Core i7"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    {isRtl ? 'الاسم بالعربية (AR) *' : 'Arabic Name (AR) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={catFormModal.nameAr}
                    onChange={(e) =>
                      setCatFormModal({ ...catFormModal, nameAr: e.target.value })
                    }
                    placeholder="مثال: المعالجات (CPU) أو Core i7"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    {isRtl ? 'معرّف القسم الثابت (ID / Slug)' : 'Category ID / Slug'}
                  </label>
                  <input
                    type="text"
                    disabled={catFormModal.mode === 'edit'}
                    value={catFormModal.id}
                    onChange={(e) =>
                      setCatFormModal({ ...catFormModal, id: e.target.value })
                    }
                    placeholder="e.g. core-i7"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-300 font-mono disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    {isRtl
                      ? 'كلمات الربط التلقائي (Tokens)'
                      : 'Matching Keywords (Comma-separated)'}
                  </label>
                  <input
                    type="text"
                    value={catFormModal.tokensText}
                    onChange={(e) =>
                      setCatFormModal({
                        ...catFormModal,
                        tokensText: e.target.value,
                      })
                    }
                    placeholder="e.g. core i7, i7-, 14700"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white font-mono"
                  />
                </div>
              </div>

              {/* Image Upload or URL */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="font-semibold text-slate-300 block">
                  {isRtl
                    ? 'صورة القسم (رفع من الجهاز أو رابط)'
                    : 'Category Image (Upload or URL)'}
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-bold cursor-pointer shrink-0">
                    <UploadIcon size={14} />
                    <span>{isRtl ? 'رفع صورة' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const publicUrl = await uploadImageToSupabase(
                            file,
                            'sections'
                          );
                          if (publicUrl) {
                            setCatFormModal((prev) =>
                              prev ? { ...prev, image: publicUrl } : null
                            );
                          } else {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setCatFormModal((prev) =>
                                  prev
                                    ? { ...prev, image: reader.result as string }
                                    : null
                                );
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        } catch {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setCatFormModal((prev) =>
                                prev
                                  ? { ...prev, image: reader.result as string }
                                  : null
                              );
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  <input
                    type="text"
                    value={catFormModal.image}
                    onChange={(e) =>
                      setCatFormModal({ ...catFormModal, image: e.target.value })
                    }
                    placeholder={
                      isRtl ? 'أو الصق رابط الصورة...' : 'Or paste image URL...'
                    }
                    className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white font-mono"
                  />
                </div>
                {catFormModal.image && (
                  <div className="h-28 w-full rounded-xl bg-black border border-slate-800 flex items-center justify-center p-2">
                    <img
                      src={catFormModal.image}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCatFormModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-800/60 font-bold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
                >
                  {catFormModal.mode === 'add'
                    ? isRtl
                      ? 'إضافة القسم الآن'
                      : 'Create Category'
                    : isRtl
                    ? 'حفظ التعديلات'
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Direct Image URL Modal ── */}
      {urlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-cyan-500/30 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-black text-white">
                {isRtl
                  ? `تحديث صورة "${urlModal.nodeName}"`
                  : `Update Image for "${urlModal.nodeName}"`}
              </h4>
              <button
                type="button"
                onClick={() => setUrlModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <input
                type="text"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://... or /media/..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white font-mono"
              />
              {tempUrl && (
                <div className="h-32 w-full rounded-xl bg-black border border-slate-800 flex items-center justify-center p-2">
                  <img
                    src={tempUrl}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setUrlModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateRetroPcCategoryImage(urlModal.nodeId, tempUrl.trim());
                    setUrlModal(null);
                    if (showToast) {
                      showToast(
                        isRtl ? 'تم حفظ رابط الصورة!' : 'Image URL updated!',
                        'success'
                      );
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black cursor-pointer"
                >
                  {isRtl ? 'حفظ الصورة' : 'Save Image'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: Move Category / Subcategory to Another Parent ── */}
      {moveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-purple-500/30 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-black text-white">
                {isRtl
                  ? `نقل قسم "${moveModal.nodeName}"`
                  : `Move Category "${moveModal.nodeName}"`}
              </h4>
              <button
                type="button"
                onClick={() => setMoveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-semibold text-slate-300 block">
                {isRtl
                  ? 'اختر المكان الجديد لهذا القسم (أو اجعله قسماً رئيسياً):'
                  : 'Select new parent category (or make it a root main category):'}
              </label>

              <select
                value={moveModal.targetParentId}
                onChange={(e) =>
                  setMoveModal({ ...moveModal, targetParentId: e.target.value })
                }
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white focus:border-purple-400 focus:outline-none"
              >
                <option value="">
                  {isRtl
                    ? '🏠 المستوى الرئيسي الأول (Root Main Category)'
                    : '🏠 Root Main Category (Level 1)'}
                </option>
                {flatAllNodes
                  .filter((opt) => {
                    const movingNode = findRetroPcNodeWithTrailById(
                      treeRoots,
                      moveModal.nodeId
                    )?.current;
                    if (!movingNode) return true;
                    const forbidden = collectSubtreeIds(movingNode);
                    return !forbidden.includes(opt.node.id.toLowerCase());
                  })
                  .map((opt) => (
                    <option key={opt.node.id} value={opt.node.id}>
                      {'\u00A0'.repeat(opt.depth * 3)}
                      {opt.depth > 0 ? '↳ ' : '▣ '}
                      {opt.label}
                    </option>
                  ))}
              </select>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setMoveModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    moveRetroPcCategory(
                      moveModal.nodeId,
                      moveModal.targetParentId || null
                    );
                    setMoveModal(null);
                    if (showToast) {
                      showToast(
                        isRtl
                          ? `تم نقل قسم "${moveModal.nodeName}" بنجاح!`
                          : `Moved "${moveModal.nodeName}" successfully!`,
                        'success'
                      );
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-500 text-white font-black cursor-pointer"
                >
                  {isRtl ? 'تأكيد النقل' : 'Move Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: Assign / Unassign Products to Category ── */}
      {assignTargetTrail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl border border-purple-500/30 bg-slate-900 p-6 space-y-4 shadow-2xl max-h-[88vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div>
                <h4 className="text-base font-black text-white">
                  {isRtl
                    ? `ربط المنتجات بقسم: ${
                        assignTargetTrail.current.nameAr ||
                        assignTargetTrail.current.name
                      }`
                    : `Assign Products to: ${assignTargetTrail.current.name}`}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {assignTargetTrail.breadcrumbs
                    .map((b) => (isRtl && b.nameAr ? b.nameAr : b.name))
                    .join(' ← ')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAssignModalNodeId(null);
                  setAssignSearch('');
                }}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative shrink-0">
              <SearchIcon
                size={15}
                className="absolute top-3 left-3.5 text-slate-500"
              />
              <input
                type="text"
                value={assignSearch}
                onChange={(e) => setAssignSearch(e.target.value)}
                placeholder={
                  isRtl
                    ? 'ابحث عن منتج بالاسم، الموديل، أو رمز SKU...'
                    : 'Search product by name, model, or SKU...'
                }
                className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
              />
            </div>

            {/* Products Checklist */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {products
                .filter((p) => {
                  if (!assignSearch.trim()) return true;
                  const q = assignSearch.toLowerCase();
                  return (
                    (p.nameEn || '').toLowerCase().includes(q) ||
                    (p.nameAr || '').toLowerCase().includes(q) ||
                    (p.sku || '').toLowerCase().includes(q) ||
                    (p.brand || '').toLowerCase().includes(q)
                  );
                })
                .slice(0, 80)
                .map((prod) => {
                  const isAssigned = productMatchesRetroPcNode(
                    prod,
                    assignTargetTrail.breadcrumbs,
                    allPcNodeIds
                  );
                  return (
                    <div
                      key={prod.id}
                      onClick={() =>
                        handleToggleProductAssignment(prod, assignTargetTrail)
                      }
                      className={`flex items-center justify-between gap-3 rounded-2xl border p-3 transition-all cursor-pointer ${
                        isAssigned
                          ? 'border-emerald-500/40 bg-emerald-950/25'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-black border border-slate-800 p-1 flex items-center justify-center overflow-hidden">
                          {prod.imageUrl ? (
                            <img
                              src={prod.imageUrl}
                              alt={prod.nameEn}
                              loading="lazy"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <span>📦</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {isRtl ? prod.nameAr || prod.nameEn : prod.nameEn}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {prod.sku} • {prod.sellingPrice} QAR
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1 shrink-0 cursor-pointer ${
                          isAssigned
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isAssigned ? (
                          <>
                            <CheckIcon size={12} />
                            <span>{isRtl ? 'مرتبط' : 'Assigned'}</span>
                          </>
                        ) : (
                          <span>+ {isRtl ? 'ربط بالقسم' : 'Assign'}</span>
                        )}
                      </button>
                    </div>
                  );
                })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const targetId = assignTargetTrail.current.id;
                  setAssignModalNodeId(null);
                  onOpenQuickAddProduct(targetId);
                }}
                className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
              >
                + {isRtl ? 'إنشاء منتج جديد مباشرة في هذا القسم' : 'Create new product in this category'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAssignModalNodeId(null);
                  setAssignSearch('');
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black cursor-pointer"
              >
                {isRtl ? 'تم' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

