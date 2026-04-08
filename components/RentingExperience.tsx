'use client';

import { useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Zap, Clock, Smile, Shield, CreditCard, MessageSquare,
  Search, CalendarCheck, FileSignature, KeyRound, HeadphonesIcon, ArrowRight,
} from 'lucide-react';

const RentingExperience = () => {
  const { language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const isFr = language === 'fr';

  const leftSteps = [
    {
      icon: Zap,
      title: isFr ? 'Candidature simplifiée' : 'Simple Application',
      desc: isFr ? 'Postulez en quelques minutes, sans paperasse.' : 'Apply in minutes, no paperwork hassle.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Clock,
      title: isFr ? 'Approbations rapides' : 'Fast Approvals',
      desc: isFr ? 'Obtenez une réponse en moins de 24 heures.' : 'Get a response within 24 hours.',
      color: 'from-violet-500 to-violet-600',
    },
    {
      icon: Shield,
      title: isFr ? 'Annonces vérifiées' : 'Verified Listings',
      desc: isFr ? 'Chaque propriété est contrôlée par notre équipe.' : 'Every property is checked by our team.',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: CreditCard,
      title: isFr ? 'Paiements flexibles' : 'Flexible Payments',
      desc: isFr ? 'Plusieurs options de paiement sécurisées.' : 'Multiple secure payment options available.',
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: MessageSquare,
      title: isFr ? 'Support dédié' : 'Dedicated Support',
      desc: isFr ? 'Notre équipe est disponible à chaque étape.' : 'Our team is available at every step.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Smile,
      title: isFr ? 'Expérience sans stress' : 'Stress-Free Experience',
      desc: isFr ? 'Nous gérons les détails pour vous.' : 'We handle the details so you don\'t have to.',
      color: 'from-teal-500 to-teal-600',
    },
  ];

  const rightSteps = [
    {
      num: '01',
      icon: Search,
      title: isFr ? 'Recherche & Découverte' : 'Search & Discover',
      desc: isFr ? 'Parcourez des milliers de propriétés vérifiées avec des filtres intelligents.' : 'Browse thousands of verified properties with smart filters.',
    },
    {
      num: '02',
      icon: CalendarCheck,
      title: isFr ? 'Réservation' : 'Book a Visit',
      desc: isFr ? 'Planifiez une visite et contactez directement le propriétaire.' : 'Schedule a visit and connect directly with the owner.',
    },
    {
      num: '03',
      icon: FileSignature,
      title: isFr ? 'Signature du bail' : 'Sign the Lease',
      desc: isFr ? 'Finalisez les termes et signez votre contrat en toute sécurité.' : 'Finalize terms and sign your agreement securely.',
    },
    {
      num: '04',
      icon: KeyRound,
      title: isFr ? 'Emménagement' : 'Move In',
      desc: isFr ? 'Récupérez vos clés et installez-vous dans votre nouveau chez-vous.' : 'Collect your keys and settle into your new home.',
    },
    {
      num: '05',
      icon: HeadphonesIcon,
      title: isFr ? 'Support continu' : 'Ongoing Support',
      desc: isFr ? 'Nous restons disponibles tout au long de votre séjour.' : 'We stay available throughout your entire stay.',
    },
  ];

  return (
    <section ref={ref} className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4"
          >
            <Zap className="w-3.5 h-3.5" />
            {isFr ? 'Expérience de location' : 'Renting Experience'}
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 max-w-2xl mx-auto leading-tight">
            {isFr ? 'Une location simple, rapide et sans stress.' : 'Simple, fast, and stress-free renting.'}
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {isFr
              ? 'StayBuddy simplifie chaque étape — de la recherche à l\'emménagement.'
              : 'StayBuddy simplifies every step — from searching to moving in.'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">

          {/* Left — Feature cards */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {isFr ? 'Pourquoi choisir StayBuddy' : 'Why Choose StayBuddy'}
            </h3>
            <p className="text-gray-500 text-sm sm:text-base mb-6">
              {isFr ? 'Tout ce dont vous avez besoin, en un seul endroit.' : 'Everything you need, all in one place.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {leftSteps.map((step, i) => {
                const Icon = step.icon;
                const isActive = activeStep === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                    onMouseEnter={() => setActiveStep(i)}
                    onMouseLeave={() => setActiveStep(null)}
                    className={`relative rounded-xl p-4 cursor-default transition-all duration-300 border ${
                      isActive
                        ? 'border-primary/30 bg-primary/5 shadow-md'
                        : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-3 shadow-sm transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5">{step.title}</p>
                    <AnimatePresence>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-gray-500 text-xs sm:text-sm leading-relaxed overflow-hidden"
                        >
                          {step.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    {!isActive && <p className="text-gray-400 text-xs sm:text-sm">{step.desc}</p>}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right — Journey steps */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {isFr ? 'Votre parcours de location' : 'Your Rental Journey'}
            </h3>
            <p className="text-gray-500 text-sm sm:text-base mb-6">
              {isFr ? 'Cinq étapes simples vers votre nouveau chez-vous.' : 'Five simple steps to your new home.'}
            </p>
            <div className="space-y-2">
              {rightSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.09 }}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-4 p-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 group cursor-default"
                  >
                    {/* Step number + line */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      {i < rightSteps.length - 1 && (
                        <div className="w-0.5 h-5 bg-gradient-to-b from-accent/40 to-transparent mt-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-accent/60">{step.num}</span>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-primary transition-colors">{step.title}</p>
                      </div>
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-2" />
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between"
            >
              <p className="text-sm text-gray-400">
                {isFr ? 'Prêt à commencer?' : 'Ready to get started?'}
              </p>
              <motion.a
                href="/properties"
                whileHover={{ scale: 1.04, x: 2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-xl text-sm font-semibold shadow-md hover:bg-accent-hover transition-colors"
              >
                {isFr ? 'Explorer' : 'Explore Now'}
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RentingExperience;
