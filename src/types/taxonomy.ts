// RETRO Qatar — Taxonomy Types
// Comprehensive 3-Level Taxonomy: Main Category (Level 1) -> Subcategory (Level 2) -> Section (Level 3)

export type MainCategoryId = 
  | 'playstation'
  | 'nintendo'
  | 'xbox'
  | 'retro-games'
  | 'consoles-accessories'
  | 'pc';

export type SectionId = 
  | 'consoles'
  | 'accessories'
  | 'games-cds'
  | 'general';

export type ProductSource = 'POS' | 'PC';

export interface TaxonomySection {
  id: SectionId;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
}

export interface TaxonomySubCategory {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  parentCategoryId: MainCategoryId;
  icon?: string;
  sections: TaxonomySection[];
}

export interface TaxonomyMainCategory {
  id: MainCategoryId;
  slug: string;
  nameEn: string;
  nameAr: string;
  icon?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  subcategories: TaxonomySubCategory[];
}

export interface ClassificationResult {
  mainCategory: MainCategoryId | string;
  subCategory: string;
  section: SectionId | string;
  detectedPlatform?: string;
  confidence: number; // 0.0 to 1.0
  needsClassification: boolean;
  source: ProductSource;
  reason?: string;
}

export interface TaxonomySummary {
  totalProducts: number;
  totalPosProducts: number;
  totalPcProducts: number;
  successfullyClassified: number;
  needsClassification: number;
  duplicatesCount: number;
  missingSkuCount: number;
  missingPriceCount: number;
  missingStockCount: number;
  byMainCategory: Record<string, number>;
  bySubCategory: Record<string, number>;
  bySection: Record<string, number>;
}
