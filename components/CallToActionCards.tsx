'use client';

import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';

export default function CallToActionCards() {
  const { language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const content = {
    en: {
      findHome: {
        title: 'Looking For The New Home/PG?',
        description: '2 New Offers Every Day. 35 Offers On Site, Trusted By A Community Of Thousands Of Users.',
        button: 'Learn More',
      },
      rentHome: {
        title: 'Want To Rent Your Home/PG?',
        description: '1 New Offers Every Day. 5 Offers On Site, Trusted By A Community Of Thousands Of Users.',
        button: 'Learn More',
      },
    },
    fr: {
      findHome: {
        title: 'Vous cherchez une nouvelle maison/PG?',
        description: "2 nouvelles offres chaque jour. 35 offres sur le site, approuvées par une communauté de milliers d'utilisateurs.",
        button: 'En savoir plus',
      },
      rentHome: {
        title: 'Vous voulez louer votre maison/PG?',
        description: "1 nouvelle offre chaque jour. 5 offres sur le site, approuvées par une communauté de milliers d'utilisateurs.",
        button: 'En savoir plus',
      },
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  const ArrowIcon = () => (
    <svg className="w-4 h-4 esm:w-5 esm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );

  return (
    <section className="py-10 md:py-8 px-4 sm:px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4 esm:gap-6 lg:gap-8">
          {/* Left card — slides from left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.10)' }}
            className="bg-white rounded-xl shadow-lg p-5 esm:p-6 md:p-10"
          >
            <h3 className="text-xl esm:text-2xl md:text-3xl font-bold text-gray-700 mb-3 md:mb-4">
              {t.findHome.title}
            </h3>
            <p className="text-gray-500 text-sm esm:text-sm md:text-base mb-6 esm:mb-7 md:mb-8 leading-relaxed">
              {t.findHome.description}
            </p>
            <motion.button
              whileHover={{ borderColor: '#2563eb', color: '#2563eb', x: 4 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center justify-center gap-2 px-5 esm:px-6 py-2.5 md:py-3 border-2 border-gray-400 text-gray-600 rounded-lg font-medium w-full esm:w-fit transition-colors duration-200"
            >
              {t.findHome.button}
              <ArrowIcon />
            </motion.button>
          </motion.div>

          {/* Right card — slides from right */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.10)' }}
            className="bg-white rounded-2xl shadow-lg p-5 esm:p-6 md:p-10"
          >
            <h3 className="text-xl esm:text-2xl md:text-3xl font-bold text-gray-700 mb-3 md:mb-4">
              {t.rentHome.title}
            </h3>
            <p className="text-gray-500 text-sm esm:text-sm md:text-base mb-6 esm:mb-7 md:mb-8 leading-relaxed">
              {t.rentHome.description}
            </p>
            <motion.button
              whileHover={{ borderColor: '#2563eb', color: '#2563eb', x: 4 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center justify-center gap-2 px-5 esm:px-6 py-2.5 md:py-3 border-2 border-gray-400 text-gray-600 rounded-lg font-medium w-full esm:w-fit transition-colors duration-200"
            >
              {t.rentHome.button}
              <ArrowIcon />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
