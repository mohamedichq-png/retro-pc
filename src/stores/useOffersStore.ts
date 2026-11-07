// RETRO Qatar — Offers & Banners Store (Zustand)
// Manages dynamic homepage hero slides, visual categories, and Retro sections in local storage + Supabase

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { RETRO_BRANDS, type RetroBrand, type RetroDevice, type RetroKindId } from '../lib/retro-navigation';
import {
  RETRO_PC_CATEGORIES,
  findRetroPcNodeWithTrailById,
  collectSubtreeIds,
  type RetroPcCategoryNode,
} from '../lib/retro-pc-navigation';

export interface OfferSlide {
  key: string;
  tagEn: string;
  tagAr: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  ctaEn: string;
  ctaAr: string;
  ctaLink: string;
  gradient: string;
  glowColor: 'cyan' | 'purple' | 'pink';
}

export interface VisualCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  image: string;
  link: string;
  accent: 'cyan' | 'purple' | 'green' | 'pink';
  hidden?: boolean;
}

export const DEFAULT_RETRO_BRAND_LOGOS: Record<string, string> = {
  playstation: '/brand-logos/playstation.png',
  atari: '/brand-logos/atari.png',
  xbox: '/brand-logos/xbox.png',
  sega: '/brand-logos/sega.png',
  amiga: '/brand-logos/amiga.png',
  panasonic: '/brand-logos/panasonic.png',
  nec: '/brand-logos/pc-engine.png',
  philips: '/brand-logos/philips.webp',
  arcade: '/brand-logos/arcade.jpg',
  nintendo: '/brand-logos/nintendo.svg',
  snk: '/brand-logos/snk.svg',
};

interface OffersState {
  slides: OfferSlide[];
  addSlide: (slide: OfferSlide) => void;
  removeSlide: (key: string) => void;
  updateSlide: (key: string, updates: Partial<OfferSlide>) => void;
  
  // Weekly Offer Admin CMS States
  weeklyOffersActive: boolean;
  weeklyOfferProductId: string;
  weeklyOfferPromoPrice: number;
  weeklyOfferEndDate: string;
  setWeeklyOfferData: (data: { active: boolean; productId: string; promoPrice: number; endDate: string }) => void;

  // Visual Categories Admin State
  visualCategories: VisualCategory[];
  updateVisualCategory: (id: string, updates: Partial<VisualCategory>) => void;
  addVisualCategory: (cat: VisualCategory) => void;
  deleteVisualCategory: (id: string) => void;
  toggleHideVisualCategory: (id: string) => void;
  reorderVisualCategory: (id: string, direction: 'up' | 'down') => void;

  // Dynamic Retro Brands & Devices Hierarchy
  retroBrands: RetroBrand[];
  retroCatalogUpdatedAt: number;
  addRetroBrand: (brand: RetroBrand) => void;
  updateRetroBrand: (brandId: string, updates: Partial<Omit<RetroBrand, 'id' | 'devices'>>) => void;
  deleteRetroBrand: (brandId: string) => void;
  toggleHideRetroBrand: (brandId: string) => void;
  reorderRetroBrand: (brandId: string, direction: 'up' | 'down') => void;

  addRetroDevice: (brandId: string, device: RetroDevice) => void;
  updateRetroDevice: (brandId: string, deviceId: string, updates: Partial<Omit<RetroDevice, 'id'>>) => void;
  deleteRetroDevice: (brandId: string, deviceId: string) => void;
  toggleHideRetroDevice: (brandId: string, deviceId: string) => void;
  reorderRetroDevice: (brandId: string, deviceId: string, direction: 'up' | 'down') => void;

  // Retro Brand & Section Logos State
  retroBrandLogos: Record<string, string>;
  updateRetroBrandLogo: (brandId: string, image: string) => void;
  resetRetroBrandLogo: (brandId: string) => void;

  // Retro Devices Custom Images State
  retroDeviceImages: Record<string, string>;
  updateRetroDeviceImage: (brandId: string, deviceId: string, image: string) => void;
  resetRetroDeviceImage: (brandId: string, deviceId: string) => void;

  // Retro Product-Type (Consoles / Games / Accessories) Custom Images per Console Model
  retroKindImages: Record<string, string>;
  updateRetroKindImage: (brandId: string, deviceId: string, kindId: RetroKindId, image: string) => void;
  resetRetroKindImage: (brandId: string, deviceId: string, kindId: RetroKindId) => void;

  // Dynamic Retro PC Multi-Level Categories & Subcategories Tree
  retroPcCategories: RetroPcCategoryNode[];
  retroPcCatalogUpdatedAt: number;
  addRetroPcCategory: (parentId: string | null, newNode: RetroPcCategoryNode) => void;
  updateRetroPcCategory: (nodeId: string, updates: Partial<Omit<RetroPcCategoryNode, 'id' | 'children'>>) => void;
  deleteRetroPcCategory: (nodeId: string) => void;
  toggleHideRetroPcCategory: (nodeId: string) => void;
  reorderRetroPcCategory: (nodeId: string, direction: 'up' | 'down') => void;
  moveRetroPcCategory: (nodeId: string, newParentId: string | null) => void;
  updateRetroPcCategoryImage: (nodeId: string, image: string) => void;
  resetRetroPcCategoryImage: (nodeId: string) => void;

  // Cloud Sync & Bulk Import
  initializeFromCloud: () => Promise<void>;
  importStoreSettings: (payload: {
    visualCategories?: VisualCategory[];
    slides?: OfferSlide[];
    retroBrands?: RetroBrand[];
    retroBrandLogos?: Record<string, string>;
    retroDeviceImages?: Record<string, string>;
    retroKindImages?: Record<string, string>;
    retroPcCategories?: RetroPcCategoryNode[];
  }) => Promise<void>;
}

const DEFAULT_SLIDES: OfferSlide[] = [
  {
    key: 'slide-mega-deals',
    tagEn: 'MEGA DEALS',
    tagAr: 'عرض لفترة محدودة',
    titleEn: 'Retro Mega Offers — Up to 30% Off',
    titleAr: 'عروض ريترو الكبرى — خصم يصل إلى 30%',
    subtitleEn: 'The strongest prebuilt gaming systems equipped with RTX 4090 graphic cards with a 2-year warranty.',
    subtitleAr: 'أقوى حواسيب قيمنق مزودة بكروت شاشة RTX 4090 مع ضمان عامين كاملين.',
    ctaEn: 'Shop Deals',
    ctaAr: 'تسوق العروض الآن',
    ctaLink: '/products',
    gradient: 'from-retro-cyan-dim/50 via-retro-bg-secondary to-retro-bg',
    glowColor: 'cyan'
  },
  {
    key: 'slide-pc-builder',
    tagEn: 'CUSTOMIZE RIG',
    tagAr: 'تركيب وتطوير',
    titleEn: 'Build Your Custom PC',
    titleAr: 'ابنِ حاسوب أحلامك الآن',
    subtitleEn: 'Unleash extreme power. Use our step-by-step interactive simulator with dynamic compatibility checks.',
    subtitleAr: 'أطلق العنان للقوة الكاملة. استخدم محاكي التركيب التفاعلي للقطع مع فحص التوافق التلقائي للجهد والمقابس.',
    ctaEn: 'Start Builder',
    ctaAr: 'ابدأ التجميع',
    ctaLink: '/pc-builder',
    gradient: 'from-retro-purple-dim/50 via-retro-bg-secondary to-retro-bg',
    glowColor: 'purple'
  },
  {
    key: 'slide-repair-hub',
    tagEn: 'REPAIR SERVICES',
    tagAr: 'صيانة فورية',
    titleEn: 'Certified Repair Hub',
    titleAr: 'مركز صيانة الأجهزة المعتمد',
    subtitleEn: 'From screen swap to professional recap on Sega, Nintendo and retro chips. Get a free diagnostics ticket.',
    subtitleAr: 'من استبدال منافذ العرض إلى إعادة تلحيم مكثفات البورد لأجهزة سيغا ونينتندو. احصل على تذكرة فحص مجانية.',
    ctaEn: 'Book a Repair',
    ctaAr: 'احجز صيانة لجهازك',
    ctaLink: '/repair',
    gradient: 'from-retro-pink/10 via-retro-bg-secondary to-retro-bg',
    glowColor: 'pink'
  },
  {
    key: 'slide-retro-classics',
    tagEn: 'RETRO LEGENDS',
    tagAr: 'أساطير زمان',
    titleEn: 'Classic Console Restocks',
    titleAr: 'توفير أجهزة ألعاب كلاسيكية نادرة',
    subtitleEn: 'Handhelds, original games, and custom modded retro hardware. Relive your childhood gaming days.',
    subtitleAr: 'أجهزة قيم بوي الملونة، وألعاب زمان، وتعديلات الشاشات المضيئة. استعد ذكريات الطفولة الجميلة.',
    ctaEn: 'Explore Retro',
    ctaAr: 'تصفح أجهزة الريترو',
    ctaLink: '/category/retro-gaming',
    gradient: 'from-retro-purple-dim/40 via-retro-cyan-dim/20 to-retro-bg',
    glowColor: 'purple'
  }
];

export const syncSettingToCloud = async (id: string, data: unknown): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('store_settings')
      .upsert(
        { id, data, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );
    if (error) {
      console.warn(`Error syncing ${id} to store_settings:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Exception syncing ${id} to store_settings:`, err);
    return false;
  }
};

export const syncRetroCatalogToCloud = async (brands: RetroBrand[], updatedAt: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('store_settings')
      .upsert(
        { id: 'retro_catalog', data: { brands, updatedAt }, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );
    if (error) {
      console.warn('Error syncing retro_catalog to cloud:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exception syncing retro_catalog to cloud:', err);
    return false;
  }
};

export const syncRetroPcCatalogToCloud = async (categories: RetroPcCategoryNode[], updatedAt: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('store_settings')
      .upsert(
        { id: 'retro_pc_catalog', data: { categories, updatedAt }, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );
    if (error) {
      console.warn('Error syncing retro_pc_catalog to cloud:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exception syncing retro_pc_catalog to cloud:', err);
    return false;
  }
};

function insertNodeInTree(
  nodes: RetroPcCategoryNode[],
  parentId: string | null,
  newNode: RetroPcCategoryNode
): RetroPcCategoryNode[] {
  if (!parentId) {
    const exists = nodes.some((n) => n.id.toLowerCase() === newNode.id.toLowerCase());
    return exists
      ? nodes.map((n) =>
          n.id.toLowerCase() === newNode.id.toLowerCase()
            ? { ...n, ...newNode, children: newNode.children?.length ? newNode.children : n.children }
            : n
        )
      : [...nodes, { ...newNode, children: newNode.children || [] }];
  }

  return nodes.map((n) => {
    if (n.id.toLowerCase() === parentId.toLowerCase()) {
      const children = n.children || [];
      const exists = children.some((c) => c.id.toLowerCase() === newNode.id.toLowerCase());
      const nextChildren = exists
        ? children.map((c) =>
            c.id.toLowerCase() === newNode.id.toLowerCase()
              ? { ...c, ...newNode, children: newNode.children?.length ? newNode.children : c.children }
              : c
          )
        : [...children, { ...newNode, children: newNode.children || [] }];
      return { ...n, children: nextChildren };
    }
    if (n.children && n.children.length > 0) {
      return { ...n, children: insertNodeInTree(n.children, parentId, newNode) };
    }
    return n;
  });
}

function updateNodeInTree(
  nodes: RetroPcCategoryNode[],
  nodeId: string,
  updater: (node: RetroPcCategoryNode) => RetroPcCategoryNode
): RetroPcCategoryNode[] {
  return nodes.map((n) => {
    if (n.id.toLowerCase() === nodeId.toLowerCase()) {
      return updater(n);
    }
    if (n.children && n.children.length > 0) {
      return { ...n, children: updateNodeInTree(n.children, nodeId, updater) };
    }
    return n;
  });
}

function deleteNodeFromTree(nodes: RetroPcCategoryNode[], nodeId: string): RetroPcCategoryNode[] {
  return nodes
    .filter((n) => n.id.toLowerCase() !== nodeId.toLowerCase())
    .map((n) => ({
      ...n,
      children: n.children && n.children.length > 0 ? deleteNodeFromTree(n.children, nodeId) : [],
    }));
}

function reorderNodeInTree(
  nodes: RetroPcCategoryNode[],
  nodeId: string,
  direction: 'up' | 'down'
): RetroPcCategoryNode[] {
  const idx = nodes.findIndex((n) => n.id.toLowerCase() === nodeId.toLowerCase());
  if (idx !== -1) {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= nodes.length) return nodes;
    const copy = [...nodes];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    return copy;
  }
  return nodes.map((n) => ({
    ...n,
    children: n.children && n.children.length > 0 ? reorderNodeInTree(n.children, nodeId, direction) : [],
  }));
}

function sanitizeRetroPcTree(nodes: RetroPcCategoryNode[]): RetroPcCategoryNode[] {
  return (nodes || []).map((n) => {
    const defaultMatch = findRetroPcNodeWithTrailById(RETRO_PC_CATEGORIES, n.id);
    const defaultImg = defaultMatch?.current.image || '';
    let cleanImg = n.image;
    if (!cleanImg || cleanImg.includes('qdozfcplmd')) {
      cleanImg = defaultImg;
    }
    return {
      ...(defaultMatch?.current || {}),
      ...n,
      image: cleanImg,
      tokens: Array.isArray(n.tokens) ? n.tokens : defaultMatch?.current.tokens || [n.id],
      children: sanitizeRetroPcTree(n.children || []),
    };
  });
}

export const useOffersStore = create<OffersState>()(
  persist(
    (set) => ({
      slides: DEFAULT_SLIDES,
      addSlide: (slide) => {
        set((s) => {
          const newSlides = [slide, ...s.slides];
          syncSettingToCloud('offer_slides', newSlides);
          return { slides: newSlides };
        });
      },
      removeSlide: (key) => {
        set((s) => {
          const newSlides = s.slides.filter((x) => x.key !== key);
          syncSettingToCloud('offer_slides', newSlides);
          return { slides: newSlides };
        });
      },
      updateSlide: (key, updates) => {
        set((s) => {
          const newSlides = s.slides.map((x) => (x.key === key ? { ...x, ...updates } : x));
          syncSettingToCloud('offer_slides', newSlides);
          return { slides: newSlides };
        });
      },
        
      // Weekly Offer state
      weeklyOffersActive: true,
      weeklyOfferProductId: 'p-new-5',
      weeklyOfferPromoPrice: 2850,
      weeklyOfferEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      setWeeklyOfferData: (data) => set({
        weeklyOffersActive: data.active,
        weeklyOfferProductId: data.productId,
        weeklyOfferPromoPrice: data.promoPrice,
        weeklyOfferEndDate: data.endDate,
      }),

      // Visual Categories Initial Data
      visualCategories: [
        { id: 'gaming-pcs', nameAr: 'تجميعات Gaming PC', nameEn: 'Gaming PCs', icon: '🖥️', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80', link: '/products?category=pc&subCategory=gaming-pcs', accent: 'cyan' },
        { id: 'gpus', nameAr: 'كروت الشاشة', nameEn: 'Graphics Cards', icon: '⚡', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80', link: '/products?category=pc&subCategory=gpus', accent: 'cyan' },
        { id: 'cpus', nameAr: 'المعالجات', nameEn: 'Processors', icon: '⚙️', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80', link: '/products?category=pc&subCategory=cpus', accent: 'purple' },
        { id: 'motherboards', nameAr: 'اللوحات الرئيسية', nameEn: 'Motherboards', icon: '🧩', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&auto=format&fit=crop&q=80', link: '/products?category=pc&subCategory=motherboards', accent: 'purple' },
        { id: 'ram', nameAr: 'الذاكرة RAM', nameEn: 'RAM Memory', icon: '💾', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&auto=format&fit=crop&q=80', link: '/products?category=pc&subCategory=ram', accent: 'cyan' },
        { id: 'ssd', nameAr: 'وحدات التخزين SSD', nameEn: 'SSD Storage', icon: '💽', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop&q=80', link: '/products?category=pc&subCategory=storage', accent: 'cyan' },
        { id: 'monitors', nameAr: 'الشاشات', nameEn: 'Monitors', icon: '📺', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80', link: '/products?category=pc&subCategory=monitors', accent: 'purple' },
        { id: 'playstation', nameAr: 'PlayStation', nameEn: 'PlayStation', icon: '🎮', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&auto=format&fit=crop&q=80', link: '/products?category=playstation', accent: 'cyan' },
        { id: 'xbox', nameAr: 'Xbox', nameEn: 'Xbox', icon: '🟩', image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&auto=format&fit=crop&q=80', link: '/products?category=xbox', accent: 'green' },
        { id: 'nintendo', nameAr: 'Nintendo', nameEn: 'Nintendo', icon: '🔴', image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&auto=format&fit=crop&q=80', link: '/products?category=nintendo', accent: 'pink' },
        { id: 'retro-gaming', nameAr: 'Retro Gaming', nameEn: 'Retro Gaming', icon: '🕹️', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80', link: '/products?category=retro-games', accent: 'purple' },
        { id: 'accessories', nameAr: 'ملحقات Gaming', nameEn: 'Gaming Accessories', icon: '🎧', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80', link: '/products?category=consoles-accessories', accent: 'cyan' },
      ],
      updateVisualCategory: (id, updates) => {
        set((s) => {
          const newCats = s.visualCategories.map((x) => (x.id === id ? { ...x, ...updates } : x));
          syncSettingToCloud('visual_categories', newCats);
          return { visualCategories: newCats };
        });
      },
      addVisualCategory: (cat) => {
        set((s) => {
          const exists = s.visualCategories.some((x) => x.id === cat.id);
          const newCats = exists
            ? s.visualCategories.map((x) => (x.id === cat.id ? cat : x))
            : [...s.visualCategories, cat];
          syncSettingToCloud('visual_categories', newCats);
          return { visualCategories: newCats };
        });
      },
      deleteVisualCategory: (id) => {
        set((s) => {
          const newCats = s.visualCategories.filter((x) => x.id !== id);
          syncSettingToCloud('visual_categories', newCats);
          return { visualCategories: newCats };
        });
      },
      toggleHideVisualCategory: (id) => {
        set((s) => {
          const newCats = s.visualCategories.map((x) => (x.id === id ? { ...x, hidden: !x.hidden } : x));
          syncSettingToCloud('visual_categories', newCats);
          return { visualCategories: newCats };
        });
      },
      reorderVisualCategory: (id, direction) => {
        set((s) => {
          const idx = s.visualCategories.findIndex((x) => x.id === id);
          if (idx === -1) return s;
          const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= s.visualCategories.length) return s;
          const newCats = [...s.visualCategories];
          const [moved] = newCats.splice(idx, 1);
          newCats.splice(targetIdx, 0, moved);
          syncSettingToCloud('visual_categories', newCats);
          return { visualCategories: newCats };
        });
      },

      // Dynamic Retro Brands & Console Models Hierarchy
      retroBrands: RETRO_BRANDS,
      retroCatalogUpdatedAt: 0,

      addRetroBrand: (brand) => {
        set((s) => {
          const now = Date.now();
          const exists = s.retroBrands.some((b) => b.id === brand.id);
          const nextBrands = exists
            ? s.retroBrands.map((b) => (b.id === brand.id ? { ...b, ...brand } : b))
            : [...s.retroBrands, brand];
          const nextLogos = brand.logo ? { ...s.retroBrandLogos, [brand.id]: brand.logo } : s.retroBrandLogos;
          syncRetroCatalogToCloud(nextBrands, now);
          if (brand.logo) {
            syncSettingToCloud('retro_brand_logos', nextLogos);
          }
          return { retroBrands: nextBrands, retroBrandLogos: nextLogos, retroCatalogUpdatedAt: now };
        });
      },

      updateRetroBrand: (brandId, updates) => {
        set((s) => {
          const now = Date.now();
          const nextBrands = s.retroBrands.map((b) => (b.id === brandId ? { ...b, ...updates } : b));
          const nextLogos = updates.logo !== undefined
            ? { ...s.retroBrandLogos, [brandId]: updates.logo }
            : s.retroBrandLogos;
          syncRetroCatalogToCloud(nextBrands, now);
          if (updates.logo !== undefined) {
            syncSettingToCloud('retro_brand_logos', nextLogos);
          }
          return { retroBrands: nextBrands, retroBrandLogos: nextLogos, retroCatalogUpdatedAt: now };
        });
      },

      deleteRetroBrand: (brandId) => {
        set((s) => {
          const now = Date.now();
          const nextBrands = s.retroBrands.filter((b) => b.id !== brandId);
          syncRetroCatalogToCloud(nextBrands, now);
          return { retroBrands: nextBrands, retroCatalogUpdatedAt: now };
        });
      },

      toggleHideRetroBrand: (brandId) => {
        set((s) => {
          const now = Date.now();
          const nextBrands = s.retroBrands.map((b) =>
            b.id === brandId ? { ...b, hidden: !b.hidden } : b
          );
          syncRetroCatalogToCloud(nextBrands, now);
          return { retroBrands: nextBrands, retroCatalogUpdatedAt: now };
        });
      },

      reorderRetroBrand: (brandId, direction) => {
        set((s) => {
          const idx = s.retroBrands.findIndex((b) => b.id === brandId);
          if (idx === -1) return s;
          const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= s.retroBrands.length) return s;
          const now = Date.now();
          const nextBrands = [...s.retroBrands];
          const [moved] = nextBrands.splice(idx, 1);
          nextBrands.splice(targetIdx, 0, moved);
          syncRetroCatalogToCloud(nextBrands, now);
          return { retroBrands: nextBrands, retroCatalogUpdatedAt: now };
        });
      },

      addRetroDevice: (brandId, device) => {
        set((s) => {
          const now = Date.now();
          const nextBrands = s.retroBrands.map((b) => {
            if (b.id !== brandId) return b;
            const exists = b.devices.some((d) => d.id === device.id);
            const nextDevices = exists
              ? b.devices.map((d) => (d.id === device.id ? { ...d, ...device } : d))
              : [...b.devices, device];
            return { ...b, devices: nextDevices };
          });
          const key = `${brandId}:${device.id}`;
          const nextDeviceImages = device.image
            ? { ...s.retroDeviceImages, [key]: device.image }
            : s.retroDeviceImages;
          syncRetroCatalogToCloud(nextBrands, now);
          if (device.image) {
            syncSettingToCloud('retro_device_images', nextDeviceImages);
          }
          return {
            retroBrands: nextBrands,
            retroDeviceImages: nextDeviceImages,
            retroCatalogUpdatedAt: now,
          };
        });
      },

      updateRetroDevice: (brandId, deviceId, updates) => {
        set((s) => {
          const now = Date.now();
          const nextBrands = s.retroBrands.map((b) => {
            if (b.id !== brandId) return b;
            return {
              ...b,
              devices: b.devices.map((d) => (d.id === deviceId ? { ...d, ...updates } : d)),
            };
          });
          const key = `${brandId}:${deviceId}`;
          const nextDeviceImages =
            updates.image !== undefined
              ? { ...s.retroDeviceImages, [key]: updates.image }
              : s.retroDeviceImages;
          syncRetroCatalogToCloud(nextBrands, now);
          if (updates.image !== undefined) {
            syncSettingToCloud('retro_device_images', nextDeviceImages);
          }
          return {
            retroBrands: nextBrands,
            retroDeviceImages: nextDeviceImages,
            retroCatalogUpdatedAt: now,
          };
        });
      },

      deleteRetroDevice: (brandId, deviceId) => {
        set((s) => {
          const now = Date.now();
          const nextBrands = s.retroBrands.map((b) => {
            if (b.id !== brandId) return b;
            return { ...b, devices: b.devices.filter((d) => d.id !== deviceId) };
          });
          syncRetroCatalogToCloud(nextBrands, now);
          return { retroBrands: nextBrands, retroCatalogUpdatedAt: now };
        });
      },

      toggleHideRetroDevice: (brandId, deviceId) => {
        set((s) => {
          const now = Date.now();
          const nextBrands = s.retroBrands.map((b) => {
            if (b.id !== brandId) return b;
            return {
              ...b,
              devices: b.devices.map((d) => (d.id === deviceId ? { ...d, hidden: !d.hidden } : d)),
            };
          });
          syncRetroCatalogToCloud(nextBrands, now);
          return { retroBrands: nextBrands, retroCatalogUpdatedAt: now };
        });
      },

      reorderRetroDevice: (brandId, deviceId, direction) => {
        set((s) => {
          const brand = s.retroBrands.find((b) => b.id === brandId);
          if (!brand) return s;
          const idx = brand.devices.findIndex((d) => d.id === deviceId);
          if (idx === -1) return s;
          const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= brand.devices.length) return s;
          const now = Date.now();
          const nextDevices = [...brand.devices];
          const [moved] = nextDevices.splice(idx, 1);
          nextDevices.splice(targetIdx, 0, moved);
          const nextBrands = s.retroBrands.map((b) =>
            b.id === brandId ? { ...b, devices: nextDevices } : b
          );
          syncRetroCatalogToCloud(nextBrands, now);
          return { retroBrands: nextBrands, retroCatalogUpdatedAt: now };
        });
      },

      // Retro Brand Section Logos
      retroBrandLogos: {},
      updateRetroBrandLogo: (brandId, image) => {
        set((s) => {
          const now = Date.now();
          const updated = { ...s.retroBrandLogos, [brandId]: image };
          const nextBrands = s.retroBrands.map((b) =>
            b.id === brandId ? { ...b, logo: image } : b
          );
          syncSettingToCloud('retro_brand_logos', updated);
          syncRetroCatalogToCloud(nextBrands, now);
          return { retroBrandLogos: updated, retroBrands: nextBrands, retroCatalogUpdatedAt: now };
        });
      },
      resetRetroBrandLogo: (brandId) => {
        set((s) => {
          const now = Date.now();
          const updated = { ...s.retroBrandLogos };
          delete updated[brandId];
          const nextBrands = s.retroBrands.map((b) => {
            if (b.id !== brandId) return b;
            const copy = { ...b };
            delete copy.logo;
            return copy;
          });
          syncSettingToCloud('retro_brand_logos', updated);
          syncRetroCatalogToCloud(nextBrands, now);
          return { retroBrandLogos: updated, retroBrands: nextBrands, retroCatalogUpdatedAt: now };
        });
      },

      // Retro Device Custom Images
      retroDeviceImages: {},
      updateRetroDeviceImage: (brandId, deviceId, image) => {
        set((s) => {
          const now = Date.now();
          const key = `${brandId}:${deviceId}`;
          const updated = { ...s.retroDeviceImages, [key]: image };
          const nextBrands = s.retroBrands.map((b) => {
            if (b.id !== brandId) return b;
            return {
              ...b,
              devices: b.devices.map((d) => (d.id === deviceId ? { ...d, image } : d)),
            };
          });
          syncSettingToCloud('retro_device_images', updated);
          syncRetroCatalogToCloud(nextBrands, now);
          return { retroDeviceImages: updated, retroBrands: nextBrands, retroCatalogUpdatedAt: now };
        });
      },
      resetRetroDeviceImage: (brandId, deviceId) => {
        set((s) => {
          const now = Date.now();
          const key = `${brandId}:${deviceId}`;
          const updated = { ...s.retroDeviceImages };
          delete updated[key];
          const defaultBrand = RETRO_BRANDS.find((b) => b.id === brandId);
          const defaultDev = defaultBrand?.devices.find((d) => d.id === deviceId);
          const nextBrands = s.retroBrands.map((b) => {
            if (b.id !== brandId) return b;
            return {
              ...b,
              devices: b.devices.map((d) =>
                d.id === deviceId ? { ...d, image: defaultDev?.image || '' } : d
              ),
            };
          });
          syncSettingToCloud('retro_device_images', updated);
          syncRetroCatalogToCloud(nextBrands, now);
          return { retroDeviceImages: updated, retroBrands: nextBrands, retroCatalogUpdatedAt: now };
        });
      },

      // Retro Product-Type (Consoles / Games / Accessories) Custom Images per Console Model
      retroKindImages: {},
      updateRetroKindImage: (brandId, deviceId, kindId, image) => {
        set((s) => {
          const now = Date.now();
          const key = `${brandId}:${deviceId}:${kindId}`;
          const updated = { ...s.retroKindImages, [key]: image };
          const nextBrands = s.retroBrands.map((b) => {
            if (b.id !== brandId) return b;
            return {
              ...b,
              devices: b.devices.map((d) =>
                d.id === deviceId
                  ? { ...d, kindImages: { ...(d.kindImages || {}), [kindId]: image } }
                  : d
              ),
            };
          });
          syncSettingToCloud('retro_kind_images', updated);
          syncRetroCatalogToCloud(nextBrands, now);
          return { retroKindImages: updated, retroBrands: nextBrands, retroCatalogUpdatedAt: now };
        });
      },
      resetRetroKindImage: (brandId, deviceId, kindId) => {
        set((s) => {
          const now = Date.now();
          const key = `${brandId}:${deviceId}:${kindId}`;
          const updated = { ...s.retroKindImages };
          delete updated[key];
          const nextBrands = s.retroBrands.map((b) => {
            if (b.id !== brandId) return b;
            return {
              ...b,
              devices: b.devices.map((d) => {
                if (d.id !== deviceId) return d;
                const nextKindImgs = { ...(d.kindImages || {}) };
                delete nextKindImgs[kindId];
                return { ...d, kindImages: nextKindImgs };
              }),
            };
          });
          syncSettingToCloud('retro_kind_images', updated);
          syncRetroCatalogToCloud(nextBrands, now);
          return { retroKindImages: updated, retroBrands: nextBrands, retroCatalogUpdatedAt: now };
        });
      },

      // Dynamic Retro PC Multi-Level Categories & Subcategories Tree
      retroPcCategories: RETRO_PC_CATEGORIES,
      retroPcCatalogUpdatedAt: 0,

      addRetroPcCategory: (parentId, newNode) => {
        set((s) => {
          const now = Date.now();
          const nextTree = insertNodeInTree(s.retroPcCategories, parentId, newNode);
          syncRetroPcCatalogToCloud(nextTree, now);
          return { retroPcCategories: nextTree, retroPcCatalogUpdatedAt: now };
        });
      },

      updateRetroPcCategory: (nodeId, updates) => {
        set((s) => {
          const now = Date.now();
          const nextTree = updateNodeInTree(s.retroPcCategories, nodeId, (node) => ({
            ...node,
            ...updates,
          }));
          syncRetroPcCatalogToCloud(nextTree, now);
          return { retroPcCategories: nextTree, retroPcCatalogUpdatedAt: now };
        });
      },

      deleteRetroPcCategory: (nodeId) => {
        set((s) => {
          const now = Date.now();
          const nextTree = deleteNodeFromTree(s.retroPcCategories, nodeId);
          syncRetroPcCatalogToCloud(nextTree, now);
          return { retroPcCategories: nextTree, retroPcCatalogUpdatedAt: now };
        });
      },

      toggleHideRetroPcCategory: (nodeId) => {
        set((s) => {
          const now = Date.now();
          const nextTree = updateNodeInTree(s.retroPcCategories, nodeId, (node) => ({
            ...node,
            hidden: !node.hidden,
          }));
          syncRetroPcCatalogToCloud(nextTree, now);
          return { retroPcCategories: nextTree, retroPcCatalogUpdatedAt: now };
        });
      },

      reorderRetroPcCategory: (nodeId, direction) => {
        set((s) => {
          const now = Date.now();
          const nextTree = reorderNodeInTree(s.retroPcCategories, nodeId, direction);
          syncRetroPcCatalogToCloud(nextTree, now);
          return { retroPcCategories: nextTree, retroPcCatalogUpdatedAt: now };
        });
      },

      moveRetroPcCategory: (nodeId, newParentId) => {
        set((s) => {
          const found = findRetroPcNodeWithTrailById(s.retroPcCategories, nodeId);
          if (!found) return s;
          const targetNode = found.current;
          // Prevent moving a category into itself or one of its own descendants
          if (newParentId) {
            const subtreeIds = collectSubtreeIds(targetNode);
            if (subtreeIds.includes(newParentId.toLowerCase())) {
              return s;
            }
          }
          const now = Date.now();
          const withoutTarget = deleteNodeFromTree(s.retroPcCategories, nodeId);
          const nextTree = insertNodeInTree(withoutTarget, newParentId, targetNode);
          syncRetroPcCatalogToCloud(nextTree, now);
          return { retroPcCategories: nextTree, retroPcCatalogUpdatedAt: now };
        });
      },

      updateRetroPcCategoryImage: (nodeId, image) => {
        set((s) => {
          const now = Date.now();
          const nextTree = updateNodeInTree(s.retroPcCategories, nodeId, (node) => ({
            ...node,
            image,
          }));
          syncRetroPcCatalogToCloud(nextTree, now);
          return { retroPcCategories: nextTree, retroPcCatalogUpdatedAt: now };
        });
      },

      resetRetroPcCategoryImage: (nodeId) => {
        set((s) => {
          const now = Date.now();
          const defaultMatch = findRetroPcNodeWithTrailById(RETRO_PC_CATEGORIES, nodeId);
          const defaultImg = defaultMatch?.current.image || '';
          const nextTree = updateNodeInTree(s.retroPcCategories, nodeId, (node) => ({
            ...node,
            image: defaultImg,
          }));
          syncRetroPcCatalogToCloud(nextTree, now);
          return { retroPcCategories: nextTree, retroPcCatalogUpdatedAt: now };
        });
      },

      initializeFromCloud: async () => {
        try {
          const { data, error } = await supabase.from('store_settings').select('*');
          if (!error && data) {
            const vc = data.find((row) => row.id === 'visual_categories');
            const os = data.find((row) => row.id === 'offer_slides');
            const rbl = data.find((row) => row.id === 'retro_brand_logos');
            const rdi = data.find((row) => row.id === 'retro_device_images');
            const rki = data.find((row) => row.id === 'retro_kind_images');
            const rc = data.find((row) => row.id === 'retro_catalog');
            const rpc = data.find((row) => row.id === 'retro_pc_catalog');
            
            if (vc && vc.data && Array.isArray(vc.data)) {
              set({ visualCategories: vc.data });
            }
            if (os && os.data && Array.isArray(os.data)) {
              set({ slides: os.data });
            }
            if (rbl && rbl.data) {
              const cleanLogos: Record<string, string> = {};
              for (const [k, v] of Object.entries(rbl.data)) {
                if (typeof v === 'string' && v.trim() !== '' && !v.includes('qdozfcplmd')) {
                  cleanLogos[k] = v;
                }
              }
              set({ retroBrandLogos: cleanLogos });
            }
            if (rdi && rdi.data) {
              const cleanDeviceImgs: Record<string, string> = {};
              for (const [k, v] of Object.entries(rdi.data)) {
                if (typeof v === 'string' && v.trim() !== '' && !v.includes('qdozfcplmd')) {
                  cleanDeviceImgs[k] = v;
                }
              }
              set({ retroDeviceImages: cleanDeviceImgs });
            }
            if (rki && rki.data) {
              const cleanKindImgs: Record<string, string> = {};
              for (const [k, v] of Object.entries(rki.data)) {
                if (typeof v === 'string' && v.trim() !== '' && !v.includes('qdozfcplmd')) {
                  cleanKindImgs[k] = v;
                }
              }
              set({ retroKindImages: cleanKindImgs });
            }
            if (rc && rc.data) {
              const cloudUpdatedAt = typeof rc.data.updatedAt === 'number' ? rc.data.updatedAt : Date.now();
              const rawBrands: RetroBrand[] | undefined = Array.isArray(rc.data)
                ? rc.data
                : Array.isArray(rc.data.brands)
                ? rc.data.brands
                : undefined;
              if (rawBrands && rawBrands.length > 0) {
                const sanitized = rawBrands.map((b) => {
                  const defB = RETRO_BRANDS.find((x) => x.id === b.id);
                  const cleanLogo = b.logo && !b.logo.includes('qdozfcplmd') ? b.logo : defB?.logo;
                  return {
                    ...(defB || {}),
                    ...b,
                    logo: cleanLogo,
                    devices: (b.devices || []).map((d) => {
                      const defD = defB?.devices.find((x) => x.id === d.id);
                      const cleanImg = d.image && !d.image.includes('qdozfcplmd') ? d.image : defD?.image || '';
                      const cleanKinds = { ...(d.kindImages || {}) };
                      for (const [k, v] of Object.entries(cleanKinds)) {
                        if (typeof v === 'string' && v.includes('qdozfcplmd')) {
                          delete cleanKinds[k as RetroKindId];
                        }
                      }
                      return {
                        ...(defD || {}),
                        ...d,
                        image: cleanImg,
                        kindImages: cleanKinds,
                      };
                    }),
                  };
                });
                set({ retroBrands: sanitized, retroCatalogUpdatedAt: cloudUpdatedAt });
              }
            }
            if (rpc && rpc.data) {
              const cloudPcUpdatedAt = typeof rpc.data.updatedAt === 'number' ? rpc.data.updatedAt : Date.now();
              const rawPcCats: RetroPcCategoryNode[] | undefined = Array.isArray(rpc.data)
                ? rpc.data
                : Array.isArray(rpc.data.categories)
                ? rpc.data.categories
                : undefined;
              if (rawPcCats && rawPcCats.length > 0) {
                set({
                  retroPcCategories: sanitizeRetroPcTree(rawPcCats),
                  retroPcCatalogUpdatedAt: cloudPcUpdatedAt,
                });
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch store settings from cloud:", err);
        }
      },

      importStoreSettings: async (payload) => {
        const now = Date.now();
        const updates: Partial<OffersState> = {};
        const rowsToUpsert: Array<{ id: string; data: unknown; updated_at: string }> = [];
        const isoNow = new Date().toISOString();

        if (Array.isArray(payload.visualCategories)) {
          updates.visualCategories = payload.visualCategories;
          rowsToUpsert.push({ id: 'visual_categories', data: payload.visualCategories, updated_at: isoNow });
        }
        if (Array.isArray(payload.slides)) {
          updates.slides = payload.slides;
          rowsToUpsert.push({ id: 'offer_slides', data: payload.slides, updated_at: isoNow });
        }
        if (Array.isArray(payload.retroBrands)) {
          updates.retroBrands = payload.retroBrands;
          updates.retroCatalogUpdatedAt = now;
          rowsToUpsert.push({ id: 'retro_catalog', data: { brands: payload.retroBrands, updatedAt: now }, updated_at: isoNow });
        }
        if (payload.retroBrandLogos && typeof payload.retroBrandLogos === 'object') {
          updates.retroBrandLogos = payload.retroBrandLogos;
          rowsToUpsert.push({ id: 'retro_brand_logos', data: payload.retroBrandLogos, updated_at: isoNow });
        }
        if (payload.retroDeviceImages && typeof payload.retroDeviceImages === 'object') {
          updates.retroDeviceImages = payload.retroDeviceImages;
          rowsToUpsert.push({ id: 'retro_device_images', data: payload.retroDeviceImages, updated_at: isoNow });
        }
        if (payload.retroKindImages && typeof payload.retroKindImages === 'object') {
          updates.retroKindImages = payload.retroKindImages;
          rowsToUpsert.push({ id: 'retro_kind_images', data: payload.retroKindImages, updated_at: isoNow });
        }
        if (Array.isArray(payload.retroPcCategories)) {
          const cleanTree = sanitizeRetroPcTree(payload.retroPcCategories);
          updates.retroPcCategories = cleanTree;
          updates.retroPcCatalogUpdatedAt = now;
          rowsToUpsert.push({ id: 'retro_pc_catalog', data: { categories: cleanTree, updatedAt: now }, updated_at: isoNow });
        }

        if (Object.keys(updates).length > 0) {
          set(updates as Partial<OffersState>);
        }

        if (rowsToUpsert.length > 0) {
          try {
            await supabase.from('store_settings').upsert(rowsToUpsert);
          } catch (err) {
            console.error("Failed to sync imported store settings to cloud:", err);
          }
        }
      },
    }),
    {
      name: 'retro-offers',
      merge: (persistedState, currentState) => {
        const p = (persistedState as Partial<OffersState>) || {};
        
        // Clean old dead Supabase storage URLs from local storage cache
        const cleanBrandLogos: Record<string, string> = {};
        if (p.retroBrandLogos) {
          for (const [k, v] of Object.entries(p.retroBrandLogos)) {
            if (typeof v === 'string' && !v.includes('qdozfcplmd')) {
              cleanBrandLogos[k] = v;
            }
          }
        }

        const cleanDeviceImgs: Record<string, string> = {};
        if (p.retroDeviceImages) {
          for (const [k, v] of Object.entries(p.retroDeviceImages)) {
            if (typeof v === 'string' && !v.includes('qdozfcplmd')) {
              cleanDeviceImgs[k] = v;
            }
          }
        }

        const cleanKindImgs: Record<string, string> = {};
        if (p.retroKindImages) {
          for (const [k, v] of Object.entries(p.retroKindImages)) {
            if (typeof v === 'string' && !v.includes('qdozfcplmd')) {
              cleanKindImgs[k] = v;
            }
          }
        }

        const persistedBrands = Array.isArray(p.retroBrands) && p.retroBrands.length > 0 ? p.retroBrands : [];
        const mergedBrands = persistedBrands.length > 0
          ? persistedBrands.map((pb) => {
              const defaultBrand = RETRO_BRANDS.find((db) => db.id === pb.id);
              if (!defaultBrand) return pb;
              const cleanLogo = pb.logo && !pb.logo.includes('qdozfcplmd') ? pb.logo : defaultBrand.logo;
              return {
                ...defaultBrand,
                ...pb,
                logo: cleanLogo,
                devices: (pb.devices || []).map((pd) => {
                  const defaultDev = defaultBrand.devices.find((dd) => dd.id === pd.id);
                  const cleanDevImg = pd.image && !pd.image.includes('qdozfcplmd') ? pd.image : (defaultDev?.image || '');
                  const cleanKinds = { ...(pd.kindImages || {}) };
                  for (const [k, v] of Object.entries(cleanKinds)) {
                    if (typeof v === 'string' && v.includes('qdozfcplmd')) {
                      delete cleanKinds[k as RetroKindId];
                    }
                  }
                  return {
                    ...(defaultDev || {}),
                    ...pd,
                    image: cleanDevImg,
                    kindImages: cleanKinds,
                  };
                }),
              };
            })
          : currentState.retroBrands;

        const persistedPcCats = Array.isArray(p.retroPcCategories) && p.retroPcCategories.length > 0
          ? sanitizeRetroPcTree(p.retroPcCategories)
          : currentState.retroPcCategories;

        return {
          ...currentState,
          ...p,
          retroBrandLogos: { ...currentState.retroBrandLogos, ...cleanBrandLogos },
          retroDeviceImages: { ...currentState.retroDeviceImages, ...cleanDeviceImgs },
          retroKindImages: { ...currentState.retroKindImages, ...cleanKindImgs },
          retroBrands: mergedBrands,
          retroPcCategories: persistedPcCats,
        };
      },
    }
  )
);
