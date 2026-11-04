import type { Product } from '@/types';

export interface RetroPcCategoryNode {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  color?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  tokens: string[];
  hidden?: boolean;
  children: RetroPcCategoryNode[];
}

export const RETRO_PC_CATEGORIES: RetroPcCategoryNode[] = [
  {
    id: 'processors',
    name: 'Processors (CPU)',
    nameAr: 'المعالجات (CPU)',
    image: '/media/image61.jpeg',
    color: '#06b6d4',
    descriptionEn: 'Intel Core & AMD Ryzen desktop processors',
    descriptionAr: 'معالجات الألعاب والأعمال من Intel و AMD',
    tokens: ['processors', 'processor', 'cpu', 'cpus', 'معالج', 'معالجات'],
    children: [
      {
        id: 'intel',
        name: 'Intel',
        nameAr: 'إنتل (Intel)',
        image: '/media/retro-pc/intel-processors.jpg',
        color: '#0071c5',
        tokens: ['intel', 'core i', 'lga1700', '14700', '14900', '13700', '13900', '12700', '12400', 'إنتل', 'انتل'],
        children: [
          {
            id: 'core-i5',
            name: 'Core i5',
            nameAr: 'Core i5',
            image: '/media/image59.png',
            tokens: ['core i5', 'i5-', '14600', '13600', '12400', '14400'],
            children: [],
          },
          {
            id: 'core-i7',
            name: 'Core i7',
            nameAr: 'Core i7',
            image: '/media/image60.jpeg',
            tokens: ['core i7', 'i7-', '14700', '13700', '12700'],
            children: [],
          },
          {
            id: 'core-i9',
            name: 'Core i9',
            nameAr: 'Core i9',
            image: '/media/image61.jpeg',
            tokens: ['core i9', 'i9-', '14900', '13900', '12900'],
            children: [],
          },
        ],
      },
      {
        id: 'amd',
        name: 'AMD',
        nameAr: 'إيه إم دي (AMD)',
        image: '/media/retro-pc/amd-processors.jpg',
        color: '#ed1c24',
        tokens: ['amd', 'ryzen', 'threadripper', 'am5', 'x3d', 'رايزن'],
        children: [
          {
            id: 'ryzen-5',
            name: 'Ryzen 5',
            nameAr: 'Ryzen 5',
            image: '/media/image54.jpeg',
            tokens: ['ryzen 5', '9600x', '7600x', '7600', '5600x', '5600'],
            children: [],
          },
          {
            id: 'ryzen-7',
            name: 'Ryzen 7',
            nameAr: 'Ryzen 7',
            image: '/media/image56.jpeg',
            tokens: ['ryzen 7', '9700x', '9800x3d', '7800x3d', '7700x', '5800x'],
            children: [],
          },
          {
            id: 'ryzen-9',
            name: 'Ryzen 9',
            nameAr: 'Ryzen 9',
            image: '/media/image57.jpeg',
            tokens: ['ryzen 9', '9950x3d', '9950x', '9900x', '7950x3d', '7950x', '7900x'],
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 'graphics-cards',
    name: 'Graphics Cards (GPU)',
    nameAr: 'كروت الشاشة (GPU)',
    image: '/media/image42.jpeg',
    color: '#22c55e',
    descriptionEn: 'NVIDIA GeForce RTX & AMD Radeon graphics cards',
    descriptionAr: 'بطاقات الرسوميات الاحترافية للألعاب والتصميم',
    tokens: ['graphics-cards', 'gpu', 'gpus', 'graphics card', 'كرت شاشة', 'كروت الشاشة'],
    children: [
      {
        id: 'nvidia',
        name: 'NVIDIA',
        nameAr: 'إنفيديا (NVIDIA)',
        image: '/media/image44.jpeg',
        color: '#76b900',
        tokens: ['nvidia', 'geforce', 'rtx', 'إنفيديا', 'انفيديا'],
        children: [
          {
            id: 'rtx-50-series',
            name: 'RTX 50 Series',
            nameAr: 'سلسلة RTX 50 Series',
            image: '/media/image42.jpeg',
            tokens: ['rtx 50', '5090', '5080', '5070', '5060', 'rtx50'],
            children: [],
          },
          {
            id: 'rtx-40-series',
            name: 'RTX 40 Series',
            nameAr: 'سلسلة RTX 40 Series',
            image: '/media/image43.jpeg',
            tokens: ['rtx 40', '4090', '4080', '4070', '4060', 'rtx40'],
            children: [],
          },
        ],
      },
      {
        id: 'amd-gpu',
        name: 'AMD',
        nameAr: 'إيه إم دي (AMD Radeon)',
        image: '/media/image45.jpeg',
        color: '#ed1c24',
        tokens: ['radeon', 'rx 7', 'rx 9', 'rx 6', 'amd radeon'],
        children: [
          {
            id: 'radeon-rx-series',
            name: 'Radeon RX Series',
            nameAr: 'سلسلة Radeon RX',
            image: '/media/image45.jpeg',
            tokens: ['radeon', 'rx 7900', 'rx 7800', 'rx 7700', 'rx 7600', 'rx 9070', 'radeon rx'],
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 'motherboards',
    name: 'Motherboards',
    nameAr: 'اللوحات الأم (Motherboards)',
    image: '/media/image49.jpeg',
    color: '#a855f7',
    descriptionEn: 'Intel & AMD gaming and workstation motherboards',
    descriptionAr: 'اللوحات الرئيسية المتوافقة مع معالجات Intel و AMD',
    tokens: ['motherboards', 'motherboard', 'mobo', 'mainboard', 'لوحة أم', 'اللوحات الأم'],
    children: [
      {
        id: 'intel-motherboards',
        name: 'Intel Motherboards',
        nameAr: 'لوحات إنتل (Intel)',
        image: '/media/image49.jpeg',
        tokens: ['z790', 'b760', 'h610', 'z890', 'lga1700', 'lga1851', 'prime z790', 'prime b760', 'rog strix z790'],
        children: [
          {
            id: 'z790-series',
            name: 'Z790 Series',
            nameAr: 'سلسلة Z790',
            image: '/media/image49.jpeg',
            tokens: ['z790'],
            children: [],
          },
          {
            id: 'b760-series',
            name: 'B760 Series',
            nameAr: 'سلسلة B760',
            image: '/media/image50.jpeg',
            tokens: ['b760'],
            children: [],
          },
        ],
      },
      {
        id: 'amd-motherboards',
        name: 'AMD Motherboards',
        nameAr: 'لوحات AMD',
        image: '/media/image53.jpeg',
        tokens: ['x870', 'x670', 'b850', 'b650', 'a620', 'am5'],
        children: [
          {
            id: 'x870-x670-series',
            name: 'X870 / X670 Series',
            nameAr: 'سلسلة X870 / X670',
            image: '/media/image53.jpeg',
            tokens: ['x870', 'x670'],
            children: [],
          },
          {
            id: 'b850-b650-series',
            name: 'B850 / B650 Series',
            nameAr: 'سلسلة B850 / B650',
            image: '/media/image52.jpeg',
            tokens: ['b850', 'b650'],
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 'memory',
    name: 'Memory (RAM)',
    nameAr: 'الذاكرة (RAM)',
    image: '/media/image67.jpeg',
    color: '#06b6d4',
    descriptionEn: 'High-speed DDR5 & DDR4 desktop gaming memory',
    descriptionAr: 'ذواكر عشوائية فائقة السرعة DDR4 و DDR5',
    tokens: ['memory', 'ram', 'رام', 'رامات', 'الذاكرة'],
    children: [
      {
        id: 'ddr4',
        name: 'DDR4',
        nameAr: 'ذاكرة DDR4',
        image: '/media/image67.jpeg',
        tokens: ['ddr4', '3200mhz', '3600mhz'],
        children: [],
      },
      {
        id: 'ddr5',
        name: 'DDR5',
        nameAr: 'ذاكرة DDR5',
        image: '/media/image67.jpeg',
        tokens: ['ddr5', '6000mhz', '6400mhz', '5600mhz', '5200mhz', 'vengeance rgb 32gb', 'vengeance rgb 64gb', 'dominator'],
        children: [],
      },
    ],
  },
  {
    id: 'storage',
    name: 'Storage (SSD / HDD)',
    nameAr: 'التخزين (SSD / HDD)',
    image: '/media/image70.jpeg',
    color: '#3b82f6',
    descriptionEn: 'Gen4 & Gen5 NVMe M.2 SSDs and high-capacity storage',
    descriptionAr: 'وحدات تخزين فائقة السرعة NVMe M.2 و SSD و HDD',
    tokens: ['storage', 'ssd', 'nvme', 'hdd', 'تخزين'],
    children: [
      {
        id: 'nvme-ssd',
        name: 'NVMe M.2 SSD',
        nameAr: 'وحدات NVMe M.2 SSD',
        image: '/media/image70.jpeg',
        tokens: ['nvme', 'm.2', 'pcie', '990 pro', 'sn850', 'apacer', 'lexar', 'kingston', 'ssd'],
        children: [],
      },
      {
        id: 'sata-hdd',
        name: 'SATA SSD & HDD',
        nameAr: 'وحدات SATA SSD و HDD',
        image: '/media/image69.jpeg',
        tokens: ['sata', 'hdd', 'hard drive', 'barracuda'],
        children: [],
      },
    ],
  },
  {
    id: 'power-supplies',
    name: 'Power Supplies (PSU)',
    nameAr: 'مزودات الطاقة (PSU)',
    image: '/media/image63.jpeg',
    color: '#f59e0b',
    descriptionEn: '80+ Gold & Platinum modular power supplies',
    descriptionAr: 'مزودات طاقة أصلية معتمدة بالكامل 80+ Gold',
    tokens: ['power-supplies', 'psu', 'psus', 'power supply', 'مزود طاقة', 'باور سبلاي'],
    children: [
      {
        id: 'corsair-psu',
        name: 'Corsair',
        nameAr: 'كورساير (Corsair)',
        image: '/media/image63.jpeg',
        tokens: ['corsair', 'rm750', 'rm850', 'rm1000', 'rme', 'rmx'],
        children: [],
      },
      {
        id: 'thermaltake-psu',
        name: 'Thermaltake',
        nameAr: 'ثيرمالتيك (Thermaltake)',
        image: '/media/image66.jpeg',
        tokens: ['thermaltake', 'toughpower', 'gf3', 'gt 850w'],
        children: [],
      },
    ],
  },
  {
    id: 'pc-cases',
    name: 'PC Cases',
    nameAr: 'صناديق الحاسوب (PC Cases)',
    image: '/media/image14.jpeg',
    color: '#ec4899',
    descriptionEn: 'ATX, Mid-Tower & Panoramic ARGB gaming cases',
    descriptionAr: 'كيسات كمبيوتر احترافية بإضاءة ARGB وتبريد ممتاز',
    tokens: ['pc-cases', 'cases', 'case', 'chassis', 'كيس', 'كيسات', 'صندوق'],
    children: [
      {
        id: 'thermaltake-cases',
        name: 'Thermaltake',
        nameAr: 'كيسات Thermaltake',
        image: '/media/image14.jpeg',
        tokens: ['thermaltake', 'view 270', 's200', 'the tower'],
        children: [],
      },
      {
        id: 'darkflash-cases',
        name: 'Darkflash',
        nameAr: 'كيسات Darkflash',
        image: '/media/image16.jpeg',
        tokens: ['darkflash', 'ds900', 'dy470', 'dk352'],
        children: [],
      },
      {
        id: 'nzxt-cases',
        name: 'NZXT',
        nameAr: 'كيسات NZXT',
        image: '/media/image15.png',
        tokens: ['nzxt', 'h9 flow', 'h7', 'h6', 'h5'],
        children: [],
      },
      {
        id: 'aerocool-mercury-cases',
        name: 'Aerocool & Mercury',
        nameAr: 'كيسات Aerocool & Mercury',
        image: '/media/image13.jpeg',
        tokens: ['aerocool', 'mercury', 'p500c'],
        children: [],
      },
    ],
  },
  {
    id: 'cooling-systems',
    name: 'Cooling Systems',
    nameAr: 'أنظمة التبريد (Cooling)',
    image: '/media/image29.jpeg',
    color: '#06b6d4',
    descriptionEn: '360mm AIO liquid coolers, air coolers & ARGB fans',
    descriptionAr: 'مبردات مائية 360mm ومبردات هوائية احترافية',
    tokens: ['cooling-systems', 'cooling', 'coolers', 'cooler', 'تبريد', 'مبرد'],
    children: [
      {
        id: 'liquid-cooling',
        name: 'Liquid Coolers (AIO)',
        nameAr: 'تبريد مائي (AIO Liquid)',
        image: '/media/image29.jpeg',
        tokens: ['liquid', 'aio', '360mm', '240mm', 'la-360', 'galahad', 'th360', 'تبريد مائي', 'مبرد مائي'],
        children: [],
      },
      {
        id: 'air-cooling',
        name: 'Air Coolers & Fans',
        nameAr: 'تبريد هوائي ومراوح',
        image: '/media/image29.jpeg',
        tokens: ['air cooler', 'astria', 'ux200', 'assassin', 'noctua', 'تبريد هوائي', 'مبرد هوائي'],
        children: [],
      },
    ],
  },
  {
    id: 'custom-gaming-pcs',
    name: 'Custom Gaming PCs',
    nameAr: 'تجميعات الألعاب (Custom Gaming PCs)',
    image: '/media/retro-pc/pc-section-hero.webp',
    color: '#8b5cf6',
    descriptionEn: 'Pre-built & custom tuned high-FPS gaming rigs',
    descriptionAr: 'أجهزة وتجميعات ألعاب احترافية جاهزة للتشغيل الفوري',
    tokens: ['custom-gaming-pcs', 'gaming-pcs', 'prebuilt', 'pre-built', 'custom pc', 'build-retro', 'تجميعة', 'تجميعات'],
    children: [
      {
        id: 'extreme-gaming-pcs',
        name: 'RTX 4090 / 4080 Extreme Builds',
        nameAr: 'تجميعات الفئة العليا (RTX 4090 / 4080)',
        image: '/media/image50.jpeg',
        tokens: ['apex', 'titan', '4090', '4080', '5090', '5080'],
        children: [],
      },
      {
        id: 'pro-gaming-pcs',
        name: 'RTX 4070 / 4060 Pro Builds',
        nameAr: 'تجميعات الألعاب الاحترافية (RTX 4070 / 4060)',
        image: '/media/image52.jpeg',
        tokens: ['storm', 'cyber', '4070', '4060', '5070', '5060'],
        children: [],
      },
    ],
  },
  {
    id: 'pc-accessories',
    name: 'PC Accessories',
    nameAr: 'إكسسوارات الكمبيوتر (PC Accessories)',
    image: '/media/image68.png',
    color: '#14b8a6',
    descriptionEn: 'Gaming monitors, mechanical keyboards, mice & headsets',
    descriptionAr: 'شاشات الألعاب، لوحات المفاتيح الميكانيكية، الماوس والسماعات',
    tokens: ['pc-accessories', 'monitors', 'monitor', 'keyboard', 'mouse', 'headset', 'شاشة', 'شاشات', 'كيبورد', 'ماوس'],
    children: [
      {
        id: 'gaming-monitors',
        name: 'Gaming Monitors',
        nameAr: 'شاشات الألعاب (Monitors)',
        image: '/media/image68.png',
        tokens: ['monitors', 'monitor', 'hz', 'vg27', 'oled', 'ips', 'شاشة', 'شاشات'],
        children: [],
      },
      {
        id: 'pc-peripherals',
        name: 'Keyboards, Mice & Gear',
        nameAr: 'لوحات المفاتيح والماوس والملحقات',
        image: '/media/image68.png',
        tokens: ['keyboard', 'mouse', 'mousepad', 'headset', 'microphone', 'webcam', 'كيبورد', 'ماوس', 'سماعة'],
        children: [],
      },
    ],
  },
];

/**
 * Finds a category node and its full breadcrumb trail by an array of path IDs
 * OR by a single node ID anywhere in the hierarchy.
 */
export function findRetroPcNodeByPath(
  roots: RetroPcCategoryNode[],
  pathIds: string[]
): { current: RetroPcCategoryNode | null; breadcrumbs: RetroPcCategoryNode[] } {
  if (!pathIds || pathIds.length === 0) {
    return { current: null, breadcrumbs: [] };
  }

  const breadcrumbs: RetroPcCategoryNode[] = [];
  let currentList = roots;
  let currentNode: RetroPcCategoryNode | null = null;

  for (const segId of pathIds) {
    const found = currentList.find((n) => n.id.toLowerCase() === segId.toLowerCase());
    if (!found) {
      // Fallback: if a category was moved to a different parent in Admin, locate it anywhere in the tree by ID!
      const fallback = findRetroPcNodeWithTrailById(roots, segId);
      if (fallback) {
        return fallback;
      }
      break;
    }
    breadcrumbs.push(found);
    currentNode = found;
    currentList = found.children || [];
  }

  return { current: currentNode, breadcrumbs };
}

/**
 * Locates a category node by its ID anywhere in the tree and returns both the node and its ancestor trail.
 */
export function findRetroPcNodeWithTrailById(
  roots: RetroPcCategoryNode[],
  targetId: string,
  trail: RetroPcCategoryNode[] = []
): { current: RetroPcCategoryNode; breadcrumbs: RetroPcCategoryNode[] } | null {
  for (const node of roots) {
    const nextTrail = [...trail, node];
    if (node.id.toLowerCase() === targetId.toLowerCase()) {
      return { current: node, breadcrumbs: nextTrail };
    }
    if (node.children && node.children.length > 0) {
      const found = findRetroPcNodeWithTrailById(node.children, targetId, nextTrail);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Flattens the entire category tree into a list with depth and breadcrumb label for Admin dropdown selectors.
 */
export function flattenRetroPcTree(
  nodes: RetroPcCategoryNode[],
  locale: 'ar' | 'en' = 'ar',
  parentTrail: string[] = [],
  parentIdTrail: string[] = [],
  depth = 0
): Array<{
  node: RetroPcCategoryNode;
  depth: number;
  label: string;
  pathIds: string[];
  pathString: string;
}> {
  const result: Array<{
    node: RetroPcCategoryNode;
    depth: number;
    label: string;
    pathIds: string[];
    pathString: string;
  }> = [];

  for (const n of nodes) {
    const displayName = locale === 'ar' && n.nameAr ? n.nameAr : n.name;
    const nextTrail = [...parentTrail, displayName];
    const nextIdTrail = [...parentIdTrail, n.id];
    result.push({
      node: n,
      depth,
      label: nextTrail.join(' ← '),
      pathIds: nextIdTrail,
      pathString: nextIdTrail.join('/'),
    });
    if (n.children && n.children.length > 0) {
      result.push(...flattenRetroPcTree(n.children, locale, nextTrail, nextIdTrail, depth + 1));
    }
  }
  return result;
}

/**
 * Collects all node IDs in a subtree (including the root of the subtree).
 */
export function collectSubtreeIds(node: RetroPcCategoryNode): string[] {
  const ids = [node.id.toLowerCase()];
  for (const child of node.children || []) {
    ids.push(...collectSubtreeIds(child));
  }
  return ids;
}

const PC_UNIVERSE_CATEGORIES = new Set([
  'pc',
  'pc-parts',
  'cpus',
  'cpu',
  'processors',
  'gpus',
  'gpu',
  'graphics-cards',
  'motherboards',
  'motherboard',
  'ram',
  'memory',
  'storage',
  'ssd',
  'nvme-ssd',
  'sata-hdd',
  'psus',
  'psu',
  'power-supplies',
  'pc-cases',
  'cases',
  'cooling',
  'coolers',
  'cooling-systems',
  'gaming-pcs',
  'custom-gaming-pcs',
  'monitors',
  'gaming-monitors',
  'pc-accessories',
  'pc-peripherals',
]);

// Maps built-in root category IDs to strict category/SKU matchers so a DDR5 motherboard doesn't bleed into Memory (RAM), or an RTX 4090 Gaming PC doesn't bleed into GPUs.
const ROOT_CATEGORY_STRICT_MAP: Record<string, { cats: string[]; skuPrefixes: string[] }> = {
  processors: {
    cats: ['processors', 'processor', 'cpu', 'cpus'],
    skuPrefixes: ['CPU-'],
  },
  'graphics-cards': {
    cats: ['graphics-cards', 'gpu', 'gpus'],
    skuPrefixes: ['GPU-'],
  },
  motherboards: {
    cats: ['motherboards', 'motherboard'],
    skuPrefixes: ['MOT-', 'MOB-'],
  },
  memory: {
    cats: ['memory', 'ram'],
    skuPrefixes: ['RAM-'],
  },
  storage: {
    cats: ['storage', 'ssd', 'hdd', 'nvme-ssd', 'sata-hdd'],
    skuPrefixes: ['SSD-', 'HDD-'],
  },
  'power-supplies': {
    cats: ['power-supplies', 'psu', 'psus'],
    skuPrefixes: ['PSU-'],
  },
  'pc-cases': {
    cats: ['pc-cases', 'cases', 'case'],
    skuPrefixes: ['CAS-'],
  },
  'cooling-systems': {
    cats: ['cooling-systems', 'cooling', 'coolers', 'cooler'],
    skuPrefixes: ['COO-'],
  },
  'custom-gaming-pcs': {
    cats: ['custom-gaming-pcs', 'gaming-pcs'],
    skuPrefixes: ['BUILD-'],
  },
  'pc-accessories': {
    cats: ['pc-accessories', 'monitors', 'gaming-monitors', 'pc-peripherals'],
    skuPrefixes: ['MON-', 'PER-'],
  },
};

/**
 * Checks if a product belongs to the PC / Hardware universe (excluding classic Retro consoles/games unless assigned to a Retro PC category).
 */
export function isRetroPcProduct(product: Product, allPcNodeIds?: Set<string>): boolean {
  const catFields = [
    product.category,
    product.subCategory,
    product.mainCategory,
    product.primaryCategory,
    product.secondaryCategory,
    ...(product.categories || []),
  ]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase().trim());

  for (const c of catFields) {
    if (PC_UNIVERSE_CATEGORIES.has(c)) return true;
    if (allPcNodeIds && allPcNodeIds.has(c)) return true;
  }

  if (product.source === 'PC' || product.productType === 'CUSTOM PC' || product.productType === 'PRE-BUILT PC') {
    return true;
  }

  const sku = (product.sku || '').toUpperCase();
  if (/^(CPU-|GPU-|MOT-|MOB-|RAM-|SSD-|PSU-|CAS-|COO-|MON-|BUILD-)/.test(sku)) {
    return true;
  }

  return false;
}

function productMatchesSingleNodeTokens(product: Product, node: RetroPcCategoryNode, isRootLevel = false): boolean {
  const catFields = [
    product.category,
    product.subCategory,
    product.mainCategory,
    product.primaryCategory,
    product.secondaryCategory,
    ...(product.categories || []),
  ]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase().trim());

  const nodeIdLower = node.id.toLowerCase();
  if (catFields.includes(nodeIdLower)) {
    return true;
  }

  // For built-in root categories, enforce strict hardware type matching so products don't bleed across main categories
  const strictRule = isRootLevel ? ROOT_CATEGORY_STRICT_MAP[nodeIdLower] : undefined;
  if (strictRule) {
    const skuUpper = (product.sku || '').toUpperCase();
    const matchesCat = catFields.some((c) => strictRule.cats.includes(c));
    const matchesSku = strictRule.skuPrefixes.some((p) => skuUpper.startsWith(p));
    if (nodeIdLower === 'custom-gaming-pcs' && (product.productType === 'CUSTOM PC' || product.productType === 'PRE-BUILT PC')) {
      return true;
    }
    return matchesCat || matchesSku;
  }

  const searchable = [
    product.sku,
    product.category,
    product.subCategory,
    product.mainCategory,
    product.primaryCategory,
    product.secondaryCategory,
    ...(product.categories || []),
    product.brand,
    product.model,
    product.nameEn,
    product.nameAr,
    product.platform,
    product.generation,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const tokens = Array.from(
    new Set([node.id, ...(node.tokens || [])].map((t) => t.toLowerCase().trim()).filter(Boolean))
  );

  return tokens.some((tok) => {
    const escaped = tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${escaped}`, 'i').test(searchable);
  });
}

/**
 * Determines whether a product belongs to a given Retro PC category node (or its breadcrumb trail).
 * - Preserves product assignment across renames and reorganizations by checking explicit node IDs first.
 * - Also supports hierarchical token intersection along the breadcrumb trail.
 */
export function productMatchesRetroPcNode(
  product: Product,
  breadcrumbs: RetroPcCategoryNode[],
  allPcNodeIds?: Set<string>
): boolean {
  if (!breadcrumbs || breadcrumbs.length === 0) return false;
  const targetNode = breadcrumbs[breadcrumbs.length - 1];

  // Collect all subtree IDs of targetNode so products explicitly assigned to targetNode or any of its children match
  const subtreeIds = new Set(collectSubtreeIds(targetNode));
  const explicitCatFields = [
    product.subCategory,
    product.secondaryCategory,
    product.category,
    product.primaryCategory,
    product.mainCategory,
    ...(product.categories || []),
  ]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase().trim());

  // 1. Direct ID match on targetNode or its descendants (immune to category renames or parent moves!)
  for (const field of explicitCatFields) {
    if (subtreeIds.has(field)) {
      return true;
    }
  }

  // Ensure product is a PC product before running token heuristics
  if (!isRetroPcProduct(product, allPcNodeIds)) {
    return false;
  }

  // If the product is explicitly assigned to a DIFFERENT specific leaf node ID in the tree, do not match by loose tokens
  if (allPcNodeIds) {
    const rootIds = new Set(Object.keys(ROOT_CATEGORY_STRICT_MAP));
    const assignedSpecificNode = explicitCatFields.find(
      (f) => allPcNodeIds.has(f) && !rootIds.has(f) && !PC_UNIVERSE_CATEGORIES.has(f)
    );
    if (assignedSpecificNode && !subtreeIds.has(assignedSpecificNode)) {
      return false;
    }
  }

  // 2. Hierarchical token intersection: product must match every node in the breadcrumb path
  return breadcrumbs.every((ancestor, idx) => productMatchesSingleNodeTokens(product, ancestor, idx === 0));
}
