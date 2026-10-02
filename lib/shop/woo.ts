// Read-only WooCommerce client. The store stays on WordPress — it already
// handles cart, checkout, Stripe, shipping and orders, and rebuilding that is
// where headless storefronts go wrong. This site renders the browsing half in
// its own design and hands off to WooCommerce at the point of purchase.
//
// Credentials are server-only (no NEXT_PUBLIC_ prefix) so they never reach the
// browser, and the key is issued Read-only so this code physically cannot
// change stock, prices or orders.
const API = process.env.WOO_API_URL;
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
    const res = await fetch(`${API}/wp-json/wc/v3${path}`, {
      headers: { Authorization: `Basic ${auth}` },
      // Cached briefly rather than per-request: prices and stock move slowly
      // enough that five minutes is honest, and it keeps the store from being
      // hit on every page view.
      next: { revalidate, tags: ["shop"] },
    });
    if (!res.ok) {
      console.error(`[shop] WooCommerce ${path} returned ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[shop] WooCommerce unreachable for ${path}`, err);
    return null;
  }
}

// `category` must be the WooCommerce category ID, not its slug — passing a
// slug returns an empty list with a 200, which looks like "no products" rather
// than a bug. Callers resolve slug -> id via getCategories().
export async function getProducts(opts: {
  page?: number;
  perPage?: number;
  categoryId?: number;
  search?: string;
} = {}): Promise<WooProduct[]> {
  const params = new URLSearchParams({
    per_page: String(opts.perPage ?? 24),
    page: String(opts.page ?? 1),
    status: "publish",
    orderby: "title",
    order: "asc",
  });
  if (opts.categoryId) params.set("category", String(opts.categoryId));
  if (opts.search) params.set("search", opts.search);
  return (await wooFetch<WooProduct[]>(`/products?${params}`)) ?? [];
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
