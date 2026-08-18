import { Suspense } from 'react';
import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { ProductsContent } from './products-content';
import { getStoreProducts } from '@/lib/productsData';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  const title = isAr 
    ? 'جميع المنتجات والأجهزة والألعاب | ريترو قطر'
    : 'Shop All Products, Gaming PCs & Consoles | RETRO Qatar';

  const description = isAr
    ? 'تصفح تشكيلة ريترو قطر الشاملة من تجميعات وقطع Gaming PC، كروت الشاشة والمعالجات، منصات PlayStation وXbox وNintendo، وأجهزة وألعاب Retro الكلاسيكية النادرة مع توصيل فوري في قطر.'
    : "Explore RETRO Qatar's full collection of Custom Gaming PCs, PC components, GPUs, CPUs, next-gen consoles, and authentic rare retro video games with Qatar delivery.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/products`,
      languages: {
        'ar': '/ar/products',
        'en': '/en/products',
        'x-default': '/ar/products',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.retroqatar.com/${locale}/products`,
      locale: isAr ? 'ar_QA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const products = await getStoreProducts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-retro-bg flex items-center justify-center text-retro-cyan font-bold">Loading products...</div>}>
      <ProductsContent dict={dict} locale={locale as Locale} initialProducts={products} />
    </Suspense>
  );
}
