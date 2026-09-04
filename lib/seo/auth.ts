import { createHash } from "node:crypto";

// Minimal password gate for /seo-dashboard — this tool can fetch arbitrary
// URLs and call an external API, so it shouldn't be open to the public
// internet. Deliberately fails CLOSED: with no SEO_DASHBOARD_PASSWORD set
// (the state until you add one — see .env.example), isValidToken() always
// returns false and nobody gets in, rather than defaulting to open access.
export const COOKIE_NAME = "seo_dashboard_auth";

function tokenFor(password: string): string {
  return createHash("sha256").update(`${password}:seo-dashboard`).digest("hex");
}

export function tokenForPassword(password: string): string {
  return tokenFor(password);
}

export function isValidToken(token: string | undefined): boolean {
  const password = process.env.SEO_DASHBOARD_PASSWORD;
  if (!password || !token) return false;
  return token === tokenFor(password);
}
