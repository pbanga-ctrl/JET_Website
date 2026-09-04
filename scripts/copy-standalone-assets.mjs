// Only does anything for self-hosted builds (BUILD_STANDALONE=true — see
// next.config.ts). That mode produces a self-contained
// .next/standalone/server.js a process manager can run directly, but it
// deliberately does NOT copy public/ or .next/static in (documented Next.js
// behavior, not a bug), so without this step a self-hosted deploy would 404
// every image, font and static asset. Runs as "postbuild" after every
// build, and no-ops on Vercel, which builds and serves those folders itself.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const standalone = path.join(root, ".next", "standalone");

if (!fs.existsSync(standalone)) {
  // Expected on Vercel and any normal `next build` — nothing to do.
  process.exit(0);
}

fs.cpSync(path.join(root, "public"), path.join(standalone, "public"), {
  recursive: true,
});
fs.cpSync(
  path.join(root, ".next", "static"),
  path.join(standalone, ".next", "static"),
  { recursive: true }
);

console.log(
  "Copied public/ and .next/static into .next/standalone — that folder is ready to upload as-is."
);
