// RETRO Qatar — UI Store (Zustand)
// Manages language, theme, modal states, and layout preferences

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'en' | 'ar';

interface UIState {
  // Language & Direction
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isRtl: boolean;

  // Active Department (Branding Swap)
  activeDepartment: 'general' | 'pc';
  setActiveDepartment: (dept: 'general' | 'pc') => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  // Cart drawer
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;

  // Search overlay
  searchOverlayOpen: boolean;
  setSearchOverlayOpen: (open: boolean) => void;

  // Toast notifications
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Language
      locale: 'en',
      isRtl: false,
      setLocale: (locale) => set({ locale, isRtl: locale === 'ar' }),

      // Active Department
      activeDepartment: 'general',
      setActiveDepartment: (activeDepartment) => set({ activeDepartment }),

      // Mobile menu
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),

      // Cart drawer
      cartDrawerOpen: false,
      setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),

      // Search overlay
      searchOverlayOpen: false,
      setSearchOverlayOpen: (open) => set({ searchOverlayOpen: open }),

      // Toast
      toast: null,
      showToast: (message, type = 'success') => {
        set({ toast: { message, type } });
        setTimeout(() => set({ toast: null }), 3500);
      },
      clearToast: () => set({ toast: null }),
    }),
    {
      name: 'retro-ui',
      partialize: (state) => ({ locale: state.locale, isRtl: state.isRtl, activeDepartment: state.activeDepartment }),
    }
  )
);
