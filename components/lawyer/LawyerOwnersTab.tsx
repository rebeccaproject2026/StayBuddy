"use client";

import { useState, useEffect } from "react";
import {
  Search, Loader2, Building2, CheckCircle, XCircle,
  Calendar, Users, ArrowLeft, Home, MapPin, Tag, ExternalLink, ImageOff,
  ChevronRight, Send, Clock, FileText,
} from "lucide-react";
import { getToken } from "@/lib/token-storage";
import { useParams } from "next/navigation";

interface Owner {
  _id: string;
  fullName: string;
  email: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  profileImage?: string;
}

interface Property {
  _id: string;
  title: string;
  propertyType: "PG" | "Tenant";
  location: string;
  areaName?: string;
  price: number;
  images: string[];
  approvalStatus: string;
  isVerified?: boolean;
  createdAt: string;
  pgName?: string;
  societyName?: string;
  category?: string;
}

interface LawyerOwnersTabProps {
  isDark: boolean;
  owners: Owner[];
  loading: boolean;
  onCreateContract: () => void;
}

const statusBadge = (status: string, isDark: boolean) => {
  const map: Record<string, string> = {
    approved: isDark ? "bg-green-500/15 text-green-400" : "bg-green-100 text-green-700",
    pending:  isDark ? "bg-yellow-500/15 text-yellow-400" : "bg-yellow-100 text-yellow-700",
    rejected: isDark ? "bg-red-500/15 text-red-400" : "bg-red-100 text-red-700",
  };
  return map[status] ?? (isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500");
};

export default function LawyerOwnersTab({ isDark, owners, loading, onCreateContract }: LawyerOwnersTabProps) {
  const params = useParams();
  const country = (params?.country as string) || "in";

  const [search, setSearch] = useState("");
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [propsLoading, setPropsLoading] = useState(false);

  // Track sent requests: ownerId -> 'pending' | 'accepted' | 'rejected'
  const [requestMap, setRequestMap] = useState<Record<string, string>>({});
  const [sendingId, setSendingId] = useState<string | null>(null);

  // Load existing requests on mount
  useEffect(() => {
    const token = getToken();
    fetch("/api/lawyer-requests", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const map: Record<string, string> = {};
          for (const req of data.requests) map[req.owner] = req.status;
          setRequestMap(map);
        }
      })
      .catch(() => {});
  }, []);

  const handleSendRequest = async (e: React.MouseEvent, ownerId: string) => {
    e.stopPropagation(); // don't trigger row click
    setSendingId(ownerId);
    try {
      const token = getToken();
      const res = await fetch("/api/lawyer-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ownerId }),
      });
      const data = await res.json();
      if (data.success) {
        setRequestMap((prev) => ({ ...prev, [ownerId]: data.request.status }));
      }
    } catch {}
    finally { setSendingId(null); }
  };

  const filtered = owners.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.fullName.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q)
    );
  });

  const handleOwnerClick = async (owner: Owner) => {
    setSelectedOwner(owner);
    setProperties([]);
    setPropsLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`/api/lawyer/owners/${owner._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) setProperties(data.properties);
    } catch {}
    finally { setPropsLoading(false); }
  };

  // ── Properties view (replaces table) ──────────────────────────────────────
  if (selectedOwner) {
    const initials = selectedOwner.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

    return (
      <div className="space-y-5">
        {/* Back header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSelectedOwner(null); setProperties([]); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Owners
          </button>

          {/* Owner chip */}
          <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
              {selectedOwner.profileImage
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={selectedOwner.profileImage} alt={selectedOwner.fullName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                : initials}
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{selectedOwner.fullName}</p>
              <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>{selectedOwner.email}</p>
            </div>
          </div>
        </div>

        {/* Section title */}
        <div>
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {propsLoading ? "Loading properties…" : `${properties.length} Propert${properties.length !== 1 ? "ies" : "y"}`}
          </h3>
          <p className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            All listings posted by this owner
          </p>
        </div>

        {/* Properties */}
        {propsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          </div>
        ) : properties.length === 0 ? (
          <div className={`rounded-2xl border p-16 text-center ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <Home className={`w-14 h-14 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
            <p className={`font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>No properties posted yet</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {properties.map((prop) => (
              <div
                key={prop._id}
                className={`rounded-2xl border overflow-hidden flex flex-col transition-shadow hover:shadow-md ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}
              >
                {/* Image */}
                <div className={`h-36 w-full overflow-hidden flex-shrink-0 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                  {prop.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className={`w-8 h-8 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-semibold text-sm leading-snug line-clamp-2 flex-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                      {prop.pgName || prop.societyName || prop.title}
                    </p>
                    <a
                      href={`/${country}/property/${prop._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-400 hover:text-gray-700"}`}
                      title="Open property page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className={`flex items-center gap-1 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{prop.areaName || prop.location}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mt-auto pt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${prop.propertyType === "PG" ? isDark ? "bg-blue-500/15 text-blue-400" : "bg-blue-100 text-blue-700" : isDark ? "bg-purple-500/15 text-purple-400" : "bg-purple-100 text-purple-700"}`}>
                      {prop.propertyType}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusBadge(prop.approvalStatus, isDark)}`}>
                      {prop.approvalStatus}
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-semibold ml-auto ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      <Tag className="w-3 h-3" />
                      ₹{prop.price?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Owners table ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Property Owners
          </h2>
          <p className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            All registered landlords in India — click a row to view their listings
          </p>
        </div>
        <div className={`relative w-full sm:w-72 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or phone..."
            className={`w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-primary transition-all ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
            }`}
          />
        </div>
      </div>

      {!loading && (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium w-fit ${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
          <Users className="w-4 h-4" />
          {filtered.length} owner{filtered.length !== 1 ? "s" : ""}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
        </div>
      ) : filtered.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <Building2 className={`w-14 h-14 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
          <p className={`font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {search ? "No owners match your search" : "No owners found"}
          </p>
        </div>
      ) : (
        <div className={`rounded-2xl border overflow-hidden ${isDark ? "border-gray-800" : "border-gray-200 shadow-sm"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <th className={`px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>#</th>
                  <th className={`px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>Owner</th>
                  <th className={`px-4 py-3 text-center font-semibold text-xs uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>Verified</th>
                  <th className={`px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide hidden lg:table-cell ${isDark ? "text-gray-400" : "text-gray-500"}`}>Joined</th>
                  <th className={`px-4 py-3 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}>
                {filtered.map((owner, idx) => {
                  const initials = owner.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
                  return (
                    <tr
                      key={owner._id}
                      onClick={() => handleOwnerClick(owner)}
                      className={`cursor-pointer transition-colors ${isDark ? "bg-gray-900 hover:bg-gray-800/70" : "bg-white hover:bg-primary/5"}`}
                    >
                      <td className={`px-4 py-3.5 text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}>{idx + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden ${owner.isBlocked ? "bg-red-500" : "bg-primary"}`}>
                            {owner.profileImage
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={owner.profileImage} alt={owner.fullName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                              : initials}
                          </div>
                          <div className="min-w-0">
                            <p className={`font-semibold text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>{owner.fullName}</p>
                            {owner.isBlocked && <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold">Blocked</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {owner.isVerified
                          ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                          : <XCircle className="w-4 h-4 text-gray-400 mx-auto" />}
                      </td>
                      <td className={`px-4 py-3.5 hidden lg:table-cell ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0 opacity-50" />
                          {new Date(owner.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right pr-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Send Request button */}
                          {(() => {
                            const status = requestMap[owner._id];
                            if (status === "pending") {
                              return (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${isDark ? "bg-yellow-500/15 text-yellow-400" : "bg-yellow-100 text-yellow-700"}`}>
                                  <Clock className="w-3.5 h-3.5" /> Pending
                                </span>
                              );
                            }
                            if (status === "accepted") {
                              return (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onCreateContract(); }}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    isDark
                                      ? "bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white"
                                      : "bg-green-100 text-green-700 hover:bg-green-500 hover:text-white"
                                  }`}
                                >
                                  <FileText className="w-3.5 h-3.5" /> Create Contract
                                </button>
                              );
                            }
                            if (status === "rejected") {
                              return (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${isDark ? "bg-red-500/15 text-red-400" : "bg-red-100 text-red-700"}`}>
                                  <XCircle className="w-3.5 h-3.5" /> Rejected
                                </span>
                              );
                            }
                            return (
                              <button
                                onClick={(e) => handleSendRequest(e, owner._id)}
                                disabled={sendingId === owner._id}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60 ${
                                  isDark
                                    ? "bg-primary/20 text-primary hover:bg-primary hover:text-white"
                                    : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                }`}
                              >
                                {sendingId === owner._id
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  : <Send className="w-3.5 h-3.5" />}
                                Send Request
                              </button>
                            );
                          })()}
                          <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
