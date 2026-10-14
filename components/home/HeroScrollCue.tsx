"use client";

import { useEffect, useState } from "react";

const BUTTON = 44;
const GAP = 16;

// Bottom-right of the first screen. The cookie bar is fixed over that
// corner, so the cue lifts by the bar's height while the bar is open and
// drops back when it unmounts. The bounce lives in .hero-scroll-cue and
// is turned off under prefers-reduced-motion; the scroll itself follows
// the same preference.
export function HeroScrollCue() {
  const [lift, setLift] = useState(0);

  useEffect(() => {
    const banner = () =>
      document.querySelector<HTMLElement>('[aria-label="Cookie consent"]');

    let resizeObs: ResizeObserver | null = null;

    const measure = () => {
      const el = banner();
      if (!el) {
        setLift(0);
        resizeObs?.disconnect();
        resizeObs = null;
        return;
      }
      const height = Math.round(el.getBoundingClientRect().height);
      setLift(height > 0 ? height : 0);
      if (!resizeObs) {
        resizeObs = new ResizeObserver(measure);
        resizeObs.observe(el);
      }
    };

    measure();
    const mutation = new MutationObserver(measure);
    mutation.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", measure);
    return () => {
      mutation.disconnect();
      resizeObs?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  function scrollToNext() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("home-stats")?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <button
      type="button"
      onClick={scrollToNext}
      aria-label="Scroll to the next section"
      style={{ top: `calc(100dvh - ${BUTTON + GAP + lift}px)` }}
      className="hero-scroll-cue absolute right-4 z-30 flex h-11 w-11 items-center justify-center border border-on-dark/30 bg-secondary/85 text-on-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary md:right-8"
    >
      <svg
        viewBox="0 0 16 16"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden
      >
        <path d="M3 6l5 5 5-5" />
      </svg>
    </button>
  );
}
