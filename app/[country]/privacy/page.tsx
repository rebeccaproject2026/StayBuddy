"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "@/components/LocalizedLink";
import { ArrowLeft } from "lucide-react";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `This Privacy Policy explains how StayBuddy ("StayBuddy / We / Us") collects, uses, and protects your personal information when you use our website and platform ("Site") and related services ("Services").

By using StayBuddy, you consent to the data practices described in this Policy. We are committed to protecting your privacy and handling your information responsibly.

This Policy may be updated from time to time. We will notify you of significant changes by posting the updated Policy on the Site. Continued use of the platform after changes are posted constitutes your acceptance.`
  },
  {
    id: "collection",
    title: "2. Information We Collect",
    content: `We collect the following types of information:

Account Information
When you register, we collect your name, email address, phone number, and any other details you provide during sign-up.

Property Listings
If you are a landlord or property owner, we collect property details including address, photos, pricing, and availability that you submit to the platform.

Usage Data
We automatically collect information about how you use the platform, including pages visited, search queries, and interactions with listings. This helps us improve the platform experience.

Device & Technical Data
We may collect your IP address, browser type, device type, and operating system to ensure the platform functions correctly and securely.

Communications
If you contact us or use our messaging features to communicate with property owners or tenants, we may store those communications to provide the service and resolve disputes.`
  },
  {
    id: "usage",
    title: "3. How We Use Your Information",
    content: `We use your information to:

• Create and manage your account.
• Display property listings and connect tenants with landlords.
• Send you notifications about inquiries, messages, and account activity.
• Improve and personalise your experience on the platform.
• Respond to your support requests and resolve disputes.
• Send service-related communications (e.g., account verification, password reset).
• Comply with legal obligations.

We do not sell your personal information to third parties.`
  },
  {
    id: "sharing",
    title: "4. Information Sharing",
    content: `We share your information only in the following circumstances:

Between Users
When a tenant contacts a landlord (or vice versa), relevant contact and listing information is shared to facilitate the connection.

Service Providers
We may share data with trusted third-party service providers (e.g., email delivery, cloud hosting, analytics) who assist us in operating the platform. These providers are bound by confidentiality obligations.

Legal Requirements
We may disclose your information if required by law, court order, or to protect the rights and safety of StayBuddy, its users, or the public.

We do not share your personal information with advertisers or unrelated third parties without your consent.`
  },
  {
    id: "security",
    title: "5. Data Security",
    content: `We take reasonable technical and organisational measures to protect your personal information from unauthorised access, loss, or misuse. These include secure servers, encrypted connections (HTTPS), and access controls.

However, no system is completely secure. We cannot guarantee absolute security of data transmitted over the internet. You are responsible for keeping your account credentials confidential.

If you suspect any unauthorised access to your account, please contact us immediately at staybuddy2026@gmail.com.`
  },
  {
    id: "cookies",
    title: "6. Cookies",
    content: `We use cookies and similar technologies to improve your experience on the platform. Cookies help us remember your preferences, keep you logged in, and understand how users interact with the Site.

You can control cookie settings through your browser. Disabling cookies may affect some features of the platform.`
  },
  {
    id: "retention",
    title: "7. Data Retention",
    content: `We retain your personal information for as long as your account is active or as needed to provide the Services. If you delete your account, we will remove your personal data within a reasonable period, except where retention is required by law or for legitimate business purposes (e.g., resolving disputes, preventing fraud).`
  },
  {
    id: "rights",
    title: "8. Your Rights",
    content: `You have the right to:

• Access the personal information we hold about you.
• Request correction of inaccurate or incomplete data.
• Request deletion of your account and associated data.
• Opt out of non-essential communications at any time.

To exercise any of these rights, please contact us at staybuddy2026@gmail.com. We will respond within a reasonable timeframe.`
  },
  {
    id: "thirdparty",
    title: "9. Third-Party Links",
    content: `The platform may contain links to third-party websites (e.g., Google Maps). These sites have their own privacy policies, and we are not responsible for their practices. We encourage you to review the privacy policies of any third-party sites you visit.`
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:

StayBuddy Support
Email: staybuddy2026@gmail.com
Address: 213 Sanidhya Arcade, Vastral, Ahmedabad, Gujarat 382418`
  },
];

export default function PrivacyPolicyPage() {
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
            {isFr ? "Politique de Confidentialité" : "Privacy Policy"}
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
            {isFr ? "Des questions sur votre vie privée ?" : "Questions about your privacy?"}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {isFr
              ? "Contactez notre équipe pour toute question concernant cette politique."
              : "Contact our team for any questions regarding this policy."}
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
