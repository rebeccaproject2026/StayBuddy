'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, FileText, Clock, Shield, CreditCard, Users, MessageSquare, ThumbsUp, Home, Calendar, FileSignature, Package, Headphones } from 'lucide-react';

const RentingExperience = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      mainTitle: 'Take pleasure in a refreshed renting experience.',
      mainDescription: 'Experience the joy of renting reimagined. Immerse yourself in a renewed sense of comfort and convenience with our refreshed rental offerings. Enjoy modern amenities, stylish interiors, and exceptional service that make every moment in your new home a pleasure. Welcome to a better way to rent.',
      leftTitle: 'Our Renting Procedure Has Been Made Easier',
      leftDescription: 'Renting a new place has never been this simple! We\'ve simplified the entire process to save you time and hassle',
      rightTitle: 'Every stage of your rental experience is guided by us',
      rightDescription: 'From finding your ideal property to signing the lease, we ensure a seamless process. Our dedicated team is here to support you with expert advice and personalized service every step of the way, making your rental journey stress-free and enjoyable.',
      leftSteps: [
        'Simplified Application Process',
        'Faster Approvals',
        'User Friendly Platform',
        'Enhanced Customer Support',
        'Flexible Payment Options',
        'Personalized Services',
        'Transparent Communication',
        'Feedback And Improvements'
      ],
      rightSteps: [
        'Pre-Rental Preparation',
        'Booking Stage',
        'Renewal Or Moving Out',
        'Lease Signing',
        'Post-Rental Stage',
        'Ongoing Support'
      ]
    },
    fr: {
      mainTitle: 'Profitez d\'une expérience de location rafraîchie.',
      mainDescription: 'Découvrez la joie de la location réinventée. Plongez dans un sentiment renouvelé de confort et de commodité avec nos offres de location rafraîchies. Profitez d\'équipements modernes, d\'intérieurs élégants et d\'un service exceptionnel qui rendent chaque moment dans votre nouvelle maison un plaisir. Bienvenue dans une meilleure façon de louer.',
      leftTitle: 'Notre procédure de location a été simplifiée',
      leftDescription: 'Louer un nouveau logement n\'a jamais été aussi simple! Nous avons simplifié l\'ensemble du processus pour vous faire gagner du temps et des tracas',
      rightTitle: 'Chaque étape de votre expérience de location est guidée par nous',
      rightDescription: 'De la recherche de votre propriété idéale à la signature du bail, nous assurons un processus fluide. Notre équipe dévouée est là pour vous soutenir avec des conseils d\'experts et un service personnalisé à chaque étape, rendant votre parcours de location sans stress et agréable.',
      leftSteps: [
        'Processus de candidature simplifié',
        'Approbations plus rapides',
        'Plateforme conviviale',
        'Support client amélioré',
        'Options de paiement flexibles',
        'Services personnalisés',
        'Communication transparente',
        'Commentaires et améliorations'
      ],
      rightSteps: [
        'Préparation pré-location',
        'Étape de réservation',
        'Renouvellement ou déménagement',
        'Signature du bail',
        'Étape post-location',
        'Support continu'
      ]
    },
  };

  const leftIcons = [FileText, Clock, Users, Shield, CreditCard, Home, MessageSquare, ThumbsUp];
  const rightIcons = [Package, Calendar, Home, FileSignature, CheckCircle, Headphones];

  const currentContent = content[language as keyof typeof content] || content.en;

  return (
    <section className="py-8 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Main Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {currentContent.mainTitle}
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-5xl mx-auto leading-relaxed">
            {currentContent.mainDescription}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Renting Procedure */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {currentContent.leftTitle}
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {currentContent.leftDescription}
            </p>

            <div className="space-y-4">
              {currentContent.leftSteps.map((step, index) => {
                const Icon = leftIcons[index];
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {index < currentContent.leftSteps.length - 1 && (
                        <div className="absolute left-1/2 top-12 w-0.5 h-4 bg-gradient-to-b from-primary/40 to-transparent -translate-x-1/2" />
                      )}
                    </div>
                    <p className="text-gray-700 font-medium group-hover:text-primary transition-colors">
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Rental Experience Stages */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {currentContent.rightTitle}
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {currentContent.rightDescription}
            </p>

            <div className="space-y-4">
              {currentContent.rightSteps.map((step, index) => {
                const Icon = rightIcons[index];
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-hover rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {index < currentContent.rightSteps.length - 1 && (
                        <div className="absolute left-1/2 top-12 w-0.5 h-4 bg-gradient-to-b from-accent/40 to-transparent -translate-x-1/2" />
                      )}
                    </div>
                    <p className="text-gray-700 font-medium group-hover:text-accent transition-colors">
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentingExperience;
