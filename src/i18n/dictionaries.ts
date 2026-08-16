// RETRO Qatar — i18n Configuration
// Dictionary-based localization for App Router

import 'server-only';

const dictionaries = {
  en: () => import('./messages/en').then((module) => module.en),
  ar: () => import('./messages/ar').then((module) => module.ar),
};

export type Locale = keyof typeof dictionaries;

export const locales: Locale[] = ['en', 'ar'];
export const defaultLocale: Locale = 'ar';

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

// Type helper for dictionary
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

