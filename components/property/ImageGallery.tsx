"use client";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  property: any;
  currentImages: any[];
  currentImageIndex: number;
  direction: number;
  selectedSpaceType: string;
  t: Record<string, string>;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
  onSpaceTypeChange: (type: string) => void;
}

const variants = {
  enter: (d: number) => ({ x: d > 0 ? 1000 : -1000, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (d: number) => ({ zIndex: 0, x: d < 0 ? 1000 : -1000, opacity: 0 }),
};

export default function ImageGallery({
  property, currentImages, currentImageIndex, direction, selectedSpaceType,
  t, onPrev, onNext, onDotClick, onSpaceTypeChange,
}: Props) {
  const currentImg = currentImages[currentImageIndex];
  const imgSrc = currentImg?.image || property.images?.[0] || "";
  const pgRooms = property.roomImages || [];

  const spaceImages = (key: string) =>
    (property.propertyType === "PG" ? property[key] : property[`tenant${key.charAt(0).toUpperCase() + key.slice(1)}`]) || [];

  return (
    <>
      {/* Image Carousel */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[450px] lg:h-[480px] bg-gray-900">
        {imgSrc && (
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentImageIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="absolute inset-0"
            >
              <Image src={imgSrc} alt={property.title} fill className="object-cover" priority />
              {currentImg?.name && (
                <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-3 sm:left-4 md:left-6 z-20">
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-2xl bg-primary/90 text-white">
                    <p className="text-sm sm:text-base font-semibold">{currentImg.name}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
        <button onClick={onPrev} aria-label="Previous image" className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center z-10 shadow-lg transition-all">
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" />
        </button>
        <button onClick={onNext} aria-label="Next image" className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center z-10 shadow-lg transition-all">
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" />
        </button>
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
          {currentImages.map((_: any, index: number) => (
            <button key={index} onClick={() => onDotClick(index)} aria-label={`Go to image ${index + 1}`}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? "w-6 sm:w-8 bg-white" : "w-1.5 sm:w-2 bg-white/60 hover:bg-white/80"}`}
            />
          ))}
        </div>
      </div>

      {/* Space Type Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-4">
        <div className="max-w-7xl mx-auto py-3 sm:py-4">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
            {((property.propertyType === "Tenant") || (property.propertyType === "PG" && pgRooms.length > 0)) && (
              <button onClick={() => onSpaceTypeChange("rooms")}
                className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${selectedSpaceType === "rooms" ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {t.rooms}
                {property.propertyType === "PG" && pgRooms.length > 0 && <> ({pgRooms.length})</>}
                {property.propertyType === "Tenant" && property.tenantRoomImages?.length > 0 && <> ({property.tenantRoomImages.length})</>}
              </button>
            )}
            {(["kitchenImages", "washroomImages", "commonAreaImages"] as const).map((key) => {
              const imgs = spaceImages(key);
              const label = key === "kitchenImages" ? t.kitchen : key === "washroomImages" ? t.washroom : t.commonArea;
              const type = key === "kitchenImages" ? "kitchen" : key === "washroomImages" ? "washroom" : "commonArea";
              if (!imgs.length) return null;
              return (
                <button key={key} onClick={() => onSpaceTypeChange(type)}
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${selectedSpaceType === type ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  {label} ({imgs.length})
                </button>
              );
            })}
            {property.view360Available && property.view360Url && (
              <button onClick={() => window.open(property.view360Url, "_blank")}
                className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md">
                {t.view360}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
