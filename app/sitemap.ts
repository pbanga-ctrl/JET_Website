// Auto-generated sitemap.xml (Next.js picks up this file by convention at
// /sitemap.xml). Static routes are listed directly with hand-picked
// priority/frequency; the dynamic /careers/[slug] routes come from
// lib/seo/routes.ts, which is CMS-aware — a role added in the Sanity
// Studio shows up here automatically, same as it does on /careers itself.
import type { MetadataRoute } from "next";
import { getRoles } from "@/lib/cms/roles";

const SITE_URL = "https://jetautomation.ca";

const STATIC_ROUTE_META: Record<string, { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = {
  "/": { changeFrequency: "monthly", priority: 1 },
  "/services": { changeFrequency: "monthly", priority: 0.9 },
  "/products": { changeFrequency: "monthly", priority: 0.9 },
  "/careers": { changeFrequency: "weekly", priority: 0.7 },
  "/contact-us": { changeFrequency: "yearly", priority: 0.6 },
  "/support": { changeFrequency: "yearly", priority: 0.5 },
  "/login": { changeFrequency: "yearly", priority: 0.3 },
  "/cookie-policy": { changeFrequency: "yearly", priority: 0.2 },
  "/privacy-policy": { changeFrequency: "yearly", priority: 0.2 },
  "/terms-and-conditions": { changeFrequency: "yearly", priority: 0.2 },
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = Object.entries(STATIC_ROUTE_META).map(
    ([path, meta]) => ({ url: `${SITE_URL}${path}`, ...meta })
  );

  const { roles } = await getRoles();
  const careerRoutes: MetadataRoute.Sitemap = Object.keys(roles).map((slug) => ({
    url: `${SITE_URL}/careers/${slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...careerRoutes];
}
