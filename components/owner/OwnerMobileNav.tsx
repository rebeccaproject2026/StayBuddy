"use client";

import { Home, Calendar, MessageSquare, User, LogOut } from "lucide-react";
import type { OwnerMobileNavProps } from "./types";

export default function OwnerMobileNav({
  activeTab,
  setActiveTab,
  isDark,
  language,
  contactRequests,
  seenInquiryIds,
  setSeenInquiryIds,
  chatUnread,
  logout,
}: OwnerMobileNavProps) {
  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch h-16">
        {[
          { key: "listings",  icon: Home,          label: language === "fr" ? "Annonces" : "Listings" },
          { key: "requests",  icon: Calendar,      label: language === "fr" ? "Demandes" : "Inquiries",
            badge: contactRequests.filter((r: any) => !seenInquiryIds.has(r._id)).length },
          { key: "messages",  icon: MessageSquare, label: "Messages", badge: chatUnread },
          { key: "profile",   icon: User,          label: language === "fr" ? "Profil" : "Profile" },
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
                  {(badge as number) > 9 ? "9+" : badge}
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
  );
}
