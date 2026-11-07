// RETRO Qatar — Proxy (Locale Routing + Supabase Auth Session Refresh + Protected Routes)
// Next.js 16 uses proxy.ts instead of middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip internal paths, static assets, auth callbacks, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.includes('.') // Static files like .png, .ico, .json, .jpg
  ) {
    return;
  }

  // 2. Refresh Supabase Auth Session & Cookies
  const { supabaseResponse, user } = await updateSession(request);

  // 3. Check if pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 4. Redirect to locale-prefixed route if missing locale
  if (!pathnameHasLocale) {
    const acceptLanguage = request.headers.get('accept-language') || '';
    const preferredLocale = acceptLanguage.includes('ar') ? 'ar' : defaultLocale;

    request.nextUrl.pathname = `/${preferredLocale}${pathname}`;
    const redirectResponse = NextResponse.redirect(request.nextUrl);

    // Copy refreshed cookies & cache headers onto redirect response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    for (const header of ['cache-control', 'expires', 'pragma']) {
      const value = supabaseResponse.headers.get(header);
      if (value) redirectResponse.headers.set(header, value);
    }
    return redirectResponse;
  }

  // 5. Protected Routes Context Enrichment
  if (user) {
    supabaseResponse.headers.set('x-user-id', user.id);
    supabaseResponse.headers.set('x-user-email', user.email || '');
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Match all paths except internal ones
    '/((?!_next/static|_next/image|favicon.ico|logo-en.png|logo-ar.png|media|manifest.json|.*\\.svg$).*)',
  ],
};
