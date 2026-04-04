import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supportedCountries = ['in', 'fr', 'us', 'uk'];
const defaultCountry = 'in';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude static files, API routes, images, etc.
  if (
    pathname.includes('.') || 
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/')
  ) {
    return NextResponse.next();
  }

  // Block direct access to /dashboard/admin — must go through /{country}/dashboard/admin
  // and must have a valid admin token stored in cookies/localStorage (checked client-side)
  // Here we block the raw path without country prefix
  if (pathname === '/dashboard/admin' || pathname.startsWith('/dashboard/admin/')) {
    return NextResponse.redirect(new URL(`/${defaultCountry}`, request.url));
  }

  // Check if the current path already starts with a supported country
  const pathnameHasCountry = supportedCountries.some(
    (country) => pathname.startsWith(`/${country}/`) || pathname === `/${country}`
  );

  if (pathnameHasCountry) {
    // Protect /{country}/dashboard/admin — redirect non-admins to home
    // We check the staybuddy_token cookie; if missing, redirect to home
    const isAdminPath = supportedCountries.some(
      (c) => pathname.startsWith(`/${c}/dashboard/admin`)
    );

    if (isAdminPath) {
      const country = pathname.split('/')[1] || defaultCountry;
      // Check generic cookie (set on admin login) or country-namespaced variants
      const token =
        request.cookies.get('staybuddy_token')?.value ||
        request.cookies.get(`staybuddy_token_${country}`)?.value;
      if (!token) {
        // No token cookie — redirect to admin login
        return NextResponse.redirect(new URL(`/${country}/control/login`, request.url));
      }
    }

    return NextResponse.next();
  }

  // If no country is present, redirect to the default country's equivalent route
  const redirectUrl = new URL(`/${defaultCountry}${pathname === '/' ? '' : pathname}`, request.url);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
