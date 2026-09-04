import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next dev blocks cross-origin requests to dev assets by default, so
  // opening the site by LAN IP (instead of localhost) 404s client bundles
  // and things like the hero robot model. Allowlist common private ranges.
  allowedDevOrigins: [
    "192.168.*.*",
    "10.*.*.*",
    "172.*.*.*",
  ],
  // Vercel builds this itself and does NOT want "standalone" output — that
  // mode exists for self-hosting, where a process manager runs one JS file
  // directly (Hostinger's Passenger-based Node hosting, a VPS under PM2).
  // Opt into it with BUILD_STANDALONE=true if this ever moves to a server we
  // manage; scripts/copy-standalone-assets.mjs (postbuild) then fills in the
  // public/ and .next/static folders that mode leaves out.
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  // The embedded Sanity Studio (app/studio) pulls in "sanity", which
  // internally imports swr in a way that breaks when Next's RSC bundler
  // tries to resolve it through the "react-server" export condition —
  // treating it as an external server package makes Next load it via plain
  // Node resolution at runtime instead of bundling/analyzing it.
  serverExternalPackages: ["sanity"],
};

export default nextConfig;
