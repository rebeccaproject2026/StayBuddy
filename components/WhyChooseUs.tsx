'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { DollarSign, Home, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const WhyChooseUs = () => {
  const { language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const features = {
    en: [
      { 
        icon: ShieldCheck, 
        badge: 'TRUSTED & SECURE',
        title: 'VERIFIED LISTINGS', 
        description: 'Every property is rigorously inspected and verified to guarantee your safety and comfort.',
        iconColor: 'text-emerald-600',
        iconBorder: 'border-emerald-200',
        iconBg: 'bg-emerald-50',
        iconShadow: 'shadow-[0_4px_15px_rgba(16,185,129,0.15)]',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200'
      },
      { 
        icon: Home, 
        badge: 'PREMIUM SELECTION',
        title: 'DIVERSE OPTIONS', 
        description: 'From cozy budget stays to premium luxury apartments, find the perfect match for your needs.',
        iconColor: 'text-blue-600',
        iconBorder: 'border-blue-200',
        iconBg: 'bg-blue-50',
        iconShadow: 'shadow-[0_4px_15px_rgba(37,99,235,0.15)]',
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200'
      },
      { 
        icon: DollarSign, 
        badge: 'NO HIDDEN FEES',
        title: 'TRANSPARENT PRICING', 
        description: 'No hidden fees. What you see is what you pay, ensuring a smooth and honest transaction.',
        iconColor: 'text-purple-600',
        iconBorder: 'border-purple-200',
        iconBg: 'bg-purple-50',
        iconShadow: 'shadow-[0_4px_15px_rgba(147,51,234,0.15)]',
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-200'
      },
      { 
        icon: MapPin, 
        badge: 'EASY ACCESS',
        title: 'PRIME LOCATIONS', 
        description: 'Properties situated in top-rated neighborhoods with easy access to all essential amenities.',
        iconColor: 'text-rose-600',
        iconBorder: 'border-rose-200',
        iconBg: 'bg-rose-50',
        iconShadow: 'shadow-[0_4px_15px_rgba(225,29,72,0.15)]',
        badgeBg: 'bg-rose-50',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-200'
      },
    ],
    fr: [
      { 
        icon: ShieldCheck, 
        badge: 'FIABLE ET SÉCURISÉ',
        title: 'ANNONCES VÉRIFIÉES', 
        description: 'Chaque propriété est rigoureusement inspectée et vérifiée pour garantir votre sécurité et votre confort.',
        iconColor: 'text-emerald-600',
        iconBorder: 'border-emerald-200',
        iconBg: 'bg-emerald-50',
        iconShadow: 'shadow-[0_4px_15px_rgba(16,185,129,0.15)]',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200'
      },
      { 
        icon: Home, 
        badge: 'SÉLECTION PREMIUM',
        title: 'OPTIONS DIVERSES', 
        description: 'Des séjours économiques confortables aux appartements de luxe haut de gamme, trouvez ce qu\'il vous faut.',
        iconColor: 'text-blue-600',
        iconBorder: 'border-blue-200',
        iconBg: 'bg-blue-50',
        iconShadow: 'shadow-[0_4px_15px_rgba(37,99,235,0.15)]',
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200'
      },
      { 
        icon: DollarSign, 
        badge: 'SANS FRAIS CACHÉS',
        title: 'PRIX TRANSPARENTS', 
        description: 'Aucun frais caché. Ce que vous voyez est ce que vous payez, assurant une transaction fluide.',
        iconColor: 'text-purple-600',
        iconBorder: 'border-purple-200',
        iconBg: 'bg-purple-50',
        iconShadow: 'shadow-[0_4px_15px_rgba(147,51,234,0.15)]',
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-200'
      },
      { 
        icon: MapPin, 
        badge: 'ACCÈS FACILE',
        title: 'EMPLACEMENTS DE CHOIX', 
        description: 'Propriétés situées dans les meilleurs quartiers avec un accès facile à toutes les commodités essentielles.',
        iconColor: 'text-rose-600',
        iconBorder: 'border-rose-200',
        iconBg: 'bg-rose-50',
        iconShadow: 'shadow-[0_4px_15px_rgba(225,29,72,0.15)]',
        badgeBg: 'bg-rose-50',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-200'
      },
    ],
  };

  const content = {
    en: { 
      heading: 'Why Choose StayBuddy', 
      subheading: 'We redefine the way you find your perfect living space with unmatched reliability and ease.',
      badge: 'Our Advantage'
    },
    fr: { 
      heading: 'Pourquoi Choisir StayBuddy', 
      subheading: 'Nous redéfinissons la façon dont vous trouvez votre espace de vie idéal avec une fiabilité inégalée.',
      badge: 'Notre Avantage'
    },
  };

  const currentFeatures = features[language as keyof typeof features] || features.en;
  const currentContent = content[language as keyof typeof content] || content.en;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-slate-50" ref={ref}>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-100/40 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span 
            className="inline-block py-1.5 px-4 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold tracking-wide uppercase mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {currentContent.badge}
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            {currentContent.heading}
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
            {currentContent.subheading}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {currentFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 border border-slate-100 overflow-hidden"
              >
                {/* Icon Container - matching the reference image's neon glow box */}
                <div className={`mb-8 w-16 h-16 rounded-2xl border ${feature.iconBorder} ${feature.iconBg} flex items-center justify-center ${feature.iconShadow} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-8 h-8 ${feature.iconColor}`} strokeWidth={1.5} />
                </div>

                {/* Pill Badge */}
                <div className={`mb-5 px-4 py-1.5 rounded-full border ${feature.badgeBorder} ${feature.badgeBg}`}>
                  <span className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase ${feature.badgeText}`}>
                    {feature.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-4 tracking-wide group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
