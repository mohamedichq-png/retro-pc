// RETRO Qatar — Product Classification Engine
// Intelligent deterministic 3-level taxonomy classification with POS vs PC source isolation

import type { Product } from '@/types/product';
import type { 
  ClassificationResult, 
  MainCategoryId, 
  SectionId, 
  TaxonomySummary 
} from '@/types/taxonomy';

/**
 * Classifies a single product into Main Category, Subcategory, and Section
 */
export function classifyProduct(product: Partial<Product>): ClassificationResult {
  const name = `${product.nameEn || ''} ${product.nameAr || ''}`.toLowerCase();
  const sku = (product.sku || '').toUpperCase();
  const brand = (product.brand || '').toLowerCase();
  const rawCat = (product.category || '').toLowerCase();
  const rawSubCat = (product.subCategory || '').toLowerCase();
  const platform = (product.platform || '').toLowerCase();
  const productType = (product.productType || '').toUpperCase();
  const model = (product.model || '').toLowerCase();

  // ── RULE 1: PC Games from POS ──
  // If product is a game for PC (e.g. Crysis, Age of Empires, PC DVD/CD) -> PC -> PC Games -> Games / CDs
  const isGameWord = name.includes('game') || name.includes('cd') || name.includes('dvd') || name.includes('disc') || name.includes('لعبة') || name.includes('قرص');
  const isPcGameName = (name.includes('pc') || name.includes('windows') || platform.includes('pc')) && 
    (isGameWord || name.includes('crysis') || name.includes('age of empires') || name.includes('ghost recon') || name.includes('warcraft') || name.includes('command & conquer') || name.includes('sims'));

  if (isPcGameName && !name.includes('gpu') && !name.includes('cpu') && !name.includes('ram') && !name.includes('motherboard') && !name.includes('case') && !name.includes('power supply')) {
    return {
      mainCategory: 'pc',
      subCategory: 'pc-games',
      section: 'games-cds',
      detectedPlatform: 'PC Games',
      confidence: 0.95,
      needsClassification: false,
      source: 'POS',
      reason: 'PC Game detected from software title'
    };
  }

  // ── RULE 2: PC Hardware & Components (Source: PC Database) ──
  if (
    rawCat === 'cpus' || rawCat === 'cpu' || rawCat === 'processors' ||
    name.includes('ryzen') || name.includes('core i3') || name.includes('core i5') || name.includes('core i7') || name.includes('core i9') || name.includes('intel core') || name.includes('amd ryzen')
  ) {
    return {
      mainCategory: 'pc',
      subCategory: 'cpus',
      section: 'general',
      detectedPlatform: 'PC Hardware',
      confidence: 0.98,
      needsClassification: false,
      source: 'PC',
      reason: 'Processor / CPU specification matched'
    };
  }

  if (
    rawCat === 'gpus' || rawCat === 'gpu' || rawCat === 'graphics cards' ||
    name.includes('rtx') || name.includes('gtx') || name.includes('radeon rx') || name.includes('geforce') || name.includes('graphics card') || name.includes('كرت شاشة')
  ) {
    return {
      mainCategory: 'pc',
      subCategory: 'gpus',
      section: 'general',
      detectedPlatform: 'PC Hardware',
      confidence: 0.98,
      needsClassification: false,
      source: 'PC',
      reason: 'Graphics card / GPU matched'
    };
  }

  if (
    rawCat === 'motherboards' || rawCat === 'motherboard' ||
    name.includes('motherboard') || name.includes('z790') || name.includes('b650') || name.includes('b760') || name.includes('x670') || name.includes('لوحة أم') || name.includes('مذربورد')
  ) {
    return {
      mainCategory: 'pc',
      subCategory: 'motherboards',
      section: 'general',
      detectedPlatform: 'PC Hardware',
      confidence: 0.98,
      needsClassification: false,
      source: 'PC',
      reason: 'Motherboard matched'
    };
  }

  if (
    rawCat === 'ram' || rawCat === 'memory' ||
    name.includes('ddr4') || name.includes('ddr5') || name.includes('vengeance rgb') || name.includes('trident z') || name.includes('ram 16gb') || name.includes('ram 32gb') || name.includes('ذاكرة كورسير') || name.includes('رام')
  ) {
    return {
      mainCategory: 'pc',
      subCategory: 'ram',
      section: 'general',
      detectedPlatform: 'PC Hardware',
      confidence: 0.98,
      needsClassification: false,
      source: 'PC',
      reason: 'RAM Memory matched'
    };
  }

  if (
    rawCat === 'ssd' || rawCat === 'storage' || rawCat === 'hdd' ||
    name.includes('nvme') || name.includes('m.2 ssd') || name.includes('sata ssd') || name.includes('samsung 990') || name.includes('wd black') || name.includes('hard drive') || name.includes('تخزين')
  ) {
    return {
      mainCategory: 'pc',
      subCategory: 'storage',
      section: 'general',
      detectedPlatform: 'PC Hardware',
      confidence: 0.98,
      needsClassification: false,
      source: 'PC',
      reason: 'Storage / SSD matched'
    };
  }

  if (
    rawCat === 'psus' || rawCat === 'psu' || rawCat === 'power supplies' ||
    name.includes('80 plus') || name.includes('power supply') || name.includes('modular psu') || name.includes('مزود طاقة') || name.includes('corsair rm')
  ) {
    return {
      mainCategory: 'pc',
      subCategory: 'psus',
      section: 'general',
      detectedPlatform: 'PC Hardware',
      confidence: 0.98,
      needsClassification: false,
      source: 'PC',
      reason: 'Power Supply Unit matched'
    };
  }

  if (
    rawCat === 'cases' || rawCat === 'pc cases' ||
    name.includes('case') || name.includes('mid-tower') || name.includes('full-tower') || name.includes('chassis') || name.includes('كيس') || name.includes('صندوق كمبيوتر')
  ) {
    return {
      mainCategory: 'pc',
      subCategory: 'pc-cases',
      section: 'general',
      detectedPlatform: 'PC Hardware',
      confidence: 0.95,
      needsClassification: false,
      source: 'PC',
      reason: 'PC Case matched'
    };
  }

  if (
    rawCat === 'cooling' || rawCat === 'fans' ||
    name.includes('liquid cooler') || name.includes('air cooler') || name.includes('aio') || name.includes('argb fan') || name.includes('تبريد') || name.includes('مروحة')
  ) {
    return {
      mainCategory: 'pc',
      subCategory: 'cooling',
      section: 'general',
      detectedPlatform: 'PC Hardware',
      confidence: 0.95,
      needsClassification: false,
      source: 'PC',
      reason: 'Cooling matched'
    };
  }

  if (
    rawCat === 'monitors' || rawCat === 'monitor' ||
    name.includes('monitor') || name.includes('gaming monitor') || name.includes('144hz') || name.includes('165hz') || name.includes('240hz') || name.includes('شاشة') || name.includes('oled 27')
  ) {
    return {
      mainCategory: 'pc',
      subCategory: 'monitors',
      section: 'general',
      detectedPlatform: 'Monitors',
      confidence: 0.98,
      needsClassification: false,
      source: 'PC',
      reason: 'Monitor matched'
    };
  }

  if (
    rawCat === 'gaming pcs' || productType === 'CUSTOM PC' || productType === 'PRE-BUILT PC' ||
    name.includes('gaming pc') || name.includes('pre-built pc') || name.includes('تجميعة')
  ) {
    return {
      mainCategory: 'pc',
      subCategory: 'gaming-pcs',
      section: 'general',
      detectedPlatform: 'Gaming PC',
      confidence: 0.95,
      needsClassification: false,
      source: 'PC',
      reason: 'Gaming PC build matched'
    };
  }

  if (
    rawCat === 'laptops' || rawCat === 'laptop' ||
    name.includes('laptop') || name.includes('notebook') || name.includes('لابتوب')
  ) {
    return {
      mainCategory: 'pc',
      subCategory: 'laptops',
      section: 'general',
      detectedPlatform: 'Laptops',
      confidence: 0.95,
      needsClassification: false,
      source: 'PC',
      reason: 'Laptop matched'
    };
  }

  // ── RULE 3: Section Classifier Helper (Consoles vs Accessories vs Games/CDs) ──
  const isAccessory = 
    name.includes('controller') || name.includes('control') || name.includes('gamepad') || 
    name.includes('cable') || name.includes('adapter') || name.includes('charging') || 
    name.includes('charge') || name.includes('memory card') || name.includes('headset') || 
    name.includes('dock') || name.includes('stand') || name.includes('joystick') || 
    name.includes('يد') || name.includes('كابل') || name.includes('محول') || name.includes('ذراع') || 
    name.includes('شاحن') || name.includes('قاعدة شحن') || name.includes('necklace') || name.includes('قلادة');

  const isGame = 
    name.includes('game') || name.includes('cd') || name.includes('disc') || 
    name.includes('cartridge') || name.includes('vhs') || name.includes('umd') ||
    name.includes('assassin') || name.includes('mario') || name.includes('pokemon') || 
    name.includes('zelda') || name.includes('halo') || name.includes('sonic') || 
    name.includes('gta') || name.includes('final fantasy') || name.includes('resident evil');

  const isConsole = 
    !isAccessory && !isGame && (
      name.includes('console') || name.includes('system') || name.includes('bundle') || 
      name.includes('pack') || name.includes('edition') || name.includes('slim') || 
      name.includes('fat') || name.includes('pro') || name.includes('جهاز') || 
      name.includes('منصة') || name.includes('original black') || name.includes('glacier white') ||
      sku.startsWith('PLAY-') || sku.startsWith('PSP-') || sku.startsWith('XBOX-') || sku.startsWith('NIN-') || sku.startsWith('RETRO-')
    );

  const detectedSection: SectionId = isAccessory 
    ? 'accessories' 
    : isGame 
    ? 'games-cds' 
    : 'consoles';

  // ── RULE 4: PLAYSTATION GENERATIONS ──
  if (
    sku.startsWith('PLAY-') || sku.startsWith('PSP-') ||
    name.includes('playstation') || name.includes('ps one') || name.includes('ps1') || 
    name.includes('ps2') || name.includes('ps3') || name.includes('ps4') || 
    name.includes('ps5') || name.includes('psp') || name.includes('بلايستيشن') ||
    platform.includes('playstation') || platform.includes('ps')
  ) {
    let subCat = 'ps1';
    let detectedPlat = 'PlayStation 1';

    if (sku.startsWith('PSP-') || name.includes('psp') || name.includes('vita') || name.includes('بي إس بي') || platform.includes('psp')) {
      subCat = 'psp';
      detectedPlat = 'PSP';
    } else if (name.includes('ps5') || name.includes('playstation 5') || name.includes('بلايستيشن 5') || sku === 'PLAY-015' || sku === 'PLAY-016' || sku === 'PLAY-017') {
      subCat = 'ps5';
      detectedPlat = 'PlayStation 5';
    } else if (name.includes('ps4') || name.includes('playstation 4') || name.includes('بلايستيشن 4') || sku === 'PLAY-007' || sku === 'PLAY-008' || sku === 'PLAY-009' || sku === 'PLAY-010' || sku === 'PLAY-011' || sku === 'PLAY-013' || sku === 'PLAY-014') {
      subCat = 'ps4';
      detectedPlat = 'PlayStation 4';
    } else if (name.includes('ps3') || name.includes('playstation 3') || name.includes('بلايستيشن 3') || sku === 'PLAY-004' || sku === 'PLAY-005' || sku === 'PLAY-006') {
      subCat = 'ps3';
      detectedPlat = 'PlayStation 3';
    } else if (name.includes('ps2') || name.includes('playstation 2') || name.includes('بلايستيشن 2') || sku === 'PLAY-002' || sku === 'PLAY-003') {
      subCat = 'ps2';
      detectedPlat = 'PlayStation 2';
    } else if (sku === 'PLAY-012' || name.includes('playstation classic') || name.includes('ps one') || name.includes('ps1') || name.includes('بلايستيشن ون')) {
      subCat = 'ps1';
      detectedPlat = 'PlayStation 1';
    }

    return {
      mainCategory: 'playstation',
      subCategory: subCat,
      section: detectedSection,
      detectedPlatform: detectedPlat,
      confidence: 0.95,
      needsClassification: false,
      source: 'POS',
      reason: `PlayStation generation ${subCat.toUpperCase()} identified`
    };
  }

  // ── RULE 5: NINTENDO PLATFORMS ──
  if (
    sku.startsWith('NIN-') || name.includes('nintendo') || name.includes('game boy') || 
    name.includes('gamecube') || name.includes('ds') || name.includes('3ds') || 
    name.includes('wii') || name.includes('switch') || name.includes('famicom') ||
    name.includes('nes') || name.includes('snes') || name.includes('نينتندو') ||
    platform.includes('nintendo')
  ) {
    let subCat = 'switch';
    let detectedPlat = 'Nintendo Switch';

    if (name.includes('game boy') || name.includes('gba') || name.includes('gbc') || name.includes('جيم بوي')) {
      subCat = 'game-boy';
      detectedPlat = 'Game Boy';
    } else if (name.includes('3ds') || name.includes('dsi') || name.includes('ds lite') || name.includes('nintendo ds') || name.includes('دي إس')) {
      subCat = 'ds-3ds';
      detectedPlat = 'Nintendo DS / 3DS';
    } else if (name.includes('wii u') || name.includes('wii') || name.includes('gamecube') || name.includes('nintendo 64') || name.includes('n64') || name.includes('جيم كيوب') || name.includes('وي')) {
      subCat = 'wii-wiiu-gamecube';
      detectedPlat = 'Wii / Wii U / GameCube / N64';
    } else if (name.includes('nes') || name.includes('snes') || name.includes('famicom') || name.includes('فاميلي')) {
      subCat = 'nes-snes';
      detectedPlat = 'NES / SNES / Famicom';
    } else if (name.includes('switch') || name.includes('سويتش') || name.includes('zelda') || name.includes('pokemon')) {
      subCat = 'switch';
      detectedPlat = 'Nintendo Switch';
    }

    return {
      mainCategory: 'nintendo',
      subCategory: subCat,
      section: detectedSection,
      detectedPlatform: detectedPlat,
      confidence: 0.95,
      needsClassification: false,
      source: 'POS',
      reason: `Nintendo platform ${detectedPlat} identified`
    };
  }

  // ── RULE 6: XBOX GENERATIONS ──
  if (
    sku.startsWith('XBOX-') || sku.startsWith('XB-') || 
    name.includes('xbox') || name.includes('إكس بوكس') || platform.includes('xbox')
  ) {
    let subCat = 'xbox-original';
    let detectedPlat = 'Original Xbox';

    if (name.includes('series') || name.includes('سيريس')) {
      subCat = 'xbox-series';
      detectedPlat = 'Xbox Series X/S';
    } else if (name.includes('xbox one') || name.includes('إكس بوكس ون')) {
      subCat = 'xbox-one';
      detectedPlat = 'Xbox One';
    } else if (name.includes('360') || name.includes('xbox 360')) {
      subCat = 'xbox-360';
      detectedPlat = 'Xbox 360';
    } else if (name.includes('original') || name.includes('classic') || sku === 'XBOX-001' || sku === 'XBOX-002') {
      subCat = 'xbox-original';
      detectedPlat = 'Original Xbox';
    } else {
      subCat = 'xbox-other';
      detectedPlat = 'Xbox Hardware';
    }

    return {
      mainCategory: 'xbox',
      subCategory: subCat,
      section: detectedSection,
      detectedPlatform: detectedPlat,
      confidence: 0.95,
      needsClassification: false,
      source: 'POS',
      reason: `Xbox generation ${detectedPlat} identified`
    };
  }

  // ── RULE 7: RETRO GAMES & PLATFORMS ──
  if (
    sku.startsWith('RETRO-') || sku.startsWith('RET-') ||
    name.includes('sega') || name.includes('saturn') || name.includes('dreamcast') || 
    name.includes('atari') || name.includes('amiga') || name.includes('c64') || 
    name.includes('commodore') || name.includes('pc engine') || name.includes('retron') || 
    name.includes('family computer') || name.includes('super 97') || name.includes('ريترو') ||
    platform.includes('retro') || platform.includes('sega') || platform.includes('atari')
  ) {
    let subCat = 'other-retro';
    let detectedPlat = 'Other Retro';

    if (name.includes('atari') || name.includes('أتاري')) {
      subCat = 'atari';
      detectedPlat = 'Atari';
    } else if (name.includes('saturn') || name.includes('dreamcast') || name.includes('دريم كاست') || name.includes('ساتورن')) {
      subCat = 'dreamcast-saturn';
      detectedPlat = 'Sega Saturn & Dreamcast';
    } else if (name.includes('sega') || name.includes('mega drive') || name.includes('سيجا')) {
      subCat = 'sega';
      detectedPlat = 'Sega Mega Drive';
    } else if (name.includes('amiga') || name.includes('commodore') || name.includes('c64') || name.includes('أميغا')) {
      subCat = 'amiga-commodore';
      detectedPlat = 'Amiga & Commodore';
    } else {
      subCat = 'other-retro';
      detectedPlat = 'Classic Retro / Famicom / PC Engine';
    }

    return {
      mainCategory: 'retro-games',
      subCategory: subCat,
      section: detectedSection,
      detectedPlatform: detectedPlat,
      confidence: 0.92,
      needsClassification: false,
      source: 'POS',
      reason: `Retro platform ${detectedPlat} identified`
    };
  }

  // ── RULE 8: FALLBACK / NEEDS CLASSIFICATION ──
  return {
    mainCategory: 'consoles-accessories',
    subCategory: 'retro-hardware',
    section: detectedSection,
    detectedPlatform: platform || 'Unspecified',
    confidence: 0.50,
    needsClassification: true,
    source: product.source || 'POS',
    reason: 'Low confidence match, flagged for Admin review'
  };
}

/**
 * Batch classification of all products with full summary metrics calculation
 */
export function classifyAllProducts(products: Product[]): { 
  classified: Product[]; 
  summary: TaxonomySummary 
} {
  const summary: TaxonomySummary = {
    totalProducts: products.length,
    totalPosProducts: 0,
    totalPcProducts: 0,
    successfullyClassified: 0,
    needsClassification: 0,
    duplicatesCount: 0,
    missingSkuCount: 0,
    missingPriceCount: 0,
    missingStockCount: 0,
    byMainCategory: {},
    bySubCategory: {},
    bySection: {},
  };

  const seenSkus = new Set<string>();

  const classified = products.map((p) => {
    // Check missing fields
    if (!p.sku) summary.missingSkuCount++;
    if (p.sellingPrice === undefined || p.sellingPrice === null) summary.missingPriceCount++;
    if (p.stockQty === undefined || p.stockQty === null) summary.missingStockCount++;

    // Check duplicates
    if (p.sku) {
      if (seenSkus.has(p.sku.toUpperCase())) {
        summary.duplicatesCount++;
      } else {
        seenSkus.add(p.sku.toUpperCase());
      }
    }

    // Classify
    const res = classifyProduct(p);

    if (res.source === 'POS') {
      summary.totalPosProducts++;
    } else {
      summary.totalPcProducts++;
    }

    if (res.needsClassification) {
      summary.needsClassification++;
    } else {
      summary.successfullyClassified++;
    }

    // Metrics counters
    summary.byMainCategory[res.mainCategory] = (summary.byMainCategory[res.mainCategory] || 0) + 1;
    summary.bySubCategory[res.subCategory] = (summary.bySubCategory[res.subCategory] || 0) + 1;
    summary.bySection[res.section] = (summary.bySection[res.section] || 0) + 1;

    return {
      ...p,
      mainCategory: p.mainCategory || res.mainCategory,
      subCategory: p.subCategory || res.subCategory,
      section: (p.section || res.section) as any,
      taxonomyConfidence: res.confidence,
      needsClassification: res.needsClassification,
      source: p.source || res.source,
      category: p.category || res.subCategory,
    };
  });

  return { classified, summary };
}
