"use client";

// Horizontally-scrollable, bigger-card catalog for a list of products —
// used for both the "Jet Products" and "OEM tech" sections on /products.
// Native CSS scroll-snap does the actual scrolling (so trackpad/touch swipe
// works with no JS at all); the arrow buttons just nudge it one card at a
// time via scrollBy for people who'd rather click than drag.
import Image from "next/image";
import { useRef } from "react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { Product } from "@/lib/data/products";

function ProductCard({
  product,
  index,
  dark,
}: {
  product: Product;
  index: number;
  dark: boolean;
}) {
  return (
    <div
      data-product-card
      className={`w-[300px] flex-shrink-0 snap-start sm:w-[360px] ${
        dark
          ? "border border-border-dark bg-secondary-raised"
          : "border border-border bg-surface-raised"
      }`}
    >
      <div className="relative h-[220px] w-full overflow-hidden">
        {product.image ? (
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(min-width: 640px) 360px, 300px"
            className="object-cover"
          />
        ) : (
          <PlaceholderImage label={product.title} className="h-full" />
        )}
      </div>
      <div className="p-6">
        <p className={`label-caps ${dark ? "text-primary-bright" : "text-primary"}`}>
          {String(index + 1).padStart(2, "0")} /{" "}
          {product.code ? `${product.tag} · ${product.code}` : product.tag}
        </p>
        <h3 className="mt-3 text-[20px] font-bold leading-[1.3]">{product.title}</h3>
        <p className={`mt-3 ${dark ? "text-on-dark-muted" : "text-on-surface-muted"}`}>
          {product.body}
        </p>
      </div>
    </div>
  );
}

export function ProductCarousel({
  products,
  dark = false,
}: {
  products: Product[];
  dark?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-product-card]");
    const gap = 24; // matches gap-6 below
    const amount = (card?.offsetWidth ?? 320) + gap;
    el.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

  const arrowClass = dark
    ? "border-border-dark text-on-dark hover:border-primary-bright hover:text-primary-bright"
    : "border-border text-on-surface hover:border-primary hover:text-primary";

  return (
    <div>
      <div
        ref={scrollerRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
      >
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} dark={dark} />
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollByCard(-1)}
          className={`flex h-10 w-10 items-center justify-center border transition-colors ${arrowClass}`}
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollByCard(1)}
          className={`flex h-10 w-10 items-center justify-center border transition-colors ${arrowClass}`}
        >
          →
        </button>
      </div>
    </div>
  );
}
