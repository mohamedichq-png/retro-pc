import { redirect, notFound } from 'next/navigation';
import { hasLocale } from '@/i18n/dictionaries';

export default async function CpuBrandPage({
  params,
}: {
  params: Promise<{ locale: string; brand: string }>;
}) {
  const { locale, brand } = await params;
  if (!hasLocale(locale)) notFound();
  redirect(`/${locale}/retro-pc?path=processors/${encodeURIComponent(brand)}`);
}
