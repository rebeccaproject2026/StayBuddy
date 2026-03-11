'use client';

import { motion } from 'framer-motion';
import { Search, Home, CheckCircle, Users, Building2, Image as ImageIcon, Calendar, MessageSquare, Shield, Smartphone, TrendingUp, Target } from 'lucide-react';
import Link from "@/components/LocalizedLink";

export default function AboutPage() {
  const tenantFeatures = [
    { icon: Search, text: 'Search PGs and rental properties' },
    { icon: Home, text: 'Detailed property information' },
    { icon: CheckCircle, text: 'Amenities and services overview' },
    { icon: Calendar, text: 'Property availability status' },
    { icon: MessageSquare, text: 'Direct contact with property owners' },
    { icon: Shield, text: 'Save favorite listings' },
  ];

  const ownerFeatures = [
    { icon: Building2, text: 'Add and manage PG or rental listings' },
    { icon: ImageIcon, text: 'Upload property images' },
    { icon: Calendar, text: 'Update room availability' },
    { icon: Users, text: 'Receive inquiries from tenants' },
    { icon: Home, text: 'Manage property information easily' },
  ];

  const advantages = [
    { icon: Smartphone, title: 'Simple and clean platform design', color: 'bg-blue-100 text-blue-600' },
    { icon: Shield, title: 'Verified property listings', color: 'bg-emerald-100 text-emerald-600' },
    { icon: CheckCircle, title: 'Clear property details', color: 'bg-purple-100 text-purple-600' },
    { icon: Calendar, title: 'Room availability indicators', color: 'bg-pink-100 text-pink-600' },
    { icon: TrendingUp, title: 'Modern and responsive interface', color: 'bg-orange-100 text-orange-600' },
    { icon: MessageSquare, title: 'Easy communication between tenants and owners', color: 'bg-indigo-100 text-indigo-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative min-h-[450px] bg-cover bg-center bg-no-repeat px-4"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2096&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70"></div>
        
        <div className="relative max-w-7xl mx-auto py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              Find Your Perfect Stay with StayBuddy
            </h1>
            <p className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto drop-shadow leading-relaxed">
              StayBuddy is a modern rental platform designed to help people easily find PG accommodations and rental homes while giving property owners a simple way to list and manage their properties.
            </p>
            <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto drop-shadow">
              Whether you are a student, working professional, or someone moving to a new city, StayBuddy connects you with comfortable and verified places to stay.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              At StayBuddy, our mission is to simplify the process of finding safe and affordable living spaces. We believe that everyone deserves a comfortable place to stay without unnecessary stress or complicated processes. Our platform focuses on transparency, convenience, and trust so tenants and property owners can connect easily.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What StayBuddy Offers
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* For Tenants */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">For Tenants</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                StayBuddy helps tenants quickly discover suitable living spaces.
              </p>
              <div className="space-y-4">
                {tenantFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-gray-700 font-medium">{feature.text}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-gray-600 mt-6 leading-relaxed">
                Tenants can explore multiple properties and choose the one that best fits their needs and budget.
              </p>
            </motion.div>

            {/* For Property Owners */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-hover rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">For Property Owners</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                StayBuddy gives property owners an easy way to manage and promote their listings.
              </p>
              <div className="space-y-4">
                {ownerFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300"
                    >
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <p className="text-gray-700 font-medium">{feature.text}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-gray-600 mt-6 leading-relaxed">
                This helps owners reach the right tenants quickly.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose StayBuddy */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose StayBuddy
            </h2>
            <p className="text-gray-600 text-lg">
              StayBuddy focuses on creating a reliable and user-friendly rental experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
                >
                  <div className="mb-4">
                    <div className={`w-16 h-16 ${advantage.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {advantage.title}
                  </h3>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Our goal is to make property discovery simple and efficient.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Our Vision
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              StayBuddy aims to become a trusted platform where people can easily find their next place to stay. We continue to improve the platform by introducing better search tools, smarter property management, and new features that make the rental experience smoother for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Find Your Next Stay Today
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Start exploring properties and discover comfortable living spaces with StayBuddy.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/properties">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-primary rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explore Properties
                </motion.button>
              </Link>
              <Link href="/post-property">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-accent text-white rounded-xl font-semibold shadow-lg hover:bg-accent-hover hover:shadow-xl transition-all duration-300"
                >
                  List Your Property
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
