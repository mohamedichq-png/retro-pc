// RETRO Qatar — Structured Data (JSON-LD SEO & Rich Results)
// Compliant with Schema.org specifications for LocalBusiness, Store, Product, Offer, BreadcrumbList, and WebSite

import React from 'react';
import { BUSINESS_INFO } from '@/lib/constants';

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Generates Schema.org JSON for the local Qatar store & LocalBusiness
export function getStoreSchema(locale: 'en' | 'ar') {
  const isAr = locale === 'ar';
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    'name': isAr ? 'ريترو قطر للتجارة والصيانة' : 'RETRO Qatar - Gaming & Computer Store',
    'alternateName': ['Retro Qatar', 'ريترو قطر'],
    'image': 'https://www.retroqatar.com/media/logo.png',
    '@id': 'https://www.retroqatar.com/#store',
    'url': `https://www.retroqatar.com/${locale}`,
    'telephone': `+974 ${BUSINESS_INFO.phone}`,
    'priceRange': 'QAR 50 - 25000',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': isAr ? 'مشيرب' : 'Msheireb Downtown',
      'addressLocality': isAr ? 'الدوحة' : 'Doha',
      'addressRegion': isAr ? 'الدوحة' : 'Doha',
      'postalCode': '00000',
      'addressCountry': 'QA',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '25.2867',
      'longitude': '51.5333',
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        'opens': '09:00',
        'closes': '13:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        'opens': '16:00',
        'closes': '22:00',
      },
    ],
    'sameAs': [
      'https://www.instagram.com/retro_qatar',
      'https://twitter.com/retro_qatar',
      'https://tiktok.com/@retro_qatar',
    ],
    'hasMap': BUSINESS_INFO.googleMapsUrl,
    'paymentAccepted': 'Cash, Credit Card, Debit Card, Apple Pay, QPay, Cash on Delivery',
    'currenciesAccepted': 'QAR',
  };
}

// Generates WebSite Schema with SearchAction
export function getWebSiteSchema(locale: 'en' | 'ar') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': locale === 'ar' ? 'متجر ريترو قطر' : 'RETRO Qatar Gaming Store',
    'url': `https://www.retroqatar.com/${locale}`,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `https://www.retroqatar.com/${locale}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    'inLanguage': locale === 'ar' ? 'ar-QA' : 'en-US',
  };
}

// Generates Schema.org JSON for a product detail page
export function getProductSchema(product: any, locale: 'en' | 'ar') {
  const name = locale === 'ar' ? product.nameAr : product.nameEn;
  const description = locale === 'ar' ? product.descriptionAr : product.descriptionEn;
  const price = product.salePrice ?? product.sellingPrice;
  const slug = product.slug || product.id;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': name,
    'image': product.imageUrl ? [`https://www.retroqatar.com${product.imageUrl.startsWith('/') ? '' : '/'}${product.imageUrl}`] : [],
    'description': description || (locale === 'ar' ? `تسوق ${name} من متجر ريترو قطر مع ضمان محلي وتوصيل سريع.` : `Buy ${name} at RETRO Qatar with local warranty and fast delivery.`),
    'sku': product.sku || slug,
    'brand': {
      '@type': 'Brand',
      'name': product.brand || 'RETRO',
    },
    'offers': {
      '@type': 'Offer',
      'url': `https://www.retroqatar.com/${locale}/product/${slug}`,
      'priceCurrency': 'QAR',
      'price': price,
      'itemCondition': product.condition === 'Refurbished' 
        ? 'https://schema.org/RefurbishedCondition' 
        : product.condition === 'Used' 
        ? 'https://schema.org/UsedCondition' 
        : 'https://schema.org/NewCondition',
      'availability': (product.stockQty > 0 || product.stockQty === undefined)
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      'seller': {
        '@type': 'Organization',
        'name': 'RETRO Qatar',
      },
      'hasMerchantReturnPolicy': {
        '@type': 'MerchantReturnPolicy',
        'applicableCountry': 'QA',
        'returnPolicyCategory': 'https://schema.org/MerchantReturnFiniteReturnWindow',
        'merchantReturnDays': 7,
      },
    },
  };
}

// Generates BreadcrumbList Schema
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url.startsWith('http') ? item.url : `https://www.retroqatar.com${item.url}`,
    })),
  };
}
