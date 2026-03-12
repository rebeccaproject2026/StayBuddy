export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: 'renter' | 'landlord' | 'admin';
  country: 'fr' | 'in';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  fullName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
  role: 'renter' | 'landlord';
  country: 'fr' | 'in';
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'renter' | 'landlord' | 'admin';
  country: 'fr' | 'in';
  iat?: number;
  exp?: number;
}