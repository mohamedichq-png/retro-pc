'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ProductGrid } from '@/components/product/ProductGrid';
import { RETRO_BRANDS, RETRO_KINDS } from '@/lib/retro-navigation';
import { useOffersStore } from '@/stores/useOffersStore';
import { useApp } from '@/context/AppContext';
import type { Product } from '@/types';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

function typeMatches(p: Product, kind: string) {
  const type = [
    p.section,
    p.subCategory,
    p.secondaryCategory,
    p.primaryCategory,
    p.category,
    p.productType,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (kind === 'consoles') {
    return (
      /(^|\W)(consoles?|hardware|systems?|أجهزة|كونسول)(\W|$)/i.test(type) &&
      !/accessor|controller|game(s|s-cds)?|ألعاب|إكسسوار/i.test(type)
    );
  }
  if (kind === 'games') {
    return (
      /game(s|s-cds)?|ألعاب|cd|disc|software/i.test(type) &&
      !/accessor|controller/i.test(type)
    );
  }
  return /accessor|controller|peripheral|إكسسوار|ملحق|يد تحكم/i.test(type);
}

function deviceMatches(p: Product, tokens: string[], brandId: string, modelId: string) {
  if (
    (p.mainCategory?.toLowerCase() === brandId.toLowerCase() ||
      p.category?.toLowerCase() === brandId.toLowerCase()) &&
    p.subCategory?.toLowerCase() === modelId.toLowerCase()
  ) {
    return true;
  }

  const searchable = [
    p.platform,
    p.generation,
    p.model,
    p.subCategory,
    p.secondaryCategory,
    p.category,
    p.nameEn,
    p.nameAr,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return tokens.some((token) =>
    new RegExp(
      `(^|[^a-z0-9])${token.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`,
      'i'
    ).test(searchable)
  );
}

interface RetroBrowseClientProps {
  locale: Locale;
  brandId: string;
  modelId: string;
  kindId: string;
  serverProducts: Product[];
  dict: Dictionary;
}

export default function RetroBrowseClient({
  locale,
  brandId,
  modelId,
  kindId,
  serverProducts,
  dict,
}: RetroBrowseClientProps) {
  const ar = locale === 'ar';
  const retroBrands = useOffersStore((s) => s.retroBrands);
  const { products: clientProducts } = useApp();

  const allBrands = useMemo(
    () => (retroBrands && retroBrands.length > 0 ? retroBrands : RETRO_BRANDS),
    [retroBrands]
  );

  const brand = useMemo(
    () =>
      allBrands.find((x) => x.id === brandId) ||
      RETRO_BRANDS.find((x) => x.id === brandId) || {
        id: brandId,
        name: brandId.toUpperCase(),
        color: '#06b6d4',
        devices: [],
      },
    [allBrands, brandId]
  );

  const model = useMemo(
    () =>
      brand.devices.find((x) => x.id === modelId) || {
        id: modelId,
        name: modelId.toUpperCase(),
        image: '',
        tokens: [modelId],
      },
    [brand.devices, modelId]
  );

  const kind = RETRO_KINDS.find((x) => x.id === kindId) || RETRO_KINDS[0];

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

  const effectiveTokens = useMemo(() => {
    const base = Array.isArray(model.tokens) && model.tokens.length > 0 ? model.tokens : [model.id, model.name];
    return Array.from(new Set([...base, model.id, model.name].filter(Boolean)));
  }, [model]);

  const items = useMemo(() => {
    return mergedProducts.filter(
      (p) =>
        p.status !== 'draft' &&
        deviceMatches(p, effectiveTokens, brand.id, model.id) &&
        typeMatches(p, kind.id)
    );
  }, [mergedProducts, effectiveTokens, brand.id, model.id, kind.id]);

  const brandDisplayName = ar && brand.nameAr ? brand.nameAr : brand.name;
  const modelDisplayName = ar && model.nameAr ? model.nameAr : model.name;

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 min-h-[70vh]" dir={ar ? 'rtl' : 'ltr'}>
      <Link
        href={`/${locale}/retro?brand=${encodeURIComponent(brand.id)}&model=${encodeURIComponent(model.id)}`}
        className="text-sm text-cyan-300 hover:underline"
      >
        {ar ? '← رجوع' : '← Back'}
      </Link>
      <p className="mt-8 text-sm text-slate-400">
        {brandDisplayName} / {modelDisplayName}
      </p>
      <h1 className="mt-2 mb-8 text-3xl font-black text-white">{ar ? kind.ar : kind.en}</h1>
      {items.length ? (
        <ProductGrid products={items} dict={dict} locale={locale} />
      ) : (
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-10 text-center text-slate-300">
          {ar
            ? 'لا توجد منتجات مصنفة لهذا الجهاز في هذا القسم حالياً.'
            : 'No products are classified for this console and category yet.'}
        </div>
      )}
    </main>
  );
}

