"use client";

// Big number in the "by the numbers" stats band that counts up from 0 to
// its target once scrolled into view, via GSAP tweening a plain JS object
// and writing the rounded value into the DOM on every tick (GSAP can't
// directly animate a React-rendered text node). StaticMetric below is the
// same visual treatment for a value that isn't a number to count (e.g. "24/7").
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const NUMBER_CLASS =
  "font-mono text-[clamp(56px,9vw,112px)] font-medium leading-[0.95] tracking-[-0.02em] text-on-dark";

export function MetricCounter({
  target,
  suffix = "",
  label,
  delay = 0,
}: {
  target: number;
  suffix?: string;
  label: string;
  delay?: number;
}) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = numberRef.current;
    if (!el) return;

    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: 1.6,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        if (el) el.textContent = Math.round(counter.value).toString();
      },
      // Don't start counting until the number is actually visible, and
      // only ever run it once even if the user scrolls back up past it.
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    });
  }, [target, delay]);

  return (
    <div className="border-t border-border-dark pt-4">
      <p className={NUMBER_CLASS}>
        <span ref={numberRef}>0</span>
        {suffix}
      </p>
      <p className="label-caps mt-3 text-on-dark-muted">{label}</p>
    </div>
  );
}

export function StaticMetric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="border-t border-border-dark pt-4">
      <p className={NUMBER_CLASS}>{value}</p>
      <p className="label-caps mt-3 text-on-dark-muted">{label}</p>
    </div>
  );
}
