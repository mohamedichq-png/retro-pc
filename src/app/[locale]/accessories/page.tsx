// RETRO Qatar — Accessories Storefront Page (Server)

import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { AccessoriesContent } from './accessories-content';
import { getStoreProducts } from '@/lib/productsData';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = hasLocale(locale) ? locale : 'en';
  const dict = await getDictionary(lang);

  return {
    title: `${dict.nav.accessories || 'Accessories'} | RETRO Qatar`,
    description: lang === 'ar'
      ? 'متجر ملحقات وإكسسوارات الألعاب في قطر - تسوق أيدي تحكم أصلية، كروت ذاكرة، وشواحن لمختلف الأجهزة.'
      : 'Official gaming controllers, gamepads, memory cards, and power cords at RETRO Qatar.',
  };
}

export default async function AccessoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const products = await getStoreProducts();

  return <AccessoriesContent products={products} dict={dict} locale={locale as Locale} />;
}
