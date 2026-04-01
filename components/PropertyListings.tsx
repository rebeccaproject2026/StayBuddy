"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropertyCard from "./PropertyCard";
import Link from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

type PropertyType = "all" | "pg" | "tenant";

interface Property {
  _id: string;
  title: string;
  societyName?: string;
  location: string;
  areaName?: string;
  state?: string;
  price: number;
  rooms: number;
  area: number;
  images: string[];
  propertyType: "PG" | "Tenant";
  isNew?: boolean;
  priceStatus?: string;
  averageRating?: number | null;
  reviewsCount?: number;
  isVerified?: boolean;
}

export default function PropertyListings() {
  const { t } = useLanguage();
  const { isAuthenticated, token, user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const country = (params?.country as string) || "in";

  const [activeTab, setActiveTab] = useState<PropertyType>("all");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const p = new URLSearchParams({ country, limit: "8" });
        if (activeTab === "pg") p.set("type", "PG");
        if (activeTab === "tenant") p.set("type", "Tenant");
        const res = await fetch(`/api/properties?${p}`);
        const data = await res.json();
        if (data.success) setProperties(data.properties);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [country, activeTab]);

  useEffect(() => {
    if (!isAuthenticated || !token) { setFavoriteIds(new Set()); return; }
    fetch('/api/auth/favorites', {
      headers: token !== 'nextauth' ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(data => {
        if (data.success)
          setFavoriteIds(new Set(data.favorites.map((f: any) => f._id?.toString() ?? f.toString())));
      })
      .catch(() => {});
  }, [isAuthenticated, token]);

  const handleToggleFavorite = async (propertyId: string, newState: boolean) => {
    if (!isAuthenticated || !token) {
      toast.error("Please login to save favorites");
      router.push(`/${country}/login`);
      throw new Error("unauthenticated");
    }
    if (user?.role === 'landlord') { toast.error("Landlords cannot save favorites"); throw new Error("not-allowed"); }
    const res = await fetch('/api/auth/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token !== 'nextauth' ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ propertyId }),
    });
    const data = await res.json();
    if (data.success) {
      setFavoriteIds(new Set(data.favoriteIds));
      data.isFavorite ? toast.success("Added to favorites") : toast("Removed from favorites", { icon: "💔" });
    } else throw new Error(data.error);
  };

  const scroll = (dir: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = container.firstElementChild?.clientWidth ?? 300;
    container.scrollBy({ left: dir === "left" ? -(cardWidth + 16) : (cardWidth + 16), behavior: "smooth" });
  };

  const tabs = [
    { id: "all" as PropertyType, label: t("properties.allProperties") },
    { id: "pg" as PropertyType, label: t("filters.pg").toUpperCase() },
    { id: "tenant" as PropertyType, label: t("filters.tenant").toUpperCase() },
  ];

  const cardProps = (property: Property) => ({
    id: property._id,
    title: property.title,
    societyName: property.societyName,
    location: property.location,
    areaName: property.areaName,
    state: property.state,
    price: property.price,
    rooms: property.rooms,
    area: property.area,
    images: property.images?.length > 0
      ? property.images
      : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400"],
    type: property.propertyType,
    isNew: property.isNew,
    verified: property.isVerified,
    rating: property.averageRating ?? undefined,
    reviewsCount: property.reviewsCount,
    isFavorite: favoriteIds.has(property._id),
    onToggleFavorite: user?.role === 'landlord' ? undefined : handleToggleFavorite,
  });

  return (
    <div className="px-4 sm:px-6">
      <div className="w-full max-w-7xl mx-auto py-8 sm:py-10 md:py-12">
        {/* Header */}
        <div className="mb-5 sm:mb-7">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5">
            {t("properties.featured")}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">{t("properties.subtitle")}</p>
        </div>

        {/* Tabs + scroll arrows */}
        <div className="flex items-center justify-between mb-5 gap-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Arrows */}
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => scroll("left")} className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-primary hover:bg-primary/10 transition-all">
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button onClick={() => scroll("right")} className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-primary hover:bg-primary/10 transition-all">
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Cards — always horizontal scroll, controlled by chevrons */}
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[72vw] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] h-[300px] bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No properties found.{" "}
            {isAuthenticated && user?.role === "landlord" && (
              <Link href="/post-property" className="text-primary font-medium underline">post one</Link>
            )}
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-3"
          >
            {properties.map((property) => (
              <div key={property._id} className="flex-shrink-0 w-[72vw] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] min-w-[220px] max-w-[320px]">
                <PropertyCard {...cardProps(property)} />
              </div>
            ))}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-6 sm:mt-8">
          <Link href="/properties">
            <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-white rounded-xl font-semibold shadow-lg hover:bg-primary-dark transition-all duration-300 text-sm sm:text-base">
              {t("properties.viewAll")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
