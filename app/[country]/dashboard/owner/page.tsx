"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "@/components/LocalizedLink";
import Image from "next/image";
import {
  Home,
  MessageSquare,
  Calendar,
  User,
  LogOut,
  Edit,
  Trash2,
  MapPin,
  Send,
  Plus,
  Grid3x3,
  List,
  Eye,
  ArrowLeft,
} from "lucide-react";

function ProfileSection({ user, tc, language }: { user: any; tc: any; language: string }) {
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const token = localStorage.getItem("staybuddy_token");
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ fullName: form.fullName, phoneNumber: form.phoneNumber }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMsg({ type: "success", text: language === "fr" ? "Profil mis à jour." : "Profile updated." });
      } else {
        setSaveMsg({ type: "error", text: data.message || "Failed to update." });
      }
    } catch {
      setSaveMsg({ type: "error", text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: "error", text: language === "fr" ? "Les mots de passe ne correspondent pas." : "Passwords do not match." });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    try {
      const token = localStorage.getItem("staybuddy_token");
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      const data = await res.json();
      if (data.success) {
        setPwMsg({ type: "success", text: language === "fr" ? "Mot de passe mis à jour." : "Password updated." });
        setPwForm({ current: "", next: "", confirm: "" });
      } else {
        setPwMsg({ type: "error", text: data.message || "Failed to update password." });
      }
    } catch {
      setPwMsg({ type: "error", text: "Something went wrong." });
    } finally {
      setPwSaving(false);
    }
  };

  const countryLabel = user?.country === "fr" ? "France" : user?.country === "in" ? "India" : user?.country || "—";
  const roleLabel = user?.role === "landlord" ? (language === "fr" ? "Propriétaire" : "Owner") : user?.role || "—";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{tc.profileSettings}</h2>

      {/* Avatar + summary card */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {user?.profileImage ? (
            <Image src={user.profileImage} alt={user.fullName} width={80} height={80} className="object-cover w-full h-full" />
          ) : (
            <User className="w-10 h-10 text-primary" />
          )}
        </div>
        <div className="text-center sm:text-left">
          <p className="text-xl font-bold text-gray-900">{user?.fullName || "—"}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">{roleLabel}</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">{countryLabel}</span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${user?.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {user?.isVerified ? (language === "fr" ? "Vérifié" : "Verified") : (language === "fr" ? "Non vérifié" : "Unverified")}
            </span>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{language === "fr" ? "Informations personnelles" : "Personal Information"}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{tc.fullName}</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{tc.email}</label>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">{language === "fr" ? "L'email ne peut pas être modifié." : "Email cannot be changed."}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{tc.phone}</label>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={language === "fr" ? "Numéro de téléphone" : "Phone number"}
            />
          </div>
          {saveMsg && (
            <p className={`text-sm font-medium ${saveMsg.type === "success" ? "text-green-600" : "text-red-600"}`}>{saveMsg.text}</p>
          )}
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-60"
          >
            {saving ? "..." : tc.saveChanges}
          </button>
        </div>
      </div>

      {/* Change password — only for credentials users */}
      {user?.provider === "credentials" && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{language === "fr" ? "Changer le mot de passe" : "Change Password"}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{language === "fr" ? "Mot de passe actuel" : "Current Password"}</label>
              <input
                type="password"
                value={pwForm.current}
                onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={language === "fr" ? "Mot de passe actuel" : "Current password"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{language === "fr" ? "Nouveau mot de passe" : "New Password"}</label>
              <input
                type="password"
                value={pwForm.next}
                onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={language === "fr" ? "Nouveau mot de passe" : "New password"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{language === "fr" ? "Confirmer le mot de passe" : "Confirm New Password"}</label>
              <input
                type="password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={language === "fr" ? "Confirmer" : "Confirm password"}
              />
            </div>
            {pwMsg && (
              <p className={`text-sm font-medium ${pwMsg.type === "success" ? "text-green-600" : "text-red-600"}`}>{pwMsg.text}</p>
            )}
            <button
              onClick={handleChangePassword}
              disabled={pwSaving}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-60"
            >
              {pwSaving ? "..." : (language === "fr" ? "Mettre à jour le mot de passe" : "Update Password")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OwnerDashboard() {
  const { language, t } = useLanguage();
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("listings");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const currencySymbol = t("currency.symbol");

  const [myListings, setMyListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingListing, setEditingListing] = useState<any | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [editImages, setEditImages] = useState<string[]>([]); // current image URLs
  const [editNewFiles, setEditNewFiles] = useState<File[]>([]); // newly picked files

  // Extra photo category state for edit form
  type PhotoCat = 'kitchen' | 'washroom' | 'commonArea';
  const [editCatImages, setEditCatImages] = useState<Record<PhotoCat, string[]>>({ kitchen: [], washroom: [], commonArea: [] });
  const [editCatNewFiles, setEditCatNewFiles] = useState<Record<PhotoCat, File[]>>({ kitchen: [], washroom: [], commonArea: [] });
  // Room images (PG: {id,name,status,image} / Tenant: {id,name,image})
  const [editRoomImages, setEditRoomImages] = useState<any[]>([]);
  const [editRoomNewFiles, setEditRoomNewFiles] = useState<File[]>([]);

  // Authentication check
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      if (user?.role !== 'landlord') {
        if (user?.role === 'renter') {
          router.push('/dashboard/tenant');
        } else if (user?.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push('/');
        }
        return;
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  // Fetch this landlord's own properties
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'landlord') return;
    const token = localStorage.getItem('staybuddy_token');
    setListingsLoading(true);
    fetch('/api/properties?mine=true&limit=50', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setMyListings(data.properties || []);
      })
      .catch(() => {})
      .finally(() => setListingsLoading(false));
  }, [isAuthenticated, user]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or wrong role
  if (!isAuthenticated || user?.role !== 'landlord') {
    return null;
  }

  const bookingRequests = [
    {
      id: 1,
      tenantName: "Rahul Sharma",
      propertyName: "Sunshine PG",
      roomType: "Single",
      moveInDate: "2024-04-01",
      status: "Pending",
      message: "Hi, I'm interested in a single room. Is it available?",
      date: "2024-03-08",
    },
    {
      id: 2,
      tenantName: "Priya Patel",
      propertyName: "Green Valley Apartment",
      roomType: "2BHK",
      moveInDate: "2024-03-20",
      status: "Approved",
      message: "Looking for a 2BHK apartment for 1 year.",
      date: "2024-03-07",
    },
  ];

  const messages = [
    {
      id: 1,
      tenantName: "Rahul Sharma",
      propertyName: "Sunshine PG",
      lastMessage: "Is the room still available?",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      tenantName: "Priya Patel",
      propertyName: "Green Valley Apartment",
      lastMessage: "Thank you! I'll visit tomorrow.",
      time: "1 day ago",
      unread: false,
    },
  ];

  const content = {
    en: {
      dashboard: "Owner Dashboard",
      myListings: "My Listings",
      messages: "Messages",
      bookingRequests: "Booking Requests",
      profile: "Profile",
      logout: "Logout",
      addNewListing: "Add New Listing",
      viewDetails: "View Details",
      edit: "Edit",
      delete: "Delete",
      updateAvailability: "Update Availability",
      noListings: "No listings yet",
      tenantName: "Tenant Name",
      propertyName: "Property Name",
      roomType: "Room Type",
      moveInDate: "Move-in Date",
      status: "Status",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      pendingApproval: "Pending Approval",
      respond: "Respond",
      approve: "Approve",
      reject: "Reject",
      noRequests: "No booking requests",
      lastMessage: "Last Message",
      reply: "Reply",
      noMessages: "No messages",
      profileSettings: "Profile Settings",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone Number",
      saveChanges: "Save Changes",
      verificationStatus: "Verification Status",
      views: "Views",
      inquiries: "Inquiries",
      rooms: "Rooms",
      occupied: "Occupied",
      location: "Location",
    },
    fr: {
      dashboard: "Tableau de bord propriétaire",
      myListings: "Mes annonces",
      messages: "Messages",
      bookingRequests: "Demandes de réservation",
      profile: "Profil",
      logout: "Déconnexion",
      addNewListing: "Ajouter une annonce",
      viewDetails: "Voir les détails",
      edit: "Modifier",
      delete: "Supprimer",
      updateAvailability: "Mettre à jour la disponibilité",
      noListings: "Aucune annonce",
      tenantName: "Nom du locataire",
      propertyName: "Nom de la propriété",
      roomType: "Type de chambre",
      moveInDate: "Date d'emménagement",
      status: "Statut",
      pending: "En attente",
      approved: "Approuvé",
      rejected: "Rejeté",
      pendingApproval: "En attente d'approbation",
      respond: "Répondre",
      approve: "Approuver",
      reject: "Rejeter",
      noRequests: "Aucune demande",
      lastMessage: "Dernier message",
      reply: "Répondre",
      noMessages: "Aucun message",
      profileSettings: "Paramètres du profil",
      fullName: "Nom complet",
      email: "Email",
      phone: "Numéro de téléphone",
      saveChanges: "Enregistrer",
      verificationStatus: "Statut de vérification",
      views: "Vues",
      inquiries: "Demandes",
      rooms: "Chambres",
      occupied: "Occupé",
      location: "Emplacement",
    }
  };

  const tc = content[language];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
      case "pending approval":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const openEdit = (listing: any) => {
    setSelectedListing(null);
    setEditError("");
    setEditForm({
      title: listing.title || "",
      propertyType: listing.propertyType || "PG",
      price: String(listing.price || ""),
      deposit: String(listing.deposit || ""),
      location: listing.location || "",
      fullAddress: listing.fullAddress || "",
      areaName: listing.areaName || "",
      state: listing.state || "",
      pincode: listing.pincode || "",
      landmark: listing.landmark || "",
      rooms: String(listing.rooms || ""),
      bathrooms: String(listing.bathrooms || ""),
      area: String(listing.area || ""),
      availableFrom: listing.availableFrom || "",
      pgDescription: listing.pgDescription || listing.localityDescription || "",
      // PG-specific
      pgFor: listing.pgFor || listing.preferredGender || "",
      tenantPreference: listing.tenantPreference || "",
      noticePeriod: listing.noticePeriod || "",
      gateClosingTime: listing.gateClosingTime || "",
      // Tenant-specific
      societyName: listing.societyName || "",
      furnishing: Array.isArray(listing.furnishing) ? listing.furnishing.join(", ") : (listing.furnishing || ""),
      floorNumber: listing.floorNumber || "",
      totalFloors: listing.totalFloors || "",
      facing: listing.facing || "",
      maintenanceCharges: listing.maintenanceCharges || "",
    });
    setEditImages(listing.images || []);
    setEditNewFiles([]);
    setEditCatImages({
      kitchen: listing.propertyType === 'PG' ? (listing.kitchenImages || []) : (listing.tenantKitchenImages || []),
      washroom: listing.propertyType === 'PG' ? (listing.washroomImages || []) : (listing.tenantWashroomImages || []),
      commonArea: listing.propertyType === 'PG' ? (listing.commonAreaImages || []) : (listing.tenantCommonAreaImages || []),
    });
    setEditCatNewFiles({ kitchen: [], washroom: [], commonArea: [] });
    setEditRoomImages(listing.propertyType === 'PG' ? (listing.roomImages || []) : (listing.tenantRoomImages || []));
    setEditRoomNewFiles([]);
    setEditingListing(listing);
  };

  const closeEdit = () => {
    setEditingListing(null);
    setEditError("");
    setEditImages([]);
    setEditNewFiles([]);
    setEditCatImages({ kitchen: [], washroom: [], commonArea: [] });
    setEditCatNewFiles({ kitchen: [], washroom: [], commonArea: [] });
    setEditRoomImages([]);
    setEditRoomNewFiles([]);
  };

  const saveEdit = async () => {
    if (!editingListing) return;
    setEditSaving(true);
    setEditError("");
    const token = localStorage.getItem('staybuddy_token');
    const id = editingListing._id;

    // Convert any new files to base64 and merge with kept existing URLs
    const toBase64 = (file: File): Promise<string> =>
      new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
    const newBase64 = await Promise.all(editNewFiles.map(toBase64));
    const mergedImages = [...editImages, ...newBase64];

    // Category images
    const kitchenNew = await Promise.all(editCatNewFiles.kitchen.map(toBase64));
    const washroomNew = await Promise.all(editCatNewFiles.washroom.map(toBase64));
    const commonAreaNew = await Promise.all(editCatNewFiles.commonArea.map(toBase64));

    // Room images — append new files as new room objects
    const roomNewBase64 = await Promise.all(editRoomNewFiles.map(toBase64));
    const mergedRoomImages = [
      ...editRoomImages,
      ...roomNewBase64.map((img, i) => ({ id: `new-${Date.now()}-${i}`, name: `Room ${editRoomImages.length + i + 1}`, image: img })),
    ];

    const isPG = editForm.propertyType === 'PG';

    const updates: Record<string, any> = {
      title: editForm.title.trim() || editingListing.title,
      price: Number(editForm.price) || editingListing.price,
      deposit: Number(editForm.deposit) || 0,
      location: editForm.location.trim() || editingListing.location,
      fullAddress: editForm.fullAddress.trim() || editingListing.fullAddress,
      areaName: editForm.areaName.trim(),
      state: editForm.state.trim(),
      pincode: editForm.pincode.trim(),
      landmark: editForm.landmark.trim(),
      rooms: Number(editForm.rooms) || editingListing.rooms,
      bathrooms: Number(editForm.bathrooms) || 0,
      area: Number(editForm.area) || 0,
      availableFrom: editForm.availableFrom.trim(),
      pgDescription: editForm.pgDescription.trim(),
      images: mergedImages,
      ...(isPG ? {
        kitchenImages: [...editCatImages.kitchen, ...kitchenNew],
        washroomImages: [...editCatImages.washroom, ...washroomNew],
        commonAreaImages: [...editCatImages.commonArea, ...commonAreaNew],
        roomImages: mergedRoomImages,
      } : {
        tenantKitchenImages: [...editCatImages.kitchen, ...kitchenNew],
        tenantWashroomImages: [...editCatImages.washroom, ...washroomNew],
        tenantCommonAreaImages: [...editCatImages.commonArea, ...commonAreaNew],
        tenantRoomImages: mergedRoomImages,
      }),
    };

    if (editForm.propertyType === "PG") {
      if (editForm.pgFor) { updates.pgFor = editForm.pgFor; updates.preferredGender = editForm.pgFor; }
      if (editForm.tenantPreference) updates.tenantPreference = editForm.tenantPreference;
      if (editForm.noticePeriod) updates.noticePeriod = editForm.noticePeriod;
      if (editForm.gateClosingTime) updates.gateClosingTime = editForm.gateClosingTime;
    } else {
      if (editForm.societyName) updates.societyName = editForm.societyName.trim();
      if (editForm.furnishing) updates.furnishing = editForm.furnishing.split(",").map((s: string) => s.trim()).filter(Boolean);
      if (editForm.floorNumber) updates.floorNumber = editForm.floorNumber;
      if (editForm.totalFloors) updates.totalFloors = editForm.totalFloors;
      if (editForm.facing) updates.facing = editForm.facing;
      if (editForm.maintenanceCharges) updates.maintenanceCharges = editForm.maintenanceCharges;
    }

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setMyListings(prev => prev.map(l => l._id === id ? data.property : l));
        closeEdit();
      } else {
        setEditError(data.error || "Failed to update. Please try again.");
      }
    } catch {
      setEditError("Something went wrong. Please try again.");
    } finally {
      setEditSaving(false);
    }
  };

  const deleteListing = async (id: string) => {
    const token = localStorage.getItem('staybuddy_token');
    try {
      await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setMyListings(prev => prev.filter(l => l._id !== id));
      if (editingListing?._id === id) closeEdit();
      if (selectedListing?._id === id) setSelectedListing(null);
    } catch {}
  };

  const bumpRooms = (id: string, delta: number) => {
    setMyListings(prev =>
      prev.map(l => {
        if (l._id !== id) return l;
        return { ...l, rooms: Math.max(0, (l.rooms || 0) + delta) };
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-primary">{tc.dashboard}</h1>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">{tc.logout}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-md p-4 sticky top-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("listings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "listings"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">{tc.myListings}</span>
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "messages"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">{tc.messages}</span>
                  {messages.filter(m => m.unread).length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {messages.filter(m => m.unread).length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("requests")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "requests"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">{tc.bookingRequests}</span>
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "profile"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{tc.profile}</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* My Listings */}
            {activeTab === "listings" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{tc.myListings}</h2>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                    {/* View Toggle */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "grid"
                            ? "bg-white text-primary shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        title="Grid View"
                      >
                        <Grid3x3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "list"
                            ? "bg-white text-primary shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        title="List View"
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>
                    <Link
                      href="/post-property"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      {tc.addNewListing}
                    </Link>
                  </div>
                </div>

                {listingsLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                        <div className="h-48 bg-gray-200" />
                        <div className="p-6 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                          <div className="h-5 bg-gray-200 rounded w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : myListings.length > 0 ? (
                  <>
                    {/* Inline edit panel */}
                    {editingListing ? (
                      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center gap-3 p-4 sm:p-6 border-b border-gray-200">
                          <button
                            onClick={closeEdit}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                          >
                            ← {language === "fr" ? "Retour aux annonces" : "Back to listings"}
                          </button>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${editingListing.propertyType === "PG" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                            {editingListing.propertyType}
                          </span>
                          <span className="ml-auto text-sm font-medium text-gray-500">
                            {language === "fr" ? "Modifier" : "Edit Listing"}
                          </span>
                        </div>

                        <div className="p-4 sm:p-6 space-y-5">
                          <div className="grid sm:grid-cols-2 gap-4">

                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                              <input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent ({currencySymbol})</label>
                              <input value={editForm.price} onChange={e => setEditForm(p => ({ ...p, price: e.target.value }))}
                                inputMode="numeric"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit ({currencySymbol})</label>
                              <input value={editForm.deposit} onChange={e => setEditForm(p => ({ ...p, deposit: e.target.value }))}
                                inputMode="numeric"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                              <input value={editForm.location} onChange={e => setEditForm(p => ({ ...p, location: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Area / Locality</label>
                              <input value={editForm.areaName} onChange={e => setEditForm(p => ({ ...p, areaName: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                              <input value={editForm.fullAddress} onChange={e => setEditForm(p => ({ ...p, fullAddress: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                              <input value={editForm.state} onChange={e => setEditForm(p => ({ ...p, state: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                              <input value={editForm.pincode} onChange={e => setEditForm(p => ({ ...p, pincode: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                              <input value={editForm.landmark} onChange={e => setEditForm(p => ({ ...p, landmark: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                              <input value={editForm.rooms} onChange={e => setEditForm(p => ({ ...p, rooms: e.target.value }))}
                                inputMode="numeric"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                              <input value={editForm.bathrooms} onChange={e => setEditForm(p => ({ ...p, bathrooms: e.target.value }))}
                                inputMode="numeric"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Area (m²)</label>
                              <input value={editForm.area} onChange={e => setEditForm(p => ({ ...p, area: e.target.value }))}
                                inputMode="numeric"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
                              <input value={editForm.availableFrom} onChange={e => setEditForm(p => ({ ...p, availableFrom: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>

                            {editForm.propertyType === "PG" && (<>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">PG For</label>
                                <select value={editForm.pgFor} onChange={e => setEditForm(p => ({ ...p, pgFor: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                  <option value="">Select</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Both">Both</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Preference</label>
                                <select value={editForm.tenantPreference} onChange={e => setEditForm(p => ({ ...p, tenantPreference: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                  <option value="">Select</option>
                                  <option value="Professionals">Professionals</option>
                                  <option value="Students">Students</option>
                                  <option value="Both">Both</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period</label>
                                <input value={editForm.noticePeriod} onChange={e => setEditForm(p => ({ ...p, noticePeriod: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gate Closing Time</label>
                                <input value={editForm.gateClosingTime} onChange={e => setEditForm(p => ({ ...p, gateClosingTime: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                              </div>
                            </>)}

                            {editForm.propertyType === "Tenant" && (<>
                              <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Society Name</label>
                                <input value={editForm.societyName} onChange={e => setEditForm(p => ({ ...p, societyName: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing</label>
                                <input value={editForm.furnishing} onChange={e => setEditForm(p => ({ ...p, furnishing: e.target.value }))}
                                  placeholder="e.g. Fully-Furnished, Semi-Furnished"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Facing</label>
                                <select value={editForm.facing} onChange={e => setEditForm(p => ({ ...p, facing: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                  <option value="">Select</option>
                                  {["East","West","North","South","North-East","North-West","South-East","South-West"].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Floor No.</label>
                                <input value={editForm.floorNumber} onChange={e => setEditForm(p => ({ ...p, floorNumber: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Floors</label>
                                <input value={editForm.totalFloors} onChange={e => setEditForm(p => ({ ...p, totalFloors: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Charges ({currencySymbol})</label>
                                <input value={editForm.maintenanceCharges} onChange={e => setEditForm(p => ({ ...p, maintenanceCharges: e.target.value }))}
                                  inputMode="numeric"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                              </div>
                            </>)}

                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <textarea value={editForm.pgDescription} onChange={e => setEditForm(p => ({ ...p, pgDescription: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                            </div>

                            {/* Room Photos */}
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {editForm.propertyType === 'PG' ? 'Room Photos' : 'Room Photos'}
                              </label>
                              {editRoomImages.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editRoomImages.map((room: any, i: number) => room.image && (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                      <Image src={room.image} alt={room.name || `room ${i+1}`} fill className="object-cover" />
                                      <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5 truncate">{room.name}</p>
                                      <button type="button"
                                        onClick={() => setEditRoomImages(prev => prev.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {editRoomNewFiles.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editRoomNewFiles.map((file, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary/40 group">
                                      <Image src={URL.createObjectURL(file)} alt={`new room ${i+1}`} fill className="object-cover" />
                                      <button type="button"
                                        onClick={() => setEditRoomNewFiles(prev => prev.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors text-sm text-gray-500">
                                <Plus className="w-4 h-4" /> Add room photos
                                <input type="file" accept="image/*" multiple className="hidden"
                                  onChange={e => { setEditRoomNewFiles(prev => [...prev, ...Array.from(e.target.files||[])]); e.target.value=""; }} />
                              </label>
                            </div>

                            {/* Kitchen Photos */}
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Kitchen Photos</label>
                              {editCatImages.kitchen.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editCatImages.kitchen.map((url, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                      <Image src={url} alt={`kitchen ${i+1}`} fill className="object-cover" />
                                      <button type="button"
                                        onClick={() => setEditCatImages(p => ({ ...p, kitchen: p.kitchen.filter((_,idx)=>idx!==i) }))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {editCatNewFiles.kitchen.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editCatNewFiles.kitchen.map((file, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary/40 group">
                                      <Image src={URL.createObjectURL(file)} alt={`new kitchen ${i+1}`} fill className="object-cover" />
                                      <button type="button"
                                        onClick={() => setEditCatNewFiles(p => ({ ...p, kitchen: p.kitchen.filter((_,idx)=>idx!==i) }))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors text-sm text-gray-500">
                                <Plus className="w-4 h-4" /> Add kitchen photos
                                <input type="file" accept="image/*" multiple className="hidden"
                                  onChange={e => { setEditCatNewFiles(p => ({ ...p, kitchen: [...p.kitchen, ...Array.from(e.target.files||[])] })); e.target.value=""; }} />
                              </label>
                            </div>

                            {/* Washroom Photos */}
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Washroom Photos</label>
                              {editCatImages.washroom.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editCatImages.washroom.map((url, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                      <Image src={url} alt={`washroom ${i+1}`} fill className="object-cover" />
                                      <button type="button"
                                        onClick={() => setEditCatImages(p => ({ ...p, washroom: p.washroom.filter((_,idx)=>idx!==i) }))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {editCatNewFiles.washroom.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editCatNewFiles.washroom.map((file, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary/40 group">
                                      <Image src={URL.createObjectURL(file)} alt={`new washroom ${i+1}`} fill className="object-cover" />
                                      <button type="button"
                                        onClick={() => setEditCatNewFiles(p => ({ ...p, washroom: p.washroom.filter((_,idx)=>idx!==i) }))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors text-sm text-gray-500">
                                <Plus className="w-4 h-4" /> Add washroom photos
                                <input type="file" accept="image/*" multiple className="hidden"
                                  onChange={e => { setEditCatNewFiles(p => ({ ...p, washroom: [...p.washroom, ...Array.from(e.target.files||[])] })); e.target.value=""; }} />
                              </label>
                            </div>

                            {/* Common Area Photos */}
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Common Area Photos</label>
                              {editCatImages.commonArea.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editCatImages.commonArea.map((url, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                      <Image src={url} alt={`common ${i+1}`} fill className="object-cover" />
                                      <button type="button"
                                        onClick={() => setEditCatImages(p => ({ ...p, commonArea: p.commonArea.filter((_,idx)=>idx!==i) }))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {editCatNewFiles.commonArea.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editCatNewFiles.commonArea.map((file, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary/40 group">
                                      <Image src={URL.createObjectURL(file)} alt={`new common ${i+1}`} fill className="object-cover" />
                                      <button type="button"
                                        onClick={() => setEditCatNewFiles(p => ({ ...p, commonArea: p.commonArea.filter((_,idx)=>idx!==i) }))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors text-sm text-gray-500">
                                <Plus className="w-4 h-4" /> Add common area photos
                                <input type="file" accept="image/*" multiple className="hidden"
                                  onChange={e => { setEditCatNewFiles(p => ({ ...p, commonArea: [...p.commonArea, ...Array.from(e.target.files||[])] })); e.target.value=""; }} />
                              </label>
                            </div>

                          </div>

                          {editError && <p className="text-sm text-red-600 mt-1">{editError}</p>}

                          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                            <button onClick={() => setDeleteConfirmId(editingListing._id)}
                              className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm">
                              <Trash2 className="w-4 h-4" /> {tc.delete}
                            </button>
                            <button onClick={closeEdit}
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm ml-auto">
                              Cancel
                            </button>
                            <button onClick={saveEdit} disabled={editSaving}
                              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium disabled:opacity-60">
                              {editSaving ? "Saving..." : "Update Listing"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : selectedListing ? (
                      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between gap-3 p-4 sm:p-6 border-b border-gray-200">
                          <button
                            onClick={() => setSelectedListing(null)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold border border-gray-600 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            {language === "fr" ? "Retour aux annonces" : "Back to listings"}
                          </button>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedListing.propertyType === "PG" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                            {selectedListing.propertyType}
                          </span>
                        </div>

                        {/* Image */}
                        {selectedListing.images?.[0] && (
                          <div className="relative h-56 sm:h-72">
                            <Image src={selectedListing.images[0]} alt={selectedListing.title} fill className="object-cover" />
                          </div>
                        )}

                        <div className="p-4 sm:p-6 space-y-6">
                          {/* Title & location */}
                          <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                              {selectedListing.propertyType === "Tenant" && selectedListing.societyName ? selectedListing.societyName : selectedListing.title}
                            </h2>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              {[selectedListing.fullAddress, selectedListing.areaName, selectedListing.state].filter(Boolean).join(", ")}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-2xl font-bold text-primary">{currencySymbol} {selectedListing.price?.toLocaleString()}</span>
                            <span className="text-gray-500 text-sm">/month</span>
                            {selectedListing.deposit > 0 && (
                              <span className="text-sm text-gray-500">· Deposit: {currencySymbol} {selectedListing.deposit?.toLocaleString()}</span>
                            )}
                          </div>

                          {/* Key details grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                              { label: "Category", value: selectedListing.category },
                              { label: "Rooms", value: selectedListing.rooms },
                              { label: "Bathrooms", value: selectedListing.bathrooms },
                              { label: "Area", value: selectedListing.area ? `${selectedListing.area} m²` : null },
                              { label: "Available From", value: selectedListing.availableFrom },
                              { label: "Rental Period", value: selectedListing.rentalPeriod },
                              ...(selectedListing.propertyType === "PG" ? [
                                { label: "PG For", value: selectedListing.pgFor || selectedListing.preferredGender },
                                { label: "Preferred Tenants", value: selectedListing.tenantPreference },
                                { label: "Gate Closing", value: selectedListing.gateClosingTime },
                                { label: "Notice Period", value: selectedListing.noticePeriod },
                              ] : [
                                { label: "Society", value: selectedListing.societyName },
                                { label: "Furnishing", value: Array.isArray(selectedListing.furnishing) ? selectedListing.furnishing.join(", ") : selectedListing.furnishing },
                                { label: "Floor", value: selectedListing.floorNumber },
                                { label: "Total Floors", value: selectedListing.totalFloors },
                                { label: "Facing", value: selectedListing.facing },
                                { label: "Balcony", value: selectedListing.balcony },
                                { label: "Maintenance", value: selectedListing.maintenanceCharges ? `${currencySymbol} ${selectedListing.maintenanceCharges}` : null },
                                { label: "Additional Rooms", value: Array.isArray(selectedListing.additionalRooms) && selectedListing.additionalRooms.length > 0 ? selectedListing.additionalRooms.join(", ") : null },
                                { label: "Overlooking", value: Array.isArray(selectedListing.overlooking) && selectedListing.overlooking.length > 0 ? selectedListing.overlooking.join(", ") : null },
                              ]),
                            ].filter(d => d.value != null && d.value !== "").map((detail, i) => (
                              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-0.5">{detail.label}</p>
                                <p className="text-sm font-semibold text-gray-900">{String(detail.value)}</p>
                              </div>
                            ))}
                          </div>

                          {/* Description */}
                          {(selectedListing.pgDescription || selectedListing.localityDescription) && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Description</p>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {selectedListing.pgDescription || selectedListing.localityDescription}
                              </p>
                            </div>
                          )}

                          {/* USP */}
                          {selectedListing.uspText && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                              {selectedListing.uspCategory && (
                                <span className="px-2 py-0.5 bg-primary text-white text-xs font-semibold rounded-full capitalize mr-2">
                                  {selectedListing.uspCategory}
                                </span>
                              )}
                              <p className="text-sm text-gray-700 mt-2">{selectedListing.uspText}</p>
                            </div>
                          )}

                          {/* Amenities */}
                          {(selectedListing.commonAmenities?.length > 0 || selectedListing.societyAmenities?.length > 0) && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Amenities</p>
                              <div className="flex flex-wrap gap-2">
                                {(selectedListing.propertyType === "PG" ? selectedListing.commonAmenities : selectedListing.societyAmenities)?.map((a: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{a}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* PG Rules */}
                          {selectedListing.propertyType === "PG" && selectedListing.pgRules?.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Rules</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedListing.pgRules.map((rule: string, i: number) => {
                                  const labels: Record<string, string> = { guardian: "No Guardian", nonveg: "No Non-Veg", gender: "No Opposite Gender", alcohol: "No Alcohol", smoking: "No Smoking" };
                                  return <span key={i} className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full">{labels[rule] || rule}</span>;
                                })}
                              </div>
                            </div>
                          )}

                          {/* Services */}
                          {Array.isArray(selectedListing.services) && selectedListing.services.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Services</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedListing.services.map((s: string, i: number) => {
                                  const labels: Record<string, string> = { laundry: "Laundry", cleaning: "Room Cleaning", warden: "Warden" };
                                  return <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full">{labels[s] || s}</span>;
                                })}
                              </div>
                            </div>
                          )}

                          {/* Tenants Preferred */}
                          {selectedListing.tenantsPrefer?.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tenants Preferred</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedListing.tenantsPrefer.map((p: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{p}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* PG Room Details */}
                          {selectedListing.propertyType === "PG" && selectedListing.roomDetails && Object.keys(selectedListing.roomDetails).length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                                {language === "fr" ? "Détails des chambres" : "Room Details"}
                              </p>
                              <div className="grid sm:grid-cols-2 gap-3">
                                {Object.entries(selectedListing.roomDetails as Record<string, any>).map(([category, detail]) => (
                                  <div key={category} className="border border-gray-200 rounded-xl p-4 hover:border-primary/40 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="font-bold text-gray-900 text-sm">{category} Room</h4>
                                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                        {detail.availableRooms ?? "—"} {language === "fr" ? "dispo" : "available"}
                                      </span>
                                    </div>
                                    <div className="space-y-1.5 mb-3">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Total Rooms</span>
                                        <span className="font-semibold text-gray-900">{detail.totalRooms ?? "—"}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Monthly Rent</span>
                                        <span className="font-bold text-primary">{currencySymbol} {Number(detail.monthlyRent).toLocaleString()}</span>
                                      </div>
                                      {detail.securityDeposit && Number(detail.securityDeposit) > 0 && (
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-500">Deposit</span>
                                          <span className="font-semibold text-gray-900">{currencySymbol} {Number(detail.securityDeposit).toLocaleString()}</span>
                                        </div>
                                      )}
                                    </div>
                                    {detail.facilities?.length > 0 && (
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

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                            <button
                              onClick={() => { openEdit(selectedListing); setSelectedListing(null); }}
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                              <Edit className="w-4 h-4" />
                              {tc.edit}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(selectedListing._id)}
                              className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                              {tc.delete}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                    <>
                    {/* Grid View */}
                    {viewMode === "grid" && (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myListings.map((listing) => (
                          <div key={listing._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                              <Image
                                src={listing.images?.[0] || "/owner.png"}
                                alt={listing.title}
                                fill
                                className="object-cover"
                              />
                              <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                                listing.propertyType === "PG" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                              }`}>
                                {listing.propertyType}
                              </span>
                            </div>
                            <div className="p-6">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {listing.propertyType === "Tenant" && listing.societyName ? listing.societyName : listing.title}
                              </h3>
                              <div className="flex items-center gap-2 text-gray-600 mb-3">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{listing.areaName}, {listing.location}, {listing.state}</span>
                              </div>
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl font-bold text-primary">
                                  {currencySymbol} {listing.price?.toLocaleString()}
                                </span>
                                <span className="text-gray-600 text-sm">/month</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                  <p className="text-gray-600">Total Rooms</p>
                                  <p className="font-bold text-gray-900">
                                    {listing.propertyType === "PG" && listing.roomDetails
                                      ? Object.values(listing.roomDetails as Record<string, any>).reduce((s: number, r: any) => s + (parseInt(r.totalRooms) || 0), 0)
                                      : listing.rooms}
                                  </p>
                                </div>
                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                  <p className="text-gray-600">Available</p>
                                  <p className="font-bold text-green-600">
                                    {listing.propertyType === "PG" && listing.roomDetails
                                      ? Object.values(listing.roomDetails as Record<string, any>).reduce((s: number, r: any) => s + (parseInt(r.availableRooms) || 0), 0)
                                      : listing.rooms}
                                  </p>
                                </div>
                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                  <p className="text-gray-600">Area</p>
                                  <p className="font-bold text-gray-900">{listing.area} m²</p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={() => setSelectedListing(listing)}
                                  className="flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
                                >
                                  <Eye className="w-4 h-4" />
                                  {tc.viewDetails}
                                </button>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openEdit(listing)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                  >
                                    <Edit className="w-4 h-4" />
                                    {tc.edit}
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(listing._id)}
                                    className="flex items-center justify-center gap-2 px-3 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm"
                                    aria-label={tc.delete}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* List View */}
                    {viewMode === "list" && (
                      <div className="space-y-4">
                        {myListings.map((listing) => (
                          <div key={listing._id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                              <div className="relative w-full h-48 md:w-48 md:h-32 flex-shrink-0">
                                <Image
                                  src={listing.images?.[0] || "/owner.png"}
                                  alt={listing.title}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                                <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${
                                  listing.propertyType === "PG" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                                }`}>
                                  {listing.propertyType}
                                </span>
                              </div>

                              <div className="flex-1">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-3">
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                      {listing.propertyType === "Tenant" && listing.societyName ? listing.societyName : listing.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                      <MapPin className="w-4 h-4" />
                                      <span className="text-sm">{listing.location}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{listing.fullAddress}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                  <span className="text-2xl font-bold text-primary">
                                    {currencySymbol} {listing.price?.toLocaleString()}
                                  </span>
                                  <span className="text-gray-600 text-sm">/month</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Rooms</p>
                                    <p className="font-bold text-gray-900">
                                      {listing.propertyType === "PG" && listing.roomDetails
                                        ? Object.values(listing.roomDetails as Record<string, any>).reduce((s: number, r: any) => s + (parseInt(r.totalRooms) || 0), 0)
                                        : listing.rooms}
                                    </p>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Available</p>
                                    <p className="font-bold text-green-600">
                                      {listing.propertyType === "PG" && listing.roomDetails
                                        ? Object.values(listing.roomDetails as Record<string, any>).reduce((s: number, r: any) => s + (parseInt(r.availableRooms) || 0), 0)
                                        : listing.rooms}
                                    </p>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Area</p>
                                    <p className="font-bold text-gray-900">{listing.area} m²</p>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Category</p>
                                    <p className="font-bold text-gray-900">{listing.category}</p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  <button
                                    onClick={() => setSelectedListing(listing)}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base"
                                  >
                                    <Eye className="w-4 h-4" />
                                    {tc.viewDetails}
                                  </button>
                                  <button
                                    onClick={() => openEdit(listing)}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                                  >
                                    <Edit className="w-4 h-4" />
                                    {tc.edit}
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(listing._id)}
                                    className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm sm:text-base"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    {tc.delete}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    </>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">{tc.noListings}</p>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            {activeTab === "messages" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{tc.messages}</h2>
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`bg-white rounded-2xl shadow-md p-6 ${message.unread ? 'border-l-4 border-primary' : ''}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-gray-900">{message.tenantName}</h3>
                              {message.unread && (
                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{message.propertyName}</p>
                          </div>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-gray-800 mb-4">{message.lastMessage}</p>
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                          <Send className="w-4 h-4" />
                          {tc.reply}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">{tc.noMessages}</p>
                  </div>
                )}
              </div>
            )}

            {/* Booking Requests */}
            {activeTab === "requests" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{tc.bookingRequests}</h2>
                {bookingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {bookingRequests.map((request) => (
                      <div key={request.id} className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{request.tenantName}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {tc.propertyName}: <span className="font-medium">{request.propertyName}</span>
                            </p>
                            <p className="text-sm text-gray-500">Date: {request.date}</p>
                          </div>
                          <span className={`self-start px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                            {request.status === "Pending" ? tc.pending : request.status === "Approved" ? tc.approved : tc.rejected}
                          </span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                          <div>
                            <p className="text-sm text-gray-600">{tc.roomType}</p>
                            <p className="font-semibold text-gray-900">{request.roomType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">{tc.moveInDate}</p>
                            <p className="font-semibold text-gray-900">{request.moveInDate}</p>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                          <p className="text-gray-800">{request.message}</p>
                        </div>
                        {request.status === "Pending" && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                              {tc.approve}
                            </button>
                            <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                              {tc.reject}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">{tc.noRequests}</p>
                  </div>
                )}
              </div>
            )}

            {/* Profile */}
            {activeTab === "profile" && (
              <ProfileSection user={user} tc={tc} language={language} />
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              {language === "fr" ? "Supprimer l'annonce ?" : "Delete this property?"}
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              {language === "fr"
                ? "Cette action est irréversible. L'annonce sera définitivement supprimée."
                : "This action cannot be undone. The listing will be permanently removed."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                {language === "fr" ? "Annuler" : "Cancel"}
              </button>
              <button
                onClick={() => { deleteListing(deleteConfirmId); setDeleteConfirmId(null); }}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium"
              >
                {language === "fr" ? "Supprimer" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
