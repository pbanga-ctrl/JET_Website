// Careers landing page — intro, "why join us" cards, the list of open
// roles, and a catch-all general application CTA for candidates who don't
// match a specific posting. Roles come from Sanity via lib/cms/roles.ts,
// falling back to lib/data/roles.ts until (and unless) that CMS collection
// has content.
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { NumberedCard } from "@/components/ui/NumberedCard";
import { PageTransition } from "@/components/ui/PageTransition";
import { getRoles } from "@/lib/cms/roles";

export const metadata: Metadata = { title: "Careers" };

const WHY_CARDS = [
  { title: "Fast growing", body: "We're at an inflection point: growth means real responsibility early." },
  { title: "Great colleagues", body: "A closely tied, supportive team that debugs together at 2am and means it." },
  { title: "Take charge", body: "As much ownership as you're willing to take and show excellence in." },
  { title: "Don't stop learning", body: "An atmosphere where learning stays on the to-do list, not the wish list." },
  { title: "Cutting-edge tech", body: "Hands-on with robotics, safety PLCs and vision: current hardware, not legacy." },
  { title: "Cross-domain", body: "Technology, skilled trades and business people in the same room daily." },
];

export default async function CareersPage() {
  const { roles, openSlugs } = await getRoles();

  return (
    <PageTransition>
    <>
      <section className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-5 sm:px-8 pb-16 pt-[68px] sm:pt-[88px] lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow>Work with us</Eyebrow>
          <h1 className="mt-6 text-[clamp(2.15rem,9vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.02em] sm:leading-[1.02] sm:tracking-[-0.03em] lg:text-[72px]">
            CAREERS
          </h1>
          <p className="mt-6 max-w-[42rem] text-lg text-on-surface-muted">
            We’re looking for problem-solvers who want their work on a plant
            floor, not in a slide deck. Skilled trades, designers and
            technologists, with the room to take on as much as you’re
            willing to.
          </p>
          <ButtonLink href="#jobs" variant="primary" className="mt-8">
            Explore open roles ↓
          </ButtonLink>
        </div>
        <div className="lg:col-span-5">
          <PlaceholderImage
            label="team photo"
            size="800 × 900"
            className="h-full min-h-[420px]"
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 sm:px-8 py-16 sm:py-24">
        <Eyebrow>Why join us</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-[clamp(1.4rem,5vw,1.875rem)] font-bold leading-[1.22] tracking-[-0.01em]">
          Six honest reasons
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CARDS.map((c, i) => (
            <NumberedCard
              key={c.title}
              index={String(i + 1).padStart(2, "0")}
              tag={c.title.toUpperCase()}
            >
              {c.body}
            </NumberedCard>
          ))}
        </div>
      </section>

      <section className="border-y border-border-dark bg-secondary py-16 sm:py-24 text-on-dark">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow dark>About us</Eyebrow>
          </div>
          <p className="max-w-2xl text-lg text-on-dark-muted lg:col-span-7">
            We deliver fast, efficient and reliable automation and control
            solutions. From concept to execution we work alongside our
            clients to design systems that fit their process, safely and
            without drama on the floor.
          </p>
        </div>
      </section>

      <section id="jobs" className="mx-auto max-w-[1200px] scroll-mt-24 px-5 sm:px-8 py-16 sm:py-24">
        <Eyebrow>Open positions</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-[clamp(1.4rem,5vw,1.875rem)] font-bold leading-[1.22] tracking-[-0.01em]">
          Open roles
        </h2>
        <div className="mt-10 divide-y divide-border border border-border">
          {openSlugs.map((slug) => {
            const role = roles[slug];
            return (
              <Link
                key={slug}
                href={`/careers/${slug}`}
                transitionTypes={["nav-forward"]}
                className="group flex flex-wrap items-center justify-between gap-4 p-6 transition-colors hover:bg-surface-raised"
              >
                <div>
                  <h3 className="text-[22px] font-bold">{role.title}</h3>
                  <p className="spec-mono mt-1 text-on-surface-muted">
                    Mississauga · {role.type} · {role.dept}
                  </p>
                </div>
                <span className="label-caps border border-primary px-5 sm:px-8 py-4 text-primary transition-colors group-hover:bg-primary group-hover:text-surface">
                  View role
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border-dark bg-secondary py-16 sm:py-24 text-on-dark">
        <div className="drafting-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8">
          <h2 className="max-w-2xl text-[clamp(1.75rem,6.5vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.015em] sm:leading-[1.1] sm:tracking-[-0.02em]">
            Nothing fits? Send it anyway.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-on-dark-muted">
            We keep good résumés on file and call when the work matches.
          </p>
          <ButtonLink
            variant="signal"
            href="/careers/general"
            transitionTypes={["nav-forward"]}
            className="mt-8"
          >
            General application
          </ButtonLink>
        </div>
      </section>
    </>
    </PageTransition>
  );
}
