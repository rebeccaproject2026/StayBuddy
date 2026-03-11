"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
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
} from "lucide-react";

export default function OwnerDashboard() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("listings");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const currencySymbol = t("currency.symbol");

  // Mock data - in real app, this would come from API
  const myListings = [
    {
      id: 1,
      name: "Sunshine PG",
      type: "PG",
      image: "/owner.png",
      rent: 8000,
      location: "Ahmedabad, Gujarat",
      address: "123 Main Street, Satellite Area",
      rooms: 12,
      occupied: 10,
      status: "Approved",
      verificationStatus: "Approved",
      views: 245,
      inquiries: 12,
    },
    {
      id: 2,
      name: "Green Valley Apartment",
      type: "Tenant",
      image: "/owner.png",
      rent: 25000,
      location: "Mumbai, Maharashtra",
      address: "456 Park Avenue, Andheri West",
      rooms: 3,
      occupied: 3,
      status: "Approved",
      verificationStatus: "Approved",
      views: 189,
      inquiries: 8,
    },
    {
      id: 3,
      name: "Comfort PG",
      type: "PG",
      image: "/owner.png",
      rent: 7500,
      location: "Pune, Maharashtra",
      address: "789 College Road, Kothrud",
      rooms: 8,
      occupied: 6,
      status: "Pending Approval",
      verificationStatus: "Pending",
      views: 0,
      inquiries: 0,
    },
  ];

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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{tc.myListings}</h2>
                  <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
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
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      {tc.addNewListing}
                    </Link>
                  </div>
                </div>

                {myListings.length > 0 ? (
                  <>
                    {/* Grid View */}
                    {viewMode === "grid" && (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myListings.map((listing) => (
                          <div key={listing.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                              <Image
                                src={listing.image}
                                alt={listing.name}
                                fill
                                className="object-cover"
                              />
                              <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                                listing.type === "PG" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                              }`}>
                                {listing.type}
                              </span>
                              <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.verificationStatus)}`}>
                                {listing.verificationStatus === "Approved" ? tc.approved : listing.verificationStatus === "Pending" ? tc.pendingApproval : tc.rejected}
                              </span>
                            </div>
                            <div className="p-6">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.name}</h3>
                              <div className="flex items-center gap-2 text-gray-600 mb-3">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{listing.location}</span>
                              </div>
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl font-bold text-primary">
                                  {currencySymbol} {listing.rent.toLocaleString()}
                                </span>
                                <span className="text-gray-600 text-sm">/month</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                  <p className="text-gray-600">{tc.rooms}</p>
                                  <p className="font-bold text-gray-900">{listing.rooms}</p>
                                </div>
                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                  <p className="text-gray-600">{tc.views}</p>
                                  <p className="font-bold text-gray-900">{listing.views}</p>
                                </div>
                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                  <p className="text-gray-600">{tc.inquiries}</p>
                                  <p className="font-bold text-gray-900">{listing.inquiries}</p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Link href={`/property/${listing.id}`} className="flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm">
                                  <Eye className="w-4 h-4" />
                                  {tc.viewDetails}
                                </Link>
                                <div className="flex gap-2">
                                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                    <Edit className="w-4 h-4" />
                                    {tc.edit}
                                  </button>
                                  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm">
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
                          <div key={listing.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
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
                                    <p className="text-sm text-gray-500">{listing.address}</p>
                                  </div>
                                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(listing.verificationStatus)}`}>
                                    {listing.verificationStatus === "Approved" ? tc.approved : listing.verificationStatus === "Pending" ? tc.pendingApproval : tc.rejected}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                  <span className="text-2xl font-bold text-primary">
                                    {currencySymbol} {listing.rent.toLocaleString()}
                                  </span>
                                  <span className="text-gray-600 text-sm">/month</span>
                                </div>

                                <div className="grid grid-cols-4 gap-4 mb-4">
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">{tc.rooms}</p>
                                    <p className="font-bold text-gray-900">{listing.rooms}</p>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">{tc.occupied}</p>
                                    <p className="font-bold text-gray-900">{listing.occupied}</p>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">{tc.views}</p>
                                    <p className="font-bold text-gray-900">{listing.views}</p>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">{tc.inquiries}</p>
                                    <p className="font-bold text-gray-900">{listing.inquiries}</p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  <Link href={`/property/${listing.id}`} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base">
                                    <Eye className="w-4 h-4" />
                                    {tc.viewDetails}
                                  </Link>
                                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                                    <Edit className="w-4 h-4" />
                                    {tc.edit}
                                  </button>
                                  <button className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm sm:text-base">
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
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
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
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{request.tenantName}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {tc.propertyName}: <span className="font-medium">{request.propertyName}</span>
                            </p>
                            <p className="text-sm text-gray-500">Date: {request.date}</p>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                            {request.status === "Pending" ? tc.pending : request.status === "Approved" ? tc.approved : tc.rejected}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
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
                          <div className="flex gap-2">
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
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{tc.profileSettings}</h2>
                
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tc.fullName}
                      </label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tc.email}
                      </label>
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tc.phone}
                      </label>
                      <input
                        type="tel"
                        defaultValue="+91 99999 99999"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <button className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                      {tc.saveChanges}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <button className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
