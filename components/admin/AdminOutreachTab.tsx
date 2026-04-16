"use client";

import { Loader2, Trash2, CheckCircle, X } from "lucide-react";
import { getToken } from "@/lib/token-storage";

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const WA_MESSAGE = `Hello Sir,\n\nWe help PG owners in Ahmedabad & Gandhinagar get more tenants through our platform.\n\nCurrently, we are offering FREE listing and promotion for early partners.\n\nWould you like to list your PG with us and get more inquiries?\n\nReply YES and we will get you started.`;

interface WaEntry {
  id: string;
  phone: string;
  name: string;
  pgName: string;
}

interface AdminOutreachTabProps {
  isDark: boolean;
  currentCountry: string;
  leads: any[];
  leadsLoading: boolean;
  leadsTab: "compose" | "database";
  setLeadsTab: (v: "compose" | "database") => void;
  waEntries: WaEntry[];
  setWaEntries: (fn: (prev: WaEntry[]) => WaEntry[]) => void;
  waSent: Set<string>;
  setWaSent: (fn: (prev: Set<string>) => Set<string>) => void;
  setLeads: (fn: (prev: any[]) => any[]) => void;
  fetchLeads: () => void;
}

export default function AdminOutreachTab({
  isDark,
  currentCountry,
  leads,
  leadsLoading,
  leadsTab,
  setLeadsTab,
  waEntries,
  setWaEntries,
  waSent,
  setWaSent,
  setLeads,
  fetchLeads,
}: AdminOutreachTabProps) {
  const buildLink = (phone: string, name: string, pgName: string) => {
    let msg = WA_MESSAGE;
    if (name) msg = `Hello ${name},\n\n` + msg.replace("Hello Sir,\n\n", "");
    if (pgName) msg = msg + `\n\nPG Name: ${pgName}`;
    const clean = phone.replace(/\D/g, "");
    const num = clean.startsWith("91") ? clean : `91${clean}`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  };

  const addRow = () => setWaEntries(prev => [...prev, { id: crypto.randomUUID(), phone: "", name: "", pgName: "" }]);
  const removeRow = (id: string) => setWaEntries(prev => prev.filter(e => e.id !== id));
  const updateRow = (id: string, field: string, value: string) =>
    setWaEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));

  const saveLead = async (entry: { phone: string; name: string; pgName: string }) => {
    const token = getToken();
    if (!token) return;
    try {
      await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ phone: entry.phone.replace(/\D/g, ""), name: entry.name, pgName: entry.pgName, country: currentCountry }),
      });
      fetchLeads();
    } catch {}
  };

  const markSent = (id: string, entry: { phone: string; name: string; pgName: string }) => {
    setWaSent(prev => new Set(prev).add(id));
    saveLead(entry);
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    const token = getToken();
    if (!token) return;
    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ leadId, status }),
      });
      setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status } : l));
    } catch {}
  };

  const deleteLead = async (leadId: string) => {
    const token = getToken();
    if (!token) return;
    try {
      await fetch(`/api/admin/leads?id=${leadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(prev => prev.filter(l => l._id !== leadId));
    } catch {}
  };

  const statusColors: Record<string, string> = {
    contacted: isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700",
    interested: isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700",
    not_interested: isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700",
    listed: isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700",
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero header */}
      <div className={`relative overflow-hidden rounded-xl p-4 sm:p-6 border ${isDark ? "bg-gradient-to-br from-green-950/60 via-gray-900 to-gray-900 border-green-800/30" : "bg-gradient-to-br from-green-50 via-white to-white border-green-200"}`}>
        <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 opacity-5 pointer-events-none">
          <div className="w-full h-full text-green-500 scale-150 translate-x-8 -translate-y-8">{WA_ICON}</div>
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 flex-shrink-0">
              <div className="w-5 h-5 sm:w-6 sm:h-6 text-white">{WA_ICON}</div>
            </div>
            <div>
              <h2 className={`text-lg sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>WhatsApp Outreach</h2>
              <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Send targeted messages · leads auto-saved</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {[
              { value: leads.length, label: "Leads", color: "text-green-500" },
              { value: leads.filter((l: any) => l.status === "interested").length, label: "Interested", color: "text-blue-400" },
              { value: leads.filter((l: any) => l.status === "listed").length, label: "Listed", color: "text-purple-400" },
            ].map(({ value, label, color }) => (
              <div key={label} className={`text-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white border-gray-200 shadow-sm"}`}>
                <p className={`text-base sm:text-lg font-bold ${color}`}>{value}</p>
                <p className={`text-[10px] sm:text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className={`flex gap-1 p-1 rounded-xl w-full sm:w-fit ${isDark ? "bg-gray-800/80" : "bg-gray-100"}`}>
        {([
          { key: "compose", label: "✉ Compose" },
          { key: "database", label: `📋 Leads (${leads.length})` },
        ] as const).map(({ key, label }) => (
          <button key={key} onClick={() => setLeadsTab(key)}
            className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-all ${leadsTab === key
              ? "bg-green-500 text-white shadow-md shadow-green-500/20"
              : isDark ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"}`}>
            {label}
          </button>
        ))}
      </div>

      {leadsTab === "compose" && (<>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Message preview */}
          <div className={`lg:col-span-2 rounded-xl border p-4 sm:p-5 flex flex-col gap-3 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Message Template</p>
            </div>
            <div className="relative">
              <div className={`rounded-xl rounded-tl-sm p-3 sm:p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${isDark ? "bg-green-900/40 text-green-200 border border-green-800/40" : "bg-green-100 text-green-900 border border-green-200"}`}>
                {WA_MESSAGE}
              </div>
              <div className={`absolute -top-1 -left-1 w-3 h-3 ${isDark ? "text-green-900/40" : "text-green-100"}`}>
                <svg viewBox="0 0 12 12" fill="currentColor"><path d="M0 0 L12 0 L0 12 Z"/></svg>
              </div>
            </div>
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              If owner name is provided, "Sir" is replaced with their name.
            </p>
          </div>

          {/* Recipients */}
          <div className={`lg:col-span-3 rounded-xl border overflow-hidden ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <div className={`px-4 sm:px-5 py-3 sm:py-4 border-b flex items-center justify-between ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <div className="flex items-center gap-2">
                <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>Recipients</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>{waEntries.length}</span>
              </div>
              <button onClick={addRow} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 active:scale-95 text-white text-xs font-bold rounded-lg transition-all shadow-sm shadow-green-500/30">
                <span className="text-sm leading-none">+</span> Add
              </button>
            </div>

            <div className={`divide-y ${isDark ? "divide-gray-800/60" : "divide-gray-100"}`}>
              {waEntries.map((entry, idx) => {
                const isValid = entry.phone.replace(/\D/g, "").length >= 10;
                const sent = waSent.has(entry.id);
                return (
                  <div key={entry.id} className={`p-3 sm:p-4 transition-all duration-300 ${sent ? isDark ? "bg-green-500/5 border-l-2 border-green-500" : "bg-green-50 border-l-2 border-green-400" : ""}`}>
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${sent ? "bg-green-500 text-white scale-110" : isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                        {sent ? "✓" : idx + 1}
                      </div>
                      {sent ? (
                        <span className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                          <CheckCircle className="w-3 h-3" /> Saved · Opened in WhatsApp
                        </span>
                      ) : (
                        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Fill details and send</span>
                      )}
                      {waEntries.length > 1 && (
                        <button onClick={() => removeRow(entry.id)} className={`ml-auto w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDark ? "text-gray-600 hover:bg-red-500/20 hover:text-red-400" : "text-gray-300 hover:bg-red-50 hover:text-red-500"}`}>
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="relative">
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold pointer-events-none ${isDark ? "text-gray-500" : "text-gray-400"}`}>+91</span>
                        <input type="tel" placeholder="Phone *" value={entry.phone}
                          onChange={e => updateRow(entry.id, "phone", e.target.value)}
                          className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                            isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-600" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                          } ${isValid ? isDark ? "border-green-500/50 bg-green-500/5" : "border-green-400 bg-green-50/50" : ""}`}
                        />
                      </div>
                      <input type="text" placeholder="Owner name" value={entry.name}
                        onChange={e => updateRow(entry.id, "name", e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-600" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
                      />
                      <input type="text" placeholder="PG name" value={entry.pgName}
                        onChange={e => updateRow(entry.id, "pgName", e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-600" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
                      />
                    </div>

                    <div className="mt-2.5">
                      <a
                        href={isValid ? buildLink(entry.phone, entry.name, entry.pgName) : undefined}
                        target="_blank" rel="noopener noreferrer"
                        onClick={() => isValid && markSent(entry.id, entry)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                          isValid
                            ? sent
                              ? isDark ? "bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25" : "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                              : "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                            : "opacity-30 cursor-not-allowed pointer-events-none " + (isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-400")
                        }`}
                      >
                        <span className="w-4 h-4">{WA_ICON}</span>
                        {sent ? "Sent — Open Again" : "Send on WhatsApp"}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {waEntries.length > 1 && (
              <div className={`px-4 sm:px-5 py-3 border-t flex items-center gap-3 ${isDark ? "border-gray-800 bg-gray-800/40" : "border-gray-100 bg-gray-50"}`}>
                <span className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-500"}`}>{waSent.size}/{waEntries.length} sent</span>
                <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${waEntries.length ? (waSent.size / waEntries.length) * 100 : 0}%` }} />
                </div>
                <span className="text-xs font-bold text-green-500">{waEntries.length ? Math.round((waSent.size / waEntries.length) * 100) : 0}%</span>
              </div>
            )}
          </div>
        </div>
      </>)}

      {leadsTab === "database" && (
        <div className={`rounded-xl border overflow-hidden ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <div className={`px-4 sm:px-5 py-3 sm:py-4 border-b flex items-center justify-between gap-3 ${isDark ? "border-gray-800" : "border-gray-100"}`}>
            <div className="flex items-center gap-2 flex-wrap">
              <p className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>Lead Database</p>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>{leads.length} total</span>
              {leads.filter((l: any) => l.status === "interested").length > 0 && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"}`}>
                  {leads.filter((l: any) => l.status === "interested").length} interested
                </span>
              )}
            </div>
            <button onClick={fetchLeads} className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all active:scale-95 ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}>
              <Loader2 className={`w-3.5 h-3.5 ${leadsLoading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
          {leadsLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className={`w-8 h-8 animate-spin mx-auto mb-2 ${isDark ? "text-green-500" : "text-green-600"}`} />
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Loading leads...</p>
              </div>
            </div>
          ) : leads.length === 0 ? (
            <div className="py-20 text-center">
              <div className={`w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                <div className={`w-8 h-8 ${isDark ? "text-gray-600" : "text-gray-400"}`}>{WA_ICON}</div>
              </div>
              <p className={`font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>No leads yet</p>
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>Send your first WhatsApp message to start building your lead list.</p>
              <button onClick={() => setLeadsTab("compose")} className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all active:scale-95">
                Go to Compose
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className={`border-b ${isDark ? "bg-gray-800/60 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                    {["#", "Phone", "Name", "PG Name", "Status", "Date", ""].map(h => (
                      <th key={h} className={`px-3 sm:px-4 py-3 text-left text-xs font-bold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-gray-800/60" : "divide-gray-100"}`}>
                  {leads.map((lead: any, idx: number) => (
                    <tr key={lead._id} className={`group transition-colors ${isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"}`}>
                      <td className={`px-3 sm:px-4 py-3 text-xs font-medium ${isDark ? "text-gray-600" : "text-gray-400"}`}>{idx + 1}</td>
                      <td className="px-3 sm:px-4 py-3">
                        <a href={`https://wa.me/91${lead.phone}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-green-500 hover:text-green-400 font-semibold text-xs sm:text-sm transition-colors">
                          <span className="w-3.5 h-3.5 flex-shrink-0">{WA_ICON}</span>
                          {lead.phone}
                        </a>
                      </td>
                      <td className={`px-3 sm:px-4 py-3 text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        {lead.name || <span className={`${isDark ? "text-gray-600" : "text-gray-300"}`}>—</span>}
                      </td>
                      <td className={`px-3 sm:px-4 py-3 text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        {lead.pgName || <span className={`${isDark ? "text-gray-600" : "text-gray-300"}`}>—</span>}
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <select value={lead.status} onChange={e => updateLeadStatus(lead._id, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-xs font-bold border-0 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer transition-all ${statusColors[lead.status]}`}>
                          <option value="contacted">Contacted</option>
                          <option value="interested">Interested</option>
                          <option value="not_interested">Not Interested</option>
                          <option value="listed">Listed</option>
                        </select>
                      </td>
                      <td className={`px-3 sm:px-4 py-3 text-xs whitespace-nowrap ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        {new Date(lead.messageSentAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <button onClick={() => deleteLead(lead._id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto opacity-0 group-hover:opacity-100 transition-all ${isDark ? "text-gray-500 hover:bg-red-500/20 hover:text-red-400" : "text-gray-400 hover:bg-red-50 hover:text-red-500"}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
