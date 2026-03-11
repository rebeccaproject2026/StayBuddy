"use client";

import { useState, useEffect, useRef } from "react";
import Link from "@/components/LocalizedLink";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, User, UserPlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const langMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close mobile menu if clicked outside
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }

      // Close language menu if clicked outside
      if (
        isLangMenuOpen &&
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node) &&
        langMenuButtonRef.current &&
        !langMenuButtonRef.current.contains(event.target as Node)
      ) {
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, isLangMenuOpen]);

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
  ];

  const handleLanguageChange = (lang: "en" | "fr") => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 px-4 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center justify-between h-20">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Link href="/" className="flex items-center group">
              <motion.span
                className="text-2xl font-bold text-primary"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image src="/logo.png" alt="StayBuddy Logo" width={200} height={200} className="mr-2" />
              </motion.span>
            </Link>
          </motion.div>

          <motion.div 
            className="flex items-center gap-2"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
          <div className="hidden md:flex items-center space-x-4">
            <div>
              <Link href="/post-property">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="px-5 py-2.5 bg-accent text-white rounded-xl font-semibold hover:bg-accent-hover transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {t("nav.listProperty")}
                </motion.button>
              </Link>
            </div>

            <div
              className="relative"
            >
              <button
                ref={langMenuButtonRef}
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary transition-colors duration-300 rounded-lg hover:bg-primary-light"
              >
                <Globe className="w-5 h-5" />
                <span className="font-medium">{language.toUpperCase()}</span>
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    ref={langMenuRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code as "en" | "fr")}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-primary-light transition-colors duration-200 ${
                          language === lang.code ? "bg-primary-light text-primary" : "text-gray-700"
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-medium">{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            ref={mobileMenuButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-primary transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </motion.div>

        <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full right-6 mt-2 w-[200px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
          >
            <div className="py-2">
              <Link href="/login">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-light hover:text-primary transition-all duration-300"
                >
                  <User className="w-5 h-5" />
                  <span className="text-base font-medium">{t("nav.login")}</span>
                </button>
              </Link>

              <Link href="/signup">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-light hover:text-primary transition-all duration-300"
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="text-base font-medium">{t("nav.signup")}</span>
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      </div>
    </nav>
  );
}
