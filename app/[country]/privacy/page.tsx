"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "@/components/LocalizedLink";
import { ArrowLeft, Shield, Lock, Eye, Database, Cookie, Users, FileText, Mail, Phone, MapPin } from "lucide-react";

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Privacy Policy",
      effectiveDate: "Effective Date: January 1, 2024",
      lastUpdated: "Last Updated: January 1, 2024",
      backToHome: "Back to Home",
      sections: [
        {
          id: "introduction",
          icon: Shield,
          title: "1. Introduction",
          content: [
            "At StayBuddy, we value and respect your privacy. This Privacy Policy explains how we collect, use, store, share, and protect your personal information when you use our website and services.",
            "By accessing or using StayBuddy, you agree to the terms outlined in this Privacy Policy. If you do not agree with our practices, please do not use our platform.",
            "We are committed to maintaining the confidentiality and security of your personal data in compliance with applicable data protection laws."
          ]
        },
        {
          id: "information-collected",
          icon: Database,
          title: "2. Information We Collect",
          subsections: [
            {
              subtitle: "2.1 Personal Information",
              items: [
                "Full Name",
                "Email Address",
                "Phone Number",
                "Date of Birth",
                "Government-issued ID (Aadhaar, Passport, Driver's License) - when required for verification",
                "Profile Photo",
                "Address and Location Information"
              ]
            },
            {
              subtitle: "2.2 Payment Information",
              items: [
                "Credit/Debit Card Details (processed securely through third-party payment gateways)",
                "Bank Account Information (if applicable)",
                "Transaction History",
                "Billing Address"
              ]
            },
            {
              subtitle: "2.3 Non-Personal Information",
              items: [
                "IP Address",
                "Browser Type and Version",
                "Device Information (type, operating system)",
                "Cookies and Tracking Data",
                "Usage Data (pages visited, time spent, clicks)",
                "Referral Source",
                "Geographic Location (approximate)"
              ]
            },
            {
              subtitle: "2.4 Property Listing Information",
              items: [
                "Property Details (address, photos, amenities)",
                "Rental Terms and Pricing",
                "Availability Information",
                "Reviews and Ratings"
              ]
            }
          ]
        },
        {
          id: "how-we-use",
          icon: Eye,
          title: "3. How We Use Your Information",
          content: [
            "We use the information we collect for the following purposes:",
            "• Account Creation and Management: To create, maintain, and secure your user account.",
            "• Booking and Transactions: To process property bookings, rental agreements, and payment transactions.",
            "• Communication: To send booking confirmations, updates, notifications, and respond to inquiries.",
            "• Matching Services: To connect tenants with property owners and facilitate rental agreements.",
            "• Platform Improvement: To analyze usage patterns, improve website functionality, and enhance user experience.",
            "• Security and Fraud Prevention: To detect, prevent, and address fraudulent activities, security breaches, and policy violations.",
            "• Legal Compliance: To comply with legal obligations, enforce our Terms and Conditions, and protect our rights.",
            "• Marketing and Promotions: To send promotional offers, newsletters, and updates (with your consent).",
            "• Customer Support: To provide assistance and resolve issues."
          ]
        },
        {
          id: "sharing",
          icon: Users,
          title: "4. Sharing of Information",
          content: [
            "We may share your information in the following circumstances:",
            "• With Property Owners/Tenants: To facilitate bookings and rental agreements, we share relevant information between tenants and property owners.",
            "• With Service Providers: We share data with third-party service providers who assist us in operating our platform (payment processors, hosting providers, analytics services).",
            "• For Legal Reasons: We may disclose information if required by law, court order, legal process, or government authorities.",
            "• Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.",
            "• With Your Consent: We may share information with third parties when you explicitly consent to such sharing.",
            "We do not sell, rent, or trade your personal information to third parties for marketing purposes."
          ]
        },
        {
          id: "data-security",
          icon: Lock,
          title: "5. Data Security",
          content: [
            "We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.",
            "Security measures include:",
            "• Encryption of sensitive data (SSL/TLS protocols)",
            "• Secure payment processing through PCI-DSS compliant gateways",
            "• Regular security audits and vulnerability assessments",
            "• Access controls and authentication mechanisms",
            "• Employee training on data protection practices",
            "However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security."
          ]
        },
        {
          id: "cookies",
          icon: Cookie,
          title: "6. Cookies Policy",
          content: [
            "We use cookies and similar tracking technologies to enhance your experience on our platform.",
            "Types of cookies we use:",
            "• Essential Cookies: Required for basic website functionality (login sessions, security).",
            "• Performance Cookies: Help us analyze website usage and improve performance.",
            "• Functional Cookies: Remember your preferences and settings.",
            "• Advertising Cookies: Used to deliver relevant advertisements (with your consent).",
            "You can control cookie preferences through your browser settings. However, disabling certain cookies may affect website functionality.",
            "For more information about cookies, visit www.allaboutcookies.org"
          ]
        },
        {
          id: "data-retention",
          icon: Database,
          title: "7. Data Retention",
          content: [
            "We retain your personal information for as long as necessary to:",
            "• Provide our services and maintain your account",
            "• Comply with legal, tax, and accounting obligations",
            "• Resolve disputes and enforce our agreements",
            "• Prevent fraud and ensure platform security",
            "When your account is deleted or data is no longer needed, we will securely delete or anonymize your information, unless retention is required by law.",
            "Inactive accounts may be deleted after a period of [specify duration, e.g., 3 years] of inactivity."
          ]
        },
        {
          id: "user-rights",
          icon: Shield,
          title: "8. Your Rights and Choices",
          content: [
            "You have the following rights regarding your personal information:",
            "• Right to Access: Request a copy of the personal data we hold about you.",
            "• Right to Correction: Request correction of inaccurate or incomplete information.",
            "• Right to Deletion: Request deletion of your personal data (subject to legal obligations).",
            "• Right to Restrict Processing: Request limitation on how we use your data.",
            "• Right to Data Portability: Request transfer of your data to another service provider.",
            "• Right to Object: Object to certain types of data processing (e.g., marketing communications).",
            "• Right to Withdraw Consent: Withdraw consent for data processing where consent was the legal basis.",
            "To exercise these rights, please contact us at support@staybuddy.com. We will respond to your request within 30 days."
          ]
        },
        {
          id: "third-party",
          icon: FileText,
          title: "9. Third-Party Links and Services",
          content: [
            "Our website may contain links to third-party websites, services, or applications that are not operated by us.",
            "We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review their privacy policies before providing any personal information.",
            "Third-party services we may integrate with include:",
            "• Payment gateways (Razorpay, Stripe, PayPal)",
            "• Social media platforms (Facebook, Instagram, LinkedIn)",
            "• Analytics services (Google Analytics)",
            "• Map services (Google Maps)"
          ]
        },
        {
          id: "children",
          icon: Users,
          title: "10. Children's Privacy",
          content: [
            "StayBuddy is not intended for use by individuals under the age of 18.",
            "We do not knowingly collect personal information from children. If we become aware that we have collected data from a child without parental consent, we will take steps to delete such information.",
            "If you believe we have collected information from a child, please contact us immediately."
          ]
        },
        {
          id: "international",
          icon: Shield,
          title: "11. International Data Transfers",
          content: [
            "Your information may be transferred to and processed in countries other than your country of residence.",
            "We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your data.",
            "By using our services, you consent to the transfer of your information to India and other countries where we operate."
          ]
        },
        {
          id: "changes",
          icon: FileText,
          title: "12. Changes to This Privacy Policy",
          content: [
            "We reserve the right to update or modify this Privacy Policy at any time to reflect changes in our practices, legal requirements, or business operations.",
            "Changes will be effective immediately upon posting on this page. The 'Last Updated' date at the top will indicate when the policy was last revised.",
            "We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.",
            "For material changes, we will notify you via email or through a prominent notice on our platform."
          ]
        },
        {
          id: "compliance",
          icon: Shield,
          title: "13. Legal Compliance and Jurisdiction",
          content: [
            "This Privacy Policy is governed by the laws of India and complies with:",
            "• Information Technology Act, 2000",
            "• Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011",
            "• Personal Data Protection Bill (when enacted)",
            "For users in the European Union, we comply with the General Data Protection Regulation (GDPR).",
            "For users in California, USA, we comply with the California Consumer Privacy Act (CCPA).",
            "Any disputes arising from this Privacy Policy shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat, India."
          ]
        },
        {
          id: "marketing",
          icon: Mail,
          title: "14. Marketing Communications",
          content: [
            "With your consent, we may send you promotional emails, newsletters, and updates about our services, special offers, and new features.",
            "You can opt out of marketing communications at any time by:",
            "• Clicking the 'Unsubscribe' link in any marketing email",
            "• Updating your communication preferences in your account settings",
            "• Contacting us at support@staybuddy.com",
            "Please note that even if you opt out of marketing communications, we will still send you transactional emails related to your account and bookings."
          ]
        }
      ],
      contact: {
        title: "15. Contact Us",
        subtitle: "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:",
        dpo: "Data Protection Officer",
        email: "Email",
        emailValue: "privacy@staybuddy.com",
        supportEmail: "support@staybuddy.com",
        phone: "Phone",
        phoneValue: "+91 99999 99999",
        address: "Address",
        addressValue: "213 Sanidhya Arcade, Vastral, Ahmedabad, Gujarat 382418, India"
      },
      acknowledgment: {
        title: "Your Consent",
        content: "By using StayBuddy, you acknowledge that you have read, understood, and agree to the practices described in this Privacy Policy."
      },
      disclaimer: {
        title: "Important Legal Notice",
        content: "This Privacy Policy is provided for informational purposes. For complete legal protection, we recommend consulting with a qualified attorney to ensure compliance with all applicable laws and regulations in your jurisdiction."
      }
    },
    fr: {
      title: "Politique de Confidentialité",
      effectiveDate: "Date d'entrée en vigueur: 1er janvier 2024",
      lastUpdated: "Dernière mise à jour: 1er janvier 2024",
      backToHome: "Retour à l'accueil",
      sections: [
        {
          id: "introduction",
          icon: Shield,
          title: "1. Introduction",
          content: [
            "Chez StayBuddy, nous valorisons et respectons votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, stockons, partageons et protégeons vos informations personnelles lorsque vous utilisez notre site Web et nos services.",
            "En accédant ou en utilisant StayBuddy, vous acceptez les termes décrits dans cette Politique de Confidentialité. Si vous n'êtes pas d'accord avec nos pratiques, veuillez ne pas utiliser notre plateforme.",
            "Nous nous engageons à maintenir la confidentialité et la sécurité de vos données personnelles conformément aux lois applicables sur la protection des données."
          ]
        }
      ],
      contact: {
        title: "15. Contactez-nous",
        subtitle: "Si vous avez des questions, des préoccupations ou des demandes concernant cette Politique de Confidentialité ou nos pratiques en matière de données, veuillez nous contacter:",
        dpo: "Délégué à la Protection des Données",
        email: "Email",
        emailValue: "privacy@staybuddy.com",
        supportEmail: "support@staybuddy.com",
        phone: "Téléphone",
        phoneValue: "+91 99999 99999",
        address: "Adresse",
        addressValue: "213 Sanidhya Arcade, Vastral, Ahmedabad, Gujarat 382418, Inde"
      },
      acknowledgment: {
        title: "Votre Consentement",
        content: "En utilisant StayBuddy, vous reconnaissez avoir lu, compris et accepté les pratiques décrites dans cette Politique de Confidentialité."
      },
      disclaimer: {
        title: "Avis Juridique Important",
        content: "Cette Politique de Confidentialité est fournie à titre informatif. Pour une protection juridique complète, nous recommandons de consulter un avocat qualifié pour assurer la conformité avec toutes les lois et réglementations applicables dans votre juridiction."
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
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-t-4 border-green-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-600" />
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
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                    
                    {(section as any).subsections ? (
                      <div className="space-y-4">
                        {(section as any).subsections.map((subsection: any, subIndex: number) => (
                          <div key={subIndex}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{subsection.subtitle}</h3>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              {subsection.items.map((item: string, itemIndex: number) => (
                                <li key={itemIndex} className="text-gray-700">{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : section.content ? (
                      <div className="space-y-3">
                        {section.content.map((paragraph, pIndex) => (
                          <p key={pIndex} className="text-gray-700 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-md p-6 md:p-8 border-2 border-green-500/20">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.contact.title}</h2>
                <p className="text-gray-700 mb-6">{t.contact.subtitle}</p>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">{t.contact.dpo}</p>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-green-600" />
                      <a href={`mailto:${t.contact.emailValue}`} className="text-green-600 hover:text-green-700 transition-colors font-medium">
                        {t.contact.emailValue}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{t.contact.email}</p>
                      <a href={`mailto:${t.contact.supportEmail}`} className="text-green-600 hover:text-green-700 transition-colors">
                        {t.contact.supportEmail}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{t.contact.phone}</p>
                      <a href={`tel:${t.contact.phoneValue}`} className="text-green-600 hover:text-green-700 transition-colors">
                        {t.contact.phoneValue}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 mt-1" />
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
          <div className="bg-green-600 text-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">{t.acknowledgment.title}</h2>
            <p className="text-white/90 leading-relaxed">{t.acknowledgment.content}</p>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl shadow-md p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-yellow-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-yellow-900 mb-2">{t.disclaimer.title}</h2>
                <p className="text-yellow-800 leading-relaxed">{t.disclaimer.content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
