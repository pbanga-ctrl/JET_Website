"use client";

// An oversized background image that drifts vertically as its containing
// section scrolls through the viewport — the classic "background moves
// slower than the page" parallax read. Deliberately transform-based (GSAP
// ScrollTrigger + scrub) rather than `background-attachment: fixed`, which
// doesn't work on iOS Safari and most mobile browsers.
//
// Caller owns positioning/z-index/overflow (wrap this in a `relative
// overflow-hidden` section and an `absolute inset-0 -z-10` layer) — this
// component only renders the oversized, moving image itself.
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      // The image is 130% of the section's height (30% overhang, split
      // top/bottom) so a +/-10% vertical drift never exposes an edge.
      gsap.fromTo(
        ref.current,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current.closest("section") ?? ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="absolute -top-[15%] left-0 h-[130%] w-full">
      <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
    </div>
  );
}
