// RETRO Qatar — 3-Level Product Taxonomy System
// Authoritative taxonomy hierarchy: Main Category (Level 1) -> Subcategory (Level 2) -> Section (Level 3)

import type { 
  TaxonomyMainCategory, 
  TaxonomySection, 
  TaxonomySubCategory, 
  MainCategoryId 
} from '@/types/taxonomy';

// Standard 3 Sections for Gaming & Consoles Platforms
export const STANDARD_GAMING_SECTIONS: TaxonomySection[] = [
  {
    id: 'consoles',
    slug: 'consoles',
    nameEn: 'Consoles',
    nameAr: 'أجهزة الألعاب',
    descriptionEn: 'Hardware consoles, home & portable systems, special and limited edition packs',
    descriptionAr: 'منصات وأجهزة الألعاب المنزلية والمحمولة والإصدارات الخاصة والمحدودة',
  },
  {
    id: 'accessories',
    slug: 'accessories',
    nameEn: 'Accessories',
    nameAr: 'الإكسسوارات والمحولات',
    descriptionEn: 'Controllers, memory cards, power adapters, cables, charging docks, and mods',
    descriptionAr: 'أذرع التحكم، بطاقات الذاكرة، محولات الطاقة، الكابلات، قواعد الشحن والتعديلات',
  },
  {
    id: 'games-cds',
    slug: 'games-cds',
    nameEn: 'Games / CDs',
    nameAr: 'الألعاب / الأقراص',
    descriptionEn: 'Original game discs, CDs, cartridges, UMDs, and digital releases',
    descriptionAr: 'أقراص وأشرطة وكارتريدج الألعاب الأصلية والنادرة',
  },
];

// Standard 2 Sections for General Consoles & Accessories
export const CONSOLE_ACCESSORY_SECTIONS: TaxonomySection[] = [
  {
    id: 'consoles',
    slug: 'consoles',
    nameEn: 'Consoles',
    nameAr: 'أجهزة الألعاب',
  },
  {
    id: 'accessories',
    slug: 'accessories',
    nameEn: 'Accessories',
    nameAr: 'الإكسسوارات',
  },
];

// Complete 3-Level Taxonomy Tree
export const FULL_TAXONOMY_TREE: TaxonomyMainCategory[] = [
  // 1. PLAYSTATION
  {
    id: 'playstation',
    slug: 'playstation',
    nameEn: 'PlayStation',
    nameAr: 'بلايستيشن',
    icon: 'controller',
    descriptionEn: 'Sony PlayStation generations from PS1 to PS5',
    descriptionAr: 'منصات وألعاب وإكسسوارات سوني بلايستيشن من PS1 إلى PS5',
    subcategories: [
      {
        id: 'ps1',
        slug: 'ps1',
        nameEn: 'PS1',
        nameAr: 'بلايستيشن 1',
        parentCategoryId: 'playstation',
        icon: 'disc',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'ps2',
        slug: 'ps2',
        nameEn: 'PS2',
        nameAr: 'بلايستيشن 2',
        parentCategoryId: 'playstation',
        icon: 'disc',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'ps3',
        slug: 'ps3',
        nameEn: 'PS3',
        nameAr: 'بلايستيشن 3',
        parentCategoryId: 'playstation',
        icon: 'disc',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'ps4',
        slug: 'ps4',
        nameEn: 'PS4',
        nameAr: 'بلايستيشن 4',
        parentCategoryId: 'playstation',
        icon: 'disc',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'ps5',
        slug: 'ps5',
        nameEn: 'PS5',
        nameAr: 'بلايستيشن 5',
        parentCategoryId: 'playstation',
        icon: 'sparkles',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'psp',
        slug: 'psp',
        nameEn: 'PSP / Handhelds',
        nameAr: 'بي إس بي / المحمول',
        parentCategoryId: 'playstation',
        icon: 'gamepad',
        sections: STANDARD_GAMING_SECTIONS,
      },
    ],
  },

  // 2. NINTENDO
  {
    id: 'nintendo',
    slug: 'nintendo',
    nameEn: 'Nintendo',
    nameAr: 'نينتندو',
    icon: 'gamepad',
    descriptionEn: 'Nintendo legendary consoles, handhelds, and exclusive games',
    descriptionAr: 'منصات نينتندو الكلاسيكية والحديثة وألعابها الحصرية',
    subcategories: [
      {
        id: 'nes-snes',
        slug: 'nes-snes',
        nameEn: 'NES / SNES',
        nameAr: 'إن إي إس / سوبر نينتندو',
        parentCategoryId: 'nintendo',
        icon: 'retro',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'game-boy',
        slug: 'game-boy',
        nameEn: 'Game Boy',
        nameAr: 'جيم بوي / GBA / GBC',
        parentCategoryId: 'nintendo',
        icon: 'gamepad',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'ds-3ds',
        slug: 'ds-3ds',
        nameEn: 'Nintendo DS / 3DS',
        nameAr: 'نينتندو دي إس / 3DS',
        parentCategoryId: 'nintendo',
        icon: 'layers',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'wii-wiiu-gamecube',
        slug: 'wii-wiiu-gamecube',
        nameEn: 'Wii / Wii U / GameCube',
        nameAr: 'وي / وي يو / جيم كيوب / N64',
        parentCategoryId: 'nintendo',
        icon: 'disc',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'switch',
        slug: 'switch',
        nameEn: 'Nintendo Switch',
        nameAr: 'نينتندو سويتش',
        parentCategoryId: 'nintendo',
        icon: 'sparkles',
        sections: STANDARD_GAMING_SECTIONS,
      },
    ],
  },

  // 3. XBOX
  {
    id: 'xbox',
    slug: 'xbox',
    nameEn: 'Xbox',
    nameAr: 'إكس بوكس',
    icon: 'controller',
    descriptionEn: 'Microsoft Xbox generations from Original to Series X/S',
    descriptionAr: 'منصات مايكروسوفت إكس بوكس من الجيل الأول حتى Series X/S',
    subcategories: [
      {
        id: 'xbox-original',
        slug: 'xbox-original',
        nameEn: 'Original Xbox',
        nameAr: 'إكس بوكس الأصلي (Classic)',
        parentCategoryId: 'xbox',
        icon: 'box',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'xbox-360',
        slug: 'xbox-360',
        nameEn: 'Xbox 360',
        nameAr: 'إكس بوكس 360',
        parentCategoryId: 'xbox',
        icon: 'disc',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'xbox-one',
        slug: 'xbox-one',
        nameEn: 'Xbox One',
        nameAr: 'إكس بوكس ون',
        parentCategoryId: 'xbox',
        icon: 'disc',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'xbox-series',
        slug: 'xbox-series',
        nameEn: 'Xbox Series X/S',
        nameAr: 'إكس بوكس سيريس X/S',
        parentCategoryId: 'xbox',
        icon: 'sparkles',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'xbox-other',
        slug: 'xbox-other',
        nameEn: 'Xbox Accessories & Other',
        nameAr: 'إكسسوارات وملحقات إكس بوكس',
        parentCategoryId: 'xbox',
        icon: 'shield',
        sections: STANDARD_GAMING_SECTIONS,
      },
    ],
  },

  // 4. RETRO GAMES
  {
    id: 'retro-games',
    slug: 'retro-games',
    nameEn: 'Retro Games',
    nameAr: 'الألعاب الكلاسيكية والريترو',
    icon: 'retro',
    descriptionEn: 'Vintage retro hardware, arcade machines, Sega, Atari, and collectibles',
    descriptionAr: 'أجهزة وألعاب الريترو النادرة من سيجا، أتاري، أميغا، وأجهزة الأركيد',
    subcategories: [
      {
        id: 'atari',
        slug: 'atari',
        nameEn: 'Atari',
        nameAr: 'أتاري (Atari 2600 / 7800 / Flashback)',
        parentCategoryId: 'retro-games',
        icon: 'retro',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'sega',
        slug: 'sega',
        nameEn: 'Sega (Mega Drive / Master System)',
        nameAr: 'سيجا (ميجا درايف / ماستر سيستم)',
        parentCategoryId: 'retro-games',
        icon: 'retro',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'dreamcast-saturn',
        slug: 'dreamcast-saturn',
        nameEn: 'Sega Saturn & Dreamcast',
        nameAr: 'سيجا ساتورن ودريم كاست',
        parentCategoryId: 'retro-games',
        icon: 'disc',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'amiga-commodore',
        slug: 'amiga-commodore',
        nameEn: 'Amiga & Commodore',
        nameAr: 'أميغا وكومودور (Amiga / C64)',
        parentCategoryId: 'retro-games',
        icon: 'cpu',
        sections: STANDARD_GAMING_SECTIONS,
      },
      {
        id: 'other-retro',
        slug: 'other-retro',
        nameEn: 'Other Retro (PC Engine / Famicom / Arcade)',
        nameAr: 'أجهزة ريترو أخرى (بي سي إنجن / فاميلي / أركيد)',
        parentCategoryId: 'retro-games',
        icon: 'grid',
        sections: STANDARD_GAMING_SECTIONS,
      },
    ],
  },

  // 5. CONSOLES & ACCESSORIES
  {
    id: 'consoles-accessories',
    slug: 'consoles-accessories',
    nameEn: 'Consoles & Accessories',
    nameAr: 'أجهزة الألعاب والإكسسوارات',
    icon: 'controller',
    descriptionEn: 'Unified consoles and hardware accessories catalog',
    descriptionAr: 'منصات الألعاب وأذرع التحكم والشواحن لجميع الأنظمة',
    subcategories: [
      {
        id: 'playstation-hardware',
        slug: 'playstation-hardware',
        nameEn: 'PlayStation Hardware',
        nameAr: 'أجهزة وإكسسوارات بلايستيشن',
        parentCategoryId: 'consoles-accessories',
        icon: 'controller',
        sections: CONSOLE_ACCESSORY_SECTIONS,
      },
      {
        id: 'xbox-hardware',
        slug: 'xbox-hardware',
        nameEn: 'Xbox Hardware',
        nameAr: 'أجهزة وإكسسوارات إكس بوكس',
        parentCategoryId: 'consoles-accessories',
        icon: 'controller',
        sections: CONSOLE_ACCESSORY_SECTIONS,
      },
      {
        id: 'nintendo-hardware',
        slug: 'nintendo-hardware',
        nameEn: 'Nintendo Hardware',
        nameAr: 'أجهزة وإكسسوارات نينتندو',
        parentCategoryId: 'consoles-accessories',
        icon: 'gamepad',
        sections: CONSOLE_ACCESSORY_SECTIONS,
      },
      {
        id: 'retro-hardware',
        slug: 'retro-hardware',
        nameEn: 'Retro Consoles & Parts',
        nameAr: 'أجهزة ريترو وقطع كلاسيكية',
        parentCategoryId: 'consoles-accessories',
        icon: 'retro',
        sections: CONSOLE_ACCESSORY_SECTIONS,
      },
    ],
  },

  // 6. PC / COMPUTER (Independent PC Store Inventory)
  {
    id: 'pc',
    slug: 'pc',
    nameEn: 'PC / Computer',
    nameAr: 'الكمبيوتر ومكوناته',
    icon: 'cpu',
    descriptionEn: 'High-performance PC components, custom builds, monitors, and PC games',
    descriptionAr: 'قطع ومكونات الكمبيوتر، التجميعات الاحترافية، الشاشات وألعاب الكمبيوتر',
    subcategories: [
      {
        id: 'cpus',
        slug: 'cpus',
        nameEn: 'CPUs (Processors)',
        nameAr: 'المعالجات (CPUs)',
        parentCategoryId: 'pc',
        icon: 'cpu',
        sections: [{ id: 'general', slug: 'all', nameEn: 'AMD / Intel', nameAr: 'معالجات AMD و Intel' }],
      },
      {
        id: 'gpus',
        slug: 'gpus',
        nameEn: 'GPUs (Graphics Cards)',
        nameAr: 'كروت الشاشة (GPUs)',
        parentCategoryId: 'pc',
        icon: 'zap',
        sections: [{ id: 'general', slug: 'all', nameEn: 'NVIDIA / AMD', nameAr: 'كروت NVIDIA و AMD' }],
      },
      {
        id: 'motherboards',
        slug: 'motherboards',
        nameEn: 'Motherboards',
        nameAr: 'اللوحات الأم (Motherboards)',
        parentCategoryId: 'pc',
        icon: 'layers',
        sections: [{ id: 'general', slug: 'all', nameEn: 'AM4 / AM5 / Intel', nameAr: 'لوحات AM4 / AM5 / Intel' }],
      },
      {
        id: 'ram',
        slug: 'ram',
        nameEn: 'RAM (Memory)',
        nameAr: 'الذاكرة العشوائية (RAM)',
        parentCategoryId: 'pc',
        icon: 'zap',
        sections: [{ id: 'general', slug: 'all', nameEn: 'DDR4 / DDR5', nameAr: 'ذواكر DDR4 و DDR5' }],
      },
      {
        id: 'storage',
        slug: 'storage',
        nameEn: 'Storage (SSD & HDD)',
        nameAr: 'وحدات التخزين (SSD / HDD)',
        parentCategoryId: 'pc',
        icon: 'hard-drive',
        sections: [{ id: 'general', slug: 'all', nameEn: 'NVMe / SATA / HDD', nameAr: 'NVMe / SATA / HDD' }],
      },
      {
        id: 'psus',
        slug: 'psus',
        nameEn: 'PSUs (Power Supplies)',
        nameAr: 'مزودات الطاقة (PSUs)',
        parentCategoryId: 'pc',
        icon: 'power',
        sections: [{ id: 'general', slug: 'all', nameEn: 'Modular / Gold', nameAr: 'مزودات طاقة موثقة' }],
      },
      {
        id: 'pc-cases',
        slug: 'pc-cases',
        nameEn: 'PC Cases',
        nameAr: 'صناديق الكمبيوتر (Cases)',
        parentCategoryId: 'pc',
        icon: 'box',
        sections: [{ id: 'general', slug: 'all', nameEn: 'ATX / Micro-ATX', nameAr: 'كيسات بمختلف الأحجام' }],
      },
      {
        id: 'cooling',
        slug: 'cooling',
        nameEn: 'Cooling & Fans',
        nameAr: 'التبريد والمراوح',
        parentCategoryId: 'pc',
        icon: 'wind',
        sections: [{ id: 'general', slug: 'all', nameEn: 'Liquid & Air Cooling', nameAr: 'تبريد مائي وهوائي' }],
      },
      {
        id: 'monitors',
        slug: 'monitors',
        nameEn: 'Monitors',
        nameAr: 'شاشات الألعاب والعمل',
        parentCategoryId: 'pc',
        icon: 'monitor',
        sections: [{ id: 'general', slug: 'all', nameEn: 'High Refresh & 4K', nameAr: 'شاشات ألعاب وشاشات احترافية' }],
      },
      {
        id: 'gaming-pcs',
        slug: 'gaming-pcs',
        nameEn: 'Gaming PCs (Pre-builts)',
        nameAr: 'تجميعات الكمبيوتر الجاهزة',
        parentCategoryId: 'pc',
        icon: 'cpu',
        sections: [{ id: 'general', slug: 'all', nameEn: 'Custom & Pre-built', nameAr: 'تجميعات ألعاب وبث مخصصة' }],
      },
      {
        id: 'laptops',
        slug: 'laptops',
        nameEn: 'Laptops',
        nameAr: 'أجهزة اللابتوب',
        parentCategoryId: 'pc',
        icon: 'laptop',
        sections: [{ id: 'general', slug: 'all', nameEn: 'Gaming & Business', nameAr: 'لابتوبات ألعاب وأعمال' }],
      },
      {
        id: 'pc-accessories',
        slug: 'pc-accessories',
        nameEn: 'PC Accessories',
        nameAr: 'ملحقات وإكسسوارات الكمبيوتر',
        parentCategoryId: 'pc',
        icon: 'headset',
        sections: [{ id: 'general', slug: 'all', nameEn: 'Keyboards / Mice / Audio', nameAr: 'كيبوردات، ماوسات، وسماعات' }],
      },
      // Distinct PC Games Section
      {
        id: 'pc-games',
        slug: 'pc-games',
        nameEn: 'PC Games / CDs',
        nameAr: 'ألعاب وأقراص الكمبيوتر',
        parentCategoryId: 'pc',
        icon: 'disc',
        sections: [{ id: 'games-cds', slug: 'games-cds', nameEn: 'Games / CDs', nameAr: 'أقراص وألعاب الكمبيوتر' }],
      },
    ],
  },
];

// Helper Functions
export function getTaxonomyCategory(idOrSlug: string): TaxonomyMainCategory | undefined {
  const norm = idOrSlug.toLowerCase();
  return FULL_TAXONOMY_TREE.find(
    (c) => c.id === norm || c.slug === norm
  );
}

export function getTaxonomySubCategory(
  mainCatIdOrSlug: string, 
  subCatIdOrSlug: string
): TaxonomySubCategory | undefined {
  const main = getTaxonomyCategory(mainCatIdOrSlug);
  if (!main) return undefined;
  const subNorm = subCatIdOrSlug.toLowerCase();
  return main.subcategories.find(
    (s) => s.id === subNorm || s.slug === subNorm
  );
}

export function getTaxonomySection(
  sectionIdOrSlug: string
): TaxonomySection | undefined {
  const norm = sectionIdOrSlug.toLowerCase();
  return STANDARD_GAMING_SECTIONS.find(
    (s) => s.id === norm || s.slug === norm
  );
}

export function getAllSubCategories(): TaxonomySubCategory[] {
  return FULL_TAXONOMY_TREE.flatMap((cat) => cat.subcategories);
}
