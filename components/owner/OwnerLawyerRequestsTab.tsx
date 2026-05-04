"use client";

import { useState } from "react";
import {
  Scale, CheckCircle, XCircle, Clock, Loader2, Phone, Mail,
  Award, Briefcase, FileText, ExternalLink, User,
} from "lucide-react";

interface LawyerRequest {
  _id: string;
  status: "pending" | "accepted" | "rejected";
  message?: string;
  createdAt: string;
  lawyer: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
    barCouncilNumber?: string;
    experienceYears?: number;
    barCouncilCertificate?: string;
    isApproved: boolean;
    createdAt: string;
  };
}

interface Props {
  isDark: boolean;
  requests: LawyerRequest[];
  loading: boolean;
  onAction: (id: string, status: "accepted" | "rejected") => Promise<void>;
}

const statusConfig = {
  pending:  { label: "Pending",  icon: Clock,         dark: "bg-yellow-500/15 text-yellow-400", light: "bg-yellow-100 text-yellow-700" },
  accepted: { label: "Accepted", icon: CheckCircle,   dark: "bg-green-500/15 text-green-400",  light: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", icon: XCircle,       dark: "bg-red-500/15 text-red-400",      light: "bg-red-100 text-red-700" },
};

export default function OwnerLawyerRequestsTab({ isDark, requests, loading, onAction }: Props) {
  const [actingId, setActingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAction = async (id: string, status: "accepted" | "rejected") => {
    setActingId(id);
    await onAction(id, status);
    setActingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Lawyer Requests
        </h2>
        <p className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Lawyers who want to work with you — review their details and respond
        </p>
      </div>

      {/* Count badge */}
      {!loading && (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium w-fit ${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
          <Scale className="w-4 h-4" />
          {requests.length} request{requests.length !== 1 ? "s" : ""}
          {requests.filter(r => r.status === "pending").length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-yellow-500 text-white text-xs font-bold">
              {requests.filter(r => r.status === "pending").length} new
            </span>
          )}
        </div>
      )}

      {requests.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <Scale className={`w-14 h-14 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
          <p className={`font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>No lawyer requests yet</p>
          <p className={`text-sm mt-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
            When a lawyer sends you a request, it will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const lawyer = req.lawyer;
            const cfg = statusConfig[req.status];
            const StatusIcon = cfg.icon;
            const isExpanded = expandedId === req._id;
            const initials = lawyer.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";

            return (
              <div
                key={req._id}
                className={`rounded-2xl border overflow-hidden transition-shadow hover:shadow-md ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}
              >
                {/* Card header */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                      {lawyer.profileImage
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={lawyer.profileImage} alt={lawyer.fullName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        : initials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>{lawyer.fullName}</p>
                            {lawyer.isApproved && (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${isDark ? "bg-green-500/15 text-green-400" : "bg-green-100 text-green-700"}`}>
                                <CheckCircle className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>
                          <div className={`flex items-center gap-3 mt-1 flex-wrap text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{lawyer.email}</span>
                            {lawyer.phoneNumber && (
                              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{lawyer.phoneNumber}</span>
                            )}
                          </div>
                        </div>

                        {/* Status badge */}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 ${isDark ? cfg.dark : cfg.light}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {cfg.label}
                        </span>
                      </div>

                      {/* Quick stats */}
                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        {lawyer.experienceYears !== undefined && (
                          <span className={`flex items-center gap-1.5 text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            <Briefcase className="w-3.5 h-3.5" />
                            {lawyer.experienceYears} yr{lawyer.experienceYears !== 1 ? "s" : ""} experience
                          </span>
                        )}
                        {lawyer.barCouncilNumber && (
                          <span className={`flex items-center gap-1.5 text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            <Award className="w-3.5 h-3.5" />
                            Bar #{lawyer.barCouncilNumber}
                          </span>
                        )}
                        <span className={`flex items-center gap-1.5 text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(req.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>

                      {/* Message */}
                      {req.message && (
                        <p className={`mt-3 text-sm italic ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          &ldquo;{req.message}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(req._id, "accepted")}
                          disabled={actingId === req._id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-60"
                        >
                          {actingId === req._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(req._id, "rejected")}
                          disabled={actingId === req._id}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                        >
                          <XCircle className="w-4 h-4" />
                          Decline
                        </button>
                      </>
                    )}

                    {/* Toggle details */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : req._id)}
                      className={`ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-400" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
                    >
                      <User className="w-3.5 h-3.5" />
                      {isExpanded ? "Hide details" : "View details"}
                    </button>
                  </div>
                </div>

                {/* Expanded lawyer details */}
                {isExpanded && (
                  <div className={`border-t px-4 sm:px-5 py-4 space-y-4 ${isDark ? "border-gray-800 bg-gray-800/40" : "border-gray-100 bg-gray-50"}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-500" : "text-gray-400"}`}>Lawyer Details</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Detail label="Full Name" value={lawyer.fullName} isDark={isDark} />
                      <Detail label="Email" value={lawyer.email} isDark={isDark} />
                      {lawyer.phoneNumber && <Detail label="Phone" value={lawyer.phoneNumber} isDark={isDark} />}
                      {lawyer.barCouncilNumber && <Detail label="Bar Council No." value={lawyer.barCouncilNumber} isDark={isDark} />}
                      {lawyer.experienceYears !== undefined && (
                        <Detail label="Experience" value={`${lawyer.experienceYears} year${lawyer.experienceYears !== 1 ? "s" : ""}`} isDark={isDark} />
                      )}
                      <Detail
                        label="Admin Verified"
                        value={lawyer.isApproved ? "Yes ✓" : "Not yet"}
                        isDark={isDark}
                        highlight={lawyer.isApproved}
                      />
                      <Detail
                        label="Member Since"
                        value={new Date(lawyer.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        isDark={isDark}
                      />
                    </div>

                    {/* Certificate */}
                    {lawyer.barCouncilCertificate && (
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          Bar Council Certificate
                        </p>
                        {lawyer.barCouncilCertificate.endsWith(".pdf") || lawyer.barCouncilCertificate.startsWith("data:application/pdf") ? (
                          <a
                            href={lawyer.barCouncilCertificate}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            View Certificate (PDF)
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={lawyer.barCouncilCertificate}
                            alt="Bar Council Certificate"
                            className="max-w-xs rounded-xl border object-contain"
                            style={{ maxHeight: 200 }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, isDark, highlight }: { label: string; value: string; isDark: boolean; highlight?: boolean }) {
  return (
    <div>
      <p className={`text-xs font-medium mb-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
      <p className={`text-sm font-semibold ${highlight ? "text-green-500" : isDark ? "text-gray-200" : "text-gray-800"}`}>{value}</p>
    </div>
  );
}
