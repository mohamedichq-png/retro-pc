import { MetadataRoute } from 'next';
import { initialProducts } from '@/data/mockData';
import { FULL_TAXONOMY_TREE } from '@/lib/taxonomy';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.retroqatar.com';
  const locales = ['ar', 'en'];
  const routes = [
    '',
    '/products',
    '/pc-builder',
    '/repair',
    '/accessories',
    '/retro-inspection-standards',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static routes
  for (const route of routes) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar${route}`,
            en: `${baseUrl}/en${route}`,
            'x-default': `${baseUrl}/ar${route}`,
          },
        },
      });
    }
  }

  // Category routes
  for (const mainCat of FULL_TAXONOMY_TREE) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/products?category=${mainCat.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar/products?category=${mainCat.id}`,
            en: `${baseUrl}/en/products?category=${mainCat.id}`,
          },
        },
      });
    }
  }

  // Product routes
  for (const product of initialProducts) {
    const slug = product.slug || product.id;
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/product/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar/product/${slug}`,
            en: `${baseUrl}/en/product/${slug}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}
