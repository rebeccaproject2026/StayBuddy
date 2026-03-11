'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

export default function OwnerSection() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: 'Are You An Owner?',
      description: 'Enjoy a personalized experience through our secure platform. Rely on our dedicated team of experts to enhance your rental journey positively. Owners, achieve peace of mind with our management: zero rental vacancy guaranteed for optimal profitability!',
      features: [
        'We Have The Perfect Renter',
        'Assurances provided'
      ],
      button: 'Learn More'
    },
    fr: {
      title: 'Êtes-vous propriétaire?',
      description: 'Profitez d\'une expérience personnalisée grâce à notre plateforme sécurisée. Comptez sur notre équipe d\'experts dédiés pour améliorer positivement votre parcours locatif. Propriétaires, obtenez la tranquillité d\'esprit avec notre gestion : zéro vacance locative garantie pour une rentabilité optimale!',
      features: [
        'Nous avons le locataire parfait',
        'Assurances fournies'
      ],
      button: 'En savoir plus'
    }
  };

  const t = content[language];

  return (
    <section className="py-8 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid md:grid-cols-[35%_65%] gap-0 items-center p-4">
            {/* Image Section */}
            <div className="relative h-[450px] md:h-[520px]">
              <Image
                src="/owner.png"
                alt="Property Owner"
                fill
                className="object-cover rounded-xl"
                priority
              />
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-14 lg:p-16 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {t.title}
              </h2>
              
              <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed text-justify">
                {t.description}
              </p>

              <ul className="space-y-4 mb-10">
                {t.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-800 font-medium">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-4 flex-shrink-0"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="inline-flex items-center gap-4 px-10 py-2.5 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 w-fit font-semibold text-lg shadow-sm hover:shadow-md">
                {t.button}
                <svg 
                  className="w-5 h-5 transition-transform group-hover:translate-x-1" 
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
      </div>
    </section>
  );
}
