'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from "@/components/LocalizedLink";
import Image from 'next/image';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const staggerList = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.07 } },
  viewport: { once: true, margin: "-60px" },
};

const listItem = {
  initial: { opacity: 0, x: -10 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.35, ease: "easeOut" },
};

export default function Footer() {
  const { language } = useLanguage();

  const content = {
    en: {
      about: 'Find your perfect home with StayBuddy. We connect tenants with quality properties and help landlords find reliable renters. Your trusted partner in the rental journey.',
      discover: {
        title: 'Discover',
        links: ['PG For Girls', 'PG For Boys', 'PG For Student', 'Flat For Rent', 'Villa For Rent']
      },
      quickLinks: {
        title: 'Quick Links',
        links: ["About Us", "Contact Us", "FAQ's", "Blog"]
      },
      contact: {
        title: 'Contact Us',
        email: 'support@staybuddy.com',
        phone: '+91 99999 99999',
        address: '213 Sanidhya Arcade, Vastral, Ahmedabad, Gujarat 382418'
      },
      social: 'Follow Us',
      copyright: '© 2026 StayBuddy. All rights reserved.',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy'
    },
    fr: {
      about: 'Trouvez votre maison parfaite avec StayBuddy. Nous connectons les locataires avec des propriétés de qualité et aidons les propriétaires à trouver des locataires fiables. Votre partenaire de confiance dans le parcours locatif.',
      discover: {
        title: 'Découvrir',
        links: ['PG pour filles', 'PG pour garçons', 'PG pour étudiants', 'Appartement à louer', 'Villa à louer']
      },
      quickLinks: {
        title: 'Liens rapides',
        links: ["À propos", "Contactez-nous", "FAQ", "Blog"]
      },
      contact: {
        title: 'Contactez-nous',
        email: 'support@staybuddy.com',
        phone: '+91 99999 99999',
        address: '213 Sanidhya Arcade, Vastral, Ahmedabad, Gujarat 382418'
      },
      social: 'Suivez-nous',
      copyright: '© 2026 StayBuddy. Tous droits réservés.',
      terms: "Conditions d'utilisation",
      privacy: 'Politique de confidentialité'
    }
  };

  const t = content[language];

  const socialLinks = [
    {
      label: 'Facebook',
      hover: 'hover:text-blue-600',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: 'Instagram',
      hover: 'hover:text-pink-600',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      hover: 'hover:text-blue-700',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 px-4 sm:px-6 md:px-4">
      <div className="max-w-7xl mx-auto py-10 sm:py-12 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 esm:gap-8 lg:gap-12 mb-8">

          {/* Logo & About */}
          <motion.div className="lg:col-span-1" {...fadeUp(0)}>
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image src="/logo.png" alt="StayBuddy Logo" width={160} height={160} />
              </motion.div>
            </div>

            <p className="text-gray-600 text-sm text-justify leading-relaxed mb-3 max-w-prose mx-auto md:mx-0">
              {t.about}
            </p>

            <div className="text-center md:text-left">
              <p className="text-gray-700 font-semibold text-sm mb-2">{t.social}</p>
              <div className="flex gap-4 justify-center md:justify-start">
                {socialLinks.map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="relative group"
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.15 + i * 0.08, ease: "easeOut" }}
                  >
                    <motion.div whileHover={{ y: -3, scale: 1.15 }} transition={{ type: "spring", stiffness: 400, damping: 18 }}>
                      <Link href={s.href} className={`flex items-center justify-center text-gray-600 ${s.hover} transition-colors duration-200`}>
                        {s.icon}
                      </Link>
                    </motion.div>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {s.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Discover */}
          <motion.div {...fadeUp(0.1)}>
            <h4 className="font-bold text-gray-800 mb-4 esm:mb-6 text-lg esm:text-xl md:text-xl">
              {t.discover.title}
            </h4>
            <motion.ul key={`discover-${language}`} className="space-y-2" variants={staggerList} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-60px" }}>
              {[
                { href: "/properties?tab=pg&pgFor=Female", label: t.discover.links[0] },
                { href: "/properties?tab=pg&pgFor=Male", label: t.discover.links[1] },
                { href: "/properties?tab=pg&tenant=Students", label: t.discover.links[2] },
                { href: "/properties?tab=tenant", label: t.discover.links[3] },
                { href: "/properties?tab=tenant", label: t.discover.links[4] },
              ].map((item) => (
                <motion.li key={item.label} variants={listItem}>
                  <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                    <Link href={item.href} className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                      {item.label}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div {...fadeUp(0.18)}>
            <h4 className="font-bold text-gray-800 mb-4 esm:mb-6 text-lg esm:text-xl md:text-xl">
              {t.quickLinks.title}
            </h4>
            <motion.ul key={`quicklinks-${language}`} className="space-y-2" variants={staggerList} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-60px" }}>
              {[
                { href: "/about", label: t.quickLinks.links[0] },
                { href: "/contact", label: t.quickLinks.links[1] },
                { href: "#", label: t.quickLinks.links[2] },
                { href: "#", label: t.quickLinks.links[3] },
              ].map((item) => (
                <motion.li key={item.label} variants={listItem}>
                  <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                    <Link href={item.href} className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                      {item.label}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Contact */}
          <motion.div {...fadeUp(0.26)}>
            <h4 className="font-bold text-gray-800 mb-4 esm:mb-6 text-lg esm:text-xl md:text-xl">
              {t.contact.title}
            </h4>
            <div className="space-y-2">
              {[
                {
                  href: `mailto:${t.contact.email}`,
                  text: t.contact.email,
                  icon: (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                },
                {
                  href: `tel:${t.contact.phone}`,
                  text: t.contact.phone,
                  icon: (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.28 + i * 0.08, ease: "easeOut" }}
                >
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">{item.icon}</div>
                  <Link href={item.href} className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm">
                    {item.text}
                  </Link>
                </motion.div>
              ))}

              {/* Address */}
              <motion.div
                className="flex items-start gap-1.5"
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.44, ease: "easeOut" }}
              >
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm flex-1">{t.contact.address}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-gray-300 pt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 esm:gap-4 text-xs esm:text-sm md:text-sm text-gray-600 text-center md:text-left">
            <p>{t.copyright}</p>
            <div className="flex flex-col esm:flex-row gap-2 esm:gap-6">
              {[
                { href: "/terms", label: t.terms },
                { href: "/privacy", label: t.privacy },
              ].map((item) => (
                <motion.div key={item.href} whileHover={{ y: -1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                  <Link href={item.href} className="hover:text-blue-600 transition-colors duration-200">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
