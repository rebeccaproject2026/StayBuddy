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

type Listing = {
  id: number;
  name: string;
  type: "PG" | "Tenant";
  image: string;
  rent: number;
  location: string;
  address: string;
  rooms: number;
  occupied: number;
  status: string;
  verificationStatus: string;
  views: number;
  inquiries: number;
};

export default function OwnerDashboard() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("listings");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const currencySymbol = t("currency.symbol");

  // Mock data - in real app, this would come from API
  const [myListings, setMyListings] = useState<Listing[]>([
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
  ]);

  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    type: "PG" as Listing["type"],
    rent: "",
    location: "",
    address: "",
    rooms: "",
    occupied: "",
  });
  const [editPhotoPreviewUrl, setEditPhotoPreviewUrl] = useState<string | null>(null);

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

  const openEdit = (listing: Listing) => {
    setEditingListing(listing);
    setEditForm({
      name: listing.name,
      type: listing.type,
      rent: String(listing.rent),
      location: listing.location,
      address: listing.address,
      rooms: String(listing.rooms),
      occupied: String(listing.occupied),
    });
    setEditPhotoPreviewUrl(null);
  };

  const closeEdit = () => {
    if (editPhotoPreviewUrl) URL.revokeObjectURL(editPhotoPreviewUrl);
    setEditPhotoPreviewUrl(null);
    setEditingListing(null);
  };

  const saveEdit = () => {
    if (!editingListing) return;

    const rent = Number(editForm.rent);
    const rooms = Math.max(0, Number(editForm.rooms));
    const occupied = Math.min(Math.max(0, Number(editForm.occupied)), rooms);

    setMyListings((prev) =>
      prev.map((l) =>
        l.id === editingListing.id
          ? {
              ...l,
              name: editForm.name.trim() || l.name,
              type: editForm.type,
              rent: Number.isFinite(rent) ? rent : l.rent,
              location: editForm.location.trim() || l.location,
              address: editForm.address.trim() || l.address,
              rooms: Number.isFinite(rooms) ? rooms : l.rooms,
              occupied: Number.isFinite(occupied) ? occupied : l.occupied,
              image: editPhotoPreviewUrl ?? l.image,
            }
          : l
      )
    );

    closeEdit();
  };

  const deleteListing = (id: number) => {
    setMyListings((prev) => prev.filter((l) => l.id !== id));
    if (editingListing?.id === id) closeEdit();
  };

  const bumpRooms = (id: number, delta: number) => {
    setMyListings((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const rooms = Math.max(0, l.rooms + delta);
        const occupied = Math.min(l.occupied, rooms);
        return { ...l, rooms, occupied };
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
                                  <button
                                    onClick={() => openEdit(listing)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                  >
                                    <Edit className="w-4 h-4" />
                                    {tc.edit}
                                  </button>
                                  <button
                                    onClick={() => deleteListing(listing.id)}
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
                          <div key={listing.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                              <div className="relative w-full h-48 md:w-48 md:h-32 flex-shrink-0">
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
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-3">
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{listing.name}</h3>
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                      <MapPin className="w-4 h-4" />
                                      <span className="text-sm">{listing.location}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{listing.address}</p>
                                  </div>
                                  <span className={`self-start px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(listing.verificationStatus)}`}>
                                    {listing.verificationStatus === "Approved" ? tc.approved : listing.verificationStatus === "Pending" ? tc.pendingApproval : tc.rejected}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                  <span className="text-2xl font-bold text-primary">
                                    {currencySymbol} {listing.rent.toLocaleString()}
                                  </span>
                                  <span className="text-gray-600 text-sm">/month</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
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
                                  <button
                                    onClick={() => openEdit(listing)}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                                  >
                                    <Edit className="w-4 h-4" />
                                    {tc.edit}
                                  </button>
                                  <button
                                    onClick={() => deleteListing(listing.id)}
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

      {/* Edit Listing Modal */}
      {editingListing && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={closeEdit} />
          <div className="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center p-3 sm:p-6">
            <div className="w-full sm:max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-gray-200 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Edit Listing</h3>
                  <p className="text-sm text-gray-600 mt-1">{editingListing.name}</p>
                </div>
                <button
                  onClick={closeEdit}
                  className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Close
                </button>
              </div>

              <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property name</label>
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{tc.type}</label>
                    <select
                      value={editForm.type}
                      onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value as Listing["type"] }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="PG">PG</option>
                      <option value="Tenant">Tenant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{tc.rent}</label>
                    <input
                      value={editForm.rent}
                      onChange={(e) => setEditForm((p) => ({ ...p, rent: e.target.value }))}
                      inputMode="numeric"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{tc.location}</label>
                    <input
                      value={editForm.location}
                      onChange={(e) => setEditForm((p) => ({ ...p, location: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      value={editForm.address}
                      onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{tc.rooms}</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => bumpRooms(editingListing.id, -1)}
                        className="px-3 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        type="button"
                      >
                        -
                      </button>
                      <input
                        value={editForm.rooms}
                        onChange={(e) => setEditForm((p) => ({ ...p, rooms: e.target.value }))}
                        inputMode="numeric"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        onClick={() => bumpRooms(editingListing.id, 1)}
                        className="px-3 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Add or remove rooms with +/-</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{tc.occupied}</label>
                    <input
                      value={editForm.occupied}
                      onChange={(e) => setEditForm((p) => ({ ...p, occupied: e.target.value }))}
                      inputMode="numeric"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-gray-500 mt-2">Update room availability by changing occupied rooms.</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload new photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (editPhotoPreviewUrl) URL.revokeObjectURL(editPhotoPreviewUrl);
                        setEditPhotoPreviewUrl(URL.createObjectURL(file));
                      }}
                      className="w-full"
                    />
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={editPhotoPreviewUrl ?? editingListing.image}
                          alt="Listing preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  onClick={() => deleteListing(editingListing.id)}
                  className="w-full sm:w-auto px-4 py-3 rounded-lg border border-red-500 text-red-500 hover:bg-red-50"
                >
                  {tc.delete} Listing
                </button>
                <button
                  onClick={closeEdit}
                  className="w-full sm:w-auto px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="w-full sm:w-auto px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
