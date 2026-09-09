// Full-width dark closing CTA band used at the bottom of the home and
// services pages. `.drafting-grid` (globals.css) draws the faint blueprint
// grid backdrop; content sits above it via `relative`.
import { ButtonLink } from "./Button";

export function ConversionBand({
  heading,
  body,
  ctaLabel,
  ctaHref,
}: {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-border-dark bg-secondary py-16 sm:py-24 text-on-dark">
      <div className="drafting-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8">
        <h2 className="max-w-2xl text-[clamp(1.75rem,6.5vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.015em] sm:leading-[1.1] sm:tracking-[-0.02em]">
          {heading}
        </h2>
        <p className="mt-4 max-w-xl text-lg text-on-dark-muted">{body}</p>
        <ButtonLink variant="signal" href={ctaHref} className="mt-8">
          {ctaLabel}
        </ButtonLink>
      </div>
    </section>
  );
}
