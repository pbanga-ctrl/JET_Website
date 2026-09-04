"use client";

// Thin sizing wrapper around RobotArmScene (the actual Three.js canvas +
// GLB model logic) — kept separate so the home page can size/position the
// 3D viewport without needing to know anything about how it's rendered.
//
// `h-full` here is deliberate, not decorative: the parent grid ("What we
// do" in app/page.tsx) uses `items-stretch`, so this column's height
// matches the text column next to it exactly, and h-full fills that. A
// fixed pixel height doesn't survive the text column's height varying
// with viewport width the way this does. min-h is only a floor for when
// columns stack (mobile) and there's no row height to stretch to.
import { RobotArmScene } from "./RobotArmScene";

export function HeroRobotArm() {
  return (
    <div className="h-full min-h-[440px] w-full">
      <RobotArmScene />
    </div>
  );
}
