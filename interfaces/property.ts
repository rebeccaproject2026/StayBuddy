import { Types } from 'mongoose';

export interface IProperty {
  country: string;
  title: string;
  location: string;
  fullAddress: string;
  pincode: string;
  landmark: string;
  googleMapLink: string;
  price: number;
  deposit: number;
  rooms: number;
  bathrooms: number;
  area: number;
  propertyType: 'PG' | 'Tenant';
  category: string;
  rentalPeriod: string;
  availableFrom: string;
  images: string[];
  // PG-specific fields
    pgFor?: string;
    preferredTenants?: string;
  operationalSince?: string;
  pgPresentIn?: string;
  pgName?: string;
  selectedRoomCategories?: string[];
  roomDetails?: Record<string, {
    numberOfRooms: string;
    monthlyRent: string;
    securityDeposit: string;
    facilities: string[];
  }>;
  preferredGender?: string;
  tenantPreference?: string;
  pgRules?: string[];
  noticePeriod?: string;
  gateClosingTime?: string;
  // services?: string[]; // Removed duplicate, keep only Record<string, string>
  foodProvided?: boolean;
  meals?: string[];
  vegNonVeg?: string;
  foodCharges?: string;
  commonAmenities?: string[];
  parkingAvailable?: boolean;
  parkingType?: string;
  // Tenant-specific fields
  flatsInProject?: string;
  bedrooms?: string;
  balcony?: string;
  totalFloors?: string;
  floorNumber?: string;
  furnishing?: string[];
  areaMin?: string;
  areaMax?: string;
  societyName?: string;
  monthlyRentAmount?: string;
  securityAmount?: string;
  maintenanceCharges?: string;
  maintenanceType?: string;
  availableDate?: string;
  additionalRooms?: string[];
  overlooking?: string[];
  facing?: string;
  societyAmenities?: string[];
  tenantsPrefer?: string[];
  localityDescription?: string;
  // Common fields
  uspCategory?: string;
  uspText?: string;
  pgDescription?: string;
  // Images
    roomsAvailability?: Array<{ id: string; name: string; status: string; image: string }>;
    amenities?: string[];
    rules?: Record<string, string>;
    services?: Record<string, string>;
    landlord?: { name: string; phone: string; email: string };
    priceStatus?: string;
    isNew?: boolean;
    view360Available?: boolean;
  roomImages?: Array<{ id: string; name: string; status?: 'vacant' | 'occupied'; image?: string }>;
  kitchenImages?: string[];
  washroomImages?: string[];
  commonAreaImages?: string[];
  tenantRoomImages?: Array<{ id: string; name: string; image?: string }>;
  tenantKitchenImages?: string[];
  tenantWashroomImages?: string[];
  tenantCommonAreaImages?: string[];
  view360Url?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
