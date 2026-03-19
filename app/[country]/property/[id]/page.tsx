"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import { ChevronLeft, ChevronRight, Heart, MapPin, Mail, Share2, X, MessageCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ContactOwnerForm from "@/components/ContactOwnerForm";
import SubscribeSection from "@/components/SubscribeSection";
import ReviewSection from "@/components/ReviewSection";

const defaultReviews = [
  { id: "r1", userName: "Sarah Jenkins", date: "October 2023", rating: 5, comment: "Absolutely loved my stay here! The apartment was exactly as described, very clean, and the balcony view was stunning. The property manager was also very responsive to our needs.", helpfulCount: 12 },
  { id: "r2", userName: "Mikel Arteta", date: "September 2023", rating: 4, comment: "Great location and very spacious. The kitchen amenities were good, though the Wi-Fi was slightly spotty in the guest bedroom. Overall, a great experience.", helpfulCount: 5 },
  { id: "r3", userName: "Emma Watson", date: "August 2023", rating: 5, comment: "Perfect place for a long-term stay. The neighborhood is quiet but well-connected. I highly recommend it!", helpfulCount: 8 },
  { id: "r4", userName: "David Chen", date: "July 2023", rating: 3, comment: "The apartment is nice, but it was a bit noisy during the weekends because of the street below. Keep that in mind if you are a light sleeper.", helpfulCount: 2 }
];

const defaultRatingStats = {
  average: 4.6,
  total: 24,
  distribution: { 5: 16, 4: 5, 3: 2, 2: 1, 1: 0 }
};

export default function PropertyDetailsPage() {
  const params = useParams();
  const { language, t: translate } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [direction, setDirection] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedSpaceType, setSelectedSpaceType] = useState<string>("rooms");
  const [property, setProperty] = useState<any>(null);
  const [relatedProperties, setRelatedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const currencySymbol = translate('currency.symbol');
  const monthText = translate('currency.perMonth');

  const propertyId = params.id as string;
  const country = params.country as string;
  const isIndia = country?.toLowerCase() === 'in' || country?.toLowerCase() === 'india';

  // Fetch property from API
  useEffect(() => {
    if (!propertyId) return;
    setLoading(true);
    setNotFound(false);
    fetch(`/api/properties/${propertyId}`)
      .then(res => {
        if (res.status === 404) { setNotFound(true); return null; }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        if (data.success && data.property) {
          setProperty(data.property);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [propertyId]);

  // Fetch related properties
  useEffect(() => {
    if (!property) return;
    fetch(`/api/properties?country=${property.country}&limit=3`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRelatedProperties(
            (data.properties || []).filter((p: any) => p._id !== propertyId).slice(0, 3)
          );
        }
      })
      .catch(() => {});
  }, [property, propertyId]);

  // Reset state when property changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setSelectedSpaceType("rooms");
    setIsFavorite(false);
    setShowContactForm(false);
    setShowShareModal(false);
    setCopySuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [propertyId]);

  const content = {
    en: {
      home: "Home", properties: "Properties", addToFavorites: "Add to favourites",
      monthlyRent: "Monthly Rent", securityDeposit: "Security Deposit",
      budgetFriendly: "Budget-Friendly: The price is", belowAverage: "below average",
      priceDescription: "The pricing of this property is well below the average market rate, providing exceptional value for your budget.",
      rentalPeriod: "Rental Period", availableFrom: "Available from",
      contactOwner: "Contact Owner", anyConcerns: "Any concerns about this listing?",
      reportIt: "Report it", toOurTeam: "to our team.",
      propertyDetails: "PROPERTY DETAILS", propertyType: "Property Type",
      category: "Category", rooms: "Rooms", bathrooms: "Bathrooms", size: "Size",
      rent: "Monthly Rent", deposit: "Security Deposit", pgFor: "PG For",
      preferredTenants: "Preferred Tenants", amenities: "AMENITIES",
      rules: "RULES & REGULATIONS", smoking: "Smoking", drinking: "Drinking",
      nonVeg: "Non-Veg", pets: "Pets", visitors: "Visitors", gateClosing: "Gate Closing Time",
      services: "SERVICES INCLUDED", electricity: "Electricity", water: "Water",
      meals: "Meals", laundry: "Laundry", cleaning: "Cleaning", maintenance: "Maintenance",
      description: "DESCRIPTION", map: "LOCATION", roomAvailability: "ROOM AVAILABILITY",
      availableRooms: "Vacant Rooms", soldRooms: "Occupied Rooms",
      available: "Vacant", sold: "OCCUPIED",
      kitchen: "Kitchen", washroom: "Washroom", commonArea: "Common Area",
      view360: "360° View", relatedListings: "Related Properties",
      viewMore: "View more properties", share: "Share", shareProperty: "Share Property",
      copyLink: "Copy Link", linkCopied: "Link Copied!", shareVia: "Share via",
      allowed: "Allowed", notAllowed: "Not Allowed", included: "Included", notIncluded: "Not Included",
      loading: "Loading property...", notFound: "Property not found."
    },
    fr: {
      home: "Accueil", properties: "Propriétés", addToFavorites: "Ajouter aux favoris",
      monthlyRent: "Loyer mensuel", securityDeposit: "Dépôt de garantie",
      budgetFriendly: "Économique: Le prix est", belowAverage: "inférieur à la moyenne",
      priceDescription: "Le prix de cette propriété est bien inférieur au tarif moyen du marché, offrant une valeur exceptionnelle pour votre budget.",
      rentalPeriod: "Période de location", availableFrom: "Disponible à partir de",
      contactOwner: "Contacter le propriétaire", anyConcerns: "Des préoccupations concernant cette annonce?",
      reportIt: "Signalez-le", toOurTeam: "à notre équipe.",
      propertyDetails: "DÉTAILS DE LA PROPRIÉTÉ", propertyType: "Type de propriété",
      category: "Catégorie", rooms: "Chambres", bathrooms: "Salles de bain", size: "Taille",
      rent: "Loyer mensuel", deposit: "Dépôt de garantie", pgFor: "PG Pour",
      preferredTenants: "Locataires préférés", amenities: "ÉQUIPEMENTS",
      rules: "RÈGLES ET RÈGLEMENTS", smoking: "Fumer", drinking: "Boire",
      nonVeg: "Non-végétarien", pets: "Animaux", visitors: "Visiteurs", gateClosing: "Heure de fermeture",
      services: "SERVICES INCLUS", electricity: "Électricité", water: "Eau",
      meals: "Repas", laundry: "Blanchisserie", cleaning: "Nettoyage", maintenance: "Entretien",
      description: "DESCRIPTION", map: "EMPLACEMENT", roomAvailability: "DISPONIBILITÉ DES CHAMBRES",
      availableRooms: "Chambres vacantes", soldRooms: "Chambres occupées",
      available: "Vacant", sold: "OCCUPÉ",
      kitchen: "Cuisine", washroom: "Salle de bain", commonArea: "Espace commun",
      view360: "Vue 360°", relatedListings: "Propriétés similaires",
      viewMore: "Voir plus de propriétés", share: "Partager", shareProperty: "Partager la propriété",
      copyLink: "Copier le lien", linkCopied: "Lien copié!", shareVia: "Partager via",
      allowed: "Autorisé", notAllowed: "Non autorisé", included: "Inclus", notIncluded: "Non inclus",
      loading: "Chargement...", notFound: "Propriété introuvable."
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  // ── Image helpers ──────────────────────────────────────────────────────────
  // For PG: roomImages has {id, name, status, image}
  // For Tenant: tenantRoomImages has {id, name, image}
  // kitchen/washroom/commonArea are plain string[] for both types
  // We normalise them into {id, name, status?, image} for the carousel

  const normaliseStringImages = (arr: string[] | undefined, prefix: string) =>
    (arr || []).map((img, i) => ({ id: `${prefix}-${i}`, name: `${prefix} ${i + 1}`, image: img }));

  const getCurrentImages = () => {
    if (!property) return [];
    if (property.propertyType === "PG") {
      switch (selectedSpaceType) {
        case "rooms":    return property.roomImages || [];
        case "kitchen":  return normaliseStringImages(property.kitchenImages, "Kitchen");
        case "washroom": return normaliseStringImages(property.washroomImages, "Washroom");
        case "commonArea": return normaliseStringImages(property.commonAreaImages, "Common Area");
        default: return property.roomImages || [];
      }
    } else {
      switch (selectedSpaceType) {
        case "rooms":    return property.tenantRoomImages?.length ? property.tenantRoomImages : normaliseStringImages(property.images, "Room");
        case "kitchen":  return normaliseStringImages(property.tenantKitchenImages, "Kitchen");
        case "washroom": return normaliseStringImages(property.tenantWashroomImages, "Washroom");
        case "commonArea": return normaliseStringImages(property.tenantCommonAreaImages, "Common Area");
        default: return normaliseStringImages(property.images, "Image");
      }
    }
  };

  const currentImages = getCurrentImages();

  const nextImage = () => {
    if (!currentImages.length) return;
    setDirection(1);
    setCurrentImageIndex(prev => (prev + 1) % currentImages.length);
  };

  const prevImage = () => {
    if (!currentImages.length) return;
    setDirection(-1);
    setCurrentImageIndex(prev => (prev - 1 + currentImages.length) % currentImages.length);
  };

  const handleSpaceTypeChange = (spaceType: string) => {
    setSelectedSpaceType(spaceType);
    setCurrentImageIndex(0);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 1000 : -1000, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (d: number) => ({ zIndex: 0, x: d < 0 ? 1000 : -1000, opacity: 0 }),
  };

  // Share helpers
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };
  const handleShareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this property: ${property?.title} - ${window.location.href}`)}`, '_blank');
  const handleShareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  const handleShareTwitter = () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out this property: ${property?.title}`)}`, '_blank');
  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Property: ${property?.title}`);
    const body = encodeURIComponent(`I found this property:\n\n${property?.title}\n${property?.location}\n\n${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // ── Derived display values ─────────────────────────────────────────────────
  // pgRules is string[] — convert to display object
  const rulesDisplay: Record<string, string> = property?.rules || {};
  const servicesDisplay: Record<string, string> = property?.services || {};

  // amenities: PG uses commonAmenities, Tenant uses societyAmenities
  const amenitiesList: string[] = property
    ? (property.propertyType === "PG"
        ? (property.commonAmenities || [])
        : (property.societyAmenities || []))
    : [];

  // description
  const description = property?.pgDescription || property?.localityDescription || "";

  // PG room availability counts
  const pgRooms: Array<{ id: string; name: string; status?: string; image?: string }> = property?.roomImages || [];
  const vacantCount = pgRooms.filter(r => r.status === "vacant").length;
  const occupiedCount = pgRooms.filter(r => r.status === "occupied").length;

  // ── Loading / not found states ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">{t.notFound}</p>
          <Link href="/properties" className="text-primary hover:underline">{t.viewMore}</Link>
        </div>
      </div>
    );
  }

  const currentImg = currentImages[currentImageIndex];
  const imgSrc = currentImg?.image || property.images?.[0] || "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
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

              {/* PG room status overlay */}
              {isIndia && property.propertyType === "PG" && selectedSpaceType === "rooms" && currentImg?.status && (
                <>
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-20">
                    {currentImg.status === "occupied" ? (
                      <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-red-600 text-white text-xs sm:text-sm font-semibold rounded-full shadow-2xl">{t.sold}</span>
                    ) : (
                      <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-green-600 text-white text-xs sm:text-sm font-semibold rounded-full shadow-2xl">{t.available}</span>
                    )}
                  </div>
                  {currentImg.status === "occupied" && (
                    <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center z-10">
                      <span className="text-white text-4xl sm:text-6xl lg:text-8xl font-bold transform -rotate-12 opacity-60 drop-shadow-2xl">{t.sold}</span>
                    </div>
                  )}
                  {currentImg.status === "vacant" && (
                    <div className="absolute inset-0 bg-green-900/20 flex items-center justify-center z-10">
                      <span className="text-white text-4xl sm:text-6xl lg:text-8xl font-bold transform -rotate-12 opacity-40 drop-shadow-2xl">{t.available}</span>
                    </div>
                  )}
                  <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-3 sm:left-4 md:left-6 z-20">
                    <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-2xl ${currentImg.status === "occupied" ? "bg-red-600/90 text-white" : "bg-green-600/90 text-white"}`}>
                      <p className="text-sm sm:text-base font-semibold">{currentImg.name}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Room name label for non-status images */}
              {currentImg?.name && !(isIndia && property.propertyType === "PG" && selectedSpaceType === "rooms" && currentImg?.status) && (
                <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-3 sm:left-4 md:left-6 z-20">
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-2xl bg-primary/90 text-white">
                    <p className="text-sm sm:text-base font-semibold">{currentImg.name}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Navigation */}
        <button onClick={prevImage} className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center z-10 shadow-lg transition-all">
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" />
        </button>
        <button onClick={nextImage} className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center z-10 shadow-lg transition-all">
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
          {currentImages.map((_: any, index: number) => (
            <button key={index} onClick={() => { setDirection(index > currentImageIndex ? 1 : -1); setCurrentImageIndex(index); }}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? "w-6 sm:w-8 bg-white" : "w-1.5 sm:w-2 bg-white/60 hover:bg-white/80"}`}
            />
          ))}
        </div>
      </div>

      {/* Space Type Filter Buttons */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-4">
        <div className="max-w-7xl mx-auto py-3 sm:py-4">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
            {/* Rooms */}
            {((property.propertyType === "Tenant") || (property.propertyType === "PG" && pgRooms.length > 0)) && (
              <button onClick={() => handleSpaceTypeChange("rooms")}
                className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${selectedSpaceType === "rooms" ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {t.rooms}
                {property.propertyType === "PG" && pgRooms.length > 0 && (
                  <> (<span className="text-green-300 font-bold">{vacantCount}</span> / <span className="text-red-300 font-bold">{occupiedCount}</span>)</>
                )}
                {property.propertyType === "Tenant" && property.tenantRoomImages?.length > 0 && (
                  <> ({property.tenantRoomImages.length})</>
                )}
              </button>
            )}
            {/* Kitchen */}
            {((property.propertyType === "PG" ? property.kitchenImages : property.tenantKitchenImages) || []).length > 0 && (
              <button onClick={() => handleSpaceTypeChange("kitchen")}
                className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${selectedSpaceType === "kitchen" ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {t.kitchen} ({(property.propertyType === "PG" ? property.kitchenImages : property.tenantKitchenImages)?.length || 0})
              </button>
            )}
            {/* Washroom */}
            {((property.propertyType === "PG" ? property.washroomImages : property.tenantWashroomImages) || []).length > 0 && (
              <button onClick={() => handleSpaceTypeChange("washroom")}
                className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${selectedSpaceType === "washroom" ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {t.washroom} ({(property.propertyType === "PG" ? property.washroomImages : property.tenantWashroomImages)?.length || 0})
              </button>
            )}
            {/* Common Area */}
            {((property.propertyType === "PG" ? property.commonAreaImages : property.tenantCommonAreaImages) || []).length > 0 && (
              <button onClick={() => handleSpaceTypeChange("commonArea")}
                className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${selectedSpaceType === "commonArea" ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {t.commonArea} ({(property.propertyType === "PG" ? property.commonAreaImages : property.tenantCommonAreaImages)?.length || 0})
              </button>
            )}
            {/* 360 View */}
            {property.view360Available && property.view360Url && (
              <button onClick={() => window.open(property.view360Url, '_blank')}
                className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md">
                {t.view360}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 overflow-x-auto">
                <Link href="/" className="hover:text-primary whitespace-nowrap">{t.home}</Link>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <Link href="/properties" className="hover:text-primary whitespace-nowrap">{t.properties}</Link>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-gray-900 truncate">{property.location?.split(',')[0]}</span>
              </div>

              {/* Title */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h1>
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${property.propertyType === "PG" ? "bg-blue-600 text-white" : "bg-green-600 text-white"}`}>
                      {property.propertyType}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 flex items-center gap-1.5 sm:gap-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="line-clamp-2">{property.fullAddress}</span>
                  </p>
                </div>
                <button onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${isFavorite ? 'bg-red-50 border-2 border-red-500 text-red-600 hover:bg-red-100' : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-primary hover:bg-primary/5 hover:text-primary'}`}>
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-current"}`} />
                  <span className="whitespace-nowrap hidden sm:inline">{t.addToFavorites}</span>
                  <span className="whitespace-nowrap sm:hidden">Favorite</span>
                </button>
              </div>

              {/* Description */}
              {description && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.description}</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{description}</p>
                </div>
              )}

              {/* Property Details */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.propertyDetails}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-sm sm:text-base text-gray-600">{t.propertyType}</span>
                    <span className={`font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm ${property.propertyType === "PG" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-sm sm:text-base text-gray-600">{t.category}</span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900">{property.category}</span>
                  </div>
                  {property.propertyType === "PG" && property.pgFor && (
                    <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                      <span className="text-sm sm:text-base text-gray-600">{t.pgFor}</span>
                      <span className="text-sm sm:text-base font-semibold text-gray-900">{property.pgFor}</span>
                    </div>
                  )}
                  {property.propertyType === "PG" && property.preferredTenants && (
                    <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                      <span className="text-sm sm:text-base text-gray-600">{t.preferredTenants}</span>
                      <span className="text-sm sm:text-base font-semibold text-gray-900">{property.preferredTenants}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-sm sm:text-base text-gray-600">{t.rooms}</span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900">{property.rooms}</span>
                  </div>
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-sm sm:text-base text-gray-600">{t.bathrooms}</span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900">{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-sm sm:text-base text-gray-600">{t.size}</span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900">{property.area} m²</span>
                  </div>
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-sm sm:text-base text-gray-600">{t.rent}</span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900">{currencySymbol} {property.price}</span>
                  </div>
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-sm sm:text-base text-gray-600">{t.deposit}</span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900">{currencySymbol} {property.deposit}</span>
                  </div>
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-sm sm:text-base text-gray-600">{t.availableFrom}</span>
                    <span className="text-sm sm:text-base font-semibold text-green-600">{property.availableFrom}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {amenitiesList.length > 0 && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.amenities}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                    {amenitiesList.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PG Rules */}
              {property.propertyType === "PG" && property.pgRules && property.pgRules.length > 0 && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.rules}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {property.pgRules.map((rule: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm text-gray-700">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tenant Rules (Record<string,string>) */}
              {property.propertyType === "Tenant" && Object.keys(rulesDisplay).length > 0 && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.rules}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {Object.entries(rulesDisplay).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                        <span className="text-sm sm:text-base text-gray-600 capitalize">{key}</span>
                        <span className={`text-sm sm:text-base font-semibold ${val === "Allowed" ? "text-green-600" : val === "Not Allowed" ? "text-red-600" : "text-gray-900"}`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {Object.keys(servicesDisplay).length > 0 && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.services}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {Object.entries(servicesDisplay).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                        <span className="text-sm sm:text-base text-gray-600 capitalize">{key}</span>
                        <span className={`text-sm sm:text-base font-semibold ${val === "Included" || val === "Daily" ? "text-green-600" : "text-gray-900"}`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Food info for PG */}
              {property.propertyType === "PG" && property.foodProvided && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.meals}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {property.meals?.map((meal: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm text-gray-700">{meal}</span>
                      </div>
                    ))}
                    {property.vegNonVeg && (
                      <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm text-gray-700">{property.vegNonVeg}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Map */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.map}</h3>
                <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700 line-clamp-2">{property.fullAddress}</span>
                </div>
                {property.googleMapLink ? (
                  <div className="w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden">
                    <iframe src={property.googleMapLink} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  </div>
                ) : (
                  <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-sm sm:text-base text-gray-500">Map placeholder</p>
                  </div>
                )}
              </div>

              {/* Reviews */}
              <ReviewSection stats={defaultRatingStats} reviews={defaultReviews} language={language} t={t} country={country} />

              {/* Related Properties */}
              {relatedProperties.length > 0 && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">{t.relatedListings}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    {relatedProperties.map((rel: any) => (
                      <Link key={rel._id} href={`/property/${rel._id}`} className="group">
                        <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                          <Image src={rel.images?.[0] || ""} alt={rel.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                          <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                            <Heart className="w-4 h-4 text-gray-700" />
                          </button>
                          {rel.propertyType && (
                            <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${rel.propertyType === "PG" ? "bg-blue-600 text-white" : "bg-green-600 text-white"}`}>{rel.propertyType}</span>
                          )}
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">{rel.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{rel.location}</p>
                        <p className="text-lg font-bold text-primary">{currencySymbol} {rel.price} <span className="text-sm font-normal text-gray-600">/ {monthText}</span></p>
                      </Link>
                    ))}
                  </div>
                  <Link href="/properties">
                    <button className="w-full py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300">{t.viewMore}</button>
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{t.monthlyRent}</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1">{currencySymbol} {property.price}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{t.securityDeposit}: {currencySymbol} {property.deposit}</p>

                  <div className="mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      {t.budgetFriendly} <span className="text-green-600">{t.belowAverage}</span>
                    </p>
                    <div className="w-full h-1.5 sm:h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full mb-2"></div>
                    <p className="text-xs text-gray-600">{t.priceDescription}</p>
                  </div>

                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">{t.rentalPeriod}</span>
                      <span className="text-xs sm:text-sm font-semibold text-green-600">{property.rentalPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">{t.availableFrom}</span>
                      <span className="text-xs sm:text-sm font-semibold text-green-600">{property.availableFrom}</span>
                    </div>
                  </div>

                  <button onClick={() => setShowContactForm(true)}
                    className="w-full py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors mb-3 sm:mb-4">
                    {t.contactOwner}
                  </button>

                  <button onClick={() => setShowShareModal(true)}
                    className="w-full py-2.5 sm:py-3 border-2 border-gray-300 hover:border-primary text-gray-700 text-sm sm:text-base font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t.share}
                  </button>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 text-center">{t.anyConcerns}</p>
                    <p className="text-sm text-center">
                      <button className="text-red-600 hover:text-red-700 font-semibold">{t.reportIt}</button>{" "}
                      <span className="text-gray-600">{t.toOurTeam}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SubscribeSection />

      <ContactOwnerForm isOpen={showContactForm} onClose={() => setShowContactForm(false)} property={property} language={language} />

      {/* Share Modal */}
      {showShareModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setShowShareModal(false)}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '450px', width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Share2 className="w-6 h-6 text-primary" />{t.shareProperty}
              </h2>
              <button onClick={() => setShowShareModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <button onClick={handleCopyLink} className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                {copySuccess ? <><CheckCircle className="w-5 h-5 text-green-600" />{t.linkCopied}</> : <><Mail className="w-5 h-5" />{t.copyLink}</>}
              </button>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">{t.shareVia}</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleShareWhatsApp} className="py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"><MessageCircle className="w-5 h-5" />WhatsApp</button>
                  <button onClick={handleShareFacebook} className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"><Share2 className="w-5 h-5" />Facebook</button>
                  <button onClick={handleShareTwitter} className="py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"><Share2 className="w-5 h-5" />Twitter</button>
                  <button onClick={handleShareEmail} className="py-3 px-4 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"><Mail className="w-5 h-5" />Email</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp sticky button */}
      {property.landlord?.phone && (
        <a href={`https://wa.me/${property.landlord.phone.replace(/\s/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in ${property.title} at ${property.location}`)}`}
          target="_blank" rel="noopener noreferrer"
          className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-green-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 group animate-bounce">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="absolute right-full mr-2 sm:mr-3 px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-lg hidden sm:block">
            Chat on WhatsApp with owner
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></span>
          </span>
        </a>
      )}
    </div>
  );
}
