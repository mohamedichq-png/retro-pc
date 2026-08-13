// RETRO Qatar — Checkout Page (Server)

import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { CheckoutContent } from './checkout-content';

export const metadata = {
  title: 'Secure Checkout | RETRO Qatar',
  description: 'Complete your order securely at RETRO Qatar.',
};

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return <CheckoutContent dict={dict} locale={locale as Locale} />;
}
