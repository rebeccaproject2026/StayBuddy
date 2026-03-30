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
        className="relative min-h-[400px] bg-cover bg-center bg-no-repeat px-4 sm:px-6 md:min-h-[400px] overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        {/* Animated Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Subtle background zoom */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop')",
            zIndex: -1,
          }}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto py-14 esm:py-20 ">
          <div className="text-center space-y-4 sm:space-y-6">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Find your perfect stay
            </motion.div>

            {/* Heading — word by word */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg"
            >
              {t("home.title")}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.42, ease: "easeOut" }}
              className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow"
            >
              {t("home.subtitle")}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.58, ease: "easeOut" }}
              className="flex flex-col esm:flex-row gap-3 sm:gap-4 justify-center items-center mt-6 sm:mt-8"
            >
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.06, y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.25)" }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 380, damping: 20 }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-4 bg-accent text-white rounded-xl font-semibold shadow-lg hover:bg-accent-hover transition-colors duration-300"
                >
                  {t("home.getStarted")}
                </motion.button>
              </Link>
              <Link href="/properties">
                <motion.button
                  whileHover={{ scale: 1.06, y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 380, damping: 20 }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-4 bg-white text-primary rounded-xl font-semibold hover:bg-gray-50 shadow-lg transition-colors duration-300"
                >
                  {t("home.browseListing")}
                </motion.button>
              </Link>
            </motion.div>
          </div>
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
