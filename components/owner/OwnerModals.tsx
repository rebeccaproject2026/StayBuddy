"use client";

import { X, Trash2, Phone, Mail, MessageSquare } from "lucide-react";
import type { OwnerModalsProps } from "./types";

export default function OwnerModals({
  isDark, language, tc,
  selectedInquiry, setSelectedInquiry,
  deleteConfirmId, setDeleteConfirmId,
  deleteListing,
  getStatusColor, getStatusLabel,
}: OwnerModalsProps) {
  return (
    <>
      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedInquiry(null)} />
          <div className={`relative rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto ${isDark ? "bg-gray-900" : "bg-white"}`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-5 border-b sticky top-0 rounded-t-xl z-10 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{selectedInquiry.fullName}</h3>
                <p className="text-sm text-gray-500">{selectedInquiry.propertyTitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedInquiry.status || "new")}`}>
                  {getStatusLabel(selectedInquiry.status || "new")}
                </span>
                <button onClick={() => setSelectedInquiry(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Date */}
              <p className="text-xs text-gray-400">
                {new Date(selectedInquiry.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}{" · "}
                {new Date(selectedInquiry.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
              </p>

              {/* Contact */}
              <div className="flex flex-wrap gap-2">
                {(selectedInquiry.phone || selectedInquiry.renter?.phoneNumber) && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-800">{selectedInquiry.phone || selectedInquiry.renter?.phoneNumber}</span>
                  </div>
                )}
                {(selectedInquiry.email || selectedInquiry.renter?.email) && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-lg">
                    <Mail className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-800">{selectedInquiry.email || selectedInquiry.renter?.email}</span>
                  </div>
                )}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: language === "fr" ? "Type de chambre" : "Room Type", value: selectedInquiry.roomType },
                  { label: language === "fr" ? "Emménagement" : "Move-in Date", value: selectedInquiry.moveInDate },
                  { label: language === "fr" ? "Durée" : "Stay Duration", value: selectedInquiry.stayDuration },
                  { label: language === "fr" ? "Budget" : "Budget", value: selectedInquiry.budgetRange },
                  { label: language === "fr" ? "Profession" : "Occupation", value: selectedInquiry.occupation },
                  { label: language === "fr" ? "Genre" : "Gender", value: selectedInquiry.gender },
                  { label: language === "fr" ? "Occupants" : "Occupants", value: selectedInquiry.numberOfOccupants },
                  { label: language === "fr" ? "Alimentation" : "Food", value: selectedInquiry.foodPreference },
                  { label: language === "fr" ? "Parking" : "Parking", value: selectedInquiry.needParking },
                  { label: language === "fr" ? "Société/École" : "Company/College", value: selectedInquiry.companyCollege },
                ].filter(d => d.value).map((d, i) => (
                  <div key={i} className={`rounded-xl p-3 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                    <p className="text-xs text-gray-500 mb-0.5">{d.label}</p>
                    <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{d.value}</p>
                  </div>
                ))}
              </div>

              {/* Message */}
              {selectedInquiry.message && (
                <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{language === "fr" ? "Message" : "Message"}</p>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-800"}`}>{selectedInquiry.message}</p>
                </div>
              )}

              {/* Actions */}
              <div className={`flex flex-wrap gap-2 pt-2 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                {selectedInquiry.phone && (
                  <a href={`https://wa.me/${selectedInquiry.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${selectedInquiry.fullName}, regarding your inquiry for "${selectedInquiry.propertyTitle}".`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                    <MessageSquare className="w-4 h-4" />WhatsApp
                  </a>
                )}
                {selectedInquiry.phone && (
                  <a href={`tel:${selectedInquiry.phone}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    <Phone className="w-4 h-4" />{language === "fr" ? "Appeler" : "Call"}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirmId(null)} />
          <div className={`relative rounded-xl shadow-xl p-6 w-full max-w-sm ${isDark ? "bg-gray-900" : "bg-white"}`}>
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className={`text-lg font-bold text-center mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              {language === "fr" ? "Supprimer l'annonce ?" : "Delete this property?"}
            </h3>
            <p className={`text-sm text-center mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {language === "fr"
                ? "Cette action est irréversible. L'annonce sera définitivement supprimée."
                : "This action cannot be undone. The listing will be permanently removed."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)}
                className={`flex-1 px-4 py-3 rounded-xl border transition-colors text-sm font-medium ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                {language === "fr" ? "Annuler" : "Cancel"}
              </button>
              <button onClick={() => { deleteListing(deleteConfirmId); setDeleteConfirmId(null); }}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium">
                {language === "fr" ? "Supprimer" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
