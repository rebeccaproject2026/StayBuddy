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

// ── France sections — English ─────────────────────────────────────────────────
const franceSectionsEn = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `Welcome to StayBuddy ("Platform", "we", "us", or "our"). These Terms and Conditions govern your access to and use of our website and services related to listing, renting, buying, and selling paying guest (PG) accommodations and real estate properties in France.

By accessing or using this Platform, you agree to comply with and be legally bound by these Terms. If you do not agree, you must not use our services.`
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: `You must be at least 18 years old and legally capable of entering into binding contracts under French law to use this Platform.`
  },
  {
    id: "services",
    title: "3. Nature of Services",
    content: `StayBuddy provides an online marketplace that allows users to:

• List PG accommodations or real estate properties
• Search for PG rentals or properties for purchase
• Connect with property owners, tenants, and buyers

We act solely as an intermediary and are not a party to any agreement between users unless explicitly stated.`
  },
  {
    id: "accounts",
    title: "4. User Accounts",
    content: `To access certain features, you may need to create an account. You agree to:

• Provide accurate and up-to-date information
• Maintain confidentiality of your login credentials
• Be responsible for all activities under your account

We reserve the right to suspend or terminate accounts in case of misuse or violation of these Terms.`
  },
  {
    id: "listings",
    title: "5. Listings and Content",
    content: `Users who post listings agree that:

• All information provided is accurate, truthful, and not misleading
• Listings comply with applicable French laws and regulations
• They have the legal right to rent, sell, or advertise the property

We reserve the right to remove or modify any listing that violates these Terms.`
  },
  {
    id: "payments",
    title: "6. Pricing and Payments",
    content: `• Any fees for listings or services will be clearly stated on the Platform
• Payments, if applicable, must be made through approved payment methods
• We are not responsible for disputes between users regarding payments, deposits, or transactions`
  },
  {
    id: "user-obligations",
    title: "7. User Responsibilities",
    content: `You agree not to:

• Use the Platform for unlawful purposes
• Post false, misleading, or fraudulent content
• Harass, abuse, or harm other users
• Attempt to bypass Platform safeguards`
  },
  {
    id: "transactions",
    title: "8. Property Transactions",
    content: `PG Rentals
We do not guarantee the condition, legality, or availability of listed accommodations. Users are responsible for:
• Verifying property details
• Reviewing rental agreements
• Complying with French tenancy laws

Property Buying and Selling
For real estate transactions:
• Users must ensure compliance with French property laws
• Notarial procedures are required for property sales in France
• We are not responsible for legal, financial, or contractual outcomes`
  },
  {
    id: "liability",
    title: "9. Liability Limitation",
    content: `To the fullest extent permitted under French law:

• We are not liable for disputes between users
• We do not guarantee accuracy of listings
• We are not responsible for losses arising from use of the Platform`
  },
  {
    id: "ip",
    title: "10. Intellectual Property",
    content: `All content on the Platform (excluding user-generated content) is owned by StayBuddy and protected under intellectual property laws. Unauthorized use is prohibited.`
  },
  {
    id: "privacy",
    title: "11. Data Protection and Privacy",
    content: `We process personal data in accordance with applicable data protection laws, including the General Data Protection Regulation (GDPR). Please refer to our Privacy Policy for details.`
  },
  {
    id: "termination",
    title: "12. Termination",
    content: `We reserve the right to suspend or terminate access to the Platform at any time for violations of these Terms or applicable laws.`
  },
  {
    id: "governing",
    title: "13. Governing Law and Jurisdiction",
    content: `These Terms are governed by the laws of France. Any disputes shall fall under the exclusive jurisdiction of French courts.`
  },
  {
    id: "modifications",
    title: "14. Modifications",
    content: `We may update these Terms at any time. Continued use of the Platform constitutes acceptance of the revised Terms.`
  },
  {
    id: "contact",
    title: "15. Contact Information",
    content: `For any questions regarding these Terms, please contact:

StayBuddy
Email: staybuddy2026@gmail.com
Address: 213 Sanidhya Arcade, Vastral, Ahmedabad, Gujarat 382418`
  },
  {
    id: "disclaimer",
    title: "16. Disclaimer",
    content: `The Platform does not provide legal, financial, or real estate advice. Users are encouraged to consult qualified professionals before entering into agreements.`
  },
];

// ── France sections — French ──────────────────────────────────────────────────
const franceSectionsFr = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `Bienvenue sur StayBuddy (« Plateforme », « nous », « notre »). Les présentes Conditions Générales d'Utilisation régissent votre accès et votre utilisation de notre site web et de nos services liés à la mise en location, la recherche, l'achat et la vente de logements en chambre chez l'habitant (PG) et de biens immobiliers en France.

En accédant à cette Plateforme ou en l'utilisant, vous acceptez d'être lié par ces Conditions. Si vous n'acceptez pas ces Conditions, vous ne devez pas utiliser nos services.`
  },
  {
    id: "eligibility",
    title: "2. Conditions d'éligibilité",
    content: `Vous devez avoir au moins 18 ans et être légalement capable de conclure des contrats contraignants en vertu du droit français pour utiliser cette Plateforme.`
  },
  {
    id: "services",
    title: "3. Nature des services",
    content: `StayBuddy propose une place de marché en ligne permettant aux utilisateurs de :

• Publier des annonces de logements PG ou de biens immobiliers
• Rechercher des locations PG ou des biens à acheter
• Entrer en contact avec des propriétaires, des locataires et des acheteurs

Nous agissons uniquement en tant qu'intermédiaire et ne sommes pas partie à tout accord entre utilisateurs, sauf mention explicite.`
  },
  {
    id: "accounts",
    title: "4. Comptes utilisateurs",
    content: `Pour accéder à certaines fonctionnalités, vous devrez peut-être créer un compte. Vous vous engagez à :

• Fournir des informations exactes et à jour
• Maintenir la confidentialité de vos identifiants de connexion
• Être responsable de toutes les activités effectuées sous votre compte

Nous nous réservons le droit de suspendre ou de résilier les comptes en cas d'utilisation abusive ou de violation des présentes Conditions.`
  },
  {
    id: "listings",
    title: "5. Annonces et contenu",
    content: `Les utilisateurs qui publient des annonces s'engagent à ce que :

• Toutes les informations fournies soient exactes, véridiques et non trompeuses
• Les annonces respectent les lois et réglementations françaises applicables
• Ils disposent du droit légal de louer, vendre ou annoncer le bien

Nous nous réservons le droit de supprimer ou de modifier toute annonce qui enfreint ces Conditions.`
  },
  {
    id: "payments",
    title: "6. Tarification et paiements",
    content: `• Tous les frais liés aux annonces ou aux services seront clairement indiqués sur la Plateforme
• Les paiements, le cas échéant, doivent être effectués via les méthodes de paiement approuvées
• Nous ne sommes pas responsables des litiges entre utilisateurs concernant les paiements, dépôts ou transactions`
  },
  {
    id: "user-obligations",
    title: "7. Responsabilités des utilisateurs",
    content: `Vous vous engagez à ne pas :

• Utiliser la Plateforme à des fins illégales
• Publier du contenu faux, trompeur ou frauduleux
• Harceler, abuser ou nuire à d'autres utilisateurs
• Tenter de contourner les mesures de sécurité de la Plateforme`
  },
  {
    id: "transactions",
    title: "8. Transactions immobilières",
    content: `Locations PG
Nous ne garantissons pas l'état, la légalité ou la disponibilité des logements annoncés. Les utilisateurs sont responsables de :
• Vérifier les détails du bien
• Examiner les contrats de location
• Respecter les lois françaises sur la location

Achat et vente de biens immobiliers
Pour les transactions immobilières :
• Les utilisateurs doivent s'assurer du respect des lois françaises sur la propriété
• Les procédures notariales sont requises pour les ventes immobilières en France
• Nous ne sommes pas responsables des résultats juridiques, financiers ou contractuels`
  },
  {
    id: "liability",
    title: "9. Limitation de responsabilité",
    content: `Dans toute la mesure permise par le droit français :

• Nous ne sommes pas responsables des litiges entre utilisateurs
• Nous ne garantissons pas l'exactitude des annonces
• Nous ne sommes pas responsables des pertes découlant de l'utilisation de la Plateforme`
  },
  {
    id: "ip",
    title: "10. Propriété intellectuelle",
    content: `Tout le contenu de la Plateforme (à l'exclusion du contenu généré par les utilisateurs) est la propriété de StayBuddy et est protégé par les lois sur la propriété intellectuelle. Toute utilisation non autorisée est interdite.`
  },
  {
    id: "privacy",
    title: "11. Protection des données et confidentialité",
    content: `Nous traitons les données personnelles conformément aux lois applicables en matière de protection des données, notamment le Règlement Général sur la Protection des Données (RGPD). Veuillez consulter notre Politique de Confidentialité pour plus de détails.`
  },
  {
    id: "termination",
    title: "12. Résiliation",
    content: `Nous nous réservons le droit de suspendre ou de résilier l'accès à la Plateforme à tout moment en cas de violation des présentes Conditions ou des lois applicables.`
  },
  {
    id: "governing",
    title: "13. Droit applicable et juridiction",
    content: `Les présentes Conditions sont régies par le droit français. Tout litige relèvera de la compétence exclusive des tribunaux français.`
  },
  {
    id: "modifications",
    title: "14. Modifications",
    content: `Nous pouvons mettre à jour ces Conditions à tout moment. La poursuite de l'utilisation de la Plateforme vaut acceptation des Conditions révisées.`
  },
  {
    id: "contact",
    title: "15. Informations de contact",
    content: `Pour toute question concernant ces Conditions, veuillez nous contacter :

StayBuddy
E-mail : staybuddy2026@gmail.com
Adresse : 213 Sanidhya Arcade, Vastral, Ahmedabad, Gujarat 382418`
  },
  {
    id: "disclaimer",
    title: "16. Avertissement",
    content: `La Plateforme ne fournit pas de conseils juridiques, financiers ou immobiliers. Les utilisateurs sont encouragés à consulter des professionnels qualifiés avant de conclure tout accord.`
  },
];

export default function TermsAndConditionsPage() {
  const { language } = useLanguage();
  const params = useParams();
  const country = (params?.country as string) || "in";
  const isFrCountry = country === "fr";
  const isFr = isFrCountry && language === "fr";

  const sections = isFr ? franceSectionsFr : isFrCountry ? franceSectionsEn : indiaSections;

  const heading = isFrCountry
    ? isFr ? "Conditions Générales d'Utilisation" : "Terms & Conditions"
    : "Terms & Conditions";
  const subheading = isFrCountry
    ? isFr ? "Dernière mise à jour : 1er janvier 2026" : "Last Updated: January 1, 2026"
    : "Last Updated: January 1, 2025";
  const tocLabel = isFr ? "Table des matières" : "Table of Contents";
  const backLabel = isFr ? "Retour à l'accueil" : "Back to Home";
  const questionLabel = isFr ? "Des questions ?" : "Have questions?";
  const questionSub = isFr
    ? "Contactez notre équipe pour toute question concernant ces conditions."
    : "Contact our team for any questions regarding these terms.";
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
                ? "Régi par le droit français · Juridiction exclusive des tribunaux français"
                : "Governed by French law · Exclusive jurisdiction of French courts"}
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

        {/* Contact CTA */}
        <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
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
