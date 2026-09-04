"use client";

// A hand-drawn-looking technical illustration of a robotic cell (blueprint
// style — see DESIGN.md) that animates in as if being traced, using GSAP's
// DrawSVGPlugin. Currently unused by the live homepage (HeroRobotArm's 3D
// model replaced it) but kept as an alternative/fallback hero visual.
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export function HeroLineArt() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll("path, circle, rect");

    // Snap every stroke to 0% drawn, then animate each to 100% with a
    // slight stagger so the illustration appears to draw itself
    // part-by-part (base -> mast -> joints -> arm) rather than all at once.
    gsap.set(paths, { drawSVG: "0%" });
    gsap.to(paths, {
      drawSVG: "100%",
      duration: 1.6,
      ease: "power2.inOut",
      stagger: 0.08,
      delay: 0.15,
    });
  }, []);

  return (
    <div className="relative border border-border bg-surface-raised">
      <span className="label-caps absolute left-0 top-0 z-10 bg-surface-raised px-2 py-1 text-on-surface-muted">
        FIG. 01 / ROBOTIC CELL
      </span>
      <svg
        ref={svgRef}
        viewBox="0 0 400 560"
        className="h-full min-h-[420px] w-full"
        fill="none"
        stroke="#0D21A1"
        strokeWidth="1.5"
      >
        {/* base plate */}
        <rect x="40" y="460" width="200" height="24" />
        {/* mast */}
        <path d="M 90 460 L 90 300" />
        {/* shoulder joint */}
        <circle cx="90" cy="300" r="10" />
        {/* upper arm */}
        <path d="M 90 300 L 200 220" />
        {/* elbow joint */}
        <circle cx="200" cy="220" r="8" />
        {/* forearm */}
        <path d="M 200 220 L 260 140" />
        {/* wrist joint */}
        <circle cx="260" cy="140" r="6" />
        {/* end effector */}
        <path d="M 260 140 L 290 110 M 260 140 L 285 155" />
        {/* guarding frame */}
        <rect x="20" y="80" width="330" height="404" strokeDasharray="4 4" />
        {/* crosshair markers */}
        <path d="M 330 100 L 330 116 M 322 108 L 338 108" />
        <path d="M 60 500 L 60 516 M 52 508 L 68 508" />
        {/* dimension line */}
        <path d="M 40 520 L 240 520 M 40 514 L 40 526 M 240 514 L 240 526" />
      </svg>
      <span className="spec-mono absolute bottom-2 right-2 text-on-surface-muted">
        |←— 4200 mm —→|
      </span>
    </div>
  );
}
