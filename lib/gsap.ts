"use client";

// Single place plugins get registered with GSAP — every component that
// animates (MetricCounter, FaqAccordion, HeroLineArt, RobotArmScene, etc.)
// imports `gsap` from here rather than the "gsap" package directly, so
// registration only ever happens once no matter how many components import it.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

// GSAP touches `window` on registration, which doesn't exist during
// Next.js's server render — guard so this module can still be imported
// (just inertly) from server-rendered code paths.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
}

export { gsap, ScrollTrigger };
