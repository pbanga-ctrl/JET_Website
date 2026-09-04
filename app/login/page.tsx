// Customer login page — static promo copy on the left, the actual
// login/signup tab UI (AuthCard) on the right. Note: there's no real
// backend here — see AuthCard.tsx for what that means in practice.
import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageTransition } from "@/components/ui/PageTransition";
import { AuthCard } from "@/components/login/AuthCard";

export const metadata: Metadata = { title: "Customer Login" };

const FEATURES = [
  "Order status and tracking",
  "Quote history with revisions",
  "As-built schematics and manuals",
];

export default function LoginPage() {
  return (
    <PageTransition>
      <section className="bg-secondary text-on-dark">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 px-8 py-24 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow dark>Customer portal</Eyebrow>
            <h1 className="mt-6 max-w-lg text-[44px] font-bold leading-[1.1] tracking-[-0.02em]">
              Orders, quotes and drawings in one place
            </h1>
            <p className="mt-4 max-w-md text-lg text-on-dark-muted">
              Track parts orders, retrieve as-built documentation, and
              reopen a past quote without digging through email threads.
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex gap-3 text-on-dark">
                  <span className="text-primary-bright">+</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <AuthCard />
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
