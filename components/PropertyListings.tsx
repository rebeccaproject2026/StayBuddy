"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropertyCard from "./PropertyCard";
import Link from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams } from "next/navigation";

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
}

export default function PropertyListings() {
  const { t } = useLanguage();
  const params = useParams();
  const country = (params?.country as string) || "in";

  const [activeTab, setActiveTab] = useState<PropertyType>("all");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ country, limit: "8" });
        if (activeTab === "pg") params.set("type", "PG");
        if (activeTab === "tenant") params.set("type", "Tenant");

        const res = await fetch(`/api/properties?${params}`);
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

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -400 : 400,
        behavior: "smooth",
      });
    }
  };

  const tabs = [
    { id: "all" as PropertyType, label: t("properties.allProperties") },
    { id: "pg" as PropertyType, label: t("filters.pg").toUpperCase() },
    { id: "tenant" as PropertyType, label: t("filters.tenant").toUpperCase() },
  ];

  return (
    <div className="px-4 sm:px-6">
      <div className="w-full max-w-7xl mx-auto py-8 sm:py-10 md:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl esm:text-3xl md:text-3xl font-bold text-gray-900 mb-2">
            {t("properties.featured")}
          </h2>
          <p className="text-sm esm:text-base md:text-base text-gray-600">
            {t("properties.subtitle")}
          </p>
        </div>

        {/* Tabs + Arrows */}
        <div className="flex items-center justify-between mb-5 sm:mb-6 gap-3">
          <div className="flex gap-2 esm:gap-3 overflow-x-auto scrollbar-hide pr-2 -mr-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 esm:px-5 md:px-6 py-2 md:py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex gap-2 ml-1 md:ml-4 flex-shrink-0">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-primary hover:bg-primary-light transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-primary hover:bg-primary-light transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex gap-4 esm:gap-5 md:gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[260px] esm:w-[280px] md:w-[300px] h-[340px] bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No properties found. Be the first to{" "}
            <Link href="/post-property" className="text-primary font-medium underline">
              post one
            </Link>
            .
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex gap-4 esm:gap-5 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {properties.map((property) => (
              <div
                key={property._id}
                className="flex-shrink-0 w-[260px] esm:w-[280px] md:w-[300px]"
              >
                <PropertyCard
                  id={property._id}
                  title={property.title}
                  societyName={property.societyName}
                  location={property.location}
                  areaName={property.areaName}
                  state={property.state}
                  price={property.price}
                  rooms={property.rooms}
                  area={property.area}
                  images={
                    property.images?.length > 0
                      ? property.images
                      : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400"]
                  }
                  type={property.propertyType}
                  isNew={property.isNew}
                  rating={property.averageRating ?? undefined}
                  reviewsCount={property.reviewsCount}
                />
              </div>
            ))}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-6 sm:mt-8">
          <Link href="/properties">
            <button className="px-6 esm:px-8 py-2.5 md:py-3 bg-primary text-white rounded-xl font-semibold shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all duration-300">
              {t("properties.viewAll")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
