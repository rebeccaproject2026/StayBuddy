"use client";

import Image from "next/image";
import {
  X, Eye, Trash2, ShieldCheck, AlertTriangle, Ban, XCircle, Loader2, Users, Mail, Phone,
} from "lucide-react";
import Link from "@/components/LocalizedLink";
import { AdminProperty, PropertyOwner } from "./types";

interface AdminModalsProps {
  isDark: boolean;
  currencySymbol: string;
  // selectedProperty sidebar
  selectedProperty: AdminProperty | null;
  setSelectedProperty: (p: AdminProperty | null) => void;
  setDeleteConfirmId: (id: string | null) => void;
  setViewingDoc: (url: string | null) => void;
  // delete modal
  deleteModal: { id: string; title: string; ownerEmail?: string; ownerName?: string } | null;
  setDeleteModal: (v: { id: string; title: string; ownerEmail?: string; ownerName?: string } | null) => void;
  deleteReason: string;
  setDeleteReason: (v: string) => void;
  deleteSubmitting: boolean;
  handleDeleteProperty: (propertyId: string, reason: string) => void;
  // reject modal
  rejectModal: { id: string; title: string; ownerEmail?: string; ownerName?: string } | null;
  setRejectModal: (v: { id: string; title: string; ownerEmail?: string; ownerName?: string } | null) => void;
  rejectReason: string;
  setRejectReason: (v: string) => void;
  rejectSubmitting: boolean;
  handleRejectSubmit: () => void;
  // block modal
  blockModal: { userId: string; userName: string; email: string } | null;
  setBlockModal: (v: { userId: string; userName: string; email: string } | null) => void;
  blockReason: string;
  setBlockReason: (v: string) => void;
  blockSubmitting: boolean;
  handleBlockSubmit: () => void;
  // document lightbox
  viewingDoc: string | null;
}

export default function AdminModals({
  isDark,
  currencySymbol,
  selectedProperty,
  setSelectedProperty,
  setDeleteConfirmId,
  setViewingDoc,
  deleteModal,
  setDeleteModal,
  deleteReason,
  setDeleteReason,
  deleteSubmitting,
  handleDeleteProperty,
  rejectModal,
  setRejectModal,
  rejectReason,
  setRejectReason,
  rejectSubmitting,
  handleRejectSubmit,
  blockModal,
  setBlockModal,
  blockReason,
  setBlockReason,
  blockSubmitting,
  handleBlockSubmit,
  viewingDoc,
}: AdminModalsProps) {
  return (
    <>
      {/* Property Detail Sidebar (selectedProperty) */}
      {selectedProperty && (() => {
        const prop = selectedProperty;
        const owner = typeof prop.createdBy === "object" ? prop.createdBy as PropertyOwner : null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProperty(null)}>
            <div
              className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
              onClick={e => e.stopPropagation()}
            >
              <div className={`flex items-center justify-between p-5 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex items-center gap-3">
                  <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{prop.title}</h2>
                  {prop.isVerified && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-600 text-white text-xs font-semibold rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <button onClick={() => setSelectedProperty(null)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {prop.images?.[0] && (
                <div className="relative h-56 w-full">
                  <Image src={prop.images[0]} alt={prop.title} fill className="object-cover" />
                </div>
              )}

              <div className="p-5 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Type", value: prop.propertyType },
                    { label: "Category", value: prop.category || "—" },
                    { label: "Price", value: `${currencySymbol}${prop.price.toLocaleString()}/mo` },
                    { label: "Rooms", value: prop.rooms },
                    { label: "Posted by", value: prop.posterType || "—" },
                    { label: "Listed on", value: new Date(prop.createdAt).toLocaleDateString() },
                  ].map(({ label, value }) => (
                    <div key={label} className={`p-3 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                      <p className={`text-xs mb-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
                      <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{String(value)}</p>
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Address</p>
                  <p className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    {[prop.fullAddress, prop.areaName, prop.location, prop.state, prop.pincode].filter(Boolean).join(", ")}
                  </p>
                  {prop.landmark && (
                    <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Landmark: {prop.landmark}</p>
                  )}
                </div>

                {owner && (
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-100"}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-blue-600"}`}>Owner Information</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-blue-500"}`} />
                        <span className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{owner.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-blue-500"}`} />
                        <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{owner.email}</span>
                      </div>
                      {owner.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-blue-500"}`} />
                          <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{owner.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {prop.pgDescription && (
                  <div className={`p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Description</p>
                    <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{prop.pgDescription}</p>
                  </div>
                )}

                <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className={`w-4 h-4 ${prop.isVerified ? "text-emerald-500" : isDark ? "text-gray-400" : "text-gray-400"}`} />
                    <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>Verification Documents</p>
                    {prop.isVerified && <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs font-semibold rounded-full">Verified</span>}
                  </div>
                  {(prop.verificationImages?.length ?? 0) > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {prop.verificationImages!.map((url, i) => (
                        <button key={i} type="button" onClick={e => { e.stopPropagation(); setViewingDoc(url); }}
                          className="group relative h-20 rounded-lg overflow-hidden bg-gray-200 block cursor-pointer" title="Click to view document">
                          <Image src={url} alt={`Document ${i + 1}`} fill className="object-cover group-hover:opacity-75 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>No verification documents uploaded.</p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Link
                    href={`/property/${prop._id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-colors text-sm font-medium"
                    onClick={() => setSelectedProperty(null)}
                  >
                    <Eye className="w-4 h-4" /> View Public Page
                  </Link>
                  <button
                    onClick={() => { setSelectedProperty(null); setDeleteConfirmId(prop._id); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Reject Property Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => !rejectSubmitting && setRejectModal(null)}>
          <div className={`w-full max-w-md rounded-xl shadow-2xl border overflow-hidden ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`} onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>Reject Property</h3>
                  <p className={`text-xs mt-0.5 truncate max-w-[220px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>{rejectModal.title}</p>
                </div>
              </div>
              <button onClick={() => !rejectSubmitting && setRejectModal(null)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-200"}`}>
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className={`text-xs leading-relaxed ${isDark ? "text-red-300" : "text-red-700"}`}>
                  This will reject the listing and notify <strong>{rejectModal.ownerName || rejectModal.ownerEmail || 'the owner'}</strong> by email with your reason.
                </p>
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Reason for rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g. Incomplete information, duplicate listing, inappropriate content..."
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200 placeholder-gray-400"}`}
                />
                <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{rejectReason.length}/500</p>
              </div>
            </div>
            <div className={`flex gap-3 px-6 py-4 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <button onClick={() => !rejectSubmitting && setRejectModal(null)} disabled={rejectSubmitting}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
                Cancel
              </button>
              <button onClick={handleRejectSubmit} disabled={!rejectReason.trim() || rejectSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all active:scale-95">
                {rejectSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Rejecting...</> : <><XCircle className="w-4 h-4" /> Reject & Notify</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block User Modal */}
      {blockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => !blockSubmitting && setBlockModal(null)}>
          <div className={`w-full max-w-md rounded-xl shadow-2xl border overflow-hidden ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`} onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
                  <Ban className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>Block User</h3>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{blockModal.userName}</p>
                </div>
              </div>
              <button onClick={() => !blockSubmitting && setBlockModal(null)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-200"}`}>
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className={`text-xs leading-relaxed ${isDark ? "text-red-300" : "text-red-700"}`}>
                  This will block the account and send an email to <strong>{blockModal.email}</strong> with the reason.
                </p>
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Reason for blocking <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Violation of terms of service, fraudulent activity, spam..."
                  value={blockReason}
                  onChange={e => setBlockReason(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
                />
                <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{blockReason.length}/500</p>
              </div>
            </div>
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${isDark ? "border-gray-800 bg-gray-800/40" : "border-gray-100 bg-gray-50"}`}>
              <button onClick={() => !blockSubmitting && setBlockModal(null)} disabled={blockSubmitting}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-200"}`}>
                Cancel
              </button>
              <button onClick={handleBlockSubmit} disabled={!blockReason.trim() || blockSubmitting}
                className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all active:scale-95">
                {blockSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                {blockSubmitting ? "Blocking..." : "Block & Notify"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Lightbox */}
      {viewingDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setViewingDoc(null)}>
          <button onClick={() => setViewingDoc(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={viewingDoc} alt="Verification document" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
          </div>
          <a href={viewingDoc} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors">
            <Eye className="w-4 h-4" /> Open original
          </a>
        </div>
      )}

      {/* Delete Listing Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-xl shadow-2xl border ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>Delete Listing</h3>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>This action cannot be undone</p>
                </div>
              </div>
              <button onClick={() => { setDeleteModal(null); setDeleteReason(""); }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className={`rounded-xl p-3 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{deleteModal.title}</p>
                {deleteModal.ownerEmail && (
                  <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Owner: {deleteModal.ownerName || deleteModal.ownerEmail}</p>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Reason for deletion <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={deleteReason}
                  onChange={e => setDeleteReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. Duplicate listing, policy violation, inaccurate information..."
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200 placeholder-gray-400"
                  }`}
                />
                {deleteModal.ownerEmail && (
                  <p className={`text-xs mt-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    An email with this reason will be sent to the owner at <span className="font-medium">{deleteModal.ownerEmail}</span>.
                  </p>
                )}
              </div>
            </div>
            <div className={`flex items-center justify-end gap-2 px-6 py-4 border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <button onClick={() => { setDeleteModal(null); setDeleteReason(""); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                Cancel
              </button>
              <button onClick={() => handleDeleteProperty(deleteModal.id, deleteReason.trim())}
                disabled={!deleteReason.trim() || deleteSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
                {deleteSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
