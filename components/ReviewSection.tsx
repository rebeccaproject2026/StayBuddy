"use client";

import { useState } from "react";
import { Star, ThumbsUp, MessageSquare, Flag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Review {
  id: string;
  userName: string;
  userImage?: string;
  date: string;
  rating: number;
  comment: string;
  helpfulCount: number;
}

interface RatingStats {
  average: number;
  total: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ReviewSectionProps {
  stats: RatingStats;
  reviews: Review[];
  language?: string;
  t?: any; // Pass translations directly
}

export default function ReviewSection({ stats, reviews, language, t }: ReviewSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Default translations if t is not provided perfectly
  const translations = {
    reviewsAndRatings: t?.reviewsAndRatings || (language === 'fr' ? "Avis et évaluations" : "Reviews & Ratings"),
    overallRating: t?.overallRating || (language === 'fr' ? "Évaluation globale" : "Overall Rating"),
    basedOn: t?.basedOn || (language === 'fr' ? "Basé sur" : "Based on"),
    reviews: t?.reviews || (language === 'fr' ? "avis" : "reviews"),
    writeReview: t?.writeReview || (language === 'fr' ? "Écrire un avis" : "Write a Review"),
    helpful: t?.helpful || (language === 'fr' ? "Utile" : "Helpful"),
    report: t?.report || (language === 'fr' ? "Signaler" : "Report"),
    showMore: t?.showMoreReviews || (language === 'fr' ? "Voir plus d'avis" : "Show more reviews"),
    showLess: t?.showLessReviews || (language === 'fr' ? "Voir moins d'avis" : "Show less reviews"),
    submitReview: t?.submitReview || (language === 'fr' ? "Soumettre l'avis" : "Submit Review"),
    cancel: t?.cancel || (language === 'fr' ? "Annuler" : "Cancel"),
    yourRating: t?.yourRating || (language === 'fr' ? "Votre note" : "Your Rating"),
    yourReview: t?.yourReview || (language === 'fr' ? "Votre avis" : "Your Review"),
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const calculatePercentage = (count: number) => {
    if (stats.total === 0) return 0;
    return Math.round((count / stats.total) * 100);
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          {translations.reviewsAndRatings}
        </h3>
        <button
          onClick={() => setShowReviewModal(true)}
          className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white font-semibold rounded-lg transition-colors text-sm sm:text-base border border-primary/20 hover:border-transparent whitespace-nowrap"
        >
          {translations.writeReview}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 mb-8">
        {/* Overall Rating Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">{translations.overallRating}</h4>
          <div className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
            {stats.average.toFixed(1)}
          </div>
          <div className="mb-2">
            {renderStars(Math.round(stats.average))}
          </div>
          <p className="text-sm text-gray-600 font-medium">
            {translations.basedOn} {stats.total} {translations.reviews}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-8 flex flex-col justify-center gap-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.distribution[star as keyof typeof stats.distribution] || 0;
            const percentage = calculatePercentage(count);
            return (
              <div key={star} className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 w-12 shrink-0 font-medium text-gray-700">
                  {star} <Star className="w-3.5 h-3.5 fill-gray-400 text-gray-400" />
                </div>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-yellow-400 rounded-full"
                  />
                </div>
                <div className="w-10 shrink-0 text-right text-gray-500 font-medium">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 sm:space-y-6">
        <AnimatePresence>
          {displayedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 sm:p-5 border border-gray-100 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                    {review.userImage ? (
                      <Image src={review.userImage} alt={review.userName} width={40} height={40} className="object-cover" />
                    ) : (
                      review.userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">{review.userName}</h5>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                {review.comment}
              </p>
              
              <div className="flex items-center gap-4 text-xs sm:text-sm pt-3 border-t border-gray-50">
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-green-600 transition-colors font-medium">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{translations.helpful} ({review.helpfulCount})</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors ml-auto font-medium text-xs">
                  <Flag className="w-3.5 h-3.5" />
                  <span>{translations.report}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {reviews.length > 3 && (
        <div className="mt-8 text-center pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg transition-colors text-sm sm:text-base border border-gray-200"
          >
            {showAll ? translations.showLess : translations.showMore}
          </button>
        </div>
      )}

      {/* Mock Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{translations.writeReview}</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{translations.yourRating}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="text-gray-300 hover:text-yellow-400 transition-colors">
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{translations.yourReview}</label>
                <textarea 
                  className="w-full h-32 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all placeholder:text-gray-400"
                  placeholder="Share your experience with this property..."
                ></textarea>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-5">
              <button 
                onClick={() => setShowReviewModal(false)}
                className="px-5 py-2.5 text-sm sm:text-base font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {translations.cancel}
              </button>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="px-6 py-2.5 text-sm sm:text-base font-semibold bg-primary text-white rounded-xl shadow-md hover:shadow-lg hover:bg-primary-dark transition-all"
              >
                {translations.submitReview}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
