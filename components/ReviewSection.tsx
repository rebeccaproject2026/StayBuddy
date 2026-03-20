"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Flag, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Review {
  _id: string;
  userName: string;
  userImage?: string;
  createdAt: string;
  rating: number;
  comment: string;
}

interface ReviewSectionProps {
  propertyId: string;
  language?: string;
  country?: string;
}

export default function ReviewSection({ propertyId, language = "en", country = "in" }: ReviewSectionProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Modal form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isFr = language === "fr";
  const tr = {
    title: isFr ? "Avis et évaluations" : "Reviews & Ratings",
    writeReview: isFr ? "Écrire un avis" : "Write a Review",
    overallRating: isFr ? "Note globale" : "Overall Rating",
    basedOn: isFr ? "Basé sur" : "Based on",
    reviewsWord: isFr ? "avis" : "reviews",
    noReviews: isFr ? "Aucun avis pour l'instant. Soyez le premier !" : "No reviews yet. Be the first!",
    showMore: isFr ? "Voir plus" : "Show more",
    showLess: isFr ? "Voir moins" : "Show less",
    yourRating: isFr ? "Votre note" : "Your Rating",
    yourReview: isFr ? "Votre avis" : "Your Review",
    placeholder: isFr ? "Partagez votre expérience..." : "Share your experience with this property...",
    submit: isFr ? "Soumettre" : "Submit Review",
    cancel: isFr ? "Annuler" : "Cancel",
    loginRequired: isFr ? "Connectez-vous pour laisser un avis" : "Login to write a review",
    minChars: isFr ? "Minimum 10 caractères" : "Minimum 10 characters",
    selectRating: isFr ? "Veuillez sélectionner une note" : "Please select a rating",
    success: isFr ? "Avis soumis !" : "Review submitted!",
  };

  const fetchReviews = () => {
    setLoading(true);
    fetch(`/api/properties/${propertyId}/reviews`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setReviews(data.reviews || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (propertyId) fetchReviews();
  }, [propertyId]);

  // Computed stats from real reviews
  const total = reviews.length;
  const average = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: total > 0 ? Math.round((reviews.filter(r => r.rating === star).length / total) * 100) : 0,
  }));

  const displayed = showAll ? reviews : reviews.slice(0, 3);

  const handleSubmit = async () => {
    setSubmitError("");
    if (rating === 0) { setSubmitError(tr.selectRating); return; }
    if (comment.trim().length < 10) { setSubmitError(tr.minChars); return; }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("staybuddy_token");
      const res = await fetch(`/api/properties/${propertyId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setRating(0);
        setComment("");
        fetchReviews();
      } else {
        setSubmitError(data.error || "Failed to submit review.");
      }
    } catch {
      setSubmitError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(isFr ? "fr-FR" : "en-US", { year: "numeric", month: "long" });
    } catch { return ""; }
  };

  const renderStars = (val: number, size = "w-4 h-4") => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`${size} ${s <= val ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          {tr.title}
        </h3>
        <button
          onClick={() => {
            if (isAuthenticated) {
              setShowModal(true);
            } else {
              router.push(`/${country}/login`);
            }
          }}
          className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white font-semibold rounded-lg transition-colors text-sm border border-primary/20 hover:border-transparent whitespace-nowrap"
        >
          {tr.writeReview}
        </button>
      </div>

      {/* Stats */}
      {total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {/* Average score */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{tr.overallRating}</p>
            <p className="text-5xl font-extrabold text-gray-900 mb-2">{average.toFixed(1)}</p>
            {renderStars(Math.round(average), "w-5 h-5")}
            <p className="text-sm text-gray-500 mt-2">{tr.basedOn} {total} {tr.reviewsWord}</p>
          </div>
          {/* Distribution */}
          <div className="md:col-span-8 flex flex-col justify-center gap-3">
            {distribution.map(({ star, pct }) => (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="w-10 shrink-0 text-gray-600 font-medium flex items-center gap-1">
                  {star} <Star className="w-3 h-3 fill-gray-400 text-gray-400" />
                </span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-yellow-400 rounded-full"
                  />
                </div>
                <span className="w-10 text-right text-gray-500 shrink-0">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse p-4 border border-gray-100 rounded-xl">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-2 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500 py-8">{tr.noReviews}</p>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {displayed.map((review, i) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 sm:p-5 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                      {review.userImage ? (
                        <Image src={review.userImage} alt={review.userName} width={40} height={40} className="object-cover w-full h-full" />
                      ) : (
                        <span>{review.userName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{review.userName}</p>
                      <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {reviews.length > 3 && (
            <div className="text-center pt-2">
              <button
                onClick={() => setShowAll(v => !v)}
                className="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg text-sm border border-gray-200 transition-colors"
              >
                {showAll ? tr.showLess : `${tr.showMore} (${reviews.length - 3})`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">{tr.writeReview}</h3>

              <div className="space-y-5">
                {/* Star picker */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{tr.yourRating}</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(s)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-9 h-9 transition-colors ${
                            s <= (hoverRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{tr.yourReview}</label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={4}
                    placeholder={tr.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">{comment.trim().length}/10 min</p>
                </div>

                {submitError && (
                  <p className="text-sm text-red-600">{submitError}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
                <button
                  onClick={() => { setShowModal(false); setRating(0); setComment(""); setSubmitError(""); }}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  {tr.cancel}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2.5 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60"
                >
                  {submitting ? "..." : tr.submit}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
