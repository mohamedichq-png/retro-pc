// RETRO Qatar — Offers & Banners Store (Zustand)
// Manages dynamic homepage hero slides and promotions in local storage

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

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
}

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

  // Cloud Sync
  initializeFromCloud: () => Promise<void>;
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

export const useOffersStore = create<OffersState>()(
  persist(
    (set, get) => ({
      slides: DEFAULT_SLIDES,
      addSlide: (slide) => {
        set((s) => {
          const newSlides = [slide, ...s.slides];
          supabase.from('store_settings').upsert({ id: 'offer_slides', data: newSlides }).then();
          return { slides: newSlides };
        });
      },
      removeSlide: (key) => {
        set((s) => {
          const newSlides = s.slides.filter((x) => x.key !== key);
          supabase.from('store_settings').upsert({ id: 'offer_slides', data: newSlides }).then();
          return { slides: newSlides };
        });
      },
      updateSlide: (key, updates) => {
        set((s) => {
          const newSlides = s.slides.map((x) => (x.key === key ? { ...x, ...updates } : x));
          supabase.from('store_settings').upsert({ id: 'offer_slides', data: newSlides }).then();
          return { slides: newSlides };
        });
      },
        
      // Weekly Offer state
      weeklyOffersActive: true,
      weeklyOfferProductId: 'p-new-5', // Default matching RTX 4070 Ti from mockData
      weeklyOfferPromoPrice: 2850,
      weeklyOfferEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
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
          supabase.from('store_settings').upsert({ id: 'visual_categories', data: newCats }).then();
          return { visualCategories: newCats };
        });
      },
      initializeFromCloud: async () => {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-domain')) {
          return;
        }
        try {
          const { data, error } = await supabase.from('store_settings').select('*');
          if (!error && data) {
            const vc = data.find((row) => row.id === 'visual_categories');
            const os = data.find((row) => row.id === 'offer_slides');
            
            if (vc && vc.data) {
              set({ visualCategories: vc.data });
            }
            if (os && os.data) {
              set({ slides: os.data });
            }
          }
        } catch (err) {
          console.error("Failed to fetch store settings from cloud:", err);
        }
      },
    }),
    {
      name: 'retro-offers',
    }
  )
);
