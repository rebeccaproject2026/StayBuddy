'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, DollarSign, Home, Calendar } from 'lucide-react';

const WhyChooseUs = () => {
  const { language } = useLanguage();

  const features = {
    en: [
      {
        icon: CheckCircle,
        title: 'Verified Listings',
        description: 'All property listings are thoroughly vetted and verified to ensure accuracy and reliability',
        color: 'bg-emerald-100 text-emerald-600'
      },
      {
        icon: Home,
        title: 'Flexible Options',
        description: 'Wide range of property types, from budget-friendly PG accommodations to luxurious flats',
        color: 'bg-blue-100 text-blue-600'
      },
      {
        icon: DollarSign,
        title: 'Trusted Landlords',
        description: 'Feedback from landlords about how the platform has streamlined their rental process',
        color: 'bg-purple-100 text-purple-600'
      },
      {
        icon: Calendar,
        title: 'Easy Booking',
        description: 'Simple booking process with the ability to schedule property visits at your convenience',
        color: 'bg-pink-100 text-pink-600'
      }
    ],
    fr: [
      {
        icon: CheckCircle,
        title: 'Annonces Vérifiées',
        description: 'Toutes les annonces immobilières sont soigneusement vérifiées pour garantir leur exactitude et leur fiabilité',
        color: 'bg-emerald-100 text-emerald-600'
      },
      {
        icon: Home,
        title: 'Options Flexibles',
        description: 'Large gamme de types de propriétés, des hébergements PG économiques aux appartements luxueux',
        color: 'bg-blue-100 text-blue-600'
      },
      {
        icon: DollarSign,
        title: 'Propriétaires de Confiance',
        description: 'Retours des propriétaires sur la façon dont la plateforme a rationalisé leur processus de location',
        color: 'bg-purple-100 text-purple-600'
      },
      {
        icon: Calendar,
        title: 'Réservation Facile',
        description: 'Processus de réservation simple avec la possibilité de planifier des visites de propriété à votre convenance',
        color: 'bg-pink-100 text-pink-600'
      }
    ],
  };

  const content = {
    en: {
      heading: 'Why Choose Us',
      subheading: 'Connecting you to your next home, easily'
    },
    fr: {
      heading: 'Pourquoi Nous Choisir',
      subheading: 'Vous connecter à votre prochaine maison, facilement'
    },
  };

  const currentFeatures = features[language as keyof typeof features] || features.en;
  const currentContent = content[language as keyof typeof content] || content.en;

  return (
    <section className="py-8 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            {currentContent.heading}
          </h2>
          <p className="text-gray-600 text-lg">
            {currentContent.subheading}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                {/* Icon */}
                <div className="mb-4 relative">
                  <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
