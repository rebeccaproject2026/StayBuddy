"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "@/components/LocalizedLink";
import { ArrowLeft } from "lucide-react";

const sections = [
  {
    id: "introduction",
    title: "General Terms & Conditions",
    content: `These General Terms & Conditions ("Terms") constitute a legally binding agreement between you and StayBuddy ("StayBuddy / We / Us / Company") regarding your use of the website and mobile application ("Site") and any services offered or made available by StayBuddy, including delivery of content via the Site or through any mobile or internet-connected device ("Services").

Your use of the Site and Services is governed by the following Terms. By mere use of the Site, you shall be contracting with StayBuddy. These Terms including the policies constitute your binding obligations, and it is imperative that before using the platform you acquaint yourself with their applicability.

StayBuddy reserves the right to amend or modify these Terms without any prior notice. Such modifications shall become effective immediately upon being posted on the Site. Any further access to the Site after such modifications shall constitute your acceptance of the revised Terms.`
  },
  {
    id: "definitions",
    title: "I. Defined Terms",
    content: `Unless otherwise specified, the capitalized words shall have the meanings defined below:

"Agreement" refers to the completed application form, its attachments, and these Terms.

"StayBuddy" refers to the company operating the StayBuddy platform, including its website and mobile application.

"Date of Commencement" is the date indicating the acceptance of the application by the User to the Services.

"Date of Termination" is the date of expiry mentioned in the notice or letter of termination and/or the date when the Services are supposed to end.

"Registration Data" is the database of all particulars and information supplied by the User on initial application and subscription, including User name, contact details, mailing address, account details and any other information supplied.

"User / You" includes any Subscriber, Advertiser, Browser, or Visitor — either an individual or a juristic personality — whose details are captured in the application form, and includes their successors and permitted assigns. It also includes any person accessing or using Services for hosting, publishing, listing, transacting, or viewing information, or otherwise participating in any manner.

"Confidential Information" shall mean any and all non-public, proprietary, technical, financial, strategic, commercial, or business-related information, data, documents, trade secrets, know-how, customer lists, pricing strategies, product designs, marketing plans, and any other information disclosed by StayBuddy or its affiliates, in any form or medium, whether marked as confidential or not.`
  },
  {
    id: "services",
    title: "II. Services",
    content: `StayBuddy provides various internet-based Services through its platform, including:

• Posting property listings and User profiles for rent or related services.
• Searching for PG accommodations and rental properties via the Site.
• Posting online advertisements.
• Sending promotional messages via email or SMS.
• Other services as mentioned on the Site or as stated in these Terms.

Services may be purchased through available payment options and are subject to applicable policies, including subscription fees, refunds, and cancellations.`
  },
  {
    id: "eligibility",
    title: "III. Eligibility",
    content: `You represent and warrant that you are at least 18 years of age and competent to enter into a valid and binding contract. Minors may use the Service only under the supervision of a parent or legal guardian through the guardian's registered account.

You agree to register before uploading content or accessing Services, and to provide accurate personal details, including name, age, email, address, and contact number.`
  },
  {
    id: "payment",
    title: "IV. Payment & Refund",
    content: `For all Services, 50% of the total order value shall be considered as activation/administration charges. The remaining 50% may be refundable on a pro-rata basis upon cancellation, depending on the extent of Services usage. Any applicable refund shall be processed within 4 to 6 weeks from the date of submission of complete and accurate documentation to StayBuddy. All refund claims are subject to the sole discretion of StayBuddy and shall not be construed as a right.

Users are required to pay the applicable fees within the time period specified in the invoice(s) issued by StayBuddy.

Any delay by the User in making payments will attract interest on the outstanding amount from the due date until the date of full payment.`
  },
  {
    id: "security",
    title: "V. Security",
    content: `Transactions on the Site are encrypted and secure. Credit/debit card details are handled solely by authorized payment gateways and are not stored by StayBuddy.

Users must safeguard their usernames and passwords, including changing the password periodically and refraining from sharing it with third parties.

Access to Services must be through the credentials of the User. Loss or theft of login credentials must be reported immediately. Users shall remain liable for Services use until such notification is received by StayBuddy.

Use of automated software to extract or download data from the Site is prohibited without prior written consent.`
  },
  {
    id: "obligations",
    title: "VI. Obligations and Representations of User",
    content: `• Provide accurate, complete, and correct Registration Data at the time of application for the Services.
• Acknowledge that all data entered on the Site is subject to verification by StayBuddy.
• Obtain all necessary licenses, permits, consents, approvals, and intellectual property rights required for using the Services at their own cost.
• Comply with all instructions or notices issued by StayBuddy for Services usage.
• Be solely responsible for applicable taxes and related costs incurred in using the Services.
• Maintain confidentiality of their login credentials and all activities performed under their account.
• Promptly notify StayBuddy of any unauthorized use or security breach of their account.
• Confirm they are above 18 years of age and legally competent to contract.
• Acknowledge that listings may take up to 48 hours to reflect on the Site.
• Grant StayBuddy a non-exclusive, worldwide, royalty-free, irrevocable, sub-licensable license to use submitted content across media, excluding sensitive financial data.
• Ensure that all User Data is accurate, complete, and not misleading in any manner.`
  },
  {
    id: "prohibited",
    title: "VII. Prohibited Actions",
    content: `Users shall not:

• Permit unauthorized persons to access or use the Services, nor resell, sublicense, assign, or commercially exploit the Services in any unauthorized manner.
• Post, transmit, or store content that is defamatory, obscene, pornographic, abusive, threatening, harassing, libellous, racially or ethnically objectionable, or otherwise unlawful or harmful.
• Impersonate any person or entity, misrepresent their affiliation, or disclose confidential or proprietary information without proper authorization.
• Upload or transmit viruses, malware, or malicious code; attempt unauthorized access to systems, networks, or the Site; or use bots, scrapers, or similar tools without permission.
• Share false, misleading, or deceptive information, or any content created with malicious intent to harm or misinform others.
• Send unsolicited messages, engage in spamming activities, or advertise unrelated services to other users.

Violation of these Terms may result in suspension, deactivation, or blacklisting of the User account.`
  },
  {
    id: "ip",
    title: "VIII. Intellectual Property Rights",
    content: `All intellectual property rights in the Site, Services, property listings, User data, and all related content remain the sole and exclusive property of StayBuddy. Users shall have no claim or right over such intellectual property.

Any content contributed by a User (text, images, videos, reviews, etc.) shall automatically vest in StayBuddy. Reproduction or reuse of such content elsewhere constitutes infringement, and StayBuddy reserves the right to initiate legal action.

All trademarks, logos, and brand elements displayed on the Site are owned by or licensed to StayBuddy. No right or license is granted to any User. Unauthorized use shall attract strict legal consequences.

Users are granted a limited, non-transferable, non-exclusive, and revocable license to access and use the Services, strictly in accordance with these Terms.`
  },
  {
    id: "confidentiality",
    title: "IX. Confidentiality",
    content: `The User acknowledges and agrees that, in the course of using the StayBuddy platform or Services, they may receive or gain access to certain non-public, sensitive, or proprietary information relating to StayBuddy, its affiliates, partners, or other users.

You agree to maintain the confidentiality of all such information and not to disclose, share, publish, or otherwise make such information available to any third party without the prior written consent of StayBuddy, except where disclosure is required under applicable law, regulation, or legal process.

These confidentiality obligations shall survive the termination or expiration of your access to or use of the platform and Services, for any reason whatsoever.`
  },
  {
    id: "thirdparty",
    title: "X. Third Party Links and Resources",
    content: `The Site may display or link to content, services, advertisements, or goods provided by third-party websites or platforms. Such third-party content is not under StayBuddy's control, and StayBuddy is not responsible for its availability, accuracy, content, or privacy practices.

Hyperlinks and references to third-party websites are provided solely for User convenience and do not imply endorsement by StayBuddy. Accessing such websites is at the User's own risk.

StayBuddy shall not be liable for any loss, damage, or harm arising from User access to or reliance on third-party websites, content, or services.`
  },
  {
    id: "termination",
    title: "XI. Termination and Suspension",
    content: `Users may request suspension of the Services by submitting a written request to StayBuddy. StayBuddy shall have up to 30 days from the date of receiving such request to review and respond.

StayBuddy reserves the right to immediately terminate your access to the Service without prior notice if it has reasonable grounds to believe that you have engaged in any activity amounting to fraud, misrepresentation, cheating, or any act prejudicial to the interests of StayBuddy.

In the event of termination, any fees or amounts paid by you shall be forfeited and shall not be refundable under any circumstances.

Any provisions of the Agreement which by their nature are intended to survive, including but not limited to confidentiality, limitations of liability, and dispute resolution, shall survive termination.`
  },
  {
    id: "disclaimer",
    title: "XII. Disclaimer",
    content: `StayBuddy does not warrant, guarantee, or represent that the Services will meet your specific requirements or expectations, be uninterrupted, timely, secure, or error-free.

StayBuddy operates as an intermediary platform. The content on the Site is provided without warranties of any kind; views expressed by Users are their own and are not endorsed by StayBuddy.

StayBuddy does not guarantee any response, satisfactory or otherwise, to listings displayed on the Site. Property descriptions and other content on the Site are for informational purposes only. It is the sole responsibility of buyers/tenants and agents to verify accuracy.

StayBuddy shall not be liable for any disclosure, error, omission, or inaccuracy relating to user information. All data is accepted in good faith.`
  },
  {
    id: "liability",
    title: "XIII. Limitation of Liability",
    content: `The User agrees that neither StayBuddy nor its directors, officers, or employees shall be liable for any direct, indirect, incidental, special, consequential, or exemplary damages arising from:

• The use or inability to use the Services.
• Any goods, data, information, or services obtained, or messages received, or transactions entered into through the Service.
• Unauthorized access to or alteration of the User's data or transmissions.
• Any other matter relating to the Services, including loss of profits, use, data, or other intangible losses.

In any event, StayBuddy's total cumulative liability shall not exceed the amount paid by the User to StayBuddy related to the cause of action.`
  },
  {
    id: "indemnity",
    title: "XIV. Indemnity",
    content: `Users hereby agree to indemnify, hold harmless, and settle any third-party lawsuit or proceeding brought against StayBuddy or any of its directors, employees, or Key Managerial Personnel in relation to any claim arising from the advertisement, wrongful posting of property, unauthorized posting of property, or the fact that the User Content, Site, and/or User features infringe or tend to infringe any copyright, trade secret, or trademark of such third party.

The User further unconditionally agrees to indemnify, reimburse, and hold harmless StayBuddy, its officers, directors, employees, and agents from and against any claims, actions, demands, liabilities, losses, or damages whatsoever arising from or resulting from their use of StayBuddy, whether directly or indirectly.`
  },
  {
    id: "governing",
    title: "XV. Governing Law and Jurisdiction",
    content: `There is no agency, partnership, joint venture, employer-employee, or franchisor-franchisee relationship between StayBuddy and any User of the Services.

The User agrees that, regardless of any statute or law to the contrary, any claim or cause of action arising out of or related to the use of the Services or these Terms must be filed within 30 days after such claim or cause of action arose, or it shall be forever barred.

The Agreement and any dispute or matter arising from incidental use of the Site shall be governed by the applicable laws of the jurisdiction in which the User operates, and the User and Site hereby submit to the exclusive jurisdiction of the competent courts.`
  },
  {
    id: "privacy",
    title: "XVI. Privacy Policy",
    content: `The Site respects the privacy of its Users and is committed to protecting it. StayBuddy collects User information through various means. This information is voluntarily provided by Users and includes property details, email addresses, and names. The data collected is stored in the Site database and is intended solely for use by StayBuddy.

The Site engages third-party advertising companies to display ads on various websites in order to reach potential Users, buyers, and sellers. The collected data is used exclusively by the Site and may be shared with its clients for property-related purposes only.

Any unauthorized use or sharing of this information by third parties will result in appropriate legal action by StayBuddy.`
  },
  {
    id: "pg",
    title: "XVII. PG Listing Terms",
    content: `StayBuddy is an online platform that facilitates interactions between Users (Tenants) and PG Owners. StayBuddy does not act as an agent for either party and all transactions are on a principal-to-principal basis.

The User is solely responsible for verifying the accuracy, reliability, and authenticity of PG listings, and for conducting their own due diligence including physical inspection and direct communication with the PG Owner.

StayBuddy does not guarantee the quality, condition, ownership, or legal standing of any PG property.

StayBuddy is not a party to the rental agreement or any dispute that may arise between the User and the PG Owner. The User shall indemnify StayBuddy against any claim, cost, or liability arising from such disputes.

StayBuddy reserves the right to modify these Terms at any time without prior notice. Continued use of the platform constitutes acceptance of the revised Terms.`
  },
  {
    id: "acceptance",
    title: "XVIII. Acknowledgment and Acceptance of Terms",
    content: `The Terms appearing above constitute the entire agreement between the User and StayBuddy and supersede all previous arrangements and schedules between the parties regarding the subject matter contained herein. By completing the registration process and/or checking the "I have read and accept the Terms" box, the User indicates their acceptance of this agreement and agrees to be bound by all the Terms as stated above.

It is our constant endeavour to make the Site an enjoyable and effective experience for all our Users. If you observe any material or behaviour that may violate these Terms, please write to us. User feedback will go a long way in helping us enhance our Services.`
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
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm text-primary hover:underline py-0.5"
              >
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
