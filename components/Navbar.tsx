"use client";

import { useState, useEffect, useRef } from "react";
import Link from "@/components/LocalizedLink";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, LogOut, Settings, LayoutDashboard, ChevronDown, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useSocketContext } from "@/contexts/SocketContext";
import { getToken } from "@/lib/token-storage";

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.15, ease: "easeIn" } },
};

const dropdownItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.05, duration: 0.2, ease: "easeOut" },
  }),
};

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);
  const [navLoading, setNavLoading] = useState(false);
  const [navDest, setNavDest] = useState("");

  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlCountry = params?.country as string;

  const handleListProperty = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    // Already on post-property page — do nothing
    if (pathname?.includes("/post-property")) return;
    setListingLoading(true);
    router.push(`/${urlCountry || 'in'}/post-property`);
  };

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const dest = path.startsWith(`/${urlCountry || 'in'}/`) || path === `/${urlCountry || 'in'}`
      ? path
      : `/${urlCountry || 'in'}${path}`;
    // Skip loading overlay for dashboard routes — they load instantly
    if (!dest.includes('/dashboard')) {
      setNavDest(dest);
      setNavLoading(true);
    }
    router.push(dest);
  };

  const isCountryMatch = !user || !urlCountry || user.role === 'admin' || user.country === urlCountry;
  const effectivelyAuthenticated = isAuthenticated && isCountryMatch;

  // Live unread chat messages via shared SocketContext
  const { totalUnread: unreadMessages } = useSocketContext();

  // Unread inquiry count for landlords — fetched from API, polled every 30s
  const [unreadInquiries, setUnreadInquiries] = useState(0);
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'landlord') {
      setUnreadInquiries(0);
      return;
    }
    const fetchInquiries = async () => {
      try {
        const token = getToken();
        const res = await fetch('/api/contact-requests', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (data.success) {
          // Count requests created in the last 7 days as "new" for the badge
          const seenKey = 'staybuddy_owner_inquiry_seen';
          let seen: Set<string>;
          try { seen = new Set(JSON.parse(localStorage.getItem(seenKey) || '[]')); }
          catch { seen = new Set(); }
          const unseen = (data.requests || []).filter((r: any) => !seen.has(r._id)).length;
          setUnreadInquiries(unseen);
        }
      } catch {}
    };
    fetchInquiries();
    const interval = setInterval(fetchInquiries, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user?.role]);

  // Total badge = unread chats + unread inquiries (for landlords)
  const notifCount = unreadMessages + unreadInquiries;

  const langMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const langMenuButtonRef = useRef<HTMLButtonElement>(null);
  const profileMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Clear overlays when route changes (page has loaded)
  useEffect(() => {
    setListingLoading(false);
    setNavLoading(false);
  }, [pathname]);

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setIsScrolled(window.scrollY > 20);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsMobileMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isLangMenuOpen && langMenuRef.current && !langMenuRef.current.contains(e.target as Node) &&
          langMenuButtonRef.current && !langMenuButtonRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
      // Close profile menu if click is outside both the button and the dropdown
      if (isProfileMenuOpen) {
        const clickedButton = profileMenuButtonRef.current?.contains(e.target as Node);
        const clickedMenu = profileMenuRef.current?.contains(e.target as Node);
        if (!clickedButton && !clickedMenu) {
          setIsProfileMenuOpen(false);
        }
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
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
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

  const ProfileAvatar = ({ size = 8 }: { size?: number }) => {
    const cls = `w-${size} h-${size} rounded-full`;
    if (user?.profileImage) {
      return <img src={user.profileImage} alt={user.fullName} referrerPolicy="no-referrer" className={`${cls} object-cover`} />;
    }
    return (
      <div className={`${cls} bg-primary text-white flex items-center justify-center text-sm font-semibold`}>
        {user?.fullName?.charAt(0).toUpperCase() || "U"}
      </div>
    );
  };

  const roleLabel = user?.role === "renter" ? "Renter"
    : user?.role === "landlord" ? "Landlord"
    : user?.role === "admin" ? "Admin"
    : user?.role || "User";

  const dashboardLabel = user?.role === "admin" ? "Admin Dashboard"
    : user?.role === "landlord" ? "Owner Dashboard"
    : "Tenant Dashboard";

  return (
    <>
      {/* Full-screen loading overlay for List Property */}
      <AnimatePresence>
        {listingLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center gap-5"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center shadow-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">
                  {language === "fr" ? "Préparation du formulaire..." : "Preparing your form..."}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {language === "fr" ? "Veuillez patienter un instant" : "Just a moment"}
                </p>
              </div>
              <div className="flex gap-1.5 mt-2">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-accent"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
        {navLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9999] bg-white/60 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-primary"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-[0_4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md"
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Backdrop to close menus on mobile */}
        {(isMobileMenuOpen || isLangMenuOpen) && (
          <div
            className="fixed inset-0 z-[-1] md:hidden"
            onClick={() => { setIsMobileMenuOpen(false); setIsLangMenuOpen(false); }}
          />
        )}
        {/* Main bar */}
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="StayBuddy Logo" width={140} height={140} priority className="w-32 sm:w-36 md:w-44 h-auto" />
            </Link>
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-2">

            {/* List Property — landlord only */}
            {effectivelyAuthenticated && user?.role === "landlord" && (
              <motion.button
                onClick={handleListProperty}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="px-4 py-2 bg-accent text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-accent-hover transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                {t("nav.listProperty")}
              </motion.button>
            )}

            {/* Language selector — only for /fr */}
            {urlCountry === "fr" && (
            <div className="relative">
              <motion.button
                ref={langMenuButtonRef}
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:text-primary rounded-lg hover:bg-primary-light transition-colors duration-200"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium text-base">{language.toUpperCase()}</span>
                <motion.span animate={{ rotate: isLangMenuOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown className="w-4 h-4" />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    ref={langMenuRef}
                    variants={dropdownVariants}
                    initial="hidden" animate="visible" exit="exit"
                    className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                  >
                    {languages.map((lang, i) => (
                      <motion.button
                        key={lang.code}
                        custom={i}
                        variants={dropdownItemVariants}
                        initial="hidden" animate="visible"
                        onClick={() => handleLanguageChange(lang.code as "en" | "fr")}
                        whileHover={{ x: 4 }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 ${language === lang.code ? "bg-primary-light text-primary" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="font-medium text-sm">{lang.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            )}

            {/* Auth */}
            {!mounted ? (
              <div className="flex items-center gap-2">
                <div className="w-14 h-8 rounded-lg bg-gray-100 animate-pulse" />
                <div className="w-18 h-8 rounded-lg bg-gray-100 animate-pulse" />
              </div>
            ) : (
              <>
                {effectivelyAuthenticated && user ? (
                  <div className="relative" ref={profileMenuRef}>
                    <motion.button
                      ref={profileMenuButtonRef}
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-primary rounded-lg hover:bg-primary-light transition-colors duration-200"
                    >
                      <div className="relative">
                        <ProfileAvatar />
                        <AnimatePresence>
                          {notifCount > 0 && (
                            <motion.span
                              key="badge"
                              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 25 }}
                              className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none"
                            >
                              {notifCount > 99 ? "99+" : notifCount}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      <span className="font-medium text-sm hidden lg:block">{user.fullName.split(" ")[0]}</span>
                      <motion.span animate={{ rotate: isProfileMenuOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </motion.span>
                    </motion.button>

                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden" animate="visible" exit="exit"
                          className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              <ProfileAvatar />
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">{user.fullName}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                <p className="text-xs text-primary capitalize">{roleLabel}</p>
                              </div>
                            </div>
                          </div>
                          <div className="py-1">
                            {[
                              { href: getDashboardLink(), icon: <LayoutDashboard className="w-4 h-4" />, label: dashboardLabel, badge: notifCount },
                              { href: getProfileLink(), icon: <Settings className="w-4 h-4" />, label: "Profile Settings", badge: 0 },
                            ].map((item, i) => (
                              <motion.div key={item.href} custom={i} variants={dropdownItemVariants} initial="hidden" animate="visible">
                                <motion.button
                                  onClick={(e) => {
                                    setIsProfileMenuOpen(false);
                                    handleNavClick(e, item.href);
                                  }}
                                  whileHover={{ x: 3 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-primary-light hover:text-primary transition-colors duration-200"
                                >
                                  {item.icon}
                                  <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                                  {item.badge > 0 && (
                                    <motion.span
                                      key={item.badge}
                                      initial={{ scale: 0.6, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                      className="min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                                    >
                                      {item.badge > 99 ? "99+" : item.badge}
                                    </motion.span>
                                  )}
                                </motion.button>
                              </motion.div>
                            ))}
                            <motion.div custom={2} variants={dropdownItemVariants} initial="hidden" animate="visible">
                              <motion.button
                                onClick={handleLogout}
                                whileHover={{ x: 3 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors duration-200"
                              >
                                <LogOut className="w-4 h-4" />
                                <span className="font-medium text-sm">Logout</span>
                              </motion.button>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href={`/login`}>
                      <motion.span
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="inline-block px-3 py-2 text-gray-700 hover:text-primary rounded-lg hover:bg-primary-light font-semibold text-base transition-colors duration-200"
                      >
                        {t("nav.login")}
                      </motion.span>
                    </Link>
                    <Link href={`/signup`}>
                      <motion.span
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="inline-block px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium text-base shadow-md hover:shadow-lg transition-colors duration-200"
                      >
                        {t("nav.signup")}
                      </motion.span>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile right — lang + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile lang toggle (icon only) — only for /fr */}
            {urlCountry === "fr" && (
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="p-2 text-gray-600 hover:text-primary rounded-lg hover:bg-primary-light transition-colors"
              aria-label="Language"
            >
              <Globe className="w-5 h-5" />
            </button>
            )}

            {/* Notification badge on mobile for authenticated users */}
            {mounted && effectivelyAuthenticated && user && notifCount > 0 && (
              <Link href={getDashboardLink()}>
                <div className="relative p-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                    {user.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none">
                    {notifCount > 9 ? "9+" : notifCount}
                  </span>
                </div>
              </Link>
            )}

            {/* Hamburger */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.92 }}
              className="p-2 text-gray-700 hover:text-primary rounded-lg hover:bg-primary-light transition-colors"
              aria-label="Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-6 h-6" />
                  </motion.span>
                ) : (
                  <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-6 h-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden" animate="visible" exit="exit"
              className="md:hidden overflow-hidden border-t border-gray-100 bg-white shadow-lg"
            >
              <div className="py-3 space-y-1">

                {/* Auth section */}
                {!mounted ? null : effectivelyAuthenticated && user ? (
                  <div className="px-3 space-y-1">
                    {/* User info */}
                    <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-xl">
                      <div className="relative flex-shrink-0">
                        <ProfileAvatar size={10} />
                        {notifCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {notifCount > 9 ? "9+" : notifCount}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{user.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <p className="text-xs text-primary">{roleLabel}</p>
                      </div>
                    </div>

                    {/* List property */}
                    {user.role === "landlord" && (
                      <button onClick={handleListProperty} className="w-full text-left">
                        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-accent text-white font-semibold text-sm mt-1">
                          {t("nav.listProperty")}
                        </div>
                      </button>
                    )}

                    {/* Dashboard */}
                    <button onClick={(e) => { setIsMobileMenuOpen(false); handleNavClick(e, getDashboardLink()); }} className="w-full text-left">
                      <div className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-primary-light hover:text-primary transition-colors">
                        <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium text-sm flex-1">{dashboardLabel}</span>
                        {notifCount > 0 && (
                          <span className="min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {notifCount > 99 ? "99+" : notifCount}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Profile */}
                    <button onClick={(e) => { setIsMobileMenuOpen(false); handleNavClick(e, getProfileLink()); }} className="w-full text-left">
                      <div className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-primary-light hover:text-primary transition-colors">
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium text-sm">Profile Settings</span>
                      </div>
                    </button>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium text-sm">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-3 pt-1 pb-2">
                    <Link href={`/login`} onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <div className="w-full text-center px-4 py-3 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary-light transition-colors">
                        {t("nav.login")}
                      </div>
                    </Link>
                    <Link href={`/signup`} onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <div className="w-full text-center px-4 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors shadow-md">
                        {t("nav.signup")}
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile language dropdown (separate from drawer) — only for /fr */}
        <AnimatePresence>
          {isLangMenuOpen && urlCountry === "fr" && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden" animate="visible" exit="exit"
              className="md:hidden absolute right-4 sm:right-6 top-[60px] sm:top-[76px] w-44 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-[60]"
            >
              {languages.map((lang, i) => (
                <motion.button
                  key={lang.code}
                  custom={i}
                  variants={dropdownItemVariants}
                  initial="hidden" animate="visible"
                  onClick={() => handleLanguageChange(lang.code as "en" | "fr")}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${language === lang.code ? "bg-primary-light text-primary" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium text-sm">{lang.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
    </>
  );
}
