"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "@/components/LocalizedLink";
import Image from "next/image";
import {
  Home,
  Users,
  Flag,
  LogOut,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Ban,
  Shield,
  MapPin,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  X,
  ShieldCheck,
  Phone,
  Mail,
  Calendar,
  Building2,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface PropertyOwner {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
}

interface AdminProperty {
  _id: string;
  title: string;
  propertyType: "PG" | "Tenant";
  country: string;
  location: string;
  areaName?: string;
  state?: string;
  price: number;
  rooms: number;
  images: string[];
  isVerified?: boolean;
  pgDescription?: string;
  fullAddress?: string;
  pincode?: string;
  landmark?: string;
  category?: string;
  posterType?: string;
  createdAt: string;
  createdBy: string | PropertyOwner;
}

interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: 'renter' | 'landlord' | 'admin';
  country: string;
  isVerified: boolean;
  isBlocked: boolean;
  provider: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { language, t } = useLanguage();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("listings");
  const [listingFilter, setListingFilter] = useState("all");
  const [listingCountry, setListingCountry] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [userCountry, setUserCountry] = useState("all");
  const [reportFilter, setReportFilter] = useState("pending");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const currencySymbol = t("currency.symbol");

  // Real property data
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<AdminProperty | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Pagination
  const PAGE_SIZE = 10;
  const USER_PAGE_SIZE = 12;
  const [listingPage, setListingPage] = useState(1);

  // Real user data
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userPage, setUserPage] = useState(1);

  // Real reports data
  const [allReports, setAllReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_theme");
    setIsDark(saved ? saved === "dark" : true);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("admin_theme", next ? "dark" : "light");
  };

  // Authentication check
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(`/in/control/login`);
        return;
      }
      if (user?.role !== 'admin') {
        router.push(`/`);
        return;
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  // Fetch all properties with owner info
  const fetchProperties = useCallback(async () => {
    const token = localStorage.getItem("staybuddy_token");
    if (!token) return;
    setPropertiesLoading(true);
    try {
      const res = await fetch("/api/properties?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProperties(data.properties);
      }
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchProperties();
    }
  }, [isAuthenticated, user, fetchProperties]);

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("staybuddy_token");
    if (!token) return;
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAllUsers(data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchUsers();
    }
  }, [isAuthenticated, user, fetchUsers]);

  const fetchReports = useCallback(async () => {
    const token = localStorage.getItem("staybuddy_token");
    if (!token) return;
    setReportsLoading(true);
    try {
      const res = await fetch("/api/admin/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAllReports(data.reports);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setReportsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchReports();
    }
  }, [isAuthenticated, user, fetchReports]);

  const handleUpdateReportStatus = async (reportId: string, status: string) => {
    const token = localStorage.getItem("staybuddy_token");
    if (!token) return;
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reportId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setAllReports(prev => prev.map(r => r._id === reportId ? { ...r, status } : r));
      }
    } catch (err) {
      console.error("Failed to update report:", err);
    }
  };

  const handleToggleBlock = async (userId: string, block: boolean) => {
    const token = localStorage.getItem("staybuddy_token");
    if (!token) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, isBlocked: block }),
      });
      const data = await res.json();
      if (data.success) {
        setAllUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: data.isBlocked } : u));
      }
    } catch (err) {
      console.error("Failed to toggle block:", err);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    const token = localStorage.getItem("staybuddy_token");
    if (!token) return;
    setDeletingId(propertyId);
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProperties(prev => prev.filter(p => p._id !== propertyId));
        if (selectedProperty?._id === propertyId) setSelectedProperty(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

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
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const reports = allReports;

  const stats = {
    totalListings: properties.length,
    verifiedListings: properties.filter(p => p.isVerified).length,
    totalUsers: allUsers.length,
    owners: allUsers.filter(u => u.role === "landlord").length,
    tenants: allUsers.filter(u => u.role === "renter").length,
    pendingReports: allReports.filter(r => r.status === "pending").length,
  };

  const content = {
    en: {
      dashboard: "Admin Dashboard",
      listingsManagement: "Listings Management",
      userManagement: "User Management",
      reportsModeration: "Reports",
      logout: "Logout",
      totalListings: "Total Listings",
      pendingListings: "Pending Listings",
      approvedListings: "Approved Listings",
      totalUsers: "Total Users",
      owners: "Owners",
      tenants: "Tenants",
      pendingReports: "Pending Reports",
      all: "All",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      approve: "Approve",
      reject: "Reject",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      ownerName: "Owner Name",
      submittedDate: "Submitted Date",
      status: "Status",
      noListings: "No listings found",
      name: "Name",
      email: "Email",
      role: "Role",
      verified: "Verified",
      active: "Active",
      banned: "Banned",
      ban: "Ban User",
      unban: "Unban User",
      verify: "Verify",
      noUsers: "No users found",
      reportedBy: "Reported By",
      reason: "Reason",
      date: "Date",
      reviewed: "Reviewed",
      markReviewed: "Mark as Reviewed",
      viewDetails: "View Details",
      noReports: "No reports found",
      listingName: "Listing Name",
      description: "Description",
      location: "Location",
      rent: "Rent",
      rooms: "Rooms",
      type: "Type",
    },
    fr: {
      dashboard: "Tableau de bord admin",
      listingsManagement: "Gestion des annonces",
      userManagement: "Gestion des utilisateurs",
      reportsModeration: "Rapports",
      logout: "Déconnexion",
      totalListings: "Total des annonces",
      pendingListings: "Annonces en attente",
      approvedListings: "Annonces approuvées",
      totalUsers: "Total des utilisateurs",
      owners: "Propriétaires",
      tenants: "Locataires",
      pendingReports: "Rapports en attente",
      all: "Tous",
      pending: "En attente",
      approved: "Approuvé",
      rejected: "Rejeté",
      approve: "Approuver",
      reject: "Rejeter",
      edit: "Modifier",
      delete: "Supprimer",
      view: "Voir",
      ownerName: "Nom du propriétaire",
      submittedDate: "Date de soumission",
      status: "Statut",
      noListings: "Aucune annonce",
      name: "Nom",
      email: "Email",
      role: "Rôle",
      verified: "Vérifié",
      active: "Actif",
      banned: "Banni",
      ban: "Bannir",
      unban: "Débannir",
      verify: "Vérifier",
      noUsers: "Aucun utilisateur",
      reportedBy: "Signalé par",
      reason: "Raison",
      date: "Date",
      reviewed: "Examiné",
      markReviewed: "Marquer comme examiné",
      viewDetails: "Voir les détails",
      noReports: "Aucun rapport",
      listingName: "Nom de l'annonce",
      description: "Description",
      location: "Emplacement",
      rent: "Loyer",
      rooms: "Chambres",
      type: "Type",
    }
  };

  const tc = content[language];

  const getStatusColor = (status: string) => {
    if (isDark) {
      switch (status.toLowerCase()) {
        case "pending": return "bg-yellow-500/20 text-yellow-400";
        case "approved": case "active": return "bg-green-500/20 text-green-400";
        case "rejected": case "banned": return "bg-red-500/20 text-red-400";
        case "reviewed": return "bg-blue-500/20 text-blue-400";
        default: return "bg-gray-700 text-gray-300";
      }
    } else {
      switch (status.toLowerCase()) {
        case "pending": return "bg-yellow-100 text-yellow-700";
        case "approved": case "active": return "bg-green-100 text-green-700";
        case "rejected": case "banned": return "bg-red-100 text-red-700";
        case "reviewed": return "bg-blue-100 text-blue-700";
        default: return "bg-gray-100 text-gray-700";
      }
    }
  };

  const filteredListings = properties.filter(p => {
    const typeMatch = (() => {
      if (listingFilter === "pg") return p.propertyType === "PG";
      if (listingFilter === "tenant") return p.propertyType === "Tenant";
      if (listingFilter === "verified") return p.isVerified;
      return true;
    })();
    const countryMatch = listingCountry === "all" || p.country === listingCountry;
    return typeMatch && countryMatch;
  });

  const totalListingPages = Math.ceil(filteredListings.length / PAGE_SIZE);
  const pagedListings = filteredListings.slice((listingPage - 1) * PAGE_SIZE, listingPage * PAGE_SIZE);

  const filteredUsers = allUsers.filter(u => {
    const roleMatch = (() => {
      if (userFilter === "landlord") return u.role === "landlord";
      if (userFilter === "renter") return u.role === "renter";
      if (userFilter === "verified") return u.isVerified;
      if (userFilter === "unverified") return !u.isVerified;
      return true;
    })();
    const countryMatch = userCountry === "all" || u.country === userCountry;
    return roleMatch && countryMatch;
  });

  const totalUserPages = Math.ceil(filteredUsers.length / USER_PAGE_SIZE);
  const pagedUsers = filteredUsers.slice((userPage - 1) * USER_PAGE_SIZE, userPage * USER_PAGE_SIZE);

  const filteredReports = reports.filter(report => {
    if (reportFilter === "all") return true;
    return report.status === reportFilter;
  });

  return (
    <>
    <div className={`min-h-screen relative ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
      {/* Grid background — only in dark mode */}
      {isDark && (
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      )}
      {/* Header */}
      <div className={`sticky top-0 z-50 shadow-lg border-b ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.dashboard}</h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${isDark ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors font-medium text-sm"
              >
                <Home className="w-4 h-4" />
                <span>{language === "fr" ? "Accueil" : "Back to Home"}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="lg:w-72 flex-shrink-0">
          <div className={`p-4 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto flex flex-col border-r ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("listings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "listings" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">{tc.listingsManagement}</span>
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "users" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">{tc.userManagement}</span>
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "reports" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Flag className="w-5 h-5" />
                <span className="font-medium">{tc.reportsModeration}</span>
                {stats.pendingReports > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {stats.pendingReports}
                  </span>
                )}
              </button>
            </nav>

            {/* Profile card */}
            <div className={`mt-auto pt-4 border-t relative ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              <button
                onClick={() => setProfileMenuOpen(p => !p)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group ${profileMenuOpen ? "bg-primary/10" : isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                  {user?.profileImage ? (
                    <Image src={user.profileImage} alt={user.fullName} width={40} height={40} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{user?.fullName || "—"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${profileMenuOpen ? "bg-primary text-white" : isDark ? "bg-gray-700 text-gray-400 group-hover:bg-gray-600 group-hover:text-gray-200" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"}`}>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
                </div>
              </button>

              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)} />
                  <div className={`absolute bottom-full left-0 right-0 mb-2 rounded-2xl shadow-xl border overflow-hidden z-20 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
                    <div className={`px-4 py-3 border-b ${isDark ? "bg-primary/10 border-primary/20" : "bg-primary/5 border-primary/10"}`}>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                        {language === "fr" ? "Connecté en tant que" : "Signed in as"}
                      </p>
                      <p className={`text-sm font-bold truncate mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>{user?.fullName}</p>
                    </div>
                    <button
                      onClick={() => { setProfileMenuOpen(false); logout(); router.push(`/in/control/login`); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors group/item ${isDark ? "text-red-400 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isDark ? "bg-red-500/10 group-hover/item:bg-red-500/20" : "bg-red-50 group-hover/item:bg-red-100"}`}>
                        <LogOut className={`w-3.5 h-3.5 ${isDark ? "text-red-400" : "text-red-500"}`} />
                      </div>
                      <span className="font-medium">{language === "fr" ? "Déconnexion" : "Logout"}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tc.totalListings}</h3>
                  <Home className="w-8 h-8 text-primary" />
                </div>
                <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{stats.totalListings}</p>
                <div className={`mt-2 text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>{stats.verifiedListings} verified</div>
              </div>
              <div className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tc.totalUsers}</h3>
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{stats.totalUsers}</p>
                <div className={`mt-2 text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>{stats.owners} landlords, {stats.tenants} renters</div>
              </div>
              <div className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tc.pendingReports}</h3>
                  <Flag className="w-8 h-8 text-red-500" />
                </div>
                <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{stats.pendingReports}</p>
                <div className={`mt-2 text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>{tc.reportsModeration}</div>
              </div>
            </div>

            {/* Listings Management */}
            {activeTab === "listings" && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.listingsManagement}</h2>
                  <div className="flex items-center gap-2">
                    <Filter className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                    <select
                      value={listingFilter}
                      onChange={(e) => { setListingFilter(e.target.value); setListingPage(1); }}
                      className={`px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
                    >
                      <option value="all">{tc.all}</option>
                      <option value="pg">PG</option>
                      <option value="tenant">Tenant</option>
                      <option value="verified">Verified</option>
                    </select>
                    <select
                      value={listingCountry}
                      onChange={(e) => { setListingCountry(e.target.value); setListingPage(1); }}
                      className={`px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
                    >
                      <option value="all">All Countries</option>
                      <option value="in">🇮🇳 India</option>
                      <option value="fr">🇫🇷 France</option>
                    </select>
                  </div>
                </div>

                {propertiesLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                  </div>
                ) : filteredListings.length > 0 ? (
                  <>
                    {/* Table */}
                    <div className={`rounded-2xl border overflow-hidden ${isDark ? "border-gray-800" : "border-gray-200"}`}>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className={`border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                              <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>#</th>
                              <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Property</th>
                              <th className={`px-4 py-3 text-left font-semibold hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Location</th>
                              <th className={`px-4 py-3 text-left font-semibold hidden lg:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Owner</th>
                              <th className={`px-4 py-3 text-left font-semibold hidden lg:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Contact</th>
                              <th className={`px-4 py-3 text-right font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Price</th>
                              <th className={`px-4 py-3 text-left font-semibold hidden sm:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Date</th>
                              <th className={`px-4 py-3 text-center font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}>
                            {pagedListings.map((property, idx) => {
                              const owner = typeof property.createdBy === "object" ? property.createdBy as PropertyOwner : null;
                              const img = property.images?.[0] || "/owner.png";
                              const rowNum = (listingPage - 1) * PAGE_SIZE + idx + 1;
                              return (
                                <tr key={property._id} className={`transition-colors ${isDark ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-50"}`}>
                                  {/* # */}
                                  <td className={`px-4 py-3 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{rowNum}</td>

                                  {/* Property */}
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                                        <Image src={img} alt={property.title} fill className="object-cover" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className={`px-1.5 py-0.5 rounded text-xs font-semibold text-white ${property.propertyType === "PG" ? "bg-blue-600" : "bg-green-600"}`}>
                                            {property.propertyType}
                                          </span>
                                          {property.isVerified && (
                                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-600 text-white text-xs font-semibold rounded">
                                              <ShieldCheck className="w-2.5 h-2.5" /> Verified
                                            </span>
                                          )}
                                        </div>
                                        <p className={`font-semibold truncate max-w-[160px] mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>{property.title}</p>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Location */}
                                  <td className={`px-4 py-3 hidden md:table-cell ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                    <div className="flex items-center gap-1 max-w-[160px]">
                                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                      <span className="truncate text-xs">{[property.areaName, property.location].filter(Boolean).join(", ")}</span>
                                    </div>
                                  </td>

                                  {/* Owner */}
                                  <td className={`px-4 py-3 hidden lg:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                    <span className="font-medium text-xs">{owner?.fullName || "—"}</span>
                                  </td>

                                  {/* Contact */}
                                  <td className={`px-4 py-3 hidden lg:table-cell ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                    <div className="space-y-0.5">
                                      {owner?.email && <div className="flex items-center gap-1 text-xs"><Mail className="w-3 h-3" />{owner.email}</div>}
                                      {owner?.phoneNumber && <div className="flex items-center gap-1 text-xs"><Phone className="w-3 h-3" />{owner.phoneNumber}</div>}
                                    </div>
                                  </td>

                                  {/* Price */}
                                  <td className="px-4 py-3 text-right">
                                    <span className="font-bold text-primary text-sm">{currencySymbol}{property.price.toLocaleString()}</span>
                                  </td>

                                  {/* Date */}
                                  <td className={`px-4 py-3 hidden sm:table-cell text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                    {new Date(property.createdAt).toLocaleDateString()}
                                  </td>

                                  {/* Actions */}
                                  <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        onClick={() => setSelectedProperty(property)}
                                        className="flex items-center gap-1 px-2.5 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-xs font-medium"
                                      >
                                        <Eye className="w-3.5 h-3.5" /> View
                                      </button>
                                      {deleteConfirmId === property._id ? (
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() => handleDeleteProperty(property._id)}
                                            disabled={deletingId === property._id}
                                            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium disabled:opacity-60"
                                          >
                                            {deletingId === property._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                            Yes
                                          </button>
                                          <button
                                            onClick={() => setDeleteConfirmId(null)}
                                            className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                                          >
                                            No
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => setDeleteConfirmId(property._id)}
                                          className={`flex items-center gap-1 px-2.5 py-1.5 border rounded-lg transition-colors text-xs font-medium ${isDark ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-300 text-red-500 hover:bg-red-50"}`}
                                        >
                                          <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    {totalListingPages > 1 && (
                      <div className="flex items-center justify-between pt-2">
                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          Showing {(listingPage - 1) * PAGE_SIZE + 1}–{Math.min(listingPage * PAGE_SIZE, filteredListings.length)} of {filteredListings.length}
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setListingPage(p => Math.max(1, p - 1))}
                            disabled={listingPage === 1}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 ${isDark ? "border border-gray-700 text-gray-300 hover:bg-gray-700" : "border border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          {Array.from({ length: totalListingPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalListingPages || Math.abs(p - listingPage) <= 1)
                            .reduce<(number | "...")[]>((acc, p, i, arr) => {
                              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                              acc.push(p);
                              return acc;
                            }, [])
                            .map((item, i) =>
                              item === "..." ? (
                                <span key={`ellipsis-${i}`} className={`w-8 h-8 flex items-center justify-center text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>…</span>
                              ) : (
                                <button
                                  key={item}
                                  onClick={() => setListingPage(item as number)}
                                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                    listingPage === item
                                      ? "bg-primary text-white"
                                      : isDark ? "border border-gray-700 text-gray-300 hover:bg-gray-700" : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                                  }`}
                                >
                                  {item}
                                </button>
                              )
                            )}
                          <button
                            onClick={() => setListingPage(p => Math.min(totalListingPages, p + 1))}
                            disabled={listingPage === totalListingPages}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 ${isDark ? "border border-gray-700 text-gray-300 hover:bg-gray-700" : "border border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={`rounded-2xl p-12 text-center border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                    <Building2 className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
                    <p className={isDark ? "text-gray-500" : "text-gray-500"}>{tc.noListings}</p>
                  </div>
                )}
              </div>
            )}

            {/* User Management */}
            {activeTab === "users" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.userManagement}</h2>
                  <div className="flex items-center gap-2">
                    <Filter className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                    <select
                      value={userFilter}
                      onChange={(e) => { setUserFilter(e.target.value); setUserPage(1); }}
                      className={`px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
                    >
                      <option value="all">{tc.all}</option>
                      <option value="landlord">Landlords</option>
                      <option value="renter">Renters</option>
                      <option value="verified">Verified</option>
                      <option value="unverified">Unverified</option>
                    </select>
                    <select
                      value={userCountry}
                      onChange={(e) => { setUserCountry(e.target.value); setUserPage(1); }}
                      className={`px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
                    >
                      <option value="all">All Countries</option>
                      <option value="in">🇮🇳 India</option>
                      <option value="fr">🇫🇷 France</option>
                    </select>
                  </div>
                </div>

                {usersLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <>
                    <div className={`rounded-2xl border overflow-hidden ${isDark ? "border-gray-800" : "border-gray-200"}`}>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className={`border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                              <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>#</th>
                              <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.name}</th>
                              <th className={`px-4 py-3 text-left font-semibold hidden sm:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.email}</th>
                              <th className={`px-4 py-3 text-left font-semibold hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Phone</th>
                              <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.role}</th>
                              <th className={`px-4 py-3 text-left font-semibold hidden sm:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Provider</th>
                              <th className={`px-4 py-3 text-left font-semibold hidden sm:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Country</th>
                              <th className={`px-4 py-3 text-center font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.verified}</th>
                              <th className={`px-4 py-3 text-left font-semibold hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Joined</th>
                              <th className={`px-4 py-3 text-center font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Block</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}>
                            {pagedUsers.map((u, idx) => {
                              const rowNum = (userPage - 1) * USER_PAGE_SIZE + idx + 1;
                              const initials = u.fullName?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";
                              const roleColor = u.role === "landlord"
                                ? isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"
                                : u.role === "admin"
                                ? isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700"
                                : isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700";
                              return (
                                <tr key={u._id} className={`transition-colors ${isDark ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-50"}`}>
                                  <td className={`px-4 py-3 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{rowNum}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2.5">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${u.isBlocked ? "bg-red-500" : "bg-primary"}`}>
                                        {initials}
                                      </div>
                                      <div>
                                        <span className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{u.fullName}</span>
                                        {u.isBlocked && (
                                          <span className="ml-2 px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded font-semibold">Blocked</span>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className={`px-4 py-3 hidden sm:table-cell text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{u.email}</td>
                                  <td className={`px-4 py-3 hidden md:table-cell text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                    {u.phoneNumber ? (
                                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{u.phoneNumber}</span>
                                    ) : <span className="text-gray-500">—</span>}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${roleColor}`}>
                                      {u.role}
                                    </span>
                                  </td>
                                  <td className={`px-4 py-3 hidden sm:table-cell text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                    <span className={`px-2 py-0.5 rounded text-xs capitalize ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                                      {u.provider}
                                    </span>
                                  </td>
                                  <td className={`px-4 py-3 hidden sm:table-cell text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                    <span className={`px-2 py-0.5 rounded text-xs uppercase font-semibold ${u.country === "in" ? isDark ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-700" : isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"}`}>
                                      {u.country === "in" ? "🇮🇳 IN" : u.country === "fr" ? "🇫🇷 FR" : u.country}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {u.isVerified
                                      ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                                      : <XCircle className="w-4 h-4 text-gray-400 mx-auto" />}
                                  </td>
                                  <td className={`px-4 py-3 hidden md:table-cell text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                    {new Date(u.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {u.role !== 'admin' && (
                                      <button
                                        onClick={() => handleToggleBlock(u._id, !u.isBlocked)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                          u.isBlocked
                                            ? isDark ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
                                            : isDark ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                                        }`}
                                      >
                                        {u.isBlocked ? "Unblock" : "Block"}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    {totalUserPages > 1 && (
                      <div className="flex items-center justify-between pt-2">
                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          Showing {(userPage - 1) * USER_PAGE_SIZE + 1}–{Math.min(userPage * USER_PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length}
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setUserPage(p => Math.max(1, p - 1))}
                            disabled={userPage === 1}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 ${isDark ? "border border-gray-700 text-gray-300 hover:bg-gray-700" : "border border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          {Array.from({ length: totalUserPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalUserPages || Math.abs(p - userPage) <= 1)
                            .reduce<(number | "...")[]>((acc, p, i, arr) => {
                              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                              acc.push(p);
                              return acc;
                            }, [])
                            .map((item, i) =>
                              item === "..." ? (
                                <span key={`ellipsis-${i}`} className={`w-8 h-8 flex items-center justify-center text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>…</span>
                              ) : (
                                <button
                                  key={item}
                                  onClick={() => setUserPage(item as number)}
                                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                    userPage === item
                                      ? "bg-primary text-white"
                                      : isDark ? "border border-gray-700 text-gray-300 hover:bg-gray-700" : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                                  }`}
                                >
                                  {item}
                                </button>
                              )
                            )}
                          <button
                            onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
                            disabled={userPage === totalUserPages}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 ${isDark ? "border border-gray-700 text-gray-300 hover:bg-gray-700" : "border border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={`rounded-2xl p-12 text-center border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                    <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
                    <p className="text-gray-500">{tc.noUsers}</p>
                  </div>
                )}
              </div>
            )}

            {/* Reports & Moderation */}
            {activeTab === "reports" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.reportsModeration}</h2>
                  <div className="flex items-center gap-2">
                    <Filter className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                    <select
                      value={reportFilter}
                      onChange={(e) => setReportFilter(e.target.value)}
                      className={`px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
                    >
                      <option value="all">{tc.all}</option>
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="dismissed">Dismissed</option>
                    </select>
                  </div>
                </div>

                {reportsLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                  </div>
                ) : filteredReports.length > 0 ? (
                  <div className={`rounded-2xl border overflow-hidden ${isDark ? "border-gray-800" : "border-gray-200"}`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className={`border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                            <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>#</th>
                            <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Property</th>
                            <th className={`px-4 py-3 text-left font-semibold hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Reported By</th>
                            <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Reason</th>
                            <th className={`px-4 py-3 text-left font-semibold hidden lg:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Details</th>
                            <th className={`px-4 py-3 text-left font-semibold hidden sm:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Date</th>
                            <th className={`px-4 py-3 text-center font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Status</th>
                            <th className={`px-4 py-3 text-center font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}>
                          {filteredReports.map((report, idx) => {
                            const prop = report.property;
                            const reporter = report.reportedBy;
                            const statusColor =
                              report.status === "pending"
                                ? isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700"
                                : report.status === "reviewed"
                                ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"
                                : isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500";
                            return (
                              <tr key={report._id} className={`transition-colors ${isDark ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-50"}`}>
                                <td className={`px-4 py-3 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{idx + 1}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2 min-w-0">
                                    {prop?.images?.[0] && (
                                      <div className="relative w-9 h-9 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                                        <Image src={prop.images[0]} alt={prop.title || ""} fill className="object-cover" />
                                      </div>
                                    )}
                                    <div className="min-w-0">
                                      <p className={`font-semibold text-xs truncate max-w-[120px] ${isDark ? "text-white" : "text-gray-900"}`}>{prop?.title || "—"}</p>
                                      {prop?.propertyType && (
                                        <span className={`text-xs px-1.5 py-0.5 rounded font-semibold text-white ${prop.propertyType === "PG" ? "bg-blue-600" : "bg-green-600"}`}>{prop.propertyType}</span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className={`px-4 py-3 hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                  <div>
                                    <p className="text-xs font-medium">{reporter?.fullName || "—"}</p>
                                    <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{reporter?.email}</p>
                                  </div>
                                </td>
                                <td className={`px-4 py-3 text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>{report.reason}</td>
                                <td className={`px-4 py-3 hidden lg:table-cell text-xs max-w-[200px] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                  <p className="line-clamp-2">{report.description}</p>
                                </td>
                                <td className={`px-4 py-3 hidden sm:table-cell text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                  {new Date(report.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColor}`}>{report.status}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-center gap-1.5">
                                    {report.status === "pending" && (
                                      <>
                                        <button
                                          onClick={() => handleUpdateReportStatus(report._id, "reviewed")}
                                          className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                                        >
                                          <CheckCircle className="w-3.5 h-3.5" /> Review
                                        </button>
                                        <button
                                          onClick={() => handleUpdateReportStatus(report._id, "dismissed")}
                                          className={`flex items-center gap-1 px-2.5 py-1.5 border rounded-lg transition-colors text-xs font-medium ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                                        >
                                          Dismiss
                                        </button>
                                      </>
                                    )}
                                    {prop?._id && (
                                      <Link
                                        href={`/property/${prop._id}`}
                                        className="flex items-center gap-1 px-2.5 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-xs font-medium"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </Link>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className={`rounded-2xl p-12 text-center border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                    <Flag className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
                    <p className="text-gray-500">{tc.noReports}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
    </div>

      {/* Property Detail Modal */}
      {selectedProperty && (() => {
        const prop = selectedProperty;
        const owner = typeof prop.createdBy === "object" ? prop.createdBy as PropertyOwner : null;
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProperty(null)}>
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-5 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex items-center gap-3">
                <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{prop.title}</h2>
                {prop.isVerified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-green-600 text-white text-xs font-semibold rounded-full">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <button onClick={() => setSelectedProperty(null)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            {prop.images?.[0] && (
              <div className="relative h-56 w-full">
                <Image src={prop.images[0]} alt={prop.title} fill className="object-cover" />
              </div>
            )}

            <div className="p-5 space-y-5">
              {/* Property Info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Type", value: prop.propertyType },
                  { label: "Category", value: prop.category || "—" },
                  { label: "Price", value: `${currencySymbol}${prop.price.toLocaleString()}/mo` },
                  { label: "Rooms", value: prop.rooms },
                  { label: "Posted by", value: prop.posterType || "—" },
                  { label: "Listed on", value: new Date(prop.createdAt).toLocaleDateString() },
                ].map(({ label, value }) => (
                  <div key={label} className={`p-3 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                    <p className={`text-xs mb-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
                    <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{String(value)}</p>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div className={`p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Address</p>
                <p className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  {[prop.fullAddress, prop.areaName, prop.location, prop.state, prop.pincode].filter(Boolean).join(", ")}
                </p>
                {prop.landmark && (
                  <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Landmark: {prop.landmark}</p>
                )}
              </div>

              {/* Owner Info */}
              {owner && (
                <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-100"}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-blue-600"}`}>Owner Information</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-blue-500"}`} />
                      <span className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{owner.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-blue-500"}`} />
                      <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{owner.email}</span>
                    </div>
                    {owner.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-blue-500"}`} />
                        <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{owner.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {prop.pgDescription && (
                <div className={`p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Description</p>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{prop.pgDescription}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Link
                  href={`/property/${prop._id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-colors text-sm font-medium"
                  onClick={() => setSelectedProperty(null)}
                >
                  <Eye className="w-4 h-4" /> View Public Page
                </Link>
                <button
                  onClick={() => { setSelectedProperty(null); setDeleteConfirmId(prop._id); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </>
  );
}
