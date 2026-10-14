"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  CERTIFICATION_BADGES,
  CERTIFICATION_ROTATE_MS,
} from "@/lib/data/certifications";

// Both marks stay in the accessibility tree (neither is aria-hidden), so a
// screen reader can read Schneider and Omron even while one is faded out.
// prefers-reduced-motion, via the motion-reduce: classes, drops the crossfade
// and lays the enabled badges out together instead.
export function CertificationBadges() {
  const badges = CERTIFICATION_BADGES.filter((badge) => badge.enabled);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (badges.length < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % badges.length);
    }, CERTIFICATION_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused, badges.length]);

  if (badges.length === 0) return null;

  return (
    <div
      className="mt-6 grid max-w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:flex motion-reduce:flex-col motion-reduce:gap-4 sm:motion-reduce:flex-row sm:motion-reduce:flex-wrap sm:motion-reduce:items-center sm:motion-reduce:gap-x-8"
      role="region"
      aria-label="Certifications"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      {badges.map((badge, i) => {
        const active = badges.length < 2 || i === index;
        return (
          <div
            key={badge.image}
            data-active={active ? "true" : "false"}
            className="col-start-1 row-start-1 flex max-w-full items-center gap-4 transition-[opacity,translate] duration-700 ease-out motion-reduce:static motion-reduce:opacity-100 motion-reduce:transition-none data-[active=false]:pointer-events-none data-[active=false]:translate-y-1.5 data-[active=false]:opacity-0 motion-reduce:data-[active=false]:pointer-events-auto motion-reduce:data-[active=false]:translate-y-0 motion-reduce:data-[active=false]:opacity-100"
          >
            <Image
              src={badge.image}
              alt={badge.alt}
              width={badge.width}
              height={badge.height}
              priority={i === 0}
              className="h-8 w-auto shrink-0 sm:h-9"
            />
            <p className="label-caps text-on-surface leading-tight">
              <span className="block whitespace-nowrap">Certified</span>
              <span className="block whitespace-nowrap">System Integrator</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
