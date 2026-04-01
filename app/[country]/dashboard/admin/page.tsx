"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
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
  ClipboardList,
  Clock,
  CheckCheck,
  XOctagon,
  MessageSquare,
  Building2 as BuildingIcon,
  Calendar,
  Building2,
  Loader2,
  AlertTriangle,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
  approvalStatus: 'pending' | 'approved' | 'rejected';
  pgDescription?: string;
  fullAddress?: string;
  pincode?: string;
  landmark?: string;
  category?: string;
  posterType?: string;
  verificationImages?: string[];
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
  const params = useParams();
  const currentCountry = (params?.country as string) || "in";
  
  const [activeTab, setActiveTab] = useState("analytics");
  const [listingFilter, setListingFilter] = useState("all");
  const [listingCountry, setListingCountry] = useState(currentCountry);
  const [userFilter, setUserFilter] = useState("all");
  const [userCountry, setUserCountry] = useState(currentCountry);
  const [reportFilter, setReportFilter] = useState("pending");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const currencySymbol = t("currency.symbol");

  // Real property data (approved — for listings tab)
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

  // Property requests (pending)
  const [requests, setRequests] = useState<AdminProperty[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestFilter, setRequestFilter] = useState("pending");
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [viewingRequest, setViewingRequest] = useState<AdminProperty | null>(null);

  // Block modal
  const [blockModal, setBlockModal] = useState<{ userId: string; userName: string; email: string } | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [blockSubmitting, setBlockSubmitting] = useState(false);

  // Document lightbox
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);
  const [waEntries, setWaEntries] = useState<{ id: string; phone: string; name: string; pgName: string }[]>([
    { id: crypto.randomUUID(), phone: "", name: "", pgName: "" },
  ]);
  const [waSent, setWaSent] = useState<Set<string>>(new Set());

  // Leads database
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsTab, setLeadsTab] = useState<"compose" | "database">("compose");

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

  // Fetch approved properties (listings tab)
  const fetchProperties = useCallback(async () => {
    const token = localStorage.getItem("staybuddy_token");
    if (!token) return;
    setPropertiesLoading(true);
    try {
      const res = await fetch(`/api/admin/properties?status=approved&country=${currentCountry}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setProperties(data.properties);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setPropertiesLoading(false);
    }
  }, [currentCountry]);

  // Fetch all property requests
  const fetchRequests = useCallback(async () => {
    const token = localStorage.getItem("staybuddy_token");
    if (!token) return;
    setRequestsLoading(true);
    try {
      const res = await fetch(`/api/admin/properties?country=${currentCountry}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRequests(data.properties);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setRequestsLoading(false);
    }
  }, [currentCountry]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return;
    fetchProperties();
    fetchRequests();

    // Connect to SSE — refresh requests only when a new property is posted
    const token = localStorage.getItem("staybuddy_token");
    if (!token) return;

    const es = new EventSource(`/api/admin/property-events?token=${encodeURIComponent(token)}`);

    es.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.type === "new_property") {
          fetchRequests();
        } else if (payload.type === "new_lead") {
          // fetchLeads is declared later — call it via a small inline fetch
          const t = localStorage.getItem("staybuddy_token");
          if (!t) return;
          fetch(`/api/admin/leads?country=${currentCountry}`, { headers: { Authorization: `Bearer ${t}` } })
            .then(r => r.json())
            .then(d => { if (d.success) setLeads(d.leads); })
            .catch(() => {});
        }
      } catch {}
    };

    es.onerror = () => {
      // SSE will auto-reconnect; nothing to do
    };

    return () => es.close();
  }, [isAuthenticated, user, fetchProperties, fetchRequests, currentCountry]);

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("staybuddy_token");
    if (!token) return;
    setUsersLoading(true);
    try {
      const res = await fetch(`/api/admin/users?country=${currentCountry}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAllUsers(data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setUsersLoading(false);
    }
  }, [currentCountry]);

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
      const res = await fetch(`/api/admin/reports?country=${currentCountry}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAllReports(data.reports);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setReportsLoading(false);
    }
  }, [currentCountry]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchReports();
    }
  }, [isAuthenticated, user, fetchReports]);

  const fetchLeads = useCallback(async () => {
    const token = localStorage.getItem("staybuddy_token");
    if (!token) return;
    setLeadsLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?country=${currentCountry}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setLeads(data.leads);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLeadsLoading(false);
    }
  }, [currentCountry]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchLeads();
    }
  }, [isAuthenticated, user, fetchLeads]);

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

  const handleToggleBlock = async (userId: string, block: boolean, userName: string, email: string) => {
    if (block) {
      // Open modal to collect reason
      setBlockModal({ userId, userName, email });
      setBlockReason("");
      return;
    }
    // Unblock directly — no reason needed
    const token = localStorage.getItem("staybuddy_token");
    if (!token) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, isBlocked: false }),
      });
      const data = await res.json();
      if (data.success) setAllUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: false } : u));
    } catch (err) {
      console.error("Failed to unblock:", err);
    }
  };

  const handleBlockSubmit = async () => {
    if (!blockModal || !blockReason.trim()) return;
    const token = localStorage.getItem("staybuddy_token");
    if (!token) return;
    setBlockSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: blockModal.userId, isBlocked: true, reason: blockReason.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setAllUsers(prev => prev.map(u => u._id === blockModal.userId ? { ...u, isBlocked: true } : u));
        setBlockModal(null);
        setBlockReason("");
      }
    } catch (err) {
      console.error("Failed to block:", err);
    } finally {
      setBlockSubmitting(false);
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

  const handlePropertyAction = async (propertyId: string, action: 'approve' | 'reject' | 'verify') => {
    const token = localStorage.getItem("staybuddy_token");
    if (!token) return;
    setActioningId(propertyId);
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = data.property as AdminProperty;
        // Update requests list
        setRequests(prev => prev.map(p => p._id === propertyId ? { ...p, ...updated } : p));
        // If approved, switch filter to "approved" so the property stays visible with Verify button
        if (action === 'approve') {
          setRequestFilter("approved");
          setProperties(prev => prev.some(p => p._id === propertyId) ? prev.map(p => p._id === propertyId ? { ...p, ...updated } : p) : [updated, ...prev]);
        }
        if (action === 'verify') {
          setRequests(prev => prev.map(p => p._id === propertyId ? { ...p, isVerified: true } : p));
          setProperties(prev => prev.map(p => p._id === propertyId ? { ...p, isVerified: true } : p));
        }
        if (viewingRequest?._id === propertyId) setViewingRequest(prev => prev ? { ...prev, ...updated } : null);
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setActioningId(null);
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
    pendingRequests: requests.filter(r => r.approvalStatus === "pending").length,
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
    // Country filtering is now done at API level
    return typeMatch;
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
    // Country filtering is now done at API level
    return roleMatch;
  });

  const totalUserPages = Math.ceil(filteredUsers.length / USER_PAGE_SIZE);
  const pagedUsers = filteredUsers.slice((userPage - 1) * USER_PAGE_SIZE, userPage * USER_PAGE_SIZE);

  const filteredReports = reports.filter(report => {
    if (reportFilter === "all") return true;
    return report.status === reportFilter;
  });

  return (
    <>
    <div className={`h-screen overflow-hidden flex flex-col relative ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
      {/* Grid background — only in dark mode */}
      {isDark && (
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      )}
      {/* Header */}
      <div className={`flex-shrink-0 sticky top-0 z-50 shadow-lg border-b ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
        <div className="max-w-[1500px] mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2">
              <h1 className={`text-base sm:text-xl font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{tc.dashboard}</h1>
              <div className={`hidden sm:block px-2.5 py-1 rounded-lg border text-xs font-semibold ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-gray-100 border-gray-300 text-gray-700"}`}>
                {currentCountry === "in" ? "🇮🇳 India" : currentCountry === "fr" ? "🇫🇷 France" : currentCountry.toUpperCase()}
              </div>
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
                className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors font-medium text-xs sm:text-sm"
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{language === "fr" ? "Accueil" : "Back to Home"}</span>
                <span className="sm:hidden">{language === "fr" ? "Accueil" : "Home"}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
          <div className={`p-4 h-full overflow-y-auto flex flex-col border-r ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "analytics" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Analytics</span>
              </button>
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
              <button
                onClick={() => setActiveTab("requests")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "requests" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <ClipboardList className="w-5 h-5" />
                <span className="font-medium">Property Requests</span>
                {stats.pendingRequests > 0 && (
                  <span className="ml-auto bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{stats.pendingRequests}</span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("outreach")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "outreach" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">WA Outreach</span>
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
        <div className="flex-1 overflow-y-auto pb-16 lg:pb-0 min-w-0 p-3 sm:p-5 lg:p-8">
            {/* Stats Cards */}
            {activeTab === "analytics" && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>Total Property Listed</h3>
                  <Home className="w-8 h-8 text-primary" />
                </div>
                <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{stats.totalListings}</p>
                <div className={`mt-2 text-sm flex items-center gap-1.5 font-medium text-green-500`}>
                  <CheckCircle className="w-4 h-4" />
                  {stats.verifiedListings} verified
                </div>
              </div>
              <div className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tc.totalUsers}</h3>
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{stats.totalUsers}</p>
                <div className={`mt-3 flex items-center gap-3`}>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 font-medium text-sm">
                    <Building2 className="w-4 h-4" />
                    {stats.owners} landlords
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 font-medium text-sm">
                    <Users className="w-4 h-4" />
                    {stats.tenants} renters
                  </div>
                </div>
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
            )}

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
                    <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}>
                      {currentCountry === "in" ? "🇮🇳 India" : currentCountry === "fr" ? "🇫🇷 France" : currentCountry.toUpperCase()}
                    </div>
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
                    <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}>
                      {currentCountry === "in" ? "🇮🇳 India" : currentCountry === "fr" ? "🇫🇷 France" : currentCountry.toUpperCase()}
                    </div>
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
                                        onClick={() => handleToggleBlock(u._id, !u.isBlocked, u.fullName, u.email)}
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

            {/* Property Requests */}
            {activeTab === "requests" && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className={`text-lg sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Property Requests</h2>
                    <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Review and approve new property listing submissions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchRequests}
                      disabled={requestsLoading}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm transition-colors disabled:opacity-50 ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                    >
                      <Loader2 className={`w-3.5 h-3.5 ${requestsLoading ? "animate-spin" : ""}`} />
                      <span className="hidden sm:inline">Refresh</span>
                    </button>
                    <Filter className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                    <select
                      value={requestFilter}
                      onChange={e => setRequestFilter(e.target.value)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { label: "Pending", count: requests.filter(r => r.approvalStatus === "pending").length, icon: Clock, color: "text-yellow-400", bg: isDark ? "bg-yellow-500/10 border-yellow-500/20" : "bg-yellow-50 border-yellow-200" },
                    { label: "Approved", count: requests.filter(r => r.approvalStatus === "approved").length, icon: CheckCheck, color: "text-green-400", bg: isDark ? "bg-green-500/10 border-green-500/20" : "bg-green-50 border-green-200" },
                    { label: "Rejected", count: requests.filter(r => r.approvalStatus === "rejected").length, icon: XOctagon, color: "text-red-400", bg: isDark ? "bg-red-500/10 border-red-500/20" : "bg-red-50 border-red-200" },
                  ].map(({ label, count, icon: Icon, color, bg }) => (
                    <div key={label} className={`rounded-xl p-3 sm:p-4 border flex items-center gap-2 sm:gap-3 ${bg}`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${color}`} />
                      <div>
                        <p className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{count}</p>
                        <p className={`text-[10px] sm:text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {requestsLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                  </div>
                ) : (() => {
                  const filtered = requests.filter(r => requestFilter === "all" || r.approvalStatus === requestFilter);
                  return filtered.length > 0 ? (
                    <>
                      {/* Desktop table */}
                      <div className={`hidden sm:block rounded-2xl border overflow-hidden ${isDark ? "border-gray-800" : "border-gray-200"}`}>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm min-w-[640px]">
                            <thead>
                              <tr className={`border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                                <th className={`px-3 py-3 text-left font-semibold text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>#</th>
                                <th className={`px-3 py-3 text-left font-semibold text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>Property</th>
                                <th className={`px-3 py-3 text-left font-semibold text-xs hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Owner</th>
                                <th className={`px-3 py-3 text-left font-semibold text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>Location</th>
                                <th className={`px-3 py-3 text-right font-semibold text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>Price</th>
                                <th className={`px-3 py-3 text-center font-semibold text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>Status</th>
                                <th className={`px-3 py-3 text-center font-semibold text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
                              </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}>
                              {filtered.map((req, idx) => {
                                const owner = typeof req.createdBy === "object" ? req.createdBy as PropertyOwner : null;
                                const img = req.images?.[0] || "/owner.png";
                                const isActioning = actioningId === req._id;
                                const statusStyle = req.approvalStatus === "pending" ? isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700" : req.approvalStatus === "approved" ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700" : isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700";
                                return (
                                  <tr key={req._id} className={`transition-colors ${isDark ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-50"}`}>
                                    <td className={`px-3 py-3 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{idx + 1}</td>
                                    <td className="px-3 py-3">
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="relative w-9 h-9 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                                          <Image src={img} alt={req.title} fill className="object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold text-white ${req.propertyType === "PG" ? "bg-blue-600" : "bg-green-600"}`}>{req.propertyType}</span>
                                          <p className={`font-semibold text-xs truncate max-w-[120px] mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>{req.title}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className={`px-3 py-3 hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                      <p className="text-xs font-medium truncate max-w-[100px]">{owner?.fullName || "—"}</p>
                                      <p className={`text-[10px] truncate max-w-[100px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>{owner?.email}</p>
                                    </td>
                                    <td className={`px-3 py-3 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate max-w-[100px]">{[req.areaName, req.location].filter(Boolean).join(", ")}</span>
                                      </div>
                                    </td>
                                    <td className="px-3 py-3 text-right">
                                      <span className="font-bold text-primary text-xs">{currencySymbol}{req.price.toLocaleString()}</span>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusStyle}`}>{req.approvalStatus}</span>
                                    </td>
                                    <td className="px-3 py-3">
                                      <div className="flex items-center justify-center gap-1 flex-wrap">
                                        <button onClick={() => setViewingRequest(req)} className="flex items-center gap-1 px-2 py-1 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-[10px] font-medium">
                                          <Eye className="w-3 h-3" /> View
                                        </button>
                                        {req.approvalStatus === "pending" && (<>
                                          <button onClick={() => handlePropertyAction(req._id, "approve")} disabled={isActioning} className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-[10px] font-medium disabled:opacity-60">
                                            {isActioning ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />} OK
                                          </button>
                                          <button onClick={() => handlePropertyAction(req._id, "reject")} disabled={isActioning} className={`flex items-center gap-1 px-2 py-1 border rounded-lg transition-colors text-[10px] font-medium disabled:opacity-60 ${isDark ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-300 text-red-500 hover:bg-red-50"}`}>
                                            <XCircle className="w-3 h-3" /> No
                                          </button>
                                        </>)}
                                        {req.approvalStatus === "approved" && !req.isVerified && (
                                          <button onClick={() => handlePropertyAction(req._id, "verify")} disabled={isActioning} className="flex items-center gap-1 px-2 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-[10px] font-medium disabled:opacity-60">
                                            {isActioning ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />} Verify
                                          </button>
                                        )}
                                        {req.approvalStatus === "approved" && req.isVerified && (
                                          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-600/20 text-emerald-400 rounded-lg text-[10px] font-medium">
                                            <ShieldCheck className="w-3 h-3" /> ✓
                                          </span>
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

                      {/* Mobile cards */}
                      <div className="sm:hidden space-y-3">
                        {filtered.map((req) => {
                          const owner = typeof req.createdBy === "object" ? req.createdBy as PropertyOwner : null;
                          const img = req.images?.[0] || "/owner.png";
                          const isActioning = actioningId === req._id;
                          const statusStyle = req.approvalStatus === "pending" ? isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700" : req.approvalStatus === "approved" ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700" : isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700";
                          return (
                            <div key={req._id} className={`rounded-2xl border p-4 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                              <div className="flex items-start gap-3 mb-3">
                                <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
                                  <Image src={img} alt={req.title} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold text-white ${req.propertyType === "PG" ? "bg-blue-600" : "bg-green-600"}`}>{req.propertyType}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusStyle}`}>{req.approvalStatus}</span>
                                  </div>
                                  <p className={`font-semibold text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>{req.title}</p>
                                  <p className="font-bold text-primary text-sm">{currencySymbol}{req.price.toLocaleString()}</p>
                                </div>
                              </div>
                              <div className={`space-y-1.5 mb-3 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                {owner && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 flex-shrink-0" /><span className="truncate">{owner.fullName}</span></div>}
                                <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 flex-shrink-0" /><span className="truncate">{[req.areaName, req.location].filter(Boolean).join(", ")}</span></div>
                                <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 flex-shrink-0" /><span>{new Date(req.createdAt).toLocaleDateString()}</span></div>
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                <button onClick={() => setViewingRequest(req)} className="flex items-center gap-1.5 px-3 py-2 border border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-colors text-xs font-semibold">
                                  <Eye className="w-3.5 h-3.5" /> View
                                </button>
                                {req.approvalStatus === "pending" && (<>
                                  <button onClick={() => handlePropertyAction(req._id, "approve")} disabled={isActioning} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-xs font-semibold disabled:opacity-60">
                                    {isActioning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />} Approve
                                  </button>
                                  <button onClick={() => handlePropertyAction(req._id, "reject")} disabled={isActioning} className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl transition-colors text-xs font-semibold disabled:opacity-60 ${isDark ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-300 text-red-500 hover:bg-red-50"}`}>
                                    <XCircle className="w-3.5 h-3.5" /> Reject
                                  </button>
                                </>)}
                                {req.approvalStatus === "approved" && !req.isVerified && (
                                  <button onClick={() => handlePropertyAction(req._id, "verify")} disabled={isActioning} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-xs font-semibold disabled:opacity-60">
                                    {isActioning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />} Verify
                                  </button>
                                )}
                                {req.approvalStatus === "approved" && req.isVerified && (
                                  <span className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/20 text-emerald-400 rounded-xl text-xs font-semibold">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className={`rounded-2xl p-10 text-center border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                      <ClipboardList className={`w-12 h-12 mx-auto mb-3 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
                      <p className={`font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>No property requests</p>
                      <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>New submissions will appear here for review</p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (() => {
              // Build monthly data from real data (last 6 months)
              const now = new Date();
              const months = Array.from({ length: 6 }, (_, i) => {
                const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
                return {
                  label: d.toLocaleString("default", { month: "short" }),
                  year: d.getFullYear(),
                  month: d.getMonth(),
                };
              });

              const monthlyData = months.map(({ label, year, month }) => {
                const propCount = requests.filter(p => {
                  const d = new Date(p.createdAt);
                  return d.getFullYear() === year && d.getMonth() === month;
                }).length;
                const userCount = allUsers.filter(u => {
                  const d = new Date(u.createdAt);
                  return d.getFullYear() === year && d.getMonth() === month;
                }).length;
                const reportCount = allReports.filter(r => {
                  const d = new Date(r.createdAt);
                  return d.getFullYear() === year && d.getMonth() === month;
                }).length;
                return { month: label, Properties: propCount, Users: userCount, Reports: reportCount };
              });

              const propertyTypeData = [
                { name: "PG", value: requests.filter(p => p.propertyType === "PG").length, color: "#3b82f6" },
                { name: "Tenant", value: requests.filter(p => p.propertyType === "Tenant").length, color: "#22c55e" },
              ];

              const approvalData = [
                { name: "Approved", value: requests.filter(r => r.approvalStatus === "approved").length, color: "#22c55e" },
                { name: "Pending", value: requests.filter(r => r.approvalStatus === "pending").length, color: "#eab308" },
                { name: "Rejected", value: requests.filter(r => r.approvalStatus === "rejected").length, color: "#ef4444" },
              ];

              const userRoleData = [
                { name: "Landlords", value: stats.owners, color: "#3b82f6" },
                { name: "Renters", value: stats.tenants, color: "#eab308" },
              ];

              const reportStatusData = [
                { name: "Pending", value: allReports.filter(r => r.status === "pending").length, color: "#eab308" },
                { name: "Reviewed", value: allReports.filter(r => r.status === "reviewed").length, color: "#22c55e" },
                { name: "Dismissed", value: allReports.filter(r => r.status === "dismissed").length, color: "#6b7280" },
              ];

              const tooltipStyle = {
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                borderRadius: "12px",
                color: isDark ? "#f9fafb" : "#111827",
              };

              const axisColor = isDark ? "#6b7280" : "#9ca3af";
              const gridColor = isDark ? "#1f2937" : "#f3f4f6";

              const CustomTooltip = ({ active, payload, label }: any) => {
                if (!active || !payload?.length) return null;
                return (
                  <div style={tooltipStyle} className="px-4 py-3 shadow-xl text-sm">
                    <p className="font-semibold mb-2">{label}</p>
                    {payload.map((entry: any) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                        <span className={isDark ? "text-gray-300" : "text-gray-600"}>{entry.name}:</span>
                        <span className="font-bold">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                );
              };

              const PieTooltip = ({ active, payload }: any) => {
                if (!active || !payload?.length) return null;
                return (
                  <div style={tooltipStyle} className="px-4 py-3 shadow-xl text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: payload[0].payload.color }} />
                      <span className="font-semibold">{payload[0].name}:</span>
                      <span className="font-bold">{payload[0].value}</span>
                    </div>
                  </div>
                );
              };

              return (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Analytics</h2>
                    <div className={`px-3 py-1 rounded-lg text-xs font-medium ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                      {currentCountry === "in" ? "🇮🇳 India" : "🇫🇷 France"} · Last 6 months
                    </div>
                  </div>

                  {/* Overview bar — quick numbers */}

                  {/* Monthly trend — Area chart */}
                  <div className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                    <h3 className={`text-base font-semibold mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>Monthly Activity Trend</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradProps" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gradReports" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                        <Area type="monotone" dataKey="Properties" stroke="#6366f1" strokeWidth={2.5} fill="url(#gradProps)" dot={{ r: 4, fill: "#6366f1" }} activeDot={{ r: 6 }} />
                        <Area type="monotone" dataKey="Users" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradUsers)" dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
                        <Area type="monotone" dataKey="Reports" stroke="#ef4444" strokeWidth={2.5} fill="url(#gradReports)" dot={{ r: 4, fill: "#ef4444" }} activeDot={{ r: 6 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                 

                  {/* Pie charts row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Approval status */}
                    <div className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                      <h3 className={`text-base font-semibold mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>Approval Status</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie data={approvalData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" animationBegin={0} animationDuration={800}>
                            {approvalData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} stroke="transparent" />
                            ))}
                          </Pie>
                          <Tooltip content={<PieTooltip />} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Report status */}
                    <div className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                      <h3 className={`text-base font-semibold mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>Report Status</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie data={reportStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" animationBegin={0} animationDuration={800}>
                            {reportStatusData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} stroke="transparent" />
                            ))}
                          </Pie>
                          <Tooltip content={<PieTooltip />} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* WhatsApp Outreach Tab */}
            {activeTab === "outreach" && (() => {
              const WA_MESSAGE = `Hello Sir,\n\nWe help PG owners in Ahmedabad & Gandhinagar get more tenants through our platform.\n\nCurrently, we are offering FREE listing and promotion for early partners.\n\nWould you like to list your PG with us and get more inquiries?\n\nReply YES and we will get you started.`;

              const buildLink = (phone: string, name: string, pgName: string) => {
                let msg = WA_MESSAGE;
                if (name) msg = `Hello ${name},\n\n` + msg.replace("Hello Sir,\n\n", "");
                if (pgName) msg = msg + `\n\nPG Name: ${pgName}`;
                const clean = phone.replace(/\D/g, "");
                const num = clean.startsWith("91") ? clean : `91${clean}`;
                return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
              };

              const addRow = () => setWaEntries(prev => [...prev, { id: crypto.randomUUID(), phone: "", name: "", pgName: "" }]);
              const removeRow = (id: string) => setWaEntries(prev => prev.filter(e => e.id !== id));
              const updateRow = (id: string, field: string, value: string) =>
                setWaEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));

              const saveLead = async (entry: { phone: string; name: string; pgName: string }) => {
                const token = localStorage.getItem("staybuddy_token");
                if (!token) return;
                try {
                  await fetch("/api/admin/leads", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ phone: entry.phone.replace(/\D/g, ""), name: entry.name, pgName: entry.pgName, country: currentCountry }),
                  });
                  fetchLeads();
                } catch {}
              };

              const markSent = (id: string, entry: { phone: string; name: string; pgName: string }) => {
                setWaSent(prev => new Set(prev).add(id));
                saveLead(entry);
              };

              const updateLeadStatus = async (leadId: string, status: string) => {
                const token = localStorage.getItem("staybuddy_token");
                if (!token) return;
                try {
                  await fetch("/api/admin/leads", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ leadId, status }),
                  });
                  setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status } : l));
                } catch {}
              };

              const deleteLead = async (leadId: string) => {
                const token = localStorage.getItem("staybuddy_token");
                if (!token) return;
                try {
                  await fetch(`/api/admin/leads?id=${leadId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setLeads(prev => prev.filter(l => l._id !== leadId));
                } catch {}
              };

              const statusColors: Record<string, string> = {
                contacted: isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700",
                interested: isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700",
                not_interested: isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700",
                listed: isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700",
              };

              const WA_ICON = (
                <svg viewBox="0 0 24 24" className="fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              );

              return (
                <div className="space-y-4 sm:space-y-6">
                  {/* Hero header */}
                  <div className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 border ${isDark ? "bg-gradient-to-br from-green-950/60 via-gray-900 to-gray-900 border-green-800/30" : "bg-gradient-to-br from-green-50 via-white to-white border-green-200"}`}>
                    <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 opacity-5 pointer-events-none">
                      <div className="w-full h-full text-green-500 scale-150 translate-x-8 -translate-y-8">{WA_ICON}</div>
                    </div>
                    <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 flex-shrink-0">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 text-white">{WA_ICON}</div>
                        </div>
                        <div>
                          <h2 className={`text-lg sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>WhatsApp Outreach</h2>
                          <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Send targeted messages · leads auto-saved</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        {[
                          { value: leads.length, label: "Leads", color: "text-green-500" },
                          { value: leads.filter((l: any) => l.status === "interested").length, label: "Interested", color: "text-blue-400" },
                          { value: leads.filter((l: any) => l.status === "listed").length, label: "Listed", color: "text-purple-400" },
                        ].map(({ value, label, color }) => (
                          <div key={label} className={`text-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white border-gray-200 shadow-sm"}`}>
                            <p className={`text-base sm:text-lg font-bold ${color}`}>{value}</p>
                            <p className={`text-[10px] sm:text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sub-tabs */}
                  <div className={`flex gap-1 p-1 rounded-xl w-full sm:w-fit ${isDark ? "bg-gray-800/80" : "bg-gray-100"}`}>
                    {([
                      { key: "compose", label: "✉ Compose" },
                      { key: "database", label: `📋 Leads (${leads.length})` },
                    ] as const).map(({ key, label }) => (
                      <button key={key} onClick={() => setLeadsTab(key)}
                        className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-all ${leadsTab === key
                          ? "bg-green-500 text-white shadow-md shadow-green-500/20"
                          : isDark ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"}`}>
                        {label}
                      </button>
                    ))}
                  </div>

                  {leadsTab === "compose" && (<>
                  {/* Two-column layout: message preview + recipients */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                    {/* Message preview — left */}
                    <div className={`lg:col-span-2 rounded-2xl border p-4 sm:p-5 flex flex-col gap-3 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Message Template</p>
                      </div>
                      {/* WhatsApp bubble */}
                      <div className="relative">
                        <div className={`rounded-2xl rounded-tl-sm p-3 sm:p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${isDark ? "bg-green-900/40 text-green-200 border border-green-800/40" : "bg-green-100 text-green-900 border border-green-200"}`}>
                          {WA_MESSAGE}
                        </div>
                        <div className={`absolute -top-1 -left-1 w-3 h-3 ${isDark ? "text-green-900/40" : "text-green-100"}`}>
                          <svg viewBox="0 0 12 12" fill="currentColor"><path d="M0 0 L12 0 L0 12 Z"/></svg>
                        </div>
                      </div>
                      <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        If owner name is provided, "Sir" is replaced with their name.
                      </p>
                    </div>

                    {/* Recipients — right */}
                    <div className={`lg:col-span-3 rounded-2xl border overflow-hidden ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                      <div className={`px-4 sm:px-5 py-3 sm:py-4 border-b flex items-center justify-between ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>Recipients</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>{waEntries.length}</span>
                        </div>
                        <button onClick={addRow} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 active:scale-95 text-white text-xs font-bold rounded-lg transition-all shadow-sm shadow-green-500/30">
                          <span className="text-sm leading-none">+</span> Add
                        </button>
                      </div>

                      <div className={`divide-y ${isDark ? "divide-gray-800/60" : "divide-gray-100"}`}>
                        {waEntries.map((entry, idx) => {
                          const isValid = entry.phone.replace(/\D/g, "").length >= 10;
                          const sent = waSent.has(entry.id);
                          return (
                            <div key={entry.id} className={`p-3 sm:p-4 transition-all duration-300 ${sent ? isDark ? "bg-green-500/5 border-l-2 border-green-500" : "bg-green-50 border-l-2 border-green-400" : ""}`}>
                              {/* Row header */}
                              <div className="flex items-center gap-2 mb-2.5">
                                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${sent ? "bg-green-500 text-white scale-110" : isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                                  {sent ? "✓" : idx + 1}
                                </div>
                                {sent ? (
                                  <span className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                                    <CheckCircle className="w-3 h-3" /> Saved · Opened in WhatsApp
                                  </span>
                                ) : (
                                  <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Fill details and send</span>
                                )}
                                {waEntries.length > 1 && (
                                  <button onClick={() => removeRow(entry.id)} className={`ml-auto w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDark ? "text-gray-600 hover:bg-red-500/20 hover:text-red-400" : "text-gray-300 hover:bg-red-50 hover:text-red-500"}`}>
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>

                              {/* Inputs */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div className="relative">
                                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold pointer-events-none ${isDark ? "text-gray-500" : "text-gray-400"}`}>+91</span>
                                  <input type="tel" placeholder="Phone *" value={entry.phone}
                                    onChange={e => updateRow(entry.id, "phone", e.target.value)}
                                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                                      isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-600" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                                    } ${isValid ? isDark ? "border-green-500/50 bg-green-500/5" : "border-green-400 bg-green-50/50" : ""}`}
                                  />
                                </div>
                                <input type="text" placeholder="Owner name" value={entry.name}
                                  onChange={e => updateRow(entry.id, "name", e.target.value)}
                                  className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-600" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
                                />
                                <input type="text" placeholder="PG name" value={entry.pgName}
                                  onChange={e => updateRow(entry.id, "pgName", e.target.value)}
                                  className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-600" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
                                />
                              </div>

                              {/* Send button */}
                              <div className="mt-2.5">
                                <a
                                  href={isValid ? buildLink(entry.phone, entry.name, entry.pgName) : undefined}
                                  target="_blank" rel="noopener noreferrer"
                                  onClick={() => isValid && markSent(entry.id, entry)}
                                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                                    isValid
                                      ? sent
                                        ? isDark ? "bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25" : "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                                        : "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                                      : "opacity-30 cursor-not-allowed pointer-events-none " + (isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-400")
                                  }`}
                                >
                                  <span className="w-4 h-4">{WA_ICON}</span>
                                  {sent ? "Sent — Open Again" : "Send on WhatsApp"}
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Progress footer */}
                      {waEntries.length > 1 && (
                        <div className={`px-4 sm:px-5 py-3 border-t flex items-center gap-3 ${isDark ? "border-gray-800 bg-gray-800/40" : "border-gray-100 bg-gray-50"}`}>
                          <span className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-500"}`}>{waSent.size}/{waEntries.length} sent</span>
                          <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700"
                              style={{ width: `${waEntries.length ? (waSent.size / waEntries.length) * 100 : 0}%` }} />
                          </div>
                          <span className="text-xs font-bold text-green-500">{waEntries.length ? Math.round((waSent.size / waEntries.length) * 100) : 0}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  </>)}

                  {leadsTab === "database" && (
                    <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                      <div className={`px-4 sm:px-5 py-3 sm:py-4 border-b flex items-center justify-between gap-3 ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>Lead Database</p>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>{leads.length} total</span>
                          {leads.filter((l: any) => l.status === "interested").length > 0 && (
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"}`}>
                              {leads.filter((l: any) => l.status === "interested").length} interested
                            </span>
                          )}
                        </div>
                        <button onClick={fetchLeads} className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all active:scale-95 ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}>
                          <Loader2 className={`w-3.5 h-3.5 ${leadsLoading ? "animate-spin" : ""}`} /> Refresh
                        </button>
                      </div>
                      {leadsLoading ? (
                        <div className="flex items-center justify-center py-20">
                          <div className="text-center">
                            <Loader2 className={`w-8 h-8 animate-spin mx-auto mb-2 ${isDark ? "text-green-500" : "text-green-600"}`} />
                            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Loading leads...</p>
                          </div>
                        </div>
                      ) : leads.length === 0 ? (
                        <div className="py-20 text-center">
                          <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                            <div className={`w-8 h-8 ${isDark ? "text-gray-600" : "text-gray-400"}`}>{WA_ICON}</div>
                          </div>
                          <p className={`font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>No leads yet</p>
                          <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>Send your first WhatsApp message to start building your lead list.</p>
                          <button onClick={() => setLeadsTab("compose")} className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all active:scale-95">
                            Go to Compose
                          </button>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm min-w-[520px]">
                            <thead>
                              <tr className={`border-b ${isDark ? "bg-gray-800/60 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                                {["#", "Phone", "Name", "PG Name", "Status", "Date", ""].map(h => (
                                  <th key={h} className={`px-3 sm:px-4 py-3 text-left text-xs font-bold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? "divide-gray-800/60" : "divide-gray-100"}`}>
                              {leads.map((lead: any, idx: number) => (
                                <tr key={lead._id} className={`group transition-colors ${isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"}`}>
                                  <td className={`px-3 sm:px-4 py-3 text-xs font-medium ${isDark ? "text-gray-600" : "text-gray-400"}`}>{idx + 1}</td>
                                  <td className="px-3 sm:px-4 py-3">
                                    <a href={`https://wa.me/91${lead.phone}`} target="_blank" rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 text-green-500 hover:text-green-400 font-semibold text-xs sm:text-sm transition-colors">
                                      <span className="w-3.5 h-3.5 flex-shrink-0">{WA_ICON}</span>
                                      {lead.phone}
                                    </a>
                                  </td>
                                  <td className={`px-3 sm:px-4 py-3 text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                    {lead.name || <span className={`${isDark ? "text-gray-600" : "text-gray-300"}`}>—</span>}
                                  </td>
                                  <td className={`px-3 sm:px-4 py-3 text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                    {lead.pgName || <span className={`${isDark ? "text-gray-600" : "text-gray-300"}`}>—</span>}
                                  </td>
                                  <td className="px-3 sm:px-4 py-3">
                                    <select value={lead.status} onChange={e => updateLeadStatus(lead._id, e.target.value)}
                                      className={`px-2 py-1 rounded-lg text-xs font-bold border-0 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer transition-all ${statusColors[lead.status]}`}>
                                      <option value="contacted">Contacted</option>
                                      <option value="interested">Interested</option>
                                      <option value="not_interested">Not Interested</option>
                                      <option value="listed">Listed</option>
                                    </select>
                                  </td>
                                  <td className={`px-3 sm:px-4 py-3 text-xs whitespace-nowrap ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                                    {new Date(lead.messageSentAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                  </td>
                                  <td className="px-3 sm:px-4 py-3">
                                    <button onClick={() => deleteLead(lead._id)}
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto opacity-0 group-hover:opacity-100 transition-all ${isDark ? "text-gray-500 hover:bg-red-500/20 hover:text-red-400" : "text-gray-400 hover:bg-red-50 hover:text-red-500"}`}>
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

      {/* Mobile Bottom Tab Bar */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-stretch h-16">
          {[
            { key: "analytics",  icon: BarChart3,     label: "Analytics" },
            { key: "listings",   icon: Home,          label: "Listings" },
            { key: "users",      icon: Users,         label: "Users" },
            { key: "reports",    icon: Flag,          label: "Reports",  badge: stats.pendingReports },
            { key: "requests",   icon: ClipboardList, label: "Requests", badge: stats.pendingRequests },
            { key: "outreach",   icon: MessageSquare, label: "Outreach" },
          ].map(({ key, icon: Icon, label, badge }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all duration-200 ${
                activeTab === key ? "text-primary" : isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {activeTab === key && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />}
              {activeTab === key && <span className={`absolute inset-x-0.5 inset-y-0.5 rounded-xl ${isDark ? "bg-primary/10" : "bg-primary/8"}`} />}
              <div className="relative z-10">
                <Icon className="w-4 h-4" />
                {badge ? (
                  <span className="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {(badge as number) > 9 ? '9+' : badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[8px] font-semibold z-10 ${activeTab === key ? "opacity-100" : "opacity-50"}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>
      </div>

      {/* Block User Modal */}
      {blockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => !blockSubmitting && setBlockModal(null)}>
          <div
            className={`w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
                  <Ban className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>Block User</h3>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{blockModal.userName}</p>
                </div>
              </div>
              <button onClick={() => !blockSubmitting && setBlockModal(null)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-200"}`}>
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className={`text-xs leading-relaxed ${isDark ? "text-red-300" : "text-red-700"}`}>
                  This will block the account and send an email to <strong>{blockModal.email}</strong> with the reason.
                </p>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Reason for blocking <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Violation of terms of service, fraudulent activity, spam..."
                  value={blockReason}
                  onChange={e => setBlockReason(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
                />
                <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{blockReason.length}/500</p>
              </div>
            </div>

            {/* Footer */}
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${isDark ? "border-gray-800 bg-gray-800/40" : "border-gray-100 bg-gray-50"}`}>
              <button
                onClick={() => !blockSubmitting && setBlockModal(null)}
                disabled={blockSubmitting}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-200"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleBlockSubmit}
                disabled={!blockReason.trim() || blockSubmitting}
                className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all active:scale-95"
              >
                {blockSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                {blockSubmitting ? "Blocking..." : "Block & Notify"}
              </button>
            </div>
          </div>
        </div>
      )}

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

              {/* Verification Documents */}
              <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className={`w-4 h-4 ${prop.isVerified ? "text-emerald-500" : isDark ? "text-gray-400" : "text-gray-400"}`} />
                  <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>Verification Documents</p>
                  {prop.isVerified && <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs font-semibold rounded-full">Verified</span>}
                </div>
                {(prop.verificationImages?.length ?? 0) > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {prop.verificationImages!.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={e => { e.stopPropagation(); setViewingDoc(url); }}
                        className="group relative h-20 rounded-lg overflow-hidden bg-gray-200 block cursor-pointer"
                        title="Click to view document"
                      >
                        <Image src={url} alt={`Document ${i + 1}`} fill className="object-cover group-hover:opacity-75 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>No verification documents uploaded.</p>
                )}
              </div>

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

      {/* Request Detail Modal */}
      {viewingRequest && (() => {
        const req = viewingRequest;
        const owner = typeof req.createdBy === "object" ? req.createdBy as PropertyOwner : null;
        const hasDocs = (req.verificationImages?.length ?? 0) > 0;
        const isActioning = actioningId === req._id;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewingRequest(null)}>
            <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`} onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className={`flex items-center justify-between p-5 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex items-center gap-2">
                  <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{req.title}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    req.approvalStatus === "pending" ? isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700"
                    : req.approvalStatus === "approved" ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"
                    : isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700"
                  }`}>{req.approvalStatus}</span>
                  {req.isVerified && <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-600 text-white text-xs font-semibold rounded-full"><ShieldCheck className="w-3 h-3" /> Verified</span>}
                </div>
                <button onClick={() => setViewingRequest(null)} className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Property image */}
              {req.images?.[0] && (
                <div className="relative h-48 w-full">
                  <Image src={req.images[0]} alt={req.title} fill className="object-cover" />
                </div>
              )}

              <div className="p-5 space-y-4">
                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Type", value: req.propertyType },
                    { label: "Price", value: `${currencySymbol}${req.price.toLocaleString()}/mo` },
                    { label: "Location", value: [req.areaName, req.location].filter(Boolean).join(", ") || "—" },
                    { label: "Submitted", value: new Date(req.createdAt).toLocaleDateString() },
                  ].map(({ label, value }) => (
                    <div key={label} className={`p-3 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                      <p className={`text-xs mb-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
                      <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Owner */}
                {owner && (
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-100"}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-gray-400" : "text-blue-600"}`}>Owner</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <span className="flex items-center gap-1"><Users className={`w-3.5 h-3.5 ${isDark ? "text-gray-400" : "text-blue-500"}`} /><span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{owner.fullName}</span></span>
                      <span className="flex items-center gap-1"><Mail className={`w-3.5 h-3.5 ${isDark ? "text-gray-400" : "text-blue-500"}`} /><span className={isDark ? "text-gray-300" : "text-gray-700"}>{owner.email}</span></span>
                      {owner.phoneNumber && <span className="flex items-center gap-1"><Phone className={`w-3.5 h-3.5 ${isDark ? "text-gray-400" : "text-blue-500"}`} /><span className={isDark ? "text-gray-300" : "text-gray-700"}>{owner.phoneNumber}</span></span>}
                    </div>
                  </div>
                )}

                {/* Verification documents */}
                <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Verification Documents</p>
                  {hasDocs ? (
                    <div className="grid grid-cols-3 gap-2">
                      {req.verificationImages!.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={e => { e.stopPropagation(); setViewingDoc(url); }}
                          className="group relative h-20 rounded-lg overflow-hidden bg-gray-200 block cursor-pointer"
                          title="Click to view document"
                        >
                          <Image src={url} alt={`Doc ${i + 1}`} fill className="object-cover group-hover:opacity-75 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>No verification documents uploaded.</p>
                  )}
                </div>

                {/* Description */}
                {req.pgDescription && (
                  <div className={`p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Description</p>
                    <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{req.pgDescription}</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 pt-1">
                  {req.approvalStatus === "pending" && (
                    <>
                      <button
                        onClick={() => handlePropertyAction(req._id, "approve")}
                        disabled={isActioning}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-semibold disabled:opacity-60"
                      >
                        {isActioning ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Approve
                      </button>
                      <button
                        onClick={() => handlePropertyAction(req._id, "reject")}
                        disabled={isActioning}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-semibold disabled:opacity-60"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </>
                  )}
                  {req.approvalStatus === "approved" && !req.isVerified && (
                    <button
                      onClick={() => handlePropertyAction(req._id, "verify")}
                      disabled={isActioning}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-semibold disabled:opacity-60"
                    >
                      {isActioning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />} Mark as Verified
                    </button>
                  )}
                  {req.approvalStatus === "approved" && req.isVerified && (
                    <div className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl text-sm font-semibold">
                      <ShieldCheck className="w-4 h-4" /> Property Verified
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {/* Document Lightbox */}
      {viewingDoc && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setViewingDoc(null)}
        >
          <button
            onClick={() => setViewingDoc(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={viewingDoc}
              alt="Verification document"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
          <a
            href={viewingDoc}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" /> Open original
          </a>
        </div>
      )}
    </>
  );
}
