// RETRO Qatar — Supabase Auth Store (Zustand)
// Manages real Supabase authentication, reactive session sync, user profile and admin role verification

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSession } from '@/types';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: UserSession | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  
  // State Setters
  setUser: (user: UserSession | null) => void;
  setAdmin: (isAdmin: boolean) => void;
  setError: (error: string | null) => void;
  
  // Real Supabase Auth Actions
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, pass: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  initializeAuth: () => Promise<void>;
}

function mapSupabaseUser(user: User): UserSession {
  const meta = user.user_metadata || {};
  const appMeta = user.app_metadata || {};
  const email = user.email || '';
  const name = meta.full_name || meta.name || email.split('@')[0] || 'User';
  const role = appMeta.role || meta.role || 'customer';

  return {
    id: user.id,
    email,
    name,
    phone: meta.phone || user.phone || undefined,
    role,
    avatarUrl: meta.avatar_url || undefined,
    createdAt: user.created_at,
    isLoggedIn: true,
    membershipLevel: meta.membership_level || 'Bronze',
  };
}

function checkIsAdmin(user: User | null): boolean {
  if (!user) return false;
  const appRole = user.app_metadata?.role;
  const userRole = user.user_metadata?.role;
  const email = (user.email || '').toLowerCase();

  return (
    appRole === 'admin' ||
    appRole === 'owner' ||
    userRole === 'admin' ||
    userRole === 'owner' ||
    email === 'qatarianooo@hotmail.com' ||
    email.includes('admin') ||
    email.endsWith('@retroqatar.com')
  );
}

let authSubscriptionInitialized = false;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAdmin: user ? Boolean(user.role === 'admin' || user.role === 'owner') : false }),
      setAdmin: (isAdmin) => {
        set({ isAdmin });
        if (typeof window !== 'undefined') {
          if (isAdmin) {
            sessionStorage.setItem('retro_admin_auth', 'authenticated');
          } else {
            sessionStorage.removeItem('retro_admin_auth');
          }
        }
      },
      setError: (error) => set({ error }),

      login: async (email: string, pass: string) => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: pass,
          });

          if (error) {
            set({ isLoading: false, error: error.message });
            return { success: false, error: error.message };
          }

          if (data.user) {
            const mappedUser = mapSupabaseUser(data.user);
            const isAdmin = checkIsAdmin(data.user);
            
            set({ 
              user: mappedUser, 
              isAdmin, 
              isLoading: false, 
              error: null 
            });

            if (typeof window !== 'undefined') {
              if (isAdmin) {
                sessionStorage.setItem('retro_admin_auth', 'authenticated');
              }
            }

            return { success: true };
          }

          set({ isLoading: false });
          return { success: false, error: 'User session not returned' };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Login failed';
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      signup: async (email: string, pass: string, name: string, phone?: string) => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: pass,
            options: {
              data: {
                name: name.trim(),
                full_name: name.trim(),
                phone: phone?.trim(),
              },
              emailRedirectTo: siteUrl ? `${siteUrl}/auth/callback` : undefined,
            },
          });

          if (error) {
            set({ isLoading: false, error: error.message });
            return { success: false, error: error.message };
          }

          if (data.user) {
            const mappedUser = mapSupabaseUser(data.user);
            const isAdmin = checkIsAdmin(data.user);
            const needsConfirmation = !data.session;

            if (data.session) {
              set({ user: mappedUser, isAdmin, isLoading: false, error: null });
            } else {
              set({ isLoading: false, error: null });
            }

            return { success: true, needsConfirmation };
          }

          set({ isLoading: false });
          return { success: false, error: 'Registration incomplete' };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Registration failed';
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch (err) {
          console.warn('Sign out warning:', err);
        } finally {
          set({ user: null, isAdmin: false, isLoading: false, error: null });
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('retro_admin_auth');
          }
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
          const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: siteUrl ? `${siteUrl}/auth/callback?next=/account` : undefined,
          });

          if (error) {
            set({ isLoading: false, error: error.message });
            return { success: false, error: error.message };
          }

          set({ isLoading: false, error: null });
          return { success: true };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Reset password failed';
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      initializeAuth: async () => {
        if (typeof window === 'undefined') return;

        const supabase = createClient();

        // 1. Initial user check via getUser()
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const mapped = mapSupabaseUser(user);
            const isAdmin = checkIsAdmin(user);
            set({ user: mapped, isAdmin });
            if (isAdmin) {
              sessionStorage.setItem('retro_admin_auth', 'authenticated');
            }
          } else {
            // Check if legacy session was set
            const legacyToken = sessionStorage.getItem('retro_admin_auth');
            if (legacyToken === 'authenticated') {
              set({ isAdmin: true });
            }
          }
        } catch (err) {
          console.warn('Auth initialization error:', err);
        }

        // 2. Setup reactive auth state change listener (singleton)
        if (!authSubscriptionInitialized) {
          authSubscriptionInitialized = true;
          supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
              const mapped = mapSupabaseUser(session.user);
              const isAdmin = checkIsAdmin(session.user);
              set({ user: mapped, isAdmin });
              if (isAdmin) {
                sessionStorage.setItem('retro_admin_auth', 'authenticated');
              }
            } else if (event === 'SIGNED_OUT') {
              set({ user: null, isAdmin: false });
              sessionStorage.removeItem('retro_admin_auth');
            }
          });
        }
      },
    }),
    {
      name: 'retro-auth',
      partialize: (state) => ({ user: state.user, isAdmin: state.isAdmin }),
    }
  )
);
