// RETRO Qatar — PC Builder Page (Server)

import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { PCBuilderContent } from './builder-content';
import { getStoreProducts } from '@/lib/productsData';

export const metadata = {
  title: 'Custom PC Builder | RETRO Qatar',
  description: 'Build your dream gaming PC step-by-step. Our intelligent compatibility engine ensures all your selected parts work perfectly together.',
};

export const dynamic = 'force-dynamic';

export default async function PCBuilderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const products = await getStoreProducts();

  return <PCBuilderContent products={products} dict={dict} locale={locale as Locale} />;
}
