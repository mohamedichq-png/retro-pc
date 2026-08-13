// RETRO Qatar — Client Providers
// Wraps children with the layout shell (Header, CategoryNav, MobileNav, Footer, Toast)

'use client';

import React from 'react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { Toast } from '@/components/ui/Toast';
import { SearchOverlay } from '@/components/ui/SearchOverlay';
import { CartDrawer } from '@/components/cart/CartDrawer';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { AppProvider } from '@/context/AppContext';

interface ClientProvidersProps {
  dict: Dictionary;
  locale: Locale;
  children: React.ReactNode;
}

export function ClientProviders({ dict, locale, children }: ClientProvidersProps) {
  return (
    <>
      <AnnouncementBar dict={dict} locale={locale} />
      <Header dict={dict} locale={locale} />
      <CategoryNav dict={dict} locale={locale} />

      <main className="min-h-screen">
        <AppProvider>
          {children}
        </AppProvider>
      </main>

      <Footer dict={dict} locale={locale} />
      <MobileNav dict={dict} locale={locale} />
      <SearchOverlay dict={dict} locale={locale} />
      <CartDrawer dict={dict} locale={locale} />
      <Toast />
    </>
  );
}
