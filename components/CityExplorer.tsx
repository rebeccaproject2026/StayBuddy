"use client";

import { motion } from "framer-motion";
import { MapPin, TrendingUp, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams } from "next/navigation";

interface CityCardProps {
  name: string;
  propertyCount: number;
  image: string;
  size?: "large" | "medium" | "small";
  trending?: boolean;
}

const CityCard = ({ name, propertyCount, image, size = "medium", trending }: CityCardProps) => {
  const { t } = useLanguage();

  const sizeClasses = {
    large: "col-span-1 md:col-span-2 row-span-1 md:row-span-2 h-[280px] md:h-[420px]",
    medium: "col-span-1 row-span-1 h-[280px] md:h-[200px]",
    small: "col-span-1 row-span-1 h-[280px] md:h-[200px]",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`relative ${sizeClasses[size]} rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:shadow-2xl transition-shadow duration-300`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={size === "large"}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10 group-hover:from-black/85 transition-all duration-300"></div>

      {/* Content */}
      <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-between">
        {/* Trending Badge */}
        {trending && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="self-start"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent rounded-full shadow-lg backdrop-blur-sm">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-semibold text-white">{t("cityExplorer.trending")}</span>
            </div>
          </motion.div>
        )}

        {/* City Info */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white/90" />
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                {name}
              </h3>
            </div>
            <p className="text-sm md:text-base text-white/90 font-medium pl-6 md:pl-7">
              {propertyCount} {propertyCount === 1 ? t("cityExplorer.property") : t("cityExplorer.properties")}
            </p>
          </div>

          {/* Hover Button */}
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary rounded-xl font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="text-sm">{t("cityExplorer.exploreNow")}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </div>
    </motion.div>
  );
};

export default function CityExplorer() {
  const { t } = useLanguage();
  const params = useParams();
  const country = params?.country as string;

  const indianCities = [
    {
      name: "Ahmedabad",
      propertyCount: 742,
      image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0",
      size: "large" as const,
      trending: true,
    },
    {
      name: "Surat",
      propertyCount: 418,
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2070&auto=format&fit=crop",
      size: "medium" as const,
    },
    {
      name: "Vadodara",
      propertyCount: 312,
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop",
      size: "medium" as const,
      trending: true,
    },
    {
      name: "Gandhinagar",
      propertyCount: 189,
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=2070&auto=format&fit=crop",
      size: "small" as const,
    },
    {
      name: "Rajkot",
      propertyCount: 254,
      image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?q=80&w=2070&auto=format&fit=crop",
      size: "small" as const,
    },
  ];

  const frenchCities = [
    {
      name: "Paris",
      propertyCount: 1284,
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop",
      size: "large" as const,
      trending: true,
    },
    {
      name: "Lyon",
      propertyCount: 563,
      image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?q=80&w=2069&auto=format&fit=crop",
      size: "medium" as const,
    },
    {
      name: "Marseille",
      propertyCount: 487,
      image: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?q=80&w=2044&auto=format&fit=crop",
      size: "medium" as const,
      trending: true,
    },
    {
      name: "Toulouse",
      propertyCount: 321,
      image: "https://images.unsplash.com/photo-1562979314-bee7453e911c?q=80&w=2070&auto=format&fit=crop",
      size: "small" as const,
    },
    {
      name: "Nice",
      propertyCount: 398,
      image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=2070&auto=format&fit=crop",
      size: "small" as const,
    },
  ];

  const cities = country === "fr" ? frenchCities : indianCities;



  return (
    <div className="w-full bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-10"
        >
          <h2 className="text-3xl md:text-4xl  font-bold text-gray-900 mb-2 md:mb-3">
            {t("cityExplorer.title")}
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            {t("cityExplorer.subtitle")}
          </p>
        </motion.div>

        {/* City Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 mb-10 ">
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className={
                city.size === "large"
                  ? "md:col-span-2 md:row-span-2"
                  : city.size === "medium"
                    ? "md:col-span-1 md:row-span-1"
                    : "md:col-span-1 md:row-span-1"
              }
            >
              <CityCard {...city} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all duration-300"
          >
            <span>{t("cityExplorer.viewAllCities")}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
