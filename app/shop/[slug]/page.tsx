// Product detail. Rendered here in the site's design; the "Add to cart" button
// hands off to WooCommerce, which owns cart, checkout, payment and the order
// record. Nothing about a purchase is duplicated on this side.
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageTransition } from "@/components/ui/PageTransition";
import { ConversionBand } from "@/components/ui/ConversionBand";
import {
  getProductBySlug,
  shopConfigured,
  toPlainText,
  formatPrice,
  storeUrl,
} from "@/lib/shop/woo";

export async function generateMetadata(
  props: PageProps<"/shop/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = shopConfigured ? await getProductBySlug(slug) : null;
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: toPlainText(product.short_description || product.description, 155),
  };
}

export default async function ProductPage(props: PageProps<"/shop/[slug]">) {
  const { slug } = await props.params;
  if (!shopConfigured) notFound();

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const img = product.images?.[0];
  const inStock = product.inStock;
  // Deep link straight into WooCommerce's cart so the item is already there.
  const buyHref = `${storeUrl()}/cart/?add-to-cart=${product.id}`;

  return (
    <PageTransition>
      <>
        <section className="mx-auto max-w-[1200px] px-5 pb-12 pt-[68px] sm:px-8 sm:pt-[88px]">
          <Link
            href="/shop"
            className="label-caps text-on-surface-muted transition-colors hover:text-primary"
          >
            ← Parts counter
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="relative h-[320px] w-full border border-border bg-surface-raised sm:h-[440px]">
                {img ? (
                  <Image
                    src={img.src}
                    alt={img.alt || product.name}
                    fill
                    sizes="(min-width: 1024px) 560px, 92vw"
                    className="object-contain p-6"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="label-caps text-on-surface-muted">No photo supplied</span>
                  </div>
                )}
              </div>
              {product.images?.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {product.images.slice(1, 5).map((im) => (
                    <div key={im.src} className="relative h-20 border border-border bg-surface-raised">
                      <Image
                        src={im.src}
                        alt={im.alt || product.name}
                        fill
                        sizes="120px"
                        className="object-contain p-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-6">
              <Eyebrow>
                {product.categories?.[0]?.name
                  ? product.categories[0].name
                  : "Parts"}
              </Eyebrow>
              <h1 className="mt-4 text-[clamp(1.75rem,6.5vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.015em] sm:leading-[1.1] sm:tracking-[-0.02em]">
                {product.name}
              </h1>

              <dl className="mt-6 divide-y divide-border border-y border-border">
                <div className="flex justify-between gap-4 py-3">
                  <dt className="label-caps text-on-surface-muted">Part number</dt>
                  <dd className="spec-mono">{product.sku || "—"}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="label-caps text-on-surface-muted">Price</dt>
                  <dd className="spec-mono text-[18px] font-medium">
                    {formatPrice(product.price)}
                    {product.onSale && product.regularPrice && (
                      <span className="ml-2 text-on-surface-muted line-through">
                        {formatPrice(product.regularPrice)}
                      </span>
                    )}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="label-caps text-on-surface-muted">Availability</dt>
                  <dd className={`spec-mono ${inStock ? "text-success" : "text-on-surface-muted"}`}>
                    {inStock ? "■ In stock" : "Enquire for lead time"}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                {inStock ? (
                  <a
                    href={buyHref}
                    className="label-caps inline-flex items-center justify-center whitespace-nowrap bg-tertiary px-5 py-3 text-on-surface transition-[background-color,transform] hover:-translate-x-1 hover:-translate-y-1 hover:bg-tertiary-deep hover:shadow-[5px_5px_0_0_var(--color-on-surface)] sm:px-[32px] sm:py-[16px]"
                  >
                    Add to cart ↗
                  </a>
                ) : (
                  <Link
                    href="/contact-us"
                    className="label-caps inline-flex items-center justify-center whitespace-nowrap bg-primary px-5 py-3 text-surface transition-[background-color,transform] hover:-translate-x-1 hover:-translate-y-1 sm:px-[32px] sm:py-[16px]"
                  >
                    Ask about this part
                  </Link>
                )}
                <a
                  href={product.permalink}
                  className="label-caps inline-flex items-center justify-center whitespace-nowrap border border-primary px-5 py-3 text-primary transition-colors hover:bg-primary hover:text-surface sm:px-[32px] sm:py-[16px]"
                >
                  View in store ↗
                </a>
              </div>

              <p className="mt-3 text-sm text-on-surface-muted">
                Checkout, shipping and order history are handled in our store.
              </p>

              {(product.short_description || product.description) && (
                <div className="mt-8 border-t border-border pt-6">
                  <p className="max-w-[42rem] whitespace-pre-line text-on-surface-muted">
                    {toPlainText(product.description || product.short_description, 1200)}
                  </p>
                </div>
              )}

              {product.categories?.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {product.categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/shop?category=${c.slug}`}
                      className="label-caps border border-border px-3 py-1.5 text-on-surface-muted transition-colors hover:border-primary hover:text-primary"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <ConversionBand
          heading="Need it specified, not just shipped?"
          body="Tell us the machine and the problem. We will tell you whether this is the right part, or what is."
          ctaLabel="Talk to a specialist"
          ctaHref="/contact-us"
        />
      </>
    </PageTransition>
  );
}
