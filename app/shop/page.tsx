// Storefront listing. Products, categories, prices and stock come live from
// WooCommerce (lib/shop/woo.ts) — this page renders them in the site's own
// design, and buying hands off to WooCommerce, which already owns cart,
// checkout, payment and orders.
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ConversionBand } from "@/components/ui/ConversionBand";
import { PageTransition } from "@/components/ui/PageTransition";
import {
  getProducts,
  getCategories,
  shopConfigured,
  toPlainText,
  formatPrice,
  type WooProduct,
} from "@/lib/shop/woo";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Automation parts from JET Automation: safety controllers, sensors, pneumatics, grippers, rotary actuators and more, in stock in Mississauga.",
};

function ProductCard({ product }: { product: WooProduct }) {
  const img = product.images?.[0];
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col border border-border bg-surface-raised transition-shadow hover:shadow-[5px_5px_0_0_var(--color-on-surface)]"
    >
      <div className="relative h-[200px] w-full overflow-hidden border-b border-border bg-surface">
        {img ? (
          <Image
            src={img.src}
            alt={img.alt || product.name}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
            className="object-contain p-4"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="label-caps text-on-surface-muted">No photo</span>
          </div>
        )}
        {product.on_sale && (
          <span className="label-caps absolute left-0 top-0 bg-tertiary px-2 py-1 text-on-surface">
            Sale
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="label-caps text-on-surface-muted">{product.sku || "—"}</p>
        <h2 className="mt-2 text-[16px] font-bold leading-[1.3] group-hover:text-primary">
          {product.name}
        </h2>
        <p className="mt-2 flex-1 text-sm text-on-surface-muted">
          {toPlainText(product.short_description || product.description, 90)}
        </p>
        <div className="mt-4 flex items-baseline justify-between gap-2">
          <span className="spec-mono text-[17px] font-medium">{formatPrice(product.price)}</span>
          <span
            className={`label-caps ${
              product.stock_status === "instock" ? "text-success" : "text-on-surface-muted"
            }`}
          >
            {product.stock_status === "instock" ? "In stock" : "Enquire"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function ShopPage(props: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const { category, q, page } = await props.searchParams;
  const pageNum = Math.max(1, Number(page) || 1);

  // The store being unreachable shouldn't take the page down — say so plainly
  // and keep the phone number in front of people.
  if (!shopConfigured) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-[1200px] px-5 pb-16 pt-[68px] sm:px-8 sm:pb-24 sm:pt-[88px]">
          <Eyebrow>Shop</Eyebrow>
          <h1 className="mt-6 text-[clamp(2.15rem,9vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.02em] sm:leading-[1.02] sm:tracking-[-0.03em] lg:text-[72px]">
            SHOP
          </h1>
          <p className="mt-6 max-w-[42rem] text-lg text-on-surface-muted">
            The parts catalogue is being connected. Call 1-877-904-8724 and we
            will check stock for you directly.
          </p>
        </section>
      </PageTransition>
    );
  }

  // Categories first: the product query needs the numeric id, and the list is
  // cached for an hour so this costs almost nothing.
  const categories = await getCategories();
  const categoryId = category
    ? categories.find((c) => c.slug === category)?.id
    : undefined;
  const products = await getProducts({
    page: pageNum,
    perPage: 24,
    categoryId,
    search: q,
  });

  const qs = (over: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { category, q, page: String(pageNum), ...over };
    for (const [k, v] of Object.entries(merged)) if (v && v !== "1") p.set(k, v);
    const s = p.toString();
    return s ? `/shop?${s}` : "/shop";
  };

  return (
    <PageTransition>
      <>
        <section className="mx-auto max-w-[1200px] px-5 pb-10 pt-[68px] sm:px-8 sm:pt-[88px]">
          <Eyebrow>Shop</Eyebrow>
          <h1 className="mt-6 text-[clamp(2.15rem,9vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.02em] sm:leading-[1.02] sm:tracking-[-0.03em] lg:text-[72px]">
            PARTS COUNTER
          </h1>
          <p className="mt-6 max-w-[42rem] text-lg text-on-surface-muted">
            Sensors, safety controllers, pneumatics, grippers and actuators,
            on the shelf in Mississauga. Can&apos;t see what you need? Call the
            counter and we will source it.
          </p>

          <form action="/shop" className="mt-8 flex max-w-xl flex-wrap gap-2">
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search by name or part number…"
              className="min-w-0 flex-1 border border-border bg-surface-raised px-3 py-2.5 text-base text-on-surface placeholder:text-on-surface-muted focus:border-2 focus:border-primary focus:outline-none"
            />
            {category && <input type="hidden" name="category" value={category} />}
            <button
              type="submit"
              className="label-caps shrink-0 border border-primary bg-primary px-5 py-2.5 text-surface"
            >
              Search
            </button>
          </form>
        </section>

        {categories.length > 0 && (
          <nav className="border-y border-border bg-surface">
            <div className="no-scrollbar mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-5 py-3 sm:px-8 sm:py-4">
              <Link
                href={qs({ category: undefined, page: undefined })}
                className={`label-caps whitespace-nowrap px-2 py-2 text-[9px] tracking-[0.06em] transition-colors sm:px-3 sm:text-[12px] sm:tracking-[0.1em] ${
                  !category ? "text-primary" : "text-on-surface-muted hover:text-primary"
                }`}
              >
                All
              </Link>
              {categories.slice(0, 18).map((c) => (
                <Link
                  key={c.id}
                  href={qs({ category: c.slug, page: undefined })}
                  className={`label-caps whitespace-nowrap px-2 py-2 text-[9px] tracking-[0.06em] transition-colors sm:px-3 sm:text-[12px] sm:tracking-[0.1em] ${
                    category === c.slug ? "text-primary" : "text-on-surface-muted hover:text-primary"
                  }`}
                >
                  {c.name} ({c.count})
                </Link>
              ))}
            </div>
          </nav>
        )}

        <section className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16">
          {products.length === 0 ? (
            <div className="border border-border bg-surface-raised p-10 text-center">
              <p className="text-lg">Nothing matched that.</p>
              <p className="mt-2 text-on-surface-muted">
                Try a different term, or call 1-877-904-8724 and we will check the shelf.
              </p>
              <Link href="/shop" className="label-caps mt-6 inline-block text-primary underline">
                Clear filters
              </Link>
            </div>
          ) : (
            <>
              <p className="label-caps text-on-surface-muted">
                {products.length} item{products.length === 1 ? "" : "s"}
                {category ? " in this category" : ""}
                {q ? ` matching "${q}"` : ""}
              </p>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              <div className="mt-12 flex items-center justify-between gap-4">
                {pageNum > 1 ? (
                  <Link
                    href={qs({ page: String(pageNum - 1) })}
                    className="label-caps border border-border px-5 py-3 transition-colors hover:border-primary hover:text-primary"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span />
                )}
                {products.length === 24 && (
                  <Link
                    href={qs({ page: String(pageNum + 1) })}
                    className="label-caps border border-border px-5 py-3 transition-colors hover:border-primary hover:text-primary"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </>
          )}
        </section>

        <ConversionBand
          heading="Need something not on the shelf?"
          body="Tell us the part number or the application. We source automation components daily and can usually quote the same day."
          ctaLabel="Ask the counter"
          ctaHref="/contact-us"
        />
      </>
    </PageTransition>
  );
}
