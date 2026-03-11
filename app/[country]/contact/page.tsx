"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin, Send, User, MessageSquare, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = {
    en: {
      title: "Get In Touch",
      subtitle: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      form: {
        name: "Full Name",
        namePlaceholder: "Enter your name",
        email: "Email Address",
        emailPlaceholder: "your@email.com",
        phone: "Phone Number",
        phonePlaceholder: "+91 99999 99999",
        subject: "Subject",
        subjectPlaceholder: "How can we help you?",
        message: "Message",
        messagePlaceholder: "Tell us more about your inquiry...",
        submit: "Send Message",
        submitting: "Sending..."
      },
      contactInfo: {
        title: "Contact Information",
        subtitle: "Reach out to us through any of these channels",
        email: {
          title: "Email Us",
          value: "support@staybuddy.com",
          description: "We'll respond within 24 hours"
        },
        phone: {
          title: "Call Us",
          value: "+91 99999 99999",
          description: "Mon-Sat, 9AM to 6PM"
        },
        address: {
          title: "Visit Us",
          value: "213 Sanidhya Arcade, Vastral",
          city: "Ahmedabad, Gujarat 382418",
          description: "India"
        }
      },
      success: {
        title: "Message Sent Successfully!",
        message: "Thank you for contacting us. We'll get back to you soon.",
        button: "Send Another Message"
      }
    },
    fr: {
      title: "Contactez-nous",
      subtitle: "Nous aimerions avoir de vos nouvelles. Envoyez-nous un message et nous vous répondrons dès que possible.",
      form: {
        name: "Nom Complet",
        namePlaceholder: "Entrez votre nom",
        email: "Adresse Email",
        emailPlaceholder: "votre@email.com",
        phone: "Numéro de Téléphone",
        phonePlaceholder: "+91 99999 99999",
        subject: "Sujet",
        subjectPlaceholder: "Comment pouvons-nous vous aider?",
        message: "Message",
        messagePlaceholder: "Parlez-nous de votre demande...",
        submit: "Envoyer le Message",
        submitting: "Envoi en cours..."
      },
      contactInfo: {
        title: "Informations de Contact",
        subtitle: "Contactez-nous via l'un de ces canaux",
        email: {
          title: "Envoyez-nous un Email",
          value: "support@staybuddy.com",
          description: "Nous répondrons dans les 24 heures"
        },
        phone: {
          title: "Appelez-nous",
          value: "+91 99999 99999",
          description: "Lun-Sam, 9h à 18h"
        },
        address: {
          title: "Visitez-nous",
          value: "213 Sanidhya Arcade, Vastral",
          city: "Ahmedabad, Gujarat 382418",
          description: "Inde"
        }
      },
      success: {
        title: "Message Envoyé avec Succès!",
        message: "Merci de nous avoir contactés. Nous vous répondrons bientôt.",
        button: "Envoyer un Autre Message"
      }
    }
  };

  const t = content[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-[500px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70"></div>
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {t.title}
            </h1>
            <p className="text-xl text-white/90 drop-shadow">
              {t.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Form Section - Overlapping */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 pb-16">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-2 h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 h-full flex flex-col"
            >
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        {t.form.name} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder={t.form.namePlaceholder}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        {t.form.email} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder={t.form.emailPlaceholder}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        {t.form.phone}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder={t.form.phonePlaceholder}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        {t.form.subject} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          placeholder={t.form.subjectPlaceholder}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {t.form.message} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder={t.form.messagePlaceholder}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t.form.submitting}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t.form.submit}
                      </>
                    )}
                  </motion.button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {t.success.title}
                  </h3>
                  <p className="text-gray-600 mb-8">
                    {t.success.message}
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors"
                  >
                    {t.success.button}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1 h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-2xl p-8 text-white h-full flex flex-col"
            >
              <h3 className="text-2xl font-bold mb-2">{t.contactInfo.title}</h3>
              <p className="text-white/80 mb-8">{t.contactInfo.subtitle}</p>

              <div className="space-y-6 flex-1">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t.contactInfo.email.title}</h4>
                    <a href={`mailto:${t.contactInfo.email.value}`} className="text-white/90 hover:text-white transition-colors">
                      {t.contactInfo.email.value}
                    </a>
                    <p className="text-sm text-white/70 mt-1">{t.contactInfo.email.description}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t.contactInfo.phone.title}</h4>
                    <a href={`tel:${t.contactInfo.phone.value}`} className="text-white/90 hover:text-white transition-colors">
                      {t.contactInfo.phone.value}
                    </a>
                    <p className="text-sm text-white/70 mt-1">{t.contactInfo.phone.description}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t.contactInfo.address.title}</h4>
                    <p className="text-white/90">
                      {t.contactInfo.address.value}<br />
                      {t.contactInfo.address.city}<br />
                      {t.contactInfo.address.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-auto pt-8">
                <div className="h-48 bg-white/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-white/50" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
