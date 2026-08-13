// RETRO Qatar — Structured Data (JSON-LD SEO)

import React from 'react';

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

// Generates Schema.org JSON for the local Qatar store
export function getStoreSchema(locale: 'en' | 'ar') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    'name': locale === 'ar' ? 'ريترو قطر' : 'RETRO Qatar',
    'image': 'https://www.retroqatar.com/media/logo.png',
    '@id': 'https://www.retroqatar.com',
    'url': 'https://www.retroqatar.com',
    'telephone': '+974 1234 5678',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Msheireb',
      'addressLocality': 'Doha',
      'addressCountry': 'QA',
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      'opens': '10:00',
      'closes': '22:00'
    },
    'sameAs': [
      'https://www.instagram.com/retro_qatar',
    ]
  };
}

// Generates Schema.org JSON for a product detail page
export function getProductSchema(product: any, locale: 'en' | 'ar') {
  const name = locale === 'ar' ? product.nameAr : product.nameEn;
  const description = locale === 'ar' ? product.descriptionAr : product.descriptionEn;
  const price = product.salePrice ?? product.sellingPrice;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': name,
    'image': product.imageUrl ? [product.imageUrl] : [],
    'description': description || `Buy ${name} at RETRO Qatar.`,
    'sku': product.sku,
    'brand': {
      '@type': 'Brand',
      'name': product.brand || 'RETRO',
    },
    'offers': {
      '@type': 'Offer',
      'url': `https://www.retroqatar.com/${locale}/product/${product.slug || product.id}`,
      'priceCurrency': 'QAR',
      'price': price,
      'itemCondition': product.condition === 'new' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      'availability': product.stockQty > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    }
  };
}
