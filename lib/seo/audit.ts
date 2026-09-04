import * as cheerio from "cheerio";

// On-page SEO audit — fetches a page exactly like a crawler would (a plain
// GET, no JS execution) and checks the same handful of things Google's own
// guidance and most SEO tools flag first: title/description length,
// heading structure, image alt coverage, Open Graph completeness and
// structured data presence. No external API or account needed — this is
// pure "read our own HTML" analysis, so it works on any reachable URL,
// including the current live WordPress site before this one replaces it.
export type PageAudit = {
  path: string;
  url: string;
  ok: boolean;
  status?: number;
  error?: string;
  title?: string;
  titleLength?: number;
  metaDescription?: string;
  metaDescriptionLength?: number;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  h1Count?: number;
  h1Text?: string[];
  imagesTotal?: number;
  imagesMissingAlt?: number;
  hasStructuredData?: boolean;
  issues: string[];
};

const TITLE_MIN = 15;
const TITLE_MAX = 60;
const DESC_MIN = 50;
const DESC_MAX = 160;

export async function auditPage(baseUrl: string, path: string): Promise<PageAudit> {
  const url = new URL(path, baseUrl).toString();
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "User-Agent": "JetSEOAudit/1.0 (+internal tool)" },
      cache: "no-store",
    });
  } catch (err) {
    return {
      path,
      url,
      ok: false,
      error: err instanceof Error ? err.message : "fetch failed",
      issues: ["Could not reach the page"],
    };
  }

  if (!res.ok) {
    return { path, url, ok: false, status: res.status, issues: [`Page returned HTTP ${res.status}`] };
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const issues: string[] = [];

  const title = $("title").first().text().trim();
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() ?? "";
  const canonical = $('link[rel="canonical"]').attr("href") ?? "";
  const ogTitle = $('meta[property="og:title"]').attr("content") ?? "";
  const ogDescription = $('meta[property="og:description"]').attr("content") ?? "";
  const ogImage = $('meta[property="og:image"]').attr("content") ?? "";
  const h1Text = $("h1")
    .map((_, el) => $(el).text().trim())
    .get();
  const images = $("img");
  const imagesMissingAlt = images.filter((_, el) => !$(el).attr("alt")?.trim()).length;
  const hasStructuredData = $('script[type="application/ld+json"]').length > 0;

  if (!title) issues.push("Missing <title>");
  else if (title.length < TITLE_MIN)
    issues.push(`Title is short (${title.length} chars — aim for ${TITLE_MIN}-${TITLE_MAX})`);
  else if (title.length > TITLE_MAX)
    issues.push(`Title is long (${title.length} chars — aim for ${TITLE_MIN}-${TITLE_MAX}, may get truncated in results)`);

  if (!metaDescription) issues.push("Missing meta description");
  else if (metaDescription.length < DESC_MIN)
    issues.push(`Meta description is short (${metaDescription.length} chars — aim for ${DESC_MIN}-${DESC_MAX})`);
  else if (metaDescription.length > DESC_MAX)
    issues.push(`Meta description is long (${metaDescription.length} chars — aim for ${DESC_MIN}-${DESC_MAX}, may get truncated)`);

  if (h1Text.length === 0) issues.push("No <h1> found");
  else if (h1Text.length > 1) issues.push(`Multiple <h1> elements (${h1Text.length}) — should be exactly one`);

  if (imagesMissingAlt > 0)
    issues.push(`${imagesMissingAlt} of ${images.length} image(s) missing alt text`);

  if (!ogTitle || !ogDescription || !ogImage)
    issues.push("Incomplete Open Graph tags (affects link previews on social/Slack/etc.)");

  if (!hasStructuredData) issues.push("No structured data (JSON-LD) found");

  return {
    path,
    url,
    ok: true,
    status: res.status,
    title,
    titleLength: title.length,
    metaDescription,
    metaDescriptionLength: metaDescription.length,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    h1Count: h1Text.length,
    h1Text,
    imagesTotal: images.length,
    imagesMissingAlt,
    hasStructuredData,
    issues,
  };
}

export async function auditSite(baseUrl: string, paths: string[]): Promise<PageAudit[]> {
  // Sequential rather than Promise.all — polite to whatever's serving these
  // pages (which right now might be the live WordPress site) instead of
  // firing a burst of concurrent requests at it.
  const results: PageAudit[] = [];
  for (const path of paths) {
    results.push(await auditPage(baseUrl, path));
  }
  return results;
}
