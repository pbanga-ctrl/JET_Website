// Embedded Sanity Studio, at /studio. Once NEXT_PUBLIC_SANITY_PROJECT_ID is
// set (see .env.example) and you've logged in with a Sanity account here,
// this is where services/products/job postings get edited and photos get
// swapped — changes show up on the live site within the fetchers' cache
// window (see lib/cms/*.ts). Not linked from site navigation and excluded
// from the sitemap/robots (see app/robots.ts) — it's an editor tool, not a
// public page.
//
// The actual config/studio import lives in components/studio/StudioClient
// (a Client Component) rather than here — see that file for why.
import { StudioClient } from "@/components/studio/StudioClient";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <StudioClient />;
}
