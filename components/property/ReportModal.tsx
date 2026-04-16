"use client";
import { CheckCircle, X } from "lucide-react";

const REPORT_REASONS = ["Fake listing", "Incorrect information", "Misleading photos", "Already rented", "Scam / fraud", "Other"];

interface Props {
  reportDone: boolean;
  reportReason: string;
  reportDescription: string;
  reportSubmitting: boolean;
  onClose: () => void;
  onReasonSelect: (r: string) => void;
  onDescriptionChange: (v: string) => void;
  onSubmit: () => void;
}

export default function ReportModal({ reportDone, reportReason, reportDescription, reportSubmitting, onClose, onReasonSelect, onDescriptionChange, onSubmit }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Report this property</h2>
          <button onClick={onClose} aria-label="Close report modal" className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-5">
          {reportDone ? (
            <div className="text-center py-6">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-semibold text-gray-900 mb-1">Report submitted</p>
              <p className="text-sm text-gray-500">Our team will review it shortly. Thank you.</p>
              <button onClick={onClose} className="mt-5 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm">Close</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reason <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  {REPORT_REASONS.map(r => (
                    <button key={r} onClick={() => onReasonSelect(r)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors text-left ${reportReason === r ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Details <span className="text-red-500">*</span></label>
                <textarea value={reportDescription} onChange={e => onDescriptionChange(e.target.value)}
                  placeholder="Describe the issue in detail..." rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 resize-none" />
                <p className="text-xs text-gray-400 mt-1">{reportDescription.length}/1000</p>
              </div>
              <button onClick={onSubmit} disabled={reportSubmitting}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm">
                {reportSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
