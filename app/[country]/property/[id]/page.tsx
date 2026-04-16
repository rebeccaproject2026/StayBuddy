"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import { ChevronRight, Heart, MapPin } from "lucide-react";
import ContactOwnerForm from "@/components/ContactOwnerForm";
import SubscribeSection from "@/components/SubscribeSection";
import toast from "react-hot-toast";

import ImageGallery from "@/components/property/ImageGallery";
import PricingCard from "@/components/property/PricingCard";
import PropertySections from "@/components/property/PropertySections";
import ShareModal from "@/components/property/ShareModal";
import ReportModal from "@/components/property/ReportModal";
import WhatsAppButton from "@/components/property/WhatsAppButton";
import MobileActionBar from "@/components/property/MobileActionBar";

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
    facing: "Facing", usp: "WHY THIS PROPERTY",
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
    facing: "Orientation", usp: "POURQUOI CETTE PROPRIÉTÉ",
  },
};

const normaliseStringImages = (arr: string[] | undefined, prefix: string) =>
  (arr || []).map((img, i) => ({ id: `${prefix}-${i}`, name: `${prefix} ${i + 1}`, image: img }));

export default function PropertyDetailsPage() {
  const params = useParams();
  const { language, t: translate } = useLanguage();
  const { isAuthenticated, token, user } = useAuth();
  const isOwner = user?.role === "landlord";
  const router = useRouter();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFav, setIsTogglingFav] = useState(false);
  const [direction, setDirection] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedSpaceType, setSelectedSpaceType] = useState("rooms");
  const [property, setProperty] = useState<any>(null);
  const [relatedProperties, setRelatedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportDone, setReportDone] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const propertyId = params.id as string;
  const country = params.country as string;
  const currencySymbol = country === "fr" ? "€" : "₹";
  const monthText = translate("currency.perMonth");
  const t = content[language as keyof typeof content] || content.en;

  // Sticky sidebar
  useEffect(() => {
    const NAVBAR_HEIGHT = 96;
    let rafId: number | null = null;
    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        const sidebar = sidebarRef.current;
        if (sidebar) { sidebar.style.position = ""; sidebar.style.top = ""; sidebar.style.width = ""; }
        return;
      }
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const sidebar = sidebarRef.current;
        const content = contentRef.current;
        if (!sidebar || !content) return;
        const contentTop = content.getBoundingClientRect().top + window.scrollY;
        const stopSticky = contentTop + content.offsetHeight - sidebar.offsetHeight - NAVBAR_HEIGHT;
        const scrollY = window.scrollY;
        if (scrollY < contentTop - NAVBAR_HEIGHT) {
          sidebar.style.position = "relative"; sidebar.style.top = "0"; sidebar.style.width = "";
        } else if (scrollY < stopSticky) {
          sidebar.style.position = "fixed"; sidebar.style.top = `${NAVBAR_HEIGHT}px`;
          sidebar.style.width = `${sidebar.parentElement?.offsetWidth ?? 0}px`;
        } else {
          sidebar.style.position = "absolute"; sidebar.style.top = `${content.offsetHeight - sidebar.offsetHeight}px`; sidebar.style.width = "";
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Fetch property
  useEffect(() => {
    if (!propertyId) return;
    setLoading(true); setNotFound(false);
    fetch(`/api/properties/${propertyId}`)
      .then(res => { if (res.status === 404) { setNotFound(true); return null; } return res.json(); })
      .then(data => { if (!data) return; data.success && data.property ? setProperty(data.property) : setNotFound(true); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [propertyId]);

  // Fetch related
  useEffect(() => {
    if (!property) return;
    fetch(`/api/properties?country=${property.country}&limit=3`)
      .then(r => r.json())
      .then(data => { if (data.success) setRelatedProperties((data.properties || []).filter((p: any) => p._id !== propertyId).slice(0, 3)); })
      .catch(() => {});
  }, [property, propertyId]);

  // Reset on property change
  useEffect(() => {
    setCurrentImageIndex(0); setSelectedSpaceType("rooms"); setIsFavorite(false);
    setShowContactForm(false); setShowShareModal(false); setCopySuccess(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [propertyId]);

  // Fetch favorites
  useEffect(() => {
    if (!isAuthenticated || !token || !propertyId) return;
    fetch("/api/auth/favorites", { headers: token !== "nextauth" ? { Authorization: `Bearer ${token}` } : {} })
      .then(r => r.json())
      .then(data => { if (data.success) setIsFavorite(data.favorites.map((f: any) => f._id?.toString() ?? f.toString()).includes(propertyId)); })
      .catch(() => {});
  }, [isAuthenticated, token, propertyId]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !token) { toast.error("Please login to save favorites"); router.push(`/${country}/login`); return; }
    if (user?.role === "landlord") { toast.error("Landlords cannot save favorites"); return; }
    if (isTogglingFav) return;
    setIsTogglingFav(true);
    const newState = !isFavorite;
    setIsFavorite(newState);
    try {
      const res = await fetch("/api/auth/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token !== "nextauth" ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ propertyId }),
      });
      const data = await res.json();
      if (data.success) { toast[data.isFavorite ? "success" : "custom"](data.isFavorite ? "Added to favorites" : "Removed from favorites", data.isFavorite ? undefined : { icon: "💔" }); setIsFavorite(data.isFavorite); }
      else setIsFavorite(!newState);
    } catch { setIsFavorite(!newState); }
    finally { setIsTogglingFav(false); }
  };

  const getCurrentImages = () => {
    if (!property) return [];
    if (property.propertyType === "PG") {
      const map: Record<string, any[]> = { rooms: property.roomImages || [], kitchen: normaliseStringImages(property.kitchenImages, "Kitchen"), washroom: normaliseStringImages(property.washroomImages, "Washroom"), commonArea: normaliseStringImages(property.commonAreaImages, "Common Area") };
      return map[selectedSpaceType] || property.roomImages || [];
    }
    const map: Record<string, any[]> = {
      rooms: property.tenantRoomImages?.length ? property.tenantRoomImages : normaliseStringImages(property.images, "Room"),
      kitchen: normaliseStringImages(property.tenantKitchenImages, "Kitchen"),
      washroom: normaliseStringImages(property.tenantWashroomImages, "Washroom"),
      commonArea: normaliseStringImages(property.tenantCommonAreaImages, "Common Area"),
    };
    return map[selectedSpaceType] || normaliseStringImages(property.images, "Image");
  };

  const currentImages = getCurrentImages();

  const nextImage = () => { if (!currentImages.length) return; setDirection(1); setCurrentImageIndex(p => (p + 1) % currentImages.length); };
  const prevImage = () => { if (!currentImages.length) return; setDirection(-1); setCurrentImageIndex(p => (p - 1 + currentImages.length) % currentImages.length); };
  const handleSpaceTypeChange = (type: string) => { setSelectedSpaceType(type); setCurrentImageIndex(0); };

  // Share handlers
  const handleCopyLink = () => { navigator.clipboard.writeText(window.location.href).then(() => { setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); }); };
  const handleShareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this property: ${property?.title} - ${window.location.href}`)}`, "_blank");
  const handleShareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
  const handleShareTwitter = () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out this property: ${property?.title}`)}`, "_blank");
  const handleShareEmail = () => { window.location.href = `mailto:?subject=${encodeURIComponent(`Property: ${property?.title}`)}&body=${encodeURIComponent(`I found this property:\n\n${property?.title}\n${property?.location}\n\n${window.location.href}`)}`; };

  const handleSubmitReport = async () => {
    if (!reportReason) { toast.error("Please select a reason"); return; }
    if (reportDescription.trim().length < 10) { toast.error("Please provide more details"); return; }
    setReportSubmitting(true);
    try {
      const res = await fetch(`/api/properties/${propertyId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && token !== "nextauth" ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ reason: reportReason, description: reportDescription }),
      });
      const data = await res.json();
      res.ok ? (setReportDone(true), toast.success("Report submitted. Thank you!")) : toast.error(data.error || "Failed to submit report");
    } catch { toast.error("Something went wrong"); }
    finally { setReportSubmitting(false); }
  };

  const openReport = () => { setShowReportModal(true); setReportDone(false); setReportReason(""); setReportDescription(""); };
  const loginRedirect = (reason?: string) => router.push(`/${country}/login?redirect=${encodeURIComponent(`/${country}/property/${propertyId}`)}${reason ? `&reason=${reason}` : ""}`);
  const handleContact = () => { if (!isAuthenticated) { loginRedirect(); return; } setShowContactForm(true); };

  // Derived values
  const rulesDisplay: Record<string, string> = property?.rules || {};
  const rawServices = property?.services;
  const servicesArray: string[] = Array.isArray(rawServices) ? rawServices : [];
  const servicesDisplay: Record<string, string> = (!Array.isArray(rawServices) && rawServices && typeof rawServices === "object") ? rawServices : {};
  const amenitiesList: string[] = property ? (property.propertyType === "PG" ? property.commonAmenities || [] : property.societyAmenities || []) : [];
  const description = property?.pgDescription || property?.localityDescription || "";

  const pricingCardProps = { property, language, currencySymbol, t, isOwner, isAuthenticated, user, country, propertyId, onContact: handleContact, onShare: () => setShowShareModal(true), onReport: openReport, onLoginRedirect: loginRedirect };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{t.loading}</p>
      </div>
    </div>
  );

  if (notFound || !property) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900 mb-2">{t.notFound}</p>
        <Link href="/properties" className="text-primary hover:underline">{t.viewMore}</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
      <ImageGallery
        property={property}
        currentImages={currentImages}
        currentImageIndex={currentImageIndex}
        direction={direction}
        selectedSpaceType={selectedSpaceType}
        t={t}
        onPrev={prevImage}
        onNext={nextImage}
        onDotClick={(i) => { setDirection(i > currentImageIndex ? 1 : -1); setCurrentImageIndex(i); }}
        onSpaceTypeChange={handleSpaceTypeChange}
      />

      <div className="px-4">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:items-start relative" ref={contentRef}>

            {/* Mobile pricing card */}
            <div className="lg:hidden col-span-full">
              <PricingCard {...pricingCardProps} isMobile />
            </div>

            {/* Left column */}
            <div className="lg:col-span-2 min-w-0">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 overflow-x-auto">
                <Link href="/" className="hover:text-primary whitespace-nowrap">{t.home}</Link>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <Link href="/properties" className="hover:text-primary whitespace-nowrap">{t.properties}</Link>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-gray-900 truncate">{property.location?.split(",")[0]}</span>
              </div>

              {/* Title */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                      {property.propertyType === "Tenant" && property.societyName ? property.societyName : property.title}
                    </h1>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${property.propertyType === "PG" ? "bg-blue-600 text-white" : "bg-green-600 text-white"}`}>
                      {property.propertyType}
                    </span>
                  </div>
                  {user?.role !== "landlord" && (
                    <button onClick={handleToggleFavorite} disabled={isTogglingFav}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 flex-shrink-0 ${isFavorite ? "bg-red-50 border-2 border-red-500 text-red-600 hover:bg-red-100" : "bg-white border-2 border-gray-300 text-gray-700 hover:border-primary hover:bg-primary/5 hover:text-primary"}`}>
                      <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-current"}`} />
                      <span className="hidden sm:inline whitespace-nowrap">{t.addToFavorites}</span>
                    </button>
                  )}
                </div>
                <p className="text-sm sm:text-base text-gray-600 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{property.fullAddress}, {property.areaName}, {property.state}</span>
                </p>
              </div>

              {/* Description */}
              {description && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.description}</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{description}</p>
                </div>
              )}

              <PropertySections
                property={property}
                language={language}
                currencySymbol={currencySymbol}
                monthText={monthText}
                t={t}
                propertyId={propertyId}
                country={country}
                relatedProperties={relatedProperties}
                amenitiesList={amenitiesList}
                rulesDisplay={rulesDisplay}
                servicesArray={servicesArray}
                servicesDisplay={servicesDisplay}
              />
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div ref={sidebarRef}>
                <PricingCard {...pricingCardProps} />
              </div>
            </div>
          </div>

          <SubscribeSection />
        </div>
      </div>

      {/* Mobile sticky bar */}
      {!isOwner && (
        <MobileActionBar
          property={property}
          language={language}
          isAuthenticated={isAuthenticated}
          t={t}
          onContact={handleContact}
          onShare={() => setShowShareModal(true)}
          onLoginRedirect={loginRedirect}
        />
      )}

      {/* WhatsApp button */}
      {!isOwner && (
        <WhatsAppButton
          property={property}
          language={language}
          isAuthenticated={isAuthenticated}
          country={country}
          propertyId={propertyId}
          onLoginRedirect={() => loginRedirect()}
        />
      )}

      <ContactOwnerForm isOpen={showContactForm} onClose={() => setShowContactForm(false)} property={property} language={language} country={country} token={token} />

      {showShareModal && (
        <ShareModal
          property={property}
          t={t}
          copySuccess={copySuccess}
          onClose={() => setShowShareModal(false)}
          onCopy={handleCopyLink}
          onWhatsApp={handleShareWhatsApp}
          onFacebook={handleShareFacebook}
          onTwitter={handleShareTwitter}
          onEmail={handleShareEmail}
        />
      )}

      {showReportModal && (
        <ReportModal
          reportDone={reportDone}
          reportReason={reportReason}
          reportDescription={reportDescription}
          reportSubmitting={reportSubmitting}
          onClose={() => setShowReportModal(false)}
          onReasonSelect={setReportReason}
          onDescriptionChange={setReportDescription}
          onSubmit={handleSubmitReport}
        />
      )}
    </div>
  );
}
