import Image from "next/image";
import { SCHNEIDER_ALLIANCE_BADGE } from "@/lib/data/certifications";

// Official Schneider wordmark plus the Alliance line, under the hero
// headline. The SVG is not restyled: fixed height, auto width, and a gap
// so the type sits outside the logo's clear space. Hidden when the flag
// in lib/data/certifications.ts is off.
export function SchneiderAllianceBadge() {
  if (!SCHNEIDER_ALLIANCE_BADGE.enabled) return null;

  const { image, alt, width, height } = SCHNEIDER_ALLIANCE_BADGE;

  return (
    <div className="mt-6 inline-flex max-w-full items-center gap-4">
      <Image
        src={image}
        alt={alt}
        width={width}
        height={height}
        priority
        className="h-9 w-auto shrink-0"
      />
      <p className="label-caps text-on-surface leading-tight">
        <span className="block whitespace-nowrap">Certified</span>
        <span className="block whitespace-nowrap">System Integrator</span>
      </p>
    </div>
  );
}
