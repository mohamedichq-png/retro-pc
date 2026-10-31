import { notFound } from 'next/navigation';
import { hasLocale, getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { getStoreProducts } from '@/lib/productsData';
import { RETRO_KINDS } from '@/lib/retro-navigation';
import RetroBrowseClient from './RetroBrowseClient';

export const dynamic = 'force-dynamic';

export default async function RetroProducts({
  params,
}: {
  params: Promise<{ locale: string; brand: string; model: string; kind: string }>;
}) {
  const { locale, brand: brandId, model: modelId, kind: kindId } = await params;
  if (!hasLocale(locale)) notFound();
  const kind = RETRO_KINDS.find((x) => x.id === kindId);
  if (!kind) notFound();

  const all = await getStoreProducts();
  const dict = await getDictionary(locale as Locale);

  return (
    <RetroBrowseClient
      locale={locale as Locale}
      brandId={decodeURIComponent(brandId)}
      modelId={decodeURIComponent(modelId)}
      kindId={kind.id}
      serverProducts={all}
      dict={dict}
    />
  );
}
