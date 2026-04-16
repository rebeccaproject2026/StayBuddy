"use client";

import { Home, Users, Flag, CheckCircle, Building2 } from "lucide-react";
import { AdminStats, AdminContent } from "./types";

interface AdminStatsCardsProps {
  isDark: boolean;
  stats: AdminStats;
  tc: AdminContent;
}

export default function AdminStatsCards({ isDark, stats, tc }: AdminStatsCardsProps) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
      <div className={`rounded-xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>Total Property Listed</h3>
          <Home className="w-8 h-8 text-primary" />
        </div>
        <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{stats.totalListings}</p>
        <div className={`mt-2 text-sm flex items-center gap-1.5 font-medium text-green-500`}>
          <CheckCircle className="w-4 h-4" />
          {stats.verifiedListings} verified
        </div>
      </div>
      <div className={`rounded-xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tc.totalUsers}</h3>
          <Users className="w-8 h-8 text-primary" />
        </div>
        <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{stats.totalUsers}</p>
        <div className={`mt-3 flex items-center gap-3`}>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 font-medium text-sm">
            <Building2 className="w-4 h-4" />
            {stats.owners} landlords
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 font-medium text-sm">
            <Users className="w-4 h-4" />
            {stats.tenants} renters
          </div>
        </div>
      </div>
      <div className={`rounded-xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tc.pendingReports}</h3>
          <Flag className="w-8 h-8 text-red-500" />
        </div>
        <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{stats.pendingReports}</p>
        <div className={`mt-2 text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>{tc.reportsModeration}</div>
      </div>
    </div>
  );
}
