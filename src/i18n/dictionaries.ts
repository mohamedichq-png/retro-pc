// RETRO Qatar — i18n Configuration
// Dictionary-based localization for App Router

import 'server-only';

const dictionaries = {
  en: () => import('./messages/en.json').then((module) => module.default),
  ar: () => import('./messages/ar.json').then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const locales: Locale[] = ['en', 'ar'];
export const defaultLocale: Locale = 'en';

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

// Type helper for dictionary
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
