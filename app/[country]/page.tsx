"use client";

import Link from "@/components/LocalizedLink";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import dynamic from "next/dynamic";
import FilterSection from "@/components/FilterSection";

// Lazy-load below-the-fold sections — keeps main-thread parse cost off the critical path
const PropertyListings = dynamic(() => import("@/components/PropertyListings"), { ssr: false });
const CityExplorer     = dynamic(() => import("@/components/CityExplorer"),     { ssr: false });
const WhyChooseUs      = dynamic(() => import("@/components/WhyChooseUs"),      { ssr: false });
const RentingExperience= dynamic(() => import("@/components/RentingExperience"),{ ssr: false });
const OwnerSection     = dynamic(() => import("@/components/OwnerSection"),     { ssr: false });
const CallToActionCards= dynamic(() => import("@/components/CallToActionCards"),{ ssr: false });
const SubscribeSection = dynamic(() => import("@/components/SubscribeSection"), { ssr: false });

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section with Background Image */}
      <div className="relative min-h-[420px] sm:min-h-[450px] overflow-hidden">
        <Image
          src="/homebg.jpeg"
          alt="StayBuddy hero background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Animated Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/60" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 pb-20 sm:pb-24">
          <div className="text-center space-y-4 sm:space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-sm font-medium animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              {t("home.heroBadge")}
            </div>

            {/* Heading */}
            <h1 className="text-3xl esm:text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg px-2 animate-fade-in-up">
              {t("home.title")}
            </h1>

            {/* Subtitle */}
            <p className="text-sm esm:text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow px-4 animate-fade-in-up [animation-delay:150ms]">
              {t("home.subtitle")}
            </p>

            {/* Buttons */}
            <div className="flex flex-col esm:flex-row gap-3 sm:gap-4 justify-center items-center mt-6 sm:mt-8 px-6 esm:px-0 animate-fade-in-up [animation-delay:280ms]">
              <Link href="/signup" className="w-full esm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.06, y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.25)" }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 380, damping: 20 }}
                  className="w-full esm:w-auto px-8 py-3 sm:py-4 bg-accent text-white rounded-xl font-semibold shadow-lg hover:bg-accent-hover transition-colors duration-300 text-sm sm:text-base"
                >
                  {t("home.getStarted")}
                </motion.button>
              </Link>
              <Link href="/properties" className="w-full esm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.06, y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 380, damping: 20 }}
                  className="w-full esm:w-auto px-8 py-3 sm:py-4 bg-white text-primary rounded-xl font-semibold hover:bg-gray-50 shadow-lg transition-colors duration-300 text-sm sm:text-base"
                >
                  {t("home.browseListing")}
                </motion.button>
              </Link>
            </div>
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
