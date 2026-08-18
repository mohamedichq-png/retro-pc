import { Suspense } from 'react';
import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { ProductsContent } from '../../products/products-content';
import { getStoreProducts } from '@/lib/productsData';
import { MAIN_CATEGORIES } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const cat = MAIN_CATEGORIES.find(c => c.slugEn === slug);
  const name = cat ? (locale === 'ar' ? cat.nameAr : cat.nameEn) : slug;
  
  return {
    title: `${name} | RETRO Qatar`,
    description: `Shop the latest ${name} at RETRO Qatar.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const products = await getStoreProducts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-retro-bg flex items-center justify-center text-retro-cyan font-bold">Loading...</div>}>
      <ProductsContent dict={dict} locale={locale as Locale} initialProducts={products} categorySlug={slug} />
    </Suspense>
  );
}
