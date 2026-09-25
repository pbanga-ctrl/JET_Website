// Contact page — static header copy, then the actual form/step-indicator
// logic lives in ContactSection (kept separate since it's a client
// component and this page doesn't need to be).
import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageTransition } from "@/components/ui/PageTransition";
import { ContactSection } from "@/components/contact/ContactSection";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PageTransition>
      <section className="mx-auto max-w-[1200px] px-5 sm:px-8 pb-16 sm:pb-24 pt-[68px] sm:pt-[88px]">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-6 max-w-2xl text-[clamp(2.15rem,9vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.02em] sm:leading-[1.02] sm:tracking-[-0.03em] lg:text-[72px]">
          TALK TO A
          <br />
          SPECIALIST
        </h1>
        <p className="mt-6 max-w-[42rem] text-lg text-on-surface-muted">
          Quotes, service calls, retrofits or a second opinion on a safety
          upgrade. Reach us by phone or send the details below.
        </p>

        <div className="mt-12">
          <ContactSection />
        </div>
      </section>
    </PageTransition>
  );
}
