// Shared shell for the three legal pages (cookie/privacy/terms) — a
// heading, "last updated" date, optional intro/actions, and a list of
// SECTIONS rendered as heading + paragraphs + optional bullet list. Each
// page owns only its own SECTIONS data array; the layout lives here once.
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageTransition } from "@/components/ui/PageTransition";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export function LegalPage({
  eyebrow,
  title,
  lastUpdated,
  intro,
  actions,
  sections,
  footnote,
}: {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro?: string;
  actions?: React.ReactNode;
  sections: LegalSection[];
  footnote?: string;
}) {
  return (
    <PageTransition>
      <section className="mx-auto max-w-[1200px] px-8 pb-24 pt-[88px]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-2xl text-[44px] font-bold leading-[1.1] tracking-[-0.02em]">
          {title}
        </h1>
        <p className="spec-mono mt-4 text-on-surface-muted">
          Last updated: {lastUpdated}
        </p>

        {intro && (
          <p className="mt-8 max-w-[42rem] text-lg text-on-surface-muted">
            {intro}
          </p>
        )}

        {actions && <div className="mt-6">{actions}</div>}

        <div className="mt-12 max-w-[42rem] divide-y divide-border border-t border-border">
          {sections.map((s) => (
            <div key={s.heading} className="py-8">
              <h2 className="text-[22px] font-bold leading-[1.3]">
                {s.heading}
              </h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="mt-3 text-on-surface-muted">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="mt-3 flex flex-col gap-2">
                  {s.list.map((item) => (
                    <li key={item} className="flex gap-3 text-on-surface-muted">
                      <span className="text-primary">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {footnote && (
          <p className="spec-mono mt-12 max-w-[42rem] text-xs text-on-surface-muted">
            {footnote}
          </p>
        )}
      </section>
    </PageTransition>
  );
}
