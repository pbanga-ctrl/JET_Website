// Read-only WooCommerce client. The store stays on WordPress — it already
// handles cart, checkout, Stripe, shipping and orders, and rebuilding that is
// where headless storefronts go wrong. This site renders the browsing half in
// its own design and hands off to WooCommerce at the point of purchase.
//
// Credentials are server-only (no NEXT_PUBLIC_ prefix) so they never reach the
// browser, and the key is issued Read-only so this code physically cannot
// change stock, prices or orders.
// Normalised: a trailing slash here produces "…//wp-json/…", which the host
// rejects — and the failure is invisible because every call just returns an
// empty list. Strip it rather than depend on how the value was typed.
const API = (process.env.WOO_API_URL || "").replace(/\/+$/, "") || undefined;
const KEY = process.env.WOO_CONSUMER_KEY;
const SECRET = process.env.WOO_CONSUMER_SECRET;

export const shopConfigured = Boolean(API && KEY && SECRET);

// Where to send someone to actually buy. Falls back to the API host, since
// that is the same WordPress install serving cart and checkout.
export function storeUrl(): string {
  return (process.env.NEXT_PUBLIC_SHOP_URL || API || "").replace(/\/$/, "");
}

export type WooProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  permalink: string;
  description: string;
  short_description: string;
  images: { src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  brands?: { id: number; name: string; slug: string }[];
};

export type WooCategory = { id: number; name: string; slug: string; count: number };

// WooCommerce accepts either an Authorization header or consumer_key /
// consumer_secret as query parameters over HTTPS. The header is cleaner, but
// Apache and LiteSpeed commonly strip Authorization before PHP sees it, which
// surfaces as a 401 that is indistinguishable from bad credentials. So: try
// the header, and on a 401 retry with query auth before giving up. If both
// fail the credentials really are wrong, and the log says so.
type FetchResult<T> = { data: T; total: number; totalPages: number };

async function wooRequest<T>(
  path: string,
  revalidate: number
): Promise<FetchResult<T> | null> {
  if (!shopConfigured) return null;

  const sep = path.includes("?") ? "&" : "?";
  const headers: Record<string, string> = {
    // Some managed hosts' firewalls reject requests with no/generic UA.
    "User-Agent": "JetAutomationSite/1.0 (+https://www.jetautomation.ca)",
    Accept: "application/json",
  };

  const attempts: { url: string; headers: Record<string, string>; via: string }[] = [
    {
      url: `${API}/wp-json/wc/v3${path}`,
      headers: {
        ...headers,
        Authorization: `Basic ${Buffer.from(`${KEY}:${SECRET}`).toString("base64")}`,
      },
      via: "header auth",
    },
    {
      url:
        `${API}/wp-json/wc/v3${path}${sep}` +
        `consumer_key=${encodeURIComponent(KEY!)}&consumer_secret=${encodeURIComponent(SECRET!)}`,
      headers,
      via: "query auth",
    },
  ];

  for (const attempt of attempts) {
    try {
      const res = await fetch(attempt.url, {
        headers: attempt.headers,
        // Cached briefly: prices and stock move slowly enough that a few
        // minutes is honest, and it keeps the store off the critical path.
        next: { revalidate, tags: ["shop"] },
      });

      if (res.ok) {
        return {
          data: (await res.json()) as T,
          total: Number(res.headers.get("x-wp-total") ?? 0),
          totalPages: Number(res.headers.get("x-wp-totalpages") ?? 0),
        };
      }

      // Only a 401 is worth retrying the other way; anything else is a real
      // error and retrying just doubles the load.
      if (res.status !== 401) {
        const body = await res.text().catch(() => "");
        console.error(
          `[shop] WooCommerce ${res.status} via ${attempt.via} for ${path} :: ${body.slice(0, 200)}`
        );
        return null;
      }
      console.warn(`[shop] 401 via ${attempt.via} for ${path}`);
    } catch (err) {
      console.error(`[shop] WooCommerce unreachable via ${attempt.via} for ${path}`, err);
      return null;
    }
  }

  console.error(
    `[shop] WooCommerce rejected both header and query auth for ${path} — check WOO_CONSUMER_KEY / WOO_CONSUMER_SECRET`
  );
  return null;
}

async function wooFetch<T>(path: string, revalidate = 300): Promise<T | null> {
  const res = await wooRequest<T>(path, revalidate);
  return res ? res.data : null;
}

async function wooFetchWithHeaders<T>(
  path: string,
  revalidate = 300
): Promise<FetchResult<T> | null> {
  return wooRequest<T>(path, revalidate);
}

export type SortKey = "title" | "price-asc" | "price-desc" | "newest";

// WooCommerce's own orderby values; "price-asc"/"price-desc" map onto the same
// orderby with a different direction.
const SORTS: Record<SortKey, { orderby: string; order: "asc" | "desc" }> = {
  title: { orderby: "title", order: "asc" },
  "price-asc": { orderby: "price", order: "asc" },
  "price-desc": { orderby: "price", order: "desc" },
  newest: { orderby: "date", order: "desc" },
};

export type ProductQuery = {
  page?: number;
  perPage?: number;
  categoryId?: number;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  sort?: SortKey;
};

// `category` must be the WooCommerce category ID, not its slug — passing a
// slug returns an empty list with a 200, which looks like "no products" rather
// than a bug. Callers resolve slug -> id via getCategories().
//
// Returns the total count alongside the page so the UI can show "N of M" and
// build real pagination instead of guessing from a full page.
export async function getProducts(
  opts: ProductQuery = {}
): Promise<{ products: WooProduct[]; total: number; totalPages: number }> {
  const sort = SORTS[opts.sort ?? "title"];
  const params = new URLSearchParams({
    per_page: String(opts.perPage ?? 24),
    page: String(opts.page ?? 1),
    status: "publish",
    orderby: sort.orderby,
    order: sort.order,
  });
  if (opts.categoryId) params.set("category", String(opts.categoryId));
  if (opts.search) params.set("search", opts.search);
  if (opts.minPrice) params.set("min_price", opts.minPrice);
  if (opts.maxPrice) params.set("max_price", opts.maxPrice);
  if (opts.inStockOnly) params.set("stock_status", "instock");
  if (opts.onSaleOnly) params.set("on_sale", "true");

  const res = await wooFetchWithHeaders<WooProduct[]>(`/products?${params}`);
  return {
    products: res?.data ?? [],
    total: res?.total ?? 0,
    totalPages: res?.totalPages ?? 0,
  };
}

export async function getProductBySlug(slug: string): Promise<WooProduct | null> {
  const list = await wooFetch<WooProduct[]>(`/products?slug=${encodeURIComponent(slug)}&status=publish`);
  return list && list.length > 0 ? list[0] : null;
}

export async function getCategories(): Promise<WooCategory[]> {
  const cats =
    (await wooFetch<WooCategory[]>("/products/categories?per_page=100&orderby=name&hide_empty=true", 3600)) ?? [];
  return cats.filter((c) => c.count > 0);
}

// WooCommerce returns HTML. Strip it for card summaries rather than dumping
// markup from a system we don't control into this site's DOM.
export function toPlainText(html: string, limit = 180): string {
  const text = (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#8211;/gi, "-")
    .replace(/&quot;/gi, '"')
    .replace(/&#8217;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
}

export function formatPrice(value: string): string {
  const n = Number(value);
  if (!value || Number.isNaN(n)) return "Price on request";
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
}
