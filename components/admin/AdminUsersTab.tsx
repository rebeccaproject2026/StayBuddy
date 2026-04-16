"use client";

import {
  Filter,
  Loader2,
  Users,
  Phone,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AdminUser, AdminContent } from "./types";

interface AdminUsersTabProps {
  isDark: boolean;
  tc: AdminContent;
  currentCountry: string;
  userFilter: string;
  setUserFilter: (v: string) => void;
  userPage: number;
  setUserPage: (fn: (p: number) => number) => void;
  usersLoading: boolean;
  filteredUsers: AdminUser[];
  pagedUsers: AdminUser[];
  totalUserPages: number;
  USER_PAGE_SIZE: number;
  handleToggleBlock: (userId: string, block: boolean, userName: string, email: string) => void;
}

export default function AdminUsersTab({
  isDark,
  tc,
  currentCountry,
  userFilter,
  setUserFilter,
  userPage,
  setUserPage,
  usersLoading,
  filteredUsers,
  pagedUsers,
  totalUserPages,
  USER_PAGE_SIZE,
  handleToggleBlock,
}: AdminUsersTabProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.userManagement}</h2>
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          <select
            value={userFilter}
            onChange={(e) => { setUserFilter(e.target.value); setUserPage(() => 1); }}
            className={`px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
          >
            <option value="all">{tc.all}</option>
            <option value="landlord">Landlords</option>
            <option value="renter">Renters</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}>
            {currentCountry === "in" ? "🇮🇳 India" : currentCountry === "fr" ? "🇫🇷 France" : currentCountry.toUpperCase()}
          </div>
        </div>
      </div>

      {usersLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
        </div>
      ) : filteredUsers.length > 0 ? (
        <>
          <div className={`rounded-xl border overflow-hidden ${isDark ? "border-gray-800" : "border-gray-200"}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                    <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>#</th>
                    <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.name}</th>
                    <th className={`px-4 py-3 text-left font-semibold hidden sm:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.email}</th>
                    <th className={`px-4 py-3 text-left font-semibold hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Phone</th>
                    <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.role}</th>
                    <th className={`px-4 py-3 text-left font-semibold hidden sm:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Provider</th>
                    <th className={`px-4 py-3 text-left font-semibold hidden sm:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Country</th>
                    <th className={`px-4 py-3 text-center font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.verified}</th>
                    <th className={`px-4 py-3 text-left font-semibold hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Joined</th>
                    <th className={`px-4 py-3 text-center font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Block</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}>
                  {pagedUsers.map((u, idx) => {
                    const rowNum = (userPage - 1) * USER_PAGE_SIZE + idx + 1;
                    const initials = u.fullName?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";
                    const roleColor = u.role === "landlord"
                      ? isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"
                      : u.role === "admin"
                      ? isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700"
                      : isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700";
                    return (
                      <tr key={u._id} className={`transition-colors ${isDark ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-50"}`}>
                        <td className={`px-4 py-3 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{rowNum}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${u.isBlocked ? "bg-red-500" : "bg-primary"}`}>
                              {initials}
                            </div>
                            <div>
                              <span className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{u.fullName}</span>
                              {u.isBlocked && (
                                <span className="ml-2 px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded font-semibold">Blocked</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className={`px-4 py-3 hidden sm:table-cell text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{u.email}</td>
                        <td className={`px-4 py-3 hidden md:table-cell text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          {u.phoneNumber ? (
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{u.phoneNumber}</span>
                          ) : <span className="text-gray-500">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${roleColor}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className={`px-4 py-3 hidden sm:table-cell text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          <span className={`px-2 py-0.5 rounded text-xs capitalize ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                            {u.provider}
                          </span>
                        </td>
                        <td className={`px-4 py-3 hidden sm:table-cell text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          <span className={`px-2 py-0.5 rounded text-xs uppercase font-semibold ${u.country === "in" ? isDark ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-700" : isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"}`}>
                            {u.country === "in" ? "🇮🇳 IN" : u.country === "fr" ? "🇫🇷 FR" : u.country}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {u.isVerified
                            ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                            : <XCircle className="w-4 h-4 text-gray-400 mx-auto" />}
                        </td>
                        <td className={`px-4 py-3 hidden md:table-cell text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleToggleBlock(u._id, !u.isBlocked, u.fullName, u.email)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                u.isBlocked
                                  ? isDark ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
                                  : isDark ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                              }`}
                            >
                              {u.isBlocked ? "Unblock" : "Block"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalUserPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Showing {(userPage - 1) * USER_PAGE_SIZE + 1}–{Math.min(userPage * USER_PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setUserPage(p => Math.max(1, p - 1))}
                  disabled={userPage === 1}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 ${isDark ? "border border-gray-700 text-gray-300 hover:bg-gray-700" : "border border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalUserPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalUserPages || Math.abs(p - userPage) <= 1)
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === "..." ? (
                      <span key={`ellipsis-${i}`} className={`w-8 h-8 flex items-center justify-center text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setUserPage(() => item as number)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          userPage === item
                            ? "bg-primary text-white"
                            : isDark ? "border border-gray-700 text-gray-300 hover:bg-gray-700" : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
                  disabled={userPage === totalUserPages}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 ${isDark ? "border border-gray-700 text-gray-300 hover:bg-gray-700" : "border border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={`rounded-xl p-12 text-center border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
          <p className="text-gray-500">{tc.noUsers}</p>
        </div>
      )}
    </div>
  );
}
