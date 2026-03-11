"use client";

import Link from "@/components/LocalizedLink";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import FilterSection from "@/components/FilterSection";
import PropertyListings from "@/components/PropertyListings";
import CityExplorer from "@/components/CityExplorer";
import WhyChooseUs from "@/components/WhyChooseUs";
import RentingExperience from "@/components/RentingExperience";
import OwnerSection from "@/components/OwnerSection";
import CallToActionCards from "@/components/CallToActionCards";
import SubscribeSection from "@/components/SubscribeSection";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div 
        className="relative min-h-[400px] bg-cover bg-center bg-no-repeat px-4"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/60"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              {t("home.title")}
            </h1>
            <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto drop-shadow">
              {t("home.subtitle")}
            </p>
            <div className="flex gap-4 justify-center mt-8">
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-accent text-white rounded-xl font-semibold shadow-lg hover:bg-accent-hover hover:shadow-xl transition-all duration-300"
                >
                  {t("home.getStarted")}
                </motion.button>
              </Link>
              <Link href="/properties">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-gray-50 shadow-lg transition-all duration-300"
                >
                  {t("home.browseListing")}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filter Section */}
      <FilterSection />

      

      {/* Property Listings */}
      <PropertyListings />

      {/* City Explorer */}
      <CityExplorer />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Renting Experience Section */}
      <RentingExperience />

      <OwnerSection />

      {/* Call to Action Cards */}
      <CallToActionCards />

      {/* Subscribe Section */}
      <SubscribeSection />
    </div>
  );
}
