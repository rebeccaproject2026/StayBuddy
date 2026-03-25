"use client";

import { useState, useEffect } from "react";
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
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Ban,
  Shield,
  MapPin,
  Filter,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

export default function AdminDashboard() {
  const { language, t } = useLanguage();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("listings");
  const [listingFilter, setListingFilter] = useState("pending");
  const [userFilter, setUserFilter] = useState("all");
  const [reportFilter, setReportFilter] = useState("pending");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const currencySymbol = t("currency.symbol");

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

  // Mock data - in real app, this would come from API
  const listings = [
    {
      id: 1,
      name: "Sunshine PG",
      type: "PG",
      image: "/owner.png",
      rent: 8000,
      location: "Ahmedabad, Gujarat",
      ownerName: "Rajesh Kumar",
      ownerEmail: "rajesh@example.com",
      status: "Pending",
      submittedDate: "2024-03-08",
      rooms: 12,
    },
    {
      id: 2,
      name: "Green Valley Apartment",
      type: "Tenant",
      image: "/owner.png",
      rent: 25000,
      location: "Mumbai, Maharashtra",
      ownerName: "Priya Sharma",
      ownerEmail: "priya@example.com",
      status: "Approved",
      submittedDate: "2024-03-05",
      rooms: 3,
    },
    {
      id: 3,
      name: "Comfort PG",
      type: "PG",
      image: "/owner.png",
      rent: 7500,
      location: "Pune, Maharashtra",
      ownerName: "Amit Patel",
      ownerEmail: "amit@example.com",
      status: "Rejected",
      submittedDate: "2024-03-07",
      rooms: 8,
    },
  ];

  const users = [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      role: "Owner",
      status: "Active",
      verified: true,
      joinedDate: "2024-01-15",
      listings: 3,
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@example.com",
      role: "Owner",
      status: "Active",
      verified: true,
      joinedDate: "2024-02-10",
      listings: 2,
    },
    {
      id: 3,
      name: "Rahul Verma",
      email: "rahul@example.com",
      role: "Tenant",
      status: "Active",
      verified: false,
      joinedDate: "2024-03-01",
      listings: 0,
    },
    {
      id: 4,
      name: "Suspicious User",
      email: "fake@example.com",
      role: "Owner",
      status: "Banned",
      verified: false,
      joinedDate: "2024-03-05",
      listings: 0,
    },
  ];

  const reports = [
    {
      id: 1,
      listingName: "Fake PG Listing",
      listingId: 5,
      reportedBy: "John Doe",
      reporterEmail: "john@example.com",
      reason: "Fake listing with incorrect information",
      date: "2024-03-08",
      status: "Pending",
      description: "This listing has fake photos and the address doesn't exist.",
    },
    {
      id: 2,
      listingName: "Sunshine PG",
      listingId: 1,
      reportedBy: "Jane Smith",
      reporterEmail: "jane@example.com",
      reason: "Misleading amenities",
      date: "2024-03-07",
      status: "Reviewed",
      description: "The listing claims to have amenities that are not available.",
    },
  ];

  const stats = {
    totalListings: listings.length,
    pendingListings: listings.filter(l => l.status === "Pending").length,
    approvedListings: listings.filter(l => l.status === "Approved").length,
    totalUsers: users.length,
    owners: users.filter(u => u.role === "Owner").length,
    tenants: users.filter(u => u.role === "Tenant").length,
    pendingReports: reports.filter(r => r.status === "Pending").length,
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

  const filteredListings = listings.filter(listing => {
    if (listingFilter === "all") return true;
    return listing.status.toLowerCase() === listingFilter.toLowerCase();
  });

  const filteredUsers = users.filter(user => {
    if (userFilter === "all") return true;
    if (userFilter === "owners") return user.role === "Owner";
    if (userFilter === "tenants") return user.role === "Tenant";
    if (userFilter === "banned") return user.status === "Banned";
    return true;
  });

  const filteredReports = reports.filter(report => {
    if (reportFilter === "all") return true;
    return report.status.toLowerCase() === reportFilter.toLowerCase();
  });

  return (
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
                <div className={`mt-2 text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>{stats.pendingListings} {tc.pending}</div>
              </div>
              <div className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tc.totalUsers}</h3>
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{stats.totalUsers}</p>
                <div className={`mt-2 text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>{stats.owners} {tc.owners}, {stats.tenants} {tc.tenants}</div>
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
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.listingsManagement}</h2>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <Filter className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                    <select
                      value={listingFilter}
                      onChange={(e) => setListingFilter(e.target.value)}
                      className={`w-full sm:w-auto px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
                    >
                      <option value="all">{tc.all}</option>
                      <option value="pending">{tc.pending}</option>
                      <option value="approved">{tc.approved}</option>
                      <option value="rejected">{tc.rejected}</option>
                    </select>
                  </div>
                </div>

                {filteredListings.length > 0 ? (
                  <div className="space-y-4">
                    {filteredListings.map((listing) => (
                      <div key={listing.id} className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                          <div className="relative w-full h-48 md:w-48 md:h-32 flex-shrink-0">
                            <Image src={listing.image} alt={listing.name} fill className="object-cover rounded-lg" />
                            <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${listing.type === "PG" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>
                              {listing.type}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>{listing.name}</h3>
                                <div className={`flex items-center gap-2 mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">{listing.location}</span>
                                </div>
                                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                  {tc.ownerName}: <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{listing.ownerName}</span>
                                </p>
                                <p className="text-sm text-gray-500">{tc.submittedDate}: {listing.submittedDate}</p>
                              </div>
                              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(listing.status)}`}>
                                {listing.status === "Pending" ? tc.pending : listing.status === "Approved" ? tc.approved : tc.rejected}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className={`p-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tc.rent}</p>
                                <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{currencySymbol} {listing.rent.toLocaleString()}</p>
                              </div>
                              <div className={`p-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tc.rooms}</p>
                                <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{listing.rooms}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {listing.status === "Pending" && (
                                <>
                                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                    <CheckCircle className="w-4 h-4" />{tc.approve}
                                  </button>
                                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                    <XCircle className="w-4 h-4" />{tc.reject}
                                  </button>
                                </>
                              )}
                              <button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                                <Eye className="w-4 h-4" />{tc.view}
                              </button>
                              <button className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                                <Edit className="w-4 h-4" />{tc.edit}
                              </button>
                              <button className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${isDark ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-300 text-red-500 hover:bg-red-50"}`}>
                                <Trash2 className="w-4 h-4" />{tc.delete}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`rounded-2xl p-12 text-center border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                    <Home className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
                    <p className={isDark ? "text-gray-500" : "text-gray-500"}>{tc.noListings}</p>
                  </div>
                )}
              </div>
            )}

            {/* User Management */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.userManagement}</h2>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <Filter className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className={`w-full sm:w-auto px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
                    >
                      <option value="all">{tc.all}</option>
                      <option value="owners">{tc.owners}</option>
                      <option value="tenants">{tc.tenants}</option>
                      <option value="banned">{tc.banned}</option>
                    </select>
                  </div>
                </div>

                {filteredUsers.length > 0 ? (
                  <div className={`rounded-2xl overflow-hidden border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className={`border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                          <tr>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.name}</th>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.email}</th>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.role}</th>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.status}</th>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.verified}</th>
                            <th className={`px-6 py-4 text-right text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}>
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className={isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"}>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                    {user.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{user.name}</p>
                                    <p className="text-sm text-gray-500">Joined: {user.joinedDate}</p>
                                  </div>
                                </div>
                              </td>
                              <td className={`px-6 py-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{user.email}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  user.role === "Owner"
                                    ? isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"
                                    : isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700"
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                                  {user.status === "Active" ? tc.active : tc.banned}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {user.verified ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-gray-400" />
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  {!user.verified && user.status === "Active" && (
                                    <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                                      <Shield className="w-4 h-4" />
                                      {tc.verify}
                                    </button>
                                  )}
                                  {user.status === "Active" ? (
                                    <button className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                                      <Ban className="w-4 h-4" />
                                      {tc.ban}
                                    </button>
                                  ) : (
                                    <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                                      <CheckCircle className="w-4 h-4" />
                                      {tc.unban}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.reportsModeration}</h2>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <Filter className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                    <select
                      value={reportFilter}
                      onChange={(e) => setReportFilter(e.target.value)}
                      className={`w-full sm:w-auto px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
                    >
                      <option value="all">{tc.all}</option>
                      <option value="pending">{tc.pending}</option>
                      <option value="reviewed">{tc.reviewed}</option>
                    </select>
                  </div>
                </div>

                {filteredReports.length > 0 ? (
                  <div className="space-y-4">
                    {filteredReports.map((report) => (
                      <div key={report.id} className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{report.listingName}</h3>
                            <div className="grid md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{tc.reportedBy}</p>
                                <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{report.reportedBy}</p>
                                <p className="text-sm text-gray-500">{report.reporterEmail}</p>
                              </div>
                              <div>
                                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{tc.date}</p>
                                <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{report.date}</p>
                              </div>
                            </div>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                            {report.status === "Pending" ? tc.pending : tc.reviewed}
                          </span>
                        </div>
                        <div className={`rounded-lg p-4 mb-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                          <p className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tc.reason}:</p>
                          <p className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{report.reason}</p>
                          <p className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tc.description}:</p>
                          <p className={isDark ? "text-gray-300" : "text-gray-700"}>{report.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                            <Eye className="w-4 h-4" />{tc.viewDetails}
                          </button>
                          {report.status === "Pending" && (
                            <>
                              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                <CheckCircle className="w-4 h-4" />{tc.markReviewed}
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                <Trash2 className="w-4 h-4" />{tc.delete} Listing
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
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
  );
}
