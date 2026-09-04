// Cookie policy — pure content page. All the legal copy lives in the
// SECTIONS array below as plain data; LegalPage (shared with the privacy
// policy and terms pages) turns it into the heading/paragraph/list layout.
// To edit the policy text, edit SECTIONS — no markup changes needed.
import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { ManageCookiesButton } from "@/components/legal/ManageCookiesButton";

export const metadata: Metadata = { title: "Cookie Policy" };

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Introduction",
    paragraphs: [
      "This website uses cookies and related technologies (for convenience, all referred to here as “cookies”). Some are placed by us; some are placed by third parties we work with.",
    ],
  },
  {
    heading: "2. What are cookies?",
    paragraphs: [
      "A cookie is a small file sent along with the pages of this website and stored by your browser on your device's hard drive.",
    ],
  },
  {
    heading: "3. What are scripts?",
    paragraphs: [
      "A script is a piece of program code used to make our website function properly and interactively.",
    ],
  },
  {
    heading: "4. What is a web beacon?",
    paragraphs: [
      "A web beacon is a small, invisible piece of text or image on a website used to monitor traffic.",
    ],
  },
  {
    heading: "5. Third parties",
    paragraphs: [
      "We cannot guarantee that the third parties who place cookies through this site handle your personal data in a reliable or secure manner. Google and similar parties act as independent data controllers for the cookies they place.",
    ],
  },
  {
    heading: "6. Categories of cookies we use",
    paragraphs: [],
    list: [
      "Necessary / functional: enable core site functionality and remember your preferences so you don't have to re-enter information.",
      "Statistics / analytics: help us understand how the site is used so we can improve it.",
      "Marketing / tracking: used to build a profile of your interests, to show relevant advertising or track you across websites.",
    ],
  },
  {
    heading: "7. Services that place cookies on this site",
    paragraphs: [
      "Elementor, WooCommerce, Google reCAPTCHA, WordPress, Sourcebuster JS, Stripe, Google Analytics, HubSpot, Automattic, LiteSpeed, Google Maps, Complianz, Google Fonts, and a small number of other tracking tools used to run and improve the site.",
    ],
  },
  {
    heading: "8. Consent",
    paragraphs: [
      "On your first visit we ask for your consent before placing non-essential cookies. Choosing “Accept all” consents to every category described above. You can withdraw or change your consent at any time: see the button above, or your browser's cookie settings.",
    ],
  },
  {
    heading: "9. Enabling, disabling and deleting cookies",
    paragraphs: [
      "You can manage or delete cookies at any time through your browser settings; consult your browser's help pages for how. For more on interest-based advertising, see youradchoices.ca.",
    ],
  },
  {
    heading: "10. Your rights with respect to personal data",
    paragraphs: ["Under Canadian privacy law you may:"],
    list: [
      "Request access to your personal data",
      "Object to our processing of it",
      "Request a copy of it in a common, machine-readable format",
      "Request corrections or deletion",
      "Withdraw consent, with reasonable notice",
      "Raise a non-compliance concern with the Office of the Privacy Commissioner of Canada",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookie Policy"
      lastUpdated="October 3, 2025"
      intro="How JET Automation Inc. uses cookies and similar technologies on jetautomation.ca, and how to control them."
      actions={<ManageCookiesButton />}
      sections={SECTIONS}
      footnote="JET Automation Inc. · 7676 Kimbel St, Units 8–13, Mississauga, ON L5S 1J8, Canada · info@jetautomation.ca · +1 877-904-8724"
    />
  );
}
