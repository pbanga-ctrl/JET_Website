// Builds the factual context the assistant answers from: the same services,
// products and job postings the site itself renders, pulled through the CMS
// fetchers so the bot can never drift from what visitors are reading.
//
// Cached at module level for the lifetime of the server process — this is a
// stable prefix, and re-fetching it per message would both slow replies and
// break prompt caching.
import { getServiceSections } from "@/lib/cms/services";
import { getProducts } from "@/lib/cms/products";
import { getRoles } from "@/lib/cms/roles";

let cached: { text: string; builtAt: number } | null = null;
const TTL_MS = 10 * 60 * 1000;

export async function getSiteKnowledge(): Promise<string> {
  if (cached && Date.now() - cached.builtAt < TTL_MS) return cached.text;

  const [sections, { products, oemProducts }, { roles, openSlugs }] = await Promise.all([
    getServiceSections(),
    getProducts(),
    getRoles(),
  ]);

  const parts: string[] = [];

  parts.push("## Services (page: /services)");
  for (const s of sections) {
    parts.push(`- ${s.title} (anchor /services#${s.id}): ${s.paragraphs.join(" ")}`);
    if (s.spec?.length) {
      parts.push(`  Figures: ${s.spec.map((r) => `${r.label} = ${r.value}`).join("; ")}`);
    }
  }

  parts.push("\n## Products (page: /products)");
  for (const p of products) {
    parts.push(`- ${p.title}${p.code ? ` (${p.code})` : ""} [${p.tag}]: ${p.body}`);
  }
  parts.push("\n## In-house OEM products (page: /products)");
  for (const p of oemProducts) {
    parts.push(`- ${p.title}${p.code ? ` (${p.code})` : ""} [${p.tag}]: ${p.body}`);
  }

  parts.push("\n## Open positions (page: /careers)");
  for (const slug of openSlugs) {
    const r = roles[slug];
    if (r) parts.push(`- ${r.title} — ${r.type}, ${r.dept} (page: /careers/${slug}): ${r.blurb}`);
  }

  parts.push(`
## Company facts
- JET Automation Inc., 7676 Kimbel St, Units 8-13, Mississauga, Ontario L5S 1J8
- Phone 1-877-904-8724. Technical support line: extension 4.
- Email info@jetautomation.ca
- Hours Mon-Fri 9:00-17:00 ET. Established 2010.

## Pages you can point people to
/ (home), /services, /products, /careers, /support, /contact-us, /login,
/privacy-policy, /terms-and-conditions, /cookie-policy`);

  const text = parts.join("\n");
  cached = { text, builtAt: Date.now() };
  return text;
}
