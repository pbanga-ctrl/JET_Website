"use client";

// Single-open accordion (opening one question closes any other) with a
// GSAP height/opacity tween instead of a CSS transition, since "height:
// auto" isn't natively animatable — see FaqItem's useGSAP below for how
// that's worked around.
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const FAQS = [
  {
    q: "Do you sell parts to the public?",
    a: "The shop is open to businesses and individuals. Note we are not an authorized distributor for every brand listed: check the product page before ordering.",
  },
  {
    q: "What are typical project lead times?",
    a: "Panel builds run 3–6 weeks, controls retrofits 2–4 weeks, and full robotic cells 6–12 weeks from approved design. Long-lead components can move those dates; we flag them in the quote.",
  },
  {
    q: "Do you travel for on-site work?",
    a: "Yes, commissioning, debug and safety assessments across Ontario routinely, and further afield for existing customers.",
  },
  {
    q: "Can you take over a partly finished project?",
    a: "Often. We start with an assessment of what exists, drawings, code, hardware, and give you a written position on what's salvageable before any work begins.",
  },
];

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  // GSAP can tween to the literal string "auto" (measuring the element's
  // natural height under the hood), which a plain CSS transition can't do —
  // that's the whole reason this uses GSAP instead of a `max-h-*` class swap.
  useGSAP(() => {
    if (!bodyRef.current) return;
    gsap.to(bodyRef.current, {
      height: open ? "auto" : 0,
      opacity: open ? 1 : 0,
      duration: 0.25,
      ease: "power2.inOut",
    });
  }, [open]);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[18px] font-bold">{q}</span>
        <span className="label-caps text-primary">{open ? "−" : "+"}</span>
      </button>
      <div ref={bodyRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <p className="pb-5 text-on-surface-muted">{a}</p>
      </div>
    </div>
  );
}

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-t border-border">
      {FAQS.map((f, i) => (
        <FaqItem
          key={f.q}
          q={f.q}
          a={f.a}
          open={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  );
}
