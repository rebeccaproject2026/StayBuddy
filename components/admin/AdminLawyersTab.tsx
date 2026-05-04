"use client";

import { useState } from "react";
import {
  Scale,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  X,
  Phone,
  Mail,
  Calendar,
  Award,
  CreditCard,
  Clock,
  FileText,
  ZoomIn,
  ZoomOut,
  Download,
} from "lucide-react";
import { AdminUser } from "./types";

interface AdminLawyersTabProps {
  isDark: boolean;
  pendingLawyers: AdminUser[];
  approvedLawyers: AdminUser[];
  lawyersLoading: boolean;
  handleLawyerApproval: (lawyerId: string, approve: boolean) => void;
}

export default function AdminLawyersTab({
  isDark,
  pendingLawyers,
  approvedLawyers,
  lawyersLoading,
  handleLawyerApproval,
}: AdminLawyersTabProps) {
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");
  const [viewingLawyer, setViewingLawyer] = useState<AdminUser | null>(null);
  const [certZoom, setCertZoom] = useState(1);

  const displayed =
    filter === "pending"
      ? pendingLawyers
      : filter === "approved"
      ? approvedLawyers
      : [...pendingLawyers, ...approvedLawyers];

  const isPdf = (url?: string): boolean =>
    !!(url?.startsWith("data:application/pdf") || url?.endsWith(".pdf"));

  return (
    <div className="space-y-5 mb-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Scale className={`w-6 h-6 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} />
          <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Lawyer Requests
          </h2>
        </div>

        {/* Filter tabs */}
        <div className={`flex rounded-xl overflow-hidden border text-sm font-medium ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          {(["pending", "approved", "all"] as const).map((f) => {
            const count =
              f === "pending"
                ? pendingLawyers.length
                : f === "approved"
                ? approvedLawyers.length
                : pendingLawyers.length + approvedLawyers.length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 flex items-center gap-1.5 capitalize transition-colors ${
                  filter === f
                    ? "bg-primary text-white"
                    : isDark
                    ? "bg-gray-800 text-gray-400 hover:text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    filter === f
                      ? "bg-white/20 text-white"
                      : f === "pending"
                      ? "bg-yellow-500/20 text-yellow-500"
                      : "bg-gray-500/20 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {lawyersLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
        </div>
      ) : displayed.length === 0 ? (
        <div className={`rounded-xl p-16 text-center border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <Scale className={`w-14 h-14 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
          <p className={`font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            No {filter === "all" ? "" : filter} lawyer requests
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {displayed.map((lawyer) => (
            <LawyerCard
              key={lawyer._id}
              lawyer={lawyer}
              isDark={isDark}
              onView={() => { setViewingLawyer(lawyer); setCertZoom(1); }}
              onApprove={() => handleLawyerApproval(lawyer._id, true)}
              onReject={() => handleLawyerApproval(lawyer._id, false)}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {viewingLawyer && (
        <LawyerDetailModal
          lawyer={viewingLawyer}
          isDark={isDark}
          certZoom={certZoom}
          setCertZoom={setCertZoom}
          isPdf={isPdf}
          onClose={() => setViewingLawyer(null)}
          onApprove={() => { handleLawyerApproval(viewingLawyer._id, true); setViewingLawyer(null); }}
          onReject={() => { handleLawyerApproval(viewingLawyer._id, false); setViewingLawyer(null); }}
        />
      )}
    </div>
  );
}

// ── Lawyer Card ───────────────────────────────────────────────────────────────

function LawyerCard({
  lawyer,
  isDark,
  onView,
  onApprove,
  onReject,
}: {
  lawyer: AdminUser;
  isDark: boolean;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const initials = lawyer.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
  const isPending = !lawyer.isApproved;

  return (
    <div className={`rounded-xl border overflow-hidden transition-shadow hover:shadow-md ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
      {/* Status bar */}
      <div className={`h-1 w-full ${isPending ? "bg-yellow-500" : "bg-green-500"}`} />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${isPending ? "bg-yellow-500" : "bg-green-500"}`}>
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`font-semibold text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>{lawyer.fullName}</p>
            <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>{lawyer.email}</p>
          </div>
          <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${isPending ? "bg-yellow-500/15 text-yellow-500" : "bg-green-500/15 text-green-500"}`}>
            {isPending ? "Pending" : "Approved"}
          </span>
        </div>

        {/* Details */}
        <div className={`space-y-2 text-xs mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {lawyer.phoneNumber && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{lawyer.phoneNumber}</span>
            </div>
          )}
          {lawyer.barCouncilNumber && (
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Bar #: <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{lawyer.barCouncilNumber}</span></span>
            </div>
          )}
          {lawyer.experienceYears !== undefined && (
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{lawyer.experienceYears} year{lawyer.experienceYears !== 1 ? "s" : ""} experience</span>
            </div>
          )}
          {lawyer.aadharNumber && (
            <div className="flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Aadhar: {lawyer.aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3")}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Registered {new Date(lawyer.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Certificate indicator */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-xs ${lawyer.barCouncilCertificate ? isDark ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-700" : isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-700"}`}>
          <FileText className="w-3.5 h-3.5 flex-shrink-0" />
          {lawyer.barCouncilCertificate ? "Certificate uploaded" : "No certificate uploaded"}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onView}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
          >
            <Eye className="w-3.5 h-3.5" /> View Details
          </button>
          {isPending ? (
            <>
              <button onClick={onApprove} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors">
                <CheckCircle className="w-3.5 h-3.5" /> Approve
              </button>
              <button onClick={onReject} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors">
                <XCircle className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button onClick={onReject} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors">
              <XCircle className="w-3.5 h-3.5" /> Revoke
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────

function LawyerDetailModal({
  lawyer,
  isDark,
  certZoom,
  setCertZoom,
  isPdf,
  onClose,
  onApprove,
  onReject,
}: {
  lawyer: AdminUser;
  isDark: boolean;
  certZoom: number;
  setCertZoom: (z: number) => void;
  isPdf: (url?: string) => boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isPending = !lawyer.isApproved;

  const handleDownload = () => {
    if (!lawyer.barCouncilCertificate) return;
    const a = document.createElement("a");
    a.href = lawyer.barCouncilCertificate;
    a.download = `certificate_${lawyer.fullName.replace(/\s+/g, "_")}`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white"}`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${isPending ? "bg-yellow-500" : "bg-green-500"}`}>
              {lawyer.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
            </div>
            <div>
              <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{lawyer.fullName}</p>
              <p className="text-xs text-gray-500">Lawyer Application</p>
            </div>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <InfoRow icon={Mail} label="Email" value={lawyer.email} isDark={isDark} />
            {lawyer.phoneNumber && <InfoRow icon={Phone} label="Phone" value={lawyer.phoneNumber} isDark={isDark} />}
            {lawyer.barCouncilNumber && <InfoRow icon={Award} label="Bar Council Number" value={lawyer.barCouncilNumber} isDark={isDark} />}
            {lawyer.experienceYears !== undefined && (
              <InfoRow icon={Clock} label="Experience" value={`${lawyer.experienceYears} year${lawyer.experienceYears !== 1 ? "s" : ""}`} isDark={isDark} />
            )}
            {lawyer.aadharNumber && (
              <InfoRow icon={CreditCard} label="Aadhar Number" value={lawyer.aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3")} isDark={isDark} />
            )}
            <InfoRow icon={Calendar} label="Registered On" value={new Date(lawyer.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} isDark={isDark} />
          </div>

          {/* Certificate viewer */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>Bar Council Certificate</p>
              {lawyer.barCouncilCertificate && (
                <div className="flex items-center gap-2">
                  {!isPdf(lawyer.barCouncilCertificate) && (
                    <>
                      <button
                        onClick={() => setCertZoom(Math.max(0.5, certZoom - 0.25))}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <span className={`text-xs font-medium w-10 text-center ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {Math.round(certZoom * 100)}%
                      </span>
                      <button
                        onClick={() => setCertZoom(Math.min(3, certZoom + 0.25))}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleDownload}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              )}
            </div>

            {lawyer.barCouncilCertificate ? (
              <div className={`rounded-xl overflow-hidden border ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
                {isPdf(lawyer.barCouncilCertificate) ? (
                  <iframe
                    src={lawyer.barCouncilCertificate}
                    className="w-full"
                    style={{ height: "480px" }}
                    title="Bar Council Certificate"
                  />
                ) : (
                  <div className="overflow-auto" style={{ maxHeight: "480px" }}>
                    <div style={{ transform: `scale(${certZoom})`, transformOrigin: "top left", display: "inline-block", minWidth: "100%" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={lawyer.barCouncilCertificate}
                        alt="Bar Council Certificate"
                        className="max-w-full block"
                        style={{ minWidth: certZoom > 1 ? `${100 / certZoom}%` : "100%" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`rounded-xl border-2 border-dashed p-10 text-center ${isDark ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}>
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No certificate uploaded</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className={`flex gap-3 pt-2 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
            {isPending ? (
              <>
                <button
                  onClick={onApprove}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors"
                >
                  <CheckCircle className="w-5 h-5" /> Approve Lawyer
                </button>
                <button
                  onClick={onReject}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <XCircle className="w-5 h-5" /> Reject Application
                </button>
              </>
            ) : (
              <button
                onClick={onReject}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                <XCircle className="w-5 h-5" /> Revoke Approval
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value, isDark }: { icon: any; label: string; value: string; isDark: boolean }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
      <div className="min-w-0">
        <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
        <p className={`text-sm font-medium break-all ${isDark ? "text-gray-100" : "text-gray-800"}`}>{value}</p>
      </div>
    </div>
  );
}
