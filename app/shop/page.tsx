// Storefront listing. Products, categories, prices and stock come live from
// WooCommerce (lib/shop/woo.ts); this page renders them in the site's own
// design, and buying hands off to WooCommerce, which already owns cart,
// checkout, payment and orders.
//
// Every filter is a URL parameter rather than client state: the result is
// server-rendered, shareable, linkable and crawlable, and the page still works
// with JavaScript off. Only the quick-preview panel needs the client.
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ConversionBand } from "@/components/ui/ConversionBand";
import { PageTransition } from "@/components/ui/PageTransition";
import { ProductTile } from "@/components/shop/ProductTile";
import {
  getProducts,
  getCategories,
  shopConfigured,
  storeUrl,
  toPlainText,
  formatPrice,
  type SortKey,
} from "@/lib/shop/woo";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Automation parts from JET Automation: safety controllers, sensors, pneumatics, grippers, rotary actuators and more, in stock in Mississauga.",
};

const PER_PAGE = 24;

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "title", label: "A–Z" },
  { key: "price-asc", label: "Price ↑" },
  { key: "price-desc", label: "Price ↓" },
  { key: "newest", label: "Newest" },
];

type Search = {
  category?: string;
  q?: string;
  page?: string;
  sort?: string;
  min?: string;
  max?: string;
  stock?: string;
  sale?: string;
};

export default async function ShopPage(props: { searchParams: Promise<Search> }) {
  const sp = await props.searchParams;
  const pageNum = Math.max(1, Number(sp.page) || 1);
  const sort = (SORT_OPTIONS.find((s) => s.key === sp.sort)?.key ?? "title") as SortKey;
  const inStockOnly = sp.stock === "in";
  const onSaleOnly = sp.sale === "1";

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

  const categories = await getCategories();
  const categoryId = sp.category
    ? categories.find((c) => c.slug === sp.category)?.id
    : undefined;

  const { products, total, totalPages } = await getProducts({
    page: pageNum,
    perPage: PER_PAGE,
    categoryId,
    search: sp.q,
    minPrice: sp.min,
    maxPrice: sp.max,
    inStockOnly,
    onSaleOnly,
    sort,
  });

  // Build a URL preserving current filters, overriding only what changed.
  const href = (over: Partial<Search>) => {
    const merged: Search = { ...sp, ...over };
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) {
      if (!v) continue;
      if (k === "page" && v === "1") continue;
      if (k === "sort" && v === "title") continue;
      p.set(k, String(v));
    }
    const s = p.toString();
    return s ? `/shop?${s}` : "/shop";
  };

  const filtersActive = Boolean(
    sp.category || sp.q || sp.min || sp.max || inStockOnly || onSaleOnly
  );
  const store = storeUrl();

  return (
    <PageTransition>
      <>
        <section className="mx-auto max-w-[1200px] px-5 pb-8 pt-[68px] sm:px-8 sm:pt-[88px]">
          <Eyebrow>Shop</Eyebrow>
          <h1 className="mt-6 text-[clamp(2.15rem,9vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.02em] sm:leading-[1.02] sm:tracking-[-0.03em] lg:text-[72px]">
            PARTS COUNTER
          </h1>
          <p className="mt-6 max-w-[42rem] text-lg text-on-surface-muted">
            Sensors, safety controllers, pneumatics, grippers and actuators, on
            the shelf in Mississauga.
          </p>
        </section>

        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-5 pb-16 sm:px-8 lg:grid-cols-[240px_1fr]">
          {/* ---- Filters ---------------------------------------------- */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <form action="/shop" className="flex flex-col gap-5">
              {/* Carry non-form filters through a GET submit. */}
              {sp.category && <input type="hidden" name="category" value={sp.category} />}
              {sp.sort && <input type="hidden" name="sort" value={sp.sort} />}

              <div>
                <label className="label-caps text-on-surface-muted" htmlFor="q">
                  Search
                </label>
                <input
                  id="q"
                  type="search"
                  name="q"
                  defaultValue={sp.q ?? ""}
                  placeholder="Name or part number"
                  className="mt-2 w-full border border-border bg-surface-raised px-3 py-2.5 text-base text-on-surface placeholder:text-on-surface-muted focus:border-2 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <span className="label-caps text-on-surface-muted">Price (CAD)</span>
                <div className="mt-2 flex gap-2">
                  <input
                    type="number"
                    name="min"
                    min="0"
                    defaultValue={sp.min ?? ""}
                    placeholder="Min"
                    className="w-full min-w-0 border border-border bg-surface-raised px-2 py-2.5 text-base focus:border-2 focus:border-primary focus:outline-none"
                  />
                  <input
                    type="number"
                    name="max"
                    min="0"
                    defaultValue={sp.max ?? ""}
                    placeholder="Max"
                    className="w-full min-w-0 border border-border bg-surface-raised px-2 py-2.5 text-base focus:border-2 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="stock" value="in" defaultChecked={inStockOnly} />
                  In stock only
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="sale" value="1" defaultChecked={onSaleOnly} />
                  On sale
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="label-caps border border-primary bg-primary px-4 py-2.5 text-surface"
                >
                  Apply
                </button>
                {filtersActive && (
                  <Link
                    href="/shop"
                    className="label-caps border border-border px-4 py-2.5 text-on-surface-muted transition-colors hover:border-primary hover:text-primary"
                  >
                    Clear
                  </Link>
                )}
              </div>
            </form>

            {categories.length > 0 && (
              <div className="mt-8 border-t border-border pt-5">
                <span className="label-caps text-on-surface-muted">Categories</span>
                <ul className="mt-3 flex max-h-[320px] flex-col gap-1 overflow-y-auto lg:max-h-none">
                  <li>
                    <Link
                      href={href({ category: undefined, page: undefined })}
                      className={`block py-1 text-sm transition-colors hover:text-primary ${
                        !sp.category ? "font-bold text-primary" : "text-on-surface-muted"
                      }`}
                    >
                      All products
                    </Link>
                  </li>
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={href({ category: c.slug, page: undefined })}
                        className={`block py-1 text-sm transition-colors hover:text-primary ${
                          sp.category === c.slug ? "font-bold text-primary" : "text-on-surface-muted"
                        }`}
                      >
                        {c.name.replace(/&amp;/g, "&")}{" "}
                        <span className="spec-mono text-xs">({c.count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* ---- Results ---------------------------------------------- */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <p className="label-caps text-on-surface-muted">
                {total > 0
                  ? `${total} item${total === 1 ? "" : "s"}${sp.q ? ` for “${sp.q}”` : ""}`
                  : "No matches"}
              </p>
              <div className="flex flex-wrap items-center gap-1">
                <span className="label-caps text-on-surface-muted">Sort</span>
                {SORT_OPTIONS.map((o) => (
                  <Link
                    key={o.key}
                    href={href({ sort: o.key, page: undefined })}
                    className={`label-caps px-2 py-1.5 transition-colors ${
                      sort === o.key ? "text-primary" : "text-on-surface-muted hover:text-primary"
                    }`}
                  >
                    {o.label}
                  </Link>
                ))}
              </div>
            </div>

            {products.length === 0 ? (
              <div className="mt-8 border border-border bg-surface-raised p-10 text-center">
                <p className="text-lg">Nothing matched that.</p>
                <p className="mt-2 text-on-surface-muted">
                  Try a wider price range or fewer filters, or call 1-877-904-8724
                  and we will check the shelf.
                </p>
                <Link href="/shop" className="label-caps mt-6 inline-block text-primary underline">
                  Clear filters
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((p) => (
                    <ProductTile
                      key={p.id}
                      product={p}
                      storeUrl={store}
                      priceLabel={formatPrice(p.price)}
                      summary={toPlainText(p.short_description || p.description, 160)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-6">
                    {pageNum > 1 ? (
                      <Link
                        href={href({ page: String(pageNum - 1) })}
                        className="label-caps border border-border px-5 py-3 transition-colors hover:border-primary hover:text-primary"
                      >
                        ← Previous
                      </Link>
                    ) : (
                      <span />
                    )}
                    <span className="label-caps text-on-surface-muted">
                      Page {pageNum} of {totalPages}
                    </span>
                    {pageNum < totalPages ? (
                      <Link
                        href={href({ page: String(pageNum + 1) })}
                        className="label-caps border border-border px-5 py-3 transition-colors hover:border-primary hover:text-primary"
                      >
                        Next →
                      </Link>
                    ) : (
                      <span />
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </div>

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
