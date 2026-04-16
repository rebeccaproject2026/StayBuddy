"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "@/components/LocalizedLink";
import { getToken } from "@/lib/token-storage";
import toast from "react-hot-toast";
import { useSocketContext } from "@/contexts/SocketContext";
import { Home, Sun, Moon } from "lucide-react";

import OwnerSidebar from "@/components/owner/OwnerSidebar";
import OwnerMobileNav from "@/components/owner/OwnerMobileNav";
import OwnerListingsTab from "@/components/owner/OwnerListingsTab";
import OwnerContactsTab from "@/components/owner/OwnerContactsTab";
import OwnerMessagesTab from "@/components/owner/OwnerMessagesTab";
import OwnerProfileTab from "@/components/owner/OwnerProfileTab";
import OwnerModals from "@/components/owner/OwnerModals";
import type { TcContent, PhotoCat } from "@/components/owner/types";

export default function OwnerDashboard() {
  const { language, t } = useLanguage();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "listings");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("owner_theme");
    setIsDark(saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("owner_theme", next ? "dark" : "light");
  };

  // ── Listings state ──────────────────────────────────────────────────────────
  const [myListings, setMyListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  // ── Contact requests state ──────────────────────────────────────────────────
  const [contactRequests, setContactRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [inquiryPage, setInquiryPage] = useState(1);
  const INQUIRIES_PER_PAGE = 6;

  // ── Modal / selection state ─────────────────────────────────────────────────
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ── Edit form state ─────────────────────────────────────────────────────────
  const [editingListing, setEditingListing] = useState<any | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editNewFiles, setEditNewFiles] = useState<File[]>([]);
  const [editCatImages, setEditCatImages] = useState<Record<PhotoCat, string[]>>({ kitchen: [], washroom: [], commonArea: [] });
  const [editCatNewFiles, setEditCatNewFiles] = useState<Record<PhotoCat, File[]>>({ kitchen: [], washroom: [], commonArea: [] });
  const [editRoomImages, setEditRoomImages] = useState<any[]>([]);
  const [editRoomNewFiles, setEditRoomNewFiles] = useState<File[]>([]);
  const [editVerifImages, setEditVerifImages] = useState<string[]>([]);
  const [editVerifNewFiles, setEditVerifNewFiles] = useState<File[]>([]);

  // ── Chat / socket state ─────────────────────────────────────────────────────
  const ownerToken = getToken();
  const { totalUnread: chatUnread, unreadByRequest, markSeen: socketMarkSeen, clearAll: resetUnread, onNotification } = useSocketContext();
  const [activeChatRequestId, setActiveChatRequestId] = useState<string | null>(null);

  useEffect(() => {
    const off = onNotification(() => {
      if (activeTab !== "messages") {
        toast("New message received", { icon: "💬" });
      }
    });
    return off;
  }, [onNotification, activeTab]);

  // ── Seen inquiry IDs ────────────────────────────────────────────────────────
  const [seenInquiryIds, setSeenInquiryIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try { return new Set(JSON.parse(localStorage.getItem("staybuddy_owner_inquiry_seen") || "[]")); } catch { return new Set(); }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("staybuddy_owner_inquiry_seen", JSON.stringify([...seenInquiryIds]));
    }
  }, [seenInquiryIds]);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) { router.push("/login"); return; }
      if (user?.role !== "landlord") {
        if (user?.role === "renter") router.push("/dashboard/tenant");
        else if (user?.role === "admin") router.push("/dashboard/admin");
        else router.push("/");
        return;
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  // ── Fetch listings ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "landlord") return;
    const token = getToken();
    setListingsLoading(true);
    fetch("/api/properties?mine=true&limit=50", { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(res => res.json())
      .then(data => { if (data.success) setMyListings(data.properties || []); })
      .catch(() => {})
      .finally(() => setListingsLoading(false));
  }, [isAuthenticated, user]);

  // ── Fetch contact requests (poll every 30s) ─────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "landlord") return;
    const token = getToken();
    const fetchRequests = () =>
      fetch("/api/contact-requests", { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        .then(r => r.json())
        .then(data => { if (data.success) setContactRequests(data.requests || []); })
        .catch(() => {});
    setRequestsLoading(true);
    fetchRequests().finally(() => setRequestsLoading(false));
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  // ── Loading / auth guard renders ────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>Loading...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated || user?.role !== "landlord") return null;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleRequestAction = async (id: string, status: "accepted" | "rejected") => {
    const token = getToken();
    try {
      const res = await fetch(`/api/contact-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) setContactRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
    } catch {}
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    const token = getToken();
    try {
      const res = await fetch(`/api/contact-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) setContactRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
    } catch {}
  };

  const openEdit = (listing: any) => {
    setSelectedListing(null);
    setEditError("");
    setEditForm({
      title: listing.title || "", propertyType: listing.propertyType || "PG",
      price: String(listing.price || ""), deposit: String(listing.deposit || ""),
      location: listing.location || "", fullAddress: listing.fullAddress || "",
      areaName: listing.areaName || "", state: listing.state || "",
      pincode: listing.pincode || "", landmark: listing.landmark || "",
      googleMapLink: listing.googleMapLink || "", latitude: listing.latitude || "", longitude: listing.longitude || "",
      rooms: String(listing.rooms || ""), bathrooms: String(listing.bathrooms || ""),
      area: String(listing.area || ""), availableFrom: listing.availableFrom || "",
      pgDescription: listing.pgDescription || "",
      pgFor: listing.pgFor || listing.preferredGender || "", tenantPreference: listing.tenantPreference || "",
      noticePeriod: listing.noticePeriod || "", gateClosingTime: listing.gateClosingTime || "",
      pgRules: listing.pgRules || [], services: Array.isArray(listing.services) ? listing.services : [],
      foodProvided: listing.foodProvided || false, meals: listing.meals || [],
      vegNonVeg: listing.vegNonVeg || "", foodCharges: listing.foodCharges || "",
      commonAmenities: listing.commonAmenities || [], parkingAvailable: listing.parkingAvailable || false,
      parkingType: listing.parkingType || "", operationalSince: listing.operationalSince || "",
      pgPresentIn: listing.pgPresentIn || "", pgName: listing.pgName || "",
      societyName: listing.societyName || "", bhk: listing.bhk || "",
      furnishing: Array.isArray(listing.furnishing) ? listing.furnishing : [],
      floorNumber: listing.floorNumber || "", totalFloors: listing.totalFloors || "",
      balcony: listing.balcony || "", facing: listing.facing || "",
      maintenanceCharges: listing.maintenanceCharges || "", maintenanceType: listing.maintenanceType || "",
      securityAmount: listing.securityAmount || listing.monthlyRentAmount ? String(listing.deposit || "") : "",
      monthlyRentAmount: listing.monthlyRentAmount || String(listing.price || ""),
      additionalRooms: listing.additionalRooms || [], overlooking: listing.overlooking || [],
      societyAmenities: listing.societyAmenities || [], tenantsPrefer: listing.tenantsPrefer || [],
      localityDescription: listing.localityDescription || "", nearbyPlaces: listing.nearbyPlaces || [],
      nearbyPlaceInput: "", nearbyDistanceInput: "",
      uspCategory: listing.uspCategory || "", uspText: listing.uspText || "",
      roomDetails: listing.roomDetails ? JSON.parse(JSON.stringify(listing.roomDetails)) : {},
      tenantRooms: listing.tenantRooms ? JSON.parse(JSON.stringify(listing.tenantRooms)) : [],
    });
    setEditImages(listing.images || []);
    setEditNewFiles([]);
    setEditCatImages({
      kitchen: listing.propertyType === "PG" ? (listing.kitchenImages || []) : (listing.tenantKitchenImages || []),
      washroom: listing.propertyType === "PG" ? (listing.washroomImages || []) : (listing.tenantWashroomImages || []),
      commonArea: listing.propertyType === "PG" ? (listing.commonAreaImages || []) : (listing.tenantCommonAreaImages || []),
    });
    setEditCatNewFiles({ kitchen: [], washroom: [], commonArea: [] });
    setEditRoomImages(listing.propertyType === "PG" ? (listing.roomImages || []) : (listing.tenantRoomImages || []));
    setEditRoomNewFiles([]);
    setEditVerifImages(listing.verificationImages || []);
    setEditVerifNewFiles([]);
    setEditingListing(listing);
  };

  const closeEdit = () => {
    setEditingListing(null); setEditError("");
    setEditImages([]); setEditNewFiles([]);
    setEditCatImages({ kitchen: [], washroom: [], commonArea: [] });
    setEditCatNewFiles({ kitchen: [], washroom: [], commonArea: [] });
    setEditRoomImages([]); setEditRoomNewFiles([]);
    setEditVerifImages([]); setEditVerifNewFiles([]);
  };

  const saveEdit = async () => {
    if (!editingListing) return;
    setEditSaving(true); setEditError("");
    const token = getToken();
    const id = editingListing._id;
    const toBase64 = (file: File): Promise<string> =>
      new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(file); });
    const newBase64 = await Promise.all(editNewFiles.map(toBase64));
    const mergedImages = [...editImages, ...newBase64];
    const kitchenNew = await Promise.all(editCatNewFiles.kitchen.map(toBase64));
    const washroomNew = await Promise.all(editCatNewFiles.washroom.map(toBase64));
    const commonAreaNew = await Promise.all(editCatNewFiles.commonArea.map(toBase64));
    const roomNewBase64 = await Promise.all(editRoomNewFiles.map(toBase64));
    const mergedRoomImages = [...editRoomImages, ...roomNewBase64.map((img, i) => ({ id: `new-${Date.now()}-${i}`, name: `Room ${editRoomImages.length + i + 1}`, image: img }))];
    const verifNewBase64 = await Promise.all(editVerifNewFiles.map(toBase64));
    const mergedVerifImages = [...editVerifImages, ...verifNewBase64];
    const isPG = editForm.propertyType === "PG";
    const updates: Record<string, any> = {
      title: editForm.title.trim() || editingListing.title, price: Number(editForm.price) || editingListing.price,
      deposit: Number(editForm.deposit) || 0, location: editForm.location.trim() || editingListing.location,
      fullAddress: editForm.fullAddress.trim() || editingListing.fullAddress, areaName: editForm.areaName.trim(),
      state: editForm.state.trim(), pincode: editForm.pincode.trim(), landmark: editForm.landmark.trim(),
      rooms: Number(editForm.rooms) || editingListing.rooms, bathrooms: Number(editForm.bathrooms) || 0,
      area: Number(editForm.area) || 0, availableFrom: editForm.availableFrom.trim(),
      pgDescription: editForm.pgDescription.trim(), images: mergedImages,
      ...(mergedVerifImages.length > 0 ? { verificationImages: mergedVerifImages } : {}),
      ...(isPG ? {
        kitchenImages: [...editCatImages.kitchen, ...kitchenNew], washroomImages: [...editCatImages.washroom, ...washroomNew],
        commonAreaImages: [...editCatImages.commonArea, ...commonAreaNew], roomImages: mergedRoomImages,
      } : {
        tenantKitchenImages: [...editCatImages.kitchen, ...kitchenNew], tenantWashroomImages: [...editCatImages.washroom, ...washroomNew],
        tenantCommonAreaImages: [...editCatImages.commonArea, ...commonAreaNew], tenantRoomImages: mergedRoomImages,
      }),
    };
    if (isPG) {
      if (editForm.pgFor) { updates.pgFor = editForm.pgFor; updates.preferredGender = editForm.pgFor; }
      if (editForm.tenantPreference) updates.tenantPreference = editForm.tenantPreference;
      if (editForm.noticePeriod) updates.noticePeriod = editForm.noticePeriod;
      if (editForm.gateClosingTime) updates.gateClosingTime = editForm.gateClosingTime;
      updates.pgRules = editForm.pgRules || []; updates.services = editForm.services || [];
      updates.foodProvided = editForm.foodProvided || false; updates.meals = editForm.meals || [];
      updates.vegNonVeg = editForm.vegNonVeg || ""; updates.foodCharges = editForm.foodCharges || "";
      updates.commonAmenities = editForm.commonAmenities || []; updates.parkingAvailable = editForm.parkingAvailable || false;
      updates.parkingType = editForm.parkingType || "";
      if (editForm.operationalSince) updates.operationalSince = editForm.operationalSince;
      if (editForm.pgPresentIn) updates.pgPresentIn = editForm.pgPresentIn;
      if (editForm.pgName) updates.pgName = editForm.pgName;
    } else {
      if (editForm.societyName) updates.societyName = editForm.societyName.trim();
      if (editForm.bhk) updates.bhk = editForm.bhk;
      if (Array.isArray(editForm.tenantRooms) && editForm.tenantRooms.length > 0) updates.tenantRooms = editForm.tenantRooms;
      updates.furnishing = Array.isArray(editForm.furnishing) ? editForm.furnishing : [];
      if (editForm.floorNumber) updates.floorNumber = editForm.floorNumber;
      if (editForm.totalFloors) updates.totalFloors = editForm.totalFloors;
      if (editForm.balcony) updates.balcony = editForm.balcony;
      if (editForm.facing) updates.facing = editForm.facing;
      if (editForm.maintenanceCharges) updates.maintenanceCharges = editForm.maintenanceCharges;
      if (editForm.maintenanceType) updates.maintenanceType = editForm.maintenanceType;
      if (editForm.monthlyRentAmount) updates.monthlyRentAmount = editForm.monthlyRentAmount;
      if (editForm.securityAmount) updates.securityAmount = editForm.securityAmount;
      updates.additionalRooms = editForm.additionalRooms || []; updates.overlooking = editForm.overlooking || [];
      updates.societyAmenities = editForm.societyAmenities || []; updates.tenantsPrefer = editForm.tenantsPrefer || [];
      if (editForm.localityDescription) updates.localityDescription = editForm.localityDescription;
    }
    if (editForm.latitude) updates.latitude = editForm.latitude.trim();
    if (editForm.longitude) updates.longitude = editForm.longitude.trim();
    if (isPG && editForm.roomDetails && Object.keys(editForm.roomDetails).length > 0) updates.roomDetails = editForm.roomDetails;
    if (editForm.nearbyPlaces?.length > 0) updates.nearbyPlaces = editForm.nearbyPlaces;
    if (editForm.uspCategory) updates.uspCategory = editForm.uspCategory;
    if (editForm.uspText) updates.uspText = editForm.uspText;
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) { setMyListings(prev => prev.map(l => l._id === id ? data.property : l)); closeEdit(); }
      else setEditError(data.error || "Failed to update. Please try again.");
    } catch { setEditError("Something went wrong. Please try again."); }
    finally { setEditSaving(false); }
  };

  const deleteListing = async (id: string) => {
    const token = getToken();
    try {
      await fetch(`/api/properties/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });
      setMyListings(prev => prev.filter(l => l._id !== id));
      if (editingListing?._id === id) closeEdit();
      if (selectedListing?._id === id) setSelectedListing(null);
    } catch {}
  };

  // ── Content / helpers ───────────────────────────────────────────────────────
  const content: Record<string, TcContent> = {
    en: {
      dashboard: "Owner Dashboard", myListings: "My Listings", bookingRequests: "Inquiries",
      profile: "Profile", logout: "Logout", addNewListing: "Add New Listing",
      viewDetails: "View Details", edit: "Edit", delete: "Delete",
      updateAvailability: "Update Availability", noListings: "No listings yet",
      tenantName: "Tenant Name", propertyName: "Property Name", roomType: "Room Type",
      moveInDate: "Move-in Date", status: "Status", noRequests: "No inquiries yet",
      statusNew: "New", statusContacted: "Contacted", statusInterested: "Interested",
      statusBooked: "Booked", statusClosed: "Closed", profileSettings: "Profile Settings",
      fullName: "Full Name", email: "Email", phone: "Phone Number", saveChanges: "Save Changes",
      verificationStatus: "Verification Status", views: "Views", inquiries: "Inquiries",
      rooms: "Rooms", occupied: "Occupied", location: "Location",
    },
    fr: {
      dashboard: "Tableau de bord propriétaire", myListings: "Mes annonces", bookingRequests: "Demandes",
      profile: "Profil", logout: "Déconnexion", addNewListing: "Ajouter une annonce",
      viewDetails: "Voir les détails", edit: "Modifier", delete: "Supprimer",
      updateAvailability: "Mettre à jour la disponibilité", noListings: "Aucune annonce",
      tenantName: "Nom du locataire", propertyName: "Nom de la propriété", roomType: "Type de chambre",
      moveInDate: "Date d'emménagement", status: "Statut", noRequests: "Aucune demande",
      statusNew: "Nouveau", statusContacted: "Contacté", statusInterested: "Intéressé",
      statusBooked: "Réservé", statusClosed: "Fermé", profileSettings: "Paramètres du profil",
      fullName: "Nom complet", email: "Email", phone: "Numéro de téléphone", saveChanges: "Enregistrer",
      verificationStatus: "Statut de vérification", views: "Vues", inquiries: "Demandes",
      rooms: "Chambres", occupied: "Occupé", location: "Emplacement",
    },
  };
  const tc = content[language] || content.en;

  const getStatusColor = (status: string) => {
    if (isDark) {
      switch (status) {
        case "new": return "bg-blue-500/20 text-blue-400";
        case "contacted": return "bg-amber-500/20 text-amber-400";
        case "interested": return "bg-violet-500/20 text-violet-400";
        case "booked": return "bg-emerald-500/20 text-emerald-400";
        default: return "bg-gray-700 text-gray-400";
      }
    } else {
      switch (status) {
        case "new": return "bg-blue-100 text-blue-700";
        case "contacted": return "bg-amber-100 text-amber-700";
        case "interested": return "bg-violet-100 text-violet-700";
        case "booked": return "bg-emerald-100 text-emerald-700";
        default: return "bg-gray-100 text-gray-500";
      }
    }
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      new: tc.statusNew, contacted: tc.statusContacted,
      interested: tc.statusInterested, booked: tc.statusBooked, closed: tc.statusClosed,
    };
    return map[status] || status;
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className={`h-screen overflow-hidden flex flex-col ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 shadow-sm border-b flex-shrink-0 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
        <div className="max-w-[1500px] mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <h1 className={`text-base sm:text-xl font-bold truncate ${isDark ? "text-primary-light" : "text-primary"}`}>{tc.dashboard}</h1>
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${isDark ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link href="/"
                className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors font-medium text-xs sm:text-sm">
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{language === "fr" ? "Accueil" : "Back to Home"}</span>
                <span className="sm:hidden">{language === "fr" ? "Accueil" : "Home"}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <OwnerSidebar
          activeTab={activeTab} setActiveTab={setActiveTab}
          isDark={isDark} language={language} user={user}
          contactRequests={contactRequests} seenInquiryIds={seenInquiryIds} setSeenInquiryIds={setSeenInquiryIds}
          chatUnread={chatUnread} profileMenuOpen={profileMenuOpen} setProfileMenuOpen={setProfileMenuOpen}
          logout={logout} tc={tc}
        />

        {/* Main Content */}
        <div className={`flex-1 min-w-0 pb-16 lg:pb-0 ${activeTab === "messages" ? "overflow-hidden" : "overflow-y-auto"}`}>
          <div className={activeTab === "messages" ? "p-3 sm:p-5 lg:p-6 h-full flex flex-col" : "p-3 sm:p-5 lg:p-8"}>

            {activeTab === "listings" && (
              <OwnerListingsTab
                isDark={isDark} language={language} tc={tc}
                myListings={myListings} listingsLoading={listingsLoading}
                viewMode={viewMode} setViewMode={setViewMode}
                editingListing={editingListing} selectedListing={selectedListing} setSelectedListing={setSelectedListing}
                editForm={editForm} setEditForm={setEditForm}
                editImages={editImages} setEditImages={setEditImages}
                editNewFiles={editNewFiles} setEditNewFiles={setEditNewFiles}
                editCatImages={editCatImages} setEditCatImages={setEditCatImages}
                editCatNewFiles={editCatNewFiles} setEditCatNewFiles={setEditCatNewFiles}
                editRoomImages={editRoomImages} setEditRoomImages={setEditRoomImages}
                editRoomNewFiles={editRoomNewFiles} setEditRoomNewFiles={setEditRoomNewFiles}
                editVerifImages={editVerifImages} setEditVerifImages={setEditVerifImages}
                editVerifNewFiles={editVerifNewFiles} setEditVerifNewFiles={setEditVerifNewFiles}
                editSaving={editSaving} editError={editError}
                openEdit={openEdit} closeEdit={closeEdit} saveEdit={saveEdit}
                setDeleteConfirmId={setDeleteConfirmId} user={user} router={router}
              />
            )}

            {activeTab === "requests" && (
              <OwnerContactsTab
                isDark={isDark} language={language} tc={tc}
                contactRequests={contactRequests} requestsLoading={requestsLoading}
                statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                inquiryPage={inquiryPage} setInquiryPage={setInquiryPage}
                INQUIRIES_PER_PAGE={INQUIRIES_PER_PAGE}
                updateInquiryStatus={updateInquiryStatus}
                setSelectedInquiry={setSelectedInquiry}
                activeChatRequestId={activeChatRequestId} setActiveChatRequestId={setActiveChatRequestId}
                socketMarkSeen={socketMarkSeen} resetUnread={resetUnread}
                user={user} ownerToken={ownerToken} unreadByRequest={unreadByRequest}
              />
            )}

            {activeTab === "messages" && (
              <OwnerMessagesTab
                isDark={isDark} language={language}
                contactRequests={contactRequests} requestsLoading={requestsLoading}
                activeChatRequestId={activeChatRequestId} setActiveChatRequestId={setActiveChatRequestId}
                socketMarkSeen={socketMarkSeen} resetUnread={resetUnread}
                user={user} ownerToken={ownerToken} unreadByRequest={unreadByRequest}
              />
            )}

            {activeTab === "profile" && (
              <OwnerProfileTab user={user} tc={tc} language={language} isDark={isDark} />
            )}

          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <OwnerMobileNav
        activeTab={activeTab} setActiveTab={setActiveTab}
        isDark={isDark} language={language}
        contactRequests={contactRequests} seenInquiryIds={seenInquiryIds} setSeenInquiryIds={setSeenInquiryIds}
        chatUnread={chatUnread} logout={logout}
      />

      {/* Modals */}
      <OwnerModals
        isDark={isDark} language={language} tc={tc}
        selectedInquiry={selectedInquiry} setSelectedInquiry={setSelectedInquiry}
        deleteConfirmId={deleteConfirmId} setDeleteConfirmId={setDeleteConfirmId}
        deleteListing={deleteListing}
        getStatusColor={getStatusColor} getStatusLabel={getStatusLabel}
      />
    </div>
  );
}
