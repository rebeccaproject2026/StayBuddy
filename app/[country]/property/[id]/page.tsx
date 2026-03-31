"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import { ChevronLeft, ChevronRight, Heart, MapPin, Mail, Share2, X, MessageCircle, CheckCircle, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ContactOwnerForm from "@/components/ContactOwnerForm";
import SubscribeSection from "@/components/SubscribeSection";
import ReviewSection from "@/components/ReviewSection";
import toast from "react-hot-toast";



export default function PropertyDetailsPage() {
  const params = useParams();
  const { language, t: translate } = useLanguage();
  const { isAuthenticated, token, user } = useAuth();
  const isOwner = user?.role === 'landlord';
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFav, setIsTogglingFav] = useState(false);
  const [direction, setDirection] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedSpaceType, setSelectedSpaceType] = useState<string>("rooms");
  const [property, setProperty] = useState<any>(null);
  const [relatedProperties, setRelatedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Report state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportDone, setReportDone] = useState(false);

  const REPORT_REASONS = ["Fake listing", "Incorrect information", "Misleading photos", "Already rented", "Scam / fraud", "Other"];

  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sidebar = sidebarRef.current;
      const content = contentRef.current;
      if (!sidebar || !content) return;

      const NAVBAR_HEIGHT = 96; // top-24 = 6rem = 96px
      const contentTop = content.getBoundingClientRect().top + window.scrollY;
      const contentBottom = contentTop + content.offsetHeight;
      const sidebarHeight = sidebar.offsetHeight;
      const scrollY = window.scrollY;

      const startSticky = contentTop - NAVBAR_HEIGHT;
      const stopSticky = contentBottom - sidebarHeight - NAVBAR_HEIGHT;

      if (scrollY < startSticky) {
        // Before sticky zone: normal flow
        sidebar.style.position = 'relative';
        sidebar.style.top = '0';
      } else if (scrollY >= startSticky && scrollY < stopSticky) {
        // In sticky zone: fixed at top
        sidebar.style.position = 'fixed';
        sidebar.style.top = `${NAVBAR_HEIGHT}px`;
        sidebar.style.width = `${sidebar.parentElement?.offsetWidth ?? 0}px`;
      } else {
        // Past sticky zone: pin to bottom of parent
        sidebar.style.position = 'absolute';
        sidebar.style.top = `${content.offsetHeight - sidebarHeight}px`;
        sidebar.style.width = '';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const monthText = translate('currency.perMonth');

  const propertyId = params.id as string;
  const country = params.country as string;
  const isIndia = country?.toLowerCase() === 'in' || country?.toLowerCase() === 'india';
  const currencySymbol = country === 'fr' ? '€' : '₹';

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

  // Fetch favorite state for this property
  useEffect(() => {
    if (!isAuthenticated || !token || !propertyId) return;
    fetch('/api/auth/favorites', {
      headers: token !== 'nextauth' ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const ids = data.favorites.map((f: any) => f._id?.toString() ?? f.toString());
          setIsFavorite(ids.includes(propertyId));
        }
      })
      .catch(() => {});
  }, [isAuthenticated, token, propertyId]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !token) {
      toast.error("Please login to save favorites");
      router.push(`/${country}/login`);
      return;
    }
    if (user?.role === 'landlord') {
      toast.error("Landlords cannot save favorites");
      return;
    }
    if (isTogglingFav) return;
    setIsTogglingFav(true);
    const newState = !isFavorite;
    setIsFavorite(newState);
    try {
      const res = await fetch('/api/auth/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token !== 'nextauth' ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ propertyId }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.isFavorite) {
          toast.success("Added to favorites");
        } else {
          toast("Removed from favorites", { icon: "💔" });
        }
        setIsFavorite(data.isFavorite);
      } else {
        setIsFavorite(!newState); // revert
      }
    } catch {
      setIsFavorite(!newState); // revert
    } finally {
      setIsTogglingFav(false);
    }
  };

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
      loading: "Loading property...", notFound: "Property not found.",
      balcony: "Balcony", totalFloors: "Total Floors", floorNumber: "Floor No.",
      furnishing: "Furnishing", maintenanceCharges: "Maintenance Charges",
      additionalRooms: "ADDITIONAL ROOMS", overlooking: "OVERLOOKING",
      tenantsPrefer: "TENANTS PREFERRED", localityDescription: "LOCALITY DESCRIPTION",
      facing: "Facing", usp: "WHY THIS PROPERTY"
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
      loading: "Chargement...", notFound: "Propriété introuvable.",
      balcony: "Balcon", totalFloors: "Nombre d'étages", floorNumber: "Étage",
      furnishing: "Ameublement", maintenanceCharges: "Charges de maintenance",
      additionalRooms: "PIÈCES SUPPLÉMENTAIRES", overlooking: "VUE SUR",
      tenantsPrefer: "LOCATAIRES PRÉFÉRÉS", localityDescription: "DESCRIPTION DE LA LOCALITÉ",
      facing: "Orientation", usp: "POURQUOI CETTE PROPRIÉTÉ"
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

  const handleSubmitReport = async () => {
    if (!reportReason) { toast.error("Please select a reason"); return; }
    if (reportDescription.trim().length < 10) { toast.error("Please provide more details"); return; }
    setReportSubmitting(true);
    try {
      const res = await fetch(`/api/properties/${propertyId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && token !== 'nextauth' ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ reason: reportReason, description: reportDescription }),
      });
      const data = await res.json();
      if (res.ok) {
        setReportDone(true);
        toast.success("Report submitted. Thank you!");
      } else {
        toast.error(data.error || "Failed to submit report");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setReportSubmitting(false);
    }
  };

  // ── Derived display values ─────────────────────────────────────────────────
  const rulesDisplay: Record<string, string> = property?.rules || {};

  // services can be string[] (PG) or Record<string,string> (Tenant/legacy)
  const rawServices = property?.services;
  const servicesArray: string[] = Array.isArray(rawServices) ? rawServices : [];
  const servicesDisplay: Record<string, string> = (!Array.isArray(rawServices) && rawServices && typeof rawServices === 'object') ? rawServices : {};

  // amenities: PG uses commonAmenities, Tenant uses societyAmenities
  const amenitiesList: string[] = property
    ? (property.propertyType === "PG"
        ? (property.commonAmenities || [])
        : (property.societyAmenities || []))
    : [];

  // description
  const description = property?.pgDescription || property?.localityDescription || "";

  // PG room availability counts
  const pgRooms: Array<{ id: string; name: string; image?: string }> = property?.roomImages || [];

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

              {/* Room name label */}
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
                  <> ({pgRooms.length})</>
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
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:items-start relative" ref={contentRef}>
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
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                      {property.propertyType === "Tenant" && property.societyName ? property.societyName : property.title}
                    </h1>
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${property.propertyType === "PG" ? "bg-blue-600 text-white" : "bg-green-600 text-white"}`}>
                      {property.propertyType}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 flex items-center gap-1.5 sm:gap-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="line-clamp-2">{property.fullAddress}, {property.areaName}, {property.state}</span>
                  </p>
                </div>
                {user?.role !== 'landlord' && (
                <button onClick={handleToggleFavorite}
                  disabled={isTogglingFav}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 ${isFavorite ? 'bg-red-50 border-2 border-red-500 text-red-600 hover:bg-red-100' : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-primary hover:bg-primary/5 hover:text-primary'}`}>
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-current"}`} />
                  <span className="whitespace-nowrap hidden sm:inline">{t.addToFavorites}</span>
                  <span className="whitespace-nowrap sm:hidden">Favorite</span>
                </button>
                )}
              </div>

              {/* Description */}
              {description && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.description}</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{description}</p>
                </div>
              )}

              {/* USP */}
              {property.uspText && (
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {property.uspCategory && (
                      <span className="px-2 py-0.5 bg-primary text-white text-xs font-semibold rounded-full capitalize">
                        {property.uspCategory}
                      </span>
                    )}
                    <h3 className="text-xs sm:text-sm font-semibold text-primary">{t.usp}</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{property.uspText}</p>
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
                  {property.propertyType === "PG" && (property.pgFor || property.preferredGender) && (
                    <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                      <span className="text-sm sm:text-base text-gray-600">{t.pgFor}</span>
                      <span className="text-sm sm:text-base font-semibold text-gray-900">{property.pgFor || property.preferredGender}</span>
                    </div>
                  )}
                  {property.propertyType === "PG" && (property.preferredTenants || property.tenantPreference) && (
                    <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                      <span className="text-sm sm:text-base text-gray-600">{t.preferredTenants}</span>
                      <span className="text-sm sm:text-base font-semibold text-gray-900">{property.preferredTenants || property.tenantPreference}</span>
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
                  {/* Tenant-specific detail rows */}
                  {property.propertyType === "Tenant" && property.balcony && (
                    <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                      <span className="text-sm sm:text-base text-gray-600">{t.balcony}</span>
                      <span className="text-sm sm:text-base font-semibold text-gray-900">{property.balcony}</span>
                    </div>
                  )}
                  {property.propertyType === "Tenant" && property.totalFloors && (
                    <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                      <span className="text-sm sm:text-base text-gray-600">{t.totalFloors}</span>
                      <span className="text-sm sm:text-base font-semibold text-gray-900">{property.totalFloors}</span>
                    </div>
                  )}
                  {property.propertyType === "Tenant" && property.floorNumber && (
                    <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                      <span className="text-sm sm:text-base text-gray-600">{t.floorNumber}</span>
                      <span className="text-sm sm:text-base font-semibold text-gray-900">{property.floorNumber}</span>
                    </div>
                  )}
                  {property.propertyType === "Tenant" && property.furnishing && property.furnishing.length > 0 && (
                    <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                      <span className="text-sm sm:text-base text-gray-600">{t.furnishing}</span>
                      <span className="text-sm sm:text-base font-semibold text-gray-900">{property.furnishing.join(", ")}</span>
                    </div>
                  )}
                  {property.propertyType === "Tenant" && property.facing && (
                    <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                      <span className="text-sm sm:text-base text-gray-600">{t.facing}</span>
                      <span className="text-sm sm:text-base font-semibold text-gray-900">{property.facing}</span>
                    </div>
                  )}
                  {property.propertyType === "Tenant" && property.maintenanceCharges && (
                    <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                      <span className="text-sm sm:text-base text-gray-600">{t.maintenanceCharges}</span>
                      <span className="text-sm sm:text-base font-semibold text-gray-900">
                        {currencySymbol} {property.maintenanceCharges}{property.maintenanceType ? ` (${property.maintenanceType})` : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tenant: Additional Rooms, Overlooking, Tenants Prefer */}
              {property.propertyType === "Tenant" && (
                <>
                  {property.additionalRooms && property.additionalRooms.length > 0 && (
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.additionalRooms}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                        {property.additionalRooms.map((room: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm text-gray-700">{room}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {property.overlooking && property.overlooking.length > 0 && (
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.overlooking}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                        {property.overlooking.map((view: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm text-gray-700">{view}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {property.tenantsPrefer && property.tenantsPrefer.length > 0 && (
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.tenantsPrefer}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                        {property.tenantsPrefer.map((pref: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm text-gray-700">{pref}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {property.localityDescription && (
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.localityDescription}</h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{property.localityDescription}</p>
                    </div>
                  )}
                </>
              )}
              {/* Nearby Places */}
              {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">
                    {language === 'fr' ? 'LIEUX À PROXIMITÉ' : 'NEARBY PLACES'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {property.nearbyPlaces.map((place: { name: string; distance: string } | string, i: number) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs sm:text-sm font-medium">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {typeof place === 'string' ? place : place.name}
                        {typeof place !== 'string' && place.distance && (
                          <span className="text-blue-500 font-normal">· {place.distance}</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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

              {/* PG Room Details */}
              {property.propertyType === "PG" && property.roomDetails && Object.keys(property.roomDetails).length > 0 && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4 uppercase tracking-wide">
                    {language === "fr" ? "Détails des chambres" : "Room Details"}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {Object.entries(property.roomDetails as Record<string, any>).map(([category, detail]) => (
                      <div key={category} className="border border-gray-200 rounded-xl p-4 hover:border-primary/40 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-900 text-base">{category} Bed</h4>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                            {detail.availableBeds ?? detail.availableRooms ?? "—"} {language === "fr" ? "dispo" : "available"}
                          </span>
                        </div>
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{language === "fr" ? "Total lits" : "Total Beds"}</span>
                            <span className="font-semibold text-gray-900">{detail.totalBeds ?? detail.totalRooms ?? "—"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{t.monthlyRent}</span>
                            <span className="font-bold text-primary">{currencySymbol} {Number(detail.monthlyRent).toLocaleString()}</span>
                          </div>
                          {detail.securityDeposit && Number(detail.securityDeposit) > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">{t.deposit}</span>
                              <span className="font-semibold text-gray-900">{currencySymbol} {Number(detail.securityDeposit).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                        {detail.facilities && detail.facilities.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                            {detail.facilities.map((f: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">{f}</span>
                            ))}
                          </div>
                        )}
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
                    {property.pgRules.map((rule: string, index: number) => {
                      const ruleLabels: Record<string, string> = {
                        guardian: "Guardian not allowed",
                        nonveg: "Non-Veg Food not allowed",
                        gender: "Opposite Gender not allowed",
                        alcohol: "Alcohol not allowed",
                        smoking: "Smoking not allowed",
                      };
                      const label = ruleLabels[rule] || rule;
                      return (
                        <div key={index} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                          <span className="text-xs sm:text-sm text-gray-700">{label}</span>
                        </div>
                      );
                    })}
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
              {(servicesArray.length > 0 || Object.keys(servicesDisplay).length > 0) && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.services}</h3>
                  {/* PG: string array */}
                  {servicesArray.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {servicesArray.map((service: string, index: number) => {
                        const serviceLabels: Record<string, string> = {
                          laundry: "Laundry",
                          cleaning: "Room Cleaning",
                          warden: "Warden",
                        };
                        const label = serviceLabels[service] || service;
                        return (
                          <div key={index} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm text-gray-700">{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/* Tenant/legacy: Record<string,string> */}
                  {Object.keys(servicesDisplay).length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {Object.entries(servicesDisplay).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                          <span className="text-sm sm:text-base text-gray-600 capitalize">{key}</span>
                          <span className={`text-sm sm:text-base font-semibold ${val === "Included" || val === "Daily" ? "text-green-600" : "text-gray-900"}`}>{val}</span>
                        </div>
                      ))}
                    </div>
                  )}
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
                {(() => {
                  // Build embed URL from lat/lng or fallback to address geocoding
                  let embedSrc = "";
                  if (property.latitude && property.longitude) {
                    embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(property.latitude)},${encodeURIComponent(property.longitude)}&z=15&output=embed`;
                  } else {
                    const query = [property.fullAddress, property.areaName, property.state, property.location]
                      .filter(Boolean).join(", ");
                    embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
                  }
                  return (
                    <div className="w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden">
                      <iframe
                        src={embedSrc}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  );
                })()}
                {property.latitude && property.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs sm:text-sm text-primary hover:underline"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Open in Google Maps
                  </a>
                )}
              </div>

              {/* Reviews */}
              <ReviewSection propertyId={propertyId} language={language} country={country} />

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
              <div ref={sidebarRef}>
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
                  {/* PG: show per-room-type pricing */}
                  {property.propertyType === 'PG' && property.roomDetails && Object.keys(property.roomDetails).length > 0 ? (
                    <>
                      <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase tracking-wide mb-3">
                        {language === 'fr' ? 'Prix par type de chambre' : 'Price by Room Type'}
                      </p>
                      <div className="space-y-2 mb-4">
                        {Object.entries(property.roomDetails as Record<string, any>).map(([category, detail]) => (
                          <div key={category} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
                              <span className="text-sm font-medium text-gray-700">{category} Bed</span>
                              {(detail.availableBeds ?? detail.availableRooms) && (
                                <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">
                                  {detail.availableBeds ?? detail.availableRooms} {language === 'fr' ? 'dispo' : 'avail.'}
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-bold text-primary">
                              {currencySymbol} {Number(detail.monthlyRent).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mb-3 sm:mb-4">
                        {t.securityDeposit}: {currencySymbol} {property.deposit}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{t.monthlyRent}</p>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1">{currencySymbol} {property.price}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{t.securityDeposit}: {currencySymbol} {property.deposit}</p>
                    </>
                  )}

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

                  {!isOwner && (
                  <button onClick={() => {
                    if (!isAuthenticated) {
                      router.push(`/${country}/login?redirect=${encodeURIComponent(`/${country}/property/${propertyId}`)}`);
                      return;
                    }
                    setShowContactForm(true);
                  }}
                    className="w-full py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors mb-3 sm:mb-4">
                    {t.contactOwner}
                  </button>
                  )}

                  {/* Call Owner */}
                  {!isOwner && (
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push(`/${country}/login?redirect=${encodeURIComponent(`/${country}/property/${propertyId}`)}&reason=call`);
                        return;
                      }
                      const phone = property.ownerPhone || property.landlord?.phone;
                      if (phone) window.location.href = `tel:${phone}`;
                    }}
                    className={`w-full py-2.5 sm:py-3 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors mb-3 sm:mb-4 flex items-center justify-center gap-2 ${
                      property.ownerPhone || property.landlord?.phone
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-300 cursor-not-allowed'
                    }`}
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    {language === 'fr' ? 'Appeler le propriétaire' : 'Call Owner'}
                  </button>
                  )}

                  <button onClick={() => setShowShareModal(true)}
                    className="w-full py-2.5 sm:py-3 border-2 border-gray-300 hover:border-primary text-gray-700 text-sm sm:text-base font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t.share}
                  </button>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 text-center">{t.anyConcerns}</p>
                    <p className="text-sm text-center">
                      {user?.role === 'renter' ? (
                        <button
                          onClick={() => { setShowReportModal(true); setReportDone(false); setReportReason(""); setReportDescription(""); }}
                          className="text-red-600 hover:text-red-700 font-semibold"
                        >
                          {t.reportIt}
                        </button>
                      ) : !isAuthenticated ? (
                        <span className="text-red-600 font-semibold">{t.reportIt}</span>
                      ) : null}{" "}
                      {(user?.role === 'renter' || !isAuthenticated) && (
                        <span className="text-gray-600">{t.toOurTeam}</span>
                      )}
                    </p>
                    {!isAuthenticated && (
                      <p className="text-xs text-gray-400 text-center mt-1">
                        <Link href={`/${country}/login`} className="text-primary underline">Login</Link> as a tenant to report
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SubscribeSection />
        </div>
      </div>

      {/* WhatsApp floating button */}
      <style>{`
        @keyframes wa-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .wa-float { animation: wa-bounce 2s ease-in-out infinite; }
        .wa-float:hover { animation-play-state: paused; }
      `}</style>
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group/wa">
        <span className="hidden group-hover/wa:block bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
          {language === 'fr' ? 'Discuter sur WhatsApp avec le propriétaire' : 'Chat on WhatsApp with owner'}
        </span>
        <button
          onClick={() => {
            if (!isAuthenticated) {
              toast.error(language === 'fr' ? 'Veuillez vous connecter pour contacter le propriétaire' : 'Please login to contact the owner');
              router.push(`/${country}/login?redirect=${encodeURIComponent(`/${country}/property/${propertyId}`)}`);
              return;
            }
            window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this property: ${property?.title} - ${window.location.href}`)}`, '_blank');
          }}
          className="wa-float w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-[#1ebe5d] transition-colors duration-300 cursor-pointer"
          aria-label="Chat on WhatsApp with owner"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
      </div>

      <ContactOwnerForm isOpen={showContactForm} onClose={() => setShowContactForm(false)} property={property} language={language} token={token} />

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

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Report this property</h2>
              <button onClick={() => setShowReportModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5">
              {reportDone ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-gray-900 mb-1">Report submitted</p>
                  <p className="text-sm text-gray-500">Our team will review it shortly. Thank you.</p>
                  <button onClick={() => setShowReportModal(false)} className="mt-5 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm">Close</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reason <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-2">
                      {REPORT_REASONS.map(r => (
                        <button
                          key={r}
                          onClick={() => setReportReason(r)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors text-left ${reportReason === r ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Details <span className="text-red-500">*</span></label>
                    <textarea
                      value={reportDescription}
                      onChange={e => setReportDescription(e.target.value)}
                      placeholder="Describe the issue in detail..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{reportDescription.length}/1000</p>
                  </div>
                  <button
                    onClick={handleSubmitReport}
                    disabled={reportSubmitting}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm"
                  >
                    {reportSubmitting ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp sticky button */}
      {property.landlord?.phone && (
        <button
          onClick={() => {
            if (!isAuthenticated) {
              toast.error(language === 'fr' ? 'Veuillez vous connecter pour contacter le propriétaire' : 'Please login to contact the owner');
              router.push(`/${country}/login?redirect=${encodeURIComponent(`/${country}/property/${propertyId}`)}`);
              return;
            }
            window.open(`https://wa.me/${property.landlord.phone.replace(/\s/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in ${property.title} at ${property.location}`)}`, '_blank');
          }}
          className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-green-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 group animate-bounce cursor-pointer">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="absolute right-full mr-2 sm:mr-3 px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-lg hidden sm:block">
            Chat on WhatsApp with owner
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></span>
          </span>
        </button>
      )}
    </div>
  );
}
