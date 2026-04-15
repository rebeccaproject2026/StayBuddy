"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, ShieldCheck, ShieldOff, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams } from "next/navigation";
import Link from "@/components/LocalizedLink";

interface RoomDetail {
  monthlyRent: string;
  securityDeposit?: string;
  totalBeds?: string;
  availableBeds?: string;
}

interface TenantRoom {
  id: string;
  name: string;
  status: string;
  rent: string;
  maxPersons?: string;
  currentPersons?: string;
}

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
  bhk?: string;
  images: string[];
  isNew?: boolean;
  badge?: string;
  type?: "PG" | "Tenant";
  verified?: boolean;
  rating?: number;
  reviewsCount?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, newState: boolean) => void;
  roomDetails?: Record<string, RoomDetail>;
  tenantRooms?: TenantRoom[];
}

export default function PropertyCard({
  id,
  title,
  societyName,
  areaName,
  state,
  location,
  price,
  bhk,
  images,
  isNew = false,
  badge,
  type = "Tenant",
  verified = false,
  rating,
  reviewsCount,
  isFavorite: isFavoriteProp = false,
  onToggleFavorite,
  roomDetails,
  tenantRooms,
}: PropertyCardProps) {
  const { t } = useLanguage();
  const params = useParams();
  const country = (params?.country as string) || 'in';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(isFavoriteProp);
  const [isTogglingFav, setIsTogglingFav] = useState(false);
  const [direction, setDirection] = useState(0);

  // Bed type dropdown state
  const bedTypes = type === "PG" && roomDetails ? Object.keys(roomDetails) : [];
  const [selectedBedType, setSelectedBedType] = useState<string>(bedTypes[0] || "");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tenant room dropdown state (France only)
  const showTenantRoomDropdown = country === 'fr' && type === "Tenant" && tenantRooms && tenantRooms.length > 0;
  const [selectedTenantRoom, setSelectedTenantRoom] = useState<TenantRoom | null>(
    showTenantRoomDropdown ? (tenantRooms![0] ?? null) : null
  );
  const [tenantRoomDropdownOpen, setTenantRoomDropdownOpen] = useState(false);
  const tenantRoomDropdownRef = useRef<HTMLDivElement>(null);

  // Derived price based on selected bed type or tenant room
  const displayPrice =
    type === "PG" && roomDetails && selectedBedType && roomDetails[selectedBedType]
      ? parseFloat(roomDetails[selectedBedType].monthlyRent) || price
      : showTenantRoomDropdown && selectedTenantRoom
      ? parseFloat(selectedTenantRoom.rent) || price
      : price;

  // Sync when parent updates favorites
  useEffect(() => {
    setIsFavorite(isFavoriteProp);
  }, [isFavoriteProp]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (tenantRoomDropdownRef.current && !tenantRoomDropdownRef.current.contains(e.target as Node)) {
        setTenantRoomDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Currency symbol derived from URL country param — reliable even in lazy-loaded components
  const currencySymbol = country === 'fr' ? '€' : '₹';
  const monthText = country === 'fr' ? 'mois' : 'month';

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

  const handleCardClick = () => {}; // navigation handled by Link wrapper
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
    <>
      <Link href={`/property/${id}`} className="block">
      <div
        className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
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
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 sm:opacity-0 touch:opacity-100 transition-opacity duration-300 z-10 shadow-md"
              >
                <ChevronLeft className="w-4 h-4 text-gray-800" />
              </button>
              <button
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 sm:opacity-0 touch:opacity-100 transition-opacity duration-300 z-10 shadow-md"
              >
                <ChevronRight className="w-4 h-4 text-gray-800" />
              </button>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            {type && (
              <span className={`px-3 py-1 text-white text-xs font-semibold rounded-full ${type === "PG" ? "bg-blue-600" : "bg-green-600"}`}>
                {type}
              </span>
            )}
            {type === "Tenant" && bhk && (
              <span className="px-3 py-1 bg-white/90 text-gray-800 text-xs font-semibold rounded-full">
                {bhk}
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
                  aria-label={`Go to image ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/60 hover:bg-white/80"
                    }`}
                />
              ))}
            </div>
          )}

          {/* Rating overlay — bottom right of image */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            <svg
              className={`w-3 h-3 ${rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}`}
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            >
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-xs font-semibold text-white">
              {rating ? rating.toFixed(1) : "0.0"}
            </span>
            <span className="text-xs text-white/80">({reviewsCount ?? 0})</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <h3 className="text-sm sm:text-base md:text-xl font-semibold text-gray-900 mb-1 line-clamp-1">
            {type === "Tenant" && societyName ? societyName : title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-1">
            {[areaName, location, state].filter(Boolean).join(", ")}
          </p>

          <div className="flex items-center mt-1">
            <p className="text-base sm:text-lg font-bold text-primary">
              {currencySymbol} {displayPrice.toLocaleString()}
              <span className="text-xs sm:text-sm font-normal text-gray-500"> / {monthText}</span>
            </p>

            {/* Bed type dropdown — PG only */}
            {type === "PG" && bedTypes.length > 0 && (
              <div ref={dropdownRef} className="relative ml-auto" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => { e.stopPropagation(); setDropdownOpen((o) => !o); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors bg-white"
                >
                  <span>{selectedBedType ? `${selectedBedType} Bed` : "Bed Type"}</span>
                  <ChevronUp className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? "rotate-0" : "rotate-180"}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute bottom-full right-0 mb-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-[120px] overflow-hidden"
                    >
                      {bedTypes.map((bt) => (
                        <button
                          key={bt}
                          onClick={(e) => { e.stopPropagation(); setSelectedBedType(bt); setDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                            selectedBedType === bt
                              ? "bg-primary/10 text-primary"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {bt} Bed
                          {roomDetails?.[bt]?.monthlyRent && (
                            <span className="block text-gray-400 font-normal">
                              {currencySymbol}{parseFloat(roomDetails[bt].monthlyRent).toLocaleString()}
                            </span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Room dropdown — France Tenant only */}
            {showTenantRoomDropdown && (
              <div ref={tenantRoomDropdownRef} className="relative ml-auto" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => { e.stopPropagation(); setTenantRoomDropdownOpen((o) => !o); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors bg-white"
                >
                  <span>{selectedTenantRoom ? selectedTenantRoom.name : "Room"}</span>
                  <ChevronUp className={`w-3 h-3 transition-transform duration-200 ${tenantRoomDropdownOpen ? "rotate-0" : "rotate-180"}`} />
                </button>

                <AnimatePresence>
                  {tenantRoomDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute bottom-full right-0 mb-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-[130px] overflow-hidden"
                    >
                      {tenantRooms!.map((room) => (
                        <button
                          key={room.id}
                          onClick={(e) => { e.stopPropagation(); setSelectedTenantRoom(room); setTenantRoomDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                            selectedTenantRoom?.id === room.id
                              ? "bg-primary/10 text-primary"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {room.name}
                          <span className="flex items-center gap-1.5 mt-0.5">
                            {room.rent && (
                              <span className="text-gray-400 font-normal">
                                {currencySymbol}{parseFloat(room.rent).toLocaleString()}
                              </span>
                            )}
                            {room.maxPersons && (
                              <span className="text-gray-400 font-normal">· {room.currentPersons ?? 0}/{room.maxPersons} cap</span>
                            )}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
      </Link>
    </>
  );
}
