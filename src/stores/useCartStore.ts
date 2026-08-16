// RETRO Qatar — Cart Store (Zustand)
// Manages shopping cart state with localStorage persistence

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductVariation } from '@/types';

export interface CartItem {
  product: Product;
  qty: number;
  variation?: ProductVariation;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, qty?: number, variation?: ProductVariation) => void;
  removeItem: (productId: string, variationSku?: string) => void;
  updateQty: (productId: string, qty: number, variationSku?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1, variation) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id && item.variation?.sku === variation?.sku
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.variation?.sku === variation?.sku
                  ? { ...item, qty: item.qty + qty }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, qty, variation }] };
        });
      },

      removeItem: (productId, variationSku) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.variation?.sku === variationSku)
          ),
        }));
      },

      updateQty: (productId, qty, variationSku) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.variation?.sku === variationSku
              ? { ...item, qty: Math.max(1, qty) }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.variation
            ? (item.variation.salePrice ?? item.variation.sellingPrice)
            : (item.product.salePrice ?? item.product.sellingPrice);
          return total + price * item.qty;
        }, 0);
      },

      getSubtotal: () => {
        return get().getTotal();
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.qty, 0);
      },
    }),
    {
      name: 'retro-cart',
    }
  )
);
