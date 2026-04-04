"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { tokenKey, userKey, countryFromPath, getToken, setToken as storeToken, removeToken } from '@/lib/token-storage';

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: 'renter' | 'landlord' | 'admin';
  country: 'fr' | 'in';
  isVerified: boolean;
  profileImage?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  initialized: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, country?: string) => Promise<boolean>;
  googleLogin: (role: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  const isAuthenticated = !!user && !!token;
  // Track whether the initial localStorage read has completed
  const [initialized, setInitialized] = useState(false);

  // Sync from localStorage immediately after mount (avoids hydration mismatch)
  useEffect(() => {
    const country = countryFromPath();
    const storedToken = localStorage.getItem(tokenKey(country));
    const storedUser = localStorage.getItem(userKey(country));
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem(tokenKey(country));
        localStorage.removeItem(userKey(country));
      }
    }
    // Mark as initialized and unblock loading in one go
    setInitialized(true);
    setIsLoading(false);
  }, []);

  // Handle NextAuth session (Google login only)
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated' && session?.user) {
      const nextAuthUser: User = {
        id: session.user.id,
        fullName: session.user.name || '',
        email: session.user.email || '',
        role: session.user.role as 'renter' | 'landlord' | 'admin',
        country: (session.user.country as 'fr' | 'in') || 'in',
        isVerified: true,
        profileImage: session.user.profileImage || session.user.image || undefined,
        createdAt: new Date().toISOString(),
      };
      setUser(nextAuthUser);
      setToken('nextauth');
      setIsLoading(false);

      // Fetch full profile to check if phone number is missing
      fetch('/api/auth/me', { credentials: 'include' })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (!data?.user) return;
          const hasPhone = !!data.user.phoneNumber;
          const toastKey = `phone_toast_${session.user.id}`;
          if (!hasPhone && !sessionStorage.getItem(toastKey)) {
            sessionStorage.setItem(toastKey, '1');
            setTimeout(() => {
              toast('📱 Add your mobile number in Profile for better contact.', {
                duration: 6000,
                position: 'top-center',
                style: { background: '#1d4ed8', color: 'white', fontWeight: '500', maxWidth: '380px' },
                icon: '👤',
              });
            }, 1500);
          }
        })
        .catch(() => {});
    }
    // Note: 'unauthenticated' status is intentionally ignored here —
    // custom JWT auth (admin/landlord/renter) is handled via localStorage only.
  }, [session, status]);

  const googleLogin = async (role: string) => {
    try {
      // Extract country from current URL path (e.g. /fr/login → fr)
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const country = ['fr', 'in'].includes(pathParts[0]) ? pathParts[0] : 'in';
      // Store country and role in cookies so the server-side signIn callback can read them
      document.cookie = `pending_country=${country}; path=/; max-age=300; SameSite=Lax`;
      document.cookie = `pending_role=${role}; path=/; max-age=300; SameSite=Lax`;
      await nextAuthSignIn('google', { callbackUrl: `/${country}` });
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed', {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const login = async (email: string, password: string, country?: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, country: country || 'in' }),
      });

      const result = await response.json();

      if (response.ok) {
        const { user: userData, token: userToken } = result;
        setUser(userData);
        setToken(userToken);
        const c = country || userData.country || 'in';
        storeToken(c, userToken);
        localStorage.setItem(userKey(c), JSON.stringify(userData));

        toast.success('Login successful!', {
          duration: 3000,
          position: 'top-center',
          style: { background: '#10B981', color: 'white', fontWeight: '500' },
        });

        return true;
      } else {
        // Handle unverified user — redirect to OTP page with country
        if (result.unverified && result.email) {
          toast.error('Please verify your email first.', {
            duration: 4000,
            position: 'top-center',
          });
          const c = country || 'in';
          router.push(`/${c}/verify-otp?email=${encodeURIComponent(result.email)}`);
          return false;
        }

        toast.error(result.error || 'Login failed', {
          duration: 4000,
          position: 'top-center',
          style: { background: '#EF4444', color: 'white', fontWeight: '500' },
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Connection error. Please try again.', {
        duration: 4000,
        position: 'top-center',
        style: { background: '#EF4444', color: 'white', fontWeight: '500' },
      });
      return false;
    }
  };

  const logout = () => {
    const userCountry = user?.country || 'in';
    const isNextAuth = token === 'nextauth';

    // Clear state
    setUser(null);
    setToken(null);

    // Clear localStorage
    removeToken(userCountry);

    toast.success('Logged out successfully', {
      duration: 2000,
      position: 'top-center',
    });

    if (isNextAuth) {
      // NextAuth session — signOut handles redirect
      nextAuthSignOut({ callbackUrl: `/${userCountry}` });
    } else {
      // Credentials session — redirect manually
      router.push(`/${userCountry}`);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem(userKey(updatedUser.country), JSON.stringify(updatedUser));
    } else {
      setUser(userData as User);
      const c = (userData as User).country || countryFromPath();
      localStorage.setItem(userKey(c), JSON.stringify(userData));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    initialized,
    isAuthenticated,
    login,
    googleLogin,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};