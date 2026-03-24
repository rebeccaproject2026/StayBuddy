"use client";

import { useState, useEffect, useRef } from "react";
import Link from "@/components/LocalizedLink";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, User, UserPlus, LogOut, Settings, LayoutDashboard, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  
  // Debug authentication state
  useEffect(() => {
    console.log('Navbar - Auth state changed:');
    console.log('  - isLoading:', isLoading);
    console.log('  - isAuthenticated:', isAuthenticated);
    console.log('  - user:', user);
  }, [isLoading, isAuthenticated, user]);
  
  const langMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const langMenuButtonRef = useRef<HTMLButtonElement>(null);
  const profileMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

      // Close profile menu if clicked outside
      if (
        isProfileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        profileMenuButtonRef.current &&
        !profileMenuButtonRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLangMenuOpen, isProfileMenuOpen]);

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
  ];

  const handleLanguageChange = (lang: "en" | "fr") => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    
    switch (user.role) {
      case 'admin':
        return '/dashboard/admin';
      case 'landlord':
        return '/dashboard/owner';
      case 'renter':
        return '/dashboard/tenant';
      default:
        return '/dashboard';
    }
  };

  const getProfileLink = () => {
    if (!user) return '/dashboard';
    switch (user.role) {
      case 'landlord': return '/dashboard/owner?tab=profile';
      case 'renter':   return '/dashboard/tenant?tab=profile';
      case 'admin':    return '/dashboard/admin?tab=profile';
      default:         return '/dashboard';
    }
  };

  const ProfileAvatar = () => {
    if (user?.profileImage) {
      return (
        <img
          src={user.profileImage}
          alt={user.fullName}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
        {user?.fullName?.charAt(0).toUpperCase() || 'U'}
      </div>
    );
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
              {/* List Property Button - Only show for landlords */}
              {isAuthenticated && user?.role === 'landlord' && (
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
              )}

              {/* Language Selector */}
              <div className="relative">
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

              {/* Authentication Section */}
              {!isLoading && (
                <>
                  {isAuthenticated && user ? (
                    // Profile Dropdown for Authenticated Users
                    <div className="relative">
                      <button
                        ref={profileMenuButtonRef}
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary transition-colors duration-300 rounded-lg hover:bg-primary-light"
                      >
                        <ProfileAvatar />
                        <span className="font-medium">{user.fullName.split(' ')[0]}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      <AnimatePresence>
                        {isProfileMenuOpen && (
                          <motion.div
                            ref={profileMenuRef}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                          >
                            {/* User Info */}
                            <div className="px-4 py-3 border-b border-gray-100">
                              <div className="flex items-center space-x-3">
                                <ProfileAvatar />
                                <div>
                                  <p className="font-semibold text-gray-900">{user.fullName}</p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                  <p className="text-xs text-primary capitalize">
                                    {user.role === 'renter' ? 'Renter' : 
                                     user.role === 'landlord' ? 'Landlord' : 
                                     user.role === 'admin' ? 'Admin' : 
                                     user.role || 'User'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                              <Link href={getDashboardLink()}>
                                <button
                                  onClick={() => setIsProfileMenuOpen(false)}
                                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-light hover:text-primary transition-all duration-300"
                                >
                                  <LayoutDashboard className="w-5 h-5" />
                                  <span className="font-medium">
                                    {user.role === 'admin' ? 'Admin Dashboard' : 
                                     user.role === 'landlord' ? 'Owner Dashboard' : 
                                     'Tenant Dashboard'}
                                  </span>
                                </button>
                              </Link>

                              <Link href={getProfileLink()}>
                                <button
                                  onClick={() => setIsProfileMenuOpen(false)}
                                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-light hover:text-primary transition-all duration-300"
                                >
                                  <Settings className="w-5 h-5" />
                                  <span className="font-medium">Profile Settings</span>
                                </button>
                              </Link>

                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-300"
                              >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    // Login and Signup buttons for non-authenticated users
                    <div className="flex items-center space-x-3">
                      <Link href="/login">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="px-4 py-2 text-gray-700 hover:text-primary transition-colors duration-300 rounded-lg hover:bg-primary-light font-medium"
                        >
                          {t("nav.login")}
                        </motion.button>
                      </Link>
                      <Link href="/signup">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                        >
                          {t("nav.signup")}
                        </motion.button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}
