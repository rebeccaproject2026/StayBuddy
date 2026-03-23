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
  Home,
  X,
  ChevronDown,
} from "lucide-react";

export default function TenantDashboard() {
  const { language, t } = useLanguage();
  const { user, isLoading, isAuthenticated, token, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("saved");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [favLoading, setFavLoading] = useState(false);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const currencySymbol = t("currency.symbol");

  // Chat state
  const [chatRequest, setChatRequest] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSending, setChatSending] = useState(false);
  // unread counts per requestId
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  // conversations: requestId → last message snippet
  const [conversations, setConversations] = useState<Record<string, { lastMsg: string; time: string; senderName: string; unread: boolean }>>({});

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

  // seenCounts: requestId → number of landlord messages already seen (persisted in localStorage)
  const [seenCounts, setSeenCounts] = useState<Record<string, number>>(() => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem('staybuddy_seen') || '{}'); } catch { return {}; }
  });

  // Persist seenCounts to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('staybuddy_seen', JSON.stringify(seenCounts));
    }
  }, [seenCounts]);

  // Poll all requests for new messages (every 15s)
  useEffect(() => {
    if (!isAuthenticated || !token || user?.role !== 'renter') return;
    if (myRequests.length === 0) return;

    const poll = async () => {
      const seen: Record<string, number> = JSON.parse(localStorage.getItem('staybuddy_seen') || '{}');
      for (const req of myRequests) {
        try {
          const res = await fetch(`/api/messages/${req._id}`, {
            headers: token !== 'nextauth' ? { Authorization: `Bearer ${token}` } : {},
          });
          const data = await res.json();
          if (data.success && data.messages?.length > 0) {
            const msgs: any[] = data.messages;
            const last = msgs[msgs.length - 1];
            const ownerMsgCount = msgs.filter((m: any) => m.senderRole === 'landlord').length;
            const isConversationOpen = chatRequest?._id === req._id;

            setConversations(prev => ({
              ...prev,
              [req._id]: {
                lastMsg: last.text,
                time: last.createdAt,
                senderName: last.senderName,
                unread: !isConversationOpen && ownerMsgCount > (seen[req._id] ?? 0),
              },
            }));

            if (!isConversationOpen) {
              setUnreadCounts(prev => ({
                ...prev,
                [req._id]: Math.max(0, ownerMsgCount - (seen[req._id] ?? 0)),
              }));
            }
          }
        } catch {}
      }
    };

    poll();
    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, token, user?.role, myRequests, chatRequest]);

  const openChat = async (req: any) => {
    setChatRequest(req);
    setChatMessages([]);
    setChatLoading(true);
    // clear unread for this request
    setUnreadCounts(prev => ({ ...prev, [req._id]: 0 }));
    setConversations(prev => prev[req._id] ? { ...prev, [req._id]: { ...prev[req._id], unread: false } } : prev);
    try {
      const res = await fetch(`/api/messages/${req._id}`, {
        headers: token !== 'nextauth' ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        const msgs = data.messages || [];
        setChatMessages(msgs);
        // record how many owner messages have been seen
        const ownerMsgCount = msgs.filter((m: any) => m.senderRole === 'landlord').length;
        setSeenCounts(prev => ({ ...prev, [req._id]: ownerMsgCount }));
        if (msgs.length > 0) {
          const last = msgs[msgs.length - 1];
          setConversations(prev => ({
            ...prev,
            [req._id]: { lastMsg: last.text, time: last.createdAt, senderName: last.senderName, unread: false },
          }));
        }
      }
    } catch {}
    setChatLoading(false);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !chatRequest || chatSending) return;
    const text = chatInput.trim();
    setChatInput('');
    setChatSending(true);
    try {
      const res = await fetch(`/api/messages/${chatRequest._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token !== 'nextauth' ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages(prev => [...prev, data.message]);
        setConversations(prev => ({
          ...prev,
          [chatRequest._id]: { lastMsg: text, time: data.message.createdAt, senderName: user?.fullName || 'You', unread: false },
        }));
      }
    } catch {}
    setChatSending(false);
  };

  const closeChat = () => {
    setChatRequest(null);
    setChatMessages([]);
    setChatInput('');
  };

  const deleteChat = async () => {
    if (!chatRequest) return;
    try {
      await fetch(`/api/messages/${chatRequest._id}`, {
        method: 'DELETE',
        headers: token !== 'nextauth' ? { Authorization: `Bearer ${token}` } : {},
      });
      setChatMessages([]);
      setConversations(prev => {
        const next = { ...prev };
        delete next[chatRequest._id];
        return next;
      });
      setSeenCounts(prev => {
        const next = { ...prev };
        delete next[chatRequest._id];
        return next;
      });
      setUnreadCounts(prev => {
        const next = { ...prev };
        delete next[chatRequest._id];
        return next;
      });
      closeChat();
    } catch {}
  };

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
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-primary">{tc.dashboard}</h1>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors font-medium text-sm"
            >
              <Home className="w-4 h-4" />
              <span>{language === "fr" ? "Accueil" : "Back to Home"}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white shadow-md p-4 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto flex flex-col">
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
                  onClick={() => {
                    setActiveTab("messages");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "messages"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <span className="font-medium">{tc.messagesTab}</span>
                  {Object.values(unreadCounts).reduce((a, b) => a + b, 0) > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {Object.values(unreadCounts).reduce((a, b) => a + b, 0)}
                    </span>
                  )}
                </button>
              </nav>

              {/* Profile card */}
              <div className="mt-auto pt-4 border-t border-gray-100 relative">
                <button
                  onClick={() => setProfileMenuOpen(p => !p)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group ${profileMenuOpen ? "bg-primary/5" : "hover:bg-primary/5"}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                    <span className="text-white font-bold text-sm">
                      {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName || "—"}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${profileMenuOpen ? "bg-primary text-white" : "bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"}`}>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)} />
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20">
                      {/* User info header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                          {language === "fr" ? "Connecté en tant que" : "Signed in as"}
                        </p>
                        <p className="text-sm font-bold text-gray-900 truncate mt-0.5">{user?.fullName}</p>
                      </div>
                      <button
                        onClick={() => { setActiveTab("profile"); setProfileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors group/item"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover/item:bg-primary/10 flex items-center justify-center transition-colors">
                          <User className="w-3.5 h-3.5 text-gray-500 group-hover/item:text-primary transition-colors" />
                        </div>
                        <span className="font-medium">{language === "fr" ? "Voir le profil" : "View Profile"}</span>
                      </button>
                      <button
                        onClick={() => { setProfileMenuOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 group/item"
                      >
                        <div className="w-7 h-7 rounded-lg bg-red-50 group-hover/item:bg-red-100 flex items-center justify-center transition-colors">
                          <LogOut className="w-3.5 h-3.5 text-red-500" />
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
                        <div className="mt-3">
                          <button
                            onClick={() => { openChat(req); setActiveTab('messages'); }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
                          >
                            <MessageSquare className="w-4 h-4" />
                            {tc.reply}
                          </button>
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
                {myRequests.filter((r: any) => conversations[r._id]).length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">{tc.noMessages}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myRequests
                      .filter((r: any) => conversations[r._id])
                      .map((req: any) => {
                        const conv = conversations[req._id];
                        const hasUnread = conv.unread;
                        return (
                          <div
                            key={req._id}
                            onClick={() => openChat(req)}
                            className={`bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow ${hasUnread ? 'border-l-4 border-primary' : ''}`}
                          >
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`truncate ${hasUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-900'}`}>{req.propertyTitle}</p>
                                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                  {new Date(conv.time).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 truncate">{conv.senderName}</p>
                              <p className={`text-sm truncate mt-0.5 ${hasUnread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{conv.lastMsg}</p>
                            </div>
                            {hasUnread && (
                              <span className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0" />
                            )}
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await fetch(`/api/messages/${req._id}`, { method: 'DELETE', headers: token !== 'nextauth' ? { Authorization: `Bearer ${token}` } : {} });
                                setConversations(prev => { const n = { ...prev }; delete n[req._id]; return n; });
                                setSeenCounts(prev => { const n = { ...prev }; delete n[req._id]; return n; });
                                setUnreadCounts(prev => { const n = { ...prev }; delete n[req._id]; return n; });
                              }}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                              title="Delete conversation"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        );
                      })}
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

      {/* Chat Modal */}
      {chatRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeChat} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col" style={{ height: '80vh', maxHeight: '600px' }}>
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{chatRequest.propertyTitle}</p>
                <p className="text-xs text-gray-500 truncate">{(chatRequest.owner as any)?.fullName || (language === 'fr' ? 'Propriétaire' : 'Owner')}</p>
              </div>
              <button onClick={deleteChat} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title={language === 'fr' ? 'Supprimer la conversation' : 'Delete conversation'}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
              <button onClick={closeChat} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* TTL notice */}
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex-shrink-0">
              <p className="text-xs text-amber-700 text-center">
                {language === 'fr' ? '⏳ Les messages sont automatiquement supprimés après 7 jours.' : '⏳ Messages are automatically cleared after 7 days.'}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-sm">{language === 'fr' ? 'Aucun message. Commencez la conversation.' : 'No messages yet. Start the conversation.'}</p>
                </div>
              ) : (
                chatMessages.map((msg: any) => {
                  const isMe = msg.senderRole === 'renter';
                  return (
                    <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'}`}>
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                  placeholder={language === 'fr' ? 'Écrire un message...' : 'Type a message...'}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <button
                  onClick={sendChatMessage}
                  disabled={chatSending || !chatInput.trim()}
                  className="px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
