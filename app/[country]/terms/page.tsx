"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "@/components/LocalizedLink";
import { ArrowLeft } from "lucide-react";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `These Terms & Conditions ("Terms") govern your use of the StayBuddy website and platform ("Site") and all related services ("Services"). By accessing or using StayBuddy, you agree to be bound by these Terms.

StayBuddy is an online platform that connects tenants looking for PG accommodations and rental properties with property owners and landlords. We act solely as an intermediary and are not a party to any rental agreement between users.

StayBuddy reserves the right to update these Terms at any time. Continued use of the platform after changes are posted constitutes your acceptance of the revised Terms.`
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: `You must be at least 18 years of age to use StayBuddy. By using the platform, you confirm that you are legally competent to enter into a binding agreement.

You agree to provide accurate, complete, and up-to-date information during registration and to keep your account details current at all times.`
  },
  {
    id: "platform-use",
    title: "3. Use of the Platform",
    content: `StayBuddy provides the following services:

• Searching and browsing PG accommodations and rental properties.
• Posting property listings (for landlords and property owners).
• Contacting property owners or tenants directly through the platform.
• Saving favourite properties and managing your account.

You agree to use the platform only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of the platform.`
  },
  {
    id: "listings",
    title: "4. Property Listings",
    content: `Property owners are solely responsible for the accuracy, completeness, and legality of their listings. StayBuddy does not verify every listing and makes no guarantees regarding the accuracy of property descriptions, photos, pricing, or availability.

Tenants are advised to conduct their own due diligence, including physical inspection of the property and direct communication with the owner, before entering into any rental agreement.

StayBuddy reserves the right to remove any listing that violates these Terms or is found to be fraudulent, misleading, or inappropriate.`
  },
  {
    id: "user-obligations",
    title: "5. User Obligations",
    content: `All users agree to:

• Provide accurate and truthful information on the platform.
• Not post false, misleading, or fraudulent listings or inquiries.
• Not use the platform to harass, threaten, or harm other users.
• Not attempt to scrape, copy, or extract data from the platform without written permission.
• Not impersonate any person or misrepresent their identity or affiliation.
• Maintain the confidentiality of their login credentials and notify StayBuddy immediately of any unauthorized account access.

Violation of these obligations may result in suspension or permanent removal of your account.`
  },
  {
    id: "ip",
    title: "6. Intellectual Property",
    content: `All content on the StayBuddy platform — including text, images, logos, design, and software — is the property of StayBuddy or its licensors. You may not reproduce, distribute, or create derivative works from any content on the platform without prior written consent.

By submitting content (such as property photos or descriptions) to the platform, you grant StayBuddy a non-exclusive, royalty-free license to use, display, and distribute that content in connection with the Services.`
  },
  {
    id: "privacy",
    title: "7. Privacy",
    content: `Your use of StayBuddy is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information. By using the platform, you consent to the data practices described in our Privacy Policy.`
  },
  {
    id: "disclaimer",
    title: "8. Disclaimer",
    content: `StayBuddy is a listing and discovery platform. We do not own, manage, or control any of the properties listed on the platform. We are not responsible for the conduct of any user, the accuracy of any listing, or the outcome of any rental transaction.

The platform is provided "as is" without warranties of any kind. StayBuddy does not guarantee uninterrupted, error-free access to the platform.`
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content: `To the fullest extent permitted by law, StayBuddy shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to loss of data, loss of rental opportunity, or disputes between tenants and landlords.

StayBuddy's total liability in any matter shall not exceed the amount, if any, paid by you to StayBuddy in the 12 months preceding the claim.`
  },
  {
    id: "termination",
    title: "10. Account Termination",
    content: `StayBuddy reserves the right to suspend or terminate your account at any time if you violate these Terms, engage in fraudulent activity, or act in a manner harmful to other users or the platform.

You may delete your account at any time by contacting us. Upon termination, your access to the platform will cease, though certain data may be retained as required by law.`
  },
  {
    id: "governing",
    title: "11. Governing Law",
    content: `These Terms are governed by the laws of India. Any disputes arising from your use of StayBuddy shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat, India.

If you are accessing the platform from France or another jurisdiction, local laws may also apply to the extent required.`
  },
  {
    id: "contact",
    title: "12. Contact",
    content: `For any questions or concerns regarding these Terms, please contact us:

StayBuddy Support
Email: staybuddy2026@gmail.com
Address: 213 Sanidhya Arcade, Vastral, Ahmedabad, Gujarat 382418`
  },
];

export default function TermsAndConditionsPage() {
  const { language } = useLanguage();
  const isFr = language === "fr";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {isFr ? "Retour à l'accueil" : "Back to Home"}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {isFr ? "Conditions Générales d'Utilisation" : "Terms & Conditions"}
          </h1>
          <p className="text-white/80 text-sm">
            {isFr ? "Dernière mise à jour : 1er janvier 2025" : "Last Updated: January 1, 2025"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Table of Contents */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            {isFr ? "Table des matières" : "Table of Contents"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-1.5">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-sm text-primary hover:underline py-0.5">
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 scroll-mt-24"
            >
              <h2 className="text-lg font-bold text-primary mb-4 pb-3 border-b border-gray-100">
                {section.title}
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">
            {isFr ? "Des questions ?" : "Have questions?"}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {isFr
              ? "Contactez notre équipe pour toute question concernant ces conditions."
              : "Contact our team for any questions regarding these terms."}
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            {isFr ? "Nous contacter" : "Contact Us"}
          </Link>
        </div>
      </div>
    </div>
  );
}
