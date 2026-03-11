'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function CallToActionCards() {
  const { language } = useLanguage();

  const content = {
    en: {
      findHome: {
        title: 'Looking For The New Home/PG?',
        description: '2 New Offers Every Day. 35 Offers On Site, Trusted By A Community Of Thousands Of Users.',
        button: 'Learn More'
      },
      rentHome: {
        title: 'Want To Rent Your Home/PG?',
        description: '1 New Offers Every Day. 5 Offers On Site, Trusted By A Community Of Thousands Of Users.',
        button: 'Learn More'
      }
    },
    fr: {
      findHome: {
        title: 'Vous cherchez une nouvelle maison/PG?',
        description: '2 nouvelles offres chaque jour. 35 offres sur le site, approuvées par une communauté de milliers d\'utilisateurs.',
        button: 'En savoir plus'
      },
      rentHome: {
        title: 'Vous voulez louer votre maison/PG?',
        description: '1 nouvelle offre chaque jour. 5 offres sur le site, approuvées par une communauté de milliers d\'utilisateurs.',
        button: 'En savoir plus'
      }
    }
  };

  const t = content[language];

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Looking For Home Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
              {t.findHome.title}
            </h3>
            
            <p className="text-gray-500 text-sm md:text-base mb-8 leading-relaxed">
              {t.findHome.description}
            </p>

            <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-400 text-gray-600 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 font-medium">
              {t.findHome.button}
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3" 
                />
              </svg>
            </button>
          </div>

          {/* Want To Rent Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
              {t.rentHome.title}
            </h3>
            
            <p className="text-gray-500 text-sm md:text-base mb-8 leading-relaxed">
              {t.rentHome.description}
            </p>

            <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-400 text-gray-600 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 font-medium">
              {t.rentHome.button}
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
