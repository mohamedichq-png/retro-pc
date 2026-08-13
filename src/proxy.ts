// RETRO Qatar — Proxy (Locale Routing)
// Next.js 16 uses proxy.ts instead of middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths, static assets, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Static files like .png, .ico, .json
  ) {
    return;
  }

  // Check if the pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Detect preferred locale from Accept-Language header or default
  const acceptLanguage = request.headers.get('accept-language') || '';
  const preferredLocale = acceptLanguage.includes('ar') ? 'ar' : defaultLocale;

  // Redirect to locale-prefixed path
  request.nextUrl.pathname = `/${preferredLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Match all paths except internal ones
    '/((?!_next/static|_next/image|favicon.ico|logo-en.png|logo-ar.png|media|manifest.json|.*\\.svg$).*)',
  ],
};
