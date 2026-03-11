"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
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
} from "lucide-react";

export default function AdminDashboard() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("listings");
  const [listingFilter, setListingFilter] = useState("pending");
  const [userFilter, setUserFilter] = useState("all");
  const [reportFilter, setReportFilter] = useState("pending");
  const currencySymbol = t("currency.symbol");

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
      reportsModeration: "Reports & Moderation",
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
      reportsModeration: "Rapports et modération",
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
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
      case "active":
        return "bg-green-100 text-green-700";
      case "rejected":
      case "banned":
        return "bg-red-100 text-red-700";
      case "reviewed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-[1500px] mx-auto px-6">
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

      <div className="max-w-[1500px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
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
                  <span className="font-medium">{tc.listingsManagement}</span>
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "users"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">{tc.userManagement}</span>
                </button>
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "reports"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
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
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">{tc.totalListings}</h3>
                  <Home className="w-8 h-8 text-primary" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalListings}</p>
                <div className="mt-2 text-sm text-gray-600">
                  {stats.pendingListings} {tc.pending}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">{tc.totalUsers}</h3>
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <div className="mt-2 text-sm text-gray-600">
                  {stats.owners} {tc.owners}, {stats.tenants} {tc.tenants}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">{tc.pendingReports}</h3>
                  <Flag className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingReports}</p>
                <div className="mt-2 text-sm text-gray-600">
                  {tc.reportsModeration}
                </div>
              </div>
            </div>

            {/* Listings Management */}
            {activeTab === "listings" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{tc.listingsManagement}</h2>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <select
                      value={listingFilter}
                      onChange={(e) => setListingFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                      <div key={listing.id} className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex gap-6">
                          <div className="relative w-48 h-32 flex-shrink-0">
                            <Image
                              src={listing.image}
                              alt={listing.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                            <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${
                              listing.type === "PG" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                            }`}>
                              {listing.type}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{listing.name}</h3>
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">{listing.location}</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {tc.ownerName}: <span className="font-medium">{listing.ownerName}</span>
                                </p>
                                <p className="text-sm text-gray-500">{tc.submittedDate}: {listing.submittedDate}</p>
                              </div>
                              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(listing.status)}`}>
                                {listing.status === "Pending" ? tc.pending : listing.status === "Approved" ? tc.approved : tc.rejected}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">{tc.rent}</p>
                                <p className="font-bold text-gray-900">{currencySymbol} {listing.rent.toLocaleString()}</p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">{tc.rooms}</p>
                                <p className="font-bold text-gray-900">{listing.rooms}</p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {listing.status === "Pending" && (
                                <>
                                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                    <CheckCircle className="w-4 h-4" />
                                    {tc.approve}
                                  </button>
                                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                    <XCircle className="w-4 h-4" />
                                    {tc.reject}
                                  </button>
                                </>
                              )}
                              <button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                                <Eye className="w-4 h-4" />
                                {tc.view}
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                <Edit className="w-4 h-4" />
                                {tc.edit}
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                                <Trash2 className="w-4 h-4" />
                                {tc.delete}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">{tc.noListings}</p>
                  </div>
                )}
              </div>
            )}

            {/* User Management */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{tc.userManagement}</h2>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">{tc.all}</option>
                      <option value="owners">{tc.owners}</option>
                      <option value="tenants">{tc.tenants}</option>
                      <option value="banned">{tc.banned}</option>
                    </select>
                  </div>
                </div>

                {filteredUsers.length > 0 ? (
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{tc.name}</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{tc.email}</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{tc.role}</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{tc.status}</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{tc.verified}</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                    {user.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-sm text-gray-500">Joined: {user.joinedDate}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-700">{user.email}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  user.role === "Owner" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
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
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">{tc.noUsers}</p>
                  </div>
                )}
              </div>
            )}

            {/* Reports & Moderation */}
            {activeTab === "reports" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{tc.reportsModeration}</h2>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <select
                      value={reportFilter}
                      onChange={(e) => setReportFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                      <div key={report.id} className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{report.listingName}</h3>
                            <div className="grid md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-600">{tc.reportedBy}</p>
                                <p className="font-medium text-gray-900">{report.reportedBy}</p>
                                <p className="text-sm text-gray-500">{report.reporterEmail}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">{tc.date}</p>
                                <p className="font-medium text-gray-900">{report.date}</p>
                              </div>
                            </div>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                            {report.status === "Pending" ? tc.pending : tc.reviewed}
                          </span>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">{tc.reason}:</p>
                          <p className="text-gray-900 font-semibold mb-2">{report.reason}</p>
                          <p className="text-sm font-medium text-gray-700 mb-1">{tc.description}:</p>
                          <p className="text-gray-800">{report.description}</p>
                        </div>

                        <div className="flex gap-2">
                          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                            <Eye className="w-4 h-4" />
                            {tc.viewDetails}
                          </button>
                          {report.status === "Pending" && (
                            <>
                              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                <CheckCircle className="w-4 h-4" />
                                {tc.markReviewed}
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                <Trash2 className="w-4 h-4" />
                                {tc.delete} Listing
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <Flag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">{tc.noReports}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
