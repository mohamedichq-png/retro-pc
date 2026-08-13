// RETRO Qatar — PC Builder Page (Server)

import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { PCBuilderContent } from './builder-content';
import { initialProducts } from '@/data/mockData';
import type { Product } from '@/types';

export const metadata = {
  title: 'Custom PC Builder | RETRO Qatar',
  description: 'Build your dream gaming PC step-by-step. Our intelligent compatibility engine ensures all your selected parts work perfectly together.',
};

export default async function PCBuilderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  
  // Later we'll fetch only PC components from Supabase
  const products = initialProducts as unknown as Product[];

  return <PCBuilderContent products={products} dict={dict} locale={locale as Locale} />;
}
