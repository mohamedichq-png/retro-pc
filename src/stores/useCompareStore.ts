// RETRO Qatar — Compare Store (Zustand)

import { create } from 'zustand';
import type { Product } from '@/types';
import { MAX_COMPARE_ITEMS } from '@/lib/constants';

interface CompareState {
  items: Product[];
  toggle: (product: Product) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()((set, get) => ({
  items: [],

  toggle: (product) => {
    set((state) => {
      const exists = state.items.find((p) => p.id === product.id);
      if (exists) {
        return { items: state.items.filter((p) => p.id !== product.id) };
      }
      if (state.items.length >= MAX_COMPARE_ITEMS) return state;
      return { items: [...state.items, product] };
    });
  },

  has: (productId) => !!get().items.find((p) => p.id === productId),

  clear: () => set({ items: [] }),
}));
