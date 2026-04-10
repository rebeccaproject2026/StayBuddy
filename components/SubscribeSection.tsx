"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams } from "next/navigation";
import { Mail, CheckCircle, AlertCircle, Bell, Sparkles, MapPin, Home } from "lucide-react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const CITIES: Record<string, string[]> = {
  en: ["Ahmedabad", "Surat", "Vadodara", "Gandhinagar", "Rajkot"],
  fr: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Bordeaux", "Strasbourg"],
};

export default function SubscribeSection() {
  const { language: ctxLanguage } = useLanguage();
  const params = useParams();
  // Derive language from URL country param — reliable even in lazy-loaded components
  const language = (params?.country as string) === 'fr' ? 'fr' : ctxLanguage;
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState<"" | "PG" | "Tenant">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "duplicate">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const content = {
    en: {
      badge: "Stay Informed",
      title: "Never Miss a Vacant Room",
      subtitle: "Get instant email alerts when new rooms matching your preferences become available",
      emailPlaceholder: "Enter your email address",
      emailLabel: "Email address",
      cityLabel: "Preferred city",
      typeLabel: "Property type",
      cityPlaceholder: "Any city",
      subscribeButton: "Subscribe Now",
      subscribing: "Subscribing...",
      successMessage: "Successfully subscribed! Check your email for confirmation.",
      duplicateMessage: "You're already subscribed with this email.",
      errorMessage: "Something went wrong. Please try again.",
      invalidEmail: "Please enter a valid email address",
      privacyText: "We respect your privacy. Unsubscribe anytime.",
      features: ["Instant notifications", "No spam guarantee", "Free forever"],
      anyType: "Any type",
      formTitle: "Subscribe for Updates",
      formSubtitle: "Join our community and never miss an opportunity",
    },
    fr: {
      badge: "Restez informé",
      title: "Ne manquez jamais une chambre vacante",
      subtitle: "Recevez des alertes par e-mail instantanées lorsque de nouvelles chambres correspondant à vos préférences deviennent disponibles",
      emailPlaceholder: "Entrez votre adresse e-mail",
      emailLabel: "Adresse e-mail",
      cityLabel: "Ville préférée",
      typeLabel: "Type de bien",
      cityPlaceholder: "Toute ville",
      subscribeButton: "S'abonner maintenant",
      subscribing: "Abonnement en cours...",
      successMessage: "Abonnement réussi! Vérifiez votre e-mail pour confirmation.",
      duplicateMessage: "Vous êtes déjà abonné avec cet e-mail.",
      errorMessage: "Une erreur s'est produite. Veuillez réessayer.",
      invalidEmail: "Veuillez entrer une adresse e-mail valide",
      privacyText: "Nous respectons votre vie privée. Désabonnez-vous à tout moment.",
      features: ["Notifications instantanées", "Garantie sans spam", "Gratuit pour toujours"],
      anyType: "Tout type",
      formTitle: "S'abonner aux mises à jour",
      formSubtitle: "Rejoignez notre communauté et ne manquez jamais une opportunité",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setSubmitStatus("error");
      setErrorMessage(t.invalidEmail);
      setTimeout(() => { setSubmitStatus("idle"); setErrorMessage(""); }, 3000);
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city: city || undefined, propertyType: propertyType || undefined, country: (params?.country as string) || 'in' }),
      });
      const data = await res.json();

      if (res.status === 409 || data.error === "already_subscribed") {
        setSubmitStatus("duplicate");
        setTimeout(() => setSubmitStatus("idle"), 5000);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Failed");

      setSubmitStatus("success");
      setEmail("");
      setCity("");
      setPropertyType("");
      setTimeout(() => setSubmitStatus("idle"), 6000);
    } catch {
      setSubmitStatus("error");
      setErrorMessage(t.errorMessage);
      setTimeout(() => { setSubmitStatus("idle"); setErrorMessage(""); }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative px-4 sm:px-6 md:px-4 py-8 sm:py-10 md:py-10 overflow-hidden" ref={ref}>
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="grid md:grid-cols-5 gap-0">
            {/* Left — Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="md:col-span-2 relative p-6 sm:p-8 md:p-10 text-white flex flex-col justify-center overflow-hidden"
            >
              {/* Background image */}
              <Image
                src="/subscribebg.jpeg"
                alt="apartment background"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/55 to-black/65" />

              {/* Content — above overlay */}
              <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4 w-fit">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-semibold">{t.badge}</span>
              </div>
              <h2 className="text-xl esm:text-2xl sm:text-3xl md:text-3xl font-bold mb-3 leading-tight">{t.title}</h2>
              <p className="text-white/90 text-xs esm:text-sm sm:text-base mb-5 esm:mb-6 leading-relaxed">{t.subtitle}</p>
              <div className="space-y-2.5">
                {t.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -15 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-4 h-4 esm:w-5 esm:h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 esm:w-3.5 esm:h-3.5 text-white" />
                    </div>
                    <span className="text-xs esm:text-sm text-white/95">{feature}</span>
                  </motion.div>
                ))}
              </div>
              </div>{/* end z-10 */}
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
              className="md:col-span-3 p-6 sm:p-8 md:p-10 flex flex-col justify-center"
            >
              <div className="mb-4 flex items-start gap-3 esm:gap-4">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-12 h-12 esm:w-14 esm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 flex-shrink-0"
                >
                  <Bell className="w-6 h-6 esm:w-7 esm:h-7 text-primary" />
                </motion.div>
                <div>
                  <h3 className="text-lg esm:text-xl sm:text-2xl font-bold text-gray-900">{t.formTitle}</h3>
                  <p className="text-xs esm:text-sm text-gray-600">{t.formSubtitle}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Email */}
                <div>
                  <label htmlFor="sub-email" className="block text-sm font-semibold text-gray-600 mb-1.5">{t.emailLabel}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="sub-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      disabled={isSubmitting || submitStatus === "success"}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Preferences row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="sub-city" className="block text-sm font-semibold text-gray-600 mb-1.5">{t.cityLabel}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        id="sub-city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={isSubmitting || submitStatus === "success"}
                        className="w-full pl-9 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors disabled:bg-gray-100 text-sm appearance-none bg-white"
                      >
                        <option value="">{t.cityPlaceholder}</option>
                        {(CITIES[language] ?? CITIES.en).map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="sub-type" className="block text-sm font-semibold text-gray-600 mb-1.5">{t.typeLabel}</label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        id="sub-type"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value as "" | "PG" | "Tenant")}
                        disabled={isSubmitting || submitStatus === "success"}
                        className="w-full pl-9 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors disabled:bg-gray-100 text-sm appearance-none bg-white"
                      >
                        <option value="">{t.anyType}</option>
                        <option value="PG">PG</option>
                        <option value="Tenant">Flat / Tenant</option>
                      </select>
                    </div>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || submitStatus === "success"}
                  whileHover={!isSubmitting && submitStatus !== "success" ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting && submitStatus !== "success" ? { scale: 0.97 } : {}}
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                >
                  {isSubmitting ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{t.subscribing}</>
                  ) : submitStatus === "success" ? (
                    <><CheckCircle className="w-5 h-5" />Subscribed!</>
                  ) : (
                    <><Bell className="w-5 h-5" />{t.subscribeButton}</>
                  )}
                </motion.button>

                {submitStatus === "success" && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3.5 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">{t.successMessage}</p>
                  </motion.div>
                )}

                {submitStatus === "duplicate" && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
                    <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">{t.duplicateMessage}</p>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{errorMessage}</p>
                  </motion.div>
                )}

                <p className="text-xs text-center text-gray-500">{t.privacyText}</p>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
