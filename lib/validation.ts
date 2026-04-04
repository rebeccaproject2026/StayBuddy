import { z } from 'zod';

// Signup validation schema
export const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  confirmPassword: z.string(),
  role: z.enum(['renter', 'landlord'], {
    message: 'Role must be either renter or landlord',
  }),
  country: z.enum(['fr', 'in'], {
    message: 'Country must be either fr or in',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Password is required'),
  country: z.enum(['fr', 'in']).optional(),
});

// Admin login validation schema
export const adminLoginSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Password is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// ─── Property Validation ────────────────────────────────────────────────────

const roomDetailSchema = z.object({
  totalBeds: z.string().min(1, 'Total beds is required'),
  availableBeds: z.string().min(1, 'Available beds is required'),
  monthlyRent: z.string().min(1, 'Monthly rent is required'),
  securityDeposit: z.string().min(1, 'Security deposit is required'),
  facilities: z.array(z.string()).default([]),
});

const roomImageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Room name is required'),
  status: z.enum(['vacant', 'occupied']).optional(),
  image: z.string().optional(),
});

const tenantRoomImageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Room name is required'),
  image: z.string().optional(),
});

const tenantRoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['Available', 'Occupied', 'Partial']),
  rent: z.string(),
  maxPersons: z.string().optional(),
  currentPersons: z.string().optional(),
});

export const propertySchema = z.object({
  // ── Core fields (always required) ──────────────────────────────────────────
  country: z.enum(['fr', 'in'], { message: 'Country must be fr or in' }),
  propertyType: z.enum(['PG', 'Tenant'], { message: 'Property type must be PG or Tenant' }),
  posterType: z.enum(['Owner', 'Property Manager', 'Agent'], {
    message: 'Poster type must be Owner, Property Manager, or Agent',
  }),

  // ── Location (always required) ─────────────────────────────────────────────
  location: z.string().min(2, 'Location is required').trim(),
  fullAddress: z.string().min(5, 'Full address is required').trim(),
  areaName: z.string().min(1, 'Area / locality is required').trim(),
  state: z.string().min(1, 'State is required').trim(),
  pincode: z.string().min(1, 'Pincode is required').trim(),
  landmark: z.string().min(2, 'Landmark is required').trim(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),

  // ── Pricing (always required) ──────────────────────────────────────────────
  price: z.number({ error: 'Price must be a number' }).min(0, 'Price cannot be negative'),
  deposit: z.number({ error: 'Deposit must be a number' }).min(0, 'Deposit cannot be negative'),

  // ── Property dimensions (always required) ──────────────────────────────────
  rooms: z.number({ error: 'Rooms must be a number' }).int().min(0),
  bathrooms: z.number({ error: 'Bathrooms must be a number' }).int().min(0),
  area: z.number({ error: 'Area must be a number' }).min(0, 'Area cannot be negative'),

  // ── Listing meta ───────────────────────────────────────────────────────────
  title: z.string().min(5, 'Title must be at least 5 characters').max(150).trim(),
  category: z.string().min(1, 'Category is required'),
  rentalPeriod: z.string().min(1, 'Rental period is required'),
  availableFrom: z.string().min(1, 'Available from is required'),
  images: z.array(z.string().min(1)).min(1, 'At least one image is required'),

  // ── PG-specific (required when propertyType === 'PG') ──────────────────────
  operationalSince: z.string().optional(),
  pgPresentIn: z.string().optional(),
  pgName: z.string().optional(),
  pgFor: z.string().optional(),
  preferredGender: z.enum(['Male', 'Female', 'Both']).optional().nullable(),
  tenantPreference: z.enum(['Professionals', 'Students', 'Both']).optional().nullable(),
  selectedRoomCategories: z.array(z.string()).optional(),
  roomDetails: z.record(z.string(), roomDetailSchema).optional(),
  pgRules: z.array(z.string()).optional(),
  noticePeriod: z.string().optional(),
  gateClosingTime: z.string().optional(),
  foodProvided: z.boolean().optional(),
  meals: z.array(z.string()).optional(),
  vegNonVeg: z.string().optional(),
  foodCharges: z.string().optional(),
  commonAmenities: z.array(z.string()).optional(),
  parkingAvailable: z.boolean().optional(),
  parkingType: z.string().optional(),

  // ── Tenant-specific (required when propertyType === 'Tenant') ──────────────
  flatsInProject: z.string().optional(),
  bhk: z.string().optional(),
  tenantRooms: z.array(tenantRoomSchema).optional(),
  balcony: z.string().optional(),
  totalFloors: z.string().optional(),
  floorNumber: z.string().optional(),
  furnishing: z.array(z.string()).optional(),
  areaMin: z.string().optional(),
  areaMax: z.string().optional(),
  societyName: z.string().optional(),
  monthlyRentAmount: z.string().optional(),
  securityAmount: z.string().optional(),
  maintenanceCharges: z.string().optional(),
  maintenanceType: z.string().optional(),
  availableDate: z.string().optional(),
  additionalRooms: z.array(z.string()).optional(),
  overlooking: z.array(z.string()).optional(),
  facing: z.string().optional(),
  societyAmenities: z.array(z.string()).optional(),
  tenantsPrefer: z.array(z.string()).optional(),
  localityDescription: z.string().optional(),
  nearbyPlaces: z.array(z.object({ name: z.string(), distance: z.string() })).optional(),
  preferredTenants: z.string().optional(),

  // ── Description & USP ─────────────────────────────────────────────────────
  uspCategory: z.string().optional(),
  uspText: z.string().max(500, 'USP cannot exceed 500 characters').optional(),
  pgDescription: z.string().min(10, 'Description must be at least 10 characters').max(2000),

  // ── Images (structured) ───────────────────────────────────────────────────
  roomImages: z.array(roomImageSchema).optional(),
  kitchenImages: z.array(z.string()).optional(),
  washroomImages: z.array(z.string()).optional(),
  commonAreaImages: z.array(z.string()).optional(),
  tenantRoomImages: z.array(tenantRoomImageSchema).optional(),
  tenantKitchenImages: z.array(z.string()).optional(),
  tenantWashroomImages: z.array(z.string()).optional(),
  tenantCommonAreaImages: z.array(z.string()).optional(),
  view360Url: z.string().optional().or(z.literal('')),
  verificationImages: z.array(z.string()).optional(),

  // ── Misc ──────────────────────────────────────────────────────────────────
  rules: z.record(z.string(), z.string()).optional(),
  services: z.union([z.array(z.string()), z.record(z.string(), z.string())]).optional(),
  priceStatus: z.enum(['below average', 'average', 'above average']).optional(),
  isNew: z.boolean().optional().default(false),
  view360Available: z.boolean().optional(),
})
// ── Conditional PG validations ──────────────────────────────────────────────
.superRefine((data, ctx) => {
  // Pincode: 6 digits for India, 5 digits for France
  const pincodePattern = data.country === 'fr' ? /^\d{5}$/ : /^\d{6}$/;
  const pincodeMsg = data.country === 'fr'
    ? 'Pincode must be exactly 5 digits for France'
    : 'Pincode must be exactly 6 digits for India';
  if (!pincodePattern.test(data.pincode)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: pincodeMsg, path: ['pincode'] });
  }

  if (data.propertyType === 'PG') {
    if (!data.operationalSince?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Operational since is required for PG', path: ['operationalSince'] });
    }
    if (!data.pgPresentIn?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'PG present in is required', path: ['pgPresentIn'] });
    }
    if (!data.pgName?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'PG name is required', path: ['pgName'] });
    }
    if (!data.preferredGender) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Preferred gender is required for PG', path: ['preferredGender'] });
    }
    if (!data.tenantPreference) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Tenant preference is required for PG', path: ['tenantPreference'] });
    }
    if (!data.selectedRoomCategories || data.selectedRoomCategories.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'At least one room category is required', path: ['selectedRoomCategories'] });
    }
    if (data.selectedRoomCategories && data.roomDetails) {
      for (const cat of data.selectedRoomCategories) {
        const detail = data.roomDetails[cat];
        if (!detail?.totalBeds || !detail?.monthlyRent || !detail?.securityDeposit) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Room details for ${cat} are incomplete`, path: ['roomDetails'] });
        }
      }
    }
  }
})
// ── Conditional Tenant validations ──────────────────────────────────────────
.superRefine((data, ctx) => {
  if (data.propertyType === 'Tenant') {
    if (!data.flatsInProject) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Number of flats in project is required', path: ['flatsInProject'] });
    }
    if (!data.bhk) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'BHK type is required', path: ['bhk'] });
    }
    if (!data.totalFloors) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Total floors is required', path: ['totalFloors'] });
    }
    if (!data.floorNumber) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Floor number is required', path: ['floorNumber'] });
    }
    if (!data.societyName?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Society name is required', path: ['societyName'] });
    }
    // Monthly rent required only for India (France uses per-room rent from tenantRooms)
    if (data.country !== 'fr' && !data.monthlyRentAmount?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Monthly rent amount is required', path: ['monthlyRentAmount'] });
    }
  }
});

export type PropertyInput = z.infer<typeof propertySchema>;
