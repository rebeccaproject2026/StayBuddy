"use client";

import { useState, useEffect, useRef } from "react";
import Link from "@/components/LocalizedLink";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Globe, LogOut, Settings, LayoutDashboard, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

const navItemVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08 + 0.3, duration: 0.4, ease: "easeOut" },
  }),
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const dropdownItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.2, ease: "easeOut" },
  }),
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const langMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const langMenuButtonRef = useRef<HTMLButtonElement>(null);
  const profileMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isLangMenuOpen &&
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node) &&
        langMenuButtonRef.current &&
        !langMenuButtonRef.current.contains(event.target as Node)
      ) {
        setIsLangMenuOpen(false);
      }
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    if (!user) return "/dashboard";
    switch (user.role) {
      case "admin": return "/dashboard/admin";
      case "landlord": return "/dashboard/owner";
      case "renter": return "/dashboard/tenant";
      default: return "/dashboard";
    }
  };

  const getProfileLink = () => {
    if (!user) return "/dashboard";
    switch (user.role) {
      case "landlord": return "/dashboard/owner?tab=profile";
      case "renter": return "/dashboard/tenant?tab=profile";
      case "admin": return "/dashboard/admin?tab=profile";
      default: return "/dashboard";
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
        {user?.fullName?.charAt(0).toUpperCase() || "U"}
      </div>
    );
  };

  const menuItems = [
    isAuthenticated && user?.role === "landlord" ? "list" : null,
    "lang",
    "auth",
  ].filter(Boolean);

  return (
    <motion.nav
      initial={false}
      animate={{
        backgroundColor: isScrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,1)",
        boxShadow: isScrolled
          ? "0 4px 24px rgba(0,0,0,0.08)"
          : "0 0px 0px rgba(0,0,0,0)",
        backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
      }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4"
    >
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link href="/" className="flex items-center group">
              <motion.span
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src="/logo.png"
                  alt="StayBuddy Logo"
                  width={200}
                  height={200}
                  className="mr-2"
                />
              </motion.span>
            </Link>
          </motion.div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* List Property */}
            {isAuthenticated && user?.role === "landlord" && (
              <motion.div
                custom={0}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link href="/post-property">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="px-5 py-2.5 bg-accent text-white rounded-xl font-semibold hover:bg-accent-hover transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    {t("nav.listProperty")}
                  </motion.button>
                </Link>
              </motion.div>
            )}

            {/* Language Selector */}
            <motion.div
              custom={1}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <motion.button
                ref={langMenuButtonRef}
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary transition-colors duration-300 rounded-lg hover:bg-primary-light"
              >
                <Globe className="w-5 h-5" />
                <span className="font-medium">{language.toUpperCase()}</span>
                <motion.span
                  animate={{ rotate: isLangMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    ref={langMenuRef}
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                  >
                    {languages.map((lang, i) => (
                      <motion.button
                        key={lang.code}
                        custom={i}
                        variants={dropdownItemVariants}
                        initial="hidden"
                        animate="visible"
                        onClick={() => handleLanguageChange(lang.code as "en" | "fr")}
                        whileHover={{ x: 4, backgroundColor: "var(--color-primary-light, #f0f7ff)" }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200 ${
                          language === lang.code
                            ? "bg-primary-light text-primary"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-medium">{lang.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Auth Section */}
            {!isLoading && (
              <motion.div
                custom={2}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                {isAuthenticated && user ? (
                  <div className="relative">
                    <motion.button
                      ref={profileMenuButtonRef}
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary transition-colors duration-300 rounded-lg hover:bg-primary-light"
                    >
                      <ProfileAvatar />
                      <span className="font-medium">{user.fullName.split(" ")[0]}</span>
                      <motion.span
                        animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.span>
                    </motion.button>

                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <motion.div
                          ref={profileMenuRef}
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                        >
                          {/* User Info */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="px-4 py-3 border-b border-gray-100"
                          >
                            <div className="flex items-center space-x-3">
                              <ProfileAvatar />
                              <div>
                                <p className="font-semibold text-gray-900">{user.fullName}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <p className="text-xs text-primary capitalize">
                                  {user.role === "renter"
                                    ? "Renter"
                                    : user.role === "landlord"
                                    ? "Landlord"
                                    : user.role === "admin"
                                    ? "Admin"
                                    : user.role || "User"}
                                </p>
                              </div>
                            </div>
                          </motion.div>

                          {/* Menu Items */}
                          <div className="py-2">
                            {[
                              {
                                href: getDashboardLink(),
                                icon: <LayoutDashboard className="w-5 h-5" />,
                                label:
                                  user.role === "admin"
                                    ? "Admin Dashboard"
                                    : user.role === "landlord"
                                    ? "Owner Dashboard"
                                    : "Tenant Dashboard",
                                className:
                                  "text-gray-700 hover:bg-primary-light hover:text-primary",
                              },
                              {
                                href: getProfileLink(),
                                icon: <Settings className="w-5 h-5" />,
                                label: "Profile Settings",
                                className:
                                  "text-gray-700 hover:bg-primary-light hover:text-primary",
                              },
                            ].map((item, i) => (
                              <motion.div
                                key={item.href}
                                custom={i}
                                variants={dropdownItemVariants}
                                initial="hidden"
                                animate="visible"
                              >
                                <Link href={item.href}>
                                  <motion.button
                                    onClick={() => setIsProfileMenuOpen(false)}
                                    whileHover={{ x: 4 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 transition-all duration-200 ${item.className}`}
                                  >
                                    {item.icon}
                                    <span className="font-medium">{item.label}</span>
                                  </motion.button>
                                </Link>
                              </motion.div>
                            ))}

                            <motion.div
                              custom={2}
                              variants={dropdownItemVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <motion.button
                                onClick={handleLogout}
                                whileHover={{ x: 4 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200"
                              >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                              </motion.button>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link href="/login">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="px-4 py-2 text-gray-700 hover:text-primary transition-colors duration-300 rounded-lg hover:bg-primary-light font-medium"
                      >
                        {t("nav.login")}
                      </motion.button>
                    </Link>
                    <Link href="/signup">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300 font-medium shadow-md hover:shadow-lg"
                      >
                        {t("nav.signup")}
                      </motion.button>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
