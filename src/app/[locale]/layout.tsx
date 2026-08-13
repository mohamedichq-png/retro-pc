// RETRO Qatar — Locale Layout (App Shell)
// Wraps all pages within a locale with the Header, CategoryNav, MobileNav, Footer, and Toast

import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import '../globals.css';
import { ClientProviders } from './providers';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = hasLocale(locale) ? locale : 'en';
  const dict = await getDictionary(lang);

  return {
    title: `${dict.site.name} Qatar | ${dict.site.description}`,
    description: locale === 'ar'
      ? 'ريترو قطر - المركز الأول للألعاب والحواسيب المخصصة في قطر. تسوق حواسيب قيمنق، كونسول، قطع غيار، وخدمات صيانة احترافية.'
      : "RETRO Qatar - Qatar's premier gaming store & computer customization center. Shop gaming PCs, consoles, components, and professional repair services.",
    keywords: 'Gaming, Qatar, Doha, Custom PC, Retro Consoles, PC Parts, Repair, PS5, Xbox, Nintendo, Msheireb',
    manifest: '/manifest.json',
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const isRtl = locale === 'ar';

  return (
    <html
      lang={locale}
      dir={isRtl ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body suppressHydrationWarning className="h-full bg-retro-bg text-retro-text">
        <ClientProviders dict={dict} locale={locale as Locale}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
