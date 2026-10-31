import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { getStoreProducts } from '@/lib/productsData';
import { ProductsContent } from '@/app/[locale]/products/products-content';
import type { Product } from '@/types';

export const dynamic = 'force-dynamic';

type CpuBrand = 'intel' | 'amd';

function matchesCpu(product: Product) {
  const sections = [product.category, product.subCategory, product.mainCategory,
    product.primaryCategory, product.secondaryCategory, ...(product.categories ?? [])]
    .filter(Boolean).join(' ').toLowerCase();
  const title = `${product.nameEn} ${product.nameAr}`.toLowerCase();
  const categoryMatch = /\b(cpu|cpus|processor|processors)\b|معالج|معالجات/.test(sections);
  const nameMatch = /\b(ryzen\s*[3579]|core\s*(?:i[3579]|ultra\s*[3579])|threadripper|xeon|pentium|celeron)\b|معالج/.test(title);
  return categoryMatch || nameMatch;
}

function matchesBrand(product: Product, brand: CpuBrand) {
  const label = `${product.brand ?? ''} ${product.nameEn} ${product.nameAr} ${product.model ?? ''}`.toLowerCase();
  return brand === 'intel'
    ? /\b(intel|xeon|pentium|celeron)\b|\bcore\s*(?:i[3579]|ultra)\b|إنتل|انتل/.test(label)
    : /\b(amd|ryzen|threadripper)\b|رايزن|ايه ام دي/.test(label);
}

export default async function CpuBrandPage({ params }: {
  params: Promise<{ locale: string; brand: string }>;
}) {
  const { locale, brand } = await params;
  if (!hasLocale(locale) || (brand !== 'intel' && brand !== 'amd')) notFound();
  const ar = locale === 'ar';
  const [dict, allProducts] = await Promise.all([
    getDictionary(locale as Locale), getStoreProducts(),
  ]);
  const products = allProducts.filter(product => matchesCpu(product) && matchesBrand(product, brand));

  return (
    <main dir={ar ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6">
      <Link href={`/${locale}/retro-pc/processors`} className="text-sm font-semibold text-cyan-300 hover:text-white">
        {ar ? '← العودة لاختيار الشركة' : '← Back to CPU brands'}
      </Link>
      <p className="mt-10 text-xs font-bold tracking-[0.2em] text-cyan-400">RETRO PC</p>
      <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
        {ar ? 'معالجات' : 'Processors'} {brand === 'intel' ? 'Intel' : 'AMD Ryzen'}
      </h1>
      <p className="mb-8 mt-3 text-sm text-slate-400">
        {ar ? 'المنتجات المتوفرة من كتالوج المتجر الحالي' : 'Available products from the current store catalog'}
      </p>
      {products.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#111c2d] p-8 text-slate-300">
          {ar ? 'لا توجد منتجات مصنفة كمعالجات لهذه الشركة حالياً.' : 'No CPUs are currently classified for this brand.'}
        </div>
      ) : (
        <Suspense fallback={<div className="p-8 text-cyan-300">Loading...</div>}>
          <ProductsContent dict={dict} locale={locale as Locale} initialProducts={products} />
        </Suspense>
      )}
    </main>
  );
}
