"use client";

import Image from "next/image";
import { Filter, Loader2, Flag, Eye, Trash2, CheckCircle } from "lucide-react";
import Link from "@/components/LocalizedLink";
import { AdminContent } from "./types";

interface AdminReportsTabProps {
  isDark: boolean;
  tc: AdminContent;
  reportFilter: string;
  setReportFilter: (v: string) => void;
  reportsLoading: boolean;
  filteredReports: any[];
  handleUpdateReportStatus: (reportId: string, status: string) => void;
  handleDeleteReport: (reportId: string) => void;
}

export default function AdminReportsTab({
  isDark,
  tc,
  reportFilter,
  setReportFilter,
  reportsLoading,
  filteredReports,
  handleUpdateReportStatus,
  handleDeleteReport,
}: AdminReportsTabProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.reportsModeration}</h2>
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          <select
            value={reportFilter}
            onChange={(e) => setReportFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
          >
            <option value="all">{tc.all}</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {reportsLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
        </div>
      ) : filteredReports.length > 0 ? (
        <div className={`rounded-xl border overflow-hidden ${isDark ? "border-gray-800" : "border-gray-200"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>#</th>
                  <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Property</th>
                  <th className={`px-4 py-3 text-left font-semibold hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Reported By</th>
                  <th className={`px-4 py-3 text-left font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Reason</th>
                  <th className={`px-4 py-3 text-left font-semibold hidden lg:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Details</th>
                  <th className={`px-4 py-3 text-left font-semibold hidden sm:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>Date</th>
                  <th className={`px-4 py-3 text-center font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Status</th>
                  <th className={`px-4 py-3 text-center font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}>
                {filteredReports.map((report, idx) => {
                  const prop = report.property;
                  const reporter = report.reportedBy;
                  const statusColor =
                    report.status === "pending"
                      ? isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700"
                      : report.status === "reviewed"
                      ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"
                      : isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500";
                  return (
                    <tr key={report._id} className={`transition-colors ${isDark ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-50"}`}>
                      <td className={`px-4 py-3 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          {prop?.images?.[0] && (
                            <div className="relative w-9 h-9 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                              <Image src={prop.images[0]} alt={prop.title || ""} fill className="object-cover" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className={`font-semibold text-xs truncate max-w-[120px] ${isDark ? "text-white" : "text-gray-900"}`}>{prop?.title || "—"}</p>
                            {prop?.propertyType && (
                              <span className={`text-xs px-1.5 py-0.5 rounded font-semibold text-white ${prop.propertyType === "PG" ? "bg-blue-600" : "bg-green-600"}`}>{prop.propertyType}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={`px-4 py-3 hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        <div>
                          <p className="text-xs font-medium">{reporter?.fullName || "—"}</p>
                          <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{reporter?.email}</p>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>{report.reason}</td>
                      <td className={`px-4 py-3 hidden lg:table-cell text-xs max-w-[200px] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        <p className="line-clamp-2">{report.description}</p>
                      </td>
                      <td className={`px-4 py-3 hidden sm:table-cell text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColor}`}>{report.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {report.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleUpdateReportStatus(report._id, "reviewed")}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> Review
                              </button>
                              <button
                                onClick={() => handleUpdateReportStatus(report._id, "dismissed")}
                                className={`flex items-center gap-1 px-2.5 py-1.5 border rounded-lg transition-colors text-xs font-medium ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                              >
                                Dismiss
                              </button>
                            </>
                          )}
                          {prop?._id && (
                            <Link
                              href={`/property/${prop._id}`}
                              className="flex items-center gap-1 px-2.5 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-xs font-medium"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          <button
                            onClick={() => handleDeleteReport(report._id)}
                            className={`flex items-center gap-1 px-2.5 py-1.5 border rounded-lg transition-colors text-xs font-medium ${isDark ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-300 text-red-500 hover:bg-red-50"}`}
                            title="Delete report"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      ) : (
        <div className={`rounded-xl p-12 text-center border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <Flag className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
          <p className="text-gray-500">{tc.noReports}</p>
        </div>
      )}
    </div>
  );
}
