'use client';

import { motion } from 'framer-motion';
import { Search, Home, CheckCircle, Users, Building2, Image as ImageIcon, Calendar, MessageSquare, Shield, Smartphone, TrendingUp, Target, Heart, Award, Zap, Lock, Clock, Star } from 'lucide-react';
import Link from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

export default function AboutPage() {
  const { language } = useLanguage();

  const tenantItems = [
    { icon: Search, text: language === 'fr' ? 'Recherche avancée avec filtres intelligents' : 'Advanced search with smart filters' },
    { icon: Home, text: language === 'fr' ? 'Informations détaillées et photos' : 'Detailed property information & photos' },
    { icon: CheckCircle, text: language === 'fr' ? 'Aperçu complet des commodités' : 'Complete amenities overview' },
    { icon: Calendar, text: language === 'fr' ? 'Statut de disponibilité en temps réel' : 'Real-time availability status' },
    { icon: MessageSquare, text: language === 'fr' ? 'Communication directe avec propriétaire' : 'Direct owner communication' },
    { icon: Shield, text: language === 'fr' ? 'Enregistrer et comparer les favoris' : 'Save & compare favorites' },
  ];

  const ownerItems = [
    { icon: Building2, text: language === 'fr' ? 'Lister les propriétés PG et locatives' : 'List PG & rental properties' },
    { icon: ImageIcon, text: language === 'fr' ? 'Télécharger des images illimitées' : 'Upload unlimited images' },
    { icon: Calendar, text: language === 'fr' ? 'Mettre à jour la disponibilité instantanément' : 'Update availability instantly' },
    { icon: Users, text: language === 'fr' ? 'Recevoir des demandes vérifiées' : 'Receive verified inquiries' },
    { icon: TrendingUp, text: language === 'fr' ? 'Suivre les performances' : 'Track property performance' },
  ];

  const advantages = [
    { icon: Smartphone, title: language === 'fr' ? 'Design intuitif' : 'Intuitive Design', desc: language === 'fr' ? 'Interface moderne et fluide' : 'Clean, modern interface that works seamlessly', color: 'from-blue-500 to-blue-600' },
    { icon: Shield, title: language === 'fr' ? 'Annonces vérifiées' : 'Verified Listings', desc: language === 'fr' ? 'Toutes les propriétés sont vérifiées' : 'All properties undergo verification', color: 'from-emerald-500 to-emerald-600' },
    { icon: Lock, title: language === 'fr' ? 'Plateforme sécurisée' : 'Secure Platform', desc: language === 'fr' ? 'Vos données sont protégées' : 'Your data is protected with encryption', color: 'from-purple-500 to-purple-600' },
    { icon: Clock, title: language === 'fr' ? 'Réponse rapide' : 'Quick Response', desc: language === 'fr' ? 'Communication rapide entre parties' : 'Fast communication between parties', color: 'from-pink-500 to-pink-600' },
    { icon: Star, title: language === 'fr' ? 'Qualité assurée' : 'Quality Assured', desc: language === 'fr' ? 'Propriétés répondant aux normes' : 'Curated properties meeting standards', color: 'from-orange-500 to-orange-600' },
    { icon: Zap, title: language === 'fr' ? 'Mises à jour instantanées' : 'Instant Updates', desc: language === 'fr' ? 'Disponibilité et notifications en temps réel' : 'Real-time availability and notifications', color: 'from-indigo-500 to-indigo-600' },
  ];

  const values = [
    { icon: Heart, title: language === 'fr' ? "Client d'abord" : 'Customer First', desc: language === 'fr' ? 'Votre satisfaction guide tout ce que nous faisons' : 'Your satisfaction drives everything we do', bg: 'bg-rose-50', iconColor: 'text-rose-500' },
    { icon: Shield, title: language === 'fr' ? 'Confiance et sécurité' : 'Trust & Safety', desc: language === 'fr' ? 'Construire une communauté sécurisée' : 'Building a secure community for all', bg: 'bg-blue-50', iconColor: 'text-blue-500' },
    { icon: Award, title: language === 'fr' ? 'Excellence' : 'Excellence', desc: language === 'fr' ? 'Engagés à la qualité dans chaque détail' : 'Committed to quality in every detail', bg: 'bg-amber-50', iconColor: 'text-amber-500' },
    { icon: Users, title: language === 'fr' ? 'Communauté' : 'Community', desc: language === 'fr' ? 'Connecter les gens avec leurs maisons parfaites' : 'Connecting people with their perfect homes', bg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  ];

  const stats = [
    { value: '10K+', label: language === 'fr' ? 'Locataires satisfaits' : 'Happy Tenants' },
    { value: '5K+', label: language === 'fr' ? 'Propriétés listées' : 'Properties Listed' },
    { value: '50+', label: language === 'fr' ? 'Villes couvertes' : 'Cities Covered' },
    { value: '4.8★', label: language === 'fr' ? 'Note moyenne' : 'Average Rating' },
  ];

  const isFr = language === 'fr';

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ── Hero ── */}
      <div
        className="relative min-h-[520px] sm:min-h-[580px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/aboutbg.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/60 to-primary/40" />
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/aboutbg.png')", zIndex: -1 }}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 flex flex-col items-center text-center gap-5">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {isFr ? 'À propos de StayBuddy' : 'About StayBuddy'}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg max-w-4xl leading-tight"
          >
            {isFr ? 'Trouvez votre séjour parfait avec StayBuddy' : 'Find Your Perfect Stay with StayBuddy'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed"
          >
            {isFr
              ? "Une plateforme de location moderne reliant les gens à des logements PG et des maisons de qualité."
              : "A modern rental platform connecting people with quality PG accommodations and rental homes."}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="text-sm sm:text-base text-white/80 max-w-xl"
          >
            {isFr
              ? "Que vous soyez étudiant, professionnel ou en déménagement, StayBuddy vous connecte avec des lieux confortables et vérifiés."
              : "Whether you're a student, working professional, or moving to a new city, StayBuddy connects you with comfortable and verified places to stay."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.68 }}
            className="flex flex-col sm:flex-row gap-3 mt-2"
          >
            <Link href="/properties">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="px-7 py-3 bg-white text-primary rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                {isFr ? 'Explorer les propriétés' : 'Explore Properties'}
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="px-7 py-3 bg-white/15 backdrop-blur-sm border border-white/30 text-white rounded-xl font-semibold hover:bg-white/25 transition-all duration-300 text-sm sm:text-base"
              >
                {isFr ? 'Contactez-nous' : 'Contact Us'}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <section className="bg-white border-b border-gray-100 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                {...scaleIn(i * 0.1)}
                className="text-center group"
              >
                <motion.p
                  className="text-3xl sm:text-4xl font-bold text-primary"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {s.value}
                </motion.p>
                <p className="text-gray-500 text-sm sm:text-base mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div {...fadeUp(0)}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
                <Target className="w-4 h-4" />
                {isFr ? 'Notre Mission' : 'Our Mission'}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                {isFr ? 'Simplifier la recherche de logement' : 'Simplifying the Search for Home'}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                {isFr
                  ? "Chez StayBuddy, notre mission est de simplifier le processus de recherche d'espaces de vie sûrs et abordables. Nous croyons que chacun mérite un endroit confortable sans stress inutile."
                  : "At StayBuddy, our mission is to simplify the process of finding safe and affordable living spaces. We believe everyone deserves a comfortable place to stay without unnecessary stress or complicated processes."}
              </p>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                {isFr
                  ? "Notre plateforme se concentre sur la transparence, la commodité et la confiance pour que locataires et propriétaires puissent se connecter facilement."
                  : "Our platform focuses on transparency, convenience, and trust so tenants and property owners can connect easily and confidently."}
              </p>
            </motion.div>
            <motion.div {...fadeUp(0.15)} className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="/homebg.jpeg"
                  alt="Mission"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
              </div>
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{isFr ? 'Propriétés vérifiées' : 'Verified Properties'}</p>
                  <p className="text-gray-500 text-xs">{isFr ? 'Chaque annonce est contrôlée' : 'Every listing is checked'}</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {isFr ? 'Ce que StayBuddy offre' : 'What StayBuddy Offers'}
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              {isFr ? 'Des outils puissants pour locataires et propriétaires' : 'Powerful tools for both tenants and property owners'}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Tenants */}
            <motion.div
              {...fadeUp(0.1)}
              className="group bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/30 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{isFr ? 'Pour les locataires' : 'For Tenants'}</h3>
                    <p className="text-gray-500 text-sm">{isFr ? 'Découvrez votre espace idéal' : 'Discover your ideal space'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {tenantItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="flex items-center gap-3 group/item hover:translate-x-1 transition-transform duration-200"
                      >
                        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary/20 transition-colors">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base font-medium">{item.text}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Owners */}
            <motion.div
              {...fadeUp(0.2)}
              className="group bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-accent/30 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/5 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-hover rounded-xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{isFr ? 'Pour les propriétaires' : 'For Property Owners'}</h3>
                    <p className="text-gray-500 text-sm">{isFr ? 'Gérez facilement' : 'Manage with ease'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {ownerItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="flex items-center gap-3 group/item hover:translate-x-1 transition-transform duration-200"
                      >
                        <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:bg-accent/20 transition-colors">
                          <Icon className="w-4 h-4 text-accent" />
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base font-medium">{item.text}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {isFr ? 'Pourquoi choisir StayBuddy' : 'Why Choose StayBuddy'}
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              {isFr ? 'Découvrez la différence avec notre plateforme' : 'Experience the difference with our platform'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {advantages.map((adv, i) => {
              const Icon = adv.icon;
              return (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.07)}
                  className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-400 overflow-hidden cursor-default"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${adv.color} opacity-0 group-hover:opacity-5 transition-opacity duration-400`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${adv.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{adv.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{adv.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {isFr ? 'Nos valeurs fondamentales' : 'Our Core Values'}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  {...scaleIn(i * 0.1)}
                  className={`${v.bg} rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300 cursor-default`}
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                    <Icon className={`w-7 h-7 ${v.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div {...fadeUp(0.1)} className="order-2 lg:order-1 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="/about2.png"
                  alt="Vision"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{isFr ? 'En croissance' : 'Growing Fast'}</p>
                  <p className="text-gray-500 text-xs">{isFr ? 'Nouvelles villes chaque mois' : 'New cities every month'}</p>
                </div>
              </motion.div>
            </motion.div>
            <motion.div {...fadeUp(0)} className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-5">
                <TrendingUp className="w-4 h-4" />
                {isFr ? 'Notre Vision' : 'Our Vision'}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                {isFr ? 'Construire la plateforme de location de demain' : 'Building the Rental Platform of Tomorrow'}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                {isFr
                  ? "StayBuddy vise à devenir la plateforme la plus fiable pour les locations. Nous améliorons continuellement avec de meilleurs outils de recherche et une gestion immobilière plus intelligente."
                  : "StayBuddy aims to become the most trusted platform for rental accommodations. We're continuously improving with better search tools, smarter property management, and innovative features."}
              </p>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                {isFr
                  ? "Notre objectif est de rendre la découverte de propriétés simple et efficace pour tout le monde."
                  : "Our goal is to make property discovery simple and efficient for everyone, everywhere."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-primary to-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div {...fadeUp(0)}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {isFr ? 'Prêt à trouver votre prochain séjour?' : 'Ready to Find Your Next Stay?'}
            </h2>
            <p className="text-white/85 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
              {isFr
                ? "Rejoignez des milliers de locataires et propriétaires satisfaits sur StayBuddy."
                : "Join thousands of happy tenants and property owners on StayBuddy."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/properties">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2, boxShadow: "0 16px 40px rgba(0,0,0,0.25)" }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 380, damping: 20 }}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-primary rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                >
                  {isFr ? 'Explorer les propriétés' : 'Explore Properties'}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
