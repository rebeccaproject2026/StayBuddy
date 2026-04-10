"use client";

import { motion } from "framer-motion";
import { MapPin, TrendingUp, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ── Known city → image map ────────────────────────────────────────────────────
// India
const IN_CITY_IMAGES: Record<string, string> = {
  ahmedabad: "/ahmedabad.png",
  gandhinagar: "/gandhinagar.png",
  surat: "/surat.jpeg",
  vadodara: "/vadodara.png",
  rajkot: "/rajkot.png",
};

// France
const FR_CITY_IMAGES: Record<string, string> = {
  paris: "/paris.png",
  lyon: "/lyon.png",
  marseille: "/Marseille.png",
  toulouse: "/Toulouse.png",
  nice: "/Nice.png",
};

// Fallback pool — reuse available images for unknown cities
const IN_FALLBACK = ["/ahmedabad.png", "/surat.jpeg", "/vadodara.png", "/gandhinagar.png", "/rajkot.png"];
const FR_FALLBACK = ["/paris.png", "/lyon.png", "/Marseille.png", "/Toulouse.png", "/Nice.png"];

function getCityImage(name: string, country: string, usedImages: Set<string>): string {
  const key = name.toLowerCase();
  const map = country === "fr" ? FR_CITY_IMAGES : IN_CITY_IMAGES;
  const fallback = country === "fr" ? FR_FALLBACK : IN_FALLBACK;

  if (map[key]) return map[key];

  // Pick a fallback not yet used
  const available = fallback.filter((img) => !usedImages.has(img));
  return available[0] ?? fallback[0];
}

// ── Trending cities (top 2 by count) ─────────────────────────────────────────
const TRENDING_IN = new Set(["ahmedabad", "vadodara"]);
const TRENDING_FR = new Set(["paris", "marseille"]);

// ── Size assignment: first = large, next 2 = medium, rest = small ─────────────
type CardSize = "large" | "medium" | "small";
function assignSize(index: number): CardSize {
  if (index === 0) return "large";
  if (index <= 2) return "medium";
  return "small";
}

// ── CityCard ──────────────────────────────────────────────────────────────────
interface CityCardProps {
  name: string;
  propertyCount: number;
  image: string;
  size?: CardSize;
  trending?: boolean;
  country?: string;
}

const CityCard = ({ name, propertyCount, image, size = "medium", trending, country }: CityCardProps) => {
  const { t } = useLanguage();
  const router = useRouter();

  const sizeClasses: Record<CardSize, string> = {
    large: "col-span-1 md:col-span-2 row-span-1 md:row-span-2 h-[280px] md:h-[420px]",
    medium: "col-span-1 row-span-1 h-[280px] md:h-[200px]",
    small: "col-span-1 row-span-1 h-[280px] md:h-[200px]",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      onClick={() => router.push(`/${country || "in"}/properties?city=${encodeURIComponent(name)}`)}
      className={`relative ${sizeClasses[size]} rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-2xl transition-shadow duration-300`}
    >
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10 group-hover:from-black/85 transition-all duration-300" />

      <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-between">
        {trending && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="self-start">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent rounded-full shadow-lg backdrop-blur-sm">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-semibold text-white">{t("cityExplorer.trending")}</span>
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white/90" />
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">{name}</h3>
            </div>
            <p className="text-sm md:text-base text-white/90 font-medium pl-6 md:pl-7">
              {propertyCount} {propertyCount === 1 ? t("cityExplorer.property") : t("cityExplorer.properties")}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary rounded-xl font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
          >
            <span className="text-sm">{t("cityExplorer.exploreNow")}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
    </motion.div>
  );
};

// ── CityExplorer ──────────────────────────────────────────────────────────────
export default function CityExplorer() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const country = (params?.country as string) || "in";

  interface CityEntry {
    name: string;
    propertyCount: number;
    image: string;
    size: CardSize;
    trending: boolean;
  }

  const [cities, setCities] = useState<CityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const PER_PAGE = 5;

  useEffect(() => {
    setPage(0);
    const countryCode = country === "fr" ? "fr" : "in";

    const DEFAULT_IN = ["Ahmedabad", "Surat", "Vadodara", "Gandhinagar", "Rajkot"];
    const DEFAULT_FR = ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"];
    const defaults = countryCode === "fr" ? DEFAULT_FR : DEFAULT_IN;

    fetch(`/api/properties/city-stats?country=${countryCode}&top=5`)
      .then((r) => r.json())
      .then((data) => {
        const realCities: { name: string; count: number }[] = data.success && data.cities?.length
          ? data.cities.slice(0, 5)
          : [];

        buildCities(realCities.length > 0 ? realCities : defaults.slice(0, 5).map((name) => ({ name, count: 0 })), countryCode);
      })
      .catch(() => {
        buildCities(defaults.slice(0, 5).map((name) => ({ name, count: 0 })), countryCode);
      })
      .finally(() => setLoading(false));

    function buildCities(list: { name: string; count: number }[], cc: string) {
      const trendingSet = cc === "fr" ? TRENDING_FR : TRENDING_IN;
      const usedImages = new Set<string>();
      const result: CityEntry[] = list.map((c, i) => {
        const img = getCityImage(c.name, cc, usedImages);
        usedImages.add(img);
        return {
          name: c.name,
          propertyCount: c.count,
          image: img,
          size: assignSize(i % PER_PAGE),
          trending: trendingSet.has(c.name.toLowerCase()),
        };
      });
      setCities(result);
      setLoading(false);
    }
  }, [country]);

  const totalPages = Math.ceil(cities.length / PER_PAGE);
  const showPagination = cities.length > PER_PAGE;
  const pageCities = cities.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE).map((c, i) => ({
    ...c,
    size: assignSize(i),
  }));

  return (
    <div className="w-full bg-white py-8 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">{t("cityExplorer.title")}</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">{t("cityExplorer.subtitle")}</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`rounded-2xl bg-gray-200 animate-pulse ${i === 0 ? "md:col-span-2 h-[420px]" : "h-[200px]"}`}
              />
            ))}
          </div>
        ) : (
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 mb-8"
          >
            {pageCities.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07, duration: 0.4 }}
                className={city.size === "large" ? "md:col-span-2 md:row-span-2" : ""}
              >
                <CityCard {...city} country={country} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination — only when more than 5 cities */}
        {showPagination && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 mt-2"
          >
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-600 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-full text-sm font-semibold border-2 transition-all ${
                  i === page
                    ? "bg-primary text-white border-primary shadow-md"
                    : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-600 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
