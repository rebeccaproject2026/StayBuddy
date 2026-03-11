"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "@/components/LocalizedLink";
import { ArrowLeft, FileText, Shield, Users, Home, CreditCard, AlertCircle, Scale, Mail, Phone, MapPin } from "lucide-react";

export default function TermsAndConditionsPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Terms and Conditions",
      effectiveDate: "Effective Date: January 1, 2024",
      lastUpdated: "Last Updated: January 1, 2024",
      backToHome: "Back to Home",
      sections: [
        {
          id: "introduction",
          icon: FileText,
          title: "1. Introduction",
          content: [
            "Welcome to StayBuddy. These Terms and Conditions govern your use of our website and services related to PG (Paying Guest) accommodations and tenant rental listings.",
            "By accessing or using our website, you agree to comply with and be bound by these Terms. If you do not agree with any part of these Terms, please do not use our platform."
          ]
        },
        {
          id: "definitions",
          icon: Users,
          title: "2. Definitions",
          content: [
            '"Platform" refers to StayBuddy and all its associated services, websites, and applications.',
            '"User" refers to any visitor, tenant, landlord, or PG owner using the platform.',
            '"Tenant" refers to a person seeking or renting a PG or rental property.',
            '"Owner/Landlord" refers to the person or entity listing PG or rental property on our platform.',
            '"Services" refers to all features, tools, and functionalities provided by StayBuddy.'
          ]
        },
        {
          id: "eligibility",
          icon: Shield,
          title: "3. Eligibility",
          content: [
            "Users must be at least 18 years of age to use our platform.",
            "Users must provide accurate, current, and complete registration information.",
            "The platform reserves the right to suspend or terminate accounts that provide false, misleading, or incomplete information.",
            "Users must have the legal capacity to enter into binding contracts in their jurisdiction."
          ]
        },
        {
          id: "account",
          icon: Users,
          title: "4. Account Registration",
          content: [
            "Users are solely responsible for maintaining the confidentiality of their account credentials.",
            "You are responsible for all activities that occur under your account.",
            "You must notify us immediately of any unauthorized use of your account or any other breach of security.",
            "We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.",
            "You may not use another user's account without permission."
          ]
        },
        {
          id: "listings",
          icon: Home,
          title: "5. Property Listings",
          content: [
            "Property owners are responsible for providing accurate, complete, and up-to-date details including rent, amenities, house rules, and availability.",
            "All property listings must comply with local laws and regulations.",
            "The platform does not guarantee the availability, pricing accuracy, condition, or quality of any listed property.",
            "We reserve the right to remove, modify, or reject any listing that is misleading, inappropriate, illegal, or violates our policies.",
            "Owners must have the legal right to list and rent the property.",
            "Photos and descriptions must accurately represent the property."
          ]
        },
        {
          id: "payments",
          icon: CreditCard,
          title: "6. Booking and Payments",
          content: [
            "Rent payments and security deposits may be processed through third-party payment gateways.",
            "The platform is not responsible for payment gateway failures, delays, or technical issues.",
            "Security deposits, refunds, and cancellations are subject to the individual owner's policy.",
            "Users must carefully review the cancellation and refund policies before making a booking.",
            "All payment transactions are subject to applicable taxes and fees.",
            "StayBuddy may charge service fees for using the platform, which will be clearly disclosed before booking."
          ]
        },
        {
          id: "responsibilities",
          icon: AlertCircle,
          title: "7. User Responsibilities",
          content: [
            "Users agree not to post false, misleading, or fraudulent information.",
            "Users agree not to engage in any fraudulent activities or misuse the platform.",
            "Users agree not to use the platform for any illegal purposes or activities.",
            "Users must follow all PG rules, property regulations, and local rental laws.",
            "Users must respect the rights and property of others.",
            "Users must not harass, abuse, or harm other users.",
            "Users must not attempt to circumvent platform fees by conducting transactions outside the platform."
          ]
        },
        {
          id: "cancellation",
          icon: FileText,
          title: "8. Cancellation & Refund Policy",
          content: [
            "Cancellation policies may vary by property owner and will be clearly stated in each listing.",
            "Refunds, if applicable, will be processed within 7-14 business days of cancellation approval.",
            "Platform service fees may be non-refundable depending on the timing of cancellation.",
            "Tenants must provide proper notice as per the property's cancellation policy.",
            "Owners reserve the right to cancel bookings in case of property unavailability or other valid reasons.",
            "In case of disputes, StayBuddy may mediate but is not obligated to provide refunds."
          ]
        },
        {
          id: "liability",
          icon: Shield,
          title: "9. Limitation of Liability",
          content: [
            "StayBuddy acts solely as an intermediary platform connecting tenants and property owners.",
            "We are not responsible for disputes, disagreements, or conflicts between tenants and owners.",
            "We are not liable for property damages, theft, personal injury, or any losses incurred during a rental period.",
            "We do not guarantee the accuracy, reliability, or quality of any listings or user-generated content.",
            "Users use the platform at their own risk.",
            "Our total liability shall not exceed the amount of service fees paid by the user in the past 12 months.",
            "We are not responsible for any indirect, incidental, special, or consequential damages."
          ]
        },
        {
          id: "termination",
          icon: AlertCircle,
          title: "10. Termination",
          content: [
            "We reserve the right to suspend or terminate user accounts that violate our policies or Terms.",
            "We may remove content that breaches these Terms without prior notice.",
            "Users may terminate their accounts at any time by contacting our support team.",
            "Upon termination, users lose access to all platform features and services.",
            "Termination does not affect any outstanding obligations or liabilities."
          ]
        },
        {
          id: "intellectual",
          icon: FileText,
          title: "11. Intellectual Property",
          content: [
            "All content, logos, branding, design elements, and software on StayBuddy are the intellectual property of StayBuddy or its licensors.",
            "Users may not copy, reproduce, distribute, or create derivative works without explicit written permission.",
            "User-generated content remains the property of the user, but users grant StayBuddy a license to use, display, and distribute such content.",
            "Any unauthorized use of our intellectual property may result in legal action."
          ]
        },
        {
          id: "privacy",
          icon: Shield,
          title: "12. Privacy and Data Protection",
          content: [
            "Your use of the platform is also governed by our Privacy Policy.",
            "We collect, use, and protect your personal information in accordance with applicable data protection laws.",
            "Users are responsible for maintaining the confidentiality of their personal information.",
            "We may share information with third parties as described in our Privacy Policy."
          ]
        },
        {
          id: "governing",
          icon: Scale,
          title: "13. Governing Law and Jurisdiction",
          content: [
            "These Terms shall be governed by and construed in accordance with the laws of India.",
            "Any disputes arising from these Terms or use of the platform shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat, India.",
            "Users agree to submit to the personal jurisdiction of these courts."
          ]
        },
        {
          id: "changes",
          icon: FileText,
          title: "14. Changes to Terms",
          content: [
            "We reserve the right to modify, update, or change these Terms at any time.",
            "Changes will be effective immediately upon posting on the platform.",
            "Continued use of the platform after changes constitutes acceptance of the updated Terms.",
            "We encourage users to review these Terms periodically.",
            "Material changes will be communicated via email or platform notifications."
          ]
        },
        {
          id: "miscellaneous",
          icon: FileText,
          title: "15. Miscellaneous",
          content: [
            "If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.",
            "Our failure to enforce any right or provision shall not constitute a waiver of such right or provision.",
            "These Terms constitute the entire agreement between you and StayBuddy regarding the use of the platform.",
            "Users may not assign or transfer their rights under these Terms without our written consent."
          ]
        }
      ],
      contact: {
        title: "16. Contact Information",
        subtitle: "For any questions, concerns, or inquiries regarding these Terms and Conditions, please contact us:",
        email: "Email",
        emailValue: "support@staybuddy.com",
        phone: "Phone",
        phoneValue: "+91 99999 99999",
        address: "Address",
        addressValue: "213 Sanidhya Arcade, Vastral, Ahmedabad, Gujarat 382418, India"
      },
      acknowledgment: {
        title: "Acknowledgment",
        content: "By using StayBuddy, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions."
      }
    },
    fr: {
      title: "Termes et Conditions",
      effectiveDate: "Date d'entrée en vigueur: 1er janvier 2024",
      lastUpdated: "Dernière mise à jour: 1er janvier 2024",
      backToHome: "Retour à l'accueil",
      sections: [
        {
          id: "introduction",
          icon: FileText,
          title: "1. Introduction",
          content: [
            "Bienvenue sur StayBuddy. Ces Termes et Conditions régissent votre utilisation de notre site Web et de nos services liés aux hébergements PG (Paying Guest) et aux annonces de location pour locataires.",
            "En accédant ou en utilisant notre site Web, vous acceptez de vous conformer à ces Termes. Si vous n'êtes pas d'accord avec une partie de ces Termes, veuillez ne pas utiliser notre plateforme."
          ]
        },
        {
          id: "definitions",
          icon: Users,
          title: "2. Définitions",
          content: [
            '"Plateforme" fait référence à StayBuddy et tous ses services, sites Web et applications associés.',
            '"Utilisateur" fait référence à tout visiteur, locataire, propriétaire ou propriétaire de PG utilisant la plateforme.',
            '"Locataire" fait référence à une personne recherchant ou louant un PG ou une propriété locative.',
            '"Propriétaire/Bailleur" fait référence à la personne ou à l\'entité qui inscrit un PG ou une propriété locative sur notre plateforme.',
            '"Services" fait référence à toutes les fonctionnalités, outils et fonctionnalités fournis par StayBuddy.'
          ]
        },
        {
          id: "eligibility",
          icon: Shield,
          title: "3. Éligibilité",
          content: [
            "Les utilisateurs doivent avoir au moins 18 ans pour utiliser notre plateforme.",
            "Les utilisateurs doivent fournir des informations d'inscription exactes, actuelles et complètes.",
            "La plateforme se réserve le droit de suspendre ou de résilier les comptes qui fournissent des informations fausses, trompeuses ou incomplètes.",
            "Les utilisateurs doivent avoir la capacité juridique de conclure des contrats contraignants dans leur juridiction."
          ]
        },
        {
          id: "account",
          icon: Users,
          title: "4. Inscription au compte",
          content: [
            "Les utilisateurs sont seuls responsables du maintien de la confidentialité de leurs identifiants de compte.",
            "Vous êtes responsable de toutes les activités qui se produisent sous votre compte.",
            "Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte ou de toute autre violation de la sécurité.",
            "Nous nous réservons le droit de refuser le service, de résilier des comptes ou de supprimer du contenu à notre seule discrétion.",
            "Vous ne pouvez pas utiliser le compte d'un autre utilisateur sans autorisation."
          ]
        },
        {
          id: "listings",
          icon: Home,
          title: "5. Annonces de propriétés",
          content: [
            "Les propriétaires sont responsables de fournir des détails précis, complets et à jour, y compris le loyer, les commodités, les règles de la maison et la disponibilité.",
            "Toutes les annonces de propriétés doivent être conformes aux lois et réglementations locales.",
            "La plateforme ne garantit pas la disponibilité, l'exactitude des prix, l'état ou la qualité de toute propriété répertoriée.",
            "Nous nous réservons le droit de supprimer, modifier ou rejeter toute annonce trompeuse, inappropriée, illégale ou violant nos politiques.",
            "Les propriétaires doivent avoir le droit légal de répertorier et de louer la propriété.",
            "Les photos et descriptions doivent représenter fidèlement la propriété."
          ]
        },
        {
          id: "payments",
          icon: CreditCard,
          title: "6. Réservation et paiements",
          content: [
            "Les paiements de loyer et les dépôts de garantie peuvent être traités via des passerelles de paiement tierces.",
            "La plateforme n'est pas responsable des défaillances, retards ou problèmes techniques des passerelles de paiement.",
            "Les dépôts de garantie, les remboursements et les annulations sont soumis à la politique du propriétaire individuel.",
            "Les utilisateurs doivent examiner attentivement les politiques d'annulation et de remboursement avant de faire une réservation.",
            "Toutes les transactions de paiement sont soumises aux taxes et frais applicables.",
            "StayBuddy peut facturer des frais de service pour l'utilisation de la plateforme, qui seront clairement divulgués avant la réservation."
          ]
        },
        {
          id: "responsibilities",
          icon: AlertCircle,
          title: "7. Responsabilités des utilisateurs",
          content: [
            "Les utilisateurs acceptent de ne pas publier d'informations fausses, trompeuses ou frauduleuses.",
            "Les utilisateurs acceptent de ne pas se livrer à des activités frauduleuses ou d'abuser de la plateforme.",
            "Les utilisateurs acceptent de ne pas utiliser la plateforme à des fins ou activités illégales.",
            "Les utilisateurs doivent suivre toutes les règles PG, les réglementations de propriété et les lois locales sur la location.",
            "Les utilisateurs doivent respecter les droits et la propriété des autres.",
            "Les utilisateurs ne doivent pas harceler, abuser ou nuire à d'autres utilisateurs.",
            "Les utilisateurs ne doivent pas tenter de contourner les frais de plateforme en effectuant des transactions en dehors de la plateforme."
          ]
        },
        {
          id: "cancellation",
          icon: FileText,
          title: "8. Politique d'annulation et de remboursement",
          content: [
            "Les politiques d'annulation peuvent varier selon le propriétaire et seront clairement indiquées dans chaque annonce.",
            "Les remboursements, le cas échéant, seront traités dans les 7 à 14 jours ouvrables suivant l'approbation de l'annulation.",
            "Les frais de service de la plateforme peuvent être non remboursables selon le moment de l'annulation.",
            "Les locataires doivent fournir un préavis approprié conformément à la politique d'annulation de la propriété.",
            "Les propriétaires se réservent le droit d'annuler les réservations en cas d'indisponibilité de la propriété ou pour d'autres raisons valables.",
            "En cas de litige, StayBuddy peut servir de médiateur mais n'est pas obligé de fournir des remboursements."
          ]
        },
        {
          id: "liability",
          icon: Shield,
          title: "9. Limitation de responsabilité",
          content: [
            "StayBuddy agit uniquement en tant que plateforme intermédiaire reliant les locataires et les propriétaires.",
            "Nous ne sommes pas responsables des litiges, désaccords ou conflits entre locataires et propriétaires.",
            "Nous ne sommes pas responsables des dommages matériels, du vol, des blessures corporelles ou de toute perte subie pendant une période de location.",
            "Nous ne garantissons pas l'exactitude, la fiabilité ou la qualité des annonces ou du contenu généré par les utilisateurs.",
            "Les utilisateurs utilisent la plateforme à leurs propres risques.",
            "Notre responsabilité totale ne doit pas dépasser le montant des frais de service payés par l'utilisateur au cours des 12 derniers mois.",
            "Nous ne sommes pas responsables des dommages indirects, accessoires, spéciaux ou consécutifs."
          ]
        },
        {
          id: "termination",
          icon: AlertCircle,
          title: "10. Résiliation",
          content: [
            "Nous nous réservons le droit de suspendre ou de résilier les comptes d'utilisateurs qui violent nos politiques ou Termes.",
            "Nous pouvons supprimer le contenu qui enfreint ces Termes sans préavis.",
            "Les utilisateurs peuvent résilier leurs comptes à tout moment en contactant notre équipe d'assistance.",
            "Lors de la résiliation, les utilisateurs perdent l'accès à toutes les fonctionnalités et services de la plateforme.",
            "La résiliation n'affecte pas les obligations ou responsabilités en cours."
          ]
        },
        {
          id: "intellectual",
          icon: FileText,
          title: "11. Propriété intellectuelle",
          content: [
            "Tout le contenu, les logos, l'image de marque, les éléments de conception et les logiciels sur StayBuddy sont la propriété intellectuelle de StayBuddy ou de ses concédants de licence.",
            "Les utilisateurs ne peuvent pas copier, reproduire, distribuer ou créer des œuvres dérivées sans autorisation écrite explicite.",
            "Le contenu généré par les utilisateurs reste la propriété de l'utilisateur, mais les utilisateurs accordent à StayBuddy une licence pour utiliser, afficher et distribuer ce contenu.",
            "Toute utilisation non autorisée de notre propriété intellectuelle peut entraîner des poursuites judiciaires."
          ]
        },
        {
          id: "privacy",
          icon: Shield,
          title: "12. Confidentialité et protection des données",
          content: [
            "Votre utilisation de la plateforme est également régie par notre Politique de confidentialité.",
            "Nous collectons, utilisons et protégeons vos informations personnelles conformément aux lois applicables sur la protection des données.",
            "Les utilisateurs sont responsables du maintien de la confidentialité de leurs informations personnelles.",
            "Nous pouvons partager des informations avec des tiers comme décrit dans notre Politique de confidentialité."
          ]
        },
        {
          id: "governing",
          icon: Scale,
          title: "13. Loi applicable et juridiction",
          content: [
            "Ces Termes sont régis et interprétés conformément aux lois de l'Inde.",
            "Tout litige découlant de ces Termes ou de l'utilisation de la plateforme sera soumis à la juridiction exclusive des tribunaux d'Ahmedabad, Gujarat, Inde.",
            "Les utilisateurs acceptent de se soumettre à la juridiction personnelle de ces tribunaux."
          ]
        },
        {
          id: "changes",
          icon: FileText,
          title: "14. Modifications des Termes",
          content: [
            "Nous nous réservons le droit de modifier, mettre à jour ou modifier ces Termes à tout moment.",
            "Les modifications prendront effet immédiatement après leur publication sur la plateforme.",
            "L'utilisation continue de la plateforme après les modifications constitue l'acceptation des Termes mis à jour.",
            "Nous encourageons les utilisateurs à consulter périodiquement ces Termes.",
            "Les modifications importantes seront communiquées par e-mail ou notifications de plateforme."
          ]
        },
        {
          id: "miscellaneous",
          icon: FileText,
          title: "15. Divers",
          content: [
            "Si une disposition de ces Termes est jugée invalide ou inapplicable, les dispositions restantes resteront pleinement en vigueur.",
            "Notre incapacité à faire respecter un droit ou une disposition ne constitue pas une renonciation à ce droit ou à cette disposition.",
            "Ces Termes constituent l'accord complet entre vous et StayBuddy concernant l'utilisation de la plateforme.",
            "Les utilisateurs ne peuvent pas céder ou transférer leurs droits en vertu de ces Termes sans notre consentement écrit."
          ]
        }
      ],
      contact: {
        title: "16. Informations de contact",
        subtitle: "Pour toute question, préoccupation ou demande concernant ces Termes et Conditions, veuillez nous contacter:",
        email: "Email",
        emailValue: "support@staybuddy.com",
        phone: "Téléphone",
        phoneValue: "+91 99999 99999",
        address: "Adresse",
        addressValue: "213 Sanidhya Arcade, Vastral, Ahmedabad, Gujarat 382418, Inde"
      },
      acknowledgment: {
        title: "Reconnaissance",
        content: "En utilisant StayBuddy, vous reconnaissez avoir lu, compris et accepté d'être lié par ces Termes et Conditions."
      }
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t.backToHome}</span>
          </Link>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-t-4 border-primary">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{t.title}</h1>
                <p className="text-sm text-gray-600 mt-1">{t.effectiveDate}</p>
                <p className="text-sm text-gray-600">{t.lastUpdated}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {t.sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="bg-white rounded-xl shadow-md p-6 md:p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                    <div className="space-y-3">
                      {section.content.map((paragraph, pIndex) => (
                        <p key={pIndex} className="text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-primary/5 to-green-50 rounded-xl shadow-md p-6 md:p-8 border-2 border-primary/20">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.contact.title}</h2>
                <p className="text-gray-700 mb-6">{t.contact.subtitle}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{t.contact.email}</p>
                      <a href={`mailto:${t.contact.emailValue}`} className="text-primary hover:text-primary-dark transition-colors">
                        {t.contact.emailValue}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{t.contact.phone}</p>
                      <a href={`tel:${t.contact.phoneValue}`} className="text-primary hover:text-primary-dark transition-colors">
                        {t.contact.phoneValue}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{t.contact.address}</p>
                      <p className="text-gray-700">{t.contact.addressValue}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Acknowledgment */}
          <div className="bg-primary text-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">{t.acknowledgment.title}</h2>
            <p className="text-white/90 leading-relaxed">{t.acknowledgment.content}</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            © 2024 StayBuddy. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
