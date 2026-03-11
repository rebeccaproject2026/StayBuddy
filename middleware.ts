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

  // Check if the current path already starts with a supported country
  const pathnameHasCountry = supportedCountries.some(
    (country) => pathname.startsWith(`/${country}/`) || pathname === `/${country}`
  );

  if (pathnameHasCountry) {
    return NextResponse.next();
  }

  // If no country is present, redirect to the default country's equivalent route
  // e.g., /properties -> /in/properties
  const redirectUrl = new URL(`/${defaultCountry}${pathname === '/' ? '' : pathname}`, request.url);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  // Only match routes that are actual application paths to avoid middleware running on statics unnecessarily
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
