// Homepage — a single long scroll of static marketing sections (hero,
// stats, about, services, featured products, process, closing CTA).
// Copy/data for each section lives in the arrays below; only the hero has
// any interactivity (the 3D robot arm) or a non-CSS background (the
// looping video).
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for the commented-out fallback hero background below
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { NumberedCard } from "@/components/ui/NumberedCard";
import { ConversionBand } from "@/components/ui/ConversionBand";
import { MetricCounter, StaticMetric } from "@/components/ui/MetricCounter";
import { HeroRobotArm } from "@/components/home/HeroRobotArm";
import { ParallaxImage } from "@/components/home/ParallaxImage";
import { ProductTabCarousel } from "@/components/products/ProductTabCarousel";
import { PageTransition } from "@/components/ui/PageTransition";
import { PRODUCTS, OEM_PRODUCTS } from "@/lib/data/products";

const ABOUT_CARDS = [
  {
    tag: "QUALITY GUARANTEE",
    title: "Benefits at every level",
    body: "We build for the end result: gains that operators, maintenance and management all feel, not just a machine that passes buy-off.",
  },
  {
    tag: "CUSTOMER SERVICE",
    title: "One team on the floor",
    body: "People driven and people focused. Our engineers work so closely with your team you’ll forget we’re an independent company.",
  },
  {
    tag: "20+ YEARS",
    title: "Experience that transfers",
    body: "Our staff are our greatest asset: a wide, varied background that lets them take on new problems as they arise.",
  },
];

// `anchor` matches the section id on /services (lib/data/services.ts) so
// each item links straight to its own detail section, not just the top of
// the page.
const SERVICE_CARDS = [
  {
    tag: "INTELIGENT AI AUTOMATION",
    anchor: "s01",
    title: "Core competency",
    body: "We meet the automation challenge head on and engineer the solution that hits the outcome you need.",
  },
  {
    tag: "ELECTRICAL DESIGN",
    anchor: "s02",
    title: "In-house panel shop",
    body: "AutoCAD Electrical and EPLAN schematics, built down the hall: designs and builders under one roof.",
  },
  {
    tag: "MECHANICAL DESIGN",
    anchor: "s03",
    title: "Machines and motion",
    body: "Mechanical and mechatronics designers for custom builds, conveyors, pneumatics and vacuum systems.",
  },
  {
    tag: "CONTROL SYSTEMS",
    anchor: "s04",
    title: "Precise process control",
    body: "Hydraulic, pneumatic, temperature and pressure control: hardware and software developed together.",
  },
  {
    tag: "INDUSTRIAL SAFETY",
    anchor: "s06",
    title: "Not optional",
    body: "Safety PLCs, scanners and light curtains: new installs or upgrades to equipment already running.",
  },
  {
    tag: "ROBOTICS",
    anchor: "s05",
    title: "Cells and cobots",
    body: "From pick-and-place to full robotic cells, with 3D walkthroughs and proof-of-concept simulation first.",
  },
];

// Curated by the client (2 core mechanical products + the 3 OEM/AI ones,
// their most differentiated tech) rather than an automatic "first N" pick —
// see lib/data/products.ts for the full catalog shown on /products. Order
// here is the display order (client-specified), so it's a lookup + map
// over the slug list rather than a filter, which would instead follow
// PRODUCTS/OEM_PRODUCTS's own order regardless of this list's order.
const FEATURED_PRODUCT_SLUGS = ["oee", "remote-io", "jet-sense-ai", "palletizer", "box-erector"];
const PRODUCTS_BY_SLUG = new Map([...PRODUCTS, ...OEM_PRODUCTS].map((p) => [p.slug, p]));
const FEATURED_PRODUCTS = FEATURED_PRODUCT_SLUGS.map((slug) => PRODUCTS_BY_SLUG.get(slug)!);

const PROCESS_STEPS = [
  { step: "01", title: "Scope", body: "Site walk, cycle-time targets, constraints, budget envelope." },
  { step: "02", title: "Design", body: "Mechanical layout, schematics, 3D walkthrough and sign-off." },
  { step: "03", title: "Build", body: "Panel build, assembly and factory acceptance in our shop." },
  { step: "04", title: "Commission", body: "Install, debug, operator training and documentation handover." },
];

export default function HomePage() {
  return (
    <PageTransition>
    <>
      {/* Hero — fills the viewport on load; the header stays hidden until scroll */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/* Original static plant-photo background — kept here (disabled) as
            an easy fallback if the video background gets swapped out.
        <Image
          src="/images/hero-plant.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-surface/60" />
        */}

        {/* Looping video background. Muted + autoPlay + playsInline is the
            combination browsers require to autoplay without a user
            gesture; the plant photo doubles as the poster frame so there's
            no blank flash before the video's first frame decodes. */}
        <video
          className="h-full w-full object-cover"
          src="/videos/hero-background.mp4"
          poster="/images/hero-plant.jpg"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Gradient blur scrim. Two variants because the copy occupies a
            different share of the frame per breakpoint: on desktop it sits in
            a left column, so the scrim fades out by the robot-arm column and
            leaves the footage clear. On phones the copy spans the full width,
            so a horizontal fade would leave its right third sitting on top of
            unmasked video — there the scrim covers everything and only eases
            off below the content. */}
        <div
          className="absolute inset-0 bg-surface/78 backdrop-blur-lg md:hidden"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, black 88%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 88%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden bg-surface/70 backdrop-blur-lg md:block"
          style={{
            maskImage:
              "linear-gradient(to right, black 0%, black 45%, transparent 68%)",
            WebkitMaskImage:
              "linear-gradient(to right, black 0%, black 45%, transparent 68%)",
          }}
        />
      </div>
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="max-w-2xl">
          <Eyebrow>INTELLIGENT AI AUTOMATION · controls · robotics</Eyebrow>
          <h1 className="mt-6 text-[clamp(2.15rem,9vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.02em] sm:leading-[1.02] sm:tracking-[-0.03em] lg:text-[72px]">
            FAST.
            <br />
            EFFICIENT.
            <br />
            RELIABLE.
          </h1>
          <p className="mt-6 max-w-[42rem] text-lg text-on-surface-muted">
            Jet Automation engineers, builds and commissions automation for
            manufacturers: robotic cells, control systems, electrical
            panels and safety upgrades. Engineering and panel shop under
            one roof in Mississauga.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/contact-us" variant="signal">
              Request a quote
            </ButtonLink>
            <ButtonLink href="/services" variant="secondary">
              View capabilities
            </ButtonLink>
          </div>
        </div>
      </div>
      </section>

      {/* Stats band */}
      <section className="relative overflow-hidden border-y border-border-dark bg-secondary py-28 text-on-dark">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <Eyebrow dark>By the numbers</Eyebrow>
          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-14 lg:grid-cols-4">
            <MetricCounter target={16} suffix="+" label="Years in operation" delay={0} />
            <MetricCounter target={20} suffix="+" label="Service lines" delay={0.1} />
            <MetricCounter target={4} label="Panel shop bays" delay={0.2} />
            <StaticMetric value="24/7" label="Breakdown support" />
          </div>
        </div>
      </section>

      {/* About us */}
      <section className="relative overflow-hidden border-y border-border-dark bg-secondary py-16 sm:py-24 text-on-dark">
        <div className="drafting-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8">
          <Eyebrow dark>About us</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.4rem,5vw,1.875rem)] font-bold leading-[1.22] tracking-[-0.01em]">
            Why plant teams keep calling us back
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {ABOUT_CARDS.map((c, i) => (
              <NumberedCard
                key={c.tag}
                index={String(i + 1).padStart(2, "0")}
                tag={c.tag}
                title={c.title}
                dark
              >
                {c.body}
              </NumberedCard>
            ))}
          </div>
        </div>
      </section>

      {/* What we do — the 3D robot arm moved here from the hero; the tile
          grid is gone in favour of a plain list so the arm has room to
          breathe instead of competing with six bordered boxes. */}
      <section className="mx-auto max-w-[1200px] px-5 sm:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <HeroRobotArm />
          </div>
          <div className="lg:col-span-7">
            <Eyebrow>What we do</Eyebrow>
            <h2 className="mt-4 max-w-2xl text-[clamp(1.4rem,5vw,1.875rem)] font-bold leading-[1.22] tracking-[-0.01em]">
              Six service lines, one roof
            </h2>
            <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {SERVICE_CARDS.map((c) => (
                <li key={c.tag}>
                  <Link href={`/services#${c.anchor}`} className="group block">
                    <p className="label-caps text-primary">{c.tag}</p>
                    <p className="relative mt-2 inline-block font-bold transition-colors group-hover:text-primary">
                      {c.title}
                      <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-200 ease-out group-hover:scale-x-100" />
                    </p>
                    <p className="mt-1 text-sm text-on-surface-muted">{c.body}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <ButtonLink href="/services" variant="secondary" className="mt-8">
              All services →
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="border-y border-border-dark bg-secondary py-16 sm:py-24 text-on-dark">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow dark>Products</Eyebrow>
              <h2 className="mt-4 max-w-2xl text-[clamp(1.4rem,5vw,1.875rem)] font-bold leading-[1.22] tracking-[-0.01em]">
                Automation with Inteligence™
              </h2>
            </div>
            <ButtonLink href="/products" variant="secondary-on-dark">
              All products →
            </ButtonLink>
          </div>
          <div className="mt-12">
            <ProductTabCarousel products={FEATURED_PRODUCTS} />
          </div>
        </div>
      </section>

      {/* How we work — parallax photo background (ParallaxImage is a
          client component for the GSAP scroll-linked drift; everything
          else here stays server-rendered). Step tiles are frosted/
          translucent instead of opaque so the photo shows through them
          too, not just in the gaps. */}
      <section className="relative overflow-hidden border-y border-border-dark py-16 sm:py-24 text-on-dark">
        <div className="absolute inset-0 -z-10">
          <ParallaxImage src="/images/how-we-work-bg.jpg" alt="" />
          <div className="absolute inset-0 bg-secondary/75" />
        </div>
        <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8">
          <Eyebrow dark>How we work</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.4rem,5vw,1.875rem)] font-bold leading-[1.22] tracking-[-0.01em]">
            Concept to commissioning
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((s, i) => (
              <div
                key={s.step}
                className={`bg-secondary/70 p-6 backdrop-blur-sm ${i === 0 ? "border-t-2 border-t-primary-bright" : "border-t border-t-border-dark"}`}
              >
                <p className="label-caps text-on-dark-muted">
                  STEP {s.step}
                </p>
                <h3 className="mt-2 text-[22px] font-bold">{s.title}</h3>
                <p className="mt-2 text-on-dark-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConversionBand
        heading="Bring us the hard one."
        body="Send drawings, a cycle-time target, or just the problem. An engineer, not a form robot, replies within one business day."
        ctaLabel="Request a quote"
        ctaHref="/contact-us"
      />
    </>
    </PageTransition>
  );
}
