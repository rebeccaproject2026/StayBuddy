"use client";

import { Home, Users, Flag, ClipboardList, MessageSquare, BarChart3 } from "lucide-react";
import { AdminStats } from "./types";

interface AdminMobileNavProps {
  isDark: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: AdminStats;
}

export default function AdminMobileNav({ isDark, activeTab, setActiveTab, stats }: AdminMobileNavProps) {
  const tabs = [
    { key: "analytics",  icon: BarChart3,     label: "Analytics" },
    { key: "listings",   icon: Home,          label: "Listings" },
    { key: "users",      icon: Users,         label: "Users" },
    { key: "reports",    icon: Flag,          label: "Reports",  badge: stats.pendingReports },
    { key: "requests",   icon: ClipboardList, label: "Requests", badge: stats.pendingRequests },
    { key: "outreach",   icon: MessageSquare, label: "Outreach" },
  ];

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-16">
        {tabs.map(({ key, icon: Icon, label, badge }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all duration-200 ${
              activeTab === key ? "text-primary" : isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {activeTab === key && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />}
            {activeTab === key && <span className={`absolute inset-x-0.5 inset-y-0.5 rounded-xl ${isDark ? "bg-primary/10" : "bg-primary/8"}`} />}
            <div className="relative z-10">
              <Icon className="w-4 h-4" />
              {badge ? (
                <span className="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {(badge as number) > 9 ? '9+' : badge}
                </span>
              ) : null}
            </div>
            <span className={`text-[8px] font-semibold z-10 ${activeTab === key ? "opacity-100" : "opacity-50"}`}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
