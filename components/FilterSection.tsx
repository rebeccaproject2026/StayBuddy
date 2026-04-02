
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { Menu } from "@headlessui/react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FilterState {
  category: "PG" | "Tenant";
  search: string;
  minPrice: number;
  maxPrice: number;
  pgFor: "Male" | "Female" | "Both" | null;
  tenant: "Students" | "Professionals" | "Both" | null;
  occupancy: "Single" | "Double" | "Triple" | "Four" | null;
  propertyType: "Villa" | "Flat" | "House" | "Penthouse" | null;
  city: string | null;
}

export default function FilterSection() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const country = params?.country as string || 'in';
  
  const [filters, setFilters] = useState<FilterState>({
    category: "PG",
    search: "",
    minPrice: 0,
    maxPrice: 50000,
    pgFor: null,
    tenant: null,
    occupancy: null,
    propertyType: null,
    city: null,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = ["PG", "Tenant"] as const;
  const pgForOptions = ["Male", "Female", "Both"] as const;
  const tenantOptions = ["Students", "Professionals", "Both"] as const;
  const occupancyOptions = ["Single", "Double", "Triple", "Four"] as const;
  const propertyTypes = [
    "Villa",
    "Flat",
    "House",
    "Penthouse",
  ] as const;

  // City options based on country — must match values stored in property.location
  const indiaCities = [
    "Ahmedabad",
    "Gandhinagar",
  ] as const;

  const franceCities = [
    "Talence",
    "Venette",
    "Aix-en-Provence",
    "Montpellier Centre",
    "Paris 16th",
    "Lyon 7th",
    "Marseille 8th",
    "Toulouse Centre",
  ] as const;

  // Get cities based on current country
  const cityOptions = country === 'in' || country === 'india' ? indiaCities : franceCities;

  const getTranslatedOption = (option: string): string => {
    // Normalize key: lowercase, strip spaces/hyphens for lookup
    const key = option.toLowerCase().replace(/\s+/g, "").replace(/-/g, "");
    const translated = t(`filters.${key}`);
    // t() returns the key itself if not found, so check against the dotted key
    return translated !== `filters.${key}` ? translated : option;
  };

  const handleSearch = () => {
    // Build URL parameters from filters
    const params = new URLSearchParams();
    
    // Add category (map to tab)
    if (filters.category === "PG") {
      params.set("tab", "pg");
    } else if (filters.category === "Tenant") {
      params.set("tab", "tenant");
    }
    
    // Add search query (property name or city)
    if (filters.search) {
      params.set("search", filters.search);
    }
    
    // Add price range
    params.set("minPrice", filters.minPrice.toString());
    params.set("maxPrice", filters.maxPrice.toString());
    
    // Add PG specific filters
    if (filters.pgFor) {
      params.set("pgFor", filters.pgFor);
    }
    
    // Add tenant preference
    if (filters.tenant) {
      params.set("tenant", filters.tenant);
    }
    
    // Add occupancy
    if (filters.occupancy) {
      params.set("occupancy", filters.occupancy);
    }
    
    // Add property type
    if (filters.propertyType) {
      params.set("propertyType", filters.propertyType);
    }
    
    // Add city filter (from advanced filters)
    if (filters.city) {
      params.set("city", filters.city);
    }
    
    // Navigate to properties page with filters
    router.push(`/${country}/properties?${params.toString()}`);
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    setFilters((prev) => ({
      ...prev,
      [type === "min" ? "minPrice" : "maxPrice"]: value,
    }));
  };

  return (
    <div className="px-3 sm:px-4 lg:px-6">
    <div className="w-full max-w-7xl mx-auto -mt-10 sm:-mt-16 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-xl p-4 sm:p-6"
      >
        {/* Top Row Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 mb-4 sm:mb-5">
          {/* Category Dropdown */}
          <div className="sm:col-span-1 lg:col-span-2">
            <Menu as="div" className="relative">
              <Menu.Button className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-primary text-primary rounded-xl text-sm sm:text-base font-semibold hover:bg-primary-light transition-all duration-300">
                <span>{getTranslatedOption(filters.category)}</span>
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
              </Menu.Button>
              <AnimatePresence>
                <Menu.Items className="absolute top-full left-0 mt-2 w-full min-w-[120px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  {categories.map((cat) => (
                    <Menu.Item key={cat}>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            setFilters({ ...filters, category: cat })
                          }
                          className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base transition-colors ${
                            active ? "bg-primary-light" : ""
                          } ${filters.category === cat ? "bg-primary text-white" : ""}`}
                        >
                          {getTranslatedOption(cat)}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </AnimatePresence>
            </Menu>
          </div>

          {/* Search Input */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-7">
            <div className="relative">
              <label htmlFor="filter-search" className="sr-only">Search by property name or city</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                id="filter-search"
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t("filters.searchPlaceholder")}
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 outline-none"
              />
            </div>
          </div>

          {/* Advanced Filter Button */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-semibold transition-all duration-300 ${
                showAdvanced
                  ? "bg-primary text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">{t("filters.moreFilters")}</span>
            </motion.button>
          </div>
        </div>

        {/* Price Range Section */}
        <div className="mb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-3 sm:gap-4">
            {/* Min Price */}
            <div className="flex-1">
              <label htmlFor="filter-min-price" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                {t("filters.min")}
              </label>
              <input
                id="filter-min-price"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handlePriceChange("min", Number(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            {/* Price Range Slider */}
            <div className="flex-1 col-span-1 sm:col-span-2 lg:col-span-1">
              <label htmlFor="filter-price-range" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                {t("filters.range")}
              </label>
              <div className="relative pt-1 sm:pt-2">
                <input
                  id="filter-price-range"
                  type="range"
                  min="0"
                  max="100000"
                  value={filters.minPrice}
                  onChange={(e) => handlePriceChange("min", Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            {/* Max Price */}
            <div className="flex-1">
              <label htmlFor="filter-max-price" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                {t("filters.max")}
              </label>
              <input
                id="filter-max-price"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange("max", Number(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            {/* Search Button */}
            <div className="flex-1 col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="lg:mt-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSearch}
                  className="flex items-center w-full justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="whitespace-nowrap">{t("filters.searchProperties")}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters Dropdown */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-200 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
                {/* PG For */}
                {filters.category === "PG" && (
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      {t("filters.pgFor")}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {pgForOptions.map((option) => (
                        <motion.button
                          key={option}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            setFilters({
                              ...filters,
                              pgFor: filters.pgFor === option ? null : option,
                            })
                          }
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg border transition-all duration-300 ${
                            filters.pgFor === option
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-primary-light"
                          }`}
                        >
                          {getTranslatedOption(option)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferred Tenants */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    {t("filters.preferredTenants")}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {tenantOptions.map((option) => (
                      <motion.button
                        key={option}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() =>
                          setFilters({
                            ...filters,
                            tenant: filters.tenant === option ? null : option,
                          })
                        }
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg border transition-all duration-300 ${
                          filters.tenant === option
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-primary-light"
                        }`}
                      >
                        {getTranslatedOption(option)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Occupancy */}
                {filters.category === "PG" && (
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      {t("filters.occupancy")}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {occupancyOptions.map((option) => (
                        <motion.button
                          key={option}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            setFilters({
                              ...filters,
                              occupancy:
                                filters.occupancy === option ? null : option,
                            })
                          }
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg border transition-all duration-300 ${
                            filters.occupancy === option
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-primary-light"
                          }`}
                        >
                          {getTranslatedOption(option)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property Type */}
                {filters.category === "Tenant" && (
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      {t("filters.propertyType")}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {propertyTypes.map((option) => (
                        <motion.button
                          key={option}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            setFilters({
                              ...filters,
                              propertyType:
                                filters.propertyType === option ? null : option,
                            })
                          }
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg border transition-all duration-300 ${
                            filters.propertyType === option
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-primary-light"
                          }`}
                        >
                          {getTranslatedOption(option)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* City Filter */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    {t("filters.city")}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {cityOptions.map((option) => (
                      <motion.button
                        key={option}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() =>
                          setFilters({
                            ...filters,
                            city: filters.city === option ? null : option,
                          })
                        }
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg border transition-all duration-300 ${
                          filters.city === option
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-primary-light"
                        }`}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    </div>
  );
}
