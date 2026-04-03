"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "@/components/LocalizedLink";
import { ArrowLeft } from "lucide-react";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: `This Privacy Policy ("Policy") explains how StayBuddy ("StayBuddy / We / Us / Company") collects, uses, discloses, and transfers your information when you use our website, mobile application, and related platforms (collectively "Sites") for delivery of information, products, offerings, and content via any mobile or internet-connected device (collectively the "Services").

This Policy forms part of the Terms of Use and other terms on the Site. Please read this Privacy Policy and our Terms of Use carefully before using our Services.

StayBuddy respects the privacy of its users and is committed to protecting it in all respects. The information about the user as collected by StayBuddy is: (a) information supplied by users and (b) information automatically tracked while navigating.

By using the StayBuddy website or its services, you consent to the collection, storage, use, transfer, sharing, and distribution of the personal information you provide (including any changes thereto as provided by you) for any of the services that we offer.`
  },
  {
    id: "collection",
    title: "1. Information Received, Collected and Stored",
    content: `A. Information Supplied By Users

Registration Data
When you register on the Sites for the Service, we ask you to provide basic contact information such as your name, sex, age, address, pin code, contact number, occupation, interests, and email address. When you register using other accounts like Facebook, Google, etc., we shall retrieve information from such accounts to continue providing the Services.

Subscription or Paid Service Data
When you choose any subscription or paid service, we or our payment gateway provider may collect your purchase, address, or billing information, including your credit card number and expiration date. Subscriptions may be on auto-renewal mode unless cancelled.

Voluntary Information
We may collect additional information at other times, including but not limited to when you provide feedback, comments, change your content or email preferences, respond to a survey, or communicate with us.`
  },
  {
    id: "automatic",
    title: "2. Information Automatically Collected While Navigating",
    content: `Cookies
To improve the responsiveness of the Sites for our Users, we may use "cookies" or similar electronic tools to collect information and assign each visitor a unique, random number as a User Identification (User ID) to understand the User's individual interests. Unless you voluntarily identify yourself (through registration, for example), we will have no way of knowing who you are, even if we assign a cookie to your computer or device. A cookie cannot read data off your hard drive or device.

Opting Out
If a User opts out using Ads Settings, the unique cookie ID on the User's browser is overwritten. Because there is no longer a unique cookie ID, the opt-out cookie cannot be associated with a particular browser.

Log File Information
We automatically collect limited information about your computer's connection to the Internet, including your IP address, when you visit our site, application, or service. We automatically receive and log information from your browser, including your IP address, your computer's name, your operating system, browser type and version, CPU speed, and connection speed.

Clear GIFs (Web Beacons)
We may use "clear GIFs" to track the online usage patterns of our Users in an anonymous manner, without personally identifying the User. We may also use clear GIFs in HTML-based emails sent to our Users to track which emails are opened by recipients.`
  },
  {
    id: "other-sources",
    title: "3. Information from Other Sources",
    content: `We may receive information about you from other sources, add it to our account information, and treat it in accordance with this Policy. If you provide information to a platform provider or other partner whom we provide services, your account information and order information may be passed on to us.

Demographic and Other Information
We may reference other sources of demographic and other information in order to provide you with more targeted communications and promotions. We use analytics tools, among others, to track user behaviour on our Sites. The reports are anonymous and cannot be associated with any individual personally identifiable information that you may have shared with us.

Links to Third Party Sites
The Sites may include links to other websites or applications. Such websites or applications are governed by their respective privacy policies, which are beyond our control. Once you leave our servers, use of any information you provide is governed by the privacy policy of the operator of the application you are visiting.

We do not provide any personally identifiable information to third-party websites, advertisers, or ad-servers without your consent.`
  },
  {
    id: "usage",
    title: "4. How Collected Data is Used",
    content: `The information supplied by users enables us to improve the Services and provide you the most user-friendly experience. We may use your information to:

• Maintain, protect, and improve the Services (including advertising and personalisation on the Sites).
• Develop new services.
• Send commercial or marketing messages about our Services and/or updates about third-party products and services, with an option to subscribe/unsubscribe.
• Use your email address for non-marketing or administrative purposes (such as notifying you of major changes, for customer service purposes, billing, etc.).

We use third-party advertising companies to serve ads when you visit or use our Sites or Services. These companies may use information (excluding your name, address, email address, telephone number, or any personally identifiable information) about your visits to provide advertisements about goods and services of interest to you.

Any personally identifiable information provided by you will not be considered sensitive if it is freely available and/or accessible in the public domain.`
  },
  {
    id: "sharing",
    title: "5. Information Sharing",
    content: `Personal information will be used to allow you to log in to your account on the Site, resolve specific service issues, inform you of our new services or features, and communicate with you in relation to your use of the Site.

The Company shares your information with third parties without obtaining prior consent of the User only in the following limited circumstances:

• To conduct its business and to share such information within its group companies and officers and employees of such group companies for the purpose of processing personal information on its behalf.
• To present information to advertisers and third parties in the form of aggregated statistics on traffic to various pages within our site.
• To share your information regarding your activities on Sites with third-party social websites to populate your social wall, where you will have an option to set your privacy settings.
• To enforce or protect our rights or any of its affiliates, associates, employees, directors, or officers, or when we have reason to believe that disclosing information is necessary to identify, contact, or bring legal action against someone who may be causing interference with our rights.
• Your email address may be made available to other organisations whose products or services we think you might find interesting.
• Registered telephone numbers of customers may receive telephone or text message contact from us with information regarding new products and services or upcoming events.`
  },
  {
    id: "access",
    title: "6. Accessing and Updating Personal Information",
    content: `When you use the Services or Sites, we make good faith efforts to provide you, as and when requested by you, with access to your personal information and shall further ensure that any personal information found to be inaccurate or deficient shall be corrected or amended as feasible, subject to any requirement for such personal information to be retained by law or for legitimate business purposes.

We ask individual users to identify themselves and the information requested to be accessed, corrected, or removed before processing such requests. We may decline to process requests that are unreasonably repetitive or systematic, require disproportionate technical effort, jeopardize the privacy of others, or would be extremely impractical.

Because of the way we maintain certain services, after you delete your information, residual copies may take a period of time before they are deleted from our active servers and may remain in our backup systems.`
  },
  {
    id: "security",
    title: "7. Information Security",
    content: `We take appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure, or destruction of data. These include internal reviews of our data collection, storage, and processing practices and security measures, including appropriate encryption and physical security measures to guard against unauthorized access to systems where we store personal data.

All information gathered on StayBuddy is securely stored within the Company-controlled database. The database is stored on servers secured behind a firewall; access to the servers is password-protected and is strictly limited.

However, as effective as our security measures are, no security system is impenetrable. We cannot guarantee the security of our database, nor can we guarantee that information you supply will not be intercepted while being transmitted to us over the Internet.

We use commercially reasonable security measures to protect the loss, misuse, and alteration of the information under our control. However, we cannot absolutely guarantee the protection of any information shared with us.`
  },
  {
    id: "updates",
    title: "8. Updates / Changes",
    content: `The internet is an ever-evolving medium. We may alter our Policy from time to time to incorporate necessary changes in technology, applicable law, or any other variant. In any case, we reserve the right to change (at any point of time) the terms of this Policy or the Terms of Use.

Any changes we make will be effective immediately on notice, which we may give by posting the new policy on the Sites. Your use of the Sites or Services after such notice will be deemed acceptance of such changes. We may also make reasonable efforts to inform you via electronic mail.

In any case, you are advised to review this Policy periodically on the Sites to ensure that you are aware of the latest version.`
  },
  {
    id: "miscellaneous",
    title: "9. Miscellaneous",
    content: `Security
We use commercially reasonable security measures to protect the loss, misuse, and alteration of the information under our control. However, we cannot absolutely guarantee the protection of any information shared with us.

Accuracy and Confidentiality of Account Information
Customers are responsible for maintaining the secrecy and accuracy of their password, email address, and other account information at all times. StayBuddy is not responsible for any personal data transmitted to a third party as a result of incorrect account-related information.

Third-Party Websites
Our Site may contain links to third-party websites. Navigating to another website does not make StayBuddy liable for misuse of any information by any website controller to which we may link.`
  },
  {
    id: "grievance",
    title: "10. Questions / Grievance Redressal",
    content: `Redressal Mechanism: Any complaints, abuse, or concerns with regards to the use, processing, and disclosure of information provided by you or breach of these terms should immediately be informed to our designated Grievance Officer via writing or through email.

You may contact us at:

StayBuddy Support Team
Email: support@staybuddy.com

This Privacy Policy is subject to changes. Please periodically review this page for the latest information on our privacy practices.`
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
            {isFr ? "Dernière mise à jour : 1er janvier 2024" : "Last Updated: January 1, 2024"}
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
