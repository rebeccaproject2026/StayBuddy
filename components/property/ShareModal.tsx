"use client";
import { Share2, Mail, MessageCircle, CheckCircle, X } from "lucide-react";

interface Props {
  property: any;
  t: Record<string, string>;
  copySuccess: boolean;
  onClose: () => void;
  onCopy: () => void;
  onWhatsApp: () => void;
  onFacebook: () => void;
  onTwitter: () => void;
  onEmail: () => void;
}

export default function ShareModal({ t, copySuccess, onClose, onCopy, onWhatsApp, onFacebook, onTwitter, onEmail }: Props) {
  return (
    <div
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
      onClick={onClose}
    >
      <div style={{ backgroundColor: "white", borderRadius: "16px", maxWidth: "450px", width: "100%", position: "relative" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-primary" />{t.shareProperty}
          </h2>
          <button onClick={onClose} aria-label="Close share modal" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <button onClick={onCopy} className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
            {copySuccess ? <><CheckCircle className="w-5 h-5 text-green-600" />{t.linkCopied}</> : <><Mail className="w-5 h-5" />{t.copyLink}</>}
          </button>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">{t.shareVia}</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onWhatsApp} className="py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"><MessageCircle className="w-5 h-5" />WhatsApp</button>
              <button onClick={onFacebook} className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"><Share2 className="w-5 h-5" />Facebook</button>
              <button onClick={onTwitter} className="py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"><Share2 className="w-5 h-5" />Twitter</button>
              <button onClick={onEmail} className="py-3 px-4 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"><Mail className="w-5 h-5" />Email</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
