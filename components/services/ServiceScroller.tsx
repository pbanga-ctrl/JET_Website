"use client";

// Scrollytelling layout for the six services on /services: text scrolls
// normally in the left column while a single image panel stays pinned
// (`sticky`) in the right column, crossfading to match whichever section's
// text is currently in view. Below `lg`, columns stack (no room for a
// pinned panel), so each section instead gets its own inline image — see
// the `lg:hidden` block at the end of each text entry.
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { Section } from "@/lib/data/services";

// Renders a section's real photo when available, full and uncropped-edge
// (just object-cover fill), and falls back to the technical-drawing
// PlaceholderImage otherwise (currently just Robotics, which has no
// supplied photo yet).
function ServiceMedia({
  section,
  className = "",
}: {
  section: Section;
  className?: string;
}) {
  const photo = section.photo;
  if (photo) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 420px, 100vw"
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <PlaceholderImage
      label={section.imageLabel}
      size={section.imageSize}
      className={className}
    />
  );
}

export function ServiceScroller({ sections }: { sections: Section[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const textEls = containerRef.current?.querySelectorAll<HTMLElement>(
        "[data-service-text]"
      );
      if (!textEls) return;

      // All panels start stacked at opacity 0 except the first — crossfade
      // targets one in, the rest out, on every activation.
      gsap.set(imageRefs.current, { opacity: 0 });
      gsap.set(imageRefs.current[0], { opacity: 1 });

      function activate(index: number) {
        imageRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.to(el, {
            opacity: i === index ? 1 : 0,
            duration: 0.5,
            ease: "power1.inOut",
            overwrite: true,
          });
        });
      }

      // One ScrollTrigger per text block: crossing its vertical center
      // (scrolling down into it, or back up into it) makes it the active
      // image — this is what keeps the pinned image in sync with whichever
      // section's text is currently next to it.
      textEls.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => activate(i),
          onEnterBack: () => activate(i),
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="mx-auto max-w-[1200px] px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="divide-y divide-border lg:col-span-7">
          {sections.map((s) => (
            <div
              key={s.id}
              id={s.id}
              data-service-text
              className="scroll-mt-32 py-20 first:pt-0"
            >
              <p className="label-caps text-primary">
                {s.index} / {s.tag}
              </p>
              <h2 className="mt-3 text-[30px] font-bold leading-[1.2] tracking-[-0.01em]">
                {s.title}
              </h2>
              {s.paragraphs.map((p, j) => (
                <p
                  key={j}
                  className={`mt-4 max-w-[42rem] ${j === 0 ? "text-on-surface" : "text-on-surface-muted"}`}
                >
                  {p}
                </p>
              ))}
              {s.chips && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {s.chips.map((c) => (
                    <span
                      key={c}
                      className="label-caps border border-border px-3 py-1.5 text-on-surface-muted"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
              {s.spec && (
                <div className="mt-6 divide-y divide-border border-t border-border">
                  {s.spec.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <span className="text-sm text-on-surface-muted">
                        {row.label}
                      </span>
                      <span className="spec-mono whitespace-nowrap">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {/* Below lg there's no room for a pinned side panel, so each
                  section carries its own image inline instead. */}
              <div className="mt-8 lg:hidden">
                <ServiceMedia section={s} className="min-h-[260px]" />
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-32 h-[min(70vh,560px)]">
            {sections.map((s, i) => (
              <div
                key={s.id}
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
                className="absolute inset-0"
              >
                <ServiceMedia section={s} className="h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
