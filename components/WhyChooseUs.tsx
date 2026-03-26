'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, DollarSign, Home, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const WhyChooseUs = () => {
  const { language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const features = {
    en: [
      { icon: CheckCircle, title: 'Verified Listings', description: 'All property listings are thoroughly vetted and verified to ensure accuracy and reliability', color: 'bg-emerald-100 text-emerald-600' },
      { icon: Home, title: 'Flexible Options', description: 'Wide range of property types, from budget-friendly PG accommodations to luxurious flats', color: 'bg-blue-100 text-blue-600' },
      { icon: DollarSign, title: 'Trusted Landlords', description: 'Feedback from landlords about how the platform has streamlined their rental process', color: 'bg-purple-100 text-purple-600' },
      { icon: Calendar, title: 'Easy Booking', description: 'Simple booking process with the ability to schedule property visits at your convenience', color: 'bg-pink-100 text-pink-600' },
    ],
    fr: [
      { icon: CheckCircle, title: 'Annonces Vérifiées', description: 'Toutes les annonces immobilières sont soigneusement vérifiées pour garantir leur exactitude et leur fiabilité', color: 'bg-emerald-100 text-emerald-600' },
      { icon: Home, title: 'Options Flexibles', description: 'Large gamme de types de propriétés, des hébergements PG économiques aux appartements luxueux', color: 'bg-blue-100 text-blue-600' },
      { icon: DollarSign, title: 'Propriétaires de Confiance', description: 'Retours des propriétaires sur la façon dont la plateforme a rationalisé leur processus de location', color: 'bg-purple-100 text-purple-600' },
      { icon: Calendar, title: 'Réservation Facile', description: 'Processus de réservation simple avec la possibilité de planifier des visites de propriété à votre convenance', color: 'bg-pink-100 text-pink-600' },
    ],
  };

  const content = {
    en: { heading: 'Why Choose Us', subheading: 'Connecting you to your next home, easily' },
    fr: { heading: 'Pourquoi Nous Choisir', subheading: 'Vous connecter à votre prochaine maison, facilement' },
  };

  const currentFeatures = features[language as keyof typeof features] || features.en;
  const currentContent = content[language as keyof typeof content] || content.en;

  return (
    <section className="py-6 sm:py-8 lg:py-12 px-3 sm:px-4 bg-gradient-to-b from-gray-50 to-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 px-2">
            {currentContent.heading}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg px-4 sm:px-0">
            {currentContent.subheading}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {currentFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.10)' }}
                className="group relative bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 cursor-default"
              >
                {/* Icon */}
                <div className="mb-3 sm:mb-4">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${feature.color} rounded-full flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                  </motion.div>
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-sm lg:text-base">
                  {feature.description}
                </p>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
