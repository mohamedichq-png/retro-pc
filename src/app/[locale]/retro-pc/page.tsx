import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { hasLocale, getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { getStoreProducts } from '@/lib/productsData';
import RetroPcClient from './RetroPcClient';

export const dynamic = 'force-dynamic';

export default async function RetroPcPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const [dict, allProducts] = await Promise.all([
    getDictionary(locale as Locale),
    getStoreProducts(),
  ]);

  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12 min-h-[75vh]" />}>
      <RetroPcClient
        locale={locale as Locale}
        serverProducts={allProducts}
        dict={dict}
      />
    </Suspense>
  );
}
