"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import PropertyCard from "@/components/PropertyCard";
import SubscribeSection from "@/components/SubscribeSection";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

type PropertyType = "all" | "pg" | "tenant";
type SortType = "price-low" | "price-high" | "newest" | "rooms";

// Map DB property to PropertyCard props
function mapProperty(p: any) {
  return {
    id: p._id as string,
    title: p.title as string,
    societyName: p.societyName as string | undefined,
    location: p.location as string,
    areaName: p.areaName as string | undefined,
    state: p.state as string | undefined,
    price: p.price as number,
    rooms: p.rooms as number,
    area: p.area as number,
    bhk: p.bhk as string | undefined,
    roomDetails: p.roomDetails as Record<string, { monthlyRent: string }> | undefined,
    images: (p.images || []) as string[],
    type: p.propertyType as "PG" | "Tenant",
    isNew: false,
    verified: !!p.isVerified,
    rating: p.averageRating ?? undefined,
    reviewsCount: p.reviewsCount ?? 0,
  };
}

function PropertiesPageContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const country = (params?.country as string) || "in";

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [activeTab, setActiveTab] = useState<PropertyType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [occupancy, setOccupancy] = useState<string[]>([]);
  const [pgFor, setPgFor] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [tenantPref, setTenantPref] = useState<string[]>([]);
  const [propCategory, setPropCategory] = useState<string[]>([]);
  const [verifiedPG, setVerifiedPG] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Temp filter states (drawer)
  const [tempPriceRange, setTempPriceRange] = useState([0, 200000]);
  const [tempOccupancy, setTempOccupancy] = useState<string[]>([]);
  const [tempPgFor, setTempPgFor] = useState<string[]>([]);
  const [tempSelectedCities, setTempSelectedCities] = useState<string[]>([]);
  const [tempTenantPref, setTempTenantPref] = useState<string[]>([]);
  const [tempPropCategory, setTempPropCategory] = useState<string[]>([]);
  const [tempVerifiedPG, setTempVerifiedPG] = useState(false);

  // Fetch cities dynamically from DB
  useEffect(() => {
    fetch(`/api/properties/city-stats?country=${country}&top=20`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.cities) {
          setAvailableCities(data.cities.map((c: { name: string }) => c.name).filter(Boolean));
        }
      })
      .catch(() => {});
  }, [country]);

  // Sync URL params → state AND fetch in one effect to avoid race condition
  useEffect(() => {
    const tab = searchParams.get("tab");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const pgForParam = searchParams.get("pgFor");
    const cityParam = searchParams.get("city");
    const occupancyParam = searchParams.get("occupancy");
    const tenantParam = searchParams.get("tenant");
    const propCategoryParam = searchParams.get("propertyType");

    const resolvedTab: PropertyType = tab === "pg" ? "pg" : tab === "tenant" ? "tenant" : "all";
    setActiveTab(resolvedTab);
    setSearchQuery(search || "");
    const resolvedMin = minPrice ? parseInt(minPrice) : 0;
    const resolvedMax = maxPrice ? parseInt(maxPrice) : 200000;
    setPriceRange([resolvedMin, resolvedMax]);
    setTempPriceRange([resolvedMin, resolvedMax]);
    if (pgForParam) { setPgFor([pgForParam]); setTempPgFor([pgForParam]); }
    else { setPgFor([]); setTempPgFor([]); }
    if (cityParam) { setSelectedCities([cityParam]); setTempSelectedCities([cityParam]); }
    else { setSelectedCities([]); setTempSelectedCities([]); }
    if (occupancyParam) { setOccupancy([occupancyParam]); setTempOccupancy([occupancyParam]); }
    else { setOccupancy([]); setTempOccupancy([]); }
    if (tenantParam) { setTenantPref([tenantParam]); setTempTenantPref([tenantParam]); }
    else { setTenantPref([]); setTempTenantPref([]); }
    if (propCategoryParam) { setPropCategory([propCategoryParam]); setTempPropCategory([propCategoryParam]); }
    else { setPropCategory([]); setTempPropCategory([]); }

    // Fetch using resolved values directly — no stale state
    const doFetch = async () => {
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        qs.set("country", country);
        qs.set("page", String(currentPage));
        qs.set("limit", String(itemsPerPage));
        if (resolvedTab === "pg") qs.set("type", "PG");
        if (resolvedTab === "tenant") qs.set("type", "Tenant");
        if (pgForParam) qs.set("pgFor", pgForParam);
        if (resolvedMin > 0) qs.set("minPrice", String(resolvedMin));
        if (resolvedMax < 200000) qs.set("maxPrice", String(resolvedMax));
        const res = await fetch(`/api/properties?${qs.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProperties(data.properties || []);
          setTotal(data.pagination?.total || 0);
        }
      } catch {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    doFetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, country, currentPage]);

  // Re-fetch when user changes tab or price filter manually (not from URL nav)
  const content = {
    en: {
      title: "All Properties", subtitle: "Find your perfect home from our extensive collection",
      search: "Search by property name, location, or price...", sortBy: "Sort by",
      filters: "Filters", showing: "Showing", properties: "properties",
      clearAll: "Clear All Filter", applyFilters: "Apply Filters",
      tabs: { all: "All Properties", pg: "PG", tenant: "Tenant" },
      sort: { "price-low": "Price: Low to High", "price-high": "Price: High to Low", "newest": "Newest First", "rooms": "Most Rooms" },
      filterSections: { occupancy: "Occupancy", pgFor: "PG For", price: "Price", city: "City", verifiedPG: "Verified PG", preferredTenants: "Preferred Tenants", propertyType: "Property Type" },
      occupancyOptions: ["Single", "Double", "Triple", "Four", "Other"],
      pgForOptions: ["Male", "Female", "Both"],
      tenantPrefOptions: ["Students", "Professionals", "Both"],
      propertyTypeOptions: ["Villa", "Flat", "House", "Penthouse"],
      cities: availableCities,
      noResults: "No properties found matching your criteria.",
      loading: "Loading properties...",
    },
    fr: {
      title: "Toutes les propriétés", subtitle: "Trouvez votre maison parfaite dans notre vaste collection",
      search: "Rechercher par nom, emplacement ou prix...", sortBy: "Trier par",
      filters: "Filtres", showing: "Affichage", properties: "propriétés",
      clearAll: "Effacer tous les filtres", applyFilters: "Appliquer les filtres",
      tabs: { all: "Toutes les propriétés", pg: "PG", tenant: "Locataire" },
      sort: { "price-low": "Prix: Bas à Élevé", "price-high": "Prix: Élevé à Bas", "newest": "Plus récent d'abord", "rooms": "Plus de chambres" },
      filterSections: { occupancy: "Occupation", pgFor: "PG Pour", price: "Prix", city: "Ville", verifiedPG: "PG vérifié", preferredTenants: "Locataires préférés", propertyType: "Type de propriété" },
      occupancyOptions: ["Simple", "Double", "Triple", "Quatre", "Autre"],
      pgForOptions: ["Male", "Female", "Both"],
      tenantPrefOptions: ["Students", "Professionals", "Both"],
      propertyTypeOptions: ["Villa", "Flat", "House", "Penthouse"],
      cities: availableCities,
      noResults: "Aucune propriété trouvée.",
      loading: "Chargement...",
    }
  };

  const t = content[language as keyof typeof content] || content.en;
  const tabs = [
    { id: "all" as PropertyType, label: t.tabs.all },
    { id: "pg" as PropertyType, label: t.tabs.pg },
    { id: "tenant" as PropertyType, label: t.tabs.tenant },
  ];

  const toggleFilter = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const openFilterDrawer = () => {
    setTempOccupancy(occupancy);
    setTempPgFor(pgFor);
    setTempPriceRange(priceRange);
    setTempSelectedCities(selectedCities);
    setTempTenantPref(tenantPref);
    setTempPropCategory(propCategory);
    setTempVerifiedPG(verifiedPG);
    setShowFilters(true);
  };

  const applyFilters = () => {
    const qs = new URLSearchParams(searchParams.toString());
    if (tempOccupancy.length > 0) qs.set("occupancy", tempOccupancy[0]); else qs.delete("occupancy");
    if (tempPgFor.length > 0) qs.set("pgFor", tempPgFor[0]); else qs.delete("pgFor");
    if (tempSelectedCities.length > 0) qs.set("city", tempSelectedCities[0]); else qs.delete("city");
    if (tempTenantPref.length > 0) qs.set("tenant", tempTenantPref[0]); else qs.delete("tenant");
    if (tempPropCategory.length > 0) qs.set("propertyType", tempPropCategory[0]); else qs.delete("propertyType");
    if (tempPriceRange[0] > 0) qs.set("minPrice", String(tempPriceRange[0])); else qs.delete("minPrice");
    if (tempPriceRange[1] < 200000) qs.set("maxPrice", String(tempPriceRange[1])); else qs.delete("maxPrice");
    qs.delete("page");
    router.push(`?${qs.toString()}`);
    setShowFilters(false);
  };

  const clearAllFilters = () => {
    setTempOccupancy([]);
    setTempPgFor([]);
    setTempPriceRange([0, 200000]);
    setTempSelectedCities([]);
    setTempTenantPref([]);
    setTempPropCategory([]);
    setTempVerifiedPG(false);
    router.push("?");
    setShowFilters(false);
  };

  // Client-side filtering on top of API results
  let filtered = properties.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      p.title?.toLowerCase().includes(q) ||
      p.pgName?.toLowerCase().includes(q) ||
      p.societyName?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      p.areaName?.toLowerCase().includes(q) ||
      p.fullAddress?.toLowerCase().includes(q) ||
      p.landmark?.toLowerCase().includes(q) ||
      p.propertyType?.toLowerCase().includes(q) ||
      String(p.price).includes(q);

    const matchesOccupancy = occupancy.length === 0 || occupancy.some(occ => {
      if (occ === "Single") return p.rooms === 1;
      if (occ === "Double") return p.rooms === 2;
      if (occ === "Triple") return p.rooms === 3;
      if (occ === "Four") return p.rooms === 4;
      return true;
    });

    const matchesPgFor = pgFor.length === 0 || pgFor.some(g =>
      p.pgFor?.toLowerCase() === g.toLowerCase() ||
      p.preferredGender?.toLowerCase() === g.toLowerCase() ||
      p.pgFor?.toLowerCase() === "both" ||
      p.preferredGender?.toLowerCase() === "both" ||
      g.toLowerCase() === "both"
    );

    const matchesCity = selectedCities.length === 0 ||
      selectedCities.some(c =>
        p.location?.toLowerCase().includes(c.toLowerCase()) ||
        p.areaName?.toLowerCase().includes(c.toLowerCase()) ||
        p.fullAddress?.toLowerCase().includes(c.toLowerCase())
      );

    const matchesTenantPref = tenantPref.length === 0 || tenantPref.some(tp =>
      p.tenantPreference?.toLowerCase() === tp.toLowerCase() ||
      p.tenantPreference?.toLowerCase() === "both" ||
      tp.toLowerCase() === "both"
    );

    const matchesPropCategory = propCategory.length === 0 || propCategory.some(cat =>
      p.category?.toLowerCase() === cat.toLowerCase()
    );

    return matchesSearch && matchesOccupancy && matchesPgFor && matchesCity && matchesTenantPref && matchesPropCategory;
  });

  // Client-side sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rooms") return b.rooms - a.rooms;
    return 0;
  });

  const totalPages = Math.ceil(filtered.length > 0 ? total / itemsPerPage : 0);
  const activeFilterCount = occupancy.length + pgFor.length + selectedCities.length + tenantPref.length + propCategory.length + (verifiedPG ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 200000 ? 1 : 0);

  const handleTabChange = (tab: PropertyType) => {
    const qs = new URLSearchParams(searchParams.toString());
    if (tab === "all") qs.delete("tab");
    else qs.set("tab", tab);
    qs.delete("page");
    router.push(`?${qs.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-lg text-white/90">{t.subtitle}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white shadow-md sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder={t.search} value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value as SortType)}
                onFocus={() => setIsSortOpen(true)} onBlur={() => setIsSortOpen(false)}
                className="appearance-none w-full md:w-auto px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary bg-white cursor-pointer font-medium text-gray-700">
                <option value="newest">{t.sort.newest}</option>
                <option value="price-low">{t.sort["price-low"]}</option>
                <option value="price-high">{t.sort["price-high"]}</option>
                <option value="rooms">{t.sort.rooms}</option>
              </select>
              <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
            </div>
            <button onClick={openFilterDrawer}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors relative">
              <SlidersHorizontal className="w-5 h-5" />
              {t.filters}
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      {showFilters && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowFilters(false)} />
          <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{t.filters}</h2>
                <div className="flex items-center gap-4">
                  <button onClick={clearAllFilters} className="text-primary hover:text-primary-dark font-semibold">{t.clearAll}</button>
                  <button onClick={() => setShowFilters(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Occupancy */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.filterSections.occupancy}</h3>
                <div className="flex flex-wrap gap-2">
                  {t.occupancyOptions.map(opt => (
                    <button key={opt} onClick={() => toggleFilter(tempOccupancy, setTempOccupancy, opt)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${tempOccupancy.includes(opt) ? "bg-primary text-white border-primary" : "bg-white text-gray-700 border-gray-300 hover:border-primary"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* PG For */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.filterSections.pgFor}</h3>
                <div className="flex flex-wrap gap-2">
                  {t.pgForOptions.map(opt => (
                    <button key={opt} onClick={() => toggleFilter(tempPgFor, setTempPgFor, opt)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${tempPgFor.includes(opt) ? "bg-primary text-white border-primary" : "bg-white text-gray-700 border-gray-300 hover:border-primary"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Tenants */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.filterSections.preferredTenants}</h3>
                <div className="flex flex-wrap gap-2">
                  {t.tenantPrefOptions.map(opt => (
                    <button key={opt} onClick={() => toggleFilter(tempTenantPref, setTempTenantPref, opt)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${tempTenantPref.includes(opt) ? "bg-primary text-white border-primary" : "bg-white text-gray-700 border-gray-300 hover:border-primary"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.filterSections.propertyType}</h3>
                <div className="flex flex-wrap gap-2">
                  {t.propertyTypeOptions.map(opt => (
                    <button key={opt} onClick={() => toggleFilter(tempPropCategory, setTempPropCategory, opt)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${tempPropCategory.includes(opt) ? "bg-primary text-white border-primary" : "bg-white text-gray-700 border-gray-300 hover:border-primary"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.filterSections.price}</h3>
                <div className="flex gap-4 mb-4">
                  <input type="number" value={tempPriceRange[0]}
                    onChange={e => setTempPriceRange([parseInt(e.target.value) || 0, tempPriceRange[1]])}
                    className="w-1/2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="MIN" />
                  <input type="number" value={tempPriceRange[1]}
                    onChange={e => setTempPriceRange([tempPriceRange[0], parseInt(e.target.value) || 200000])}
                    className="w-1/2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="MAX" />
                </div>
                <input type="range" min="0" max="200000" step="1000" value={tempPriceRange[1]}
                  onChange={e => setTempPriceRange([tempPriceRange[0], parseInt(e.target.value)])}
                  className="w-full" />
              </div>

              {/* City */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.filterSections.city}</h3>
                <div className="flex flex-wrap gap-2">
                  {t.cities.map(city => (
                    <button key={city} onClick={() => toggleFilter(tempSelectedCities, setTempSelectedCities, city)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${tempSelectedCities.includes(city) ? "bg-primary text-white border-primary" : "bg-white text-gray-700 border-gray-300 hover:border-primary"}`}>
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={applyFilters}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors">
                {t.applyFilters}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                className={`px-6 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${activeTab === tab.id ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-6">
          <p className="text-gray-600">
            {t.showing} <span className="font-semibold text-gray-900">{filtered.length}</span>
            {filtered.length !== total && <span className="text-gray-400"> of {total}</span>} {t.properties}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="h-64 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">{t.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => {
              const mapped = mapProperty(p);
              return <PropertyCard key={mapped.id} {...mapped} />;
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-primary hover:text-white border-2 border-gray-300 hover:border-primary"}`}>
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button key={page} onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-primary hover:text-white border-2 border-gray-300 hover:border-primary"}`}>
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>
            <button onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-primary hover:text-white border-2 border-gray-300 hover:border-primary"}`}>
              Next
            </button>
          </div>
        )}
      </div>

      <SubscribeSection />
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
      </div>
    }>
      <PropertiesPageContent />
    </Suspense>
  );
}
