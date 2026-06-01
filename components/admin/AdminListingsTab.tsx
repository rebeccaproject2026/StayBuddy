"use client";

import Image from "next/image";
import {
  Filter,
  Loader2,
  Building2,
  MapPin,
  Mail,
  Phone,
  Eye,
  Trash2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AdminProperty, PropertyOwner, AdminContent } from "./types";

interface AdminListingsTabProps {
  isDark: boolean;
  tc: AdminContent;
  currentCountry: string;
  listingFilter: string;
  setListingFilter: (v: string) => void;
  listingPage: number;
  setListingPage: (fn: (p: number) => number) => void;
  propertiesLoading: boolean;
  filteredListings: AdminProperty[];
  pagedListings: AdminProperty[];
  totalListingPages: number;
  PAGE_SIZE: number;
  currencySymbol: string;
  setSelectedProperty: (p: AdminProperty | null) => void;
  setDeleteModal: (v: { id: string; title: string; ownerEmail?: string; ownerName?: string } | null) => void;
  setDeleteReason: (v: string) => void;
}

export default function AdminListingsTab({
  isDark,
  tc,
  currentCountry,
  listingFilter,
  setListingFilter,
  listingPage,
  setListingPage,
  propertiesLoading,
  filteredListings,
  pagedListings,
  totalListingPages,
  PAGE_SIZE,
  currencySymbol,
  setSelectedProperty,
  setDeleteModal,
  setDeleteReason,
}: AdminListingsTabProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.listingsManagement}</h2>
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          <select
            value={listingFilter}
            onChange={(e) => { setListingFilter(e.target.value); setListingPage(() => 1); }}
            className={`px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
          >
            <option value="all">{tc.all}</option>
            <option value="pg">PG</option>
            <option value="tenant">Tenant</option>
            <option value="verified">Verified</option>
          </select>
          <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}>
            {currentCountry === "in" ? "🇮🇳 India" : currentCountry === "fr" ? "🇫🇷 France" : currentCountry.toUpperCase()}
          </div>
        </div>
      </div>

      {propertiesLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
        </div>
      ) : filteredListings.length > 0 ? (
        <>
          {/* Table */}
          <div className={`rounded-xl border overflow-hidden ${isDark ? "border-gray-800" : "border-gray-200"}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                    <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>#</th>
                    <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Property</th>
                    <th className={`px-4 py-3 text-left font-semibold hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Location</th>
                    <th className={`px-4 py-3 text-left font-semibold hidden lg:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Owner</th>
                    <th className={`px-4 py-3 text-left font-semibold hidden lg:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Contact</th>
                    <th className={`px-4 py-3 text-right font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Price</th>
                    <th className={`px-4 py-3 text-left font-semibold hidden sm:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Date</th>
                    <th className={`px-4 py-3 text-center font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}>
                  {pagedListings.map((property, idx) => {
                    const owner = typeof property.createdBy === "object" ? property.createdBy as PropertyOwner : null;
                    const img = property.images?.[0] || "/owner.png";
                    const rowNum = (listingPage - 1) * PAGE_SIZE + idx + 1;
                    return (
                      <tr key={property._id} className={`transition-colors ${isDark ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-50"}`}>
                        <td className={`px-4 py-3 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{rowNum}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                              <Image src={img} alt={property.title} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`px-1.5 py-0.5 rounded text-xs font-semibold text-white ${property.propertyType === "PG" ? "bg-blue-600" : "bg-green-600"}`}>
                                  {property.propertyType}
                                </span>
                                {property.isVerified && (
                                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-600 text-white text-xs font-semibold rounded">
                                    <ShieldCheck className="w-2.5 h-2.5" /> Verified
                                  </span>
                                )}
                              </div>
                              <p className={`font-semibold truncate max-w-[160px] mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>{property.propertyType === "PG" ? property.pgName : property.societyName}</p>
                            </div>
                          </div>
                        </td>
                        <td className={`px-4 py-3 hidden md:table-cell ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          <div className="flex items-center gap-1 max-w-[160px]">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate text-xs">{[property.areaName, property.location].filter(Boolean).join(", ")}</span>
                          </div>
                        </td>
                        <td className={`px-4 py-3 hidden lg:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          <span className="font-medium text-xs">{owner?.fullName || "—"}</span>
                        </td>
                        <td className={`px-4 py-3 hidden lg:table-cell ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          <div className="space-y-0.5">
                            {owner?.email && <div className="flex items-center gap-1 text-xs"><Mail className="w-3 h-3" />{owner.email}</div>}
                            {owner?.phoneNumber && <div className="flex items-center gap-1 text-xs"><Phone className="w-3 h-3" />{owner.phoneNumber}</div>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-bold text-primary text-sm">{currencySymbol}{property.price.toLocaleString()}</span>
                        </td>
                        <td className={`px-4 py-3 hidden sm:table-cell text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {new Date(property.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedProperty(property)}
                              className="flex items-center gap-1 px-2.5 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-xs font-medium"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>
                            <button
                              onClick={() => {
                                const owner = typeof property.createdBy === 'object' ? property.createdBy as PropertyOwner : null;
                                setDeleteModal({ id: property._id, title: property.title, ownerEmail: owner?.email, ownerName: owner?.fullName });
                                setDeleteReason("");
                              }}
                              className={`flex items-center gap-1 px-2.5 py-1.5 border rounded-lg transition-colors text-xs font-medium ${isDark ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-300 text-red-500 hover:bg-red-50"}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalListingPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Showing {(listingPage - 1) * PAGE_SIZE + 1}–{Math.min(listingPage * PAGE_SIZE, filteredListings.length)} of {filteredListings.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setListingPage(p => Math.max(1, p - 1))}
                  disabled={listingPage === 1}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 ${isDark ? "border border-gray-700 text-gray-300 hover:bg-gray-700" : "border border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalListingPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalListingPages || Math.abs(p - listingPage) <= 1)
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
                        onClick={() => setListingPage(() => item as number)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          listingPage === item
                            ? "bg-primary text-white"
                            : isDark ? "border border-gray-700 text-gray-300 hover:bg-gray-700" : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setListingPage(p => Math.min(totalListingPages, p + 1))}
                  disabled={listingPage === totalListingPages}
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
          <Building2 className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
          <p className={isDark ? "text-gray-500" : "text-gray-500"}>{tc.noListings}</p>
        </div>
      )}
    </div>
  );
}
