'use client';

import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, FileText, Clock, Shield, CreditCard, Users, MessageSquare, ThumbsUp, Home, Calendar, FileSignature, Package, Headphones } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const RentingExperience = () => {
  const { language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const content = {
    en: {
      mainTitle: 'Take pleasure in a refreshed renting experience.',
      mainDescription: 'Experience the joy of renting reimagined. Immerse yourself in a renewed sense of comfort and convenience with our refreshed rental offerings. Enjoy modern amenities, stylish interiors, and exceptional service that make every moment in your new home a pleasure. Welcome to a better way to rent.',
      leftTitle: 'Our Renting Procedure Has Been Made Easier',
      leftDescription: "Renting a new place has never been this simple! We've simplified the entire process to save you time and hassle",
      rightTitle: 'Every stage of your rental experience is guided by us',
      rightDescription: 'From finding your ideal property to signing the lease, we ensure a seamless process. Our dedicated team is here to support you with expert advice and personalized service every step of the way, making your rental journey stress-free and enjoyable.',
      leftSteps: ['Simplified Application Process', 'Faster Approvals', 'User Friendly Platform', 'Enhanced Customer Support', 'Flexible Payment Options', 'Personalized Services', 'Transparent Communication', 'Feedback And Improvements'],
      rightSteps: ['Pre-Rental Preparation', 'Booking Stage', 'Renewal Or Moving Out', 'Lease Signing', 'Post-Rental Stage', 'Ongoing Support'],
    },
    fr: {
      mainTitle: "Profitez d'une expérience de location rafraîchie.",
      mainDescription: "Découvrez la joie de la location réinventée. Plongez dans un sentiment renouvelé de confort et de commodité avec nos offres de location rafraîchies. Profitez d'équipements modernes, d'intérieurs élégants et d'un service exceptionnel qui rendent chaque moment dans votre nouvelle maison un plaisir. Bienvenue dans une meilleure façon de louer.",
      leftTitle: 'Notre procédure de location a été simplifiée',
      leftDescription: "Louer un nouveau logement n'a jamais été aussi simple! Nous avons simplifié l'ensemble du processus pour vous faire gagner du temps et des tracas",
      rightTitle: 'Chaque étape de votre expérience de location est guidée par nous',
      rightDescription: "De la recherche de votre propriété idéale à la signature du bail, nous assurons un processus fluide. Notre équipe dévouée est là pour vous soutenir avec des conseils d'experts et un service personnalisé à chaque étape, rendant votre parcours de location sans stress et agréable.",
      leftSteps: ['Processus de candidature simplifié', 'Approbations plus rapides', 'Plateforme conviviale', 'Support client amélioré', 'Options de paiement flexibles', 'Services personnalisés', 'Communication transparente', 'Commentaires et améliorations'],
      rightSteps: ['Préparation pré-location', 'Étape de réservation', 'Renouvellement ou déménagement', 'Signature du bail', 'Étape post-location', 'Support continu'],
    },
  };

  const leftIcons = [FileText, Clock, Users, Shield, CreditCard, Home, MessageSquare, ThumbsUp];
  const rightIcons = [Package, Calendar, Home, FileSignature, CheckCircle, Headphones];
  const currentContent = content[language as keyof typeof content] || content.en;

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' } }),
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({ opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.3 + i * 0.07, ease: 'easeOut' } }),
  };

  const StepList = ({ steps, icons, color }: { steps: string[]; icons: any[]; color: string }) => (
    <div className="space-y-3 esm:space-y-4">
      {steps.map((step, index) => {
        const Icon = icons[index];
        return (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={stepVariants}
            whileHover={{ x: 6 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="flex items-center gap-3 esm:gap-4 group cursor-default"
          >
            <div className="relative flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className={`w-10 h-10 esm:w-11 esm:h-11 md:w-12 md:h-12 ${color} rounded-full flex items-center justify-center shadow-md`}
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </motion.div>
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-10 esm:top-11 md:top-12 w-0.5 h-4 bg-gradient-to-b from-primary/40 to-transparent -translate-x-1/2" />
              )}
            </div>
            <p className="text-gray-700 text-sm esm:text-base font-medium group-hover:text-primary transition-colors duration-200">
              {step}
            </p>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <section className="py-10 md:py-8 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Main Header */}
        <motion.div
          className="text-center mb-10 esm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-2xl esm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
            {currentContent.mainTitle}
          </h2>
          <p className="text-gray-600 text-sm esm:text-base md:text-lg max-w-5xl mx-auto leading-relaxed">
            {currentContent.mainDescription}
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 esm:gap-10 md:gap-12">
          {/* Left Column */}
          <motion.div
            custom={0}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={cardVariants}
            whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.10)' }}
            className="bg-white rounded-2xl p-5 esm:p-6 md:p-8 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl esm:text-2xl font-bold text-gray-800 mb-2 md:mb-3">{currentContent.leftTitle}</h3>
            <p className="text-gray-600 text-sm esm:text-base mb-6 esm:mb-7 md:mb-8 leading-relaxed">{currentContent.leftDescription}</p>
            <StepList steps={currentContent.leftSteps} icons={leftIcons} color="bg-gradient-to-br from-primary to-primary-dark" />
          </motion.div>

          {/* Right Column */}
          <motion.div
            custom={1}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={cardVariants}
            whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.10)' }}
            className="bg-white rounded-2xl p-5 esm:p-6 md:p-8 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl esm:text-2xl font-bold text-gray-800 mb-2 md:mb-3">{currentContent.rightTitle}</h3>
            <p className="text-gray-600 text-sm esm:text-base mb-6 esm:mb-7 md:mb-8 leading-relaxed">{currentContent.rightDescription}</p>
            <StepList steps={currentContent.rightSteps} icons={rightIcons} color="bg-gradient-to-br from-accent to-accent-hover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RentingExperience;
