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

async function wooFetch<T>(path: string, revalidate = 300): Promise<T | null> {
  if (!shopConfigured) return null;
  const auth = Buffer.from(`${KEY}:${SECRET}`).toString("base64");
  try {
    const url = `${API}/wp-json/wc/v3${path}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        // Some managed hosts' WAFs reject requests with no/!generic UA.
        "User-Agent": "JetAutomationSite/1.0 (+https://www.jetautomation.ca)",
        Accept: "application/json",
      },
      // Cached briefly rather than per-request: prices and stock move slowly
      // enough that five minutes is honest, and it keeps the store from being
      // hit on every page view.
      next: { revalidate, tags: ["shop"] },
    });
    if (!res.ok) {
      // Log enough to diagnose from the platform logs: status plus the start
      // of the body, since WooCommerce returns its reason in JSON.
      const body = await res.text().catch(() => "");
      console.error(
        `[shop] WooCommerce ${res.status} for ${url} :: ${body.slice(0, 200)}`
      );
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[shop] WooCommerce unreachable for ${path}`, err);
    return null;
  }
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

// WooCommerce reports the result count in X-WP-Total / X-WP-TotalPages, which
// the plain JSON body doesn't carry — needed for honest pagination.
async function wooFetchWithHeaders<T>(
  path: string,
  revalidate = 300
): Promise<{ data: T; total: number; totalPages: number } | null> {
  if (!shopConfigured) return null;
  const auth = Buffer.from(`${KEY}:${SECRET}`).toString("base64");
  const url = `${API}/wp-json/wc/v3${path}`;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        "User-Agent": "JetAutomationSite/1.0 (+https://www.jetautomation.ca)",
        Accept: "application/json",
      },
      next: { revalidate, tags: ["shop"] },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[shop] WooCommerce ${res.status} for ${url} :: ${body.slice(0, 200)}`);
      return null;
    }
    return {
      data: (await res.json()) as T,
      total: Number(res.headers.get("x-wp-total") ?? 0),
      totalPages: Number(res.headers.get("x-wp-totalpages") ?? 0),
    };
  } catch (err) {
    console.error(`[shop] WooCommerce unreachable for ${url}`, err);
    return null;
  }
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
