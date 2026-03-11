"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Menu } from "@headlessui/react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FilterState {
  category: "PG" | "Tenant";
  location: string;
  minPrice: number;
  maxPrice: number;
  pgFor: "Girls" | "Boys" | "Both" | null;
  tenant: "Student" | "Professional" | "Both" | null;
  occupancy: "Single" | "Double" | "Triple" | "Four" | null;
  propertyType: "Flat" | "House" | "1BHK" | "2BHK" | "3BHK" | "4BHK" | null;
}

export default function FilterSection() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const [filters, setFilters] = useState<FilterState>({
    category: "PG",
    location: "",
    minPrice: 0,
    maxPrice: 50000,
    pgFor: null,
    tenant: null,
    occupancy: null,
    propertyType: null,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = ["PG", "Tenant"] as const;
  const pgForOptions = ["Girls", "Boys", "Both"] as const;
  const tenantOptions = ["Student", "Professional", "Both"] as const;
  const occupancyOptions = ["Single", "Double", "Triple", "Four"] as const;
  const propertyTypes = [
    "Flat",
    "House",
    "1BHK",
    "2BHK",
    "3BHK",
    "4BHK",
  ] as const;

  const getTranslatedOption = (option: string): string => {
    const key = option.toLowerCase();
    return t(`filters.${key}`) || option;
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
    
    // Add location as search query
    if (filters.location) {
      params.set("search", filters.location);
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
    
    // Navigate to properties page with filters
    router.push(`/properties?${params.toString()}`);
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    setFilters((prev) => ({
      ...prev,
      [type === "min" ? "minPrice" : "maxPrice"]: value,
    }));
  };

  return (
    <div className="px-4">
    <div className="w-full max-w-7xl mx-auto -mt-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6"
      >
        {/* Top Row Filters */}
        <div className="grid md:grid-cols-12 gap-4 mb-6">
          {/* Category Dropdown */}
          <div className="md:col-span-1">
            <Menu as="div" className="relative">
              <Menu.Button className="w-full flex items-center justify-between px-4 py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary-light transition-all duration-300">
                <span>{getTranslatedOption(filters.category)}</span>
                <ChevronDown className="w-5 h-5" />
              </Menu.Button>
              <AnimatePresence>
                <Menu.Items className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  {categories.map((cat) => (
                    <Menu.Item key={cat}>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            setFilters({ ...filters, category: cat })
                          }
                          className={`w-full text-left px-4 py-3 transition-colors ${
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

          {/* Location Input */}
          <div className="md:col-span-8">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                placeholder={t("filters.location")}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 outline-none"
              />
            </div>
          </div>

          {/* Advanced Filter Button */}
          <div className="md:col-span-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                showAdvanced
                  ? "bg-primary text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>{t("filters.moreFilters")}</span>
            </motion.button>
          </div>
        </div>

        {/* Price Range Section */}
        <div className="mb-2">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("filters.min")}
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) =>
                  handlePriceChange("min", Number(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("filters.range")}
              </label>
              <div className="relative pt-2">
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handlePriceChange("min", Number(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("filters.max")}
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) =>
                  handlePriceChange("max", Number(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <div className="flex-1">
              {/* Search Button */}
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSearch}
                  className="flex items-center w-full justify-center space-x-2 px-8 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="w-5 h-5" />
                  <span>{t("filters.searchProperties")}</span>
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
              <div className="border-t border-gray-200 pt-6 space-y-6">
                {/* PG For */}
                {filters.category === "PG" && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      {t("filters.pgFor")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
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
                          className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
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
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    {t("filters.preferredTenants")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
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
                        className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
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
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      {t("filters.occupancy")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
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
                          className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
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
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      {t("filters.propertyType")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
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
                          className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                            filters.propertyType === option
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-primary-light"
                          }`}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    </div>
  );
}
