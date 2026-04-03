import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  country: string;
  title: string;
  location: string;
  fullAddress: string;
  areaName?: string;
  state?: string;
  pincode: string;
  landmark: string;
  googleMapLink?: string;
  latitude?: string;
  longitude?: string;
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
    totalBeds: string;
    availableBeds: string;
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
  bhk?: string;
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
  nearbyPlaces?: { name: string; distance: string }[];
  // Common fields
  uspCategory?: string;
  uspText?: string;
  pgDescription?: string;
  // Images
    roomsAvailability?: Array<{ id: string; name: string; status: string; image: string }>;
    rules?: Record<string, string>;
    services?: Record<string, string>;
    landlord?: { name: string; phone: string; email: string };
    priceStatus?: string;
    isNew: boolean;
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
  verificationImages?: string[];
  isVerified?: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema = new Schema<IProperty>({
    pgFor: { type: String },
    preferredTenants: { type: String },
    roomsAvailability: [{ id: String, name: String, status: String, image: String }],
    rules: { type: Object },
    services: { type: Schema.Types.Mixed },
    landlord: { name: String, phone: String, email: String },
    priceStatus: { type: String },
    view360Available: { type: Boolean },
  // isNew is a Mongoose Document property, not a schema field
  country: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  fullAddress: { type: String, required: true },
  areaName: { type: String },
  state: { type: String },
  pincode: { type: String, required: true },
  landmark: { type: String, required: true },
  googleMapLink: { type: String },
  latitude: { type: String },
  longitude: { type: String },
  price: { type: Number, required: true },
  deposit: { type: Number, required: true },
  rooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true },
  propertyType: { type: String, enum: ['PG', 'Tenant'], required: true },
  category: { type: String, required: true },
  rentalPeriod: { type: String, required: true },
  availableFrom: { type: String, required: true },
  images: [{ type: String, required: true }],
  operationalSince: { type: String },
  pgPresentIn: { type: String },
  pgName: { type: String },
  selectedRoomCategories: [{ type: String }],
  roomDetails: { type: Object },
  preferredGender: { type: String },
  tenantPreference: { type: String },
  pgRules: [{ type: String }], // Only one definition, remove any duplicate
  noticePeriod: { type: String },
  gateClosingTime: { type: String },
  // services: [{ type: String }], // Removed duplicate, keep only Object
  foodProvided: { type: Boolean },
  meals: [{ type: String }],
  vegNonVeg: { type: String },
  foodCharges: { type: String },
  commonAmenities: [{ type: String }],
  parkingAvailable: { type: Boolean },
  parkingType: { type: String },
  flatsInProject: { type: String },
  bhk: { type: String },
  bedrooms: { type: String },
  balcony: { type: String },
  totalFloors: { type: String },
  floorNumber: { type: String },
  furnishing: [{ type: String }],
  areaMin: { type: String },
  areaMax: { type: String },
  societyName: { type: String },
  monthlyRentAmount: { type: String },
  securityAmount: { type: String },
  maintenanceCharges: { type: String },
  maintenanceType: { type: String },
  availableDate: { type: String },
  additionalRooms: [{ type: String }],
  overlooking: [{ type: String }],
  facing: { type: String },
  societyAmenities: [{ type: String }],
  tenantsPrefer: [{ type: String }],
  localityDescription: { type: String },
  nearbyPlaces: [{ name: String, distance: String }],
  uspCategory: { type: String },
  uspText: { type: String },
  pgDescription: { type: String },
  roomImages: [{ id: String, name: String, status: String, image: String }],
  kitchenImages: [{ type: String }],
  washroomImages: [{ type: String }],
  commonAreaImages: [{ type: String }],
  tenantRoomImages: [{ id: String, name: String, image: String }],
  tenantKitchenImages: [{ type: String }],
  tenantWashroomImages: [{ type: String }],
  tenantCommonAreaImages: [{ type: String }],
  view360Url: { type: String },
  verificationImages: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Force re-register if schema is missing new fields (handles Next.js hot-reload cache)
if (mongoose.models.Property) {
  delete (mongoose.models as any).Property;
}

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
