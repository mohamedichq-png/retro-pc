// RETRO Qatar — Slug utilities

/**
 * Convert a string to a URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

/**
 * Generate a product slug from name and SKU
 */
export function productSlug(name: string, sku: string): string {
  return `${slugify(name)}-${sku.toLowerCase()}`;
}
