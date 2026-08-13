// RETRO Qatar — PC Builder Store (Zustand)

import { create } from 'zustand';
import type { Product } from '@/types';

export type BuilderStep = 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case' | 'cooling';

export type CompatibilityStatus = 'compatible' | 'incompatible' | 'warning' | 'unchecked';

interface CompatibilityResult {
  status: CompatibilityStatus;
  messages: string[];
}

interface PCBuilderState {
  currentStep: number;
  selectedParts: Partial<Record<BuilderStep, Product>>;
  compatibility: CompatibilityResult;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  selectPart: (step: BuilderStep, product: Product) => void;
  removePart: (step: BuilderStep) => void;
  resetBuild: () => void;
  getTotalPrice: () => number;
  getEstimatedWattage: () => number;
  setCompatibility: (result: CompatibilityResult) => void;
}

export const usePCBuilderStore = create<PCBuilderState>()((set, get) => ({
  currentStep: 0,
  selectedParts: {},
  compatibility: { status: 'unchecked', messages: [] },

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 8) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

  selectPart: (step, product) => {
    set((state) => ({
      selectedParts: { ...state.selectedParts, [step]: product },
    }));
  },

  removePart: (step) => {
    set((state) => {
      const parts = { ...state.selectedParts };
      delete parts[step];
      return { selectedParts: parts };
    });
  },

  resetBuild: () => set({
    currentStep: 0,
    selectedParts: {},
    compatibility: { status: 'unchecked', messages: [] },
  }),

  getTotalPrice: () => {
    const parts = get().selectedParts;
    return Object.values(parts).reduce((total, part) => {
      if (!part) return total;
      return total + (part.salePrice ?? part.sellingPrice);
    }, 0);
  },

  getEstimatedWattage: () => {
    const parts = get().selectedParts;
    let wattage = 0;
    // Estimate based on specs if available
    Object.values(parts).forEach((part) => {
      if (part?.specs?.tdp) wattage += Number(part.specs.tdp);
      else if (part?.specs?.wattage) wattage += Number(part.specs.wattage);
    });
    return wattage || 0;
  },

  setCompatibility: (result) => set({ compatibility: result }),
}));
