// RETRO Qatar — Auth Store (Zustand)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSession } from '@/types';

interface AuthState {
  user: UserSession | null;
  isAdmin: boolean;
  setUser: (user: UserSession | null) => void;
  setAdmin: (isAdmin: boolean) => void;
  login: (email: string, pass: string) => void;
  signup: (email: string, pass: string, name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,

      setUser: (user) => set({ user }),
      setAdmin: (isAdmin) => set({ isAdmin }),
      login: (email, pass) => set({ 
        user: { 
          id: 'u-1', 
          email, 
          name: email.split('@')[0], 
          isLoggedIn: true
        } 
      }),
      signup: (email, pass, name) => set({ 
        user: { 
          id: 'u-2', 
          email, 
          name, 
          isLoggedIn: true
        } 
      }),
      logout: () => set({ user: null, isAdmin: false }),
    }),
    {
      name: 'retro-auth',
      partialize: (state) => ({ user: state.user, isAdmin: state.isAdmin }),
    }
  )
);
