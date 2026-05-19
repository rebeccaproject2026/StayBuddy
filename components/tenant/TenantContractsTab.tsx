"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FileText, Loader2, CheckCircle, Clock, Building2,
  DollarSign, Calendar, PenLine, Scale, Trash2, X,
} from "lucide-react";
import { getToken } from "@/lib/token-storage";
import { useSocketContext } from "@/contexts/SocketContext";

interface TenantContract {
  _id: string;
  status: "PENDING_TENANT_REVIEW" | "TENANT_SIGNED";
  tenantName: string;
  tenantEmail: string;
  propertyAddress: string;
  monthlyRent: number;
  securityDeposit: number;
  leaseDuration: string;
  startDate: string;
  endDate: string;
  noticePeriod: string;
  terms: string;
  policies: string;
  ownerSignature?: string;
  ownerSignedAt?: string;
  tenantSignature?: string;
  tenantSignedAt?: string;
  tenantSignToken?: string;
  createdAt: string;
  updatedAt: string;
  owner: { _id: string; fullName: string; email: string; profileImage?: string };
  lawyer: { _id: string; fullName: string; email: string; barCouncilNumber?: string };
}

interface Props {
  isDark: boolean;
  onViewed?: () => void;
}

const STATUS_CFG: Record<string, { label: string; icon: typeof Clock; dark: string; light: string }> = {
  PENDING_TENANT_REVIEW: { label: "Awaiting Your Signature", icon: Clock,       dark: "bg-yellow-500/15 text-yellow-400", light: "bg-yellow-100 text-yellow-700" },
  TENANT_SIGNED:         { label: "Fully Signed",            icon: CheckCircle, dark: "bg-green-500/15 text-green-400",   light: "bg-green-100 text-green-700" },
};

// ── Inline Signature Pad ──────────────────────────────────────────────────────
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
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    if ("touches" in e) return { x: (e.touches[0].clientX - rect.left) * sx, y: (e.touches[0].clientY - rect.top) * sy };
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  };

  const startDraw = useCallback((e: MouseEvent | TouchEvent) => {
    const c = canvasRef.current; if (!c) return;
    e.preventDefault(); drawing.current = true;
    const ctx = c.getContext("2d")!;
    const { x, y } = getPos(e, c);
    ctx.beginPath(); ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    if (!drawing.current) return;
    const c = canvasRef.current; if (!c) return;
    e.preventDefault();
    const ctx = c.getContext("2d")!;
    ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = "#1d4ed8";
    const { x, y } = getPos(e, c);
    ctx.lineTo(x, y); ctx.stroke(); setHasStrokes(true);
  }, []);

  const stopDraw = useCallback(() => { drawing.current = false; }, []);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    c.addEventListener("mousedown", startDraw); c.addEventListener("mousemove", draw);
    c.addEventListener("mouseup", stopDraw); c.addEventListener("mouseleave", stopDraw);
    c.addEventListener("touchstart", startDraw, { passive: false });
    c.addEventListener("touchmove", draw, { passive: false });
    c.addEventListener("touchend", stopDraw);
    return () => {
      c.removeEventListener("mousedown", startDraw); c.removeEventListener("mousemove", draw);
      c.removeEventListener("mouseup", stopDraw); c.removeEventListener("mouseleave", stopDraw);
      c.removeEventListener("touchstart", startDraw); c.removeEventListener("touchmove", draw);
      c.removeEventListener("touchend", stopDraw);
    };
  }, [startDraw, draw, stopDraw]);

  const clear = () => {
    const c = canvasRef.current; if (!c) return;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height); setHasStrokes(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>
          <div className="flex items-center gap-2">
            <PenLine className="w-5 h-5 text-blue-500" />
            <span className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>Sign the Agreement</span>
          </div>
          <button onClick={onCancel} className={`p-1.5 rounded-lg ${isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 pt-4 pb-2">
          <p className={`text-sm mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Draw your signature below using your mouse or finger.</p>
          <div className={`rounded-xl border-2 border-dashed overflow-hidden ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-50"}`}>
            <canvas ref={canvasRef} width={560} height={160} className="w-full touch-none cursor-crosshair block" />
          </div>
          <p className={`text-xs mt-1.5 ${isDark ? "text-gray-600" : "text-gray-400"}`}>Sign within the box above</p>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={clear} className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}>
            <Trash2 className="w-4 h-4" /> Clear
          </button>
          <div className="flex gap-2">
            <button onClick={onCancel} className={`px-4 py-2 rounded-xl text-sm font-medium ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>Cancel</button>
            <button
              onClick={() => { const c = canvasRef.current; if (c) onConfirm(c.toDataURL("image/png")); }}
              disabled={!hasStrokes}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-600 text-white disabled:opacity-40"
            >
              <CheckCircle className="w-4 h-4" /> Confirm Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TenantContractsTab({ isDark, onViewed }: Props) {
  const [contracts, setContracts] = useState<TenantContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [signingId, setSigningId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);

  const authToken = getToken();
  const authHeaders: Record<string, string> = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  const { emitTenantSigned } = useSocketContext();

  useEffect(() => {
    fetch("/api/tenant/contracts", { headers: authHeaders })
      .then(r => r.json())
      .then(d => { if (d.success) setContracts(d.contracts); })
      .catch(() => {})
      .finally(() => setLoading(false));
    onViewed?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSign = async (contractId: string, signatureDataUrl: string) => {
    setSigningId(null);
    setSubmitting(true);
    setSignError(null);
    const contract = contracts.find(c => c._id === contractId);
    if (!contract?.tenantSignToken) { setSignError("Signing link not available."); setSubmitting(false); return; }
    try {
      const res = await fetch(`/api/contracts/sign/${contract.tenantSignToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantSignature: signatureDataUrl }),
      });
      const d = await res.json();
      if (d.success) {
        // Update local state immediately
        setContracts(prev => prev.map(c => c._id === contractId ? {
          ...c,
          status: "TENANT_SIGNED",
          tenantSignature: signatureDataUrl,
          tenantSignedAt: new Date().toISOString(),
          tenantSignToken: undefined,
        } : c));
        // Notify lawyer via socket
        if (contract.lawyer?._id) {
          emitTenantSigned(contractId, contract.lawyer._id, contract.tenantName || "The tenant");
        }
      } else {
        setSignError(d.error || "Failed to submit signature.");
      }
    } catch {
      setSignError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
      {signingId && (
        <SignaturePad
          isDark={isDark}
          onConfirm={(sig) => handleSign(signingId, sig)}
          onCancel={() => setSigningId(null)}
        />
      )}

      <div>
        <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Contracts</h2>
        <p className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Rental agreements sent to you for signature</p>
      </div>

      {signError && (
        <div className={`p-3 rounded-xl border text-sm ${isDark ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-red-50 border-red-200 text-red-700"}`}>
          {signError}
        </div>
      )}

      {contracts.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <FileText className={`w-14 h-14 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
          <p className={`font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>No contracts yet</p>
          <p className={`text-sm mt-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>When a lawyer sends you a rental agreement, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map(c => {
            const cfg = STATUS_CFG[c.status] ?? STATUS_CFG.PENDING_TENANT_REVIEW;
            const StatusIcon = cfg.icon;
            const needsSign = c.status === "PENDING_TENANT_REVIEW";
            const isOpen = expanded === c._id;

            return (
              <div key={c._id} className={`rounded-2xl border overflow-hidden transition-all ${
                needsSign
                  ? isDark ? "bg-yellow-500/5 border-yellow-500/30" : "bg-yellow-50 border-yellow-200"
                  : isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"
              }`}>
                {/* Header row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : c._id)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                    <FileText className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>Rental Agreement</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${isDark ? cfg.dark : cfg.light}`}>
                        <StatusIcon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </div>
                    <div className={`flex items-center gap-3 mt-1 text-xs flex-wrap ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {c.propertyAddress && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{c.propertyAddress.slice(0, 45)}{c.propertyAddress.length > 45 ? "…" : ""}</span>}
                      {c.monthlyRent > 0 && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />₹{c.monthlyRent.toLocaleString("en-IN")}/mo</span>}
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                  {needsSign && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 ${isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700"}`}>
                      Action needed
                    </span>
                  )}
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className={`border-t px-4 pb-5 pt-4 space-y-4 ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                    {/* Parties */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className={`flex items-center gap-2 p-3 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                        <Scale className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{c.lawyer?.fullName}</p>
                          <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Lawyer{c.lawyer?.barCouncilNumber ? ` · Bar #${c.lawyer.barCouncilNumber}` : ""}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 p-3 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                          {c.owner?.profileImage
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={c.owner.profileImage} alt={c.owner.fullName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            : c.owner?.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{c.owner?.fullName}</p>
                          <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Owner</p>
                        </div>
                      </div>
                    </div>

                    {/* Financials */}
                    <div className={`rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                      {[
                        ["Monthly Rent", `₹${c.monthlyRent?.toLocaleString("en-IN") || 0}`],
                        ["Security Deposit", `₹${c.securityDeposit?.toLocaleString("en-IN") || 0}`],
                        ["Lease Duration", c.leaseDuration || "—"],
                        ["Notice Period", c.noticePeriod || "—"],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <p className={`text-xs mb-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
                          <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>{val}</p>
                        </div>
                      ))}
                    </div>

                    {/* Terms */}
                    <div className={`rounded-xl p-3 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Terms & Conditions</p>
                      <pre className={`text-xs whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto ${isDark ? "text-gray-300" : "text-gray-700"}`} data-lenis-prevent>{c.terms || "—"}</pre>
                      {c.policies && (
                        <>
                          <p className={`text-xs font-semibold uppercase tracking-wide mt-3 mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Policies</p>
                          <pre className={`text-xs whitespace-pre-wrap font-sans leading-relaxed max-h-32 overflow-y-auto ${isDark ? "text-gray-300" : "text-gray-700"}`} data-lenis-prevent>{c.policies}</pre>
                        </>
                      )}
                    </div>

                    {/* Owner signature */}
                    {c.ownerSignature && (
                      <div className={`rounded-xl p-3 border ${isDark ? "bg-blue-500/10 border-blue-500/30" : "bg-blue-50 border-blue-200"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <p className={`text-xs font-semibold ${isDark ? "text-blue-400" : "text-blue-700"}`}>
                            Owner signed{c.ownerSignedAt ? ` — ${new Date(c.ownerSignedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : ""}
                          </p>
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.ownerSignature} alt="Owner signature" className={`h-12 rounded-lg border object-contain px-2 py-1 ${isDark ? "border-blue-500/30 bg-gray-900" : "border-blue-200 bg-white"}`} />
                      </div>
                    )}

                    {/* Tenant signature (after signing) */}
                    {c.status === "TENANT_SIGNED" && c.tenantSignature && (
                      <div className={`rounded-xl p-3 border ${isDark ? "bg-green-500/10 border-green-500/30" : "bg-green-50 border-green-200"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <p className={`text-xs font-semibold ${isDark ? "text-green-400" : "text-green-700"}`}>
                            You signed{c.tenantSignedAt ? ` — ${new Date(c.tenantSignedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : ""}
                          </p>
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.tenantSignature} alt="Your signature" className={`h-12 rounded-lg border object-contain px-2 py-1 ${isDark ? "border-green-500/30 bg-gray-900" : "border-green-200 bg-white"}`} />
                        <p className={`text-xs mt-2 ${isDark ? "text-green-500" : "text-green-600"}`}>Contract fully executed. The lawyer has been notified.</p>
                      </div>
                    )}

                    {/* Sign CTA */}
                    {needsSign && (
                      <div className={`rounded-xl p-4 border ${isDark ? "bg-yellow-500/10 border-yellow-500/30" : "bg-yellow-50 border-yellow-200"}`}>
                        <p className={`text-sm font-semibold mb-1 ${isDark ? "text-yellow-300" : "text-yellow-800"}`}>Your signature is required</p>
                        <p className={`text-xs mb-3 ${isDark ? "text-yellow-500" : "text-yellow-700"}`}>
                          By signing, you agree to all terms and conditions in this rental agreement.
                        </p>
                        <button
                          onClick={() => { setSignError(null); setSigningId(c._id); }}
                          disabled={submitting}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors shadow-sm disabled:opacity-50"
                        >
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenLine className="w-4 h-4" />}
                          {submitting ? "Submitting…" : "Sign Agreement"}
                        </button>
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
