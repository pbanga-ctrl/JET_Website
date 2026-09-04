"use client";

// sanity.config.ts embeds real functions (schema `validation` rules, field
// `hidden` callbacks, default icons) — passing that config as a prop from a
// Server Component (app/studio/[[...tool]]/page.tsx) to NextStudio would
// mean serializing those functions across the server/client boundary, which
// Next.js 16 rejects. Importing sanity.config here instead, inside a file
// that's already a Client Component, keeps that whole module graph on the
// client side from the start — no boundary ever has to cross it.
import { NextStudio } from "next-sanity/studio";
import config from "../../sanity.config";

export function StudioClient() {
  return <NextStudio config={config} />;
}
