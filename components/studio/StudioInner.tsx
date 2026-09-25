"use client";

// The actual Studio mount. Split out from StudioClient so it can be pulled in
// via next/dynamic with ssr:false — see that file for why it must never be
// server-rendered.
import { NextStudio } from "next-sanity/studio";
import config from "../../sanity.config";

export default function StudioInner() {
  return <NextStudio config={config} />;
}
