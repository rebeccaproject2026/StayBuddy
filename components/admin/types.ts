export interface PropertyOwner {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface AdminProperty {
  pgName: string;
  _id: string;
  title: string;
  societyName?: string;
  propertyType: "PG" | "Tenant";
  country: string;
  location: string;
  areaName?: string;
  state?: string;
  price: number;
  deposit?: number;
  rooms: number;
  bathrooms?: number;
  area?: number;
  images: string[];
  isVerified?: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  pgDescription?: string;
  localityDescription?: string;
  fullAddress?: string;
  pincode?: string;
  landmark?: string;
  category?: string;
  posterType?: string;
  pgFor?: string;
  preferredGender?: string;
  availableFrom?: string;
  rentalPeriod?: string;
  furnishing?: string[];
  facing?: string;
  totalFloors?: number;
  floorNumber?: number;
  maintenanceCharges?: number;
  maintenanceType?: string;
  flatsInProject?: string;
  balcony?: string;
  areaMin?: string;
  areaMax?: string;
  additionalRooms?: string[];
  overlooking?: string[];
  tenantsPrefer?: string[];
  commonAmenities?: string[];
  societyAmenities?: string[];
  pgRules?: string[];
  rules?: Record<string, string>;
  services?: string[] | Record<string, string>;
  nearbyPlaces?: Array<{ name: string; distance?: string } | string>;
  verificationImages?: string[];
  roomDetails?: Record<string, { totalBeds?: number; availableBeds?: number; totalRooms?: number; availableRooms?: number; monthlyRent: number; securityDeposit?: number; facilities?: string[] }>;
  roomImages?: Array<{ id: string; name: string; status?: string; image?: string }>;
  tenantRooms?: Array<{ id: string; name: string; status: string; rent: string; maxPersons?: string; currentPersons?: string }>;
  bhk?: string;
  latitude?: string;
  longitude?: string;
  createdAt: string;
  createdBy: string | PropertyOwner;
}

export interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: 'renter' | 'landlord' | 'admin';
  country: string;
  isVerified: boolean;
  isBlocked: boolean;
  provider: string;
  createdAt: string;
}

export interface AdminStats {
  totalListings: number;
  verifiedListings: number;
  totalUsers: number;
  owners: number;
  tenants: number;
  pendingReports: number;
  pendingRequests: number;
}

export interface AdminContent {
  dashboard: string;
  listingsManagement: string;
  userManagement: string;
  reportsModeration: string;
  logout: string;
  totalListings: string;
  pendingListings: string;
  approvedListings: string;
  totalUsers: string;
  owners: string;
  tenants: string;
  pendingReports: string;
  all: string;
  pending: string;
  approved: string;
  rejected: string;
  approve: string;
  reject: string;
  edit: string;
  delete: string;
  view: string;
  ownerName: string;
  submittedDate: string;
  status: string;
  noListings: string;
  name: string;
  email: string;
  role: string;
  verified: string;
  active: string;
  banned: string;
  ban: string;
  unban: string;
  verify: string;
  noUsers: string;
  reportedBy: string;
  reason: string;
  date: string;
  reviewed: string;
  markReviewed: string;
  viewDetails: string;
  noReports: string;
  listingName: string;
  description: string;
  location: string;
  rent: string;
  rooms: string;
  type: string;
}
