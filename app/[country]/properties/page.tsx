"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import PropertyCard from "@/components/PropertyCard";
import SubscribeSection from "@/components/SubscribeSection";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

// Indian properties: IDs start with "1" → shown on /in
// French properties: IDs start with "2" → shown on /fr
const allProperties = [
  // ── Indian Properties (Gujarat) ──
  {
    id: "101",
    title: "Premium PG in Navrangpura",
    location: "Navrangpura, Ahmedabad, Gujarat",
    price: 15000,
    rooms: 1,
    area: 25,
    type: "PG" as const,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    ],
    badge: "Premium",
    verified: true,
    rating: 4.8,
    reviewsCount: 56,
  },
  {
    id: "102",
    title: "Cozy 2BHK Apartment",
    location: "Info City, Gandhinagar, Gujarat",
    price: 25000,
    rooms: 2,
    area: 75,
    type: "Tenant" as const,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewsCount: 35,
  },
  {
    id: "103",
    title: "Student-Friendly PG",
    location: "Vesu, Surat, Gujarat",
    price: 8500,
    rooms: 1,
    area: 18,
    type: "PG" as const,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    ],
    isNew: true,
    verified: false,
    rating: 4.1,
    reviewsCount: 15,
  },
  {
    id: "104",
    title: "Luxury Independent House",
    location: "Alkapuri, Vadodara, Gujarat",
    price: 55000,
    rooms: 4,
    area: 140,
    type: "Tenant" as const,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    ],
    verified: true,
    rating: 4.9,
    reviewsCount: 22,
  },
  {
    id: "105",
    title: "Affordable PG for Boys",
    location: "Vastrapur, Ahmedabad, Gujarat",
    price: 6500,
    rooms: 1,
    area: 20,
    type: "PG" as const,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
    ],
    rating: 3.9,
    reviewsCount: 12,
  },
  {
    id: "106",
    title: "Modern 3BHK Flat",
    location: "Sector 21, Gandhinagar, Gujarat",
    price: 35000,
    rooms: 3,
    area: 110,
    type: "Tenant" as const,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    ],
    isNew: true,
    rating: 4.7,
    reviewsCount: 41,
  },
  {
    id: "107",
    title: "Girls PG with Meals",
    location: "Satellite, Ahmedabad, Gujarat",
    price: 11000,
    rooms: 1,
    area: 22,
    type: "PG" as const,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    ],
    verified: true,
    badge: "Meals Included",
    rating: 4.6,
    reviewsCount: 29,
  },
  {
    id: "108",
    title: "Spacious Villa with Garden",
    location: "Adajan, Surat, Gujarat",
    price: 95000,
    rooms: 5,
    area: 300,
    type: "Tenant" as const,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
    ],
    verified: true,
    rating: 5.0,
    reviewsCount: 14,
  },
  // ── French Properties ──
  {
    id: "201",
    title: "Beautiful Apartment with Balcony",
    location: "10 Rue Georges Pompidou, Talence, France",
    price: 1100,
    rooms: 3,
    area: 63,
    type: "Tenant" as const,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    ],
    isNew: true,
    verified: true,
    rating: 4.6,
    reviewsCount: 24,
  },
  {
    id: "202",
    title: "Spacious Studio Apartment",
    location: "Rue du Dépôt, 60280 Venette, France",
    price: 695,
    rooms: 1,
    area: 37,
    type: "PG" as const,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    ],
    isNew: true,
    verified: false,
    rating: 3.8,
    reviewsCount: 12,
  },
  {
    id: "203",
    title: "Modern Apartment with Garden View",
    location: "Aix-en-Provence, Bouches-du-Rhône, France",
    price: 1500,
    rooms: 3,
    area: 70,
    type: "Tenant" as const,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
    ],
    isNew: true,
    verified: true,
    rating: 4.9,
    reviewsCount: 42,
  },
  {
    id: "204",
    title: "Cozy Studio Near University",
    location: "Montpellier Centre, Hérault, France",
    price: 560,
    rooms: 1,
    area: 32,
    type: "PG" as const,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewsCount: 8,
  },
  {
    id: "205",
    title: "Luxury Penthouse",
    location: "Paris 16th, Île-de-France, France",
    price: 2800,
    rooms: 4,
    area: 120,
    type: "Tenant" as const,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    ],
    badge: "Premium",
    verified: true,
    rating: 5.0,
    reviewsCount: 18,
  },
  {
    id: "206",
    title: "Student-Friendly Apartment",
    location: "Lyon 7th, Rhône-Alpes, France",
    price: 850,
    rooms: 2,
    area: 45,
    type: "PG" as const,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewsCount: 35,
  },
  {
    id: "207",
    title: "Charming Apartment Near Metro",
    location: "Marseille 8th, Bouches-du-Rhône, France",
    price: 1200,
    rooms: 3,
    area: 75,
    type: "Tenant" as const,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    ],
    isNew: true,
    rating: 4.5,
    reviewsCount: 15,
  },
  {
    id: "208",
    title: "Renovated Studio",
    location: "Toulouse Centre, Haute-Garonne, France",
    price: 650,
    rooms: 1,
    area: 28,
    type: "PG" as const,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    ],
    rating: 3.9,
    reviewsCount: 22,
  },
];


type PropertyType = "all" | "pg" | "tenant";
type SortType = "price-low" | "price-high" | "newest" | "rooms";

function PropertiesPageContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<PropertyType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  // Applied filter states (used for actual filtering)
  const [occupancy, setOccupancy] = useState<string[]>([]);
  const [pgFor, setPgFor] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [foodProvided, setFoodProvided] = useState<string[]>([]);
  const [preferredTenants, setPreferredTenants] = useState<string[]>([]);
  const [tenantExperience, setTenantExperience] = useState<string[]>([]);
  const [verifiedPG, setVerifiedPG] = useState(false);

  // Temporary filter states (used in the drawer before applying)
  const [tempOccupancy, setTempOccupancy] = useState<string[]>([]);
  const [tempPgFor, setTempPgFor] = useState<string[]>([]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 50000]);
  const [tempAmenities, setTempAmenities] = useState<string[]>([]);
  const [tempFoodProvided, setTempFoodProvided] = useState<string[]>([]);
  const [tempPreferredTenants, setTempPreferredTenants] = useState<string[]>([]);
  const [tempTenantExperience, setTempTenantExperience] = useState<string[]>([]);
  const [tempVerifiedPG, setTempVerifiedPG] = useState(false);

  // Apply URL parameters on mount
  useEffect(() => {
    const tab = searchParams.get("tab");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const pgForParam = searchParams.get("pgFor");
    const tenantParam = searchParams.get("tenant");
    const occupancyParam = searchParams.get("occupancy");
    
    // Apply tab filter
    if (tab === "pg" || tab === "tenant") {
      setActiveTab(tab);
    }
    
    // Apply search query
    if (search) {
      setSearchQuery(search);
    }
    
    // Apply price range
    if (minPrice && maxPrice) {
      const min = parseInt(minPrice);
      const max = parseInt(maxPrice);
      setPriceRange([min, max]);
      setTempPriceRange([min, max]);
    }
    
    // Apply PG For filter
    if (pgForParam) {
      setPgFor([pgForParam]);
      setTempPgFor([pgForParam]);
    }
    
    // Apply Preferred Tenants filter
    if (tenantParam) {
      setPreferredTenants([tenantParam]);
      setTempPreferredTenants([tenantParam]);
    }
    
    // Apply Occupancy filter
    if (occupancyParam) {
      setOccupancy([occupancyParam]);
      setTempOccupancy([occupancyParam]);
    }
  }, [searchParams]);

  const content = {
    en: {
      title: "All Properties",
      subtitle: "Find your perfect home from our extensive collection",
      search: "Search by location, price, or property type...",
      sortBy: "Sort by",
      filters: "Filters",
      showing: "Showing",
      properties: "properties",
      clearAll: "Clear All Filter",
      applyFilters: "Apply Filters",
      tabs: {
        all: "All Properties",
        pg: "PG",
        tenant: "Tenant"
      },
      sort: {
        "price-low": "Price: Low to High",
        "price-high": "Price: High to Low",
        "newest": "Newest First",
        "rooms": "Most Rooms"
      },
      filterSections: {
        occupancy: "Occupancy",
        pgFor: "PG For",
        price: "Price",
        amenities: "Amenities",
        foodProvided: "Food Provided",
        preferredTenants: "Preferred Tenants",
        tenantExperience: "Tenant Experience",
        verifiedPG: "Verified PG"
      },
      occupancyOptions: ["Single", "Double", "Triple", "Four", "Other"],
      pgForOptions: ["Girls", "Boys", "Both"],
      amenitiesOptions: ["Wi-Fi", "AC", "Power Backup", "Room Cleaning", "Washroom"],
      foodOptions: ["Food Provided", "Non veg Allowed", "Kitchen For Self-Cooking"],
      tenantOptions: ["Students", "Professionals"],
      experienceOptions: ["last 5 year", "last 10 year", "Any"]
    },
    fr: {
      title: "Toutes les propriétés",
      subtitle: "Trouvez votre maison parfaite dans notre vaste collection",
      search: "Rechercher par emplacement, prix ou type de propriété...",
      sortBy: "Trier par",
      filters: "Filtres",
      showing: "Affichage",
      properties: "propriétés",
      clearAll: "Effacer tous les filtres",
      applyFilters: "Appliquer les filtres",
      tabs: {
        all: "Toutes les propriétés",
        pg: "PG",
        tenant: "Locataire"
      },
      sort: {
        "price-low": "Prix: Bas à Élevé",
        "price-high": "Prix: Élevé à Bas",
        "newest": "Plus récent d'abord",
        "rooms": "Plus de chambres"
      },
      filterSections: {
        occupancy: "Occupation",
        pgFor: "PG Pour",
        price: "Prix",
        amenities: "Équipements",
        foodProvided: "Nourriture fournie",
        preferredTenants: "Locataires préférés",
        tenantExperience: "Expérience locataire",
        verifiedPG: "PG vérifié"
      },
      occupancyOptions: ["Simple", "Double", "Triple", "Quatre", "Autre"],
      pgForOptions: ["Filles", "Garçons", "Les deux"],
      amenitiesOptions: ["Wi-Fi", "Climatisation", "Alimentation de secours", "Nettoyage", "Salle de bain"],
      foodOptions: ["Nourriture fournie", "Non végétarien autorisé", "Cuisine pour cuisiner"],
      tenantOptions: ["Étudiants", "Professionnels"],
      experienceOptions: ["5 dernières années", "10 dernières années", "N'importe"]
    }
  };

  const t = content[language];

  const tabs = [
    { id: "all" as PropertyType, label: t.tabs.all },
    { id: "pg" as PropertyType, label: t.tabs.pg },
    { id: "tenant" as PropertyType, label: t.tabs.tenant },
  ];

  const toggleFilter = (filterArray: string[], setFilter: Function, value: string) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter((item: string) => item !== value));
    } else {
      setFilter([...filterArray, value]);
    }
  };

  // Open filter drawer and load current filters into temp states
  const openFilterDrawer = () => {
    setTempOccupancy(occupancy);
    setTempPgFor(pgFor);
    setTempPriceRange(priceRange);
    setTempAmenities(amenities);
    setTempFoodProvided(foodProvided);
    setTempPreferredTenants(preferredTenants);
    setTempTenantExperience(tenantExperience);
    setTempVerifiedPG(verifiedPG);
    setShowFilters(true);
  };

  // Apply filters - copy temp states to actual filter states
  const applyFilters = () => {
    setOccupancy(tempOccupancy);
    setPgFor(tempPgFor);
    setPriceRange(tempPriceRange);
    setAmenities(tempAmenities);
    setFoodProvided(tempFoodProvided);
    setPreferredTenants(tempPreferredTenants);
    setTenantExperience(tempTenantExperience);
    setVerifiedPG(tempVerifiedPG);
    setShowFilters(false);
  };

  const clearAllFilters = () => {
    setTempOccupancy([]);
    setTempPgFor([]);
    setTempPriceRange([0, 50000]);
    setTempAmenities([]);
    setTempFoodProvided([]);
    setTempPreferredTenants([]);
    setTempTenantExperience([]);
    setTempVerifiedPG(false);
  };

  // Filter and sort properties
  const params = useParams();
  const country = params?.country as string || 'in';

  let filteredProperties = allProperties.filter((property) => {
    // The mock data is generated such that Indian IDs begin with "1" and French IDs begin with "2"
    const propertyCountry = property.id.startsWith("2") ? "fr" : "in";
    
    // Validate country bounds first
    if (propertyCountry !== country) return false;

    const query = searchQuery.toLowerCase().trim();
    
    // Enhanced search filter - searches by location, price, and property type
    const matchesSearch = query === "" || 
      // Search by location
      property.location.toLowerCase().includes(query) ||
      property.title.toLowerCase().includes(query) ||
      // Search by property type (pg, tenant)
      property.type.toLowerCase().includes(query) ||
      // Search by price (e.g., "1000", "€1000", "1000€")
      property.price.toString().includes(query.replace(/[€\s]/g, '')) ||
      // Search by city/area name
      property.location.split(',').some(part => part.trim().toLowerCase().includes(query)) ||
      // Search by room count (e.g., "3 rooms", "3 bedroom")
      (query.includes('room') && property.rooms.toString() === query.match(/\d+/)?.[0]) ||
      (query.includes('bedroom') && property.rooms.toString() === query.match(/\d+/)?.[0]);
    
    // Price filter
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    
    // Room/Occupancy filter (if any selected)
    const matchesOccupancy = occupancy.length === 0 || occupancy.some(occ => {
      if (occ === "Single") return property.rooms === 1;
      if (occ === "Double") return property.rooms === 2;
      if (occ === "Triple") return property.rooms === 3;
      if (occ === "Four") return property.rooms === 4;
      return true;
    });
    
    // Property type filter (tab filter)
    const matchesType = activeTab === "all" || 
                       (activeTab === "pg" && property.type === "PG") ||
                       (activeTab === "tenant" && property.type === "Tenant");
    
    return matchesSearch && matchesPrice && matchesOccupancy && matchesType;
  });

  // Sort properties
  filteredProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rooms":
        return b.rooms - a.rooms;
      case "newest":
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleTabChange = (tab: PropertyType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyFilters = () => {
    applyFilters();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 when search changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-lg text-white/90">{t.subtitle}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white shadow-md sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortType);
                  setIsSortOpen(false);
                }}
                onFocus={() => setIsSortOpen(true)}
                onBlur={() => setIsSortOpen(false)}
                onClick={(e) => {
                  // Toggle state when clicking on already focused select
                  if (document.activeElement === e.currentTarget) {
                    setIsSortOpen(prev => !prev);
                  }
                }}
                className="appearance-none w-full md:w-auto px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors bg-white cursor-pointer font-medium text-gray-700"
              >
                <option value="newest">{t.sort.newest}</option>
                <option value="price-low">{t.sort["price-low"]}</option>
                <option value="price-high">{t.sort["price-high"]}</option>
                <option value="rooms">{t.sort.rooms}</option>
              </select>
              <ChevronDown 
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform duration-200 ${
                  isSortOpen ? 'rotate-180' : ''
                }`} 
              />
            </div>

            {/* Filters Button */}
            <button
              onClick={openFilterDrawer}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors relative"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {t.filters}
              {/* Active filters count badge */}
              {(occupancy.length + pgFor.length + amenities.length + foodProvided.length + preferredTenants.length + tenantExperience.length + (verifiedPG ? 1 : 0)) > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {occupancy.length + pgFor.length + amenities.length + foodProvided.length + preferredTenants.length + tenantExperience.length + (verifiedPG ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Sidebar */}
      {showFilters && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
            onClick={() => setShowFilters(false)}
          ></div>
          
          {/* Filter Panel */}
          <div 
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 overflow-y-auto animate-slideInRight"
            style={{
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{t.filters}</h2>
                <div className="flex items-center gap-4">
                 {/* Clear All */}
              <button
                onClick={clearAllFilters}
                className="w-full py-2 text-primary hover:text-primary-dark font-semibold text-right"
              >
                {t.clearAll}
              </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                </div>
              </div>

              {/* Occupancy */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.filterSections.occupancy}</h3>
                <div className="flex flex-wrap gap-2">
                  {t.occupancyOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleFilter(tempOccupancy, setTempOccupancy, option)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        tempOccupancy.includes(option)
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* PG For */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.filterSections.pgFor}</h3>
                <div className="flex flex-wrap gap-2">
                  {t.pgForOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleFilter(tempPgFor, setTempPgFor, option)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        tempPgFor.includes(option)
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.filterSections.price}</h3>
                <div className="flex gap-4 mb-4">
                  <input
                    type="number"
                    value={tempPriceRange[0]}
                    onChange={(e) => setTempPriceRange([parseInt(e.target.value), tempPriceRange[1]])}
                    className="w-1/2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="MIN"
                  />
                  <input
                    type="number"
                    value={tempPriceRange[1]}
                    onChange={(e) => setTempPriceRange([tempPriceRange[0], parseInt(e.target.value)])}
                    className="w-1/2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="MAX"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="10"
                  value={tempPriceRange[1]}
                  onChange={(e) => setTempPriceRange([tempPriceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.filterSections.amenities}</h3>
                <div className="space-y-2">
                  {t.amenitiesOptions.map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempAmenities.includes(option)}
                        onChange={() => toggleFilter(tempAmenities, setTempAmenities, option)}
                        className="w-5 h-5 text-primary rounded focus:ring-primary"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Food Provided */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.filterSections.foodProvided}</h3>
                <div className="space-y-2">
                  {t.foodOptions.map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempFoodProvided.includes(option)}
                        onChange={() => toggleFilter(tempFoodProvided, setTempFoodProvided, option)}
                        className="w-5 h-5 text-primary rounded focus:ring-primary"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preferred Tenants */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.filterSections.preferredTenants}</h3>
                <div className="flex flex-wrap gap-2">
                  {t.tenantOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleFilter(tempPreferredTenants, setTempPreferredTenants, option)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        tempPreferredTenants.includes(option)
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenant Experience */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.filterSections.tenantExperience}</h3>
                <div className="flex flex-wrap gap-2">
                  {t.experienceOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleFilter(tempTenantExperience, setTempTenantExperience, option)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        tempTenantExperience.includes(option)
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified PG */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.filterSections.verifiedPG}</h3>
                <button
                  onClick={() => setTempVerifiedPG(!tempVerifiedPG)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    tempVerifiedPG
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                  }`}
                >
                  verified PG
                </button>
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApplyFilters}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors"
              >
                {t.applyFilters}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Property Type Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-6 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {t.showing} <span className="font-semibold text-gray-900">{filteredProperties.length}</span> {t.properties}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-primary hover:text-white border-2 border-gray-300 hover:border-primary"
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 hover:bg-primary hover:text-white border-2 border-gray-300 hover:border-primary"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-primary hover:text-white border-2 border-gray-300 hover:border-primary"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Subscribe Section */}
      <SubscribeSection />
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    }>
      <PropertiesPageContent />
    </Suspense>
  );
}
