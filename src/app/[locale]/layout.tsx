// RETRO Qatar — Locale Layout (App Shell)
// Wraps all pages with Header, CategoryNav, MobileNav, Footer, Toast, Skip Link, and SEO Metadata

import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import '../globals.css';
import { ClientProviders } from './providers';
import { JsonLd, getStoreSchema, getWebSiteSchema } from '@/components/seo/JsonLd';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = hasLocale(locale) ? (locale as Locale) : 'ar';
  const isAr = lang === 'ar';

  const title = isAr
    ? 'ريترو قطر | متجر تجميعات Gaming PC، أجهزة Retro والصيانة في الدوحة'
    : 'RETRO Qatar | Custom Gaming PCs, Retro Consoles & Certified Repair in Doha';

  const description = isAr
    ? 'ريترو قطر — المتجر الرائد في قطر لتجميعات بي سي الألعاب الاحترافية، أجهزة وألعاب Retro الكلاسيكية الأصلية النادرة، قطع الهاردوير، وخدمات الصيانة المعتمدة في مشيرب، الدوحة. شحن سريع وضمان محلي.'
    : 'RETRO Qatar — Premier Qatari retailer for Custom Gaming PCs, PC hardware, authentic rare retro games, and certified console & PC repairs in Msheireb, Doha with local warranty.';

  return {
    metadataBase: new URL('https://www.retroqatar.com'),
    title: {
      default: title,
      template: `%s | ${isAr ? 'ريترو قطر' : 'RETRO Qatar'}`,
    },
    description,
    keywords: [
      'Gaming PC Qatar',
      'تجميعات قيمنق قطر',
      'تجميعات بي سي الدوحة',
      'ألعاب ريترو قطر',
      'قطع كمبيوتر الدوحة',
      'Retro Gaming Qatar',
      'تصليح سوني وبلايستيشن قطر',
      'تصليح كمبيوتر مشيرب',
      'Msheireb Gaming Store Doha',
      'RTX 4080 Qatar',
      'PlayStation 2 Doha',
      'Nintendo Switch Qatar',
    ],
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'ar': '/ar',
        'en': '/en',
        'x-default': '/ar',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.retroqatar.com/${lang}`,
      siteName: isAr ? 'ريترو قطر' : 'RETRO Qatar',
      locale: isAr ? 'ar_QA' : 'en_US',
      alternateLocale: isAr ? ['en_US'] : ['ar_QA'],
      type: 'website',
      images: [
        {
          url: '/media/og-image.jpg',
          width: 1200,
          height: 630,
          alt: isAr ? 'متجر ريترو قطر' : 'RETRO Qatar Store',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@retroqa',
      images: ['/media/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
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

  const currentLocale = locale as Locale;
  const dict = await getDictionary(currentLocale);
  const isRtl = currentLocale === 'ar';

  return (
    <html
      lang={currentLocale}
      dir={isRtl ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <JsonLd data={getStoreSchema(currentLocale)} />
        <JsonLd data={getWebSiteSchema(currentLocale)} />
      </head>
      <body suppressHydrationWarning className="h-full bg-retro-bg text-retro-text relative selection:bg-retro-cyan selection:text-retro-bg">
        {/* Skip to Main Content Accessibility Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-retro-cyan focus:text-retro-bg focus:font-black focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white ltr:focus:left-4 rtl:focus:right-4 text-xs"
        >
          {isRtl ? 'الانتقال إلى المحتوى الرئيسي' : 'Skip to main content'}
        </a>

        <ClientProviders dict={dict} locale={currentLocale}>
          <div id="main-content" tabIndex={-1} className="outline-none min-h-screen flex flex-col justify-between">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
