"use client";

import { LayoutDashboard, User, LogOut, Building2, FileText } from "lucide-react";

interface LawyerMobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  language: string;
  logout: () => void;
}

export default function LawyerMobileNav({
  activeTab,
  setActiveTab,
  isDark,
  language,
  logout,
}: LawyerMobileNavProps) {
  const tabs = [
    { key: "overview",  icon: LayoutDashboard, label: language === "fr" ? "Aperçu" : "Overview" },
    { key: "owners",    icon: Building2,       label: language === "fr" ? "Propriétaires" : "Owners" },
    { key: "contracts", icon: FileText,        label: language === "fr" ? "Contrats" : "Contracts" },
    { key: "profile",   icon: User,            label: language === "fr" ? "Profil" : "Profile" },
  ];

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch h-16">
        {tabs.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
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
            <Icon className="w-5 h-5 relative z-10" />
            <span className={`text-[9px] font-semibold z-10 ${activeTab === key ? "opacity-100" : "opacity-60"}`}>{label}</span>
          </button>
        ))}
        <button
          onClick={logout}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${isDark ? "text-red-400 hover:text-red-300" : "text-red-400 hover:text-red-600"}`}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[9px] font-semibold opacity-60">{language === "fr" ? "Sortir" : "Logout"}</span>
        </button>
      </div>
    </div>
  );
}
