"use client";

import Image from "next/image";
import {
  Home,
  Users,
  Flag,
  LogOut,
  ChevronDown,
  ClipboardList,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { AdminContent, AdminStats } from "./types";

interface AdminSidebarProps {
  isDark: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: AdminStats;
  tc: AdminContent;
  authUser: any;
  profileMenuOpen: boolean;
  setProfileMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  currentCountry: string;
  language: string;
}

export default function AdminSidebar({
  isDark,
  activeTab,
  setActiveTab,
  stats,
  tc,
  authUser,
  profileMenuOpen,
  setProfileMenuOpen,
  currentCountry,
  language,
}: AdminSidebarProps) {
  return (
    <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
      <div className={`p-4 h-full overflow-y-auto flex flex-col border-r ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "analytics" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "listings" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">{tc.listingsManagement}</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "users" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">{tc.userManagement}</span>
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "reports" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
          <button
            onClick={() => setActiveTab("requests")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "requests" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="font-medium">Property Requests</span>
            {stats.pendingRequests > 0 && (
              <span className="ml-auto bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{stats.pendingRequests}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("outreach")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "outreach" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">WA Outreach</span>
          </button>
        </nav>

        {/* Profile card */}
        <div className={`mt-auto pt-4 border-t relative ${isDark ? "border-gray-800" : "border-gray-200"}`}>
          <button
            onClick={() => setProfileMenuOpen(p => !p)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group ${profileMenuOpen ? "bg-primary/10" : isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
              {authUser?.profileImage ? (
                <Image src={authUser.profileImage} alt={authUser.fullName} width={40} height={40} className="object-cover w-full h-full" />
              ) : (
                <span className="text-white font-bold text-sm">
                  {authUser?.fullName?.charAt(0)?.toUpperCase() || "A"}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{authUser?.fullName || "—"}</p>
              <p className="text-xs text-gray-500 truncate">{authUser?.email}</p>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${profileMenuOpen ? "bg-primary text-white" : isDark ? "bg-gray-700 text-gray-400 group-hover:bg-gray-600 group-hover:text-gray-200" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"}`}>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
            </div>
          </button>

          {profileMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)} />
              <div className={`absolute bottom-full left-0 right-0 mb-2 rounded-xl shadow-xl border overflow-hidden z-20 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
                <div className={`px-4 py-3 border-b ${isDark ? "bg-primary/10 border-primary/20" : "bg-primary/5 border-primary/10"}`}>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {language === "fr" ? "Connecté en tant que" : "Signed in as"}
                  </p>
                  <p className={`text-sm font-bold truncate mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>{authUser?.fullName}</p>
                </div>
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    document.cookie = 'staybuddy_token=; path=/; max-age=0; SameSite=Lax';
                    localStorage.removeItem(`staybuddy_token_${currentCountry}`);
                    localStorage.removeItem(`staybuddy_user_${currentCountry}`);
                    window.location.href = `/${currentCountry}`;
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors group/item ${isDark ? "text-red-400 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"}`}
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
