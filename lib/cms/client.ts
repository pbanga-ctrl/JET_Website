import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion, configured } from "@/sanity/env";

export { configured };

// `useCdn: true` reads from Sanity's cached CDN (fine for marketing content
// — a short staleness window in exchange for much faster/cheaper reads) and
// is only used at all once a project is actually configured; every fetcher
// in lib/cms/*.ts checks `configured` first and skips this entirely
// otherwise, so an unconfigured project never causes a failed connection.
export const sanityClient = configured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;
