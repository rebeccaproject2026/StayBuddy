"use client";

import { Sun, Moon, Home } from "lucide-react";
import Link from "@/components/LocalizedLink";

interface AdminHeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  currentCountry: string;
  language: string;
  title: string;
}

export default function AdminHeader({ isDark, toggleTheme, currentCountry, language, title }: AdminHeaderProps) {
  return (
    <div className={`flex-shrink-0 sticky top-0 z-50 shadow-lg border-b ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
      <div className="max-w-[1500px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2">
            <h1 className={`text-base sm:text-xl font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{title}</h1>
            <div className={`hidden sm:block px-2.5 py-1 rounded-lg border text-xs font-semibold ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-gray-100 border-gray-300 text-gray-700"}`}>
              {currentCountry === "in" ? "🇮🇳 India" : currentCountry === "fr" ? "🇫🇷 France" : currentCountry.toUpperCase()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${isDark ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              href="/"
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors font-medium text-xs sm:text-sm"
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{language === "fr" ? "Accueil" : "Back to Home"}</span>
              <span className="sm:hidden">{language === "fr" ? "Accueil" : "Home"}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
