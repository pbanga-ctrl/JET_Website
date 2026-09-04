// Products page — Jet's off-the-shelf equipment line and proprietary OEM
// hardware/software, each rendered as a horizontally-scrollable
// ProductCarousel. Sourced from Sanity via lib/cms/products.ts, falling back
// per-group to lib/data/products.ts's PRODUCTS/OEM_PRODUCTS until (and
// unless) that CMS collection has content for that group. Products with a
// real photo show it; the rest fall back to the technical-drawing
// PlaceholderImage inside the same card shape, so the row stays visually
// consistent while photos are still being supplied.
import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ConversionBand } from "@/components/ui/ConversionBand";
import { PageTransition } from "@/components/ui/PageTransition";
import { ProductCarousel } from "@/components/products/ProductCarousel";
import { getProducts } from "@/lib/cms/products";
import type { Product } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Jet Automation's off-the-shelf equipment and proprietary OEM tech: palletizers, box erectors, robot cells, delta assembly, computer vision, OEE monitoring (X45C), remote I/O and Jet Sense AI.",
};

// Structured data (schema.org ItemList of Products) so search engines can
// pick up each product as a distinct entity, not just page text — this is
// what "SEO regulated" cashes out to for a page that's otherwise one long
// list of names.
function structuredData(products: Product[], oemProducts: Product[]) {
  const all = [...products, ...oemProducts];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: all.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.code ? `${p.title} (${p.code})` : p.title,
        description: p.body,
        brand: { "@type": "Brand", name: "JET Automation" },
        category: p.tag,
      },
    })),
  };
}

export default async function ProductsPage() {
  const { products, oemProducts } = await getProducts();

  return (
    <PageTransition>
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(products, oemProducts)) }}
      />

      <section className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-8 pb-16 pt-[88px] lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow>Products</Eyebrow>
          <h1 className="mt-6 text-[56px] font-bold leading-[1.02] tracking-[-0.03em] sm:text-[72px]">
            PRODUCTS
          </h1>
          <p className="mt-6 max-w-[42rem] text-lg text-on-surface-muted">
            Off-the-shelf equipment and proprietary OEM tech, built by the
            same team that does our custom integration work, so a
            palletizer, a vision system or a monitoring package shows up
            already speaking the same language as the rest of your line.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-8 py-16">
        <Eyebrow>Equipment line</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-[30px] font-bold leading-[1.2] tracking-[-0.01em]">
          Jet Products
        </h2>
        <div className="mt-12">
          <ProductCarousel products={products} />
        </div>
      </section>

      <section className="border-y border-border-dark bg-secondary py-24 text-on-dark">
        <div className="mx-auto max-w-[1200px] px-8">
          <Eyebrow dark>OEM tech</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-[30px] font-bold leading-[1.2] tracking-[-0.01em]">
            Built in-house, sold as OEM
          </h2>
          <p className="mt-4 max-w-[42rem] text-on-dark-muted">
            Hardware and software we developed to solve our own integration
            problems, packaged so any plant can run it: monitoring,
            distributed I/O and the AI watchdog behind it.
          </p>
          <div className="mt-12">
            <ProductCarousel products={oemProducts} dark />
          </div>
        </div>
      </section>

      <ConversionBand
        heading="Not sure which product fits?"
        body="Tell us the process and the constraint. We'll tell you whether it's a Jet product, a custom build, or both."
        ctaLabel="Talk to an engineer"
        ctaHref="/contact-us"
      />
    </>
    </PageTransition>
  );
}
