"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "@/lib/token-storage";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import type { ProfileSectionProps } from "./types";

export default function ProfileSection({ user, tc, language, isDark = false }: ProfileSectionProps) {
  const { token, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savedName, setSavedName] = useState(user?.fullName || "");

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSaveProfile = async () => {
    if (!form.fullName.trim()) {
      setSaveMsg({ type: "error", text: language === "fr" ? "Le nom est requis." : "Full name is required." });
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      const isNextAuth = token === "nextauth";
      const authToken = isNextAuth ? null : (token || getToken());
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ fullName: form.fullName.trim(), phoneNumber: form.phoneNumber.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        updateUser({ fullName: data.user.fullName, phoneNumber: data.user.phoneNumber });
        setSavedName(data.user.fullName);
        setSaveMsg({ type: "success", text: language === "fr" ? "Profil mis à jour." : "Profile updated successfully." });
        setTimeout(() => setSaveMsg(null), 3000);
      } else {
        setSaveMsg({ type: "error", text: data.message || "Failed to update." });
      }
    } catch {
      setSaveMsg({ type: "error", text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.current) {
      setPwMsg({ type: "error", text: language === "fr" ? "Mot de passe actuel requis." : "Current password is required." });
      return;
    }
    if (pwForm.next.length < 6) {
      setPwMsg({ type: "error", text: language === "fr" ? "Min. 6 caractères." : "Password must be at least 6 characters." });
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: "error", text: language === "fr" ? "Les mots de passe ne correspondent pas." : "Passwords do not match." });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    try {
      const isNextAuth = token === "nextauth";
      const authToken = isNextAuth ? null : (token || getToken());
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      const data = await res.json();
      if (data.success) {
        setPwMsg({ type: "success", text: language === "fr" ? "Mot de passe mis à jour." : "Password updated successfully." });
        setPwForm({ current: "", next: "", confirm: "" });
        setTimeout(() => setPwMsg(null), 3000);
      } else {
        setPwMsg({ type: "error", text: data.message || "Failed to update password." });
      }
    } catch {
      setPwMsg({ type: "error", text: "Something went wrong." });
    } finally {
      setPwSaving(false);
    }
  };

  const countryLabel = user?.country === "fr" ? "France" : user?.country === "in" ? "India" : user?.country || "—";
  const roleLabel = user?.role === "landlord" ? (language === "fr" ? "Propriétaire" : "Owner") : user?.role || "—";
  const initials = savedName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="space-y-5 max-w-2xl">
      <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.profileSettings}</h2>

      {/* Avatar + summary card */}
      <div className={`rounded-xl p-5 flex items-center gap-4 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>
        <div className="w-14 h-14 rounded-full flex-shrink-0 shadow-md overflow-hidden">
          {user?.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.profileImage} alt={savedName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="text-white font-bold text-xl">{initials}</span>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className={`text-base font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{savedName || "—"}</p>
          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">{roleLabel}</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{countryLabel}</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${user?.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {user?.isVerified ? (language === "fr" ? "✓ Vérifié" : "✓ Verified") : (language === "fr" ? "Non vérifié" : "Unverified")}
            </span>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className={`rounded-xl p-5 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>
        <h3 className={`text-base font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          {language === "fr" ? "Informations personnelles" : "Personal Information"}
        </h3>
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {tc.fullName} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200 focus:border-primary"
                }`}
                placeholder={language === "fr" ? "Votre nom complet" : "Your full name"}
              />
            </div>
          </div>

          {/* Email — read only */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.email}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className={`w-full pl-10 pr-4 py-3 border rounded-xl cursor-not-allowed ${
                  isDark ? "bg-gray-800/50 border-gray-700 text-gray-500" : "border-gray-200 bg-gray-50 text-gray-400"
                }`}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{language === "fr" ? "L'email ne peut pas être modifié." : "Email cannot be changed."}</p>
          </div>

          {/* Phone */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tc.phone}</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200 focus:border-primary"
                }`}
                placeholder={language === "fr" ? "Numéro de téléphone" : "+91 99999 99999"}
              />
            </div>
          </div>

          {saveMsg && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
              saveMsg.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {saveMsg.type === "success" ? "✓" : "✕"} {saveMsg.text}
            </div>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {language === "fr" ? "Enregistrement..." : "Saving..."}</>
            ) : tc.saveChanges}
          </button>
        </div>
      </div>

      {/* Change password — only for credentials users */}
      {user?.provider === "credentials" && (
        <div className={`rounded-xl p-5 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>
          <h3 className={`text-base font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            {language === "fr" ? "Changer le mot de passe" : "Change Password"}
          </h3>
          <div className="space-y-4">
            {[
              { key: "current", label: language === "fr" ? "Mot de passe actuel" : "Current Password", show: showCurrent, toggle: () => setShowCurrent(p => !p) },
              { key: "next",    label: language === "fr" ? "Nouveau mot de passe" : "New Password",     show: showNext,    toggle: () => setShowNext(p => !p) },
              { key: "confirm", label: language === "fr" ? "Confirmer" : "Confirm New Password",        show: showConfirm, toggle: () => setShowConfirm(p => !p) },
            ].map(({ key, label, show, toggle }) => (
              <div key={key}>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{label}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={show ? "text" : "password"}
                    value={pwForm[key as keyof typeof pwForm]}
                    onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                    className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                      isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200 focus:border-primary"
                    }`}
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}

            {pwMsg && (
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
                pwMsg.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {pwMsg.type === "success" ? "✓" : "✕"} {pwMsg.text}
              </div>
            )}

            <button
              onClick={handleChangePassword}
              disabled={pwSaving}
              className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {pwSaving ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {language === "fr" ? "Mise à jour..." : "Updating..."}</>
              ) : (language === "fr" ? "Mettre à jour le mot de passe" : "Update Password")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
