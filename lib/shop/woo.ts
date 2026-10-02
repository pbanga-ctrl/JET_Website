// Storefront data, read from WooCommerce's **Store API** (/wc/store/v1).
//
// This is the API WooCommerce built for headless storefronts, and it needs no
// credentials at all — which removes a whole class of failure. The admin REST
// API (/wc/v3) needs a consumer key/secret, and when those are wrong it answers
// 401 and the catalogue silently renders empty, which is exactly what happened
// in production. The Store API also exposes cart endpoints and a Cart-Token
// header, so a cart on this site can use the same surface later.
//
// Two shape differences worth knowing: prices arrive as minor units (59900
// means $599.00) and text fields arrive HTML-encoded.
const API = (process.env.WOO_API_URL || "").replace(/\/+$/, "") || undefined;

export const shopConfigured = Boolean(API);

// Where "add to cart" and "view in store" point until cart lives on this site.
export function storeUrl(): string {
  return (process.env.NEXT_PUBLIC_SHOP_URL || API || "").replace(/\/$/, "");
}

type StorePrices = {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_minor_unit: number;
};

type StoreProductRaw = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  permalink: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  is_in_stock: boolean;
  is_purchasable: boolean;
  prices: StorePrices;
  images: { src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
};

// Normalised shape the pages render from, so the UI never has to deal with
// minor units or HTML entities.
export type WooProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  permalink: string;
  description: string;
  short_description: string;
  onSale: boolean;
  inStock: boolean;
  price: number | null;
  regularPrice: number | null;
  images: { src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
};

export type WooCategory = { id: number; name: string; slug: string; count: number };

export type SortKey = "title" | "price-asc" | "price-desc" | "newest";

const SORTS: Record<SortKey, { orderby: string; order: "asc" | "desc" }> = {
  title: { orderby: "title", order: "asc" },
  "price-asc": { orderby: "price", order: "asc" },
  "price-desc": { orderby: "price", order: "desc" },
  newest: { orderby: "date", order: "desc" },
};

export type ProductQuery = {
  page?: number;
  perPage?: number;
  categorySlug?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  sort?: SortKey;
};

// WordPress returns entity-encoded text ("&#8211;", "&amp;"). Decode the few
// that actually occur rather than adding a dependency for it.
export function decode(text: string): string {
  return (text || "")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8217;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

function toMajorUnits(value: string, minorUnit: number): number | null {
  const n = Number(value);
  if (!value || Number.isNaN(n)) return null;
  return n / 10 ** minorUnit;
}

function normalise(p: StoreProductRaw): WooProduct {
  const unit = p.prices?.currency_minor_unit ?? 2;
  return {
    id: p.id,
    name: decode(p.name),
    slug: p.slug,
    sku: p.sku,
    permalink: p.permalink,
    description: p.description,
    short_description: p.short_description,
    onSale: p.on_sale,
    inStock: p.is_in_stock,
    price: toMajorUnits(p.prices?.price, unit),
    regularPrice: toMajorUnits(p.prices?.regular_price, unit),
    images: p.images ?? [],
    categories: (p.categories ?? []).map((c) => ({ ...c, name: decode(c.name) })),
  };
}

async function storeFetch<T>(
  path: string,
  revalidate = 300
): Promise<{ data: T; total: number; totalPages: number } | null> {
  if (!shopConfigured) return null;
  const url = `${API}/wp-json/wc/store/v1${path}`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        // Some managed hosts' firewalls reject requests with no/generic UA.
        "User-Agent": "JetAutomationSite/1.0 (+https://www.jetautomation.ca)",
      },
      // Cached briefly: prices and stock move slowly enough that a few minutes
      // is honest, and it keeps the store off the critical path.
      next: { revalidate, tags: ["shop"] },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[shop] Store API ${res.status} for ${path} :: ${body.slice(0, 200)}`);
      return null;
    }
    return {
      data: (await res.json()) as T,
      total: Number(res.headers.get("x-wp-total") ?? 0),
      totalPages: Number(res.headers.get("x-wp-totalpages") ?? 0),
    };
  } catch (err) {
    console.error(`[shop] Store API unreachable for ${path}`, err);
    return null;
  }
}

export async function getProducts(
  opts: ProductQuery = {}
): Promise<{ products: WooProduct[]; total: number; totalPages: number }> {
  const sort = SORTS[opts.sort ?? "title"];
  const params = new URLSearchParams({
    per_page: String(opts.perPage ?? 24),
    page: String(opts.page ?? 1),
    orderby: sort.orderby,
    order: sort.order,
  });
  // Unlike the admin API, the Store API takes the category SLUG directly —
  // no id lookup, and no silent empty result when a slug is passed.
  if (opts.categorySlug) params.set("category", opts.categorySlug);
  if (opts.search) params.set("search", opts.search);
  // Price filters are in minor units, so dollars typed by a visitor have to be
  // scaled or the filter silently matches nothing.
  if (opts.minPrice) params.set("min_price", String(Math.round(Number(opts.minPrice) * 100)));
  if (opts.maxPrice) params.set("max_price", String(Math.round(Number(opts.maxPrice) * 100)));
  if (opts.inStockOnly) params.set("stock_status", "instock");
  if (opts.onSaleOnly) params.set("on_sale", "true");

  const res = await storeFetch<StoreProductRaw[]>(`/products?${params}`);
  return {
    products: (res?.data ?? []).map(normalise),
    total: res?.total ?? 0,
    totalPages: res?.totalPages ?? 0,
  };
}

export async function getProductBySlug(slug: string): Promise<WooProduct | null> {
  const res = await storeFetch<StoreProductRaw[]>(`/products?slug=${encodeURIComponent(slug)}`);
  const first = res?.data?.[0];
  return first ? normalise(first) : null;
}

export async function getCategories(): Promise<WooCategory[]> {
  const res = await storeFetch<WooCategory[]>("/products/categories?per_page=100", 3600);
  return (res?.data ?? [])
    .filter((c) => c.count > 0)
    .map((c) => ({ ...c, name: decode(c.name) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// WooCommerce descriptions are HTML. Strip it for summaries rather than
// injecting markup from a system we don't control into this site's DOM.
export function toPlainText(html: string, limit = 180): string {
  const text = decode((html || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
}

export function formatPrice(value: number | null): string {
  if (value === null) return "Price on request";
  return value.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
}
