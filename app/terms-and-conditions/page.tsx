// Terms and conditions — same data-driven pattern as cookie-policy/page.tsx
// and privacy-policy/page.tsx: edit the SECTIONS array, LegalPage renders it.
import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Terms and Conditions" };

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Introduction",
    paragraphs: [
      "These Terms and Conditions apply to this website and to transactions related to our products and services. You may be bound by additional contracts related to your relationship with us or any products or services you receive from us. Where any provision of an additional contract conflicts with these Terms, the additional contract controls.",
    ],
  },
  {
    heading: "2. Binding",
    paragraphs: [
      "By registering with, accessing, or otherwise using this website, you agree to be bound by these Terms. Using the site implies knowledge and acceptance of them. In some cases we may also ask you to explicitly agree.",
    ],
  },
  {
    heading: "3. Electronic communication",
    paragraphs: [
      "By using this website or communicating with us electronically, you agree that we may communicate with you electronically, through the site or by email, and that all agreements, notices, disclosures and other communications we provide electronically satisfy any legal requirement to be in writing.",
    ],
  },
  {
    heading: "4. Intellectual property",
    paragraphs: [
      "We or our licensors own and control all copyright and other intellectual property rights in the website and the data, information and other resources it displays or makes accessible.",
      "Unless specific content states otherwise, you are not granted a license or any other right under copyright, trademark, patent or other intellectual property rights. You may not use, copy, reproduce, perform, display, distribute, embed, alter, reverse engineer, decompile, transfer, download, transmit, monetize, sell, market or commercialize any resource on this website without our prior written permission, except as stipulated by mandatory law (such as the right to quote).",
    ],
  },
  {
    heading: "5. Newsletter",
    paragraphs: [
      "You may forward our newsletter, in electronic form, to others who may be interested in visiting our website.",
    ],
  },
  {
    heading: "6. Third-party property",
    paragraphs: [
      "Our website may include hyperlinks or references to other parties' websites. We do not monitor or review the content of linked third-party sites, and products or services offered there are subject to that party's own terms. Opinions or material appearing on those sites are not necessarily shared or endorsed by us.",
      "We are not responsible for the privacy practices or content of third-party sites. You bear all risk associated with using them, and we accept no responsibility for any loss or damage resulting from your disclosure of personal information to third parties.",
    ],
  },
  {
    heading: "7. Responsible use",
    paragraphs: [
      "By visiting our website, you agree to use it only for its intended purposes and as permitted by these Terms, any additional contracts, applicable law, and generally accepted online practices. You must not use our website to publish or distribute malicious software, use data collected from the site for direct marketing, or conduct systematic or automated data collection against it.",
      "Any activity that causes or may cause damage to the website, or interferes with its performance, availability or accessibility, is strictly prohibited.",
    ],
  },
  {
    heading: "8. Registration",
    paragraphs: [
      "You may register for an account. You're responsible for keeping your password and account information confidential, and agree not to share them or let anyone else use your account: you're responsible for all activity that occurs through it. Notify us immediately if you become aware of any disclosure of your password.",
      "After account termination, you will not attempt to register a new account without our permission. We may withhold a reimbursement until we've received returned goods, or you've supplied evidence of having sent them back, whichever comes first.",
    ],
  },
  {
    heading: "9. Idea submission",
    paragraphs: [
      "Please don't submit ideas, inventions, works of authorship or other information you consider your own intellectual property unless we've first signed an agreement covering it or a non-disclosure agreement. If you disclose it to us without such an agreement, you grant us a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce, store, adapt, publish, translate and distribute it.",
    ],
  },
  {
    heading: "10. Termination of use",
    paragraphs: [
      "We may, at our sole discretion, modify or discontinue access to the website or any service on it, temporarily or permanently, at any time. We won't be liable to you or any third party for such modification, suspension or discontinuance, and you won't be entitled to compensation, even if features or content you've come to rely on are permanently lost. You must not circumvent or attempt to circumvent any access restriction on our website.",
    ],
  },
  {
    heading: "11. Warranties and liability",
    paragraphs: [
      "Nothing here limits or excludes a warranty implied by law that it would be unlawful to limit or exclude. This website and all its content are provided on an \"as is\" and \"as available\" basis and may include inaccuracies or typographical errors. We disclaim all warranties, express or implied, as to the availability, accuracy or completeness of the content. We don't warrant that this website or our products or services will meet your requirements, that the site will be available on an uninterrupted, timely, secure or error-free basis, or that the quality of any product or service you obtain through it will meet your expectations.",
      "Nothing on this website constitutes legal, financial or medical advice: consult an appropriate professional if you need it.",
      "In no event will we be liable for direct or indirect damages, including loss of profits or revenue, loss or corruption of data, software or database, or loss of or harm to property or data, incurred by you or any third party arising from your access to or use of our website.",
      "Except where an additional contract expressly states otherwise, our maximum liability to you for all damages arising out of or related to the website or any products or services marketed or sold through it, regardless of the legal theory of liability, will be limited to the total price you paid us to purchase those products or services or use the website. That limit applies in the aggregate to all your claims and causes of action of every kind.",
    ],
  },
  {
    heading: "12. Privacy",
    paragraphs: [
      "To access parts of our website or services you may need to provide information about yourself during registration. You agree that any information you provide will always be accurate, correct and up to date.",
      "We take your personal data seriously. We won't use your email address for unsolicited mail: any email we send you relates only to the products or services you've agreed to. See our Privacy Policy and Cookie Policy for more.",
    ],
  },
  {
    heading: "13. Accessibility",
    paragraphs: [
      "We're committed to making our content accessible to people with disabilities. If you're unable to access any part of this website because of a disability, let us know with a detailed description of the issue, and if it's readily identifiable and resolvable with industry-standard tools and techniques, we'll promptly resolve it.",
    ],
  },
  {
    heading: "14. Export restrictions / legal compliance",
    paragraphs: [
      "Access to this website from territories or countries where its content, or the products or services sold on it, are illegal is prohibited. You may not use this website in violation of Canadian export laws and regulations.",
    ],
  },
  {
    heading: "15. Assignment",
    paragraphs: [
      "You may not assign, transfer or sub-contract any of your rights or obligations under these Terms, in whole or in part, to any third party without our prior written consent. Any purported assignment in violation of this section is null and void.",
    ],
  },
  {
    heading: "16. Breaches of these Terms",
    paragraphs: [
      "If you breach these Terms, we may take any action we consider appropriate, including temporarily or permanently suspending your access, contacting your internet service provider to request they block your access, and/or commencing legal action against you.",
    ],
  },
  {
    heading: "17. Force majeure",
    paragraphs: [
      "Except for payment obligations, neither party will be in breach of these Terms for any delay, failure or omission arising from a cause beyond that party's reasonable control.",
    ],
  },
  {
    heading: "18. Indemnification",
    paragraphs: [
      "You agree to indemnify, defend and hold us harmless from any claims, liabilities, damages, losses and expenses relating to your violation of these Terms or applicable law, including intellectual property and privacy rights, and to promptly reimburse us for costs relating to such claims.",
    ],
  },
  {
    heading: "19. Waiver",
    paragraphs: [
      "Failing to enforce any provision of these Terms, or failing to exercise an option to terminate, is not a waiver of that provision and doesn't affect our right to enforce it later.",
    ],
  },
  {
    heading: "20. Language",
    paragraphs: [
      "These Terms will be interpreted and construed exclusively in English, and all related notices and correspondence will be written in English.",
    ],
  },
  {
    heading: "21. Entire agreement",
    paragraphs: [
      "These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and JET Automation regarding your use of this website.",
    ],
  },
  {
    heading: "22. Updating these Terms",
    paragraphs: [
      "We may update these Terms from time to time: it's your responsibility to check back periodically. The date at the top of this page is the latest revision date. Changes take effect once posted; continuing to use the site after that counts as acceptance.",
    ],
  },
  {
    heading: "23. Choice of law and jurisdiction",
    paragraphs: [
      "These Terms are governed by the laws of Canada, and any related disputes are subject to the jurisdiction of the courts of Canada. If any part of these Terms is found invalid or unenforceable, it will be modified, deleted or enforced to the maximum extent that preserves its intent, without affecting the remaining provisions.",
    ],
  },
  {
    heading: "24. Contact information",
    paragraphs: [
      "This website is owned and operated by JET Automation. You can reach us about these Terms through our contact page, or using the details below.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms and Conditions"
      lastUpdated="February 26, 2025"
      intro="These Terms and Conditions apply to this website and to transactions related to our products and services."
      sections={SECTIONS}
      footnote="JET Automation Inc. · 7676 Kimbel St, Units 8–13, Mississauga, ON L5S 1J8 · info@jetautomation.ca · 1-877-904-8724"
    />
  );
}
