// Canonical list of public route paths — shared by app/sitemap.ts and the
// SEO dashboard's on-page audit (app/seo-dashboard), so there's one place
// that knows what "every page on the site" means. Deliberately excludes
// /login, /studio and anything under /api — none of those are content
// pages a search engine (or this audit) should be scoring.
import { getRoles } from "@/lib/cms/roles";

export const STATIC_ROUTES = [
  "/",
  "/services",
  "/products",
  "/careers",
  "/contact-us",
  "/support",
  "/cookie-policy",
  "/privacy-policy",
  "/terms-and-conditions",
];

export async function getAllRoutePaths(): Promise<string[]> {
  const { roles } = await getRoles();
  const careerRoutes = Object.keys(roles).map((slug) => `/careers/${slug}`);
  return [...STATIC_ROUTES, ...careerRoutes];
}
