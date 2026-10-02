"use client";

// Product tile with a quick-preview panel. The tile itself is a real link, so
// it works without JS and search engines follow it; the preview button is an
// enhancement for scanning a grid quickly without losing your place.
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { WooProduct } from "@/lib/shop/woo";

type Props = {
  product: WooProduct;
  storeUrl: string;
  priceLabel: string;
  summary: string;
};

export function ProductTile({ product, storeUrl, priceLabel, summary }: Props) {
  const [preview, setPreview] = useState(false);
  const img = product.images?.[0];
  const inStock = product.inStock;

  return (
    <>
      <div className="group relative flex flex-col border border-border bg-surface-raised transition-shadow hover:shadow-[5px_5px_0_0_var(--color-on-surface)]">
        <Link href={`/shop/${product.slug}`} className="block">
          <div className="relative h-[190px] w-full overflow-hidden border-b border-border bg-surface">
            {img ? (
              <Image
                src={img.src}
                alt={img.alt || product.name}
                fill
                sizes="(min-width: 1280px) 260px, (min-width: 640px) 40vw, 90vw"
                className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="label-caps text-on-surface-muted">No photo</span>
              </div>
            )}
            {product.onSale && (
              <span className="label-caps absolute left-0 top-0 bg-tertiary px-2 py-1 text-on-surface">
                Sale
              </span>
            )}
            {!inStock && (
              <span className="label-caps absolute right-0 top-0 bg-secondary px-2 py-1 text-on-dark">
                Enquire
              </span>
            )}
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-4">
          <p className="label-caps text-on-surface-muted">{product.sku || "—"}</p>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="mt-2 text-[15px] font-bold leading-[1.35] transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <div className="mt-3 flex flex-1 items-end justify-between gap-2">
            <span className="spec-mono text-[16px] font-medium">{priceLabel}</span>
            <button
              type="button"
              onClick={() => setPreview(true)}
              className="label-caps text-on-surface-muted underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-secondary/70 p-4"
          onClick={() => setPreview(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-[720px] overflow-y-auto border border-border bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div>
                <p className="label-caps text-on-surface-muted">{product.sku || "—"}</p>
                <h3 className="mt-1 text-[20px] font-bold leading-[1.25]">{product.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreview(false)}
                aria-label="Close preview"
                className="shrink-0 text-on-surface-muted transition-colors hover:text-on-surface"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              <div className="relative h-[220px] border border-border bg-surface-raised">
                {img ? (
                  <Image
                    src={img.src}
                    alt={img.alt || product.name}
                    fill
                    sizes="340px"
                    className="object-contain p-4"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="label-caps text-on-surface-muted">No photo</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <dl className="divide-y divide-border border-y border-border">
                  <div className="flex justify-between gap-3 py-2.5">
                    <dt className="label-caps text-on-surface-muted">Price</dt>
                    <dd className="spec-mono font-medium">{priceLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-3 py-2.5">
                    <dt className="label-caps text-on-surface-muted">Stock</dt>
                    <dd className={`spec-mono ${inStock ? "text-success" : "text-on-surface-muted"}`}>
                      {inStock ? "In stock" : "Enquire"}
                    </dd>
                  </div>
                  {product.categories?.[0] && (
                    <div className="flex justify-between gap-3 py-2.5">
                      <dt className="label-caps text-on-surface-muted">Category</dt>
                      <dd className="text-right text-sm">
                        {product.categories[0].name}
                      </dd>
                    </div>
                  )}
                </dl>

                {summary && (
                  <p className="mt-4 flex-1 text-sm text-on-surface-muted">{summary}</p>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {inStock ? (
                    <a
                      href={`${storeUrl}/cart/?add-to-cart=${product.id}`}
                      className="label-caps bg-tertiary px-4 py-2.5 text-on-surface"
                    >
                      Add to cart ↗
                    </a>
                  ) : (
                    <Link href="/contact-us" className="label-caps bg-primary px-4 py-2.5 text-surface">
                      Ask about it
                    </Link>
                  )}
                  <Link
                    href={`/shop/${product.slug}`}
                    className="label-caps border border-primary px-4 py-2.5 text-primary"
                  >
                    Full details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
