import { redirect, notFound } from 'next/navigation';
import { hasLocale } from '@/i18n/dictionaries';

export default async function ProcessorBrandsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  redirect(`/${locale}/retro-pc?path=processors`);
}
