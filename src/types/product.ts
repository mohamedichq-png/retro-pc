// RETRO Qatar — Product Types

export interface ProductVariation {
  id: string;
  sku: string;
  condition: 'NEW' | 'USED' | 'REFURBISHED' | 'OPEN BOX' | 'PRE-OWNED' | 'New' | 'Used' | 'Refurbished';
  edition: string;
  costPrice: number;
  sellingPrice: number;
  salePrice?: number;
  stockQty: number;
  imageUrl?: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  category: string;
  subCategory?: string;
  brand: string;
  model: string;
  condition: 'NEW' | 'USED' | 'REFURBISHED' | 'OPEN BOX' | 'PRE-OWNED' | 'New' | 'Used' | 'Refurbished';
  costPrice: number;
  sellingPrice: number;
  salePrice?: number;
  stockQty: number;
  lowStockThreshold: number;
  serialNumbers?: string[];
  imageUrl: string;
  galleryUrls?: string[];
  specs: Record<string, any>;
  isDigital?: boolean;
  isFeatured?: boolean;
  status?: 'published' | 'draft';
  variations?: ProductVariation[];
  slug?: string;

  // 3-Level Taxonomy & Classification
  mainCategory?: string;
  section?: 'consoles' | 'accessories' | 'games-cds' | string;
  taxonomyConfidence?: number;
  needsClassification?: boolean;
  source?: 'POS' | 'PC';

  // Extended Catalog Metadata
  productType?: 'PHYSICAL PRODUCT' | 'DIGITAL PRODUCT' | 'SERVICE' | 'CUSTOM PC' | 'PRE-BUILT PC' | 'USED / PRE-OWNED' | 'RETRO PRODUCT';
  primaryCategory?: string;
  secondaryCategory?: string;
  categoryAr?: string;
  categoryEn?: string;
  subCategoryAr?: string;
  sectionAr?: string;
  platform?: string;
  generation?: string;
  color?: string;
  colorAr?: string;
  storage?: string;
  storageAr?: string;
  edition?: string;
  editionAr?: string;
  region?: string;
  regionAr?: string;
  packaging?: string;
  packagingAr?: string;
  priceOnDemand?: boolean;
  notesAr?: string;
  notesEn?: string;
  catalogNotes?: string;
  catalogStatus?: 'preliminary_ready' | 'needs_review';
  categories?: string[];
  tags?: string[];
  collections?: string[];
  reservedQty?: number;
  availableQty?: number;
  stockStatus?: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK' | 'PRE-ORDER';
  warranty?: string;
  weight?: string;
  dimensions?: string;
  relatedProducts?: string[];
  compatibleProducts?: string[];
  accessories?: string[];
  retroInspection?: {
    cosmeticCondition?: 'Mint' | 'Very Good' | 'Good' | 'Fair' | string;
    operationalCondition?: string;
    testedCleaned?: boolean;
    includedAccessories?: string[];
    region?: 'PAL' | 'NTSC-U' | 'NTSC-J' | 'Region Free' | string;
    modifications?: string[];
    warrantyMonths?: number;
    inspectionNotesAr?: string;
    inspectionNotesEn?: string;
  };
}

export interface ProductFilter {
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  condition?: string;
  inStock?: boolean;
  search?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';
}
