"use client";

// Home page "Featured products" interaction: a vertical tab list (product
// names) next to one large image + description that swaps when a tab is
// clicked, plus prev/next arrows to step through sequentially — the
// tab-list-drives-a-featured-panel pattern (e.g. vention.com/industries),
// rather than /products's side-scrolling row of small cards
// (components/products/ProductCarousel.tsx). Below `lg` the tabs become a
// horizontal scrollable chip row above the image.
//
// Auto-advances on a timer, but only while the section is actually on
// screen (IntersectionObserver) and only while the user isn't hovering or
// keyboard-focused inside it — and not at all under prefers-reduced-motion.
// Any manual tab/arrow click resets the timer so autoplay doesn't yank the
// panel away right after someone picks something on purpose.
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { Product } from "@/lib/data/products";

const AUTOPLAY_MS = 5000;

export function ProductTabCarousel({ products }: { products: Product[] }) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = products[active];

  function go(direction: 1 | -1) {
    setActive((i) => (i + direction + products.length) % products.length);
    setResetSignal((n) => n + 1);
  }

  function selectTab(i: number) {
    setActive(i);
    setResetSignal((n) => n + 1);
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setActive((i) => (i + 1) % products.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [inView, paused, products.length, resetSignal]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="grid grid-cols-1 gap-10 lg:grid-cols-12"
    >
      <div className="lg:col-span-5">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
          {products.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => selectTab(i)}
              aria-pressed={i === active}
              className={`flex-shrink-0 border-l-2 px-5 py-4 text-left transition-colors lg:w-full ${
                i === active
                  ? "border-primary-bright bg-secondary-raised"
                  : "border-border-dark hover:border-on-dark-muted"
              }`}
            >
              <span className="label-caps block text-on-dark-muted">
                {String(i + 1).padStart(2, "0")} ·{" "}
                {p.code ? `${p.tag} · ${p.code}` : p.tag}
              </span>
              <span className="mt-1 block whitespace-nowrap text-[17px] font-bold text-on-dark lg:whitespace-normal">
                {p.title}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 hidden gap-2 lg:flex">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous product"
            className="flex h-10 w-10 items-center justify-center border border-border-dark text-on-dark transition-colors hover:border-primary-bright hover:text-primary-bright"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next product"
            className="flex h-10 w-10 items-center justify-center border border-border-dark text-on-dark transition-colors hover:border-primary-bright hover:text-primary-bright"
          >
            →
          </button>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div
          key={current.slug}
          className="relative h-[280px] w-full animate-fade-in overflow-hidden sm:h-[380px]"
        >
          {current.image ? (
            <Image
              src={current.image.src}
              alt={current.image.alt}
              fill
              sizes="(min-width: 1024px) 620px, 100vw"
              className="object-cover"
            />
          ) : (
            <PlaceholderImage label={current.title} className="h-full" />
          )}
        </div>
        <p key={current.slug + "-body"} className="mt-6 max-w-xl animate-fade-in text-lg text-on-dark-muted">
          {current.body}
        </p>
        <ButtonLink href="/products" variant="secondary-on-dark" className="mt-6">
          View {current.title} →
        </ButtonLink>
      </div>
    </div>
  );
}
