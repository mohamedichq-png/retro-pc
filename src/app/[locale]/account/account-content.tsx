// RETRO Qatar — Account Page Content (Client)
// Full Supabase Auth integration with Login, Register, Password Reset, and User Profile

'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { user, login, logout, signup, resetPassword, isLoading, isAdmin } = useAuthStore();
  const { showToast } = useUIStore();
  const isRtl = locale === 'ar';

  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const breadcrumbs = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: isRtl ? 'حسابي' : 'My Account' },
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setInfoMessage(null);

    if (!email || !password) {
      setFormError(isRtl ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      showToast(isRtl ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!', 'success');
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } else {
      setFormError(result.error || (isRtl ? 'فشل تسجيل الدخول. تحقق من البيانات.' : 'Login failed. Please check credentials.'));
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setInfoMessage(null);

    if (!email || !password || !name) {
      setFormError(isRtl ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    if (password.length < 6) {
      setFormError(isRtl ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }

    const result = await signup(email, password, name, phone);
    if (result.success) {
      if (result.needsConfirmation) {
        setInfoMessage(
          isRtl
            ? 'تم إنشاء الحساب! يرجى مراجعة بريدك الإلكتروني لتأكيد التسجيل.'
            : 'Account created! Please check your email to confirm registration.'
        );
        showToast(isRtl ? 'تحقق من بريدك الإلكتروني' : 'Please check your email', 'info');
      } else {
        showToast(isRtl ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!', 'success');
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      }
    } else {
      setFormError(result.error || (isRtl ? 'تعذر إنشاء الحساب' : 'Failed to create account'));
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setInfoMessage(null);

    if (!email) {
      setFormError(isRtl ? 'يرجى كتابة البريد الإلكتروني' : 'Please enter your email address');
      return;
    }

    const result = await resetPassword(email);
    if (result.success) {
      setInfoMessage(
        isRtl
          ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.'
          : 'Password reset link sent to your email.'
      );
      showToast(isRtl ? 'تم إرسال الرابط' : 'Reset link sent', 'success');
    } else {
      setFormError(result.error || (isRtl ? 'تعذر إرسال الرابط' : 'Failed to send reset email'));
    }
  };

  // If NOT logged in, show Auth Forms
  if (!user) {
    return (
      <div className="bg-retro-bg min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-retro-bg-card border border-retro-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-retro-purple/5 rounded-full blur-[50px] pointer-events-none" />
          
          <div className="text-center mb-8 relative">
            <h1 className="text-2xl font-black text-retro-text tracking-tight mb-2">
              {authMode === 'login' && (isRtl ? 'تسجيل الدخول' : 'Welcome Back')}
              {authMode === 'signup' && (isRtl ? 'إنشاء حساب جديد' : 'Create Account')}
              {authMode === 'forgot' && (isRtl ? 'استعادة كلمة المرور' : 'Reset Password')}
            </h1>
            <p className="text-sm text-retro-text-secondary">
              {authMode === 'login' && (isRtl ? 'سجل دخولك للوصول لطلباتك وتجميعاتك' : 'Sign in to access your orders & builds')}
              {authMode === 'signup' && (isRtl ? 'انضم إلينا واستمتع بتجربة تسوق متكاملة' : 'Join us for a unified gaming experience')}
              {authMode === 'forgot' && (isRtl ? 'أدخل بريدك الإلكتروني لاستلام رابط الاستعادة' : 'Enter your email to receive recovery instructions')}
            </p>
          </div>

          {/* Error & Info Feedback Alerts */}
          {formError && (
            <div className="mb-6 p-3 rounded-xl bg-retro-red/10 border border-retro-red/30 text-xs font-semibold text-retro-red">
              {formError}
            </div>
          )}
          {infoMessage && (
            <div className="mb-6 p-3 rounded-xl bg-retro-cyan/10 border border-retro-cyan/30 text-xs font-semibold text-retro-cyan">
              {infoMessage}
            </div>
          )}

          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <Input 
                label={isRtl ? 'البريد الإلكتروني' : 'Email'} 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
              <div className="space-y-1">
                <Input 
                  label={isRtl ? 'كلمة المرور' : 'Password'} 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setFormError(null); setInfoMessage(null); }}
                    className="text-[11px] text-retro-text-dim hover:text-retro-cyan transition-colors cursor-pointer"
                  >
                    {isRtl ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                  </button>
                </div>
              </div>
              <Button type="submit" fullWidth size="lg" disabled={isLoading}>
                {isLoading 
                  ? (isRtl ? 'جاري التحقق...' : 'Signing in...') 
                  : (isRtl ? 'دخول' : 'Sign In')}
              </Button>
            </form>
          )}

          {authMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <Input 
                label={isRtl ? 'الاسم الكامل' : 'Full Name'} 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
              <Input 
                label={isRtl ? 'البريد الإلكتروني' : 'Email'} 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
              <Input 
                label={isRtl ? 'رقم الهاتف (اختياري)' : 'Phone Number (Optional)'} 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+974 ..."
              />
              <Input 
                label={isRtl ? 'كلمة المرور (6 أحرف كحد أدنى)' : 'Password (min 6 chars)'} 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" fullWidth size="lg" variant="accent" disabled={isLoading}>
                {isLoading 
                  ? (isRtl ? 'جاري الإنشاء...' : 'Creating account...') 
                  : (isRtl ? 'إنشاء حساب' : 'Create Account')}
              </Button>
            </form>
          )}

          {authMode === 'forgot' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
              <Input 
                label={isRtl ? 'البريد الإلكتروني' : 'Email'} 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
              <Button type="submit" fullWidth size="lg" disabled={isLoading}>
                {isLoading 
                  ? (isRtl ? 'جاري الإرسال...' : 'Sending link...') 
                  : (isRtl ? 'إرسال رابط الاستعادة' : 'Send Reset Link')}
              </Button>
            </form>
          )}

          {/* Mode Switcher footer */}
          <div className="mt-8 pt-6 border-t border-retro-border text-center text-sm">
            {authMode === 'login' && (
              <>
                <span className="text-retro-text-secondary">
                  {isRtl ? 'ليس لديك حساب؟' : "Don't have an account?"}
                </span>
                <button 
                  onClick={() => { setAuthMode('signup'); setFormError(null); setInfoMessage(null); }}
                  className="text-retro-cyan font-bold ltr:ml-2 rtl:mr-2 hover:text-retro-cyan-muted transition-colors cursor-pointer"
                >
                  {isRtl ? 'أنشئ حساباً الآن' : 'Sign Up'}
                </button>
              </>
            )}

            {authMode === 'signup' && (
              <>
                <span className="text-retro-text-secondary">
                  {isRtl ? 'لديك حساب بالفعل؟' : 'Already have an account?'}
                </span>
                <button 
                  onClick={() => { setAuthMode('login'); setFormError(null); setInfoMessage(null); }}
                  className="text-retro-cyan font-bold ltr:ml-2 rtl:mr-2 hover:text-retro-cyan-muted transition-colors cursor-pointer"
                >
                  {isRtl ? 'سجل دخولك' : 'Sign In'}
                </button>
              </>
            )}

            {authMode === 'forgot' && (
              <button 
                onClick={() => { setAuthMode('login'); setFormError(null); setInfoMessage(null); }}
                className="text-retro-cyan font-bold hover:text-retro-cyan-muted transition-colors cursor-pointer"
              >
                {isRtl ? 'الرجوع إلى تسجيل الدخول' : 'Back to Sign In'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If Logged In, show Profile Dashboard
  const formattedMemberDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-QA' : 'en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '2026';

  return (
    <div className="bg-retro-bg min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-retro-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-retro-cyan uppercase tracking-wider">
                {isRtl ? 'مرحباً بك مجدداً' : 'Welcome back'}
              </span>
              {isAdmin && (
                <span className="inline-flex items-center rounded-full bg-retro-purple/20 border border-retro-purple/40 px-2 py-0.5 text-[10px] font-black text-retro-purple">
                  ADMIN
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black text-retro-text mt-1">{user.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href={`/${locale}/admin`}
                className="rounded-xl bg-linear-to-r from-retro-cyan to-retro-purple px-4 py-2 text-xs font-bold text-white shadow-md hover:scale-105 transition-all"
              >
                {isRtl ? 'لوحة تحكم الإدارة' : 'Admin ERP Desk'}
              </Link>
            )}
            <Button
              variant="ghost"
              onClick={logout}
              disabled={isLoading}
              className="text-retro-red border-retro-red/20 hover:bg-retro-red/10"
            >
              {isRtl ? 'خروج' : 'Log Out'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Profile card */}
          <div className="bg-retro-bg-card border border-retro-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-black text-retro-text pb-2 border-b border-retro-border">
              {isRtl ? 'بيانات الحساب' : 'Account Details'}
            </h2>
            <div className="space-y-1">
              <div className="text-xs text-retro-text-dim">{isRtl ? 'البريد الإلكتروني' : 'Email'}</div>
              <div className="text-sm font-semibold text-retro-text">{user.email}</div>
            </div>
            {user.phone && (
              <div className="space-y-1">
                <div className="text-xs text-retro-text-dim">{isRtl ? 'رقم الهاتف' : 'Phone'}</div>
                <div className="text-sm font-semibold text-retro-text">{user.phone}</div>
              </div>
            )}
            <div className="space-y-1">
              <div className="text-xs text-retro-text-dim">{isRtl ? 'مستوى العضوية' : 'Membership Level'}</div>
              <div className="text-sm font-semibold text-retro-cyan">{user.membershipLevel || 'Bronze'}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-retro-text-dim">{isRtl ? 'تاريخ التسجيل' : 'Member Since'}</div>
              <div className="text-sm font-semibold text-retro-text">{formattedMemberDate}</div>
            </div>
          </div>

          {/* Orders card */}
          <div className="lg:col-span-2 bg-retro-bg-card border border-retro-border rounded-2xl p-6">
            <h2 className="text-lg font-black text-retro-text pb-4 border-b border-retro-border mb-6">
              {isRtl ? 'الطلبات السابقة' : 'Order History'}
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-retro-border bg-retro-bg-input flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="text-xs text-retro-text-dim">Order #RT-ORD-998124</div>
                  <div className="text-sm font-black text-retro-cyan mt-1">
                    {isRtl ? 'جاهز للاستلام (صيانة جهاز PS5)' : 'Ready for pickup (PS5 Maintenance)'}
                  </div>
                </div>
                <div className="sm:text-end">
                  <div className="text-xs text-retro-text-dim">{isRtl ? 'التاريخ' : 'Date'}</div>
                  <div className="text-sm font-semibold text-retro-text">12/08/2026</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-retro-border bg-retro-bg-input flex flex-col sm:flex-row justify-between sm:items-center gap-4 opacity-70">
                <div>
                  <div className="text-xs text-retro-text-dim">Order #RT-ORD-771654</div>
                  <div className="text-sm font-black text-green-500 mt-1">
                    {isRtl ? 'تم التوصيل (شراء قطع غيار)' : 'Delivered (PC Hardware Parts)'}
                  </div>
                </div>
                <div className="sm:text-end">
                  <div className="text-xs text-retro-text-dim">{isRtl ? 'التاريخ' : 'Date'}</div>
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
