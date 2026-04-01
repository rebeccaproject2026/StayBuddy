"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin, Send, User, MessageSquare, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

const wipeIn = (delay = 0) => ({
  initial: { opacity: 0, x: -20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function ContactPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isFr = language === "fr";

  const labels = {
    title: isFr ? "Contactez-nous" : "Get In Touch",
    subtitle: isFr
      ? "Nous aimerions avoir de vos nouvelles. Envoyez-nous un message et nous vous répondrons dès que possible."
      : "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    badge: isFr ? "Support 24/7" : "24/7 Support",
    name: isFr ? "Nom Complet" : "Full Name",
    namePh: isFr ? "Entrez votre nom" : "Enter your name",
    email: isFr ? "Adresse Email" : "Email Address",
    emailPh: isFr ? "votre@email.com" : "your@email.com",
    phone: isFr ? "Téléphone" : "Phone Number",
    phonePh: "+91 99999 99999",
    subject: isFr ? "Sujet" : "Subject",
    subjectPh: isFr ? "Comment pouvons-nous vous aider?" : "How can we help you?",
    message: isFr ? "Message" : "Message",
    messagePh: isFr ? "Parlez-nous de votre demande..." : "Tell us more about your inquiry...",
    submit: isFr ? "Envoyer le Message" : "Send Message",
    submitting: isFr ? "Envoi en cours..." : "Sending...",
    successTitle: isFr ? "Message envoyé!" : "Message Sent!",
    successMsg: isFr ? "Merci de nous avoir contactés. Nous vous répondrons bientôt." : "Thank you for reaching out. We'll get back to you within 24 hours.",
    successBtn: isFr ? "Envoyer un autre message" : "Send Another Message",
    infoTitle: isFr ? "Informations de contact" : "Contact Information",
    infoSub: isFr ? "Contactez-nous via l'un de ces canaux" : "Reach us through any of these channels",
    emailTitle: isFr ? "Envoyez-nous un email" : "Email Us",
    emailDesc: isFr ? "Réponse sous 24h" : "We reply within 24 hours",
    phoneTitle: isFr ? "Appelez-nous" : "Call Us",
    phoneDesc: isFr ? "Lun–Sam, 9h–18h" : "Mon–Sat, 9AM to 6PM",
    addrTitle: isFr ? "Visitez-nous" : "Visit Us",
    addrDesc: isFr ? "Inde" : "India",
    hoursTitle: isFr ? "Heures d'ouverture" : "Business Hours",
    hoursDesc: isFr ? "Lun–Sam: 9h–18h\nDimanche: Fermé" : "Mon–Sat: 9AM – 6PM\nSunday: Closed",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setError(null);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const inputClass = (field: string) =>
    `w-full pl-11 pr-4 py-3 rounded-xl border-2 outline-none transition-all duration-200 bg-gray-50 text-gray-900 placeholder-gray-400 text-sm ${
      focused === field
        ? "border-primary bg-white shadow-sm shadow-primary/10"
        : "border-gray-200 hover:border-gray-300"
    }`;

  const contactCards = [
    {
      icon: Mail,
      title: labels.emailTitle,
      value: "support@staybuddy.com",
      desc: labels.emailDesc,
      href: "mailto:support@staybuddy.com",
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      icon: Phone,
      title: labels.phoneTitle,
      value: "+91 99999 99999",
      desc: labels.phoneDesc,
      href: "tel:+919999999999",
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      icon: MapPin,
      title: labels.addrTitle,
      value: "213 Sanidhya Arcade, Vastral",
      desc: "Ahmedabad, Gujarat 382418",
      href: "https://maps.google.com",
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      icon: Clock,
      title: labels.hoursTitle,
      value: isFr ? "Lun–Sam: 9h–18h" : "Mon–Sat: 9AM – 6PM",
      desc: isFr ? "Dimanche: Fermé" : "Sunday: Closed",
      href: null,
      color: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ── Hero ── */}
      <div
        className="relative min-h-[420px] sm:min-h-[480px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/60 to-primary/40" />
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop')", zIndex: -1 }}
          initial={{ scale: 1.07 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-24 sm:pb-32 flex flex-col items-center text-center gap-4">
          <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {labels.badge}
          </motion.div>
          <motion.h1 {...fadeUp(0.25)} className="text-3xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg max-w-3xl leading-tight">
            {labels.title}
          </motion.h1>
          <motion.p {...fadeUp(0.4)} className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed">
            {labels.subtitle}
          </motion.p>
        </div>
      </div>

      {/* ── Contact Cards ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-14 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map((card, i) => {
            const Icon = card.icon;
            const inner = (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 group cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{card.title}</p>
                <p className="text-gray-900 font-semibold text-sm leading-snug">{card.value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{card.desc}</p>
                {card.href && (
                  <div className="flex items-center gap-1 mt-2 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {isFr ? "Ouvrir" : "Open"} <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </motion.div>
            );
            return card.href ? (
              <a key={i} href={card.href} target="_blank" rel="noopener noreferrer" className="block">{inner}</a>
            ) : (
              <div key={i}>{inner}</div>
            );
          })}
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {/* ── Form ── */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              {/* Form header */}
              <div className="bg-gradient-to-r from-primary to-primary-dark px-6 sm:px-8 py-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {isFr ? "Envoyez-nous un message" : "Send Us a Message"}
                </h2>
                <p className="text-white/75 text-sm mt-1">
                  {isFr ? "Tous les champs marqués * sont obligatoires" : "All fields marked * are required"}
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="grid sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                          <label className="block text-gray-700 font-semibold text-sm mb-1.5">
                            {labels.name} <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                              type="text" required
                              value={formData.name}
                              onChange={e => setFormData({ ...formData, name: e.target.value })}
                              onFocus={() => setFocused("name")}
                              onBlur={() => setFocused(null)}
                              placeholder={labels.namePh}
                              className={inputClass("name")}
                            />
                          </div>
                        </div>
                        {/* Email */}
                        <div>
                          <label className="block text-gray-700 font-semibold text-sm mb-1.5">
                            {labels.email} <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                              type="email" required
                              value={formData.email}
                              onChange={e => setFormData({ ...formData, email: e.target.value })}
                              onFocus={() => setFocused("email")}
                              onBlur={() => setFocused(null)}
                              placeholder={labels.emailPh}
                              className={inputClass("email")}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        {/* Phone */}
                        <div>
                          <label className="block text-gray-700 font-semibold text-sm mb-1.5">
                            {labels.phone} <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                              type="tel" required
                              value={formData.phone}
                              onChange={e => setFormData({ ...formData, phone: e.target.value })}
                              onFocus={() => setFocused("phone")}
                              onBlur={() => setFocused(null)}
                              placeholder={labels.phonePh}
                              className={inputClass("phone")}
                            />
                          </div>
                        </div>
                        {/* Subject */}
                        <div>
                          <label className="block text-gray-700 font-semibold text-sm mb-1.5">
                            {labels.subject} <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                              type="text" required
                              value={formData.subject}
                              onChange={e => setFormData({ ...formData, subject: e.target.value })}
                              onFocus={() => setFocused("subject")}
                              onBlur={() => setFocused(null)}
                              placeholder={labels.subjectPh}
                              className={inputClass("subject")}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-gray-700 font-semibold text-sm mb-1.5">
                          {labels.message} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required rows={5}
                          value={formData.message}
                          onChange={e => setFormData({ ...formData, message: e.target.value })}
                          onFocus={() => setFocused("message")}
                          onBlur={() => setFocused(null)}
                          placeholder={labels.messagePh}
                          className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all duration-200 bg-gray-50 text-gray-900 placeholder-gray-400 text-sm resize-none ${
                            focused === "message"
                              ? "border-primary bg-white shadow-sm shadow-primary/10"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        />
                        <p className="text-right text-xs text-gray-400 mt-1">{formData.message.length}/500</p>
                      </div>

                      {/* Error */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                        >
                          <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">!</span>
                          {error}
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {labels.submitting}
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            {labels.submit}
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="text-center py-10 sm:py-14"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
                      >
                        <CheckCircle className="w-10 h-10 text-green-500" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{labels.successTitle}</h3>
                      <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">{labels.successMsg}</p>
                      <motion.button
                        onClick={handleReset}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-md"
                      >
                        {labels.successBtn}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Info card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 sm:p-7 text-white shadow-xl"
            >
              <h3 className="text-xl font-bold mb-1">{labels.infoTitle}</h3>
              <p className="text-white/70 text-sm mb-6">{labels.infoSub}</p>

              <div className="space-y-5">
                {[
                  { icon: Mail, title: labels.emailTitle, value: "support@staybuddy.com", desc: labels.emailDesc, href: "mailto:support@staybuddy.com" },
                  { icon: Phone, title: labels.phoneTitle, value: "+91 99999 99999", desc: labels.phoneDesc, href: "tel:+919999999999" },
                  { icon: MapPin, title: labels.addrTitle, value: "213 Sanidhya Arcade, Vastral", desc: `Ahmedabad, Gujarat 382418 · ${labels.addrDesc}`, href: null },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={i} {...wipeIn(0.4 + i * 0.1)} className="flex items-start gap-3 group">
                      <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/25 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white/60 text-xs font-medium uppercase tracking-wide">{item.title}</p>
                        {item.href ? (
                          <a href={item.href} className="text-white font-semibold text-sm hover:text-white/80 transition-colors">{item.value}</a>
                        ) : (
                          <p className="text-white font-semibold text-sm">{item.value}</p>
                        )}
                        <p className="text-white/55 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            </motion.div>

            {/* Map embed */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-semibold text-gray-800 text-sm">{isFr ? "Notre emplacement" : "Our Location"}</span>
              </div>
              <div className="relative h-52 sm:h-60 bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.0!2d72.6!3d23.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzAwLjAiTiA3MsKwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%" height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                  title="StayBuddy Location"
                />
              </div>
              <div className="px-5 py-3 bg-gray-50">
                <p className="text-xs text-gray-500">213 Sanidhya Arcade, Vastral, Ahmedabad, Gujarat 382418</p>
              </div>
            </motion.div>

            {/* Quick FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            >
              <h4 className="font-bold text-gray-900 mb-4 text-base">
                {isFr ? "Questions fréquentes" : "Quick Answers"}
              </h4>
              <div className="space-y-3">
                {(isFr ? [
                  { q: "Délai de réponse?", a: "Nous répondons sous 24 heures." },
                  { q: "Support le week-end?", a: "Disponible le samedi, fermé le dimanche." },
                ] : [
                  { q: "How fast do you respond?", a: "We typically reply within 24 hours." },
                  { q: "Is weekend support available?", a: "Available Saturday, closed Sunday." },
                ]).map((faq, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold text-sm">{faq.q}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
