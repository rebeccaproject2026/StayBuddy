"use client";
import { Share2, Phone } from "lucide-react";

interface Props {
  property: any;
  language: string;
  isAuthenticated: boolean;
  t: Record<string, string>;
  onContact: () => void;
  onShare: () => void;
  onLoginRedirect: (reason?: string) => void;
}

export default function MobileActionBar({ property, language, isAuthenticated, t, onContact, onShare, onLoginRedirect }: Props) {
  const handleCall = () => {
    if (!isAuthenticated) { onLoginRedirect("call"); return; }
    const phone = property.ownerPhone || property.landlord?.phone;
    if (phone) window.location.href = `tel:${phone}`;
  };

  const hasPhone = !!(property.ownerPhone || property.landlord?.phone);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl px-4 py-3 flex gap-3">
      <button onClick={onContact}
        className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors">
        {t.contactOwner}
      </button>
      <button onClick={handleCall}
        className={`flex-1 py-3 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${hasPhone ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`}>
        <Phone className="w-4 h-4" />
        {language === "fr" ? "Appeler" : "Call"}
      </button>
      <button onClick={onShare}
        className="w-12 py-3 border-2 border-gray-300 hover:border-primary text-gray-700 rounded-xl transition-colors flex items-center justify-center">
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
}
