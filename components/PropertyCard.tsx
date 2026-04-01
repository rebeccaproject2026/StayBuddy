"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, ShieldCheck, ShieldOff } from "lucide-react";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyCardProps {
  id: string;
  title: string;
  societyName?: string;
  areaName?: string;
  state?: string;
  location: string;
  price: number;
  rooms: number;
  area: number;
  images: string[];
  isNew?: boolean;
  badge?: string;
  type?: "PG" | "Tenant";
  verified?: boolean;
  rating?: number;
  reviewsCount?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, newState: boolean) => void;
}

export default function PropertyCard({
  id,
  title,
  societyName,
  areaName,
  state,
  location,
  price,
  images,
  isNew = false,
  badge,
  type = "Tenant",
  verified = false,
  rating,
  reviewsCount,
  isFavorite: isFavoriteProp = false,
  onToggleFavorite,
}: PropertyCardProps) {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(isFavoriteProp);
  const [isTogglingFav, setIsTogglingFav] = useState(false);
  const [direction, setDirection] = useState(0);

  // Sync when parent updates favorites
  useEffect(() => {
    setIsFavorite(isFavoriteProp);
  }, [isFavoriteProp]);

  // Currency symbol based on language from translations
  const currencySymbol = t('currency.symbol');
  const monthText = t('currency.perMonth');

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isTogglingFav) return;

    if (onToggleFavorite) {
      setIsTogglingFav(true);
      const newState = !isFavorite;
      setIsFavorite(newState);
      try {
        await onToggleFavorite(id, newState);
      } catch {
        setIsFavorite(!newState); // revert on error
      } finally {
        setIsTogglingFav(false);
      }
    } else {
      setIsFavorite(!isFavorite);
    }
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

  return (
    <Link href={`/property/${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        {/* Image Carousel */}
        <div className="relative h-44 sm:h-52 md:h-56 bg-gray-200 overflow-hidden">
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
                src={images[currentImageIndex]}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 sm:opacity-0 touch:opacity-100 transition-opacity duration-300 z-10 shadow-md"
              >
                <ChevronLeft className="w-4 h-4 text-gray-800" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 sm:opacity-0 touch:opacity-100 transition-opacity duration-300 z-10 shadow-md"
              >
                <ChevronRight className="w-4 h-4 text-gray-800" />
              </button>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            {type && (
              <span className={`px-3 py-1 text-white text-xs font-semibold rounded-full ${type === "PG" ? "bg-blue-600" : "bg-green-600"
                }`}>
                {type}
              </span>
            )}
            {verified && (
              <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            )}
            {!verified && (
              <span className="px-2.5 py-1 bg-gray-500/80 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                <ShieldOff className="w-3 h-3" />
                Not Verified
              </span>
            )}
            {badge && (
              <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                {badge}
              </span>
            )}
            {isNew && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                New
              </span>
            )}
          </div>

          {/* Favorite Button — only for renters (hidden when onToggleFavorite is not provided) */}
          {onToggleFavorite !== undefined && (
          <button
            onClick={toggleFavorite}
            disabled={isTogglingFav}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 z-10 shadow-md disabled:opacity-70"
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-300 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
                }`}
            />
          </button>
          )}

          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDirection(index > currentImageIndex ? 1 : -1);
                    setCurrentImageIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/60 hover:bg-white/80"
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <h3 className="text-sm sm:text-base md:text-xl font-semibold text-gray-900 mb-1 line-clamp-1">
            {type === "Tenant" && societyName ? societyName : title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-1">
            {[areaName, location, state].filter(Boolean).join(", ")}
          </p>

          <div className="flex items-center justify-between mt-1">
            <p className="text-base sm:text-lg font-bold text-primary">
              {currencySymbol} {price.toLocaleString()}
              <span className="text-xs sm:text-sm font-normal text-gray-500"> / {monthText}</span>
            </p>
            {/* Rating */}
            <div className="flex items-center gap-1">
              <svg
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}`}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              >
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className={`text-xs sm:text-sm font-semibold ${rating ? "text-gray-700" : "text-gray-400"}`}>
                {rating ? rating.toFixed(1) : "0.0"}
              </span>
              <span className="text-xs text-gray-400 hidden sm:inline mt-1">({reviewsCount ?? 0})</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
