'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Testimonials = () => {
  const { language } = useLanguage();
  const [activeReview, setActiveReview] = useState(0);

  const content = {
    en: {
      heading: "OUR CUSTOMERS SAY",
      role: "Customer",
      reviews: [
        {
          name: "Sarah Jenkins",
          text: "StayBuddy made finding my new apartment incredibly easy. The verified listings gave me peace of mind, and the whole process was seamless.",
          rating: 5,
          avatar: "https://i.pravatar.cc/150?u=sarah",
        },
        {
          name: "Michael Chen",
          text: "I was struggling to find a good PG within my budget until I found this platform. Excellent customer support and great properties.",
          rating: 5,
          avatar: "https://i.pravatar.cc/150?u=michael",
        },
        {
          name: "Emma Williams",
          text: "The interface is very intuitive, and I loved the ability to filter exactly what I needed. Highly recommend for anyone looking to rent.",
          rating: 4,
          avatar: "https://i.pravatar.cc/150?u=emma",
        }
      ]
    },
    fr: {
      heading: "NOS CLIENTS DISENT",
      role: "Client",
      reviews: [
        {
          name: "Sarah Jenkins",
          text: "StayBuddy a rendu la recherche de mon nouvel appartement incroyablement facile. Les annonces vérifiées m'ont rassuré.",
          rating: 5,
          avatar: "https://i.pravatar.cc/150?u=sarah",
        },
        {
          name: "Michel Chen",
          text: "J'avais du mal à trouver un bon PG dans mon budget jusqu'à ce que je trouve cette plateforme. Excellent support client.",
          rating: 5,
          avatar: "https://i.pravatar.cc/150?u=michael",
        },
        {
          name: "Emma Williams",
          text: "L'interface est très intuitive et j'ai adoré la possibilité de filtrer exactement ce dont j'avais besoin. Je recommande fortement.",
          rating: 4,
          avatar: "https://i.pravatar.cc/150?u=emma",
        }
      ]
    }
  };

  const currentContent = content[language as keyof typeof content] || content.en;
  const reviews = currentContent.reviews;

  return (
    <section
      className="w-full py-20 z-10 select-none relative overflow-hidden bg-slate-900"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(30, 58, 138, 0.85), rgba(15, 23, 42, 0.9)), url('/aboutbg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-20">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center pb-12 mb-5">
          <h2 className="text-2xl md:text-3xl font-bold font-sans text-white tracking-wide uppercase">
            {currentContent.heading}
          </h2>
          <span className="w-16 h-1 bg-gradient-to-r from-blue-400 to-teal-400 mt-4 inline-block rounded-full" />
        </div>

        {/* Testimonial Content */}
        <div className="max-w-4xl mx-auto relative min-h-[300px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReview}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col items-center text-center w-full"
            >
              <div className="flex items-start justify-center gap-2 mb-10 max-w-3xl px-4">
                <span className="text-4xl text-white font-serif leading-none mt-1">“</span>
                <p className="text-white text-base md:text-lg font-medium leading-relaxed">
                  {reviews[activeReview].text}
                </p>
                <span className="text-4xl text-white font-serif leading-none mt-auto transform rotate-180 translate-y-2">“</span>
              </div>

              {/* Avatar */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-white/20 shadow-xl mb-4">
                <img
                  src={reviews[activeReview].avatar}
                  alt={reviews[activeReview].name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Name & Role */}
              <div className="flex items-center justify-center gap-2 text-white mb-2">
                <h4 className="font-bold text-sm md:text-base">{reviews[activeReview].name}</h4>
                <span className="text-white/80">-</span>
                <span className="text-xs md:text-sm font-medium text-white/90">{currentContent.role}</span>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-8">
                {[...Array(reviews[activeReview].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-4">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveReview(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeReview === idx ? 'w-6 bg-white' : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
