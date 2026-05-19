"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "@/components/LocalizedLink";
import { Home, Sun, Moon, FileText, Clock, CheckCircle, XCircle, AlertTriangle, Scale } from "lucide-react";
import { motion } from "framer-motion";
import { getToken } from "@/lib/token-storage";

import LawyerSidebar from "@/components/lawyer/LawyerSidebar";
import LawyerMobileNav from "@/components/lawyer/LawyerMobileNav";
import LawyerOwnersTab from "@/components/lawyer/LawyerOwnersTab";
import LawyerContractsTab from "@/components/lawyer/LawyerContractsTab";

// ── Dummy stats ───────────────────────────────────────────────────────────────
const DUMMY_STATS = [
  { label: "Total Contracts",       value: 24, icon: FileText,      colorDark: "text-blue-400",   bgDark: "bg-blue-500/10",   borderDark: "border-blue-500/20",   colorLight: "text-blue-600",   bgLight: "bg-blue-50",   borderLight: "border-blue-200" },
  { label: "Pending Contracts",     value: 6,  icon: Clock,         colorDark: "text-yellow-400", bgDark: "bg-yellow-500/10", borderDark: "border-yellow-500/20", colorLight: "text-yellow-600", bgLight: "bg-yellow-50", borderLight: "border-yellow-200" },
  { label: "Approved Contracts",    value: 14, icon: CheckCircle,   colorDark: "text-green-400",  bgDark: "bg-green-500/10",  borderDark: "border-green-500/20",  colorLight: "text-green-600",  bgLight: "bg-green-50",  borderLight: "border-green-200" },
  { label: "Rejected Contracts",    value: 3,  icon: XCircle,       colorDark: "text-red-400",    bgDark: "bg-red-500/10",    borderDark: "border-red-500/20",    colorLight: "text-red-600",    bgLight: "bg-red-50",    borderLight: "border-red-200" },
  { label: "Expired (Last 7 Days)", value: 1,  icon: AlertTriangle, colorDark: "text-orange-400", bgDark: "bg-orange-500/10", borderDark: "border-orange-500/20", colorLight: "text-orange-600", bgLight: "bg-orange-50", borderLight: "border-orange-200" },
];

export default function LawyerDashboard() {
  const { language } = useLanguage();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "overview");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Owners state
  const [owners, setOwners] = useState<any[]>([]);
  const [ownersLoading, setOwnersLoading] = useState(false);
  const [ownersFetched, setOwnersFetched] = useState(false);

  // Accepted owners (for contract creation)
  const [acceptedOwners, setAcceptedOwners] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("lawyer_theme");
    setIsDark(saved === "dark");
  }, []);

  // Fetch owners when the tab is first opened
  useEffect(() => {
    if (activeTab !== "owners" || ownersFetched || !isAuthenticated) return;
    const token = getToken();
    setOwnersLoading(true);
    fetch("/api/lawyer/owners", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => { if (data.success) setOwners(data.owners); })
      .catch(() => {})
      .finally(() => { setOwnersLoading(false); setOwnersFetched(true); });
  }, [activeTab, ownersFetched, isAuthenticated]);

  // Fetch accepted owners for contract creation (once authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;
    const token = getToken();
    // Fetch both requests and owners list, then cross-reference
    Promise.all([
      fetch("/api/lawyer-requests", { headers: token ? { Authorization: `Bearer ${token}` } : {} }).then(r => r.json()),
      fetch("/api/lawyer/owners", { headers: token ? { Authorization: `Bearer ${token}` } : {} }).then(r => r.json()),
    ]).then(([reqData, ownersData]) => {
      if (reqData.success && ownersData.success) {
        const acceptedIds = new Set(
          reqData.requests.filter((r: any) => r.status === "accepted").map((r: any) => r.owner)
        );
        const filtered = ownersData.owners.filter((o: any) => acceptedIds.has(o._id));
        setAcceptedOwners(filtered);
        if (!ownersFetched) { setOwners(ownersData.owners); setOwnersFetched(true); }
      }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("lawyer_theme", next ? "dark" : "light");
  };

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) { router.push("/login"); return; }
      if (user?.role !== "lawyer") {
        if (user?.role === "renter") router.push("/dashboard/tenant");
        else if (user?.role === "landlord") router.push("/dashboard/owner");
        else if (user?.role === "admin") router.push("/dashboard/admin");
        else router.push("/");
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>Loading...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated || user?.role !== "lawyer") return null;

  return (
    <div className={`h-screen overflow-hidden flex flex-col ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
      {/* Dark mode grid overlay */}
      {isDark && (
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0" />
      )}

      {/* Header */}
      <div className={`sticky top-0 z-50 shadow-sm border-b flex-shrink-0 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
        <div className="max-w-[1500px] mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDark ? "bg-yellow-500/20" : "bg-yellow-100"}`}>
                <Scale className={`w-4 h-4 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} />
              </div>
              <h1 className={`text-base sm:text-xl font-bold truncate ${isDark ? "text-primary-light" : "text-primary"}`}>
                {language === "fr" ? "Tableau de bord Avocat" : "Lawyer Dashboard"}
              </h1>
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

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <LawyerSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDark={isDark}
          language={language}
          user={user}
          profileMenuOpen={profileMenuOpen}
          setProfileMenuOpen={setProfileMenuOpen}
          logout={logout}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0 overflow-y-auto pb-16 lg:pb-0" data-lenis-prevent>
          <div className="p-3 sm:p-5 lg:p-8">

            {/* Overview tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Welcome */}
                <div>
                  <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {language === "fr" ? `Bonjour, ${user?.fullName?.split(" ")[0]} 👋` : `Welcome back, ${user?.fullName?.split(" ")[0]} 👋`}
                  </h2>
                  <p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {language === "fr" ? "Voici un aperçu de votre activité contractuelle." : "Here's an overview of your contract activity."}
                  </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {DUMMY_STATS.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.06 }}
                        className={`rounded-2xl border p-5 flex flex-col gap-4 ${isDark ? `${stat.bgDark} ${stat.borderDark}` : `${stat.bgLight} ${stat.borderLight}`}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? stat.bgDark : stat.bgLight}`}>
                          <Icon className={`w-5 h-5 ${isDark ? stat.colorDark : stat.colorLight}`} />
                        </div>
                        <div>
                          <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{stat.value}</p>
                          <p className={`text-xs font-medium mt-1 ${isDark ? stat.colorDark : stat.colorLight}`}>{stat.label}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Coming soon */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                  className={`rounded-2xl border p-10 text-center ${isDark ? "border-gray-800 bg-gray-900/50" : "border-gray-200 bg-white shadow-sm"}`}
                >
                  <Scale className={`w-12 h-12 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
                  <p className={`font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {language === "fr" ? "Gestion des contrats bientôt disponible" : "Contract management features coming soon"}
                  </p>
                  <p className={`text-sm mt-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                    {language === "fr"
                      ? "Vous pourrez créer, examiner et gérer les contrats de location ici."
                      : "You'll be able to create, review, and manage rental contracts here."}
                  </p>
                </motion.div>
              </div>
            )}

            {/* Owners tab */}
            {activeTab === "owners" && (
              <LawyerOwnersTab
                isDark={isDark}
                owners={owners}
                loading={ownersLoading}
                onCreateContract={() => setActiveTab("contracts")}
              />
            )}

            {/* Contracts tab */}
            {activeTab === "contracts" && (
              <LawyerContractsTab
                isDark={isDark}
                acceptedOwners={acceptedOwners}
              />
            )}

            {/* Profile tab */}
            {activeTab === "profile" && (
              <div className="max-w-xl">
                <h2 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {language === "fr" ? "Paramètres du profil" : "Profile Settings"}
                </h2>
                <div className={`rounded-2xl border p-6 space-y-5 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 overflow-hidden">
                      {user?.profileImage
                        ? <img src={user.profileImage} alt={user.fullName} referrerPolicy="no-referrer" className="object-cover w-full h-full" />
                        : user?.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>{user?.fullName}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Scale className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="text-xs text-yellow-500 font-semibold">Lawyer</span>
                      </div>
                    </div>
                  </div>

                  <div className={`border-t ${isDark ? "border-gray-800" : "border-gray-100"}`} />

                  {/* Fields */}
                  {[
                    { label: language === "fr" ? "Nom complet" : "Full Name", value: user?.fullName },
                    { label: "Email", value: user?.email },
                    { label: language === "fr" ? "Téléphone" : "Phone", value: user?.phoneNumber || "—" },
                    { label: language === "fr" ? "Pays" : "Country", value: user?.country === "in" ? "🇮🇳 India" : "🇫🇷 France" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
                      <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <LawyerMobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        language={language}
        logout={logout}
      />
    </div>
  );
}
