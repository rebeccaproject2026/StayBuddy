"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useParams } from "next/navigation";
import Link from "@/components/LocalizedLink";
import { ArrowLeft } from "lucide-react";

// ── India sections (unchanged) ────────────────────────────────────────────────
const indiaSections = [
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

// ── France sections (RGPD — en français) ─────────────────────────────────────
const franceSections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `La présente Politique de Confidentialité explique comment StayBuddy (« nous », « notre ») collecte, utilise, conserve et protège vos données personnelles lorsque vous utilisez notre site web et nos services liés aux hébergements en chambre chez l'habitant (PG) et, à l'avenir, à l'achat et à la vente de biens immobiliers.

Nous nous engageons à protéger votre vie privée conformément au Règlement Général sur la Protection des Données (RGPD) et aux lois françaises applicables en matière de protection des données.`
  },
  {
    id: "collection",
    title: "2. Données que nous collectons",
    content: `a) Informations que vous nous fournissez
• Nom complet
• Adresse e-mail
• Numéro de téléphone
• Adresse ou informations de localisation
• Pièces d'identité (si nécessaire pour les réservations ou la conformité légale)
• Informations relatives aux biens immobiliers (si vous publiez ou recherchez des annonces)

b) Données collectées automatiquement
• Adresse IP
• Type et version du navigateur
• Informations sur l'appareil
• Pages visitées et durée de visite
• Cookies et données de suivi

c) Données de transaction et de communication
• Détails des réservations ou demandes
• Messages envoyés via la plateforme
• Informations relatives aux paiements (traitées par des prestataires tiers sécurisés)`
  },
  {
    id: "usage",
    title: "3. Utilisation de vos données",
    content: `Nous utilisons vos données personnelles aux fins suivantes :

• Fournir et gérer nos services
• Faciliter les annonces et demandes de logement PG
• Permettre les futurs services d'achat et de vente immobilière
• Communiquer avec vous (assistance, mises à jour, notifications)
• Améliorer les fonctionnalités du site et l'expérience utilisateur
• Respecter nos obligations légales
• Prévenir la fraude et assurer la sécurité de la plateforme`
  },
  {
    id: "legal-basis",
    title: "4. Base juridique du traitement",
    content: `Conformément au RGPD, nous traitons vos données sur les bases suivantes :

• Consentement – lorsque vous acceptez explicitement (ex. : e-mails marketing)
• Nécessité contractuelle – pour fournir les services demandés
• Obligation légale – pour respecter les lois françaises
• Intérêts légitimes – amélioration des services, prévention de la fraude`
  },
  {
    id: "cookies",
    title: "5. Politique en matière de cookies",
    content: `Nous utilisons des cookies et technologies similaires pour :

• Améliorer l'expérience utilisateur
• Analyser le trafic du site
• Mémoriser vos préférences

Vous pouvez gérer ou désactiver les cookies via les paramètres de votre navigateur. Une bannière de cookies vous demandera votre consentement lorsque cela est requis.`
  },
  {
    id: "sharing",
    title: "6. Partage des données",
    content: `Nous ne vendons pas vos données personnelles. Cependant, nous pouvons les partager avec :

• Des prestataires de services (hébergement, traitement des paiements, analyses)
• Les autorités légales lorsque la loi l'exige
• Des partenaires commerciaux (uniquement si nécessaire à la prestation de services)

Tous les tiers sont tenus de respecter les normes du RGPD.`
  },
  {
    id: "transfers",
    title: "7. Transferts internationaux de données",
    content: `Si vos données sont transférées en dehors de l'Espace Économique Européen (EEE), nous veillons à ce que des garanties appropriées soient en place, telles que :

• Les Clauses Contractuelles Types (CCT)
• Les transferts vers des pays bénéficiant d'un niveau de protection adéquat`
  },
  {
    id: "retention",
    title: "8. Conservation des données",
    content: `Nous conservons vos données personnelles uniquement le temps nécessaire :

• Pendant la durée de votre compte
• Conformément aux obligations légales ou réglementaires
• Pour résoudre des litiges et faire respecter nos accords`
  },
  {
    id: "rights",
    title: "9. Vos droits (en vertu du RGPD)",
    content: `Vous disposez des droits suivants :

• Droit d'accès à vos données
• Droit de rectification des données inexactes
• Droit à l'effacement de vos données (« droit à l'oubli »)
• Droit à la limitation du traitement
• Droit à la portabilité des données
• Droit d'opposition au traitement
• Droit de retirer votre consentement à tout moment

Pour exercer vos droits, contactez-nous à : staybuddy2026@gmail.com`
  },
  {
    id: "security",
    title: "10. Sécurité des données",
    content: `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données, notamment :

• Des serveurs sécurisés
• Le chiffrement des données lorsque cela est applicable
• Des mesures de contrôle d'accès

Cependant, aucun système n'est totalement sécurisé et nous ne pouvons garantir une sécurité absolue.`
  },
  {
    id: "thirdparty",
    title: "11. Liens vers des tiers",
    content: `Notre site peut contenir des liens vers des sites tiers. Nous ne sommes pas responsables de leurs pratiques en matière de confidentialité. Nous vous encourageons à lire leurs politiques.`
  },
  {
    id: "children",
    title: "12. Protection des mineurs",
    content: `Nos services ne sont pas destinés aux personnes de moins de 18 ans. Nous ne collectons pas sciemment de données auprès de mineurs.`
  },
  {
    id: "changes",
    title: "13. Modifications de cette politique",
    content: `Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre. Les mises à jour seront publiées sur cette page avec une nouvelle date d'entrée en vigueur.`
  },
  {
    id: "contact",
    title: "14. Informations de contact",
    content: `Pour toute question ou préoccupation concernant cette Politique de Confidentialité ou vos données, contactez-nous :

StayBuddy
E-mail : staybuddy2026@gmail.com
Adresse : 213 Sanidhya Arcade, Vastral, Ahmedabad, Gujarat 382418`
  },
  {
    id: "supervisory",
    title: "15. Autorité de contrôle (France)",
    content: `Si vous estimez que vos droits en matière de protection des données ont été violés, vous pouvez contacter l'autorité française de protection des données :

CNIL (Commission Nationale de l'Informatique et des Libertés)
Site web : https://www.cnil.fr`
  },
];

// ── France sections (GDPR — English) ─────────────────────────────────────────
const franceSectionsEn = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `This Privacy Policy explains how StayBuddy ("we", "us", "our") collects, uses, stores, and protects your personal data when you use our website and services related to PG (paying guest) accommodations and, in the future, property buying and selling.

We are committed to protecting your privacy in accordance with the General Data Protection Regulation (GDPR) and applicable French data protection laws.`
  },
  {
    id: "collection",
    title: "2. Data We Collect",
    content: `a) Information You Provide
• Full name
• Email address
• Phone number
• Address or location details
• Identification details (if required for bookings or legal compliance)
• Property-related information (if you list or search properties)

b) Automatically Collected Data
• IP address
• Browser type and version
• Device information
• Pages visited and time spent
• Cookies and tracking data

c) Transaction & Communication Data
• Booking or inquiry details
• Messages sent through the platform
• Payment-related information (processed via secure third-party providers)`
  },
  {
    id: "usage",
    title: "3. How We Use Your Data",
    content: `We use your personal data for the following purposes:

• To provide and manage our services
• To facilitate PG accommodation listings and inquiries
• To enable future property buying and selling services
• To communicate with you (support, updates, notifications)
• To improve website functionality and user experience
• To comply with legal obligations
• To prevent fraud and ensure platform security`
  },
  {
    id: "legal-basis",
    title: "4. Legal Basis for Processing",
    content: `Under GDPR, we process your data based on:

• Consent – when you explicitly agree (e.g., marketing emails)
• Contractual necessity – to provide requested services
• Legal obligation – to comply with French laws
• Legitimate interests – improving services, preventing fraud`
  },
  {
    id: "cookies",
    title: "5. Cookies Policy",
    content: `We use cookies and similar technologies to:

• Enhance user experience
• Analyze website traffic
• Remember user preferences

You can manage or disable cookies through your browser settings. A cookie banner will request your consent where required.`
  },
  {
    id: "sharing",
    title: "6. Data Sharing",
    content: `We do not sell your personal data. However, we may share it with:

• Service providers (hosting, payment processing, analytics)
• Legal authorities when required by law
• Business partners (only where necessary for service delivery)

All third parties are required to comply with GDPR standards.`
  },
  {
    id: "transfers",
    title: "7. International Data Transfers",
    content: `If your data is transferred outside the European Economic Area (EEA), we ensure appropriate safeguards are in place, such as:

• Standard Contractual Clauses (SCCs)
• Transfers to countries with adequate protection levels`
  },
  {
    id: "retention",
    title: "8. Data Retention",
    content: `We retain your personal data only as long as necessary:

• For the duration of your account
• As required for legal or regulatory obligations
• To resolve disputes and enforce agreements`
  },
  {
    id: "rights",
    title: "9. Your Rights (Under GDPR)",
    content: `You have the following rights:

• Right to access your data
• Right to correct inaccurate data
• Right to erase your data ("right to be forgotten")
• Right to restrict processing
• Right to data portability
• Right to object to processing
• Right to withdraw consent at any time

To exercise your rights, contact us at: staybuddy2026@gmail.com`
  },
  {
    id: "security",
    title: "10. Data Security",
    content: `We implement appropriate technical and organizational measures to protect your data, including:

• Secure servers
• Encryption where applicable
• Access control measures

However, no system is completely secure, and we cannot guarantee absolute security.`
  },
  {
    id: "thirdparty",
    title: "11. Third-Party Links",
    content: `Our website may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to read their policies.`
  },
  {
    id: "children",
    title: "12. Children's Privacy",
    content: `Our services are not intended for individuals under 18. We do not knowingly collect data from minors.`
  },
  {
    id: "changes",
    title: "13. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised effective date.`
  },
  {
    id: "contact",
    title: "14. Contact Information",
    content: `If you have any questions or concerns about this Privacy Policy or your data, contact us:

StayBuddy
Email: staybuddy2026@gmail.com
Address: 213 Sanidhya Arcade, Vastral, Ahmedabad, Gujarat 382418`
  },
  {
    id: "supervisory",
    title: "15. Supervisory Authority (France)",
    content: `If you believe your data protection rights have been violated, you may contact the French data protection authority:

CNIL (Commission Nationale de l'Informatique et des Libertés)
Website: https://www.cnil.fr`
  },
];

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const params = useParams();
  const country = (params?.country as string) || "in";
  const isFrCountry = country === "fr";
  // Show French content only when on /fr route AND language is set to French
  const isFr = isFrCountry && language === "fr";

  const sections = isFr ? franceSections : isFrCountry ? franceSectionsEn : indiaSections;

  const heading = isFrCountry
    ? isFr ? "Politique de Confidentialité" : "Privacy Policy"
    : "Privacy Policy";
  const subheading = isFrCountry
    ? isFr
      ? "Date d'entrée en vigueur : 1er janvier 2026 · staybuddy2026@gmail.com"
      : "Effective Date: January 1, 2026 · staybuddy2026@gmail.com"
    : "Last Updated: January 1, 2025";
  const tocLabel = isFr ? "Table des matières" : "Table of Contents";
  const backLabel = isFr ? "Retour à l'accueil" : "Back to Home";
  const questionLabel = isFr ? "Des questions sur votre vie privée ?" : "Questions about your privacy?";
  const questionSub = isFr
    ? "Contactez notre équipe pour toute question concernant cette politique."
    : "Contact our team for any questions regarding this policy.";
  const contactLabel = isFr ? "Nous contacter" : "Contact Us";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{heading}</h1>
          <p className="text-white/80 text-sm">{subheading}</p>
          {isFrCountry && (
            <p className="text-white/70 text-xs mt-1">
              {isFr
                ? "Conforme au RGPD (Règlement Général sur la Protection des Données)"
                : "Compliant with GDPR (General Data Protection Regulation)"}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Table of Contents */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-base font-bold text-gray-800 mb-4">{tocLabel}</h2>
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

        {/* CNIL callout — France only */}
        {isFrCountry && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-bold text-blue-900 mb-1">
              {isFr ? "Autorité de contrôle" : "Supervisory Authority"}
            </h3>
            <p className="text-sm text-blue-800">
              {isFr ? (
                <>
                  Pour toute réclamation relative à la protection de vos données, vous pouvez contacter la{" "}
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
                    CNIL (Commission Nationale de l'Informatique et des Libertés)
                  </a>.
                </>
              ) : (
                <>
                  For any complaint regarding data protection, you may contact the{" "}
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
                    CNIL (Commission Nationale de l'Informatique et des Libertés)
                  </a>.
                </>
              )}
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-6 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">{questionLabel}</h3>
          <p className="text-sm text-gray-600 mb-3">{questionSub}</p>
          <Link
            href="/contact"
            className="inline-block px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            {contactLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
