"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useParams } from "next/navigation";

type Language = "en" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Import translations
const translations = {
  en: require("@/messages/en.json"),
  fr: require("@/messages/fr.json")
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const country = params?.country as string;

  // Initialize with the language based on country routing
  const [language, setLanguageState] = useState<Language>(country === "fr" ? "fr" : "en");

  useEffect(() => {
    // Automatically switch language when navigating between country routes
    if (country) {
      setLanguageState(country === "fr" ? "fr" : "en");
    }
  }, [country]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
