// Google PageSpeed Insights — real Lighthouse scores (performance, SEO,
// accessibility, best practices) for any publicly reachable URL. No Google
// account, domain verification or OAuth needed for this API (unlike Search
// Console) — an optional API key just raises the rate limit. Won't work
// against localhost since Google's servers have to reach the URL over the
// public internet; point it at the live WordPress site now for a baseline,
// and at the new site once it's deployed.
export type PageSpeedScores = {
  performance?: number;
  seo?: number;
  accessibility?: number;
  bestPractices?: number;
  error?: string;
};

export async function getPageSpeedScores(url: string): Promise<PageSpeedScores> {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  const params = new URLSearchParams({ url, strategy: "mobile" });
  for (const c of ["performance", "seo", "accessibility", "best-practices"]) {
    params.append("category", c);
  }
  if (apiKey) params.set("key", apiKey);

  try {
    const res = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    if (!res.ok) {
      return { error: data?.error?.message || `PageSpeed API returned HTTP ${res.status}` };
    }
    const categories = data?.lighthouseResult?.categories ?? {};
    const pct = (v: unknown) => (typeof v === "number" ? Math.round(v * 100) : undefined);
    return {
      performance: pct(categories.performance?.score),
      seo: pct(categories.seo?.score),
      accessibility: pct(categories.accessibility?.score),
      bestPractices: pct(categories["best-practices"]?.score),
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "PageSpeed request failed" };
  }
}
