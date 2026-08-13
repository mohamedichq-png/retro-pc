import { Suspense } from 'react';
import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { ProductsContent } from './products-content';
import { initialProducts } from '@/data/mockData'; // In Phase 6/7 this will be a Supabase fetch
import type { Product } from '@/types';

export const metadata = {
  title: 'Shop All Products | RETRO Qatar',
  description: 'Browse our full catalog of gaming PCs, components, consoles, and accessories.',
};

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  
  // Later we can parse searchParams here if we want SSR filtering,
  // but for now we pass all products to the client component for instant filtering.
  const products = initialProducts as unknown as Product[];

  return (
    <Suspense fallback={<div className="min-h-screen bg-retro-bg flex items-center justify-center text-retro-cyan font-bold">Loading...</div>}>
      <ProductsContent dict={dict} locale={locale as Locale} initialProducts={products} />
    </Suspense>
  );
}
