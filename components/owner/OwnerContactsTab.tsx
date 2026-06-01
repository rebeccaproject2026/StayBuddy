"use client";

import { Calendar, MessageSquare, Phone, Mail, Eye, ChevronDown } from "lucide-react";
import ChatWindow from "@/components/ChatWindow";
import StatusDropdown from "./StatusDropdown";
import type { OwnerContactsTabProps } from "./types";

export default function OwnerContactsTab({
  isDark, language, tc,
  contactRequests, requestsLoading,
  statusFilter, setStatusFilter,
  inquiryPage, setInquiryPage,
  INQUIRIES_PER_PAGE,
  updateInquiryStatus,
  setSelectedInquiry,
  activeChatRequestId, setActiveChatRequestId,
  socketMarkSeen, resetUnread,
  user, ownerToken, unreadByRequest,
}: OwnerContactsTabProps) {
  return (
    <div className="space-y-4">
      <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>{tc.bookingRequests}</h2>

      {/* Status filter tabs */}
      {!requestsLoading && (
        <div className="flex gap-2 mb-2 overflow-x-auto pb-1 scrollbar-hide">
          {([
            { key: "all", label: language === "fr" ? "Tous" : "All" },
            { key: "new", label: tc.statusNew },
            { key: "contacted", label: tc.statusContacted },
            { key: "interested", label: tc.statusInterested },
            { key: "booked", label: tc.statusBooked },
            { key: "closed", label: tc.statusClosed },
          ] as { key: string; label: string }[]).map(({ key, label }) => {
            const count = key === "all" ? contactRequests.length : contactRequests.filter(r => (r.status || "new") === key).length;
            const isActive = statusFilter === key;
            const tabColor: Record<string, string> = {
              all: isActive ? "bg-gray-800 text-white" : "bg-white text-gray-600 hover:bg-gray-50",
              new: isActive ? "bg-blue-600 text-white" : "bg-white text-blue-600 hover:bg-blue-50",
              contacted: isActive ? "bg-amber-500 text-white" : "bg-white text-amber-600 hover:bg-amber-50",
              interested: isActive ? "bg-violet-600 text-white" : "bg-white text-violet-600 hover:bg-violet-50",
              booked: isActive ? "bg-emerald-600 text-white" : "bg-white text-emerald-600 hover:bg-emerald-50",
              closed: isActive ? "bg-gray-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50",
            };
            return (
              <button key={key} onClick={() => { setStatusFilter(key); setInquiryPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all shadow-sm whitespace-nowrap flex-shrink-0 ${tabColor[key]} ${isActive ? "border-transparent shadow-md" : "border-gray-200"}`}>
                {label}
                {count > 0 && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-600"}`}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {requestsLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className={`rounded-xl shadow-md h-40 animate-pulse ${isDark ? "bg-gray-800" : "bg-white"}`} />
          ))}
        </div>
      ) : contactRequests.length > 0 ? (
        (() => {
          const filtered = statusFilter === "all" ? contactRequests : contactRequests.filter(r => (r.status || "new") === statusFilter);
          const totalPages = Math.ceil(filtered.length / INQUIRIES_PER_PAGE);
          const paginated = filtered.slice((inquiryPage - 1) * INQUIRIES_PER_PAGE, inquiryPage * INQUIRIES_PER_PAGE);
          return filtered.length > 0 ? (
            <>
              <div className="space-y-3 sm:space-y-4">
                {paginated.map((req: any) => (
                  <div key={req._id} className={`rounded-xl shadow-md p-4 sm:p-5 ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white"}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className={`text-sm sm:text-base font-bold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>{req.fullName}</h3>
                      <div className="flex-shrink-0">
                        <StatusDropdown
                          value={req.status || "new"}
                          onChange={(v) => updateInquiryStatus(req._id, v)}
                          options={[
                            { value: "new", label: tc.statusNew },
                            { value: "contacted", label: tc.statusContacted },
                            { value: "interested", label: tc.statusInterested },
                            { value: "booked", label: tc.statusBooked },
                            { value: "closed", label: tc.statusClosed },
                          ]}
                          isDark={isDark}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(req.phone || req.renter?.phoneNumber) && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-100 rounded-lg">
                          <Phone className="w-3 h-3 text-blue-600 flex-shrink-0" />
                          <span className="text-xs font-medium text-blue-800">{req.phone || req.renter?.phoneNumber}</span>
                        </div>
                      )}
                      {(req.email || req.renter?.email) && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 border border-purple-100 rounded-lg min-w-0">
                          <Mail className="w-3 h-3 text-purple-600 flex-shrink-0" />
                          <span className="text-xs font-medium text-purple-800 truncate max-w-[160px] sm:max-w-none">{req.email || req.renter?.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 mb-3">
                      <p className={`text-xs sm:text-sm truncate flex-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{req.propertyTitle || "—"}</p>
                      <p className={`text-xs flex-shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        {new Date(req.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}{" · "}
                        {new Date(req.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {req.phone && (
                        <a href={`https://wa.me/${req.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${req.fullName}, regarding your inquiry for "${req.propertyTitle}".`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-medium">
                          <MessageSquare className="w-3.5 h-3.5" />WhatsApp
                        </a>
                      )}
                      {req.phone && (
                        <a href={`tel:${req.phone}`}
                          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium">
                          <Phone className="w-3.5 h-3.5" />{language === "fr" ? "Appeler" : "Call"}
                        </a>
                      )}
                      <button onClick={() => setSelectedInquiry(req)}
                        className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium ml-auto">
                        <Eye className="w-3.5 h-3.5" />{language === "fr" ? "Voir" : "View"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2 gap-2">
                  <p className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                    {language === "fr"
                      ? `${(inquiryPage - 1) * INQUIRIES_PER_PAGE + 1}–${Math.min(inquiryPage * INQUIRIES_PER_PAGE, filtered.length)} sur ${filtered.length}`
                      : `${(inquiryPage - 1) * INQUIRIES_PER_PAGE + 1}–${Math.min(inquiryPage * INQUIRIES_PER_PAGE, filtered.length)} of ${filtered.length}`}
                  </p>
                  <div className="flex items-center gap-1 overflow-x-auto">
                    <button onClick={() => setInquiryPage(p => Math.max(1, p - 1))} disabled={inquiryPage === 1}
                      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0">
                      <ChevronDown className="w-4 h-4 rotate-90" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => page === 1 || page === totalPages || Math.abs(page - inquiryPage) <= 1)
                      .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                        if (idx > 0 && (page as number) - (arr[idx - 1] as number) > 1) acc.push("...");
                        acc.push(page);
                        return acc;
                      }, [])
                      .map((page, idx) =>
                        page === "..." ? (
                          <span key={`ellipsis-${idx}`} className="px-1 text-gray-400 text-sm flex-shrink-0">…</span>
                        ) : (
                          <button key={page} onClick={() => setInquiryPage(page as number)}
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex-shrink-0 ${page === inquiryPage ? "bg-primary text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                            {page}
                          </button>
                        )
                      )}
                    <button onClick={() => setInquiryPage(p => Math.min(totalPages, p + 1))} disabled={inquiryPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0">
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={`rounded-xl shadow-md p-8 sm:p-12 text-center ${isDark ? "bg-gray-900" : "bg-white"}`}>
              <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>{language === "fr" ? "Aucune demande dans cette catégorie." : "No inquiries in this category."}</p>
            </div>
          );
        })()
      ) : (
        <div className={`rounded-xl shadow-md p-8 sm:p-12 text-center ${isDark ? "bg-gray-900" : "bg-white"}`}>
          <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>{tc.noRequests}</p>
        </div>
      )}
    </div>
  );
}
