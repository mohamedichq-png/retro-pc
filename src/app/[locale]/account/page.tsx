// RETRO Qatar — Account Page (Server)

import { Suspense } from 'react';
import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { AccountContent } from './account-content';

export const metadata = {
  title: 'My Account | RETRO Qatar',
  description: 'Manage your profile and track your orders at RETRO Qatar.',
};

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    <Suspense fallback={<div className="min-h-screen bg-retro-bg flex items-center justify-center text-retro-cyan font-bold">Loading...</div>}>
      <AccountContent dict={dict} locale={locale as Locale} />
    </Suspense>
  );
}
