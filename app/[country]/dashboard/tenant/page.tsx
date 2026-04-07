"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "@/lib/token-storage";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "@/components/LocalizedLink";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Heart,
  MessageSquare,
  User,
  LogOut,
  MapPin,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  Mail,
  Phone,
  Home,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

function RequestCard({
  req, status, sc, statusLabel, language, tc,
}: {
  req: any;
  status: string;
  sc: { bg: string; text: string; border: string; dot: string };
  statusLabel: string;
  language: string;
  tc: any;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border-l-4 border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden ${sc.border}`}>
      {/* Header row — always visible */}
      <button
        onClick={() => setExpanded(p => !p)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left group"
      >
        {/* Status dot */}
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${sc.dot}`} />

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold truncate text-gray-800">
              {req.propertyTitle}
            </p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${sc.bg} ${sc.text}`}>
              {statusLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-gray-400">
              {new Date(req.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            {req.roomType && <><span className="text-xs text-gray-300">·</span><span className="text-xs text-gray-500 capitalize">{req.roomType}</span></>}
            {req.moveInDate && <><span className="text-xs text-gray-300">·</span><span className="text-xs text-gray-500">{req.moveInDate}</span></>}
            {req.budgetRange && <><span className="text-xs text-gray-300">·</span><span className="text-xs text-gray-500">{req.budgetRange}</span></>}
          </div>
        </div>

        {/* Expand chevron */}
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50">
          {/* Detail chips */}
          <div className="flex flex-wrap gap-2 mt-3 mb-3">
            {[
              { label: language === 'fr' ? 'Type' : 'Room', value: req.roomType },
              { label: language === 'fr' ? 'Emménagement' : 'Move-in', value: req.moveInDate },
              { label: language === 'fr' ? 'Durée' : 'Duration', value: req.stayDuration ? `${req.stayDuration} mo` : null },
              { label: language === 'fr' ? 'Budget' : 'Budget', value: req.budgetRange },
              { label: language === 'fr' ? 'Occupation' : 'Occupation', value: req.occupation },
              { label: language === 'fr' ? 'Genre' : 'Gender', value: req.gender },
            ].filter(d => d.value).map((d, i) => (
              <div key={i} className="flex items-center gap-1 bg-gray-50 rounded-lg px-2.5 py-1.5">
                <span className="text-xs text-gray-400">{d.label}:</span>
                <span className="text-xs font-semibold text-gray-700 capitalize">{d.value}</span>
              </div>
            ))}
          </div>

          {/* Message */}
          {req.message && (
            <div className="bg-gray-50 rounded-xl px-3 py-2.5 mb-3">
              <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">{tc.messageSent}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{req.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TenantDashboard() {
  const { language, t } = useLanguage();
  const { user, isLoading, isAuthenticated, token, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'saved');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Profile form state (hoisted to avoid remount issues)
  const [profileForm, setProfileForm] = useState({ fullName: "", phoneNumber: "" });
  const [profileSavedName, setProfileSavedName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tenant_theme");
    setIsDark(saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("tenant_theme", next ? "dark" : "light");
  };
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [favLoading, setFavLoading] = useState(false);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const currencySymbol = t("currency.symbol");

  // Authentication check
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      if (user?.role !== 'renter') {
        // Redirect to appropriate dashboard based on role
        if (user?.role === 'landlord') {
          router.push('/dashboard/owner');
        } else if (user?.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push('/');
        }
        return;
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  // Seed profile form when user data is available
  useEffect(() => {
    if (user) {
      setProfileForm({ fullName: user.fullName || "", phoneNumber: user.phoneNumber || "" });
      setProfileSavedName(user.fullName || "");
    }
  }, [user?.fullName, user?.phoneNumber]);

  // Fetch favorites when on saved tab
  useEffect(() => {
    if (!isAuthenticated || !token || user?.role !== 'renter') return;
    const fetchFavorites = async () => {
      setFavLoading(true);
      try {
        const res = await fetch('/api/auth/favorites', {
          headers: token !== 'nextauth' ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (data.success) setSavedProperties(data.favorites);
      } catch {
        // silently fail
      } finally {
        setFavLoading(false);
      }
    };
    fetchFavorites();
  }, [isAuthenticated, token, user?.role]);

  // Fetch contact requests
  useEffect(() => {
    if (!isAuthenticated || !token || user?.role !== 'renter') return;
    const authToken = token !== 'nextauth' ? token : null;
    setRequestsLoading(true);
    fetch('/api/contact-requests', {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setMyRequests(data.requests || []);
        }
      })
      .catch(() => {})
      .finally(() => setRequestsLoading(false));
  }, [isAuthenticated, token, user?.role]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or wrong role
  if (!isAuthenticated || user?.role !== 'renter') {
    return null;
  }

  const { updateUser } = useAuth();

  const handleSaveProfile = async () => {
    if (!profileForm.fullName.trim()) {
      toast.error(language === "fr" ? "Le nom est requis." : "Full name is required.");
      return;
    }
    setProfileSaving(true);
    try {
      const authToken = token && token !== "nextauth" ? token : getToken();
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
        body: JSON.stringify({ fullName: profileForm.fullName.trim(), phoneNumber: profileForm.phoneNumber.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        updateUser({ fullName: data.user.fullName, phoneNumber: data.user.phoneNumber });
        setProfileSavedName(data.user.fullName);
        toast.success(language === "fr" ? "Profil mis à jour." : "Profile updated successfully.");
      } else {
        toast.error(data.message || "Failed to update.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.current) { toast.error(language === "fr" ? "Mot de passe actuel requis." : "Current password is required."); return; }
    if (pwForm.next.length < 6) { toast.error(language === "fr" ? "Min. 6 caractères." : "Password must be at least 6 characters."); return; }
    if (pwForm.next !== pwForm.confirm) { toast.error(language === "fr" ? "Les mots de passe ne correspondent pas." : "Passwords do not match."); return; }
    setPwSaving(true);
    try {
      const authToken = token && token !== "nextauth" ? token : getToken();
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(language === "fr" ? "Mot de passe mis à jour." : "Password updated successfully.");
        setPwForm({ current: "", next: "", confirm: "" });
      } else {
        toast.error(data.message || "Failed to update password.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setPwSaving(false);
    }
  };

  const handleRemoveFavorite = async (propertyId: string) => {
    if (!token) return;
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
        setSavedProperties(prev => prev.filter((p: any) => p._id !== propertyId));
      }
    } catch {
      // silently fail
    }
  };

  // Mock data - in real app, this would come from API

  const content = {
    en: {
      dashboard: "Tenant Dashboard",
      savedProperties: "Saved Properties",
      myRequests: "My Requests",
      profile: "Profile",
      logout: "Logout",
      viewDetails: "View Details",
      removeFromSaved: "Remove from Saved",
      noSavedProperties: "No saved properties yet",
      pgName: "PG Name",
      ownerName: "Owner Name",
      messageSent: "Message Sent",
      date: "Date",
      status: "Status",
      pending: "Pending",
      replied: "Replied",
      closed: "Closed",
      confirmed: "Confirmed",
      cancelled: "Cancelled",
      noRequests: "No requests yet",
      roomType: "Room Type",
      rent: "Rent",
      moveInDate: "Move-in Date",
      propertyName: "Property Name",
      lastMessage: "Last Message",
      reply: "Reply",
      noMessages: "No messages yet",
      profileSettings: "Profile Settings",
      editProfile: "Edit Profile",
      changePassword: "Change Password",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone Number",
      profilePhoto: "Profile Photo",
      uploadPhoto: "Upload Photo",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      update: "Update",
      address: "Address",
      amenities: "Amenities",
      location: "Location",
    },
    fr: {
      dashboard: "Tableau de bord locataire",
      savedProperties: "Propriétés sauvegardées",
      myRequests: "Mes demandes",
      profile: "Profil",
      logout: "Déconnexion",
      viewDetails: "Voir les détails",
      removeFromSaved: "Retirer des favoris",
      noSavedProperties: "Aucune propriété sauvegardée",
      pgName: "Nom du PG",
      ownerName: "Nom du propriétaire",
      messageSent: "Message envoyé",
      date: "Date",
      status: "Statut",
      pending: "En attente",
      replied: "Répondu",
      closed: "Fermé",
      confirmed: "Confirmé",
      cancelled: "Annulé",
      noRequests: "Aucune demande",
      roomType: "Type de chambre",
      rent: "Loyer",
      moveInDate: "Date d'emménagement",
      propertyName: "Nom de la propriété",
      lastMessage: "Dernier message",
      reply: "Répondre",
      noMessages: "Aucun message",
      profileSettings: "Paramètres du profil",
      editProfile: "Modifier le profil",
      changePassword: "Changer le mot de passe",
      fullName: "Nom complet",
      email: "Email",
      phone: "Numéro de téléphone",
      profilePhoto: "Photo de profil",
      uploadPhoto: "Télécharger une photo",
      currentPassword: "Mot de passe actuel",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      saveChanges: "Enregistrer les modifications",
      cancel: "Annuler",
      update: "Mettre à jour",
      address: "Adresse",
      amenities: "Équipements",
      location: "Emplacement",
    }
  };

  const tc = content[language];

  const getStatusColor = (status: string) => {
    if (isDark) {
      switch (status.toLowerCase()) {
        case "pending": return "bg-yellow-500/20 text-yellow-400";
        case "replied": case "confirmed": return "bg-green-500/20 text-green-400";
        case "closed": case "cancelled": return "bg-red-500/20 text-red-400";
        default: return "bg-gray-700 text-gray-300";
      }
    } else {
      switch (status.toLowerCase()) {
        case "pending": return "bg-yellow-100 text-yellow-700";
        case "replied": case "confirmed": return "bg-green-100 text-green-700";
        case "closed": case "cancelled": return "bg-red-100 text-red-700";
        default: return "bg-gray-100 text-gray-700";
      }
    }
  };

  const navItems = [
    { key: "saved",    icon: Heart,        label: tc.savedProperties },
    { key: "requests", icon: MessageSquare,label: tc.myRequests },
    { key: "profile",  icon: User,         label: tc.profile },
  ];

  return (
    <div className={`h-screen overflow-hidden flex flex-col ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 shadow-sm border-b ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
        <div className="max-w-[1500px] mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2">
              <h1 className={`text-base sm:text-xl font-bold truncate ${isDark ? "text-primary-light" : "text-primary"}`}>{tc.dashboard}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${isDark ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link
                href="/"
                className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors font-medium text-xs sm:text-sm"
              >
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
        <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
          <div className={`p-4 h-full overflow-y-auto flex flex-col border-r ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <nav className="space-y-1">
              {navItems.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(key);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === key ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm">{label}</span>
                </button>
              ))}
            </nav>

            {/* Profile card */}
            <div className={`mt-auto pt-4 border-t relative ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <button
                onClick={() => setProfileMenuOpen(p => !p)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group ${profileMenuOpen ? "bg-primary/10" : isDark ? "hover:bg-gray-800" : "hover:bg-primary/5"}`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white font-bold text-sm">{user?.fullName?.charAt(0)?.toUpperCase() || "U"}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{user?.fullName || "—"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 text-gray-400 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)} />
                  <div className={`absolute bottom-full left-0 right-0 mb-2 rounded-2xl shadow-xl border overflow-hidden z-20 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
                    <div className={`px-4 py-3 border-b ${isDark ? "bg-primary/10 border-primary/20" : "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/10"}`}>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wide">{language === "fr" ? "Connecté en tant que" : "Signed in as"}</p>
                      <p className={`text-sm font-bold truncate mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>{user?.fullName}</p>
                    </div>
                    <button
                      onClick={() => { setActiveTab("profile"); setProfileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-primary/5 hover:text-primary"}`}
                    >
                      <User className="w-4 h-4" />
                      <span className="font-medium">{language === "fr" ? "Voir le profil" : "View Profile"}</span>
                    </button>
                    <button
                      onClick={() => { setProfileMenuOpen(false); logout(); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-t ${isDark ? "text-red-400 hover:bg-red-500/10 border-gray-700" : "text-red-600 hover:bg-red-50 border-gray-100"}`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">{language === "fr" ? "Déconnexion" : "Logout"}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-y-auto pb-16 lg:pb-0">
          <div className="p-3 sm:p-5 lg:p-8">
            {/* Saved Properties */}
            {activeTab === "saved" && (
              <div className="space-y-4">
                <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>{tc.savedProperties}</h2>
                {favLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`rounded-2xl h-64 animate-pulse ${isDark ? "bg-gray-800" : "bg-white shadow-md"}`} />
                    ))}
                  </div>
                ) : savedProperties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {savedProperties.map((property: any) => (
                      <div key={property._id} className={`rounded-2xl overflow-hidden hover:shadow-lg transition-shadow border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-md"}`}>
                        <div className="relative h-40 sm:h-48">
                          <Image
                            src={property.images?.[0] || "/owner.png"}
                            alt={property.title || property.societyName}
                            fill
                            className="object-cover"
                          />
                          <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            property.propertyType === "PG" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                          }`}>
                            {property.propertyType}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className={`text-base font-bold mb-1.5 truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                            {property.societyName || property.title}
                          </h3>
                          <div className={`flex items-center gap-1.5 mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="text-xs truncate">{[property.areaName, property.location, property.state].filter(Boolean).join(", ")}</span>
                          </div>
                          <div className="flex items-baseline gap-1.5 mb-3">
                            <span className="text-xl font-bold text-primary">
                              {currencySymbol} {property.price?.toLocaleString()}
                            </span>
                            <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>/month</span>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href={`/property/${property._id}`}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              {tc.viewDetails}
                            </Link>
                            <button
                              onClick={() => handleRemoveFavorite(property._id)}
                              className={`flex items-center justify-center px-3 py-2 border rounded-lg transition-colors ${isDark ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-500 text-red-500 hover:bg-red-50"}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`rounded-2xl p-12 text-center border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-md"}`}>
                    <Heart className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
                    <p className={isDark ? "text-gray-500" : "text-gray-600"}>{tc.noSavedProperties}</p>
                  </div>
                )}
              </div>
            )}

            {/* My Requests */}
            {activeTab === "requests" && (() => {
              const statusColorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
                new:        { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-l-blue-500',   dot: 'bg-blue-500' },
                contacted:  { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-l-amber-500',  dot: 'bg-amber-500' },
                interested: { bg: 'bg-violet-50',  text: 'text-violet-700', border: 'border-l-violet-500', dot: 'bg-violet-500' },
                booked:     { bg: 'bg-emerald-50', text: 'text-emerald-700',border: 'border-l-emerald-500',dot: 'bg-emerald-500' },
                closed:     { bg: 'bg-gray-50',    text: 'text-gray-500',   border: 'border-l-gray-400',   dot: 'bg-gray-400' },
              };
              const statusLabelMap: Record<string, string> = {
                new:        language === 'fr' ? 'Nouveau'   : 'New',
                contacted:  language === 'fr' ? 'Contacté'  : 'Contacted',
                interested: language === 'fr' ? 'Intéressé' : 'Interested',
                booked:     language === 'fr' ? 'Réservé'   : 'Booked',
                closed:     language === 'fr' ? 'Fermé'     : 'Closed',
              };
              return (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.myRequests}</h2>
                  {myRequests.length > 0 && (
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${isDark ? "text-gray-400 bg-gray-800" : "text-gray-500 bg-gray-100"}`}>
                      {myRequests.length} {myRequests.length === 1 ? (language === 'fr' ? 'demande' : 'request') : (language === 'fr' ? 'demandes' : 'requests')}
                    </span>
                  )}
                </div>

                {requestsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`rounded-2xl h-20 animate-pulse border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`} />
                    ))}
                  </div>
                ) : myRequests.length > 0 ? (
                  <div className="space-y-2">
                    {myRequests.map((req: any) => {
                      const status = req.status || 'new';
                      const sc = statusColorMap[status] || statusColorMap.new;
                      return (
                        <RequestCard
                          key={req._id}
                          req={req}
                          status={status}
                          sc={sc}
                          statusLabel={statusLabelMap[status] || status}
                          language={language}
                          tc={tc}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className={`rounded-2xl p-16 text-center border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                      <MessageSquare className={`w-8 h-8 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
                    </div>
                    <p className={`font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>{tc.noRequests}</p>
                    <p className={`text-sm mt-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>{language === 'fr' ? 'Contactez un propriétaire pour commencer.' : 'Contact a property owner to get started.'}</p>
                  </div>
                )}
              </div>
              );
            })()}

            {/* Profile */}
            {activeTab === "profile" && (
              <div className="space-y-5 max-w-2xl">
                <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.profileSettings}</h2>

                {/* Avatar card */}
                <div className={`rounded-2xl p-4 flex items-center gap-4 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white font-bold text-xl">{profileSavedName?.charAt(0)?.toUpperCase() || "U"}</span>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-base font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{profileSavedName || "—"}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {language === "fr" ? "Locataire" : "Tenant"}
                    </span>
                  </div>
                </div>

                {/* Personal info */}
                <div className={`rounded-2xl p-5 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>
                  <h3 className={`text-base font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {language === "fr" ? "Informations personnelles" : "Personal Information"}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        {tc.fullName} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm(p => ({ ...p, fullName: e.target.value }))}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200 focus:border-primary"}`}
                          placeholder={language === "fr" ? "Votre nom complet" : "Your full name"}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.email}</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl cursor-not-allowed ${isDark ? "bg-gray-800/50 border-gray-700 text-gray-500" : "border-gray-200 bg-gray-50 text-gray-400"}`}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{language === "fr" ? "L'email ne peut pas être modifié." : "Email cannot be changed."}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.phone}</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={profileForm.phoneNumber}
                          onChange={(e) => setProfileForm(p => ({ ...p, phoneNumber: e.target.value }))}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200 focus:border-primary"}`}
                          placeholder="+91 99999 99999"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      disabled={profileSaving}
                      className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {profileSaving
                        ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{language === "fr" ? "Enregistrement..." : "Saving..."}</>
                        : tc.saveChanges}
                    </button>
                  </div>
                </div>

                {/* Change password */}
                {(user as any)?.provider === "credentials" && (
                  <div className={`rounded-2xl p-5 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>
                    <h3 className={`text-base font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>{tc.changePassword}</h3>
                    <div className="space-y-4">
                      {([
                        { key: "current", label: tc.currentPassword, show: showCurrent, toggle: () => setShowCurrent(p => !p) },
                        { key: "next",    label: tc.newPassword,     show: showNext,    toggle: () => setShowNext(p => !p) },
                        { key: "confirm", label: tc.confirmPassword, show: showConfirm, toggle: () => setShowConfirm(p => !p) },
                      ] as { key: keyof typeof pwForm; label: string; show: boolean; toggle: () => void }[]).map(({ key, label, show, toggle }) => (
                        <div key={key}>
                          <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{label}</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type={show ? "text" : "password"}
                              value={pwForm[key]}
                              onChange={(e) => setPwForm(p => ({ ...p, [key]: e.target.value }))}
                              className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200 focus:border-primary"}`}
                              placeholder="••••••••"
                            />
                            <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={handleChangePassword}
                        disabled={pwSaving}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {pwSaving
                          ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{language === "fr" ? "Mise à jour..." : "Updating..."}</>
                          : tc.update}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-stretch h-16">
          {navItems.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 relative transition-all duration-200 ${
                activeTab === key
                  ? isDark ? "text-primary" : "text-primary"
                  : isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {/* Active indicator */}
              {activeTab === key && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-primary rounded-full" />
              )}
              {/* Active background pill */}
              {activeTab === key && (
                <span className={`absolute inset-x-1 inset-y-1 rounded-xl ${isDark ? "bg-primary/10" : "bg-primary/8"}`} />
              )}
              <div className="relative z-10">
                <Icon className={`transition-all duration-200 ${activeTab === key ? "w-5 h-5" : "w-5 h-5"}`} />
              </div>
              <span className={`text-[9px] font-semibold z-10 transition-all duration-200 ${activeTab === key ? "opacity-100" : "opacity-60"}`}>
                {key === "saved" ? (language === "fr" ? "Favoris" : "Saved")
                  : key === "requests" ? (language === "fr" ? "Demandes" : "Requests")
                  : key === "profile" ? (language === "fr" ? "Profil" : "Profile")
                  : ""}
              </span>
            </button>
          ))}
          {/* Logout */}
          <button
            onClick={() => logout()}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${isDark ? "text-red-400 hover:text-red-300" : "text-red-400 hover:text-red-600"}`}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[9px] font-semibold opacity-60">{language === "fr" ? "Sortir" : "Logout"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
