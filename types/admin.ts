export interface AdminStats {
  totalUsers: number;
  recentUsersCount: number;
  roleStats: {
    renter: number;
    landlord: number;
    admin: number;
  };
  countryStats: {
    fr: number;
    in: number;
  };
  verificationStats: {
    verified: number;
    unverified: number;
  };
}

export interface UserListResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UpdateUserData {
  fullName?: string;
  phoneNumber?: string;
  role?: 'renter' | 'landlord' | 'admin';
  country?: 'fr' | 'in';
  isVerified?: boolean;
}

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