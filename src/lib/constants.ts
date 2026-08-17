// RETRO Qatar — Business Constants

export const SITE_NAME = 'RETRO';
export const SITE_TAGLINE_EN = 'For Toys Trading and Repair';
export const SITE_TAGLINE_AR = 'لتجارة الألعاب والصيانة';

export const BUSINESS_INFO = {
  phone: '40001133',
  salesWhatsApp: '97466223445',
  repairWhatsApp: '97431473585',
  email: 'info@retroqatar.com',
  location: {
    en: 'Qatar - Doha - Msheireb HQ',
    ar: 'قطر - الدوحة - المشيرب',
  },
  googleMapsUrl: 'https://maps.app.goo.gl/x76S1zh9Hq8Q84VA9',
  operatingHours: {
    weekdays: { open: '9:00 AM', close: '1:00 PM', reopen: '4:00 PM', closeEvening: '10:00 PM' },
    friday: 'OFF',
  },
} as const;

export const FREE_SHIPPING_THRESHOLD = 500; // QAR
export const CURRENCY = 'QAR';
export const CURRENCY_AR = 'ر.ق';
export const MAX_COMPARE_ITEMS = 4;
export const LOYALTY_POINTS_PER_QAR = 0.1; // 1 point per 10 QAR

// Navigation Categories (Cleaned & De-duplicated 9 Pillars)
export const MAIN_CATEGORIES = [
  { id: 'all', slugEn: 'all', nameEn: 'All Categories', nameAr: 'جميع الأقسام', icon: 'grid', href: '/products' },
  { id: 'computers', slugEn: 'computers', nameEn: 'Computers', nameAr: 'أجهزة الكمبيوتر', icon: 'cpu', href: '/products?category=pc&subCategory=gaming-pcs' },
  { id: 'pc', slugEn: 'pc-components', nameEn: 'PC Components', nameAr: 'قطع الكمبيوتر', icon: 'cpu', href: '/products?category=pc' },
  { id: 'gaming', slugEn: 'consoles', nameEn: 'Gaming Consoles', nameAr: 'أجهزة الألعاب', icon: 'controller', href: '/products?category=consoles-accessories' },
  { id: 'retro-gaming', slugEn: 'retro-gaming', nameEn: 'Retro Gaming', nameAr: 'Retro Gaming', icon: 'retro', href: '/products?category=retro-games' },
  { id: 'accessories', slugEn: 'accessories', nameEn: 'Accessories', nameAr: 'الملحقات', icon: 'headset', href: '/accessories' },
  { id: 'repair-hub', slugEn: 'repair', nameEn: 'Repair Hub', nameAr: 'مركز الصيانة', icon: 'wrench', href: '/repair' },
  { id: 'pc-builder', slugEn: 'pc-builder', nameEn: 'Build Your PC', nameAr: 'ابنِ حاسوبك', icon: 'cpu', href: '/pc-builder' },
  { id: 'deals', slugEn: 'deals', nameEn: 'Deals', nameAr: 'العروض', icon: 'tag', href: '/products?sale=true' },
] as const;

export const CATALOG_5_CATEGORIES = [
  { id: 'playstation', slugEn: 'playstation', nameEn: 'PlayStation', nameAr: 'بلايستيشن', expectedCount: 17 },
  { id: 'psp', slugEn: 'psp', nameEn: 'PSP', nameAr: 'بي إس بي', expectedCount: 2 },
  { id: 'xbox', slugEn: 'xbox', nameEn: 'Xbox', nameAr: 'إكس بوكس', expectedCount: 7 },
  { id: 'nintendo', slugEn: 'nintendo', nameEn: 'Nintendo', nameAr: 'نينتندو', expectedCount: 21 },
  { id: 'retro-gaming-classics', slugEn: 'retro-gaming-classics', nameEn: 'Retro Gaming Classics', nameAr: 'الألعاب الكلاسيكية والريترو', expectedCount: 10 },
] as const;

// Subcategories lists for category verification
export const GAMING_SUBCATEGORIES = ['Consoles', 'Games', 'Controllers', 'Gaming Accessories'] as const;
export const RETRO_GAMING_SUBCATEGORIES = [
  'PlayStation 1', 'PlayStation 2', 'PlayStation 3', 'Classic Xbox', 'Classic Nintendo',
  'Nintendo 64', 'GameCube', 'Game Boy', 'PSP', 'PS Vita', 'Sega', 'Atari', 'Arcade',
  'Retro Handhelds', 'Retro Controllers', 'Retro Games', 'Retro Accessories', 'Collectibles', 'Pre-Owned Retro'
] as const;

export const PC_COMPONENT_CATEGORIES = [
  'CPU', 'GPU', 'Motherboards', 'RAM', 'Storage', 'PSU', 'PC Cases', 'CPU Cooling', 'AIO Cooling', 'Case Fans', 'Thermal Products', 'Cables', 'Networking'
] as const;

// Gaming PC tiers
export const GAMING_PC_TIERS = [
  { id: 'entry', nameEn: 'Entry Level', nameAr: 'مبتدئ', priceRange: '2,000 - 4,000 QAR' },
  { id: 'mid', nameEn: 'Mid Range', nameAr: 'متوسط', priceRange: '4,000 - 7,000 QAR' },
  { id: 'high', nameEn: 'High End', nameAr: 'عالي', priceRange: '7,000 - 12,000 QAR' },
  { id: 'extreme', nameEn: 'Extreme', nameAr: 'خارق', priceRange: '12,000+ QAR' },
] as const;

// PC Builder steps
export const PC_BUILDER_STEPS = [
  { id: 'cpu', nameEn: 'CPU', nameAr: 'المعالج', icon: 'cpu', required: true },
  { id: 'gpu', nameEn: 'GPU', nameAr: 'كرت الشاشة', icon: 'gpu', required: true },
  { id: 'motherboard', nameEn: 'Motherboard', nameAr: 'اللوحة الأم', icon: 'motherboard', required: true },
  { id: 'ram', nameEn: 'RAM', nameAr: 'الذاكرة', icon: 'ram', required: true },
  { id: 'storage', nameEn: 'Storage', nameAr: 'التخزين', icon: 'storage', required: true },
  { id: 'psu', nameEn: 'PSU', nameAr: 'مزود الطاقة', icon: 'psu', required: true },
  { id: 'case', nameEn: 'Case', nameAr: 'الكيس', icon: 'case', required: true },
  { id: 'cooling', nameEn: 'Cooling', nameAr: 'التبريد', icon: 'cooling', required: false },
] as const;

// Repair device types
export const REPAIR_DEVICE_TYPES = [
  { id: 'gaming-pc', nameEn: 'Gaming PC', nameAr: 'حاسوب قيمنق' },
  { id: 'laptop', nameEn: 'Laptop', nameAr: 'لابتوب' },
  { id: 'ps5', nameEn: 'PlayStation 5', nameAr: 'بلايستيشن 5' },
  { id: 'ps4', nameEn: 'PlayStation 4', nameAr: 'بلايستيشن 4' },
  { id: 'xbox-series', nameEn: 'Xbox Series X/S', nameAr: 'اكس بوكس سيريز' },
  { id: 'xbox-one', nameEn: 'Xbox One', nameAr: 'اكس بوكس ون' },
  { id: 'switch', nameEn: 'Nintendo Switch', nameAr: 'نينتندو سويتش' },
  { id: 'controller', nameEn: 'Controller', nameAr: 'يد التحكم' },
  { id: 'monitor', nameEn: 'Monitor', nameAr: 'شاشة' },
  { id: 'other', nameEn: 'Other Device', nameAr: 'جهاز آخر' },
] as const;

// Qatar zones for shipping
export const QATAR_ZONES = [
  'Al Wakrah', 'Al Khor', 'Al Rayyan', 'Al Shamal', 'Al Daayen',
  'Doha', 'Lusail', 'Madinat Khalifa', 'Msheireb', 'The Pearl',
  'West Bay', 'Umm Salal', 'Education City', 'Duhail',
] as const;

// Social media links
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/retroqatar',
  tiktok: 'https://tiktok.com/@retroqatar',
  twitter: 'https://x.com/retroqatar',
  youtube: 'https://youtube.com/@retroqatar',
} as const;
