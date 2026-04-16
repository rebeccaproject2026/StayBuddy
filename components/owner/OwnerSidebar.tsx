"use client";

import { Home, Calendar, MessageSquare, User, LogOut, ChevronDown } from "lucide-react";
import type { OwnerSidebarProps } from "./types";

export default function OwnerSidebar({
  activeTab,
  setActiveTab,
  isDark,
  language,
  user,
  contactRequests,
  seenInquiryIds,
  setSeenInquiryIds,
  chatUnread,
  profileMenuOpen,
  setProfileMenuOpen,
  logout,
  tc,
}: OwnerSidebarProps) {
  return (
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
            <div className="relative flex-shrink-0">
              <Calendar className="w-5 h-5" />
              {contactRequests.filter((r: any) => !seenInquiryIds.has(r._id)).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
              )}
            </div>
            <span className="font-medium text-sm">{tc.bookingRequests}</span>
            {contactRequests.filter((r: any) => !seenInquiryIds.has(r._id)).length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
                {contactRequests.filter((r: any) => !seenInquiryIds.has(r._id)).length}
              </span>
            )}
          </button>
          {/* Messages nav */}
          <button
            onClick={() => { setActiveTab("messages"); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "messages" ? "bg-primary text-white" : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="relative flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
              {chatUnread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {chatUnread > 9 ? "9+" : chatUnread}
                </span>
              )}
            </div>
            <span className="font-medium text-sm">{language === "fr" ? "Messages" : "Messages"}</span>
            {chatUnread > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
                {chatUnread}
              </span>
            )}
          </button>
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
              <div className={`absolute bottom-full left-0 right-0 mb-2 rounded-xl shadow-xl border overflow-hidden z-20 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
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
  );
}
