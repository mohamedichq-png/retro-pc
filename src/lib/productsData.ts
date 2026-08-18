// Unified Products Data Access Layer for RETRO Qatar
// Fetches from Supabase if configured, with graceful fallback to static mockData

import { supabase } from './supabase';
import { initialProducts } from '@/data/mockData';
import type { Product, ProductVariation } from '@/types';

// Map database row to typed Product
export function mapDbToProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id || ''),
    sku: String(row.sku || ''),
    barcode: String(row.barcode || ''),
    nameEn: String(row.name_en || row.nameEn || ''),
    nameAr: String(row.name_ar || row.nameAr || ''),
    descriptionEn: String(row.description_en || row.descriptionEn || ''),
    descriptionAr: String(row.description_ar || row.descriptionAr || ''),
    category: String(row.category || 'Gaming'),
    subCategory: String(row.sub_category || row.subCategory || ''),
    mainCategory: String(row.main_category || row.mainCategory || ''),
    section: String(row.section || ''),
    source: (row.source as 'POS' | 'PC') || 'POS',
    brand: String(row.brand || ''),
    model: String(row.model || ''),
    condition: (row.condition as Product['condition']) || 'New',
    costPrice: Number(row.cost_price || row.costPrice || 0),
    sellingPrice: Number(row.selling_price || row.sellingPrice || 0),
    salePrice: (row.sale_price || row.salePrice) ? Number(row.sale_price || row.salePrice) : undefined,
    stockQty: Number(row.stock_qty ?? row.stockQty ?? 0),
    lowStockThreshold: Number(row.low_stock_threshold || row.lowStockThreshold || 2),
    imageUrl: String(row.image_url || row.imageUrl || '/media/image1.jpeg'),
    galleryUrls: (row.gallery_urls || row.galleryUrls || []) as string[],
    specs: (row.specs || {}) as Record<string, unknown>,
    isFeatured: Boolean(row.is_featured ?? row.isFeatured),
    status: (row.status as 'published' | 'draft') || 'published',
    slug: row.slug ? String(row.slug) : undefined,
    variations: (row.variations || []) as ProductVariation[],
    needsClassification: Boolean(row.needs_classification ?? row.needsClassification),
    productType: row.product_type ? (row.product_type as Product['productType']) : (row.productType ? (row.productType as Product['productType']) : undefined),
    primaryCategory: row.primary_category ? String(row.primary_category) : (row.primaryCategory ? String(row.primaryCategory) : undefined),
    secondaryCategory: row.secondary_category ? String(row.secondary_category) : (row.secondaryCategory ? String(row.secondaryCategory) : undefined),
    categories: (row.categories || []) as string[],
    platform: row.platform ? String(row.platform) : undefined,
    generation: row.generation ? String(row.generation) : undefined,
    tags: (row.tags || []) as string[],
    collections: (row.collections || []) as string[],
    warranty: row.warranty ? String(row.warranty) : undefined,
    weight: row.weight ? String(row.weight) : undefined,
    dimensions: row.dimensions ? String(row.dimensions) : undefined,
    stockStatus: row.stock_status ? (row.stock_status as Product['stockStatus']) : (row.stockStatus ? (row.stockStatus as Product['stockStatus']) : undefined),
  };
}

// Convert Product to Supabase Database row
export function mapProductToDb(p: Product): Record<string, unknown> {
  return {
    id: p.id,
    sku: p.sku,
    barcode: p.barcode,
    name_en: p.nameEn,
    name_ar: p.nameAr,
    description_en: p.descriptionEn,
    description_ar: p.descriptionAr,
    category: p.category,
    sub_category: p.subCategory,
    main_category: p.mainCategory,
    section: p.section,
    source: p.source,
    brand: p.brand,
    model: p.model,
    condition: p.condition,
    cost_price: p.costPrice,
    selling_price: p.sellingPrice,
    sale_price: p.salePrice ?? null,
    stock_qty: p.stockQty,
    low_stock_threshold: p.lowStockThreshold,
    image_url: p.imageUrl,
    gallery_urls: p.galleryUrls || [],
    specs: p.specs || {},
    is_featured: Boolean(p.isFeatured),
    status: p.status || 'published',
    slug: p.slug || undefined,
    variations: p.variations || [],
    needs_classification: Boolean(p.needsClassification),
    product_type: p.productType,
    primary_category: p.primaryCategory,
    secondary_category: p.secondaryCategory,
    categories: p.categories || [],
    platform: p.platform,
    generation: p.generation,
    tags: p.tags || [],
    collections: p.collections || [],
    warranty: p.warranty,
    weight: p.weight,
    dimensions: p.dimensions,
    stock_status: p.stockStatus,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Get all active products for the storefront.
 * Tries fetching from Supabase first. If unconfigured or empty, falls back to initialProducts.
 */
export async function getStoreProducts(): Promise<Product[]> {
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-domain');

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(mapDbToProduct);
      }
    } catch (err) {
      console.warn('Supabase fetch failed, using fallback catalog data:', err);
    }
  }

  return initialProducts as unknown as Product[];
}

/**
 * Find product by slug or id
 */
export async function getStoreProductBySlug(slug: string): Promise<Product | null> {
  const products = await getStoreProducts();
  const product = products.find(p => p.slug === slug || p.id === slug);
  return product || null;
}
