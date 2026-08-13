// RETRO Qatar — Repair Hub Page (Server)

import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { RepairContent } from './repair-content';

export const metadata = {
  title: 'Repair Hub & Technical Support | RETRO Qatar',
  description: 'Professional repair services for Gaming PCs, Laptops, PlayStation, Xbox, and Nintendo in Qatar. Fast turnaround and guaranteed quality.',
};

export default async function RepairPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return <RepairContent dict={dict} locale={locale as Locale} />;
}
