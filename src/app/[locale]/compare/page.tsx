// RETRO Qatar — Compare Page (Server Component)

import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { CompareContent } from './compare-content';

export const metadata = {
  title: 'Compare Products | RETRO Qatar',
  description: 'Compare gaming PCs, components, and accessories side-by-side.',
};

export default async function ComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return <CompareContent dict={dict} locale={locale as Locale} />;
}
