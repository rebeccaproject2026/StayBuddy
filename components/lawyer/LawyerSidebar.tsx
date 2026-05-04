"use client";

import { LayoutDashboard, User, LogOut, ChevronDown, Scale, Building2 } from "lucide-react";

interface LawyerSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  language: string;
  user: any;
  profileMenuOpen: boolean;
  setProfileMenuOpen: (v: boolean) => void;
  logout: () => void;
}

export default function LawyerSidebar({
  activeTab,
  setActiveTab,
  isDark,
  language,
  user,
  profileMenuOpen,
  setProfileMenuOpen,
  logout,
}: LawyerSidebarProps) {
  const navItems = [
    { key: "overview", icon: LayoutDashboard, label: language === "fr" ? "Aperçu" : "Overview" },
    { key: "owners",   icon: Building2,       label: language === "fr" ? "Propriétaires" : "Owners" },
    { key: "profile",  icon: User,            label: language === "fr" ? "Profil" : "Profile" },
  ];

  return (
    <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
      <div className={`p-4 h-full overflow-y-auto flex flex-col border-r ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
        <nav className="space-y-1">
          {navItems.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === key
                  ? "bg-primary text-white"
                  : isDark
                  ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{label}</span>
            </button>
          ))}
        </nav>

        {/* Profile card */}
        <div className={`mt-auto pt-4 border-t relative ${isDark ? "border-gray-800" : "border-gray-100"}`}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group ${profileMenuOpen ? "bg-primary/10" : isDark ? "hover:bg-gray-800" : "hover:bg-primary/5"}`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
              {user?.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profileImage} alt={user.fullName} referrerPolicy="no-referrer" className="object-cover w-full h-full" />
              ) : (
                <span className="text-white font-bold text-sm">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "L"}
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
              <div className={`absolute bottom-full left-0 right-0 mb-2 rounded-xl shadow-xl border overflow-hidden z-20 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
                <div className={`px-4 py-3 border-b ${isDark ? "bg-primary/10 border-primary/20" : "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/10"}`}>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {language === "fr" ? "Connecté en tant que" : "Signed in as"}
                  </p>
                  <p className={`text-sm font-bold truncate mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>{user?.fullName}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Scale className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-yellow-500 font-medium">Lawyer</span>
                  </div>
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
  );
}
