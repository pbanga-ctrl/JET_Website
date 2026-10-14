import Image from "next/image";
import { SCHNEIDER_ALLIANCE_BADGE } from "@/lib/data/certifications";

// Quiet credential under the hero headline. Hidden entirely when the flag
// in lib/data/certifications.ts is off, so the lockup can be reviewed on a
// preview deploy and pulled without editing the page.
export function SchneiderAllianceBadge() {
  if (!SCHNEIDER_ALLIANCE_BADGE.enabled) return null;

  const { image, alt, width, height } = SCHNEIDER_ALLIANCE_BADGE;

  return (
    <div className="mt-6">
      <Image
        src={image}
        alt={alt}
        width={width}
        height={height}
        // Local SVG is served as-is (Next skips the optimizer for .svg).
        // priority: it sits in the first screen, under the headline.
        priority
        className="h-auto w-full max-w-[300px]"
      />
    </div>
  );
}
