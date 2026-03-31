'use client';

import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

export default function OwnerSection() {
  const { language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const content = {
    en: {
      title: 'Are You An Owner?',
      description: 'Enjoy a personalized experience through our secure platform. Rely on our dedicated team of experts to enhance your rental journey positively. Owners, achieve peace of mind with our management: zero rental vacancy guaranteed for optimal profitability!',
      features: ['We Have The Perfect Renter', 'Assurances provided'],
      button: 'Learn More',
    },
    fr: {
      title: 'Êtes-vous propriétaire?',
      description: "Profitez d'une expérience personnalisée grâce à notre plateforme sécurisée. Comptez sur notre équipe d'experts dédiés pour améliorer positivement votre parcours locatif. Propriétaires, obtenez la tranquillité d'esprit avec notre gestion : zéro vacance locative garantie pour une rentabilité optimale!",
      features: ['Nous avons le locataire parfait', 'Assurances fournies'],
      button: 'En savoir plus',
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <section className="py-10 md:py-8 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="grid md:grid-cols-[35%_65%] gap-0 items-center p-3 sm:p-4 md:p-4">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="relative h-[220px] esm:h-[280px] sm:h-[340px] md:h-[480px]"
            >
              <Image src="/owner.png" alt="Property Owner" fill className="object-cover rounded-xl" priority />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
              className="p-4 esm:p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center"
            >
              <h2 className="text-2xl esm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 esm:mb-5 md:mb-6 leading-tight">
                {t.title}
              </h2>
              <p className="text-gray-600 text-sm esm:text-base md:text-lg mb-6 esm:mb-7 md:mb-8 leading-relaxed text-justify">
                {t.description}
              </p>

              <ul className="space-y-3 esm:space-y-4 mb-7 esm:mb-8 md:mb-10">
                {t.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
                    className="flex items-start esm:items-center text-gray-800 font-medium"
                  >
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-4 flex-shrink-0" />
                    <span className="text-sm esm:text-base md:text-base leading-snug">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: '#2563eb', color: '#fff' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center justify-center gap-3 esm:gap-4 px-6 esm:px-8 md:px-10 py-2.5 border-2 border-blue-600 text-blue-600 rounded-xl w-full esm:w-fit font-semibold text-base esm:text-lg md:text-lg shadow-sm hover:shadow-md transition-colors duration-300"
              >
                {t.button}
                <svg className="w-4 h-4 esm:w-5 esm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
