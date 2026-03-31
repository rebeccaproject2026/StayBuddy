"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, X, MapPin, Check, ShieldCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import PGStep2Details from "@/components/post-property/PGStep2Details";
import TenantStep2Details from "@/components/post-property/TenantStep2Details";
import PGStep3Preferences from "@/components/post-property/PGStep3Preferences";
import TenantStep3Pricing from "@/components/post-property/TenantStep3Pricing";
import PGStep4Images from "@/components/post-property/PGStep4Images";
import TenantStep4Images from "@/components/post-property/TenantStep4Images";
import { getPostPropertyContent } from "@/lib/post-property-content";

type PropertyType = "PG" | "Tenant" | null;
type PosterType = "Owner" | "Property Manager" | "Agent" | null;
type PropertyCategory = "Villa" | "Flat" | "House" | "Penthouse" | null;
type PGPresentIn = "An Independent Building" | "An Independent Flats" | "Present In A Society" | null;
type RoomCategory = "Single" | "Double" | "Triple" | "Four" | "Other";
type RoomDetails = {
  totalBeds: string;
  availableBeds: string;
  monthlyRent: string;
  securityDeposit: string;
  facilities: string[];
};
type PreferredGender = "Male" | "Female" | "Both" | null;
type TenantPreference = "Professionals" | "Students" | "Both" | null;

export default function PostPropertyPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const country = (params?.country as string) || 'in';
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Step 1: Property Type & Basic Info
  const [propertyType, setPropertyType] = useState<PropertyType>(null);
  const [posterType, setPosterType] = useState<PosterType>(null);
  const [propertyCategory, setPropertyCategory] = useState<PropertyCategory>(null);
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Step 2: Property Details (PG)
  const [address, setAddress] = useState("");
  const [areaName, setAreaName] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [googleMapLink, setGoogleMapLink] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [nearbyPlaces, setNearbyPlaces] = useState<{ name: string; distance: string }[]>([]);
  const [nearbyPlaceInput, setNearbyPlaceInput] = useState("");
  const [nearbyDistanceInput, setNearbyDistanceInput] = useState("");
  const [operationalSince, setOperationalSince] = useState("");
  const [pgPresentIn, setPgPresentIn] = useState<PGPresentIn>(null);
  const [pgName, setPgName] = useState("");
  const [selectedRoomCategories, setSelectedRoomCategories] = useState<RoomCategory[]>([]);
  const [roomDetails, setRoomDetails] = useState<Record<RoomCategory, RoomDetails>>({
    Single: { totalBeds: "", availableBeds: "", monthlyRent: "", securityDeposit: "", facilities: [] },
    Double: { totalBeds: "", availableBeds: "", monthlyRent: "", securityDeposit: "", facilities: [] },
    Triple: { totalBeds: "", availableBeds: "", monthlyRent: "", securityDeposit: "", facilities: [] },
    Four:   { totalBeds: "", availableBeds: "", monthlyRent: "", securityDeposit: "", facilities: [] },
    Other:  { totalBeds: "", availableBeds: "", monthlyRent: "", securityDeposit: "", facilities: [] },
  });
  
  // Step 2: Property Details (Tenant)
  const [flatsInProject, setFlatsInProject] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [balcony, setBalcony] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [furnishing, setFurnishing] = useState<string[]>([]);
  const [areaMin, setAreaMin] = useState("");
  const [areaMax, setAreaMax] = useState("");
  const [societyName, setSocietyName] = useState("");
  
  // Step 3: Pricing & Preferences (PG)
  const [preferredGender, setPreferredGender] = useState<PreferredGender>(null);
  const [tenantPreference, setTenantPreference] = useState<TenantPreference>(null);
  const [pgRules, setPgRules] = useState<string[]>([]);
  const [noticePeriod, setNoticePeriod] = useState("");
  const [gateClosingTime, setGateClosingTime] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [foodProvided, setFoodProvided] = useState(false);
  const [meals, setMeals] = useState<string[]>([]);
  const [vegNonVeg, setVegNonVeg] = useState("");
  const [foodCharges, setFoodCharges] = useState("");
  const [commonAmenities, setCommonAmenities] = useState<string[]>([]);
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [parkingType, setParkingType] = useState("");
  
  // Step 3: Pricing & Preferences (Tenant)
  const [monthlyRentAmount, setMonthlyRentAmount] = useState("");
  const [securityAmount, setSecurityAmount] = useState("");
  const [maintenanceCharges, setMaintenanceCharges] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [availableFrom, setAvailableFrom] = useState("Immediately");
  const [availableDate, setAvailableDate] = useState("");
  const [additionalRooms, setAdditionalRooms] = useState<string[]>([]);
  const [overlooking, setOverlooking] = useState<string[]>([]);
  const [facing, setFacing] = useState("");
  const [societyAmenities, setSocietyAmenities] = useState<string[]>([]);
  const [tenantsPrefer, setTenantsPrefer] = useState<string[]>([]);
  const [localityDescription, setLocalityDescription] = useState("");
  
  // Step 4: Photos & Description
  const [uspCategory, setUspCategory] = useState("");
  const [uspText, setUspText] = useState("");
  const [pgDescription, setPgDescription] = useState("");
  
  // PG Room Images
  const [roomImages, setRoomImages] = useState<Array<{ id: string; name: string; file: File | null }>>([]);
  const [kitchenImages, setKitchenImages] = useState<File[]>([]);
  const [washroomImages, setWashroomImages] = useState<File[]>([]);
  const [commonAreaImages, setCommonAreaImages] = useState<File[]>([]);
  
  // Tenant Room Images (without status)
  const [tenantRoomImages, setTenantRoomImages] = useState<Array<{ id: string; name: string; file: File | null }>>([]);
  const [tenantKitchenImages, setTenantKitchenImages] = useState<File[]>([]);
  const [tenantWashroomImages, setTenantWashroomImages] = useState<File[]>([]);
  const [tenantCommonAreaImages, setTenantCommonAreaImages] = useState<File[]>([]);
  const [view360Url, setView360Url] = useState("");
  
  // Step 5: Verification Documents
  const [verificationImages, setVerificationImages] = useState<File[]>([]);

  const [error, setError] = useState("");

  // Per-field validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Yup schemas per step
  const step1Schema = yup.object({
    propertyType: yup.string().required("Please select a property type (PG or Tenant)"),
    posterType: yup.string().required("Please select how you are posting (Owner / Manager / Agent)"),
    propertyCategory: yup.string().when("propertyType", {
      is: "Tenant",
      then: (s) => s.required("Please select a property category"),
      otherwise: (s) => s.optional(),
    }),
    selectedCity: yup.string().required("Please select a city from the suggestions"),
  });

  const pincodeRule = yup
    .string()
    .trim()
    .required("Pincode is required")
    .matches(
      country === "fr" ? /^\d{5}$/ : /^\d{6}$/,
      country === "fr" ? "Pincode must be exactly 5 digits" : "Pincode must be exactly 6 digits"
    );

  const step2PGSchema = yup.object({
    address: yup.string().trim().required("Full address is required").min(5, "Address must be at least 5 characters"),
    areaName: yup.string().trim().required("Area / Locality is required"),
    state: yup.string().trim().required("State is required"),
    pincode: pincodeRule,
    landmark: yup.string().trim().required("Landmark is required").min(2, "Landmark must be at least 2 characters"),
    latitude: yup.string().trim().optional(),
    longitude: yup.string().trim().optional(),
    operationalSince: yup.string().trim().required("PG operational since is required"),
    pgPresentIn: yup.string().nullable().required("Please select where the PG is present"),
    pgName: yup.string().trim().required("PG name is required"),
    selectedRoomCategories: yup
      .array()
      .of(yup.string())
      .min(1, "Please select at least one room category"),
  });

  const step2TenantSchema = yup.object({
    address: yup.string().trim().required("Full address is required").min(5, "Address must be at least 5 characters"),
    areaName: yup.string().trim().required("Area / Locality is required"),
    state: yup.string().trim().required("State is required"),
    pincode: pincodeRule,
    landmark: yup.string().trim().required("Landmark is required").min(2, "Landmark must be at least 2 characters"),
    latitude: yup.string().trim().optional(),
    longitude: yup.string().trim().optional(),
    flatsInProject: yup.string().required("Please select number of flats in project"),
    bedrooms: yup.string().required("Please select number of bedrooms"),
    bathrooms: yup.string().required("Please select number of bathrooms"),
    totalFloors: yup.string().required("Please select total floors"),
    floorNumber: yup.string().required("Please select floor number"),
    societyName: yup.string().trim().required("Society name is required"),
  });

  const step3PGSchema = yup.object({
    preferredGender: yup.string().nullable().required("Please select preferred gender"),
    tenantPreference: yup.string().nullable().required("Please select tenant preference"),
  });

  const step3TenantSchema = yup.object({
    monthlyRentAmount: yup
      .string()
      .trim()
      .required("Monthly rent is required")
      .matches(/^\d+$/, "Monthly rent must be a valid number")
      .test("min", "Monthly rent must be greater than 0", (v) => parseInt(v || "0") > 0),
  });

  const step4Schema = yup.object({
    pgDescription: yup.string().trim().required("Property description is required").min(20, "Description must be at least 20 characters"),
  });

  const scrollToFirstError = (errors: Record<string, string>) => {
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;
    // Try data-field attribute first, then fall back to name/id attribute
    const el =
      document.querySelector(`[data-field="${firstKey}"]`) ||
      document.querySelector(`[name="${firstKey}"]`) ||
      document.getElementById(firstKey);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const validateStep = async (schema: yup.AnyObjectSchema, data: Record<string, any>): Promise<boolean> => {
    try {
      await schema.validate(data, { abortEarly: false });
      setFieldErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) errors[e.path] = e.message;
        });
        setFieldErrors(errors);
        // Small delay so React renders the error elements before we scroll
        setTimeout(() => scrollToFirstError(errors), 50);
      }
      return false;
    }
  };

  // Helper to render a field error
  const FieldError = ({ name }: { name: string }) =>
    fieldErrors[name] ? (
      <p className="text-red-500 text-xs mt-1" data-field={`${name}-error`}>{fieldErrors[name]}</p>
    ) : null;

  // Cities list based on country
  const indianCities = [
    "Ahmedabad, Gujarat",
    "Surat, Gujarat",
    "Vadodara, Gujarat",
    "Rajkot, Gujarat",
    "Gandhinagar, Gujarat",
    "Mumbai, Maharashtra",
    "Pune, Maharashtra",
    "Nagpur, Maharashtra",
    "Nashik, Maharashtra",
    "Delhi, Delhi",
    "Noida, Uttar Pradesh",
    "Gurgaon, Haryana",
    "Bengaluru, Karnataka",
    "Hyderabad, Telangana",
    "Chennai, Tamil Nadu",
    "Kolkata, West Bengal",
    "Jaipur, Rajasthan",
    "Lucknow, Uttar Pradesh",
    "Chandigarh, Punjab",
    "Indore, Madhya Pradesh",
  ];

  const frenchCities = [
    "Paris, Île-de-France",
    "Lyon, Auvergne-Rhône-Alpes",
    "Marseille, Provence-Alpes-Côte d'Azur",
    "Toulouse, Occitanie",
    "Nice, Provence-Alpes-Côte d'Azur",
    "Nantes, Pays de la Loire",
    "Strasbourg, Grand Est",
    "Montpellier, Occitanie",
    "Bordeaux, Nouvelle-Aquitaine",
    "Lille, Hauts-de-France",
    "Rennes, Bretagne",
    "Reims, Grand Est",
    "Le Havre, Normandie",
    "Saint-Étienne, Auvergne-Rhône-Alpes",
    "Toulon, Provence-Alpes-Côte d'Azur",
    "Grenoble, Auvergne-Rhône-Alpes",
    "Dijon, Bourgogne-Franche-Comté",
    "Angers, Pays de la Loire",
    "Nîmes, Occitanie",
    "Villeurbanne, Auvergne-Rhône-Alpes",
  ];

  const cities = country === "fr" ? frenchCities : indianCities;

  const t = getPostPropertyContent(user?.fullName?.split(' ')[0] || '')[language as 'en' | 'fr'] ?? getPostPropertyContent('').en;
  const filteredCities = cities.filter(c => 
    c.toLowerCase().includes(city.toLowerCase())
  );
  
  // Currency symbol based on country (direct — avoids hydration timing issues with LanguageContext)
  const { t: translate } = useLanguage();
  const currencySymbol = country === "fr" ? "€" : "₹";

  // Handler functions
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueStep1 = async () => {
    const valid = await validateStep(step1Schema, {
      propertyType,
      posterType,
      propertyCategory: propertyType === "Tenant" ? propertyCategory : "skip",
      selectedCity,
    });
    if (!valid) return;
    setError("");
    setStep(2);
    scrollToTop();
  };

  const handleContinueStep2 = async () => {
    if (propertyType === "PG") {
      const valid = await validateStep(step2PGSchema, {
        address,
        areaName,
        state,
        pincode,
        landmark,
        latitude,
        longitude,
        operationalSince,
        pgPresentIn,
        pgName,
        selectedRoomCategories,
      });
      if (!valid) return;
      // Validate room details for each selected category
      const roomErrors: Record<string, string> = {};
      for (const category of selectedRoomCategories) {
        const details = roomDetails[category];
        if (!details.totalBeds) roomErrors[`room_${category}_totalBeds`] = "Total beds is required";
        if (!details.availableBeds) roomErrors[`room_${category}_availableBeds`] = "Available beds is required";
        if (!details.monthlyRent) roomErrors[`room_${category}_monthlyRent`] = "Monthly rent is required";
        else if (parseInt(details.monthlyRent) <= 0) roomErrors[`room_${category}_monthlyRent`] = "Monthly rent must be greater than 0";
        if (!details.securityDeposit) roomErrors[`room_${category}_securityDeposit`] = "Security deposit is required";
      }
      if (Object.keys(roomErrors).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...roomErrors }));
        setTimeout(() => scrollToFirstError(roomErrors), 50);
        return;
      }
    } else if (propertyType === "Tenant") {
      const valid = await validateStep(step2TenantSchema, {
        address,
        areaName,
        state,
        pincode,
        landmark,
        latitude,
        longitude,
        flatsInProject,
        bedrooms,
        bathrooms,
        totalFloors,
        floorNumber,
        societyName,
      });
      if (!valid) return;
    }
    setError("");
    setStep(3);
    scrollToTop();
  };

  const handleContinueStep3 = async () => {
    if (propertyType === "PG") {
      const valid = await validateStep(step3PGSchema, { preferredGender, tenantPreference });
      if (!valid) return;
    } else if (propertyType === "Tenant") {
      const valid = await validateStep(step3TenantSchema, { monthlyRentAmount });
      if (!valid) return;
    }
    setError("");
    setStep(4);
    scrollToTop();
  };

  const handleContinueStep4 = async () => {
    const valid = await validateStep(step4Schema, { pgDescription });
    if (!valid) return;

    // Validate at least one room image with an actual file uploaded
    const hasRoomImage =
      propertyType === "PG"
        ? roomImages.some((r) => r.file !== null)
        : tenantRoomImages.some((r) => r.file !== null);

    if (!hasRoomImage) {
      setFieldErrors((prev) => ({
        ...prev,
        roomImages: "At least one room image is required",
      }));
      setTimeout(() => scrollToFirstError({ roomImages: "At least one room image is required" }), 50);
      return;
    }
    setError("");
    setStep(5);
    scrollToTop();
  };

  const handleSubmitStep5 = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      // Helper: convert File to base64 data URI
      const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      // Convert all image arrays to base64
      const mainImagesBase64 = await Promise.all(
        roomImages
          .filter((r) => r.file)
          .map((r) => toBase64(r.file!))
      );

      // We need at least one main image — use room images as main images for PG,
      // or tenant room images for Tenant
      const tenantRoomImagesBase64 = await Promise.all(
        tenantRoomImages
          .filter((r) => r.file)
          .map((r) => toBase64(r.file!))
      );

      const allMainImages =
        propertyType === 'PG' ? mainImagesBase64 : tenantRoomImagesBase64;

      const kitchenBase64 = await Promise.all(kitchenImages.map(toBase64));
      const washroomBase64 = await Promise.all(washroomImages.map(toBase64));
      const commonAreaBase64 = await Promise.all(commonAreaImages.map(toBase64));
      const tenantKitchenBase64 = await Promise.all(tenantKitchenImages.map(toBase64));
      const tenantWashroomBase64 = await Promise.all(tenantWashroomImages.map(toBase64));
      const tenantCommonAreaBase64 = await Promise.all(tenantCommonAreaImages.map(toBase64));

      const roomImagesPayload = await Promise.all(
        roomImages.map(async (r) => ({
          id: r.id,
          name: r.name,
          image: r.file ? await toBase64(r.file) : undefined,
        }))
      );

      const tenantRoomImagesPayload = await Promise.all(
        tenantRoomImages.map(async (r) => ({
          id: r.id,
          name: r.name,
          image: r.file ? await toBase64(r.file) : undefined,
        }))
      );

      // Build the first room's rent as the main price (for PG use lowest room rent)
      const firstRoomCategory = selectedRoomCategories[0];
      const pgPrice = firstRoomCategory
        ? parseFloat(roomDetails[firstRoomCategory].monthlyRent) || 0
        : 0;
      const pgDeposit = firstRoomCategory
        ? parseFloat(roomDetails[firstRoomCategory].securityDeposit) || 0
        : 0;

      const payload: Record<string, any> = {
        country,
        propertyType,
        posterType,
        location: selectedCity.split(',')[0] || selectedCity,
        fullAddress: address,
        areaName,
        state,
        pincode,
        landmark,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        title: propertyType === 'PG' ? pgName || `${selectedCity.split(',')[0]} PG` : `${propertyCategory} in ${selectedCity.split(',')[0]}`,
        category: propertyCategory || (propertyType === 'PG' ? 'PG' : 'Flat'),
        rentalPeriod: 'Monthly',
        availableFrom: availableFrom === 'Immediately' ? new Date().toISOString().split('T')[0] : availableDate,
        price: propertyType === 'PG' ? pgPrice : parseFloat(monthlyRentAmount) || 0,
        deposit: propertyType === 'PG' ? pgDeposit : parseFloat(securityAmount) || 0,
        rooms: propertyType === 'PG' ? selectedRoomCategories.length : parseInt(bedrooms) || 1,
        bathrooms: parseInt(bathrooms) || 0,
        area: propertyType === 'PG' ? 0 : (parseFloat(areaMin) || 0),
        pgDescription,
        uspCategory: uspCategory || undefined,
        uspText: uspText || undefined,
        images: allMainImages.length > 0 ? allMainImages : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400'],
        // Image arrays
        roomImages: roomImagesPayload,
        kitchenImages: kitchenBase64,
        washroomImages: washroomBase64,
        commonAreaImages: commonAreaBase64,
        tenantRoomImages: tenantRoomImagesPayload,
        tenantKitchenImages: tenantKitchenBase64,
        tenantWashroomImages: tenantWashroomBase64,
        tenantCommonAreaImages: tenantCommonAreaBase64,
        view360Url: view360Url || undefined,
        nearbyPlaces: nearbyPlaces.length > 0 ? nearbyPlaces : undefined,
        verificationImages: await Promise.all(verificationImages.map(toBase64)),
      };

      // PG-specific fields
      if (propertyType === 'PG') {
        // Only include roomDetails for selected categories — strip the rest
        const filteredRoomDetails: Record<string, any> = {};
        for (const cat of selectedRoomCategories) {
          filteredRoomDetails[cat] = roomDetails[cat];
        }

        Object.assign(payload, {
          operationalSince,
          pgPresentIn,
          pgName,
          pgFor: preferredGender,
          preferredGender,
          tenantPreference,
          selectedRoomCategories,
          roomDetails: filteredRoomDetails,
          pgRules,
          noticePeriod,
          gateClosingTime,
          services,
          foodProvided,
          meals,
          vegNonVeg,
          foodCharges,
          commonAmenities,
          parkingAvailable,
          parkingType,
        });
      }

      // Tenant-specific fields
      if (propertyType === 'Tenant') {
        Object.assign(payload, {
          flatsInProject,
          bedrooms,
          balcony,
          totalFloors,
          floorNumber,
          furnishing,
          areaMin,
          areaMax,
          societyName,
          monthlyRentAmount,
          securityAmount,
          maintenanceCharges,
          maintenanceType,
          availableDate,
          additionalRooms,
          overlooking,
          facing,
          societyAmenities,
          tenantsPrefer,
          localityDescription,
        });
      }

      const token = localStorage.getItem('staybuddy_token');

      // Strip null/undefined values so Zod optional() fields don't receive null
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== null && v !== undefined)
      );

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(cleanPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        const allErrors = data?.details?.map
          ? data.details.map((e: any) => `${e.field}: ${e.message}`).join('\n')
          : data?.details || data?.error || 'Failed to post property';
        console.error('Property POST errors:', JSON.stringify(data?.details, null, 2));
        setError(allErrors);
        setIsSubmitting(false);
        return;
      }

      toast.success('Property submitted for review!', {
        duration: 3000,
        position: 'top-center',
      });
      setStep(6);
      scrollToTop();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setFieldErrors({});
      scrollToTop();
    }
  };

  const handleCitySelect = (selectedCity: string) => {
    setSelectedCity(selectedCity);
    setCity(selectedCity.split(',')[0]);
    setShowSuggestions(false);
  };

  const toggleRoomCategory = (category: RoomCategory) => {
    setSelectedRoomCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleFacility = (category: RoomCategory, facility: string) => {
    setRoomDetails(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        facilities: prev[category].facilities.includes(facility)
          ? prev[category].facilities.filter(f => f !== facility)
          : [...prev[category].facilities, facility]
      }
    }));
  };

  const updateRoomDetail = (
    category: RoomCategory,
    field: keyof RoomDetails,
    value: string | string[]
  ) => {
    setRoomDetails(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const togglePGRule = (rule: string) => {
    setPgRules(prev => 
      prev.includes(rule) ? prev.filter(r => r !== rule) : [...prev, rule]
    );
  };

  const toggleService = (service: string) => {
    setServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const toggleMeal = (meal: string) => {
    setMeals(prev => 
      prev.includes(meal) ? prev.filter(m => m !== meal) : [...prev, meal]
    );
  };

  const toggleCommonAmenity = (amenity: string) => {
    setCommonAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleFurnishing = (item: string) => {
    setFurnishing(prev => 
      prev.includes(item) ? prev.filter(f => f !== item) : [...prev, item]
    );
  };

  const toggleAdditionalRoom = (room: string) => {
    setAdditionalRooms(prev => 
      prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]
    );
  };

  const toggleOverlooking = (item: string) => {
    setOverlooking(prev => 
      prev.includes(item) ? prev.filter(o => o !== item) : [...prev, item]
    );
  };

  const toggleSocietyAmenity = (amenity: string) => {
    setSocietyAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleTenantPrefer = (tenant: string) => {
    setTenantsPrefer(prev => 
      prev.includes(tenant) ? prev.filter(t => t !== tenant) : [...prev, tenant]
    );
  };

  const useSampleDescription = (sample: string) => {
    setPgDescription(sample);
  };

  // PG Room Image Handlers
  const addRoomImage = () => {
    const newRoom = {
      id: `room-${Date.now()}`,
      name: `Room ${roomImages.length + 1}`,
      file: null
    };
    setRoomImages(prev => [...prev, newRoom]);
  };

  const removeRoomImage = (id: string) => {
    setRoomImages(prev => prev.filter(room => room.id !== id));
  };

  const updateRoomImage = (id: string, field: 'name' | 'status', value: string) => {
    setRoomImages(prev => prev.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    ));
  };

  const handleRoomImageUpload = (id: string, file: File | null) => {
    setRoomImages(prev => prev.map(room => 
      room.id === id ? { ...room, file } : room
    ));
    if (file) setFieldErrors((prev) => { const e = { ...prev }; delete e.roomImages; return e; });
  };

  const handleKitchenImageUpload = (files: FileList | null) => {
    if (files) {
      setKitchenImages(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleWashroomImageUpload = (files: FileList | null) => {
    if (files) {
      setWashroomImages(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleCommonAreaImageUpload = (files: FileList | null) => {
    if (files) {
      setCommonAreaImages(prev => [...prev, ...Array.from(files)]);
    }
  };
  
  // Tenant Room Image Handlers
  const addTenantRoomImage = () => {
    const newRoom = {
      id: `tenant-room-${Date.now()}`,
      name: `Room ${tenantRoomImages.length + 1}`,
      file: null
    };
    setTenantRoomImages(prev => [...prev, newRoom]);
  };

  const removeTenantRoomImage = (id: string) => {
    setTenantRoomImages(prev => prev.filter(room => room.id !== id));
  };

  const updateTenantRoomImage = (id: string, field: 'name', value: string) => {
    setTenantRoomImages(prev => prev.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    ));
  };

  const handleTenantRoomImageUpload = (id: string, file: File | null) => {
    setTenantRoomImages(prev => prev.map(room => 
      room.id === id ? { ...room, file } : room
    ));
    if (file) setFieldErrors((prev) => { const e = { ...prev }; delete e.roomImages; return e; });
  };

  const handleTenantKitchenImageUpload = (files: FileList | null) => {
    if (files) {
      setTenantKitchenImages(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleTenantWashroomImageUpload = (files: FileList | null) => {
    if (files) {
      setTenantWashroomImages(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleTenantCommonAreaImageUpload = (files: FileList | null) => {
    if (files) {
      setTenantCommonAreaImages(prev => [...prev, ...Array.from(files)]);
    }
  };

  // Auto redirect after success
  useEffect(() => {
    if (step === 6) {
      const timer = setTimeout(() => {
        router.push(`/${country}`);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [step, router, country]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      <Toaster />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-6 py-10 sm:py-12 md:py-12 min-h-screen">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step === s ? 'bg-primary text-white scale-110' : 
                  step > s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 5 && <div className={`w-7 esm:w-10 md:w-12 h-1 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">Step {step} of 5</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto pb-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            {/* STEP 1: Property Type & Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">{t.greeting}</h2>
                  <p className="text-gray-600 text-lg mb-6">{t.step1Title}</p>
                </div>

                {/* Property Type */}
                <div data-field="propertyType">
                  <label className="block text-gray-700 font-semibold mb-3">{t.postingFor}</label>
                  <div className="grid grid-cols-1 esm:grid-cols-2 gap-4">
                    {['PG', 'Tenant'].map((type) => (
                      <label key={type} className={`flex items-center justify-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${
                        propertyType === type ? 'border-primary bg-primary/10' : 'border-gray-200'
                      }`}>
                        <input 
                          type="radio" 
                          name="propertyType" 
                          value={type} 
                          checked={propertyType === type} 
                          onChange={(e) => setPropertyType(e.target.value as PropertyType)} 
                          className="w-5 h-5 text-primary focus:ring-primary" 
                        />
                        <span className="text-lg font-medium text-gray-700">{type === 'PG' ? t.pg : t.tenant}</span>
                      </label>
                    ))}
                  </div>
                  <FieldError name="propertyType" />
                </div>

                {/* Poster Type */}
                {propertyType && (
                  <div data-field="posterType">
                    <label className="block text-gray-700 font-semibold mb-3">
                      {propertyType === "PG" ? t.postingPGAs : t.postingTenantAs}
                    </label>
                    <div className="space-y-3">
                      {['Owner', 'Property Manager', 'Agent'].map((type) => (
                        <label key={type} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${
                          posterType === type ? 'border-primary bg-primary/10' : 'border-gray-200'
                        }`}>
                          <input 
                            type="radio" 
                            name="posterType" 
                            value={type} 
                            checked={posterType === type} 
                            onChange={(e) => setPosterType(e.target.value as PosterType)} 
                            className="w-5 h-5 text-primary focus:ring-primary" 
                          />
                          <span className="text-lg font-medium text-gray-700">
                            {type === 'Owner' ? t.owner : type === 'Property Manager' ? t.propertyManager : t.agent}
                          </span>
                        </label>
                      ))}
                    </div>
                    <FieldError name="posterType" />
                  </div>
                )}

                {/* Property Category (Tenant only) */}
                {propertyType === "Tenant" && posterType && (
                  <div data-field="propertyCategory">
                    <label className="block text-gray-700 font-semibold mb-3">{t.propertyCategory}</label>
                    <div className="grid grid-cols-1 esm:grid-cols-2 gap-3">
                      {['Villa', 'Flat', 'House', 'Penthouse'].map((category) => (
                        <label key={category} className={`flex items-center justify-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${
                          propertyCategory === category ? 'border-primary bg-primary/10' : 'border-gray-200'
                        }`}>
                          <input 
                            type="radio" 
                            name="propertyCategory" 
                            value={category} 
                            checked={propertyCategory === category} 
                            onChange={(e) => setPropertyCategory(e.target.value as PropertyCategory)} 
                            className="w-5 h-5 text-primary focus:ring-primary" 
                          />
                          <span className="text-base font-medium text-gray-700">
                            {category === 'Villa' ? t.villa : category === 'Flat' ? t.flat : category === 'House' ? t.house : t.penthouse}
                          </span>
                        </label>
                      ))}
                    </div>
                    <FieldError name="propertyCategory" />
                  </div>
                )}

                {/* City Selection */}
                {posterType && (propertyType === "PG" || propertyCategory) && (
                  <div data-field="selectedCity">
                    <label className="block text-gray-700 font-semibold mb-2">
                      {propertyType === "PG" ? t.cityTitle : t.cityTitleTenant}
                    </label>
                    <p className="text-sm text-gray-500 mb-3">{t.citySubtitle}</p>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={city} 
                        onChange={(e) => {
                          setCity(e.target.value);
                          setShowSuggestions(true);
                          setSelectedCity("");
                        }} 
                        onFocus={() => setShowSuggestions(true)}
                        placeholder={t.cityPlaceholder} 
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-lg" 
                      />
                      {selectedCity && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <span className="text-gray-700">{selectedCity.split(',')[0]}</span>
                          <button 
                            onClick={() => {
                              setSelectedCity("");
                              setCity("");
                            }}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {showSuggestions && city && !selectedCity && filteredCities.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
                          {filteredCities.map((cityOption, index) => (
                            <button
                              key={index}
                              onClick={() => handleCitySelect(cityOption)}
                              className="w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                            >
                              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                              <span className="text-gray-700">{cityOption}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <FieldError name="selectedCity" />
                  </div>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button 
                  onClick={handleContinueStep1} 
                  className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  {t.continue}
                </button>
              </div>
            )}

            {/* STEP 2: Property Details */}
            {step === 2 && (
              <div className="space-y-6">
                <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4">
                  <ArrowLeft className="w-5 h-5" />{t.back}
                </button>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">{t.step2Title}</h2>
                  <p className="text-gray-600 mb-4">{t.addressSubtitle}</p>
                  {selectedCity && (
                    <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg w-fit mb-4">
                      <span className="text-primary font-medium">{selectedCity.split(',')[0]}</span>
                    </div>
                  )}
                </div>

                {/* Address Section */}
                <div className="space-y-4 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800">{propertyType === "PG" ? t.addressTitle : t.tenantAddressTitle}</h3>
                  <div data-field="address">
                    <label className="block text-gray-700 font-medium mb-2">
                      {t.addressLabel}<span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      placeholder={t.addressPlaceholder} 
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${fieldErrors.address ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    <FieldError name="address" />
                  </div>
                  <div className="grid grid-cols-1 esm:grid-cols-2 gap-3">
                    <div data-field="areaName">
                      <label className="block text-gray-700 font-medium mb-2">
                        {t.areaNameLabel}<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={areaName}
                        onChange={(e) => setAreaName(e.target.value)}
                        placeholder={t.areaNamePlaceholder}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${fieldErrors.areaName ? 'border-red-400' : 'border-gray-200'}`}
                      />
                      <FieldError name="areaName" />
                    </div>
                    <div data-field="state">
                      <label className="block text-gray-700 font-medium mb-2">
                        {t.stateLabel}<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder={t.statePlaceholder}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${fieldErrors.state ? 'border-red-400' : 'border-gray-200'}`}
                      />
                      <FieldError name="state" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 esm:grid-cols-2 gap-3">
                    <div data-field="pincode">
                      <label className="block text-gray-700 font-medium mb-2">
                        {t.pincodeLabel}<span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        inputMode="numeric"
                        value={pincode}
                        maxLength={country === "fr" ? 5 : 6}
                        onChange={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, "");
                          setPincode(onlyDigits);
                        }}
                        placeholder={country === "fr" ? "75001" : "380001"}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${fieldErrors.pincode ? 'border-red-400' : 'border-gray-200'}`}
                      />
                      <FieldError name="pincode" />
                    </div>
                    <div data-field="landmark">
                      <label className="block text-gray-700 font-medium mb-2">
                        {t.landmarkLabel}<span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={landmark} 
                        onChange={(e) => setLandmark(e.target.value)} 
                        placeholder={t.landmarkPlaceholder} 
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${fieldErrors.landmark ? 'border-red-400' : 'border-gray-200'}`}
                      />
                      <FieldError name="landmark" />
                    </div>
                  </div>
                  <div data-field="coordinates">
                    <label className="block text-gray-700 font-medium mb-2">
                      Location Coordinates <span className="text-gray-400 text-sm font-normal">(optional)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div data-field="latitude">
                        <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value)}
                          placeholder="e.g. 23.0225"
                          className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors border-gray-200"
                        />
                      </div>
                      <div data-field="longitude">
                        <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value)}
                          placeholder="e.g. 72.5714"
                          className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors border-gray-200"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      Open Google Maps, right-click your location, and copy the coordinates shown.
                    </p>
                    {latitude && longitude && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude)) && (
                      <div className="rounded-xl overflow-hidden border border-gray-200 h-48">
                        <iframe
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}&z=15&output=embed`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    )}
                  </div>

                  {/* Nearby Places */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">{t.nearbyPlacesLabel}</label>
                    <p className="text-xs text-gray-500 mb-2">{t.nearbyPlacesHelper}</p>
                    <div className="flex flex-col sm:flex-row gap-2 mb-3">
                      <input
                        type="text"
                        value={nearbyPlaceInput}
                        onChange={(e) => setNearbyPlaceInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const name = nearbyPlaceInput.trim();
                            const distance = nearbyDistanceInput.trim();
                            if (name) {
                              setNearbyPlaces(prev => [...prev, { name, distance }]);
                              setNearbyPlaceInput('');
                              setNearbyDistanceInput('');
                            }
                          }
                        }}
                        placeholder={t.nearbyPlacesPlaceholder}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                      />
                      <input
                        type="text"
                        value={nearbyDistanceInput}
                        onChange={(e) => setNearbyDistanceInput(e.target.value)}
                        placeholder="Distance (e.g. 500m, 2km)"
                        className="w-full sm:w-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const name = nearbyPlaceInput.trim();
                          const distance = nearbyDistanceInput.trim();
                          if (name) {
                            setNearbyPlaces(prev => [...prev, { name, distance }]);
                            setNearbyPlaceInput('');
                            setNearbyDistanceInput('');
                          }
                        }}
                        className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium"
                      >
                        Add
                      </button>
                    </div>
                    {nearbyPlaces.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {nearbyPlaces.map((place, i) => (
                          <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            {place.name}{place.distance ? ` · ${place.distance}` : ''}
                            <button
                              type="button"
                              onClick={() => setNearbyPlaces(prev => prev.filter((_, idx) => idx !== i))}
                              className="hover:text-red-500 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* PG Specific Details */}
                {propertyType === "PG" && (
                  <PGStep2Details
                    t={t}
                    currencySymbol={currencySymbol}
                    fieldErrors={fieldErrors}
                    FieldError={FieldError}
                    operationalSince={operationalSince}
                    setOperationalSince={setOperationalSince}
                    pgPresentIn={pgPresentIn}
                    setPgPresentIn={setPgPresentIn}
                    pgName={pgName}
                    setPgName={setPgName}
                    selectedRoomCategories={selectedRoomCategories}
                    toggleRoomCategory={toggleRoomCategory}
                    roomDetails={roomDetails}
                    updateRoomDetail={updateRoomDetail}
                    toggleFacility={toggleFacility}
                  />
                )}

                {/* Tenant Specific Details */}
                {propertyType === "Tenant" && (
                  <TenantStep2Details
                    t={t}
                    fieldErrors={fieldErrors}
                    FieldError={FieldError}
                    flatsInProject={flatsInProject}
                    setFlatsInProject={setFlatsInProject}
                    bedrooms={bedrooms}
                    setBedrooms={setBedrooms}
                    bathrooms={bathrooms}
                    setBathrooms={setBathrooms}
                    balcony={balcony}
                    setBalcony={setBalcony}
                    totalFloors={totalFloors}
                    setTotalFloors={setTotalFloors}
                    floorNumber={floorNumber}
                    setFloorNumber={setFloorNumber}
                    furnishing={furnishing}
                    toggleFurnishing={toggleFurnishing}
                    areaMin={areaMin}
                    setAreaMin={setAreaMin}
                    areaMax={areaMax}
                    setAreaMax={setAreaMax}
                    societyName={societyName}
                    setSocietyName={setSocietyName}
                  />
                )}



                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button 
                  onClick={handleContinueStep2} 
                  className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  {t.continue}
                </button>
              </div>
            )}

            {/* STEP 3: Pricing & Preferences */}
            {step === 3 && (
              <div className="space-y-6">
                <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4">
                  <ArrowLeft className="w-5 h-5" />{t.back}
                </button>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">{t.step3Title}</h2>
                </div>


                {/* PG Pricing & Preferences */}
                {propertyType === "PG" && (
                  <PGStep3Preferences
                    t={t}
                    fieldErrors={fieldErrors}
                    FieldError={FieldError}
                    preferredGender={preferredGender}
                    setPreferredGender={setPreferredGender}
                    tenantPreference={tenantPreference}
                    setTenantPreference={setTenantPreference}
                    pgRules={pgRules}
                    togglePGRule={togglePGRule}
                    noticePeriod={noticePeriod}
                    setNoticePeriod={setNoticePeriod}
                    gateClosingTime={gateClosingTime}
                    setGateClosingTime={setGateClosingTime}
                    services={services}
                    toggleService={toggleService}
                    foodProvided={foodProvided}
                    setFoodProvided={setFoodProvided}
                    meals={meals}
                    toggleMeal={toggleMeal}
                    vegNonVeg={vegNonVeg}
                    setVegNonVeg={setVegNonVeg}
                    foodCharges={foodCharges}
                    setFoodCharges={setFoodCharges}
                    commonAmenities={commonAmenities}
                    toggleCommonAmenity={toggleCommonAmenity}
                    parkingAvailable={parkingAvailable}
                    setParkingAvailable={setParkingAvailable}
                    parkingType={parkingType}
                    setParkingType={setParkingType}
                  />
                )}

                {/* Tenant Pricing & Preferences */}
                {propertyType === "Tenant" && (
                  <TenantStep3Pricing
                    t={t}
                    currencySymbol={currencySymbol}
                    fieldErrors={fieldErrors}
                    FieldError={FieldError}
                    monthlyRentAmount={monthlyRentAmount}
                    setMonthlyRentAmount={setMonthlyRentAmount}
                    securityAmount={securityAmount}
                    setSecurityAmount={setSecurityAmount}
                    maintenanceCharges={maintenanceCharges}
                    setMaintenanceCharges={setMaintenanceCharges}
                    maintenanceType={maintenanceType}
                    setMaintenanceType={setMaintenanceType}
                    availableFrom={availableFrom}
                    setAvailableFrom={setAvailableFrom}
                    availableDate={availableDate}
                    setAvailableDate={setAvailableDate}
                    additionalRooms={additionalRooms}
                    toggleAdditionalRoom={toggleAdditionalRoom}
                    overlooking={overlooking}
                    toggleOverlooking={toggleOverlooking}
                    facing={facing}
                    setFacing={setFacing}
                    societyAmenities={societyAmenities}
                    toggleSocietyAmenity={toggleSocietyAmenity}
                    tenantsPrefer={tenantsPrefer}
                    toggleTenantPrefer={toggleTenantPrefer}
                    localityDescription={localityDescription}
                    setLocalityDescription={setLocalityDescription}
                  />
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button 
                  onClick={handleContinueStep3} 
                  className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  {t.continue}
                </button>
              </div>
            )}

            {/* STEP 4: Photos & Description */}
            {step === 4 && (
              <div className="space-y-6">
                <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4">
                  <ArrowLeft className="w-5 h-5" />{t.back}
                </button>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">{t.step4Title}</h2>
                </div>

                {/* USP Section */}
                <div className="space-y-4 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800">{t.writeUSPTitle}</h3>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">{t.selectCategoryLabel}</label>
                    <select 
                      value={uspCategory} 
                      onChange={(e) => setUspCategory(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none bg-white cursor-pointer"
                    >
                      <option value="">{t.selectCategoryPlaceholder}</option>
                      <option value="Food">{t.food}</option>
                      <option value="Locality">{t.locality}</option>
                      <option value="Amenities">{t.amenities}</option>
                      <option value="Others">{t.others}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">{t.writeUSPLabel}</label>
                    <textarea 
                      value={uspText} 
                      onChange={(e) => setUspText(e.target.value)} 
                      placeholder={t.writeUSPPlaceholder} 
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none" 
                    />
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-4 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800">{t.pgDescriptionTitle}</h3>
                  <p className="text-sm text-gray-600">{t.pgDescriptionSubtitle}</p>
                  <div data-field="pgDescription">
                    <label className="block text-gray-700 font-medium mb-2">{t.pgDescriptionLabel}</label>
                    <textarea 
                      value={pgDescription} 
                      onChange={(e) => setPgDescription(e.target.value)} 
                      placeholder={t.pgDescriptionPlaceholder} 
                      rows={6}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none ${fieldErrors.pgDescription ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    <FieldError name="pgDescription" />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => useSampleDescription(t.sampleText)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                    >
                      {t.sample1} - {t.editAndUse}
                    </button>
                    <button
                      onClick={() => useSampleDescription(t.sampleText)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                    >
                      {t.sample2} - {t.editAndUse}
                    </button>
                  </div>
                </div>

                {/* Upload Pictures */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800">{t.uploadPicturesTitle}</h3>
                  <p className="text-sm text-gray-600">{t.uploadSubtitle}</p>
                  <p className="text-xs text-gray-500">{t.uploadInfo}</p>
                  
                  {propertyType === "PG" ? (
                    <PGStep4Images
                      t={t}
                      FieldError={FieldError}
                      roomImages={roomImages}
                      addRoomImage={addRoomImage}
                      removeRoomImage={removeRoomImage}
                      updateRoomImage={updateRoomImage}
                      handleRoomImageUpload={handleRoomImageUpload}
                      kitchenImages={kitchenImages}
                      setKitchenImages={setKitchenImages}
                      handleKitchenImageUpload={handleKitchenImageUpload}
                      washroomImages={washroomImages}
                      setWashroomImages={setWashroomImages}
                      handleWashroomImageUpload={handleWashroomImageUpload}
                      commonAreaImages={commonAreaImages}
                      setCommonAreaImages={setCommonAreaImages}
                      handleCommonAreaImageUpload={handleCommonAreaImageUpload}
                    />
                  ) : (
                    <TenantStep4Images
                      t={t}
                      FieldError={FieldError}
                      tenantRoomImages={tenantRoomImages}
                      addTenantRoomImage={addTenantRoomImage}
                      removeTenantRoomImage={removeTenantRoomImage}
                      updateTenantRoomImage={updateTenantRoomImage}
                      handleTenantRoomImageUpload={handleTenantRoomImageUpload}
                      tenantKitchenImages={tenantKitchenImages}
                      setTenantKitchenImages={setTenantKitchenImages}
                      handleTenantKitchenImageUpload={handleTenantKitchenImageUpload}
                      tenantWashroomImages={tenantWashroomImages}
                      setTenantWashroomImages={setTenantWashroomImages}
                      handleTenantWashroomImageUpload={handleTenantWashroomImageUpload}
                      tenantCommonAreaImages={tenantCommonAreaImages}
                      setTenantCommonAreaImages={setTenantCommonAreaImages}
                      handleTenantCommonAreaImageUpload={handleTenantCommonAreaImageUpload}
                    />
                  )}
                </div>

                {/* 360° Virtual Tour */}
                <div className="space-y-4 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800">{t.view360Section}</h3>
                  <p className="text-sm text-gray-600">{t.view360Subtitle}</p>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">{t.view360Label}</label>
                    <input
                      type="url"
                      value={view360Url}
                      onChange={(e) => setView360Url(e.target.value)}
                      placeholder={t.view360Placeholder}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button 
                  onClick={handleContinueStep4}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Posting...' : t.continue}
                </button>
              </div>
            )}

            {/* STEP 5: Property Verification */}
            {step === 5 && (
              <div className="space-y-6">
                <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4">
                  <ArrowLeft className="w-5 h-5" />{t.back}
                </button>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Verify Your Property</h2>
                  <p className="text-gray-600 mb-2">Upload documents to get a verified badge on your listing. This builds trust with potential tenants.</p>
                  <p className="text-sm text-gray-500">Accepted: electricity bill, property tax receipt, ownership deed, or any government-issued property ID proof.</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Why verify?</p>
                    <p className="text-sm text-blue-700">Verified properties get a green Verified badge on the listing card, increasing visibility and tenant trust.</p>
                  </div>
                </div>

                {/* Upload area */}
                <div className="space-y-4">
                  <label className="block text-gray-700 font-semibold">Verification Documents <span className="text-gray-400 font-normal text-sm">(optional — skip to post without verification)</span></label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
                    onClick={() => document.getElementById('verification-upload')?.click()}
                  >
                    <ShieldCheck className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium mb-1">Click to upload verification documents</p>
                    <p className="text-xs text-gray-400">JPG, PNG, PDF accepted · Max 5 files</p>
                    <input
                      id="verification-upload"
                      type="file"
                      accept="image/*,.pdf"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          const newFiles = Array.from(e.target.files).slice(0, 5 - verificationImages.length);
                          setVerificationImages(prev => [...prev, ...newFiles].slice(0, 5));
                        }
                      }}
                    />
                  </div>

                  {verificationImages.length > 0 && (
                    <div className="space-y-2">
                      {verificationImages.map((file, i) => (
                        <div key={i} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                            <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(0)} KB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setVerificationImages(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-red-400 hover:text-red-600 transition-colors ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSubmitStep5}
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Posting...' : verificationImages.length > 0 ? 'Submit with Verification' : 'Submit Property'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: Success */}
            {step === 6 && (
              <div className="flex flex-col items-center justify-center space-y-8 py-12">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center animate-bounce">
                  <Check className="w-16 h-16 text-primary" />
                </div>
                <div className="text-center space-y-3 max-w-md">
                  <h2 className="text-3xl md:text-4xl font-bold text-primary">
                    {language === 'fr' ? 'Soumis avec succès !' : 'Submitted Successfully!'}
                  </h2>
                  <p className="text-lg text-gray-700 font-medium">
                    {language === 'fr'
                      ? 'Votre propriété est en cours d\'examen.'
                      : 'Your property is under review.'}
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left mt-4">
                    <p className="text-sm text-yellow-800 font-semibold mb-1">
                      {language === 'fr' ? 'Que se passe-t-il ensuite ?' : 'What happens next?'}
                    </p>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>{language === 'fr' ? 'Notre équipe examinera votre annonce.' : 'Our team will review your listing.'}</li>
                      <li>{language === 'fr' ? 'Une fois approuvée, elle sera visible sur le site.' : 'Once approved, it will be visible on the website.'}</li>
                      <li>{language === 'fr' ? 'Vous pouvez suivre le statut dans votre tableau de bord.' : 'You can track the status in your dashboard.'}</li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-400 mt-4">
                    {language === 'fr' ? 'Redirection vers la page d\'accueil...' : 'Redirecting to home page...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
