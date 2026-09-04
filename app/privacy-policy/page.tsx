// Privacy policy — same data-driven pattern as cookie-policy/page.tsx and
// terms-and-conditions/page.tsx: edit the SECTIONS array, LegalPage renders it.
import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Information we collect",
    paragraphs: ["We gather a few categories of information from visitors and customers:"],
    list: [
      "Personal information: name, email address, phone number, and billing and shipping address.",
      "Account information: login credentials and purchase history, stored when you create an account.",
      "Contact form submissions: whatever you send us through the forms on this site.",
      "Cookies and tracking data: used to improve your experience and provide necessary site functionality. See our Cookie Policy for the full breakdown.",
    ],
  },
  {
    heading: "2. How we use your information",
    paragraphs: ["We use the information we collect to:"],
    list: [
      "Process and fulfill orders",
      "Communicate about purchases or inquiries",
      "Provide customer support",
      "Improve site functionality and user experience",
    ],
  },
  {
    heading: "3. Payment processing",
    paragraphs: [
      "We use Stripe as our payment processor. Payment details are handled entirely by Stripe and are not stored on our servers. Please review Stripe's own privacy documentation for how they handle your data.",
    ],
  },
  {
    heading: "4. Third-party services",
    paragraphs: [
      "We work with a small set of vendors to run this site and our business: HubSpot for customer relationship management, Freightcom and Clickship for order shipping and tracking, and Hostinger for website hosting. We do not use third-party advertising networks, affiliate programs, or social platform integrations.",
    ],
  },
  {
    heading: "5. Your rights and data management",
    paragraphs: [
      "We do not currently offer a self-service way to request deletion or modification of your data: contact us directly and we'll handle it manually. We are in the process of assessing our compliance with privacy regulations such as GDPR and CCPA.",
    ],
  },
  {
    heading: "6. Security measures",
    paragraphs: [
      "This site uses SSL encryption to protect data in transit. We encourage you to follow your own account security best practices, such as using a unique password.",
    ],
  },
  {
    heading: "7. Cookies and tracking",
    paragraphs: [
      "You can disable non-essential cookies through your browser preferences. Core site functionality relies on essential cookies and can't be turned off without affecting how the site works: see our Cookie Policy for the full list and to manage your preferences.",
    ],
  },
  {
    heading: "8. Contact us",
    paragraphs: [
      "Questions about this policy can be sent through the contact form, by email, or by phone: details below.",
    ],
  },
  {
    heading: "9. Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time. Please check back periodically for changes.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      lastUpdated="February 26, 2025"
      intro="JET Automation (“we,” “our,” or “us”) operates jetautomation.ca and is committed to protecting the privacy of our users. This policy outlines how we collect, use and protect your personal information."
      sections={SECTIONS}
      footnote="JET Automation Inc. · 7676 Kimbel St, Units 8–13, Mississauga, ON L5S 1J8 · info@jetautomation.ca · 1-877-904-8724"
    />
  );
}
