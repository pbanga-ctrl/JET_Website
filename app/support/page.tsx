// Support page — order lookup form, FAQ accordion, and a static policy
// card grid (each card just links back to this same page's own sections).
import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { PageTransition } from "@/components/ui/PageTransition";
import { OrderLookup } from "@/components/support/OrderLookup";
import { FaqAccordion } from "@/components/support/FaqAccordion";

export const metadata: Metadata = { title: "Support" };

const POLICIES = [
  { title: "Shipping & delivery", body: "Rates, carriers and dock requirements." },
  { title: "Returns & refunds", body: "30-day window, RMA required." },
  { title: "Terms & conditions", body: "Sale, service and warranty terms." },
  { title: "Privacy & cookies", body: "What we store and why." },
];

export default function SupportPage() {
  return (
    <PageTransition>
      <section className="mx-auto max-w-[1200px] px-5 sm:px-8 pb-16 pt-[68px] sm:pt-[88px]">
        <Eyebrow>Support</Eyebrow>
        <h1 className="mt-6 max-w-2xl text-[clamp(2.15rem,9vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.02em] sm:leading-[1.02] sm:tracking-[-0.03em] lg:text-[72px]">
          CUSTOMER CARE
        </h1>
        <p className="mt-6 max-w-[42rem] text-lg text-on-surface-muted">
          Order status, shipping, returns and the questions we get most
          often. Anything technical goes straight to the technical support line.
        </p>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 sm:px-8 py-16">
        <Eyebrow>Check your order</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-[clamp(1.4rem,5vw,1.875rem)] font-bold leading-[1.22] tracking-[-0.01em]">
          Look up an order
        </h2>
        <Card className="mt-8">
          <OrderLookup />
        </Card>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 sm:px-8 py-16">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-[clamp(1.4rem,5vw,1.875rem)] font-bold leading-[1.22] tracking-[-0.01em]">
          Frequent questions
        </h2>
        <div className="mt-8">
          <FaqAccordion />
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 sm:px-8 py-16">
        <Eyebrow>Policies</Eyebrow>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POLICIES.map((p) => (
            <Card key={p.title}>
              <h3 className="text-[18px] font-bold">{p.title}</h3>
              <p className="mt-2 text-sm text-on-surface-muted">{p.body}</p>
            </Card>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
