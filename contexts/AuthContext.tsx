"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: 'renter' | 'landlord' | 'admin';
  country: 'fr' | 'in';
  isVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
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

  const isAuthenticated = !!user && !!token;

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = localStorage.getItem('staybuddy_token');
        const storedUser = localStorage.getItem('staybuddy_user');

        console.log('AuthContext - Loading user data on mount');
        console.log('AuthContext - Stored token exists:', !!storedToken);
        console.log('AuthContext - Stored user exists:', !!storedUser);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          console.log('AuthContext - Verifying token with /api/auth/me');

          // Verify token is still valid
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });

          console.log('AuthContext - Token verification response status:', response.status);

          if (!response.ok) {
            console.log('AuthContext - Token invalid, clearing storage');
            // Token is invalid, clear storage
            localStorage.removeItem('staybuddy_token');
            localStorage.removeItem('staybuddy_user');
            setToken(null);
            setUser(null);
          } else {
            const result = await response.json();
            console.log('AuthContext - Token valid, user data:', result.user);
            setUser(result.user);
          }
        } else {
          console.log('AuthContext - No stored token or user found');
        }
      } catch (error) {
        console.error('AuthContext - Error loading user data:', error);
        localStorage.removeItem('staybuddy_token');
        localStorage.removeItem('staybuddy_user');
        setToken(null);
        setUser(null);
      } finally {
        console.log('AuthContext - Setting isLoading to false');
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        const { user: userData, token: userToken } = result;
        
        // Store in state
        setUser(userData);
        setToken(userToken);
        
        // Store in localStorage
        localStorage.setItem('staybuddy_token', userToken);
        localStorage.setItem('staybuddy_user', JSON.stringify(userData));

        toast.success('Login successful!', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: 'white',
            fontWeight: '500',
          },
        });

        return true;
      } else {
        toast.error(result.error || 'Login failed', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: 'white',
            fontWeight: '500',
          },
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Connection error. Please try again.', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: 'white',
          fontWeight: '500',
        },
      });
      return false;
    }
  };

  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem('staybuddy_token');
    localStorage.removeItem('staybuddy_user');

    toast.success('Logged out successfully', {
      duration: 2000,
      position: 'top-center',
    });

    // Redirect to home page
    router.push('/');
  };

  const updateUser = (userData: Partial<User>) => {
    console.log('AuthContext - updateUser called with:', userData);
    if (user) {
      const updatedUser = { ...user, ...userData };
      console.log('AuthContext - Updating existing user:', updatedUser);
      setUser(updatedUser);
      localStorage.setItem('staybuddy_user', JSON.stringify(updatedUser));
    } else {
      // If no user exists, treat this as setting the initial user
      console.log('AuthContext - Setting initial user:', userData);
      setUser(userData as User);
      localStorage.setItem('staybuddy_user', JSON.stringify(userData));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};