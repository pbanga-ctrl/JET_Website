// Internal SEO dashboard — password-gated (see lib/seo/auth.ts; fails
// closed until SEO_DASHBOARD_PASSWORD is set in env), not linked from site
// navigation, and excluded from indexing both here and in robots.ts. Runs
// an on-page audit (lib/seo/audit.ts) against any reachable URL — defaults
// to the production domain, which right now means it audits the current
// live WordPress site, giving a real before/after baseline once this app
// replaces it — plus on-demand Google PageSpeed Insights checks per page.
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { COOKIE_NAME, isValidToken } from "@/lib/seo/auth";
import { SeoDashboardLogin } from "@/components/seo/SeoDashboardLogin";
import { SeoDashboardClient } from "@/components/seo/SeoDashboardClient";

export const metadata: Metadata = {
  title: "SEO Dashboard",
  robots: { index: false, follow: false },
};

const DEFAULT_BASE_URL = "https://jetautomation.ca";

export default async function SeoDashboardPage() {
  const jar = await cookies();
  const authed = isValidToken(jar.get(COOKIE_NAME)?.value);

  if (!authed) return <SeoDashboardLogin />;

  return <SeoDashboardClient defaultBaseUrl={DEFAULT_BASE_URL} />;
}
