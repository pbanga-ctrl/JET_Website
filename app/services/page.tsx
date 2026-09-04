// Services page — intro, a sticky sub-nav that anchor-links to each service
// section (ids s01..s06 match the nav hrefs), then the scrollytelling
// text/image layout (ServiceScroller), a capability matrix table and a
// closing CTA. Sections come from Sanity via lib/cms/services.ts, falling
// back to lib/data/services.ts's SECTIONS until (and unless) that CMS
// collection has content — add a service in either place and both the
// sub-nav and scroller pick it up, since both render off this same fetch.
import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ConversionBand } from "@/components/ui/ConversionBand";
import { PageTransition } from "@/components/ui/PageTransition";
import { ServiceScroller } from "@/components/services/ServiceScroller";
import { getServiceSections } from "@/lib/cms/services";

export const metadata: Metadata = { title: "Services" };

// The first four rows had real lead-time/compliance figures already; the
// rest were folded in from the client's services list (welding through PM
// analysis) which only gave names, no figures — "On request" and "—" there
// rather than inventing precision we don't have.
const MATRIX = [
  { cap: "Controls engineering & PLC code", inhouse: true, lead: "2–4 wks" /* compliance: "CSA" */ },
  { cap: "Panel build & wiring", inhouse: true, lead: "3–6 wks" /* compliance: "UL 508A" */ },
  { cap: "Robot integration & simulation", inhouse: true, lead: "6–12 wks" /* compliance: "RIA 15.06" */ },
  { cap: "Safety assessment & upgrade", inhouse: true, lead: "1–3 wks" /* compliance: "CSA Z432" */ },
  { cap: "Welding (all materials)", inhouse: true, lead: "On request" /* compliance: "—" */ },
  { cap: "Plasma cutting", inhouse: true, lead: "On request" /* compliance: "—" */ },
  { cap: "Hardware design & build", inhouse: true, lead: "On request" /* compliance: "—" */ },
  { cap: "Electrical installation", inhouse: true, lead: "On request" /* compliance: "—" */ },
  { cap: "Software services", inhouse: true, lead: "On request" /* compliance: "—" */ },
  { cap: "Site survey", inhouse: true, lead: "On request" /* compliance: "—" */ },
  { cap: "Site inspection", inhouse: true, lead: "On request" /* compliance: "—" */ },
  { cap: "Preventive maintenance analysis", inhouse: true, lead: "On request" /* compliance: "—" */ },
];

export default async function ServicesPage() {
  const sections = await getServiceSections();

  return (
    <PageTransition>
    <>
      <section className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-8 pb-16 pt-[88px] lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow>Services / overview</Eyebrow>
          <h1 className="mt-6 text-[56px] font-bold leading-[1.02] tracking-[-0.03em] sm:text-[72px]">
            SERVICES
          </h1>
          <p className="mt-6 max-w-[42rem] text-lg text-on-surface-muted">
            Engineering, controls, panel build and robotics integration,
            delivered by one team, so nothing is lost between disciplines.
          </p>
        </div>
      </section>

      <nav className="sticky top-[65px] z-40 mb-10 border-y border-border bg-surface">
        <div className="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-8 py-4">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="label-caps whitespace-nowrap px-3 py-2 text-on-surface-muted transition-colors hover:text-primary"
            >
              {s.index} {s.tag.charAt(0) + s.tag.slice(1).toLowerCase()}
            </a>
          ))}
        </div>
      </nav>

      <ServiceScroller sections={sections} />

      <section className="mx-auto max-w-[1200px] px-8 py-24">
        <Eyebrow>Capability matrix</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-[30px] font-bold leading-[1.2] tracking-[-0.01em]">
          What’s in-house
        </h2>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="label-caps border-b border-border text-left text-on-surface-muted">
                <th className="py-3 pr-4 font-medium">Capability</th>
                <th className="py-3 pr-4 font-medium">In-house</th>
                <th className="py-3 pr-4 font-medium">Typical lead</th>
                {/* <th className="py-3 pr-4 font-medium">Compliance</th> */}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row) => (
                <tr key={row.cap} className="border-b border-border">
                  <td className="py-3 pr-4">{row.cap}</td>
                  <td className="py-3 pr-4 spec-mono text-success">■ Yes</td>
                  <td className="py-3 pr-4 spec-mono">{row.lead}</td>
                  {/* <td className="py-3 pr-4 spec-mono">{row.compliance}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ConversionBand
        heading="Scope it with an engineer"
        body="Tell us the process, the target and the constraint. We'll come back with an approach and a range."
        ctaLabel="Request a quote"
        ctaHref="/contact-us"
      />
    </>
    </PageTransition>
  );
}
