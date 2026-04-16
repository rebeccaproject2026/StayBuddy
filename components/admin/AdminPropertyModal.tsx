"use client";

import Image from "next/image";
import { Eye, X, ShieldCheck, Loader2, CheckCircle, XCircle, Trash2, MapPin } from "lucide-react";
import Link from "@/components/LocalizedLink";
import { AdminProperty, PropertyOwner } from "./types";

interface AdminPropertyModalProps {
  isDark: boolean;
  viewingRequest: AdminProperty;
  currencySymbol: string;
  actioningId: string | null;
  deletingId: string | null;
  setViewingRequest: (r: AdminProperty | null) => void;
  setViewingDoc: (url: string | null) => void;
  handlePropertyAction: (propertyId: string, action: 'approve' | 'reject' | 'verify') => void;
  setRejectModal: (v: { id: string; title: string; ownerEmail?: string; ownerName?: string } | null) => void;
  setRejectReason: (v: string) => void;
  handleDeleteRejectedRequest: (propertyId: string) => void;
}

export default function AdminPropertyModal({
  isDark,
  viewingRequest,
  currencySymbol,
  actioningId,
  deletingId,
  setViewingRequest,
  setViewingDoc,
  handlePropertyAction,
  setRejectModal,
  setRejectReason,
  handleDeleteRejectedRequest,
}: AdminPropertyModalProps) {
  const req = viewingRequest;
  const owner = typeof req.createdBy === "object" ? req.createdBy as PropertyOwner : null;
  const hasDocs = (req.verificationImages?.length ?? 0) > 0;
  const isActioning = actioningId === req._id;
  const amenities = req.propertyType === "PG" ? (req.commonAmenities || []) : (req.societyAmenities || []);
  const description = req.pgDescription || req.localityDescription || "";
  const statusStyle = req.approvalStatus === "pending"
    ? isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700"
    : req.approvalStatus === "approved"
    ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"
    : isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700";

  const Row = ({ label, value }: { label: string; value?: string | number | null }) =>
    value != null && value !== "" ? (
      <div className="flex justify-between py-2 border-b last:border-0 border-gray-100 dark:border-gray-700/50">
        <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</span>
        <span className={`text-xs font-semibold text-right max-w-[55%] ${isDark ? "text-white" : "text-gray-900"}`}>{value}</span>
      </div>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewingRequest(null)}>
      <div
        className={`w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl border flex flex-col ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className={`px-2 py-0.5 rounded text-xs font-bold text-white flex-shrink-0 ${req.propertyType === "PG" ? "bg-blue-600" : "bg-green-600"}`}>{req.propertyType}</span>
            <h2 className={`text-base font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{req.societyName || req.title}</h2>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${statusStyle}`}>{req.approvalStatus}</span>
            {req.isVerified && <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-600 text-white text-xs font-semibold rounded-full flex-shrink-0"><ShieldCheck className="w-3 h-3" /> Verified</span>}
          </div>
          <button onClick={() => setViewingRequest(null)} className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ml-2 ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image gallery */}
        {req.images?.length > 0 && (
          <div className="flex gap-2 overflow-x-auto p-3 scrollbar-hide flex-shrink-0">
            {req.images.map((img, i) => (
              <button key={i} onClick={() => setViewingDoc(img)} className="relative flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden bg-gray-200 group">
                <Image src={img} alt={`Image ${i + 1}`} fill className="object-cover group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <Eye className="w-4 h-4 text-white" />
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="p-5 space-y-5">
          {/* Two-column layout */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Left: Core details */}
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Property Details</p>
              <Row label="Category" value={req.category} />
              <Row label="BHK" value={req.bhk} />
              <Row label="Flats in Project" value={req.flatsInProject} />
              <Row label="Price" value={`${currencySymbol}${req.price?.toLocaleString()} / month`} />
              <Row label="Deposit" value={req.deposit ? `${currencySymbol}${req.deposit?.toLocaleString()}` : null} />
              <Row label="Rooms" value={req.rooms} />
              <Row label="Bathrooms" value={req.bathrooms} />
              <Row label="Balcony" value={req.balcony} />
              <Row label="Area" value={req.area ? `${req.area} m²` : (req.areaMin || req.areaMax) ? `${req.areaMin || "—"} – ${req.areaMax || "—"} m²` : null} />
              <Row label="Available From" value={req.availableFrom} />
              <Row label="Rental Period" value={req.rentalPeriod} />
              <Row label="PG For" value={req.pgFor || req.preferredGender} />
              <Row label="Furnishing" value={Array.isArray(req.furnishing) ? req.furnishing.join(", ") : null} />
              <Row label="Facing" value={req.facing} />
              <Row label="Floor" value={req.floorNumber != null ? `${req.floorNumber} / ${req.totalFloors ?? "?"}` : null} />
              <Row label="Maintenance" value={req.maintenanceCharges ? `${currencySymbol}${req.maintenanceCharges}${req.maintenanceType ? ` / ${req.maintenanceType}` : ""}` : null} />
              <Row label="Society Name" value={req.societyName} />
              <Row label="Submitted" value={new Date(req.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
            </div>

            {/* Right: Location + Owner */}
            <div className="space-y-4">
              <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Location</p>
                <Row label="Full Address" value={req.fullAddress} />
                <Row label="Area" value={req.areaName} />
                <Row label="City / Location" value={req.location} />
                <Row label="State" value={req.state} />
                <Row label="Pincode" value={req.pincode} />
                <Row label="Landmark" value={req.landmark} />
                {req.latitude && req.longitude && (
                  <div className="pt-2">
                    <a href={`https://www.google.com/maps?q=${req.latitude},${req.longitude}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                      <MapPin className="w-3.5 h-3.5" /> View on Google Maps
                    </a>
                  </div>
                )}
              </div>

              {owner && (
                <div className={`rounded-xl p-4 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-100"}`}>
                  <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-blue-600"}`}>Owner</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{owner.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>{owner.email}</span>
                    </div>
                    {owner.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>{owner.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>Joined {new Date(owner.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Room Details — PG */}
          {req.propertyType === "PG" && req.roomDetails && Object.keys(req.roomDetails).length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Price by Room Type</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.entries(req.roomDetails).map(([category, detail]) => (
                  <div key={category} className={`rounded-xl p-3 border ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{category} Bed</span>
                      <span className="text-sm font-bold text-primary">{currencySymbol}{Number(detail.monthlyRent).toLocaleString()}<span className={`text-xs font-normal ${isDark ? "text-gray-400" : "text-gray-500"}`}>/mo</span></span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className={isDark ? "text-gray-400" : "text-gray-500"}>Total Beds</span>
                        <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>{detail.totalBeds ?? detail.totalRooms ?? "—"}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className={isDark ? "text-gray-400" : "text-gray-500"}>Available</span>
                        <span className="font-medium text-green-500">{detail.availableBeds ?? detail.availableRooms ?? "—"}</span>
                      </div>
                      {detail.securityDeposit && Number(detail.securityDeposit) > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className={isDark ? "text-gray-400" : "text-gray-500"}>Deposit</span>
                          <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>{currencySymbol}{Number(detail.securityDeposit).toLocaleString()}</span>
                        </div>
                      )}
                      {detail.facilities && detail.facilities.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {detail.facilities.map((f, i) => (
                            <span key={i} className={`px-1.5 py-0.5 rounded text-[10px] capitalize ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{f}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Room Details — Tenant /fr */}
          {req.propertyType === "Tenant" && req.country === "fr" && req.tenantRooms && req.tenantRooms.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Room Details</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {req.tenantRooms.map((room, i) => {
                  const max = parseInt(room.maxPersons || "1") || 1;
                  const current = parseInt(room.currentPersons || "0") || 0;
                  const statusColor = room.status === "Available" ? "bg-green-500/15 text-green-400 border-green-500/30" : room.status === "Partial" ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" : "bg-red-500/15 text-red-400 border-red-500/30";
                  const statusColorLight = room.status === "Available" ? "bg-green-50 text-green-700 border-green-200" : room.status === "Partial" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-red-50 text-red-600 border-red-200";
                  return (
                    <div key={room.id || i} className={`rounded-xl p-3 border ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{room.name || `Room ${i + 1}`}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${isDark ? statusColor : statusColorLight}`}>{room.status || "Available"}</span>
                      </div>
                      <div className="space-y-1">
                        {room.rent && (
                          <div className="flex justify-between text-xs">
                            <span className={isDark ? "text-gray-400" : "text-gray-500"}>Monthly Rent</span>
                            <span className="font-bold text-primary">{currencySymbol}{Number(room.rent).toLocaleString()}<span className={`font-normal ${isDark ? "text-gray-400" : "text-gray-500"}`}>/mo</span></span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs">
                          <span className={isDark ? "text-gray-400" : "text-gray-500"}>Occupancy</span>
                          <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>{current} / {max} persons</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Amenities</p>
              <div className="flex flex-wrap gap-2">
                {amenities.map((a, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? "bg-gray-700 text-gray-300" : "bg-white border border-gray-200 text-gray-700"}`}>{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Rooms */}
          {req.propertyType === "Tenant" && req.additionalRooms && req.additionalRooms.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Additional Rooms</p>
              <div className="flex flex-wrap gap-2">
                {req.additionalRooms.map((r, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${isDark ? "bg-gray-700 text-gray-300" : "bg-white border border-gray-200 text-gray-700"}`}>{r.replace(/([A-Z])/g, " $1").trim()}</span>
                ))}
              </div>
            </div>
          )}

          {/* Overlooking */}
          {req.propertyType === "Tenant" && req.overlooking && req.overlooking.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Overlooking</p>
              <div className="flex flex-wrap gap-2">
                {req.overlooking.map((o, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${isDark ? "bg-gray-700 text-gray-300" : "bg-white border border-gray-200 text-gray-700"}`}>{o.replace(/([A-Z])/g, " $1").trim()}</span>
                ))}
              </div>
            </div>
          )}

          {/* Tenants Preferred */}
          {req.propertyType === "Tenant" && req.tenantsPrefer && req.tenantsPrefer.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Tenants Preferred</p>
              <div className="flex flex-wrap gap-2">
                {req.tenantsPrefer.map((t, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${isDark ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary border border-primary/20"}`}>{t.replace(/([A-Z])/g, " $1").trim()}</span>
                ))}
              </div>
            </div>
          )}

          {/* Rules */}
          {(req.pgRules?.length || Object.keys(req.rules || {}).length > 0) && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Rules</p>
              <div className="flex flex-wrap gap-2">
                {req.pgRules?.map((r, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-700 border border-red-200"}`}>{r}</span>
                ))}
                {Object.entries(req.rules || {}).map(([k, v]) => (
                  <span key={k} className={`px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? "bg-gray-700 text-gray-300" : "bg-white border border-gray-200 text-gray-700"}`}>{k}: {v}</span>
                ))}
              </div>
            </div>
          )}

          {/* Nearby places */}
          {req.nearbyPlaces && req.nearbyPlaces.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Nearby Places</p>
              <div className="flex flex-wrap gap-2">
                {req.nearbyPlaces.map((p, i) => (
                  <span key={i} className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? "bg-gray-700 text-gray-300" : "bg-white border border-gray-200 text-gray-700"}`}>
                    <MapPin className="w-3 h-3" />
                    {typeof p === "string" ? p : `${p.name}${p.distance ? ` · ${p.distance}` : ""}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Description</p>
              <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{description}</p>
            </div>
          )}

          {/* Verification documents */}
          <div className={`rounded-xl p-4 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-xs font-bold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>Verification Documents</p>
              {hasDocs
                ? <span className="flex items-center gap-1 text-xs text-green-500 font-semibold"><ShieldCheck className="w-3.5 h-3.5" /> {req.verificationImages!.length} uploaded</span>
                : <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>None uploaded</span>
              }
            </div>
            {hasDocs && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {req.verificationImages!.map((url, i) => (
                  <button key={i} type="button" onClick={e => { e.stopPropagation(); setViewingDoc(url); }}
                    className="group relative h-20 rounded-lg overflow-hidden bg-gray-200 cursor-pointer">
                    <Image src={url} alt={`Doc ${i + 1}`} fill className="object-cover group-hover:opacity-75 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            {req.approvalStatus === "pending" && (
              <>
                <button onClick={() => handlePropertyAction(req._id, "approve")} disabled={isActioning}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-semibold disabled:opacity-60">
                  {isActioning ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Approve
                </button>
                <button onClick={() => { setRejectModal({ id: req._id, title: req.title, ownerEmail: owner?.email, ownerName: owner?.fullName }); setRejectReason(""); }}
                  disabled={isActioning}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-semibold disabled:opacity-60">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </>
            )}
            {req.approvalStatus === "approved" && !req.isVerified && (
              <button onClick={() => handlePropertyAction(req._id, "verify")} disabled={isActioning}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-semibold disabled:opacity-60">
                {isActioning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />} Mark as Verified
              </button>
            )}
            {req.approvalStatus === "approved" && req.isVerified && (
              <div className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl text-sm font-semibold">
                <ShieldCheck className="w-4 h-4" /> Property Verified
              </div>
            )}
            {req.approvalStatus === "rejected" && (
              <button onClick={() => handleDeleteRejectedRequest(req._id)} disabled={deletingId === req._id}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-semibold disabled:opacity-60">
                {deletingId === req._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete Listing
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
