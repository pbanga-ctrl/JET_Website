// Auto-generated robots.txt (Next.js picks up this file by convention at
// /robots.txt). Everything's crawlable except the login page (a customer
// portal shell with no content search engines need to index), the Sanity
// Studio at /studio and the SEO dashboard at /seo-dashboard (both internal
// editor tools, not pages — the dashboard also carries its own
// noindex/password gate, this is belt-and-suspenders), and the API routes
// behind the forms.
import type { MetadataRoute } from "next";

const SITE_URL = "https://jetautomation.ca";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/studio", "/seo-dashboard", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
