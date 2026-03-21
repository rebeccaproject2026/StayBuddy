"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "@/components/LocalizedLink";
import Image from "next/image";
import {
  Heart,
  MessageSquare,
  Calendar,
  User,
  LogOut,
  MapPin,
  Eye,
  Trash2,
  Send,
  Camera,
  Lock,
  Mail,
  Phone,
} from "lucide-react";

export default function TenantDashboard() {
  const { language, t } = useLanguage();
  const { user, isLoading, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("saved");
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
    setRequestsLoading(true);
    fetch('/api/contact-requests', {
      headers: token !== 'nextauth' ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(data => { if (data.success) setMyRequests(data.requests || []); })
      .catch(() => {})
      .finally(() => setRequestsLoading(false));
  }, [isAuthenticated, token, user?.role]);

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
  if (!isAuthenticated || user?.role !== 'renter') {
    return null;
  }

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
  const myBookings = [
    {
      id: 1,
      pgName: "Sunshine PG",
      roomType: "Single",
      rent: 8000,
      moveInDate: "2024-04-01",
      status: "Confirmed",
      ownerName: "Rajesh Kumar",
      address: "123 Main Street, Satellite Area, Ahmedabad",
    },
    {
      id: 2,
      pgName: "City Center PG",
      roomType: "Double",
      rent: 7000,
      moveInDate: "2024-03-15",
      status: "Pending",
      ownerName: "Suresh Verma",
      address: "555 Central Avenue, Connaught Place, Delhi",
    },
  ];

  const messages = [
    {
      id: 1,
      ownerName: "Rajesh Kumar",
      propertyName: "Sunshine PG",
      lastMessage: "Yes, the room is available. You can visit this weekend.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      ownerName: "Priya Sharma",
      propertyName: "Green Valley Apartment",
      lastMessage: "Sure, you can visit tomorrow at 5 PM.",
      time: "1 day ago",
      unread: false,
    },
    {
      id: 3,
      ownerName: "Amit Patel",
      propertyName: "Comfort PG",
      lastMessage: "Thank you for your interest. The room has been booked.",
      time: "3 days ago",
      unread: false,
    },
  ];

  const content = {
    en: {
      dashboard: "Tenant Dashboard",
      savedProperties: "Saved Properties",
      myRequests: "My Requests",
      myBookings: "My Bookings",
      messagesTab: "Messages",
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
      bookingStatus: "Booking Status",
      noBookings: "No bookings yet",
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
      myBookings: "Mes réservations",
      messagesTab: "Messages",
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
      bookingStatus: "Statut de réservation",
      noBookings: "Aucune réservation",
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
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "replied":
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "closed":
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
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
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-md p-4 sticky top-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "saved"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">{tc.savedProperties}</span>
                </button>
                <button
                  onClick={() => setActiveTab("requests")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "requests"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">{tc.myRequests}</span>
                </button>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "bookings"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">{tc.myBookings}</span>
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "messages"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <span className="font-medium">{tc.messagesTab}</span>
                  {messages.filter(m => m.unread).length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {messages.filter(m => m.unread).length}
                    </span>
                  )}
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
            {/* Saved Properties */}
            {activeTab === "saved" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{tc.savedProperties}</h2>
                {favLoading ? (
                  <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl shadow-md h-72 animate-pulse" />
                    ))}
                  </div>
                ) : savedProperties.length > 0 ? (
                  <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedProperties.map((property: any) => (
                      <div key={property._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-48">
                          <Image
                            src={property.images?.[0] || "/owner.png"}
                            alt={property.title || property.societyName}
                            fill
                            className="object-cover"
                          />
                          <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                            property.propertyType === "PG" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                          }`}>
                            {property.propertyType}
                          </span>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {property.societyName || property.title}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{[property.areaName, property.location, property.state].filter(Boolean).join(", ")}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold text-primary">
                              {currencySymbol} {property.price?.toLocaleString()}
                            </span>
                            <span className="text-gray-600 text-sm">/month</span>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Link
                              href={`/property/${property._id}`}
                              className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              {tc.viewDetails}
                            </Link>
                            <button
                              onClick={() => handleRemoveFavorite(property._id)}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">{tc.noSavedProperties}</p>
                  </div>
                )}
              </div>
            )}

            {/* My Requests */}
            {activeTab === "requests" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{tc.myRequests}</h2>
                {requestsLoading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => <div key={i} className="bg-white rounded-2xl shadow-md h-32 animate-pulse" />)}
                  </div>
                ) : myRequests.length > 0 ? (
                  <div className="space-y-4">
                    {myRequests.map((req: any) => (
                      <div key={req._id} className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{req.propertyTitle}</h3>
                            <p className="text-sm text-gray-500">{tc.date}: {new Date(req.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`self-start px-4 py-1.5 rounded-full text-sm font-medium capitalize ${getStatusColor(req.status)}`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3 text-sm mb-3">
                          <div><span className="text-gray-500">Room Type:</span> <span className="font-medium capitalize">{req.roomType}</span></div>
                          <div><span className="text-gray-500">Move-in:</span> <span className="font-medium">{req.moveInDate}</span></div>
                          <div><span className="text-gray-500">Duration:</span> <span className="font-medium">{req.stayDuration} months</span></div>
                          <div><span className="text-gray-500">Budget:</span> <span className="font-medium">{req.budgetRange}</span></div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">{tc.messageSent}:</p>
                          <p className="text-sm text-gray-800">{req.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">{tc.noRequests}</p>
                  </div>
                )}
              </div>
            )}

            {/* My Bookings */}
            {activeTab === "bookings" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{tc.myBookings}</h2>
                {myBookings.length > 0 ? (
                  <div className="space-y-4">
                    {myBookings.map((booking) => (
                      <div key={booking.id} className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{booking.pgName}</h3>
                            <p className="text-sm text-gray-600 mb-1">
                              {tc.ownerName}: <span className="font-medium">{booking.ownerName}</span>
                            </p>
                            <p className="text-sm text-gray-600">{booking.address}</p>
                          </div>
                          <span className={`self-start px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status === "Confirmed" ? tc.confirmed : booking.status === "Pending" ? tc.pending : tc.cancelled}
                          </span>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">{tc.roomType}</p>
                            <p className="font-semibold text-gray-900">{booking.roomType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">{tc.rent}</p>
                            <p className="font-semibold text-gray-900">{currencySymbol} {booking.rent.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">{tc.moveInDate}</p>
                            <p className="font-semibold text-gray-900">{booking.moveInDate}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">{tc.noBookings}</p>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            {activeTab === "messages" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{tc.messagesTab}</h2>
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`bg-white rounded-2xl shadow-md p-6 ${message.unread ? 'border-l-4 border-primary' : ''}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-gray-900">{message.ownerName}</h3>
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
                    <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">{tc.noMessages}</p>
                  </div>
                )}
              </div>
            )}

            {/* Profile */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{tc.profileSettings}</h2>
                
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">John Doe</h3>
                      <p className="text-gray-600">john.doe@example.com</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tc.fullName}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          defaultValue="John Doe"
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tc.email}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          defaultValue="john.doe@example.com"
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tc.phone}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          defaultValue="+91 99999 99999"
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <button className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                      {tc.saveChanges}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{tc.changePassword}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tc.currentPassword}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tc.newPassword}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tc.confirmPassword}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <button className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                      {tc.update}
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
