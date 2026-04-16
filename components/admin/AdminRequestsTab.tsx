"use client";

import Image from "next/image";
import {
  Filter,
  Loader2,
  ClipboardList,
  MapPin,
  Phone,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Trash2,
  Clock,
  CheckCheck,
  XOctagon,
} from "lucide-react";
import { AdminProperty, PropertyOwner } from "./types";

interface AdminRequestsTabProps {
  isDark: boolean;
  currentCountry: string;
  requestFilter: string;
  setRequestFilter: (v: string) => void;
  requestsLoading: boolean;
  requests: AdminProperty[];
  actioningId: string | null;
  deletingId: string | null;
  currencySymbol: string;
  fetchRequests: () => void;
  setViewingRequest: (r: AdminProperty | null) => void;
  handlePropertyAction: (propertyId: string, action: 'approve' | 'reject' | 'verify') => void;
  setRejectModal: (v: { id: string; title: string; ownerEmail?: string; ownerName?: string } | null) => void;
  setRejectReason: (v: string) => void;
  handleDeleteRejectedRequest: (propertyId: string) => void;
}

export default function AdminRequestsTab({
  isDark,
  currentCountry,
  requestFilter,
  setRequestFilter,
  requestsLoading,
  requests,
  actioningId,
  deletingId,
  currencySymbol,
  fetchRequests,
  setViewingRequest,
  handlePropertyAction,
  setRejectModal,
  setRejectReason,
  handleDeleteRejectedRequest,
}: AdminRequestsTabProps) {
  const filtered = requests.filter(r => requestFilter === "all" || r.approvalStatus === requestFilter);

  return (
    <div className="space-y-4 mb-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className={`text-lg sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Property Requests</h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Review and approve new property listing submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRequests}
            disabled={requestsLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm transition-colors disabled:opacity-50 ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}
          >
            <Loader2 className={`w-3.5 h-3.5 ${requestsLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Filter className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          <select
            value={requestFilter}
            onChange={e => setRequestFilter(e.target.value)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: "Pending", count: requests.filter(r => r.approvalStatus === "pending").length, icon: Clock, color: "text-yellow-400", bg: isDark ? "bg-yellow-500/10 border-yellow-500/20" : "bg-yellow-50 border-yellow-200" },
          { label: "Approved", count: requests.filter(r => r.approvalStatus === "approved").length, icon: CheckCheck, color: "text-green-400", bg: isDark ? "bg-green-500/10 border-green-500/20" : "bg-green-50 border-green-200" },
          { label: "Rejected", count: requests.filter(r => r.approvalStatus === "rejected").length, icon: XOctagon, color: "text-red-400", bg: isDark ? "bg-red-500/10 border-red-500/20" : "bg-red-50 border-red-200" },
        ].map(({ label, count, icon: Icon, color, bg }) => (
          <div key={label} className={`rounded-xl p-3 sm:p-4 border flex items-center gap-2 sm:gap-3 ${bg}`}>
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${color}`} />
            <div>
              <p className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{count}</p>
              <p className={`text-[10px] sm:text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {requestsLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
        </div>
      ) : filtered.length > 0 ? (
        <>
          {/* Desktop table */}
          <div className={`hidden sm:block rounded-xl border overflow-hidden ${isDark ? "border-gray-800" : "border-gray-200"}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className={`border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                    <th className={`px-3 py-3 text-left font-semibold text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>#</th>
                    <th className={`px-3 py-3 text-left font-semibold text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>Property</th>
                    <th className={`px-3 py-3 text-left font-semibold text-xs hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Owner</th>
                    <th className={`px-3 py-3 text-left font-semibold text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>Location</th>
                    <th className={`px-3 py-3 text-right font-semibold text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>Price</th>
                    <th className={`px-3 py-3 text-center font-semibold text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>Status</th>
                    <th className={`px-3 py-3 text-center font-semibold text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}>
                  {filtered.map((req, idx) => {
                    const owner = typeof req.createdBy === "object" ? req.createdBy as PropertyOwner : null;
                    const img = req.images?.[0] || "/owner.png";
                    const isActioning = actioningId === req._id;
                    const statusStyle = req.approvalStatus === "pending" ? isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700" : req.approvalStatus === "approved" ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700" : isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700";
                    return (
                      <tr key={req._id} className={`transition-colors ${isDark ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-50"}`}>
                        <td className={`px-3 py-3 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{idx + 1}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative w-9 h-9 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                              <Image src={img} alt={req.title} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold text-white ${req.propertyType === "PG" ? "bg-blue-600" : "bg-green-600"}`}>{req.propertyType}</span>
                              <p className={`font-semibold text-xs truncate max-w-[120px] mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>{req.propertyType === "PG" ? req.pgName : req.societyName}</p>
                            </div>
                          </div>
                        </td>
                        <td className={`px-3 py-3 hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          <p className="text-xs font-medium truncate max-w-[100px]">{owner?.fullName || "—"}</p>
                          <p className={`text-[10px] truncate max-w-[100px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>{owner?.email}</p>
                        </td>
                        <td className={`px-3 py-3 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate max-w-[100px]">{[req.areaName, req.location].filter(Boolean).join(", ")}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="font-bold text-primary text-xs">{currencySymbol}{req.price.toLocaleString()}</span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusStyle}`}>{req.approvalStatus}</span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            <button onClick={() => setViewingRequest(req)} className="flex items-center gap-1 px-2 py-1 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-[10px] font-medium">
                              <Eye className="w-3 h-3" /> View
                            </button>
                            {req.approvalStatus === "pending" && (<>
                              <button onClick={() => handlePropertyAction(req._id, "approve")} disabled={isActioning} className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-[10px] font-medium disabled:opacity-60">
                                {isActioning ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />} OK
                              </button>
                              <button onClick={() => {
                                const owner = typeof req.createdBy === "object" ? req.createdBy as PropertyOwner : null;
                                setRejectModal({ id: req._id, title: req.title, ownerEmail: owner?.email, ownerName: owner?.fullName });
                                setRejectReason("");
                              }} disabled={isActioning} className={`flex items-center gap-1 px-2 py-1 border rounded-lg transition-colors text-[10px] font-medium disabled:opacity-60 ${isDark ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-300 text-red-500 hover:bg-red-50"}`}>
                                <XCircle className="w-3 h-3" /> No
                              </button>
                            </>)}
                            {req.approvalStatus === "approved" && !req.isVerified && (
                              <button onClick={() => handlePropertyAction(req._id, "verify")} disabled={isActioning} className="flex items-center gap-1 px-2 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-[10px] font-medium disabled:opacity-60">
                                {isActioning ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />} Verify
                              </button>
                            )}
                            {req.approvalStatus === "approved" && req.isVerified && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-emerald-600/20 text-emerald-400 rounded-lg text-[10px] font-medium">
                                <ShieldCheck className="w-3 h-3" /> ✓
                              </span>
                            )}
                            {req.approvalStatus === "rejected" && (
                              <button
                                onClick={() => handleDeleteRejectedRequest(req._id)}
                                disabled={deletingId === req._id}
                                className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-[10px] font-medium disabled:opacity-60"
                              >
                                {deletingId === req._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {filtered.map((req) => {
              const owner = typeof req.createdBy === "object" ? req.createdBy as PropertyOwner : null;
              const img = req.images?.[0] || "/owner.png";
              const isActioning = actioningId === req._id;
              const statusStyle = req.approvalStatus === "pending" ? isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700" : req.approvalStatus === "approved" ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700" : isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700";
              return (
                <div key={req._id} className={`rounded-xl border p-4 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
                      <Image src={img} alt={req.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold text-white ${req.propertyType === "PG" ? "bg-blue-600" : "bg-green-600"}`}>{req.propertyType}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusStyle}`}>{req.approvalStatus}</span>
                      </div>
                      <p className={`font-semibold text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>{req.title}</p>
                      <p className="font-bold text-primary text-sm">{currencySymbol}{req.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={`space-y-1.5 mb-3 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {owner && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 flex-shrink-0" /><span className="truncate">{owner.fullName}</span></div>}
                    <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 flex-shrink-0" /><span className="truncate">{[req.areaName, req.location].filter(Boolean).join(", ")}</span></div>
                    <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 flex-shrink-0" /><span>{new Date(req.createdAt).toLocaleDateString()}</span></div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setViewingRequest(req)} className="flex items-center gap-1.5 px-3 py-2 border border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-colors text-xs font-semibold">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    {req.approvalStatus === "pending" && (<>
                      <button onClick={() => handlePropertyAction(req._id, "approve")} disabled={isActioning} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-xs font-semibold disabled:opacity-60">
                        {isActioning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />} Approve
                      </button>
                      <button onClick={() => {
                        const owner = typeof req.createdBy === "object" ? req.createdBy as PropertyOwner : null;
                        setRejectModal({ id: req._id, title: req.title, ownerEmail: owner?.email, ownerName: owner?.fullName });
                        setRejectReason("");
                      }} disabled={isActioning} className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl transition-colors text-xs font-semibold disabled:opacity-60 ${isDark ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-300 text-red-500 hover:bg-red-50"}`}>
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>)}
                    {req.approvalStatus === "approved" && !req.isVerified && (
                      <button onClick={() => handlePropertyAction(req._id, "verify")} disabled={isActioning} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-xs font-semibold disabled:opacity-60">
                        {isActioning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />} Verify
                      </button>
                    )}
                    {req.approvalStatus === "approved" && req.isVerified && (
                      <span className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/20 text-emerald-400 rounded-xl text-xs font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                    {req.approvalStatus === "rejected" && (
                      <button
                        onClick={() => handleDeleteRejectedRequest(req._id)}
                        disabled={deletingId === req._id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-xs font-semibold disabled:opacity-60"
                      >
                        {deletingId === req._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className={`rounded-xl p-10 text-center border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <ClipboardList className={`w-12 h-12 mx-auto mb-3 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
          <p className={`font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>No property requests</p>
          <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>New submissions will appear here for review</p>
        </div>
      )}
    </div>
  );
}
