/**
 * Country-namespaced token storage.
 * Prevents token collision when two tabs are open for different countries
 * (e.g. /in and /fr) in the same browser sharing the same localStorage origin.
 */

export function tokenKey(country?: string | null): string {
  const c = country === 'fr' ? 'fr' : 'in';
  return `staybuddy_token_${c}`;
}

export function userKey(country?: string | null): string {
  const c = country === 'fr' ? 'fr' : 'in';
  return `staybuddy_user_${c}`;
}

/** Derive country from the current URL path (e.g. /fr/dashboard → 'fr') */
export function countryFromPath(): string {
  if (typeof window === 'undefined') return 'in';
  const first = window.location.pathname.split('/').filter(Boolean)[0];
  return first === 'fr' ? 'fr' : 'in';
}

/** Read the token for the current tab's country */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(tokenKey(countryFromPath()));
}

/** Write the token for a specific country */
export function setToken(country: string, value: string): void {
  localStorage.setItem(tokenKey(country), value);
}

/** Remove the token for a specific country */
export function removeToken(country: string): void {
  localStorage.removeItem(tokenKey(country));
  localStorage.removeItem(userKey(country));
}
