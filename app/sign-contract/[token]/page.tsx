"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle, Loader2, PenLine, Trash2, X, Scale,
  Building2, DollarSign, Calendar, AlertCircle,
} from "lucide-react";

interface ContractData {
  _id: string;
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
  owner: { fullName: string; email: string };
  lawyer: { fullName: string; email: string; barCouncilNumber?: string };
}

// ── Signature Pad ─────────────────────────────────────────────────────────────
function SignaturePad({ onConfirm, onCancel }: {
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
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current; if (!canvas) return;
    e.preventDefault(); drawing.current = true;
    const ctx = canvas.getContext("2d")!;
    const { x, y } = getPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current; if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext("2d")!;
    ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = "#1d4ed8";
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y); ctx.stroke(); setHasStrokes(true);
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
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <PenLine className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-base text-gray-900">Sign the Agreement</span>
          </div>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 pt-4">
          <p className="text-sm text-gray-500">Draw your signature below using your mouse or finger.</p>
        </div>
        <div className="px-5 pt-3 pb-2">
          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden">
            <canvas ref={canvasRef} width={560} height={180} className="w-full touch-none cursor-crosshair block" />
          </div>
          <p className="text-xs mt-1.5 text-gray-400">Sign within the box above</p>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={clear} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-600">
            <Trash2 className="w-4 h-4" /> Clear
          </button>
          <div className="flex gap-2">
            <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700">Cancel</button>
            <button onClick={() => { const c = canvasRef.current; if (c) onConfirm(c.toDataURL("image/png")); }}
              disabled={!hasStrokes}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-600 text-white disabled:opacity-40">
              <CheckCircle className="w-4 h-4" /> Confirm Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TenantSignPage() {
  const { token } = useParams<{ token: string }>();
  const [contract, setContract] = useState<ContractData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPad, setShowPad] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`/api/contracts/sign/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setContract(d.contract);
        else setError(d.error || "Invalid link");
      })
      .catch(() => setError("Failed to load contract"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSign = async (signatureDataUrl: string) => {
    setShowPad(false);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/contracts/sign/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantSignature: signatureDataUrl }),
      });
      const d = await res.json();
      if (d.success) setDone(true);
      else setError(d.error || "Failed to submit signature");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Link Unavailable</h2>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-green-200 p-8 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Agreement Signed!</h2>
          <p className="text-gray-500 text-sm">
            Your signature has been recorded. The lawyer will be notified and you will receive a copy shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {showPad && <SignaturePad onConfirm={handleSign} onCancel={() => setShowPad(false)} />}

      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600">StayBuddy</h1>
          <p className="text-gray-500 text-sm mt-1">Rental Agreement — Tenant Signature Required</p>
        </div>

        {/* Lawyer & Owner info */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Prepared by</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {contract!.lawyer.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">{contract!.lawyer.fullName}</p>
                <Scale className="w-3.5 h-3.5 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-500">{contract!.lawyer.email}</p>
              {contract!.lawyer.barCouncilNumber && (
                <p className="text-xs text-gray-400">Bar #{contract!.lawyer.barCouncilNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* Financials */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Property & Financials</p>
          <p className="text-sm text-gray-700">{contract!.propertyAddress || "—"}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              ["Monthly Rent", `₹${contract!.monthlyRent?.toLocaleString("en-IN") || 0}`],
              ["Security Deposit", `₹${contract!.securityDeposit?.toLocaleString("en-IN") || 0}`],
              ["Lease Duration", contract!.leaseDuration || "—"],
              ["Notice Period", contract!.noticePeriod || "—"],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-xs font-medium mb-1 text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{val}</p>
              </div>
            ))}
          </div>
          {(contract!.startDate || contract!.endDate) && (
            <div className="grid grid-cols-2 gap-4">
              {[["Start Date", contract!.startDate], ["End Date", contract!.endDate]].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs font-medium mb-1 text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-800">{val || "—"}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Terms & Conditions</p>
          <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed text-gray-700">{contract!.terms || "—"}</pre>
          <div className="border-t pt-4 border-gray-100">
            <p className="text-xs font-medium mb-2 text-gray-400">Policies</p>
            <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed text-gray-700">{contract!.policies || "—"}</pre>
          </div>
        </div>

        {/* Owner signature */}
        {contract!.ownerSignature && (
          <div className="bg-green-50 rounded-2xl border border-green-200 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-sm font-semibold text-green-700">
                Owner signed on {contract!.ownerSignedAt ? new Date(contract!.ownerSignedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-green-600 mb-1.5">Owner&apos;s Signature</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={contract!.ownerSignature} alt="Owner signature" className="h-14 rounded-lg border border-green-200 bg-white" />
            </div>
          </div>
        )}

        {/* Sign action */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <p className="font-semibold text-gray-900">Your Signature Required</p>
          <p className="text-sm text-gray-500">
            By signing, you agree to all terms and conditions stated in this rental agreement.
          </p>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          <button
            onClick={() => setShowPad(true)}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-50 shadow-sm"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenLine className="w-4 h-4" />}
            {submitting ? "Submitting…" : "Sign the Agreement"}
          </button>
        </div>
      </div>
    </div>
  );
}
