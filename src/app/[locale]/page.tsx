// RETRO Qatar — Homepage (Locale-aware)
// Placeholder page that displays the layout shell with hero content

import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { HomepageContent } from './homepage-content';
import { JsonLd, getStoreSchema } from '@/components/seo/JsonLd';
import { getStoreProducts } from '@/lib/productsData';

export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const storeSchema = getStoreSchema(locale as Locale);
  const products = await getStoreProducts();

  return (
    <>
      <JsonLd data={storeSchema} />
      <HomepageContent products={products} dict={dict} locale={locale as Locale} />
    </>
  );
}

