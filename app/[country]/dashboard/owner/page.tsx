"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "@/components/LocalizedLink";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import ChatPanel from "@/components/ChatPanel";
import { useNotifications } from "@/hooks/useNotifications";
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
  ArrowLeft,
  Phone,
  Mail,
  X,
  ChevronDown,
  Sun,
  Moon,
  Lock,
  EyeOff,
} from "lucide-react";

function StatusDropdown({
  value,
  onChange,
  options,
  isDark = false,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  isDark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value) || options[0];

  const colorMap: Record<string, string> = {
    new: "bg-blue-100 text-blue-700 border-blue-200",
    contacted: "bg-amber-100 text-amber-700 border-amber-200",
    interested: "bg-violet-100 text-violet-700 border-violet-200",
    booked: "bg-emerald-100 text-emerald-700 border-emerald-200",
    closed: "bg-gray-100 text-gray-500 border-gray-200",
  };

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 rounded-full text-xs font-semibold border cursor-pointer select-none ${colorMap[value] || colorMap.new}`}
      >
        {selected.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className={`absolute right-0 top-full mt-1.5 rounded-xl shadow-xl border overflow-hidden z-50 min-w-[140px] ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                opt.value === value
                  ? "bg-primary text-white"
                  : isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileSection({ user, tc, language, isDark = false }: { user: any; tc: any; language: string; isDark?: boolean }) {
  const { token, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  // Track saved name to update avatar card after save
  const [savedName, setSavedName] = useState(user?.fullName || "");

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSaveProfile = async () => {
    if (!form.fullName.trim()) {
      setSaveMsg({ type: "error", text: language === "fr" ? "Le nom est requis." : "Full name is required." });
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      const isNextAuth = token === 'nextauth';
      const authToken = isNextAuth ? null : (token || localStorage.getItem("staybuddy_token"));
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        credentials: "include", // send session cookie for NextAuth users
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ fullName: form.fullName.trim(), phoneNumber: form.phoneNumber.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        // Update auth context + localStorage so changes persist everywhere
        updateUser({ fullName: data.user.fullName, phoneNumber: data.user.phoneNumber });
        setSavedName(data.user.fullName);
        setSaveMsg({ type: "success", text: language === "fr" ? "Profil mis à jour." : "Profile updated successfully." });
        setTimeout(() => setSaveMsg(null), 3000);
      } else {
        setSaveMsg({ type: "error", text: data.message || "Failed to update." });
      }
    } catch {
      setSaveMsg({ type: "error", text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.current) {
      setPwMsg({ type: "error", text: language === "fr" ? "Mot de passe actuel requis." : "Current password is required." });
      return;
    }
    if (pwForm.next.length < 6) {
      setPwMsg({ type: "error", text: language === "fr" ? "Min. 6 caractères." : "Password must be at least 6 characters." });
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: "error", text: language === "fr" ? "Les mots de passe ne correspondent pas." : "Passwords do not match." });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    try {
      const isNextAuth = token === 'nextauth';
      const authToken = isNextAuth ? null : (token || localStorage.getItem("staybuddy_token"));
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      const data = await res.json();
      if (data.success) {
        setPwMsg({ type: "success", text: language === "fr" ? "Mot de passe mis à jour." : "Password updated successfully." });
        setPwForm({ current: "", next: "", confirm: "" });
        setTimeout(() => setPwMsg(null), 3000);
      } else {
        setPwMsg({ type: "error", text: data.message || "Failed to update password." });
      }
    } catch {
      setPwMsg({ type: "error", text: "Something went wrong." });
    } finally {
      setPwSaving(false);
    }
  };

  const countryLabel = user?.country === "fr" ? "France" : user?.country === "in" ? "India" : user?.country || "—";
  const roleLabel = user?.role === "landlord" ? (language === "fr" ? "Propriétaire" : "Owner") : user?.role || "—";
  const initials = savedName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="space-y-5 max-w-2xl">
      <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.profileSettings}</h2>

      {/* Avatar + summary card */}
      <div className={`rounded-2xl p-5 flex items-center gap-4 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>
        <div className="w-14 h-14 rounded-full flex-shrink-0 shadow-md overflow-hidden">
          {user?.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.profileImage} alt={savedName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="text-white font-bold text-xl">{initials}</span>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className={`text-base font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{savedName || "—"}</p>
          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">{roleLabel}</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{countryLabel}</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${user?.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {user?.isVerified ? (language === "fr" ? "✓ Vérifié" : "✓ Verified") : (language === "fr" ? "Non vérifié" : "Unverified")}
            </span>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className={`rounded-2xl p-5 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>
        <h3 className={`text-base font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          {language === "fr" ? "Informations personnelles" : "Personal Information"}
        </h3>
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {tc.fullName} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200 focus:border-primary"
                }`}
                placeholder={language === "fr" ? "Votre nom complet" : "Your full name"}
              />
            </div>
          </div>

          {/* Email — read only */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.email}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className={`w-full pl-10 pr-4 py-3 border rounded-xl cursor-not-allowed ${
                  isDark ? "bg-gray-800/50 border-gray-700 text-gray-500" : "border-gray-200 bg-gray-50 text-gray-400"
                }`}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{language === "fr" ? "L'email ne peut pas être modifié." : "Email cannot be changed."}</p>
          </div>

          {/* Phone */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.phone}</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200 focus:border-primary"
                }`}
                placeholder={language === "fr" ? "Numéro de téléphone" : "+91 99999 99999"}
              />
            </div>
          </div>

          {saveMsg && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
              saveMsg.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {saveMsg.type === "success" ? "✓" : "✕"} {saveMsg.text}
            </div>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {language === "fr" ? "Enregistrement..." : "Saving..."}</>
            ) : tc.saveChanges}
          </button>
        </div>
      </div>

      {/* Change password — only for credentials users */}
      {user?.provider === "credentials" && (
        <div className={`rounded-2xl p-5 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>
          <h3 className={`text-base font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            {language === "fr" ? "Changer le mot de passe" : "Change Password"}
          </h3>
          <div className="space-y-4">
            {[
              { key: "current", label: language === "fr" ? "Mot de passe actuel" : "Current Password", show: showCurrent, toggle: () => setShowCurrent(p => !p) },
              { key: "next",    label: language === "fr" ? "Nouveau mot de passe" : "New Password",     show: showNext,    toggle: () => setShowNext(p => !p) },
              { key: "confirm", label: language === "fr" ? "Confirmer" : "Confirm New Password",        show: showConfirm, toggle: () => setShowConfirm(p => !p) },
            ].map(({ key, label, show, toggle }) => (
              <div key={key}>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{label}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={show ? "text" : "password"}
                    value={pwForm[key as keyof typeof pwForm]}
                    onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                    className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                      isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200 focus:border-primary"
                    }`}
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}

            {pwMsg && (
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
                pwMsg.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {pwMsg.type === "success" ? "✓" : "✕"} {pwMsg.text}
              </div>
            )}

            <button
              onClick={handleChangePassword}
              disabled={pwSaving}
              className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {pwSaving ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {language === "fr" ? "Mise à jour..." : "Updating..."}</>
              ) : (language === "fr" ? "Mettre à jour le mot de passe" : "Update Password")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OwnerDashboard() {
  const { language, t } = useLanguage();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'listings');
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("owner_theme");
    setIsDark(saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("owner_theme", next ? "dark" : "light");
  };
  const currencySymbol = t("currency.symbol");

  const [myListings, setMyListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [contactRequests, setContactRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [inquiryPage, setInquiryPage] = useState(1);
  const INQUIRIES_PER_PAGE = 6;
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingListing, setEditingListing] = useState<any | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [editImages, setEditImages] = useState<string[]>([]); // current image URLs
  const [editNewFiles, setEditNewFiles] = useState<File[]>([]); // newly picked files

  // Extra photo category state for edit form
  type PhotoCat = 'kitchen' | 'washroom' | 'commonArea';
  const [editCatImages, setEditCatImages] = useState<Record<PhotoCat, string[]>>({ kitchen: [], washroom: [], commonArea: [] });
  const [editCatNewFiles, setEditCatNewFiles] = useState<Record<PhotoCat, File[]>>({ kitchen: [], washroom: [], commonArea: [] });
  // Room images (PG: {id,name,status,image} / Tenant: {id,name,image})
  const [editRoomImages, setEditRoomImages] = useState<any[]>([]);
  const [editRoomNewFiles, setEditRoomNewFiles] = useState<File[]>([]);
  // Verification document images
  const [editVerifImages, setEditVerifImages] = useState<string[]>([]);
  const [editVerifNewFiles, setEditVerifNewFiles] = useState<File[]>([]);

  // Chat state
  const [chatRequest, setChatRequest] = useState<any | null>(null); // inquiry being chatted
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSending, setChatSending] = useState(false);
  // conversations: map requestId → last message snippet (for Messages tab)
  const [conversations, setConversations] = useState<Record<string, { lastMsg: string; time: string; unread: boolean }>>({});

  // Authentication check
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      if (user?.role !== 'landlord') {
        if (user?.role === 'renter') {
          router.push('/dashboard/tenant');
        } else if (user?.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push('/');
        }
        return;
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  // Fetch this landlord's own properties
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'landlord') return;
    const token = localStorage.getItem('staybuddy_token');
    setListingsLoading(true);
    fetch('/api/properties?mine=true&limit=50', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setMyListings(data.properties || []);
      })
      .catch(() => {})
      .finally(() => setListingsLoading(false));
  }, [isAuthenticated, user]);

  // Fetch contact requests for this owner + poll every 30s for new ones
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'landlord') return;
    const token = localStorage.getItem('staybuddy_token');

    const fetchRequests = () =>
      fetch('/api/contact-requests', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then(r => r.json())
        .then(data => { if (data.success) setContactRequests(data.requests || []); })
        .catch(() => {});

    setRequestsLoading(true);
    fetchRequests().finally(() => setRequestsLoading(false));

    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  // seenCounts: requestId → number of tenant messages already seen (persisted in localStorage)
  const [ownerSeenCounts, setOwnerSeenCounts] = useState<Record<string, number>>(() => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem('staybuddy_owner_seen') || '{}'); } catch { return {}; }
  });

  // seenInquiryIds: set of inquiry IDs the owner has already viewed (persisted in localStorage)
  const [seenInquiryIds, setSeenInquiryIds] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try { return new Set(JSON.parse(localStorage.getItem('staybuddy_owner_inquiry_seen') || '[]')); } catch { return new Set(); }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('staybuddy_owner_inquiry_seen', JSON.stringify([...seenInquiryIds]));
    }
  }, [seenInquiryIds]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('staybuddy_owner_seen', JSON.stringify(ownerSeenCounts));
    }
  }, [ownerSeenCounts]);

  // Live notifications via WebSocket — refresh conversations when a new message arrives
  const ownerToken = typeof window !== 'undefined' ? localStorage.getItem('staybuddy_token') : null;
  useNotifications({
    userId: isAuthenticated && user?.role === 'landlord' ? (user as any)?._id ?? null : null,
    token: ownerToken,
    enabled: isAuthenticated && user?.role === 'landlord',
    onNotification: ({ requestId: reqId }) => {
      // A new message arrived — refresh conversations for that request
      const token = localStorage.getItem('staybuddy_token');
      const seen: Record<string, number> = JSON.parse(localStorage.getItem('staybuddy_owner_seen') || '{}');
      fetch(`/api/messages/${reqId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then(r => r.json())
        .then(data => {
          if (!data.success || !data.messages?.length) return;
          const msgs: any[] = data.messages;
          const last = msgs[msgs.length - 1];
          const tenantMsgCount = msgs.filter((m: any) => m.senderRole === 'renter').length;
          const isOpen = chatRequest?._id === reqId;
          setConversations(prev => ({
            ...prev,
            [reqId]: {
              lastMsg: last.text,
              time: last.createdAt,
              unread: !isOpen && tenantMsgCount > (seen[reqId] ?? 0),
            },
          }));
        })
        .catch(() => {});
    },
  });

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
  if (!isAuthenticated || user?.role !== 'landlord') {
    return null;
  }

  const handleRequestAction = async (id: string, status: 'accepted' | 'rejected') => {
    const token = localStorage.getItem('staybuddy_token');
    try {
      const res = await fetch(`/api/contact-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setContactRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      }
    } catch {}
  };

  const openChat = async (req: any) => {
    setChatRequest(req);
    setChatMessages([]);
    setChatLoading(true);
    // clear unread for this conversation
    setConversations(prev => prev[req._id] ? { ...prev, [req._id]: { ...prev[req._id], unread: false } } : prev);
    const token = localStorage.getItem('staybuddy_token');
    try {
      const res = await fetch(`/api/messages/${req._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages(data.messages || []);
        const msgs = data.messages || [];
        // record how many tenant messages have been seen
        const tenantMsgCount = msgs.filter((m: any) => m.senderRole === 'renter').length;
        setOwnerSeenCounts(prev => ({ ...prev, [req._id]: tenantMsgCount }));
        if (msgs.length > 0) {
          const last = msgs[msgs.length - 1];
          setConversations(prev => ({
            ...prev,
            [req._id]: { lastMsg: last.text, time: last.createdAt, unread: false },
          }));
        }
      }
    } catch {}
    setChatLoading(false);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !chatRequest || chatSending) return;
    const token = localStorage.getItem('staybuddy_token');
    const text = chatInput.trim();
    setChatInput('');
    setChatSending(true);
    try {
      const res = await fetch(`/api/messages/${chatRequest._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages(prev => [...prev, data.message]);
        setConversations(prev => ({
          ...prev,
          [chatRequest._id]: { lastMsg: text, time: data.message.createdAt, unread: false },
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
    const token = localStorage.getItem('staybuddy_token');
    try {
      await fetch(`/api/messages/${chatRequest._id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setChatMessages([]);
      setConversations(prev => {
        const next = { ...prev };
        delete next[chatRequest._id];
        return next;
      });
      closeChat();
    } catch {}
  };



  const content = {
    en: {
      dashboard: "Owner Dashboard",
      myListings: "My Listings",
      bookingRequests: "Inquiries",
      messages: "Messages",
      noMessages: "No conversations yet",
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
      noRequests: "No inquiries yet",
      statusNew: "New",
      statusContacted: "Contacted",
      statusInterested: "Interested",
      statusBooked: "Booked",
      statusClosed: "Closed",
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
      bookingRequests: "Demandes",
      messages: "Messages",
      noMessages: "Aucune conversation",
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
      noRequests: "Aucune demande",
      statusNew: "Nouveau",
      statusContacted: "Contacté",
      statusInterested: "Intéressé",
      statusBooked: "Réservé",
      statusClosed: "Fermé",
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
    if (isDark) {
      switch (status) {
        case "new":        return "bg-blue-500/20 text-blue-400";
        case "contacted":  return "bg-amber-500/20 text-amber-400";
        case "interested": return "bg-violet-500/20 text-violet-400";
        case "booked":     return "bg-emerald-500/20 text-emerald-400";
        case "closed":     return "bg-gray-700 text-gray-400";
        default:           return "bg-gray-700 text-gray-400";
      }
    } else {
      switch (status) {
        case "new":        return "bg-blue-100 text-blue-700";
        case "contacted":  return "bg-amber-100 text-amber-700";
        case "interested": return "bg-violet-100 text-violet-700";
        case "booked":     return "bg-emerald-100 text-emerald-700";
        case "closed":     return "bg-gray-100 text-gray-500";
        default:           return "bg-gray-100 text-gray-600";
      }
    }
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      new: tc.statusNew,
      contacted: tc.statusContacted,
      interested: tc.statusInterested,
      booked: tc.statusBooked,
      closed: tc.statusClosed,
    };
    return map[status] || status;
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('staybuddy_token');
    try {
      const res = await fetch(`/api/contact-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setContactRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      }
    } catch {}
  };

  const openEdit = (listing: any) => {
    setSelectedListing(null);
    setEditError("");
    setEditForm({
      title: listing.title || "",
      propertyType: listing.propertyType || "PG",
      price: String(listing.price || ""),
      deposit: String(listing.deposit || ""),
      location: listing.location || "",
      fullAddress: listing.fullAddress || "",
      areaName: listing.areaName || "",
      state: listing.state || "",
      pincode: listing.pincode || "",
      landmark: listing.landmark || "",
      googleMapLink: listing.googleMapLink || "",
      latitude: listing.latitude || "",
      longitude: listing.longitude || "",
      rooms: String(listing.rooms || ""),
      bathrooms: String(listing.bathrooms || ""),
      area: String(listing.area || ""),
      availableFrom: listing.availableFrom || "",
      pgDescription: listing.pgDescription || "",
      // PG-specific
      pgFor: listing.pgFor || listing.preferredGender || "",
      tenantPreference: listing.tenantPreference || "",
      noticePeriod: listing.noticePeriod || "",
      gateClosingTime: listing.gateClosingTime || "",
      pgRules: listing.pgRules || [],
      services: Array.isArray(listing.services) ? listing.services : [],
      foodProvided: listing.foodProvided || false,
      meals: listing.meals || [],
      vegNonVeg: listing.vegNonVeg || "",
      foodCharges: listing.foodCharges || "",
      commonAmenities: listing.commonAmenities || [],
      parkingAvailable: listing.parkingAvailable || false,
      parkingType: listing.parkingType || "",
      operationalSince: listing.operationalSince || "",
      pgPresentIn: listing.pgPresentIn || "",
      pgName: listing.pgName || "",
      // Tenant-specific
      societyName: listing.societyName || "",
      furnishing: Array.isArray(listing.furnishing) ? listing.furnishing : [],
      floorNumber: listing.floorNumber || "",
      totalFloors: listing.totalFloors || "",
      balcony: listing.balcony || "",
      facing: listing.facing || "",
      maintenanceCharges: listing.maintenanceCharges || "",
      maintenanceType: listing.maintenanceType || "",
      securityAmount: listing.securityAmount || listing.monthlyRentAmount ? String(listing.deposit || "") : "",
      monthlyRentAmount: listing.monthlyRentAmount || String(listing.price || ""),
      additionalRooms: listing.additionalRooms || [],
      overlooking: listing.overlooking || [],
      societyAmenities: listing.societyAmenities || [],
      tenantsPrefer: listing.tenantsPrefer || [],
      localityDescription: listing.localityDescription || "",
      nearbyPlaces: listing.nearbyPlaces || [],
      nearbyPlaceInput: "",
      nearbyDistanceInput: "",
      uspCategory: listing.uspCategory || "",
      uspText: listing.uspText || "",
      roomDetails: listing.roomDetails ? JSON.parse(JSON.stringify(listing.roomDetails)) : {},
    });
    setEditImages(listing.images || []);
    setEditNewFiles([]);
    setEditCatImages({
      kitchen: listing.propertyType === 'PG' ? (listing.kitchenImages || []) : (listing.tenantKitchenImages || []),
      washroom: listing.propertyType === 'PG' ? (listing.washroomImages || []) : (listing.tenantWashroomImages || []),
      commonArea: listing.propertyType === 'PG' ? (listing.commonAreaImages || []) : (listing.tenantCommonAreaImages || []),
    });
    setEditCatNewFiles({ kitchen: [], washroom: [], commonArea: [] });
    setEditRoomImages(listing.propertyType === 'PG' ? (listing.roomImages || []) : (listing.tenantRoomImages || []));
    setEditRoomNewFiles([]);
    setEditVerifImages(listing.verificationImages || []);
    setEditVerifNewFiles([]);
    setEditingListing(listing);
  };

  const closeEdit = () => {
    setEditingListing(null);
    setEditError("");
    setEditImages([]);
    setEditNewFiles([]);
    setEditCatImages({ kitchen: [], washroom: [], commonArea: [] });
    setEditCatNewFiles({ kitchen: [], washroom: [], commonArea: [] });
    setEditRoomImages([]);
    setEditRoomNewFiles([]);
    setEditVerifImages([]);
    setEditVerifNewFiles([]);
  };

  const saveEdit = async () => {
    if (!editingListing) return;
    setEditSaving(true);
    setEditError("");
    const token = localStorage.getItem('staybuddy_token');
    const id = editingListing._id;

    // Convert any new files to base64 and merge with kept existing URLs
    const toBase64 = (file: File): Promise<string> =>
      new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
    const newBase64 = await Promise.all(editNewFiles.map(toBase64));
    const mergedImages = [...editImages, ...newBase64];

    // Category images
    const kitchenNew = await Promise.all(editCatNewFiles.kitchen.map(toBase64));
    const washroomNew = await Promise.all(editCatNewFiles.washroom.map(toBase64));
    const commonAreaNew = await Promise.all(editCatNewFiles.commonArea.map(toBase64));

    // Room images — append new files as new room objects
    const roomNewBase64 = await Promise.all(editRoomNewFiles.map(toBase64));
    const mergedRoomImages = [
      ...editRoomImages,
      ...roomNewBase64.map((img, i) => ({ id: `new-${Date.now()}-${i}`, name: `Room ${editRoomImages.length + i + 1}`, image: img })),
    ];

    // Verification images
    const verifNewBase64 = await Promise.all(editVerifNewFiles.map(toBase64));
    const mergedVerifImages = [...editVerifImages, ...verifNewBase64];

    const isPG = editForm.propertyType === 'PG';

    const updates: Record<string, any> = {
      title: editForm.title.trim() || editingListing.title,
      price: Number(editForm.price) || editingListing.price,
      deposit: Number(editForm.deposit) || 0,
      location: editForm.location.trim() || editingListing.location,
      fullAddress: editForm.fullAddress.trim() || editingListing.fullAddress,
      areaName: editForm.areaName.trim(),
      state: editForm.state.trim(),
      pincode: editForm.pincode.trim(),
      landmark: editForm.landmark.trim(),
      rooms: Number(editForm.rooms) || editingListing.rooms,
      bathrooms: Number(editForm.bathrooms) || 0,
      area: Number(editForm.area) || 0,
      availableFrom: editForm.availableFrom.trim(),
      pgDescription: editForm.pgDescription.trim(),
      images: mergedImages,
      ...(mergedVerifImages.length > 0 ? { verificationImages: mergedVerifImages } : {}),
      ...(isPG ? {
        kitchenImages: [...editCatImages.kitchen, ...kitchenNew],
        washroomImages: [...editCatImages.washroom, ...washroomNew],
        commonAreaImages: [...editCatImages.commonArea, ...commonAreaNew],
        roomImages: mergedRoomImages,
      } : {
        tenantKitchenImages: [...editCatImages.kitchen, ...kitchenNew],
        tenantWashroomImages: [...editCatImages.washroom, ...washroomNew],
        tenantCommonAreaImages: [...editCatImages.commonArea, ...commonAreaNew],
        tenantRoomImages: mergedRoomImages,
      }),
    };

    if (editForm.propertyType === "PG") {
      if (editForm.pgFor) { updates.pgFor = editForm.pgFor; updates.preferredGender = editForm.pgFor; }
      if (editForm.tenantPreference) updates.tenantPreference = editForm.tenantPreference;
      if (editForm.noticePeriod) updates.noticePeriod = editForm.noticePeriod;
      if (editForm.gateClosingTime) updates.gateClosingTime = editForm.gateClosingTime;
      updates.pgRules = editForm.pgRules || [];
      updates.services = editForm.services || [];
      updates.foodProvided = editForm.foodProvided || false;
      updates.meals = editForm.meals || [];
      updates.vegNonVeg = editForm.vegNonVeg || "";
      updates.foodCharges = editForm.foodCharges || "";
      updates.commonAmenities = editForm.commonAmenities || [];
      updates.parkingAvailable = editForm.parkingAvailable || false;
      updates.parkingType = editForm.parkingType || "";
      if (editForm.operationalSince) updates.operationalSince = editForm.operationalSince;
      if (editForm.pgPresentIn) updates.pgPresentIn = editForm.pgPresentIn;
      if (editForm.pgName) updates.pgName = editForm.pgName;
    } else {
      if (editForm.societyName) updates.societyName = editForm.societyName.trim();
      updates.furnishing = Array.isArray(editForm.furnishing) ? editForm.furnishing : [];
      if (editForm.floorNumber) updates.floorNumber = editForm.floorNumber;
      if (editForm.totalFloors) updates.totalFloors = editForm.totalFloors;
      if (editForm.balcony) updates.balcony = editForm.balcony;
      if (editForm.facing) updates.facing = editForm.facing;
      if (editForm.maintenanceCharges) updates.maintenanceCharges = editForm.maintenanceCharges;
      if (editForm.maintenanceType) updates.maintenanceType = editForm.maintenanceType;
      if (editForm.monthlyRentAmount) updates.monthlyRentAmount = editForm.monthlyRentAmount;
      if (editForm.securityAmount) updates.securityAmount = editForm.securityAmount;
      updates.additionalRooms = editForm.additionalRooms || [];
      updates.overlooking = editForm.overlooking || [];
      updates.societyAmenities = editForm.societyAmenities || [];
      updates.tenantsPrefer = editForm.tenantsPrefer || [];
      if (editForm.localityDescription) updates.localityDescription = editForm.localityDescription;
    }
    if (editForm.latitude) updates.latitude = editForm.latitude.trim();
    if (editForm.longitude) updates.longitude = editForm.longitude.trim();
    if (editForm.propertyType === "PG" && editForm.roomDetails && Object.keys(editForm.roomDetails).length > 0) {
      updates.roomDetails = editForm.roomDetails;
    }
    if (editForm.nearbyPlaces?.length > 0) updates.nearbyPlaces = editForm.nearbyPlaces;
    if (editForm.uspCategory) updates.uspCategory = editForm.uspCategory;
    if (editForm.uspText) updates.uspText = editForm.uspText;

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setMyListings(prev => prev.map(l => l._id === id ? data.property : l));
        closeEdit();
      } else {
        setEditError(data.error || "Failed to update. Please try again.");
      }
    } catch {
      setEditError("Something went wrong. Please try again.");
    } finally {
      setEditSaving(false);
    }
  };

  const deleteListing = async (id: string) => {
    const token = localStorage.getItem('staybuddy_token');
    try {
      await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setMyListings(prev => prev.filter(l => l._id !== id));
      if (editingListing?._id === id) closeEdit();
      if (selectedListing?._id === id) setSelectedListing(null);
    } catch {}
  };

  const bumpRooms = (id: string, delta: number) => {
    setMyListings(prev =>
      prev.map(l => {
        if (l._id !== id) return l;
        return { ...l, rooms: Math.max(0, (l.rooms || 0) + delta) };
      })
    );
  };

  return (
    <div className={`h-screen overflow-hidden flex flex-col ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 shadow-sm border-b flex-shrink-0 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
        <div className="max-w-[1500px] mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <h1 className={`text-base sm:text-xl font-bold truncate ${isDark ? "text-primary-light" : "text-primary"}`}>{tc.dashboard}</h1>
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
                <button
                  onClick={() => setActiveTab("listings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "listings" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium text-sm">{tc.myListings}</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("requests");
                    setSeenInquiryIds(prev => {
                      const updated = new Set(prev);
                      contactRequests.forEach((r: any) => updated.add(r._id));
                      return updated;
                    });
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "requests" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Calendar className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{tc.bookingRequests}</span>
                  {contactRequests.filter((r: any) => !seenInquiryIds.has(r._id)).length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {contactRequests.filter((r: any) => !seenInquiryIds.has(r._id)).length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "messages" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <MessageSquare className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{tc.messages}</span>
                  {Object.values(conversations).filter(c => c.unread).length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {Object.values(conversations).filter(c => c.unread).length}
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
                    {user?.profileImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.profileImage} alt={user.fullName} referrerPolicy="no-referrer" className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}
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
          <div className="flex-1 min-w-0 overflow-y-auto pb-16 lg:pb-0">
            <div className="p-3 sm:p-5 lg:p-8">
            {/* My Listings */}
            {activeTab === "listings" && (
              <div className="space-y-6">

                {/* ── Verification document nudge ── */}
                {!listingsLoading && myListings.some(l => !l.verificationImages?.length) && (() => {
                  const missing = myListings.filter(l => !l.verificationImages?.length);
                  return (
                    <div className={`px-4 py-3.5 rounded-2xl border space-y-2.5 ${isDark ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-200"}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500 text-base leading-none">⚠</span>
                        <p className={`text-sm font-semibold ${isDark ? "text-amber-400" : "text-amber-700"}`}>
                          {language === "fr" ? "Documents de vérification manquants" : "Verification documents missing"}
                        </p>
                      </div>
                      <p className={`text-xs ${isDark ? "text-amber-500/80" : "text-amber-600"}`}>
                        {language === "fr"
                          ? "Les annonces suivantes n'ont pas de documents de vérification :"
                          : "The following listings are missing verification documents. Click a listing to upload:"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {missing.map((l: any) => (
                          <button
                            key={l._id}
                            onClick={() => openEdit(l)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${isDark ? "bg-amber-500/20 border-amber-500/30 text-amber-300 hover:bg-amber-500/30" : "bg-white border-amber-300 text-amber-700 hover:bg-amber-100"}`}
                          >
                            <span className="truncate max-w-[160px]">{l.propertyType === "PG" ? (l.pgName || l.title) : (l.societyName || l.title)}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isDark ? "bg-amber-500/30 text-amber-400" : "bg-amber-100 text-amber-600"}`}>
                              {language === "fr" ? "Modifier" : "Upload"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
                  <h2 className={`text-lg sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.myListings}</h2>
                  <div className="flex items-center gap-2">
                    {/* View Toggle */}
                    <div className={`flex items-center gap-1 rounded-lg p-1 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                          viewMode === "grid" ? isDark ? "bg-gray-700 text-primary shadow-sm" : "bg-white text-primary shadow-sm" : isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <Grid3x3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                          viewMode === "list" ? isDark ? "bg-gray-700 text-primary shadow-sm" : "bg-white text-primary shadow-sm" : isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                    <Link
                      href="/post-property"
                      className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-xs sm:text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">{tc.addNewListing}</span>
                      <span className="sm:hidden">{language === "fr" ? "Ajouter" : "Add"}</span>
                    </Link>
                  </div>
                </div>

                {listingsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className={`rounded-2xl overflow-hidden animate-pulse ${isDark ? "bg-gray-800" : "bg-white shadow-md"}`}>
                        <div className={`h-40 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                        <div className="p-4 space-y-3">
                          <div className={`h-4 rounded w-3/4 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                          <div className={`h-3 rounded w-1/2 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                          <div className={`h-5 rounded w-1/3 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : myListings.length > 0 ? (
                  <>
                    {/* Inline edit panel */}
                    {editingListing ? (
                      <div className={`rounded-2xl overflow-hidden ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white shadow-md"}`}>
                        {/* Header */}
                        <div className={`flex items-center gap-3 p-4 sm:p-6 border-b ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-gradient-to-r from-primary/5 to-transparent border-gray-100"}`}>
                          <button
                            onClick={closeEdit}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all text-sm font-medium ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500" : "border-gray-200 text-gray-600 hover:bg-white hover:border-primary/30"}`}
                          >
                            <ArrowLeft className="w-4 h-4" />
                            {language === "fr" ? "Retour" : "Back"}
                          </button>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${editingListing.propertyType === "PG" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                              {editingListing.propertyType}
                            </span>
                            <span className={`text-base font-bold truncate max-w-xs ${isDark ? "text-white" : "text-gray-900"}`}>
                              {editingListing.propertyType === "PG" ? (editingListing.pgName || editingListing.title) : (editingListing.societyName || editingListing.title)}
                            </span>
                          </div>
                          <span className="ml-auto text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {language === "fr" ? "Modifier l'annonce" : "Edit Listing"}
                          </span>
                        </div>

                        <div className="p-4 sm:p-6 space-y-6">

                          {/* ── Section: Basic Info ── */}
                          <div className={`rounded-2xl p-4 sm:p-5 space-y-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                              <span className="w-1 h-4 bg-primary rounded-full inline-block" />
                              Basic Information
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Property Title</label>
                              <input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Monthly Rent ({currencySymbol})</label>
                              <input value={editForm.price} onChange={e => setEditForm(p => ({ ...p, price: e.target.value }))}
                                inputMode="numeric"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Security Deposit ({currencySymbol})</label>
                              <input value={editForm.deposit} onChange={e => setEditForm(p => ({ ...p, deposit: e.target.value }))}
                                inputMode="numeric"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Rooms</label>
                              <input value={editForm.rooms} onChange={e => setEditForm(p => ({ ...p, rooms: e.target.value }))}
                                inputMode="numeric"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Bathrooms</label>
                              <input value={editForm.bathrooms} onChange={e => setEditForm(p => ({ ...p, bathrooms: e.target.value }))}
                                inputMode="numeric"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Area (m²)</label>
                              <input value={editForm.area} onChange={e => setEditForm(p => ({ ...p, area: e.target.value }))}
                                inputMode="numeric"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Available From</label>
                              <input value={editForm.availableFrom} onChange={e => setEditForm(p => ({ ...p, availableFrom: e.target.value }))}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            </div>
                          </div>

                          {/* ── Section: Location ── */}
                          <div className={`rounded-2xl p-4 sm:p-5 space-y-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                              <span className="w-1 h-4 bg-primary rounded-full inline-block" />
                              Location
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>City</label>
                              <input value={editForm.location} onChange={e => setEditForm(p => ({ ...p, location: e.target.value }))}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Area / Locality</label>
                              <input value={editForm.areaName} onChange={e => setEditForm(p => ({ ...p, areaName: e.target.value }))}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            <div className="sm:col-span-2">
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Full Address</label>
                              <input value={editForm.fullAddress} onChange={e => setEditForm(p => ({ ...p, fullAddress: e.target.value }))}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>State</label>
                              <input value={editForm.state} onChange={e => setEditForm(p => ({ ...p, state: e.target.value }))}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Pincode</label>
                              <input value={editForm.pincode} onChange={e => setEditForm(p => ({ ...p, pincode: e.target.value }))}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            <div className="sm:col-span-2">
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Landmark</label>
                              <input value={editForm.landmark} onChange={e => setEditForm(p => ({ ...p, landmark: e.target.value }))}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            </div>
                          </div>

                          {/* ── Type-specific sections ── */}
                          <div className={`rounded-2xl p-4 sm:p-5 space-y-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                              <span className="w-1 h-4 bg-primary rounded-full inline-block" />
                              {editForm.propertyType === "PG" ? "PG Details" : "Property Details"}
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">

                            {editForm.propertyType === "PG" && (<>
                              {/* PG Basic */}
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>PG Name</label>
                                <input value={editForm.pgName} onChange={e => setEditForm(p => ({ ...p, pgName: e.target.value }))}
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Operational Since</label>
                                <input value={editForm.operationalSince} onChange={e => setEditForm(p => ({ ...p, operationalSince: e.target.value }))}
                                  placeholder="e.g. 2018"
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>PG Present In</label>
                                <select value={editForm.pgPresentIn} onChange={e => setEditForm(p => ({ ...p, pgPresentIn: e.target.value }))}
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`}>
                                  <option value="">Select</option>
                                  <option value="An Independent Building">An Independent Building</option>
                                  <option value="An Independent Flats">An Independent Flats</option>
                                  <option value="Present In A Society">Present In A Society</option>
                                </select>
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>PG For</label>
                                <select value={editForm.pgFor} onChange={e => setEditForm(p => ({ ...p, pgFor: e.target.value }))}
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`}>
                                  <option value="">Select</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Both">Both</option>
                                </select>
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Tenant Preference</label>
                                <select value={editForm.tenantPreference} onChange={e => setEditForm(p => ({ ...p, tenantPreference: e.target.value }))}
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`}>
                                  <option value="">Select</option>
                                  <option value="Professionals">Professionals</option>
                                  <option value="Students">Students</option>
                                  <option value="Both">Both</option>
                                </select>
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Notice Period</label>
                                <select value={editForm.noticePeriod} onChange={e => setEditForm(p => ({ ...p, noticePeriod: e.target.value }))}
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`}>
                                  <option value="">Select</option>
                                  <option value="1 Week">1 Week</option>
                                  <option value="15 Days">15 Days</option>
                                  <option value="1 Month">1 Month</option>
                                  <option value="2 Month">2 Month</option>
                                  <option value="No Notice Period">No Notice Period</option>
                                </select>
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Gate Closing Time</label>
                                <input type="time" value={editForm.gateClosingTime} onChange={e => setEditForm(p => ({ ...p, gateClosingTime: e.target.value }))}
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                              </div>
                              {/* PG Rules */}
                              <div className="sm:col-span-2">
                                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>PG Rules <span className="text-xs text-gray-400 font-normal">(select what is NOT allowed)</span></label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {[
                                    ...["guardian","nonveg","gender","alcohol","smoking"].map(id => ({
                                      id,
                                      label: ({ guardian:"Guardian", nonveg:"Non-Veg Food", gender:"Opposite Gender", alcohol:"Alcohol", smoking:"Smoking" } as Record<string,string>)[id]
                                    })),
                                    ...(editForm.pgRules||[])
                                      .filter((r:string) => !["guardian","nonveg","gender","alcohol","smoking"].includes(r))
                                      .map((r:string) => ({ id: r, label: r }))
                                  ].map(rule => {
                                    const active = (editForm.pgRules||[]).includes(rule.id);
                                    return (
                                      <button key={rule.id} type="button" onClick={() => setEditForm(p => ({ ...p, pgRules: active ? p.pgRules.filter((r:string)=>r!==rule.id) : [...(p.pgRules||[]), rule.id] }))}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${active ? "bg-primary text-white border-primary shadow-sm" : isDark ? "border-gray-600 text-gray-300 bg-gray-700 hover:border-primary/50" : "border-gray-200 text-gray-600 bg-white hover:border-primary/50"}`}>
                                        {rule.label}
                                      </button>
                                    );
                                  })}
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Add custom rule..."
                                    className={`flex-1 px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`}
                                    onKeyDown={e => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        const val = (e.target as HTMLInputElement).value.trim();
                                        if (val && !(editForm.pgRules||[]).includes(val)) setEditForm(p => ({ ...p, pgRules: [...(p.pgRules||[]), val] }));
                                        (e.target as HTMLInputElement).value = "";
                                      }
                                    }}
                                  />
                                  <button type="button"
                                    className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
                                    onClick={e => {
                                      const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                      const val = input.value.trim();
                                      if (val && !(editForm.pgRules||[]).includes(val)) setEditForm(p => ({ ...p, pgRules: [...(p.pgRules||[]), val] }));
                                      input.value = "";
                                    }}>
                                    Add
                                  </button>
                                </div>
                              </div>
                              {/* Services */}
                              <div className="sm:col-span-2">
                                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Services</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {[
                                    ...["laundry","cleaning","warden"].map(id => ({
                                      id,
                                      label: ({ laundry:"Laundry", cleaning:"Room Cleaning", warden:"Warden" } as Record<string,string>)[id]
                                    })),
                                    ...(editForm.services||[])
                                      .filter((s:string) => !["laundry","cleaning","warden"].includes(s))
                                      .map((s:string) => ({ id: s, label: s }))
                                  ].map(svc => {
                                    const active = (editForm.services||[]).includes(svc.id);
                                    return (
                                      <button key={svc.id} type="button" onClick={() => setEditForm(p => ({ ...p, services: active ? p.services.filter((x:string)=>x!==svc.id) : [...(p.services||[]), svc.id] }))}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${active ? "bg-primary text-white border-primary shadow-sm" : isDark ? "border-gray-600 text-gray-300 bg-gray-700 hover:border-primary/50" : "border-gray-200 text-gray-600 bg-white hover:border-primary/50"}`}>
                                        {svc.label}
                                      </button>
                                    );
                                  })}
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Add custom service..."
                                    className={`flex-1 px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`}
                                    onKeyDown={e => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        const val = (e.target as HTMLInputElement).value.trim();
                                        if (val && !(editForm.services||[]).includes(val)) setEditForm(p => ({ ...p, services: [...(p.services||[]), val] }));
                                        (e.target as HTMLInputElement).value = "";
                                      }
                                    }}
                                  />
                                  <button type="button"
                                    className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
                                    onClick={e => {
                                      const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                      const val = input.value.trim();
                                      if (val && !(editForm.services||[]).includes(val)) setEditForm(p => ({ ...p, services: [...(p.services||[]), val] }));
                                      input.value = "";
                                    }}>
                                    Add
                                  </button>
                                </div>
                              </div>
                              {/* Food */}
                              <div className="sm:col-span-2">
                                <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 transition-all w-fit ${editForm.foodProvided ? "border-primary bg-primary/5" : isDark ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-white"}`}>
                                  <input type="checkbox" checked={editForm.foodProvided||false} onChange={e => setEditForm(p => ({ ...p, foodProvided: e.target.checked }))}
                                    className="w-4 h-4 text-primary rounded accent-primary" />
                                  <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Food Provided</span>
                                </label>
                                {editForm.foodProvided && (
                                  <div className={`mt-3 p-4 border rounded-xl space-y-3 ${isDark ? "bg-orange-900/20 border-orange-800/30" : "bg-orange-50 border-orange-100"}`}>
                                    <div>
                                      <label className={`block text-xs font-semibold mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Meals</label>
                                      <div className="flex flex-wrap gap-2">
                                        {["Breakfast","Lunch","Dinner"].map(m => {
                                          const active = (editForm.meals||[]).includes(m);
                                          return (
                                            <button key={m} type="button" onClick={() => setEditForm(p => ({ ...p, meals: active ? p.meals.filter((x:string)=>x!==m) : [...(p.meals||[]), m] }))}
                                              className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${active ? "bg-primary text-white border-primary" : isDark ? "border-gray-600 text-gray-300 bg-gray-700 hover:border-primary/50" : "border-gray-200 text-gray-600 bg-white hover:border-primary/50"}`}>
                                              {m}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                    <div>
                                      <label className={`block text-xs font-semibold mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Veg / Non-Veg</label>
                                      <div className="flex gap-2">
                                        {["Veg","Veg & Non Veg"].map(opt => (
                                          <button key={opt} type="button" onClick={() => setEditForm(p => ({ ...p, vegNonVeg: opt }))}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${editForm.vegNonVeg===opt ? "bg-primary text-white border-primary" : isDark ? "border-gray-600 text-gray-300 bg-gray-700 hover:border-primary/50" : "border-gray-200 text-gray-600 bg-white hover:border-primary/50"}`}>
                                            {opt}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <label className={`block text-xs font-semibold mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Food Charges</label>
                                      <select value={editForm.foodCharges||""} onChange={e => setEditForm(p => ({ ...p, foodCharges: e.target.value }))}
                                        className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`}>
                                        <option value="">Select</option>
                                        <option value="Included in rent">Included in rent</option>
                                        <option value="Per meal Basis">Per meal Basis</option>
                                        <option value="Fixed monthly Amount">Fixed monthly Amount</option>
                                      </select>
                                    </div>
                                  </div>
                                )}
                              </div>
                              {/* Common Amenities */}
                              <div className="sm:col-span-2">
                                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Common Amenities</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {[
                                    ...["fridge","kitchen","water","wifi","tv","powerbackup","cctv","gym"].map(id => ({
                                      id,
                                      label: ({ fridge:"Fridge", kitchen:"Kitchen", water:"RO Water", wifi:"Wi-Fi", tv:"TV", powerbackup:"Power Backup", cctv:"CCTV", gym:"Gymnasium" } as Record<string,string>)[id]
                                    })),
                                    ...(editForm.commonAmenities||[])
                                      .filter((a:string) => !["fridge","kitchen","water","wifi","tv","powerbackup","cctv","gym"].includes(a))
                                      .map((a:string) => ({ id: a, label: a }))
                                  ].map(amenity => {
                                    const active = (editForm.commonAmenities||[]).includes(amenity.id);
                                    return (
                                      <button key={amenity.id} type="button" onClick={() => setEditForm(p => ({ ...p, commonAmenities: active ? p.commonAmenities.filter((x:string)=>x!==amenity.id) : [...(p.commonAmenities||[]), amenity.id] }))}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${active ? "bg-primary text-white border-primary shadow-sm" : isDark ? "border-gray-600 text-gray-300 bg-gray-700 hover:border-primary/50" : "border-gray-200 text-gray-600 bg-white hover:border-primary/50"}`}>
                                        {amenity.label}
                                      </button>
                                    );
                                  })}
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Add custom amenity..."
                                    className={`flex-1 px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`}
                                    onKeyDown={e => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        const val = (e.target as HTMLInputElement).value.trim();
                                        if (val && !(editForm.commonAmenities||[]).includes(val)) setEditForm(p => ({ ...p, commonAmenities: [...(p.commonAmenities||[]), val] }));
                                        (e.target as HTMLInputElement).value = "";
                                      }
                                    }}
                                  />
                                  <button type="button"
                                    className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
                                    onClick={e => {
                                      const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                      const val = input.value.trim();
                                      if (val && !(editForm.commonAmenities||[]).includes(val)) setEditForm(p => ({ ...p, commonAmenities: [...(p.commonAmenities||[]), val] }));
                                      input.value = "";
                                    }}>
                                    Add
                                  </button>
                                </div>
                              </div>
                              {/* Parking */}
                              <div className="sm:col-span-2">
                                <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 transition-all w-fit ${editForm.parkingAvailable ? "border-primary bg-primary/5" : isDark ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-white"}`}>
                                  <input type="checkbox" checked={editForm.parkingAvailable||false} onChange={e => setEditForm(p => ({ ...p, parkingAvailable: e.target.checked }))}
                                    className="w-4 h-4 text-primary rounded accent-primary" />
                                  <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Parking Available</span>
                                </label>
                                {editForm.parkingAvailable && (
                                  <div className="flex gap-2 mt-3">
                                    {["2-Wheeler","Car Parking"].map(opt => (
                                      <button key={opt} type="button" onClick={() => setEditForm(p => ({ ...p, parkingType: opt }))}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${editForm.parkingType===opt ? "bg-primary text-white border-primary" : isDark ? "border-gray-600 text-gray-300 bg-gray-700 hover:border-primary/50" : "border-gray-200 text-gray-600 bg-white hover:border-primary/50"}`}>
                                        {opt}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {/* Room Details (Bed Availability) */}
                              {editForm.roomDetails && Object.keys(editForm.roomDetails).length > 0 && (
                                <div className="sm:col-span-2 space-y-3">
                                  <label className={`block text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Room / Bed Details</label>
                                  {Object.entries(editForm.roomDetails).map(([category, detail]: [string, any]) => (
                                    <div key={category} className={`border-2 rounded-xl p-4 space-y-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
                                      <p className="text-sm font-semibold text-primary">{category} Bed</p>
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div>
                                          <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Total Beds</label>
                                          <input
                                            type="number" min="0"
                                            value={detail.totalBeds ?? detail.totalRooms ?? ""}
                                            onChange={e => setEditForm((p: any) => ({
                                              ...p,
                                              roomDetails: { ...p.roomDetails, [category]: { ...p.roomDetails[category], totalBeds: e.target.value } }
                                            }))}
                                            className={`w-full px-3 py-2 border-2 rounded-xl text-sm focus:outline-none focus:border-primary ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"}`}
                                          />
                                        </div>
                                        <div>
                                          <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Available Beds</label>
                                          <input
                                            type="number" min="0"
                                            value={detail.availableBeds ?? detail.availableRooms ?? ""}
                                            onChange={e => setEditForm((p: any) => ({
                                              ...p,
                                              roomDetails: { ...p.roomDetails, [category]: { ...p.roomDetails[category], availableBeds: e.target.value } }
                                            }))}
                                            className={`w-full px-3 py-2 border-2 rounded-xl text-sm focus:outline-none focus:border-primary ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"}`}
                                          />
                                        </div>
                                        <div>
                                          <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Monthly Rent ({currencySymbol})</label>
                                          <input
                                            type="number" min="0"
                                            value={detail.monthlyRent ?? ""}
                                            onChange={e => setEditForm((p: any) => ({
                                              ...p,
                                              roomDetails: { ...p.roomDetails, [category]: { ...p.roomDetails[category], monthlyRent: e.target.value } }
                                            }))}
                                            className={`w-full px-3 py-2 border-2 rounded-xl text-sm focus:outline-none focus:border-primary ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"}`}
                                          />
                                        </div>
                                        <div>
                                          <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Security Deposit ({currencySymbol})</label>
                                          <input
                                            type="number" min="0"
                                            value={detail.securityDeposit ?? ""}
                                            onChange={e => setEditForm((p: any) => ({
                                              ...p,
                                              roomDetails: { ...p.roomDetails, [category]: { ...p.roomDetails[category], securityDeposit: e.target.value } }
                                            }))}
                                            className={`w-full px-3 py-2 border-2 rounded-xl text-sm focus:outline-none focus:border-primary ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"}`}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>)}

                            {editForm.propertyType === "Tenant" && (<>
                              <div className="sm:col-span-2">
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Society Name</label>
                                <input value={editForm.societyName} onChange={e => setEditForm(p => ({ ...p, societyName: e.target.value }))}
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Monthly Rent ({currencySymbol})</label>
                                <input value={editForm.monthlyRentAmount} onChange={e => setEditForm(p => ({ ...p, monthlyRentAmount: e.target.value }))}
                                  inputMode="numeric"
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Security Amount ({currencySymbol})</label>
                                <input value={editForm.securityAmount} onChange={e => setEditForm(p => ({ ...p, securityAmount: e.target.value }))}
                                  inputMode="numeric"
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Maintenance Charges ({currencySymbol})</label>
                                <input value={editForm.maintenanceCharges} onChange={e => setEditForm(p => ({ ...p, maintenanceCharges: e.target.value }))}
                                  inputMode="numeric"
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Maintenance Type</label>
                                <select value={editForm.maintenanceType} onChange={e => setEditForm(p => ({ ...p, maintenanceType: e.target.value }))}
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`}>
                                  <option value="">Select</option>
                                  <option value="Monthly">Monthly</option>
                                  <option value="Yearly">Yearly</option>
                                </select>
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Balcony</label>
                                <select value={editForm.balcony} onChange={e => setEditForm(p => ({ ...p, balcony: e.target.value }))}
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`}>
                                  <option value="">Select</option>
                                  {["All","1+","2+","3+","4+"].map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Facing</label>
                                <select value={editForm.facing} onChange={e => setEditForm(p => ({ ...p, facing: e.target.value }))}
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`}>
                                  <option value="">Select</option>
                                  {["East","West","North","South","North-East","North-West","South-East","South-West"].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Floor No.</label>
                                <input value={editForm.floorNumber} onChange={e => setEditForm(p => ({ ...p, floorNumber: e.target.value }))}
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Total Floors</label>
                                <input value={editForm.totalFloors} onChange={e => setEditForm(p => ({ ...p, totalFloors: e.target.value }))}
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                              </div>
                              {/* Furnishing toggle */}
                              <div className="sm:col-span-2">
                                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Furnishing</label>
                                <div className="flex flex-wrap gap-2">
                                  {["Unfurnished","Semi-Furnished","Fully-Furnished"].map(opt => {
                                    const active = (editForm.furnishing||[]).includes(opt);
                                    return (
                                      <button key={opt} type="button" onClick={() => setEditForm(p => ({ ...p, furnishing: active ? p.furnishing.filter((x:string)=>x!==opt) : [...(p.furnishing||[]), opt] }))}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${active ? "bg-primary text-white border-primary shadow-sm" : isDark ? "border-gray-600 text-gray-300 bg-gray-700 hover:border-primary/50" : "border-gray-200 text-gray-600 bg-white hover:border-primary/50"}`}>
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              {/* Additional Rooms */}
                              <div className="sm:col-span-2">
                                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Additional Rooms</label>
                                <div className="flex flex-wrap gap-2">
                                  {[{id:"poojaRoom",label:"Pooja Room"},{id:"servantRoom",label:"Servant Room"},{id:"store",label:"Store"},{id:"study",label:"Study"}].map(r => {
                                    const active = (editForm.additionalRooms||[]).includes(r.id);
                                    return (
                                      <button key={r.id} type="button" onClick={() => setEditForm(p => ({ ...p, additionalRooms: active ? p.additionalRooms.filter((x:string)=>x!==r.id) : [...(p.additionalRooms||[]), r.id] }))}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${active ? "bg-primary text-white border-primary shadow-sm" : isDark ? "border-gray-600 text-gray-300 bg-gray-700 hover:border-primary/50" : "border-gray-200 text-gray-600 bg-white hover:border-primary/50"}`}>
                                        {r.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              {/* Overlooking */}
                              <div className="sm:col-span-2">
                                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Overlooking</label>
                                <div className="flex flex-wrap gap-2">
                                  {[{id:"gardenPark",label:"Garden/Park"},{id:"mainRoad",label:"Main Road"},{id:"pool",label:"Pool"}].map(item => {
                                    const active = (editForm.overlooking||[]).includes(item.id);
                                    return (
                                      <button key={item.id} type="button" onClick={() => setEditForm(p => ({ ...p, overlooking: active ? p.overlooking.filter((x:string)=>x!==item.id) : [...(p.overlooking||[]), item.id] }))}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${active ? "bg-primary text-white border-primary shadow-sm" : isDark ? "border-gray-600 text-gray-300 bg-gray-700 hover:border-primary/50" : "border-gray-200 text-gray-600 bg-white hover:border-primary/50"}`}>
                                        {item.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              {/* Society Amenities */}
                              <div className="sm:col-span-2">
                                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Society Amenities</label>
                                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                                  {["Maintenance Staff","Air Conditioned","Park","Piped Gas","Power Back Up","Club House","Gymnasium","Intercom Facility","Internet/Wi-Fi Connectivity","Jogging and Strolling Track","Lift","Reserved Parking","Security","Swimming Pool","Waste Disposal"].map(a => {
                                    const active = (editForm.societyAmenities||[]).includes(a);
                                    return (
                                      <button key={a} type="button" onClick={() => setEditForm(p => ({ ...p, societyAmenities: active ? p.societyAmenities.filter((x:string)=>x!==a) : [...(p.societyAmenities||[]), a] }))}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${active ? "bg-primary text-white border-primary shadow-sm" : isDark ? "border-gray-600 text-gray-300 bg-gray-700 hover:border-primary/50" : "border-gray-200 text-gray-600 bg-white hover:border-primary/50"}`}>
                                        {a}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              {/* Tenants Prefer */}
                              <div className="sm:col-span-2">
                                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Tenants You Prefer</label>
                                <div className="flex flex-wrap gap-2">
                                  {[{id:"coupleFamily",label:"Couple/Family"},{id:"vegetarians",label:"Vegetarians"},{id:"withCompanyLease",label:"With Company Lease"},{id:"withoutPets",label:"Without Pets"}].map(t => {
                                    const active = (editForm.tenantsPrefer||[]).includes(t.id);
                                    return (
                                      <button key={t.id} type="button" onClick={() => setEditForm(p => ({ ...p, tenantsPrefer: active ? p.tenantsPrefer.filter((x:string)=>x!==t.id) : [...(p.tenantsPrefer||[]), t.id] }))}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${active ? "bg-primary text-white border-primary shadow-sm" : isDark ? "border-gray-600 text-gray-300 bg-gray-700 hover:border-primary/50" : "border-gray-200 text-gray-600 bg-white hover:border-primary/50"}`}>
                                        {t.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              {/* Locality Description */}
                              <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Locality Description</label>
                                <textarea value={editForm.localityDescription} onChange={e => setEditForm(p => ({ ...p, localityDescription: e.target.value }))}
                                  rows={3} placeholder="Describe the locality..."
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                              </div>
                            </>)}

                            </div>
                          </div>

                          {/* ── Section: Description & USP ── */}
                          <div className={`rounded-2xl p-4 sm:p-5 space-y-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                              <span className="w-1 h-4 bg-primary rounded-full inline-block" />
                              Description & Highlights
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Description</label>
                              <textarea value={editForm.pgDescription} onChange={e => setEditForm(p => ({ ...p, pgDescription: e.target.value }))}
                                rows={3}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>

                            {/* Coordinates */}
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Latitude</label>
                              <input value={editForm.latitude||""} onChange={e => setEditForm(p => ({ ...p, latitude: e.target.value }))}
                                placeholder="e.g. 23.0225"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Longitude</label>
                              <input value={editForm.longitude||""} onChange={e => setEditForm(p => ({ ...p, longitude: e.target.value }))}
                                placeholder="e.g. 72.5714"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            {editForm.latitude && editForm.longitude && !isNaN(parseFloat(editForm.latitude)) && !isNaN(parseFloat(editForm.longitude)) && (
                              <div className={`sm:col-span-2 rounded-xl overflow-hidden border h-44 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                                <iframe
                                  src={`https://maps.google.com/maps?q=${encodeURIComponent(editForm.latitude)},${encodeURIComponent(editForm.longitude)}&z=15&output=embed`}
                                  width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                                />
                              </div>
                            )}

                            {/* Nearby Places */}
                            <div className="sm:col-span-2">
                              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Nearby Places</label>
                              {(editForm.nearbyPlaces||[]).length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {(editForm.nearbyPlaces||[]).map((place: {name:string;distance:string}, i: number) => (
                                    <span key={i} className="flex items-center gap-1.5 pl-3 pr-1 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
                                      <MapPin className="w-3 h-3 flex-shrink-0" />
                                      {place.name}
                                      {place.distance && <span className="text-primary/60">· {place.distance}</span>}
                                      <button type="button" onClick={() => setEditForm(p => ({ ...p, nearbyPlaces: p.nearbyPlaces.filter((_:any, idx:number) => idx !== i) }))}
                                        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-primary/20 text-primary ml-0.5 text-base leading-none">×</button>
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="flex gap-2">
                                <input value={editForm.nearbyPlaceInput||""} onChange={e => setEditForm(p => ({ ...p, nearbyPlaceInput: e.target.value }))}
                                  placeholder="Place name"
                                  className={`flex-1 px-4 py-3 border-2 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                                <input value={editForm.nearbyDistanceInput||""} onChange={e => setEditForm(p => ({ ...p, nearbyDistanceInput: e.target.value }))}
                                  placeholder="Distance"
                                  className={`w-28 px-4 py-3 border-2 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                                <button type="button"
                                  onClick={() => {
                                    const name = (editForm.nearbyPlaceInput||"").trim();
                                    if (!name) return;
                                    setEditForm(p => ({ ...p, nearbyPlaces: [...(p.nearbyPlaces||[]), { name, distance: p.nearbyDistanceInput||"" }], nearbyPlaceInput: "", nearbyDistanceInput: "" }));
                                  }}
                                  className="px-4 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">
                                  Add
                                </button>
                              </div>
                            </div>

                            {/* USP */}
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>USP Category</label>
                              <input value={editForm.uspCategory||""} onChange={e => setEditForm(p => ({ ...p, uspCategory: e.target.value }))}
                                placeholder="e.g. location, price"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>USP Text</label>
                              <input value={editForm.uspText||""} onChange={e => setEditForm(p => ({ ...p, uspText: e.target.value }))}
                                placeholder="Unique selling point..."
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                            </div>
                            </div>
                          </div>

                          {/* ── Section: Photos ── */}
                          <div className={`rounded-2xl p-4 sm:p-5 space-y-5 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                              <span className="w-1 h-4 bg-primary rounded-full inline-block" />
                              Photos
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-5">

                            {/* Room Photos */}
                            <div className="sm:col-span-2">
                              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Room Photos</label>
                              {editRoomImages.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editRoomImages.map((room: any, i: number) => room.image && (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                                      <Image src={room.image} alt={room.name || `room ${i+1}`} fill className="object-cover" />
                                      <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5 truncate">{room.name}</p>
                                      <button type="button"
                                        onClick={() => setEditRoomImages(prev => prev.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {editRoomNewFiles.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editRoomNewFiles.map((file, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/40 group">
                                      <Image src={URL.createObjectURL(file)} alt={`new room ${i+1}`} fill className="object-cover" />
                                      <button type="button"
                                        onClick={() => setEditRoomNewFiles(prev => prev.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <label className={`flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary transition-colors text-sm ${isDark ? "border-gray-600 text-gray-400 bg-gray-900" : "border-gray-300 text-gray-500 bg-white"}`}>
                                <Plus className="w-4 h-4 text-primary" /> Add room photos
                                <input type="file" accept="image/*" multiple className="hidden"
                                  onChange={e => { setEditRoomNewFiles(prev => [...prev, ...Array.from(e.target.files||[])]); e.target.value=""; }} />
                              </label>
                            </div>

                            {/* Kitchen Photos */}
                            <div className="sm:col-span-2">
                              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Kitchen Photos</label>
                              {editCatImages.kitchen.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editCatImages.kitchen.map((url, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                                      <Image src={url} alt={`kitchen ${i+1}`} fill className="object-cover" />
                                      <button type="button"
                                        onClick={() => setEditCatImages(p => ({ ...p, kitchen: p.kitchen.filter((_,idx)=>idx!==i) }))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {editCatNewFiles.kitchen.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editCatNewFiles.kitchen.map((file, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/40 group">
                                      <Image src={URL.createObjectURL(file)} alt={`new kitchen ${i+1}`} fill className="object-cover" />
                                      <button type="button"
                                        onClick={() => setEditCatNewFiles(p => ({ ...p, kitchen: p.kitchen.filter((_,idx)=>idx!==i) }))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <label className={`flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary transition-colors text-sm ${isDark ? "border-gray-600 text-gray-400 bg-gray-900" : "border-gray-300 text-gray-500 bg-white"}`}>
                                <Plus className="w-4 h-4 text-primary" /> Add kitchen photos
                                <input type="file" accept="image/*" multiple className="hidden"
                                  onChange={e => { setEditCatNewFiles(p => ({ ...p, kitchen: [...p.kitchen, ...Array.from(e.target.files||[])] })); e.target.value=""; }} />
                              </label>
                            </div>

                            {/* Washroom Photos */}
                            <div className="sm:col-span-2">
                              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Washroom Photos</label>
                              {editCatImages.washroom.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editCatImages.washroom.map((url, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                                      <Image src={url} alt={`washroom ${i+1}`} fill className="object-cover" />
                                      <button type="button"
                                        onClick={() => setEditCatImages(p => ({ ...p, washroom: p.washroom.filter((_,idx)=>idx!==i) }))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {editCatNewFiles.washroom.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editCatNewFiles.washroom.map((file, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/40 group">
                                      <Image src={URL.createObjectURL(file)} alt={`new washroom ${i+1}`} fill className="object-cover" />
                                      <button type="button"
                                        onClick={() => setEditCatNewFiles(p => ({ ...p, washroom: p.washroom.filter((_,idx)=>idx!==i) }))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <label className={`flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary transition-colors text-sm ${isDark ? "border-gray-600 text-gray-400 bg-gray-900" : "border-gray-300 text-gray-500 bg-white"}`}>
                                <Plus className="w-4 h-4 text-primary" /> Add washroom photos
                                <input type="file" accept="image/*" multiple className="hidden"
                                  onChange={e => { setEditCatNewFiles(p => ({ ...p, washroom: [...p.washroom, ...Array.from(e.target.files||[])] })); e.target.value=""; }} />
                              </label>
                            </div>

                            {/* Common Area Photos */}
                            <div className="sm:col-span-2">
                              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Common Area Photos</label>
                              {editCatImages.commonArea.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editCatImages.commonArea.map((url, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                                      <Image src={url} alt={`common ${i+1}`} fill className="object-cover" />
                                      <button type="button"
                                        onClick={() => setEditCatImages(p => ({ ...p, commonArea: p.commonArea.filter((_,idx)=>idx!==i) }))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {editCatNewFiles.commonArea.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                  {editCatNewFiles.commonArea.map((file, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/40 group">
                                      <Image src={URL.createObjectURL(file)} alt={`new common ${i+1}`} fill className="object-cover" />
                                      <button type="button"
                                        onClick={() => setEditCatNewFiles(p => ({ ...p, commonArea: p.commonArea.filter((_,idx)=>idx!==i) }))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <label className={`flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary transition-colors text-sm ${isDark ? "border-gray-600 text-gray-400 bg-gray-900" : "border-gray-300 text-gray-500 bg-white"}`}>
                                <Plus className="w-4 h-4 text-primary" /> Add common area photos
                                <input type="file" accept="image/*" multiple className="hidden"
                                  onChange={e => { setEditCatNewFiles(p => ({ ...p, commonArea: [...p.commonArea, ...Array.from(e.target.files||[])] })); e.target.value=""; }} />
                              </label>
                            </div>

                            </div>
                          </div>

                          {/* ── Section: Verification Documents ── */}
                          {editVerifImages.length === 0 ? (
                            <div className={`rounded-2xl p-4 sm:p-5 space-y-4 border-2 border-dashed ${isDark ? "bg-gray-800 border-amber-500/30" : "bg-amber-50 border-amber-300"}`}>
                              <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wide flex items-center gap-2">
                                <span className="w-1 h-4 bg-amber-500 rounded-full inline-block" />
                                Verification Documents
                                <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700"}`}>
                                  Not uploaded
                                </span>
                              </h3>
                              <p className={`text-xs leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                Upload ownership proof, rent agreement, or any document that verifies this property. This helps get your listing verified faster.
                              </p>

                              {editVerifNewFiles.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                  {editVerifNewFiles.map((file, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-amber-300 group">
                                      <Image src={URL.createObjectURL(file)} alt={`doc ${i + 1}`} fill className="object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => setEditVerifNewFiles(p => p.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                      >×</button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <label className={`flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer hover:border-amber-400 transition-colors text-sm ${isDark ? "border-amber-500/30 text-amber-400 bg-gray-900" : "border-amber-300 text-amber-600 bg-white"}`}>
                                <Plus className="w-4 h-4" />
                                {editVerifNewFiles.length > 0 ? `${editVerifNewFiles.length} file(s) selected — add more` : "Upload verification documents"}
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  multiple
                                  className="hidden"
                                  onChange={e => {
                                    setEditVerifNewFiles(p => [...p, ...Array.from(e.target.files || [])]);
                                    e.target.value = "";
                                  }}
                                />
                              </label>
                            </div>
                          ) : (
                            <div className={`rounded-2xl p-4 sm:p-5 flex items-center gap-3 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-green-50 border-green-200"}`}>
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>
                                ✓ Verification documents already uploaded
                              </span>
                            </div>
                          )}

                          {editError && (
                            <div className={`flex items-center gap-2 px-4 py-3 border rounded-xl text-sm text-red-600 ${isDark ? "bg-red-900/20 border-red-800/30" : "bg-red-50 border-red-200"}`}>
                              <span className="font-medium">Error:</span> {editError}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-3 pt-2">
                            <button onClick={() => setDeleteConfirmId(editingListing._id)}
                              className="flex items-center gap-2 px-4 py-2.5 border-2 border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium">
                              <Trash2 className="w-4 h-4" /> {tc.delete}
                            </button>
                            <button onClick={closeEdit}
                              className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium ml-auto">
                              Cancel
                            </button>
                            <button onClick={saveEdit} disabled={editSaving}
                              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors text-sm font-semibold disabled:opacity-60 shadow-sm">
                              {editSaving ? "Saving..." : "Update Listing"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : selectedListing ? (
                      <div className={`rounded-2xl shadow-md overflow-hidden ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white"}`}>
                        {/* Header */}
                        <div className={`flex items-center justify-between gap-3 p-4 sm:p-6 border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}>
                          <button
                            onClick={() => setSelectedListing(null)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold border transition-colors text-sm ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-600 text-gray-700 hover:bg-gray-50"}`}
                          >
                            <ArrowLeft className="w-4 h-4" />
                            {language === "fr" ? "Retour aux annonces" : "Back to listings"}
                          </button>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedListing.propertyType === "PG" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                            {selectedListing.propertyType}
                          </span>
                        </div>

                        {/* Image */}
                        {selectedListing.images?.[0] && (
                          <div className="relative h-56 sm:h-72">
                            <Image src={selectedListing.images[0]} alt={selectedListing.title} fill className="object-cover" />
                          </div>
                        )}

                        <div className="p-4 sm:p-6 space-y-6">
                          {/* Title & location */}
                          <div>
                            <h2 className={`text-xl sm:text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                              {selectedListing.propertyType === "Tenant" && selectedListing.societyName ? selectedListing.societyName : selectedListing.title}
                            </h2>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              {[selectedListing.fullAddress, selectedListing.areaName, selectedListing.state].filter(Boolean).join(", ")}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-2xl font-bold text-primary">{currencySymbol} {selectedListing.price?.toLocaleString()}</span>
                            <span className="text-gray-500 text-sm">/month</span>
                            {selectedListing.deposit > 0 && (
                              <span className="text-sm text-gray-500">· Deposit: {currencySymbol} {selectedListing.deposit?.toLocaleString()}</span>
                            )}
                          </div>

                          {/* Key details grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                              { label: "Category", value: selectedListing.category },
                              { label: "Rooms", value: selectedListing.rooms },
                              { label: "Bathrooms", value: selectedListing.bathrooms },
                              { label: "Area", value: selectedListing.area ? `${selectedListing.area} m²` : null },
                              { label: "Available From", value: selectedListing.availableFrom },
                              { label: "Rental Period", value: selectedListing.rentalPeriod },
                              ...(selectedListing.propertyType === "PG" ? [
                                { label: "PG For", value: selectedListing.pgFor || selectedListing.preferredGender },
                                { label: "Preferred Tenants", value: selectedListing.tenantPreference },
                                { label: "Gate Closing", value: selectedListing.gateClosingTime },
                                { label: "Notice Period", value: selectedListing.noticePeriod },
                              ] : [
                                { label: "Society", value: selectedListing.societyName },
                                { label: "Furnishing", value: Array.isArray(selectedListing.furnishing) ? selectedListing.furnishing.join(", ") : selectedListing.furnishing },
                                { label: "Floor", value: selectedListing.floorNumber },
                                { label: "Total Floors", value: selectedListing.totalFloors },
                                { label: "Facing", value: selectedListing.facing },
                                { label: "Balcony", value: selectedListing.balcony },
                                { label: "Maintenance", value: selectedListing.maintenanceCharges ? `${currencySymbol} ${selectedListing.maintenanceCharges}` : null },
                                { label: "Additional Rooms", value: Array.isArray(selectedListing.additionalRooms) && selectedListing.additionalRooms.length > 0 ? selectedListing.additionalRooms.join(", ") : null },
                                { label: "Overlooking", value: Array.isArray(selectedListing.overlooking) && selectedListing.overlooking.length > 0 ? selectedListing.overlooking.join(", ") : null },
                              ]),
                            ].filter(d => d.value != null && d.value !== "").map((detail, i) => (
                              <div key={i} className={`p-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                                <p className="text-xs text-gray-500 mb-0.5">{detail.label}</p>
                                <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{String(detail.value)}</p>
                              </div>
                            ))}
                          </div>

                          {/* Description */}
                          {(selectedListing.pgDescription || selectedListing.localityDescription) && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Description</p>
                              <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                {selectedListing.pgDescription || selectedListing.localityDescription}
                              </p>
                            </div>
                          )}

                          {/* USP */}
                          {selectedListing.uspText && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                              {selectedListing.uspCategory && (
                                <span className="px-2 py-0.5 bg-primary text-white text-xs font-semibold rounded-full capitalize mr-2">
                                  {selectedListing.uspCategory}
                                </span>
                              )}
                              <p className={`text-sm mt-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{selectedListing.uspText}</p>
                            </div>
                          )}

                          {/* Amenities */}
                          {(selectedListing.commonAmenities?.length > 0 || selectedListing.societyAmenities?.length > 0) && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Amenities</p>
                              <div className="flex flex-wrap gap-2">
                                {(selectedListing.propertyType === "PG" ? selectedListing.commonAmenities : selectedListing.societyAmenities)?.map((a: string, i: number) => (
                                  <span key={i} className={`px-3 py-1 text-xs rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>{a}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* PG Rules */}
                          {selectedListing.propertyType === "PG" && selectedListing.pgRules?.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Rules</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedListing.pgRules.map((rule: string, i: number) => {
                                  const labels: Record<string, string> = { guardian: "No Guardian", nonveg: "No Non-Veg", gender: "No Opposite Gender", alcohol: "No Alcohol", smoking: "No Smoking" };
                                  return <span key={i} className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full">{labels[rule] || rule}</span>;
                                })}
                              </div>
                            </div>
                          )}

                          {/* Services */}
                          {Array.isArray(selectedListing.services) && selectedListing.services.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Services</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedListing.services.map((s: string, i: number) => {
                                  const labels: Record<string, string> = { laundry: "Laundry", cleaning: "Room Cleaning", warden: "Warden" };
                                  return <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full">{labels[s] || s}</span>;
                                })}
                              </div>
                            </div>
                          )}

                          {/* Tenants Preferred */}
                          {selectedListing.tenantsPrefer?.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tenants Preferred</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedListing.tenantsPrefer.map((p: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{p}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Locality Description (Tenant) */}
                          {selectedListing.propertyType === "Tenant" && selectedListing.localityDescription && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Locality Description</p>
                              <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{selectedListing.localityDescription}</p>
                            </div>
                          )}

                          {/* Nearby Places */}
                          {selectedListing.nearbyPlaces?.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Nearby Places</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedListing.nearbyPlaces.map((place: { name: string; distance: string } | string, i: number) => (
                                  <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-medium">
                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                    {typeof place === 'string' ? place : place.name}
                                    {typeof place !== 'string' && place.distance && (
                                      <span className="text-blue-400 font-normal">· {place.distance}</span>
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* PG Food */}
                          {selectedListing.propertyType === "PG" && selectedListing.foodProvided && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Food</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedListing.meals?.map((m: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">{m}</span>
                                ))}
                                {selectedListing.vegNonVeg && (
                                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full">{selectedListing.vegNonVeg}</span>
                                )}
                                {selectedListing.foodCharges && (
                                  <span className={`px-3 py-1 text-xs rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>Charges: {currencySymbol} {selectedListing.foodCharges}</span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Parking */}
                          {selectedListing.parkingAvailable && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Parking</p>
                              <span className={`px-3 py-1 text-xs rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                                {selectedListing.parkingType || "Available"}
                              </span>
                            </div>
                          )}

                          {/* PG Room Details */}
                          {selectedListing.propertyType === "PG" && selectedListing.roomDetails && Object.keys(selectedListing.roomDetails).length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                                {language === "fr" ? "Détails des chambres" : "Room Details"}
                              </p>
                              <div className="grid sm:grid-cols-2 gap-3">
                                {Object.entries(selectedListing.roomDetails as Record<string, any>).map(([category, detail]) => (
                                  <div key={category} className={`border rounded-xl p-4 hover:border-primary/40 transition-colors ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{category} Bed</h4>
                                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                        {detail.availableBeds ?? detail.availableRooms ?? "—"} {language === "fr" ? "dispo" : "available"}
                                      </span>
                                    </div>
                                    <div className="space-y-1.5 mb-3">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Total Beds</span>
                                        <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{detail.totalBeds ?? detail.totalRooms ?? "—"}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Monthly Rent</span>
                                        <span className="font-bold text-primary">{currencySymbol} {Number(detail.monthlyRent).toLocaleString()}</span>
                                      </div>
                                      {detail.securityDeposit && Number(detail.securityDeposit) > 0 && (
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-500">Deposit</span>
                                          <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{currencySymbol} {Number(detail.securityDeposit).toLocaleString()}</span>
                                        </div>
                                      )}
                                    </div>
                                    {detail.facilities?.length > 0 && (
                                      <div className={`flex flex-wrap gap-1.5 pt-2 border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                                        {detail.facilities.map((f: string, i: number) => (
                                          <span key={i} className={`px-2 py-0.5 text-xs rounded-full capitalize ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{f}</span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className={`flex flex-wrap gap-2 pt-2 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                            <button
                              onClick={() => { openEdit(selectedListing); setSelectedListing(null); }}
                              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors text-sm ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                            >
                              <Edit className="w-4 h-4" />
                              {tc.edit}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(selectedListing._id)}
                              className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                              {tc.delete}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                    <>
                    {/* Grid View */}
                    {viewMode === "grid" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {myListings.map((listing) => (
                          <div key={listing._id} className={`rounded-2xl overflow-hidden hover:shadow-lg transition-shadow ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white shadow-md"}`}>
                            <div className="relative h-40 sm:h-48">
                              <Image
                                src={listing.images?.[0] || "/owner.png"}
                                alt={listing.title}
                                fill
                                className="object-cover"
                              />
                              <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                                listing.propertyType === "PG" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                              }`}>
                                {listing.propertyType}
                              </span>
                              {listing.approvalStatus === "pending" && (
                                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-white">
                                  Pending Review
                                </span>
                              )}
                              {listing.approvalStatus === "rejected" && (
                                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
                                  Rejected
                                </span>
                              )}
                            </div>
                            <div className="p-6">
                              <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                                {listing.propertyType === "Tenant" && listing.societyName ? listing.societyName : listing.title}
                              </h3>
                              <div className={`flex items-center gap-2 mb-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{listing.areaName}, {listing.location}, {listing.state}</span>
                              </div>
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl font-bold text-primary">
                                  {currencySymbol} {listing.price?.toLocaleString()}
                                </span>
                                <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>/month</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                                <div className={`text-center p-2 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>Total Beds</p>
                                  <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                                    {listing.propertyType === "PG" && listing.roomDetails
                                      ? Object.values(listing.roomDetails as Record<string, any>).reduce((s: number, r: any) => s + (parseInt(r.totalBeds ?? r.totalRooms) || 0), 0)
                                      : listing.rooms}
                                  </p>
                                </div>
                                <div className={`text-center p-2 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>Available</p>
                                  <p className="font-bold text-green-600">
                                    {listing.propertyType === "PG" && listing.roomDetails
                                      ? Object.values(listing.roomDetails as Record<string, any>).reduce((s: number, r: any) => s + (parseInt(r.availableBeds ?? r.availableRooms) || 0), 0)
                                      : listing.rooms}
                                  </p>
                                </div>
                                <div className={`text-center p-2 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>Area</p>
                                  <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{listing.area} m²</p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={() => setSelectedListing(listing)}
                                  className="flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
                                >
                                  <Eye className="w-4 h-4" />
                                  {tc.viewDetails}
                                </button>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openEdit(listing)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg transition-colors text-sm ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                                  >
                                    <Edit className="w-4 h-4" />
                                    {tc.edit}
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(listing._id)}
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

                    {/* List View — Table */}
                    {viewMode === "list" && (
                      <div className={`rounded-2xl shadow-md overflow-hidden ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white"}`}>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className={`border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/10"}`}>
                                <th className="text-left px-5 py-4 text-xs font-bold text-primary uppercase tracking-wide">Property</th>
                                <th className="text-left px-4 py-4 text-xs font-bold text-primary uppercase tracking-wide hidden md:table-cell">Location</th>
                                <th className="text-left px-4 py-4 text-xs font-bold text-primary uppercase tracking-wide">Rent</th>
                                <th className="text-left px-4 py-4 text-xs font-bold text-primary uppercase tracking-wide hidden sm:table-cell">Rooms</th>
                                <th className="text-left px-4 py-4 text-xs font-bold text-primary uppercase tracking-wide hidden lg:table-cell">Available</th>
                                <th className="text-left px-4 py-4 text-xs font-bold text-primary uppercase tracking-wide hidden lg:table-cell">Type</th>
                                <th className="text-right px-5 py-4 text-xs font-bold text-primary uppercase tracking-wide">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {myListings.map((listing, idx) => {
                                const totalRooms = listing.propertyType === "PG" && listing.roomDetails
                                  ? Object.values(listing.roomDetails as Record<string, any>).reduce((s: number, r: any) => s + (parseInt(r.totalBeds ?? r.totalRooms) || 0), 0)
                                  : listing.rooms;
                                const availableRooms = listing.propertyType === "PG" && listing.roomDetails
                                  ? Object.values(listing.roomDetails as Record<string, any>).reduce((s: number, r: any) => s + (parseInt(r.availableBeds ?? r.availableRooms) || 0), 0)
                                  : listing.rooms;
                                return (
                                  <tr
                                    key={listing._id}
                                    className={`group hover:bg-primary/5 transition-colors cursor-pointer ${idx % 2 === 0 ? isDark ? "bg-gray-900" : "bg-white" : isDark ? "bg-gray-800/50" : "bg-gray-50/50"}`}
                                    onClick={() => setSelectedListing(listing)}
                                  >
                                    {/* Property */}
                                    <td className="px-5 py-4">
                                      <div className="flex items-center gap-3">
                                        <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden">
                                          <Image
                                            src={listing.images?.[0] || "/owner.png"}
                                            alt={listing.title}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div className="min-w-0">
                                          <p className={`font-semibold truncate max-w-[160px] group-hover:text-primary transition-colors ${isDark ? "text-white" : "text-gray-900"}`}>
                                            {listing.propertyType === "Tenant" && listing.societyName ? listing.societyName : listing.title}
                                          </p>
                                          <p className={`text-xs truncate max-w-[160px] md:hidden ${isDark ? "text-gray-500" : "text-gray-400"}`}>{listing.areaName}, {listing.location}</p>
                                        </div>
                                      </div>
                                    </td>
                                    {/* Location */}
                                    <td className="px-4 py-4 hidden md:table-cell">
                                      <div className={`flex items-center gap-1.5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                        <span className="truncate max-w-[160px]">{[listing.areaName, listing.location].filter(Boolean).join(", ")}</span>
                                      </div>
                                    </td>
                                    {/* Rent */}
                                    <td className="px-4 py-4">
                                      <span className="font-bold text-primary">{currencySymbol} {listing.price?.toLocaleString()}</span>
                                      <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>/mo</span>
                                    </td>
                                    {/* Rooms */}
                                    <td className="px-4 py-4 hidden sm:table-cell">
                                      <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{totalRooms}</span>
                                    </td>
                                    {/* Available */}
                                    <td className="px-4 py-4 hidden lg:table-cell">
                                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${Number(availableRooms) > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                        {availableRooms} {Number(availableRooms) > 0 ? "available" : "full"}
                                      </span>
                                    </td>
                                    {/* Type */}
                                    <td className="px-4 py-4 hidden lg:table-cell">
                                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${listing.propertyType === "PG" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                                        {listing.propertyType}
                                      </span>
                                    </td>
                                    {/* Actions */}
                                    <td className="px-5 py-4 text-right" onClick={e => e.stopPropagation()}>
                                      <div className="flex items-center justify-end gap-1.5">
                                        <button
                                          onClick={() => setSelectedListing(listing)}
                                          className="p-2 rounded-lg text-gray-500 hover:bg-primary hover:text-white transition-colors"
                                          title={tc.viewDetails}
                                        >
                                          <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => openEdit(listing)}
                                          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                          title={tc.edit}
                                        >
                                          <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => setDeleteConfirmId(listing._id)}
                                          className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                                          title={tc.delete}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className={`px-5 py-3 border-t flex items-center justify-between ${isDark ? "border-gray-800 bg-gray-800/50" : "border-gray-100 bg-gray-50/50"}`}>
                          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{myListings.length} {myListings.length === 1 ? "listing" : "listings"}</p>
                          <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Click a row to view details</p>
                        </div>
                      </div>
                    )}
                    </>
                    )}
                  </>
                ) : (
                  <div className={`rounded-2xl shadow-md p-12 text-center ${isDark ? "bg-gray-900" : "bg-white"}`}>
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className={isDark ? "text-gray-400" : "text-gray-600"}>{tc.noListings}</p>
                  </div>
                )}
              </div>
            )}

            {/* Inquiries */}
            {activeTab === "requests" && (
              <div className="space-y-4">
                <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>{tc.bookingRequests}</h2>

                {/* Status filter tabs */}
                {!requestsLoading && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {([
                      { key: 'all', label: language === 'fr' ? 'Tous' : 'All' },
                      { key: 'new', label: tc.statusNew },
                      { key: 'contacted', label: tc.statusContacted },
                      { key: 'interested', label: tc.statusInterested },
                      { key: 'booked', label: tc.statusBooked },
                      { key: 'closed', label: tc.statusClosed },
                    ] as { key: string; label: string }[]).map(({ key, label }) => {
                      const count = key === 'all' ? contactRequests.length : contactRequests.filter(r => (r.status || 'new') === key).length;
                      const isActive = statusFilter === key;
                      const tabColor: Record<string, string> = {
                        all: isActive ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50',
                        new: isActive ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50',
                        contacted: isActive ? 'bg-amber-500 text-white' : 'bg-white text-amber-600 hover:bg-amber-50',
                        interested: isActive ? 'bg-violet-600 text-white' : 'bg-white text-violet-600 hover:bg-violet-50',
                        booked: isActive ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 hover:bg-emerald-50',
                        closed: isActive ? 'bg-gray-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50',
                      };
                      return (
                        <button
                          key={key}
                          onClick={() => { setStatusFilter(key); setInquiryPage(1); }}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all shadow-sm ${tabColor[key]} ${isActive ? 'border-transparent shadow-md' : 'border-gray-200'}`}
                        >
                          {label}
                          {count > 0 && (
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'}`}>
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {requestsLoading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className={`rounded-2xl shadow-md h-40 animate-pulse ${isDark ? "bg-gray-800" : "bg-white"}`} />
                    ))}
                  </div>
                ) : contactRequests.length > 0 ? (
                  (() => {
                    const filtered = statusFilter === 'all'
                      ? contactRequests
                      : contactRequests.filter(r => (r.status || 'new') === statusFilter);
                    const totalPages = Math.ceil(filtered.length / INQUIRIES_PER_PAGE);
                    const paginated = filtered.slice((inquiryPage - 1) * INQUIRIES_PER_PAGE, inquiryPage * INQUIRIES_PER_PAGE);
                    return filtered.length > 0 ? (
                      <>
                  <div className="space-y-4">
                    {paginated.map((req: any) => (
                      <div key={req._id} className={`rounded-2xl shadow-md p-5 ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white"}`}>
                        {/* Single info row: name + phone + email + status */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <h3 className={`text-base font-bold flex-shrink-0 ${isDark ? "text-white" : "text-gray-900"}`}>{req.fullName}</h3>
                          {(req.phone || req.renter?.phoneNumber) && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg flex-shrink-0">
                              <Phone className="w-3.5 h-3.5 text-blue-600" />
                              <span className="text-xs font-medium text-blue-800">{req.phone || req.renter?.phoneNumber}</span>
                            </div>
                          )}
                          {(req.email || req.renter?.email) && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-100 rounded-lg flex-shrink-0">
                              <Mail className="w-3.5 h-3.5 text-purple-600" />
                              <span className="text-xs font-medium text-purple-800">{req.email || req.renter?.email}</span>
                            </div>
                          )}
                          {/* Status badge dropdown — pushed to end */}
                          <div className="ml-auto">
                            <StatusDropdown
                              value={req.status || 'new'}
                              onChange={(v) => updateInquiryStatus(req._id, v)}
                              options={[
                                { value: 'new', label: tc.statusNew },
                                { value: 'contacted', label: tc.statusContacted },
                                { value: 'interested', label: tc.statusInterested },
                                { value: 'booked', label: tc.statusBooked },
                                { value: 'closed', label: tc.statusClosed },
                              ]}
                              isDark={isDark}
                            />
                          </div>
                        </div>

                        {/* Property + date */}
                        <div className="flex items-center gap-3 mb-4">
                          <p className={`text-sm truncate flex-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{req.propertyTitle || "—"}</p>
                          <p className={`text-xs flex-shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                            {new Date(req.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}{' · '}
                            {new Date(req.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openChat(req)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-xs font-medium"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {language === "fr" ? "Chat" : "Chat"}
                          </button>
                          {req.phone && (
                            <a
                              href={`https://wa.me/${req.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${req.fullName}, regarding your inquiry for "${req.propertyTitle}".`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-medium"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              {language === "fr" ? "WhatsApp" : "WhatsApp"}
                            </a>
                          )}
                          {req.phone && (
                            <a
                              href={`tel:${req.phone}`}
                              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              {language === "fr" ? "Appeler" : "Call"}
                            </a>
                          )}
                          <button
                            onClick={() => setSelectedInquiry(req)}
                            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {language === "fr" ? "Voir" : "View"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-sm text-gray-500">
                            {language === 'fr'
                              ? `${(inquiryPage - 1) * INQUIRIES_PER_PAGE + 1}–${Math.min(inquiryPage * INQUIRIES_PER_PAGE, filtered.length)} sur ${filtered.length}`
                              : `${(inquiryPage - 1) * INQUIRIES_PER_PAGE + 1}–${Math.min(inquiryPage * INQUIRIES_PER_PAGE, filtered.length)} of ${filtered.length}`}
                          </p>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setInquiryPage(p => Math.max(1, p - 1))}
                              disabled={inquiryPage === 1}
                              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronDown className="w-4 h-4 rotate-90" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                              <button
                                key={page}
                                onClick={() => setInquiryPage(page)}
                                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                                  page === inquiryPage
                                    ? 'bg-primary text-white'
                                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                            <button
                              onClick={() => setInquiryPage(p => Math.min(totalPages, p + 1))}
                              disabled={inquiryPage === totalPages}
                              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronDown className="w-4 h-4 -rotate-90" />
                            </button>
                          </div>
                        </div>
                      )}
                      </>
                    ) : (
                      <div className={`rounded-2xl shadow-md p-12 text-center ${isDark ? "bg-gray-900" : "bg-white"}`}>
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className={isDark ? "text-gray-400" : "text-gray-600"}>{language === 'fr' ? 'Aucune demande dans cette catégorie.' : 'No inquiries in this category.'}</p>
                      </div>
                    );
                  })()
                ) : (
                  <div className={`rounded-2xl shadow-md p-12 text-center ${isDark ? "bg-gray-900" : "bg-white"}`}>
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className={isDark ? "text-gray-400" : "text-gray-600"}>{tc.noRequests}</p>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            {activeTab === "messages" && (
              <div className="space-y-4">
                <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>{tc.messages}</h2>
                {contactRequests.filter(r => conversations[r._id]).length === 0 ? (
                  <div className={`rounded-2xl shadow-md p-12 text-center ${isDark ? "bg-gray-900" : "bg-white"}`}>
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className={isDark ? "text-gray-400" : "text-gray-600"}>{tc.noMessages}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contactRequests
                      .filter(r => conversations[r._id])
                      .map((req: any) => {
                        const conv = conversations[req._id];
                        return (
                          <div
                            key={req._id}
                            onClick={() => { openChat(req); }}
                            className={`rounded-2xl shadow-md p-5 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow ${conv.unread ? 'border-l-4 border-primary' : ''} ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white"}`}
                          >
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`truncate ${conv.unread ? 'font-bold' : 'font-semibold'} ${isDark ? "text-white" : "text-gray-900"}`}>{req.fullName}</p>
                                <span className={`text-xs flex-shrink-0 ml-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                                  {new Date(conv.time).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 truncate">{req.propertyTitle}</p>
                              <p className={`text-sm truncate mt-0.5 ${conv.unread ? 'font-semibold' : ''} ${isDark ? "text-gray-300" : "text-gray-700"}`}>{conv.lastMsg}</p>
                            </div>
                            {conv.unread && (
                              <span className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0" />
                            )}
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                const token = localStorage.getItem('staybuddy_token');
                                await fetch(`/api/messages/${req._id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} });
                                setConversations(prev => { const n = { ...prev }; delete n[req._id]; return n; });
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
              <ProfileSection user={user} tc={tc} language={language} isDark={isDark} />
            )}
          </div>
          </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-stretch h-16">
          {[
            { key: "listings",  icon: Home,         label: language === "fr" ? "Annonces" : "Listings" },
            { key: "requests",  icon: Calendar,     label: language === "fr" ? "Demandes" : "Inquiries",
              badge: contactRequests.filter((r: any) => !seenInquiryIds.has(r._id)).length },
            { key: "messages",  icon: MessageSquare,label: language === "fr" ? "Messages" : "Messages",
              badge: Object.values(conversations).filter(c => c.unread).length },
            { key: "profile",   icon: User,         label: language === "fr" ? "Profil" : "Profile" },
          ].map(({ key, icon: Icon, label, badge }) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                if (key === "requests") {
                  setSeenInquiryIds(prev => {
                    const updated = new Set(prev);
                    contactRequests.forEach((r: any) => updated.add(r._id));
                    return updated;
                  });
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 relative transition-all duration-200 ${
                activeTab === key
                  ? "text-primary"
                  : isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {activeTab === key && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-primary rounded-full" />
              )}
              {activeTab === key && (
                <span className={`absolute inset-x-1 inset-y-1 rounded-xl ${isDark ? "bg-primary/10" : "bg-primary/8"}`} />
              )}
              <div className="relative z-10">
                <Icon className="w-5 h-5" />
                {badge ? (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {(badge as number) > 9 ? '9+' : badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[9px] font-semibold z-10 ${activeTab === key ? "opacity-100" : "opacity-60"}`}>{label}</span>
            </button>
          ))}
          <button
            onClick={() => logout()}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${isDark ? "text-red-400 hover:text-red-300" : "text-red-400 hover:text-red-600"}`}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[9px] font-semibold opacity-60">{language === "fr" ? "Sortir" : "Logout"}</span>
          </button>
        </div>
      </div>

      {/* Chat Modal */}
      {/* Chat Modal — WebSocket powered */}
      <AnimatePresence>
        {chatRequest && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <div className="absolute inset-0 bg-black/50" onClick={closeChat} />
            <div className="relative w-full sm:max-w-lg">
              <ChatPanel
                requestId={chatRequest._id}
                propertyTitle={chatRequest.propertyTitle}
                otherPartyName={chatRequest.fullName || chatRequest.renter?.fullName || 'Tenant'}
                userId={user?.id || ''}
                token={typeof window !== 'undefined' ? localStorage.getItem('staybuddy_token') : null}
                userRole="landlord"
                isDark={isDark}
                language={language}
                onClose={closeChat}
                onDelete={deleteChat}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedInquiry(null)} />
          <div className={`relative rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto ${isDark ? "bg-gray-900" : "bg-white"}`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-5 border-b sticky top-0 rounded-t-2xl z-10 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{selectedInquiry.fullName}</h3>
                <p className="text-sm text-gray-500">{selectedInquiry.propertyTitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedInquiry.status || 'new')}`}>
                  {getStatusLabel(selectedInquiry.status || 'new')}
                </span>
                <button onClick={() => setSelectedInquiry(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Date */}
              <p className="text-xs text-gray-400">
                {new Date(selectedInquiry.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}{' · '}
                {new Date(selectedInquiry.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </p>

              {/* Contact */}
              <div className="flex flex-wrap gap-2">
                {(selectedInquiry.phone || selectedInquiry.renter?.phoneNumber) && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-800">{selectedInquiry.phone || selectedInquiry.renter?.phoneNumber}</span>
                  </div>
                )}
                {(selectedInquiry.email || selectedInquiry.renter?.email) && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-lg">
                    <Mail className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-800">{selectedInquiry.email || selectedInquiry.renter?.email}</span>
                  </div>
                )}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: language === 'fr' ? 'Type de chambre' : 'Room Type', value: selectedInquiry.roomType },
                  { label: language === 'fr' ? 'Emménagement' : 'Move-in Date', value: selectedInquiry.moveInDate },
                  { label: language === 'fr' ? 'Durée' : 'Stay Duration', value: selectedInquiry.stayDuration },
                  { label: language === 'fr' ? 'Budget' : 'Budget', value: selectedInquiry.budgetRange },
                  { label: language === 'fr' ? 'Profession' : 'Occupation', value: selectedInquiry.occupation },
                  { label: language === 'fr' ? 'Genre' : 'Gender', value: selectedInquiry.gender },
                  { label: language === 'fr' ? 'Occupants' : 'Occupants', value: selectedInquiry.numberOfOccupants },
                  { label: language === 'fr' ? 'Alimentation' : 'Food', value: selectedInquiry.foodPreference },
                  { label: language === 'fr' ? 'Parking' : 'Parking', value: selectedInquiry.needParking },
                  { label: language === 'fr' ? 'Société/École' : 'Company/College', value: selectedInquiry.companyCollege },
                ].filter(d => d.value).map((d, i) => (
                  <div key={i} className={`rounded-xl p-3 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                    <p className="text-xs text-gray-500 mb-0.5">{d.label}</p>
                    <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{d.value}</p>
                  </div>
                ))}
              </div>

              {/* Message */}
              {selectedInquiry.message && (
                <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{language === 'fr' ? 'Message' : 'Message'}</p>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-800"}`}>{selectedInquiry.message}</p>
                </div>
              )}

              {/* Actions */}
              <div className={`flex flex-wrap gap-2 pt-2 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                <button
                  onClick={() => { openChat(selectedInquiry); setSelectedInquiry(null); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
                >
                  <MessageSquare className="w-4 h-4" />
                  {language === 'fr' ? 'Chat' : 'Chat'}
                </button>
                {selectedInquiry.phone && (
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${selectedInquiry.fullName}, regarding your inquiry for "${selectedInquiry.propertyTitle}".`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </a>
                )}
                {selectedInquiry.phone && (
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    {language === 'fr' ? 'Appeler' : 'Call'}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirmId(null)} />
          <div className={`relative rounded-2xl shadow-xl p-6 w-full max-w-sm ${isDark ? "bg-gray-900" : "bg-white"}`}>
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className={`text-lg font-bold text-center mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              {language === "fr" ? "Supprimer l'annonce ?" : "Delete this property?"}
            </h3>
            <p className={`text-sm text-center mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {language === "fr"
                ? "Cette action est irréversible. L'annonce sera définitivement supprimée."
                : "This action cannot be undone. The listing will be permanently removed."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className={`flex-1 px-4 py-3 rounded-xl border transition-colors text-sm font-medium ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
              >
                {language === "fr" ? "Annuler" : "Cancel"}
              </button>
              <button
                onClick={() => { deleteListing(deleteConfirmId); setDeleteConfirmId(null); }}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium"
              >
                {language === "fr" ? "Supprimer" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
