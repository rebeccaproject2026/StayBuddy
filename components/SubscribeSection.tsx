"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, CheckCircle, AlertCircle, Bell, Sparkles } from "lucide-react";

export default function SubscribeSection() {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const content = {
    en: {
      badge: "Stay Informed",
      title: "Never Miss a Vacant Room",
      subtitle: "Get instant email alerts when new rooms matching your preferences become available",
      emailPlaceholder: "Enter your email address",
      subscribeButton: "Subscribe Now",
      subscribing: "Subscribing...",
      successMessage: "Successfully subscribed! Check your email for confirmation.",
      errorMessage: "Something went wrong. Please try again.",
      invalidEmail: "Please enter a valid email address",
      privacyText: "We respect your privacy. Unsubscribe anytime.",
      features: [
        "Instant notifications",
        "No spam guarantee",
        "Free forever"
      ]
    },
    fr: {
      badge: "Restez informé",
      title: "Ne manquez jamais une chambre vacante",
      subtitle: "Recevez des alertes par e-mail instantanées lorsque de nouvelles chambres correspondant à vos préférences deviennent disponibles",
      emailPlaceholder: "Entrez votre adresse e-mail",
      subscribeButton: "S'abonner maintenant",
      subscribing: "Abonnement en cours...",
      successMessage: "Abonnement réussi! Vérifiez votre e-mail pour confirmation.",
      errorMessage: "Une erreur s'est produite. Veuillez réessayer.",
      invalidEmail: "Veuillez entrer une adresse e-mail valide",
      privacyText: "Nous respectons votre vie privée. Désabonnez-vous à tout moment.",
      features: [
        "Notifications instantanées",
        "Garantie sans spam",
        "Gratuit pour toujours"
      ]
    }
  };

  const t = content[language];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setSubmitStatus("error");
      setErrorMessage(t.invalidEmail);
      setTimeout(() => {
        setSubmitStatus("idle");
        setErrorMessage("");
      }, 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would make an actual API call to save the subscription
      // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });

      setSubmitStatus("success");
      setEmail("");

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(t.errorMessage);

      setTimeout(() => {
        setSubmitStatus("idle");
        setErrorMessage("");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative px-4 py-10 overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-5 gap-0">
            {/* Left Side - Info */}
            <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-dark p-6 sm:p-8 md:p-10 text-white flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4 w-fit">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-semibold">{t.badge}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
                {t.title}
              </h2>

              <p className="text-white/90 text-sm sm:text-base mb-6 leading-relaxed">
                {t.subtitle}
              </p>

              {/* Features */}
              <div className="space-y-2.5">
                {t.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm text-white/95">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:col-span-3 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
              <div className="mb-4 flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <Bell className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 ">
                    Subscribe for Updates
                  </h3>
                  <p className="text-sm text-gray-600">
                    Join our community and never miss an opportunity
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    disabled={isSubmitting || submitStatus === "success"}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || submitStatus === "success"}
                  className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t.subscribing}
                    </>
                  ) : submitStatus === "success" ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      <Bell className="w-5 h-5" />
                      {t.subscribeButton}
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <div className="flex items-start gap-2 p-3.5 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">{t.successMessage}</p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="flex items-start gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{errorMessage}</p>
                  </div>
                )}

                <p className="text-xs text-center text-gray-500">
                  {t.privacyText}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
