"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
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
  Sun,
  Moon,
} from "lucide-react";

function RequestCard({
  req, status, sc, statusLabel, hasUnread, lastConv, language, tc, onChat,
}: {
  req: any;
  status: string;
  sc: { bg: string; text: string; border: string; dot: string };
  statusLabel: string;
  hasUnread: boolean;
  lastConv: any;
  language: string;
  tc: any;
  onChat: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border-l-4 border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden ${sc.border} ${hasUnread ? 'ring-1 ring-primary/20' : ''}`}>
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
            <p className={`text-sm font-semibold truncate ${hasUnread ? 'text-gray-900' : 'text-gray-800'}`}>
              {req.propertyTitle}
            </p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${sc.bg} ${sc.text}`}>
              {statusLabel}
            </span>
            {hasUnread && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-white flex-shrink-0 animate-pulse">
                {language === 'fr' ? 'Nouveau message' : 'New message'}
              </span>
            )}
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

          {/* Last conversation preview */}
          {lastConv && (
            <div className={`rounded-xl px-3 py-2.5 mb-3 ${hasUnread ? 'bg-primary/5 border border-primary/10' : 'bg-blue-50'}`}>
              <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">
                {language === 'fr' ? 'Dernier message' : 'Last message'}
              </p>
              <p className={`text-sm leading-relaxed ${hasUnread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                {lastConv.lastMsg}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={onChat}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                hasUnread
                  ? 'bg-primary text-white hover:bg-primary-dark shadow-sm shadow-primary/20'
                  : 'bg-gray-900 text-white hover:bg-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              {hasUnread ? (language === 'fr' ? 'Répondre' : 'Reply') : (language === 'fr' ? 'Ouvrir le chat' : 'Open Chat')}
            </button>
          </div>
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

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 shadow-sm border-b ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <h1 className={`text-2xl font-bold ${isDark ? "text-primary-light" : "text-primary"}`}>{tc.dashboard}</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${isDark ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
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
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className={`p-4 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto flex flex-col border-r ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-md"}`}>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "saved" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">{tc.savedProperties}</span>
                </button>
                <button
                  onClick={() => setActiveTab("requests")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "requests" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">{tc.myRequests}</span>
                </button>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "bookings" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">{tc.myBookings}</span>
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "messages" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100"
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
              <div className={`mt-auto pt-4 border-t relative ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                <button
                  onClick={() => setProfileMenuOpen(p => !p)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group ${profileMenuOpen ? "bg-primary/10" : isDark ? "hover:bg-gray-800" : "hover:bg-primary/5"}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                    <span className="text-white font-bold text-sm">
                      {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{user?.fullName || "—"}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${profileMenuOpen ? "bg-primary text-white" : isDark ? "bg-gray-700 text-gray-400 group-hover:bg-gray-600 group-hover:text-gray-200" : "bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"}`}>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)} />
                    <div className={`absolute bottom-full left-0 right-0 mb-2 rounded-2xl shadow-xl border overflow-hidden z-20 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
                      <div className={`px-4 py-3 border-b ${isDark ? "bg-primary/10 border-primary/20" : "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/10"}`}>
                        <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                          {language === "fr" ? "Connecté en tant que" : "Signed in as"}
                        </p>
                        <p className={`text-sm font-bold truncate mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>{user?.fullName}</p>
                      </div>
                      <button
                        onClick={() => { setActiveTab("profile"); setProfileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors group/item ${isDark ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-primary/5 hover:text-primary"}`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isDark ? "bg-gray-700 group-hover/item:bg-gray-600" : "bg-gray-100 group-hover/item:bg-primary/10"}`}>
                          <User className={`w-3.5 h-3.5 transition-colors ${isDark ? "text-gray-400 group-hover/item:text-white" : "text-gray-500 group-hover/item:text-primary"}`} />
                        </div>
                        <span className="font-medium">{language === "fr" ? "Voir le profil" : "View Profile"}</span>
                      </button>
                      <button
                        onClick={() => { setProfileMenuOpen(false); logout(); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-t group/item ${isDark ? "text-red-400 hover:bg-red-500/10 border-gray-700" : "text-red-600 hover:bg-red-50 border-gray-100"}`}
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
            {/* Saved Properties */}
            {activeTab === "saved" && (
              <div className="space-y-4">
                <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>{tc.savedProperties}</h2>
                {favLoading ? (
                  <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`rounded-2xl h-72 animate-pulse ${isDark ? "bg-gray-800" : "bg-white shadow-md"}`} />
                    ))}
                  </div>
                ) : savedProperties.length > 0 ? (
                  <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedProperties.map((property: any) => (
                      <div key={property._id} className={`rounded-2xl overflow-hidden hover:shadow-lg transition-shadow border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-md"}`}>
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
                          <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                            {property.societyName || property.title}
                          </h3>
                          <div className={`flex items-center gap-2 mb-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{[property.areaName, property.location, property.state].filter(Boolean).join(", ")}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold text-primary">
                              {currencySymbol} {property.price?.toLocaleString()}
                            </span>
                            <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>/month</span>
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
                              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${isDark ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-500 text-red-500 hover:bg-red-50"}`}
                            >
                              <Trash2 className="w-4 h-4" />
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
                      const hasUnread = conversations[req._id]?.unread;
                      const lastConv = conversations[req._id];
                      return (
                        <RequestCard
                          key={req._id}
                          req={req}
                          status={status}
                          sc={sc}
                          statusLabel={statusLabelMap[status] || status}
                          hasUnread={hasUnread}
                          lastConv={lastConv}
                          language={language}
                          tc={tc}
                          onChat={() => { openChat(req); setActiveTab('messages'); }}
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

            {/* My Bookings */}
            {activeTab === "bookings" && (
              <div className="space-y-4">
                <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>{tc.myBookings}</h2>
                {myBookings.length > 0 ? (
                  <div className="space-y-4">
                    {myBookings.map((booking) => (
                      <div key={booking.id} className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-md"}`}>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{booking.pgName}</h3>
                            <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                              {tc.ownerName}: <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{booking.ownerName}</span>
                            </p>
                            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{booking.address}</p>
                          </div>
                          <span className={`self-start px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status === "Confirmed" ? tc.confirmed : booking.status === "Pending" ? tc.pending : tc.cancelled}
                          </span>
                        </div>
                        <div className={`grid sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                          <div>
                            <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tc.roomType}</p>
                            <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{booking.roomType}</p>
                          </div>
                          <div>
                            <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tc.rent}</p>
                            <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{currencySymbol} {booking.rent.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tc.moveInDate}</p>
                            <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{booking.moveInDate}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`rounded-2xl p-12 text-center border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-md"}`}>
                    <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
                    <p className={isDark ? "text-gray-500" : "text-gray-600"}>{tc.noBookings}</p>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            {activeTab === "messages" && (
              <div className="space-y-4">
                <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>{tc.messagesTab}</h2>
                {myRequests.filter((r: any) => conversations[r._id]).length === 0 ? (
                  <div className={`rounded-2xl p-12 text-center border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-md"}`}>
                    <Send className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
                    <p className={isDark ? "text-gray-500" : "text-gray-600"}>{tc.noMessages}</p>
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
                            className={`rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow border ${hasUnread ? 'border-l-4 border-primary' : ''} ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-md"}`}
                          >
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`truncate ${hasUnread ? 'font-bold' : 'font-semibold'} ${isDark ? "text-white" : "text-gray-900"}`}>{req.propertyTitle}</p>
                                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                  {new Date(conv.time).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 truncate">{conv.senderName}</p>
                              <p className={`text-sm truncate mt-0.5 ${hasUnread ? 'font-semibold' : ''} ${isDark ? "text-gray-300" : "text-gray-700"}`}>{conv.lastMsg}</p>
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
                              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isDark ? "hover:bg-red-500/10" : "hover:bg-red-50"}`}
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
                <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>{tc.profileSettings}</h2>
                
                <div className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-md"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
                    <div className="relative">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                        <User className={`w-12 h-12 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>John Doe</h3>
                      <p className={isDark ? "text-gray-400" : "text-gray-600"}>john.doe@example.com</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.fullName}</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" defaultValue="John Doe" className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-600" : "bg-white border-gray-300 text-gray-900"}`} />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.email}</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="email" defaultValue="john.doe@example.com" className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-600" : "bg-white border-gray-300 text-gray-900"}`} />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.phone}</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="tel" defaultValue="+91 99999 99999" className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-600" : "bg-white border-gray-300 text-gray-900"}`} />
                      </div>
                    </div>
                    <button className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                      {tc.saveChanges}
                    </button>
                  </div>
                </div>

                <div className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-md"}`}>
                  <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>{tc.changePassword}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.currentPassword}</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="password" className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`} />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.newPassword}</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="password" className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`} />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.confirmPassword}</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="password" className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`} />
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
          <div className={`relative rounded-2xl shadow-2xl w-full max-w-lg flex flex-col ${isDark ? "bg-gray-900" : "bg-white"}`} style={{ height: '80vh', maxHeight: '600px' }}>
            {/* Header */}
            <div className={`flex items-center gap-3 p-4 border-b flex-shrink-0 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{chatRequest.propertyTitle}</p>
                <p className="text-xs text-gray-500 truncate">{(chatRequest.owner as any)?.fullName || (language === 'fr' ? 'Propriétaire' : 'Owner')}</p>
              </div>
              <button onClick={deleteChat} className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-red-500/10" : "hover:bg-red-50"}`} title={language === 'fr' ? 'Supprimer la conversation' : 'Delete conversation'}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
              <button onClick={closeChat} className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                <X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              </button>
            </div>

            {/* TTL notice */}
            <div className={`px-4 py-2 border-b flex-shrink-0 ${isDark ? "bg-amber-500/10 border-amber-500/20" : "bg-amber-50 border-amber-100"}`}>
              <p className={`text-xs text-center ${isDark ? "text-amber-400" : "text-amber-700"}`}>
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
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-primary text-white rounded-br-sm' : isDark ? 'bg-gray-800 text-gray-100 rounded-bl-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'}`}>
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
            <div className={`p-4 border-t flex-shrink-0 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                  placeholder={language === 'fr' ? 'Écrire un message...' : 'Type a message...'}
                  className={`flex-1 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-white border-gray-300 text-gray-900"}`}
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
