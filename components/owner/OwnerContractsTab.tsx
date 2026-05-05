"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FileText, Loader2, ChevronRight, ArrowLeft, CheckCircle,
  Clock, RotateCcw, AlertCircle, Scale, Send,
  Building2, DollarSign, Calendar, PenLine, X, Trash2,
} from "lucide-react";
import { getToken } from "@/lib/token-storage";

interface Contract {
  _id: string;
  status: "DRAFT" | "PENDING_OWNER_REVIEW" | "REVISION_REQUIRED" | "OWNER_SIGNED" | "PENDING_TENANT_REVIEW" | "TENANT_SIGNED";
  tenantName: string; tenantEmail: string; tenantPhone: string;
  propertyAddress: string; monthlyRent: number; securityDeposit: number;
  leaseDuration: string; startDate: string; endDate: string;
  noticePeriod: string; terms: string; policies: string;
  revisionNote?: string; ownerSignedAt?: string; ownerSignature?: string;
  createdAt: string; updatedAt: string;
  lawyer: { _id: string; fullName: string; email: string; phoneNumber?: string; profileImage?: string; barCouncilNumber?: string };
  property?: { _id: string; title: string; location: string };
}

interface Props { isDark: boolean; }

const STATUS: Record<string, { label: string; icon: typeof FileText; dark: string; light: string }> = {
  DRAFT:                 { label: "Draft",           icon: FileText,    dark: "bg-gray-700 text-gray-300",          light: "bg-gray-100 text-gray-600" },
  PENDING_OWNER_REVIEW:  { label: "Awaiting Review", icon: Clock,       dark: "bg-yellow-500/15 text-yellow-400",   light: "bg-yellow-100 text-yellow-700" },
  REVISION_REQUIRED:     { label: "Revision Sent",   icon: RotateCcw,   dark: "bg-orange-500/15 text-orange-400",   light: "bg-orange-100 text-orange-700" },
  OWNER_SIGNED:          { label: "Signed",          icon: CheckCircle, dark: "bg-green-500/15 text-green-400",     light: "bg-green-100 text-green-700" },
  PENDING_TENANT_REVIEW: { label: "Sent to Tenant",  icon: Send,        dark: "bg-purple-500/15 text-purple-400",   light: "bg-purple-100 text-purple-700" },
  TENANT_SIGNED:         { label: "Fully Executed",  icon: CheckCircle, dark: "bg-green-500/15 text-green-400",     light: "bg-green-100 text-green-700" },
};

// ── Signature Pad Modal ───────────────────────────────────────────────────────
function SignaturePad({ isDark, onConfirm, onCancel }: {
  isDark: boolean;
  onConfirm: (dataUrl: string) => void;
  onCancel: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasStrokes, setHasStrokes] = useState(false);

  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current; if (!canvas) return;
    e.preventDefault();
    drawing.current = true;
    const ctx = canvas.getContext("2d")!;
    const { x, y } = getPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current; if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext("2d")!;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1d4ed8";
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y); ctx.stroke();
    setHasStrokes(true);
  }, []);

  const stopDraw = useCallback(() => { drawing.current = false; }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseleave", stopDraw);
    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stopDraw);
    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDraw);
      canvas.removeEventListener("mouseleave", stopDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDraw);
    };
  }, [startDraw, draw, stopDraw]);

  const clear = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
  };

  const confirm = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    onConfirm(canvas.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>
          <div className="flex items-center gap-2">
            <PenLine className="w-5 h-5 text-primary" />
            <span className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>Sign the Contract</span>
          </div>
          <button onClick={onCancel} className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="px-5 pt-4">
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Draw your signature below using your mouse or finger. This will be recorded as your electronic signature.
          </p>
        </div>

        {/* Canvas */}
        <div className="px-5 pt-3 pb-2">
          <div className={`rounded-xl border-2 border-dashed overflow-hidden ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-50"}`}>
            <canvas
              ref={canvasRef}
              width={560}
              height={180}
              className="w-full touch-none cursor-crosshair"
              style={{ display: "block" }}
            />
          </div>
          <p className={`text-xs mt-1.5 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
            Sign within the box above
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-5 py-4">
          <button
            onClick={clear}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-400" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
            >
              Cancel
            </button>
            <button
              onClick={confirm}
              disabled={!hasStrokes}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-40"
            >
              <CheckCircle className="w-4 h-4" /> Confirm Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Tab ──────────────────────────────────────────────────────────────────
export default function OwnerContractsTab({ isDark }: Props) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contract | null>(null);
  const [acting, setActing] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [showSignPad, setShowSignPad] = useState(false);

  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };

  useEffect(() => {
    fetch("/api/contracts", { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setContracts(d.contracts); })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openContract = (c: Contract) => {
    setSelected(c); setRevisionNote(""); setShowRevisionInput(false); setShowSignPad(false);
  };
  const closeContract = () => {
    setSelected(null); setRevisionNote(""); setShowRevisionInput(false); setShowSignPad(false);
  };

  const handleConfirmSign = async (signatureDataUrl: string) => {
    if (!selected) return;
    setShowSignPad(false);
    setActing(true);
    try {
      const res = await fetch(`/api/contracts/${selected._id}`, {
        method: "PATCH", headers,
        body: JSON.stringify({ action: "sign", ownerSignature: signatureDataUrl }),
      });
      const d = await res.json();
      if (d.success) {
        setContracts(prev => prev.map(c => c._id === d.contract._id ? d.contract : c));
        setSelected(d.contract);
      }
    } catch {}
    finally { setActing(false); }
  };

  const handleRequestChanges = async () => {
    if (!selected) return;
    setActing(true);
    try {
      const res = await fetch(`/api/contracts/${selected._id}`, {
        method: "PATCH", headers,
        body: JSON.stringify({ action: "request_changes", revisionNote }),
      });
      const d = await res.json();
      if (d.success) {
        setContracts(prev => prev.map(c => c._id === d.contract._id ? d.contract : c));
        setSelected(d.contract);
        setShowRevisionInput(false);
        setRevisionNote("");
      }
    } catch {}
    finally { setActing(false); }
  };

  const textarea = `w-full px-3 py-2 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`;

  // ── Signature pad overlay ─────────────────────────────────────────────────
  if (showSignPad) {
    return (
      <>
        {/* Keep contract visible behind the modal */}
        <SignaturePad
          isDark={isDark}
          onConfirm={handleConfirmSign}
          onCancel={() => setShowSignPad(false)}
        />
      </>
    );
  }

  // ── Contract viewer ───────────────────────────────────────────────────────
  if (selected) {
    const cfg = STATUS[selected.status] ?? STATUS.DRAFT;
    const StatusIcon = cfg.icon;
    const canAct = selected.status === "PENDING_OWNER_REVIEW";

    return (
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={closeContract}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
            <ArrowLeft className="w-4 h-4" /> Back to Contracts
          </button>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${isDark ? cfg.dark : cfg.light}`}>
            <StatusIcon className="w-3.5 h-3.5" /> {cfg.label}
          </span>
        </div>

        {/* Lawyer info */}
        <div className={`rounded-2xl border p-4 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Prepared by Lawyer</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
              {selected.lawyer?.profileImage
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={selected.lawyer.profileImage} alt={selected.lawyer.fullName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                : selected.lawyer?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{selected.lawyer?.fullName}</p>
                <Scale className="w-3.5 h-3.5 text-yellow-500" />
              </div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{selected.lawyer?.email}</p>
              {selected.lawyer?.barCouncilNumber && (
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Bar #{selected.lawyer.barCouncilNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tenant */}
        <div className={`rounded-2xl border p-5 space-y-4 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-500" : "text-gray-400"}`}>Tenant Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[["Tenant Name", selected.tenantName], ["Email", selected.tenantEmail], ["Phone", selected.tenantPhone]].map(([label, val]) => (
              <div key={label}>
                <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
                <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{val || "—"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Financials */}
        <div className={`rounded-2xl border p-5 space-y-4 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-500" : "text-gray-400"}`}>Property & Financials</p>
          <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{selected.propertyAddress || "—"}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              ["Monthly Rent", `₹${selected.monthlyRent?.toLocaleString("en-IN") || 0}`],
              ["Security Deposit", `₹${selected.securityDeposit?.toLocaleString("en-IN") || 0}`],
              ["Lease Duration", selected.leaseDuration || "—"],
              ["Notice Period", selected.noticePeriod || "—"],
            ].map(([label, val]) => (
              <div key={label}>
                <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
                <p className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>{val}</p>
              </div>
            ))}
          </div>
          {(selected.startDate || selected.endDate) && (
            <div className="grid grid-cols-2 gap-4">
              {[["Start Date", selected.startDate], ["End Date", selected.endDate]].map(([label, val]) => (
                <div key={label}>
                  <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
                  <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{val || "—"}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Terms */}
        <div className={`rounded-2xl border p-5 space-y-4 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-500" : "text-gray-400"}`}>Terms & Conditions</p>
          <pre className={`text-sm whitespace-pre-wrap font-sans leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{selected.terms || "—"}</pre>
          <div className={`border-t pt-4 ${isDark ? "border-gray-800" : "border-gray-100"}`}>
            <p className={`text-xs font-medium mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Policies</p>
            <pre className={`text-sm whitespace-pre-wrap font-sans leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{selected.policies || "—"}</pre>
          </div>
        </div>

        {/* Action area */}
        {canAct && (
          <div className={`rounded-2xl border p-5 space-y-4 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Your Response</p>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Review the contract carefully. Clicking "Accept & Sign" will open a signature pad for your e-signature.
            </p>
            {showRevisionInput ? (
              <div className="space-y-3">
                <textarea rows={4} className={textarea}
                  placeholder="Describe what changes you need the lawyer to make..."
                  value={revisionNote} onChange={e => setRevisionNote(e.target.value)} />
                <div className="flex gap-2">
                  <button onClick={() => setShowRevisionInput(false)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                    Cancel
                  </button>
                  <button onClick={handleRequestChanges} disabled={acting || !revisionNote.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors disabled:opacity-50">
                    {acting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send Revision Request
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => setShowSignPad(true)} disabled={acting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-50 shadow-sm">
                  {acting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenLine className="w-4 h-4" />}
                  Accept & Sign
                </button>
                <button onClick={() => setShowRevisionInput(true)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                  <RotateCcw className="w-4 h-4" /> Request Changes
                </button>
              </div>
            )}
          </div>
        )}

        {/* Signed confirmation with signature image */}
        {selected.status === "OWNER_SIGNED" && (
          <div className={`rounded-2xl border p-5 space-y-3 ${isDark ? "bg-green-500/10 border-green-500/30" : "bg-green-50 border-green-200"}`}>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className={`text-sm font-semibold ${isDark ? "text-green-400" : "text-green-700"}`}>
                Contract signed on {selected.ownerSignedAt ? new Date(selected.ownerSignedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
              </p>
            </div>
            {selected.ownerSignature && (
              <div>
                <p className={`text-xs font-medium mb-2 ${isDark ? "text-green-500" : "text-green-600"}`}>Your Signature</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selected.ownerSignature} alt="Owner signature" className={`h-16 rounded-lg border ${isDark ? "border-green-500/30 bg-gray-800" : "border-green-200 bg-white"}`} />
              </div>
            )}
          </div>
        )}

        {/* Revision sent */}
        {selected.status === "REVISION_REQUIRED" && selected.revisionNote && (
          <div className={`flex items-start gap-3 p-4 rounded-xl border ${isDark ? "bg-orange-500/10 border-orange-500/30 text-orange-300" : "bg-orange-50 border-orange-200 text-orange-800"}`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Revision request sent to lawyer</p>
              <p className="text-sm mt-0.5">{selected.revisionNote}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Contracts list ────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div>
        <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Contracts</h2>
        <p className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Rental contracts prepared by your lawyers</p>
      </div>
      {!loading && contracts.filter(c => c.status === "PENDING_OWNER_REVIEW").length > 0 && (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${isDark ? "bg-yellow-500/15 text-yellow-400" : "bg-yellow-100 text-yellow-700"}`}>
          <Clock className="w-4 h-4" />
          {contracts.filter(c => c.status === "PENDING_OWNER_REVIEW").length} awaiting your review
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
        </div>
      ) : contracts.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <FileText className={`w-14 h-14 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
          <p className={`font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>No contracts yet</p>
          <p className={`text-sm mt-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>Contracts prepared by your lawyers will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contracts.map(c => {
            const cfg = STATUS[c.status] ?? STATUS.DRAFT;
            const StatusIcon = cfg.icon;
            const needsAction = c.status === "PENDING_OWNER_REVIEW";
            return (
              <div key={c._id} onClick={() => openContract(c)}
                className={`rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md flex items-center gap-4 ${
                  needsAction
                    ? isDark ? "bg-yellow-500/5 border-yellow-500/30 hover:border-yellow-500/50" : "bg-yellow-50 border-yellow-200 hover:border-yellow-400"
                    : isDark ? "bg-gray-900 border-gray-800 hover:border-gray-700" : "bg-white border-gray-200 shadow-sm hover:border-primary/30"
                }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                  <FileText className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>Contract from {c.lawyer?.fullName || "—"}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${isDark ? cfg.dark : cfg.light}`}>
                      <StatusIcon className="w-3 h-3" /> {cfg.label}
                    </span>
                    {needsAction && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-500 text-white animate-pulse">
                        Action Required
                      </span>
                    )}
                  </div>
                  <div className={`flex items-center gap-3 mt-1 text-xs flex-wrap ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {c.propertyAddress && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{c.propertyAddress.slice(0, 40)}{c.propertyAddress.length > 40 ? "…" : ""}</span>}
                    {c.monthlyRent > 0 && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />₹{c.monthlyRent.toLocaleString("en-IN")}/mo</span>}
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
