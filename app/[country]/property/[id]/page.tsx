"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import { ChevronLeft, ChevronRight, Heart, MapPin, Mail, Share2, X, MessageCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ContactOwnerForm from "@/components/ContactOwnerForm";
import SubscribeSection from "@/components/SubscribeSection";
import ReviewSection from "@/components/ReviewSection";

const defaultReviews = [
  {
    id: "r1",
    userName: "Sarah Jenkins",
    date: "October 2023",
    rating: 5,
    comment: "Absolutely loved my stay here! The apartment was exactly as described, very clean, and the balcony view was stunning. The property manager was also very responsive to our needs.",
    helpfulCount: 12
  },
  {
    id: "r2",
    userName: "Mikel Arteta",
    date: "September 2023",
    rating: 4,
    comment: "Great location and very spacious. The kitchen amenities were good, though the Wi-Fi was slightly spotty in the guest bedroom. Overall, a great experience.",
    helpfulCount: 5
  },
  {
    id: "r3",
    userName: "Emma Watson",
    date: "August 2023",
    rating: 5,
    comment: "Perfect place for a long-term stay. The neighborhood is quiet but well-connected. I highly recommend it!",
    helpfulCount: 8
  },
  {
    id: "r4",
    userName: "David Chen",
    date: "July 2023",
    rating: 3,
    comment: "The apartment is nice, but it was a bit noisy during the weekends because of the street below. Keep that in mind if you are a light sleeper.",
    helpfulCount: 2
  }
];

const defaultRatingStats = {
  average: 4.6,
  total: 24,
  distribution: {
    5: 16,
    4: 5,
    3: 2,
    2: 1,
    1: 0
  }
};

// Mock property data - in real app, this would come from API/database
const propertyData: { [key: string]: any } = {
  "1": {
    id: "1",
    title: "Beautiful Apartment with Balcony",
    location: "10 Rue Georges Pompidou, Talence, France",
    fullAddress: "10 Rue Georges Pompidou, Talence, France",
    price: 1100,
    deposit: 2200,
    rooms: 3,
    bathrooms: 2,
    area: 63,
    propertyType: "Tenant",
    category: "Flat",
    rentalPeriod: "Unlimited",
    availableFrom: "ASAP",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    ],
    roomImages: [
      {
        id: "room1",
        name: "Bedroom 1",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
      },
      {
        id: "room2",
        name: "Bedroom 2",
        image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2057&auto=format&fit=crop"
      },
      {
        id: "room3",
        name: "Living Room",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    kitchenImages: [
      {
        id: "kitchen1",
        name: "Kitchen",
        image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2068&auto=format&fit=crop"
      }
    ],
    washroomImages: [
      {
        id: "washroom1",
        name: "Bathroom 1",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2187&auto=format&fit=crop"
      },
      {
        id: "washroom2",
        name: "Bathroom 2",
        image: "https://images.unsplash.com/photo-1604709177225-055f99402ea3?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    commonAreaImages: [
      {
        id: "common1",
        name: "Balcony",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop"
      }
    ],
    view360Available: true,
    view360Url: "https://example.com/360-view",
    description: "Beautiful 3-bedroom apartment with modern amenities and stunning views. Perfect for families or professionals looking for a comfortable living space.",
    amenities: ["WiFi", "Parking", "Gym", "Security", "Elevator", "Balcony"],
    rules: {
      smoking: "Not Allowed",
      pets: "Not Allowed",
      visitors: "Allowed with prior notice",
      gateClosing: "11:00 PM"
    },
    services: {
      electricity: "Included",
      water: "Included",
      maintenance: "Included",
      cleaning: "Not Included"
    },
    landlord: {
      name: "Property Manager",
      phone: "+33 1 23 45 67 89",
      email: "contact@renthub.com"
    },
    priceStatus: "below average",
    isNew: true
  },
  // India properties
  "101": {
    id: "101",
    title: "Premium PG in Navrangpura",
    location: "Navrangpura, Ahmedabad, Gujarat",
    fullAddress: "Navrangpura, Ahmedabad, Gujarat, India",
    price: 15000,
    deposit: 30000,
    rooms: 1,
    bathrooms: 1,
    area: 25,
    propertyType: "PG",
    category: "PG",
    pgFor: "Both",
    preferredTenants: "Any",
    rentalPeriod: "Monthly",
    availableFrom: "ASAP",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    ],
    roomsAvailability: [
      { id: "room1", name: "Bed 1", status: "available", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" }
    ],
    kitchenImages: [
      { id: "kitchen1", name: "Kitchen", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2068&auto=format&fit=crop" }
    ],
    washroomImages: [
      { id: "wash1", name: "Washroom", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2187&auto=format&fit=crop" }
    ],
    commonAreaImages: [
      { id: "common1", name: "Common Area", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop" }
    ],
    description: "Premium PG accommodation in Navrangpura with all amenities included.",
    amenities: ["WiFi", "Meals", "Laundry", "AC"],
    rules: { smoking: "Not Allowed", pets: "Not Allowed" },
    services: { electricity: "Included", water: "Included", meals: "Included" },
    landlord: { name: "PG Owner", phone: "+91 12345 67890", email: "contact@pgowner.in" },
    priceStatus: "above average",
    isNew: true
  },
  "102": {
    id: "102",
    title: "Cozy 2BHK Apartment",
    location: "Info City, Gandhinagar, Gujarat",
    fullAddress: "Info City, Gandhinagar, Gujarat, India",
    price: 25000,
    deposit: 50000,
    rooms: 2,
    bathrooms: 2,
    area: 75,
    propertyType: "Tenant",
    category: "Apartment",
    rentalPeriod: "Monthly",
    availableFrom: "ASAP",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
    ],
    description: "Spacious 2BHK apartment ideal for families.",
    amenities: ["WiFi", "Parking"],
    rules: { pets: "Allowed" },
    services: { electricity: "Included", water: "Included" },
    landlord: { name: "Owner", phone: "+91 98765 43210", email: "owner@example.com" },
    priceStatus: "average",
    isNew: false
  },
  "103": {
    id: "103",
    title: "Student-Friendly PG",
    location: "Vesu, Surat, Gujarat",
    fullAddress: "Vesu, Surat, Gujarat, India",
    price: 8500,
    deposit: 17000,
    rooms: 1,
    bathrooms: 1,
    area: 18,
    propertyType: "PG",
    category: "PG",
    pgFor: "Students",
    preferredTenants: "Student",
    rentalPeriod: "Monthly",
    availableFrom: "ASAP",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    ],
    roomsAvailability: [
      { id: "room1", name: "Room A", status: "available", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop" },
      { id: "room2", name: "Room B", status: "sold", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop" }
    ],
    description: "Affordable PG for students with meals and laundry.",
    amenities: ["WiFi", "Meals", "Study Room"],
    rules: { visitors: "Allowed", smoking: "Not Allowed" },
    services: { electricity: "Included", water: "Included", meals: "2 meals/day" },
    landlord: { name: "PG Owner", phone: "+91 11223 44556", email: "pgowner@surat.in" },
    priceStatus: "below average",
    isNew: true
  },
  "104": {
    id: "104",
    title: "Luxury Independent House",
    location: "Alkapuri, Vadodara, Gujarat",
    fullAddress: "Alkapuri, Vadodara, Gujarat, India",
    price: 55000,
    deposit: 110000,
    rooms: 4,
    bathrooms: 3,
    area: 140,
    propertyType: "Tenant",
    category: "House",
    rentalPeriod: "Monthly",
    availableFrom: "ASAP",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    ],
    description: "Spacious luxury house with modern amenities.",
    amenities: ["Pool", "Garden"],
    rules: { pets: "Allowed" },
    services: { electricity: "Included", water: "Included" },
    landlord: { name: "House Owner", phone: "+91 66778 88990", email: "houseowner@vadodara.in" },
    priceStatus: "above average",
    isNew: false
  },
  "202": {
    id: "202",
    title: "Spacious Studio Apartment",
    location: "Rue du Dépôt, 60280 Venette, France",
    fullAddress: "Rue du Dépôt, 60280 Venette, France",
    price: 695,
    deposit: 1390,
    rooms: 1,
    bathrooms: 1,
    area: 37,
    propertyType: "PG",
    category: "Single",
    pgFor: "Both",
    preferredTenants: "Student",
    rentalPeriod: "Unlimited",
    availableFrom: "ASAP",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    ],
    roomsAvailability: [
      { 
        id: "room1", 
        name: "Room 1", 
        status: "sold",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop"
      },
      { 
        id: "room2", 
        name: "Room 2", 
        status: "sold",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
      },
      { 
        id: "room3", 
        name: "Room 3", 
        status: "available",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
      },
      { 
        id: "room4", 
        name: "Room 4", 
        status: "available",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop"
      },
      { 
        id: "room5", 
        name: "Room 5", 
        status: "sold",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    kitchenImages: [
      {
        id: "kitchen1",
        name: "Kitchen",
        image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2068&auto=format&fit=crop"
      }
    ],
    washroomImages: [
      {
        id: "washroom1",
        name: "Washroom 1",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2187&auto=format&fit=crop"
      },
      {
        id: "washroom2",
        name: "Washroom 2",
        image: "https://images.unsplash.com/photo-1604709177225-055f99402ea3?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    commonAreaImages: [
      {
        id: "common1",
        name: "Common Area",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    description: "Comfortable PG accommodation perfect for students. Includes meals, WiFi, and all basic amenities. Safe and secure environment.",
    amenities: ["WiFi", "Meals", "Laundry", "AC", "Attached Bathroom", "Study Table"],
    rules: {
      smoking: "Not Allowed",
      drinking: "Not Allowed",
      nonVeg: "Allowed",
      visitors: "Allowed (10 AM - 8 PM)",
      gateClosing: "10:00 PM"
    },
    services: {
      electricity: "Included",
      water: "Included",
      meals: "3 meals/day",
      laundry: "Included",
      cleaning: "Daily"
    },
    landlord: {
      name: "PG Owner",
      phone: "+33 1 23 45 67 89",
      email: "contact@renthub.com"
    },
    priceStatus: "below average",
    isNew: true
  },
  "3": {
    id: "3",
    title: "Modern Apartment with Garden View",
    location: "Aix-en-Provence, Bouches-du-Rhône",
    fullAddress: "Aix-en-Provence, Bouches-du-Rhône, France",
    price: 1500,
    deposit: 3000,
    rooms: 3,
    bathrooms: 2,
    area: 70,
    propertyType: "Tenant",
    category: "Flat",
    rentalPeriod: "Unlimited",
    availableFrom: "ASAP",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
    ],
    roomImages: [
      {
        id: "room1",
        name: "Master Bedroom",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
      },
      {
        id: "room2",
        name: "Bedroom 2",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    kitchenImages: [
      {
        id: "kitchen1",
        name: "Modern Kitchen",
        image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2068&auto=format&fit=crop"
      }
    ],
    washroomImages: [
      {
        id: "washroom1",
        name: "Main Bathroom",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2187&auto=format&fit=crop"
      }
    ],
    commonAreaImages: [
      {
        id: "common1",
        name: "Garden View",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop"
      }
    ],
    description: "Modern 3-bedroom apartment with beautiful garden view. Spacious living areas and contemporary design.",
    amenities: ["WiFi", "Parking", "Garden View", "Security", "Elevator", "Balcony"],
    rules: {
      smoking: "Not Allowed",
      pets: "Allowed",
      visitors: "Allowed",
      gateClosing: "No restriction"
    },
    services: {
      electricity: "Included",
      water: "Included",
      maintenance: "Included",
      cleaning: "Not Included"
    },
    landlord: {
      name: "Property Manager",
      phone: "+33 1 23 45 67 89",
      email: "contact@renthub.com"
    },
    priceStatus: "below average",
    isNew: true
  },
  "4": {
    id: "4",
    title: "Cozy One Room Apartment",
    location: "Bitic-Etables-sur-Mer, Côtes-d'Armor",
    fullAddress: "Bitic-Etables-sur-Mer, Côtes-d'Armor, France",
    price: 560,
    deposit: 1120,
    rooms: 1,
    bathrooms: 1,
    area: 32,
    propertyType: "Tenant",
    category: "Studio",
    rentalPeriod: "Unlimited",
    availableFrom: "ASAP",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    ],
    roomImages: [
      {
        id: "room1",
        name: "Studio Room",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop"
      }
    ],
    kitchenImages: [
      {
        id: "kitchen1",
        name: "Kitchenette",
        image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2068&auto=format&fit=crop"
      }
    ],
    washroomImages: [
      {
        id: "washroom1",
        name: "Bathroom",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2187&auto=format&fit=crop"
      }
    ],
    view360Available: true,
    view360Url: "https://example.com/360-view-studio",
    description: "Cozy studio apartment perfect for singles or couples. Compact yet comfortable living space.",
    amenities: ["WiFi", "Furnished", "Kitchen", "Security"],
    rules: {
      smoking: "Not Allowed",
      pets: "Not Allowed",
      visitors: "Allowed",
      gateClosing: "No restriction"
    },
    services: {
      electricity: "Included",
      water: "Included",
      maintenance: "Included",
      cleaning: "Not Included"
    },
    landlord: {
      name: "Property Owner",
      phone: "+33 1 23 45 67 89",
      email: "contact@renthub.com"
    },
    priceStatus: "below average",
    isNew: true
  },
  "5": {
    id: "5",
    title: "Luxury Penthouse",
    location: "Paris 16th, Île-de-France",
    fullAddress: "Paris 16th, Île-de-France, France",
    price: 2800,
    deposit: 5600,
    rooms: 4,
    bathrooms: 3,
    area: 120,
    propertyType: "Tenant",
    category: "Penthouse",
    rentalPeriod: "Unlimited",
    availableFrom: "ASAP",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    ],
    roomImages: [
      {
        id: "room1",
        name: "Master Suite",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
      },
      {
        id: "room2",
        name: "Bedroom 2",
        image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2057&auto=format&fit=crop"
      },
      {
        id: "room3",
        name: "Bedroom 3",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    kitchenImages: [
      {
        id: "kitchen1",
        name: "Luxury Kitchen",
        image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2068&auto=format&fit=crop"
      }
    ],
    washroomImages: [
      {
        id: "washroom1",
        name: "Master Bathroom",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2187&auto=format&fit=crop"
      },
      {
        id: "washroom2",
        name: "Guest Bathroom",
        image: "https://images.unsplash.com/photo-1604709177225-055f99402ea3?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    commonAreaImages: [
      {
        id: "common1",
        name: "Terrace",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop"
      },
      {
        id: "common2",
        name: "Living Room",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    view360Available: true,
    view360Url: "https://example.com/360-view-penthouse",
    description: "Luxury penthouse with panoramic city views. Premium finishes and top-tier amenities.",
    amenities: ["WiFi", "Parking", "Gym", "Pool", "Security", "Terrace", "Elevator"],
    rules: {
      smoking: "Not Allowed",
      pets: "Allowed",
      visitors: "Allowed",
      gateClosing: "No restriction"
    },
    services: {
      electricity: "Included",
      water: "Included",
      maintenance: "Included",
      cleaning: "Included"
    },
    landlord: {
      name: "Luxury Properties",
      phone: "+33 1 23 45 67 89",
      email: "contact@renthub.com"
    },
    priceStatus: "below average",
    badge: "Premium"
  },
  "206": {
    id: "206",
    title: "Student-Friendly PG",
    location: "Lyon 7th, Rhône-Alpes, France",
    fullAddress: "Lyon 7th, Rhône-Alpes, France",
    price: 850,
    deposit: 1700,
    rooms: 2,
    bathrooms: 1,
    area: 45,
    propertyType: "PG",
    category: "Double",
    pgFor: "Both",
    preferredTenants: "Student",
    rentalPeriod: "Unlimited",
    availableFrom: "ASAP",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
    ],
    roomsAvailability: [
      { 
        id: "room1", 
        name: "Room 1", 
        status: "available",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
      },
      { 
        id: "room2", 
        name: "Room 2", 
        status: "available",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
      },
      { 
        id: "room3", 
        name: "Room 3", 
        status: "sold",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop"
      }
    ],
    description: "Student-friendly PG accommodation near universities. Perfect for students with study-friendly environment.",
    amenities: ["WiFi", "Meals", "Laundry", "Study Room", "Common Area", "Security"],
    rules: {
      smoking: "Not Allowed",
      drinking: "Not Allowed",
      nonVeg: "Allowed",
      visitors: "Allowed (9 AM - 9 PM)",
      gateClosing: "11:00 PM"
    },
    services: {
      electricity: "Included",
      water: "Included",
      meals: "2 meals/day",
      laundry: "Included",
      cleaning: "Daily"
    },
    landlord: {
      name: "PG Manager",
      phone: "+33 1 23 45 67 89",
      email: "contact@renthub.com"
    },
    priceStatus: "below average"
  },
  "208": {
    id: "208",
    title: "Renovated Studio",
    location: "Toulouse Centre, Haute-Garonne, France",
    fullAddress: "Toulouse Centre, Haute-Garonne, France",
    price: 650,
    deposit: 1300,
    rooms: 1,
    bathrooms: 1,
    area: 28,
    propertyType: "PG",
    category: "Single",
    pgFor: "Both",
    preferredTenants: "Professional",
    rentalPeriod: "Unlimited",
    availableFrom: "ASAP",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
    ],
    roomsAvailability: [
      { 
        id: "room1", 
        name: "Room 1", 
        status: "sold",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
      },
      { 
        id: "room2", 
        name: "Room 2", 
        status: "available",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop"
      }
    ],
    description: "Renovated PG studio in the heart of Toulouse. Modern amenities and great connectivity.",
    amenities: ["WiFi", "Meals", "AC", "Attached Bathroom", "Furnished", "Security"],
    rules: {
      smoking: "Not Allowed",
      drinking: "Not Allowed",
      nonVeg: "Allowed",
      visitors: "Allowed (10 AM - 8 PM)",
      gateClosing: "10:30 PM"
    },
    services: {
      electricity: "Included",
      water: "Included",
      meals: "2 meals/day",
      laundry: "Included",
      cleaning: "Daily"
    },
    landlord: {
      name: "PG Owner",
      phone: "+33 1 23 45 67 89",
      email: "contact@renthub.com"
    },
    priceStatus: "below average"
  },
  "204": {
    id: "204",
    title: "Cozy Studio Near University",
    location: "Montpellier Centre, Hérault, France",
    fullAddress: "Montpellier Centre, Hérault, France",
    price: 580,
    deposit: 1160,
    rooms: 1,
    bathrooms: 1,
    area: 25,
    propertyType: "PG",
    category: "Single",
    pgFor: "Both",
    preferredTenants: "Student",
    rentalPeriod: "Unlimited",
    availableFrom: "ASAP",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    ],
    roomsAvailability: [
      { 
        id: "room1", 
        name: "Room 1", 
        status: "available",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
      },
      { 
        id: "room2", 
        name: "Room 2", 
        status: "available",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop"
      },
      { 
        id: "room3", 
        name: "Room 3", 
        status: "available",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
      },
      { 
        id: "room4", 
        name: "Room 4", 
        status: "sold",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    description: "Cozy PG accommodation near university campus. Perfect for students with affordable pricing and good facilities.",
    amenities: ["WiFi", "Meals", "Laundry", "Study Table", "Common Area", "Security"],
    rules: {
      smoking: "Not Allowed",
      drinking: "Not Allowed",
      nonVeg: "Allowed",
      visitors: "Allowed (9 AM - 8 PM)",
      gateClosing: "10:00 PM"
    },
    services: {
      electricity: "Included",
      water: "Included",
      meals: "3 meals/day",
      laundry: "Included",
      cleaning: "Daily"
    },
    landlord: {
      name: "PG Manager",
      phone: "+33 1 23 45 67 89",
      email: "contact@renthub.com"
    },
    priceStatus: "below average",
    isNew: true
  }
};

export default function PropertyDetailsPage() {
  const params = useParams();
  const { language, t: translate } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [direction, setDirection] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedSpaceType, setSelectedSpaceType] = useState<string>("rooms");

  // Currency symbol based on language from translations
  const currencySymbol = translate('currency.symbol');
  const monthText = translate('currency.perMonth');

  const propertyId = params.id as string;
  const country = params.country as string;
  const property = propertyData[propertyId] || propertyData["1"];
  
  // Check if country is India (route uses "in"), but allow full name just in case
  const isIndia = country?.toLowerCase() === 'in' || country?.toLowerCase() === 'india';

  const content = {
    en: {
      home: "Home",
      properties: "Properties",
      addToFavorites: "Add to favourites",
      monthlyRent: "Monthly Rent",
      securityDeposit: "Security Deposit",
      budgetFriendly: "Budget-Friendly: The price is",
      belowAverage: "below average",
      priceDescription: "The pricing of this property is well below the average market rate, providing exceptional value for your budget.",
      rentalPeriod: "Rental Period",
      availableFrom: "Available from",
      contactOwner: "Contact Owner",
      anyConcerns: "Any concerns about this listing?",
      reportIt: "Report it",
      toOurTeam: "to our team.",
      propertyDetails: "PROPERTY DETAILS",
      propertyType: "Property Type",
      category: "Category",
      rooms: "Rooms",
      bathrooms: "Bathrooms",
      size: "Size",
      rent: "Monthly Rent",
      deposit: "Security Deposit",
      pgFor: "PG For",
      preferredTenants: "Preferred Tenants",
      amenities: "AMENITIES",
      rules: "RULES & REGULATIONS",
      smoking: "Smoking",
      drinking: "Drinking",
      nonVeg: "Non-Veg",
      pets: "Pets",
      visitors: "Visitors",
      gateClosing: "Gate Closing Time",
      services: "SERVICES INCLUDED",
      electricity: "Electricity",
      water: "Water",
      meals: "Meals",
      laundry: "Laundry",
      cleaning: "Cleaning",
      maintenance: "Maintenance",
      description: "DESCRIPTION",
      map: "LOCATION",
      roomAvailability: "ROOM AVAILABILITY",
      availableRooms: "Vacant Rooms",
      soldRooms: "Occupied Rooms",
      available: "Vacant",
      sold: "OCCUPIED",
      kitchen: "Kitchen",
      washroom: "Washroom",
      commonArea: "Common Area",
      view360: "360° View",
      relatedListings: "Related Properties",
      viewMore: "View more properties",
      share: "Share",
      shareProperty: "Share Property",
      copyLink: "Copy Link",
      linkCopied: "Link Copied!",
      shareVia: "Share via",
      allowed: "Allowed",
      notAllowed: "Not Allowed",
      included: "Included",
      notIncluded: "Not Included"
    },
    fr: {
      home: "Accueil",
      properties: "Propriétés",
      addToFavorites: "Ajouter aux favoris",
      monthlyRent: "Loyer mensuel",
      securityDeposit: "Dépôt de garantie",
      budgetFriendly: "Économique: Le prix est",
      belowAverage: "inférieur à la moyenne",
      priceDescription: "Le prix de cette propriété est bien inférieur au tarif moyen du marché, offrant une valeur exceptionnelle pour votre budget.",
      rentalPeriod: "Période de location",
      availableFrom: "Disponible à partir de",
      contactOwner: "Contacter le propriétaire",
      anyConcerns: "Des préoccupations concernant cette annonce?",
      reportIt: "Signalez-le",
      toOurTeam: "à notre équipe.",
      propertyDetails: "DÉTAILS DE LA PROPRIÉTÉ",
      propertyType: "Type de propriété",
      category: "Catégorie",
      rooms: "Chambres",
      bathrooms: "Salles de bain",
      size: "Taille",
      rent: "Loyer mensuel",
      deposit: "Dépôt de garantie",
      pgFor: "PG Pour",
      preferredTenants: "Locataires préférés",
      amenities: "ÉQUIPEMENTS",
      rules: "RÈGLES ET RÈGLEMENTS",
      smoking: "Fumer",
      drinking: "Boire",
      nonVeg: "Non-végétarien",
      pets: "Animaux",
      visitors: "Visiteurs",
      gateClosing: "Heure de fermeture",
      services: "SERVICES INCLUS",
      electricity: "Électricité",
      water: "Eau",
      meals: "Repas",
      laundry: "Blanchisserie",
      cleaning: "Nettoyage",
      maintenance: "Entretien",
      description: "DESCRIPTION",
      map: "EMPLACEMENT",
      roomAvailability: "DISPONIBILITÉ DES CHAMBRES",
      availableRooms: "Chambres vacantes",
      soldRooms: "Chambres occupées",
      available: "Vacant",
      sold: "OCCUPÉ",
      kitchen: "Cuisine",
      washroom: "Salle de bain",
      commonArea: "Espace commun",
      view360: "Vue 360°",
      relatedListings: "Propriétés similaires",
      viewMore: "Voir plus de propriétés",
      share: "Partager",
      shareProperty: "Partager la propriété",
      copyLink: "Copier le lien",
      linkCopied: "Lien copié!",
      shareVia: "Partager via",
      allowed: "Autorisé",
      notAllowed: "Non autorisé",
      included: "Inclus",
      notIncluded: "Non inclus"
    }
  };

  const t = content[language];

  // Get current images based on selected space type
  const getCurrentImages = () => {
    if (property.propertyType === "PG") {
      switch (selectedSpaceType) {
        case "rooms":
          return property.roomsAvailability || [];
        case "kitchen":
          return property.kitchenImages || [];
        case "washroom":
          return property.washroomImages || [];
        case "commonArea":
          return property.commonAreaImages || [];
        default:
          return property.roomsAvailability || [];
      }
    } else {
      // For Tenant properties
      switch (selectedSpaceType) {
        case "rooms":
          return property.roomImages || property.images;
        case "kitchen":
          return property.kitchenImages || [];
        case "washroom":
          return property.washroomImages || [];
        case "commonArea":
          return property.commonAreaImages || [];
        default:
          return property.images;
      }
    }
  };

  const currentImages = getCurrentImages();

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };

  // Reset image index when space type changes
  const handleSpaceTypeChange = (spaceType: string) => {
    setSelectedSpaceType(spaceType);
    setCurrentImageIndex(0);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  // Share functions
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleShareWhatsApp = () => {
    const url = window.location.href;
    const text = encodeURIComponent(`Check out this property: ${property.title} - ${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const url = window.location.href;
    const text = encodeURIComponent(`Check out this property: ${property.title}`);
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`, '_blank');
  };

  const handleShareEmail = () => {
    const url = window.location.href;
    const subject = encodeURIComponent(`Property: ${property.title}`);
    const body = encodeURIComponent(`I found this property and thought you might be interested:\n\n${property.title}\n${property.location}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[450px] lg:h-[480px] bg-gray-900">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentImageIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={currentImages[currentImageIndex]?.image || property.images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
            
            {/* Room Status Overlay - Only for India, PG properties with room availability and rooms view */}
            {isIndia && property.propertyType === "PG" && selectedSpaceType === "rooms" && property.roomsAvailability && property.roomsAvailability[currentImageIndex] && (
              <>
                {/* Status Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-20">
                  {property.roomsAvailability[currentImageIndex].status === "sold" ? (
                    <span className="px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-1.5 bg-red-600 text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold rounded-full shadow-2xl">
                      {t.sold}
                    </span>
                  ) : (
                    <span className="px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-1.5 bg-green-600 text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold rounded-full shadow-2xl">
                      {t.available}
                    </span>
                  )}
                </div>

                {/* Occupied Overlay - Only for occupied rooms */}
                {property.roomsAvailability[currentImageIndex].status === "sold" && (
                  <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center z-10">
                    <span className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold transform -rotate-12 opacity-60 drop-shadow-2xl">
                      {t.sold}
                    </span>
                  </div>
                )}

                {/* Vacant Overlay - Only for available rooms */}
                {property.roomsAvailability[currentImageIndex].status === "available" && (
                  <div className="absolute inset-0 bg-green-900/20 flex items-center justify-center z-10">
                    <span className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold transform -rotate-12 opacity-40 drop-shadow-2xl">
                      {t.available}
                    </span>
                  </div>
                )}

                {/* Room Name Label */}
                <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-3 sm:left-4 md:left-6 z-20">
                  <div className={`px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg sm:rounded-xl shadow-2xl ${
                    property.roomsAvailability[currentImageIndex].status === "sold"
                      ? "bg-red-600/90 text-white"
                      : "bg-green-600/90 text-white"
                  }`}>
                    <p className="text-sm sm:text-base md:text-lg font-semibold">
                      {property.roomsAvailability[currentImageIndex].name}
                    </p>
                  </div>
                </div>
              </>
            )}
            
            {/* Room Name Label - For Tenant properties with room images */}
            {property.propertyType === "Tenant" && selectedSpaceType === "rooms" && property.roomImages && property.roomImages[currentImageIndex] && (
              <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-3 sm:left-4 md:left-6 z-20">
                <div className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg sm:rounded-xl shadow-2xl bg-primary/90 text-white">
                  <p className="text-sm sm:text-base md:text-lg font-semibold">
                    {property.roomImages[currentImageIndex].name}
                  </p>
                </div>
              </div>
            )}
            
            {/* Space Name Label - For kitchen, washroom, common area */}
            {(selectedSpaceType === "kitchen" || selectedSpaceType === "washroom" || selectedSpaceType === "commonArea") && 
             currentImages[currentImageIndex] && (
              <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-3 sm:left-4 md:left-6 z-20">
                <div className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg sm:rounded-xl shadow-2xl bg-primary/90 text-white">
                  <p className="text-sm sm:text-base md:text-lg font-semibold">
                    {currentImages[currentImageIndex].name}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center z-10 shadow-lg transition-all"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center z-10 shadow-lg transition-all"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" />
        </button>

        {/* Image Indicators */}
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
          {currentImages.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentImageIndex ? 1 : -1);
                setCurrentImageIndex(index);
              }}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "w-6 sm:w-8 bg-white"
                  : "w-1.5 sm:w-2 bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Space Type Filter Buttons - For both Tenant and PG properties */}
      {(property.propertyType === "Tenant" || property.propertyType === "PG") && (
        <div className="bg-white border-b border-gray-200 shadow-sm px-4">
          <div className="max-w-7xl mx-auto py-3 sm:py-4">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
              {/* Rooms Button */}
              {((property.propertyType === "Tenant" && property.roomImages) || 
                (property.propertyType === "PG" && property.roomsAvailability)) && (
                <button
                  onClick={() => handleSpaceTypeChange("rooms")}
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap transition-all ${
                    selectedSpaceType === "rooms"
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t.rooms}
                  {property.propertyType === "PG" && (
                    <>
                      {" ("}
                      <span className="text-green-300 font-bold">
                        {property.roomsAvailability?.filter((room: any) => room.status === "available").length || 0}
                      </span>
                      {" / "}
                      <span className="text-red-300 font-bold">
                        {property.roomsAvailability?.filter((room: any) => room.status === "sold").length || 0}
                      </span>
                      {")"}
                    </>
                  )}
                  {property.propertyType === "Tenant" && property.roomImages && (
                    <> ({property.roomImages.length})</>
                  )}
                </button>
              )}
              
              {/* Kitchen Button */}
              {property.kitchenImages && property.kitchenImages.length > 0 && (
                <button
                  onClick={() => handleSpaceTypeChange("kitchen")}
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap transition-all ${
                    selectedSpaceType === "kitchen"
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t.kitchen} ({property.kitchenImages.length})
                </button>
              )}
              
              {/* Washroom Button */}
              {property.washroomImages && property.washroomImages.length > 0 && (
                <button
                  onClick={() => handleSpaceTypeChange("washroom")}
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap transition-all ${
                    selectedSpaceType === "washroom"
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t.washroom} ({property.washroomImages.length})
                </button>
              )}
              
              {/* Common Area Button */}
              {property.commonAreaImages && property.commonAreaImages.length > 0 && (
                <button
                  onClick={() => handleSpaceTypeChange("commonArea")}
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap transition-all ${
                    selectedSpaceType === "commonArea"
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t.commonArea} ({property.commonAreaImages.length})
                </button>
              )}
              
              {/* 360 View Button - Only for Tenant properties */}
              {property.propertyType === "Tenant" && property.view360Available && (
                <button
                  onClick={() => window.open(property.view360Url, '_blank')}
                  className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap transition-all bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md"
                >
                  {t.view360}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 overflow-x-auto">
              <Link href="/" className="hover:text-primary whitespace-nowrap">{t.home}</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <Link href="/properties" className="hover:text-primary whitespace-nowrap">{t.properties}</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-gray-900 truncate">{property.location.split(',')[0]}</span>
            </div>

            {/* Title and Favorite */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    {property.title}
                  </h1>
                  <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${
                    property.propertyType === "PG" 
                      ? "bg-blue-600 text-white" 
                      : "bg-green-600 text-white"
                  }`}>
                    {property.propertyType}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 flex items-center gap-1.5 sm:gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="line-clamp-2">{property.fullAddress}</span>
                </p>
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                  isFavorite
                    ? 'bg-red-50 border-2 border-red-500 text-red-600 hover:bg-red-100'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-primary hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <Heart
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                    isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-current"
                  }`}
                />
                <span className="whitespace-nowrap hidden sm:inline">{t.addToFavorites}</span>
                <span className="whitespace-nowrap sm:hidden">Favorite</span>
              </button>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.description}</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Property Details Section */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.propertyDetails}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">{t.propertyType}</span>
                  <span className={`font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm ${
                    property.propertyType === "PG" 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {property.propertyType}
                  </span>
                </div>
                <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">{t.category}</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900">{property.category}</span>
                </div>
                {property.propertyType === "PG" && property.pgFor && (
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-sm sm:text-base text-gray-600">{t.pgFor}</span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900">{property.pgFor}</span>
                  </div>
                )}
                {property.propertyType === "PG" && property.preferredTenants && (
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-sm sm:text-base text-gray-600">{t.preferredTenants}</span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900">{property.preferredTenants}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">{t.rooms}</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900">{property.rooms}</span>
                </div>
                <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">{t.bathrooms}</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900">{property.bathrooms}</span>
                </div>
                <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">{t.size}</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900">{property.area} m²</span>
                </div>
                <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">{t.rent}</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900">{currencySymbol} {property.price}</span>
                </div>
                <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">{t.deposit}</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900">{currencySymbol} {property.deposit}</span>
                </div>
                <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">{t.availableFrom}</span>
                  <span className="text-sm sm:text-base font-semibold text-green-600">{property.availableFrom}</span>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.amenities}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {property.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules Section */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.rules}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">{t.smoking}</span>
                  <span className={`text-sm sm:text-base font-semibold ${property.rules.smoking === "Allowed" ? "text-green-600" : "text-red-600"}`}>
                    {property.rules.smoking}
                  </span>
                </div>
                {property.propertyType === "PG" && property.rules.drinking && (
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-sm sm:text-base text-gray-600">{t.drinking}</span>
                    <span className={`text-sm sm:text-base font-semibold ${property.rules.drinking === "Allowed" ? "text-green-600" : "text-red-600"}`}>
                      {property.rules.drinking}
                    </span>
                  </div>
                )}
                {property.propertyType === "PG" && property.rules.nonVeg && (
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-sm sm:text-base text-gray-600">{t.nonVeg}</span>
                    <span className={`text-sm sm:text-base font-semibold ${property.rules.nonVeg === "Allowed" ? "text-green-600" : "text-red-600"}`}>
                      {property.rules.nonVeg}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">{t.pets}</span>
                  <span className={`text-sm sm:text-base font-semibold ${property.rules.pets === "Allowed" ? "text-green-600" : "text-red-600"}`}>
                    {property.rules.pets}
                  </span>
                </div>
                <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">{t.visitors}</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900">{property.rules.visitors}</span>
                </div>
                <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">{t.gateClosing}</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900">{property.rules.gateClosing}</span>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.services}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">{t.electricity}</span>
                  <span className={`text-sm sm:text-base font-semibold ${property.services.electricity === "Included" ? "text-green-600" : "text-gray-900"}`}>
                    {property.services.electricity}
                  </span>
                </div>
                <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">{t.water}</span>
                  <span className={`text-sm sm:text-base font-semibold ${property.services.water === "Included" ? "text-green-600" : "text-gray-900"}`}>
                    {property.services.water}
                  </span>
                </div>
                {property.propertyType === "PG" && property.services.meals && (
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-sm sm:text-base text-gray-600">{t.meals}</span>
                    <span className="text-sm sm:text-base font-semibold text-green-600">{property.services.meals}</span>
                  </div>
                )}
                {property.propertyType === "PG" && property.services.laundry && (
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-sm sm:text-base text-gray-600">{t.laundry}</span>
                    <span className={`text-sm sm:text-base font-semibold ${property.services.laundry === "Included" ? "text-green-600" : "text-gray-900"}`}>
                      {property.services.laundry}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">{t.cleaning}</span>
                  <span className={`text-sm sm:text-base font-semibold ${property.services.cleaning === "Included" || property.services.cleaning === "Daily" ? "text-green-600" : "text-gray-900"}`}>
                    {property.services.cleaning}
                  </span>
                </div>
                {property.propertyType === "Tenant" && property.services.maintenance && (
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-sm sm:text-base text-gray-600">{t.maintenance}</span>
                    <span className={`text-sm sm:text-base font-semibold ${property.services.maintenance === "Included" ? "text-green-600" : "text-gray-900"}`}>
                      {property.services.maintenance}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.map}</h3>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 line-clamp-2">{property.fullAddress}</span>
              </div>
              <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-sm sm:text-base text-gray-500">Map placeholder</p>
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewSection 
              stats={property.rating || defaultRatingStats} 
              reviews={property.reviews || defaultReviews} 
              language={language}
              t={t}
            />

            {/* Related Listings Section */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                {t.relatedListings} {property.location.split(',')[0]}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                {/* Related Property 1 */}
                <Link href="/property/2" className="group">
                  <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                    <Image
                      src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop"
                      alt="Related property"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    1 room apartment of 30m²
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    60280 {property.location.split(',')[0]}, France
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {currencySymbol} 560 <span className="text-sm font-normal text-gray-600">/ {monthText}</span>
                  </p>
                </Link>

                {/* Related Property 2 */}
                <Link href="/property/3" className="group">
                  <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                    <Image
                      src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
                      alt="Related property"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    2 rooms apartment of 42m²
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    60280 {property.location.split(',')[0]}, France
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {currencySymbol} 618 <span className="text-sm font-normal text-gray-600">/ {monthText}</span>
                  </p>
                </Link>

                {/* Related Property 3 */}
                <Link href="/property/4" className="group">
                  <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                    <Image
                      src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
                      alt="Related property"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    1 room apartment of 39m²
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    60000 Compiègne, France
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {currencySymbol} 622 <span className="text-sm font-normal text-gray-600">/ {monthText}</span>
                  </p>
                </Link>
              </div>

              {/* View More Button */}
              <div className="text-center">
                <Link href="/properties">
                  <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors">
                    {t.viewMore}
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              {/* Price Card */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{t.monthlyRent}</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                  {currencySymbol} {property.price}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  {t.securityDeposit}: {currencySymbol} {property.deposit}
                </p>

                {/* Price Status */}
                <div className="mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    {t.budgetFriendly} <span className="text-green-600">{t.belowAverage}</span>
                  </p>
                  <div className="w-full h-1.5 sm:h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full mb-2"></div>
                  <p className="text-xs text-gray-600">{t.priceDescription}</p>
                </div>

                {/* Rental Info */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">{t.rentalPeriod}</span>
                    <span className="text-xs sm:text-sm font-semibold text-green-600">{property.rentalPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">{t.availableFrom}</span>
                    <span className="text-xs sm:text-sm font-semibold text-green-600">{property.availableFrom}</span>
                  </div>
                </div>

                {/* Contact Button */}
                <button 
                  onClick={() => setShowContactForm(true)}
                  className="w-full py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors mb-3 sm:mb-4"
                >
                  {t.contactOwner}
                </button>

                {/* Share Button */}
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="w-full py-2.5 sm:py-3 border-2 border-gray-300 hover:border-primary text-gray-700 text-sm sm:text-base font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t.share}
                </button>

                {/* Report */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    {t.anyConcerns}
                  </p>
                  <p className="text-sm text-center">
                    <button className="text-red-600 hover:text-red-700 font-semibold">
                      {t.reportIt}
                    </button>{" "}
                    <span className="text-gray-600">{t.toOurTeam}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Subscribe Section */}
      <SubscribeSection />

      {/* Contact Owner Form Modal */}
      <ContactOwnerForm 
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
        property={property}
        language={language}
      />

      {/* Share Modal */}
      {showShareModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowShareModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              maxWidth: '450px',
              width: '100%',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Share2 className="w-6 h-6 text-primary" />
                {t.shareProperty}
              </h2>
              <button
                onClick={() => setShowShareModal(false)}
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {copySuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    {t.linkCopied}
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    {t.copyLink}
                  </>
                )}
              </button>

              {/* Share via */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">{t.shareVia}</p>
                <div className="grid grid-cols-2 gap-3">
                  {/* WhatsApp */}
                  <button
                    onClick={handleShareWhatsApp}
                    className="py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={handleShareFacebook}
                    className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Facebook
                  </button>

                  {/* Twitter */}
                  <button
                    onClick={handleShareTwitter}
                    className="py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Twitter
                  </button>

                  {/* Email */}
                  <button
                    onClick={handleShareEmail}
                    className="py-3 px-4 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky WhatsApp Button */}
      <a
        href={`https://wa.me/${property.landlord.phone.replace(/\s/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in ${property.title} at ${property.location}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 md:w-12 md:h-12 bg-green-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 group animate-bounce"
        style={{
          animation: 'bounce 2s infinite'
        }}
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6" />
        
        {/* Tooltip */}
        <span className="absolute right-full mr-2 sm:mr-3 px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-lg hidden sm:block">
          Chat on WhatsApp with owner
          {/* Arrow */}
          <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></span>
        </span>
      </a>
    </div>
  );
}
