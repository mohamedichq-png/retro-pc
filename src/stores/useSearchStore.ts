// RETRO Qatar — Search Store (Zustand)

import { create } from 'zustand';

interface SearchState {
  query: string;
  setQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>()((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  recentSearches: [],
  addRecentSearch: (term) => {
    set((state) => {
      const filtered = state.recentSearches.filter((s) => s !== term);
      return { recentSearches: [term, ...filtered].slice(0, 8) };
    });
  },
  clearRecentSearches: () => set({ recentSearches: [] }),
}));
