// RETRO Qatar — Account Page Content (Client)

'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUIStore } from '@/stores/useUIStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface AccountContentProps {
  dict: Dictionary;
  locale: Locale;
}

export function AccountContent({ dict, locale }: AccountContentProps) {
  const { user, login, logout, signup } = useAuthStore();
  const { showToast } = useUIStore();
  const isRtl = locale === 'ar';

  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const breadcrumbs = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: isRtl ? 'حسابي' : 'My Account' },
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Call mock login
    login(email, password);
    showToast(isRtl ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!', 'success');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;

    // Call mock signup
    signup(email, password, name);
    showToast(isRtl ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!', 'success');
  };

  // If NOT logged in, show Auth Forms
  if (!user) {
    return (
      <div className="bg-retro-bg min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-retro-bg-card border border-retro-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-retro-purple/5 rounded-full blur-[50px] pointer-events-none" />
          
          <div className="text-center mb-8 relative">
            <h1 className="text-2xl font-black text-retro-text tracking-tight mb-2">
              {isLoginView 
                ? (isRtl ? 'تسجيل الدخول' : 'Welcome Back') 
                : (isRtl ? 'إنشاء حساب جديد' : 'Create Account')
              }
            </h1>
            <p className="text-sm text-retro-text-secondary">
              {isLoginView 
                ? (isRtl ? 'سجل دخولك للوصول لطلباتك وتجميعاتك' : 'Sign in to access your orders & builds') 
                : (isRtl ? 'انضم إلينا واستمتع بتجربة تسوق متكاملة' : 'Join us for a unified shopping experience')
              }
            </p>
          </div>

          {isLoginView ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <Input 
                label={isRtl ? 'البريد الإلكتروني' : 'Email'} 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input 
                label={isRtl ? 'كلمة المرور' : 'Password'} 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" fullWidth size="lg">
                {isRtl ? 'دخول' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <Input 
                label={isRtl ? 'الاسم الكامل' : 'Full Name'} 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input 
                label={isRtl ? 'البريد الإلكتروني' : 'Email'} 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input 
                label={isRtl ? 'كلمة المرور' : 'Password'} 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" fullWidth size="lg" variant="accent">
                {isRtl ? 'إنشاء حساب' : 'Create Account'}
              </Button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-retro-border text-center text-sm">
            <span className="text-retro-text-secondary">
              {isLoginView 
                ? (isRtl ? 'ليس لديك حساب؟' : 'Don\'t have an account?') 
                : (isRtl ? 'لديك حساب بالفعل؟' : 'Already have an account?')
              }
            </span>
            <button 
              onClick={() => setIsLoginView(!isLoginView)}
              className="text-retro-cyan font-bold ltr:ml-2 rtl:mr-2 hover:text-retro-cyan-muted transition-colors cursor-pointer"
            >
              {isLoginView 
                ? (isRtl ? 'أنشئ حساباً الآن' : 'Sign Up') 
                : (isRtl ? 'سجل دخولك' : 'Sign In')
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If Logged In, show Profile Dashboard
  return (
    <div className="bg-retro-bg min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-retro-border">
          <div>
            <span className="text-sm font-bold text-retro-cyan uppercase tracking-wider">{isRtl ? 'مرحباً بك مجدداً' : 'Welcome back'}</span>
            <h1 className="text-3xl font-black text-retro-text mt-1">{user.name}</h1>
          </div>
          <Button variant="ghost" onClick={logout} className="text-retro-red border-retro-red/20 hover:bg-retro-red/10">
            {isRtl ? 'خروج' : 'Log Out'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Profile card */}
          <div className="bg-retro-bg-card border border-retro-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-black text-retro-text pb-2 border-b border-retro-border">{isRtl ? 'بيانات الحساب' : 'Account Details'}</h2>
            <div className="space-y-1">
              <div className="text-xs text-retro-text-dim">{isRtl ? 'البريد الإلكتروني' : 'Email'}</div>
              <div className="text-sm font-semibold text-retro-text">{user.email}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-retro-text-dim">{isRtl ? 'تاريخ التسجيل' : 'Member Since'}</div>
              <div className="text-sm font-semibold text-retro-text">August 2026</div>
            </div>
          </div>

          {/* Orders card */}
          <div className="lg:col-span-2 bg-retro-bg-card border border-retro-border rounded-2xl p-6">
            <h2 className="text-lg font-black text-retro-text pb-4 border-b border-retro-border mb-6">{isRtl ? 'الطلبات السابقة' : 'Order History'}</h2>
            
            {/* Mock Order Log */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-retro-border bg-retro-bg-input flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="text-xs text-retro-text-dim">Order #RT-ORD-998124</div>
                  <div className="text-sm font-black text-retro-cyan mt-1">Ready for pickup (صيانة جهاز PS5)</div>
                </div>
                <div className="sm:text-end">
                  <div className="text-xs text-retro-text-dim">Date</div>
                  <div className="text-sm font-semibold text-retro-text">12/08/2026</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-retro-border bg-retro-bg-input flex flex-col sm:flex-row justify-between sm:items-center gap-4 opacity-70">
                <div>
                  <div className="text-xs text-retro-text-dim">Order #RT-ORD-771654</div>
                  <div className="text-sm font-black text-green-500 mt-1">Delivered (شراء قطع غيار)</div>
                </div>
                <div className="sm:text-end">
                  <div className="text-xs text-retro-text-dim">Date</div>
                  <div className="text-sm font-semibold text-retro-text">09/08/2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
