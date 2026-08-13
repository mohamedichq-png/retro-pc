// RETRO Qatar — Product Detail Page (Server Component)

import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { ProductDetailContent } from './product-detail-content';
import { initialProducts } from '@/data/mockData';
import type { Product } from '@/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  
  // Find product by slug or id
  const product = (initialProducts as unknown as Product[]).find(p => p.slug === slug || p.id === slug);
  if (!product) return { title: 'Product Not Found | RETRO Qatar' };

  const name = locale === 'ar' ? product.nameAr : product.nameEn;
  const description = locale === 'ar' ? product.descriptionAr : product.descriptionEn;
  
  return {
    title: `${name} | RETRO Qatar`,
    description: description || `Buy ${name} at RETRO Qatar.`,
  };
}

import { JsonLd, getProductSchema } from '@/components/seo/JsonLd';

export default async function ProductPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) notFound();

  const product = (initialProducts as unknown as Product[]).find(p => p.slug === slug || p.id === slug);
  
  if (!product) notFound();

  const dict = await getDictionary(locale as Locale);

  // Get related products (same category, excluding this one)
  const relatedProducts = (initialProducts as unknown as Product[])
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const productSchema = getProductSchema(product, locale as Locale);

  return (
    <>
      <JsonLd data={productSchema} />
      <ProductDetailContent dict={dict} locale={locale as Locale} product={product} relatedProducts={relatedProducts} />
    </>
  );
}
