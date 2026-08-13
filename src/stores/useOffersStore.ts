// RETRO Qatar — Offers & Banners Store (Zustand)
// Manages dynamic homepage hero slides and promotions in local storage

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    (set) => ({
      slides: DEFAULT_SLIDES,
      addSlide: (slide) => set((s) => ({ slides: [slide, ...s.slides] })),
      removeSlide: (key) => set((s) => ({ slides: s.slides.filter((x) => x.key !== key) })),
      updateSlide: (key, updates) =>
        set((s) => ({
          slides: s.slides.map((x) => (x.key === key ? { ...x, ...updates } : x)),
        })),
        
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
    }),
    {
      name: 'retro-offers',
    }
  )
);
