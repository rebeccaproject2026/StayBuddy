"use client";

import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  FileText, Plus, Loader2, ChevronRight, ArrowLeft, Save,
  Send, CheckCircle, Clock, RotateCcw, Building2,
  User, Calendar, DollarSign, AlertCircle, PenLine, Download, Mail,
} from "lucide-react";
import { getToken } from "@/lib/token-storage";
import { useSocketContext } from "@/contexts/SocketContext";

// ── Types ─────────────────────────────────────────────────────────────────────
interface BookedTenant {
  renterId: string;
  fullName: string;
  email: string;
  phone: string;
  propertyTitle: string;
  propertyAddress: string;
  contactRequestId: string;
}

interface Contract {
  _id: string;
  status: "DRAFT" | "PENDING_OWNER_REVIEW" | "REVISION_REQUIRED" | "OWNER_SIGNED" | "PENDING_TENANT_REVIEW" | "TENANT_SIGNED";
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  propertyAddress: string;
  monthlyRent: number;
  securityDeposit: number;
  leaseDuration: string;
  startDate: string;
  endDate: string;
  noticePeriod: string;
  terms: string;
  policies: string;
  revisionNote?: string;
  ownerSignedAt?: string;
  ownerSignature?: string;
  tenantSignature?: string;
  tenantSignedAt?: string;
  createdAt: string;
  updatedAt: string;
  owner: { _id: string; fullName: string; email: string; phoneNumber?: string; profileImage?: string };
  property?: { _id: string; title: string; location: string; areaName?: string; price: number; pgName?: string; societyName?: string };
}

interface Props {
  isDark: boolean;
  acceptedOwners: { _id: string; fullName: string; email: string; profileImage?: string }[];
}

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS: Record<string, { label: string; icon: LucideIcon; dark: string; light: string }> = {
  DRAFT:                  { label: "Draft",            icon: FileText,    dark: "bg-gray-700 text-gray-300",          light: "bg-gray-100 text-gray-600" },
  PENDING_OWNER_REVIEW:   { label: "Pending Review",   icon: Clock,       dark: "bg-yellow-500/15 text-yellow-400",   light: "bg-yellow-100 text-yellow-700" },
  REVISION_REQUIRED:      { label: "Revision Needed",  icon: RotateCcw,   dark: "bg-orange-500/15 text-orange-400",   light: "bg-orange-100 text-orange-700" },
  OWNER_SIGNED:           { label: "Owner Signed",     icon: CheckCircle, dark: "bg-blue-500/15 text-blue-400",       light: "bg-blue-100 text-blue-700" },
  PENDING_TENANT_REVIEW:  { label: "Sent to Tenant",   icon: Send,        dark: "bg-purple-500/15 text-purple-400",   light: "bg-purple-100 text-purple-700" },
  TENANT_SIGNED:          { label: "Fully Executed",   icon: CheckCircle, dark: "bg-green-500/15 text-green-400",     light: "bg-green-100 text-green-700" },
};

// ── Field component ───────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function LawyerContractsTab({ isDark, acceptedOwners }: Props) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contract | null>(null);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendingToTenant, setSendingToTenant] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createOwnerId, setCreateOwnerId] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState<Partial<Contract>>({});
  const [dirty, setDirty] = useState(false);
  const [bookedTenants, setBookedTenants] = useState<BookedTenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [sendingPdf, setSendingPdf] = useState(false);
  const [pdfSent, setPdfSent] = useState(false);

  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const { emitContractNotify, emitTenantContractNotify, onNotification } = useSocketContext();

  // Fetch contracts
  useEffect(() => {
    fetch("/api/contracts", { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setContracts(d.contracts); })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live update when tenant signs
  useEffect(() => {
    const off = onNotification((n) => {
      if (n.type === "tenant_signed" && n.contractId) {
        // Refresh the specific contract from the server
        fetch(`/api/contracts/${n.contractId}`, { headers })
          .then(r => r.json())
          .then(d => {
            if (d.success) {
              setContracts(prev => prev.map(c => c._id === d.contract._id ? d.contract : c));
              // If this contract is currently open, update the view
              setSelected(prev => prev?._id === d.contract._id ? d.contract : prev);
              setForm(prev => prev._id === d.contract._id ? { ...d.contract } : prev);
            }
          })
          .catch(() => {});
      }
    });
    return off;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onNotification]);

  const openContract = (c: Contract) => {
    setSelected(c);
    setForm({ ...c });
    setDirty(false);
    // Fetch booked tenants for this owner
    if (c.owner?._id) {
      setLoadingTenants(true);
      setBookedTenants([]);
      fetch(`/api/contracts/booked-tenants?ownerId=${c.owner._id}`, { headers })
        .then(r => r.json())
        .then(d => { if (d.success) setBookedTenants(d.tenants); })
        .catch(() => {})
        .finally(() => setLoadingTenants(false));
    }
  };

  const closeContract = () => { setSelected(null); setForm({}); setDirty(false); setPdfSent(false); };

  const setField = (key: keyof Contract, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const canEdit = selected && ["DRAFT", "REVISION_REQUIRED"].includes(selected.status);
  const canEditTenant = selected && ["DRAFT", "REVISION_REQUIRED", "OWNER_SIGNED"].includes(selected.status);

  // Save draft
  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/contracts/${selected._id}`, {
        method: "PATCH", headers,
        body: JSON.stringify({ action: "save", ...form }),
      });
      const d = await res.json();
      if (d.success) {
        setContracts(prev => prev.map(c => c._id === d.contract._id ? d.contract : c));
        setSelected(d.contract);
        setForm({ ...d.contract });
        setDirty(false);
      }
    } catch {}
    finally { setSaving(false); }
  };

  // Send to owner
  const handleSend = async () => {
    if (!selected) return;
    setSending(true);
    try {
      const res = await fetch(`/api/contracts/${selected._id}`, {
        method: "PATCH", headers,
        body: JSON.stringify({ action: "send_to_owner", ...form }),
      });
      const d = await res.json();
      if (d.success) {
        setContracts(prev => prev.map(c => c._id === d.contract._id ? d.contract : c));
        setSelected(d.contract);
        setForm({ ...d.contract });
        setDirty(false);
        // Notify owner in real-time via socket
        emitContractNotify(d.contract._id, d.contract.owner?._id || d.contract.owner);
      }
    } catch {}
    finally { setSending(false); }
  };

  // Send to tenant (after owner signed) — saves tenant fields first, then sends
  const handleSendToTenant = async () => {
    if (!selected) return;
    setSendingToTenant(true);
    try {
      // First persist any tenant field changes
      if (form.tenantName !== selected.tenantName || form.tenantEmail !== selected.tenantEmail || form.tenantPhone !== selected.tenantPhone) {
        const saveRes = await fetch(`/api/contracts/${selected._id}`, {
          method: "PATCH", headers,
          body: JSON.stringify({
            action: "save_tenant",
            tenantName: form.tenantName,
            tenantEmail: form.tenantEmail,
            tenantPhone: form.tenantPhone,
          }),
        });
        const saveData = await saveRes.json();
        if (!saveData.success) {
          setSendingToTenant(false);
          return;
        }
      }
      // Then send to tenant
      const res = await fetch(`/api/contracts/${selected._id}`, {
        method: "PATCH", headers,
        body: JSON.stringify({ action: "send_to_tenant" }),
      });
      const d = await res.json();
      if (d.success) {
        setContracts(prev => prev.map(c => c._id === d.contract._id ? d.contract : c));
        setSelected(d.contract);
        setForm({ ...d.contract });
        // Notify tenant in real-time via socket (if they have an account)
        const tenantEmail = form.tenantEmail || selected.tenantEmail;
        if (tenantEmail) {
          emitTenantContractNotify(d.contract._id, tenantEmail);
        }
      }
    } catch {}
    finally { setSendingToTenant(false); }
  };

  // Create new contract
  const handleCreate = async () => {
    if (!createOwnerId) return;
    setCreating(true);
    try {
      const res = await fetch("/api/contracts", {
        method: "POST", headers,
        body: JSON.stringify({ ownerId: createOwnerId }),
      });
      const d = await res.json();
      if (d.success) {
        setContracts(prev => [d.contract, ...prev]);
        setShowCreateModal(false);
        setCreateOwnerId("");
        openContract(d.contract);
      }
    } catch {}
    finally { setCreating(false); }
  };

  // Generate PDF client-side and return base64 string
  const generateContractPdf = async (c: Contract): Promise<string> => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210, margin = 18, lineH = 7, maxW = W - margin * 2;
    let y = margin;

    const addText = (text: string, size: number, bold = false, color = "#111827") => {
      doc.setFontSize(size);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      const [r, g, b] = color === "#4f46e5" ? [79, 70, 229] : color === "#6b7280" ? [107, 114, 128] : [17, 24, 39];
      doc.setTextColor(r, g, b);
    };

    const writeLine = (text: string, size = 10, bold = false, color = "#111827", indent = 0) => {
      addText(text, size, bold, color);
      const lines = doc.splitTextToSize(text, maxW - indent);
      lines.forEach((line: string) => {
        if (y > 275) { doc.addPage(); y = margin; }
        doc.text(line, margin + indent, y);
        y += lineH;
      });
    };

    const gap = (n = 4) => { y += n; };

    // Header
    writeLine("StayBuddy", 20, true, "#4f46e5");
    writeLine("RENTAL AGREEMENT", 13, true);
    writeLine("Fully Executed — Both Parties Signed", 9, false, "#6b7280");
    gap(6);

    // Divider
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, y, W - margin, y); gap(5);

    // Parties
    writeLine("PARTIES", 10, true);
    gap(2);
    writeLine(`Lawyer: ${c.owner?.fullName || "—"} (Prepared by)`, 9, false, "#6b7280");
    writeLine(`Owner: ${c.owner?.fullName || "—"}  ·  ${c.owner?.email || ""}`, 9);
    writeLine(`Tenant: ${c.tenantName || "—"}  ·  ${c.tenantEmail || ""}  ·  ${c.tenantPhone || ""}`, 9);
    gap(5);

    // Property & Financials
    doc.line(margin, y, W - margin, y); gap(5);
    writeLine("PROPERTY & FINANCIALS", 10, true);
    gap(2);
    writeLine(`Address: ${c.propertyAddress || "—"}`, 9);
    writeLine(`Monthly Rent: ₹${c.monthlyRent?.toLocaleString("en-IN") || 0}   Security Deposit: ₹${c.securityDeposit?.toLocaleString("en-IN") || 0}`, 9);
    writeLine(`Lease Duration: ${c.leaseDuration || "—"}   Notice Period: ${c.noticePeriod || "—"}`, 9);
    if (c.startDate || c.endDate) writeLine(`Start: ${c.startDate || "—"}   End: ${c.endDate || "—"}`, 9);
    gap(5);

    // Terms
    doc.line(margin, y, W - margin, y); gap(5);
    writeLine("TERMS & CONDITIONS", 10, true);
    gap(2);
    writeLine(c.terms || "—", 8, false, "#374151");
    gap(4);
    writeLine("POLICIES", 10, true);
    gap(2);
    writeLine(c.policies || "—", 8, false, "#374151");
    gap(6);

    // Signatures
    doc.line(margin, y, W - margin, y); gap(5);
    writeLine("SIGNATURES", 10, true);
    gap(3);

    const embedSig = async (label: string, dataUrl: string | undefined, signedAt: string | undefined) => {
      writeLine(label, 9, true);
      if (dataUrl) {
        if (y + 22 > 275) { doc.addPage(); y = margin; }
        try {
          doc.addImage(dataUrl, "PNG", margin, y, 60, 18);
          y += 20;
        } catch {}
      }
      writeLine(`Signed: ${signedAt ? new Date(signedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}`, 8, false, "#6b7280");
      gap(4);
    };

    await embedSig("Owner's Signature", c.ownerSignature, c.ownerSignedAt);
    await embedSig("Tenant's Signature", c.tenantSignature, c.tenantSignedAt);

    // Footer
    if (y > 260) { doc.addPage(); y = margin; }
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, y + 4, W - margin, y + 4);
    addText(`Generated by StayBuddy on ${new Date().toLocaleDateString("en-IN")}`, 7, false, "#6b7280");
    doc.text(`Generated by StayBuddy on ${new Date().toLocaleDateString("en-IN")}`, margin, y + 10);

    // Return base64 (strip the data:application/pdf;base64, prefix)
    const dataUri = doc.output("datauristring");
    return dataUri.split(",")[1];
  };

  // Download PDF locally
  const handleDownloadPdf = async () => {
    if (!selected) return;
    setGeneratingPdf(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      // Re-use the same generation logic via generateContractPdf
      const base64 = await generateContractPdf(selected);
      // Convert back to blob and download
      const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `rental-agreement-${selected._id.slice(-6)}.pdf`;
      a.click(); URL.revokeObjectURL(url);
    } catch {}
    finally { setGeneratingPdf(false); }
  };

  // Generate PDF and email to owner + tenant
  const handleSendPdf = async () => {
    if (!selected) return;
    setSendingPdf(true);
    setPdfSent(false);
    try {
      const base64 = await generateContractPdf(selected);
      const res = await fetch(`/api/contracts/${selected._id}/send-pdf`, {
        method: "POST", headers,
        body: JSON.stringify({ pdfBase64: base64 }),
      });
      const d = await res.json();
      if (d.success) setPdfSent(true);
    } catch {}
    finally { setSendingPdf(false); }
  };

  const inp = `w-full px-3 py-2 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-primary transition-all ${
    isDark ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500" : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
  }`;
  const inpDisabled = `${inp} opacity-60 cursor-not-allowed`;
  const textarea = `${inp} resize-none`;

  // ── Contract editor ───────────────────────────────────────────────────────
  if (selected) {
    const cfg = STATUS[selected.status] ?? STATUS.DRAFT;
    const StatusIcon = cfg.icon;

    return (
      <div className="space-y-5 max-w-4xl">
        {/* Top bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={closeContract}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Contracts
          </button>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${isDark ? cfg.dark : cfg.light}`}>
            <StatusIcon className="w-3.5 h-3.5" /> {cfg.label}
          </span>
          {dirty && canEdit && (
            <span className={`text-xs ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>● Unsaved changes</span>
          )}
          <div className="ml-auto flex items-center gap-2">
            {canEdit && (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving || !dirty}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Draft
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90 text-white transition-colors disabled:opacity-50"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send to Owner
                </button>
              </>
            )}
            {selected.status === "OWNER_SIGNED" && (
              <button
                onClick={handleSendToTenant}
                disabled={sendingToTenant || !form.tenantEmail}
                title={!form.tenantEmail ? "Add tenant email first" : ""}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50"
              >
                {sendingToTenant ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send to Tenant
              </button>
            )}
          </div>
        </div>

        {/* Revision note banner */}
        {selected.status === "REVISION_REQUIRED" && selected.revisionNote && (
          <div className={`flex items-start gap-3 p-4 rounded-xl border ${isDark ? "bg-orange-500/10 border-orange-500/30 text-orange-300" : "bg-orange-50 border-orange-200 text-orange-800"}`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Owner requested changes</p>
              <p className="text-sm mt-0.5">{selected.revisionNote}</p>
            </div>
          </div>
        )}

        {/* Owner info */}
        <div className={`rounded-2xl border p-4 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Owner</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
              {selected.owner?.profileImage
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={selected.owner.profileImage} alt={selected.owner.fullName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                : selected.owner?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{selected.owner?.fullName}</p>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{selected.owner?.email}</p>
            </div>
          </div>
        </div>

        {/* Form grid */}
        <div className={`rounded-2xl border p-5 space-y-5 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-500" : "text-gray-400"}`}>Tenant Details</p>
            {canEditTenant && (
              <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Select a booked tenant to auto-fill
              </span>
            )}
          </div>

          {/* Booked tenant selector */}
          {canEditTenant && (
            <div>
              {loadingTenants ? (
                <div className={`flex items-center gap-2 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading booked tenants…
                </div>
              ) : bookedTenants.length === 0 ? (
                <p className={`text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                  No booked tenants found for this owner. Fill in details manually.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Booked tenants ({bookedTenants.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bookedTenants.map(t => (
                      <button
                        key={t.renterId}
                        type="button"
                        onClick={() => {
                          setField("tenantName", t.fullName);
                          setField("tenantEmail", t.email);
                          setField("tenantPhone", t.phone);
                          if (t.propertyAddress && !form.propertyAddress) {
                            setField("propertyAddress", t.propertyAddress);
                          }
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-sm transition-colors ${
                          form.tenantEmail === t.email
                            ? "border-primary bg-primary/10 text-primary"
                            : isDark
                              ? "border-gray-700 hover:border-primary/50 bg-gray-800 text-gray-300"
                              : "border-gray-200 hover:border-primary/40 bg-gray-50 text-gray-700"
                        }`}
                      >
                        <User className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>
                          <span className="font-semibold">{t.fullName}</span>
                          {t.propertyTitle && (
                            <span className={`ml-1.5 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                              · {t.propertyTitle}
                            </span>
                          )}
                        </span>
                        {form.tenantEmail === t.email && <CheckCircle className="w-3.5 h-3.5 ml-1 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Tenant Name">
              <input className={canEditTenant ? inp : inpDisabled} value={form.tenantName || ""} disabled={!canEditTenant}
                onChange={e => setField("tenantName", e.target.value)} placeholder="Full name" />
            </Field>
            <Field label="Tenant Email">
              <input className={canEditTenant ? inp : inpDisabled} value={form.tenantEmail || ""} disabled={!canEditTenant}
                onChange={e => setField("tenantEmail", e.target.value)} placeholder="email@example.com" />
            </Field>
            <Field label="Tenant Phone">
              <input className={canEditTenant ? inp : inpDisabled} value={form.tenantPhone || ""} disabled={!canEditTenant}
                onChange={e => setField("tenantPhone", e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </Field>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 space-y-5 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-500" : "text-gray-400"}`}>Property & Financials</p>
          <Field label="Property Address">
            <input className={canEdit ? inp : inpDisabled} value={form.propertyAddress || ""} disabled={!canEdit}
              onChange={e => setField("propertyAddress", e.target.value)} placeholder="Full address" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Monthly Rent (₹)">
              <input type="number" className={canEdit ? inp : inpDisabled} value={form.monthlyRent || ""} disabled={!canEdit}
                onChange={e => setField("monthlyRent", Number(e.target.value))} placeholder="0" />
            </Field>
            <Field label="Security Deposit (₹)">
              <input type="number" className={canEdit ? inp : inpDisabled} value={form.securityDeposit || ""} disabled={!canEdit}
                onChange={e => setField("securityDeposit", Number(e.target.value))} placeholder="0" />
            </Field>
            <Field label="Lease Duration">
              <input className={canEdit ? inp : inpDisabled} value={form.leaseDuration || ""} disabled={!canEdit}
                onChange={e => setField("leaseDuration", e.target.value)} placeholder="11 months" />
            </Field>
            <Field label="Notice Period">
              <input className={canEdit ? inp : inpDisabled} value={form.noticePeriod || ""} disabled={!canEdit}
                onChange={e => setField("noticePeriod", e.target.value)} placeholder="1 month" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Start Date">
              <input type="date" className={canEdit ? inp : inpDisabled} value={form.startDate || ""} disabled={!canEdit}
                onChange={e => setField("startDate", e.target.value)} />
            </Field>
            <Field label="End Date">
              <input type="date" className={canEdit ? inp : inpDisabled} value={form.endDate || ""} disabled={!canEdit}
                onChange={e => setField("endDate", e.target.value)} />
            </Field>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 space-y-4 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-500" : "text-gray-400"}`}>Terms & Conditions</p>
          <Field label="Terms">
            <textarea rows={10} className={canEdit ? textarea : `${textarea} opacity-60 cursor-not-allowed`}
              value={form.terms || ""} disabled={!canEdit}
              onChange={e => setField("terms", e.target.value)} />
          </Field>
          <Field label="Policies">
            <textarea rows={6} className={canEdit ? textarea : `${textarea} opacity-60 cursor-not-allowed`}
              value={form.policies || ""} disabled={!canEdit}
              onChange={e => setField("policies", e.target.value)} />
          </Field>
        </div>

        {/* Signed info */}
        {(selected.status === "OWNER_SIGNED" || selected.status === "PENDING_TENANT_REVIEW" || selected.status === "TENANT_SIGNED") && (
          <div className="space-y-4">
            {/* Owner signature */}
            <div className={`rounded-2xl border p-5 space-y-3 ${isDark ? "bg-blue-500/10 border-blue-500/30" : "bg-blue-50 border-blue-200"}`}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <p className={`font-bold text-sm ${isDark ? "text-blue-400" : "text-blue-700"}`}>
                  Owner Signed
                  {selected.ownerSignedAt && ` — ${new Date(selected.ownerSignedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
                </p>
              </div>
              {selected.ownerSignature && (
                <div>
                  <p className={`text-xs font-medium mb-1.5 flex items-center gap-1 ${isDark ? "text-blue-500" : "text-blue-600"}`}>
                    <PenLine className="w-3.5 h-3.5" /> Owner&apos;s Signature
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.ownerSignature} alt="Owner signature"
                    className={`h-16 rounded-xl border object-contain px-3 py-2 ${isDark ? "border-blue-500/30 bg-gray-900" : "border-blue-200 bg-white"}`} />
                </div>
              )}
              {selected.status === "OWNER_SIGNED" && (
                <p className={`text-xs ${isDark ? "text-blue-500" : "text-blue-600"}`}>
                  Click "Send to Tenant" above to send the contract to <strong>{form.tenantName || "the tenant"}</strong> ({form.tenantEmail || "no email set"}) for their signature.
                </p>
              )}
            </div>

            {/* Tenant signature */}
            {selected.status === "TENANT_SIGNED" && (
              <div className={`rounded-2xl border p-5 space-y-4 ${isDark ? "bg-green-500/10 border-green-500/30" : "bg-green-50 border-green-200"}`}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className={`font-bold text-sm ${isDark ? "text-green-400" : "text-green-700"}`}>
                    Tenant Signed — Contract Fully Executed
                    {selected.tenantSignedAt && ` — ${new Date(selected.tenantSignedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
                  </p>
                </div>
                {selected.tenantSignature && (
                  <div>
                    <p className={`text-xs font-medium mb-1.5 flex items-center gap-1 ${isDark ? "text-green-500" : "text-green-600"}`}>
                      <PenLine className="w-3.5 h-3.5" /> Tenant&apos;s Signature
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selected.tenantSignature} alt="Tenant signature"
                      className={`h-16 rounded-xl border object-contain px-3 py-2 ${isDark ? "border-green-500/30 bg-gray-900" : "border-green-200 bg-white"}`} />
                  </div>
                )}

                {/* PDF actions */}
                <div className={`pt-3 border-t space-y-3 ${isDark ? "border-green-500/20" : "border-green-200"}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-green-500" : "text-green-700"}`}>
                    Contract Document
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {/* Download PDF */}
                    <button
                      onClick={handleDownloadPdf}
                      disabled={generatingPdf || sendingPdf}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-300"}`}
                    >
                      {generatingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      Download PDF
                    </button>

                    {/* Send PDF to owner & tenant */}
                    <button
                      onClick={handleSendPdf}
                      disabled={sendingPdf || generatingPdf || pdfSent}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50"
                    >
                      {sendingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : pdfSent ? <CheckCircle className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                      {sendingPdf ? "Sending…" : pdfSent ? "Sent to both parties" : "Email PDF to Owner & Tenant"}
                    </button>
                  </div>
                  {pdfSent && (
                    <p className={`text-xs ${isDark ? "text-green-400" : "text-green-600"}`}>
                      ✓ Contract PDF sent to {selected.owner?.email} and {selected.tenantEmail}
                    </p>
                  )}
                </div>
              </div>
            )}

            {selected.status === "PENDING_TENANT_REVIEW" && (
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${isDark ? "bg-purple-500/10 border-purple-500/30 text-purple-400" : "bg-purple-50 border-purple-200 text-purple-700"}`}>
                <Send className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm font-medium">
                  Contract sent to tenant ({selected.tenantEmail}) — awaiting their signature.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Contracts list ────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Contracts</h2>
          <p className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Create and manage rental contracts with property owners
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90 text-white transition-colors"
        >
          <Plus className="w-4 h-4" /> New Contract
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
        </div>
      ) : contracts.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <FileText className={`w-14 h-14 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
          <p className={`font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>No contracts yet</p>
          <p className={`text-sm mt-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
            Click "New Contract" to create your first rental contract
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {contracts.map(c => {
            const cfg = STATUS[c.status] ?? STATUS.DRAFT;
            const StatusIcon = cfg.icon;
            return (
              <div
                key={c._id}
                onClick={() => openContract(c)}
                className={`rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md flex items-center gap-4 ${
                  c.status === "OWNER_SIGNED"
                    ? isDark ? "bg-green-500/5 border-green-500/30 hover:border-green-500/50" : "bg-green-50 border-green-200 hover:border-green-400"
                    : isDark ? "bg-gray-900 border-gray-800 hover:border-gray-700" : "bg-white border-gray-200 shadow-sm hover:border-primary/30"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                  <FileText className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                      Contract with {c.owner?.fullName || "—"}
                    </p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${isDark ? cfg.dark : cfg.light}`}>
                      <StatusIcon className="w-3 h-3" /> {cfg.label}
                    </span>
                  </div>
                  <div className={`flex items-center gap-3 mt-1 text-xs flex-wrap ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {c.propertyAddress && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{c.propertyAddress.slice(0, 40)}{c.propertyAddress.length > 40 ? "…" : ""}</span>}
                    {c.monthlyRent > 0 && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />₹{c.monthlyRent.toLocaleString("en-IN")}/mo</span>}
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  {c.status === "REVISION_REQUIRED" && c.revisionNote && (
                    <p className={`text-xs mt-1 italic ${isDark ? "text-orange-400" : "text-orange-600"}`}>
                      Owner note: {c.revisionNote.slice(0, 80)}{c.revisionNote.length > 80 ? "…" : ""}
                    </p>
                  )}
                  {c.status === "OWNER_SIGNED" && c.ownerSignature && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <PenLine className={`w-3 h-3 flex-shrink-0 ${isDark ? "text-green-500" : "text-green-600"}`} />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.ownerSignature} alt="signature" className={`h-6 rounded border ${isDark ? "border-green-500/30 bg-gray-800" : "border-green-200 bg-white"}`} />
                    </div>
                  )}
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
              </div>
            );
          })}
        </div>
      )}

      {/* Create modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>New Contract</h3>
            <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Select an owner you have an accepted connection with
            </p>
            {acceptedOwners.length === 0 ? (
              <div className={`text-center py-6 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                <User className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No accepted owner connections yet.</p>
                <p className="text-xs mt-1">Send a request to an owner and wait for acceptance.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto mb-4" data-lenis-prevent>
                {acceptedOwners.map(o => (
                  <button
                    key={o._id}
                    onClick={() => setCreateOwnerId(o._id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-colors ${
                      createOwnerId === o._id
                        ? "border-primary bg-primary/10"
                        : isDark ? "border-gray-700 hover:border-gray-600 bg-gray-800" : "border-gray-200 hover:border-primary/30 bg-gray-50"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                      {o.profileImage
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={o.profileImage} alt={o.fullName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        : o.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{o.fullName}</p>
                      <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>{o.email}</p>
                    </div>
                    {createOwnerId === o._id && <CheckCircle className="w-4 h-4 text-primary ml-auto flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShowCreateModal(false); setCreateOwnerId(""); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!createOwnerId || creating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90 text-white transition-colors disabled:opacity-50"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
