// RETRO Qatar — Cart Page (Server)

import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { CartContent } from './cart-content';

export const metadata = {
  title: 'Shopping Cart | RETRO Qatar',
  description: 'Review the items in your shopping cart before proceeding to checkout.',
};

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return <CartContent dict={dict} locale={locale as Locale} />;
}
