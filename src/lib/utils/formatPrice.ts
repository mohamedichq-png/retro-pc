// RETRO Qatar — Price formatting utilities

import { CURRENCY, CURRENCY_AR } from '../constants';

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, locale: 'en' | 'ar' = 'en'): string {
  const formatted = price.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  if (locale === 'ar') {
    return `${formatted} ${CURRENCY_AR}`;
  }
  return `${formatted} ${CURRENCY}`;
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercent(original: number, sale: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - sale) / original) * 100);
}
