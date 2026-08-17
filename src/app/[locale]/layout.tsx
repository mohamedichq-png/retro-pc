// RETRO Qatar — Locale Layout (App Shell)
// Wraps all pages with Header, CategoryNav, MobileNav, Footer, Toast, Skip Link, and SEO Metadata

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
  const lang = hasLocale(locale) ? (locale as Locale) : 'ar';
  const dict = await getDictionary(lang);
  const isAr = lang === 'ar';

  const title = isAr
    ? 'ريترو قطر | متجر ألعاب الكمبيوتر، الكونسول، أجهزة Retro والصيانة في قطر'
    : 'RETRO Qatar | Gaming PCs, Consoles, Authentic Retro & Repair Hub in Qatar';

  const description = isAr
    ? 'ريترو قطر — متجر قطري متخصص في تجميعات وقطع Gaming PC، كروت الشاشة والمعالجات، أجهزة PlayStation وXbox وNintendo، وأجهزة وألعاب Retro الكلاسيكية المفحوصة مع صيانة معتمدة وضمان محلي.'
    : 'RETRO Qatar — Premier Qatari retailer for Custom Gaming PCs, PC hardware, PlayStation, Xbox, Nintendo, and inspected rare retro games with certified repair and local warranty.';

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
      'قطع كمبيوتر الدوحة',
      'Retro Gaming Qatar',
      'ألعاب ريترو قطر',
      'PS5 Qatar',
      'Nintendo Switch Doha',
      'تصليح كمبيوتر مشيرب',
      'Msheireb Gaming Store',
      'RTX Graphics Cards Qatar',
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
      creator: '@retro_qatar',
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

  const dict = await getDictionary(locale as Locale);
  const isRtl = locale === 'ar';

  return (
    <html
      lang={locale}
      dir={isRtl ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body suppressHydrationWarning className="h-full bg-retro-bg text-retro-text relative selection:bg-retro-cyan selection:text-retro-bg">
        {/* Skip to Main Content Accessibility Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-retro-cyan focus:text-retro-bg focus:font-black focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white ltr:focus:left-4 rtl:focus:right-4 text-xs"
        >
          {isRtl ? 'الانتقال إلى المحتوى الرئيسي' : 'Skip to main content'}
        </a>

        <ClientProviders dict={dict} locale={locale as Locale}>
          <div id="main-content" tabIndex={-1} className="outline-none min-h-screen flex flex-col justify-between">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
